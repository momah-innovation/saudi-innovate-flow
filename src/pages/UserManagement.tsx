import { AppShell } from "@/components/layout/AppShell";
import { PageLayout } from "@/components/layout/PageLayout";
import { useDirection } from "@/components/ui/direction-provider";
import { useState } from "react";
import { UserPlus, Users, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const UserManagement = () => {
  const { isRTL, language } = useDirection();
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('list');
  const [searchValue, setSearchValue] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const title = isRTL && language === 'ar' ? 'إدارة المستخدمين' : 'User Management';
  const description = isRTL && language === 'ar' 
    ? 'إدارة المستخدمين والأدوار والصلاحيات' 
    : 'Manage users, roles, and permissions';

  const createNewLabel = isRTL && language === 'ar' ? 'دعوة مستخدم' : 'Invite User';
  const bulkActionsLabel = isRTL && language === 'ar' ? 'الإجراءات المجمعة' : 'Bulk Actions';
  const searchPlaceholder = isRTL && language === 'ar' ? 'بحث في المستخدمين...' : 'Search users...';

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
            <SelectItem value="inactive">{isRTL && language === 'ar' ? 'غير نشط' : 'Inactive'}</SelectItem>
            <SelectItem value="pending">{isRTL && language === 'ar' ? 'في الانتظار' : 'Pending'}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[120px]">
        <Select>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder={isRTL && language === 'ar' ? 'تصفية حسب الدور' : 'Filter by Role'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isRTL && language === 'ar' ? 'جميع الأدوار' : 'All Roles'}</SelectItem>
            <SelectItem value="admin">{isRTL && language === 'ar' ? 'مدير' : 'Admin'}</SelectItem>
            <SelectItem value="expert">{isRTL && language === 'ar' ? 'خبير' : 'Expert'}</SelectItem>
            <SelectItem value="innovator">{isRTL && language === 'ar' ? 'مبتكر' : 'Innovator'}</SelectItem>
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
          icon: <UserPlus className="w-4 h-4" />
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
        <div className="space-y-6">
          <p className="text-muted-foreground">User management functionality will be displayed here.</p>
        </div>
      </PageLayout>
    </AppShell>
  );
};

export default UserManagement;