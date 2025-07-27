import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminLayout } from './AdminLayout';
import { Header } from './Header';
import { PageContainer } from './PageContainer';

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

/**
 * AppLayout - Root layout component that decides which layout to use
 * Switches between admin layout and public layout based on user state
 */
export function AppLayout({ children, breadcrumbs }: AppLayoutProps) {
  const { user, userProfile } = useAuth();
  
  // If user is authenticated and has admin access, use admin layout
  if (user && userProfile) {
    return (
      <AdminLayout breadcrumbs={breadcrumbs}>
        {children}
      </AdminLayout>
    );
  }
  
  // Public layout for non-authenticated users
  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <Header />
      <main className="flex-1">
        <PageContainer>
          {children}
        </PageContainer>
      </main>
    </div>
  );
}