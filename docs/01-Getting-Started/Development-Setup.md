# 🔧 Development Setup - Complete Guide

## 📋 **PREREQUISITES CHECKLIST**

### **System Requirements**
- **Operating System**: Windows 10+, macOS 10.15+, or Ubuntu 18.04+
- **RAM**: Minimum 8GB, Recommended 16GB+
- **Storage**: 20GB free space (includes dependencies and dev tools)
- **Internet**: Stable connection for package downloads and Supabase

### **Required Software**
```bash
# Core Development Tools
Node.js 18.17.0+         # JavaScript runtime
npm 9.0.0+               # Package manager
Git 2.30.0+              # Version control
VS Code (Latest)         # Recommended IDE

# Verification Commands
node --version           # Should show v18.17.0+
npm --version           # Should show 9.0.0+
git --version           # Should show 2.30.0+
```

---

## 🚀 **INITIAL SETUP PROCESS**

### **Step 1: Repository Setup**
```bash
# Clone the repository
git clone [repository-url]
cd ruwad-innovation-platform

# Verify repository structure
ls -la
# Expected: src/, docs/, package.json, README.md, etc.
```

### **Step 2: Dependencies Installation**
```bash
# Install all project dependencies
npm install

# Verify installation
npm list --depth=0

# Expected output should show all major dependencies:
# ├── react@18.3.1
# ├── @supabase/supabase-js@2.52.1
# ├── @tanstack/react-query@5.56.2
# └── ... (other dependencies)
```

### **Step 3: Environment Configuration**
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your configuration
code .env.local
```

#### **Required Environment Variables**
```bash
# Supabase Configuration (Required)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: AI Services
VITE_OPENAI_API_KEY=your_openai_api_key

# Optional: Analytics
VITE_GA_MEASUREMENT_ID=your_google_analytics_id

# Development (Optional)
VITE_LOG_LEVEL=debug
VITE_ENABLE_DEVTOOLS=true
```

### **Step 4: Development Server**
```bash
# Start development server
npm run dev

# Expected output:
# Local:   http://localhost:5173/
# Network: http://192.168.x.x:5173/
```

---

## 🛠️ **IDE CONFIGURATION**

### **VS Code Extensions (Required)**
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",           // Tailwind CSS IntelliSense
    "ms-vscode.vscode-typescript-next",    // TypeScript support
    "esbenp.prettier-vscode",              // Code formatting
    "ms-vscode.eslint",                    // Linting
    "lokalise.i18n-ally",                 // Translation management
    "formulahendry.auto-rename-tag",       // HTML tag management
    "christian-kohler.path-intellisense",  // Path autocompletion
    "ms-vscode.vscode-json"                // JSON support
  ]
}
```

### **VS Code Settings**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### **Workspace Configuration**
```json
// .vscode/settings.json
{
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.next": true
  },
  "files.exclude": {
    "**/.DS_Store": true,
    "**/Thumbs.db": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## 🔧 **DEVELOPMENT TOOLS SETUP**

### **Package Scripts**
```bash
# Available scripts (Current)
npm run dev              # Start development server
npm run build            # Production build
npm run build:dev        # Development build
npm run lint             # ESLint checking
npm run preview          # Preview production build

# Missing scripts that should be added:
npm run type-check       # TypeScript compilation check (MISSING)
npm run lint:fix         # Auto-fix linting issues (MISSING)
npm run format           # Prettier formatting (MISSING)
npm run test             # Run unit tests (MISSING)
npm run test:watch       # Watch mode testing (MISSING)
npm run test:coverage    # Coverage report (MISSING)
npm run analyze          # Bundle analysis (MISSING)
npm run clean            # Clean build artifacts (MISSING)
```

### **Git Hooks Setup**
```bash
# Install husky for git hooks (if not already configured)
npm install husky --save-dev
npx husky install

# Pre-commit hook (runs linting and type checking)
npx husky add .husky/pre-commit "npm run lint && npm run type-check"

# Pre-push hook (runs tests)
npx husky add .husky/pre-push "npm run test"
```

---

## 🗄️ **DATABASE SETUP**

### **Supabase Configuration**
1. **Create Supabase Account**: Visit [supabase.com](https://supabase.com)
2. **Create New Project**: Choose region closest to your users
3. **Get Credentials**: Find in Project Settings > API

```bash
# Project URL format
https://[project-ref].supabase.co

# Anon Key format (safe for client-side)
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Database Schema**
The platform uses predefined Supabase migrations:
- **Tables**: 80+ tables with relationships
- **RLS Policies**: Row Level Security for data isolation
- **Edge Functions**: 35+ serverless functions
- **Storage Buckets**: File upload and management

*No manual database setup required - schema is managed via Supabase console.*

### **Local Development Database (Optional)**
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize local development
supabase init
supabase start

# This creates local Postgres instance with:
# - Database: postgresql://localhost:54322/postgres
# - Studio: http://localhost:54323
# - Edge Functions: http://localhost:54321
```

---

## 🔍 **VERIFICATION & TESTING**

### **Development Environment Health Check**
```bash
# 1. TypeScript compilation
npm run type-check
# Expected: No TypeScript errors

# 2. Linting validation
npm run lint
# Expected: No ESLint errors

# 3. Build verification
npm run build
# Expected: Successful build output in dist/

# 4. Test execution
npm run test
# Expected: All tests passing

# 5. Start application
npm run dev
# Expected: App loads at http://localhost:5173
```

### **Application Testing Checklist**
- [ ] **Landing Page**: Loads without errors
- [ ] **Authentication**: Login/signup functionality works
- [ ] **Dashboard**: Role-specific dashboards display correctly
- [ ] **Navigation**: Sidebar and routing work properly
- [ ] **Language Switching**: Arabic/English toggle functions
- [ ] **Dark/Light Mode**: Theme switching works
- [ ] **Responsive Design**: Mobile layout displays correctly

### **Database Connection Test**
```typescript
// Test in browser console
await window.supabase.auth.getSession();
// Expected: Valid session object or null

await window.supabase.from('profiles').select('*').limit(1);
// Expected: Data array or empty array (no errors)
```

---

## 🚨 **TROUBLESHOOTING**

### **Common Setup Issues**

#### **Node Version Issues**
```bash
# Problem: Wrong Node.js version
# Solution: Use Node Version Manager (nvm)

# Install nvm (macOS/Linux)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install nvm (Windows)
# Download from: https://github.com/coreybutler/nvm-windows

# Use correct Node version
nvm install 18.17.0
nvm use 18.17.0
nvm alias default 18.17.0
```

#### **Port Conflicts**
```bash
# Problem: Port 5173 already in use
# Solution: Use different port
npm run dev -- --port 3000

# Or find and kill process using port
lsof -ti:5173 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5173   # Windows
```

#### **Permission Errors**
```bash
# Problem: npm permission errors
# Solution: Fix npm permissions (avoid sudo)

# Create global directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'

# Add to PATH in ~/.bashrc or ~/.zshrc
export PATH=~/.npm-global/bin:$PATH

# Reload shell
source ~/.bashrc  # or source ~/.zshrc
```

#### **Supabase Connection Issues**
```bash
# Problem: Cannot connect to Supabase
# Check: Environment variables are correct
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Check: Network connectivity
curl -I https://your-project.supabase.co/rest/v1/

# Check: API key permissions in Supabase dashboard
```

#### **Build Failures**
```bash
# Problem: TypeScript compilation errors
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run type-check

# Problem: Memory issues during build
# Solution: Increase Node memory
export NODE_OPTIONS="--max_old_space_size=4096"
npm run build
```

---

## ⚡ **PERFORMANCE OPTIMIZATION**

### **Development Speed**
```bash
# Enable faster rebuilds
export VITE_OPTIMIZE_DEPS=true

# Use faster TypeScript checking
npm install --save-dev @typescript-eslint/parser@latest

# Enable SWC for faster compilation (optional)
npm install --save-dev @vitejs/plugin-react-swc
```

### **Bundle Analysis**
```bash
# Analyze bundle size
npm run build
npm run analyze

# Expected output: Interactive bundle analyzer
# Look for: Large dependencies, duplicate code, unused imports
```

### **Memory Management**
```bash
# Monitor memory usage
node --max-old-space-size=8192 node_modules/.bin/vite dev

# Clear caches regularly
npm run clean
rm -rf node_modules/.vite
```

---

## 🔄 **DAILY DEVELOPMENT WORKFLOW**

### **Morning Routine**
```bash
# 1. Pull latest changes
git pull origin main

# 2. Install any new dependencies  
npm install

# 3. Start development environment
npm run dev

# 4. Check for issues
npm run type-check
npm run lint
```

### **Feature Development**
```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Make changes and test frequently
npm run test:watch  # In separate terminal

# 3. Verify quality before commit
npm run lint:fix
npm run type-check
npm run test

# 4. Commit changes
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```

### **End of Day**
```bash
# Save current work
git add .
git commit -m "wip: work in progress on feature X"

# Push to backup branch
git push origin feature/your-feature-name

# Clean up (optional)
npm run clean
```

---

## 📞 **GETTING HELP**

### **Documentation Resources**
- **Platform Architecture**: `docs/02-Platform-Architecture/`
- **Business Features**: `docs/04-Business-Features/`
- **API Documentation**: `docs/02-Platform-Architecture/API-Documentation.md`
- **Troubleshooting**: `docs/07-Operations-Maintenance/Troubleshooting.md`

### **Development Support**
- **Code Issues**: Check existing GitHub issues
- **Build Problems**: Review build logs and error messages
- **Database Issues**: Check Supabase dashboard logs
- **Performance Issues**: Use browser DevTools and profiling

### **Emergency Contacts**
- **Technical Lead**: [Contact Information]
- **DevOps Team**: [Contact Information]
- **Platform Owner**: [Contact Information]

---

This comprehensive setup guide ensures a smooth development environment configuration. Following these steps should result in a fully functional development setup within 30-60 minutes for experienced developers, or 1-2 hours for new team members.

*Next Step: After completing setup, proceed to [Development Workflow](../03-Development-Guides/Development-Workflow.md) for daily development processes.*