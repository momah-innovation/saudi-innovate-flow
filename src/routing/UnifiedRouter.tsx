// Unified Route Management System - Single Source of Truth
// Consolidates all routing logic and RBAC into one cohesive system

import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import { ALL_ROUTES } from './routes';
import { UserRole } from '@/hooks/useRoleAccess';
import { Loader2 } from 'lucide-react';

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

// Lazy load all components
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
const UserManagement = lazy(() => import('@/pages/admin/UserManagement'));
const ChallengesManagement = lazy(() => import('@/pages/admin/ChallengesManagement'));
const CampaignsManagement = lazy(() => import('@/pages/admin/CampaignsManagement'));
const EventsManagement = lazy(() => import('@/pages/admin/EventsManagement'));
const IdeasManagement = lazy(() => import('@/pages/admin/IdeasManagement'));
const PartnersManagement = lazy(() => import('@/pages/admin/PartnersManagement'));

// Route configuration interface
export interface UnifiedRouteConfig {
  path: string;
  component: React.ComponentType;
  public?: boolean;
  requireAuth?: boolean;
  requireProfile?: boolean;
  requiredRole?: UserRole | UserRole[];
  subscriptionRequired?: boolean;
  withAppShell?: boolean;
  redirectTo?: string;
}

// Centralized route definitions
export const UNIFIED_ROUTES: UnifiedRouteConfig[] = [
  // Public routes
  {
    path: ALL_ROUTES.HOME,
    component: LandingPage,
    public: true,
  },
  {
    path: ALL_ROUTES.AUTH,
    component: AuthPage,
    public: true,
  },
  {
    path: '/signup',
    component: AuthPage,
    public: true,
  },
  {
    path: '/login',
    component: AuthPage,
    public: true,
  },
  {
    path: ALL_ROUTES.HELP,
    component: HelpPage,
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

  // Authenticated user routes
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
    path: ALL_ROUTES.OPPORTUNITIES,
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
  {
    path: ALL_ROUTES.ADMIN_USERS,
    component: UserManagement,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.ADMIN_CHALLENGES,
    component: ChallengesManagement,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.ADMIN_CAMPAIGNS,
    component: CampaignsManagement,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.ADMIN_IDEAS,
    component: IdeasManagement,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.ADMIN_EVENTS,
    component: EventsManagement,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.ADMIN_PARTNERS,
    component: PartnersManagement,
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

// Route renderer component
const RouteRenderer: React.FC<{ config: UnifiedRouteConfig }> = ({ config }) => {
  const { component: Component, ...routeProps } = config;

  // Public routes render directly
  if (config.public) {
    return <Component />;
  }

  // Wrap with AppShell if requested
  const content = config.withAppShell ? (
    <AppShell>
      <Component />
    </AppShell>
  ) : (
    <Component />
  );

  // Wrap with ProtectedRoute for auth/role checks
  return (
    <ProtectedRoute
      requireAuth={routeProps.requireAuth}
      requireProfile={routeProps.requireProfile}
      requiredRole={routeProps.requiredRole}
      subscriptionRequired={routeProps.subscriptionRequired}
      redirectTo={routeProps.redirectTo}
    >
      {content}
    </ProtectedRoute>
  );
};

// Main unified router component
export const UnifiedRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {UNIFIED_ROUTES.map((routeConfig) => (
            <Route
              key={routeConfig.path}
              path={routeConfig.path}
              element={<RouteRenderer config={routeConfig} />}
            />
          ))}
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default UnifiedRouter;