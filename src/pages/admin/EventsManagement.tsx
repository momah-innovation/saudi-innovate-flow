import { EventsManagement } from "@/components/admin/EventsManagement";
import { AdminBreadcrumb } from "@/components/layout/AdminBreadcrumb";
import { PageLayout } from "@/components/layout/PageLayout";
import { useState } from "react";
import { Plus, Users, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSystemLists } from "@/hooks/useSystemLists";
import { useAuth } from "@/contexts/AuthContext";
import { useDirection } from "@/components/ui/direction-provider";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";

export default function EventsManagementPage() {
  const { hasRole } = useAuth();
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [searchValue, setSearchValue] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { generalStatusOptions } = useSystemLists();

  // Check if user has admin access
  if (!hasRole('admin') && !hasRole('super_admin')) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">
            {t('admin:access.denied')}
          </h2>
          <p className="text-muted-foreground">
            {t('admin:access.admin_only')}
          </p>
        </div>
      </div>
    );
  }
  
  const secondaryActions = (
    <>
      <Select>
        <SelectTrigger className="w-32">
          <SelectValue placeholder={t('common:export')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pdf">PDF</SelectItem>
          <SelectItem value="excel">Excel</SelectItem>
          <SelectItem value="csv">CSV</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" className="gap-2">
        <Users className="w-4 h-4" />
        {t('common:bulk_actions')}
      </Button>
    </>
  );

  const filters = (
    <>
      <div className="min-w-[120px]">
        <Select>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder={t('events:filter_by_status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common:all_status')}</SelectItem>
            <SelectItem value="scheduled">{t('events:status.scheduled')}</SelectItem>
            <SelectItem value="ongoing">{t('events:status.ongoing')}</SelectItem>
            {generalStatusOptions.filter(status => ['completed', 'cancelled'].includes(status)).map(status => (
              <SelectItem key={status} value={status}>
                {status === 'completed' ? t('events:status.completed') : t('events:status.cancelled')}
              </SelectItem>
            ))}
            <SelectItem value="postponed">{t('events:status.postponed')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[120px]">
        <Select>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder={t('events:filter_by_type')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common:all_types')}</SelectItem>
            <SelectItem value="workshop">{t('event_type.workshop')}</SelectItem>
            <SelectItem value="conference">{t('event_type.conference')}</SelectItem>
            <SelectItem value="seminar">{t('events:type.seminar')}</SelectItem>
            <SelectItem value="training">{t('events:type.training')}</SelectItem>
            <SelectItem value="networking">{t('events:type.networking')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminBreadcrumb />
      <PageLayout
        title={t('events:management.title')}
        description={t('events:management.description')}
        itemCount={3}
        primaryAction={{
          label: t('events:create_new_event'),
          onClick: () => setShowAddDialog(true),
          icon: <Plus className="w-4 h-4" />
        }}
        secondaryActions={secondaryActions}
        showLayoutSelector={true}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showSearch={true}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder={t('events:search_placeholder')}
        filters={filters}
        spacing="md"
        maxWidth="full"
      >
        <EventsManagement 
          viewMode={viewMode} 
          searchTerm={searchValue} 
          showAddDialog={showAddDialog}
          onAddDialogChange={setShowAddDialog}
        />
      </PageLayout>
    </div>
  );
}
