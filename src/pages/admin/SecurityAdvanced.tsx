import React from 'react';
import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper';
import { AdminBreadcrumb } from '@/components/layout/AdminBreadcrumb';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Eye, Activity } from 'lucide-react';
import SecurityMetricsGrid from '@/components/admin/security/SecurityMetricsGrid';
import ThreatDetectionChart from '@/components/admin/security/ThreatDetectionChart';
import SuspiciousActivityTable from '@/components/admin/security/SuspiciousActivityTable';
import SecurityAlertsPanel from '@/components/admin/security/SecurityAlertsPanel';
import RateLimitMonitor from '@/components/admin/security/RateLimitMonitor';

const SecurityAdvanced: React.FC = () => {
  const { t, language } = useUnifiedTranslation();
  return (
    <AdminPageWrapper
      title={language === 'ar' ? 'الأمان المتقدم' : 'Security Advanced'}
      description={language === 'ar' ? 'مراقبة شاملة للأمان والتهديدات' : 'Comprehensive security monitoring and threat detection'}
    >
      <AdminBreadcrumb />
      <div className="space-y-6">
        {/* Security Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {language === 'ar' ? 'حالة الأمان' : 'Security Status'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge variant="default" className="bg-success/10 text-success border-success/20">
                {language === 'ar' ? 'النظام آمن' : 'System Secure'}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                {language === 'ar' ? 'مراقبة نشطة' : 'Active Monitoring'}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="w-4 h-4" />
                {language === 'ar' ? 'آخر فحص: منذ دقيقة' : 'Last check: 1 minute ago'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Metrics Grid */}
        <SecurityMetricsGrid />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Threat Detection Chart */}
          <ThreatDetectionChart />
          
          {/* Security Alerts Panel */}
          <SecurityAlertsPanel />
        </div>

        {/* Rate Limit Monitor */}
        <RateLimitMonitor />

        {/* Suspicious Activity Table */}
        <SuspiciousActivityTable />
      </div>
    </AdminPageWrapper>
  );
};

export default SecurityAdvanced;