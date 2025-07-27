import { ReactNode, Suspense } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SystemHeader } from './SystemHeader';
import { NavigationSidebar } from './NavigationSidebar';
import { LoadingSpinner } from '@/components/ui/loading';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: ReactNode;
}

/**
 * AppShell - Root layout component providing the main application structure
 * Features:
 * - Responsive sidebar navigation
 * - Global header with search and user controls
 * - RTL support
 * - Loading states
 * - Optimized performance
 */
export function AppShell({ children }: AppShellProps) {
  const { isRTL } = useDirection();
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className={cn(
        "min-h-screen flex w-full bg-background",
        isRTL && "flex-row-reverse"
      )}>
        {/* Navigation Sidebar */}
        <NavigationSidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Global Header */}
          <SystemHeader />
          
          {/* Page Content with Loading */}
          <main className="flex-1 overflow-auto">
            <Suspense fallback={<LoadingSpinner />}>
              {children}
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}