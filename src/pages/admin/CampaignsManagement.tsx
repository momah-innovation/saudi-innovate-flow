import { AdminBreadcrumb } from "@/components/layout/AdminBreadcrumb";
import { CampaignsManagement } from "@/components/admin/CampaignsManagement";
import { PageLayout } from "@/components/layout/PageLayout";
import { useState } from "react";
import { Plus, Users, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSystemLists } from "@/hooks/useSystemLists";

export default function CampaignsManagementPage() {
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [searchValue, setSearchValue] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { generalStatusOptions, campaignThemeOptions } = useSystemLists();
  
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
            {generalStatusOptions.filter(status => ['active', 'completed', 'cancelled'].includes(status)).map(status => (
              <SelectItem key={status} value={status}>
                {status === 'active' ? 'نشطة' : status === 'completed' ? 'مكتملة' : 'ملغية'}
              </SelectItem>
            ))}
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
            {campaignThemeOptions.map(theme => (
              <SelectItem key={theme} value={theme}>
                {theme === 'digital_transformation' ? 'التحول الرقمي' :
                 theme === 'sustainability' ? 'الاستدامة' :
                 theme === 'smart_cities' ? 'المدن الذكية' :
                 theme === 'healthcare' ? 'الرعاية الصحية' :
                 theme === 'education' ? 'التعليم' :
                 theme === 'fintech' ? 'التكنولوجيا المالية' :
                 theme === 'energy' ? 'الطاقة' :
                 theme === 'transportation' ? 'النقل' : theme}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminBreadcrumb />
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
    </div>
  );
}