import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Shield, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { RoleRequestDialog } from "@/components/admin/RoleRequestDialog";
import { Header } from "@/components/layout/Header";
import { AppSidebar } from "@/components/layout/Sidebar";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

interface UserRole {
  id: string;
  role: string;
  is_active: boolean;
  granted_at: string;
}

export default function Settings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [isRoleRequestDialogOpen, setIsRoleRequestDialogOpen] = useState(false);

  useEffect(() => {
    fetchUserRoles();
  }, []);

  const fetchUserRoles = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('granted_at', { ascending: false });

      if (error) throw error;
      setUserRoles(data || []);
    } catch (error) {
      console.error('Error fetching user roles:', error);
    }
  };


  const handleTabChange = (tab: string) => {
    if (tab === "focus-questions") {
      navigate("/admin/focus-questions");
    } else if (tab === "partners") {
      navigate("/admin/partners");
    } else if (tab === "sectors") {
      navigate("/admin/sectors");
    } else if (tab === "organizational-structure") {
      navigate("/admin/organizational-structure");
    } else if (tab === "expert-assignments") {
      navigate("/admin/expert-assignments");
    } else if (tab === "user-management") {
      navigate("/admin/users");
    } else if (tab === "system-settings") {
      navigate("/admin/system-settings");
    } else if (tab === "settings") {
      navigate("/settings");
    } else {
      navigate("/");
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar activeTab="" onTabChange={handleTabChange} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-6 space-y-6">
              <BreadcrumbNav activeTab="" />
              
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold">User Settings</h1>
                <p className="text-muted-foreground">
                  Manage your account settings, security, and preferences
                </p>
              </div>

              <Tabs defaultValue="account" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="account" className="flex items-center gap-2">
                    <SettingsIcon className="h-4 w-4" />
                    Account
                  </TabsTrigger>
                  <TabsTrigger value="roles" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Roles
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notifications
                  </TabsTrigger>
                </TabsList>


                <TabsContent value="account" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                      <CardDescription>
                        Manage your account settings and security
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>Email Address</Label>
                        <Input value={user?.email || ''} disabled />
                        <p className="text-xs text-muted-foreground">
                          Contact an administrator to change your email address
                        </p>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Security</h3>
                        <Button variant="outline">
                          Change Password
                        </Button>
                        <Button variant="outline">
                          Enable Two-Factor Authentication
                        </Button>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Account Status</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Account Status</p>
                            <p className="text-sm text-muted-foreground">
                              Your account is currently active
                            </p>
                          </div>
                          <div className="text-sm">
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="roles" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Roles & Permissions</CardTitle>
                          <CardDescription>
                            Manage your roles and request additional permissions
                          </CardDescription>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setIsRoleRequestDialogOpen(true)}
                        >
                          Request Role
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {userRoles.length > 0 ? (
                        <div className="space-y-3">
                          {userRoles.map((role) => (
                            <div key={role.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <div>
                                <p className="font-medium">
                                  {role.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Granted on {new Date(role.granted_at).toLocaleDateString()}
                                </p>
                              </div>
                              <span className="text-sm text-green-600">Active</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No additional roles assigned</p>
                          <Button
                            variant="outline"
                            className="mt-2"
                            onClick={() => setIsRoleRequestDialogOpen(true)}
                          >
                            Request a Role
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>


                <TabsContent value="notifications" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>
                        Configure how you receive notifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications via email
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Role Updates</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified about role changes
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Challenge Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Updates about challenges and opportunities
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>

      {/* Role Request Dialog */}
      <RoleRequestDialog
        open={isRoleRequestDialogOpen}
        onOpenChange={setIsRoleRequestDialogOpen}
        currentRoles={userRoles.map(role => role.role)}
        onRequestSubmitted={() => {
          fetchUserRoles();
        }}
      />
    </SidebarProvider>
  );
}