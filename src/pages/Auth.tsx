import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Auth } from '@/components/auth/Auth';
import { Loader2 } from 'lucide-react';

const AuthPage = () => {
  const { user, loading, userProfile } = useAuth();

  console.log('AuthPage Debug:', {
    hasUser: !!user,
    loading,
    userProfile: userProfile?.id ? 'loaded' : 'null',
    profileCompletion: userProfile?.profile_completion_percentage
  });

  // Redirect if already authenticated
  if (user && !loading) {
    // If user has profile, go to dashboard, otherwise go to profile setup
    const redirectPath = userProfile?.profile_completion_percentage >= 80 ? "/dashboard" : "/profile/setup";
    console.log('AuthPage: Redirecting authenticated user to:', redirectPath);
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