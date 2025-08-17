# 📁 Project Structure & Organization

## Overview

The Ruwād Platform follows a well-organized, scalable file structure that promotes maintainability, reusability, and clear separation of concerns. The project is structured to support **195 components**, **169 custom hooks**, and **enterprise-grade features**.

## Root Directory Structure

```
ruwad-platform/
├── docs/                           # Documentation
│   ├── Architecture/               # System architecture docs
│   ├── API/                       # API documentation
│   └── Development/               # Development guides
├── public/                        # Static assets
├── src/                          # Source code
├── supabase/                     # Database & backend
├── tests/                        # Test files
├── .github/                      # GitHub workflows
└── config files                  # Configuration files
```

## Source Code Structure (`src/`)

### 1. **Core Application Structure**

```
src/
├── components/                    # Reusable UI components
│   ├── ui/                       # Base UI components (shadcn/ui)
│   ├── layout/                   # Layout components
│   ├── dashboard/                # Dashboard-specific components
│   ├── challenges/               # Challenge-related components
│   ├── events/                   # Event management components
│   ├── users/                    # User management components
│   ├── ai/                       # AI feature components
│   └── shared/                   # Shared business components
│
├── hooks/                        # Custom React hooks (169 total)
│   ├── core/                     # Core infrastructure hooks
│   ├── auth/                     # Authentication hooks
│   ├── data/                     # Data management hooks
│   ├── realtime/                 # Real-time functionality hooks
│   ├── ai/                       # AI integration hooks
│   └── utils/                    # Utility hooks
│
├── pages/                        # Page components
│   ├── auth/                     # Authentication pages
│   ├── admin/                    # Admin panel pages
│   ├── dashboard/                # Dashboard pages
│   └── public/                   # Public pages
│
├── integrations/                 # External service integrations
│   ├── supabase/                 # Supabase configuration
│   ├── ai/                       # AI service integrations
│   └── analytics/                # Analytics integrations
│
├── lib/                          # Utility libraries
│   ├── utils/                    # General utilities
│   ├── validations/              # Schema validations
│   ├── constants/                # Application constants
│   └── types/                    # TypeScript type definitions
│
├── contexts/                     # React contexts
├── assets/                       # Static assets (images, icons)
├── styles/                       # Global styles and themes
└── locales/                      # Internationalization files
```

### 2. **Component Organization**

#### Base UI Components (`src/components/ui/`)
```
ui/
├── button.tsx                   # Button component with variants
├── card.tsx                     # Card component system
├── dialog.tsx                   # Modal dialogs
├── dropdown-menu.tsx            # Dropdown menus
├── form.tsx                     # Form components
├── input.tsx                    # Input fields
├── table.tsx                    # Data tables
├── toast.tsx                    # Notification system
├── tooltip.tsx                  # Tooltips
└── ...                          # Other shadcn/ui components
```

#### Layout Components (`src/components/layout/`)
```
layout/
├── AppShell.tsx                 # Global application shell
├── SystemHeader.tsx             # Main navigation header
├── NavigationSidebar.tsx        # Sidebar navigation
├── PageLayout.tsx               # Standard page layout
├── PageHeader.tsx               # Page header component
├── ContentArea.tsx              # Main content wrapper
├── ResponsiveGrid.tsx           # Grid layout system
└── DirectionalWrapper.tsx       # RTL/LTR support
```

#### Business Logic Components (`src/components/`)
```
components/
├── challenges/
│   ├── ChallengeList.tsx        # Challenge listing
│   ├── ChallengeCard.tsx        # Individual challenge card
│   ├── ChallengeDetails.tsx     # Challenge detail view
│   ├── CreateChallengeForm.tsx  # Challenge creation form
│   └── ChallengeFilters.tsx     # Filtering components
│
├── dashboard/
│   ├── UserDashboard.tsx        # Main user dashboard
│   ├── AdminDashboard.tsx       # Admin dashboard
│   ├── MetricsCards.tsx         # Dashboard metrics
│   ├── ActivityFeed.tsx         # Real-time activity feed
│   └── QuickActions.tsx         # Quick action panel
│
├── users/
│   ├── UserProfile.tsx          # User profile component
│   ├── UserManagement.tsx       # Admin user management
│   ├── RoleAssignment.tsx       # Role assignment UI
│   └── UserTable.tsx            # User data table
│
└── shared/
    ├── LoadingSpinner.tsx       # Loading indicators
    ├── ErrorBoundary.tsx        # Error handling
    ├── NotificationCenter.tsx   # Notification management
    └── SearchBar.tsx            # Global search
```

### 3. **Hook Organization**

#### Core Infrastructure Hooks (`src/hooks/core/`)
```
core/
├── useUnifiedLoading.ts         # Centralized loading management
├── useUnifiedErrorHandler.ts    # Error handling system
├── useUnifiedTranslation.ts     # Internationalization
├── useNavigationHandler.ts      # Navigation management
├── useDirection.ts              # RTL/LTR support
└── useTheme.ts                  # Theme management
```

#### Authentication Hooks (`src/hooks/auth/`)
```
auth/
├── useAuth.ts                   # Core authentication
├── useCurrentUser.ts            # Current user data
├── useRoleManagement.ts         # Role-based access control
├── usePermissions.ts            # Permission checking
├── useUserProfile.ts            # User profile management
└── useNavigationGuard.ts        # Route protection
```

#### Data Management Hooks (`src/hooks/data/`)
```
data/
├── challenges/
│   ├── useChallengeManagement.ts
│   ├── useChallengeSubmissions.ts
│   └── useChallengeAnalytics.ts
│
├── events/
│   ├── useEventManagement.ts
│   ├── useEventRegistration.ts
│   └── useEventAnalytics.ts
│
├── users/
│   ├── useUserManagement.ts
│   ├── useUserSearch.ts
│   └── useUserActivity.ts
│
└── system/
    ├── useSystemConfiguration.ts
    ├── useFeatureFlags.ts
    └── useAnalytics.ts
```

#### Real-time Hooks (`src/hooks/realtime/`)
```
realtime/
├── useRealTimeChallenges.ts     # Challenge live updates
├── useRealTimeEvents.ts         # Event notifications
├── useUserPresence.ts           # User presence tracking
├── useBookmarks.ts              # Real-time bookmark sync
├── useNotifications.ts          # Live notifications
└── useConnectionHealth.ts       # Connection monitoring
```

### 4. **Type Definitions Structure**

#### Core Types (`src/lib/types/`)
```
types/
├── index.ts                     # Main type exports
├── api.ts                       # API response types
├── auth.ts                      # Authentication types
├── database.ts                  # Database schema types
├── hooks.ts                     # Hook-related types
├── ui.ts                        # UI component types
├── realtime.ts                  # Real-time data types
└── business/                    # Business logic types
    ├── challenges.ts
    ├── events.ts
    ├── users.ts
    └── analytics.ts
```

#### Example Type Organization
```typescript
// src/lib/types/challenges.ts
export interface Challenge {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  status: ChallengeStatus;
  created_at: string;
  updated_at: string;
  deadline?: string;
  participant_count?: number;
}

export type ChallengeStatus = 'draft' | 'published' | 'closed' | 'evaluation';

export interface CreateChallengeRequest {
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  deadline?: string;
  challenge_type?: string;
}

export interface ChallengeAnalytics {
  view_count: number;
  participant_count: number;
  submission_count: number;
  engagement_rate: number;
}
```

### 5. **Integration Layer**

#### Supabase Integration (`src/integrations/supabase/`)
```
supabase/
├── client.ts                    # Supabase client configuration
├── types.ts                     # Auto-generated database types
├── auth.ts                      # Authentication helpers
├── realtime.ts                  # Real-time configuration
├── storage.ts                   # File storage utilities
└── functions/                   # Edge function types
    ├── ai-functions.ts
    ├── email-functions.ts
    └── analytics-functions.ts
```

#### AI Integration (`src/integrations/ai/`)
```
ai/
├── openai.ts                    # OpenAI API integration
├── embeddings.ts                # Vector embeddings
├── chat.ts                      # AI chat functionality
├── content-moderation.ts        # Content moderation
└── analysis.ts                  # Content analysis
```

### 6. **Utility Libraries**

#### General Utilities (`src/lib/utils/`)
```
utils/
├── index.ts                     # Main utility exports
├── cn.ts                        # Class name utility
├── date.ts                      # Date formatting utilities
├── string.ts                    # String manipulation
├── array.ts                     # Array utilities
├── object.ts                    # Object manipulation
├── validation.ts                # Data validation helpers
├── formatting.ts                # Data formatting
└── constants.ts                 # Application constants
```

#### Constants Organization (`src/lib/constants/`)
```
constants/
├── index.ts                     # Main constants export
├── routes.ts                    # Application routes
├── roles.ts                     # User roles and permissions
├── status.ts                    # Status enums
├── api.ts                       # API endpoints
├── ui.ts                        # UI constants
└── business.ts                  # Business logic constants
```

### 7. **Page Components Structure**

#### Authentication Pages (`src/pages/auth/`)
```
auth/
├── LoginPage.tsx                # User login
├── RegisterPage.tsx             # User registration
├── ForgotPasswordPage.tsx       # Password reset
├── ResetPasswordPage.tsx        # Password reset form
└── VerifyEmailPage.tsx          # Email verification
```

#### Admin Pages (`src/pages/admin/`)
```
admin/
├── AdminDashboard.tsx           # Admin dashboard
├── UserManagement.tsx           # User management
├── ChallengeManagement.tsx      # Challenge administration
├── SystemSettings.tsx           # System configuration
├── AnalyticsPage.tsx            # Analytics dashboard
└── SecurityAudit.tsx            # Security monitoring
```

## Configuration Files

### 1. **Build Configuration**
```
├── vite.config.ts               # Vite build configuration
├── tsconfig.json                # TypeScript configuration
├── tsconfig.app.json            # App-specific TS config
├── tsconfig.node.json           # Node.js TS config
├── tailwind.config.ts           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
└── components.json              # shadcn/ui configuration
```

### 2. **Code Quality**
```
├── .eslintrc.js                 # ESLint configuration
├── .prettierrc                  # Prettier formatting rules
├── .gitignore                   # Git ignore rules
└── .env.example                 # Environment variables template
```

### 3. **Testing Configuration**
```
├── vitest.config.ts             # Vitest test configuration
├── jest.config.js               # Jest configuration (if used)
└── tests/
    ├── setup.ts                 # Test setup
    ├── helpers/                 # Test utilities
    └── mocks/                   # Mock data
```

## Backend Structure (`supabase/`)

### 1. **Database Schema**
```
supabase/
├── migrations/                  # Database migrations
│   ├── 001_initial_schema.sql
│   ├── 002_user_roles.sql
│   ├── 003_challenges.sql
│   └── ...
│
├── functions/                   # Edge Functions
│   ├── ai-chat/
│   ├── email-service/
│   ├── analytics-processing/
│   └── content-moderation/
│
├── seed.sql                     # Initial data seeding
├── config.toml                  # Supabase configuration
└── types.ts                     # Generated TypeScript types
```

### 2. **Edge Functions Structure**
```
functions/
├── ai-chat/
│   ├── index.ts                 # Main function
│   ├── types.ts                 # Function types
│   └── utils.ts                 # Utility functions
│
├── shared/                      # Shared utilities
│   ├── cors.ts                  # CORS handling
│   ├── auth.ts                  # Authentication utilities
│   └── validation.ts            # Request validation
```

## File Naming Conventions

### 1. **Component Files**
- **PascalCase** for component files: `ChallengeList.tsx`
- **kebab-case** for utility files: `challenge-utils.ts`
- **SCREAMING_SNAKE_CASE** for constants: `API_ENDPOINTS.ts`

### 2. **Hook Files**
- **camelCase** with `use` prefix: `useChallengeManagement.ts`
- **Descriptive names** indicating functionality
- **Co-located** with related components when specific

### 3. **Type Files**
- **kebab-case** for type definition files: `challenge-types.ts`
- **Grouped by feature** for better organization
- **Interface** prefix for interfaces: `IChallengeData`

## Import/Export Patterns

### 1. **Barrel Exports**
```typescript
// src/components/index.ts
export { ChallengeList } from './challenges/ChallengeList';
export { UserDashboard } from './dashboard/UserDashboard';
export { AdminPanel } from './admin/AdminPanel';

// src/hooks/index.ts
export { useChallengeManagement } from './data/useChallengeManagement';
export { useAuth } from './auth/useAuth';
export { useUnifiedLoading } from './core/useUnifiedLoading';
```

### 2. **Path Aliases**
```typescript
// vite.config.ts
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
    "@/components": path.resolve(__dirname, "./src/components"),
    "@/hooks": path.resolve(__dirname, "./src/hooks"),
    "@/lib": path.resolve(__dirname, "./src/lib"),
    "@/pages": path.resolve(__dirname, "./src/pages"),
  }
}

// Usage in components
import { Button } from "@/components/ui/button";
import { useChallengeManagement } from "@/hooks/data/useChallengeManagement";
import { cn } from "@/lib/utils";
```

## Development Workflow

### 1. **Feature Development Structure**
```
feature-branch/
├── Add new component to appropriate directory
├── Create corresponding hook if needed
├── Add types to type definitions
├── Update tests
├── Update documentation
└── Export from barrel files
```

### 2. **Code Organization Rules**
- **One component per file** with co-located styles
- **Related files grouped** in same directory
- **Shared utilities** in lib directory
- **Business logic** isolated in hooks
- **Types** defined close to usage

---

**Project Structure Status**: ✅ **WELL ORGANIZED**  
**Component Count**: 195 (Properly structured)  
**Hook Count**: 169 (Logically organized)  
**File Organization**: Enterprise-grade structure  
**Maintainability**: High with clear conventions