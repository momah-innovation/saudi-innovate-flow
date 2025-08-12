import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { LiveEngagementMonitor } from "@/components/admin/analytics/LiveEngagementMonitor";
import { ParticipationTrendAnalyzer } from "@/components/admin/analytics/ParticipationTrendAnalyzer";
import { ViewingSessionAnalytics } from "@/components/admin/analytics/ViewingSessionAnalytics";
import { Activity, TrendingUp, Users, Eye } from "lucide-react";

export default function ChallengesAnalyticsAdvanced() {
  const { t } = useUnifiedTranslation();
  const [timeRange, setTimeRange] = useState("7d");

  const breadcrumbs = [
    { label: t("admin"), href: "/dashboard" },
    { label: t("analytics"), href: "/admin/analytics-advanced" },
    { label: t("challenges_analytics") }
  ];

  return (
    <AdminLayout title={t("challenges_analytics")} breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        <PageHeader
          title={t("challenges_analytics")}
          description={t("comprehensive_challenge_engagement_analytics")}
        />

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("active_challenges")}
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">
                +5 {t("from_last_month")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("total_participants")}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +12% {t("from_last_week")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("engagement_rate")}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68.5%</div>
              <p className="text-xs text-muted-foreground">
                +2.3% {t("from_yesterday")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("avg_session_duration")}
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8m 42s</div>
              <p className="text-xs text-muted-foreground">
                +1m 15s {t("from_average")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="live-engagement" className="space-y-4">
          <TabsList>
            <TabsTrigger value="live-engagement">{t("live_engagement")}</TabsTrigger>
            <TabsTrigger value="participation-trends">{t("participation_trends")}</TabsTrigger>
            <TabsTrigger value="viewing-sessions">{t("viewing_sessions")}</TabsTrigger>
            <TabsTrigger value="performance">{t("performance_metrics")}</TabsTrigger>
          </TabsList>

          <TabsContent value="live-engagement" className="space-y-4">
            <LiveEngagementMonitor timeRange={timeRange} />
          </TabsContent>

          <TabsContent value="participation-trends" className="space-y-4">
            <ParticipationTrendAnalyzer timeRange={timeRange} />
          </TabsContent>

          <TabsContent value="viewing-sessions" className="space-y-4">
            <ViewingSessionAnalytics timeRange={timeRange} />
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("challenge_performance_metrics")}</CardTitle>
                  <CardDescription>
                    {t("success_indicators_and_completion_rates")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t("completion_rate")}</span>
                      <span className="text-sm text-muted-foreground">73.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t("quality_score")}</span>
                      <span className="text-sm text-muted-foreground">8.4/10</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t("expert_approval_rate")}</span>
                      <span className="text-sm text-muted-foreground">85.6%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("user_interaction_insights")}</CardTitle>
                  <CardDescription>
                    {t("engagement_patterns_and_behaviors")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t("peak_activity_time")}</span>
                      <span className="text-sm text-muted-foreground">2:00 PM - 4:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t("most_active_day")}</span>
                      <span className="text-sm text-muted-foreground">{t("wednesday")}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t("avg_submissions_per_user")}</span>
                      <span className="text-sm text-muted-foreground">2.3</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}