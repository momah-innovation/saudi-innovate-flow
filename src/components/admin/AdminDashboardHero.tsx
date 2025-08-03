import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from '@/hooks/useAppTranslation';
import { RTLAware, useRTLAwareClasses } from '@/components/ui/rtl-aware';
import { 
  Users, 
  Activity,
  Shield,
  Server,
  Database,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface AdminDashboardHeroProps {
  totalUsers: number;
  activeUsers: number;
  storageUsed: number;
  uptime: number;
  activePolicies: number;
  securityAlerts: number;
  pendingUpdates: number;
  systemHealth: string;
}

export function AdminDashboardHero({
  totalUsers,
  activeUsers,
  storageUsed,
  uptime,
  activePolicies,
  securityAlerts,
  pendingUpdates,
  systemHealth
}: AdminDashboardHeroProps) {
  const { t } = useTranslation();
  const { flexRow } = useRTLAwareClasses();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Users */}
      <Card className="gradient-border hover-scale">
        <CardHeader className={`flex ${flexRow} items-center justify-between space-y-0 pb-2`}>
          <CardTitle className="text-sm font-medium">{t('total_users')}</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {t('active_users_count', { count: activeUsers })}
          </p>
          <div className="mt-2">
            <Progress value={(activeUsers / totalUsers) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card className="gradient-border hover-scale">
        <CardHeader className={`flex ${flexRow} items-center justify-between space-y-0 pb-2`}>
          <CardTitle className="text-sm font-medium">{t('system_health')}</CardTitle>
          <Server className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 icon-success" />
            <div className="text-xl font-bold">{systemHealth}</div>
          </div>
          <p className="text-xs text-muted-foreground">
            {t('uptime_this_month', { uptime })}
          </p>
          <div className="mt-2">
            <Progress value={uptime} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Storage Usage */}
      <Card className="gradient-border hover-scale">
        <CardHeader className={`flex ${flexRow} items-center justify-between space-y-0 pb-2`}>
          <CardTitle className="text-sm font-medium">{t('storage_usage')}</CardTitle>
          <Database className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{storageUsed} GB</div>
          <p className="text-xs text-muted-foreground">
            {t('active_policies_count', { count: activePolicies })}
          </p>
          <div className="mt-2">
            <Progress value={25} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Security Status */}
      <Card className="gradient-border hover-scale">
        <CardHeader className={`flex ${flexRow} items-center justify-between space-y-0 pb-2`}>
          <CardTitle className="text-sm font-medium">{t('security_status')}</CardTitle>
          <Shield className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            {securityAlerts > 0 ? (
              <AlertTriangle className="h-5 w-5 icon-warning" />
            ) : (
              <CheckCircle className="h-5 w-5 icon-success" />
            )}
            <div className="text-xl font-bold">
              {securityAlerts > 0 ? t('alerts_count', { count: securityAlerts }) : t('secure')}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {t('pending_updates_count', { count: pendingUpdates })}
          </p>
          {securityAlerts > 0 && (
            <Badge variant="destructive" className="mt-2">
              {t('action_required')}
            </Badge>
          )}
        </CardContent>
      </Card>
    </div>
  );
}