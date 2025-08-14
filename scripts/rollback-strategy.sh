#!/bin/bash

# Saudi Innovate Rollback Strategy Script
# Provides safe rollback capabilities for deployment issues

echo "🔄 Saudi Innovate Rollback Strategy"
echo "===================================="

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
BACKUP_DIR="./backups"
ROLLBACK_TAG=""
ROLLBACK_TYPE=""

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

print_info() {
    echo -e "${BLUE}ℹ️  INFO${NC} - $1"
}

print_success() {
    echo -e "${GREEN}✅ SUCCESS${NC} - $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️  WARNING${NC} - $1"
}

print_error() {
    echo -e "${RED}❌ ERROR${NC} - $1"
}

show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --backup                 Create a backup of current state"
    echo "  --rollback-git TAG       Rollback to specific git tag"
    echo "  --rollback-db            Rollback database changes"
    echo "  --rollback-full          Full system rollback"
    echo "  --list-backups           List available backups"
    echo "  --help                   Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --backup"
    echo "  $0 --rollback-git v1.0.0"
    echo "  $0 --rollback-full"
}

create_backup() {
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_name="backup_${timestamp}"
    local backup_path="${BACKUP_DIR}/${backup_name}"
    
    print_info "Creating backup: $backup_name"
    
    # Create backup directory
    mkdir -p "$backup_path"
    
    # Backup source code (excluding node_modules)
    print_info "Backing up source code..."
    rsync -av --exclude='node_modules' --exclude='.git' --exclude='dist' --exclude='backups' . "$backup_path/source/"
    
    # Backup current git state
    print_info "Backing up git state..."
    git rev-parse HEAD > "$backup_path/git_commit.txt"
    git branch --show-current > "$backup_path/git_branch.txt"
    git status --porcelain > "$backup_path/git_status.txt"
    
    # Backup package-lock.json for dependency state
    if [ -f "package-lock.json" ]; then
        cp package-lock.json "$backup_path/"
    fi
    
    # Create backup manifest
    cat > "$backup_path/backup_manifest.json" << EOF
{
  "backup_name": "$backup_name",
  "timestamp": "$timestamp",
  "git_commit": "$(git rev-parse HEAD)",
  "git_branch": "$(git branch --show-current)",
  "node_version": "$(node --version)",
  "npm_version": "$(npm --version)",
  "backup_type": "full"
}
EOF
    
    print_success "Backup created: $backup_path"
    return 0
}

list_backups() {
    print_info "Available backups:"
    echo ""
    
    if [ ! -d "$BACKUP_DIR" ] || [ -z "$(ls -A $BACKUP_DIR)" ]; then
        print_warning "No backups found"
        return 1
    fi
    
    for backup in "$BACKUP_DIR"/backup_*; do
        if [ -d "$backup" ] && [ -f "$backup/backup_manifest.json" ]; then
            local backup_name=$(basename "$backup")
            local timestamp=$(jq -r '.timestamp' "$backup/backup_manifest.json" 2>/dev/null || echo "unknown")
            local git_commit=$(jq -r '.git_commit' "$backup/backup_manifest.json" 2>/dev/null || echo "unknown")
            
            echo "📦 $backup_name"
            echo "   📅 Timestamp: $timestamp"
            echo "   🔖 Git commit: ${git_commit:0:8}"
            echo ""
        fi
    done
}

rollback_git() {
    local tag="$1"
    
    if [ -z "$tag" ]; then
        print_error "Git tag is required for rollback"
        return 1
    fi
    
    print_info "Rolling back to git tag: $tag"
    
    # Verify tag exists
    if ! git tag -l | grep -q "^$tag$"; then
        print_error "Git tag '$tag' not found"
        print_info "Available tags:"
        git tag -l
        return 1
    fi
    
    # Create emergency backup before rollback
    print_info "Creating emergency backup before rollback..."
    create_backup
    
    # Stash current changes if any
    if ! git diff --quiet || ! git diff --cached --quiet; then
        print_info "Stashing current changes..."
        git stash push -m "Emergency stash before rollback to $tag"
    fi
    
    # Checkout the tag
    print_info "Checking out tag: $tag"
    if git checkout "$tag"; then
        print_success "Successfully rolled back to tag: $tag"
        
        # Reinstall dependencies
        print_info "Reinstalling dependencies..."
        npm ci
        
        # Rebuild application
        print_info "Rebuilding application..."
        npm run build
        
        print_success "Rollback completed successfully"
        return 0
    else
        print_error "Failed to checkout tag: $tag"
        return 1
    fi
}

rollback_full() {
    local backup_name="$1"
    
    if [ -z "$backup_name" ]; then
        # Find most recent backup
        backup_name=$(ls -t "$BACKUP_DIR"/backup_* | head -1 | xargs basename)
        if [ -z "$backup_name" ]; then
            print_error "No backups available for rollback"
            return 1
        fi
        print_info "Using most recent backup: $backup_name"
    fi
    
    local backup_path="${BACKUP_DIR}/${backup_name}"
    
    if [ ! -d "$backup_path" ]; then
        print_error "Backup not found: $backup_path"
        return 1
    fi
    
    print_warning "This will completely restore the system to backup: $backup_name"
    read -p "Are you sure? (y/N): " confirm
    
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        print_info "Rollback cancelled"
        return 0
    fi
    
    print_info "Starting full system rollback..."
    
    # Create emergency backup of current state
    create_backup
    
    # Restore source code
    print_info "Restoring source code..."
    rsync -av --delete --exclude='node_modules' --exclude='.git' --exclude='backups' "$backup_path/source/" ./
    
    # Restore git state if available
    if [ -f "$backup_path/git_commit.txt" ]; then
        local git_commit=$(cat "$backup_path/git_commit.txt")
        print_info "Restoring git state to commit: ${git_commit:0:8}"
        git checkout "$git_commit"
    fi
    
    # Restore dependencies
    print_info "Restoring dependencies..."
    npm ci
    
    # Rebuild application
    print_info "Rebuilding application..."
    npm run build
    
    print_success "Full rollback completed successfully"
    return 0
}

# Parse command line arguments
case "$1" in
    --backup)
        create_backup
        ;;
    --rollback-git)
        if [ -z "$2" ]; then
            print_error "Git tag is required"
            show_help
            exit 1
        fi
        rollback_git "$2"
        ;;
    --rollback-full)
        rollback_full "$2"
        ;;
    --list-backups)
        list_backups
        ;;
    --help)
        show_help
        ;;
    *)
        print_error "Invalid option: $1"
        show_help
        exit 1
        ;;
esac