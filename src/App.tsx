// Enhanced App.tsx with New Routing Architecture - Phase 1 Implementation
// Implements public/authenticated route separation with subscription awareness

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/config";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { DirectionProvider } from "@/components/ui/direction-provider";

// New routing components from Phase 1
import { PublicRoute } from "@/routing/RouteGuards";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ALL_ROUTES } from "@/routing/routes";
// Legacy components (will be organized better in subsequent phases)
import { MaintenanceGuard } from "@/components/maintenance/MaintenanceGuard";
import AdminDashboard from "./pages/AdminDashboard";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
// Import remaining components as before...
import ChallengeDetails from "./pages/ChallengeDetails";
import ChallengesManagementPage from "./pages/ChallengesManagement";
import FocusQuestionsManagement from "./pages/FocusQuestionsManagement";
import PartnersManagement from "./pages/PartnersManagement";
import SectorsManagement from "./pages/SectorsManagement";
import OrganizationalStructure from "./pages/OrganizationalStructure";
import ExpertAssignmentManagementPage from "./pages/ExpertAssignmentManagement";
import UserManagementPage from "./pages/UserManagementPage";
import SystemDocumentationPage from "./pages/SystemDocumentation";
import UserProfile from "./pages/UserProfile";
import SystemSettings from "./pages/SystemSettings";
import EvaluationsManagementPage from "./pages/EvaluationsManagement";
import CampaignsManagementPage from "./pages/CampaignsManagement";
import EventsManagementPage from "./pages/EventsManagement";
import StakeholdersManagementPage from "./pages/StakeholdersManagement";
import TeamManagement from "./pages/TeamManagement";
import InnovationTeamsManagement from "./pages/InnovationTeamsManagement";
import TeamWorkspace from "./pages/TeamWorkspace";
import RelationshipOverviewPage from "./pages/RelationshipOverview";
import IdeasManagementPage from "./pages/IdeasManagement";
import IdeasPage from "./pages/Ideas";
import UserDashboard from "./pages/UserDashboard";
import IdeaSubmissionWizard from "./pages/IdeaSubmissionWizard";
import IdeaDrafts from "./pages/IdeaDrafts";
import ExpertDashboard from "./pages/ExpertDashboard";
import ExpertProfile from "./pages/ExpertProfile";
import EventsBrowse from "./pages/EventsBrowse";
import StatisticsPage from "./pages/StatisticsPage";
import PartnerDashboard from "./pages/PartnerDashboard";
import PartnerProfile from "./pages/PartnerProfile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ChallengesBrowse from "./pages/ChallengesBrowse";
import ChallengeActivityHub from "./pages/ChallengeActivityHub";
import EvaluationsPage from "./pages/EvaluationsPage";
import EventRegistration from "./pages/EventRegistration";
import StakeholderDashboard from "./pages/StakeholderDashboard";
import AnalyticsPage from "./pages/AnalyticsPage";
import TrendsPage from "./pages/TrendsPage";
import ReportsPage from "./pages/ReportsPage";
import SystemAnalyticsPage from "./pages/SystemAnalyticsPage";
import HelpPage from "./pages/HelpPage";
import SavedItemsPage from "./pages/SavedItems";
import DesignSystem from "./pages/DesignSystem";
import EvaluationManagement from "./pages/EvaluationManagement";
import Opportunities from "./pages/Opportunities";
import OpportunitiesManagement from "./pages/OpportunitiesManagement";
import { StorageManagementPage } from "./components/storage/StorageManagementPage";
import { UploaderSettingsProvider } from "./contexts/UploaderSettingsContext";
import { StoragePoliciesPage } from "./components/storage/StoragePoliciesPage";
import AdminRelationships from "./pages/AdminRelationships";
import AdminEvaluations from "./pages/AdminEvaluations";
import { AppShell } from "@/components/layout/AppShell";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      <DirectionProvider>
        <TooltipProvider>
          <ThemeProvider>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <MaintenanceGuard>
                <BrowserRouter>
                  <Routes>
                    {/* ============ PUBLIC ROUTES - New Phase 1 Structure ============ */}
                    
                    {/* Landing Page */}
                    <Route path={ALL_ROUTES.HOME} element={<LandingPage />} />
                    
                    {/* Public Discovery Pages - Placeholders for Phase 3 */}
                    <Route path={ALL_ROUTES.ABOUT} element={
                      <div className="container mx-auto px-4 py-16">
                        <h1 className="text-4xl font-bold mb-8">About Ruwād</h1>
                        <p>Innovation platform for Saudi Arabia's government ministries.</p>
                        <p className="text-sm text-muted-foreground mt-4">Coming in Phase 3</p>
                      </div>
                    } />
                    <Route path={ALL_ROUTES.CAMPAIGNS} element={
                      <div className="container mx-auto px-4 py-16">
                        <h1 className="text-4xl font-bold mb-8">Innovation Campaigns</h1>
                        <p>Discover ongoing innovation campaigns across government sectors.</p>
                        <p className="text-sm text-muted-foreground mt-4">Coming in Phase 3</p>
                      </div>
                    } />
                    <Route path={ALL_ROUTES.MARKETPLACE} element={
                      <div className="container mx-auto px-4 py-16">
                        <h1 className="text-4xl font-bold mb-8">Innovation Marketplace</h1>
                        <p>Explore innovation opportunities and partnerships.</p>
                        <p className="text-sm text-muted-foreground mt-4">Coming in Phase 3</p>
                      </div>
                    } />
                    <Route path={ALL_ROUTES.PRICING} element={
                      <div className="container mx-auto px-4 py-16">
                        <h1 className="text-4xl font-bold mb-8">Pricing Plans</h1>
                        <p>Choose the right plan for your innovation needs.</p>
                        <p className="text-sm text-muted-foreground mt-4">Coming in Phase 4</p>
                      </div>
                    } />

                    {/* Authentication Routes */}
                    <Route path={ALL_ROUTES.AUTH} element={<Auth />} />
                    <Route path={ALL_ROUTES.LOGIN} element={<Auth />} />
                    <Route path={ALL_ROUTES.SIGNUP} element={<Auth />} />

                    {/* ============ WORKSPACE ROUTES - New Phase 1 Structure ============ */}
                    
                    {/* User Workspace - Placeholder for Phase 6 */}
                    <Route path={ALL_ROUTES.WORKSPACE_USER} element={
                      <ProtectedRoute requireProfile theme="workspace">
                        <div className="container mx-auto px-4 py-16">
                          <h1 className="text-2xl font-bold">User Workspace</h1>
                          <p>Personal innovation workspace - coming in Phase 6</p>
                        </div>
                      </ProtectedRoute>
                    } />

                    {/* Expert Workspace - Placeholder for Phase 6 */}
                    <Route path={ALL_ROUTES.WORKSPACE_EXPERT} element={
                      <ProtectedRoute requireProfile theme="expert">
                        <div className="container mx-auto px-4 py-16">
                          <h1 className="text-2xl font-bold">Expert Workspace</h1>
                          <p>Expert evaluation workspace - coming in Phase 6</p>
                        </div>
                      </ProtectedRoute>
                    } />

                    {/* Organization Workspace - Placeholder for Phase 6 */}
                    <Route path={ALL_ROUTES.WORKSPACE_ORG} element={
                      <ProtectedRoute requireProfile theme="workspace">
                        <div className="container mx-auto px-4 py-16">
                          <h1 className="text-2xl font-bold">Organization Workspace</h1>
                          <p>Organization management workspace - coming in Phase 6</p>
                        </div>
                      </ProtectedRoute>
                    } />

                    {/* Admin Workspace - Placeholder for Phase 6 */}
                    <Route path={ALL_ROUTES.WORKSPACE_ADMIN} element={
                      <ProtectedRoute requireProfile requiredRole="admin" theme="admin">
                        <div className="container mx-auto px-4 py-16">
                          <h1 className="text-2xl font-bold">Admin Workspace</h1>
                          <p>System administration workspace - coming in Phase 6</p>
                        </div>
                      </ProtectedRoute>
                    } />

                    {/* ============ LEGACY ROUTES - Preserved from original App.tsx ============ */}
            <Route 
              path="/profile/setup" 
              element={
                <ProtectedRoute>
                  <div>Profile Setup - TODO: Import ProfileSetup component</div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/challenges/:challengeId" 
              element={
                <ProtectedRoute requireProfile>
                  <ChallengeDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/challenges/activity/:challengeId" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <ChallengeActivityHub />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/challenges"
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <ChallengesManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/focus-questions" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <FocusQuestionsManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/partners" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <PartnersManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/sectors" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <SectorsManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/organizational-structure" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <OrganizationalStructure />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/expert-assignments" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <ExpertAssignmentManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <UserManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/system-documentation" 
              element={
                <ProtectedRoute requireProfile>
                  <SystemDocumentationPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/system-settings" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <SystemSettings />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/admin/evaluations" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <EvaluationsManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/campaigns" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <CampaignsManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/innovation-teams" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <InnovationTeamsManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/team-management" 
              element={
                <ProtectedRoute requireProfile>
                  <TeamManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/team-workspace" 
              element={
                <ProtectedRoute requireProfile>
                  <TeamWorkspace />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/events" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <EventsManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/stakeholders" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <StakeholdersManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ideas" 
              element={
                <ProtectedRoute requireProfile>
                  <IdeasPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/ideas" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <IdeasManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/relationships" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <RelationshipOverviewPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/profile/:userId" 
              element={
                <ProtectedRoute requireProfile>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute requireProfile>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute requireProfile>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requireProfile>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/submit-idea" 
              element={
                <ProtectedRoute requireProfile>
                  <IdeaSubmissionWizard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/drafts" 
              element={
                <ProtectedRoute requireProfile>
                  <IdeaDrafts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/expert-dashboard" 
              element={
                <ProtectedRoute requireProfile>
                  <ExpertDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/expert-profile" 
              element={
                <ProtectedRoute requireProfile>
                  <ExpertProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/events" 
              element={
                <ProtectedRoute requireProfile>
                  <EventsBrowse />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/statistics" 
              element={<StatisticsPage />} 
            />
            <Route 
              path="/partner-dashboard" 
              element={
                <ProtectedRoute requireProfile>
                  <PartnerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/partner-profile" 
              element={
                <ProtectedRoute requireProfile>
                  <PartnerProfile />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<LandingPage />} />
            {/* Missing pages routes */}
            <Route path="/challenges" element={<ChallengesBrowse />} />
            <Route path="/evaluations" element={<EvaluationsPage />} />
            <Route path="/event-registration" element={<EventRegistration />} />
            <Route path="/stakeholder-dashboard" element={<StakeholderDashboard />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/trends" element={<TrendsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/admin/system-analytics" element={<SystemAnalyticsPage />} />
            <Route 
              path="/admin/evaluation-management" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <EvaluationManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/saved" 
              element={
                <ProtectedRoute requireProfile>
                  <SavedItemsPage />
                </ProtectedRoute>
              } 
             />
             <Route 
               path="/opportunities" 
               element={
                 <ProtectedRoute requireProfile>
                   <Opportunities />
                 </ProtectedRoute>
               } 
              />
              <Route 
                path="/admin/opportunities" 
                element={
                  <ProtectedRoute requireProfile requiredRole="admin">
                    <OpportunitiesManagement />
                  </ProtectedRoute>
                } 
               />
                <Route 
                  path="/admin/storage" 
                  element={
                    <ProtectedRoute requireProfile requiredRole="admin">
                      <AppShell>
                        <UploaderSettingsProvider>
                          <StorageManagementPage />
                        </UploaderSettingsProvider>
                      </AppShell>
                    </ProtectedRoute>
                  } 
                 />
                <Route 
                  path="/admin/storage/policies" 
                  element={
                    <ProtectedRoute requireProfile requiredRole="admin">
                      <AppShell>
                        <StoragePoliciesPage />
                      </AppShell>
                    </ProtectedRoute>
                  } 
                  />
                 <Route 
                   path="/admin/relationships" 
                   element={
                     <ProtectedRoute requireProfile requiredRole="admin">
                       <AppShell>
                         <AdminRelationships />
                       </AppShell>
                     </ProtectedRoute>
                   } 
                  />
                 <Route 
                   path="/admin/evaluations" 
                   element={
                     <ProtectedRoute requireProfile requiredRole="admin">
                       <AppShell>
                         <AdminEvaluations />
                       </AppShell>
                     </ProtectedRoute>
                   } 
                  />
                <Route path="/help" element={<HelpPage />} />
                <Route 
                  path="/design-system" 
                  element={
                    <ProtectedRoute>
                      <AppShell>
                        <DesignSystem />
                      </AppShell>
                    </ProtectedRoute>
                  } 
                />
                {/* Admin Dashboard route */}
               <Route 
                 path="/admin/dashboard" 
                 element={
                   <ProtectedRoute requireProfile requiredRole="admin">
                     <AppShell>
                       <AdminDashboard />
                     </AppShell>
                   </ProtectedRoute>
                 } 
               />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
         </MaintenanceGuard>
            </AuthProvider>
          </ThemeProvider>
        </TooltipProvider>
      </DirectionProvider>
    </I18nextProvider>
  </QueryClientProvider>
);

export default App;
