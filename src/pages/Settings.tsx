import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings as SettingsIcon, Shield, Bell, Palette, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { RoleRequestDialog } from "@/components/admin/RoleRequestDialog";
import { Header } from "@/components/layout/Header";
import { AppSidebar } from "@/components/layout/Sidebar";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useNavigate, useSearchParams } from "react-router-dom";

interface ProfileForm {
  name: string;
  name_ar: string;
  phone: string;
  department: string;
  position: string;
  bio: string;
  preferred_language: string;
}

interface UserRole {
  id: string;
  role: string;
  is_active: boolean;
  granted_at: string;
}

export default function Settings() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, userProfile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    name: '',
    name_ar: '',
    phone: '',
    department: '',
    position: '',
    bio: '',
    preferred_language: 'en'
  });
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRoleRequestDialogOpen, setIsRoleRequestDialogOpen] = useState(false);
  
  // Check if user is admin
  const isAdmin = userRoles.some(role => 
    ['admin', 'super_admin'].includes(role.role) && role.is_active
  );

  // Get initial tab from URL params
  const tabFromUrl = searchParams.get('tab');
  const defaultTab = (tabFromUrl === 'system' && isAdmin) ? 'system' : 'profile';

  useEffect(() => {
    if (userProfile) {
      setProfileForm({
        name: userProfile.name || '',
        name_ar: userProfile.name_ar || '',
        phone: userProfile.phone || '',
        department: userProfile.department || '',
        position: userProfile.position || '',
        bio: userProfile.bio || '',
        preferred_language: userProfile.preferred_language || 'en'
      });
    }
    fetchUserRoles();
  }, [userProfile]);

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

  const handleUpdateProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileForm)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });

      await refreshProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
      navigate("/settings?tab=system");
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
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">
                  Manage your account settings and preferences
                </p>
              </div>

              <Tabs defaultValue={defaultTab} className="space-y-6">
                <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-5' : 'grid-cols-4'}`}>
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="account" className="flex items-center gap-2">
                    <SettingsIcon className="h-4 w-4" />
                    Account
                  </TabsTrigger>
                  <TabsTrigger value="roles" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Roles
                  </TabsTrigger>
                  {isAdmin && (
                    <TabsTrigger value="system" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      System
                    </TabsTrigger>
                  )}
                  <TabsTrigger value="preferences" className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Preferences
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>
                        Update your personal information and contact details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Avatar Section */}
                      <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={userProfile?.profile_image_url} alt={profileForm.name} />
                          <AvatarFallback className="text-lg">
                            {getInitials(profileForm.name || 'User')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Button variant="outline" size="sm">
                            Change Avatar
                          </Button>
                          <p className="text-xs text-muted-foreground mt-1">
                            JPG, PNG or GIF (max. 2MB)
                          </p>
                        </div>
                      </div>

                      <Separator />

                      {/* Personal Information */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name_ar">Name (Arabic)</Label>
                          <Input
                            id="name_ar"
                            value={profileForm.name_ar}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, name_ar: e.target.value }))}
                            placeholder="اسمك باللغة العربية"
                            dir="rtl"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+966 50 123 4567"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Input
                            id="department"
                            value={profileForm.department}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, department: e.target.value }))}
                            placeholder="Your department"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="position">Position/Title</Label>
                        <Input
                          id="position"
                          value={profileForm.position}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, position: e.target.value }))}
                          placeholder="Your job title or position"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profileForm.bio}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Tell us about yourself..."
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button onClick={handleUpdateProfile} disabled={loading}>
                          {loading ? 'Updating...' : 'Update Profile'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

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

                {isAdmin && (
                  <TabsContent value="system" className="space-y-6">
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
                </TabsContent>
                )}

                <TabsContent value="preferences" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Language & Region</CardTitle>
                      <CardDescription>
                        Set your language and regional preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Preferred Language</Label>
                        <Select 
                          value={profileForm.preferred_language} 
                          onValueChange={(value) => setProfileForm(prev => ({ ...prev, preferred_language: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="ar">العربية</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Notifications</CardTitle>
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