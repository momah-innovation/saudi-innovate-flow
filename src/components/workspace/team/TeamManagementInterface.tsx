import React, { useState } from 'react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  UserPlus, 
  Settings, 
  Calendar,
  MessageSquare,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { TeamCreationForm } from './TeamCreationForm';
import { MemberInvitationInterface } from './MemberInvitationInterface';
import { ProjectTaskManagement } from './ProjectTaskManagement';
import { MeetingScheduling } from './MeetingScheduling';
import { TeamCollaborationTools } from './TeamCollaborationTools';

interface TeamMember {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  avatar_url?: string;
  joined_at: string;
  last_active?: string;
}

interface Team {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  member_count: number;
  active_projects: number;
  pending_tasks: number;
}

interface TeamManagementInterfaceProps {
  userRole: string;
  userId: string;
  teams: Team[];
  onTeamCreate: (teamData: any) => Promise<void>;
  onMemberInvite: (inviteData: any) => Promise<void>;
  onTeamUpdate: (teamId: string, updates: any) => Promise<void>;
}

export function TeamManagementInterface({
  userRole,
  userId,
  teams,
  onTeamCreate,
  onMemberInvite,
  onTeamUpdate
}: TeamManagementInterfaceProps) {
  const { t, isRTL } = useUnifiedTranslation();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(teams[0] || null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const canManageTeams = ['manager', 'team_lead', 'admin'].includes(userRole);
  const canInviteMembers = ['manager', 'team_lead', 'admin', 'coordinator'].includes(userRole);

  return (
    <div className="space-y-6">
      {/* Team Management Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t('workspace.team.management.title')}</h2>
          <p className="text-muted-foreground">
            {t('workspace.team.management.description')}
          </p>
        </div>
        
        {canManageTeams && (
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            {t('workspace.team.create')}
          </Button>
        )}
      </div>

      {/* Teams Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <Card 
            key={team.id}
            className={`cursor-pointer transition-colors hover:bg-muted/50 ${
              selectedTeam?.id === team.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedTeam(team)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{team.name}</span>
                <Badge variant="outline">
                  {team.member_count} {t('workspace.team.members')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{team.active_projects} {t('workspace.team.active_projects')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{team.pending_tasks} {t('workspace.team.pending_tasks')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Details */}
      {selectedTeam && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedTeam.name}</span>
              <div className="flex gap-2">
                {canInviteMembers && (
                  <Button variant="outline" size="sm" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    {t('workspace.team.invite_member')}
                  </Button>
                )}
                {canManageTeams && (
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">
                  {t('workspace.team.tabs.overview')}
                </TabsTrigger>
                <TabsTrigger value="members">
                  {t('workspace.team.tabs.members')}
                </TabsTrigger>
                <TabsTrigger value="projects">
                  {t('workspace.team.tabs.projects')}
                </TabsTrigger>
                <TabsTrigger value="meetings">
                  {t('workspace.team.tabs.meetings')}
                </TabsTrigger>
                <TabsTrigger value="collaboration">
                  {t('workspace.team.tabs.collaboration')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <TeamOverview team={selectedTeam} />
              </TabsContent>

              <TabsContent value="members" className="mt-6">
                <MemberInvitationInterface
                  teamId={selectedTeam.id}
                  canInvite={canInviteMembers}
                  onInvite={onMemberInvite}
                />
              </TabsContent>

              <TabsContent value="projects" className="mt-6">
                <ProjectTaskManagement
                  teamId={selectedTeam.id}
                  canManage={canManageTeams}
                />
              </TabsContent>

              <TabsContent value="meetings" className="mt-6">
                <MeetingScheduling
                  teamId={selectedTeam.id}
                  canSchedule={canManageTeams}
                />
              </TabsContent>

              <TabsContent value="collaboration" className="mt-6">
                <TeamCollaborationTools
                  teamId={selectedTeam.id}
                  userId={userId}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Team Creation Modal */}
      {showCreateForm && (
        <TeamCreationForm
          onSubmit={onTeamCreate}
          onClose={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
}

// Team Overview Component
function TeamOverview({ team }: { team: Team }) {
  const { t } = useUnifiedTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t('workspace.team.overview.total_members')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{team.member_count}</div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <CheckCircle className="h-3 w-3" />
            <span>{t('team:status.all_active')}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t('workspace.team.overview.active_projects')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{team.active_projects}</div>
          <div className="flex items-center gap-1 text-sm text-blue-600">
            <Clock className="h-3 w-3" />
            <span>{t('team:status.in_progress')}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t('workspace.team.overview.pending_tasks')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{team.pending_tasks}</div>
          <div className="flex items-center gap-1 text-sm text-orange-600">
            <AlertCircle className="h-3 w-3" />
            <span>{t('team:status.requires_attention')}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
