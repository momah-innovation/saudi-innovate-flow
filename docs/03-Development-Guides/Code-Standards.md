# 📋 Code Standards & Best Practices

## 🎯 **CODE QUALITY PRINCIPLES**

The Ruwād Innovation Platform maintains high code quality through consistent standards, automated tooling, and best practices.

## 📐 **TYPESCRIPT STANDARDS**

### **Type Definitions**
```typescript
// ✅ GOOD: Explicit interface definitions
interface UserProfile {
  readonly id: string
  email: string
  displayName: string | null
  avatarUrl?: string
  metadata: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

// ✅ GOOD: Generic type constraints
interface Repository<T extends { id: string }> {
  findById(id: string): Promise<T | null>
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>
  update(id: string, data: Partial<T>): Promise<T>
}

// ❌ AVOID: Any types
const userData: any = {}

// ❌ AVOID: Implicit any
function processData(data) {
  return data.someProperty
}
```

### **Function Signatures**
```typescript
// ✅ GOOD: Explicit return types
function calculateEngagementScore(
  submissions: number,
  participations: number,
  timeframe: 'weekly' | 'monthly'
): number {
  return (submissions * 2 + participations) / getDaysInTimeframe(timeframe)
}

// ✅ GOOD: Async function typing
async function fetchUserChallenges(
  userId: string,
  options?: FetchOptions
): Promise<Challenge[]> {
  const response = await api.get(`/users/${userId}/challenges`, options)
  return response.data
}
```

## ⚛️ **REACT COMPONENT STANDARDS**

### **Component Structure**
```typescript
// ✅ GOOD: Component template
import React, { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ChallengeCardProps {
  challenge: Challenge
  onSubmit?: (challengeId: string) => void
  showActions?: boolean
  className?: string
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
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
    if (!onSubmit) return
    
    setIsSubmitting(true)
    try {
      await onSubmit(challenge.id)
    } catch (error) {
      console.error('Submission failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [challenge.id, onSubmit])
  
  return (
    <Card className={className}>
      {/* Component JSX */}
    </Card>
  )
}

// Export with display name for debugging
ChallengeCard.displayName = 'ChallengeCard'
```

### **Hooks Standards**
```typescript
// ✅ GOOD: Custom hook structure
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

// ✅ GOOD: Complex hook with multiple states
export const useChallengeSubmission = (challengeId: string) => {
  const [formData, setFormData] = useState<SubmissionFormData>({})
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  
  const submitMutation = useMutation({
    mutationFn: (data: SubmissionFormData) => 
      submitChallengeIdea(challengeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['challenges', challengeId])
      toast.success('Submission successful!')
    },
    onError: (error) => {
      toast.error('Submission failed. Please try again.')
      console.error('Submission error:', error)
    }
  })
  
  return {
    formData,
    setFormData,
    validationErrors,
    setValidationErrors,
    submit: submitMutation.mutate,
    isSubmitting: submitMutation.isPending,
    isSuccess: submitMutation.isSuccess
  }
}
```

## 🎨 **STYLING STANDARDS**

### **Design System Usage**
```typescript
// ✅ GOOD: Semantic design tokens
const styles = {
  card: 'bg-card text-card-foreground border-border',
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  
  // RTL-friendly spacing
  spacing: 'ms-4 me-2 ps-6 pe-4',
  
  // Responsive design
  responsive: 'flex flex-col md:flex-row lg:grid lg:grid-cols-3'
}

// ❌ AVOID: Direct colors
const badStyles = {
  card: 'bg-white text-black border-gray-200',
  button: 'bg-blue-500 text-white hover:bg-blue-600'
}
```

### **Component Variants**
```typescript
// ✅ GOOD: CVA variant definitions
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

## 🔄 **STATE MANAGEMENT PATTERNS**

### **React Query Standards**
```typescript
// ✅ GOOD: Query key factory
export const challengeKeys = {
  all: ['challenges'] as const,
  lists: () => [...challengeKeys.all, 'list'] as const,
  list: (filters: string) => [...challengeKeys.lists(), { filters }] as const,
  details: () => [...challengeKeys.all, 'detail'] as const,
  detail: (id: string) => [...challengeKeys.details(), id] as const,
  submissions: (id: string) => [...challengeKeys.detail(id), 'submissions'] as const,
}

// ✅ GOOD: Optimistic updates
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

## 🛡️ **ERROR HANDLING STANDARDS**

### **Error Boundary Implementation**
```typescript
// ✅ GOOD: Comprehensive error boundary
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<ErrorFallbackProps> },
  { hasError: boolean; error: Error | null }
> {
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
    errorReporter.captureException(error, {
      contexts: { react: errorInfo },
      tags: { component: 'ErrorBoundary' }
    })
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

### **API Error Handling**
```typescript
// ✅ GOOD: Structured error handling
export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof SupabaseError) {
    return {
      type: 'database',
      message: error.message,
      code: error.code,
      details: error.details
    }
  }
  
  if (error instanceof NetworkError) {
    return {
      type: 'network',
      message: 'Network connection failed',
      retry: true
    }
  }
  
  return {
    type: 'unknown',
    message: 'An unexpected error occurred'
  }
}
```

## 📝 **DOCUMENTATION STANDARDS**

### **TSDoc Comments**
```typescript
/**
 * Calculates user engagement score based on activity metrics
 * 
 * @param activities - Array of user activities
 * @param timeframe - Time period for calculation ('weekly' | 'monthly')
 * @returns Normalized engagement score between 0-100
 * 
 * @example
 * ```typescript
 * const score = calculateEngagementScore(userActivities, 'weekly')
 * console.log(`Engagement score: ${score}%`)
 * ```
 */
export function calculateEngagementScore(
  activities: UserActivity[],
  timeframe: 'weekly' | 'monthly'
): number {
  // Implementation
}

/**
 * Custom hook for managing challenge submission state
 * 
 * @param challengeId - Unique identifier for the challenge
 * @returns Object containing submission state and actions
 * 
 * @example
 * ```typescript
 * const { formData, submit, isSubmitting } = useChallengeSubmission(challengeId)
 * ```
 */
export const useChallengeSubmission = (challengeId: string) => {
  // Implementation
}
```

## 🧪 **TESTING STANDARDS**

### **Component Testing**
```typescript
// ✅ GOOD: Comprehensive component test
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
  
  it('handles submission action', async () => {
    const mockOnSubmit = vi.fn()
    
    render(<ChallengeCard challenge={mockChallenge} onSubmit={mockOnSubmit} />)
    
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    expect(mockOnSubmit).toHaveBeenCalledWith('1')
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

### **Hook Testing**
```typescript
// ✅ GOOD: Hook test with React Query
describe('useChallenge', () => {
  it('fetches challenge data successfully', async () => {
    const mockChallenge = { id: '1', title: 'Test' }
    
    server.use(
      http.get('/api/challenges/1', () => {
        return HttpResponse.json(mockChallenge)
      })
    )
    
    const { result } = renderHook(() => useChallenge('1'), {
      wrapper: createTestQueryWrapper()
    })
    
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    
    expect(result.current.data).toEqual(mockChallenge)
  })
})
```

---

*These standards ensure consistent, maintainable, and high-quality code across the platform.*