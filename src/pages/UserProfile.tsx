import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Mail, Phone, Building, MapPin, Calendar, User, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { RoleRequestDialog } from "@/components/admin/RoleRequestDialog";
import { Header } from "@/components/layout/Header";
import { AppSidebar } from "@/components/layout/Sidebar";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ExpertProfileView } from "@/components/experts/ExpertProfileCard";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  name_ar?: string;
  phone?: string;
  department?: string;
  position?: string;
  bio?: string;
  status: string;
  created_at: string;
  profile_image_url?: string;
}

interface UserRole {
  id: string;
  role: string;
  is_active: boolean;
  granted_at: string;
  expires_at?: string;
}

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRoleRequestDialogOpen, setIsRoleRequestDialogOpen] = useState(false);

  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchUserRoles();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchUserRoles = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('granted_at', { ascending: false });

      if (error) throw error;
      setUserRoles(data || []);
    } catch (error) {
      console.error('Error fetching user roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'destructive';
      case 'admin': return 'default';
      case 'evaluator': return 'secondary';
      case 'domain_expert': return 'outline';
      case 'innovator': return 'outline';
      default: return 'outline';
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
    } else {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar activeTab="user-management" onTabChange={handleTabChange} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto">
              <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Loading profile...</p>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (!userProfile) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar activeTab="user-management" onTabChange={handleTabChange} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto">
              <div className="container mx-auto p-6">
                <div className="text-center">
                  <h1 className="text-2xl font-bold">User Not Found</h1>
                  <p className="text-muted-foreground mt-2">The requested user profile could not be found.</p>
                  <Button onClick={() => navigate(-1)} className="mt-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                  </Button>
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
        <AppSidebar activeTab="user-management" onTabChange={handleTabChange} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-6 space-y-6">
              <BreadcrumbNav activeTab="user-management" />
              
              {/* Header */}
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-3xl font-bold">User Profile</h1>
                  <p className="text-muted-foreground">
                    {isOwnProfile ? 'Your profile information' : `Profile for ${userProfile.name}`}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {/* Profile Overview */}
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader className="text-center">
                      <div className="flex justify-center mb-4">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={userProfile.profile_image_url} alt={userProfile.name} />
                          <AvatarFallback className="text-lg">
                            {getInitials(userProfile.name)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <CardTitle className="text-xl">{userProfile.name}</CardTitle>
                      {userProfile.name_ar && (
                        <p className="text-muted-foreground">{userProfile.name_ar}</p>
                      )}
                      <div className="flex justify-center">
                        <Badge variant={userProfile.status === 'active' ? 'default' : 'secondary'}>
                          {userProfile.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{userProfile.email}</span>
                      </div>
                      {userProfile.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{userProfile.phone}</span>
                        </div>
                      )}
                      {userProfile.department && (
                        <div className="flex items-center gap-2 text-sm">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span>{userProfile.department}</span>
                        </div>
                      )}
                      {userProfile.position && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{userProfile.position}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Joined {new Date(userProfile.created_at).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Profile Details */}
                <div className="md:col-span-2 space-y-6">
                  {/* Bio */}
                  {userProfile.bio && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          About
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{userProfile.bio}</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Roles */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Roles & Permissions
                        </CardTitle>
                        {isOwnProfile && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsRoleRequestDialogOpen(true)}
                          >
                            Request Role
                          </Button>
                        )}
                      </div>
                      <CardDescription>
                        Current active roles assigned to this user
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {userRoles.length > 0 ? (
                        <div className="space-y-3">
                          {userRoles.map((role) => (
                            <div key={role.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Badge variant={getRoleColor(role.role)}>
                                  {role.role.replace('_', ' ')}
                                </Badge>
                                <div>
                                  <p className="text-sm font-medium">
                                    {role.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Granted on {new Date(role.granted_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              {role.expires_at && (
                                <div className="text-right">
                                  <p className="text-xs text-muted-foreground">
                                    Expires: {new Date(role.expires_at).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No additional roles assigned</p>
                          {isOwnProfile && (
                            <Button
                              variant="outline"
                              className="mt-2"
                              onClick={() => setIsRoleRequestDialogOpen(true)}
                            >
                              Request a Role
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Expert Profile Section - Show if user has domain_expert role */}
                  {userRoles.some(role => role.role === 'domain_expert') && (
                    <ExpertProfileView userId={userId!} />
                  )}

                  {/* Actions */}
                  {isOwnProfile && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Actions</CardTitle>
                        <CardDescription>
                          Manage your account and preferences
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline"
                            onClick={() => navigate('/settings')}
                          >
                            Edit Profile
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => navigate('/settings')}
                          >
                            Account Settings
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Role Request Dialog */}
      {isOwnProfile && (
        <RoleRequestDialog
          open={isRoleRequestDialogOpen}
          onOpenChange={setIsRoleRequestDialogOpen}
          currentRoles={userRoles.map(role => role.role)}
          onRequestSubmitted={() => {
            fetchUserRoles();
          }}
        />
      )}
    </SidebarProvider>
  );
}