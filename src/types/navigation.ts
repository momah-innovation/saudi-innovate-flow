/**
 * Navigation Types - Type definitions for navigation and layout components
 */

import { LucideIcon } from 'lucide-react';

// Menu item interface
export interface MenuItem {
  id: string;
  label: string;
  arabicLabel: string;
  icon: LucideIcon;
  path: string;
  badge?: number;
  group: MenuGroup;
  roles: Role[];
}

// Menu groups - flexible to allow any string
export type MenuGroup = string;

// User roles - flexible to allow any string
export type Role = string;

// User profile with roles
export interface UserProfile {
  id: string;
  name: string;
  name_ar?: string;
  profile_image_url?: string;
  user_roles?: UserRole[];
}

export interface UserRole {
  role: Role;
  assigned_at: string;
  is_active: boolean;
}

// Group labels for navigation
export interface GroupLabels {
  [key: string]: {
    en: string;
    ar: string;
  };
}

// Grouped menu items
export interface GroupedMenuItems {
  [group: string]: MenuItem[];
}

// Navigation sidebar props
export interface NavigationSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Sidebar state management
export interface SidebarState {
  isCollapsed: boolean;
  openGroups: string[];
  pinnedItems: string[];
}

// Settings for navigation
export interface NavigationSettings {
  navigation_group_order: string[];
  show_badges: boolean;
  auto_collapse: boolean;
  remember_state: boolean;
}

// Navigation context
export interface NavigationContextValue {
  sidebarState: SidebarState;
  setSidebarState: (state: Partial<SidebarState>) => void;
  toggleGroup: (groupId: string) => void;
  togglePinItem: (itemId: string) => void;
  canAccessItem: (item: MenuItem) => boolean;
}

// Breadcrumb types
export interface BreadcrumbItem {
  label: string;
  arabicLabel?: string;
  path?: string;
  icon?: LucideIcon;
}

export interface Breadcrumbs {
  items: BreadcrumbItem[];
  current: BreadcrumbItem;
}

// Layout types
export interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

export interface AppShellProps extends LayoutProps {
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

// Header types
export interface HeaderProps {
  onSidebarToggle: () => void;
  showSidebarToggle?: boolean;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

// Footer types
export interface FooterProps {
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
}