import { ReactNode } from 'react';
import { Header } from '@/components/ui/header';
import { NavigationSidebar } from './NavigationSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

/**
 * AdminLayout - Main layout for admin pages with unified NavigationSidebar
 * Provides consistent structure with header, sidebar, and content area
 */
export function AdminLayout({ children, title, breadcrumbs }: AdminLayoutProps) {
  const { isRTL } = useDirection();

  return (
    <SidebarProvider>
      <div className={cn("min-h-screen flex w-full", isRTL && "flex-row-reverse")}>
        {/* Unified NavigationSidebar */}
        <NavigationSidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Global Header */}
          <header className="h-14 flex items-center border-b bg-background">
            <div className="flex-1 min-w-0 px-4">
              <Header />
            </div>
          </header>
          
          {/* Breadcrumb Navigation */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className={cn("h-12 border-b bg-muted/20 px-6 flex items-center gap-3", isRTL && "text-right flex-row-reverse")}>
              <SidebarTrigger className="shrink-0" />
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
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}