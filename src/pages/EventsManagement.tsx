import { EventsManagement } from "@/components/admin/EventsManagement";
import { AppShell } from "@/components/layout/AppShell";
import { PageLayout } from "@/components/layout/PageLayout";
import { useDirection } from "@/components/ui/direction-provider";
import { useState } from "react";
import { Plus, Users, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function EventsManagementPage() {
  const { isRTL, language } = useDirection();
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [searchValue, setSearchValue] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const title = isRTL && language === 'ar' ? 'إدارة الأحداث' : 'Events Management';
  const description = isRTL && language === 'ar' 
    ? 'إدارة أحداث وأنشطة الابتكار' 
    : 'Manage innovation events and activities';

  const createNewLabel = isRTL && language === 'ar' ? 'إنشاء جديد' : 'Create New';
  const bulkActionsLabel = isRTL && language === 'ar' ? 'الإجراءات المجمعة' : 'Bulk Actions';
  const searchPlaceholder = isRTL && language === 'ar' ? 'بحث في الأحداث...' : 'Search events...';
  const exportLabel = isRTL && language === 'ar' ? 'تصدير' : 'Export';

  const secondaryActions = (
    <>
      <Select>
        <SelectTrigger className="w-32">
          <SelectValue placeholder={exportLabel} />
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
            <SelectItem value="planning">{isRTL && language === 'ar' ? 'تخطيط' : 'Planning'}</SelectItem>
            <SelectItem value="active">{isRTL && language === 'ar' ? 'نشط' : 'Active'}</SelectItem>
            <SelectItem value="completed">{isRTL && language === 'ar' ? 'مكتمل' : 'Completed'}</SelectItem>
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
            <SelectItem value="workshop">{isRTL && language === 'ar' ? 'ورشة عمل' : 'Workshop'}</SelectItem>
            <SelectItem value="seminar">{isRTL && language === 'ar' ? 'ندوة' : 'Seminar'}</SelectItem>
            <SelectItem value="conference">{isRTL && language === 'ar' ? 'مؤتمر' : 'Conference'}</SelectItem>
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
        itemCount={11}
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
        <EventsManagement 
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showAddDialog={showAddDialog}
          setShowAddDialog={setShowAddDialog}
        />
      </PageLayout>
    </AppShell>
  );
}