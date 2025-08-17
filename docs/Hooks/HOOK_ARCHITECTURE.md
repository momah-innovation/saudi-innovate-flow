# Hook Architecture Documentation

## Overview

This document describes the unified hook architecture used throughout the Supabase migration project. All hooks follow consistent patterns for error handling, data management, and TypeScript compliance.

## Core Principles

### 1. Unified Error Handling
All hooks use the `createErrorHandler` utility for consistent error management:

```typescript
import { createErrorHandler } from '@/utils/unified-error-handler';

export const useCustomHook = () => {
  const errorHandler = createErrorHandler({ 
    component: 'ComponentName' 
  });
  
  // Use errorHandler.withErrorHandling() for all operations
};
```

### 2. React Query Integration
All data fetching hooks use React Query for caching and state management:

```typescript
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['unique-key'],
  queryFn: () => errorHandler.withErrorHandling(
    () => fetchData(),
    { operation: 'operation_name' }
  ),
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000,   // 10 minutes
});
```

### 3. Mock Data Fallbacks
For missing database tables, hooks provide mock data:

```typescript
const mockData = useMemo(() => [
  {
    id: '1',
    name: 'Sample Data',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
], []);

const { data = mockData } = useQuery({
  // ... query configuration
});
```

## Hook Categories

### Admin Operations Hooks
- `useAdminDashboard` - Dashboard metrics and analytics
- `useUserManagement` - User CRUD operations
- `useSystemMetrics` - System performance monitoring
- `useAdminEvents` - Event management for admins
- `useAdminChallenges` - Challenge administration
- `useSecurityAudit` - Security monitoring and audit logs

### Management Hooks
- `useRelationshipData` - Partnership and relationship management
- `useRoleManagement` - Role assignment and permissions
- `useTranslationManagement` - Localization and translations
- `useUserInvitation` - User invitation system
- `useStorageOperations` - File and storage management

### Utility Hooks
- `useAuditLogs` - Audit log viewing
- `useSystemConfig` - System configuration
- `usePermissions` - Permission checking
- `useCache` - Caching operations
- `useValidation` - Form validation
- `useToast` - Toast notifications

## Standard Hook Template

```typescript
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createErrorHandler } from '@/utils/unified-error-handler';

export interface DataItem {
  id: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useDataManagement = () => {
  const errorHandler = createErrorHandler({ 
    component: 'useDataManagement' 
  });

  // Data fetching
  const {
    data: items = [],
    isLoading: loading,
    error,
    refetch: loadItems,
    isError
  } = useQuery({
    queryKey: ['data-items'],
    queryFn: async () => {
      // Mock implementation for missing tables
      const mockItems: DataItem[] = [
        {
          id: '1',
          name: 'Sample Item',
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      return mockItems;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // CRUD operations
  const createItem = useCallback(async (itemData: Partial<DataItem>): Promise<DataItem> => {
    return errorHandler.withErrorHandling(async () => {
      // Implementation here
      const newItem: DataItem = {
        id: Math.random().toString(36).substring(2),
        name: itemData.name || 'New Item',
        status: itemData.status || 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      await loadItems(); // Refresh data
      return newItem;
    }, { operation: 'create_item' }) || {} as DataItem;
  }, [loadItems, errorHandler]);

  const updateItem = useCallback(async (itemId: string, itemData: Partial<DataItem>): Promise<DataItem> => {
    return errorHandler.withErrorHandling(async () => {
      // Implementation here
      const updatedItem: DataItem = {
        id: itemId,
        name: itemData.name || 'Updated Item',
        status: itemData.status || 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      await loadItems(); // Refresh data
      return updatedItem;
    }, { operation: 'update_item' }) || {} as DataItem;
  }, [loadItems, errorHandler]);

  const deleteItem = useCallback(async (itemId: string): Promise<void> => {
    await errorHandler.withErrorHandling(async () => {
      // Implementation here
      await loadItems(); // Refresh data
    }, { operation: 'delete_item' });
  }, [loadItems, errorHandler]);

  return {
    items,
    loading,
    error: isError ? error : null,
    loadItems,
    createItem,
    updateItem,
    deleteItem
  };
};
```

## Error Handling Patterns

### Async Operations
```typescript
const result = await errorHandler.withErrorHandling(
  () => performAsyncOperation(),
  { operation: 'operation_name' }
);
```

### Sync Operations
```typescript
const result = errorHandler.withSyncErrorHandling(
  () => performSyncOperation(),
  { operation: 'operation_name' }
);
```

### Custom Error Messages
```typescript
const result = await errorHandler.withErrorHandling(
  () => performOperation(),
  { operation: 'operation_name' },
  'Custom error message for user'
);
```

## TypeScript Compliance

### Interface Definitions
```typescript
export interface DataItem {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}
```

### Hook Return Types
```typescript
export const useDataManagement = (): {
  items: DataItem[];
  loading: boolean;
  error: Error | null;
  loadItems: () => void;
  createItem: (data: Partial<DataItem>) => Promise<DataItem>;
  updateItem: (id: string, data: Partial<DataItem>) => Promise<DataItem>;
  deleteItem: (id: string) => Promise<void>;
} => {
  // Implementation
};
```

## Performance Optimization

### Query Configuration
```typescript
const { data } = useQuery({
  queryKey: ['data', filters], // Include dependencies
  queryFn: fetchData,
  staleTime: 5 * 60 * 1000,    // 5 minutes fresh
  gcTime: 10 * 60 * 1000,      // 10 minutes in cache
  enabled: !!userId,            // Conditional fetching
  refetchOnWindowFocus: false,  // Reduce unnecessary requests
});
```

### Memoization
```typescript
const memoizedData = useMemo(() => {
  return processData(rawData);
}, [rawData]);

const memoizedCallback = useCallback(async (params) => {
  return performOperation(params);
}, [dependency]);
```

## Testing Considerations

### Mock Hook Implementation
```typescript
// For testing
export const mockUseDataManagement = {
  items: mockItems,
  loading: false,
  error: null,
  loadItems: jest.fn(),
  createItem: jest.fn(),
  updateItem: jest.fn(),
  deleteItem: jest.fn()
};
```

### Error State Testing
```typescript
// Test error scenarios
const errorHandler = createErrorHandler({ 
  component: 'TestComponent',
  showToast: false, // Disable toasts in tests
  logError: false   // Disable logging in tests
});
```

## Best Practices

1. **Always use unified error handling**
2. **Include loading and error states**
3. **Provide TypeScript interfaces**
4. **Use React Query for caching**
5. **Implement mock data fallbacks**
6. **Memoize expensive operations**
7. **Follow consistent naming conventions**
8. **Document hook purpose and usage**
9. **Test error scenarios**
10. **Keep hooks focused and single-purpose**

## Migration Guidelines

### Converting Components
1. Identify direct Supabase calls
2. Find or create appropriate hook
3. Replace direct calls with hook usage
4. Remove Supabase imports
5. Test functionality
6. Update documentation

### Creating New Hooks
1. Use standard template
2. Implement unified error handling
3. Add TypeScript interfaces
4. Include mock data fallbacks
5. Write tests
6. Document usage examples

This architecture ensures consistency, reliability, and maintainability across all hooks in the project.