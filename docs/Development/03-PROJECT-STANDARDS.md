# 📋 Project Standards & Conventions

## Code Style & Formatting

### TypeScript Standards
```typescript
// ✅ Good: Explicit types with clear interfaces
interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  createdAt: Date;
}

// ✅ Good: Generic type constraints
interface ApiResponse<T extends Record<string, any>> {
  data: T;
  message: string;
  success: boolean;
}

// ❌ Avoid: any types
const userData: any = {};

// ✅ Good: Proper type assertions
const userElement = document.getElementById('user') as HTMLInputElement;
```

### Naming Conventions

#### Variables & Functions
```typescript
// ✅ CamelCase for variables and functions
const userData = {};
const isUserAuthenticated = true;
const handleUserLogin = () => {};

// ✅ Descriptive boolean names
const isLoading = true;
const hasError = false;
const canEdit = true;
```

#### Components & Interfaces
```typescript
// ✅ PascalCase for components and interfaces
interface UserProfile {
  id: string;
  displayName: string;
}

const UserProfileCard = ({ profile }: { profile: UserProfile }) => {
  return <div>{profile.displayName}</div>;
};
```

#### Files & Directories
```
// ✅ Good file naming
src/
├── components/UserProfile/
│   ├── UserProfile.tsx
│   ├── UserProfile.test.tsx
│   └── index.ts
├── hooks/
│   ├── useUserData.ts
│   └── useUserData.test.ts
└── utils/
    ├── dateHelpers.ts
    └── validationHelpers.ts
```

#### Constants
```typescript
// ✅ SCREAMING_SNAKE_CASE for constants
const API_ENDPOINTS = {
  USERS: '/api/users',
  PROFILES: '/api/profiles'
} as const;

const DEFAULT_PAGE_SIZE = 10;
const MAX_RETRY_ATTEMPTS = 3;
```

## Component Standards

### Component Structure
```typescript
// ✅ Standard component template
import { memo, useCallback } from 'react';
import { createErrorHandler } from '@/utils/errorHandler';

interface ComponentProps {
  data: DataType[];
  onAction?: (item: DataType) => void;
  className?: string;
}

export const Component = memo(({ 
  data, 
  onAction, 
  className 
}: ComponentProps) => {
  const errorHandler = createErrorHandler({
    component: 'Component',
    showToast: true
  });

  const handleAction = useCallback((item: DataType) => {
    errorHandler.withErrorHandling(async () => {
      await onAction?.(item);
    });
  }, [onAction, errorHandler]);

  return (
    <div className={className}>
      {/* Component content */}
    </div>
  );
});

Component.displayName = 'Component';
```

### Props Interface Standards
```typescript
// ✅ Comprehensive props interface
interface ComponentProps {
  // Required props first
  data: DataType[];
  title: string;
  
  // Optional props with defaults
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  
  // Event handlers
  onClick?: (event: MouseEvent) => void;
  onSubmit?: (data: FormData) => Promise<void>;
  
  // Styling props
  className?: string;
  style?: CSSProperties;
  
  // Children and composition
  children?: ReactNode;
  
  // Accessibility props
  'aria-label'?: string;
  'data-testid'?: string;
}
```

## Hook Standards

### Hook Naming & Structure
```typescript
// ✅ Standard hook template
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { createErrorHandler } from '@/utils/errorHandler';

interface EntityData {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

interface UseEntityHook {
  // Data properties
  entities: EntityData[];
  loading: boolean;
  error: Error | null;
  
  // Action methods
  createEntity: (data: Partial<EntityData>) => Promise<EntityData>;
  updateEntity: (id: string, data: Partial<EntityData>) => Promise<EntityData>;
  deleteEntity: (id: string) => Promise<void>;
  refreshEntities: () => Promise<void>;
}

export const useEntity = (): UseEntityHook => {
  const queryClient = useQueryClient();
  const errorHandler = createErrorHandler({
    component: 'useEntity',
    showToast: true
  });

  // Query implementation
  const {
    data: entities = [],
    isLoading: loading,
    error,
    refetch: refreshEntities
  } = useQuery({
    queryKey: ['entities'],
    queryFn: async () => {
      // Implementation
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });

  // Mutation implementations
  const createEntity = useCallback(async (data: Partial<EntityData>) => {
    return await errorHandler.withErrorHandling(async () => {
      // Implementation
      await queryClient.invalidateQueries({ queryKey: ['entities'] });
    });
  }, [queryClient, errorHandler]);

  return {
    entities,
    loading,
    error,
    createEntity,
    updateEntity,
    deleteEntity,
    refreshEntities
  };
};
```

## Error Handling Standards

### Unified Error Handler Usage
```typescript
// ✅ Standard error handling pattern
import { createErrorHandler } from '@/utils/errorHandler';

const errorHandler = createErrorHandler({
  component: 'ComponentName',
  showToast: true,
  logError: true
});

// Async operations
await errorHandler.withErrorHandling(async () => {
  await someAsyncOperation();
});

// Sync operations with custom message
errorHandler.handleError(error, 'Custom error message', { 
  context: 'additional-data' 
});
```

### Error Types
```typescript
// ✅ Custom error types
export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: any
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: any
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}
```

## Testing Standards

### Test Structure
```typescript
// ✅ Standard test structure
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Component } from './Component';

describe('Component', () => {
  // Setup and teardown
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test data
  const mockData = [
    { id: '1', name: 'Test Item 1' },
    { id: '2', name: 'Test Item 2' }
  ];

  // Test cases
  describe('rendering', () => {
    it('should render with provided data', () => {
      render(<Component data={mockData} />);
      
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
      expect(screen.getByText('Test Item 2')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should handle click events', async () => {
      const mockOnClick = vi.fn();
      
      render(<Component data={mockData} onClick={mockOnClick} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(mockOnClick).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('error handling', () => {
    it('should display error message on failure', () => {
      // Error scenario testing
    });
  });
});
```

### Test Naming Conventions
```typescript
// ✅ Descriptive test names
describe('UserProfile Component', () => {
  it('should display user name when data is provided', () => {});
  it('should show loading spinner while fetching data', () => {});
  it('should handle edit button click correctly', () => {});
  it('should validate form fields before submission', () => {});
});
```

## Documentation Standards

### Code Comments
```typescript
/**
 * Calculates the total score based on multiple criteria
 * @param criteria - Array of scoring criteria
 * @param weights - Weight multipliers for each criterion
 * @returns The calculated total score
 */
export const calculateScore = (
  criteria: ScoringCriterion[],
  weights: number[]
): number => {
  // Implementation
};

// ✅ Good: Explain complex business logic
// Calculate weighted average with penalty for missing data
const weightedScore = criteria.reduce((sum, criterion, index) => {
  const weight = weights[index] || 0;
  const penaltyFactor = criterion.isComplete ? 1 : 0.8;
  return sum + (criterion.score * weight * penaltyFactor);
}, 0);
```

### README Standards
```markdown
# Component/Hook Name

## Overview
Brief description of purpose and functionality.

## Usage
```typescript
// Code example
```

## Props/Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| data | Data[] | Yes | Array of data items |

## Examples
Practical usage examples.

## Testing
How to test the component/hook.
```

## Import/Export Standards

### Import Organization
```typescript
// ✅ Organized imports
// 1. React and core libraries
import React, { useState, useEffect, useCallback } from 'react';

// 2. Third-party libraries
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

// 3. Internal utilities and hooks
import { createErrorHandler } from '@/utils/errorHandler';
import { useUserData } from '@/hooks/useUserData';

// 4. Components
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// 5. Types and interfaces
import type { UserData, ComponentProps } from '@/types';
```

### Export Standards
```typescript
// ✅ Named exports preferred
export const Component = () => {};
export const useCustomHook = () => {};
export type { ComponentProps, HookReturn };

// ✅ Default export for main component
export default Component;

// ✅ Re-exports in index files
export { Component } from './Component';
export { useCustomHook } from './useCustomHook';
export type { ComponentProps } from './types';
```

## Performance Standards

### Optimization Patterns
```typescript
// ✅ Memoization for expensive calculations
const expensiveValue = useMemo(() => {
  return complexCalculation(data);
}, [data]);

// ✅ Callback memoization for event handlers
const handleClick = useCallback((id: string) => {
  onItemClick(id);
}, [onItemClick]);

// ✅ Component memoization
export const Component = memo(({ data, onAction }) => {
  // Component implementation
});
```

### Bundle Optimization
```typescript
// ✅ Lazy loading for route components
const LazyComponent = lazy(() => import('./Component'));

// ✅ Dynamic imports for utilities
const dynamicUtil = await import('@/utils/heavyUtility');
```

## Accessibility Standards

### ARIA Guidelines
```tsx
// ✅ Proper ARIA attributes
<button
  aria-label="Delete item"
  aria-describedby="delete-help-text"
  onClick={handleDelete}
>
  <TrashIcon />
</button>

<div id="delete-help-text" className="sr-only">
  This action cannot be undone
</div>
```

### Keyboard Navigation
```tsx
// ✅ Keyboard event handling
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleAction();
  }
};
```

## Security Standards

### Input Validation
```typescript
// ✅ Validation schemas
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  age: z.number().min(0).max(120)
});

// Validate input
const result = userSchema.safeParse(userData);
if (!result.success) {
  throw new ValidationError('Invalid user data', result.error);
}
```

### Sanitization
```typescript
// ✅ Sanitize user input
import DOMPurify from 'dompurify';

const sanitizedContent = DOMPurify.sanitize(userInput);
```

---

**Standards Version**: 1.0  
**Last Updated**: January 17, 2025  
**Compliance**: Mandatory for all code contributions