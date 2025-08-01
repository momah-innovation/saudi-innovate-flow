import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/ui/page-header';
import { 
  Users, 
  Database, 
  TrendingUp, 
  Shield,
  BarChart3,
  Settings,
  Activity,
  HardDrive
} from 'lucide-react';

export default function AdminDashboard() {
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

  return (
    <PageContainer>
      <PageHeader
        title="Admin Dashboard"
        description="System administration and management tools"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.count}</div>
                <p className="text-xs text-muted-foreground">
                  {card.label}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* System Status */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">Online</div>
              <p className="text-sm text-muted-foreground">Database</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">Healthy</div>
              <p className="text-sm text-muted-foreground">Storage</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">Active</div>
              <p className="text-sm text-muted-foreground">API</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">Monitoring</div>
              <p className="text-sm text-muted-foreground">Security</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}