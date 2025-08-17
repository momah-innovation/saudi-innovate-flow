# 🔄 State Management Guide

## Overview
Comprehensive guide for managing state in the Ruwād Platform using React Query, React Context, and local state patterns.

## State Management Architecture

### State Categories
1. **Server State**: Data from APIs (React Query)
2. **Client State**: UI state and user interactions (React useState/useReducer)
3. **Global State**: Application-wide state (React Context)
4. **Persistent State**: Data that survives page refreshes (localStorage/sessionStorage)

## React Query for Server State

### Configuration
```typescript
// File: src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        console.error('Mutation error:', error);
      }
    }
  }
});
```

### Query Patterns
```typescript
// Basic query
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000
  });
};

// Parameterized query
export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId
  });
};

// Dependent query
export const useUserProjects = (userId?: string) => {
  return useQuery({
    queryKey: ['users', userId, 'projects'],
    queryFn: () => fetchUserProjects(userId!),
    enabled: !!userId
  });
};

// Infinite query for pagination
export const useInfiniteProjects = () => {
  return useInfiniteQuery({
    queryKey: ['projects', 'infinite'],
    queryFn: ({ pageParam = 0 }) => fetchProjects(pageParam),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length : undefined;
    },
    initialPageParam: 0
  });
};
```

### Mutation Patterns
```typescript
// Basic mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createUser,
    onSuccess: (newUser) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      // Optionally add to cache immediately
      queryClient.setQueryData(['users', newUser.id], newUser);
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
    }
  });
};

// Optimistic update
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      updateUser(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['users', id] });
      
      // Snapshot the previous value
      const previousUser = queryClient.getQueryData(['users', id]);
      
      // Optimistically update
      queryClient.setQueryData(['users', id], (old: User) => ({
        ...old,
        ...data
      }));
      
      return { previousUser };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(['users', variables.id], context.previousUser);
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
    }
  });
};
```

## React Context for Global State

### Auth Context
```typescript
// File: src/contexts/AuthContext.tsx
interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false
  });

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const session = await supabase.auth.getSession();
        if (session.data.session) {
          const user = await fetchUserProfile(session.data.session.user.id);
          setState({
            user,
            loading: false,
            isAuthenticated: true
          });
        } else {
          setState({
            user: null,
            loading: false,
            isAuthenticated: false
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setState({
          user: null,
          loading: false,
          isAuthenticated: false
        });
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const user = await fetchUserProfile(session.user.id);
          setState({
            user,
            loading: false,
            isAuthenticated: true
          });
        } else {
          setState({
            user: null,
            loading: false,
            isAuthenticated: false
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    ...state,
    signIn,
    signOut,
    signUp: async (email: string, password: string) => {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    },
    resetPassword: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### Theme Context
```typescript
// File: src/contexts/ThemeContext.tsx
interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  actualTheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>(() => {
    const stored = localStorage.getItem('theme');
    return (stored as 'light' | 'dark' | 'system') || 'system';
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateActualTheme = () => {
      if (theme === 'system') {
        setActualTheme(mediaQuery.matches ? 'dark' : 'light');
      } else {
        setActualTheme(theme);
      }
    };

    updateActualTheme();
    mediaQuery.addEventListener('change', updateActualTheme);
    
    return () => mediaQuery.removeEventListener('change', updateActualTheme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', actualTheme === 'dark');
  }, [actualTheme]);

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, actualTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

## Local State Patterns

### Component State
```typescript
// Simple component state
const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    bio: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form implementation */}
    </form>
  );
};

// Complex state with useReducer
interface FormState {
  data: UserFormData;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isDirty: boolean;
}

type FormAction =
  | { type: 'SET_FIELD'; field: string; value: any }
  | { type: 'SET_ERROR'; field: string; error: string }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'RESET_FORM'; initialData: UserFormData };

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        data: { ...state.data, [action.field]: action.value },
        isDirty: true,
        errors: { ...state.errors, [action.field]: '' }
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error }
      };
    case 'CLEAR_ERRORS':
      return { ...state, errors: {} };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.isSubmitting };
    case 'RESET_FORM':
      return {
        data: action.initialData,
        errors: {},
        isSubmitting: false,
        isDirty: false
      };
    default:
      return state;
  }
};

const UserProfileForm = ({ initialData }: { initialData: UserFormData }) => {
  const [state, dispatch] = useReducer(formReducer, {
    data: initialData,
    errors: {},
    isSubmitting: false,
    isDirty: false
  });

  const setField = (field: string, value: any) => {
    dispatch({ type: 'SET_FIELD', field, value });
  };

  // Component implementation
};
```

### Custom State Hooks
```typescript
// Generic form state hook
export const useForm = <T extends Record<string, any>>(
  initialData: T,
  validationSchema?: ValidationSchema<T>
) => {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const setField = useCallback((field: keyof T, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const validate = useCallback(() => {
    if (!validationSchema) return true;
    
    const validationErrors = validationSchema.validate(data);
    setErrors(validationErrors);
    
    return Object.keys(validationErrors).length === 0;
  }, [data, validationSchema]);

  const reset = useCallback(() => {
    setData(initialData);
    setErrors({} as Record<keyof T, string>);
    setIsSubmitting(false);
    setIsDirty(false);
  }, [initialData]);

  return {
    data,
    errors,
    isSubmitting,
    isDirty,
    setField,
    setIsSubmitting,
    validate,
    reset
  };
};

// Modal state hook
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<any>(null);

  const open = useCallback((modalData?: any) => {
    setData(modalData);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  return {
    isOpen,
    data,
    open,
    close
  };
};

// Selection state hook
export const useSelection = <T extends { id: string }>(items: T[]) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const selectedItems = useMemo(() => 
    items.filter(item => selectedIds.has(item.id)),
    [items, selectedIds]
  );

  const toggle = useCallback((id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map(item => item.id)));
  }, [items]);

  const selectNone = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isSelected = useCallback((id: string) => {
    return selectedIds.has(id);
  }, [selectedIds]);

  return {
    selectedIds,
    selectedItems,
    toggle,
    selectAll,
    selectNone,
    isSelected,
    hasSelection: selectedIds.size > 0,
    selectionCount: selectedIds.size
  };
};
```

## Persistent State

### LocalStorage Integration
```typescript
// Custom hook for localStorage
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// Usage
const UserPreferences = () => {
  const [preferences, setPreferences] = useLocalStorage('userPreferences', {
    notifications: true,
    theme: 'light',
    language: 'en'
  });

  const updatePreference = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      {/* Preferences UI */}
    </div>
  );
};
```

## State Synchronization

### Cross-Component Communication
```typescript
// Event-based communication
export const useEventBus = () => {
  const emit = useCallback((event: string, data?: any) => {
    window.dispatchEvent(new CustomEvent(event, { detail: data }));
  }, []);

  const on = useCallback((event: string, handler: (data: any) => void) => {
    const listener = (e: CustomEvent) => handler(e.detail);
    window.addEventListener(event, listener as EventListener);
    
    return () => window.removeEventListener(event, listener as EventListener);
  }, []);

  return { emit, on };
};

// Usage
const ComponentA = () => {
  const { emit } = useEventBus();
  
  const handleAction = () => {
    emit('data-updated', { id: 123, name: 'Updated' });
  };
  
  return <button onClick={handleAction}>Update Data</button>;
};

const ComponentB = () => {
  const { on } = useEventBus();
  const [data, setData] = useState(null);
  
  useEffect(() => {
    return on('data-updated', (newData) => {
      setData(newData);
    });
  }, [on]);
  
  return <div>{data ? `Updated: ${data.name}` : 'No data'}</div>;
};
```

## Performance Considerations

### State Optimization
```typescript
// Memoize expensive computations
const ExpensiveComponent = ({ items }: { items: Item[] }) => {
  const expensiveValue = useMemo(() => {
    return items.reduce((acc, item) => {
      // Expensive computation
      return acc + computeExpensiveValue(item);
    }, 0);
  }, [items]);

  return <div>{expensiveValue}</div>;
};

// Optimize context re-renders
const OptimizedContext = createContext<ContextType | undefined>(undefined);

export const OptimizedProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState(initialState);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    state,
    actions: {
      updateState: (newState: Partial<StateType>) => {
        setState(prev => ({ ...prev, ...newState }));
      }
    }
  }), [state]);

  return (
    <OptimizedContext.Provider value={value}>
      {children}
    </OptimizedContext.Provider>
  );
};
```

---

**State Categories**: Server, Client, Global, Persistent  
**Primary Tools**: React Query, React Context, Custom Hooks  
**Performance Focus**: Memoization and optimization patterns