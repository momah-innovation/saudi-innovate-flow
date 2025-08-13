import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  Star,
  Award,
  Building,
  Brain,
  Shield,
  Target
} from 'lucide-react';
import { AdminDashboardMetrics } from '@/hooks/useAdminDashboardMetrics';

interface AdminUserBreakdownProps {
  metrics: AdminDashboardMetrics | null;
  language: string;
  isLoading: boolean;
}

export function AdminUserBreakdown({ metrics, language, isLoading }: AdminUserBreakdownProps) {
  const userRoles = [
    {
      key: 'admins',
      label: language === 'ar' ? 'المشرفون' : 'Admins',
      icon: Shield,
      color: 'text-red-600 bg-red-100',
      count: metrics?.users?.breakdown?.admins || 0
    },
    {
      key: 'innovators',
      label: language === 'ar' ? 'المبتكرون' : 'Innovators',
      icon: Brain,
      color: 'text-purple-600 bg-purple-100',
      count: metrics?.users?.breakdown?.innovators || 0
    },
    {
      key: 'experts',
      label: language === 'ar' ? 'الخبراء' : 'Experts',
      icon: Star,
      color: 'text-yellow-600 bg-yellow-100',
      count: metrics?.users?.breakdown?.experts || 0
    },
    {
      key: 'partners',
      label: language === 'ar' ? 'الشركاء' : 'Partners',
      icon: Building,
      color: 'text-blue-600 bg-blue-100',
      count: metrics?.users?.breakdown?.partners || 0
    },
    {
      key: 'evaluators',
      label: language === 'ar' ? 'المقيمون' : 'Evaluators',
      icon: Award,
      color: 'text-green-600 bg-green-100',
      count: metrics?.users?.breakdown?.evaluators || 0
    },
    {
      key: 'domainExperts',
      label: language === 'ar' ? 'خبراء المجال' : 'Domain Experts',
      icon: Target,
      color: 'text-orange-600 bg-orange-100',
      count: metrics?.users?.breakdown?.domainExperts || 0
    },
    {
      key: 'teamMembers',
      label: language === 'ar' ? 'أعضاء الفريق' : 'Team Members',
      icon: UserCheck,
      color: 'text-indigo-600 bg-indigo-100',
      count: metrics?.users?.breakdown?.teamMembers || 0
    }
  ];

  const totalUsers = metrics?.users?.total || 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-32"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-32"></div>
          </CardHeader>
          <CardContent>
            <div className="h-40 bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* User Role Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {language === 'ar' ? 'توزيع المستخدمين حسب الدور' : 'User Distribution by Role'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {userRoles.map((role) => {
            const percentage = totalUsers > 0 ? (role.count / totalUsers) * 100 : 0;
            const IconComponent = role.icon;
            
            return (
              <div key={role.key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${role.color}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{role.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {role.count} {language === 'ar' ? 'مستخدم' : 'users'} ({percentage.toFixed(1)}%)
                    </div>
                  </div>
                </div>
                <Badge variant="outline">{role.count}</Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* User Growth & Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            {language === 'ar' ? 'نمو المستخدمين والنشاط' : 'User Growth & Activity'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Growth Metrics */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{language === 'ar' ? 'معدل النمو الشهري' : 'Monthly Growth Rate'}</span>
                <span className="font-bold text-green-600">+{metrics?.users?.growthRate || 0}%</span>
              </div>
              <Progress value={Math.abs(metrics?.users?.growthRate || 0)} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{metrics?.users?.newUsers7d || 0}</div>
                <div className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'مستخدمون جدد (7 أيام)' : 'New Users (7d)'}
                </div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{metrics?.users?.newUsers30d || 0}</div>
                <div className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'مستخدمون جدد (30 يوم)' : 'New Users (30d)'}
                </div>
              </div>
            </div>
          </div>

          {/* Activity Status */}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                {language === 'ar' ? 'المستخدمون النشطون' : 'Active Users'}
              </span>
              <Badge variant={metrics?.users?.active > (totalUsers * 0.7) ? 'default' : 'secondary'}>
                {((metrics?.users?.active || 0) / totalUsers * 100).toFixed(1)}%
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              {metrics?.users?.active || 0} {language === 'ar' ? 'من أصل' : 'out of'} {totalUsers} {language === 'ar' ? 'مستخدم إجمالي' : 'total users'}
            </div>
            <Progress 
              value={((metrics?.users?.active || 0) / totalUsers) * 100} 
              className="mt-2 h-2" 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}