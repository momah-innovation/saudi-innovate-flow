import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/ui/page-header';
import { AdminDashboardHero } from '@/components/admin/AdminDashboardHero';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Database, 
  TrendingUp, 
  Shield,
  BarChart3,
  Settings,
  Activity,
  HardDrive,
  Plus,
  Download,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function AdminDashboard() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 1234,
    activeUsers: 156,
    storageUsed: 2.4,
    uptime: 98.5,
    activePolicies: 12,
    securityAlerts: 3,
    pendingUpdates: 5,
    systemHealth: "Healthy"
  });

  const adminCards = [
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: Users,
      href: "/admin/users",
      count: "1,234",
      label: "Active Users"
    },
    {
      title: "Storage Management", 
      description: "Monitor and manage file storage",
      icon: Database,
      href: "/admin/storage",
      count: "2.4 GB",
      label: "Storage Used"
    },
    {
      title: "Analytics",
      description: "View system analytics and reports", 
      icon: BarChart3,
      href: "/admin/analytics",
      count: "98.5%",
      label: "Uptime"
    },
    {
      title: "Storage Policies",
      description: "Configure storage access policies",
      icon: HardDrive, 
      href: "/admin/storage/policies",
      count: "12",
      label: "Active Policies"
    },
    {
      title: "System Settings",
      description: "Configure system-wide settings",
      icon: Settings,
      href: "/admin/settings", 
      count: "5",
      label: "Pending Updates"
    },
    {
      title: "Security Monitor",
      description: "Monitor security events and alerts",
      icon: Shield,
      href: "/admin/security",
      count: "3",
      label: "Recent Alerts"
    }
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load real data from Supabase
      const { count: userCount } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });
      
      if (userCount !== null) {
        setDashboardData(prev => ({
          ...prev,
          totalUsers: userCount
        }));
      }
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadDashboardData();
    toast({
      title: 'Refreshed',
      description: 'Dashboard data has been refreshed'
    });
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Admin Dashboard"
        description="System administration and management tools"
        actionButton={{
          label: "Refresh Data",
          icon: <RefreshCw className="w-4 h-4" />,
          onClick: refreshData
        }}
      />

      <div className="space-y-6">
        {/* Enhanced Hero Dashboard */}
        <AdminDashboardHero 
          totalUsers={dashboardData.totalUsers}
          activeUsers={dashboardData.activeUsers}
          storageUsed={dashboardData.storageUsed}
          uptime={dashboardData.uptime}
          activePolicies={dashboardData.activePolicies}
          securityAlerts={dashboardData.securityAlerts}
          pendingUpdates={dashboardData.pendingUpdates}
          systemHealth={dashboardData.systemHealth}
        />

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Card key={card.title} className="hover:shadow-lg transition-all duration-300 hover-scale cursor-pointer group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                        {card.title}
                      </CardTitle>
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{card.count}</div>
                      <p className="text-xs text-muted-foreground">
                        {card.label}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {card.description}
                      </p>
                      <Button variant="outline" size="sm" className="mt-3 w-full">
                        <Eye className="w-3 h-3 mr-2" />
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{dashboardData.totalUsers}</div>
                      <div className="text-sm text-muted-foreground">Total Users</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{dashboardData.activeUsers}</div>
                      <div className="text-sm text-muted-foreground">Active Users</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{dashboardData.totalUsers - dashboardData.activeUsers}</div>
                      <div className="text-sm text-muted-foreground">Inactive Users</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="storage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Storage Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{dashboardData.storageUsed} GB</div>
                      <div className="text-sm text-muted-foreground">Used Storage</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{dashboardData.activePolicies}</div>
                      <div className="text-sm text-muted-foreground">Active Policies</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">24</div>
                      <div className="text-sm text-muted-foreground">Storage Buckets</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{dashboardData.securityAlerts}</div>
                      <div className="text-sm text-muted-foreground">Security Alerts</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{dashboardData.uptime}%</div>
                      <div className="text-sm text-muted-foreground">System Uptime</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{dashboardData.pendingUpdates}</div>
                      <div className="text-sm text-muted-foreground">Pending Updates</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}