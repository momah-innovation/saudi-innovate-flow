import { CampaignsManagement } from "@/components/admin/CampaignsManagement";
import { AppShell } from "@/components/layout/AppShell";
import { PageLayout } from "@/components/layout/PageLayout";
import { useDirection } from "@/components/ui/direction-provider";
import { useState } from "react";
import { Plus, Users, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function CampaignsManagementPage() {
  const { isRTL, language } = useDirection();
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [searchValue, setSearchValue] = useState('');
  
  const title = isRTL && language === 'ar' ? 'إدارة الحملات' : 'Campaign Management';
  const description = isRTL && language === 'ar' 
    ? 'إنشاء وإدارة حملات الابتكار' 
    : 'Create and manage innovation campaigns';

  const createCampaignLabel = isRTL && language === 'ar' ? 'إنشاء حملة' : 'Create Campaign';
  const bulkActionsLabel = isRTL && language === 'ar' ? 'الإجراءات المجمعة' : 'Bulk Actions';
  const searchPlaceholder = isRTL && language === 'ar' ? 'بحث' : 'Search';

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
            <SelectItem value="planning">{isRTL && language === 'ar' ? 'تخطيط' : 'Planning'}</SelectItem>
            <SelectItem value="active">{isRTL && language === 'ar' ? 'نشط' : 'Active'}</SelectItem>
            <SelectItem value="completed">{isRTL && language === 'ar' ? 'مكتمل' : 'Completed'}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[120px]">
        <Select>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder={isRTL && language === 'ar' ? 'تصفية حسب الموضوع' : 'Filter by Theme'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isRTL && language === 'ar' ? 'جميع المواضيع' : 'All Themes'}</SelectItem>
            <SelectItem value="fintech">{isRTL && language === 'ar' ? 'التكنولوجيا المالية' : 'FinTech'}</SelectItem>
            <SelectItem value="health">{isRTL && language === 'ar' ? 'الصحة' : 'Health'}</SelectItem>
            <SelectItem value="education">{isRTL && language === 'ar' ? 'التعليم' : 'Education'}</SelectItem>
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
        itemCount={6}
        primaryAction={{
          label: createCampaignLabel,
          onClick: () => console.log('Create campaign'),
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
        <CampaignsManagement />
      </PageLayout>
    </AppShell>
  );
}