import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MaintenanceGuard } from "@/components/maintenance/MaintenanceGuard";
import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ProfileSetup from "./pages/ProfileSetup";
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
import ExpertDashboard from "./pages/ExpertDashboard";
import ExpertProfile from "./pages/ExpertProfile";
import EventsBrowse from "./pages/EventsBrowse";
import PublicStatistics from "./pages/PublicStatistics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <MaintenanceGuard>
          <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/profile/setup" 
              element={
                <ProtectedRoute>
                  <ProfileSetup />
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
              element={<PublicStatistics />} 
            />
            <Route path="/" element={<LandingPage />} />
            {/* Legacy dashboard route pointing to Index */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requireProfile>
                  <Index />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
        </MaintenanceGuard>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
