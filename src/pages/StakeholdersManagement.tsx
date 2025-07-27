import { StakeholdersManagement } from "@/components/admin/StakeholdersManagement";
import { AppShell } from "@/components/layout/AppShell";
import { PageLayout } from "@/components/layout/PageLayout";
import { useDirection } from "@/components/ui/direction-provider";
import { useState } from "react";
import { Plus, Users, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function StakeholdersManagementPage() {
  const { isRTL, language } = useDirection();
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [searchValue, setSearchValue] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const title = isRTL && language === 'ar' ? 'إدارة أصحاب المصلحة' : 'Stakeholders Management';
  const description = isRTL && language === 'ar' 
    ? 'إدارة أصحاب المصلحة والعلاقات في الابتكار' 
    : 'Manage innovation stakeholders and relationships';

  const createNewLabel = isRTL && language === 'ar' ? 'إضافة صاحب مصلحة' : 'Add Stakeholder';
  const bulkActionsLabel = isRTL && language === 'ar' ? 'الإجراءات المجمعة' : 'Bulk Actions';
  const searchPlaceholder = isRTL && language === 'ar' ? 'بحث في أصحاب المصلحة...' : 'Search stakeholders...';

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
            <SelectValue placeholder={isRTL && language === 'ar' ? 'تصفية حسب النوع' : 'Filter by Type'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isRTL && language === 'ar' ? 'جميع الأنواع' : 'All Types'}</SelectItem>
            <SelectItem value="internal">{isRTL && language === 'ar' ? 'داخلي' : 'Internal'}</SelectItem>
            <SelectItem value="external">{isRTL && language === 'ar' ? 'خارجي' : 'External'}</SelectItem>
            <SelectItem value="partner">{isRTL && language === 'ar' ? 'شريك' : 'Partner'}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[120px]">
        <Select>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder={isRTL && language === 'ar' ? 'تصفية حسب المشاركة' : 'Filter by Engagement'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isRTL && language === 'ar' ? 'جميع المستويات' : 'All Levels'}</SelectItem>
            <SelectItem value="high">{isRTL && language === 'ar' ? 'عالي' : 'High'}</SelectItem>
            <SelectItem value="medium">{isRTL && language === 'ar' ? 'متوسط' : 'Medium'}</SelectItem>
            <SelectItem value="low">{isRTL && language === 'ar' ? 'منخفض' : 'Low'}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <AppShell>
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
        <StakeholdersManagement />
      </PageLayout>
    </AppShell>
  );
}