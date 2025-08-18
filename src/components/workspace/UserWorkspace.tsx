import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useUserWorkspaceData } from '@/hooks/useWorkspaceData';
import { useWorkspaceAnalytics } from '@/hooks/useWorkspaceAnalytics';
import { useWorkspaceNotifications } from '@/hooks/useWorkspaceNotifications';
import { 
  User, 
  Trophy, 
  BookOpen, 
  Users, 
  Target, 
  TrendingUp,
  Bell,
  MessageSquare,
  Award,
  Clock
} from 'lucide-react';

interface UserWorkspaceProps {
  userId: string;
}

export const UserWorkspace: React.FC<UserWorkspaceProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const { t, isRTL } = useUnifiedTranslation();
  const tw = React.useCallback((key: string, params?: Record<string, any>) => t(`workspace.user.${key}`, params), [t]);

  const { 
    data: workspaceData,
    isLoading: isDataLoading 
  } = useUserWorkspaceData();

  const {
    data: analytics,
    isLoading: isAnalyticsLoading
  } = useWorkspaceAnalytics({
    workspaceType: 'user',
    workspaceId: `user-${userId}`,
    timeframe: '30d'
  });

  const {
    notifications,
    unreadCount,
    markAsRead,
    isLoading: isNotificationsLoading
  } = useWorkspaceNotifications({
    workspaceType: 'user',
    workspaceId: `user-${userId}`,
    realTimeUpdates: true
  });

  if (isDataLoading || isAnalyticsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {tw('header.welcome_back')}
          </h1>
          <p className="text-muted-foreground">
            {tw('header.personal_innovation_space')}
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Bell className="w-4 h-4 mr-2" />
          {tw('actions.notifications')}
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {tw('stats.submissions')}
                </p>
                <p className="text-2xl font-bold text-foreground">12</p>
              </div>
              <Target className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">{tw('tabs.dashboard')}</TabsTrigger>
          <TabsTrigger value="achievements">{tw('tabs.achievements')}</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{tw('dashboard.recent_activities')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{tw('dashboard.no_activities')}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{tw('achievements.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{tw('achievements.coming_soon')}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};