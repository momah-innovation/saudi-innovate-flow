import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Globe } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { AppSidebar } from "@/components/layout/Sidebar";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

export default function SystemSettings() {
  const navigate = useNavigate();

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
        <AppSidebar activeTab="system-settings" onTabChange={handleTabChange} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-6 space-y-6">
              <BreadcrumbNav activeTab="system-settings" />
              
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Globe className="h-8 w-8" />
                  System Settings
                </h1>
                <p className="text-muted-foreground">
                  Configure system-wide settings and defaults for the entire platform
                </p>
              </div>

              {/* Team Management Defaults */}
              <Card>
                <CardHeader>
                  <CardTitle>Team Management Defaults</CardTitle>
                  <CardDescription>
                    Configure default settings for team management
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Default Max Concurrent Projects</Label>
                      <Input
                        type="number"
                        defaultValue="5"
                        min="1"
                        max="20"
                        placeholder="5"
                      />
                      <p className="text-xs text-muted-foreground">
                        Default capacity for new team members
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Default Performance Rating</Label>
                      <Input
                        type="number"
                        defaultValue="0"
                        min="0"
                        max="5"
                        step="0.1"
                        placeholder="0"
                      />
                      <p className="text-xs text-muted-foreground">
                        Starting performance rating for new members
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Challenge Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Challenge Management</CardTitle>
                  <CardDescription>
                    System-wide challenge settings and defaults
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Default Challenge Duration (days)</Label>
                      <Input
                        type="number"
                        defaultValue="30"
                        min="1"
                        max="365"
                        placeholder="30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Default Submission Limit</Label>
                      <Input
                        type="number"
                        defaultValue="5"
                        min="1"
                        max="50"
                        placeholder="5"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-approve Ideas</p>
                      <p className="text-sm text-muted-foreground">
                        Automatically approve submitted ideas
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Configure system-wide notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Send email notifications for important events
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Role Request Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Notify admins of new role requests
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Challenge Deadline Reminders</p>
                      <p className="text-sm text-muted-foreground">
                        Send reminders before challenge deadlines
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              {/* System Information */}
              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                  <CardDescription>
                    Current system configuration and limits
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Max File Upload Size</Label>
                      <p className="text-2xl font-bold">5MB</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Session Timeout</Label>
                      <p className="text-2xl font-bold">24h</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">API Rate Limit</Label>
                      <p className="text-2xl font-bold">1000/hr</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button>
                  Save System Settings
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}