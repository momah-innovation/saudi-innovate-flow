import { StakeholdersManagement } from "@/components/admin/StakeholdersManagement";
import { PageLayout } from "@/components/layout/PageLayout";
import { useState } from "react";
import { Plus, Users, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function StakeholdersManagementPage() {
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
            <SelectValue placeholder="تصفية حسب النوع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
            <SelectItem value="حكومي">حكومي</SelectItem>
            <SelectItem value="خاص">خاص</SelectItem>
            <SelectItem value="أكاديمي">أكاديمي</SelectItem>
            <SelectItem value="غير ربحي">غير ربحي</SelectItem>
            <SelectItem value="مجتمعي">مجتمعي</SelectItem>
            <SelectItem value="دولي">دولي</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[120px]">
        <Select>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="تصفية حسب التأثير" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المستويات</SelectItem>
            <SelectItem value="عالي">عالي</SelectItem>
            <SelectItem value="متوسط">متوسط</SelectItem>
            <SelectItem value="منخفض">منخفض</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <PageLayout
        title="إدارة أصحاب المصلحة"
        description="إدارة وتنظيم علاقات أصحاب المصلحة ومستويات التأثير"
        itemCount={4}
        primaryAction={{
          label: "إضافة صاحب مصلحة",
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
        searchPlaceholder="بحث في أصحاب المصلحة..."
        filters={filters}
        spacing="md"
        maxWidth="full"
      >
        <StakeholdersManagement 
          viewMode={viewMode} 
          searchTerm={searchValue} 
          showAddDialog={showAddDialog}
          onAddDialogChange={setShowAddDialog}
        />
      </PageLayout>
  );
}