# 📁 Project Structure Guide

## 🏗️ **OVERVIEW**
Understanding the Ruwād Innovation Platform codebase architecture and organization patterns for a **React Single Page Application (SPA)**.

## 📂 **ROOT DIRECTORY STRUCTURE**

```
ruwad-innovation-platform/
├── 📁 docs/                     # Documentation hub
├── 📁 public/                   # Static assets (served directly)
├── 📁 src/                      # React application source code
├── 📁 supabase/                 # Database migrations (external backend)
├── 📄 package.json              # Dependencies and scripts
├── 📄 vite.config.ts            # Vite build configuration
├── 📄 tailwind.config.ts        # Styling configuration
├── 📄 tsconfig.json             # TypeScript configuration
└── 📄 .env.example              # Environment variables template
```

## 🎯 **SOURCE CODE ORGANIZATION**

### **Core Application Structure**
```
src/
├── 📁 components/              # React UI components
│   ├── 📁 auth/               # Authentication components
│   ├── 📁 challenges/         # Challenge management UI
│   ├── 📁 campaigns/          # Campaign coordination UI
│   ├── 📁 dashboard/          # Dashboard components
│   ├── 📁 events/             # Event management UI
│   ├── 📁 layout/             # Layout components
│   ├── 📁 admin/              # Admin interface components
│   └── 📁 ui/                 # Base UI components (shadcn/ui)
│
├── 📁 pages/                   # Route components (SPA pages)
│   ├── 📁 auth/               # Authentication pages
│   ├── 📁 dashboard/          # Dashboard pages
│   ├── 📁 workspace/          # Workspace pages
│   └── 📁 public/             # Public pages
│
├── 📁 hooks/                   # Custom React hooks
│   ├── 📁 auth/               # Authentication hooks
│   ├── 📁 challenges/         # Challenge-specific hooks
│   └── 📁 workspace/          # Workspace management hooks
│
├── 📁 lib/                     # Utility libraries
│   ├── 📁 auth/               # Authentication utilities
│   ├── 📁 utils/              # General utilities
│   └── 📁 query/              # React Query configurations
│
├── 📁 integrations/            # External service integrations
│   ├── 📁 supabase/           # Supabase client & types
│   └── 📁 unsplash/           # Unsplash API integration
│
├── 📁 i18n/                    # Internationalization
│   ├── 📁 locales/            # Translation files
│   └── 📄 enhanced-config-v3.ts # i18n configuration
│
├── 📁 routing/                 # SPA routing configuration  
│   ├── 📄 routes.ts           # Route definitions
│   └── 📄 UnifiedRouter.tsx   # Router implementation
│
├── 📁 contexts/               # React Context providers
│   ├── 📄 AuthContext.tsx     # Authentication state
│   └── 📄 WorkspaceContext.tsx # Workspace state
│
├── 📁 types/                  # TypeScript type definitions
├── 📁 utils/                  # Utility functions
└── 📄 App.tsx                 # Root application component
```

## 🔧 **KEY ARCHITECTURAL PATTERNS**

### **Single Page Application (SPA) Design**
- **Client-Side Routing**: React Router for navigation
- **State Management**: TanStack Query + React Context
- **Component-Based**: Modular React components
- **Static Build**: Compiles to HTML/CSS/JS for CDN hosting

### **Component Organization**
- **Atomic Design**: Components organized by complexity (atoms → molecules → organisms)
- **Feature-Based**: Grouped by business domain (auth, challenges, events)
- **Shared UI**: Reusable components in `/ui` folder using shadcn/ui
- **Page Components**: Route-level components in `/pages`

### **State Management**
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management  
- **Context API**: Global application state
- **Local State**: Component-specific state with useState/useReducer

### **Data Flow Architecture**
```
Browser → React Pages → Custom Hooks → Supabase Client → Supabase APIs
    ↑           ↑            ↑              ↑
    └─ UI ←─────┘     Cache ←┘         Database ←┘
```

## 📋 **NAMING CONVENTIONS**

### **Files & Folders**
- **Components**: PascalCase (`UserDashboard.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useAuth.ts`)
- **Pages**: PascalCase (`Dashboard.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types**: PascalCase (`UserProfile.ts`)
- **Contexts**: PascalCase with 'Context' suffix (`AuthContext.tsx`)

### **Code Conventions**
- **Interfaces**: PascalCase with 'I' prefix (`IUserProfile`)
- **Enums**: PascalCase (`UserRole`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_TIMEOUT`)
- **Functions**: camelCase (`getUserProfile`)

## 🗂️ **CRITICAL DIRECTORIES**

### **`/components` Directory**
```
components/
├── ui/                        # shadcn/ui base components
│   ├── button.tsx             # Button component
│   ├── card.tsx               # Card component
│   ├── dialog.tsx             # Dialog component
│   └── ...                    # Other UI primitives
│
├── auth/
│   ├── LoginForm.tsx          # User authentication form
│   ├── SignupForm.tsx         # User registration form
│   └── ProtectedRoute.tsx     # Route protection wrapper
│
├── dashboard/
│   ├── UserDashboard.tsx      # Main dashboard view
│   ├── StatsCards.tsx         # Metrics display
│   └── ActivityFeed.tsx       # User activity stream
│
├── layout/
│   ├── AppLayout.tsx          # Main application shell
│   ├── Navigation.tsx         # Navigation sidebar
│   └── Header.tsx             # Application header
│
└── admin/                     # Admin interface components
    ├── UserManagement.tsx     # User administration
    ├── SystemSettings.tsx     # System configuration
    └── Analytics.tsx          # Analytics dashboard
```

### **`/pages` Directory (SPA Routes)**
```
pages/
├── Index.tsx                  # Landing page (/)
├── About.tsx                  # About page (/about)
├── Dashboard.tsx              # Main dashboard (/dashboard)
│
├── auth/
│   ├── Login.tsx              # Login page (/auth/login)
│   └── Signup.tsx             # Signup page (/auth/signup)
│
├── workspace/
│   ├── UserWorkspace.tsx      # User workspace
│   ├── AdminWorkspace.tsx     # Admin workspace  
│   └── PartnerWorkspace.tsx   # Partner workspace
│
└── admin/
    ├── AdminDashboard.tsx     # Admin dashboard
    ├── UserManagement.tsx     # User management
    └── SystemAnalytics.tsx    # System analytics
```

### **`/hooks` Directory**
```
hooks/
├── useAuth.ts                 # Authentication state & operations
├── useWorkspace.ts            # Workspace management
├── useChallenges.ts           # Challenge data fetching
├── usePermissions.ts          # Role-based permissions
├── useOptimizedQueries.ts     # Performance-optimized queries
└── useUnifiedTranslation.ts   # Internationalization
```

### **`/integrations` Directory**
```
integrations/
├── supabase/
│   ├── client.ts              # Supabase client configuration
│   ├── types.ts               # Generated database types
│   └── queries/               # Supabase query functions
│
└── unsplash/
    ├── client.ts              # Unsplash API client
    └── types.ts               # Unsplash type definitions
```

## 🔒 **ARCHITECTURE PRINCIPLES**

### **Frontend-Only Application**
- **No Backend Code**: All server functionality via Supabase
- **API Integration**: RESTful calls to Supabase endpoints
- **Real-time Features**: Supabase real-time subscriptions
- **File Storage**: Supabase Storage integration

### **Authentication Flow**
- **Supabase Auth**: JWT tokens with automatic refresh
- **Row Level Security**: Database-level access control
- **Role-based Access**: UI components respect user permissions
- **Protected Routes**: Client-side route protection

### **Data Access Patterns**
- **React Query**: Caching and synchronization
- **Supabase RLS**: Server-side data filtering
- **User Context**: Propagated through React Context
- **Optimistic Updates**: Immediate UI feedback

## 🌐 **INTERNATIONALIZATION STRUCTURE**

```
i18n/
├── enhanced-config-v3.ts      # Main i18n configuration
├── locales/
│   ├── en/                    # English translations
│   │   ├── common.json        # Common UI text
│   │   ├── auth.json          # Authentication text
│   │   └── dashboard.json     # Dashboard text
│   └── ar/                    # Arabic translations
│       ├── common.json        # نصوص واجهة عامة
│       ├── auth.json          # نصوص المصادقة
│       └── dashboard.json     # نصوص لوحة التحكم
```

## 📱 **RESPONSIVE DESIGN STRUCTURE**

### **Breakpoint System**
```typescript
// tailwind.config.ts
screens: {
  sm: '640px',    // Mobile landscape
  md: '768px',    // Tablet
  lg: '1024px',   // Desktop
  xl: '1280px',   // Large desktop
}
```

### **Mobile-First Approach**
- Base styles for mobile devices
- Progressive enhancement for larger screens
- Touch-friendly interactions
- Responsive navigation patterns

## 🚀 **BUILD & DEPLOYMENT STRUCTURE**

### **Build Process**
```bash
# Development
npm run dev          # Vite dev server with hot reload
npm run build        # Production build → dist/

# Output Structure (dist/)
dist/
├── index.html       # Entry point
├── assets/          # CSS, JS, images
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── images/
└── favicon.ico      # Site icon
```

### **Deployment Options**
- **Vercel**: Git-based deployment
- **Netlify**: Drag & drop or Git integration  
- **AWS S3 + CloudFront**: CDN hosting
- **Any static hosting service**

## 🔧 **DEVELOPMENT WORKFLOW STRUCTURE**

### **Hot Module Replacement (HMR)**
- **Vite HMR**: Instant updates during development
- **React Fast Refresh**: Component state preservation
- **CSS Hot Reload**: Immediate style updates

### **Code Quality Structure**
```
# Linting & Formatting
.eslintrc.js         # ESLint configuration
prettier.config.js   # Prettier formatting (needs setup)
tsconfig.json       # TypeScript configuration

# Testing (needs setup)
vitest.config.ts    # Test configuration  
src/__tests__/      # Test files
```

## 📊 **PERFORMANCE CONSIDERATIONS**

### **Bundle Optimization**
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Image and font optimization
- **Lazy Loading**: Dynamic component imports

### **Caching Strategy**
- **TanStack Query**: API response caching
- **Browser Caching**: Static asset caching
- **Service Worker**: Offline functionality (if implemented)

---

## 🎯 **GETTING STARTED WITH THE STRUCTURE**

### **For New Developers**
1. **Start with `/src/App.tsx`** - Understand the application entry point
2. **Review `/src/pages`** - See how SPA routing works
3. **Explore `/src/components/ui`** - Learn the design system
4. **Check `/src/hooks`** - Understand data fetching patterns
5. **Study `/src/integrations/supabase`** - Learn backend integration

### **For Feature Development**
1. **Add new pages** in `/src/pages`
2. **Create reusable components** in `/src/components`
3. **Add custom hooks** in `/src/hooks` for data logic
4. **Update routing** in `/src/routing`
5. **Add translations** in `/src/i18n/locales`

---

*This structure supports scalable SPA development and maintains clear separation of concerns as the platform grows.*