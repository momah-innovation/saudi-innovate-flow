import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Users,
  Settings,
  Mail
} from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { UserInvitationDialog } from "@/components/admin/UserInvitationDialog";
import { RoleRequestDialog } from "@/components/admin/RoleRequestDialog";
import { ExpertProfileDialog } from "@/components/admin/ExpertProfileDialog";

const UserManagement = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("userManagement")}</h1>
          <p className="text-muted-foreground">
            {t("manageUsersRolesPermissions")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            {t("filters")}
          </Button>
          <Button 
            onClick={() => setShowInviteDialog(true)}
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" />
            {t("inviteUser")}
          </Button>
        </div>
      </div>

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
                  placeholder={t("searchUsers")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
    </div>
  );
};

export default UserManagement;