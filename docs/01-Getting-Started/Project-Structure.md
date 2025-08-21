# 📁 Project Structure Guide

## 🏗️ **OVERVIEW**
Understanding the Ruwād Innovation Platform codebase architecture and organization patterns.

## 📂 **ROOT DIRECTORY STRUCTURE**

```
ruwad-innovation-platform/
├── 📁 docs/                     # Documentation hub
├── 📁 public/                   # Static assets
├── 📁 src/                      # Source code
├── 📁 supabase/                 # Database migrations
├── 📄 package.json             # Dependencies
├── 📄 vite.config.ts           # Build configuration
└── 📄 tailwind.config.ts       # Styling configuration
```

## 🎯 **SOURCE CODE ORGANIZATION**

### **Core Application Structure**
```
src/
├── 📁 components/              # Reusable UI components
│   ├── 📁 auth/               # Authentication components
│   ├── 📁 challenges/         # Challenge management
│   ├── 📁 dashboard/          # Dashboard components
│   ├── 📁 events/             # Event management
│   ├── 📁 layout/             # Layout components
│   └── 📁 ui/                 # Base UI components (shadcn)
│
├── 📁 hooks/                   # Custom React hooks
│   ├── 📁 auth/               # Authentication hooks
│   ├── 📁 challenges/         # Challenge-specific hooks
│   └── 📁 workspace/          # Workspace management
│
├── 📁 integrations/            # External service integrations
│   ├── 📁 supabase/           # Supabase client & types
│   └── 📁 unsplash/           # Unsplash API integration
│
├── 📁 lib/                     # Utility libraries
│   ├── 📁 auth/               # Authentication utilities
│   ├── 📁 i18n/               # Internationalization
│   └── 📁 utils/              # General utilities
│
├── 📁 pages/                   # Route components
│   ├── 📁 auth/               # Authentication pages
│   ├── 📁 dashboard/          # Dashboard pages
│   └── 📁 public/             # Public pages
│
└── 📁 types/                   # TypeScript type definitions
```

## 🔧 **KEY ARCHITECTURAL PATTERNS**

### **Component Organization**
- **Atomic Design**: Components organized by complexity (atoms → molecules → organisms)
- **Feature-based**: Grouped by business domain (auth, challenges, events)
- **Shared UI**: Reusable components in `/ui` folder using shadcn/ui

### **State Management**
- **React Query**: Server state management and caching
- **React Hook Form**: Form state management
- **Context API**: Global application state
- **Local State**: Component-specific state with useState/useReducer

### **Data Flow Architecture**
```
Pages → Hooks → Services → Supabase → Database
  ↑        ↑        ↑         ↑
  └─ UI ←──┘   Cache ←┘    Real-time ←┘
```

## 📋 **NAMING CONVENTIONS**

### **Files & Folders**
- **Components**: PascalCase (`UserDashboard.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useAuth.ts`)
- **Pages**: PascalCase (`Dashboard.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types**: PascalCase (`UserProfile.ts`)

### **Code Conventions**
- **Interfaces**: PascalCase with 'I' prefix (`IUserProfile`)
- **Enums**: PascalCase (`UserRole`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_TIMEOUT`)
- **Functions**: camelCase (`getUserProfile`)

## 🗂️ **CRITICAL DIRECTORIES**

### **`/components` Directory**
```
components/
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
└── ui/                        # shadcn/ui components
    ├── button.tsx             # Button component
    ├── card.tsx               # Card component
    └── ...                    # Other UI primitives
```

### **`/hooks` Directory**
```
hooks/
├── useAuth.ts                 # Authentication state
├── useWorkspace.ts            # Workspace management
├── useChallenges.ts           # Challenge data fetching
├── usePermissions.ts          # Role-based permissions
└── useOptimizedQueries.ts     # Performance-optimized queries
```

### **`/lib` Directory**
```
lib/
├── supabase.ts               # Supabase client configuration
├── auth.ts                   # Authentication utilities
├── utils.ts                  # General utility functions
├── constants.ts              # Application constants
└── validations.ts            # Form validation schemas
```

## 🔒 **SECURITY ARCHITECTURE**

### **Authentication Flow**
- JWT tokens with automatic refresh
- Row Level Security (RLS) policies
- Role-based access control (RBAC)
- Protected route components

### **Data Access Patterns**
- All database queries use RLS policies
- User context propagated through hooks
- Workspace-scoped data access
- Audit logging for sensitive operations

## 🌐 **INTERNATIONALIZATION STRUCTURE**

```
lib/i18n/
├── index.ts                  # i18next configuration
├── locales/
│   ├── en/                   # English translations
│   │   ├── common.json       # Common UI text
│   │   ├── auth.json         # Authentication text
│   │   └── dashboard.json    # Dashboard text
│   └── ar/                   # Arabic translations
│       ├── common.json       # نصوص واجهة عامة
│       ├── auth.json         # نصوص المصادقة
│       └── dashboard.json    # نصوص لوحة التحكم
```

## 📱 **RESPONSIVE DESIGN STRUCTURE**

### **Breakpoint System**
```typescript
// tailwind.config.ts
screens: {
  sm: '640px',    // Mobile landscape
  md: '768px',    // Tablet
  lg: '1024px',   // Desktop
  xl: '1280px',   # Large desktop
}
```

### **Mobile-First Approach**
- Base styles for mobile
- Progressive enhancement for larger screens
- Touch-friendly interactions
- Responsive navigation patterns

---

*This structure supports scalable development and maintains code organization as the platform grows.*