import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Auth } from '@/components/auth/Auth';
import { Loader2 } from 'lucide-react';

const AuthPage = () => {
  const { user, loading, userProfile } = useAuth();

  // Redirect if already authenticated
  if (user && !loading) {
    // If user has profile, go to dashboard, otherwise go to profile setup
    const redirectPath = userProfile ? "/dashboard" : "/profile/setup";
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