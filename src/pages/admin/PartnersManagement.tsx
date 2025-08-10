import { PartnersManagement } from "@/components/admin/PartnersManagement";
import { AdminBreadcrumb } from "@/components/layout/AdminBreadcrumb";
import { PageLayout } from "@/components/layout/PageLayout";
import { useDirection } from "@/components/ui/direction-provider";
import { useState } from "react";
import { Plus, Users, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSystemLists } from "@/hooks/useSystemLists";

export default function PartnersManagementPage() {
  const { isRTL, language } = useDirection();
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [searchValue, setSearchValue] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { partnerStatusOptions } = useSystemLists();
  
  const title = isRTL && language === 'ar' ? 'إدارة الشركاء' : 'Partners Management';
  const description = isRTL && language === 'ar' 
    ? 'إدارة شركاء ومتعاونين الابتكار' 
    : 'Manage innovation partners and collaborators';

  const createNewLabel = isRTL && language === 'ar' ? 'إضافة شريك' : 'Add Partner';
  const bulkActionsLabel = isRTL && language === 'ar' ? 'الإجراءات المجمعة' : 'Bulk Actions';
  const searchPlaceholder = isRTL && language === 'ar' ? 'بحث في الشركاء...' : 'Search partners...';

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
            {partnerStatusOptions.filter(status => ['active', 'inactive', 'pending'].includes(status)).map(status => (
              <SelectItem key={status} value={status}>
                {status === 'active' ? (isRTL && language === 'ar' ? 'نشط' : 'Active') :
                 status === 'inactive' ? (isRTL && language === 'ar' ? 'غير نشط' : 'Inactive') :
                 (isRTL && language === 'ar' ? 'في الانتظار' : 'Pending')}
              </SelectItem>
            ))}
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
            <SelectItem value="government">{isRTL && language === 'ar' ? 'حكومي' : 'Government'}</SelectItem>
            <SelectItem value="private">{isRTL && language === 'ar' ? 'خاص' : 'Private'}</SelectItem>
            <SelectItem value="nonprofit">{isRTL && language === 'ar' ? 'غير ربحي' : 'Non-profit'}</SelectItem>
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
        <PartnersManagement />
      </PageLayout>
    </div>
  );
}