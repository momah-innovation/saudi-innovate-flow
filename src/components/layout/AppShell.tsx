import { ReactNode, Suspense, useState } from 'react';
import { SystemHeader } from './UnifiedHeader';
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
 * - Overlay navigation sidebar
 * - Global header with search and user controls
 * - RTL support
 * - Loading states
 * - Optimized performance
 */
export function AppShell({ children }: AppShellProps) {
  const { isRTL } = useDirection();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className={cn(
      "min-h-screen flex w-full bg-background",
      isRTL && "flex-row-reverse"
    )}>
      {/* Navigation Sidebar Overlay */}
      <NavigationSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Global Header */}
        <SystemHeader onSidebarToggle={() => setSidebarOpen(true)} />
        
        {/* Page Content with Loading */}
        <main className="flex-1 overflow-auto">
          <Suspense fallback={<LoadingSpinner />}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}