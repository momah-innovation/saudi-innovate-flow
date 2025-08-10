import { PageLayout } from "@/components/layout/PageLayout";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useState } from "react";
import { UserPlus, Users, Download, Search, MoreHorizontal, Settings, Mail } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { UserInvitationWizard } from "@/components/admin/UserInvitationWizard";
import { RoleRequestWizard } from "@/components/admin/RoleRequestWizard";
import { ExpertProfileDialog } from "@/components/admin/ExpertProfileDialog";
import { useSystemLists } from "@/hooks/useSystemLists";

export default function UserManagement() {
  const { t, language, isRTL } = useUnifiedTranslation();
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('list');
  const [searchValue, setSearchValue] = useState('');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showExpertDialog, setShowExpertDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { userStatusOptions } = useSystemLists();

  // Mock data for demonstration
  const users = [
    {
      id: 1,
      name: t("sample_user_ahmed"),
      email: "ahmed.mohamed@example.com",
      role: t("admin"),
      status: "active",
      lastLogin: "2024-01-15",
      department: t("department_administration")
    },
    {
      id: 2,
      name: t("sample_user_fatima"),
      email: "fatima.ali@example.com", 
      role: t("expert"),
      status: "active",
      lastLogin: "2024-01-14",
      department: t("department_technology")
    },
    {
      id: 3,
      name: t("sample_user_mohamed"),
      email: "mohamed.salem@example.com",
      role: t("innovator"), 
      status: "pending",
      lastLogin: null,
      department: t("department_research_development")
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
      render: (value: string | null) => value || t("never_logged_in")
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
        {t("edit_profile")}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleUserAction("role", user)}
      >
        <Users className="h-4 w-4" />
        {t("manage_role")}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleUserAction("invite", user)}
      >
        <Mail className="h-4 w-4" />
        {t("send_invitation")}
      </Button>
    </div>
  );

  const title = t("user_management_title");
  const description = t("manage_users_roles_permissions");
  const createNewLabel = t("invite_user");
  const bulkActionsLabel = t("bulk_actions");
  const searchPlaceholder = t("search_users");

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
            <SelectValue placeholder={t("filter_by_status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all_status")}</SelectItem>
            {userStatusOptions.filter(status => ['active', 'inactive', 'pending'].includes(status)).map(status => (
              <SelectItem key={status} value={status}>
                {status === 'active' ? t("active") : status === 'inactive' ? t("inactive") : t("pending")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[120px]">
        <Select>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder={t("filter_by_role")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all_roles")}</SelectItem>
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
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <CardTitle className="text-sm font-medium">
              {t("total_users")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className={`text-xs text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
              +12% {t("from_last_month")}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <CardTitle className="text-sm font-medium">
              {t("active_users")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className={`text-xs text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
              +8% {t("from_last_month")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <CardTitle className="text-sm font-medium">
              {t("pending_invitations")}
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className={`text-xs text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
              -2% {t("from_last_month")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <CardTitle className="text-sm font-medium">
              {t("expert_users")}
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className={`text-xs text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
              +4% {t("from_last_month")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <CardTitle>{t("users")}</CardTitle>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="relative">
                <Search className={`absolute top-2.5 h-4 w-4 text-muted-foreground ${isRTL ? 'right-2' : 'left-2'}`} />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className={`w-[300px] ${isRTL ? 'pr-8 pl-3' : 'pl-8 pr-3'}`}
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
        
        {/* Dialogs */}
        <UserInvitationWizard
          open={showInviteDialog}
          onOpenChange={setShowInviteDialog}
        />
        
        <RoleRequestWizard
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
      </PageLayout>
  );
};