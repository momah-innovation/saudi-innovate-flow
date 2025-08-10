import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { TeamManagementContent } from '@/components/admin/TeamManagementContent';
import { UserPlus, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

export default function TeamManagement() {
  const { t } = useUnifiedTranslation();
  const [activeTab, setActiveTab] = useState('teams');
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [searchValue, setSearchValue] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  
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
        <Users className="w-4 h-4" />
        {t('bulkActions')}
      </Button>
    </>
  );

  const filters = (
    <>
      <div className="min-w-[120px]">
        <Select>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder={t('filterByRole')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allRoles')}</SelectItem>
            <SelectItem value="team_lead">{t('teamLead')}</SelectItem>
            <SelectItem value="senior_specialist">{t('seniorSpecialist')}</SelectItem>
            <SelectItem value="specialist">{t('specialist')}</SelectItem>
            <SelectItem value="analyst">{t('analyst')}</SelectItem>
            <SelectItem value="coordinator">{t('coordinator')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[120px]">
        <Select>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder={t('filterBySpecialization')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allSpecializations')}</SelectItem>
            <SelectItem value="digital_transformation">{t('digitalTransformation')}</SelectItem>
            <SelectItem value="data_analysis">{t('dataAnalysis')}</SelectItem>
            <SelectItem value="project_management">{t('projectManagement')}</SelectItem>
            <SelectItem value="innovation_research">{t('innovationResearch')}</SelectItem>
            <SelectItem value="strategic_planning">{t('strategicPlanning')}</SelectItem>
            <SelectItem value="stakeholder_management">{t('stakeholderManagement')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <PageLayout
        title={t('innovationTeamsManagement')}
        description={t('manageInnovationTeamsAndGroups')}
        itemCount={0} // This will be updated from the content component
        primaryAction={{
          label: t('addInnovationTeam'),
          onClick: () => setShowAddDialog(true),
          icon: <UserPlus className="w-4 h-4" />
        }}
        secondaryActions={secondaryActions}
        showLayoutSelector={activeTab === 'teams'}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showSearch={true}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder={t('searchInnovationTeams')}
        filters={filters}
        spacing="md"
        maxWidth="full"
      >
        <TeamManagementContent 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          viewMode={viewMode}
          searchTerm={searchValue}
          showAddDialog={showAddDialog}
          onAddDialogChange={setShowAddDialog}
        />
      </PageLayout>
  );
}