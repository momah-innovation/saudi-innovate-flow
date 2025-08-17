# 🧪 Testing Guide

## Overview
Comprehensive testing strategy for the Ruwād Platform covering unit tests, integration tests, and accessibility testing.

## Testing Philosophy

### Testing Pyramid
1. **Unit Tests (70%)**: Test individual functions and components
2. **Integration Tests (20%)**: Test component interactions and hooks
3. **Accessibility Tests (10%)**: Ensure WCAG compliance
4. **Manual Testing**: User acceptance and edge cases

### Testing Principles
- **Test behavior, not implementation**
- **Write tests that increase confidence**
- **Keep tests simple and readable**
- **Test edge cases and error conditions**
- **Maintain fast test execution**

## Testing Setup

### Configuration
```typescript
// File: src/test/setup.ts
import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
```

### Test Utilities
```typescript
// File: src/test/utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Create a custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Mock user for testing
export const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user' as const,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};

// Mock authenticated context
export const mockAuthContext = {
  user: mockUser,
  loading: false,
  isAuthenticated: true,
  signIn: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn(),
  resetPassword: vi.fn()
};
```

## Component Testing

### Basic Component Tests
```typescript
// File: src/components/__tests__/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { Button } from '../Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Click me</Button>);
    
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
    
    rerender(<Button variant="secondary">Secondary</Button>);
    
    expect(screen.getByRole('button')).toHaveClass('btn-secondary');
  });

  it('is accessible', () => {
    render(<Button aria-label="Submit form">Submit</Button>);
    
    expect(screen.getByRole('button')).toHaveAccessibleName('Submit form');
  });
});
```

### Complex Component Tests
```typescript
// File: src/components/__tests__/UserList.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@/test/utils';
import { UserList } from '../UserList';
import { mockUser } from '@/test/utils';

// Mock the hook
vi.mock('@/hooks/useUsers', () => ({
  useUsers: vi.fn()
}));

import { useUsers } from '@/hooks/useUsers';

const mockUseUsers = useUsers as vi.MockedFunction<typeof useUsers>;

describe('UserList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays loading state', () => {
    mockUseUsers.mockReturnValue({
      data: [],
      loading: true,
      error: null,
      actions: {
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        refresh: vi.fn()
      }
    });

    render(<UserList />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('displays error state', () => {
    const error = new Error('Failed to load users');
    mockUseUsers.mockReturnValue({
      data: [],
      loading: false,
      error,
      actions: {
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        refresh: vi.fn()
      }
    });

    render(<UserList />);
    
    expect(screen.getByText('Failed to load users')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('displays users list', () => {
    const users = [
      { ...mockUser, id: '1', name: 'John Doe' },
      { ...mockUser, id: '2', name: 'Jane Smith' }
    ];

    mockUseUsers.mockReturnValue({
      data: users,
      loading: false,
      error: null,
      actions: {
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        refresh: vi.fn()
      }
    });

    render(<UserList />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('handles user deletion', async () => {
    const mockDelete = vi.fn().mockResolvedValue(undefined);
    const users = [{ ...mockUser, id: '1', name: 'John Doe' }];

    mockUseUsers.mockReturnValue({
      data: users,
      loading: false,
      error: null,
      actions: {
        create: vi.fn(),
        update: vi.fn(),
        delete: mockDelete,
        refresh: vi.fn()
      }
    });

    render(<UserList />);
    
    const deleteButton = screen.getByRole('button', { name: /delete john doe/i });
    fireEvent.click(deleteButton);
    
    // Confirm deletion in modal
    const confirmButton = await screen.findByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith('1');
    });
  });

  it('handles search functionality', async () => {
    const users = [
      { ...mockUser, id: '1', name: 'John Doe' },
      { ...mockUser, id: '2', name: 'Jane Smith' }
    ];

    mockUseUsers.mockReturnValue({
      data: users,
      loading: false,
      error: null,
      actions: {
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        refresh: vi.fn()
      }
    });

    render(<UserList />);
    
    const searchInput = screen.getByPlaceholderText(/search users/i);
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });
});
```

## Hook Testing

### Custom Hook Tests
```typescript
// File: src/hooks/__tests__/useUsers.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUsers } from '../useUsers';

// Mock API functions
vi.mock('@/lib/api', () => ({
  fetchUsers: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn()
}));

import { fetchUsers, createUser, updateUser, deleteUser } from '@/lib/api';

const mockFetchUsers = fetchUsers as vi.MockedFunction<typeof fetchUsers>;
const mockCreateUser = createUser as vi.MockedFunction<typeof createUser>;
const mockUpdateUser = updateUser as vi.MockedFunction<typeof updateUser>;
const mockDeleteUser = deleteUser as vi.MockedFunction<typeof deleteUser>;

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

describe('useUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch users successfully', async () => {
    const mockUsers = [
      { id: '1', name: 'John Doe', email: 'john@example.com' }
    ];
    mockFetchUsers.mockResolvedValue(mockUsers);

    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper()
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockUsers);
    expect(result.current.error).toBe(null);
  });

  it('should handle fetch error', async () => {
    const error = new Error('Failed to fetch');
    mockFetchUsers.mockRejectedValue(error);

    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toEqual([]);
  });

  it('should create user successfully', async () => {
    const newUser = { name: 'Jane Doe', email: 'jane@example.com' };
    const createdUser = { id: '2', ...newUser };
    
    mockFetchUsers.mockResolvedValue([]);
    mockCreateUser.mockResolvedValue(createdUser);

    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.actions.create(newUser);

    expect(mockCreateUser).toHaveBeenCalledWith(newUser);
  });

  it('should update user successfully', async () => {
    const userId = '1';
    const updateData = { name: 'Updated Name' };
    const updatedUser = { id: userId, name: 'Updated Name', email: 'john@example.com' };
    
    mockFetchUsers.mockResolvedValue([]);
    mockUpdateUser.mockResolvedValue(updatedUser);

    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.actions.update(userId, updateData);

    expect(mockUpdateUser).toHaveBeenCalledWith(userId, updateData);
  });

  it('should delete user successfully', async () => {
    const userId = '1';
    
    mockFetchUsers.mockResolvedValue([]);
    mockDeleteUser.mockResolvedValue(undefined);

    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.actions.delete(userId);

    expect(mockDeleteUser).toHaveBeenCalledWith(userId);
  });
});
```

## Integration Testing

### Form Integration Tests
```typescript
// File: src/components/__tests__/UserForm.integration.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/utils';
import { UserForm } from '../UserForm';

// Mock API
vi.mock('@/lib/api', () => ({
  createUser: vi.fn(),
  updateUser: vi.fn()
}));

import { createUser, updateUser } from '@/lib/api';

const mockCreateUser = createUser as vi.MockedFunction<typeof createUser>;
const mockUpdateUser = updateUser as vi.MockedFunction<typeof updateUser>;

describe('UserForm Integration', () => {
  it('should create user with valid data', async () => {
    const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
    mockCreateUser.mockResolvedValue(mockUser);

    const onSuccess = vi.fn();
    render(<UserForm onSuccess={onSuccess} />);

    // Fill form
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com'
      });
    });

    expect(onSuccess).toHaveBeenCalledWith(mockUser);
  });

  it('should show validation errors', async () => {
    render(<UserForm />);

    // Submit empty form
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });

    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  it('should handle server errors', async () => {
    const error = new Error('Email already exists');
    mockCreateUser.mockRejectedValue(error);

    render(<UserForm />);

    // Fill form
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    });
  });
});
```

## Accessibility Testing

### Basic Accessibility Tests
```typescript
// File: src/components/__tests__/Button.accessibility.test.tsx
import { describe, it, expect } from 'vitest';
import { render } from '@/test/utils';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../Button';

expect.extend(toHaveNoViolations);

describe('Button Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should be keyboard accessible', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    
    // Should be focusable
    button.focus();
    expect(button).toHaveFocus();
    
    // Should respond to Enter key
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalled();
    
    // Should respond to Space key
    fireEvent.keyDown(button, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('should have proper ARIA attributes', () => {
    render(
      <Button 
        aria-label="Save document" 
        aria-describedby="save-help"
        disabled
      >
        Save
      </Button>
    );
    
    const button = screen.getByRole('button');
    
    expect(button).toHaveAttribute('aria-label', 'Save document');
    expect(button).toHaveAttribute('aria-describedby', 'save-help');
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });
});
```

### Complex Accessibility Tests
```typescript
// File: src/components/__tests__/Modal.accessibility.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Modal } from '../Modal';

expect.extend(toHaveNoViolations);

describe('Modal Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(
      <Modal isOpen title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should trap focus within modal', () => {
    render(
      <Modal isOpen title="Test Modal">
        <button>First button</button>
        <button>Second button</button>
      </Modal>
    );
    
    const firstButton = screen.getByText('First button');
    const secondButton = screen.getByText('Second button');
    const closeButton = screen.getByRole('button', { name: /close/i });
    
    // First button should be focused initially
    expect(firstButton).toHaveFocus();
    
    // Tab to second button
    fireEvent.keyDown(firstButton, { key: 'Tab' });
    expect(secondButton).toHaveFocus();
    
    // Tab to close button
    fireEvent.keyDown(secondButton, { key: 'Tab' });
    expect(closeButton).toHaveFocus();
    
    // Tab should cycle back to first button
    fireEvent.keyDown(closeButton, { key: 'Tab' });
    expect(firstButton).toHaveFocus();
  });

  it('should close on Escape key', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('should have proper ARIA attributes', () => {
    render(
      <Modal isOpen title="Test Modal" aria-describedby="modal-description">
        <p id="modal-description">This is the modal description</p>
      </Modal>
    );
    
    const modal = screen.getByRole('dialog');
    
    expect(modal).toHaveAttribute('aria-labelledby');
    expect(modal).toHaveAttribute('aria-describedby', 'modal-description');
    expect(modal).toHaveAttribute('aria-modal', 'true');
  });
});
```

## Test Organization

### Test File Structure
```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── Button.accessibility.test.tsx
│   └── UserList/
│       ├── UserList.tsx
│       ├── UserList.test.tsx
│       └── UserList.integration.test.tsx
├── hooks/
│   ├── useUsers/
│   │   ├── useUsers.ts
│   │   └── useUsers.test.ts
└── test/
    ├── setup.ts
    ├── utils.tsx
    └── mocks/
        ├── api.ts
        └── handlers.ts
```

### Test Scripts
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch",
    "test:accessibility": "vitest --run accessibility"
  }
}
```

## Best Practices

### Testing Checklist
- [ ] Test renders without crashing
- [ ] Test all user interactions
- [ ] Test loading and error states
- [ ] Test accessibility compliance
- [ ] Test keyboard navigation
- [ ] Test with screen readers
- [ ] Test edge cases and error conditions
- [ ] Mock external dependencies
- [ ] Use meaningful test descriptions
- [ ] Keep tests focused and isolated

### Performance Testing
```typescript
// Performance testing utilities
export const measureRenderTime = (component: React.ReactElement) => {
  const start = performance.now();
  render(component);
  const end = performance.now();
  return end - start;
};

// Usage in tests
it('should render quickly', () => {
  const renderTime = measureRenderTime(<ExpensiveComponent />);
  expect(renderTime).toBeLessThan(100); // 100ms threshold
});
```

---

**Test Coverage Target**: >80%  
**Test Types**: Unit, Integration, Accessibility  
**Tools**: Vitest, Testing Library, jest-axe