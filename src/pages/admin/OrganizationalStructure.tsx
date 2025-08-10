import { AdminBreadcrumb } from "@/components/layout/AdminBreadcrumb";
import { OrganizationalStructureManagement } from "@/components/admin/OrganizationalStructureManagement";
import { PageLayout } from "@/components/layout/PageLayout";
import { useDirection } from "@/components/ui/direction-provider";
import { useState } from "react";
import { Plus, Users, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function OrganizationalStructurePage() {
  const { isRTL, language } = useDirection();
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [searchValue, setSearchValue] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const title = isRTL && language === 'ar' ? 'الهيكل التنظيمي' : 'Organizational Structure';
  const description = isRTL && language === 'ar' 
    ? 'إدارة التسلسل الهرمي والهيكل التنظيمي' 
    : 'Manage organizational hierarchy and structure';

  const createNewLabel = isRTL && language === 'ar' ? 'إضافة عنصر' : 'Add Element';
  const bulkActionsLabel = isRTL && language === 'ar' ? 'الإجراءات المجمعة' : 'Bulk Actions';
  const searchPlaceholder = isRTL && language === 'ar' ? 'بحث في الهيكل...' : 'Search structure...';

  const secondaryActions = (
    <>
      <Select>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Export" />
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
            <SelectValue placeholder={isRTL && language === 'ar' ? 'تصفية حسب المستوى' : 'Filter by Level'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isRTL && language === 'ar' ? 'جميع المستويات' : 'All Levels'}</SelectItem>
            <SelectItem value="sector">{isRTL && language === 'ar' ? 'قطاع' : 'Sector'}</SelectItem>
            <SelectItem value="deputy">{isRTL && language === 'ar' ? 'نائب' : 'Deputy'}</SelectItem>
            <SelectItem value="department">{isRTL && language === 'ar' ? 'إدارة' : 'Department'}</SelectItem>
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
            <SelectItem value="operational">{isRTL && language === 'ar' ? 'تشغيلي' : 'Operational'}</SelectItem>
            <SelectItem value="strategic">{isRTL && language === 'ar' ? 'استراتيجي' : 'Strategic'}</SelectItem>
            <SelectItem value="support">{isRTL && language === 'ar' ? 'دعم' : 'Support'}</SelectItem>
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
        <OrganizationalStructureManagement />
      </PageLayout>
    </div>
  );
}