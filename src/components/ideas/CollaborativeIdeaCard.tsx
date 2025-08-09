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
  Sparkles,
  Star
} from 'lucide-react';

interface IdeaCard {
  id: string;
  title_ar: string;
  description_ar: string;
  status: string;
  innovator_id: string;
  likes_count?: number;
  comments_count?: number;
  views_count?: number;
  rating?: number;
  maturity_level?: string;
}

interface CollaborativeIdeaCardProps {
  idea: IdeaCard;
  onViewDetails: (idea: IdeaCard) => void;
  onLike?: (idea: IdeaCard) => void;
  onBookmark?: (idea: IdeaCard) => void;
  showCollaboration?: boolean;
  layout?: 'vertical' | 'horizontal';
}

export const CollaborativeIdeaCard: React.FC<CollaborativeIdeaCardProps> = ({
  idea,
  onViewDetails,
  onLike,
  onBookmark,
  showCollaboration = true,
  layout = 'vertical'
}) => {
  const { onlineUsers, activities, isConnected, startCollaboration } = useCollaboration();
  const [liveStats, setLiveStats] = useState({
    viewers: 0,
    likes: idea.likes_count || 0,
    comments: idea.comments_count || 0
  });

  // Calculate real-time viewers for this idea
  useEffect(() => {
    const ideaViewers = onlineUsers.filter(user => 
      user.current_location.entity_type === 'idea' && 
      user.current_location.entity_id === idea.id
    );

    const recentLikes = activities.filter(activity => 
      activity.entity_type === 'idea' && 
      activity.entity_id === idea.id && 
      activity.event_type === 'like' &&
      Date.now() - new Date(activity.created_at).getTime() < 60 * 1000 // Last minute
    );

    setLiveStats({
      viewers: ideaViewers.length,
      likes: (idea.likes_count || 0) + recentLikes.length,
      comments: idea.comments_count || 0
    });
  }, [onlineUsers, activities, idea.id, idea.likes_count, idea.comments_count]);

  // Start collaboration when viewing idea
  const handleIdeaClick = () => {
    if (isConnected) {
      startCollaboration('idea', idea.id);
    }
    onViewDetails(idea);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'under_review': return 'bg-blue-500';
      case 'draft': return 'bg-gray-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getMaturityColor = (level: string) => {
    switch (level) {
      case 'concept': return 'text-purple-600';
      case 'prototype': return 'text-blue-600';
      case 'development': return 'text-orange-600';
      case 'implementation': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (layout === 'horizontal') {
    return (
      <Card className="group hover:shadow-lg transition-all duration-200 relative overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start space-x-4 rtl:space-x-reverse">
            {/* Collaboration Status Indicator */}
            {showCollaboration && liveStats.viewers > 0 && (
              <div className="absolute top-2 right-2 z-10">
                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1 rtl:space-x-reverse">
                  <Eye className="w-3 h-3" />
                  <span>{liveStats.viewers}</span>
                </div>
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 
                    className="font-semibold text-lg line-clamp-2 group-hover:text-primary cursor-pointer"
                    onClick={handleIdeaClick}
                  >
                    {idea.title_ar}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                    {idea.description_ar}
                  </p>
                </div>
                
                <div className="flex flex-col items-end space-y-2 ml-4">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(idea.status)}`} />
                  {idea.rating && (
                    <div className="flex items-center space-x-1">
                      {getRatingStars(idea.rating)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <Badge variant="secondary" className="text-xs">
                    {idea.status}
                  </Badge>
                  {idea.maturity_level && (
                    <span className={`text-xs font-medium ${getMaturityColor(idea.maturity_level)}`}>
                      {idea.maturity_level}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <Eye className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{idea.views_count || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <Sparkles className="w-4 h-4 text-red-500" />
                    <span className="text-sm">{liveStats.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">{liveStats.comments}</span>
                  </div>
                </div>
              </div>

              {/* Live viewers */}
              {showCollaboration && liveStats.viewers > 0 && (
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <span className="text-xs text-muted-foreground">مشاهدون الآن:</span>
                  <div className="flex -space-x-1 rtl:space-x-reverse">
                    {onlineUsers
                      .filter(user => 
                        user.current_location.entity_type === 'idea' && 
                        user.current_location.entity_id === idea.id
                      )
                      .slice(0, 3)
                      .map((user, index) => (
                        <Avatar key={index} className="w-6 h-6 border-2 border-background">
                          <AvatarImage src={user.user_info.avatar_url} />
                          <AvatarFallback className="text-xs bg-green-500 text-white">
                            {user.user_info.display_name?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    {liveStats.viewers > 3 && (
                      <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                        +{liveStats.viewers - 3}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 relative overflow-hidden">
      {/* Real-time viewers indicator */}
      {showCollaboration && liveStats.viewers > 0 && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1 rtl:space-x-reverse">
            <Eye className="w-3 h-3" />
            <span>{liveStats.viewers}</span>
          </div>
        </div>
      )}

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(idea.status)}`} />
              <Badge variant="secondary" className="text-xs">
                {idea.status}
              </Badge>
              {idea.maturity_level && (
                <span className={`text-xs font-medium ${getMaturityColor(idea.maturity_level)}`}>
                  {idea.maturity_level}
                </span>
              )}
            </div>
            
            <h3 
              className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary cursor-pointer"
              onClick={handleIdeaClick}
            >
              {idea.title_ar}
            </h3>
            
            <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
              {idea.description_ar}
            </p>
            
            {idea.rating && (
              <div className="flex items-center space-x-1 rtl:space-x-reverse mb-3">
                {getRatingStars(idea.rating)}
                <span className="text-xs text-muted-foreground ml-1">({idea.rating}/5)</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats and collaboration indicators */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              <Eye className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{idea.views_count || 0}</span>
            </div>
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              <Sparkles className="w-4 h-4 text-red-500" />
              <span className="text-sm">{liveStats.likes}</span>
            </div>
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span className="text-sm">{liveStats.comments}</span>
            </div>
          </div>

          {/* Live viewers */}
          {showCollaboration && liveStats.viewers > 0 && (
            <div className="flex -space-x-1 rtl:space-x-reverse">
              {onlineUsers
                .filter(user => 
                  user.current_location.entity_type === 'idea' && 
                  user.current_location.entity_id === idea.id
                )
                .slice(0, 3)
                .map((user, index) => (
                  <Avatar key={index} className="w-6 h-6 border-2 border-background">
                    <AvatarImage src={user.user_info.avatar_url} />
                    <AvatarFallback className="text-xs bg-green-500 text-white">
                      {user.user_info.display_name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                ))}
              {liveStats.viewers > 3 && (
                <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                  +{liveStats.viewers - 3}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleIdeaClick}
            className="flex-1 mr-2"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            عرض التفاصيل
          </Button>
          
          {onLike && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onLike(idea)}
              className="px-3"
            >
              <Sparkles className="w-4 h-4" />
            </Button>
          )}
          
          {onBookmark && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onBookmark(idea)}
              className="px-3"
            >
              <Star className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};