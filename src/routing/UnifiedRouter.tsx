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
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'));
const HelpPage = lazy(() => import('@/pages/HelpPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const DesignSystem = lazy(() => import('@/pages/DesignSystem'));
const WorkspaceDocumentation = lazy(() => import('@/pages/WorkspaceDocumentation'));
const PartnersManagement = lazy(() => import('@/pages/admin/PartnersManagement'));
const SectorsManagement = lazy(() => import('@/pages/admin/SectorsManagement'));
const ExpertAssignmentManagement = lazy(() => import('@/pages/admin/ExpertAssignmentManagement'));
const AdminEvaluations = lazy(() => import('@/pages/admin/AdminEvaluations'));
const AdminRelationships = lazy(() => import('@/pages/admin/AdminRelationships'));
const Challenges = lazy(() => import('@/pages/Challenges'));
const ChallengeDetails = lazy(() => import('@/pages/ChallengeDetails'));
const ChallengeIdeaSubmission = lazy(() => import('@/pages/ChallengeIdeaSubmission'));
const OpportunitiesPage = lazy(() => import('@/pages/Opportunities'));
const UserDashboard = lazy(() => import('@/components/dashboard/UserDashboard'));
const ProfileSetupPage = lazy(() => import('@/pages/ProfileSetup'));
const SettingsPage = lazy(() => import('@/pages/Settings'));
const EventsBrowse = lazy(() => import('@/pages/EventsBrowse'));
const ChallengesBrowse = lazy(() => import('@/pages/ChallengesBrowse'));
const AccessControlManagement = lazy(() => import('@/pages/dashboard/AccessControlManagement'));
const UserManagement = lazy(() => import('@/pages/admin/UserManagement'));
const ChallengesManagement = lazy(() => import('@/pages/admin/ChallengesManagement'));
const CampaignsManagement = lazy(() => import('@/pages/admin/CampaignsManagement'));
const EventsManagement = lazy(() => import('@/pages/admin/EventsManagement'));
const IdeasManagement = lazy(() => import('@/pages/admin/IdeasManagement'));
const OrganizationalStructureManagement = lazy(() => import('@/pages/admin/OrganizationalStructure'));
const StakeholdersManagement = lazy(() => import('@/pages/admin/StakeholdersManagement'));
const EntitiesManagement = lazy(() => import('@/pages/admin/EntitiesManagement'));
const CoreTeamManagement = lazy(() => import('@/pages/admin/CoreTeamManagement'));
const AdminChallengeSubmissions = lazy(() => import('@/pages/admin/AdminChallengeSubmissions'));
const ChallengeDetailAdmin = lazy(() => import('@/pages/admin/ChallengeDetail'));
const TeamManagement = lazy(() => import('@/pages/admin/TeamManagement'));
const FocusQuestionsManagement = lazy(() => import('@/pages/admin/FocusQuestionsManagement'));
const OpportunitiesManagement = lazy(() => import('@/pages/admin/OpportunitiesManagement'));
const RelationshipOverview = lazy(() => import('@/pages/admin/RelationshipOverview'));
const UserManagementPage = lazy(() => import('@/pages/admin/UserManagementPage'));
const EvaluationManagement = lazy(() => import('@/pages/admin/EvaluationManagement'));
const SystemSettings = lazy(() => import('@/pages/admin/SystemSettings'));
const SystemAnalytics = lazy(() => import('@/pages/admin/SystemAnalytics'));
const StorageManagement = lazy(() => import('@/pages/admin/StorageManagement'));
const StoragePolicies = lazy(() => import('@/pages/admin/StoragePolicies'));
const SecurityMonitor = lazy(() => import('@/pages/admin/SecurityMonitor'));
const SecurityAdvanced = lazy(() => import('@/pages/admin/SecurityAdvanced'));
const AccessControlAdvanced = lazy(() => import('@/pages/admin/AccessControlAdvanced'));
const ElevationMonitor = lazy(() => import('@/pages/admin/ElevationMonitor'));
const AnalyticsAdvanced = lazy(() => import('@/pages/admin/AnalyticsAdvanced'));
const CollaborationLandingPage = lazy(() => import('@/pages/CollaborationLandingPage'));
const CollaborativeIdeasPage = lazy(() => import('@/pages/CollaborativeBrowse').then(m => ({ default: m.CollaborativeIdeasPage })));
const CollaborativeChallengesPage = lazy(() => import('@/pages/CollaborativeBrowse').then(m => ({ default: m.CollaborativeChallengesPage })));
const CollaborativeEventsPage = lazy(() => import('@/pages/CollaborativeBrowse').then(m => ({ default: m.CollaborativeEventsPage })));
const CollaborativeOpportunitiesPage = lazy(() => import('@/pages/CollaborativeBrowse').then(m => ({ default: m.CollaborativeOpportunitiesPage })));

// Workspace Components
const UserWorkspace = lazy(() => import('@/pages/workspace/UserWorkspace'));
const ExpertWorkspace = lazy(() => import('@/pages/workspace/ExpertWorkspace'));
const OrganizationWorkspace = lazy(() => import('@/pages/workspace/OrganizationWorkspace'));
const PartnerWorkspace = lazy(() => import('@/pages/workspace/PartnerWorkspace'));
const AdminWorkspace = lazy(() => import('@/pages/workspace/AdminWorkspace'));
const TeamWorkspace = lazy(() => import('@/pages/workspace/TeamWorkspace'));

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
    component: Challenges,
    public: true,
  },
  {
    path: '/challenges-browse',
    component: ChallengesBrowse,
    public: true,
  },
  {
    path: ALL_ROUTES.CHALLENGE_DETAILS,
    component: ChallengeDetails,
    requireAuth: true,
    requireProfile: true,
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.CHALLENGE_SUBMIT_IDEA,
    component: ChallengeIdeaSubmission,
    requireAuth: true,
    requireProfile: true,
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.EVENTS,
    component: CollaborativeEventsPage,
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
    component: CollaborativeIdeasPage,
    requireAuth: true,
    requireProfile: true,
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.OPPORTUNITIES,
    component: CollaborativeOpportunitiesPage,
    requireAuth: true,
    requireProfile: true,
    withAppShell: true,
  },

  // Workspace routes
  {
    path: ALL_ROUTES.WORKSPACE_USER,
    component: UserWorkspace,
    requireAuth: true,
    requireProfile: true,
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.WORKSPACE_EXPERT,
    component: ExpertWorkspace,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['expert', 'admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.WORKSPACE_ORG,
    component: OrganizationWorkspace,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.WORKSPACE_PARTNER,
    component: PartnerWorkspace,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['partner', 'admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.WORKSPACE_ADMIN,
    component: AdminWorkspace,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.DASHBOARD_TEAMS,
    component: TeamWorkspace,
    requireAuth: true,
    requireProfile: true,
    withAppShell: true,
  },
  {
    path: '/collaboration',
    component: CollaborationLandingPage,
    requireAuth: true,
    requireProfile: true,
    withAppShell: true,
  },

  // Admin routes
  {
    path: ALL_ROUTES.ADMIN_DASHBOARD,
    component: AdminDashboardPage,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: '/admin/security-advanced',
    component: SecurityAdvanced,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: '/admin/access-control-advanced',
    component: AccessControlAdvanced,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: '/admin/elevation-monitor',
    component: ElevationMonitor,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: '/admin/analytics-advanced',
    component: AnalyticsAdvanced,
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
    path: ALL_ROUTES.ADMIN_CHALLENGE_DETAIL,
    component: ChallengeDetailAdmin,
    requireAuth: true,
    requireProfile: false, // Temporarily disabled to test routing
    requiredRole: ['admin', 'super_admin'],
    withAppShell: false, // ChallengeDetail handles AppShell internally
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
  {
    path: ALL_ROUTES.ADMIN_SECTORS,
    component: SectorsManagement,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.ADMIN_EXPERT_ASSIGNMENTS,
    component: ExpertAssignmentManagement,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.ADMIN_ORGANIZATIONAL_STRUCTURE,
    component: OrganizationalStructureManagement,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.ADMIN_STAKEHOLDERS,
    component: StakeholdersManagement,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.ADMIN_ENTITIES,
    component: EntitiesManagement,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.ADMIN_CORE_TEAM,
    component: CoreTeamManagement,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.ADMIN_TEAMS,
    component: TeamManagement,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.ADMIN_CHALLENGE_SUBMISSIONS,
    component: AdminChallengeSubmissions,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.ADMIN_FOCUS_QUESTIONS,
    component: FocusQuestionsManagement,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.ADMIN_OPPORTUNITIES,
    component: OpportunitiesManagement,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.ADMIN_RELATIONSHIPS,
    component: RelationshipOverview,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.ADMIN_EVALUATION_MANAGEMENT,
    component: EvaluationManagement,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.ADMIN_SETTINGS,
    component: SystemSettings,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.ADMIN_ANALYTICS,
    component: SystemAnalytics,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.ADMIN_STORAGE,
    component: StorageManagement,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.ADMIN_STORAGE_POLICIES,
    component: StoragePolicies,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.ADMIN_SECURITY,
    component: SecurityMonitor,
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
  {
    path: ALL_ROUTES.WORKSPACE_DOCS,
    component: WorkspaceDocumentation,
    public: true,
  },
];

// Route renderer component
const RouteRenderer: React.FC<{ config: UnifiedRouteConfig }> = ({ config }) => {
  const { component: Component, ...routeProps } = config;

  console.log('🔀 Route rendering:', { path: config.path, isPublic: config.public });

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