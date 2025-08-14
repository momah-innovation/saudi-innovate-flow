import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { debugLog } from "@/utils/debugLogger";

interface NavigationOptions {
  requireAuth?: boolean;
  requireProfile?: boolean;
  requiredRole?: string | string[];
  minProfileCompletion?: number;
}

export function useNavigationGuard() {
  const navigate = useNavigate();
  const { user, userProfile, hasRole } = useAuth();
  const { toast } = useToast();

  const guardedNavigate = (
    path: string,
    options: NavigationOptions = {}
  ) => {
    const {
      requireAuth = false,
      requireProfile = false,
      requiredRole,
      minProfileCompletion = 80
    } = options;

    // Authentication check
    if (requireAuth && !user) {
      debugLog.warn('Navigation blocked: authentication required', {
        component: 'useNavigationGuard',
        action: 'guardedNavigate',
        path,
        reason: 'no_auth'
      });

      toast({
        title: "Authentication Required",
        description: "Please login to access this page",
        variant: "destructive",
      });
      navigate("/auth", { state: { from: path } });
      return;
    }

    // Profile completion check
    if (
      requireProfile &&
      userProfile &&
      userProfile.profile_completion_percentage < minProfileCompletion
    ) {
      debugLog.warn('Navigation blocked: profile completion required', {
        component: 'useNavigationGuard',
        action: 'guardedNavigate',
        path,
        reason: 'profile_incomplete',
        currentCompletion: userProfile.profile_completion_percentage,
        requiredCompletion: minProfileCompletion
      });

      toast({
        title: "Complete Your Profile",
        description: `Please complete your profile (${userProfile.profile_completion_percentage}% done) to access this feature`,
      });
      navigate("/profile/setup");
      return;
    }

    // Role-based access check
    if (requiredRole) {
      const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      const hasRequiredRole = requiredRoles.some(role => hasRole(role));

      if (!hasRequiredRole) {
        debugLog.warn('Navigation blocked: insufficient role permissions', {
          component: 'useNavigationGuard',
          action: 'guardedNavigate',
          path,
          reason: 'insufficient_role',
          requiredRoles,
          userRoles: userProfile?.user_roles?.map(r => r.role) || []
        });

        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }
    }

    // All checks passed - proceed with navigation
    debugLog.debug('Navigation allowed', {
      component: 'useNavigationGuard',
      action: 'guardedNavigate',
      path,
      user: user?.id,
      profile: userProfile?.id
    });

    navigate(path);
  };

  const checkAccess = (options: NavigationOptions = {}): boolean => {
    const {
      requireAuth = false,
      requireProfile = false,
      requiredRole,
      minProfileCompletion = 80
    } = options;

    if (requireAuth && !user) return false;
    
    if (
      requireProfile &&
      userProfile &&
      userProfile.profile_completion_percentage < minProfileCompletion
    ) return false;

    if (requiredRole) {
      const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      const hasRequiredRole = requiredRoles.some(role => hasRole(role));
      if (!hasRequiredRole) return false;
    }

    return true;
  };

  return { guardedNavigate, checkAccess };
}