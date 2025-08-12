import React from 'react';
import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper';
import { AdminBreadcrumb } from '@/components/layout/AdminBreadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Eye, Activity } from 'lucide-react';
import SecurityMetricsGrid from '@/components/admin/security/SecurityMetricsGrid';
import ThreatDetectionChart from '@/components/admin/security/ThreatDetectionChart';
import SuspiciousActivityTable from '@/components/admin/security/SuspiciousActivityTable';
import SecurityAlertsPanel from '@/components/admin/security/SecurityAlertsPanel';
import RateLimitMonitor from '@/components/admin/security/RateLimitMonitor';

const SecurityAdvanced: React.FC = () => {
  return (
    <AdminPageWrapper
      title="الأمان المتقدم"
      description="مراقبة شاملة للأمان والتهديدات"
    >
      <AdminBreadcrumb />
      <div className="space-y-6">
        {/* Security Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              حالة الأمان
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge variant="default" className="bg-success/10 text-success border-success/20">
                النظام آمن
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                مراقبة نشطة
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="w-4 h-4" />
                آخر فحص: منذ دقيقة
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