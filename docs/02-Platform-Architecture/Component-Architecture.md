# ⚛️ Component Architecture Guide

## 🏗️ **ARCHITECTURAL PRINCIPLES**

The Ruwād Innovation Platform follows atomic design principles combined with feature-based organization for maximum reusability and maintainability.

<lov-mermaid>
graph TB
    subgraph "Atomic Design Hierarchy"
        A[Atoms - Basic UI Elements]
        B[Molecules - Simple Component Groups]
        C[Organisms - Complex UI Components]
        D[Templates - Page Layout Structures]
        E[Pages - Complete User Interfaces]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    
    subgraph "Feature Organization"
        F[Auth Components]
        G[Challenge Components]
        H[Dashboard Components]
        I[Event Components]
        J[Layout Components]
    end
</lov-mermaid>

## 🧱 **COMPONENT HIERARCHY**

### **Atoms (Base UI Components)**
```typescript
// Location: src/components/ui/
├── button.tsx              // Interactive button element
├── input.tsx               // Form input field
├── card.tsx                // Content container
├── badge.tsx               // Status indicator
├── avatar.tsx              // User profile image
├── dialog.tsx              // Modal container
└── toast.tsx               // Notification messages
```

**Example Atom Component:**
```typescript
// src/components/ui/button.tsx
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)
```

### **Molecules (Compound Components)**
```typescript
// Location: src/components/[feature]/
├── SearchInput.tsx         // Input + search icon + clear button
├── UserAvatarWithName.tsx  // Avatar + display name + role badge
├── StatCard.tsx            // Icon + title + value + trend
├── ActionMenu.tsx          // Button + dropdown menu
└── FormField.tsx           // Label + input + error message
```

**Example Molecule Component:**
```typescript
// src/components/dashboard/StatCard.tsx
interface StatCardProps {
  title: string
  titleAr: string
  value: string
  change?: string
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon: LucideIcon
  color?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  titleAr,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color = 'text-primary'
}) => {
  const { language } = useTranslation()
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {language === 'ar' ? titleAr : title}
          </p>
          <p className="text-2xl font-bold">{value}</p>
          {change && (
            <p className={`text-sm ${getChangeColor(changeType)}`}>
              {change}
            </p>
          )}
        </div>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
    </Card>
  )
}
```

### **Organisms (Complex Components)**
```typescript
// Location: src/components/[feature]/
├── ChallengeCard.tsx       // Complete challenge display with actions
├── SubmissionForm.tsx      // Multi-step form with validation
├── EventRegistration.tsx   // Event details + registration form
├── UserDashboard.tsx       // Stats + activities + quick actions
└── NavigationSidebar.tsx   // Menu + user info + workspace switcher
```

## 🎯 **FEATURE-BASED ORGANIZATION**

### **Authentication Components**
<lov-mermaid>
graph TB
    A[AuthLayout] --> B[LoginForm]
    A --> C[SignupForm]
    A --> D[ForgotPasswordForm]
    B --> E[FormField Molecules]
    C --> E
    D --> E
    E --> F[UI Atoms]
</lov-mermaid>

```typescript
// src/components/auth/
├── AuthLayout.tsx          // Layout wrapper for auth pages
├── LoginForm.tsx           // User login interface
├── SignupForm.tsx          // User registration interface
├── ForgotPasswordForm.tsx  // Password reset interface
├── EmailVerification.tsx   // Email confirmation UI
└── ProtectedRoute.tsx      // Route protection wrapper
```

### **Challenge Management Components**
```typescript
// src/components/challenges/
├── ChallengeList.tsx       // List of challenges with filtering
├── ChallengeCard.tsx       // Individual challenge display
├── ChallengeDetails.tsx    // Full challenge information
├── ChallengeForm.tsx       // Challenge creation/editing
├── SubmissionForm.tsx      // Idea submission interface
├── SubmissionList.tsx      // List of user submissions
└── EvaluationPanel.tsx     // Challenge evaluation interface
```

### **Dashboard Components**
```typescript
// src/components/dashboard/
├── UserDashboard.tsx       // Main dashboard view
├── AdminDashboard.tsx      // Administrative overview
├── StatsGrid.tsx           // Performance metrics display
├── ActivityFeed.tsx        // Recent user activities
├── QuickActions.tsx        // Shortcut action buttons
└── NotificationCenter.tsx  // User notifications
```

## 🔄 **STATE MANAGEMENT PATTERNS**

### **Component State Architecture**
<lov-mermaid>
graph LR
    A[User Interaction] --> B[Component State]
    B --> C[Custom Hook]
    C --> D[React Query]
    D --> E[Supabase API]
    E --> F[Database]
    
    F --> G[Real-time Updates]
    G --> D
    D --> C
    C --> H[UI Update]
</lov-mermaid>

### **State Management by Component Type**

**Atoms**: Local state only
```typescript
const [isLoading, setIsLoading] = useState(false)
const [isOpen, setIsOpen] = useState(false)
```

**Molecules**: Props + local state
```typescript
interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const [localValue, setLocalValue] = useState(value)
```

**Organisms**: Custom hooks + context
```typescript
const { user, workspace } = useAuth()
const { challenges, isLoading } = useChallenges(workspace?.id)
const { register, handleSubmit, formState } = useForm()
```

## 🎨 **STYLING ARCHITECTURE**

### **Design System Integration**
```typescript
// Component styling patterns
const componentStyles = {
  // Use semantic tokens
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  
  // Responsive design
  responsive: 'flex flex-col md:flex-row lg:grid lg:grid-cols-3',
  
  // RTL support
  spacing: 'ms-4 me-2', // margin-inline-start/end
  
  // Dark mode support
  surface: 'bg-background border border-border'
}
```

### **Component Styling Standards**
- **Semantic Classes**: Use design system tokens
- **Responsive Design**: Mobile-first approach
- **RTL Support**: Logical properties for internationalization
- **Dark Mode**: Automatic theme switching
- **Accessibility**: WCAG 2.1 AA compliance

## 🔌 **INTEGRATION PATTERNS**

### **Hook Integration Pattern**
```typescript
// Custom hook for component data
export const useChallenge = (challengeId: string) => {
  return useQuery({
    queryKey: ['challenge', challengeId],
    queryFn: () => getChallengeById(challengeId),
    enabled: !!challengeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Component integration
const ChallengeDetails: React.FC<{ challengeId: string }> = ({ challengeId }) => {
  const { data: challenge, isLoading, error } = useChallenge(challengeId)
  
  if (isLoading) return <LoadingSkeleton />
  if (error) return <ErrorBoundary error={error} />
  if (!challenge) return <NotFound />
  
  return <ChallengeContent challenge={challenge} />
}
```

## 🧪 **TESTING ARCHITECTURE**

### **Component Testing Strategy**
```typescript
// Test file structure
src/components/
├── __tests__/
│   ├── Button.test.tsx
│   ├── StatCard.test.tsx
│   └── ChallengeForm.test.tsx
├── __mocks__/
│   ├── hooks.ts
│   └── api.ts
└── test-utils.tsx
```

### **Testing Patterns**
```typescript
// Component test example
describe('StatCard', () => {
  it('displays title and value correctly', () => {
    render(
      <StatCard 
        title="Active Challenges"
        titleAr="التحديات النشطة"
        value="12"
        icon={Target}
      />
    )
    
    expect(screen.getByText('Active Challenges')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
  })
  
  it('handles RTL language switching', () => {
    const { rerender } = render(
      <I18nextProvider i18n={i18nEn}>
        <StatCard title="Active Challenges" titleAr="التحديات النشطة" value="12" icon={Target} />
      </I18nextProvider>
    )
    
    expect(screen.getByText('Active Challenges')).toBeInTheDocument()
    
    rerender(
      <I18nextProvider i18n={i18nAr}>
        <StatCard title="Active Challenges" titleAr="التحديات النشطة" value="12" icon={Target} />
      </I18nextProvider>
    )
    
    expect(screen.getByText('التحديات النشطة')).toBeInTheDocument()
  })
})
```

## 📋 **COMPONENT GUIDELINES**

### **Development Standards**
1. **Single Responsibility**: Each component has one clear purpose
2. **Composition over Inheritance**: Prefer composition patterns
3. **Props Interface**: Clear TypeScript interfaces for all props
4. **Error Boundaries**: Graceful error handling at organism level
5. **Performance**: Memoization for expensive computations
6. **Accessibility**: ARIA labels and keyboard navigation

### **Code Quality Checklist**
- ✅ TypeScript interfaces defined
- ✅ Props validation implemented
- ✅ Error boundaries in place
- ✅ Loading states handled
- ✅ Responsive design implemented
- ✅ RTL support included
- ✅ Dark mode compatible
- ✅ Unit tests written
- ✅ Accessibility tested

---

*This component architecture ensures scalability, maintainability, and consistent user experience across the platform.*