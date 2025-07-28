import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { TeamManagementContent } from '@/components/admin/TeamManagementContent';
import { UserPlus, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default function TeamManagement() {
  const [activeTab, setActiveTab] = useState('members');
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
            <SelectValue placeholder="تصفية حسب الدور" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأدوار</SelectItem>
            <SelectItem value="team_lead">قائد فريق</SelectItem>
            <SelectItem value="senior_specialist">اختصاصي أول</SelectItem>
            <SelectItem value="specialist">اختصاصي</SelectItem>
            <SelectItem value="analyst">محلل</SelectItem>
            <SelectItem value="coordinator">منسق</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[120px]">
        <Select>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="تصفية حسب التخصص" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع التخصصات</SelectItem>
            <SelectItem value="digital_transformation">التحول الرقمي</SelectItem>
            <SelectItem value="data_analysis">تحليل البيانات</SelectItem>
            <SelectItem value="project_management">إدارة المشاريع</SelectItem>
            <SelectItem value="innovation_research">بحوث الابتكار</SelectItem>
            <SelectItem value="strategic_planning">التخطيط الاستراتيجي</SelectItem>
            <SelectItem value="stakeholder_management">إدارة أصحاب المصلحة</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <AppShell>
      <PageLayout 
        title="إدارة فريق الابتكار"
        description="إدارة أعضاء فريق الابتكار الأساسي والمهام والتحليلات"
        itemCount={0} // This will be updated from the content component
        primaryAction={{
          label: "إضافة عضو فريق",
          onClick: () => setShowAddDialog(true),
          icon: <UserPlus className="w-4 h-4" />
        }}
        secondaryActions={secondaryActions}
        showLayoutSelector={false}
        showSearch={true}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="بحث في أعضاء الفريق..."
        filters={filters}
        spacing="md"
        maxWidth="full"
      >
        <TeamManagementContent 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchTerm={searchValue}
          showAddDialog={showAddDialog}
          onAddDialogChange={setShowAddDialog}
        />
      </PageLayout>
    </AppShell>
  );
}