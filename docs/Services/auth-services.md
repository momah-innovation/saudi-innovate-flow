# Authentication Services Documentation

User authentication, authorization, and security services in the Enterprise Management System.

## 🔐 Authentication Architecture

### 🎯 Supabase Authentication

**Location**: `src/hooks/useAuth.ts`

#### Core Authentication Hook
```typescript
import { useAuth } from '@/hooks/useAuth';

const MyComponent = () => {
  const { 
    user, 
    profile, 
    isLoading, 
    signIn, 
    signOut, 
    signUp,
    resetPassword 
  } = useAuth();

  // Protected content
  if (!user) return <LoginForm />;
  
  return <DashboardContent />;
};
```

#### Authentication Methods
```typescript
// Email/Password authentication
const { data, error } = await signIn({
  email: 'user@example.com',
  password: 'securePassword123'
});

// Social authentication
const { data, error } = await signInWithProvider({
  provider: 'google' | 'linkedin' | 'microsoft'
});

// Magic link authentication
const { data, error } = await signInWithOtp({
  email: 'user@example.com',
  options: {
    emailRedirectTo: 'https://app.innovation.ae/auth/callback'
  }
});
```

### 🔑 Multi-Factor Authentication (MFA)

#### TOTP Setup
```typescript
import { useMFA } from '@/hooks/useMFA';

const MFASetup = () => {
  const { 
    enrollMFA, 
    verifyMFA, 
    disableMFA, 
    mfaFactors 
  } = useMFA();

  const handleEnrollTOTP = async () => {
    const { data } = await enrollMFA({ factorType: 'totp' });
    // Show QR code for authenticator app
    return data.qr_code;
  };
};
```

#### MFA Verification
```typescript
// Verify TOTP code
const verifyTOTP = async (code: string) => {
  const { data, error } = await verifyMFA({
    factorId: mfaFactor.id,
    challengeId: challenge.id,
    code: code
  });
  
  if (data) {
    // MFA verification successful
    router.push('/dashboard');
  }
};
```

### 🏢 Enterprise SSO Integration

#### SAML Configuration
```typescript
// SAML SSO setup
const samlConfig = {
  entityId: 'innovation-platform',
  assertionConsumerServiceUrl: 'https://api.innovation.ae/auth/saml/acs',
  singleLogoutServiceUrl: 'https://api.innovation.ae/auth/saml/sls',
  x509cert: process.env.SAML_CERT,
  privateKey: process.env.SAML_PRIVATE_KEY
};

// Initiate SAML authentication
const initiateSSO = async (organizationDomain: string) => {
  const { data } = await supabase.auth.signInWithSSO({
    domain: organizationDomain,
    options: {
      redirectTo: 'https://app.innovation.ae/dashboard'
    }
  });
};
```

#### OpenID Connect
```typescript
// OIDC provider configuration
const oidcProviders = {
  microsoft: {
    clientId: process.env.MICROSOFT_CLIENT_ID,
    tenantId: process.env.MICROSOFT_TENANT_ID,
    scopes: ['openid', 'profile', 'email', 'User.Read']
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    scopes: ['openid', 'profile', 'email']
  }
};
```

## 🛡️ Role-Based Access Control (RBAC)

### 👤 Role Management System

**Location**: `src/hooks/useRolePermissions.ts`

#### Role Hierarchy
```typescript
// Role definitions with hierarchy levels
export const roleHierarchy = {
  super_admin: { level: 0, permissions: ['*'] },
  admin: { level: 1, permissions: ['manage_all'] },
  challenge_manager: { level: 2, permissions: ['manage_challenges'] },
  team_lead: { level: 3, permissions: ['manage_team'] },
  innovator: { level: 4, permissions: ['submit_ideas'] },
  expert: { level: 4, permissions: ['evaluate_submissions'] },
  partner: { level: 4, permissions: ['view_challenges'] },
  user: { level: 5, permissions: ['basic_access'] }
};
```

#### Permission Checks
```typescript
import { useRolePermissions } from '@/hooks/useRolePermissions';

const AdminPanel = () => {
  const { 
    isAdmin, 
    canManageUsers, 
    canViewAnalytics,
    hasPermission 
  } = useRolePermissions();

  if (!isAdmin) {
    return <AccessDenied />;
  }

  return (
    <div>
      {canManageUsers && <UserManagement />}
      {canViewAnalytics && <AnalyticsDashboard />}
      {hasPermission(['manage_challenges']) && <ChallengeAdmin />}
    </div>
  );
};
```

### 🔒 Row Level Security (RLS)

#### Database Security Policies
```sql
-- Challenge access policy
CREATE POLICY "users_can_view_accessible_challenges" 
ON challenges FOR SELECT 
USING (
  sensitivity_level = 'normal' 
  OR user_has_access_to_challenge(id)
);

-- User profile access
CREATE POLICY "users_can_update_own_profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Admin access override
CREATE POLICY "admins_can_access_all" 
ON challenges FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));
```

#### Dynamic Permission Evaluation
```typescript
// Security function for challenge access
export const userHasAccessToChallenge = (
  challengeId: string,
  userRoles: UserRole[],
  userDepartment?: string
) => {
  // Public challenges
  if (challenge.sensitivity_level === 'normal') return true;
  
  // Admin override
  if (userRoles.includes('admin')) return true;
  
  // Department-specific access
  if (challenge.department_id === userDepartment) return true;
  
  // Team member access
  if (userRoles.includes('team_member')) return true;
  
  return false;
};
```

### 🏗️ Permission System Architecture

#### Granular Permissions
```typescript
// Permission matrix
export const permissions = {
  // User management
  'users.create': ['admin', 'hr_manager'],
  'users.update': ['admin', 'hr_manager', 'self'],
  'users.delete': ['admin'],
  'users.view': ['admin', 'hr_manager', 'team_lead'],
  
  // Challenge management
  'challenges.create': ['admin', 'challenge_manager'],
  'challenges.update': ['admin', 'challenge_manager', 'creator'],
  'challenges.delete': ['admin'],
  'challenges.publish': ['admin', 'challenge_manager'],
  
  // Analytics access
  'analytics.view_basic': ['team_lead', 'manager'],
  'analytics.view_advanced': ['admin', 'analyst'],
  'analytics.export': ['admin'],
  
  // System administration
  'system.configure': ['admin'],
  'system.backup': ['admin'],
  'system.logs': ['admin', 'security_officer']
};
```

#### Dynamic Role Assignment
```typescript
// Role assignment with validation
export const assignRoleWithValidation = async (
  targetUserId: string,
  targetRole: UserRole,
  justification: string,
  expiresAt?: Date
) => {
  const currentUser = await getCurrentUser();
  
  // Validate assignment permissions
  if (!canAssignRole(currentUser.roles, targetRole)) {
    throw new Error('Insufficient privileges to assign role');
  }
  
  // Create role assignment record
  const assignment = await supabase
    .from('user_roles')
    .insert({
      user_id: targetUserId,
      role: targetRole,
      granted_by: currentUser.id,
      justification,
      expires_at: expiresAt,
      is_active: true
    });
    
  // Log role assignment
  await logSecurityEvent('ROLE_ASSIGNED', {
    target_user_id: targetUserId,
    role: targetRole,
    granted_by: currentUser.id,
    justification
  });
  
  return assignment;
};
```

## 🔐 Session Management

### 🕐 Session Lifecycle

#### Session Configuration
```typescript
// Session settings
const sessionConfig = {
  // JWT token expiration
  accessTokenLifetime: 60 * 60, // 1 hour
  refreshTokenLifetime: 30 * 24 * 60 * 60, // 30 days
  
  // Session security
  requireEmailConfirmation: true,
  allowMultipleSessions: true,
  sessionTimeout: 30 * 60, // 30 minutes idle
  
  // Security headers
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
};
```

#### Session Monitoring
```typescript
import { useSessionMonitor } from '@/hooks/useSessionMonitor';

const App = () => {
  const { 
    isSessionActive, 
    timeRemaining, 
    extendSession,
    sessionWarning 
  } = useSessionMonitor();

  // Show session warning
  if (sessionWarning) {
    return (
      <SessionWarningModal 
        timeRemaining={timeRemaining}
        onExtend={extendSession}
      />
    );
  }
};
```

### 🔄 Token Management

#### JWT Token Handling
```typescript
// Token refresh logic
export const useTokenRefresh = () => {
  const refreshToken = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        // Redirect to login if refresh fails
        await signOut();
        router.push('/auth/login');
      }
      
      return data.session;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  };
  
  // Auto-refresh before expiration
  useEffect(() => {
    const interval = setInterval(refreshToken, 50 * 60 * 1000); // 50 minutes
    return () => clearInterval(interval);
  }, []);
};
```

#### Token Security
```typescript
// Token validation middleware
export const validateToken = async (token: string) => {
  try {
    const { data: user } = await supabase.auth.getUser(token);
    
    // Additional security checks
    if (!user.email_confirmed_at) {
      throw new Error('Email not confirmed');
    }
    
    if (user.banned_until && new Date(user.banned_until) > new Date()) {
      throw new Error('User account suspended');
    }
    
    return user;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
```

## 🛡️ Security Monitoring & Audit

### 📊 Security Analytics

**Location**: `src/hooks/useSecurityAnalytics.ts`

#### Security Event Tracking
```typescript
import { useSecurityAnalytics } from '@/hooks/useSecurityAnalytics';

const SecurityDashboard = () => {
  const { 
    securityMetrics, 
    suspiciousActivities, 
    riskLevel,
    securityScore 
  } = useSecurityAnalytics();

  return (
    <div>
      <SecurityScore score={securityScore} />
      <ThreatLevel level={riskLevel} />
      <SuspiciousActivityList activities={suspiciousActivities} />
    </div>
  );
};
```

#### Audit Logging
```typescript
// Security event logging
export const logSecurityEvent = async (
  eventType: SecurityEventType,
  details: Record<string, any>,
  riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'
) => {
  await supabase.from('security_audit_log').insert({
    user_id: getCurrentUserId(),
    event_type: eventType,
    details,
    risk_level: riskLevel,
    ip_address: getClientIP(),
    user_agent: getUserAgent(),
    created_at: new Date().toISOString()
  });
};

// Usage examples
await logSecurityEvent('LOGIN_SUCCESS', { method: 'email' });
await logSecurityEvent('ROLE_ESCALATION_ATTEMPT', { 
  target_role: 'admin' 
}, 'high');
await logSecurityEvent('SUSPICIOUS_API_USAGE', { 
  endpoint: '/api/admin/users',
  rate_limit_exceeded: true 
}, 'medium');
```

### 🚨 Threat Detection

#### Anomaly Detection
```typescript
// Detect suspicious patterns
export const detectAnomalies = async (userId: string) => {
  const recentActivity = await getUserActivity(userId, '24h');
  
  const anomalies = [];
  
  // Unusual login patterns
  if (recentActivity.loginAttempts > 10) {
    anomalies.push({
      type: 'excessive_login_attempts',
      severity: 'high',
      details: { attempts: recentActivity.loginAttempts }
    });
  }
  
  // Geographic anomalies
  if (recentActivity.unusualLocation) {
    anomalies.push({
      type: 'geographic_anomaly',
      severity: 'medium',
      details: { location: recentActivity.location }
    });
  }
  
  // Permission escalation attempts
  if (recentActivity.permissionRequests > 5) {
    anomalies.push({
      type: 'permission_escalation',
      severity: 'high',
      details: { requests: recentActivity.permissionRequests }
    });
  }
  
  return anomalies;
};
```

#### Rate Limiting & Abuse Prevention
```typescript
// Rate limiting configuration
export const rateLimits = {
  login: { attempts: 5, window: '15m', blockDuration: '30m' },
  api: { requests: 1000, window: '1h' },
  password_reset: { attempts: 3, window: '1h' },
  role_requests: { attempts: 10, window: '24h' }
};

// Rate limit check
export const checkRateLimit = async (
  userId: string, 
  action: string
) => {
  const limit = rateLimits[action];
  const attempts = await getRecentAttempts(userId, action, limit.window);
  
  if (attempts >= limit.attempts) {
    await logSecurityEvent('RATE_LIMIT_EXCEEDED', {
      action,
      attempts,
      limit: limit.attempts
    }, 'medium');
    
    throw new Error(`Rate limit exceeded for ${action}`);
  }
};
```

## 🔧 Authentication Utilities

### 🛠️ Helper Functions

#### User Context Utilities
```typescript
// Get current user with role information
export const useCurrentUser = () => {
  const { user } = useAuth();
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => getUserProfile(user!.id),
    enabled: !!user
  });
  
  return {
    user,
    profile,
    roles: profile?.user_roles?.map(r => r.role) || [],
    permissions: calculatePermissions(profile?.user_roles || [])
  };
};

// Protected route wrapper
export const ProtectedRoute = ({ 
  children, 
  requiredRoles = [],
  requiredPermissions = []
}) => {
  const { user, roles, permissions } = useCurrentUser();
  
  if (!user) {
    return <LoginPage />;
  }
  
  if (requiredRoles.length > 0 && !hasAnyRole(roles, requiredRoles)) {
    return <AccessDenied />;
  }
  
  if (requiredPermissions.length > 0 && !hasAnyPermission(permissions, requiredPermissions)) {
    return <AccessDenied />;
  }
  
  return children;
};
```

#### Security Validation
```typescript
// Password strength validation
export const validatePasswordStrength = (password: string) => {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChars: /[!@#$%^&*]/.test(password),
    notCommon: !commonPasswords.includes(password.toLowerCase())
  };
  
  const score = Object.values(requirements).filter(Boolean).length;
  
  return {
    requirements,
    score,
    strength: score >= 5 ? 'strong' : score >= 3 ? 'medium' : 'weak'
  };
};

// Email validation
export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

---

*Authentication Methods: 8+ supported | Security Features: MFA, SSO, RBAC | Compliance: ✅ Enterprise Grade*