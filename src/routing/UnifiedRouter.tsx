// Unified Route Management System - Single Source of Truth
// Consolidates all routing logic and RBAC into one cohesive system

import React, { useEffect, Suspense } from 'react';
import { debugLog } from '@/utils/debugLogger';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { TranslationAppShellProvider } from '@/components/TranslationAppShellProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import { ALL_ROUTES } from './routes';
import { UserRole } from '@/hooks/useRoleAccess';
import { Loader2 } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useTranslationPrefetch } from '@/hooks/useTranslationPrefetch';
import { useNavigationPreload } from '@/hooks/useNavigationPreload';
import { useDataPrefetching } from '@/hooks/useDataPrefetching';
import { useIntelligentPrefetch } from '@/hooks/useIntelligentPrefetch';
import { useAdvancedCacheWarming } from '@/hooks/useAdvancedCacheWarming';

// CORE USER FLOWS - Direct imports (High usage 60%+)
import LandingPage from '@/pages/LandingPage';
import AuthPage from '@/pages/Auth';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import HelpPage from '@/pages/HelpPage';
import NotFound from '@/pages/NotFound';
import DesignSystem from '@/pages/DesignSystem';
import Challenges from '@/pages/Challenges';
import ChallengeDetails from '@/pages/ChallengeDetails';
import ChallengeIdeaSubmission from '@/pages/ChallengeIdeaSubmission';
import OpportunitiesPage from '@/pages/Opportunities';
import UserDashboard from '@/components/dashboard/UserDashboard';
import ProfileSetupPage from '@/pages/ProfileSetup';
import SettingsPage from '@/pages/Settings';
import EventsBrowse from '@/pages/EventsBrowse';
import ChallengesBrowse from '@/pages/ChallengesBrowse';
import CollaborationLandingPage from '@/pages/CollaborationLandingPage';
import { CollaborativeIdeasPage } from '@/pages/CollaborativeBrowse';
import { CollaborativeChallengesPage } from '@/pages/CollaborativeBrowse';
import { CollaborativeEventsPage } from '@/pages/CollaborativeBrowse';
import { CollaborativeOpportunitiesPage } from '@/pages/CollaborativeBrowse';

// ADMIN MANAGEMENT - Direct imports (Medium usage 20-60%)
import WorkspaceDocumentation from '@/pages/WorkspaceDocumentation';
import PartnersManagement from '@/pages/admin/PartnersManagement';
import SectorsManagement from '@/pages/admin/SectorsManagement';
import ExpertAssignmentManagement from '@/pages/admin/ExpertAssignmentManagement';
import AdminEvaluations from '@/pages/admin/AdminEvaluations';
import AdminRelationships from '@/pages/admin/AdminRelationships';
import AccessControlManagement from '@/pages/dashboard/AccessControlManagement';
import UserManagement from '@/pages/admin/UserManagement';
import ChallengesManagement from '@/pages/admin/ChallengesManagement';
import CampaignsManagement from '@/pages/admin/CampaignsManagement';
import EventsManagement from '@/pages/admin/EventsManagement';
import IdeasManagement from '@/pages/admin/IdeasManagement';
import OrganizationalStructureManagement from '@/pages/admin/OrganizationalStructure';
import StakeholdersManagement from '@/pages/admin/StakeholdersManagement';
import EntitiesManagement from '@/pages/admin/EntitiesManagement';
import CoreTeamManagement from '@/pages/admin/CoreTeamManagement';
import AdminChallengeSubmissions from '@/pages/admin/AdminChallengeSubmissions';
import ChallengeDetailAdmin from '@/pages/admin/ChallengeDetail';
import TeamManagement from '@/pages/admin/TeamManagement';
import FocusQuestionsManagement from '@/pages/admin/FocusQuestionsManagement';
import OpportunitiesManagement from '@/pages/admin/OpportunitiesManagement';
import RelationshipOverview from '@/pages/admin/RelationshipOverview';
import UserManagementPage from '@/pages/admin/UserManagementPage';
import EvaluationManagement from '@/pages/admin/EvaluationManagement';
import SystemSettings from '@/pages/admin/SystemSettings';
import StoragePolicies from '@/pages/admin/StoragePolicies';
import SecurityMonitor from '@/pages/admin/SecurityMonitor';
import ElevationMonitor from '@/pages/admin/ElevationMonitor';

// HEAVY ADMIN PAGES - Lazy loaded (Low usage <15%)
const SystemAnalytics = React.lazy(() => import('@/pages/admin/SystemAnalytics'));
const StorageManagement = React.lazy(() => import('@/pages/admin/StorageManagement'));
const SecurityAdvanced = React.lazy(() => import('@/pages/admin/SecurityAdvanced'));
const AccessControlAdvanced = React.lazy(() => import('@/pages/admin/AccessControlAdvanced'));
const AnalyticsAdvanced = React.lazy(() => import('@/pages/admin/AnalyticsAdvanced'));
const AIManagement = React.lazy(() => import('@/pages/admin/AIManagement'));
const FileManagementAdvanced = React.lazy(() => import('@/pages/admin/FileManagementAdvanced'));
const ChallengesAnalyticsAdvanced = React.lazy(() => import('@/pages/admin/ChallengesAnalyticsAdvanced'));

// Workspace Components
import UserWorkspace from '@/pages/workspace/UserWorkspace';
import ExpertWorkspace from '@/pages/workspace/ExpertWorkspace';
import OrganizationWorkspace from '@/pages/workspace/OrganizationWorkspace';
import PartnerWorkspace from '@/pages/workspace/PartnerWorkspace';
import AdminWorkspace from '@/pages/workspace/AdminWorkspace';
import TeamWorkspace from '@/pages/workspace/TeamWorkspace';
import WorkspacePage from '@/pages/WorkspacePage';
import { MigratedAdminDashboard } from '@/components/admin/MigratedAdminDashboard';

// Loading component
const LoadingFallback = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
};

// Admin page loading component
const AdminPageLoader = () => {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">Loading admin panel...</p>
      </div>
    </div>
  );
};

// Lazy loading wrapper for admin components
const LazyAdminRoute = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<AdminPageLoader />}>
    <ErrorBoundary fallback={
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive">Failed to load admin page</p>
          <button 
            onClick={() => {
              // Use proper page reload handling
              window.location.reload();
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Reload Page
          </button>
        </div>
      </div>
    }>
      {children}
    </ErrorBoundary>
  </Suspense>
);

// Route configuration interface
export interface UnifiedRouteConfig {
  path: string;
  component: React.ComponentType | (() => React.ReactElement);
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
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },

  // Workspace routes
  {
    path: '/workspace',
    component: WorkspacePage,
    requireAuth: true,
    requireProfile: true,
    withAppShell: true,
  },
  {
    path: '/workspace/:type',
    component: WorkspacePage,
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
    requiredRole: ['innovator', 'team_member', 'admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.WORKSPACE_EXPERT,
    component: ExpertWorkspace,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['domain_expert', 'evaluator', 'expert', 'admin', 'super_admin'],
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
    requiredRole: ['team_member', 'team_lead', 'project_manager', 'admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: '/collaboration',
    component: CollaborationLandingPage,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
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
    component: () => <LazyAdminRoute><SecurityAdvanced /></LazyAdminRoute>,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: '/admin/access-control-advanced',
    component: () => <LazyAdminRoute><AccessControlAdvanced /></LazyAdminRoute>,
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
    component: () => <LazyAdminRoute><AnalyticsAdvanced /></LazyAdminRoute>,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: '/admin/ai-management',
    component: () => <LazyAdminRoute><AIManagement /></LazyAdminRoute>,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: '/admin/file-management-advanced',
    component: () => <LazyAdminRoute><FileManagementAdvanced /></LazyAdminRoute>,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: '/admin/challenges-analytics-advanced',
    component: () => <LazyAdminRoute><ChallengesAnalyticsAdvanced /></LazyAdminRoute>,
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
    component: () => <LazyAdminRoute><SystemAnalytics /></LazyAdminRoute>,
    requireAuth: true,
    requireProfile: true,
    requiredRole: ['admin', 'super_admin'],
    withAppShell: true,
  },
  {
    path: ALL_ROUTES.ADMIN_STORAGE,
    component: () => <LazyAdminRoute><StorageManagement /></LazyAdminRoute>,
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
  {
    path: '/admin/migrated-dashboard',
    component: MigratedAdminDashboard,
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

  // Public routes render directly
  if (config.public) {
    try {
      return <Component />;
    } catch (error) {
      debugLog.error('ROUTER DEBUG: Public route render failed', { error });
      throw error;
    }
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

// Performance-enhanced router component 
function RouterWithPerformanceMonitoring() {
  const location = useLocation();

  // Phase 2: Translation Optimization
  useTranslationPrefetch({ 
    enabled: true, 
    preloadCoreNamespaces: true,
    preloadRoleBasedNamespaces: true,
    preloadNavigationNamespaces: true
  });
  useNavigationPreload({ 
    enabled: true, 
    preloadTranslations: true,
    preloadData: true,
    debounceMs: 100 
  });

  // Phase 3: Data Prefetching Architecture  
  useDataPrefetching({ 
    enabled: true, 
    aggressive: false, 
    userBehaviorTracking: true 
  });
  
  useIntelligentPrefetch();
  
  useAdvancedCacheWarming({ 
    enabled: true, 
    aggressiveMode: false,
    backgroundOnly: true,
    maxConcurrentRequests: 3
  });

  // Performance monitoring integration
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Import performance utilities dynamically to avoid circular dependencies
    import('@/utils/NavigationStateMachine').then(({ navigationStateMachine }) => {
      navigationStateMachine.startNavigation(currentPath);
      
      const timer = setTimeout(() => {
        navigationStateMachine.completeNavigation(currentPath, 100);
      }, 100);
      
      return () => clearTimeout(timer);
    });
  }, [location.pathname]);

  return (
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
  );
}

// Main unified router component with V3 translation system integration
export const UnifiedRouter: React.FC = () => {
  return (
    <ErrorBoundary fallback={<div className="p-8 text-center">An error occurred. <button onClick={() => {try{if(typeof window!=='undefined'&&window.location)window.location.reload()}catch{window.location.href='/'}}} className="underline">Reload</button></div>}>
      <BrowserRouter>
        <TranslationAppShellProvider>
          <RouterWithPerformanceMonitoring />
        </TranslationAppShellProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default UnifiedRouter;