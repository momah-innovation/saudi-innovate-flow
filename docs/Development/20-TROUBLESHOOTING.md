# 🚨 Troubleshooting Guide

## Overview
Comprehensive troubleshooting guide for common issues, debugging techniques, and problem resolution strategies in the Ruwād Platform.

## Common Development Issues

### Build and Compilation Errors

#### TypeScript Errors
```typescript
// Common TypeScript issues and solutions

// 1. Type inference issues
// ❌ Problem: Type 'unknown' is not assignable to type 'string'
const data = await response.json();
const message = data.message; // Error: unknown type

// ✅ Solution: Proper type assertion or interface
interface ApiResponse {
  message: string;
  status: number;
}

const data = await response.json() as ApiResponse;
const message = data.message; // Now properly typed

// 2. Module resolution errors
// ❌ Problem: Cannot find module '@/components/Button'
import { Button } from '@/components/Button';

// ✅ Solution: Check tsconfig.json paths
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"]
    }
  }
}

// 3. React hook type issues
// ❌ Problem: Argument of type 'string | undefined' is not assignable
const [value, setValue] = useState<string>();
setValue(someValue); // Error if someValue can be undefined

// ✅ Solution: Proper type guards or default values
const [value, setValue] = useState<string>('');
// or
const [value, setValue] = useState<string | undefined>();
if (someValue !== undefined) {
  setValue(someValue);
}
```

#### Build Configuration Issues
```javascript
// vite.config.ts common issues

// 1. Path resolution problems
// ❌ Problem: Module not found errors
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Missing path import
    }
  }
});

// ✅ Solution: Import path module
import path from 'path';
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
});

// 2. Environment variable issues
// ❌ Problem: process.env.VITE_API_URL is undefined
console.log(process.env.VITE_API_URL);

// ✅ Solution: Check .env file and naming
// .env.local
VITE_API_URL=https://api.example.com

// 3. Build optimization problems
// ❌ Problem: Memory out of bounds during build
export default defineConfig({
  build: {
    // Default settings might cause issues
  }
});

// ✅ Solution: Optimize build settings
export default defineConfig({
  build: {
    sourcemap: false, // Disable in production
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) return 'vendor';
        }
      }
    }
  }
});
```

### Runtime Errors

#### React Rendering Issues
```typescript
// Common React runtime issues

// 1. Hydration mismatches
// ❌ Problem: Text content did not match
const Component = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return <div>{Date.now()}</div>; // Different on server/client
};

// ✅ Solution: Ensure consistent rendering
const Component = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return <div>{Date.now()}</div>;
};

// 2. Memory leaks in useEffect
// ❌ Problem: State updates on unmounted component
useEffect(() => {
  fetchData().then(setData); // May update after unmount
}, []);

// ✅ Solution: Cleanup with abort controller
useEffect(() => {
  const controller = new AbortController();
  
  fetchData(controller.signal)
    .then(setData)
    .catch(error => {
      if (error.name !== 'AbortError') {
        console.error(error);
      }
    });

  return () => controller.abort();
}, []);

// 3. Infinite re-renders
// ❌ Problem: Component re-renders continuously
const Component = ({ items }) => {
  const [filteredItems, setFilteredItems] = useState([]);
  
  useEffect(() => {
    setFilteredItems(items.filter(item => item.active)); // New array each time
  }, [items.filter(item => item.active)]); // Dependencies change every render

  return <div>{filteredItems.length}</div>;
};

// ✅ Solution: Stable dependencies
const Component = ({ items }) => {
  const filteredItems = useMemo(() => {
    return items.filter(item => item.active);
  }, [items]);

  return <div>{filteredItems.length}</div>;
};
```

#### API and Network Issues
```typescript
// Common API issues and solutions

// 1. CORS errors
// ❌ Problem: Access to fetch blocked by CORS policy
fetch('https://external-api.com/data')
  .then(response => response.json());

// ✅ Solution: Proxy through your backend or configure CORS
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://external-api.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^/api/, '')
      }
    }
  }
});

// 2. Race conditions in API calls
// ❌ Problem: Outdated responses overwriting newer ones
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);

const fetchData = async (query) => {
  setLoading(true);
  const response = await api.search(query);
  setData(response.data); // May overwrite newer data
  setLoading(false);
};

// ✅ Solution: Cancel previous requests
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const abortControllerRef = useRef<AbortController>();

const fetchData = async (query) => {
  // Cancel previous request
  abortControllerRef.current?.abort();
  abortControllerRef.current = new AbortController();
  
  setLoading(true);
  try {
    const response = await api.search(query, {
      signal: abortControllerRef.current.signal
    });
    setData(response.data);
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error(error);
    }
  } finally {
    setLoading(false);
  }
};

// 3. Supabase connection issues
// ❌ Problem: Invalid JWT or session expired
const { data, error } = await supabase
  .from('challenges')
  .select('*');

if (error) {
  console.error(error); // Just logging doesn't help user
}

// ✅ Solution: Handle authentication errors gracefully
const fetchChallenges = async () => {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*');

    if (error) {
      if (error.message.includes('JWT')) {
        // Handle expired session
        await supabase.auth.signOut();
        router.navigate('/login');
        toast.error('جلستك انتهت، يرجى تسجيل الدخول مرة أخرى');
      } else {
        throw error;
      }
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch challenges:', error);
    toast.error('حدث خطأ في تحميل التحديات');
    return [];
  }
};
```

## Debugging Techniques

### Browser DevTools Usage
```typescript
// Advanced debugging techniques

// 1. Console debugging with groups and styling
const debugAPI = {
  log: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🐛 ${message}`);
      if (data) {
        console.log('Data:', data);
        console.log('Type:', typeof data);
        console.log('Keys:', Object.keys(data));
      }
      console.trace('Call stack');
      console.groupEnd();
    }
  },

  performance: (label: string, fn: () => any) => {
    if (process.env.NODE_ENV === 'development') {
      console.time(label);
      const result = fn();
      console.timeEnd(label);
      return result;
    }
    return fn();
  },

  table: (data: any[], columns?: string[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.table(data, columns);
    }
  }
};

// Usage in components
const ChallengesList = ({ challenges }) => {
  debugAPI.log('ChallengesList render', { 
    challengeCount: challenges.length,
    firstChallenge: challenges[0]
  });

  const filteredChallenges = debugAPI.performance(
    'Filter challenges',
    () => challenges.filter(c => c.status === 'active')
  );

  return (
    <div>
      {filteredChallenges.map(challenge => (
        <ChallengeCard key={challenge.id} challenge={challenge} />
      ))}
    </div>
  );
};

// 2. Network debugging
const apiDebugger = {
  logRequest: (url: string, options?: RequestInit) => {
    console.group(`🌐 API Request: ${options?.method || 'GET'} ${url}`);
    console.log('Options:', options);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
  },

  logResponse: (url: string, response: Response, data?: any) => {
    const color = response.ok ? 'color: green' : 'color: red';
    console.group(`%c🌐 API Response: ${response.status} ${url}`, color);
    console.log('Status:', response.status, response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    if (data) console.log('Data:', data);
    console.groupEnd();
  }
};

// Enhanced fetch wrapper with debugging
const debugFetch = async (url: string, options?: RequestInit) => {
  apiDebugger.logRequest(url, options);
  
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    apiDebugger.logResponse(url, response, data);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return data;
  } catch (error) {
    console.error(`❌ API Error for ${url}:`, error);
    throw error;
  }
};
```

### React DevTools Integration
```typescript
// React DevTools debugging utilities

// 1. Component debugging hooks
export const useDebugValue = (value: any, format?: (value: any) => any) => {
  React.useDebugValue(value, format);
};

export const useWhyDidYouUpdate = (name: string, props: Record<string, any>) => {
  const previous = useRef<Record<string, any>>();
  
  useEffect(() => {
    if (previous.current) {
      const allKeys = Object.keys({ ...previous.current, ...props });
      const changedProps: Record<string, { from: any; to: any }> = {};
      
      allKeys.forEach(key => {
        if (previous.current![key] !== props[key]) {
          changedProps[key] = {
            from: previous.current![key],
            to: props[key]
          };
        }
      });
      
      if (Object.keys(changedProps).length) {
        console.log('🔍 [why-did-you-update]', name, changedProps);
      }
    }
    
    previous.current = props;
  });
};

// 2. Performance debugging
export const useRenderCount = (componentName: string) => {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    console.log(`🔄 ${componentName} rendered ${renderCount.current} times`);
  });
  
  return renderCount.current;
};

export const useTraceUpdate = (props: Record<string, any>) => {
  const prev = useRef(props);
  
  useEffect(() => {
    const keys = Object.keys({ ...prev.current, ...props });
    const updates: string[] = [];
    
    keys.forEach(key => {
      if (prev.current[key] !== props[key]) {
        updates.push(key);
      }
    });
    
    if (updates.length > 0) {
      console.log('🎯 Props that changed:', updates);
    }
    
    prev.current = props;
  });
};

// Usage in components
const ChallengeCard = ({ challenge, onSelect }) => {
  const renderCount = useRenderCount('ChallengeCard');
  useWhyDidYouUpdate('ChallengeCard', { challenge, onSelect });
  useTraceUpdate({ challenge, onSelect });

  return (
    <div onClick={() => onSelect(challenge.id)}>
      <h3>{challenge.title}</h3>
      <span>Renders: {renderCount}</span>
    </div>
  );
};
```

## Performance Troubleshooting

### Bundle Size Analysis
```bash
# Analyze bundle size
npm run build:analyze

# Check for duplicate dependencies
npx webpack-bundle-analyzer dist/stats.json

# Find large dependencies
npx bundlephobia-cli analyze package.json
```

### Memory Leak Detection
```typescript
// Memory leak debugging utilities

export class MemoryProfiler {
  private measurements: Array<{ 
    timestamp: number; 
    used: number; 
    total: number; 
    limit: number; 
  }> = [];

  startProfiling(interval = 1000) {
    const timer = setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        this.measurements.push({
          timestamp: Date.now(),
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        });

        // Keep only last 100 measurements
        if (this.measurements.length > 100) {
          this.measurements.shift();
        }

        // Alert if memory usage is growing too fast
        if (this.measurements.length > 10) {
          const recent = this.measurements.slice(-10);
          const growth = recent[recent.length - 1].used - recent[0].used;
          const timeSpan = recent[recent.length - 1].timestamp - recent[0].timestamp;
          const growthRate = growth / timeSpan; // bytes per ms

          if (growthRate > 1000) { // Growing faster than 1KB/ms
            console.warn('🚨 Potential memory leak detected!', {
              growthRate: `${(growthRate * 1000).toFixed(2)} bytes/sec`,
              currentUsage: `${(recent[recent.length - 1].used / 1024 / 1024).toFixed(2)} MB`
            });
          }
        }
      }
    }, interval);

    return () => clearInterval(timer);
  }

  getReport() {
    if (this.measurements.length === 0) return null;

    const latest = this.measurements[this.measurements.length - 1];
    const earliest = this.measurements[0];
    const growth = latest.used - earliest.used;
    const timeSpan = latest.timestamp - earliest.timestamp;

    return {
      currentUsage: latest.used,
      totalGrowth: growth,
      timeSpan,
      averageGrowthRate: growth / timeSpan,
      measurements: this.measurements
    };
  }
}

// Component memory tracking
export const useMemoryTracker = (componentName: string) => {
  useEffect(() => {
    const profiler = new MemoryProfiler();
    const cleanup = profiler.startProfiling();

    console.log(`📊 Started memory tracking for ${componentName}`);

    return () => {
      cleanup();
      const report = profiler.getReport();
      if (report) {
        console.log(`📊 Memory report for ${componentName}:`, report);
      }
    };
  }, [componentName]);
};
```

## Database Troubleshooting

### Supabase Common Issues
```typescript
// Supabase troubleshooting utilities

export class SupabaseDebugger {
  static async diagnoseConnection() {
    console.log('🔍 Diagnosing Supabase connection...');

    try {
      // Test basic connection
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .limit(1);

      if (tablesError) {
        console.error('❌ Connection test failed:', tablesError);
        return false;
      }

      console.log('✅ Basic connection: OK');

      // Test authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.warn('⚠️ Auth error:', authError.message);
      } else {
        console.log('✅ Authentication:', user ? 'Logged in' : 'Anonymous');
      }

      // Test RLS policies
      await this.testRLSPolicies();

      return true;
    } catch (error) {
      console.error('❌ Connection diagnosis failed:', error);
      return false;
    }
  }

  static async testRLSPolicies() {
    console.log('🔒 Testing RLS policies...');

    const testTables = ['challenges', 'ideas', 'events'];
    
    for (const table of testTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('id')
          .limit(1);

        if (error) {
          if (error.code === 'PGRST301') {
            console.warn(`⚠️ Table ${table}: No data or access denied`);
          } else if (error.message.includes('RLS')) {
            console.error(`❌ Table ${table}: RLS policy issue - ${error.message}`);
          } else {
            console.error(`❌ Table ${table}: ${error.message}`);
          }
        } else {
          console.log(`✅ Table ${table}: Access OK`);
        }
      } catch (error) {
        console.error(`❌ Table ${table}: Unexpected error`, error);
      }
    }
  }

  static async testPerformance() {
    console.log('⚡ Testing database performance...');

    const tests = [
      {
        name: 'Simple SELECT',
        query: () => supabase.from('profiles').select('id').limit(10)
      },
      {
        name: 'JOIN query',
        query: () => supabase.from('challenges').select(`
          id,
          title,
          created_by_profile:profiles!created_by(display_name)
        `).limit(5)
      },
      {
        name: 'Aggregation',
        query: () => supabase.from('challenges').select('id', { count: 'exact' })
      }
    ];

    for (const test of tests) {
      const startTime = performance.now();
      
      try {
        await test.query();
        const duration = performance.now() - startTime;
        
        const status = duration < 100 ? '🟢' : duration < 500 ? '🟡' : '🔴';
        console.log(`${status} ${test.name}: ${duration.toFixed(2)}ms`);
      } catch (error) {
        console.error(`❌ ${test.name}: Failed`, error);
      }
    }
  }
}

// Usage
// SupabaseDebugger.diagnoseConnection();
// SupabaseDebugger.testPerformance();
```

### Query Optimization
```sql
-- Common slow query patterns and solutions

-- ❌ Problem: Missing indexes on foreign keys
SELECT c.*, p.display_name 
FROM challenges c 
JOIN profiles p ON c.created_by = p.user_id 
WHERE c.status = 'active';

-- ✅ Solution: Add indexes
CREATE INDEX IF NOT EXISTS idx_challenges_created_by ON challenges(created_by);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON challenges(status);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- ❌ Problem: Unfiltered text search
SELECT * FROM challenges WHERE title ILIKE '%innovation%';

-- ✅ Solution: Use full-text search
ALTER TABLE challenges ADD COLUMN search_vector tsvector;
CREATE INDEX idx_challenges_search ON challenges USING gin(search_vector);

-- Update search vector
UPDATE challenges SET search_vector = to_tsvector('arabic', title || ' ' || description);

-- Efficient search query
SELECT * FROM challenges 
WHERE search_vector @@ plainto_tsquery('arabic', 'innovation');
```

## Error Handling Strategies

### Comprehensive Error Boundaries
```typescript
// Advanced error boundary implementation

interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
  errorInfo?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallback?: React.ComponentType<any> }>,
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substring(2)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Error Boundary caught an error:', error, errorInfo);

    this.setState({ errorInfo });

    // Send to error tracking service
    this.reportError(error, errorInfo);

    // Attempt recovery
    this.attemptRecovery();
  }

  private reportError(error: Error, errorInfo: ErrorInfo) {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      errorId: this.state.errorId
    };

    // Send to monitoring service
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorReport)
    }).catch(err => {
      console.error('Failed to report error:', err);
    });
  }

  private attemptRecovery() {
    // Try to recover after 5 seconds
    setTimeout(() => {
      console.log('🔄 Attempting error recovery...');
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null
      });
    }, 5000);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      
      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          errorId={this.state.errorId}
          onRetry={() => this.attemptRecovery()}
        />
      );
    }

    return this.props.children;
  }
}

const DefaultErrorFallback = ({ error, errorId, onRetry }) => (
  <div className="error-boundary">
    <h2>عذراً، حدث خطأ غير متوقع</h2>
    <details>
      <summary>تفاصيل الخطأ</summary>
      <pre>{error?.message}</pre>
      <small>معرف الخطأ: {errorId}</small>
    </details>
    <button onClick={onRetry}>إعادة المحاولة</button>
  </div>
);
```

## Environment-Specific Issues

### Development vs Production Discrepancies
```typescript
// Environment debugging utilities

export const EnvironmentChecker = {
  checkEnvironmentConsistency() {
    console.log('🔍 Checking environment consistency...');

    const checks = [
      this.checkNodeVersion(),
      this.checkDependencies(),
      this.checkEnvironmentVariables(),
      this.checkBuildConfiguration()
    ];

    checks.forEach(check => {
      try {
        check();
      } catch (error) {
        console.error(`❌ Environment check failed:`, error);
      }
    });
  },

  checkNodeVersion() {
    const requiredVersion = '18.0.0';
    const currentVersion = process.version;
    
    if (currentVersion < requiredVersion) {
      console.warn(`⚠️ Node.js version ${currentVersion} is below required ${requiredVersion}`);
    } else {
      console.log(`✅ Node.js version: ${currentVersion}`);
    }
  },

  checkDependencies() {
    const criticalDeps = [
      'react',
      'react-dom',
      '@supabase/supabase-js',
      '@tanstack/react-query'
    ];

    criticalDeps.forEach(dep => {
      try {
        require.resolve(dep);
        console.log(`✅ Dependency ${dep}: Found`);
      } catch {
        console.error(`❌ Dependency ${dep}: Missing`);
      }
    });
  },

  checkEnvironmentVariables() {
    const requiredVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY'
    ];

    requiredVars.forEach(varName => {
      const value = import.meta.env[varName];
      if (value) {
        console.log(`✅ Environment variable ${varName}: Set`);
      } else {
        console.error(`❌ Environment variable ${varName}: Missing`);
      }
    });
  },

  checkBuildConfiguration() {
    const isDevelopment = import.meta.env.DEV;
    const isProduction = import.meta.env.PROD;
    
    console.log(`📋 Build mode: ${isDevelopment ? 'Development' : 'Production'}`);
    console.log(`📋 Base URL: ${import.meta.env.BASE_URL}`);
    console.log(`📋 Mode: ${import.meta.env.MODE}`);
  }
};
```

## Quick Reference

### Debugging Checklist
```markdown
## 🚨 When Something Goes Wrong

### 1. First Steps
- [ ] Check browser console for errors
- [ ] Verify network tab for failed requests
- [ ] Check if error is reproducible
- [ ] Note steps to reproduce

### 2. Common Fixes
- [ ] Clear browser cache and cookies
- [ ] Restart development server
- [ ] Delete node_modules and reinstall
- [ ] Check environment variables
- [ ] Verify Supabase connection

### 3. Investigation Tools
- [ ] Use React DevTools for component issues
- [ ] Check Network tab for API issues
- [ ] Use Performance tab for speed issues
- [ ] Check Application tab for storage issues

### 4. Getting Help
- [ ] Search existing documentation
- [ ] Check GitHub issues
- [ ] Prepare minimal reproduction case
- [ ] Include error messages and stack traces
```

### Emergency Fixes
```bash
# Clear all caches and reset
npm run clean
rm -rf node_modules package-lock.json
npm install

# Reset git state
git stash
git reset --hard HEAD
git clean -fd

# Reset database (development only)
npm run db:reset

# Check system health
npm run health-check
```

## Best Practices

### 1. **Proactive Debugging**
- Use TypeScript for early error detection
- Implement comprehensive error boundaries
- Add proper logging and monitoring

### 2. **Systematic Troubleshooting**
- Follow consistent debugging workflows
- Document common issues and solutions
- Use debugging tools effectively

### 3. **Error Prevention**
- Write defensive code with proper validation
- Use error-first design patterns
- Implement comprehensive testing

### 4. **Knowledge Sharing**
- Document solutions for future reference
- Share debugging techniques with team
- Maintain troubleshooting knowledge base

---

**Last Updated**: January 17, 2025  
**Guide Version**: 1.0  
**Coverage**: Common Issues & Solutions
