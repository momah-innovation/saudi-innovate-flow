import React, { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useDirection } from '@/components/ui/direction-provider';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Settings, 
  Users, 
  Calendar,
  FileText,
  BarChart3,
  Building2,
  Target,
  Award,
  UserCheck
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  badge?: string | number;
  children?: SidebarItem[];
}

interface DirectionalSidebarProps {
  items?: SidebarItem[];
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
  width?: string;
  collapsedWidth?: string;
  children?: ReactNode;
}

const defaultAdminItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/' },
  { id: 'events', label: 'Events', icon: Calendar, href: '/admin/events' },
  { id: 'campaigns', label: 'Campaigns', icon: Target, href: '/admin/campaigns' },
  { id: 'evaluations', label: 'Evaluations', icon: Award, href: '/admin/evaluations' },
  { id: 'stakeholders', label: 'Stakeholders', icon: Users, href: '/admin/stakeholders' },
  { id: 'partners', label: 'Partners', icon: Building2, href: '/admin/partners' },
  { id: 'experts', label: 'Expert Assignment', icon: UserCheck, href: '/admin/expert-assignment' },
  { id: 'focus-questions', label: 'Focus Questions', icon: FileText, href: '/admin/focus-questions' },
  { id: 'sectors', label: 'Sectors', icon: BarChart3, href: '/admin/sectors' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
];

export function DirectionalSidebar({
  items = defaultAdminItems,
  collapsed = false,
  onToggleCollapse,
  className,
  width = '256px',
  collapsedWidth = '64px',
  children,
}: DirectionalSidebarProps) {
  const { isRTL } = useDirection();
  const location = useLocation();

  const sidebarWidth = collapsed ? collapsedWidth : width;
  const ChevronIcon = isRTL ? 
    (collapsed ? ChevronLeft : ChevronRight) :
    (collapsed ? ChevronRight : ChevronLeft);

  return (
    <aside
      className={cn(
        'relative flex flex-col bg-card border-border transition-all duration-300',
        isRTL ? 'border-l' : 'border-r',
        className
      )}
      style={{ width: sidebarWidth }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Collapse Toggle */}
      {onToggleCollapse && (
        <div className={cn(
          'flex justify-end p-2',
          isRTL && 'justify-start'
        )}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-8 w-8 p-0"
          >
            <ChevronIcon className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-1 py-2">
          {items.map((item) => (
            <SidebarNavItem
              key={item.id}
              item={item}
              collapsed={collapsed}
              isActive={location.pathname === item.href}
            />
          ))}
        </nav>
        
        <Separator className="my-4" />
        
        {children}
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <div className={cn(
            'text-xs text-muted-foreground text-center',
            isRTL && 'text-right'
          )}>
            Innovation Management System
          </div>
        </div>
      )}
    </aside>
  );
}

function SidebarNavItem({
  item,
  collapsed,
  isActive
}: {
  item: SidebarItem;
  collapsed: boolean;
  isActive: boolean;
}) {
  const { isRTL } = useDirection();

  return (
    <NavLink
      to={item.href}
      className={({ isActive: navIsActive }) =>
        cn(
          'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
          'hover:bg-accent hover:text-accent-foreground',
          (navIsActive || isActive) && 'bg-accent text-accent-foreground',
          collapsed && 'justify-center px-2',
          isRTL && 'flex-row-reverse'
        )
      }
      title={collapsed ? item.label : undefined}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      
      {!collapsed && (
        <>
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <Badge variant="secondary" className="text-xs">
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </NavLink>
  );
}

// Layout component that combines sidebar and main content
export function DirectionalLayout({
  sidebar,
  children,
  className,
}: {
  sidebar: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const { isRTL } = useDirection();

  return (
    <div className={cn('flex min-h-screen', isRTL && 'flex-row-reverse', className)}>
      {sidebar}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}