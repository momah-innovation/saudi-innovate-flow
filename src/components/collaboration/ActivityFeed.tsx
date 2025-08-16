import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  MessageSquare, 
  Heart, 
  Share2, 
  UserPlus, 
  FileText,
  Filter
} from 'lucide-react';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
// import type { ActivityEvent } from '@/types/collaboration';

const activityIcons = {
  create: <FileText className="w-4 h-4" />,
  update: <Activity className="w-4 h-4" />,
  comment: <MessageSquare className="w-4 h-4" />,
  like: <Heart className="w-4 h-4" />,
  share: <Share2 className="w-4 h-4" />,
  join: <UserPlus className="w-4 h-4" />,
  leave: <UserPlus className="w-4 h-4" />,
  delete: <Activity className="w-4 h-4" />
};

// Use unified translation system for labels
const getEntityTypeLabel = (t: any, type: string) => {
  const key = `collaboration.entity_${type}`;
  return t(key, type);
};

const getEventTypeLabel = (t: any, type: string) => {
  const key = `collaboration.activity_${type}`;
  return t(key, type);
};

interface ActivityFeedProps {
  scope?: 'all' | 'organization' | 'team';
  teamId?: string;
  limit?: number;
  showFilters?: boolean;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  scope = 'all',
  teamId,
  limit = 50,
  showFilters = true
}) => {
  const { activities, organizationActivities, teamActivities } = useCollaboration();
  const { t } = useUnifiedTranslation();
  const [selectedEntityType, setSelectedEntityType] = useState<string>('all');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');

  // Get activities based on scope
  const getActivities = (): any[] => {
    switch (scope) {
      case 'organization':
        return organizationActivities;
      case 'team':
        return teamId ? (teamActivities[teamId] || []) : [];
      default:
        return activities;
    }
  };

  // Filter activities
  const filteredActivities = getActivities()
    .filter(activity => {
      if (selectedEntityType !== 'all' && activity.entity_type !== selectedEntityType) {
        return false;
      }
      if (selectedEventType !== 'all' && activity.event_type !== selectedEventType) {
        return false;
      }
      return true;
    })
    .slice(0, limit);

  const formatActivityDescription = (activity: any): string => {
    const entityLabel = getEntityTypeLabel(t, activity.entity_type);
    const eventLabel = getEventTypeLabel(t, activity.event_type);
    
    return `${eventLabel} ${entityLabel}`;
  };

  const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('collaboration.time_now');
    if (diffMins < 60) return t('collaboration.time_minutes_ago', { count: diffMins });
    if (diffHours < 24) return t('collaboration.time_hours_ago', { count: diffHours });
    return t('collaboration.time_days_ago', { count: diffDays });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            {t('collaboration.activity_feed')}
          </CardTitle>
          {showFilters && (
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 ml-2" />
              {t('collaboration.filter')}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showFilters && (
          <Tabs defaultValue="all" className="mb-4">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="all">{t('collaboration.all_activities')}</TabsTrigger>
              <TabsTrigger value="entity">{t('collaboration.content_type')}</TabsTrigger>
              <TabsTrigger value="event">{t('collaboration.activity_type')}</TabsTrigger>
            </TabsList>
            <TabsContent value="entity" className="mt-2">
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={selectedEntityType === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedEntityType('all')}
                >
                  {t('collaboration.all_activities')}
                </Badge>
                {['challenge', 'idea', 'event', 'opportunity', 'campaign', 'workspace', 'project'].map((key) => (
                  <Badge
                    key={key}
                    variant={selectedEntityType === key ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedEntityType(key)}
                  >
                    {getEntityTypeLabel(t, key)}
                  </Badge>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="event" className="mt-2">
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={selectedEventType === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedEventType('all')}
                >
                  {t('collaboration.all_activities')}
                </Badge>
                {['create', 'update', 'comment', 'like', 'share', 'join', 'leave', 'delete'].map((key) => (
                  <Badge
                    key={key}
                    variant={selectedEventType === key ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedEventType(key)}
                  >
                    {getEventTypeLabel(t, key)}
                  </Badge>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        <ScrollArea className="h-96">
          <div className="space-y-4">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {t('collaboration.no_activities')}
              </div>
            ) : (
              filteredActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="flex-shrink-0 p-2 rounded-full bg-primary/10">
                    {activityIcons[activity.event_type]}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">م</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{t('collaboration.user')}</span>
                      <Badge variant="outline" className="text-xs">
                        {getEntityTypeLabel(t, activity.entity_type)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {formatActivityDescription(activity)}
                    </p>
                    
                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {JSON.stringify(activity.metadata, null, 2)}
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-2">
                      {getRelativeTime(activity.created_at)}
                    </p>
                  </div>
                  
                  <Badge variant="secondary" className="text-xs">
                    {activity.privacy_level}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};