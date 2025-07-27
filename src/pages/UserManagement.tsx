import { PageLayout } from "@/components/layout/PageLayout";
import { useTranslation } from "@/hooks/useTranslation";
import { useState } from "react";
import { UserPlus, Users, Download, Search, MoreHorizontal, Settings, Mail } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { UserInvitationDialog } from "@/components/admin/UserInvitationDialog";
import { RoleRequestDialog } from "@/components/admin/RoleRequestDialog";
import { ExpertProfileDialog } from "@/components/admin/ExpertProfileDialog";

const UserManagement = () => {
  const { t, language, isRTL } = useTranslation();
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('list');
  const [searchValue, setSearchValue] = useState('');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showExpertDialog, setShowExpertDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Mock data for demonstration
  const users = [
    {
      id: 1,
      name: "أحمد محمد",
      email: "ahmed.mohamed@example.com",
      role: "مدير",
      status: "active",
      lastLogin: "2024-01-15",
      department: "الإدارة"
    },
    {
      id: 2,
      name: "فاطمة علي",
      email: "fatima.ali@example.com", 
      role: "خبير",
      status: "active",
      lastLogin: "2024-01-14",
      department: "التقنية"
    },
    {
      id: 3,
      name: "محمد سالم",
      email: "mohamed.salem@example.com",
      role: "مبتكر", 
      status: "pending",
      lastLogin: null,
      department: "البحث والتطوير"
    }
  ];

  type User = typeof users[0];
  
  const columns: Array<{
    key: keyof User;
    title: string;
    sortable?: boolean;
    render?: (value: any, item: User) => React.ReactNode;
  }> = [
    {
      key: "name",
      title: t("name"),
      sortable: true,
    },
    {
      key: "email", 
      title: t("email"),
      sortable: true,
    },
    {
      key: "role",
      title: t("role"),
      render: (value: string) => (
        <Badge variant="secondary">{value}</Badge>
      )
    },
    {
      key: "department",
      title: t("department"),
    },
    {
      key: "status",
      title: t("status"),
      render: (value: string) => (
        <Badge variant={value === "active" ? "default" : "secondary"}>
          {value === "active" ? t("active") : t("pending")}
        </Badge>
      )
    },
    {
      key: "lastLogin",
      title: t("lastLogin"),
      render: (value: string | null) => value || t("neverLoggedIn")
    }
  ];

  const handleUserAction = (action: string, user: any) => {
    setSelectedUser(user);
    switch(action) {
      case "edit":
        setShowExpertDialog(true);
        break;
      case "role":
        setShowRoleDialog(true);
        break;
      case "invite":
        setShowInviteDialog(true);
        break;
    }
  };

  const renderUserActions = (user: User) => (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleUserAction("edit", user)}
      >
        <Settings className="h-4 w-4" />
        {t("editProfile")}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleUserAction("role", user)}
      >
        <Users className="h-4 w-4" />
        {t("manageRole")}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleUserAction("invite", user)}
      >
        <Mail className="h-4 w-4" />
        {t("sendInvitation")}
      </Button>
    </div>
  );

  const title = t("userManagement");
  const description = t("manageUsersRolesPermissions");
  const createNewLabel = t("inviteUser");
  const bulkActionsLabel = t("bulkActions");
  const searchPlaceholder = t("searchUsers");

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
            <SelectValue placeholder={t("filterByStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allStatus")}</SelectItem>
            <SelectItem value="active">{t("active")}</SelectItem>
            <SelectItem value="inactive">{t("inactive")}</SelectItem>
            <SelectItem value="pending">{t("pending")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[120px]">
        <Select>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder={t("filterByRole")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allRoles")}</SelectItem>
            <SelectItem value="admin">{t("admin")}</SelectItem>
            <SelectItem value="expert">{t("expert")}</SelectItem>
            <SelectItem value="innovator">{t("innovator")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  const renderContent = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("totalUsers")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +12% {t("fromLastMonth")}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("activeUsers")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">
              +8% {t("fromLastMonth")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("pendingInvitations")}
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-muted-foreground">
              -2% {t("fromLastMonth")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("expertUsers")}
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              +4% {t("fromLastMonth")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("users")}</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={users}
            columns={columns}
            searchable={false}
            actions={renderUserActions}
          />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      <PageLayout 
        title={title}
        description={description}
        primaryAction={{
          label: createNewLabel,
          onClick: () => setShowInviteDialog(true),
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
        {renderContent()}
      </PageLayout>

      {/* Dialogs */}
      <UserInvitationDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
      />
      
      <RoleRequestDialog
        open={showRoleDialog}
        onOpenChange={setShowRoleDialog}
        currentRoles={selectedUser?.role ? [selectedUser.role] : []}
        onRequestSubmitted={() => {
          setShowRoleDialog(false);
          setSelectedUser(null);
        }}
      />
      
      <ExpertProfileDialog
        open={showExpertDialog}
        onOpenChange={setShowExpertDialog}
        expertId={selectedUser?.id?.toString() || null}
      />
    </>
  );
};

export default UserManagement;