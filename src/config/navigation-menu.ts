/**
 * Navigation Menu Configuration
 * Defines all menu items with roles, groups, and translations
 */

import {
  Home, Calendar, Users, Lightbulb, Briefcase, Target,
  Settings, Shield, BarChart3, FileText, HelpCircle,
  Database, Zap, Trophy, MessageSquare, Search,
  Bell, Clock, Archive, Star, Bookmark
} from 'lucide-react';
import { MenuItem, GroupLabels } from '@/types/navigation';

// Menu groups definition
export const MENU_GROUPS = {
  MAIN: 'main',
  INNOVATION: 'innovation', 
  ADMIN: 'admin',
  SYSTEM: 'system',
  HELP: 'help'
} as const;

// Group labels for translation
export const GROUP_LABELS: GroupLabels = {
  [MENU_GROUPS.MAIN]: {
    en: 'Main Navigation',
    ar: 'التنقل الرئيسي'
  },
  [MENU_GROUPS.INNOVATION]: {
    en: 'Innovation Hub',
    ar: 'مركز الابتكار'
  },
  [MENU_GROUPS.ADMIN]: {
    en: 'Administration',
    ar: 'الإدارة'
  },
  [MENU_GROUPS.SYSTEM]: {
    en: 'System',
    ar: 'النظام'
  },
  [MENU_GROUPS.HELP]: {
    en: 'Help & Support',
    ar: 'المساعدة والدعم'
  }
};

// Main navigation menu items
export const NAVIGATION_ITEMS: MenuItem[] = [
  // Main Navigation
  {
    id: 'dashboard',
    label: 'nav.dashboard',
    arabicLabel: 'لوحة التحكم',
    icon: Home,
    path: '/dashboard',
    group: MENU_GROUPS.MAIN,
    roles: ['user', 'admin', 'super_admin', 'innovator', 'evaluator', 'mentor', 'team_member', 'expert', 'partner', 'stakeholder', 'department_head', 'sector_lead', 'domain_expert', 'viewer', 'user_manager', 'role_manager', 'challenge_manager', 'expert_coordinator', 'content_manager', 'system_auditor', 'data_analyst', 'campaign_manager', 'event_manager', 'stakeholder_manager', 'partnership_manager', 'team_lead', 'project_manager', 'research_lead', 'innovation_manager', 'external_expert', 'judge', 'facilitator', 'organization_admin', 'entity_manager', 'deputy_manager', 'domain_manager', 'sub_domain_manager', 'service_manager']
  },
  {
    id: 'challenges',
    label: 'nav.challenges',
    arabicLabel: 'التحديات',
    icon: Target,
    path: '/challenges',
    group: MENU_GROUPS.MAIN,
    roles: ['user', 'admin', 'super_admin', 'innovator', 'evaluator', 'mentor', 'team_member', 'expert', 'partner', 'stakeholder', 'department_head', 'sector_lead', 'domain_expert', 'viewer', 'user_manager', 'role_manager', 'challenge_manager', 'expert_coordinator', 'content_manager', 'system_auditor', 'data_analyst', 'campaign_manager', 'event_manager', 'stakeholder_manager', 'partnership_manager', 'team_lead', 'project_manager', 'research_lead', 'innovation_manager', 'external_expert', 'judge', 'facilitator', 'organization_admin', 'entity_manager', 'deputy_manager', 'domain_manager', 'sub_domain_manager', 'service_manager']
  },
  {
    id: 'events',
    label: 'nav.events',
    arabicLabel: 'الفعاليات',
    icon: Calendar,
    path: '/events',
    group: MENU_GROUPS.MAIN,
    roles: ['user', 'admin', 'super_admin', 'innovator', 'evaluator', 'mentor', 'team_member', 'expert', 'partner', 'stakeholder', 'department_head', 'sector_lead', 'domain_expert', 'viewer', 'user_manager', 'role_manager', 'challenge_manager', 'expert_coordinator', 'content_manager', 'system_auditor', 'data_analyst', 'campaign_manager', 'event_manager', 'stakeholder_manager', 'partnership_manager', 'team_lead', 'project_manager', 'research_lead', 'innovation_manager', 'external_expert', 'judge', 'facilitator', 'organization_admin', 'entity_manager', 'deputy_manager', 'domain_manager', 'sub_domain_manager', 'service_manager']
  },

  // Innovation Hub
  {
    id: 'ideas',
    label: 'nav.ideas',
    arabicLabel: 'الأفكار',
    icon: Lightbulb,
    path: '/ideas',
    group: MENU_GROUPS.INNOVATION,
    roles: ['user', 'admin', 'super_admin', 'innovator', 'evaluator', 'mentor', 'team_member', 'expert', 'partner', 'stakeholder', 'department_head', 'sector_lead', 'domain_expert', 'viewer', 'user_manager', 'role_manager', 'challenge_manager', 'expert_coordinator', 'content_manager', 'system_auditor', 'data_analyst', 'campaign_manager', 'event_manager', 'stakeholder_manager', 'partnership_manager', 'team_lead', 'project_manager', 'research_lead', 'innovation_manager', 'external_expert', 'judge', 'facilitator', 'organization_admin', 'entity_manager', 'deputy_manager', 'domain_manager', 'sub_domain_manager', 'service_manager']
  },
  {
    id: 'opportunities',
    label: 'nav.opportunities', 
    arabicLabel: 'الفرص',
    icon: Star,
    path: '/opportunities',
    group: MENU_GROUPS.INNOVATION,
    roles: ['user', 'admin', 'super_admin', 'innovator', 'evaluator', 'mentor', 'team_member', 'expert', 'partner', 'stakeholder', 'department_head', 'sector_lead', 'domain_expert', 'viewer', 'user_manager', 'role_manager', 'challenge_manager', 'expert_coordinator', 'content_manager', 'system_auditor', 'data_analyst', 'campaign_manager', 'event_manager', 'stakeholder_manager', 'partnership_manager', 'team_lead', 'project_manager', 'research_lead', 'innovation_manager', 'external_expert', 'judge', 'facilitator', 'organization_admin', 'entity_manager', 'deputy_manager', 'domain_manager', 'sub_domain_manager', 'service_manager']
  },
  {
    id: 'collaboration',
    label: 'nav.collaboration',
    arabicLabel: 'التعاون',
    icon: Users,
    path: '/collaboration',
    group: MENU_GROUPS.INNOVATION,
    roles: ['user', 'admin', 'super_admin', 'innovator', 'evaluator', 'mentor', 'team_member', 'expert', 'partner', 'stakeholder', 'department_head', 'sector_lead', 'domain_expert', 'viewer', 'user_manager', 'role_manager', 'challenge_manager', 'expert_coordinator', 'content_manager', 'system_auditor', 'data_analyst', 'campaign_manager', 'event_manager', 'stakeholder_manager', 'partnership_manager', 'team_lead', 'project_manager', 'research_lead', 'innovation_manager', 'external_expert', 'judge', 'facilitator', 'organization_admin', 'entity_manager', 'deputy_manager', 'domain_manager', 'sub_domain_manager', 'service_manager']
  },
  {
    id: 'workspace',
    label: 'nav.workspace',
    arabicLabel: 'مساحة العمل',
    icon: Briefcase,
    path: '/workspace',
    group: MENU_GROUPS.INNOVATION,
    roles: ['user', 'admin', 'super_admin', 'innovator', 'evaluator', 'mentor', 'team_member', 'expert', 'partner', 'stakeholder', 'department_head', 'sector_lead', 'domain_expert', 'viewer', 'user_manager', 'role_manager', 'challenge_manager', 'expert_coordinator', 'content_manager', 'system_auditor', 'data_analyst', 'campaign_manager', 'event_manager', 'stakeholder_manager', 'partnership_manager', 'team_lead', 'project_manager', 'research_lead', 'innovation_manager', 'external_expert', 'judge', 'facilitator', 'organization_admin', 'entity_manager', 'deputy_manager', 'domain_manager', 'sub_domain_manager', 'service_manager']
  },

  // Administration
  {
    id: 'admin-dashboard',
    label: 'nav.admin_dashboard',
    arabicLabel: 'لوحة الإدارة',
    icon: BarChart3,
    path: '/admin/dashboard',
    group: MENU_GROUPS.ADMIN,
    roles: ['admin', 'super_admin']
  },
  {
    id: 'user-management',
    label: 'nav.user_management',
    arabicLabel: 'إدارة المستخدمين',
    icon: Users,
    path: '/admin/users',
    group: MENU_GROUPS.ADMIN,
    roles: ['admin', 'super_admin']
  },
  {
    id: 'content-management',
    label: 'nav.content_management',
    arabicLabel: 'إدارة المحتوى',
    icon: FileText,
    path: '/admin/content',
    group: MENU_GROUPS.ADMIN,
    roles: ['admin', 'super_admin']
  },
  {
    id: 'analytics',
    label: 'nav.analytics',
    arabicLabel: 'التحليلات',
    icon: BarChart3,
    path: '/admin/analytics',
    group: MENU_GROUPS.ADMIN,
    roles: ['admin', 'super_admin']
  },

  // System
  {
    id: 'settings',
    label: 'nav.settings',
    arabicLabel: 'الإعدادات',
    icon: Settings,
    path: '/settings',
    group: MENU_GROUPS.SYSTEM,
    roles: ['user', 'admin', 'super_admin', 'innovator', 'evaluator', 'mentor', 'team_member', 'expert', 'partner', 'stakeholder', 'department_head', 'sector_lead', 'domain_expert', 'viewer', 'user_manager', 'role_manager', 'challenge_manager', 'expert_coordinator', 'content_manager', 'system_auditor', 'data_analyst', 'campaign_manager', 'event_manager', 'stakeholder_manager', 'partnership_manager', 'team_lead', 'project_manager', 'research_lead', 'innovation_manager', 'external_expert', 'judge', 'facilitator', 'organization_admin', 'entity_manager', 'deputy_manager', 'domain_manager', 'sub_domain_manager', 'service_manager']
  },
  {
    id: 'security',
    label: 'nav.security',
    arabicLabel: 'الأمان',
    icon: Shield,
    path: '/security',
    group: MENU_GROUPS.SYSTEM,
    roles: ['admin', 'super_admin']
  },
  {
    id: 'database',
    label: 'nav.database',
    arabicLabel: 'قاعدة البيانات',
    icon: Database,
    path: '/admin/database',
    group: MENU_GROUPS.SYSTEM,
    roles: ['super_admin']
  },

  // Help & Support
  {
    id: 'help',
    label: 'nav.help',
    arabicLabel: 'المساعدة',
    icon: HelpCircle,
    path: '/help',
    group: MENU_GROUPS.HELP,
    roles: ['user', 'admin', 'super_admin', 'innovator', 'evaluator', 'mentor', 'team_member', 'expert', 'partner', 'stakeholder', 'department_head', 'sector_lead', 'domain_expert', 'viewer', 'user_manager', 'role_manager', 'challenge_manager', 'expert_coordinator', 'content_manager', 'system_auditor', 'data_analyst', 'campaign_manager', 'event_manager', 'stakeholder_manager', 'partnership_manager', 'team_lead', 'project_manager', 'research_lead', 'innovation_manager', 'external_expert', 'judge', 'facilitator', 'organization_admin', 'entity_manager', 'deputy_manager', 'domain_manager', 'sub_domain_manager', 'service_manager']
  },
  {
    id: 'notifications',
    label: 'nav.notifications',
    arabicLabel: 'الإشعارات',
    icon: Bell,
    path: '/notifications',
    group: MENU_GROUPS.HELP,
    roles: ['user', 'admin', 'super_admin', 'innovator', 'evaluator', 'mentor', 'team_member', 'expert', 'partner', 'stakeholder', 'department_head', 'sector_lead', 'domain_expert', 'viewer', 'user_manager', 'role_manager', 'challenge_manager', 'expert_coordinator', 'content_manager', 'system_auditor', 'data_analyst', 'campaign_manager', 'event_manager', 'stakeholder_manager', 'partnership_manager', 'team_lead', 'project_manager', 'research_lead', 'innovation_manager', 'external_expert', 'judge', 'facilitator', 'organization_admin', 'entity_manager', 'deputy_manager', 'domain_manager', 'sub_domain_manager', 'service_manager']
  }
];

// Helper function to get menu items by group
export const getMenuItemsByGroup = (items: MenuItem[]) => {
  return items.reduce((groups, item) => {
    if (!groups[item.group]) {
      groups[item.group] = [];
    }
    groups[item.group].push(item);
    return groups;
  }, {} as Record<string, MenuItem[]>);
};

// Helper function to filter menu items by user roles
export const filterMenuItemsByRoles = (items: MenuItem[], userRoles: string[]): MenuItem[] => {
  return items.filter(item => 
    item.roles.some(role => userRoles.includes(role))
  );
};