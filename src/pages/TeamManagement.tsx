import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { InnovationTeamsContent } from '@/components/admin/InnovationTeamsContent';
import { UserPlus, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

export default function TeamManagement() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('members');
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
    <AppShell>
      <PageLayout 
        title={t('generalTeamManagement')}
        description={t('manageInnovationTeamsAndGroups')}
        itemCount={0} // This will be updated from the content component
        primaryAction={{
          label: t('addTeamMember'),
          onClick: () => setShowAddDialog(true),
          icon: <UserPlus className="w-4 h-4" />
        }}
        secondaryActions={secondaryActions}
        showLayoutSelector={activeTab === 'members'}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showSearch={true}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder={t('searchTeamMembers')}
        filters={filters}
        spacing="md"
        maxWidth="full"
      >
        <InnovationTeamsContent 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          viewMode={viewMode}
          searchTerm={searchValue}
          showAddDialog={showAddDialog}
          onAddDialogChange={setShowAddDialog}
        />
      </PageLayout>
    </AppShell>
  );
}