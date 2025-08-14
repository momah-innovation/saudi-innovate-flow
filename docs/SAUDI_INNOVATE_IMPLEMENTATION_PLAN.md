# Saudi Innovate Flow - Detailed Fix Implementation Plan

## Overview

This plan provides step-by-step fixes that maintain existing pages, styles, and themes while addressing critical issues without breaking the application.

---

## Phase 1: Critical Security Fixes (Week 1)

**Goal:** Fix security vulnerabilities without changing UI/UX

### Day 1: Environment Variables & Secret Management

#### Step 1: Remove Hardcoded Supabase URLs/Keys

```typescript
// src/integrations/supabase/client.ts - REPLACE hardcoded values
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use Vite env in browser; fall back to process for SSR/tools
const nodeEnv = (globalThis as any)?.process?.env || {};
const SUPABASE_URL = (import.meta as any)?.env?.VITE_SUPABASE_URL ?? nodeEnv.SUPABASE_URL ?? '';
const SUPABASE_PUBLISHABLE_KEY = (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY ?? nodeEnv.SUPABASE_ANON_KEY ?? '';

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.warn('[supabase] Missing SUPABASE_URL or anon key. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
});
```

#### Step 2: Create .env.example File

```dotenv
# .env.example
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY

SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

#### Step 3: Secrets Scan and Cleanup

```bash
# Run security scan
grep -R --line-number --color -E "supabase\\.co|SUPABASE_.*KEY|eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" .

# Clean up any hardcoded secrets found
```

### Day 2: Remove Console Logs Safely

#### Step 1: Create Debug Logger Wrapper

```typescript
// src/utils/debugLogger.ts
const isDevelopment = import.meta.env.DEV;

export const debugLog = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};
```

#### Step 2: Replace All Console Statements

```bash
# Create backup first
cp -r src src_backup

# Use this script to replace (save as fix-console-logs.js)
```

```javascript
// fix-console-logs.js
const fs = require("fs");
const path = require("path");

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // Import debugLogger at top of file if console is used
  if (content.includes("console.")) {
    if (!content.includes("debugLogger")) {
      content = `import { debugLog } from '@/utils/debugLogger';\n` + content;
    }

    // Replace console statements
    content = content
      .replace(/console\.log\(/g, "debugLog.log(")
      .replace(/console\.error\(/g, "debugLog.error(")
      .replace(/console\.warn\(/g, "debugLog.warn(")
      .replace(/console\.debug\(/g, "debugLog.debug(");

    fs.writeFileSync(filePath, content);
  }
}

// Run on all TypeScript/JavaScript files
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory() && !file.includes("node_modules")) {
      processDirectory(fullPath);
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      replaceInFile(fullPath);
    }
  });
}

processDirectory("./src");
```

### Day 3-4: Fix Authentication Race Condition

#### Step 1: Fix AuthContext Race Condition

```typescript
// src/contexts/AuthContext.tsx - REPLACE the useEffect

useEffect(() => {
  let isSubscribed = true;
  let abortController = new AbortController();

  const initializeAuth = async () => {
    try {
      // Get initial session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isSubscribed) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchUserProfile(session.user.id, abortController.signal);
      }

      setLoading(false);
    } catch (error) {
      if (!abortController.signal.aborted) {
        logger.error(
          "Auth initialization error",
          { component: "AuthContext" },
          error
        );
        setLoading(false);
      }
    }
  };

  // Set up auth state listener
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (!isSubscribed) return;

    setSession(session);
    setUser(session?.user ?? null);

    if (session?.user) {
      // Cancel previous profile fetch
      abortController.abort();
      abortController = new AbortController();
      await fetchUserProfile(session.user.id, abortController.signal);
    } else {
      setUserProfile(null);
    }
  });

  initializeAuth();

  return () => {
    isSubscribed = false;
    abortController.abort();
    subscription.unsubscribe();
  };
}, []);

// Update fetchUserProfile to accept AbortSignal
const fetchUserProfile = async (userId: string, signal?: AbortSignal) => {
  try {
    if (signal?.aborted) return;

    // Your existing fetch logic here
    // Add signal to fetch calls:
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()
      .abortSignal(signal);

    if (!signal?.aborted) {
      setUserProfile(profile);
    }
  } catch (error) {
    if (!signal?.aborted) {
      logger.error("Profile fetch error", { component: "AuthContext" }, error);
    }
  }
};
```

### Day 3: Lock Down Public Migration Tools

#### Step 1: Secure or Remove Migration Tools

```typescript
// public/run-migration.html - Option A: DELETE this file (recommended)
// Option B: If you must keep it, add these security measures:

// 1. Block non-localhost usage
if (!['localhost', '127.0.0.1', '0.0.0.0'].includes(location.hostname)) {
  alert('Migration tool only available on localhost for security');
  document.body.innerHTML = '<h1>Access Denied</h1>';
}

// 2. Remove hardcoded credentials
// 3. Require manual input of credentials
// 4. Add HMAC signature verification
```

### Day 4: Secure Edge Functions

#### Step 1: Lock Down Privilege Elevation Function

```typescript
// supabase/functions/elevate-user-privileges/index.ts
// Option A: DELETE this function (recommended)
// Option B: Add strict security controls:

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-internal-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Require valid JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Verify HMAC signature to prevent abuse
    const signature = req.headers.get('x-internal-signature');
    const timestamp = req.headers.get('x-timestamp');
    if (!signature || !timestamp) {
      return new Response(JSON.stringify({ error: 'Missing security headers' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. Verify timestamp freshness (prevent replay attacks)
    const now = Date.now();
    const requestTime = parseInt(timestamp);
    if (now - requestTime > 60000) { // 1 minute
      return new Response(JSON.stringify({ error: 'Request expired' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 4. Initialize Supabase with service role
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 5. Verify caller is super_admin
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(jwt);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role,is_active,expires_at')
      .eq('user_id', user.id)
      .eq('is_active', true);

    const isSuperAdmin = roles?.some(r => 
      r.role === 'super_admin' && 
      (!r.expires_at || new Date(r.expires_at) > new Date())
    );

    if (!isSuperAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden: super_admin required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 6. Process elevation request (remove hardcoded userId)
    const { targetUserId, reason } = await req.json();
    if (!targetUserId) {
      return new Response(JSON.stringify({ error: 'targetUserId required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 7. Log the elevation
    await supabase.from('admin_elevation_logs').insert({
      user_id: targetUserId,
      elevated_by: user.email,
      email: targetUserId,
      elevated_at: new Date().toISOString()
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Elevation error:', error);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

### Day 5: Database Security Hardening

#### Step 1: Ensure app_role Enum and Helper Functions

```sql
-- Create idempotent migration for role system
DO $$
BEGIN
  -- Create app_role enum if not exists
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE app_role AS ENUM (
      'super_admin','admin','innovator','expert','partner','team_member',
      'domain_expert','evaluator','stakeholder','mentor','department_head',
      'sector_lead','team_lead','project_manager','organization_admin',
      'entity_manager','deputy_manager','domain_manager','sub_domain_manager',
      'service_manager','user_manager','role_manager','challenge_manager',
      'expert_coordinator','content_manager','system_auditor','data_analyst',
      'campaign_manager','event_manager','stakeholder_manager',
      'partnership_manager','research_lead','external_expert','judge',
      'facilitator','viewer','innovation_manager'
    );
  END IF;
END$$;

-- Add missing enum values idempotently
DO $do$
DECLARE v text;
BEGIN
  FOREACH v IN ARRAY ARRAY[
    'super_admin','admin','innovator','expert','partner','team_member',
    'domain_expert','evaluator','stakeholder','mentor','department_head',
    'sector_lead','team_lead','project_manager','organization_admin',
    'entity_manager','deputy_manager','domain_manager','sub_domain_manager',
    'service_manager','user_manager','role_manager','challenge_manager',
    'expert_coordinator','content_manager','system_auditor','data_analyst',
    'campaign_manager','event_manager','stakeholder_manager',
    'partnership_manager','research_lead','external_expert','judge',
    'facilitator','viewer','innovation_manager'
  ] LOOP
    BEGIN
      EXECUTE format('ALTER TYPE app_role ADD VALUE IF NOT EXISTS %L', v);
    EXCEPTION WHEN others THEN
      NULL; -- ignore concurrent enum alter errors
    END;
  END LOOP;
END
$do$;

-- Enhanced has_role helper with expiration support
CREATE OR REPLACE FUNCTION public.has_role(p_user_id uuid, p_role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = p_user_id
      AND ur.role = p_role
      AND ur.is_active = true
      AND (ur.expires_at IS NULL OR ur.expires_at > now())
  );
$$;
```

### Day 6: Frontend Type Safety

#### Step 1: Align Frontend Types with Database

```typescript
// src/hooks/useRoleAccess.ts - UPDATE to use DB enum
import type { Database } from '@/integrations/supabase/types';

// Replace manual union with DB enum for stronger type safety
export type UserRole = Database['public']['Enums']['app_role'];

// Remove the old manual type definition and use the database enum
export const useRoleAccess = () => {
  // Implementation using the new type
};
```

#### Step 2: Add Minimal ProtectedRoute Tests

```typescript
// src/components/auth/__tests__/ProtectedRoute.test.tsx
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

// Mock the auth hook
vi.mock('@/contexts/AuthContext');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const TestComponent = () => <div>Protected Content</div>;

const renderProtectedRoute = (props = {}) => {
  return render(
    <BrowserRouter>
      <ProtectedRoute {...props}>
        <TestComponent />
      </ProtectedRoute>
    </BrowserRouter>
  );
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /auth when requireAuth and no user', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      userProfile: null,
      loading: false,
    });

    renderProtectedRoute({ requireAuth: true });
    
    expect(mockNavigate).toHaveBeenCalledWith('/auth', { 
      state: { from: expect.any(String) } 
    });
  });

  it('redirects to /profile/setup when profile completion < 80%', () => {
    (useAuth as any).mockReturnValue({
      user: { id: '123' },
      userProfile: { profile_completion_percentage: 50 },
      loading: false,
    });

    renderProtectedRoute({ requireAuth: true, requireProfile: true });
    
    expect(mockNavigate).toHaveBeenCalledWith('/profile/setup');
  });

  it('redirects to /dashboard when required role not satisfied', () => {
    (useAuth as any).mockReturnValue({
      user: { id: '123' },
      userProfile: { profile_completion_percentage: 90 },
      userRoles: ['user'],
      loading: false,
    });

    renderProtectedRoute({ 
      requireAuth: true, 
      requiredRole: 'admin' 
    });
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('renders content when all requirements met', () => {
    (useAuth as any).mockReturnValue({
      user: { id: '123' },
      userProfile: { profile_completion_percentage: 90 },
      userRoles: ['admin'],
      loading: false,
    });

    renderProtectedRoute({ 
      requireAuth: true, 
      requireProfile: true,
      requiredRole: 'admin' 
    });
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
```

### Day 7: Server Authentication Utilities

#### Step 1: Create Server Validation Middleware

```typescript
// src/utils/serverAuth.ts
import { supabase } from "@/integrations/supabase/client";

export async function validateServerAuth(token: string) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function validateRole(
  userId: string,
  requiredRole: string | string[]
) {
  const { data: roles, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("is_active", true);

  if (error) throw error;

  const userRoles = roles.map((r) => r.role);
  const requiredRoles = Array.isArray(requiredRole)
    ? requiredRole
    : [requiredRole];

  return requiredRoles.some((role) => userRoles.includes(role));
}
```

#### Step 2: Update ProtectedRoute (Non-Breaking)

```typescript
// src/components/auth/ProtectedRoute.tsx - ADD validation

import { validateServerAuth, validateRole } from "@/utils/serverAuth";

// Add server validation without breaking existing flow
useEffect(() => {
  const validateAccess = async () => {
    if (requireAuth && user) {
      try {
        const token = session?.access_token;
        if (token) {
          await validateServerAuth(token);

          if (requiredRole) {
            const hasAccess = await validateRole(user.id, requiredRole);
            if (!hasAccess) {
              logger.warn("Server-side role validation failed", {
                userId: user.id,
                requiredRole,
              });
              // Don't block immediately - log for monitoring
            }
          }
        }
      } catch (error) {
        logger.error(
          "Server validation error",
          { component: "ProtectedRoute" },
          error
        );
        // Don't break existing flow - just log
      }
    }
  };

  validateAccess();
}, [user, session, requiredRole]);
```

---

## Phase 2: Routing Fixes (Week 2)

**Goal:** Fix routing issues without breaking navigation

### Day 1: Fix React Fast Refresh

#### Step 1: Separate Hook Exports

```typescript
// src/contexts/AuthContext/index.tsx
export { AuthProvider } from "./AuthProvider";
export { useAuth } from "./useAuth";

// src/contexts/AuthContext/AuthProvider.tsx
// Move AuthProvider component here

// src/contexts/AuthContext/useAuth.tsx
// Move useAuth hook here
```

### Day 2-3: Fix Route Configuration

#### Step 1: Fix Lazy Loading Issues

```typescript
// src/routing/UnifiedRouter.tsx - UPDATE lazy imports

// Wrap lazy imports with error boundaries
const withErrorBoundary = (Component: React.ComponentType) => {
  return (props: any) => (
    <ErrorBoundary fallback={<div>Error loading page</div>}>
      <Component {...props} />
    </ErrorBoundary>
  );
};

// Update lazy loading with retry logic
const lazyWithRetry = (importFn: () => Promise<any>) => {
  return lazy(() =>
    importFn().catch((error) => {
      console.error("Failed to load component:", error);
      // Retry once after 1 second
      return new Promise((resolve) => {
        setTimeout(() => {
          importFn().then(resolve);
        }, 1000);
      });
    })
  );
};

// Update all lazy imports
const LandingPage = lazyWithRetry(() => import("@/pages/LandingPage"));
const AuthPage = lazyWithRetry(() => import("@/pages/Auth"));
// ... update all other imports
```

#### Step 2: Fix Missing Routes

```typescript
// src/routing/routes.ts - ADD missing routes

export const MISSING_ROUTES = {
  // Add any routes that are referenced but not defined
  PROFILE_EDIT: "/profile/edit",
  TEAM_DETAILS: "/teams/:teamId",
  IDEA_DETAILS: "/ideas/:ideaId",
  EVENT_REGISTER: "/events/:eventId/register",
};

// Merge with ALL_ROUTES
export const ALL_ROUTES = {
  ...PUBLIC_ROUTES,
  ...AUTHENTICATED_ROUTES,
  ...SUBSCRIPTION_ROUTES,
  ...ADMIN_ROUTES,
  ...DASHBOARD_ROUTES,
  ...MISSING_ROUTES,
} as const;
```

### Day 4: Fix Navigation Guards

#### Step 1: Add Navigation Middleware

```typescript
// src/hooks/useNavigationGuard.ts
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function useNavigationGuard() {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  const guardedNavigate = (
    path: string,
    options?: { requireAuth?: boolean; requireProfile?: boolean }
  ) => {
    if (options?.requireAuth && !user) {
      toast({
        title: "Authentication Required",
        description: "Please login to access this page",
        variant: "destructive",
      });
      navigate("/auth", { state: { from: path } });
      return;
    }

    if (
      options?.requireProfile &&
      userProfile?.profile_completion_percentage < 80
    ) {
      toast({
        title: "Complete Your Profile",
        description: "Please complete your profile to access this feature",
        variant: "warning",
      });
      navigate("/profile/setup");
      return;
    }

    navigate(path);
  };

  return guardedNavigate;
}
```

---

## Phase 3: Performance Optimization (Week 3)

**Goal:** Improve performance without changing functionality

### Day 1-2: Fix N+1 Queries

#### Step 1: Create Query Batching Utility

```typescript
// src/utils/queryBatcher.ts
export class QueryBatcher {
  private queries: Map<string, Promise<any>> = new Map();

  async batch<T>(key: string, queryFn: () => Promise<T>): Promise<T> {
    if (!this.queries.has(key)) {
      this.queries.set(key, queryFn());
    }

    try {
      const result = await this.queries.get(key);
      return result;
    } finally {
      // Clear after resolution
      setTimeout(() => this.queries.delete(key), 0);
    }
  }
}

export const queryBatcher = new QueryBatcher();
```

#### Step 2: Fix ChallengeDetails Queries

```typescript
// src/pages/ChallengeDetails.tsx - REPLACE sequential queries

// Instead of:
const { data: challengeData } = await supabase...
const { data: questionsData } = await supabase...
const { data: expertsData } = await supabase...

// Use parallel fetching:
const fetchChallengeDetails = async () => {
  setLoading(true);

  try {
    const [challengeResult, questionsResult, expertsResult] = await Promise.all([
      supabase.from('challenges').select('*').eq('id', challengeId).single(),
      supabase.from('challenge_focus_questions').select('*').eq('challenge_id', challengeId),
      supabase.from('challenge_experts').select('*, profiles(*)').eq('challenge_id', challengeId)
    ]);

    if (challengeResult.error) throw challengeResult.error;
    if (questionsResult.error) logger.warn('Questions fetch failed', questionsResult.error);
    if (expertsResult.error) logger.warn('Experts fetch failed', expertsResult.error);

    setChallenge(challengeResult.data);
    setFocusQuestions(questionsResult.data || []);
    setAssignedExperts(expertsResult.data || []);
  } catch (error) {
    logger.error('Failed to fetch challenge details', error);
    toast.error('Failed to load challenge details');
  } finally {
    setLoading(false);
  }
};
```

### Day 3: Add React.memo Strategically

#### Step 1: Memoize Heavy Components

```typescript
// src/components/dashboard/UserDashboard.tsx
import React, { memo } from "react";

// Wrap the export
export default memo(UserDashboard, (prevProps, nextProps) => {
  // Custom comparison if needed
  return prevProps.userId === nextProps.userId;
});

// For components with no props
export default memo(AdminDashboardComponent);
```

#### Step 2: Optimize Re-renders

```typescript
// src/hooks/useOptimizedState.ts
import { useState, useCallback } from "react";

export function useOptimizedState<T>(initialValue: T) {
  const [state, setState] = useState(initialValue);

  const optimizedSetState = useCallback((newValue: T | ((prev: T) => T)) => {
    setState((prev) => {
      const next =
        typeof newValue === "function"
          ? (newValue as (prev: T) => T)(prev)
          : newValue;

      // Only update if value actually changed
      return Object.is(prev, next) ? prev : next;
    });
  }, []);

  return [state, optimizedSetState] as const;
}
```

### Day 4-5: Fix Memory Leaks

#### Step 1: Create Cleanup Manager

```typescript
// src/utils/cleanupManager.ts
export class CleanupManager {
  private cleanups: Set<() => void> = new Set();

  add(cleanup: () => void) {
    this.cleanups.add(cleanup);
    return () => this.cleanups.delete(cleanup);
  }

  cleanup() {
    this.cleanups.forEach((fn) => fn());
    this.cleanups.clear();
  }
}

// Use in components
export function useCleanup() {
  const [manager] = useState(() => new CleanupManager());

  useEffect(() => {
    return () => manager.cleanup();
  }, [manager]);

  return manager;
}
```

#### Step 2: Fix WebSocket Subscriptions

```typescript
// src/hooks/useRealTimeCollaboration.tsx - FIX memory leak

const useRealTimeCollaboration = () => {
  const cleanup = useCleanup();

  useEffect(() => {
    const channel = supabase.channel("collaboration");

    const subscription = channel
      .on("presence", { event: "sync" }, () => {
        // Handle presence
      })
      .subscribe();

    // Register cleanup
    cleanup.add(() => {
      channel.unsubscribe();
    });

    return () => cleanup.cleanup();
  }, []);
};
```

---

## Phase 4: UI/UX Improvements (Week 4)

**Goal:** Enhance user experience without changing design

### Day 1: Progressive Profile Completion

#### Step 1: Lower Profile Requirement

```typescript
// src/components/auth/ProtectedRoute.tsx
// Change from 80% to 40% initially
if (
  requireProfile &&
  user &&
  (!userProfile || userProfile.profile_completion_percentage < 40)
) {
  // Show non-blocking notification instead
  toast({
    title: "Complete Your Profile",
    description: "Get access to more features by completing your profile",
    action: (
      <Button onClick={() => navigate("/profile/setup")}>Complete Now</Button>
    ),
  });
  // Don't block access
}
```

### Day 2: Add Loading States

#### Step 1: Create Loading Skeleton Component

```typescript
// src/components/ui/loading-skeleton.tsx
export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-muted rounded", className)} />
  );
}

// Usage in components
{loading ? (
  <div className="space-y-4">
    <LoadingSkeleton className="h-12 w-full" />
    <LoadingSkeleton className="h-32 w-full" />
    <LoadingSkeleton className="h-8 w-1/2" />
  </div>
) : (
  // Your actual content
)}
```

### Day 3: Improve Error Handling

#### Step 1: Create Global Error Boundary

```typescript
// src/components/ErrorBoundary.tsx
import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error tracking service
    logger.error("ErrorBoundary caught error", { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-6">
              We encountered an error. Please try refreshing the page.
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

---

## Phase 5: Infrastructure & Monitoring (Week 5)

**Goal:** Add production readiness without changing features

### Day 1-2: Add Caching Layer

#### Step 1: Implement Query Cache

```typescript
// src/utils/queryCache.ts
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class QueryCache {
  private cache = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T, ttl = 60000) {
    // 1 minute default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  invalidate(pattern?: string) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }
}

export const queryCache = new QueryCache();
```

### Day 3: Add Health Checks

#### Step 1: Create Health Check Service

```typescript
// src/services/healthCheck.ts
export class HealthCheckService {
  private checks = new Map<string, () => Promise<boolean>>();

  register(name: string, check: () => Promise<boolean>) {
    this.checks.set(name, check);
  }

  async runAll() {
    const results = new Map<string, boolean>();

    for (const [name, check] of this.checks) {
      try {
        results.set(name, await check());
      } catch {
        results.set(name, false);
      }
    }

    return results;
  }
}

// Register health checks
const healthCheck = new HealthCheckService();

healthCheck.register("supabase", async () => {
  const { error } = await supabase.from("profiles").select("count").limit(1);
  return !error;
});

healthCheck.register("auth", async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return true; // Auth service is responsive
});
```

### Day 4-5: Add Monitoring

#### Step 1: Add Performance Monitoring

```typescript
// src/utils/performanceMonitor.ts
export class PerformanceMonitor {
  private metrics = new Map<string, number[]>();

  startTimer(label: string): () => void {
    const start = performance.now();

    return () => {
      const duration = performance.now() - start;

      if (!this.metrics.has(label)) {
        this.metrics.set(label, []);
      }

      this.metrics.get(label)!.push(duration);

      // Log slow operations
      if (duration > 1000) {
        logger.warn(`Slow operation: ${label} took ${duration}ms`);
      }
    };
  }

  getMetrics(label: string) {
    const values = this.metrics.get(label) || [];
    if (values.length === 0) return null;

    return {
      count: values.length,
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }
}

export const perfMonitor = new PerformanceMonitor();
```

---

## Testing & Validation Plan

### Week 6: Testing Implementation

#### Unit Tests for Critical Functions

```typescript
// src/utils/__tests__/serverAuth.test.ts
describe("Server Authentication", () => {
  it("should validate valid tokens", async () => {
    const user = await validateServerAuth(validToken);
    expect(user).toBeDefined();
  });

  it("should reject invalid tokens", async () => {
    await expect(validateServerAuth(invalidToken)).rejects.toThrow();
  });
});
```

#### Integration Tests

```typescript
// src/pages/__tests__/ChallengeFlow.test.tsx
describe("Challenge Participation Flow", () => {
  it("should complete full challenge flow", async () => {
    // Test complete user journey
  });
});
```

---

## Rollback Strategy

### Safe Rollback Points

1. **Before Each Phase**: Create git tag

   ```bash
   git tag -a phase1-pre-security -m "Before security fixes"
   git push origin phase1-pre-security
   ```

2. **Database Backups**: Before migrations

   ```sql
   -- Create backup schema
   CREATE SCHEMA backup_20250114;
   -- Copy tables
   CREATE TABLE backup_20250114.profiles AS SELECT * FROM public.profiles;
   ```

3. **Feature Flags**: For gradual rollout
   ```typescript
   // src/config/featureFlags.ts
   export const features = {
     serverValidation: process.env.ENABLE_SERVER_VALIDATION === "true",
     newQueryCache: process.env.ENABLE_QUERY_CACHE === "true",
     progressiveProfile: process.env.ENABLE_PROGRESSIVE_PROFILE === "true",
   };
   ```

---

## Success Metrics

### Week 7: Validation

| Metric         | Before   | Target | Method          |
| -------------- | -------- | ------ | --------------- |
| Page Load Time | 8s       | <3s    | Lighthouse      |
| Console Logs   | 126      | 0      | Code scan       |
| Memory Leaks   | Multiple | 0      | Chrome DevTools |
| Failed Auth    | Unknown  | <0.1%  | Monitoring      |
| Query Time     | 3s avg   | <1s    | Performance API |
| Error Rate     | Unknown  | <1%    | Error tracking  |

---

## Maintenance Mode

During implementation, use maintenance mode for critical updates:

```typescript
// src/components/MaintenanceMode.tsx
export function MaintenanceMode() {
  if (process.env.MAINTENANCE_MODE !== "true") return null;

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold mb-4">System Maintenance</h1>
        <p className="text-muted-foreground">
          We're improving your experience. Back shortly!
        </p>
      </div>
    </div>
  );
}
```

---

## Final Checklist

### Pre-Production Deployment

- [ ] All console.logs removed
- [ ] Auth race condition fixed
- [ ] Server validation added
- [ ] Routes tested and working
- [ ] Memory leaks fixed
- [ ] Performance optimized
- [ ] Error boundaries added
- [ ] Health checks passing
- [ ] Monitoring configured
- [ ] Rollback plan tested
- [ ] Documentation updated
- [ ] Team trained on changes

---

## Conclusion

This plan provides a safe, incremental approach to fixing critical issues while maintaining the existing UI/UX and preventing breaking changes. Each phase builds on the previous one, with clear rollback points and success metrics.

**Total Timeline: 7 weeks**

- Week 1: Security fixes
- Week 2: Routing fixes
- Week 3: Performance optimization
- Week 4: UI/UX improvements
- Week 5: Infrastructure
- Week 6: Testing
- Week 7: Validation & deployment

The application will remain functional throughout the process, with improvements being transparent to end users.

---

## Implementation Notes

### Code Quality Standards

- All TypeScript interfaces must be properly typed
- No `any` types allowed in production code
- All async operations must handle errors gracefully
- Components must be memoized when appropriate
- Database queries must be optimized and batched where possible

### Performance Requirements

- Page load times under 3 seconds
- First contentful paint under 1.5 seconds
- Time to interactive under 3 seconds
- No memory leaks in long-running sessions
- Database queries under 1 second average

### Security Requirements

- All user inputs validated and sanitized
- Server-side authorization for all protected routes
- No console logs in production builds
- Proper error handling without information leakage
- Session management with proper cleanup
- **NEW:** No hardcoded Supabase URLs or keys in codebase
- **NEW:** All secrets managed through environment variables
- **NEW:** Public admin tools secured or removed
- **NEW:** Edge functions with proper authentication and authorization
- **NEW:** Database roles and permissions properly configured

### Security Validation Checklist

Before deployment, run these security validation steps:

#### 1. Secrets Scan
```bash
# Run comprehensive secrets scan
grep -R --line-number --color -E "supabase\\.co|SUPABASE_.*KEY|eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" .
# Should return no results in src/ directory
```

#### 2. Environment Configuration
```bash
# Verify environment variables are set
echo "VITE_SUPABASE_URL: ${VITE_SUPABASE_URL:0:20}..."
echo "VITE_SUPABASE_ANON_KEY: ${VITE_SUPABASE_ANON_KEY:0:20}..."
echo "SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY:0:20}..."
```

#### 3. Database Role Verification
```sql
-- Verify app_role enum exists
SELECT enumlabel FROM pg_enum WHERE enumtypid = 'app_role'::regtype;

-- Verify has_role function exists
SELECT proname, proargnames FROM pg_proc WHERE proname = 'has_role';

-- Check RLS policies are using proper role checks
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE qual LIKE '%has_role%' OR qual LIKE '%app_role%';
```

#### 4. Edge Function Security
```bash
# Verify no hardcoded credentials in edge functions
grep -r "jxpbiljkoibvqxzdkgod\|eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" supabase/functions/
# Should return no results

# Check privilege elevation function is secured or removed
ls -la supabase/functions/elevate-user-privileges/
```

#### 5. Build and Test Validation
```bash
# Ensure everything builds without errors
npm run build

# Run linting
npm run lint

# Run security-focused tests
npm run test -- --grep "security|auth|role"

# Verify TypeScript compilation
npx tsc --noEmit
```

### Monitoring Requirements

- Health checks for all critical services
- Performance monitoring for slow operations
- Error tracking with proper context
- User analytics for feature usage
- Database performance monitoring
- **NEW:** Security audit logging for privilege escalations
- **NEW:** Failed authentication attempt monitoring
- **NEW:** Environment variable usage tracking