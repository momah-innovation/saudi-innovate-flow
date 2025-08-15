import { useState, useEffect } from 'react';
import { DetailModal } from '@/components/ui/detail-modal';
import { useTimerManager } from '@/utils/timerManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Server, Database, HardDrive, Cpu, Wifi, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { useTranslation } from 'react-i18next';

interface SystemHealth {
  overall_status: 'healthy' | 'warning' | 'critical';
  database_status: 'online' | 'slow' | 'offline';
  storage_usage: number;
  storage_total: number;
  active_connections: number;
  max_connections: number;
  response_time: number;
  uptime: string;
  last_backup: string;
  security_alerts: number;
  performance_score: number;
}

interface SystemHealthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SystemHealthDialog({ isOpen, onClose }: SystemHealthDialogProps) {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      fetchSystemHealth();
    }
  }, [isOpen]);

  const { setTimeout: scheduleTimeout } = useTimerManager();

  const fetchSystemHealth = async () => {
    setLoading(true);
    try {
      // In a real system, this would call a health check endpoint
      // For now, we'll simulate the data with managed timer
      await new Promise(resolve => scheduleTimeout(() => resolve(undefined), 1000));
      
      const mockHealth: SystemHealth = {
        overall_status: 'healthy',
        database_status: 'online',
        storage_usage: 45.2,
        storage_total: 100,
        active_connections: 127,
        max_connections: 500,
        response_time: 245,
        uptime: '15 days, 7 hours',
        last_backup: new Date(Date.now() - 3600000).toISOString(),
        security_alerts: 2,
        performance_score: 92
      };

      setHealth(mockHealth);
    } catch (error) {
      logger.error('Error fetching system health', { component: 'SystemHealthDialog', action: 'fetchSystemHealth' }, error as Error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return <Badge className="badge-success">{t('system_health.status.healthy', 'Healthy')}</Badge>;
      case 'warning':
      case 'slow':
        return <Badge className="badge-warning">{t('ui.status.warning')}</Badge>;
      case 'critical':
      case 'offline':
        return <Badge className="badge-error">{t('system_health.status.critical', 'Critical')}</Badge>;
      default:
        return <Badge variant="secondary">{t('ui.common.unknown')}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return <CheckCircle className="h-5 w-5 icon-success" />;
      case 'warning':
      case 'slow':
        return <AlertTriangle className="h-5 w-5 icon-warning" />;
      case 'critical':
      case 'offline':
        return <AlertTriangle className="h-5 w-5 icon-error" />;
      default:
        return <Server className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const formatUptime = (uptime: string) => {
    return uptime;
  };

  const formatLastBackup = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ar-SA');
  };

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('system_health.title', 'System Health')}
      subtitle={t('system_health.subtitle', 'Real-time system status and performance metrics')}
      maxWidth="4xl"
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">{t('system_health.checking', 'Checking system health...')}</span>
        </div>
      ) : health ? (
        <div className="space-y-6">
          {/* Overall Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(health.overall_status)}
                  {t('system_health.system_overview', 'System Overview')}
                </CardTitle>
                {getStatusBadge(health.overall_status)}
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{health.performance_score}%</div>
                <div className="text-sm text-muted-foreground">{t('system_health.performance_score', 'Performance Score')}</div>
                <Progress value={health.performance_score} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{formatUptime(health.uptime)}</div>
                <div className="text-sm text-muted-foreground">{t('system_health.system_uptime', 'System Uptime')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{health.response_time}ms</div>
                <div className="text-sm text-muted-foreground">{t('system_health.avg_response_time', 'Avg Response Time')}</div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Database Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  {t('system_health.database', 'Database')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>{t('ui.common.status')}</span>
                  {getStatusBadge(health.database_status)}
                </div>
                <div className="flex items-center justify-between">
                  <span>{t('system_health.active_connections', 'Active Connections')}</span>
                  <span className="font-mono">{health.active_connections}/{health.max_connections}</span>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span>{t('system_health.connection_usage', 'Connection Usage')}</span>
                    <span>{Math.round((health.active_connections / health.max_connections) * 100)}%</span>
                  </div>
                  <Progress value={(health.active_connections / health.max_connections) * 100} />
                </div>
              </CardContent>
            </Card>

            {/* Storage Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  {t('system_health.storage', 'Storage')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>{t('system_health.usage', 'Usage')}</span>
                  <span className="font-mono">{health.storage_usage}GB / {health.storage_total}GB</span>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span>{t('system_health.disk_usage', 'Disk Usage')}</span>
                    <span>{Math.round(health.storage_usage)}%</span>
                  </div>
                  <Progress value={health.storage_usage} />
                </div>
                <div className="flex items-center justify-between">
                  <span>{t('system_health.last_backup', 'Last Backup')}</span>
                  <span className="text-sm">{formatLastBackup(health.last_backup)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Security Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {t('system_health.security', 'Security')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>{t('system_health.active_alerts', 'Active Alerts')}</span>
                  <Badge variant={health.security_alerts > 0 ? "destructive" : "secondary"}>
                    {health.security_alerts}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t('system_health.ssl_status', 'SSL Status')}</span>
                  <Badge className="badge-success">{t('ui.status.active')}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t('system_health.firewall', 'Firewall')}</span>
                  <Badge className="badge-success">{t('system_health.protected', 'Protected')}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Network Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  {t('system_health.network', 'Network')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>{t('system_health.cdn_status', 'CDN Status')}</span>
                  <Badge className="badge-success">{t('ui.common.online')}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t('system_health.api_endpoints', 'API Endpoints')}</span>
                  <Badge className="badge-success">{t('system_health.all_available', 'All Available')}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t('system_health.avg_latency', 'Avg Latency')}</span>
                  <span className="font-mono">{health.response_time}ms</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Server className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t('system_health.unable_to_fetch', 'Unable to fetch system health data')}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </DetailModal>
  );
}