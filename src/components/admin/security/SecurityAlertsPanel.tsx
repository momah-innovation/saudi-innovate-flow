import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { debugLog } from '@/utils/debugLogger';
import { 
  AlertTriangle, 
  Bell, 
  Shield, 
  Clock,
  CheckCircle
} from 'lucide-react';

interface SecurityAlert {
  id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  status: 'active' | 'resolved' | 'investigating';
}

interface SecurityAlertsPanelProps {
  className?: string;
}

const SecurityAlertsPanel: React.FC<SecurityAlertsPanelProps> = ({ className }) => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSecurityAlerts();
  }, []);

  const fetchSecurityAlerts = async () => {
    try {
      setLoading(true);
      
      // Fetch from security_audit_log table for recent security events
      const { data, error } = await supabase
        .from('security_audit_log')
        .select('*')
        .eq('risk_level', 'high')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        debugLog.error('Error fetching security alerts:', { component: 'SecurityAlertsPanel' }, error);
        setAlerts([]);
        return;
      }

      // Transform data to security alerts format
      const transformedAlerts = (data || []).map(item => ({
        id: item.id,
        title: getAlertTitle(item.action_type),
        message: getAlertMessage(item.action_type, item.details),
        severity: mapRiskToSeverity(item.risk_level),
        timestamp: new Date(item.created_at),
        status: 'active' as const
      }));

      setAlerts(transformedAlerts);
    } catch (error) {
      debugLog.error('Error in fetchSecurityAlerts:', { component: 'SecurityAlertsPanel' }, error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const getAlertTitle = (actionType: string): string => {
    switch (actionType) {
      case 'ROLE_ASSIGNMENT_DENIED':
        return 'محاولة تصعيد صلاحيات غير مصرح';
      case 'SUSPICIOUS_ACTIVITY_DETECTED':
        return 'نشاط مشبوه مكتشف';
      case 'BULK_CLEANUP_EXECUTED':
        return 'عملية حذف جماعي للملفات';
      case 'MIGRATION_EXECUTED':
        return 'تنفيذ عملية ترحيل قاعدة البيانات';
      default:
        return 'حدث أمني';
    }
  };

  const getAlertMessage = (actionType: string, details: any): string => {
    switch (actionType) {
      case 'ROLE_ASSIGNMENT_DENIED':
        return `محاولة منح دور ${details?.target_role || 'غير محدد'} بدون صلاحيات كافية`;
      case 'SUSPICIOUS_ACTIVITY_DETECTED':
        return details?.description || 'تم اكتشاف نشاط مشبوه في النظام';
      case 'BULK_CLEANUP_EXECUTED':
        return `تم حذف ${details?.file_count || 0} ملف من النظام`;
      default:
        return 'حدث أمني يتطلب المراجعة';
    }
  };

  const mapRiskToSeverity = (riskLevel: string): 'low' | 'medium' | 'high' | 'critical' => {
    switch (riskLevel) {
      case 'critical':
        return 'critical';
      case 'high':
        return 'high';
      case 'medium':
        return 'medium';
      default:
        return 'low';
    }
  };

  const getSeverityLabel = (severity: string): string => {
    switch (severity) {
      case 'critical':
        return 'حرج';
      case 'high':
        return 'عالي';
      case 'medium':
        return 'متوسط';
      case 'low':
        return 'منخفض';
      default:
        return 'غير محدد';
    }
  };

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive' as const;
      case 'high':
        return 'destructive' as const;
      case 'medium':
        return 'secondary' as const;
      case 'low':
        return 'outline' as const;
      default:
        return 'outline' as const;
    }
  };

  const formatTimeAgo = (timestamp: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `منذ ${diffMinutes} دقيقة`;
    } else if (diffHours < 24) {
      return `منذ ${diffHours} ساعة`;
    } else {
      return `منذ ${diffDays} يوم`;
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            تنبيهات الأمان
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            تنبيهات الأمان
          </div>
          <Badge variant="outline">
            {alerts.length} نشط
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="w-8 h-8 mx-auto mb-2" />
                <p>لا توجد تنبيهات أمنية حالياً</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-4 rounded-lg border ${
                    alert.severity === 'critical' || alert.severity === 'high'
                      ? 'border-destructive/20 bg-destructive/5'
                      : 'border-warning/20 bg-warning/5'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`w-4 h-4 ${
                        alert.severity === 'critical' || alert.severity === 'high'
                          ? 'text-destructive'
                          : 'text-warning'
                      }`} />
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                    </div>
                    <Badge variant={getSeverityVariant(alert.severity)} className="text-xs">
                      {getSeverityLabel(alert.severity)}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {alert.message}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(alert.timestamp)}
                    </div>
                    <Button size="sm" variant="outline" className="h-6 text-xs">
                      تحقيق
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SecurityAlertsPanel;