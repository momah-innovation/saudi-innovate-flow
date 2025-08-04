import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGlobalRoleTheme } from '@/hooks/useGlobalRoleTheme';

interface GlobalRoleThemeProviderProps {
  children: React.ReactNode;
}

export const GlobalRoleThemeProvider: React.FC<GlobalRoleThemeProviderProps> = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Only apply role theme for authenticated users after loading is complete
  if (!loading && user) {
    useGlobalRoleTheme();
  }

  return <>{children}</>;
};