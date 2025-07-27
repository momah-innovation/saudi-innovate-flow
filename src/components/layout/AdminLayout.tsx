import { ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { AppSidebar } from './Sidebar';
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
 * AdminLayout - Main layout for admin pages with collapsible sidebar
 * Provides consistent structure with header, sidebar, and content area
 */
export function AdminLayout({ children, title, breadcrumbs }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isRTL } = useDirection();

  // Update active tab based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setActiveTab('dashboard');
    } else if (path.includes('/admin/campaigns')) {
      setActiveTab('campaigns');
    } else if (path.includes('/admin/events')) {
      setActiveTab('events');
    } else if (path.includes('/admin/stakeholders')) {
      setActiveTab('stakeholders');
    } else if (path.includes('/admin/evaluations')) {
      setActiveTab('evaluations');
    } else if (path.includes('/admin/users')) {
      setActiveTab('user-management');
    } else if (path.includes('/admin/focus-questions')) {
      setActiveTab('focus-questions');
    } else if (path.includes('/admin/partners')) {
      setActiveTab('partners');
    } else if (path.includes('/admin/sectors')) {
      setActiveTab('sectors');
    } else if (path.includes('/admin/organizational-structure')) {
      setActiveTab('organizational-structure');
    } else if (path.includes('/admin/expert-assignments')) {
      setActiveTab('expert-assignments');
    } else if (path.includes('/admin/system-settings')) {
      setActiveTab('system-settings');
    } else if (path.includes('/admin/system-documentation')) {
      setActiveTab('system-documentation');
    } else if (path.includes('/settings')) {
      setActiveTab('settings');
    }
  }, [location.pathname]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Navigate to appropriate route
    if (tab === 'dashboard') {
      navigate('/');
    } else if (tab === 'campaigns') {
      navigate('/admin/campaigns');
    } else if (tab === 'events') {
      navigate('/admin/events');
    } else if (tab === 'stakeholders') {
      navigate('/admin/stakeholders');
    } else if (tab === 'evaluations') {
      navigate('/admin/evaluations');
    } else if (tab === 'user-management') {
      navigate('/admin/users');
    } else if (tab === 'focus-questions') {
      navigate('/admin/focus-questions');
    } else if (tab === 'partners') {
      navigate('/admin/partners');
    } else if (tab === 'sectors') {
      navigate('/admin/sectors');
    } else if (tab === 'organizational-structure') {
      navigate('/admin/organizational-structure');
    } else if (tab === 'expert-assignments') {
      navigate('/admin/expert-assignments');
    } else if (tab === 'system-settings') {
      navigate('/admin/system-settings');
    } else if (tab === 'system-documentation') {
      navigate('/admin/system-documentation');
    } else if (tab === 'settings') {
      navigate('/settings');
    }
  };

  return (
    <SidebarProvider>
      <div className={cn("min-h-screen flex w-full", isRTL && "flex-row-reverse")}>
        {/* Collapsible Sidebar */}
        <AppSidebar activeTab={activeTab} onTabChange={handleTabChange} />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Global Header */}
          <header className="h-14 flex items-center border-b bg-background">
            <div className="flex-1 min-w-0 px-4">
              <Header />
            </div>
          </header>
          
          {/* Breadcrumb Navigation */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className={cn("border-b bg-muted/20 px-6 py-3 flex items-center gap-3", isRTL && "text-right flex-row-reverse")}>
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