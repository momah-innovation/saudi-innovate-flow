import React, { useState, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, Target, BarChart3, Users, Lightbulb, Settings, 
  HelpCircle, Brain, Star, Building, Award, Calendar,
  Search, MessageSquare, FileText, Database, Shield,
  Briefcase, Edit, Network, Zap, Archive, Upload,
  User, GraduationCap, Handshake, ChevronRight
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// Optimized menu items - static definition to prevent recreation
const MENU_ITEMS = [
  // Main
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    arabicLabel: 'لوحة التحكم',
    icon: Home, 
    path: '/dashboard',
    group: 'main' 
  },
  
  // Discover
  { 
    id: 'challenges', 
    label: 'Challenges', 
    arabicLabel: 'التحديات',
    icon: Target, 
    path: '/challenges',
    group: 'discover' 
  },
  { 
    id: 'opportunities', 
    label: 'Opportunities', 
    arabicLabel: 'الفرص',
    icon: Star, 
    path: '/opportunities',
    group: 'discover' 
  },
  { 
    id: 'campaigns', 
    label: 'Campaigns', 
    arabicLabel: 'الحملات',
    icon: Target, 
    path: '/campaigns',
    group: 'discover' 
  },
  
  // Personal
  { 
    id: 'ideas', 
    label: 'My Ideas', 
    arabicLabel: 'أفكاري',
    icon: Lightbulb, 
    path: '/ideas',
    group: 'personal' 
  },
  { 
    id: 'bookmarks', 
    label: 'Bookmarks', 
    arabicLabel: 'المرجعيات',
    icon: Star, 
    path: '/bookmarks',
    group: 'personal' 
  },
  { 
    id: 'profile', 
    label: 'Profile', 
    arabicLabel: 'الملف الشخصي',
    icon: User, 
    path: '/profile',
    group: 'personal' 
  },
  
  // Workspace
  { 
    id: 'teams', 
    label: 'Teams', 
    arabicLabel: 'الفرق',
    icon: Users, 
    path: '/teams',
    group: 'workspace' 
  },
  { 
    id: 'projects', 
    label: 'Projects', 
    arabicLabel: 'المشاريع',
    icon: Briefcase, 
    path: '/projects',
    group: 'workspace' 
  },
  
  // Analytics (Admin only)
  { 
    id: 'analytics', 
    label: 'Analytics', 
    arabicLabel: 'التحليلات',
    icon: BarChart3, 
    path: '/analytics',
    group: 'analytics',
    adminOnly: true 
  },
  { 
    id: 'admin', 
    label: 'Admin Dashboard', 
    arabicLabel: 'لوحة الإدارة',
    icon: Shield, 
    path: '/admin',
    group: 'admin',
    adminOnly: true 
  },
  
  // Settings
  { 
    id: 'settings', 
    label: 'Settings', 
    arabicLabel: 'الإعدادات',
    icon: Settings, 
    path: '/settings',
    group: 'settings' 
  },
  { 
    id: 'help', 
    label: 'Help', 
    arabicLabel: 'المساعدة',
    icon: HelpCircle, 
    path: '/help',
    group: 'settings' 
  }
];

const GROUP_LABELS = {
  main: { en: 'Dashboard', ar: 'لوحة التحكم' },
  discover: { en: 'Discover', ar: 'استكشاف' },
  personal: { en: 'Personal', ar: 'شخصي' },
  workspace: { en: 'Workspace', ar: 'مساحة العمل' },
  analytics: { en: 'Analytics', ar: 'التحليلات' },
  admin: { en: 'Administration', ar: 'الإدارة' },
  settings: { en: 'Settings', ar: 'الإعدادات' }
};

interface OptimizedSidebarProps {
  className?: string;
}

export function OptimizedSidebar({ className }: OptimizedSidebarProps) {
  const location = useLocation();
  const { isRTL, language } = useUnifiedTranslation();
  const { open, setOpen } = useSidebar();
  
  // Simple check for admin - this would normally come from auth context
  const isAdmin = true; // Simplified for now
  
  // Memoized filtered items to prevent recalculation
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter(item => !item.adminOnly || isAdmin);
  }, [isAdmin]);
  
  // Group items efficiently
  const groupedItems = useMemo(() => {
    const groups: Record<string, typeof MENU_ITEMS> = {};
    filteredItems.forEach(item => {
      if (!groups[item.group]) {
        groups[item.group] = [];
      }
      groups[item.group].push(item);
    });
    return groups;
  }, [filteredItems]);
  
  // Check if path is active
  const isActive = (path: string) => location.pathname === path;
  
  // Get nav class names
  const getNavClassName = (active: boolean) => cn(
    "flex items-center gap-2 w-full transition-colors duration-150",
    active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50"
  );

  return (
    <Sidebar className={cn("transition-all duration-200 ease-in-out", className)}>
      <SidebarContent className="gap-0">
        {/* Render each group */}
        {Object.entries(groupedItems).map(([groupKey, items]) => (
          <SidebarGroup key={groupKey} className="px-0">
            <SidebarGroupLabel className="px-4 py-2 text-xs font-medium">
              {GROUP_LABELS[groupKey as keyof typeof GROUP_LABELS]?.[language as 'en' | 'ar'] || groupKey}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton asChild isActive={active} className="h-9">
                        <NavLink
                          to={item.path}
                          className={getNavClassName(active)}
                          onClick={() => {
                            // Close sidebar on mobile after navigation
                            if (window.innerWidth < 768) {
                              setOpen(false);
                            }
                          }}
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">
                            {isRTL ? item.arabicLabel : item.label}
                          </span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

export default OptimizedSidebar;