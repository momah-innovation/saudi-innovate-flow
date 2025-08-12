import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Shield, Eye, Clock, Filter, ExternalLink } from 'lucide-react';
import { useSecurityAuditLog } from '@/hooks/admin/useSecurityAuditLog';
import { useSuspiciousActivities } from '@/hooks/admin/useSuspiciousActivities';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface AlertItem {
  id: string;
  type: 'security_audit' | 'suspicious_activity';
  title: string;
  description: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  actionUrl?: string;
  metadata?: any;
}

export const SecurityAlertsPanel: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  // Fetch security audit log data
  const { 
    data: auditData, 
    isLoading: auditLoading 
  } = useSecurityAuditLog({
    timeRange: '24h',
    riskLevel: riskFilter === 'all' ? 'all' : riskFilter as any,
    autoRefresh: true,
    limit: 20
  });

  // Fetch suspicious activities data
  const { 
    data: suspiciousData, 
    isLoading: suspiciousLoading 
  } = useSuspiciousActivities({
    timeRange: '24h',
    severity: riskFilter === 'all' ? 'all' : riskFilter as any,
    autoRefresh: true,
    limit: 20
  });

  // Combine and format alerts
  useEffect(() => {
    const combinedAlerts: AlertItem[] = [];

    // Process security audit log data
    if (auditData) {
      auditData.forEach(item => {
        combinedAlerts.push({
          id: `audit_${item.id}`,
          type: 'security_audit',
          title: getAuditTitle(item.action_type),
          description: getAuditDescription(item.action_type, item.details),
          riskLevel: item.risk_level as any,
          timestamp: item.created_at,
          actionUrl: getActionUrl(item.action_type, item.resource_id),
          metadata: item.details
        });
      });
    }

    // Process suspicious activities data
    if (suspiciousData) {
      suspiciousData.forEach(item => {
        combinedAlerts.push({
          id: `suspicious_${item.id}`,
          type: 'suspicious_activity',
          title: getSuspiciousTitle(item.activity_type),
          description: item.description,
          riskLevel: item.severity as any,
          timestamp: item.created_at,
          metadata: item.request_details
        });
      });
    }

    // Sort by timestamp (newest first) and risk level
    combinedAlerts.sort((a, b) => {
      const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const riskDiff = riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
      if (riskDiff !== 0) return riskDiff;
      
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    setAlerts(combinedAlerts.slice(0, 10)); // Show top 10 alerts
  }, [auditData, suspiciousData]);

  const getAuditTitle = (actionType: string): string => {
    const titles: Record<string, string> = {
      'ROLE_ASSIGNED': isRTL ? 'تم تعيين دور جديد' : 'Role Assigned',
      'ROLE_REVOKED': isRTL ? 'تم إلغاء دور' : 'Role Revoked',
      'LOGIN_FAILED': isRTL ? 'فشل في تسجيل الدخول' : 'Login Failed',
      'SUSPICIOUS_ACTIVITY_DETECTED': isRTL ? 'تم اكتشاف نشاط مشبوه' : 'Suspicious Activity',
      'ROLE_ASSIGNMENT_DENIED': isRTL ? 'تم رفض تعيين الدور' : 'Role Assignment Denied',
      'PASSWORD_CHANGED': isRTL ? 'تم تغيير كلمة المرور' : 'Password Changed'
    };
    return titles[actionType] || actionType;
  };

  const getAuditDescription = (actionType: string, details: any): string => {
    if (actionType === 'ROLE_ASSIGNED' && details?.target_role) {
      return isRTL 
        ? `تم تعيين دور ${details.target_role} لمستخدم`
        : `Role ${details.target_role} assigned to user`;
    }
    if (actionType === 'LOGIN_FAILED' && details?.email) {
      return isRTL 
        ? `محاولة تسجيل دخول فاشلة من ${details.email}`
        : `Failed login attempt from ${details.email}`;
    }
    return isRTL ? 'حدث أمني يتطلب المراجعة' : 'Security event requires review';
  };

  const getSuspiciousTitle = (activityType: string): string => {
    const titles: Record<string, string> = {
      'multiple_failed_logins': isRTL ? 'محاولات دخول متعددة فاشلة' : 'Multiple Failed Logins',
      'unusual_access_pattern': isRTL ? 'نمط وصول غير عادي' : 'Unusual Access Pattern',
      'rate_limit_exceeded': isRTL ? 'تجاوز حد المعدل' : 'Rate Limit Exceeded',
      'suspicious_ip': isRTL ? 'عنوان IP مشبوه' : 'Suspicious IP Address'
    };
    return titles[activityType] || activityType;
  };

  const getActionUrl = (actionType: string, resourceId?: string): string => {
    if (actionType.includes('ROLE') && resourceId) {
      return `/admin/access-control-advanced?user=${resourceId}`;
    }
    if (actionType.includes('LOGIN')) {
      return `/admin/security-advanced?tab=authentication`;
    }
    return '/admin/security-advanced';
  };

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <Shield className="h-4 w-4" />;
      case 'low':
        return <Eye className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const isLoading = auditLoading || suspiciousLoading;

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              {isRTL ? 'تنبيهات الأمان' : 'Security Alerts'}
            </CardTitle>
            <CardDescription>
              {isRTL 
                ? 'أحدث التنبيهات الأمنية والأنشطة المشبوهة'
                : 'Latest security alerts and suspicious activities'
              }
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {isRTL ? 'الكل' : 'All'}
                </SelectItem>
                <SelectItem value="critical">
                  {isRTL ? 'حرج' : 'Critical'}
                </SelectItem>
                <SelectItem value="high">
                  {isRTL ? 'عالي' : 'High'}
                </SelectItem>
                <SelectItem value="medium">
                  {isRTL ? 'متوسط' : 'Medium'}
                </SelectItem>
                <SelectItem value="low">
                  {isRTL ? 'منخفض' : 'Low'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{isRTL ? 'لا توجد تنبيهات أمنية حالياً' : 'No security alerts currently'}</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getRiskIcon(alert.riskLevel)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-medium text-sm leading-tight">
                      {alert.title}
                    </h4>
                    <Badge 
                      variant={getRiskBadgeVariant(alert.riskLevel)}
                      className="flex-shrink-0 text-xs"
                    >
                      {isRTL ? 
                        {critical: 'حرج', high: 'عالي', medium: 'متوسط', low: 'منخفض'}[alert.riskLevel] :
                        alert.riskLevel
                      }
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                    {alert.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(alert.timestamp), {
                        addSuffix: true,
                        locale: isRTL ? ar : undefined
                      })}
                    </div>
                    
                    {alert.actionUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => window.location.href = alert.actionUrl!}
                      >
                        {isRTL ? 'عرض' : 'View'}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {alerts.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => window.location.href = '/admin/security-advanced'}
            >
              {isRTL ? 'عرض جميع التنبيهات' : 'View All Alerts'}
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};