import { ReactNode } from 'react';
import { AppShell } from '@/components/layout/AppShell';

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
  return (
    <AppShell>
      {/* Hero Component */}
      {hero}
      
      {/* Main Layout: 3/4 content + 1/4 sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 md:px-6 lg:px-8 py-6">
        {/* Main Content Area (3/4 width) */}
        <div className="lg:col-span-3">
          {mainContent}
        </div>
        
        {/* Recommendations Sidebar (1/4 width) */}
        <div className="lg:col-span-1">
          {sidebar}
        </div>
      </div>
      
      {/* Specialized Dialogs */}
      {dialogs}
    </AppShell>
  );
}