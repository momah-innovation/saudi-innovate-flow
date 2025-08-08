// Centralized Route Configuration with RBAC
import React, { lazy } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import { ALL_ROUTES } from './routes';
import { UserRole } from '@/hooks/useRoleAccess';

// Lazy load components - using existing pages
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const AuthPage = lazy(() => import('@/pages/Auth'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const HelpPage = lazy(() => import('@/pages/HelpPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const DesignSystem = lazy(() => import('@/pages/DesignSystem'));
const AdminEvaluations = lazy(() => import('@/pages/AdminEvaluations'));
const AdminRelationships = lazy(() => import('@/pages/AdminRelationships'));
const Challenges = lazy(() => import('@/pages/Challenges'));
const Ideas = lazy(() => import('@/pages/Ideas'));
const ChallengeDetails = lazy(() => import('@/pages/ChallengeDetails'));
const OpportunitiesPage = lazy(() => import('@/pages/Opportunities'));
const UserDashboard = lazy(() => import('@/components/dashboard/UserDashboard'));
const ProfileSetupPage = lazy(() => import('@/pages/ProfileSetup'));
const SettingsPage = lazy(() => import('@/pages/Settings'));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'));
const EventsBrowse = lazy(() => import('@/pages/EventsBrowse'));
const ChallengesBrowse = lazy(() => import('@/pages/ChallengesBrowse'));
const AccessControlManagement = lazy(() => import('@/pages/dashboard/AccessControlManagement'));

export interface RouteConfigItem {
  path: string;
  component: React.ComponentType;
  public?: boolean;
  requireAuth?: boolean;
  requireProfile?: boolean;
  requiredRole?: UserRole | UserRole[];
  subscriptionRequired?: boolean;
  redirectTo?: string;
  withAppShell?: boolean;
  exact?: boolean;
}

export const routeConfig: RouteConfigItem[] = [
  // Public routes
  {
    path: ALL_ROUTES.HOME,
    component: LandingPage,
    public: true,
  },
  {
    path: ALL_ROUTES.CHALLENGES,
    component: ChallengesBrowse,
    public: true,
  },
  {
    path: ALL_ROUTES.EVENTS,
    component: EventsBrowse,
    public: true,
  },
  {
    path: ALL_ROUTES.HELP,
    component: HelpPage,
    public: true,
  },
  {
    path: ALL_ROUTES.AUTH,
    component: AuthPage,
    public: true,
  },

  // Authenticated routes
  {
    path: ALL_ROUTES.DASHBOARD,
    component: UserDashboard,
    requireAuth: true,
    requireProfile: true,
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.PROFILE_SETUP,
    component: ProfileSetupPage,
    requireAuth: true,
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.SETTINGS,
    component: SettingsPage,
    requireAuth: true,
    requireProfile: true,
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.IDEAS,
    component: Ideas,
    requireAuth: true,
    requireProfile: true,
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.CHALLENGE_DETAILS,
    component: ChallengeDetails,
    requireAuth: true,
    requireProfile: true,
    withAppShell: true,
  },
  {
    path: '/opportunities',
    component: OpportunitiesPage,
    requireAuth: true,
    requireProfile: true,
    withAppShell: true,
  },

  // Admin routes
  {
    path: ALL_ROUTES.ADMIN_DASHBOARD,
    component: AdminDashboard,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.ADMIN_EVALUATIONS,
    component: AdminEvaluations,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.ADMIN_ANALYTICS,
    component: AnalyticsPage,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: '/admin/relationships',
    component: AdminRelationships,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },

  // Super admin only routes
  {
    path: ALL_ROUTES.DASHBOARD_ACCESS_CONTROL,
    component: AccessControlManagement,
    requireAuth: true,
    requireProfile: true,
    requiredRole: 'super_admin',
    withAppShell: true,
  },

  // Special routes
  {
    path: ALL_ROUTES.DESIGN_SYSTEM,
    component: DesignSystem,
    requireAuth: true,
    withAppShell: true,
  },
];

// Route renderer function
export const renderRoute = (config: RouteConfigItem): React.ReactElement => {
  const { component: Component, ...routeProps } = config;

  if (config.public) {
    return <Component />;
  }

  const content = config.withAppShell ? (
    <AppShell>
      <Component />
    </AppShell>
  ) : (
    <Component />
  );

  return (
    <ProtectedRoute
      requireAuth={routeProps.requireAuth}
      requireProfile={routeProps.requireProfile}
      requiredRole={Array.isArray(routeProps.requiredRole) ? routeProps.requiredRole[0] : routeProps.requiredRole}
      subscriptionRequired={routeProps.subscriptionRequired}
      redirectTo={routeProps.redirectTo}
    >
      {content}
    </ProtectedRoute>
  );
};