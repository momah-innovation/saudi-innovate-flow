import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  TrendingUp, 
  Users, 
  DollarSign,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

interface AdminEventsHeroProps {
  totalEvents: number;
  activeEvents: number;
  totalParticipants: number;
  totalRevenue: number;
  upcomingEvents: number;
  completedEvents: number;
}

export const AdminEventsHero = ({
  totalEvents,
  activeEvents,
  totalParticipants,
  totalRevenue,
  upcomingEvents,
  completedEvents
}: AdminEventsHeroProps) => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();

  const metrics = [
    {
      title: t('events.metrics.total', 'Total Events'),
      value: totalEvents,
      icon: Calendar,
      trend: t('events.metrics.trend_month', '+12% from last month'),
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: t('events.metrics.active', 'Active Events'),
      value: activeEvents,
      icon: TrendingUp,
      trend: t('events.metrics.ongoing_now', '{{count}} ongoing now', { count: activeEvents }),
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: t('events.metrics.participants', 'Total Participants'),
      value: totalParticipants.toLocaleString(),
      icon: Users,
      trend: t('events.metrics.registration_rate', '+8% registration rate'),
      color: 'bg-innovation',
      bgColor: 'bg-innovation/10 dark:bg-innovation/20',
      textColor: 'text-innovation'
    },
    {
      title: t('events.metrics.revenue', 'Revenue'),
      value: `${totalRevenue.toLocaleString()} ${t('common.currency.sar', 'SAR')}`,
      icon: DollarSign,
      trend: t('events.metrics.revenue_growth', '+15% from last month'),
      color: 'bg-success',
      bgColor: 'bg-success/10 dark:bg-success/20',
      textColor: 'text-success'
    }
  ];

  const quickStats = [
    {
      label: t('events.status.upcoming', 'Upcoming'),
      value: upcomingEvents,
      icon: Clock,
      color: 'icon-warning'
    },
    {
      label: t('events.status.completed', 'Completed'),
      value: completedEvents,
      icon: CheckCircle2,
      color: 'icon-success'
    },
    {
      label: t('events.venues', 'Venues'),
      value: 8,
      icon: MapPin,
      color: 'icon-info'
    },
    {
      label: t('events.need_attention', 'Need Attention'),
      value: 3,
      icon: AlertCircle,
      color: 'icon-error'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-all duration-300 hover-scale">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground mb-1">
                      {metric.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {metric.trend}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                    <IconComponent className={`w-6 h-6 ${metric.textColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {t('events.quick_stats', 'Quick Stats')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center p-4 bg-muted/30 rounded-lg">
                  <IconComponent className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Event Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>{t('events.status_distribution', 'Event Status Distribution')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Badge variant="default" className="badge-success">
              {t('events.status.scheduled', 'Scheduled')} ({upcomingEvents})
            </Badge>
            <Badge variant="secondary" className="badge-info">
              {t('events.status.ongoing', 'Ongoing')} ({activeEvents})
            </Badge>
            <Badge variant="outline" className="bg-muted text-muted-foreground border-muted">
              {t('events.status.completed', 'Completed')} ({completedEvents})
            </Badge>
            <Badge variant="destructive" className="badge-error">
              {t('events.status.cancelled', 'Cancelled')} (0)
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};