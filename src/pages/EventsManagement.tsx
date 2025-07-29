import { EventsManagement } from "@/components/admin/EventsManagement";
import { AppShell } from "@/components/layout/AppShell";
import { PageLayout } from "@/components/layout/PageLayout";
import { useState } from "react";
import { Plus, Users, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSystemLists } from "@/hooks/useSystemLists";

export default function EventsManagementPage() {
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [searchValue, setSearchValue] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { generalStatusOptions } = useSystemLists();
  
  const secondaryActions = (
    <>
      <Select>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="تصدير" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pdf">PDF</SelectItem>
          <SelectItem value="excel">Excel</SelectItem>
          <SelectItem value="csv">CSV</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" className="gap-2">
        <Users className="w-4 h-4" />
        الإجراءات المجمعة
      </Button>
    </>
  );

  const filters = (
    <>
      <div className="min-w-[120px]">
        <Select>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="تصفية حسب الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="scheduled">مجدول</SelectItem>
            <SelectItem value="ongoing">جاري</SelectItem>
            {generalStatusOptions.filter(status => ['completed', 'cancelled'].includes(status)).map(status => (
              <SelectItem key={status} value={status}>
                {status === 'completed' ? 'مكتمل' : 'ملغي'}
              </SelectItem>
            ))}
            <SelectItem value="postponed">مؤجل</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[120px]">
        <Select>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="تصفية حسب النوع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
            <SelectItem value="workshop">ورشة عمل</SelectItem>
            <SelectItem value="conference">مؤتمر</SelectItem>
            <SelectItem value="seminar">ندوة</SelectItem>
            <SelectItem value="training">تدريب</SelectItem>
            <SelectItem value="networking">شبكات تواصل</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <AppShell>
      <PageLayout 
        title="إدارة الأحداث"
        description="إدارة وتنظيم الأحداث والفعاليات والورش التدريبية"
        itemCount={3}
        primaryAction={{
          label: "إنشاء حدث جديد",
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
        searchPlaceholder="بحث في الأحداث..."
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
    </AppShell>
  );
}