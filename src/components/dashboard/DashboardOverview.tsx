import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Lightbulb, 
  Users, 
  Calendar, 
  TrendingUp, 
  Award, 
  Plus,
  ArrowRight,
  BarChart3,
  Target,
  Zap,
  Star
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { logger } from '@/utils/logger';

interface DashboardStats {
  totalIdeas: number;
  totalChallenges: number;
  totalEvents: number;
  totalUsers: number;
  userIdeas: number;
  userChallenges: number;
  userEvents: number;
}

export const DashboardOverview = () => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalIdeas: 0,
    totalChallenges: 0,
    totalEvents: 0,
    totalUsers: 0,
    userIdeas: 0,
    userChallenges: 0,
    userEvents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, [user]);

  // Use optimized hooks for dashboard data
  const { data: dashboardCounts } = useOptimizedDashboardCounts();
  const { data: userStats } = useOptimizedUserSpecificCounts(user?.id);

  const loadDashboardStats = async () => {
    if (!dashboardCounts) return;
    
    try {


  const quickActions = [
    {
      title: t('dashboard_overview.submit_new_idea'),
      description: t('dashboard_overview.share_innovative_idea'),
      icon: Lightbulb,
      href: '/ideas/submit',
      color: 'from-blue-500 to-purple-600',
    },
    {
      title: t('dashboard_overview.browse_challenges'),
      description: t('dashboard_overview.discover_new_challenges'),
      icon: Target,
      href: '/challenges',
      color: 'from-green-500 to-teal-600',
    },
    {
      title: t('dashboard_overview.upcoming_events_action'),
      description: t('dashboard_overview.join_upcoming_events'),
      icon: Calendar,
      href: '/events',
      color: 'from-orange-500 to-red-600',
    },
    {
      title: t('dashboard_overview.new_partnerships'),
      description: t('dashboard_overview.explore_partnerships'),
      icon: Users,
      href: '/partners',
      color: 'from-purple-500 to-pink-600',
    },
  ];

  const recentActivities = [
    {
      type: 'idea',
      title: t('dashboard_overview.appointment_management_accepted'),
      time: t('dashboard_overview.hours_ago_2'),
      icon: Lightbulb,
      color: 'text-blue-600',
    },
    {
      type: 'challenge',
      title: t('dashboard_overview.new_challenge_smart_cities'),
      time: t('dashboard_overview.hours_ago_4'),
      icon: Target,
      color: 'text-green-600',
    },
    {
      type: 'event',
      title: t('dashboard_overview.ai_workshop_registration'),
      time: t('dashboard_overview.yesterday'),
      icon: Calendar,
      color: 'text-orange-600',
    },
  ];

  if (loading) {
    return (
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Loading Skeleton */}
        <div className="animate-pulse space-y-4">
          <div className="h-6 sm:h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 sm:h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 p-3 sm:p-0">
      {/* Welcome Section */}
      <div className={cn(
        "text-center space-y-3 sm:space-y-4 px-4",
        isRTL && "text-right"
      )}>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {user ? 
            t('dashboard_overview.welcome_message_with_name', { name: user.user_metadata?.name || (isRTL ? 'مبتكر' : 'Innovator') }) : 
            t('dashboard_overview.welcome_message')
          }
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('dashboard_overview.platform_description')}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className={cn(
          "border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30",
          isRTL && "border-l-0 border-r-4 border-r-blue-500"
        )}>
          <CardHeader className="pb-2 sm:pb-3">
            <div className={cn(
              "flex items-center justify-between",
              isRTL && "flex-row-reverse"
            )}>
              <div className={cn(isRTL && "text-right")}>
                <CardTitle className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {stats.totalIdeas}
                </CardTitle>
                <CardDescription className="font-medium text-xs sm:text-sm">
                  {t('dashboard_overview.total_ideas')}
                </CardDescription>
              </div>
              <Lightbulb className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
            </div>
          </CardHeader>
          {user && (
            <CardContent className="pt-0">
              <div className="text-xs sm:text-sm text-muted-foreground">
                {t('dashboard_overview.your_ideas', { count: stats.userIdeas })}
              </div>
            </CardContent>
          )}
        </Card>

        <Card className={cn(
          "border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/30",
          isRTL && "border-l-0 border-r-4 border-r-green-500"
        )}>
          <CardHeader className="pb-2 sm:pb-3">
            <div className={cn(
              "flex items-center justify-between",
              isRTL && "flex-row-reverse"
            )}>
              <div className={cn(isRTL && "text-right")}>
                <CardTitle className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-300">
                  {stats.totalChallenges}
                </CardTitle>
                <CardDescription className="font-medium text-xs sm:text-sm">
                  {t('dashboard_overview.active_challenges')}
                </CardDescription>
              </div>
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
            </div>
          </CardHeader>
          {user && (
            <CardContent className="pt-0">
              <div className="text-xs sm:text-sm text-muted-foreground">
                {t('dashboard_overview.your_participations', { count: stats.userChallenges })}
              </div>
            </CardContent>
          )}
        </Card>

        <Card className={cn(
          "border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/50 dark:to-orange-900/30",
          isRTL && "border-l-0 border-r-4 border-r-orange-500"
        )}>
          <CardHeader className="pb-2 sm:pb-3">
            <div className={cn(
              "flex items-center justify-between",
              isRTL && "flex-row-reverse"
            )}>
              <div className={cn(isRTL && "text-right")}>
                <CardTitle className="text-xl sm:text-2xl font-bold text-orange-700 dark:text-orange-300">
                  {stats.totalEvents}
                </CardTitle>
                <CardDescription className="font-medium text-xs sm:text-sm">
                  {t('dashboard_overview.upcoming_events')}
                </CardDescription>
              </div>
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
            </div>
          </CardHeader>
          {user && (
            <CardContent className="pt-0">
              <div className="text-xs sm:text-sm text-muted-foreground">
                {t('dashboard_overview.your_registrations', { count: stats.userEvents })}
              </div>
            </CardContent>
          )}
        </Card>

        <Card className={cn(
          "border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/30",
          isRTL && "border-l-0 border-r-4 border-r-purple-500"
        )}>
          <CardHeader className="pb-2 sm:pb-3">
            <div className={cn(
              "flex items-center justify-between",
              isRTL && "flex-row-reverse"
            )}>
              <div className={cn(isRTL && "text-right")}>
                <CardTitle className="text-xl sm:text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {stats.totalUsers}
                </CardTitle>
                <CardDescription className="font-medium text-xs sm:text-sm">
                  {t('dashboard_overview.active_innovators')}
                </CardDescription>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs sm:text-sm text-muted-foreground">
              {t('dashboard_overview.join_community')}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className={cn(
                "flex items-center gap-2 text-base sm:text-lg",
                isRTL && "flex-row-reverse"
              )}>
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                {t('dashboard_overview.quick_actions')}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {t('dashboard_overview.start_innovation_journey')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <Card 
                      key={index} 
                      className="group card-hover-optimized cursor-pointer border-2 hover:border-primary/20 touch-manipulation"
                    >
                      <CardContent className="p-3 sm:p-4">
                        <div className={cn(
                          "flex items-start gap-2 sm:gap-3",
                          isRTL && "flex-row-reverse"
                        )}>
                          <div className={cn(
                            "p-1.5 sm:p-2 rounded-lg bg-gradient-to-r text-white shrink-0",
                            action.color
                          )}>
                            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div className={cn(
                            "flex-1 min-w-0",
                            isRTL && "text-right"
                          )}>
                            <h3 className="font-semibold text-sm sm:text-base mb-1 group-hover:text-primary transition-colors">
                              {action.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                              {action.description}
                            </p>
                          </div>
                          <ArrowRight className={cn(
                            "w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0",
                            isRTL && "rotate-180"
                          )} />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {t('dashboard_overview.recent_activities')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="p-1 rounded-full bg-muted">
                        <IconComponent className={cn("w-4 h-4", activity.color)} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button variant="outline" className="w-full mt-4">
                {t('dashboard_overview.view_all_activities')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Progress Section for Authenticated Users */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              {t('dashboard_overview.platform_progress')}
            </CardTitle>
            <CardDescription>
              {t('dashboard_overview.keep_participating')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{t('dashboard_overview.activity_level')}</span>
                  <span>65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <Badge variant="secondary" className="mb-2">
                    {t('dashboard_overview.active_innovator')}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {t('dashboard_overview.participated_5_activities')}
                  </p>
                </div>
                
                <div className="text-center">
                  <Badge variant="outline" className="mb-2">
                    {t('dashboard_overview.challenger')}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {t('dashboard_overview.joined_2_challenges')}
                  </p>
                </div>
                
                <div className="text-center">
                  <Badge variant="outline" className="mb-2">
                    {t('dashboard_overview.learner')}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {t('dashboard_overview.attended_3_events')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};