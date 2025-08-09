import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Shield, Users, Activity, Database, Settings, BarChart3 } from 'lucide-react';

export default function AdminWorkspace() {
  const { t } = useUnifiedTranslation();
  const [activeView, setActiveView] = useState('overview');

  return (
    <AppShell>
      <PageLayout 
        title={t('adminWorkspace') || 'Admin Workspace'}
        description={t('manageSystemAdministration') || 'Manage system administration and platform oversight'}
        primaryAction={{
          label: t('systemSettings') || 'System Settings',
          onClick: () => console.log('System settings'),
          icon: <Settings className="w-4 h-4" />
        }}
        maxWidth="full"
      >
        <div className="space-y-6">
          {/* Admin Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 border rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">{t('totalUsers') || 'Total Users'}</h3>
              </div>
              <div className="text-2xl font-bold text-primary">1,247</div>
              <p className="text-sm text-muted-foreground">
                {t('registeredPlatformUsers') || 'Registered platform users'}
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Activity className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">{t('systemHealth') || 'System Health'}</h3>
              </div>
              <div className="text-2xl font-bold text-green-600">98.7%</div>
              <p className="text-sm text-muted-foreground">
                {t('uptimeThisMonth') || 'Uptime this month'}
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Database className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">{t('dataStorage') || 'Data Storage'}</h3>
              </div>
              <div className="text-2xl font-bold text-blue-600">67%</div>
              <p className="text-sm text-muted-foreground">
                {t('storageUtilization') || 'Storage utilization'}
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">{t('securityAlerts') || 'Security Alerts'}</h3>
              </div>
              <div className="text-2xl font-bold text-orange-600">2</div>
              <p className="text-sm text-muted-foreground">
                {t('pendingSecurityReviews') || 'Pending security reviews'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">{t('recentActivity') || 'Recent Activity'}</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <Users className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{t('newUserRegistration') || 'New user registration'}</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <Shield className="w-4 h-4 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium">{t('securityAlert') || 'Security alert triggered'}</p>
                    <p className="text-xs text-muted-foreground">15 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">{t('systemMetrics') || 'System Metrics'}</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('activeUsers') || 'Active Users (24h)'}</span>
                  <span className="font-medium">342</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('apiRequests') || 'API Requests'}</span>
                  <span className="font-medium">12.4K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('avgResponseTime') || 'Avg Response Time'}</span>
                  <span className="font-medium">124ms</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">{t('platformOverview') || 'Platform Overview'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">89</div>
                <p className="text-sm text-muted-foreground">{t('activeChallenges') || 'Active challenges'}</p>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">156</div>
                <p className="text-sm text-muted-foreground">{t('expertEvaluators') || 'Expert evaluators'}</p>
              </div>
              <div className="text-center">
                <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">2.3K</div>
                <p className="text-sm text-muted-foreground">{t('ideasSubmitted') || 'Ideas submitted'}</p>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </AppShell>
  );
}