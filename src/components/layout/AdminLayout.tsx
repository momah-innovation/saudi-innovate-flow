import { ReactNode, useState } from 'react';
// Removed UnifiedHeader import - AppShell provides unified header
import { NavigationSidebar } from './NavigationSidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

/**
 * AdminLayout - Main layout for admin pages with overlay NavigationSidebar
 * Provides consistent structure with header, sidebar, and content area
 */
export function AdminLayout({ children, title, breadcrumbs }: AdminLayoutProps) {
  const { isRTL } = useDirection();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={cn("min-h-screen flex w-full overflow-hidden", isRTL && "flex-row-reverse")}>
      {/* Overlay NavigationSidebar */}
      <NavigationSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header removed - AppShell provides unified header */}
        
        {/* Breadcrumb Navigation */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className={cn(
            "h-12 border-b bg-muted/20 px-3 sm:px-6 flex items-center gap-2 sm:gap-3 overflow-x-auto", 
            isRTL && "text-right flex-row-reverse"
          )}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="shrink-0 h-8 w-8 p-0 lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((item, index) => (
                  <BreadcrumbItem key={index}>
                    {index < breadcrumbs.length - 1 ? (
                      <>
                        {item.href ? (
                          <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                        ) : (
                          <span>{item.label}</span>
                        )}
                        <BreadcrumbSeparator />
                      </>
                    ) : (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto overscroll-behavior-contain">
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}