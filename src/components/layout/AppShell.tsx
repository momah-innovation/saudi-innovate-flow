import { ReactNode, Suspense } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Header } from './Header';
import { NavigationSidebar } from './NavigationSidebar';
import { LoadingSpinner } from '@/components/ui/loading';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';
import { useSidebarPersistence } from '@/contexts/SidebarContext';
import { ResponsiveSidebarProvider } from '@/contexts/ResponsiveSidebarContext';


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
  const { isOpen } = useSidebarPersistence();
  
  return (
    <ResponsiveSidebarProvider>
      <SidebarProvider defaultOpen={isOpen}>
          <div className={cn(
            "min-h-screen flex w-full bg-background",
            isRTL && "flex-row-reverse"
          )}>
            {/* Navigation Sidebar */}
            <NavigationSidebar />
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Global Header */}
              <Header />
              
              {/* Page Content with Loading */}
              <main className="flex-1 overflow-auto">
                <Suspense fallback={<LoadingSpinner />}>
                  {children}
                </Suspense>
              </main>
            </div>
          </div>
        </SidebarProvider>
    </ResponsiveSidebarProvider>
  );
}