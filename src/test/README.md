# Testing Documentation

## Overview

This project uses a comprehensive testing setup with Vitest, React Testing Library, and MSW for mocking HTTP requests.

## Test Structure

```
src/test/
├── setup.ts                 # Global test setup and mocks
├── utils/
│   ├── test-utils.tsx       # Custom render function with providers
│   └── lib-utils.test.ts    # Utility function tests
├── mocks/
│   ├── server.ts           # MSW server setup
│   └── handlers/           # HTTP request handlers
├── components/             # Component tests
├── hooks/                  # Hook tests
├── integration/           # Integration tests
├── accessibility/         # A11y tests
└── performance/           # Performance tests
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- button.test.tsx

# Run tests matching pattern
npm test -- --grep "Button"
```

## Test Categories

### 1. Unit Tests
- **Utils**: Testing utility functions and helpers
- **Hooks**: Testing custom React hooks
- **Components**: Testing individual UI components

### 2. Integration Tests
- **Features**: Testing complete user workflows
- **API Integration**: Testing data fetching and mutations
- **Form Flows**: Testing multi-step forms and validation

### 3. Accessibility Tests
- **A11y Compliance**: Using jest-axe for automated accessibility testing
- **Keyboard Navigation**: Testing keyboard interaction patterns
- **Screen Reader**: Testing ARIA labels and roles

### 4. Performance Tests
- **Bundle Analysis**: Testing bundle size optimization
- **Component Performance**: Testing render performance
- **Memory Usage**: Testing for memory leaks

## Testing Patterns

### Component Testing
```tsx
import { render, screen } from '@/test/utils/test-utils'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })
})
```

### Hook Testing
```tsx
import { renderHook } from '@/test/utils/test-utils'
import { useAuth } from '@/contexts/AuthContext'

describe('useAuth Hook', () => {
  it('provides auth methods', () => {
    const { result } = renderHook(() => useAuth())
    expect(result.current.signIn).toBeDefined()
  })
})
```

### Integration Testing
```tsx
import { render, screen, fireEvent, waitFor } from '@/test/utils/test-utils'
import { ChallengeList } from '@/components/challenges/challenge-list'

describe('Challenge Flow', () => {
  it('loads and displays challenges', async () => {
    render(<ChallengeList />)
    await waitFor(() => {
      expect(screen.getByText('Test Challenge')).toBeInTheDocument()
    })
  })
})
```

## Mocking Strategies

### Context Mocking
```tsx
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', email: 'test@example.com' },
    signOut: vi.fn()
  })
}))
```

### API Mocking with MSW
```tsx
import { server } from '@/test/mocks/server'
import { http, HttpResponse } from 'msw'

server.use(
  http.get('*/rest/v1/challenges', () => {
    return HttpResponse.json([{ id: '1', title: 'Test' }])
  })
)
```

### Supabase Mocking
```tsx
const mockSupabase = {
  auth: {
    signInWithPassword: vi.fn(),
    signOut: vi.fn()
  }
}

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase
}))
```

## Best Practices

### 1. Test Organization
- Group related tests using `describe` blocks
- Use descriptive test names that explain what is being tested
- Follow the AAA pattern: Arrange, Act, Assert

### 2. Mocking Guidelines
- Mock external dependencies (APIs, third-party libraries)
- Use MSW for HTTP request mocking
- Mock contexts at the module level for consistency

### 3. Accessibility Testing
- Include a11y tests for all interactive components
- Test keyboard navigation paths
- Verify ARIA labels and roles

### 4. Performance Testing
- Test bundle size limits
- Monitor component render performance
- Check for memory leaks in long-running tests

## Coverage Goals

- **Components**: 90%+ coverage for all UI components
- **Hooks**: 100% coverage for custom hooks
- **Utils**: 100% coverage for utility functions
- **Integration**: 80%+ coverage for critical user flows

## Continuous Integration

Tests run automatically on:
- Pull requests
- Main branch commits
- Pre-deployment checks

### Coverage Reports
- Generated after each test run
- Available in `coverage/` directory
- Integrated with CI/CD pipeline

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure path aliases are correctly configured in vitest.config.ts
2. **Context Mocking**: Mock contexts at the module level, not inside test functions
3. **Async Testing**: Use `waitFor` for async operations and state updates
4. **Component Mocking**: Use actual components in tests when possible, mock only external dependencies

### Debug Mode
```bash
# Run tests with debug output
npm test -- --reporter=verbose

# Run single test with debugging
npm test -- --run button.test.tsx --reporter=verbose
```

## Future Enhancements

1. **E2E Testing**: Add Playwright for full application testing
2. **Visual Regression**: Add screenshot testing for UI consistency
3. **Load Testing**: Add performance testing under load
4. **Cross-Browser**: Expand browser compatibility testing