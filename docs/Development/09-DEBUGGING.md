# 🐛 Debugging Guide

## Overview
Comprehensive debugging strategies and tools for troubleshooting issues in the Ruwād Platform development environment.

## Debugging Philosophy

### Systematic Approach
1. **Reproduce**: Consistently recreate the issue
2. **Isolate**: Narrow down the scope of the problem
3. **Analyze**: Understand the root cause
4. **Fix**: Implement the correct solution
5. **Verify**: Ensure the fix works and doesn't break anything else
6. **Document**: Record the issue and solution for future reference

### Debugging Mindset
- **Stay Calm**: Approach problems methodically
- **Question Assumptions**: Verify what you think you know
- **Use Scientific Method**: Form hypotheses and test them
- **Simplify**: Reduce complexity to isolate issues
- **Document Everything**: Keep track of what you've tried

## Development Environment Debugging

### Browser Developer Tools

#### Console Debugging
```typescript
// Enhanced console logging
const debugLog = (label: string, data: any, level: 'info' | 'warn' | 'error' = 'info') => {
  const timestamp = new Date().toISOString();
  const styles = {
    info: 'color: #2196F3; font-weight: bold;',
    warn: 'color: #FF9800; font-weight: bold;',
    error: 'color: #F44336; font-weight: bold;'
  };
  
  console.group(`%c[${timestamp}] ${label}`, styles[level]);
  console.log(data);
  console.trace(); // Show call stack
  console.groupEnd();
};

// Usage in components
const UserComponent = ({ userId }: { userId: string }) => {
  const { data, loading, error } = useUser(userId);
  
  // Debug component lifecycle
  useEffect(() => {
    debugLog('UserComponent Mount', { userId, data, loading, error });
  }, [userId, data, loading, error]);
  
  // Debug render conditions
  if (loading) {
    debugLog('UserComponent Render', 'Loading state', 'info');
    return <LoadingSpinner />;
  }
  
  if (error) {
    debugLog('UserComponent Error', error, 'error');
    return <ErrorMessage error={error} />;
  }
  
  return <UserProfile user={data} />;
};
```

#### React Developer Tools
```typescript
// Component debugging with React DevTools
const DebuggableComponent = ({ prop1, prop2 }: ComponentProps) => {
  // Add displayName for easier identification
  DebuggableComponent.displayName = 'DebuggableComponent';
  
  // Use React DevTools Profiler
  return (
    <React.Profiler
      id="DebuggableComponent"
      onRender={(id, phase, actualDuration) => {
        console.log('Render Performance:', {
          id,
          phase,
          actualDuration,
          props: { prop1, prop2 }
        });
      }}
    >
      {/* Component content */}
    </React.Profiler>
  );
};
```

#### Network Tab Debugging
```typescript
// Add request interceptors for debugging
const debugApiCalls = () => {
  const originalFetch = window.fetch;
  
  window.fetch = async (...args) => {
    const [url, options] = args;
    const startTime = performance.now();
    
    console.group('🌐 API Request');
    console.log('URL:', url);
    console.log('Options:', options);
    
    try {
      const response = await originalFetch(...args);
      const endTime = performance.now();
      
      console.log('Status:', response.status);
      console.log('Duration:', `${endTime - startTime}ms`);
      
      if (!response.ok) {
        console.error('Response Error:', response.statusText);
      }
      
      console.groupEnd();
      return response;
    } catch (error) {
      console.error('Network Error:', error);
      console.groupEnd();
      throw error;
    }
  };
};

// Enable in development
if (process.env.NODE_ENV === 'development') {
  debugApiCalls();
}
```

### VS Code Debugging

#### Debug Configuration
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug React App",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/vite",
      "args": ["dev"],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/vitest",
      "args": ["run", "--reporter=verbose"],
      "env": {
        "NODE_ENV": "test"
      },
      "console": "integratedTerminal"
    }
  ]
}
```

#### Breakpoint Strategies
```typescript
// Strategic breakpoint placement
const complexFunction = (data: ComplexData[]) => {
  // Breakpoint 1: Function entry
  debugger; // Will pause here when debugging
  
  const processedData = data.map(item => {
    // Breakpoint 2: Inside loop iteration
    if (item.id === 'problematic-id') {
      debugger; // Conditional breakpoint
    }
    
    return processItem(item);
  });
  
  // Breakpoint 3: Before return
  debugger; // Check final result
  return processedData;
};

// Conditional debugging
const conditionalDebug = (condition: boolean, data: any) => {
  if (condition && process.env.NODE_ENV === 'development') {
    console.log('Debug condition met:', data);
    debugger;
  }
};
```

## React-Specific Debugging

### Component State Debugging
```typescript
// Debug component state changes
const useDebugState = <T>(initialState: T, name: string) => {
  const [state, setState] = useState<T>(initialState);
  
  useEffect(() => {
    console.log(`${name} state changed:`, state);
  }, [state, name]);
  
  const debugSetState = useCallback((newState: T | ((prev: T) => T)) => {
    console.log(`${name} setState called with:`, newState);
    setState(newState);
  }, [name]);
  
  return [state, debugSetState] as const;
};

// Usage
const MyComponent = () => {
  const [count, setCount] = useDebugState(0, 'MyComponent.count');
  
  return (
    <button onClick={() => setCount(prev => prev + 1)}>
      Count: {count}
    </button>
  );
};
```

### Hook Debugging
```typescript
// Debug custom hooks
const useDebugHook = <T>(hook: () => T, name: string): T => {
  const result = hook();
  
  useEffect(() => {
    console.group(`🎣 Hook Debug: ${name}`);
    console.log('Result:', result);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
  });
  
  return result;
};

// Usage
const MyComponent = () => {
  const userData = useDebugHook(
    () => useUser('123'),
    'useUser'
  );
  
  return <div>{userData.data?.name}</div>;
};
```

### Props Debugging
```typescript
// Debug component props
const withPropsDebug = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  return (props: P) => {
    useEffect(() => {
      console.log(`${componentName} props:`, props);
    });
    
    const prevProps = useRef<P>();
    
    useEffect(() => {
      if (prevProps.current) {
        const changedProps = Object.keys(props).filter(
          key => prevProps.current![key as keyof P] !== props[key as keyof P]
        );
        
        if (changedProps.length > 0) {
          console.log(`${componentName} props changed:`, changedProps);
        }
      }
      
      prevProps.current = props;
    });
    
    return <Component {...props} />;
  };
};

// Usage
const DebuggableUserComponent = withPropsDebug(UserComponent, 'UserComponent');
```

## Error Debugging

### Error Boundaries
```typescript
// Enhanced error boundary with debugging
interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
  errorBoundaryStack?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class DebugErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.group('🚨 Error Boundary Caught Error');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();
    
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
    
    this.setState({
      error,
      errorInfo
    });
  }
  
  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // Send to error tracking service
    console.log('Logging error to service:', { error, errorInfo });
  };
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          {process.env.NODE_ENV === 'development' && (
            <details>
              <summary>Error Details</summary>
              <pre>{this.state.error?.stack}</pre>
              <pre>{this.state.errorInfo?.componentStack}</pre>
            </details>
          )}
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### Error Logging
```typescript
// Centralized error logging
interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
}

class ErrorLogger {
  private static instance: ErrorLogger;
  
  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }
  
  logError(error: Error, context: ErrorContext = {}) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context: {
        ...context,
        url: window.location.href,
        userAgent: navigator.userAgent
      }
    };
    
    console.error('Error logged:', errorInfo);
    
    // Send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(errorInfo);
    }
  }
  
  private sendToMonitoringService(errorInfo: any) {
    // Implementation for error monitoring service
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorInfo)
    }).catch(err => {
      console.error('Failed to send error to monitoring service:', err);
    });
  }
}

// Usage in hooks
export const useErrorLogger = () => {
  const logger = ErrorLogger.getInstance();
  
  return useCallback((error: Error, context?: ErrorContext) => {
    logger.logError(error, context);
  }, [logger]);
};
```

## Performance Debugging

### React Profiler
```typescript
// Performance monitoring component
const PerformanceMonitor = ({ children }: { children: React.ReactNode }) => {
  const onRender = useCallback((
    id: string,
    phase: 'mount' | 'update',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number
  ) => {
    if (actualDuration > 16) { // More than one frame
      console.warn('Slow render detected:', {
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime
      });
    }
  }, []);
  
  return (
    <React.Profiler id="PerformanceMonitor" onRender={onRender}>
      {children}
    </React.Profiler>
  );
};
```

### Memory Debugging
```typescript
// Memory usage monitoring
const useMemoryMonitoring = () => {
  useEffect(() => {
    const checkMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        console.log('Memory usage:', {
          used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
          total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
          limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
        });
      }
    };
    
    const interval = setInterval(checkMemoryUsage, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, []);
};
```

## Network Debugging

### API Request Debugging
```typescript
// Request/Response interceptor
const createApiDebugger = () => {
  const requests = new Map();
  
  return {
    logRequest: (id: string, url: string, options: RequestInit) => {
      requests.set(id, {
        url,
        options,
        startTime: performance.now()
      });
      
      console.log(`🚀 API Request [${id}]:`, { url, options });
    },
    
    logResponse: (id: string, response: Response, data?: any) => {
      const request = requests.get(id);
      const duration = performance.now() - request.startTime;
      
      console.log(`📨 API Response [${id}]:`, {
        url: request.url,
        status: response.status,
        duration: `${duration.toFixed(2)}ms`,
        data: data ? Object.keys(data) : 'No data'
      });
      
      requests.delete(id);
    },
    
    logError: (id: string, error: Error) => {
      const request = requests.get(id);
      
      console.error(`❌ API Error [${id}]:`, {
        url: request?.url,
        error: error.message
      });
      
      requests.delete(id);
    }
  };
};

// Usage in API client
const apiDebugger = createApiDebugger();

export const apiClient = async (url: string, options: RequestInit = {}) => {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    apiDebugger.logRequest(requestId, url, options);
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    apiDebugger.logResponse(requestId, response, data);
    
    return { response, data };
  } catch (error) {
    apiDebugger.logError(requestId, error as Error);
    throw error;
  }
};
```

## Common Debugging Scenarios

### State Not Updating
```typescript
// Debug state update issues
const useDebugStateUpdate = <T>(state: T, stateName: string) => {
  const prevState = useRef<T>();
  
  useEffect(() => {
    if (prevState.current !== undefined && prevState.current !== state) {
      console.log(`${stateName} updated:`, {
        from: prevState.current,
        to: state
      });
    }
    prevState.current = state;
  }, [state, stateName]);
};

// Usage
const MyComponent = () => {
  const [count, setCount] = useState(0);
  useDebugStateUpdate(count, 'count');
  
  const handleIncrement = () => {
    console.log('Incrementing count from:', count);
    setCount(count + 1); // Potential issue: stale closure
  };
  
  return <button onClick={handleIncrement}>Count: {count}</button>;
};
```

### Infinite Renders
```typescript
// Debug infinite render loops
const useRenderCounter = (componentName: string) => {
  const renderCount = useRef(0);
  
  renderCount.current += 1;
  
  useEffect(() => {
    if (renderCount.current > 10) {
      console.warn(`${componentName} has rendered ${renderCount.current} times!`);
    }
  });
  
  console.log(`${componentName} render #${renderCount.current}`);
};

// Usage
const ProblematicComponent = ({ data }: { data: any[] }) => {
  useRenderCounter('ProblematicComponent');
  
  // This might cause infinite renders
  const processedData = data.map(item => ({ ...item, processed: true }));
  
  return <div>{processedData.length} items</div>;
};
```

### Missing Dependencies
```typescript
// Debug useEffect dependencies
const useEffectDebugger = (
  effect: React.EffectCallback,
  deps: React.DependencyList,
  debugName: string
) => {
  const prevDeps = useRef<React.DependencyList>();
  
  useEffect(() => {
    if (prevDeps.current) {
      const changedDeps: number[] = [];
      deps.forEach((dep, index) => {
        if (prevDeps.current![index] !== dep) {
          changedDeps.push(index);
        }
      });
      
      if (changedDeps.length > 0) {
        console.log(`${debugName} effect triggered by dependencies:`, 
          changedDeps.map(i => ({ index: i, prev: prevDeps.current![i], curr: deps[i] }))
        );
      }
    }
    
    prevDeps.current = deps;
    return effect();
  }, deps);
};
```

## Debugging Tools and Extensions

### Browser Extensions
- **React Developer Tools**: Component inspection
- **Redux DevTools**: State management debugging
- **Apollo Client DevTools**: GraphQL debugging
- **Lighthouse**: Performance auditing

### VS Code Extensions
- **Debugger for Chrome**: Browser debugging
- **Error Lens**: Inline error display
- **Console Ninja**: Enhanced console logging
- **Thunder Client**: API testing

### Command Line Tools
```bash
# Debug build issues
npm run build -- --debug

# Analyze bundle size
npm run analyze

# Debug dependency conflicts
npm ls

# Check for security vulnerabilities
npm audit

# Debug network issues
curl -v https://api.example.com/endpoint
```

---

**Debugging Strategy**: Systematic, methodical approach  
**Primary Tools**: Browser DevTools, React DevTools, VS Code  
**Focus Areas**: Components, State, Performance, Network