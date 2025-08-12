import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle, Activity, Lock, Eye, Zap } from 'lucide-react';
import { useSecurityMetrics } from '@/hooks/admin/useSecurityAuditLog';

interface SecurityMetricsGridProps {
  className?: string;
}

const SecurityMetricsGrid: React.FC<SecurityMetricsGridProps> = ({ className }) => {
  const { data: metrics, isLoading } = useSecurityMetrics('24h');

  const metricCards = [
    {
      title: 'نقاط الأمان',
      value: metrics?.securityScore || 0,
      suffix: '/100',
      icon: Shield,
      variant: metrics?.securityScore >= 80 ? 'success' : metrics?.securityScore >= 60 ? 'warning' : 'destructive'
    },
    {
      title: 'أحداث أمنية',
      value: metrics?.totalEvents || 0,
      icon: Activity,
      variant: 'default'
    },
    {
      title: 'تهديدات عالية',
      value: metrics?.criticalEvents || 0,
      icon: AlertTriangle,
      variant: metrics?.criticalEvents > 0 ? 'destructive' : 'success'
    },
    {
      title: 'أنشطة مشبوهة',
      value: metrics?.suspiciousActivities || 0,
      icon: Eye,
      variant: metrics?.suspiciousActivities > 0 ? 'warning' : 'success'
    },
    {
      title: 'محاولات الوصول',
      value: metrics?.rateLimitViolations || 0,
      icon: Lock,
      variant: metrics?.rateLimitViolations > 10 ? 'destructive' : 'default'
    },
    {
      title: 'معدل التهديد',
      value: 'منخفض',
      icon: Zap,
      variant: 'outline'
    }
  ];

  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case 'success': return 'border-success/20 bg-success/5';
      case 'warning': return 'border-warning/20 bg-warning/5';
      case 'destructive': return 'border-destructive/20 bg-destructive/5';
      default: return 'border-border';
    }
  };

  const getIconClasses = (variant: string) => {
    switch (variant) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'destructive': return 'text-destructive';
      default: return 'text-primary';
    }
  };

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-muted rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {metricCards.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className={getVariantClasses(metric.variant)}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {metric.title}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold">
                      {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                    </p>
                    {metric.suffix && (
                      <span className="text-sm text-muted-foreground">{metric.suffix}</span>
                    )}
                  </div>
                </div>
                <Icon className={`w-8 h-8 ${getIconClasses(metric.variant)}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SecurityMetricsGrid;