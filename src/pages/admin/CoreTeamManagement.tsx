import { useState } from 'react';
import { debugLog } from '@/utils/debugLogger';
import { AdminBreadcrumb } from "@/components/layout/AdminBreadcrumb";
import { PageLayout } from '@/components/layout/PageLayout';
import { InnovationTeamsContent } from '@/components/admin/InnovationTeamsContent';
import { UserPlus, Users, Zap } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useAuth } from "@/contexts/AuthContext";
import { useDirection } from "@/components/ui/direction-provider";

export default function CoreTeamManagement() {
  debugLog.debug('Core Team Management page loaded');
  const { t } = useUnifiedTranslation();
  const { hasRole } = useAuth();
  const { isRTL } = useDirection();
  const [activeTab, setActiveTab] = useState('core-team');
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [searchValue, setSearchValue] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Check if user has admin access
  if (!hasRole('admin') && !hasRole('super_admin')) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">
            {isRTL ? 'غير مصرح لك بالوصول' : 'Access Denied'}
          </h2>
          <p className="text-muted-foreground">
            {isRTL ? 'هذه الصفحة مخصصة للمديرين فقط' : 'This page is only accessible to administrators'}
          </p>
        </div>
      </div>
    );
  }
  
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
            <SelectItem value="core_team">{t('coreTeam')}</SelectItem>
            <SelectItem value="innovation_lead">{t('innovationLead')}</SelectItem>
            <SelectItem value="data_analyst">{t('dataAnalyst')}</SelectItem>
            <SelectItem value="project_manager">{t('projectManager')}</SelectItem>
            <SelectItem value="research_analyst">{t('researchAnalyst')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[120px]">
        <Select>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder={t('filterByStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allStatuses')}</SelectItem>
            <SelectItem value="active">{t('active')}</SelectItem>
            <SelectItem value="inactive">{t('inactive')}</SelectItem>
            <SelectItem value="on_leave">{t('onLeave')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminBreadcrumb />
      <PageLayout
        title={t('coreTeam')}
        description={t('manageCoreTeamMembers')}
        itemCount={0}
        primaryAction={{
          label: t('addCoreTeamMember'),
          onClick: () => setShowAddDialog(true),
          icon: <UserPlus className="w-4 h-4" />
        }}
        secondaryActions={secondaryActions}
        showLayoutSelector={activeTab === 'core-team'}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showSearch={true}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder={t('searchCoreTeamMembers')}
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
    </div>
  );
}