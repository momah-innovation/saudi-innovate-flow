import { ReactNode } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

interface StandardBrowseLayoutProps {
  hero: ReactNode;
  mainContent: ReactNode;
  sidebar: ReactNode;
  dialogs?: ReactNode;
}

/**
 * StandardBrowseLayout - Unified layout for browse pages
 * Features:
 * - Hero section at top
 * - 3/4 main content area with complex filtering and cards
 * - 1/4 sidebar with widgets and recommendations  
 * - Dialog support for creation, templates, analytics, collaboration
 */
export function StandardBrowseLayout({ 
  hero, 
  mainContent, 
  sidebar, 
  dialogs 
}: StandardBrowseLayoutProps) {
  const { isRTL } = useDirection();

  return (
    <AppShell>
      {/* Hero Component */}
      {hero}
      
      {/* Main Layout: 3/4 content + 1/4 sidebar */}
      <div className={cn(
        "grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-6",
        isRTL && "lg:grid-flow-col-dense"
      )}>
        {/* Main Content Area (3/4 width) */}
        <div className={cn(
          "lg:col-span-3",
          isRTL && "lg:col-start-1"
        )}>
          {mainContent}
        </div>
        
        {/* Recommendations Sidebar (1/4 width) */}
        <div className={cn(
          "lg:col-span-1 order-first lg:order-last",
          isRTL && "lg:col-start-4 lg:order-first"
        )}>
          {sidebar}
        </div>
      </div>
      
      {/* Specialized Dialogs */}
      {dialogs}
    </AppShell>
  );
}