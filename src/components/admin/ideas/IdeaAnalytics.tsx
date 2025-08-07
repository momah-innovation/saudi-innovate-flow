import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { ChartContainer } from "@/components/ui/chart";
import { TrendingUp, TrendingDown, Users, Lightbulb, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { isThisMonth, format, subMonths, isSameMonth } from "date-fns";
import { useSystemLists } from "@/hooks/useSystemLists";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

interface IdeaAnalyticsProps {
  className?: string;
}

export function IdeaAnalytics({ className }: IdeaAnalyticsProps) {
  const { t } = useUnifiedTranslation();
  const { generalStatusOptions, challengeTypes, experienceLevels, sectorTypes, tagCategories } = useSystemLists();
  
  // Mock data query - replace with actual API call
  const { data, isLoading, error } = useQuery({
    queryKey: ['idea-analytics'],
    queryFn: async () => {
      // Simulate API call
      return Array.from({ length: 50 }, (_, i) => ({
        id: `idea-${i + 1}`,
        title: `Idea ${i + 1}`,
        description: `Description for idea ${i + 1}`,
        status: 'draft',
        score: 0,
        maturity_level: 'beginner',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        submitter_id: 'placeholder-user',
        challenge_id: 'placeholder-challenge',
        focus_question_id: null,
        category: 'technology',
        sector: 'health',
        tags: ['innovation'],
      }));
    },
  });

  if (isLoading) return <div>{t('idea_analytics.loading')}</div>;
  if (error) return <div>{t('idea_analytics.error_loading')}</div>;
  if (!data?.length) return <div>{t('idea_analytics.no_data')}</div>;

  const ideas = data;

  // Calculate key metrics
  const totalIdeas = ideas.length;
  const implementedIdeas = ideas.filter(idea => idea.status === 'implemented').length;
  const pendingIdeas = ideas.filter(idea => idea.status === 'under_review').length;
  const averageScore = totalIdeas > 0 ? ideas.reduce((acc, idea) => acc + Number(idea.score), 0) / totalIdeas : 0;
  const implementationRate = totalIdeas > 0 ? (implementedIdeas / totalIdeas) * 100 : 0;

  // Growth calculations
  const currentMonthIdeas = ideas.filter(idea => 
    isThisMonth(new Date(idea.created_at))
  ).length;
  const previousMonthIdeas = ideas.filter(idea => 
    isSameMonth(new Date(idea.created_at), subMonths(new Date(), 1))
  ).length;
  const growthRate = previousMonthIdeas > 0 ? ((currentMonthIdeas - previousMonthIdeas) / previousMonthIdeas) * 100 : 0;

  // Status distribution
  const statusCounts = ideas.reduce((acc, idea) => {
    acc[idea.status] = (acc[idea.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count: Number(count),
    percentage: totalIdeas > 0 ? (Number(count) / totalIdeas) * 100 : 0
  }));

  // Maturity distribution
  const maturityCounts = ideas.reduce((acc, idea) => {
    acc[idea.maturity_level] = (acc[idea.maturity_level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const maturityDistribution = Object.entries(maturityCounts).map(([maturity, count]) => ({
    maturity,
    count: Number(count),
    percentage: totalIdeas > 0 ? (Number(count) / totalIdeas) * 100 : 0
  }));

  // Score distribution
  const scoreRanges = [
    { range: '0-25', min: 0, max: 25 },
    { range: '26-50', min: 26, max: 50 },
    { range: '51-75', min: 51, max: 75 },
    { range: '76-100', min: 76, max: 100 }
  ];

  const scoreDistribution = scoreRanges.map(range => ({
    range: range.range,
    count: ideas.filter(idea => 
      Number(idea.score) >= range.min && Number(idea.score) <= range.max
    ).length
  }));

  // Monthly trends
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    const monthIdeas = ideas.filter(idea => {
      const ideaDate = new Date(idea.created_at);
      return ideaDate.getMonth() === date.getMonth() && 
             ideaDate.getFullYear() === date.getFullYear();
    });
    
    return {
      month: format(date, 'MMM'),
      ideas: monthIdeas.length,
      implemented: monthIdeas.filter(idea => idea.status === 'implemented').length
    };
  });

  // Category distribution
  const categoryData = Object.entries(
    ideas.reduce((acc, idea) => {
      acc[idea.category] = (acc[idea.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([category, count]) => ({
    category,
    count: Number(count)
  }));

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title={t('idea_analytics.total_ideas')}
          value={totalIdeas}
          trend={{
            value: growthRate,
            label: t('idea_analytics.this_month'),
            direction: growthRate >= 0 ? "up" : "down"
          }}
          icon={<Lightbulb className="w-4 h-4" />}
          className="bg-card"
        />
        <MetricCard
          title={t('idea_analytics.implemented')}
          value={implementedIdeas}
          trend={{
            value: implementationRate,
            label: t('idea_analytics.success_rate'),
            direction: "up"
          }}
          icon={<CheckCircle className="w-4 h-4" />}
          className="bg-card"
        />
        <MetricCard
          title={t('idea_analytics.pending_review')}
          value={pendingIdeas}
          icon={<Clock className="w-4 h-4" />}
          className="bg-card"
        />
        <MetricCard
          title={t('idea_analytics.average_score')}
          value={Math.round(averageScore)}
          icon={<TrendingUp className="w-4 h-4" />}
          className="bg-card"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>{t('idea_analytics.status_distribution')}</CardTitle>
            <CardDescription>{t('idea_analytics.status_distribution_desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statusDistribution.map((item, index) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm capitalize">{item.status}</span>
                  </div>
                  <Badge variant="outline">{item.percentage.toFixed(1)}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>{t('idea_analytics.score_distribution')}</CardTitle>
            <CardDescription>{t('idea_analytics.score_distribution_desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scoreDistribution.map((item, index) => (
                <div key={item.range} className="flex items-center justify-between">
                  <span className="text-sm">{item.range}</span>
                  <Badge variant="secondary">{item.count} {t('idea_analytics.ideas')}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>{t('idea_analytics.monthly_trends')}</CardTitle>
            <CardDescription>{t('idea_analytics.monthly_trends_desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthlyData.slice(-6).map((item, index) => (
                <div key={item.month} className="flex items-center justify-between">
                  <span className="text-sm">{item.month}</span>
                  <div className="flex gap-2">
                    <Badge variant="outline">{item.ideas} {t('idea_analytics.submitted')}</Badge>
                    <Badge variant="secondary">{item.implemented} {t('idea_analytics.implemented_lower')}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>{t('idea_analytics.category_distribution')}</CardTitle>
            <CardDescription>{t('idea_analytics.category_distribution_desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryData.map((item, index) => (
                <div key={item.category} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{item.category}</span>
                  <Badge variant="outline">{item.count} {t('idea_analytics.ideas')}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maturity Level Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>{t('idea_analytics.maturity_level_distribution')}</CardTitle>
          <CardDescription>{t('idea_analytics.maturity_level_desc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {maturityDistribution.map((item, index) => (
              <div key={item.maturity} className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {item.count}
                </div>
                <div className="text-sm text-muted-foreground capitalize">
                  {item.maturity}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {item.percentage.toFixed(1)}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}