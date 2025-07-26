import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Globe, RotateCcw } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { AppSidebar } from "@/components/layout/Sidebar";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function SystemSettings() {
  const navigate = useNavigate();
  
  // Default values for system settings
  const defaultValues = {
    // Team Management Defaults
    maxConcurrentProjects: 5,
    defaultPerformanceRating: 0,
    maxExpertWorkload: 5,
    
    // Challenge Management
    challengeDuration: 30,
    submissionLimit: 5,
    autoApproveIdeas: false,
    
    // Role Request Limits
    roleRejectionWaitDays: 30,
    maxRoleRequestsPerWeek: 3,
    
    // Notification Settings
    emailNotifications: true,
    roleRequestNotifications: true,
    challengeDeadlineReminders: true,
    notificationFetchLimit: 50,
    toastTimeoutMs: 1000000,
    
    // UI Settings
    sidebarCookieMaxAgeDays: 7,
  };

  // State for form values
  const [values, setValues] = useState(defaultValues);
  const [loading, setLoading] = useState(true);

  // Load settings from database on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_key, setting_value');

      if (error) throw error;

      if (data) {
        const settingsMap: Record<string, any> = {};
        data.forEach((setting) => {
          const value = typeof setting.setting_value === 'string' 
            ? JSON.parse(setting.setting_value) 
            : setting.setting_value;
          
          switch (setting.setting_key) {
            case 'team_max_concurrent_projects':
              settingsMap.maxConcurrentProjects = parseInt(value);
              break;
            case 'team_default_performance_rating':
              settingsMap.defaultPerformanceRating = parseFloat(value);
              break;
            case 'team_max_expert_workload':
              settingsMap.maxExpertWorkload = parseInt(value);
              break;
            case 'challenge_default_duration_days':
              settingsMap.challengeDuration = parseInt(value);
              break;
            case 'challenge_default_submission_limit':
              settingsMap.submissionLimit = parseInt(value);
              break;
            case 'challenge_auto_approve_ideas':
              settingsMap.autoApproveIdeas = value === 'true' || value === true;
              break;
            case 'notification_email_enabled':
              settingsMap.emailNotifications = value === 'true' || value === true;
              break;
            case 'notification_role_requests_enabled':
              settingsMap.roleRequestNotifications = value === 'true' || value === true;
              break;
            case 'notification_challenge_deadlines_enabled':
              settingsMap.challengeDeadlineReminders = value === 'true' || value === true;
              break;
            case 'role_rejection_wait_days':
              settingsMap.roleRejectionWaitDays = parseInt(value);
              break;
            case 'role_max_requests_per_week':
              settingsMap.maxRoleRequestsPerWeek = parseInt(value);
              break;
            case 'notification_fetch_limit':
              settingsMap.notificationFetchLimit = parseInt(value);
              break;
            case 'notification_toast_timeout_ms':
              settingsMap.toastTimeoutMs = parseInt(value);
              break;
            case 'ui_sidebar_cookie_max_age_days':
              settingsMap.sidebarCookieMaxAgeDays = parseInt(value);
              break;
          }
        });

        setValues(prev => ({ ...prev, ...settingsMap }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load system settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (settingsToSave: Array<{key: string, value: any}>) => {
    try {
      for (const setting of settingsToSave) {
        const { error } = await supabase
          .from('system_settings')
          .update({ 
            setting_value: JSON.stringify(setting.value),
            updated_by: (await supabase.auth.getUser()).data.user?.id 
          })
          .eq('setting_key', setting.key);

        if (error) throw error;
      }
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
      return false;
    }
  };

  const handleReset = async (field: keyof typeof defaultValues) => {
    const originalValue = defaultValues[field];
    setValues(prev => ({
      ...prev,
      [field]: originalValue
    }));

    // Also reset in database
    const settingKey = getSettingKey(field);
    if (settingKey) {
      await saveSettings([{ key: settingKey, value: originalValue }]);
      toast.success('Setting reset to default value');
    }
  };

  const getSettingKey = (field: keyof typeof defaultValues): string | null => {
    const keyMap = {
      maxConcurrentProjects: 'team_max_concurrent_projects',
      defaultPerformanceRating: 'team_default_performance_rating',
      maxExpertWorkload: 'team_max_expert_workload',
      challengeDuration: 'challenge_default_duration_days',
      submissionLimit: 'challenge_default_submission_limit',
      autoApproveIdeas: 'challenge_auto_approve_ideas',
      roleRejectionWaitDays: 'role_rejection_wait_days',
      maxRoleRequestsPerWeek: 'role_max_requests_per_week',
      emailNotifications: 'notification_email_enabled',
      roleRequestNotifications: 'notification_role_requests_enabled',
      challengeDeadlineReminders: 'notification_challenge_deadlines_enabled',
      notificationFetchLimit: 'notification_fetch_limit',
      toastTimeoutMs: 'notification_toast_timeout_ms',
      sidebarCookieMaxAgeDays: 'ui_sidebar_cookie_max_age_days',
    };
    return keyMap[field] || null;
  };

  const handleSaveTeamDefaults = async () => {
    const settingsToSave = [
      { key: 'team_max_concurrent_projects', value: values.maxConcurrentProjects },
      { key: 'team_default_performance_rating', value: values.defaultPerformanceRating },
      { key: 'team_max_expert_workload', value: values.maxExpertWorkload }
    ];

    const success = await saveSettings(settingsToSave);
    if (success) {
      toast.success("Team management defaults have been updated successfully.");
    }
  };

  const handleSaveChallengeSettings = async () => {
    const settingsToSave = [
      { key: 'challenge_default_duration_days', value: values.challengeDuration },
      { key: 'challenge_default_submission_limit', value: values.submissionLimit },
      { key: 'challenge_auto_approve_ideas', value: values.autoApproveIdeas }
    ];

    const success = await saveSettings(settingsToSave);
    if (success) {
      toast.success("Challenge management settings have been updated successfully.");
    }
  };

  const handleSaveRoleRequestSettings = async () => {
    const settingsToSave = [
      { key: 'role_rejection_wait_days', value: values.roleRejectionWaitDays },
      { key: 'role_max_requests_per_week', value: values.maxRoleRequestsPerWeek }
    ];

    const success = await saveSettings(settingsToSave);
    if (success) {
      toast.success("Role request settings have been updated successfully.");
    }
  };

  const handleSaveNotificationSettings = async () => {
    const settingsToSave = [
      { key: 'notification_email_enabled', value: values.emailNotifications },
      { key: 'notification_role_requests_enabled', value: values.roleRequestNotifications },
      { key: 'notification_challenge_deadlines_enabled', value: values.challengeDeadlineReminders },
      { key: 'notification_fetch_limit', value: values.notificationFetchLimit },
      { key: 'notification_toast_timeout_ms', value: values.toastTimeoutMs }
    ];

    const success = await saveSettings(settingsToSave);
    if (success) {
      toast.success("Notification settings have been updated successfully.");
    }
  };

  const handleSaveUISettings = async () => {
    const settingsToSave = [
      { key: 'ui_sidebar_cookie_max_age_days', value: values.sidebarCookieMaxAgeDays }
    ];

    const success = await saveSettings(settingsToSave);
    if (success) {
      toast.success("UI settings have been updated successfully.");
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

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar activeTab="system-settings" onTabChange={handleTabChange} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto">
              <div className="container mx-auto p-6 space-y-6">
                <BreadcrumbNav activeTab="system-settings" />
                <div className="flex items-center justify-center h-64">
                  <div className="text-muted-foreground">Loading system settings...</div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

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
                      <div className="flex items-center justify-between">
                        <Label>Default Max Concurrent Projects</Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleReset('maxConcurrentProjects')}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        type="number"
                        value={values.maxConcurrentProjects}
                        onChange={(e) => setValues(prev => ({ ...prev, maxConcurrentProjects: parseInt(e.target.value) || 0 }))}
                        min="1"
                        max="20"
                        placeholder="5"
                      />
                      <p className="text-xs text-muted-foreground">
                        Default capacity for new team members
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Default Performance Rating</Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleReset('defaultPerformanceRating')}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        type="number"
                        value={values.defaultPerformanceRating}
                        onChange={(e) => setValues(prev => ({ ...prev, defaultPerformanceRating: parseFloat(e.target.value) || 0 }))}
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
                   <div className="grid gap-4 md:grid-cols-1">
                     <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <Label>Max Expert Workload</Label>
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           className="h-8 w-8 p-0"
                           onClick={() => handleReset('maxExpertWorkload')}
                         >
                           <RotateCcw className="h-4 w-4" />
                         </Button>
                       </div>
                       <Input
                         type="number"
                         value={values.maxExpertWorkload}
                         onChange={(e) => setValues(prev => ({ ...prev, maxExpertWorkload: parseInt(e.target.value) || 0 }))}
                         min="1"
                         max="20"
                         placeholder="5"
                       />
                       <p className="text-xs text-muted-foreground">
                         Maximum concurrent challenges an expert can handle
                       </p>
                     </div>
                   </div>
                   <div className="flex justify-end pt-4 border-t">
                     <Button size="sm" onClick={handleSaveTeamDefaults}>
                       Save Team Defaults
                     </Button>
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
                      <div className="flex items-center justify-between">
                        <Label>Default Challenge Duration (days)</Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleReset('challengeDuration')}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        type="number"
                        value={values.challengeDuration}
                        onChange={(e) => setValues(prev => ({ ...prev, challengeDuration: parseInt(e.target.value) || 0 }))}
                        min="1"
                        max="365"
                        placeholder="30"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Default Submission Limit</Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleReset('submissionLimit')}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        type="number"
                        value={values.submissionLimit}
                        onChange={(e) => setValues(prev => ({ ...prev, submissionLimit: parseInt(e.target.value) || 0 }))}
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
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={values.autoApproveIdeas}
                        onCheckedChange={(checked) => setValues(prev => ({ ...prev, autoApproveIdeas: checked }))}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleReset('autoApproveIdeas')}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4 border-t">
                    <Button size="sm" onClick={handleSaveChallengeSettings}>
                      Save Challenge Settings
                    </Button>
                  </div>
                </CardContent>
               </Card>

              {/* Role Request Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Role Request Limits</CardTitle>
                  <CardDescription>
                    Configure limits and policies for role requests
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Rejection Wait Period (days)</Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleReset('roleRejectionWaitDays')}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        type="number"
                        value={values.roleRejectionWaitDays}
                        onChange={(e) => setValues(prev => ({ ...prev, roleRejectionWaitDays: parseInt(e.target.value) || 0 }))}
                        min="1"
                        max="365"
                        placeholder="30"
                      />
                      <p className="text-xs text-muted-foreground">
                        Days to wait after rejection before re-requesting same role
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Max Requests Per Week</Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleReset('maxRoleRequestsPerWeek')}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        type="number"
                        value={values.maxRoleRequestsPerWeek}
                        onChange={(e) => setValues(prev => ({ ...prev, maxRoleRequestsPerWeek: parseInt(e.target.value) || 0 }))}
                        min="1"
                        max="10"
                        placeholder="3"
                      />
                      <p className="text-xs text-muted-foreground">
                        Maximum role requests a user can make per week
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4 border-t">
                    <Button size="sm" onClick={handleSaveRoleRequestSettings}>
                      Save Role Request Settings
                    </Button>
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
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={values.emailNotifications}
                        onCheckedChange={(checked) => setValues(prev => ({ ...prev, emailNotifications: checked }))}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleReset('emailNotifications')}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Role Request Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Notify admins of new role requests
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={values.roleRequestNotifications}
                        onCheckedChange={(checked) => setValues(prev => ({ ...prev, roleRequestNotifications: checked }))}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleReset('roleRequestNotifications')}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Challenge Deadline Reminders</p>
                      <p className="text-sm text-muted-foreground">
                        Send reminders before challenge deadlines
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={values.challengeDeadlineReminders}
                        onCheckedChange={(checked) => setValues(prev => ({ ...prev, challengeDeadlineReminders: checked }))}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleReset('challengeDeadlineReminders')}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                     </div>
                   </div>
                   <div className="grid gap-4 md:grid-cols-2">
                     <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <Label>Notification Fetch Limit</Label>
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           className="h-8 w-8 p-0"
                           onClick={() => handleReset('notificationFetchLimit')}
                         >
                           <RotateCcw className="h-4 w-4" />
                         </Button>
                       </div>
                       <Input
                         type="number"
                         value={values.notificationFetchLimit}
                         onChange={(e) => setValues(prev => ({ ...prev, notificationFetchLimit: parseInt(e.target.value) || 0 }))}
                         min="10"
                         max="200"
                         placeholder="50"
                       />
                       <p className="text-xs text-muted-foreground">
                         Maximum notifications to fetch per request
                       </p>
                     </div>
                     <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <Label>Toast Timeout (ms)</Label>
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           className="h-8 w-8 p-0"
                           onClick={() => handleReset('toastTimeoutMs')}
                         >
                           <RotateCcw className="h-4 w-4" />
                         </Button>
                       </div>
                       <Input
                         type="number"
                         value={values.toastTimeoutMs}
                         onChange={(e) => setValues(prev => ({ ...prev, toastTimeoutMs: parseInt(e.target.value) || 0 }))}
                         min="1000"
                         max="10000000"
                         placeholder="1000000"
                       />
                       <p className="text-xs text-muted-foreground">
                         How long toast notifications stay visible
                       </p>
                     </div>
                   </div>
                   <div className="flex justify-end pt-4 border-t">
                     <Button size="sm" onClick={handleSaveNotificationSettings}>
                       Save Notification Settings
                     </Button>
                   </div>
                 </CardContent>
               </Card>

               {/* UI Settings */}
               <Card>
                 <CardHeader>
                   <CardTitle>UI Settings</CardTitle>
                   <CardDescription>
                     Configure user interface behavior and defaults
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="grid gap-4 md:grid-cols-1">
                     <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <Label>Sidebar Cookie Max Age (days)</Label>
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           className="h-8 w-8 p-0"
                           onClick={() => handleReset('sidebarCookieMaxAgeDays')}
                         >
                           <RotateCcw className="h-4 w-4" />
                         </Button>
                       </div>
                       <Input
                         type="number"
                         value={values.sidebarCookieMaxAgeDays}
                         onChange={(e) => setValues(prev => ({ ...prev, sidebarCookieMaxAgeDays: parseInt(e.target.value) || 0 }))}
                         min="1"
                         max="365"
                         placeholder="7"
                       />
                       <p className="text-xs text-muted-foreground">
                         How long to remember sidebar state
                       </p>
                     </div>
                   </div>
                   <div className="flex justify-end pt-4 border-t">
                     <Button size="sm" onClick={handleSaveUISettings}>
                       Save UI Settings
                     </Button>
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
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}