import { ExpertAssignmentManagement } from "@/components/admin/ExpertAssignmentManagement";
import { AppShell } from "@/components/layout/AppShell";
import { PageLayout } from "@/components/layout/PageLayout";
import { useDirection } from "@/components/ui/direction-provider";
import { useState } from "react";
import { Plus, Users, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function ExpertAssignmentManagementPage() {
  const { isRTL, language } = useDirection();
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [searchValue, setSearchValue] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const title = isRTL && language === 'ar' ? 'إدارة مهام الخبراء' : 'Expert Assignment Management';
  const description = isRTL && language === 'ar' 
    ? 'تعيين الخبراء للتحديات وإدارة التقييمات' 
    : 'Assign experts to challenges and manage evaluations';

  const createNewLabel = isRTL && language === 'ar' ? 'تعيين خبير' : 'Assign Expert';
  const bulkActionsLabel = isRTL && language === 'ar' ? 'الإجراءات المجمعة' : 'Bulk Actions';
  const searchPlaceholder = isRTL && language === 'ar' ? 'بحث في المهام...' : 'Search assignments...';

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
            <SelectValue placeholder={isRTL && language === 'ar' ? 'تصفية حسب الحالة' : 'Filter by Status'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isRTL && language === 'ar' ? 'جميع الحالات' : 'All Status'}</SelectItem>
            <SelectItem value="active">{isRTL && language === 'ar' ? 'نشط' : 'Active'}</SelectItem>
            <SelectItem value="pending">{isRTL && language === 'ar' ? 'في الانتظار' : 'Pending'}</SelectItem>
            <SelectItem value="completed">{isRTL && language === 'ar' ? 'مكتمل' : 'Completed'}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[120px]">
        <Select>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder={isRTL && language === 'ar' ? 'تصفية حسب التخصص' : 'Filter by Expertise'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isRTL && language === 'ar' ? 'جميع التخصصات' : 'All Expertise'}</SelectItem>
            <SelectItem value="technology">{isRTL && language === 'ar' ? 'تقنية' : 'Technology'}</SelectItem>
            <SelectItem value="business">{isRTL && language === 'ar' ? 'أعمال' : 'Business'}</SelectItem>
            <SelectItem value="legal">{isRTL && language === 'ar' ? 'قانوني' : 'Legal'}</SelectItem>
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
        <ExpertAssignmentManagement />
      </PageLayout>
    </AppShell>
  );
}