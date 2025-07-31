import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { TeamWorkspaceContent } from '@/components/admin/TeamWorkspaceContent';
import { EnhancedTeamWorkspaceHero } from '@/components/team-workspace/EnhancedTeamWorkspaceHero';
import { Users, UserPlus, Calendar, Target } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

export default function TeamWorkspace() {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState('dashboard');
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [searchValue, setSearchValue] = useState('');
  
  const secondaryActions = (
    <>
      <Select>
        <SelectTrigger className="w-32">
          <SelectValue placeholder={t('export')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pdf">PDF</SelectItem>
          <SelectItem value="excel">Excel</SelectItem>
          <SelectItem value="csv">CSV</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" className="gap-2">
        <Calendar className="w-4 h-4" />
        {t('schedule')}
      </Button>
    </>
  );

  const filters = (
    <>
      <div className="min-w-[120px]">
        <Select>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder={t('filterByProject')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allProjects')}</SelectItem>
            <SelectItem value="active">{t('activeProjects')}</SelectItem>
            <SelectItem value="completed">{t('completedProjects')}</SelectItem>
            <SelectItem value="overdue">{t('overdueProjects')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[120px]">
        <Select>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder={t('filterByTeam')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allTeams')}</SelectItem>
            <SelectItem value="my_team">{t('myTeam')}</SelectItem>
            <SelectItem value="available">{t('availableTeams')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <AppShell>
      <EnhancedTeamWorkspaceHero 
        totalTeams={5}
        activeProjects={8}
        teamMembers={12}
        completedTasks={45}
        onJoinTeam={() => console.log('Join team')}
        onShowFilters={() => console.log('Show filters')}
      />
      <PageLayout 
        title={t('teamWorkspace')}
        description={t('collaborativeWorkspaceForTeams')}
        itemCount={0}
        primaryAction={{
          label: t('joinTeam'),
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
        searchPlaceholder={t('searchWorkspace')}
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
    </AppShell>
  );
}