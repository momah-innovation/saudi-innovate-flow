import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDirection } from '@/components/ui/direction-provider';
import { useSettingsManager } from '@/hooks/useSettingsManager';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';
import {
  BarChart3,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  MapPin,
  Trophy,
  Target,
  Activity,
  Zap
} from 'lucide-react';
import { ChartPlaceholder } from '@/components/common/ChartPlaceholder'

interface EventAnalyticsData {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  totalRegistrations: number;
  averageAttendance: number;
  popularEventTypes: Array<{ type: string; count: number; percentage: number }>;
  monthlyTrends: Array<{ month: string; events: number; registrations: number }>;
  formatDistribution: Array<{ name: string; value: number; color: string }>;
  registrationTrends: Array<{ date: string; registrations: number; events: number }>;
}

interface EventAnalyticsDashboardProps {
  className?: string;
}

export const EventAnalyticsDashboard = ({ className = "" }: EventAnalyticsDashboardProps) => {
  const { isRTL } = useDirection();
  const [analyticsData, setAnalyticsData] = useState<EventAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);

      // Get all events data
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*');

      if (eventsError) throw eventsError;

      // Get all registrations data
      const { data: registrations, error: registrationsError } = await supabase
        .from('event_participants')
        .select('*');

      if (registrationsError) throw registrationsError;

      // Process the data
      const now = new Date();
      const upcomingEvents = events.filter(e => new Date(e.event_date) >= now);
      const completedEvents = events.filter(e => new Date(e.event_date) < now);

      // Calculate event type distribution
      const eventTypeCounts = events.reduce((acc, event) => {
        acc[event.event_type] = (acc[event.event_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const popularEventTypes = Object.entries(eventTypeCounts)
        .map(([type, count]) => ({
          type,
          count,
          percentage: Math.round((count / events.length) * 100)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Calculate format distribution
      const formatCounts = events.reduce((acc, event) => {
        acc[event.format] = (acc[event.format] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const formatDistribution = Object.entries(formatCounts).map(([format, count]) => ({
        name: format === 'virtual' ? (isRTL ? 'افتراضي' : 'Virtual') :
              format === 'in_person' ? (isRTL ? 'حضوري' : 'In-Person') :
              format === 'hybrid' ? (isRTL ? 'مختلط' : 'Hybrid') : format,
        value: count,
        color: format === 'virtual' ? '#3b82f6' :
               format === 'in_person' ? '#10b981' :
               format === 'hybrid' ? '#8b5cf6' : '#6b7280'
      }));

      // Calculate monthly trends (last 6 months)
      let monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const monthEvents = events.filter(e => {
          const eventDate = new Date(e.event_date);
          return eventDate >= monthStart && eventDate <= monthEnd;
        });

        const monthRegistrations = registrations.filter(r => {
          const regDate = new Date(r.registration_date);
          return regDate >= monthStart && regDate <= monthEnd;
        });

        monthlyData = [...monthlyData, {
          month: date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', { month: 'short' }),
          events: monthEvents.length,
          registrations: monthRegistrations.length
        }];
      }

      // Calculate registration trends (last 30 days)
      let registrationTrends = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const dayRegistrations = registrations.filter(r => 
          r.registration_date?.startsWith(dateStr)
        );

        const dayEvents = events.filter(e => 
          e.event_date === dateStr
        );

        registrationTrends = [...registrationTrends, {
          date: date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric' }),
          registrations: dayRegistrations.length,
          events: dayEvents.length
        }];
      }

      // Calculate average attendance
      const completedEventsWithAttendance = completedEvents.filter(e => e.actual_participants);
      const averageAttendance = completedEventsWithAttendance.length > 0 
        ? Math.round(
            completedEventsWithAttendance.reduce((sum, e) => sum + (e.actual_participants || 0), 0) / 
            completedEventsWithAttendance.length
          )
        : 0;

      setAnalyticsData({
        totalEvents: events.length,
        upcomingEvents: upcomingEvents.length,
        completedEvents: completedEvents.length,
        totalRegistrations: registrations.length,
        averageAttendance,
        popularEventTypes,
        monthlyTrends: monthlyData,
        formatDistribution,
        registrationTrends
      });

    } catch (error) {
      logger.error('Error loading analytics data', { 
        component: 'EventAnalyticsDashboard', 
        action: 'loadAnalyticsData'
      }, error as Error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {isRTL ? 'إحصائيات الفعاليات' : 'Event Analytics'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-24 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analyticsData) return null;

  const { getSettingValue } = useSettingsManager();
  const COLORS = getSettingValue('primary_chart_colors', ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444']) as string[];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{isRTL ? 'إجمالي الفعاليات' : 'Total Events'}</p>
                <p className="text-2xl font-bold text-primary">{analyticsData.totalEvents}</p>
              </div>
              <Calendar className="w-8 h-8 text-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{isRTL ? 'الفعاليات القادمة' : 'Upcoming Events'}</p>
                <p className="text-2xl font-bold text-blue-600">{analyticsData.upcomingEvents}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{isRTL ? 'إجمالي التسجيلات' : 'Total Registrations'}</p>
                <p className="text-2xl font-bold text-green-600">{analyticsData.totalRegistrations}</p>
              </div>
              <Users className="w-8 h-8 text-green-600/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{isRTL ? 'متوسط الحضور' : 'Avg Attendance'}</p>
                <p className="text-2xl font-bold text-purple-600">{analyticsData.averageAttendance}</p>
              </div>
              <Target className="w-8 h-8 text-purple-600/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{isRTL ? 'الفعاليات المكتملة' : 'Completed Events'}</p>
                <p className="text-2xl font-bold text-orange-600">{analyticsData.completedEvents}</p>
              </div>
              <Trophy className="w-8 h-8 text-orange-600/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            {isRTL ? 'التحليلات التفصيلية' : 'Detailed Analytics'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">{isRTL ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
              <TabsTrigger value="trends">{isRTL ? 'الاتجاهات' : 'Trends'}</TabsTrigger>
              <TabsTrigger value="types">{isRTL ? 'الأنواع' : 'Types'}</TabsTrigger>
              <TabsTrigger value="formats">{isRTL ? 'الصيغ' : 'Formats'}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Trends Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{isRTL ? 'الاتجاهات الشهرية' : 'Monthly Trends'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartPlaceholder title={isRTL ? "الاتجاهات الشهرية" : "Monthly Trends"} height={300} />
                  </CardContent>
                </Card>

                {/* Popular Event Types */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{isRTL ? 'أنواع الفعاليات الشائعة' : 'Popular Event Types'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analyticsData.popularEventTypes.map((type, index) => (
                        <div key={type.type} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="font-medium">{type.type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{type.count}</Badge>
                            <span className="text-sm text-muted-foreground">{type.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{isRTL ? 'اتجاهات التسجيل (30 يوم)' : 'Registration Trends (30 Days)'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartPlaceholder title={isRTL ? "اتجاهات التسجيل" : "Registration Trends"} height={400} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="types" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{isRTL ? 'توزيع أنواع الفعاليات' : 'Event Types Distribution'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartPlaceholder title={isRTL ? "توزيع أنواع الفعاليات" : "Event Types Distribution"} height={300} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{isRTL ? 'إحصائيات مفصلة' : 'Detailed Statistics'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.popularEventTypes.map((type, index) => (
                        <div key={type.type} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{type.type}</span>
                            <Badge variant="outline">{type.count} {isRTL ? 'فعالية' : 'events'}</Badge>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${type.percentage}%`,
                                backgroundColor: COLORS[index % COLORS.length]
                              }}
                            />
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {type.percentage}% {isRTL ? 'من إجمالي الفعاليات' : 'of total events'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="formats" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{isRTL ? 'توزيع صيغ الفعاليات' : 'Event Formats Distribution'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartPlaceholder title={isRTL ? "توزيع صيغ الفعاليات" : "Event Formats Distribution"} height={300} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{isRTL ? 'مقارنة الصيغ' : 'Format Comparison'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.formatDistribution.map((format) => (
                        <div key={format.name} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: format.color }}
                            />
                            <span className="font-medium">{format.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{format.value}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {Math.round((format.value / analyticsData.totalEvents) * 100)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};