import { CampaignsManagement } from "@/components/admin/CampaignsManagement";
import { AppShell } from "@/components/layout/AppShell";
import { PageLayout } from "@/components/layout/PageLayout";
import { useState } from "react";
import { Plus, Users, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function CampaignsManagementPage() {
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [searchValue, setSearchValue] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  
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
            <SelectItem value="planning">تخطيط</SelectItem>
            <SelectItem value="active">نشطة</SelectItem>
            <SelectItem value="completed">مكتملة</SelectItem>
            <SelectItem value="cancelled">ملغية</SelectItem>
            <SelectItem value="archived">مؤرشفة</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[120px]">
        <Select>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="تصفية حسب الموضوع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المواضيع</SelectItem>
            <SelectItem value="digital_transformation">التحول الرقمي</SelectItem>
            <SelectItem value="sustainability">الاستدامة</SelectItem>
            <SelectItem value="smart_cities">المدن الذكية</SelectItem>
            <SelectItem value="healthcare">الرعاية الصحية</SelectItem>
            <SelectItem value="education">التعليم</SelectItem>
            <SelectItem value="fintech">التكنولوجيا المالية</SelectItem>
            <SelectItem value="energy">الطاقة</SelectItem>
            <SelectItem value="transportation">النقل</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <AppShell>
      <PageLayout 
        title="إدارة الحملات"
        description="إنشاء وإدارة حملات الابتكار"
        itemCount={6}
        primaryAction={{
          label: "إنشاء حملة جديدة",
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
        searchPlaceholder="بحث في الحملات..."
        filters={filters}
        spacing="md"
        maxWidth="full"
      >
        <CampaignsManagement 
          viewMode={viewMode} 
          searchTerm={searchValue} 
          showAddDialog={showAddDialog}
          onAddDialogChange={setShowAddDialog}
        />
      </PageLayout>
    </AppShell>
  );
}