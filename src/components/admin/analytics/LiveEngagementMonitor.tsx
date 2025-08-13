import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useAdminDashboardMetrics } from "@/hooks/useAdminDashboardMetrics";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Activity, Users, Eye, MessageCircle, Heart, Share2, RefreshCw } from "lucide-react";

interface LiveEngagementMonitorProps {
  timeRange: string;
}

export function LiveEngagementMonitor({ timeRange }: LiveEngagementMonitorProps) {
  const { t } = useUnifiedTranslation();
  const { metrics } = useAdminDashboardMetrics();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveData, setLiveData] = useState({
    activeUsers: metrics?.users?.active || 0,
    currentViews: metrics?.system?.activity?.activeUsers24h || 0,
    ongoingSubmissions: metrics?.challenges?.submissions || 0,
    newComments: metrics?.system?.activity?.events24h || 0,
    likesInLastHour: Math.round((metrics?.system?.activity?.events24h || 0) * 0.3),
    sharesInLastHour: Math.round((metrics?.system?.activity?.events24h || 0) * 0.1)
  });

  // Mock real-time data
  const engagementData = [
    { time: "10:00", views: 45, submissions: 5, comments: 12, likes: 23 },
    { time: "10:15", views: 52, submissions: 7, comments: 15, likes: 28 },
    { time: "10:30", views: 38, submissions: 3, comments: 8, likes: 19 },
    { time: "10:45", views: 67, submissions: 9, comments: 21, likes: 35 },
    { time: "11:00", views: 74, submissions: 12, comments: 18, likes: 42 },
    { time: "11:15", views: 59, submissions: 6, comments: 14, likes: 31 },
    { time: "11:30", views: 83, submissions: 8, comments: 25, likes: 47 }
  ];

  const challengeEngagement = [
    { name: "التحدي التكنولوجي الذكي", activeUsers: 34, submissions: 8, engagement: 85 },
    { name: "تحدي الابتكار المستدام", activeUsers: 28, submissions: 12, engagement: 92 },
    { name: "تحدي التطوير البرمجي", activeUsers: 45, submissions: 6, engagement: 78 },
    { name: "تحدي الذكاء الاصطناعي", activeUsers: 38, submissions: 15, engagement: 88 }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setLiveData(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
        currentViews: prev.currentViews + Math.floor(Math.random() * 15) - 7,
        ongoingSubmissions: prev.ongoingSubmissions + Math.floor(Math.random() * 5) - 2,
        newComments: prev.newComments + Math.floor(Math.random() * 8) - 4,
        likesInLastHour: prev.likesInLastHour + Math.floor(Math.random() * 20) - 10,
        sharesInLastHour: prev.sharesInLastHour + Math.floor(Math.random() * 6) - 3
      }));
      setIsRefreshing(false);
    }, 1000);
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Live Metrics Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t("live_engagement_monitor")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("real_time_activity_tracking")} • {t("last_updated")}: {new Date().toLocaleTimeString()}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {t("refresh")}
        </Button>
      </div>

      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">{t("active_users")}</p>
                <p className="text-2xl font-bold">{liveData.activeUsers}</p>
              </div>
            </div>
            <Badge variant="secondary" className="mt-2 text-xs">
              <Activity className="h-3 w-3 mr-1" />
              {t("live")}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">{t("current_views")}</p>
                <p className="text-2xl font-bold">{liveData.currentViews}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">{t("ongoing_submissions")}</p>
                <p className="text-2xl font-bold">{liveData.ongoingSubmissions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">{t("new_comments")}</p>
                <p className="text-2xl font-bold">{liveData.newComments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">{t("likes_last_hour")}</p>
                <p className="text-2xl font-bold">{liveData.likesInLastHour}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-cyan-500" />
              <div>
                <p className="text-sm font-medium">{t("shares_last_hour")}</p>
                <p className="text-2xl font-bold">{liveData.sharesInLastHour}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("real_time_activity")}</CardTitle>
            <CardDescription>
              {t("activity_over_last_2_hours")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="submissions" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="comments" stroke="#8b5cf6" strokeWidth={2} />
                <Line type="monotone" dataKey="likes" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("challenge_engagement_comparison")}</CardTitle>
            <CardDescription>
              {t("current_engagement_by_challenge")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={challengeEngagement} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="activeUsers" fill="#3b82f6" />
                <Bar dataKey="submissions" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Live Challenge Status */}
      <Card>
        <CardHeader>
          <CardTitle>{t("live_challenge_status")}</CardTitle>
          <CardDescription>
            {t("current_status_of_active_challenges")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {challengeEngagement.map((challenge, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">{challenge.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {challenge.activeUsers} {t("active_users")} • {challenge.submissions} {t("submissions")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={challenge.engagement > 85 ? "default" : challenge.engagement > 75 ? "secondary" : "outline"}
                  >
                    {challenge.engagement}% {t("engagement")}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-muted-foreground">{t("live")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}