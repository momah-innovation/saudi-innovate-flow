import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { CollaborativeChallengeCard } from './CollaborativeChallengeCard';
import { ActivityFeed } from '@/components/collaboration/ActivityFeed';
import { UserPresence } from '@/components/collaboration/UserPresence';
import { CollaborationWidget } from '@/components/collaboration/CollaborationWidget';
import { 
  Users, 
  MessageSquare, 
  Eye, 
  TrendingUp, 
  Clock,
  Trophy,
  Target,
  Zap
} from 'lucide-react';

interface Challenge {
  id: string;
  title_ar: string;
  description_ar: string;
  status: string;
  priority_level: string;
  start_date: string;
  end_date: string;
  participants_count?: number;
  submissions_count?: number;
}

interface CollaborativeChallengesBrowseProps {
  challenges: Challenge[];
  onChallengeSelect: (challenge: Challenge) => void;
  viewMode?: 'cards' | 'list' | 'grid';
  activeTab?: string;
}

export const CollaborativeChallengesBrowse: React.FC<CollaborativeChallengesBrowseProps> = ({
  challenges,
  onChallengeSelect,
  viewMode = 'cards',
  activeTab = 'active'
}) => {
  const { onlineUsers, activities, isConnected, startCollaboration } = useCollaboration();
  const [realtimeStats, setRealtimeStats] = useState({
    totalViewers: 0,
    activeParticipants: 0,
    recentSubmissions: 0
  });

  // Calculate collaboration stats
  useEffect(() => {
    const browseViewers = onlineUsers.filter(user => 
      user.current_location.page?.includes('/challenges')
    );
    
    const recentActivities = activities.filter(activity => 
      activity.entity_type === 'challenge' && 
      Date.now() - new Date(activity.created_at).getTime() < 5 * 60 * 1000 // Last 5 minutes
    );

    setRealtimeStats({
      totalViewers: browseViewers.length,
      activeParticipants: activities.filter(a => 
        a.entity_type === 'challenge' && a.event_type === 'join'
      ).length,
      recentSubmissions: activities.filter(a => 
        a.entity_type === 'challenge' && a.event_type === 'create'
      ).length
    });
  }, [onlineUsers, activities]);

  // Start collaboration for challenges browse
  useEffect(() => {
    if (isConnected) {
      startCollaboration('challenges', 'browse');
    }
  }, [isConnected, startCollaboration]);

  const renderCollaborationHeader = () => (
    <Card className="mb-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-orange-200 dark:border-orange-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Users className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium">المتسابقون النشطون</span>
            </div>
            <UserPresence 
              users={onlineUsers.filter(user => 
                user.current_location.page?.includes('/challenges')
              )}
              maxVisible={6}
              showStatus={true}
              size="sm"
            />
          </div>

          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-600">
                      {realtimeStats.totalViewers}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>المتصفحون النشطون</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Target className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-600">
                      {realtimeStats.activeParticipants}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>المشاركون النشطون</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Zap className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-600">
                      {realtimeStats.recentSubmissions}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>المقترحات الأخيرة</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCollaborativeGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {challenges.map((challenge) => (
        <CollaborativeChallengeCard
          key={challenge.id}
          challenge={challenge}
          onViewDetails={onChallengeSelect}
          onParticipate={onChallengeSelect}
          showCollaboration={true}
        />
      ))}
    </div>
  );

  const renderCollaborativeList = () => (
    <div className="space-y-4">
      {challenges.map((challenge) => (
        <CollaborativeChallengeCard
          key={challenge.id}
          challenge={challenge}
          onViewDetails={onChallengeSelect}
          onParticipate={onChallengeSelect}
          showCollaboration={true}
        />
      ))}
    </div>
  );

  const renderHotChallenges = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <span>التحديات الساخنة</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {challenges.slice(0, 5).map((challenge, index) => {
            const viewers = onlineUsers.filter(user => 
              user.current_location.entity_type === 'challenge' && 
              user.current_location.entity_id === challenge.id
            );
            
            const getPriorityColor = (priority: string) => {
              switch (priority) {
                case 'high': return 'bg-red-500';
                case 'medium': return 'bg-orange-500';
                case 'low': return 'bg-green-500';
                default: return 'bg-gray-500';
              }
            };
            
            return (
              <div key={challenge.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/80 cursor-pointer transition-colors"
                   onClick={() => onChallengeSelect(challenge)}>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(challenge.priority_level)}`} />
                    <p className="text-sm font-medium truncate">{challenge.title_ar}</p>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {viewers.length} متصفح • {challenge.participants_count || 0} مشارك
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mt-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      ينتهي في {new Date(challenge.end_date).toLocaleDateString('ar')}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {viewers.length > 0 && (
                    <div className="flex -space-x-1 rtl:space-x-reverse">
                      {viewers.slice(0, 3).map((user, userIndex) => (
                        <Avatar key={userIndex} className="w-5 h-5 border border-background">
                          <AvatarImage src={user.user_info.avatar_url} />
                          <AvatarFallback className="text-xs bg-primary text-white">
                            {user.user_info.display_name?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {viewers.length > 3 && (
                        <div className="w-5 h-5 rounded-full bg-muted border border-background flex items-center justify-center text-xs font-medium">
                          +{viewers.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {challenge.status}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  const renderLeaderboard = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span>لوحة المتصدرين</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {challenges
            .sort((a, b) => (b.submissions_count || 0) - (a.submissions_count || 0))
            .slice(0, 3)
            .map((challenge, index) => (
              <div key={challenge.id} className="flex items-center space-x-3 rtl:space-x-reverse p-2 rounded-lg bg-muted/30">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                  index === 0 ? 'bg-yellow-500' : 
                  index === 1 ? 'bg-gray-400' : 
                  'bg-orange-400'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium truncate">{challenge.title_ar}</p>
                  <p className="text-xs text-muted-foreground">
                    {challenge.submissions_count || 0} مقترح
                  </p>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">جاري الاتصال بنظام التعاون...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {renderCollaborationHeader()}
      
      <div className="flex gap-6">
        <div className="flex-1">
          {viewMode === 'grid' && renderCollaborativeGrid()}
          {viewMode === 'cards' && renderCollaborativeGrid()}
          {viewMode === 'list' && renderCollaborativeList()}
          
          {challenges.length === 0 && (
            <Card className="p-8 text-center">
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا توجد تحديات متاحة</h3>
              <p className="text-muted-foreground">
                لم يتم العثور على تحديات تطابق المعايير المحددة.
              </p>
            </Card>
          )}
        </div>
        
        <div className="w-80 space-y-6">
          {renderHotChallenges()}
          {renderLeaderboard()}
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <MessageSquare className="w-5 h-5" />
                <span>النشاط المباشر</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed
                scope="all"
                limit={8}
                showFilters={false}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <CollaborationWidget
        contextType="global"
        contextId="challenges-browse"
        entityType="challenges"
        entityId="browse"
        position="bottom-right"
      />
    </div>
  );
};