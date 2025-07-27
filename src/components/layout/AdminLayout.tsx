import { ReactNode } from 'react';
import { Header } from './Header';
import { PageContainer } from './PageContainer';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

/**
 * AdminLayout - Main layout for admin pages
 * Provides consistent structure with header and content area
 */
export function AdminLayout({ children, title, breadcrumbs }: AdminLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      {/* Global Header */}
      <Header />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        {/* Breadcrumb Navigation */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="border-b bg-muted/20 px-6 py-3">
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
        <PageContainer>
          {children}
        </PageContainer>
      </main>
    </div>
  );
}