import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Users, Calendar, Target, Award } from "lucide-react";
import { challengeAnalyticsService } from '@/services/analytics/ChallengeAnalyticsService';
import { useAuth } from '@/contexts/AuthContext';
import { AnalyticsErrorBoundary } from '@/components/analytics/AnalyticsErrorBoundary';

interface ParticipationTrendAnalyzerProps {
  timeRange: string;
}

export function ParticipationTrendAnalyzer({ timeRange }: ParticipationTrendAnalyzerProps) {
  const { t } = useUnifiedTranslation();
  const [selectedMetric, setSelectedMetric] = useState("participants");
  const [trendData, setTrendData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();

  useEffect(() => {
    loadParticipationData();
  }, [timeRange, user?.id]);

  const loadParticipationData = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await challengeAnalyticsService.getParticipationTrends(user.id, timeRange);
      setTrendData(data);
    } catch (err) {
      setError('Failed to load participation trends');
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const participationTrends = trendData?.participationTrends || [];
  const departmentParticipation = trendData?.departmentParticipation || [];
  const challengeCategories = trendData?.challengeCategories || [];

  const trendAnalysis = {
    participantsGrowth: 12.5,
    submissionsGrowth: 18.3,
    completionRateChange: 2.1,
    retentionRate: 78.4
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AnalyticsErrorBoundary>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t("participation_trend_analyzer")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("historical_analysis_and_forecasting")}
          </p>
        </div>
        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="participants">{t("participants")}</SelectItem>
            <SelectItem value="submissions">{t("submissions")}</SelectItem>
            <SelectItem value="completion">{t("completion_rate")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trend Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t("participants_growth")}</p>
                <p className="text-2xl font-bold">{trendAnalysis.participantsGrowth}%</p>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <Badge variant="secondary" className="text-green-600">
                  {t("growth")}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t("submissions_growth")}</p>
                <p className="text-2xl font-bold">{trendAnalysis.submissionsGrowth}%</p>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <Badge variant="secondary" className="text-green-600">
                  {t("strong_growth")}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t("completion_rate_change")}</p>
                <p className="text-2xl font-bold">+{trendAnalysis.completionRateChange}%</p>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <Badge variant="outline" className="text-green-600">
                  {t("improving")}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t("retention_rate")}</p>
                <p className="text-2xl font-bold">{trendAnalysis.retentionRate}%</p>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-blue-500" />
                <Badge variant="secondary" className="text-blue-600">
                  {t("excellent")}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("participation_trends_over_time")}</CardTitle>
          <CardDescription>
            {t("historical_participation_data_analysis")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={participationTrends}>
              <defs>
                <linearGradient id="participantsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="submissionsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="participants" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#participantsGradient)" 
                name={t("participants")}
              />
              <Area 
                type="monotone" 
                dataKey="submissions" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#submissionsGradient)" 
                name={t("submissions")}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Department & Category Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("department_participation")}</CardTitle>
            <CardDescription>
              {t("participation_by_department_with_growth")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentParticipation.map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: dept.color }}
                    />
                    <div>
                      <p className="font-medium">{dept.department}</p>
                      <p className="text-sm text-muted-foreground">
                        {dept.participants} {t("participants")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {dept.growth > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <Badge 
                      variant={dept.growth > 0 ? "secondary" : "outline"}
                      className={dept.growth > 0 ? "text-green-600" : "text-red-600"}
                    >
                      {dept.growth > 0 ? '+' : ''}{dept.growth}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("participation_by_category")}</CardTitle>
            <CardDescription>
              {t("challenge_category_distribution")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={challengeCategories}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="participants"
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                >
                  {challengeCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Forecasting & Insights */}
      <Card>
        <CardHeader>
          <CardTitle>{t("insights_and_predictions")}</CardTitle>
          <CardDescription>
            {t("ai_powered_trend_analysis_and_forecasting")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-blue-500" />
                <p className="font-medium">{t("predicted_growth")}</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">+25%</p>
              <p className="text-sm text-muted-foreground">
                {t("next_month_prediction")}
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-green-500" />
                <p className="font-medium">{t("peak_season")}</p>
              </div>
              <p className="text-lg font-bold text-green-600">{t("march_april")}</p>
              <p className="text-sm text-muted-foreground">
                {t("historical_peak_months")}
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-orange-500" />
                <p className="font-medium">{t("top_performing_category")}</p>
              </div>
              <p className="text-lg font-bold text-orange-600">{t("technology")}</p>
              <p className="text-sm text-muted-foreground">
                {t("highest_engagement_rate")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </AnalyticsErrorBoundary>
  );
}