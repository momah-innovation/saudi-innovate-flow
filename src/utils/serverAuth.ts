// Server Authentication Utilities
// Provides server-side validation for authentication and role checks

import { supabase } from "@/integrations/supabase/client";
import { debugLog } from "@/utils/debugLogger";

export async function validateServerAuth(token: string) {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      debugLog.error('Server auth validation failed', { 
        component: 'serverAuth',
        action: 'validateServerAuth',
        error: error?.message || 'No user found'
      });
      throw new Error("Unauthorized");
    }
    
    return user;
  } catch (error) {
    debugLog.error('Server auth validation error', {
      component: 'serverAuth',
      action: 'validateServerAuth'
    }, error);
    throw error;
  }
}

export async function validateRole(
  userId: string,
  requiredRole: string | string[]
) {
  try {
    const { data: roles, error } = await supabase
      .from("user_roles")
      .select("role, is_active, expires_at")
      .eq("user_id", userId)
      .eq("is_active", true);

    if (error) {
      debugLog.error('Role validation query failed', {
        component: 'serverAuth',
        action: 'validateRole',
        userId,
        requiredRole
      }, error);
      throw error;
    }

    // Filter out expired roles
    const activeRoles = roles?.filter(r => 
      !r.expires_at || new Date(r.expires_at) > new Date()
    ) || [];

    const userRoles = activeRoles.map((r) => r.role as string);
    const requiredRoles = Array.isArray(requiredRole)
      ? requiredRole
      : [requiredRole];

    const hasAccess = requiredRoles.some((role) => userRoles.includes(role));

    debugLog.debug('Role validation result', {
      component: 'serverAuth',
      action: 'validateRole',
      userId,
      requiredRole,
      userRoles,
      hasAccess
    });

    return hasAccess;
  } catch (error) {
    debugLog.error('Role validation error', {
      component: 'serverAuth',
      action: 'validateRole',
      userId,
      requiredRole
    }, error);
    throw error;
  }
}

export async function validateSubscription(userId: string): Promise<boolean> {
  // Placeholder for Phase 4 - subscription validation
  // Return true for now to not block access
  debugLog.debug('Subscription validation - Phase 4 placeholder', {
    component: 'serverAuth',
    action: 'validateSubscription',
    userId
  });
  return true;
}