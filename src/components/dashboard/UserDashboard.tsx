import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from "@/components/ui/badge";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkspacePermissions } from "@/hooks/useWorkspacePermissions";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { ManagerDashboard } from "@/components/dashboard/ManagerDashboard";
import { ExpertDashboard } from "@/components/dashboard/ExpertDashboard";
import { PartnerDashboard } from "@/components/dashboard/PartnerDashboard";
import { InnovatorDashboard } from "@/components/dashboard/InnovatorDashboard";
import { useDashboardData, DashboardUserProfile } from "@/hooks/useDashboardData";

function getUserRoleDisplayName(role: string): string {
  switch (role) {
    case 'admin':
    case 'super_admin':
      return 'Administrator';
    case 'team_lead':
      return 'Team Lead';
    case 'project_manager':
      return 'Project Manager';
    case 'domain_expert':
      return 'Domain Expert';
    case 'evaluator':
      return 'Evaluator';
    case 'partner':
      return 'Partner';
    default:
      return 'Innovator';
  }
}

export function UserDashboard() {
  const { t } = useTranslation('dashboard');
  const { user } = useAuth();
  const permissions = useWorkspacePermissions();
  const { userProfile, loading, error, refreshProfile } = useDashboardData();

  useEffect(() => {
    if (user) {
      refreshProfile();
    }
  }, [user, refreshProfile]);

  const renderDashboardContent = () => {
    if (loading) {
      return <DashboardSkeleton />;
    }

    if (!userProfile) {
      return <div>Error loading user profile</div>;
    }

    switch (userProfile.primaryRole) {
      case 'admin':
      case 'super_admin':
        return (
          <AdminDashboard
            userProfile={userProfile}
            canManageUsers={permissions.canManageUsers}
            canViewSystemAnalytics={permissions.canViewSystemAnalytics}
            canManageSystem={permissions.canManageSystem}
          />
        );

      case 'team_lead':
      case 'project_manager':
        return (
          <ManagerDashboard
            userProfile={userProfile}
            canViewAnalytics={permissions.canViewAnalytics}
            canManageProjects={permissions.canManageTeam}
          />
        );

      case 'domain_expert':
      case 'evaluator':
        return (
          <ExpertDashboard
            userProfile={userProfile}
            canEvaluateIdeas={permissions.canEvaluateIdeas}
            canViewReports={permissions.canViewReports}
          />
        );

      case 'partner':
        return (
          <PartnerDashboard
            userProfile={userProfile}
            canCreateOpportunities={permissions.canCreateOpportunities}
            canViewOpportunities={permissions.canViewOpportunities}
          />
        );

      default:
        return (
          <InnovatorDashboard
            userProfile={userProfile}
            canCreateIdeas={permissions.canCreate}
            canViewChallenges={permissions.canView}
          />
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('dashboard.welcome', { name: userProfile?.fullName || 'User' })}
          </h1>
          <p className="text-muted-foreground">
            {getUserRoleDisplayName(userProfile?.primaryRole || 'innovator')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize">
            {userProfile?.primaryRole || 'user'}
          </Badge>
          {userProfile?.isTeamMember && (
            <Badge variant="secondary">Team Member</Badge>
          )}
        </div>
      </div>

      {/* Main Dashboard Content */}
      {renderDashboardContent()}
    </div>
  );
}

export interface DashboardProps {
  userProfile: DashboardUserProfile;
  canManageUsers: boolean;
  canViewSystemAnalytics: boolean;
  canManageSystem: boolean;
}

export default UserDashboard;
