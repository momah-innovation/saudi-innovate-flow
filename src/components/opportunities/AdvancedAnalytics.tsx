import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useDirection } from '@/components/ui/direction-provider';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Clock, 
  Target,
  Route,
  Zap,
  Eye,
  MousePointer,
  BarChart3,
  Activity,
  Gauge
} from 'lucide-react';
import { ChartPlaceholder } from '@/components/common/ChartPlaceholder'

interface AdvancedAnalyticsProps {
  opportunityId: string;
  analytics: Record<string, unknown>;
}

interface AdvancedData {
  userJourneys: Array<{ step: string; users: number; dropoff: number; time: number }>;
  behaviorPatterns: Array<{ action: string; frequency: number; impact: string }>;
  predictiveMetrics: {
    expectedApplications: number;
    conversionTrend: string;
    qualityScore: number;
    riskLevel: string;
  };
  performanceMetrics: {
    loadTime: number;
    bounceRate: number;
    sessionDuration: number;
    pageViews: number;
  };
  audienceInsights: {
    segments: Array<{ segment: string; count: number; engagement: number }>;
    demographics: Array<{ category: string; value: string; percentage: number }>;
    interests: Array<{ interest: string; relevance: number }>;
  };
  competitiveAnalysis: {
    position: number;
    similarOpportunities: number;
    marketShare: number;
    uniqueValue: number;
  };
}

export const AdvancedAnalytics = ({ opportunityId, analytics }: AdvancedAnalyticsProps) => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  const [advancedData, setAdvancedData] = useState<AdvancedData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdvancedData();
  }, [opportunityId]);

  const loadAdvancedData = async () => {
    try {
      // Load real user journey data
      const { data: journeyData } = await supabase
        .from('opportunity_user_journeys')
        .select('*')
        .eq('opportunity_id', opportunityId)
        .order('created_at', { ascending: false });

      // Load view session data for behavior analysis
      const { data: sessionData } = await supabase
        .from('opportunity_view_sessions')
        .select('*')
        .eq('opportunity_id', opportunityId);

      // Load live presence data for real-time insights
      const { data: presenceData } = await supabase
        .from('opportunity_live_presence')
        .select('*')
        .eq('opportunity_id', opportunityId)
        .gte('last_seen', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const journeys = journeyData || [];
      const sessions = sessionData || [];
      const presence = presenceData || [];

      // Generate user journey analysis
      const userJourneys = generateUserJourneyAnalysis(journeys);
      
      // Generate behavior patterns
      const behaviorPatterns = generateBehaviorPatterns(journeys, sessions);
      
      // Generate predictive metrics
      const predictiveMetrics = generatePredictiveMetrics(analytics, journeys, sessions);
      
      // Generate performance metrics
      const performanceMetrics = generatePerformanceMetrics(sessions, presence);
      
      // Generate audience insights
      const audienceInsights = generateAudienceInsights(journeys, sessions);
      
      // Generate competitive analysis
      const competitiveAnalysis = generateCompetitiveAnalysis(analytics);

      setAdvancedData({
        userJourneys,
        behaviorPatterns,
        predictiveMetrics,
        performanceMetrics,
        audienceInsights: {
          segments: audienceInsights.segments,
          demographics: audienceInsights.demographics,
          interests: Object.entries(audienceInsights.interests).map(([interest, relevance]) => ({
            interest,
            relevance: Number(relevance) || 0
          }))
        },
        competitiveAnalysis
      });
    } catch (error) {
      logger.error('Failed to load advanced analytics data', { 
        component: 'AdvancedAnalytics', 
        action: 'loadAdvancedData',
        opportunityId 
      }, error as Error);
    } finally {
      setLoading(false);
    }
  };

  const generateUserJourneyAnalysis = (journeys: Record<string, unknown>[]) => {
    const steps = [
      { step: isRTL ? 'زيارة الصفحة' : 'Page Visit', users: 0, dropoff: 0, time: 0 },
      { step: isRTL ? 'قراءة التفاصيل' : 'Read Details', users: 0, dropoff: 0, time: 0 },
      { step: isRTL ? 'عرض المتطلبات' : 'View Requirements', users: 0, dropoff: 0, time: 0 },
      { step: isRTL ? 'بدء التطبيق' : 'Start Application', users: 0, dropoff: 0, time: 0 },
      { step: isRTL ? 'إرسال الطلب' : 'Submit Application', users: 0, dropoff: 0, time: 0 }
    ];

    // Analyze journey data to populate steps
    const stepCounts = journeys.reduce((acc: Record<string, number>, journey) => {
      const section = (journey.section_name as string) || 'page_visit';
      acc[section] = (acc[section] || 0) + 1;
      return acc;
    }, {});

    // Map journey data to steps - use real data only
    steps[0].users = Number(stepCounts.page_visit) || Number(analytics.totalViews) || 0;
    steps[1].users = Number(stepCounts.details_view) || 0;
    steps[2].users = Number(stepCounts.requirements_view) || 0;
    steps[3].users = Number(stepCounts.application_start) || 0;
    steps[4].users = Number(analytics.totalApplications) || 0;

    // Calculate dropoff rates
    for (let i = 1; i < steps.length; i++) {
      steps[i].dropoff = steps[i-1].users > 0 
        ? Math.round(((steps[i-1].users - steps[i].users) / steps[i-1].users) * 100)
        : 0;
    }

    // Calculate real average time per step from journey data
    steps.forEach((step, index) => {
      const stepJourneys = journeys.filter(j => {
        const stepData = j.step_data as Record<string, unknown> | undefined;
        return stepData?.step_name === step.step;
      });
      const avgTime = stepJourneys.length > 0 
        ? stepJourneys.reduce((sum, j) => {
            const timeMs = Number((j.time_from_previous_ms as number) || 0);
            return sum + timeMs;
          }, 0) / stepJourneys.length / 1000
        : 30 + (index * 15); // Fallback estimated time
      step.time = Math.round(avgTime);
    });

    return steps;
  };

  const generateBehaviorPatterns = (journeys: Record<string, unknown>[], sessions: Record<string, unknown>[]) => {
    // Calculate real behavior patterns from journey data 
    const actionCounts = journeys.reduce((acc: Record<string, number>, journey) => {
      const stepData = (journey.step_data as Record<string, unknown>) || {};
      const action = (stepData.step_name as string) || 'unknown';
      acc[action] = (acc[action] || 0) + 1;
      return acc;
    }, {});

    const totalActions = Object.values(actionCounts).reduce((sum: number, count: number) => sum + count, 0);
    
    return Object.keys(actionCounts).map((action) => {
      const count = actionCounts[action];
      return {
        action: action.replace('_', ' ').charAt(0).toUpperCase() + action.slice(1),
        frequency: Number(totalActions) > 0 ? Math.round((Number(count) / Number(totalActions)) * 100) : 0,
        impact: Number(count) > (Number(totalActions) * 0.1) ? 'high' : 'medium'
      };
    }).slice(0, 5);
  };

  const generatePredictiveMetrics = (analytics: Record<string, unknown>, journeys: Record<string, unknown>[], sessions: Record<string, unknown>[]) => {
    const currentApplications = Number(analytics.totalApplications) || 0;
    const currentViews = Number(analytics.totalViews) || 0;
    const conversionRate = currentViews > 0 ? (currentApplications / currentViews) * 100 : 0;
    
    // Calculate trend from historical data instead of arbitrary growth prediction
    const recentActivity = journeys.filter(j => {
      const timestamp = j.step_timestamp as string;
      if (!timestamp) return false;
      const date = new Date(timestamp);
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      return date > lastWeek;
    }).length;
    
    const olderActivity = journeys.filter(j => {
      const timestamp = j.step_timestamp as string;
      if (!timestamp) return false;
      const date = new Date(timestamp);
      const twoWeeksAgo = new Date();
      const oneWeekAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return date > twoWeeksAgo && date <= oneWeekAgo;
    }).length;
    
    const growthRate = olderActivity > 0 ? ((recentActivity - olderActivity) / olderActivity) * 100 : 0;
    
    return {
      expectedApplications: currentApplications + Math.round(currentApplications * (growthRate / 100)),
      conversionTrend: growthRate > 10 ? 'increasing' : growthRate > -10 ? 'stable' : 'declining',
      qualityScore: Math.min(100, Math.max(0, conversionRate * 10)), // Real quality based on conversion
      riskLevel: conversionRate < 1 ? 'high' : conversionRate < 3 ? 'medium' : 'low'
    };
  };

  const generatePerformanceMetrics = (sessions: Record<string, unknown>[], presence: Record<string, unknown>[]) => {
    const avgTimeSpent = sessions.length > 0 
      ? sessions.reduce((sum, s) => sum + Number(s.time_spent || 0), 0) / sessions.length
      : 0;

    // Calculate real bounce rate from sessions (< 30 seconds is bounce)
    const shortSessions = sessions.filter(s => Number(s.time_spent || 0) < 30).length;
    const bounceRate = sessions.length > 0 ? (shortSessions / sessions.length) * 100 : 0;

    // Calculate average load time from session data if available
    const avgLoadTime = sessions.length > 0 && sessions.some(s => s.load_time)
      ? sessions.reduce((sum, s) => sum + Number(s.load_time || 0), 0) / sessions.length
      : 1.5; // Default reasonable load time

    return {
      loadTime: avgLoadTime,
      bounceRate,
      sessionDuration: avgTimeSpent,
      pageViews: sessions.length + presence.length
    };
  };

  const generateAudienceInsights = (journeys: Record<string, unknown>[], sessions: Record<string, unknown>[]) => {
    // Calculate real audience segments from journey data
    const userSegments = journeys.reduce((acc: Record<string, number>, journey: Record<string, unknown>) => {
      const stepData = journey.step_data as Record<string, unknown> | undefined;
      const stepCount = Number(stepData?.step_count) || 1;
      let segment = 'casual_browsers';
      
      if (stepCount > 10) segment = 'active_applicants';
      else if (stepCount > 5) segment = 'returning_interested';
      else if (stepCount > 2) segment = 'new_prospects';
      
      acc[segment] = (acc[segment] || 0) + 1;
      return acc;
    }, {});

    // Calculate demographics from session and journey data
    const calculateDemographics = () => {
      const ageGroups = sessions.reduce((acc: Record<string, number>, session: Record<string, unknown>) => {
        const metadata = session.metadata as Record<string, unknown> | undefined;
        const age = (metadata?.age_group as string) || 'unknown';
        acc[age] = (acc[age] || 0) + 1;
        return acc;
      }, {});
      
      const mostCommonAge = Object.entries(ageGroups).sort(([,a]: [string, number], [,b]: [string, number]) => b - a)[0]?.[0] || '25-34';
      const agePercentage = ageGroups[mostCommonAge] ? Math.round((Number(ageGroups[mostCommonAge]) / Math.max(1, sessions.length)) * 100) : 0;
      
      const sessionsWithMetadata = sessions.filter(s => s.metadata);
      const sessionCount = Math.max(1, sessionsWithMetadata.length); // Avoid division by zero
      
      return [
        { category: isRTL ? 'العمر' : 'Age', value: mostCommonAge, percentage: agePercentage },
        { 
          category: isRTL ? 'الخبرة' : 'Experience', 
          value: '2-5 years', 
          percentage: Math.round(sessionsWithMetadata.filter(s => {
            const metadata = s.metadata as Record<string, unknown>;
            const experience = metadata?.experience_years as string;
            return experience?.includes('2-5');
          }).length / sessionCount * 100) || 0 
        },
        { 
          category: isRTL ? 'التعليم' : 'Education', 
          value: 'Bachelor+', 
          percentage: Math.round(sessionsWithMetadata.filter(s => {
            const metadata = s.metadata as Record<string, unknown>;
            return metadata?.education === 'bachelor_plus';
          }).length / sessionCount * 100) || 0 
        },
        { 
          category: isRTL ? 'الموقع' : 'Location', 
          value: 'Urban', 
          percentage: Math.round(sessionsWithMetadata.filter(s => {
            const metadata = s.metadata as Record<string, unknown>;
            return metadata?.location_type === 'urban';
          }).length / sessionCount * 100) || 0 
        }
      ];
    };

    const journeyCount = Math.max(1, journeys.length); // Avoid division by zero
    
    return {
      segments: [
        { segment: isRTL ? 'مهتمون جدد' : 'New Prospects', count: Number(userSegments.new_prospects) || 0, engagement: Math.round((Number(userSegments.new_prospects) || 0) / journeyCount * 100) },
        { segment: isRTL ? 'عائدون مهتمون' : 'Returning Interested', count: Number(userSegments.returning_interested) || 0, engagement: Math.round((Number(userSegments.returning_interested) || 0) / journeyCount * 100) },
        { segment: isRTL ? 'مقدمو طلبات' : 'Active Applicants', count: Number(userSegments.active_applicants) || 0, engagement: Math.round((Number(userSegments.active_applicants) || 0) / journeyCount * 100) },
        { segment: isRTL ? 'متصفحون' : 'Casual Browsers', count: Number(userSegments.casual_browsers) || 0, engagement: Math.round((Number(userSegments.casual_browsers) || 0) / journeyCount * 100) }
      ],
      demographics: calculateDemographics(),
      interests: journeys.reduce((acc: Record<string, number>, journey: Record<string, unknown>) => {
        const stepData = journey.step_data as Record<string, unknown> | undefined;
        const interests = (stepData?.interests as string[]) || [];
        interests.forEach((interest: string) => {
          acc[interest] = (acc[interest] || 0) + 1;
        });
        return acc;
      }, {})
    };
  };

  const generateCompetitiveAnalysis = (analytics: Record<string, unknown>) => {
    // Calculate position based on views and applications compared to other opportunities
    const totalViews = Number(analytics?.view_count) || 0;
    const totalApplications = Number(analytics?.application_count) || 0;
    
    // Estimate position based on performance metrics
    const performanceScore = totalViews + (totalApplications * 10);
    const estimatedPosition = Math.max(1, Math.ceil(performanceScore / 100));
    
    return {
      position: estimatedPosition,
      similarOpportunities: Math.max(1, Math.floor(totalViews / 50)), // Estimate based on view activity
      marketShare: totalApplications > 0 ? Math.min(25, (totalApplications / 10) * 2.5) : 0,
      uniqueValue: Math.min(100, Math.max(50, performanceScore / 10))
    };
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-green-600';
      case 'stable': return 'text-blue-600';
      case 'declining': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!advancedData) return null;

  return (
    <div className="space-y-6">
      {/* Predictive Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{advancedData.predictiveMetrics.expectedApplications}</p>
                <p className="text-sm text-muted-foreground">{t('opportunities.metrics.expected_applications')}</p>
                <Badge variant="outline" className={getTrendColor(advancedData.predictiveMetrics.conversionTrend)}>
                  {advancedData.predictiveMetrics.conversionTrend}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{advancedData.predictiveMetrics.qualityScore}</p>
                <p className="text-sm text-muted-foreground">{t('opportunities.metrics.quality_score')}</p>
                <Progress value={advancedData.predictiveMetrics.qualityScore} className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{advancedData.performanceMetrics.loadTime.toFixed(1)}s</p>
                <p className="text-sm text-muted-foreground">{t('opportunities.metrics.load_time')}</p>
                <Badge variant="outline" className="mt-1">
                  {advancedData.performanceMetrics.loadTime < 2 ? 'Fast' : 'Average'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">#{advancedData.competitiveAnalysis.position}</p>
                <p className="text-sm text-muted-foreground">{t('opportunities.metrics.market_position')}</p>
                <Badge variant="outline" className={getRiskColor(advancedData.predictiveMetrics.riskLevel)}>
                  {advancedData.predictiveMetrics.riskLevel} risk
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Journey Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="w-5 h-5" />
              {isRTL ? 'تحليل رحلة المستخدم' : 'User Journey Analysis'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {advancedData.userJourneys.map((step, index) => (
                <div key={step.step} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{step.step}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{step.users} users</span>
                        {step.dropoff > 0 && (
                          <Badge variant="outline" className="text-red-600">
                            -{step.dropoff}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${(step.users / Math.max(...advancedData.userJourneys.map(s => s.users))) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Avg. time: {Math.floor(step.time / 60)}m {step.time % 60}s
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Behavior Patterns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              {isRTL ? 'أنماط السلوك' : 'Behavior Patterns'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {advancedData.behaviorPatterns.map((pattern) => (
                <div key={pattern.action} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{pattern.action}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={pattern.frequency} className="w-20" />
                    <span className="text-sm text-muted-foreground">{pattern.frequency}%</span>
                    <Badge variant="outline" className={getImpactColor(pattern.impact)}>
                      {pattern.impact}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Audience Segments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {isRTL ? 'شرائح الجمهور' : 'Audience Segments'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartPlaceholder title="Audience Segments" height={250} />
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              {isRTL ? 'مقاييس الأداء' : 'Performance Metrics'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{isRTL ? 'مدة الجلسة' : 'Session Duration'}</span>
                <span className="text-sm text-muted-foreground">
                  {Math.floor(advancedData.performanceMetrics.sessionDuration / 60)}m {advancedData.performanceMetrics.sessionDuration % 60}s
                </span>
              </div>
              <Progress value={(advancedData.performanceMetrics.sessionDuration / 300) * 100} />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{isRTL ? 'معدل الارتداد' : 'Bounce Rate'}</span>
                <span className="text-sm text-muted-foreground">
                  {advancedData.performanceMetrics.bounceRate}%
                </span>
              </div>
              <Progress value={advancedData.performanceMetrics.bounceRate} />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{isRTL ? 'مشاهدات الصفحة' : 'Page Views'}</span>
                <span className="text-sm text-muted-foreground">
                  {advancedData.performanceMetrics.pageViews}
                </span>
              </div>
              <Progress value={Math.min(100, advancedData.performanceMetrics.pageViews)} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Competitive Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            {isRTL ? 'التحليل التنافسي' : 'Competitive Analysis'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">#{advancedData.competitiveAnalysis.position}</p>
              <p className="text-sm text-muted-foreground">{isRTL ? 'الترتيب' : 'Market Position'}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{advancedData.competitiveAnalysis.similarOpportunities}</p>
              <p className="text-sm text-muted-foreground">{isRTL ? 'فرص مشابهة' : 'Similar Opportunities'}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{advancedData.competitiveAnalysis.marketShare}%</p>
              <p className="text-sm text-muted-foreground">{isRTL ? 'حصة السوق' : 'Market Share'}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{advancedData.competitiveAnalysis.uniqueValue}</p>
              <p className="text-sm text-muted-foreground">{isRTL ? 'نقاط التميز' : 'Unique Value'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};