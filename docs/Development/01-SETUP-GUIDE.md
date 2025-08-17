# 🚀 Development Environment Setup Guide

## Prerequisites

### Required Software
- **Node.js**: Version 18+ (LTS recommended)
- **npm**: Version 9+ (comes with Node.js)
- **Git**: Latest version
- **VS Code**: Recommended IDE with extensions

### System Requirements
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 10GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux Ubuntu 18.04+

## Initial Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ruwad-platform
```

### 2. Install Dependencies
```bash
# Install all project dependencies
npm install

# Verify installation
npm list --depth=0
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env.local

# Configure your environment variables
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Start Development Server
```bash
# Start the development server
npm run dev

# Server will start at http://localhost:5173
```

## Development Environment

### VS Code Extensions
Install these recommended extensions:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### VS Code Settings
Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

## Project Structure Understanding

### Core Directories
```
src/
├── components/          # React components
├── hooks/              # Custom hooks
├── pages/              # Page components
├── utils/              # Utility functions
├── integrations/       # External integrations
├── styles/             # Global styles
└── types/              # TypeScript definitions
```

### Configuration Files
```
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite build configuration
└── package.json        # Project dependencies
```

## Database Setup

### Supabase Connection
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key
3. Update your `.env.local` file
4. Run database migrations if available

### Local Database (Optional)
```bash
# Install Supabase CLI
npm install -g @supabase/cli

# Initialize local development
supabase init

# Start local development
supabase start
```

## Verification Steps

### 1. Build Verification
```bash
# Test production build
npm run build

# Preview production build
npm run preview
```

### 2. Type Checking
```bash
# Run TypeScript compiler
npm run type-check

# Should show no errors
```

### 3. Linting
```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### 4. Testing
```bash
# Run test suite
npm run test

# Run tests in watch mode
npm run test:watch
```

## Common Setup Issues

### Node Version Issues
```bash
# Check Node version
node --version

# Use Node Version Manager (nvm)
nvm install 18
nvm use 18
```

### Port Conflicts
```bash
# If port 5173 is in use, specify different port
npm run dev -- --port 3000
```

### Permission Issues (Linux/macOS)
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

### SSL Certificate Issues
```bash
# For local HTTPS development
npm run dev -- --https
```

## Development Tools

### Browser DevTools
- **Chrome DevTools**: Primary debugging tool
- **React Developer Tools**: Component inspection
- **Redux DevTools**: State management debugging

### Command Line Tools
```bash
# TypeScript compiler
npx tsc --noEmit

# Bundle analyzer
npm run analyze

# Format code
npm run format
```

### Database Tools
- **Supabase Dashboard**: Web-based database management
- **DB Browser**: For local database inspection
- **SQL Editor**: For custom queries

## Performance Optimization

### Development Build
```bash
# Enable development optimizations
export NODE_ENV=development

# Start with performance monitoring
npm run dev:perf
```

### Memory Management
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=8192"
```

## Troubleshooting

### Clear Cache
```bash
# Clear npm cache
npm cache clean --force

# Clear Vite cache
rm -rf node_modules/.vite

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Reset Environment
```bash
# Reset to clean state
git clean -fdx
npm install
npm run dev
```

### Debug Mode
```bash
# Start in debug mode
DEBUG=* npm run dev

# Verbose logging
npm run dev --verbose
```

## Next Steps

After completing setup:

1. **Read Development Workflow**: [`02-DEVELOPMENT-WORKFLOW.md`](./02-DEVELOPMENT-WORKFLOW.md)
2. **Review Project Standards**: [`03-PROJECT-STANDARDS.md`](./03-PROJECT-STANDARDS.md)
3. **Start Component Development**: [`04-COMPONENT-DEVELOPMENT.md`](./04-COMPONENT-DEVELOPMENT.md)
4. **Set Up Testing**: [`07-TESTING-GUIDE.md`](./07-TESTING-GUIDE.md)

## Support

### Documentation
- Internal docs in `/docs/` directory
- Architecture guides for system understanding
- API documentation for backend integration

### Community
- Team Slack channels
- Code review process
- Pair programming sessions

---

**Setup Time**: ~30 minutes  
**Prerequisites**: Node.js, Git, VS Code  
**Support**: Development team available for assistance