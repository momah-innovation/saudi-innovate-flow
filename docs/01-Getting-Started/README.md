# 🚀 Getting Started - Ruwād Innovation Platform

## 📋 **QUICK START CHECKLIST**

### **Prerequisites (5 minutes)**
- [ ] **Node.js 18+** installed
- [ ] **Git** configured  
- [ ] **VS Code** (recommended IDE)
- [ ] **Chrome/Firefox** for development

### **Environment Setup (10 minutes)**
```bash
# 1. Clone the repository
git clone [repository-url]
cd ruwad-platform

# 2. Install dependencies
npm install

# 3. Environment configuration
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Start development server
npm run dev
```

### **Verification (5 minutes)**
- [ ] Application loads at `http://localhost:5173`
- [ ] Login/signup functionality works
- [ ] Dashboard displays without errors
- [ ] TypeScript compilation successful (`npm run type-check`)

---

## 🏗️ **PLATFORM OVERVIEW**

### **What is Ruwād Innovation Platform?**

The Ruwād Innovation Platform is a **comprehensive enterprise innovation management system** designed for government and organizational innovation initiatives. It provides:

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

### **Technology Stack**
```
Frontend:     React 18 + TypeScript + Vite
Styling:      TailwindCSS + shadcn/ui components  
State:        TanStack Query + React Hook Form
Backend:      Supabase (Postgres + Auth + Storage + Realtime)
i18n:         Arabic/English with RTL support
Testing:      Vitest + Testing Library
```

### **Database Structure**
- **80+ Tables** with comprehensive relationships
- **Row Level Security (RLS)** for data isolation
- **Real-time subscriptions** for live updates
- **Audit trails** for compliance and tracking

### **Authentication & Security**
- **JWT-based authentication** with Supabase Auth
- **Role-based access control (RBAC)** with granular permissions
- **Multi-organization support** with data isolation
- **Comprehensive audit logging** for security compliance

---

## 🔧 **DEVELOPMENT ENVIRONMENT**

### **Required Tools**
```bash
# Core requirements
Node.js 18.0+
npm 9.0+
Git 2.30+

# Recommended
VS Code with extensions:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Hero
- i18n Ally
```

### **Project Structure**
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base design system components
│   ├── forms/          # Form components and validation
│   ├── admin/          # Admin-specific components
│   ├── challenges/     # Challenge management components
│   ├── campaigns/      # Campaign coordination components
│   └── workspace/      # Workspace-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── i18n/               # Internationalization
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions
```

---

## 🎯 **FIRST TIME SETUP**

### **1. Environment Configuration**

Create `.env.local` with required variables:
```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: AI Services
VITE_OPENAI_API_KEY=your_openai_key

# Optional: Analytics
VITE_GA_MEASUREMENT_ID=your_ga_id
```

### **2. Database Setup**

The platform uses Supabase with predefined schema:
- **Tables**: Challenges, ideas, users, organizations, etc.
- **Policies**: RLS policies for data security
- **Functions**: Edge functions for business logic

*No manual database setup required - schema is managed via Supabase.*

### **3. Development Commands**

```bash
# Start development server
npm run dev

# Type checking
npm run type-check

# Linting and formatting  
npm run lint
npm run lint:fix

# Testing
npm run test
npm run test:watch

# Build for production
npm run build
npm run preview
```

---

## 🔍 **UNDERSTANDING THE PLATFORM**

### **Navigation Structure**
```
Public Routes:
├── / (Landing page)
├── /about
├── /contact
└── /auth/* (Authentication)

Protected Routes:
├── /dashboard (Role-specific dashboards)
├── /challenges/* (Challenge management)
├── /campaigns/* (Campaign coordination)  
├── /workspace/* (Workspace environments)
├── /admin/* (System administration)
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
npm run type-check

# 2. Feature development
git checkout -b feature/your-feature-name
# Make changes...
npm run lint:fix
npm run test

# 3. Commit and push
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name

# 4. Create PR for review
```

### **Code Quality Gates**
- ✅ TypeScript compilation without errors
- ✅ ESLint rules passed
- ✅ All tests passing
- ✅ Component documentation updated
- ✅ i18n translations added (Arabic/English)

---

## 🎯 **SUCCESS MILESTONES**

### **Day 1 Goals**
- [ ] Successfully run application locally
- [ ] Login with test credentials
- [ ] Navigate through main sections
- [ ] Understand basic architecture
- [ ] Review core documentation

### **Week 1 Goals**
- [ ] Complete minor feature or bug fix
- [ ] Understand database relationships
- [ ] Review business logic in key components
- [ ] Set up debugging workflow
- [ ] Familiarize with testing patterns

### **Month 1 Goals**
- [ ] Implement new feature independently
- [ ] Understand all major business flows
- [ ] Contribute to documentation improvements
- [ ] Optimize performance in assigned area
- [ ] Mentor new team members

---

## 🆘 **GETTING HELP**

### **Common Issues & Solutions**

#### **Environment Issues**
```bash
# Node version issues
nvm use 18
nvm install 18.17.0

# Port conflicts
npm run dev -- --port 3000

# Permission errors
sudo npm install -g npm@latest
```

#### **Build Issues**
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# TypeScript issues
npm run type-check
# Fix reported errors before proceeding
```

### **Documentation References**
- **Platform Architecture**: `docs/02-Platform-Architecture/`
- **Business Features**: `docs/04-Business-Features/`
- **Development Guides**: `docs/03-Development-Guides/`
- **Troubleshooting**: `docs/07-Operations-Maintenance/Troubleshooting.md`

---

## 📞 **NEXT STEPS**

1. **Complete Environment Setup** - Follow the setup checklist above
2. **Review Platform Architecture** - Understand the system design
3. **Explore Business Features** - Learn the core functionality
4. **Join Development Workflow** - Start contributing to the codebase

**Ready to dive deeper?** Continue to [Development Setup Guide](./Development-Setup.md) for detailed configuration.

---

*This guide covers the essentials for getting started. For comprehensive documentation, see the main documentation index.*