import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Auth } from '@/components/auth/Auth';
import { Loader2 } from 'lucide-react';
import { logger } from '@/utils/logger';

const AuthPage = () => {
  console.log('📝 AuthPage component rendered');
  const { user, loading, userProfile } = useAuth();

  logger.debug('AuthPage Debug', {
    component: 'AuthPage',
    action: 'render',
    data: {
      hasUser: !!user,
      loading,
      userProfile: userProfile?.id ? 'loaded' : 'null',
      profileCompletion: userProfile?.profile_completion_percentage
    }
  });

  // Redirect if already authenticated
  if (user && !loading) {
    // Check if user has profile, if not, default redirect behavior
    const redirectPath = userProfile?.profile_completion_percentage >= 80 ? "/dashboard" : "/profile/setup";
    logger.info('AuthPage: Redirecting authenticated user', {
      component: 'AuthPage',
      action: 'redirect',
      data: {
        redirectPath,
        profileCompletion: userProfile?.profile_completion_percentage || 0,
        roles: userProfile?.user_roles?.map(r => r.role) || []
      }
    });
    return <Navigate to={redirectPath} replace />;
  }

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <Auth />;
};

export default AuthPage;