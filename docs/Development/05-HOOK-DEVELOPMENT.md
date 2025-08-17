# 🎣 Hook Development Guide

## Overview
Comprehensive guide for developing custom React hooks following the platform's hook-first architecture pattern.

## Hook Architecture Pattern

### Standard Hook Structure
```typescript
// File: src/hooks/useFeatureName.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createErrorHandler } from '@/utils/errorHandler';

interface FeatureData {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface FeatureHook {
  data: FeatureData[];
  loading: boolean;
  error: Error | null;
  actions: {
    create: (data: Partial<FeatureData>) => Promise<void>;
    update: (id: string, data: Partial<FeatureData>) => Promise<void>;
    delete: (id: string) => Promise<void>;
    refresh: () => void;
  };
}

export const useFeatureName = (): FeatureHook => {
  const queryClient = useQueryClient();
  const errorHandler = createErrorHandler({
    component: 'useFeatureName',
    showToast: true
  });

  // Query implementation
  const { data, isLoading, error } = useQuery({
    queryKey: ['feature-name'],
    queryFn: fetchFeatureData,
    onError: errorHandler.handle
  });

  // Mutation implementations
  const createMutation = useMutation({
    mutationFn: createFeatureData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-name'] });
    },
    onError: errorHandler.handle
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FeatureData> }) =>
      updateFeatureData(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-name'] });
    },
    onError: errorHandler.handle
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFeatureData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-name'] });
    },
    onError: errorHandler.handle
  });

  return {
    data: data || [],
    loading: isLoading,
    error,
    actions: {
      create: createMutation.mutateAsync,
      update: (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: deleteMutation.mutateAsync,
      refresh: () => queryClient.invalidateQueries({ queryKey: ['feature-name'] })
    }
  };
};
```

## Hook Categories

### 1. Data Management Hooks
- **Purpose**: Handle CRUD operations and data fetching
- **Pattern**: React Query integration with error handling
- **Examples**: `useUsers`, `useProjects`, `useNotifications`

### 2. UI State Hooks
- **Purpose**: Manage component-specific state and interactions
- **Pattern**: useState with derived state and actions
- **Examples**: `useModal`, `useForm`, `useSelection`

### 3. Integration Hooks
- **Purpose**: Connect with external services and APIs
- **Pattern**: Service abstraction with error boundaries
- **Examples**: `useAuth`, `useSupabase`, `useAnalytics`

### 4. Utility Hooks
- **Purpose**: Provide reusable functionality across components
- **Pattern**: Generic implementation with TypeScript generics
- **Examples**: `useDebounce`, `useLocalStorage`, `usePagination`

## Development Process

### 1. Planning Phase
```typescript
// Step 1: Define the hook's purpose and interface
interface HookInterface {
  // What data does this hook provide?
  data: DataType[];
  
  // What loading states are needed?
  loading: boolean;
  error: Error | null;
  
  // What actions can be performed?
  actions: {
    // Define all available actions
  };
}

// Step 2: Identify dependencies
// - React Query for server state
// - Supabase for data persistence
// - Error handling utilities
// - Local storage for client state
```

### 2. Implementation Phase
```typescript
// Step 1: Set up the hook structure
export const useCustomHook = (config?: HookConfig): HookReturn => {
  // Initialize dependencies
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const errorHandler = createErrorHandler(config?.errorConfig);

  // Step 2: Implement data fetching
  const queryResult = useQuery({
    queryKey: ['custom-hook', user?.id],
    queryFn: () => fetchData(user?.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: errorHandler.handle
  });

  // Step 3: Implement mutations
  const mutations = {
    create: useMutation({
      mutationFn: createData,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['custom-hook'] });
      }
    }),
    // ... other mutations
  };

  // Step 4: Return standardized interface
  return {
    data: queryResult.data || [],
    loading: queryResult.isLoading,
    error: queryResult.error,
    actions: {
      create: mutations.create.mutateAsync,
      // ... other actions
    }
  };
};
```

### 3. Testing Phase
```typescript
// File: src/hooks/__tests__/useCustomHook.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCustomHook } from '../useCustomHook';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useCustomHook', () => {
  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useCustomHook(), {
      wrapper: createWrapper()
    });

    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle data fetching', async () => {
    const { result } = renderHook(() => useCustomHook(), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });

  it('should handle mutations', async () => {
    const { result } = renderHook(() => useCustomHook(), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.actions.create).toBeDefined();
    });
  });
});
```

## Best Practices

### Error Handling
```typescript
// Centralized error handling
const errorHandler = createErrorHandler({
  component: 'useFeatureName',
  showToast: true,
  logToConsole: true,
  reportToService: true
});

// Use in queries and mutations
const { data } = useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  onError: errorHandler.handle
});
```

### Performance Optimization
```typescript
// Memoize expensive computations
const processedData = useMemo(() => {
  return data?.map(item => processItem(item)) || [];
}, [data]);

// Debounce user input
const debouncedSearch = useDebounce(searchTerm, 300);

// Use callback for stable references
const handleAction = useCallback((id: string) => {
  actions.update(id, { status: 'active' });
}, [actions.update]);
```

### TypeScript Integration
```typescript
// Generic hooks for reusability
export const useDataManagement = <T extends BaseEntity>(
  resource: string,
  options?: DataManagementOptions
): DataManagementHook<T> => {
  // Implementation
};

// Strict typing for hook returns
interface StrictHookReturn {
  data: readonly DataType[];
  loading: boolean;
  error: Error | null;
  actions: Readonly<{
    create: (data: CreateData) => Promise<DataType>;
    update: (id: string, data: UpdateData) => Promise<DataType>;
    delete: (id: string) => Promise<void>;
  }>;
}
```

## Hook Composition

### Combining Multiple Hooks
```typescript
// High-level hook that combines multiple data sources
export const useDashboardData = () => {
  const { data: users, loading: usersLoading } = useUsers();
  const { data: projects, loading: projectsLoading } = useProjects();
  const { data: analytics, loading: analyticsLoading } = useAnalytics();

  const loading = usersLoading || projectsLoading || analyticsLoading;

  const dashboardData = useMemo(() => ({
    users,
    projects,
    analytics,
    summary: {
      totalUsers: users.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
      // ... other computed values
    }
  }), [users, projects, analytics]);

  return {
    data: dashboardData,
    loading,
    refresh: () => {
      // Refresh all data sources
    }
  };
};
```

### Hook Dependencies
```typescript
// Child hook depends on parent hook
export const useProjectTasks = (projectId?: string) => {
  const { data: tasks, loading, error, actions } = useQuery({
    queryKey: ['project-tasks', projectId],
    queryFn: () => fetchProjectTasks(projectId!),
    enabled: !!projectId,
    onError: errorHandler.handle
  });

  return {
    data: tasks || [],
    loading,
    error,
    actions
  };
};

// Parent component usage
const ProjectView = ({ projectId }: { projectId: string }) => {
  const { data: project } = useProject(projectId);
  const { data: tasks } = useProjectTasks(projectId);
  
  // Component implementation
};
```

## Hook Documentation

### Documentation Template
```typescript
/**
 * Custom hook for managing feature data with CRUD operations
 * 
 * @param config - Optional configuration for the hook
 * @returns Hook interface with data, loading state, and actions
 * 
 * @example
 * ```typescript
 * const { data, loading, actions } = useFeatureName({
 *   autoRefresh: true,
 *   errorHandling: { showToast: true }
 * });
 * 
 * // Create new item
 * await actions.create({ name: 'New Item' });
 * 
 * // Update existing item
 * await actions.update(itemId, { status: 'active' });
 * ```
 */
export const useFeatureName = (config?: FeatureConfig): FeatureHook => {
  // Implementation
};
```

## Common Patterns

### Loading States
```typescript
// Multiple loading states
export const useComplexData = () => {
  const [localLoading, setLocalLoading] = useState(false);
  const { data, isLoading: queryLoading } = useQuery(/* ... */);
  
  const loading = queryLoading || localLoading;
  
  return { data, loading };
};
```

### Optimistic Updates
```typescript
// Optimistic UI updates
const updateMutation = useMutation({
  mutationFn: updateData,
  onMutate: async (newData) => {
    await queryClient.cancelQueries({ queryKey: ['data'] });
    const previousData = queryClient.getQueryData(['data']);
    
    queryClient.setQueryData(['data'], (old: DataType[]) =>
      old.map(item => item.id === newData.id ? { ...item, ...newData } : item)
    );
    
    return { previousData };
  },
  onError: (err, newData, context) => {
    queryClient.setQueryData(['data'], context?.previousData);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['data'] });
  }
});
```

---

**Development Time**: ~2-4 hours per hook  
**Testing Coverage**: >90% required  
**Documentation**: JSDoc comments mandatory
