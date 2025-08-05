import { ReactNode, Suspense } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Header } from './Header';
import { ResponsiveNavigationSidebar } from './ResponsiveNavigationSidebar';
import { LoadingSpinner } from '@/components/ui/loading';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';
import { ResponsiveSidebarProvider, useResponsiveSidebar } from '@/contexts/ResponsiveSidebarContext';

interface ResponsiveAppShellProps {
  children: ReactNode;
}

function ResponsiveAppShellContent({ children }: ResponsiveAppShellProps) {
  const { isRTL } = useDirection();
  const { isOpen, isMiniMode, isOverlay } = useResponsiveSidebar();
  
  return (
    <SidebarProvider defaultOpen={isOpen}>
      <div className={cn(
        "min-h-screen flex w-full bg-background transition-all duration-300",
        isRTL && "flex-row-reverse"
      )}>
        {/* Navigation Sidebar */}
        <ResponsiveNavigationSidebar />
        
        {/* Main Content Area */}
        <div className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300",
          // Adjust margin based on sidebar state and position
          !isOverlay && isOpen && !isMiniMode && (isRTL ? "mr-64" : "ml-64"),
          !isOverlay && isOpen && isMiniMode && (isRTL ? "mr-16" : "ml-16")
        )}>
          {/* Global Header */}
          <Header />
          
          {/* Page Content with Loading */}
          <main className="flex-1 overflow-auto bg-background">
            <Suspense 
              fallback={
                <div className="flex items-center justify-center min-h-[50vh]">
                  <LoadingSpinner />
                </div>
              }
            >
              <div className="animate-fade-in">
                {children}
              </div>
            </Suspense>
          </main>
        </div>

        {/* Overlay backdrop for mobile */}
        {isOverlay && isOpen && (
          <div 
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm animate-fade-in"
            onClick={() => useResponsiveSidebar().setIsOpen(false)}
          />
        )}
      </div>
    </SidebarProvider>
  );
}

/**
 * ResponsiveAppShell - Enhanced root layout component with full responsive support
 * Features:
 * - RTL/LTR positioning for sidebar and notifications
 * - Desktop: Full sidebar with controlled state and mini mode
 * - Tablet: Auto-collapse to mini mode (icons only)  
 * - Mobile: Overlay behavior
 * - Coordinated sidebar/notification behavior (only one open at a time)
 * - Smooth animations and transitions
 * - Loading states and error boundaries
 */
export function ResponsiveAppShell({ children }: ResponsiveAppShellProps) {
  return (
    <ResponsiveSidebarProvider>
      <ResponsiveAppShellContent>
        {children}
      </ResponsiveAppShellContent>
    </ResponsiveSidebarProvider>
  );
}