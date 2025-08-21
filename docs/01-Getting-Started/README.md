# 🚀 Getting Started - Ruwād Innovation Platform

## 📋 **QUICK START CHECKLIST**

### **Prerequisites (5 minutes)**
- [ ] **Node.js 18+** (development tools only - not runtime)
- [ ] **Git** configured  
- [ ] **VS Code** (recommended IDE)
- [ ] **Modern Browser** (Chrome/Firefox/Safari)
- [ ] **Supabase Account** (for backend services)

### **Environment Setup (10 minutes)**
```bash
# 1. Clone the repository
git clone [repository-url]
cd ruwad-innovation-platform

# 2. Install dependencies (uses Node.js for tooling)
npm install

# 3. Environment configuration
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Start development server (Vite dev server)
npm run dev
```

### **Verification (5 minutes)**
- [ ] Application loads at `http://localhost:5173`
- [ ] Login/signup functionality works  
- [ ] Dashboard displays without errors
- [ ] No TypeScript compilation errors (check during `npm run dev`)

---

## 🏗️ **PLATFORM OVERVIEW**

### **What is Ruwād Innovation Platform?**

The Ruwād Innovation Platform is a **modern Single Page Application (SPA)** designed for government and organizational innovation initiatives. It provides:

#### **🎯 Core Capabilities**
- **Innovation Challenge Management** - End-to-end challenge lifecycle
- **Strategic Campaign Coordination** - Multi-stakeholder innovation campaigns  
- **AI-Powered Innovation Suite** - Intelligent content generation and analysis
- **Multi-Workspace Architecture** - Role-specific work environments
- **Expert Network Management** - Expert assignment and evaluation workflows

#### **👥 User Roles**
- **Administrators** - System management and configuration
- **Innovators** - Submit ideas and participate in challenges
- **Experts** - Evaluate submissions and provide expertise
- **Partners** - Collaborate on strategic initiatives
- **Campaign Managers** - Coordinate innovation campaigns
- **Analytics Users** - Access insights and reporting

---

## 🏛️ **SYSTEM ARCHITECTURE**

### **Application Type**
**Single Page Application (SPA)** - Runs entirely in the browser

### **Technology Stack**
```
Client-Side:  React 18 + TypeScript + Vite
Styling:      TailwindCSS + shadcn/ui components  
State:        TanStack Query + React Hook Form
Backend:      Supabase (external service - no backend code here)
  ├── Database: PostgreSQL with RLS
  ├── Auth: Supabase Authentication 
  ├── Storage: Supabase Storage
  ├── Functions: Supabase Edge Functions (Deno runtime)
  └── Realtime: Live subscriptions
i18n:         Arabic/English with RTL support
Testing:      Vitest + Testing Library (requires setup)
Deployment:   Static hosting (Vercel, Netlify, CDN)
```

### **Database Structure**
- **150+ Tables** with comprehensive relationships (validated count)
- **Row Level Security (RLS)** for data isolation
- **Real-time subscriptions** for live updates
- **Audit trails** for compliance and tracking
- **Edge Functions** for business logic (35+ functions)

### **Authentication & Security**
- **JWT-based authentication** with Supabase Auth
- **Role-based access control (RBAC)** with granular permissions
- **Multi-organization support** with data isolation
- **Comprehensive audit logging** for security compliance

---

## 🔧 **DEVELOPMENT ENVIRONMENT**

### **Development Tools (Node.js Required)**
```bash
# Node.js is used for development tooling only:
Node.js 18.0+     # For npm, Vite, ESLint, etc.
npm 9.0+          # Package manager
Git 2.30+         # Version control

# Recommended IDE Setup:
VS Code with extensions:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Hero
- i18n Ally
```

### **Project Structure**
```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui base components
│   ├── auth/           # Authentication UI
│   ├── challenges/     # Challenge management UI
│   ├── campaigns/      # Campaign coordination UI
│   └── workspace/      # Workspace-specific UI
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── i18n/               # Internationalization
├── integrations/       # External APIs (Supabase, Unsplash)
└── types/              # TypeScript definitions
```

---

## 🎯 **FIRST TIME SETUP**

### **1. Environment Configuration**

Create `.env.local` with required variables:
```bash
# Supabase Configuration (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: AI Services
VITE_OPENAI_API_KEY=your_openai_key

# Optional: Analytics
VITE_GA_MEASUREMENT_ID=your_ga_id
```

### **2. Backend Setup (Supabase)**

The application uses Supabase as an external backend service:
- **Database**: 150+ tables with RLS policies
- **Authentication**: JWT-based user management
- **Storage**: File upload and management
- **Edge Functions**: Business logic (Deno runtime)

*No backend code exists in this repository - all server functionality is handled by Supabase.*

### **3. Available Development Commands**

```bash
# Currently Available Scripts:
npm run dev              # Start Vite development server
npm run build            # Production build (static files)
npm run build:dev        # Development build
npm run lint             # ESLint checking
npm run preview          # Preview production build

# ⚠️ Missing Scripts (need to be added to package.json):
npm run type-check       # TypeScript compilation check
npm run lint:fix         # Auto-fix linting issues
npm run test             # Run unit tests
npm run test:watch       # Watch mode testing
npm run format           # Prettier formatting
npm run clean            # Clean build artifacts
```

---

## 🔍 **UNDERSTANDING THE PLATFORM**

### **Navigation Structure**
```
Public Routes (no auth required):
├── / (Landing page)
├── /about
├── /campaigns
├── /challenges
├── /events
└── /auth/* (Authentication)

Protected Routes (authentication required):
├── /dashboard (Role-specific dashboards)
├── /workspace/* (6 different workspace types)
├── /challenges/:id (Challenge details)
├── /admin/* (Administration - role restricted)
└── /profile/* (User management)
```

### **Key Features to Explore**

#### **🎯 Challenge Management**
- **Location**: `/challenges`
- **Purpose**: Create, manage, and evaluate innovation challenges
- **Users**: Administrators, Innovators, Experts

#### **📊 Campaign Coordination** 
- **Location**: `/campaigns`
- **Purpose**: Strategic innovation campaign management
- **Users**: Campaign Managers, Partners, Administrators

#### **🤖 AI-Powered Features**
- **Location**: Integrated throughout platform
- **Purpose**: Intelligent content generation and analysis
- **Users**: All authenticated users

#### **🏢 Multi-Workspace System**
- **Location**: `/workspace`
- **Purpose**: Role-specific work environments
- **Users**: Role-based access (6 workspace types)

---

## 📝 **DEVELOPMENT WORKFLOW**

### **Daily Development Process**
```bash
# 1. Start your day
git pull origin main
npm run dev

# 2. Feature development
git checkout -b feature/your-feature-name
# Make changes...
npm run lint

# 3. Commit and push
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```

### **Code Quality Gates**
- ✅ TypeScript compilation without errors (checked during `npm run dev`)
- ✅ ESLint rules passed (`npm run lint`)
- ⚠️ **Testing setup needed** - Vitest configuration required
- ⚠️ **Prettier setup needed** - Code formatting configuration required
- ✅ i18n translations added (Arabic/English)

---

## 🚀 **DEPLOYMENT**

### **Build Process**
```bash
# Create production build (static files)
npm run build
# Output: dist/ directory with HTML, CSS, JS files

# Preview locally
npm run preview
```

### **Deployment Options**
- **Vercel** (recommended for React SPAs)
- **Netlify** (static hosting)
- **AWS S3 + CloudFront** (CDN)
- **Any static hosting service**

*No server deployment needed - this is a client-side application.*

---

## 🎯 **SUCCESS MILESTONES**

### **Day 1 Goals**
- [ ] Successfully run application locally
- [ ] Understand SPA + Supabase architecture
- [ ] Login with test credentials
- [ ] Navigate through main sections
- [ ] Review core documentation

### **Week 1 Goals**
- [ ] Complete minor feature or bug fix
- [ ] Understand database relationships via Supabase
- [ ] Review business logic in React components
- [ ] Set up debugging workflow with browser DevTools
- [ ] Familiarize with testing patterns (once configured)

### **Month 1 Goals**
- [ ] Implement new feature independently
- [ ] Understand all major business flows
- [ ] Contribute to documentation improvements
- [ ] Optimize performance in assigned area
- [ ] Mentor new team members

---

## 🆘 **GETTING HELP**

### **Common Issues & Solutions**

#### **Node Version Issues**
```bash
# Use Node Version Manager (nvm)
nvm install 18.17.0
nvm use 18.17.0
nvm alias default 18.17.0
```

#### **Port Conflicts**
```bash
# Vite dev server port conflict
npm run dev -- --port 3000
```

#### **Build Issues**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### **Documentation References**
- **Platform Architecture**: `docs/02-Platform-Architecture/`
- **Business Features**: `docs/04-Business-Features/`
- **Development Guides**: `docs/03-Development-Guides/`
- **Supabase Dashboard**: Access your project's Supabase dashboard for backend management

---

## 📞 **NEXT STEPS**

1. **Complete Environment Setup** - Follow the setup checklist above
2. **Review Platform Architecture** - Understand the SPA + Supabase design
3. **Explore Business Features** - Learn the core functionality
4. **Add Missing Development Tools** - Configure TypeScript checking, testing, and formatting
5. **Join Development Workflow** - Start contributing to the codebase

**Ready to dive deeper?** Continue to [Development Setup Guide](./Development-Setup.md) for detailed configuration.

---

*This guide covers the essentials for getting started with this React SPA. For comprehensive documentation, see the main documentation index.*