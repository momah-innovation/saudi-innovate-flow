import { AdminBreadcrumb } from "@/components/layout/AdminBreadcrumb";
import { RelationshipOverview } from "@/components/admin/RelationshipOverview";
import { PageLayout } from "@/components/layout/PageLayout";
import { useDirection } from "@/components/ui/direction-provider";
import { useState } from "react";
import { Plus, Users, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";

export default function RelationshipOverviewPage() {
  const { isRTL, language } = useDirection();
  const { t } = useUnifiedTranslation();
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [searchValue, setSearchValue] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const title = isRTL && language === 'ar' ? 'نظرة عامة على العلاقات' : 'Relationship Overview';
  const description = isRTL && language === 'ar' 
    ? 'عرض وإدارة علاقات الكيانات عبر النظام' 
    : 'Visualize and manage entity relationships across the system';

  const createNewLabel = isRTL && language === 'ar' ? 'إضافة علاقة' : 'Add Relationship';
  const bulkActionsLabel = isRTL && language === 'ar' ? 'الإجراءات المجمعة' : 'Bulk Actions';
  const searchPlaceholder = isRTL && language === 'ar' ? 'بحث في العلاقات...' : 'Search relationships...';

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
            <SelectValue placeholder={isRTL && language === 'ar' ? 'تصفية حسب الكيان' : 'Filter by Entity'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isRTL && language === 'ar' ? 'جميع الكيانات' : 'All Entities'}</SelectItem>
            <SelectItem value="challenges">{isRTL && language === 'ar' ? 'التحديات' : 'Challenges'}</SelectItem>
            <SelectItem value="campaigns">{isRTL && language === 'ar' ? 'الحملات' : 'Campaigns'}</SelectItem>
            <SelectItem value="partners">{isRTL && language === 'ar' ? 'الشركاء' : 'Partners'}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[120px]">
        <Select>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder={isRTL && language === 'ar' ? 'تصفية حسب النوع' : 'Filter by Type'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isRTL && language === 'ar' ? 'جميع الأنواع' : 'All Types'}</SelectItem>
            <SelectItem value="direct">{isRTL && language === 'ar' ? 'مباشر' : 'Direct'}</SelectItem>
            <SelectItem value="indirect">{isRTL && language === 'ar' ? 'غير مباشر' : 'Indirect'}</SelectItem>
            <SelectItem value="complex">{isRTL && language === 'ar' ? 'معقد' : 'Complex'}</SelectItem>
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
        <RelationshipOverview />
      </PageLayout>
    </div>
  );
}