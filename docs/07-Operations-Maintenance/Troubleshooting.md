# 🔧 Troubleshooting Guide

## 🚨 **EMERGENCY RESPONSE PROCEDURES**

### **Critical Issues (Immediate Action Required)**

#### **Application Not Loading**
```bash
# 1. Check if development server is running
curl http://localhost:5173
# Expected: HTML response or error details

# 2. Verify Node.js and npm versions
node --version  # Should be 18.17.0+
npm --version   # Should be 9.0.0+

# 3. Check for port conflicts
lsof -i :5173  # macOS/Linux
netstat -ano | findstr :5173  # Windows

# 4. Restart development server
npm run dev
```

#### **Database Connection Failures**
```bash
# 1. Verify Supabase credentials
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# 2. Test connection manually
curl -H "apikey: $VITE_SUPABASE_ANON_KEY" \
     "$VITE_SUPABASE_URL/rest/v1/profiles?select=id&limit=1"

# 3. Check Supabase service status
# Visit: https://status.supabase.com

# 4. Verify network connectivity
ping your-project.supabase.co
```

#### **Build Failures**
```bash
# 1. Clear all caches
rm -rf node_modules package-lock.json .vite
npm install

# 2. Check for TypeScript errors
npm run type-check

# 3. Fix linting issues
npm run lint:fix

# 4. Verify dependencies
npm audit
npm update
```

---

## 🔍 **COMMON DEVELOPMENT ISSUES**

### **Environment Setup Problems**

#### **Node Version Conflicts**
```bash
# Problem: Wrong Node.js version
# Symptoms: Build errors, dependency conflicts

# Solution 1: Use Node Version Manager
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Use correct Node version
nvm install 18.17.0
nvm use 18.17.0
nvm alias default 18.17.0

# Verify installation
node --version  # Should show v18.17.0
```

#### **Package Installation Failures**
```bash
# Problem: npm install fails
# Symptoms: Network errors, permission issues, corrupted cache

# Solution 1: Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Solution 2: Fix permissions (avoid sudo)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Solution 3: Use different registry
npm install --registry https://registry.npmjs.org/
```

#### **Environment Variable Issues**
```bash
# Problem: Environment variables not loading
# Symptoms: Supabase connection errors, undefined variables

# Check file exists and format
ls -la .env.local
cat .env.local

# Verify Vite prefix (required)
# ❌ WRONG
SUPABASE_URL=https://...

# ✅ CORRECT  
VITE_SUPABASE_URL=https://...

# Restart development server after changes
npm run dev
```

---

### **TypeScript Issues**

#### **Type Errors**
```typescript
// Problem: TypeScript compilation errors
// Symptoms: Red underlines, build failures

// Common Issue 1: Missing type definitions
// Solution: Install type definitions
npm install --save-dev @types/node @types/react @types/react-dom

// Common Issue 2: Strict mode violations
// Check: tsconfig.json configuration
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}

// Common Issue 3: Import path errors
// ❌ WRONG
import { Button } from 'src/components/ui/button';

// ✅ CORRECT
import { Button } from '@/components/ui/button';
```

#### **Module Resolution Issues**
```bash
# Problem: Cannot resolve module paths
# Symptoms: Import errors, module not found

# Check tsconfig.json path mapping
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/lib/*": ["src/lib/*"]
    }
  }
}

# Verify Vite configuration
// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

---

### **Database & API Issues**

#### **Supabase Connection Problems**
```typescript
// Problem: Authentication failures
// Symptoms: 401 errors, user not authenticated

// Debug authentication status
const debugAuth = async () => {
  const { data: session } = await supabase.auth.getSession();
  console.log('Current session:', session);
  
  const { data: user } = await supabase.auth.getUser();
  console.log('Current user:', user);
};

// Test database access
const testDatabaseAccess = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
      
    if (error) {
      console.error('Database error:', error);
    } else {
      console.log('Database accessible:', data);
    }
  } catch (err) {
    console.error('Connection error:', err);
  }
};
```

#### **RLS Policy Issues**
```sql
-- Problem: Row Level Security blocking legitimate access
-- Symptoms: Empty results despite data existing

-- Debug RLS policies
-- 1. Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- 2. List policies for specific table
SELECT * FROM pg_policies WHERE tablename = 'challenges';

-- 3. Test policy with specific user
SET ROLE authenticated;
SET request.jwt.claims TO '{"sub": "user-uuid-here"}';
SELECT * FROM challenges WHERE id = 'challenge-uuid';
```

#### **Real-time Subscription Issues**
```typescript
// Problem: Real-time updates not working
// Symptoms: UI not updating, subscription errors

// Debug subscription setup
const debugSubscription = () => {
  const subscription = supabase
    .channel('challenges')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'challenges'
    }, payload => {
      console.log('Real-time payload:', payload);
    })
    .subscribe((status) => {
      console.log('Subscription status:', status);
    });

  // Cleanup function
  return () => subscription.unsubscribe();
};

// Common issues and solutions:
// 1. Channel name conflicts - use unique names
// 2. Subscription not cleaned up - use cleanup in useEffect
// 3. RLS blocking subscription - verify policies
```

---

### **Performance Issues**

#### **Slow Page Loading**
```bash
# Problem: Application loading slowly
# Symptoms: Long initial load times, poor user experience

# 1. Analyze bundle size
npm run build
npm run analyze

# Look for:
# - Large dependencies (>500KB)
# - Duplicate packages
# - Unused code

# 2. Implement code splitting
// ❌ Direct import (loads immediately)
import { LargeComponent } from './LargeComponent';

// ✅ Lazy loading (loads when needed)
const LargeComponent = lazy(() => import('./LargeComponent'));

# 3. Optimize images
# Convert to WebP format
# Implement lazy loading
# Use proper sizing
```

#### **Memory Leaks**
```typescript
// Problem: Memory usage growing over time
// Symptoms: Browser slowing down, crashes

// Common causes and solutions:

// 1. Uncleared intervals/timeouts
useEffect(() => {
  const interval = setInterval(fetchData, 5000);
  
  // ✅ Always clean up
  return () => clearInterval(interval);
}, []);

// 2. Event listeners not removed
useEffect(() => {
  const handleScroll = () => {
    // Handle scroll
  };
  
  window.addEventListener('scroll', handleScroll);
  
  // ✅ Remove listener
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

// 3. Unclosed subscriptions
useEffect(() => {
  const subscription = supabase
    .channel('updates')
    .subscribe();
    
  // ✅ Unsubscribe on cleanup
  return () => subscription.unsubscribe();
}, []);
```

#### **Query Performance Issues**
```typescript
// Problem: Database queries running slowly
// Symptoms: Long loading times, timeout errors

// 1. Add proper indexes (database level)
// 2. Optimize query patterns

// ❌ N+1 query problem
const challenges = await supabase.from('challenges').select('*');
for (const challenge of challenges) {
  const ideas = await supabase
    .from('ideas')
    .select('*')
    .eq('challenge_id', challenge.id);
}

// ✅ Single query with joins
const challengesWithIdeas = await supabase
  .from('challenges')
  .select(`
    *,
    ideas (*)
  `);

// 3. Implement pagination
const { data, error } = await supabase
  .from('challenges')
  .select('*')
  .range(0, 19)  // First 20 items
  .order('created_at', { ascending: false });
```

---

## 🎨 **UI/UX Issues**

### **Styling Problems**

#### **TailwindCSS Not Working**
```bash
# Problem: Tailwind classes not applying
# Symptoms: Styles not loading, classes ignored

# 1. Verify Tailwind installation
npm list tailwindcss
npm list @tailwindcss/typography

# 2. Check configuration
# tailwind.config.ts
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // ... rest of config
}

# 3. Verify CSS imports
# src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

# 4. Clear build cache
rm -rf .vite
npm run dev
```

#### **Dark Mode Issues**
```typescript
// Problem: Dark mode not switching correctly
// Symptoms: Inconsistent theming, wrong colors

// Check theme provider setup
import { ThemeProvider } from '@/components/theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      {/* App content */}
    </ThemeProvider>
  );
}

// Debug theme state
const { theme, setTheme } = useTheme();
console.log('Current theme:', theme);

// Verify CSS custom properties
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
}
```

#### **RTL Layout Issues**
```css
/* Problem: Arabic text not displaying correctly */
/* Symptoms: Text direction issues, layout breaking */

/* Check HTML lang attribute */
<html lang="ar" dir="rtl">

/* Verify Tailwind RTL plugin */
/* tailwind.config.ts */
module.exports = {
  plugins: [
    require('tailwindcss-rtl'),
  ],
}

/* Use RTL-aware classes */
/* ❌ Fixed direction */
.text-left { text-align: left; }

/* ✅ Direction-aware */
.text-start { text-align: start; }

/* Debug RTL styles */
/* Add to CSS for debugging */
[dir="rtl"] * {
  outline: 1px solid red;
}
```

---

### **Responsive Design Issues**

#### **Mobile Layout Breaking**
```css
/* Problem: Mobile layout not responsive */
/* Symptoms: Horizontal scrolling, overlapping elements */

/* 1. Check viewport meta tag */
<meta name="viewport" content="width=device-width, initial-scale=1.0">

/* 2. Use mobile-first approach */
/* ❌ Desktop-first */
.container {
  @apply w-full px-8;
  
  @screen md {
    @apply px-4;
  }
}

/* ✅ Mobile-first */
.container {
  @apply w-full px-4;
  
  @screen md {
    @apply px-8;
  }
}

/* 3. Test with browser DevTools */
/* - Toggle device mode
/* - Test different screen sizes
/* - Check for overflow issues
```

---

## 🔐 **Security Issues**

### **Authentication Problems**

#### **Token Expiration Issues**
```typescript
// Problem: Users getting logged out unexpectedly
// Symptoms: Frequent login prompts, 401 errors

// Implement automatic token refresh
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed successfully');
  }
  
  if (event === 'SIGNED_OUT') {
    // Clear application state
    queryClient.clear();
    // Redirect to login
    navigate('/auth/login');
  }
});

// Handle expired tokens gracefully
const handleApiError = (error: any) => {
  if (error?.message?.includes('JWT expired')) {
    // Attempt to refresh token
    supabase.auth.refreshSession();
  }
};
```

#### **Permission Denied Errors**
```sql
-- Problem: Users can't access data they should be able to
-- Symptoms: Empty results, 403 errors

-- Debug RLS policies step by step
-- 1. Temporarily disable RLS for testing
ALTER TABLE challenges DISABLE ROW LEVEL SECURITY;

-- 2. Test query without RLS
SELECT * FROM challenges WHERE id = 'challenge-uuid';

-- 3. Re-enable RLS and test policy
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- 4. Test specific policy conditions
SELECT 
  c.*,
  up.user_id,
  up.organization_id
FROM challenges c
JOIN user_profiles up ON up.organization_id = c.organization_id
WHERE up.user_id = auth.uid();
```

---

## 📱 **Mobile-Specific Issues**

### **iOS Safari Problems**
```css
/* Problem: iOS Safari rendering issues */
/* Symptoms: Viewport jumping, keyboard issues */

/* 1. Fix viewport height issues */
.full-height {
  height: 100vh;
  height: -webkit-fill-available;
}

html {
  height: -webkit-fill-available;
}

/* 2. Prevent zoom on input focus */
input, select, textarea {
  font-size: 16px; /* Prevents zoom on iOS */
}

/* 3. Fix sticky positioning */
.sticky-header {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
}
```

### **Touch Interface Issues**
```css
/* Problem: Poor touch experience */
/* Symptoms: Small tap targets, accidental taps */

/* 1. Ensure minimum touch target size */
.touch-target {
  min-height: 44px; /* iOS recommendation */
  min-width: 44px;
}

/* 2. Add touch feedback */
.button {
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.1s ease;
}

.button:active {
  transform: scale(0.98);
}

/* 3. Prevent text selection on UI elements */
.ui-element {
  -webkit-user-select: none;
  user-select: none;
}
```

---

## 📊 **Performance Monitoring**

### **Debugging Performance Issues**
```javascript
// 1. React DevTools Profiler
// Enable profiling in development
if (process.env.NODE_ENV === 'development') {
  window.React = React;
}

// 2. Web Vitals monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);

// 3. Custom performance markers
performance.mark('component-render-start');
// Component rendering...
performance.mark('component-render-end');
performance.measure(
  'component-render',
  'component-render-start',
  'component-render-end'
);
```

### **Database Performance Monitoring**
```sql
-- Monitor slow queries
SELECT 
  query,
  mean_exec_time,
  calls,
  total_exec_time
FROM pg_stat_statements
WHERE mean_exec_time > 100  -- Queries taking >100ms
ORDER BY mean_exec_time DESC;

-- Check index usage
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE schemaname = 'public'
ORDER BY n_distinct DESC;
```

---

## 🆘 **Emergency Procedures**

### **Production Issues**

#### **Site Down Recovery**
```bash
# 1. Check system status
curl -I https://your-domain.com
# Look for: HTTP status code, response time

# 2. Check error logs
# Supabase Dashboard → Logs → Error logs
# Browser Console → Network tab

# 3. Rollback if needed
git revert HEAD
git push origin main

# 4. Notify stakeholders
# Use established communication channels
# Provide status updates every 15 minutes
```

#### **Data Corruption Recovery**
```sql
-- 1. Assess damage scope
SELECT COUNT(*) FROM affected_table 
WHERE created_at > 'timestamp-of-issue';

-- 2. Restore from backup
-- Supabase Dashboard → Database → Backups
-- Select restore point before corruption

-- 3. Verify data integrity
SELECT 
  table_name,
  COUNT(*) as row_count
FROM information_schema.tables
WHERE table_schema = 'public';
```

---

## 📞 **Getting Help**

### **Escalation Procedures**

#### **Level 1: Self-Service**
- Check this troubleshooting guide
- Review error messages and logs
- Search existing documentation
- Try common solutions

#### **Level 2: Team Support**
- Contact team members via chat
- Share error messages and steps to reproduce
- Provide system information and screenshots
- Expected response: Within 2 hours during business hours

#### **Level 3: External Support**
- Supabase Support (for database issues)
- Vercel/Netlify Support (for hosting issues)
- npm/Node.js Community (for tooling issues)
- Expected response: 24-48 hours

### **Information to Provide**
```bash
# When seeking help, include:
1. Error message (exact text)
2. Steps to reproduce
3. Expected vs actual behavior
4. System information:
   - Node.js version: node --version
   - npm version: npm --version  
   - Operating system: uname -a
   - Browser and version
5. Relevant code snippets
6. Screenshots/screen recordings
7. Console logs (browser and terminal)
```

---

This comprehensive troubleshooting guide covers the most common issues encountered during development and production. When in doubt, start with the most common solutions and work your way up to more complex debugging techniques.

*For preventive measures and best practices, see [Performance Optimization](./Performance-Optimization.md).*