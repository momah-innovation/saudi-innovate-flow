import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requireProfile?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  requireProfile = false 
}) => {
  const { user, loading, hasRole, userProfile } = useAuth();

  // Show loading spinner while checking auth state OR while profile is loading
  if (loading || (user && requireProfile && userProfile === null)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if profile is required but not found (only after userProfile has been attempted to load)
  if (requireProfile && userProfile !== null && !userProfile.id) {
    return <Navigate to="/profile/setup" replace />;
  }

  // Check role requirements - redirect to dashboard instead of showing access denied
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};