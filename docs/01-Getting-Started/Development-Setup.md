# 🔧 Development Setup - Complete Guide

## 📋 **PREREQUISITES CHECKLIST**

### **System Requirements**
- **Operating System**: Windows 10+, macOS 10.15+, or Ubuntu 18.04+
- **RAM**: Minimum 8GB, Recommended 16GB+
- **Storage**: 5GB free space (includes dependencies and dev tools)
- **Internet**: Stable connection for package downloads and Supabase

### **Required Software**
```bash
# Development Tools (NOT runtime requirements)
Node.js 18.17.0+         # For npm, Vite, build tools ONLY
npm 9.0.0+               # Package manager
Git 2.30.0+              # Version control
VS Code (Latest)         # Recommended IDE
Modern Browser           # Chrome, Firefox, Safari for testing

# Verification Commands
node --version           # Should show v18.17.0+
npm --version           # Should show 9.0.0+
git --version           # Should show 2.30.0+
```

### **Important: Node.js Role Clarification**
**⚠️ CRITICAL**: Node.js is **NOT** a runtime requirement for this application!
- 📱 **Production**: Runs entirely in the browser (SPA)
- 🔧 **Development**: Node.js used only for build tools (Vite, ESLint, npm)
- 🌐 **Deployment**: Static files served from CDN (no server needed)

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
# Install development dependencies (Node.js tooling)
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
VITE_SUPABASE_URL=https://your-project.supabase.co
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
# Start Vite development server (NOT a Node.js server!)
npm run dev

# Expected output:
# ➜  Local:   http://localhost:5173/
# ➜  Network: http://192.168.x.x:5173/
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

---

## 🔧 **DEVELOPMENT TOOLS SETUP**

### **Current Available Scripts**
```bash
# Available in package.json
npm run dev              # Start Vite development server
npm run build            # Production build (static files)
npm run build:dev        # Development build
npm run lint             # ESLint checking
npm run preview          # Preview production build
```

### **⚠️ Missing Scripts (Need Implementation)**
```bash
# These scripts are documented but don't exist - need to be added:
npm run type-check       # TypeScript compilation check
npm run lint:fix         # Auto-fix linting issues
npm run format           # Prettier formatting
npm run test             # Run unit tests
npm run test:watch       # Watch mode testing
npm run test:coverage    # Coverage report
npm run analyze          # Bundle analysis
npm run clean            # Clean build artifacts
```

### **Required Setup Tasks**
```bash
# 1. Add missing devDependencies
npm install -D typescript prettier @types/node

# 2. Create missing config files
# - prettier.config.js
# - vitest.config.ts 
# - .eslintrc enhancement

# 3. Add missing package.json scripts
# (See validation report for full list)
```

---

## 🗄️ **BACKEND SETUP (SUPABASE)**

### **Important: No Backend Code in This Repository**
**This is a frontend-only React SPA** - all backend functionality is provided by Supabase:

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
The platform uses predefined Supabase setup:
- **150+ Tables**: Comprehensive business logic
- **RLS Policies**: Row Level Security for data isolation
- **Edge Functions**: 35+ serverless functions (Deno runtime)
- **Storage Buckets**: File upload and management

*Schema is managed via Supabase console - no local database setup needed.*

### **Local Development Database (Optional)**
```bash
# Install Supabase CLI for local development
npm install -g supabase

# Initialize local development
supabase init
supabase start

# This creates local Postgres instance:
# - Database: postgresql://localhost:54322/postgres
# - Studio: http://localhost:54323
# - Edge Functions: http://localhost:54321
```

---

## 🔍 **VERIFICATION & TESTING**

### **Development Environment Health Check**
```bash
# 1. Build verification (creates static files)
npm run build
# Expected: Successful build output in dist/

# 2. Linting validation
npm run lint
# Expected: No ESLint errors

# 3. Start application
npm run dev
# Expected: App loads at http://localhost:5173

# 4. Missing validations (need setup):
# npm run type-check    # TypeScript compilation
# npm run test          # Unit tests
```

### **Application Testing Checklist**
- [ ] **Landing Page**: Loads without errors
- [ ] **Authentication**: Login/signup functionality works
- [ ] **Dashboard**: Role-specific dashboards display correctly
- [ ] **Navigation**: Sidebar and routing work properly
- [ ] **Language Switching**: Arabic/English toggle functions
- [ ] **Dark/Light Mode**: Theme switching works
- [ ] **Responsive Design**: Mobile layout displays correctly

### **Supabase Connection Test**
```typescript
// Test in browser console (after app loads)
await window.supabase.auth.getSession();
// Expected: Valid session object or null

await window.supabase.from('profiles').select('*').limit(1);
// Expected: Data array or empty array (no errors)
```

---

## 🚨 **TROUBLESHOOTING**

### **Common Setup Issues**

#### **Architecture Misunderstanding**
```bash
# Problem: Looking for Node.js server files
# Reality: This is a React SPA, not a Node.js server app
# - No server.js, app.js, or Express files
# - Runs entirely in browser
# - Supabase handles all backend functionality
```

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

#### **Missing Scripts Error**
```bash
# Problem: npm run type-check not found
# Cause: Script doesn't exist in package.json
# Solution: Add missing scripts or use alternatives

# Current alternative:
# Instead of: npm run type-check
# Use: npx tsc --noEmit
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

---

## ⚡ **BUILD & DEPLOYMENT**

### **Production Build Process**
```bash
# Create static build (no server needed)
npm run build
# Output: dist/ folder with HTML, CSS, JS files

# Preview build locally
npm run preview
# Serves dist/ folder on localhost

# Deploy to static hosting
# - Vercel: Connect GitHub repo
# - Netlify: Drag & drop dist/ folder  
# - AWS S3: Upload dist/ contents
# - Any CDN or static host
```

### **Bundle Analysis**
```bash
# Currently missing - needs setup:
npm run analyze

# Manual alternative:
npx vite-bundle-analyzer dist
```

### **Performance Optimization**
```bash
# Development mode optimizations
export VITE_OPTIMIZE_DEPS=true

# Memory management for large projects
export NODE_OPTIONS="--max_old_space_size=4096"
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
# Opens browser to http://localhost:5173

# 4. Check for issues (limited by missing scripts)
npm run lint
```

### **Feature Development**
```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Develop with hot reload
# Vite provides instant updates in browser

# 3. Verify quality before commit
npm run lint
npm run build  # Verify builds successfully

# 4. Commit changes
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```

---

## 📞 **GETTING HELP**

### **Documentation Resources**
- **Platform Architecture**: `docs/02-Platform-Architecture/`
- **API Integration**: Supabase dashboard and docs
- **UI Components**: shadcn/ui documentation
- **Troubleshooting**: `docs/07-Operations-Maintenance/Troubleshooting.md`

### **Development Support**
- **Build Issues**: Check Vite logs and browser console
- **Database Issues**: Check Supabase dashboard logs  
- **Styling Issues**: Use browser DevTools
- **Performance Issues**: Use React DevTools and Lighthouse

### **Key Understanding**
**Remember**: This is a **client-side React application** that communicates with **Supabase APIs**. There is no Node.js server code in this repository - Node.js is only used for development tooling.

---

This comprehensive setup guide ensures proper understanding of the SPA + Supabase architecture and provides a clear path for environment configuration within 30-60 minutes for experienced developers.

*Next Step: After completing setup, proceed to [Project Structure Guide](./Project-Structure.md) for understanding the codebase organization.*