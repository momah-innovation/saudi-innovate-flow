import { useState, useEffect } from 'react';
import { DetailModal } from '@/components/ui/detail-modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Activity, Clock, CheckCircle, AlertTriangle, User, Database } from 'lucide-react';
import { useUnifiedTranslation } from '@/hooks/useAppTranslation';
import { supabase } from '@/integrations/supabase/client';

interface SystemActivity {
  id: string;
  timestamp: string;
  action: string;
  user_id?: string;
  resource_type?: string;
  resource_id?: string;
  details?: Record<string, any>;
  status: 'success' | 'error' | 'warning' | 'info';
  ip_address?: string;
}

interface SystemActivityDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SystemActivityDialog({ isOpen, onClose }: SystemActivityDialogProps) {
  const [activities, setActivities] = useState<SystemActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useUnifiedTranslation();

  useEffect(() => {
    if (isOpen) {
      fetchSystemActivities();
    }
  }, [isOpen]);

  const fetchSystemActivities = async () => {
    setLoading(true);
    try {
      // Fetch from security audit log
      const { data, error } = await supabase
        .from('security_audit_log')
        .select(`
          id,
          created_at,
          action_type,
          user_id,
          resource_type,
          resource_id,
          details,
          risk_level
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const mappedActivities: SystemActivity[] = (data || []).map(item => ({
        id: item.id,
        timestamp: item.created_at,
        action: item.action_type,
        user_id: item.user_id,
        resource_type: item.resource_type,
        resource_id: item.resource_id,
        details: (item.details && typeof item.details === 'object') ? item.details as Record<string, any> : {},
        status: item.risk_level === 'high' || item.risk_level === 'critical' ? 'error' : 
                item.risk_level === 'medium' ? 'warning' : 'info'
      }));

      setActivities(mappedActivities);
    } catch (error) {
      console.error('Error fetching system activities:', error);
      // Set mock data for demo
      setActivities([
        {
          id: '1',
          timestamp: new Date().toISOString(),
          action: 'USER_LOGIN',
          user_id: 'user-123',
          status: 'success',
          details: { location: 'Riyadh, SA' }
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          action: 'IDEA_SUBMITTED',
          user_id: 'user-456',
          resource_type: 'ideas',
          status: 'info',
          details: { title: 'Smart City Initiative' }
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          action: 'SYSTEM_BACKUP',
          status: 'success',
          details: { size: '2.4GB' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 icon-success" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 icon-error" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 icon-warning" />;
      default:
        return <Activity className="h-4 w-4 icon-info" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'badge-success';
      case 'error':
        return 'badge-error';
      case 'warning':
        return 'badge-warning';
      default:
        return 'badge-info';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('system_activity_dialog.title')}
      subtitle={t('system_activity_dialog.subtitle')}
      maxWidth="4xl"
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">{t('system_activity_dialog.loading_activities')}</span>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">{t('system_activity_dialog.no_recent_activities')}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            activities.map((activity) => {
              const { date, time } = formatTimestamp(activity.timestamp);
              
              return (
                <Card key={activity.id} className="hover:shadow-sm transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(activity.status)}
                        <div>
                          <CardTitle className="text-base">{activity.action.replace(/_/g, ' ')}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{date} at {time}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  {(activity.user_id || activity.resource_type || Object.keys(activity.details || {}).length > 0) && (
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        {activity.user_id && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{t('system_activity_dialog.user')}:</span>
                            <span className="font-mono">{activity.user_id.slice(0, 8)}...</span>
                          </div>
                        )}
                        
                        {activity.resource_type && (
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{t('system_activity_dialog.resource')}:</span>
                            <span>{activity.resource_type}</span>
                          </div>
                        )}
                        
                        {activity.details && Object.keys(activity.details).length > 0 && (
                          <div className="md:col-span-3">
                            <div className="bg-muted/50 rounded-md p-3">
                              <pre className="text-xs overflow-x-auto">
                                {JSON.stringify(activity.details, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })
          )}
        </div>
      )}
    </DetailModal>
  );
}