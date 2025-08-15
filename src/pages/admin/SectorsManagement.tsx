import { SectorsManagement } from "@/components/admin/SectorsManagement";
import { AdminBreadcrumb } from "@/components/layout/AdminBreadcrumb";
import { PageLayout } from "@/components/layout/PageLayout";
import { useDirection } from "@/components/ui/direction-provider";
import { useState } from "react";
import { Plus, Users, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";

export default function SectorsManagementPage() {
  const { isRTL, language } = useDirection();
  const { t } = useUnifiedTranslation();
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [searchValue, setSearchValue] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const title = isRTL && language === 'ar' ? 'إدارة القطاعات' : 'Sectors Management';
  const description = isRTL && language === 'ar' 
    ? 'إدارة قطاعات وفئات الابتكار' 
    : 'Manage innovation sectors and categories';

  const createNewLabel = isRTL && language === 'ar' ? 'إضافة قطاع' : 'Add Sector';
  const bulkActionsLabel = isRTL && language === 'ar' ? 'الإجراءات المجمعة' : 'Bulk Actions';
  const searchPlaceholder = isRTL && language === 'ar' ? 'بحث في القطاعات...' : 'Search sectors...';

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
        <Users className="w-4 h-4" />
        {bulkActionsLabel}
      </Button>
    </>
  );

  const filters = (
    <>
      <div className="min-w-[120px]">
        <Select>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder={isRTL && language === 'ar' ? 'تصفية حسب المحاذاة' : 'Filter by Alignment'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isRTL && language === 'ar' ? 'جميع المحاذاة' : 'All Alignments'}</SelectItem>
            <SelectItem value="vision2030">{isRTL && language === 'ar' ? 'رؤية 2030' : 'Vision 2030'}</SelectItem>
            <SelectItem value="digital">{isRTL && language === 'ar' ? 'رقمي' : 'Digital'}</SelectItem>
            <SelectItem value="sustainability">{isRTL && language === 'ar' ? 'استدامة' : 'Sustainability'}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminBreadcrumb />
      <PageLayout
        title={title}
        description={description}
        primaryAction={{
          label: createNewLabel,
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
        searchPlaceholder={searchPlaceholder}
        filters={filters}
        spacing="md"
        maxWidth="full"
      >
        <SectorsManagement />
      </PageLayout>
    </div>
  );
}