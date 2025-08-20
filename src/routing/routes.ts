// New Route Structure Configuration
// This file defines the complete routing architecture for the refactored Ruwād platform

import { ReactNode } from 'react';

// Route type definitions
export interface RouteConfig {
  path: string;
  element: ReactNode;
  requireAuth?: boolean;
  requireProfile?: boolean;
  requiredRole?: string;
  subscriptionRequired?: boolean;
  layout?: 'public' | 'authenticated' | 'workspace';
  metadata?: {
    title?: string;
    description?: string;
    category?: string;
  };
}

// Public routes (no authentication required)
export const PUBLIC_ROUTES = {
  // Landing & Discovery
  HOME: '/',
  ABOUT: '/about',
  CAMPAIGNS: '/campaigns',
  CHALLENGES: '/challenges',
  EVENTS: '/events', 
  MARKETPLACE: '/marketplace',
  PRICING: '/pricing',
  
  // Authentication
  LOGIN: '/login',
  SIGNUP: '/signup',
  AUTH: '/auth',
  
  // Public content
  STATISTICS: '/statistics',
  HELP: '/help',
  DESIGN_SYSTEM: '/design-system',
  WORKSPACE_DOCS: '/docs/workspaces',
  COLLABORATION: '/collaboration',
} as const;

// Authenticated routes (require login)
export const AUTHENTICATED_ROUTES = {
  // User workspace routes
  WORKSPACE_USER: '/workspace/user',
  WORKSPACE_EXPERT: '/workspace/expert', 
  WORKSPACE_ORGANIZATION: '/workspace/organization',
  WORKSPACE_PARTNER: '/workspace/partner',
  WORKSPACE_ADMIN: '/workspace/admin',
  WORKSPACE_TEAM: '/workspace/team',
  
  // Profile & Settings
  PROFILE_SETUP: '/profile/setup',
  PROFILE: '/profile',
  PROFILE_USER: '/profile/:userId',
  SETTINGS: '/settings',
  SETTINGS_SUBSCRIPTION: '/settings/subscription',
  
  // Content & Participation
  DASHBOARD: '/dashboard',
  IDEAS: '/ideas',
  SUBMIT_IDEA: '/submit-idea',
  DRAFTS: '/drafts',
  SAVED_ITEMS: '/saved',
  OPPORTUNITIES: '/opportunities',
  
  // Specific content routes
  CHALLENGE_DETAILS: '/challenges/:challengeId',
  CHALLENGE_SUBMIT_IDEA: '/challenges/:challengeId/submit-idea',
  CHALLENGE_QUESTIONS: '/challenges/:challengeId/questions',
  CHALLENGE_IDEAS: '/challenges/:challengeId/ideas',
  EVENT_DETAILS: '/events/:eventId',
  EVENT_FEEDBACK: '/events/:eventId/feedback',
  
  // Organization routes
  ORG_CAMPAIGNS: '/orgs/:orgId/sectors/:sectorId/campaigns/:campaignId',
  ORG_CHALLENGES: '/orgs/:orgId/sectors/:sectorId/campaigns/:campaignId/challenges/:challengeId',
} as const;

// Subscription-aware routes
export const SUBSCRIPTION_ROUTES = {
  BILLING: '/billing',
  ORG_BILLING: '/orgs/:orgId/billing',
} as const;

// Admin routes (require admin role)
export const ADMIN_ROUTES = {
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_CHALLENGES: '/admin/challenges',
  ADMIN_CHALLENGE_DETAIL: '/admin/challenges/:challengeId',
  ADMIN_CHALLENGE_SUBMISSIONS: '/admin/challenges/:challengeId/submissions',
  ADMIN_CAMPAIGNS: '/admin/campaigns',
  ADMIN_USERS: '/admin/users',
  ADMIN_PARTNERS: '/admin/partners',
  ADMIN_SECTORS: '/admin/sectors',
  ADMIN_EXPERT_ASSIGNMENTS: '/admin/expert-assignments',
  ADMIN_ORGANIZATIONAL_STRUCTURE: '/admin/organizational-structure',
  ADMIN_EVALUATION_MANAGEMENT: '/admin/evaluation-management',
  ADMIN_STAKEHOLDERS: '/admin/stakeholders',
  ADMIN_EVALUATIONS: '/admin/evaluations',
  ADMIN_EVENTS: '/admin/events',
  ADMIN_IDEAS: '/admin/ideas',
  ADMIN_TEAMS: '/admin/teams',
  ADMIN_SETTINGS: '/admin/system-settings',
  ADMIN_ANALYTICS: '/admin/system-analytics',
  ADMIN_STORAGE: '/admin/storage',
  ADMIN_STORAGE_POLICIES: '/admin/storage/policies',
  ADMIN_ENTITIES: '/admin/entities',
  ADMIN_SECURITY: '/admin/security',
  ADMIN_CORE_TEAM: '/admin/core-team',
  ADMIN_FOCUS_QUESTIONS: '/admin/focus-questions',
  ADMIN_OPPORTUNITIES: '/admin/opportunities',
  ADMIN_RELATIONSHIPS: '/admin/relationships',
} as const;

// Dashboard routes (unified admin interface)
export const DASHBOARD_ROUTES = {
  DASHBOARD_ACCESS_CONTROL: '/dashboard/access-control',
  DASHBOARD_TEAMS: '/dashboard/teams',
} as const;

// Route categories for navigation
export const ROUTE_CATEGORIES = {
  PUBLIC: 'public',
  DISCOVER: 'discover', 
  WORKSPACE: 'workspace',
  CONTENT: 'content',
  ORGANIZATION: 'organization',
  ADMIN: 'admin',
  SETTINGS: 'settings',
} as const;

// Define missing routes that are referenced but not defined
export const MISSING_ROUTES = {
  // Add any routes that are referenced but not defined
  PROFILE_EDIT: "/profile/edit",
  TEAM_DETAILS: "/teams/:teamId",
  IDEA_DETAILS: "/ideas/:ideaId",
  EVENT_REGISTER: "/events/:eventId/register",
  OPPORTUNITY_DETAILS: "/opportunities/:opportunityId",
  CHALLENGE_DISCUSSION: "/challenges/:challengeId/discussion",
  USER_PROFILE: "/users/:userId",
} as const;

// Export all routes combined
export const ALL_ROUTES = {
  ...PUBLIC_ROUTES,
  ...AUTHENTICATED_ROUTES,
  ...SUBSCRIPTION_ROUTES,
  ...ADMIN_ROUTES,
  ...DASHBOARD_ROUTES,
  ...MISSING_ROUTES,
} as const;