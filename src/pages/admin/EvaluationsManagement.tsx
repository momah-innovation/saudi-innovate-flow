import { EvaluationsManagement } from "@/components/admin/EvaluationsManagement";
import { AdminBreadcrumb } from "@/components/layout/AdminBreadcrumb";
import { PageLayout } from "@/components/layout/PageLayout";
import { useDirection } from "@/components/ui/direction-provider";
import { useState } from "react";
import { Plus, Users, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSystemLists } from "@/hooks/useSystemLists";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";

export default function EvaluationsManagementPage() {
  const { isRTL, language } = useDirection();
  const { t } = useUnifiedTranslation();
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [searchValue, setSearchValue] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { assignmentStatusOptions } = useSystemLists();
  
  const title = isRTL && language === 'ar' ? 'إدارة التقييمات' : 'Evaluations Management';
  const description = isRTL && language === 'ar' 
    ? 'إدارة تقييمات الخبراء والتقديرات' 
    : 'Manage expert evaluations and assessments';

  const createNewLabel = isRTL && language === 'ar' ? 'إضافة تقييم' : 'Add Evaluation';
  const bulkActionsLabel = isRTL && language === 'ar' ? 'الإجراءات المجمعة' : 'Bulk Actions';
  const searchPlaceholder = isRTL && language === 'ar' ? 'بحث في التقييمات...' : 'Search evaluations...';

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
            <SelectValue placeholder={isRTL && language === 'ar' ? 'تصفية حسب الحالة' : 'Filter by Status'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isRTL && language === 'ar' ? 'جميع الحالات' : 'All Status'}</SelectItem>
            {assignmentStatusOptions.filter(status => ['pending', 'completed'].includes(status)).map(status => (
              <SelectItem key={status} value={status}>
                {status === 'pending' ? (isRTL && language === 'ar' ? 'في الانتظار' : 'Pending') : 
                 (isRTL && language === 'ar' ? 'مكتمل' : 'Completed')}
              </SelectItem>
            ))}
            <SelectItem value="reviewed">{isRTL && language === 'ar' ? 'تم المراجعة' : 'Reviewed'}</SelectItem>
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
            <SelectItem value="innovation">{isRTL && language === 'ar' ? 'ابتكار' : 'Innovation'}</SelectItem>
            <SelectItem value="feasibility">{isRTL && language === 'ar' ? 'جدوى' : 'Feasibility'}</SelectItem>
            <SelectItem value="impact">{isRTL && language === 'ar' ? 'تأثير' : 'Impact'}</SelectItem>
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
        <EvaluationsManagement />
      </PageLayout>
    </div>
  );
}