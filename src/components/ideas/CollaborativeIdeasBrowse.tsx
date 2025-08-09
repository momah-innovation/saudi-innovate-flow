import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { ActivityFeed } from '@/components/collaboration/ActivityFeed';
import { UserPresence } from '@/components/collaboration/UserPresence';
import { CollaborationWidget } from '@/components/collaboration/CollaborationWidget';
import { 
  Users, 
  MessageSquare, 
  Eye, 
  TrendingUp, 
  Clock,
  Lightbulb,
  Heart,
  MessageCircle
} from 'lucide-react';

interface Idea {
  id: string;
  title_ar: string;
  description_ar: string;
  status: string;
  innovator_id: string;
  likes_count?: number;
  comments_count?: number;
  views_count?: number;
}

interface CollaborativeIdeasBrowseProps {
  ideas: Idea[];
  onIdeaSelect: (idea: Idea) => void;
  viewMode?: 'cards' | 'list' | 'grid';
  activeTab?: string;
}

export const CollaborativeIdeasBrowse: React.FC<CollaborativeIdeasBrowseProps> = ({
  ideas,
  onIdeaSelect,
  viewMode = 'cards',
  activeTab = 'published'
}) => {
  const { onlineUsers, activities, isConnected, startCollaboration } = useCollaboration();
  const [realtimeStats, setRealtimeStats] = useState({
    totalViewers: 0,
    activeIdeas: 0,
    recentComments: 0
  });

  // Calculate collaboration stats
  useEffect(() => {
    const browseViewers = onlineUsers.filter(user => 
      user.current_location.page?.includes('/ideas')
    );
    
    const recentActivities = activities.filter(activity => 
      activity.entity_type === 'idea' && 
      Date.now() - new Date(activity.created_at).getTime() < 5 * 60 * 1000 // Last 5 minutes
    );

    setRealtimeStats({
      totalViewers: browseViewers.length,
      activeIdeas: activities.filter(a => 
        a.entity_type === 'idea' && a.event_type === 'create'
      ).length,
      recentComments: activities.filter(a => 
        a.entity_type === 'idea' && a.event_type === 'comment'
      ).length
    });
  }, [onlineUsers, activities]);

  // Start collaboration for ideas browse
  useEffect(() => {
    if (isConnected) {
      startCollaboration('ideas', 'browse');
    }
  }, [isConnected, startCollaboration]);

  const renderCollaborationHeader = () => (
    <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Users className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">المبدعون النشطون</span>
            </div>
            <UserPresence 
              users={onlineUsers.filter(user => 
                user.current_location.page?.includes('/ideas')
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
                  <p>المشاهدون النشطون</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Lightbulb className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-semibold text-yellow-600">
                      {realtimeStats.activeIdeas}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>الأفكار الجديدة</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <MessageCircle className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-600">
                      {realtimeStats.recentComments}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>التعليقات الأخيرة</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderIdeaCard = (idea: Idea) => {
    const ideaViewers = onlineUsers.filter(user => 
      user.current_location.entity_type === 'idea' && 
      user.current_location.entity_id === idea.id
    );

    return (
      <Card key={idea.id} className="group hover:shadow-lg transition-all duration-200 relative overflow-hidden">
        {/* Real-time viewers indicator */}
        {ideaViewers.length > 0 && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1 rtl:space-x-reverse">
              <Eye className="w-3 h-3" />
              <span>{ideaViewers.length}</span>
            </div>
          </div>
        )}

        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary cursor-pointer"
                  onClick={() => onIdeaSelect(idea)}>
                {idea.title_ar}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
                {idea.description_ar}
              </p>
            </div>
          </div>

          {/* Collaboration indicators */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-sm">{idea.likes_count || 0}</span>
              </div>
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <MessageCircle className="w-4 h-4 text-blue-500" />
                <span className="text-sm">{idea.comments_count || 0}</span>
              </div>
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <Eye className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{idea.views_count || 0}</span>
              </div>
            </div>

            {/* Live viewers */}
            {ideaViewers.length > 0 && (
              <div className="flex -space-x-1 rtl:space-x-reverse">
                {ideaViewers.slice(0, 3).map((user, index) => (
                  <Avatar key={index} className="w-6 h-6 border-2 border-background">
                    <AvatarImage src={user.user_info.avatar_url} />
                    <AvatarFallback className="text-xs bg-green-500 text-white">
                      {user.user_info.display_name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {ideaViewers.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                    +{ideaViewers.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderTrendingIdeas = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
          <TrendingUp className="w-5 h-5" />
          <span>الأفكار الرائجة</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {ideas.slice(0, 5).map((idea, index) => {
            const viewers = onlineUsers.filter(user => 
              user.current_location.entity_type === 'idea' && 
              user.current_location.entity_id === idea.id
            );
            
            return (
              <div key={idea.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted/80 cursor-pointer"
                   onClick={() => onIdeaSelect(idea)}>
                <div className="flex-1">
                  <p className="text-sm font-medium truncate">{idea.title_ar}</p>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mt-1">
                    <Badge variant="secondary" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {viewers.length} مشاهد • {idea.likes_count || 0} إعجاب
                    </span>
                  </div>
                </div>
                <div className="flex -space-x-1 rtl:space-x-reverse">
                  {viewers.slice(0, 2).map((user, userIndex) => (
                    <Avatar key={userIndex} className="w-5 h-5 border border-background">
                      <AvatarImage src={user.user_info.avatar_url} />
                      <AvatarFallback className="text-xs bg-primary text-white">
                        {user.user_info.display_name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {viewers.length > 2 && (
                    <div className="w-5 h-5 rounded-full bg-muted border border-background flex items-center justify-center text-xs font-medium">
                      +{viewers.length - 2}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map(renderIdeaCard)}
            </div>
          )}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ideas.map(renderIdeaCard)}
            </div>
          )}
          {viewMode === 'list' && (
            <div className="space-y-4">
              {ideas.map(renderIdeaCard)}
            </div>
          )}
          
          {ideas.length === 0 && (
            <Card className="p-8 text-center">
              <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا توجد أفكار متاحة</h3>
              <p className="text-muted-foreground">
                لم يتم العثور على أفكار تطابق المعايير المحددة.
              </p>
            </Card>
          )}
        </div>
        
        <div className="w-80 space-y-6">
          {renderTrendingIdeas()}
          
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
        contextId="ideas-browse"
        entityType="ideas"
        entityId="browse"
        position="bottom-right"
      />
    </div>
  );
};