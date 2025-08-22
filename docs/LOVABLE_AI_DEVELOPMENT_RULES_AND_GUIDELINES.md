# 🤖 Lovable AI Development Rules & Guidelines
### Saudi Arabia Innovate Platform (Ruwād)

This document establishes the complete set of rules, guidelines, and standards for Lovable AI when developing the Saudi Arabia Innovation Platform. These guidelines ensure consistency, quality, and maintainability across all AI-generated code.

---

## 🎯 **CORE DEVELOPMENT PRINCIPLES**

### **1. Architecture First**
- **Perfect Architecture**: Always consider whether code needs refactoring given the latest request
- **Efficiency Maximization**: Invoke all relevant tools simultaneously, never sequentially 
- **Context Awareness**: Always check "useful-context" section FIRST before using tools
- **Minimal Changes**: Make ONLY the changes requested by the user, avoid scope creep

### **2. Response Format Standards**
- **Concise Communication**: Keep responses under 2 lines unless detailed explanation requested
- **Brief Action Communication**: Inform user what you will do before performing changes
- **Minimize Emojis**: Use sparingly and appropriately
- **Check Understanding**: Ask for clarification rather than guessing scope

---

## 📐 **TYPESCRIPT & CODE STANDARDS**

### **Type Safety Requirements**
```typescript
// ✅ REQUIRED: Explicit interface definitions
interface UserProfile {
  readonly id: string
  email: string
  displayName: string | null
  avatarUrl?: string
  metadata: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

// ❌ FORBIDDEN: Any types or implicit any
const userData: any = {} // Never use
function processData(data) { return data.someProperty } // Never use
```

### **Function Standards**
```typescript
// ✅ REQUIRED: Explicit return types
async function fetchUserChallenges(
  userId: string,
  options?: FetchOptions
): Promise<Challenge[]> {
  const response = await api.get(`/users/${userId}/challenges`, options)
  return response.data
}
```

### **Naming Conventions**
- **Components**: PascalCase (`UserDashboard.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useAuth.ts`)
- **Interfaces**: PascalCase with 'I' prefix (`IUserProfile`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_TIMEOUT`)
- **Functions**: camelCase (`getUserProfile`)

---

## ⚛️ **REACT COMPONENT STANDARDS**

### **Component Structure Template**
```typescript
// ✅ REQUIRED: Standard component template
import React, { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ComponentProps {
  challenge: Challenge
  onSubmit?: (challengeId: string) => void
  showActions?: boolean
  className?: string
}

export const ComponentName: React.FC<ComponentProps> = ({
  challenge,
  onSubmit,
  showActions = true,
  className
}) => {
  const { t } = useTranslation('challenges')
  
  // State management
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Memoized calculations
  const timeRemaining = useMemo(() => 
    calculateTimeRemaining(challenge.deadline), [challenge.deadline]
  )
  
  // Event handlers
  const handleSubmit = useCallback(async () => {
    // Implementation
  }, [challenge.id, onSubmit])
  
  return (
    <Card className={className}>
      {/* Component JSX */}
    </Card>
  )
}

// REQUIRED: Export with display name
ComponentName.displayName = 'ComponentName'
```

### **Hook Standards**
```typescript
// ✅ REQUIRED: Custom hook structure with React Query
export const useChallenge = (challengeId: string) => {
  return useQuery({
    queryKey: ['challenge', challengeId],
    queryFn: async () => {
      if (!challengeId) throw new Error('Challenge ID is required')
      return await getChallengeById(challengeId)
    },
    enabled: !!challengeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error.status === 404) return false
      return failureCount < 3
    }
  })
}
```

---

## 🎨 **DESIGN SYSTEM & STYLING STANDARDS**

### **Critical Design Rules**
```typescript
// ✅ REQUIRED: Use semantic design tokens from index.css
const styles = {
  card: 'bg-card text-card-foreground border-border',
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  // RTL-friendly spacing
  spacing: 'ms-4 me-2 ps-6 pe-4',
  // Responsive design
  responsive: 'flex flex-col md:flex-row lg:grid lg:grid-cols-3'
}

// ❌ FORBIDDEN: Direct colors (will cause system failure)
const badStyles = {
  card: 'bg-white text-black border-gray-200', // NEVER USE
  button: 'bg-blue-500 text-white hover:bg-blue-600' // NEVER USE
}
```

### **Color System Requirements**
- **ALL colors MUST be HSL format** in index.css and tailwind.config.ts
- **NEVER use direct colors** like `text-white`, `bg-black`, `text-blue-500`
- **ALWAYS use semantic tokens** from the design system
- **Check CSS variable format** before using in color functions

### **Component Variants (CVA)**
```typescript
// ✅ REQUIRED: CVA variant definitions for reusable components
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)
```

---

## 🛡️ **ERROR HANDLING STANDARDS**

### **Unified Error Handler Usage**
```typescript
// ✅ REQUIRED: Use unified error handling system
import { createErrorHandler } from '@/utils/unified-error-handler'

const errorHandler = createErrorHandler({
  component: 'ChallengeSubmission',
  showToast: true,
  logError: true
})

// In async operations
const result = await errorHandler.withErrorHandling(
  () => submitChallenge(challengeId, formData),
  { operation: 'submit_challenge', challengeId },
  'Failed to submit challenge. Please try again.'
)
```

### **Error Boundary Implementation**
```typescript
// ✅ REQUIRED: Comprehensive error boundaries for critical components
export class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    // Report to error tracking service
  }
  
  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || DefaultErrorFallback
      return <Fallback error={this.state.error} />
    }
    return this.props.children
  }
}
```

---

## 🔄 **STATE MANAGEMENT PATTERNS**

### **React Query Standards**
```typescript
// ✅ REQUIRED: Query key factory pattern
export const challengeKeys = {
  all: ['challenges'] as const,
  lists: () => [...challengeKeys.all, 'list'] as const,
  list: (filters: string) => [...challengeKeys.lists(), { filters }] as const,
  details: () => [...challengeKeys.all, 'detail'] as const,
  detail: (id: string) => [...challengeKeys.details(), id] as const,
  submissions: (id: string) => [...challengeKeys.detail(id), 'submissions'] as const,
}

// ✅ REQUIRED: Optimistic updates for better UX
const useSubmitChallenge = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: submitChallenge,
    onMutate: async (newSubmission) => {
      await queryClient.cancelQueries({ queryKey: challengeKeys.lists() })
      const previousChallenges = queryClient.getQueryData(challengeKeys.lists())
      queryClient.setQueryData(challengeKeys.lists(), (old: Challenge[]) => 
        old ? [...old, { ...newSubmission, status: 'pending' }] : [newSubmission]
      )
      return { previousChallenges }
    },
    onError: (err, newSubmission, context) => {
      queryClient.setQueryData(challengeKeys.lists(), context?.previousChallenges)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: challengeKeys.lists() })
    },
  })
}
```

---

## 🏗️ **ARCHITECTURE PATTERNS**

### **File Organization Standards**
```
src/
├── components/
│   ├── ui/                    # shadcn/ui base components (DO NOT MODIFY)
│   ├── auth/                  # Authentication components
│   ├── dashboard/             # Dashboard-specific components
│   ├── layout/                # Layout components
│   └── admin/                 # Admin interface components
├── hooks/
│   ├── useAuth.ts             # Authentication state & operations  
│   ├── useActivityLogger.ts   # Activity logging with smart filtering
│   └── useAIFeatures.ts       # AI feature management
├── utils/
│   ├── unified-error-handler.ts    # Error handling system
│   ├── unified-form-validation.ts  # Form validation system
│   └── logger.ts              # Logging utilities
├── contexts/
│   └── AuthContext.tsx        # Authentication context
├── integrations/
│   └── supabase/              # Supabase integration (READ-ONLY types.ts)
└── pages/                     # SPA route components
```

### **Component Creation Patterns**
- **Small, Focused Components**: Create small, focused components instead of large files
- **Reusability**: Maximize component reusability through proper prop design
- **Lazy Loading**: Use React.lazy() for route-level components
- **Error Boundaries**: Wrap critical sections with error boundaries

---

## 🔐 **SECURITY & AUTHENTICATION STANDARDS**

### **RBAC (Role-Based Access Control)**
```typescript
// ✅ REQUIRED: Proper permission checking
import { usePermissions } from '@/hooks/usePermissions'

const Component = () => {
  const { hasPermission, canAccess } = usePermissions()
  
  if (!hasPermission('challenge:manage')) {
    return <AccessDenied />
  }
  
  return (
    <div>
      {canAccess('admin:users') && <AdminPanel />}
      {/* Component content */}
    </div>
  )
}
```

### **Row Level Security (RLS)**
- **All user data MUST have RLS policies**
- **Never reference auth.users table directly** - use profiles table
- **Workspace-based data isolation** through RLS policies
- **Comprehensive audit logging** for security compliance

### **Authentication Flow Standards**
```typescript
// ✅ REQUIRED: Proper auth state management
const { user, isLoading, error } = useAuth()

if (isLoading) return <LoadingSpinner />
if (error) return <ErrorMessage error={error} />
if (!user) return <LoginForm />

return <AuthenticatedContent user={user} />
```

---

## 🌐 **INTERNATIONALIZATION (i18n) STANDARDS**

### **Translation Requirements**
```typescript
// ✅ REQUIRED: Use react-i18next for all text
import { useTranslation } from 'react-i18next'

const Component = () => {
  const { t } = useTranslation('challenges') // Namespace required
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description', { count: challenges.length })}</p>
    </div>
  )
}
```

### **RTL Support Standards**
```css
/* ✅ REQUIRED: RTL-friendly spacing */
.component {
  margin-inline-start: 1rem;  /* Use logical properties */
  margin-inline-end: 0.5rem;
  padding-inline: 1rem;
}

/* ✅ REQUIRED: Direction-aware styles */
[dir="rtl"] .component {
  text-align: right;
}

[dir="ltr"] .component {
  text-align: left;
}
```

---

## ♿ **ACCESSIBILITY STANDARDS (WCAG 2.1 AA)**

### **Mandatory Requirements**
- **Color Contrast**: 4.5:1 minimum for normal text, 3:1 for large text
- **Keyboard Navigation**: All functionality accessible via keyboard
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Touch Targets**: Minimum 44px × 44px for interactive elements

### **Implementation Standards**
```jsx
// ✅ REQUIRED: Proper accessibility attributes
const AccessibleButton = ({ children, onClick, ...props }) => (
  <button
    onClick={onClick}
    aria-label={props['aria-label']}
    className="min-h-[44px] min-w-[44px] focus:ring-2 focus:ring-primary focus:ring-offset-2"
    {...props}
  >
    {children}
  </button>
)

// ✅ REQUIRED: Form accessibility
const AccessibleForm = () => (
  <form>
    <label htmlFor="email">Email Address *</label>
    <input
      id="email"
      type="email"
      required
      aria-describedby="email-error"
      aria-invalid={hasError ? 'true' : 'false'}
    />
    {hasError && (
      <div id="email-error" role="alert">
        Please enter a valid email address
      </div>
    )}
  </form>
)
```

---

## 🧪 **TESTING STANDARDS**

### **Testing Requirements**
- **Unit Tests**: All components, hooks, and utilities
- **Integration Tests**: API endpoints and database operations
- **E2E Tests**: Critical user workflows
- **Accessibility Tests**: Using jest-axe and manual testing

### **Testing Implementation**
```typescript
// ✅ REQUIRED: Comprehensive component testing
describe('ChallengeCard', () => {
  const mockChallenge: Challenge = {
    id: '1',
    title: 'Test Challenge',
    description: 'Test description',
    deadline: new Date('2024-12-31'),
    status: 'active'
  }
  
  it('renders challenge information correctly', () => {
    render(<ChallengeCard challenge={mockChallenge} />)
    
    expect(screen.getByText('Test Challenge')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })
  
  it('supports RTL layout', () => {
    render(
      <I18nextProvider i18n={i18nAr}>
        <ChallengeCard challenge={mockChallenge} />
      </I18nextProvider>
    )
    
    expect(document.dir).toBe('rtl')
  })
})
```

---

## 🔄 **DEVELOPMENT WORKFLOW STANDARDS**

### **Daily Development Process**
```bash
# ✅ REQUIRED: Morning routine (10 minutes)
git checkout main && git pull origin main
npm install  # Only if package.json changed
npm run dev  # Terminal 1
npm run type-check && npm run lint  # Terminal 2

# ✅ REQUIRED: Quality gates before commits
npm run lint:fix          # Auto-fix linting issues
npm run type-check        # Ensure type safety
npm run test              # All tests pass
npm run build             # Verify production build
```

### **Git Standards**
```bash
# ✅ REQUIRED: Commit message convention
# Format: type(scope): description
feat(challenges): add evaluation criteria management
fix(dashboard): resolve performance issue with large datasets  
docs(api): update authentication documentation
style(ui): improve button hover states
refactor(hooks): optimize database query patterns
test(components): add unit tests for idea submission
chore(deps): update dependencies to latest versions
```

### **Branch Naming**
```bash
# ✅ REQUIRED: Branch naming conventions
feature/challenge-evaluation-system
feature/ai-powered-idea-analysis
fix/dashboard-performance-issue
fix/authentication-token-refresh
docs/api-documentation-update
docs/component-usage-guide
```

---

## 🚀 **PERFORMANCE STANDARDS**

### **Bundle Optimization**
- **Code Splitting**: Use React.lazy() for route-level components
- **Tree Shaking**: Import only needed functions from libraries
- **Image Optimization**: Use appropriate formats and lazy loading
- **Caching**: Implement proper browser caching strategies

### **Performance Monitoring**
```bash
# ✅ REQUIRED: Regular performance checks
npm run analyze          # Bundle analysis
npm run dev -- --profile # React DevTools Profiler
time npm run build       # Build time optimization
```

---

## 📊 **QUALITY METRICS & TARGETS**

### **Code Quality Targets**
- **TypeScript**: 100% type coverage, no `any` types
- **ESLint**: 0 errors, 0 warnings
- **Test Coverage**: 80% minimum, 100% for critical business logic
- **Accessibility**: WCAG 2.1 AA compliance (100%)
- **Performance**: Lighthouse score 90+

### **Security Targets**
- **RLS Policies**: 100% coverage for user data
- **Authentication**: JWT-based with proper token management
- **Audit Logging**: All critical actions logged
- **Vulnerability Scanning**: 0 critical vulnerabilities

---

## 🗄️ **DATABASE & SUPABASE STANDARDS**

### **Database Design Rules**
- **NEVER reference auth.users directly** - use profiles table
- **Always implement RLS policies** for user data
- **Use triggers for validation** instead of CHECK constraints
- **Implement comprehensive audit logging**

### **Supabase Integration**
```typescript
// ✅ REQUIRED: Proper Supabase client usage
import { supabase } from '@/integrations/supabase/client'

const fetchUserData = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) throw error
  return data
}
```

---

## 🚨 **FORBIDDEN PRACTICES**

### **Never Do These:**
```typescript
// ❌ FORBIDDEN: Direct color usage
className="text-white bg-black border-gray-200"

// ❌ FORBIDDEN: Any types
const data: any = {}
function process(input) { return input }

// ❌ FORBIDDEN: Direct auth.users references
.from('auth.users') // Use profiles table instead

// ❌ FORBIDDEN: Environment variables
process.env.VITE_API_KEY // Not supported in Lovable

// ❌ FORBIDDEN: Modifying read-only files
// - package.json (use lov-add-dependency)
// - src/integrations/supabase/types.ts
// - components.json

// ❌ FORBIDDEN: Sequential tool calls
// Use parallel tool calls instead for efficiency

// ❌ FORBIDDEN: Scope creep
// Only implement what user explicitly requests
```

---

## ✅ **QUALITY CHECKLIST**

### **Before Every Code Submission:**
- [ ] All tests pass locally
- [ ] TypeScript compilation succeeds with no errors
- [ ] ESLint rules followed (0 errors, 0 warnings)
- [ ] No `console.log` statements in production code
- [ ] Translation keys added for new text
- [ ] Components follow established patterns
- [ ] Proper error handling implemented
- [ ] Performance considerations addressed
- [ ] Accessibility standards met (WCAG 2.1 AA)
- [ ] Documentation updated if needed
- [ ] Security considerations addressed
- [ ] RTL layout tested
- [ ] Responsive design verified

---

## 🎯 **SUCCESS CRITERIA**

### **Definition of Done:**
1. **Functionality**: Feature works as specified
2. **Quality**: Passes all quality gates and tests
3. **Performance**: Meets performance benchmarks
4. **Accessibility**: WCAG 2.1 AA compliant
5. **Security**: Follows security best practices
6. **Documentation**: Properly documented
7. **Review**: Code review completed and approved

---

*These rules and guidelines ensure consistent, high-quality, secure, and maintainable code across the entire Saudi Arabia Innovate Platform. All AI-generated code MUST follow these standards without exception.*