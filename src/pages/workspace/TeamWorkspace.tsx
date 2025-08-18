import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { TeamWorkspaceContent } from '@/components/admin/TeamWorkspaceContent';
import { EnhancedTeamWorkspaceHero } from '@/components/team-workspace/EnhancedTeamWorkspaceHero';
import { WorkspaceCollaboration } from '@/components/collaboration/WorkspaceCollaboration';
import { WorkspaceBreadcrumb } from '@/components/layout/WorkspaceBreadcrumb';
import { Users, UserPlus, Calendar, Target } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/utils/logger';

export default function TeamWorkspace() {
  const { t } = useUnifiedTranslation();
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [searchValue, setSearchValue] = useState('');
  
  const secondaryActions = (
    <>
      <Select>
        <SelectTrigger className="w-32">
          <SelectValue placeholder={t('common.actions.export')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pdf">PDF</SelectItem>
          <SelectItem value="excel">Excel</SelectItem>
          <SelectItem value="csv">CSV</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" className="gap-2">
        <Calendar className="w-4 h-4" />
        {t('workspace.team.actions.create_project')}
      </Button>
    </>
  );

  const filters = (
    <>
      <div className="min-w-[120px]">
        <Select>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder={t('workspace.team.nav.projects')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.all')}</SelectItem>
            <SelectItem value="active">{t('workspace.team.active_projects')}</SelectItem>
            <SelectItem value="completed">{t('workspace.project_status.completed')}</SelectItem>
            <SelectItem value="overdue">{t('workspace.project_status.delayed')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[120px]">
        <Select>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder={t('workspace.team.nav.team_members')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.all')}</SelectItem>
            <SelectItem value="my_team">{t('workspace.team.team_members')}</SelectItem>
            <SelectItem value="available">{t('workspace.team.metrics.active_projects')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <>
      <WorkspaceBreadcrumb />
      <AppShell>
      <EnhancedTeamWorkspaceHero 
        totalTeams={5}
        activeProjects={8}
        teamMembers={12}
        completedTasks={45}
        onJoinTeam={() => logger.info('Join team requested', { component: 'TeamWorkspace', action: 'onJoinTeam' })}
        onShowFilters={() => logger.info('Show filters requested', { component: 'TeamWorkspace', action: 'onShowFilters' })}
      />
      <PageLayout 
        title={t('workspace.team.title')}
        description={t('workspace.team.description')}
        itemCount={0}
        primaryAction={{
          label: t('workspace.team.actions.invite_member'),
          onClick: () => {},
          icon: <UserPlus className="w-4 h-4" />
        }}
        secondaryActions={secondaryActions}
        showLayoutSelector={activeView === 'projects'}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showSearch={true}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder={t('common.placeholders.search')}
        filters={filters}
        spacing="md"
        maxWidth="full"
      >
        <TeamWorkspaceContent 
          activeView={activeView}
          onViewChange={setActiveView}
          viewMode={viewMode}
          searchTerm={searchValue}
        />
      </PageLayout>
      
      {/* Team Workspace Collaboration */}
      <WorkspaceCollaboration
        workspaceType="team"
        entityId={user?.id}
        showWidget={true}
        showPresence={true}
        showActivity={true}
      />
    </AppShell>
    </>
  );
}