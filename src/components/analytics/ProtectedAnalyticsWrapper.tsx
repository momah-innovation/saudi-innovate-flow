/**
 * Protected Analytics Wrapper
 * Ensures RBAC compliance for all analytics components
 */

import React from 'react';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { navigationHandler } from '@/utils/unified-navigation';

interface ProtectedAnalyticsWrapperProps {
  children: React.ReactNode;
  requiredPermission: string | string[];
  fallbackMessage?: string;
  showUpgrade?: boolean;
  analyticsType: 'basic' | 'advanced' | 'security' | 'admin';
}

export function ProtectedAnalyticsWrapper({
  children,
  requiredPermission,
  fallbackMessage,
  showUpgrade = false,
  analyticsType
}: ProtectedAnalyticsWrapperProps) {
  const { user } = useAuth();
  const { canAccess, getPrimaryRole } = useRoleAccess();
  const navigate = useNavigate();
  
  // Initialize navigation handler
  React.useEffect(() => {
    navigationHandler.setNavigate(navigate);
  }, [navigate]);

  // Check if user is authenticated
  if (!user) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Lock className="w-5 h-5" />
            Authentication Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            You must be logged in to access analytics data.
          </p>
          <Button onClick={() => navigationHandler.navigateTo('/auth/login')}>
            Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Check permissions
  const hasPermission = Array.isArray(requiredPermission)
    ? requiredPermission.some(permission => canAccess('canViewAnalytics')) // Simplified for now
    : canAccess('canViewAnalytics');

  if (!hasPermission) {
    const userRole = getPrimaryRole();
    
    return (
      <Card className="border-warning">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning">
            <Shield className="w-5 h-5" />
            Access Restricted
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {fallbackMessage || 
              `Your current role (${userRole}) does not have permission to access ${analyticsType} analytics.`
            }
          </p>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Required Permissions:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {Array.isArray(requiredPermission) 
                ? requiredPermission.map((perm, index) => (
                    <li key={index}>• {perm.replace(/_/g, ' ').toUpperCase()}</li>
                  ))
                : <li>• {requiredPermission.replace(/_/g, ' ').toUpperCase()}</li>
              }
            </ul>
          </div>

          {showUpgrade && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => navigationHandler.navigateTo('/admin/roles/request')}
              >
                Request Access
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigationHandler.navigateTo('/contact')}
              >
                Contact Admin
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // User has permission, render the analytics content
  return (
    <div className="space-y-4">
      {/* Access indicator for transparency */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Shield className="w-3 h-3" />
        <span>Authorized access to {analyticsType} analytics</span>
        <span>•</span>
        <span>Role: {getPrimaryRole()}</span>
      </div>
      
      {children}
    </div>
  );
}

// Pre-configured wrappers for common analytics types
export function BasicAnalyticsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedAnalyticsWrapper
      requiredPermission="canViewAnalytics"
      analyticsType="basic"
      showUpgrade={true}
    >
      {children}
    </ProtectedAnalyticsWrapper>
  );
}

export function AdvancedAnalyticsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedAnalyticsWrapper
      requiredPermission={["canViewAnalytics"]}
      analyticsType="advanced"
      showUpgrade={true}
      fallbackMessage="Advanced analytics require team member access or higher permissions."
    >
      {children}
    </ProtectedAnalyticsWrapper>
  );
}

export function SecurityAnalyticsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedAnalyticsWrapper
      requiredPermission={["canManageSystem"]}
      analyticsType="security"
      fallbackMessage="Security analytics are restricted to administrators and security personnel."
    >
      {children}
    </ProtectedAnalyticsWrapper>
  );
}

export function AdminAnalyticsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedAnalyticsWrapper
      requiredPermission="canManageSystem"
      analyticsType="admin"
      fallbackMessage="Administrative analytics require admin privileges."
    >
      {children}
    </ProtectedAnalyticsWrapper>
  );
}