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
import type { ActivityEvent } from '@/types/collaboration';

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

const entityTypeLabels = {
  challenge: 'تحدي',
  idea: 'فكرة', 
  event: 'فعالية',
  opportunity: 'فرصة',
  campaign: 'حملة',
  workspace: 'مساحة عمل',
  project: 'مشروع'
};

const eventTypeLabels = {
  create: 'إنشاء',
  update: 'تحديث',
  comment: 'تعليق',
  like: 'إعجاب',
  share: 'مشاركة',
  join: 'انضمام',
  leave: 'مغادرة',
  delete: 'حذف'
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
  const [selectedEntityType, setSelectedEntityType] = useState<string>('all');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');

  // Get activities based on scope
  const getActivities = (): ActivityEvent[] => {
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

  const formatActivityDescription = (activity: ActivityEvent): string => {
    const entityLabel = entityTypeLabels[activity.entity_type] || activity.entity_type;
    const eventLabel = eventTypeLabels[activity.event_type] || activity.event_type;
    
    return `${eventLabel} ${entityLabel}`;
  };

  const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    return `منذ ${diffDays} يوم`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            تدفق الأنشطة
          </CardTitle>
          {showFilters && (
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 ml-2" />
              تصفية
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showFilters && (
          <Tabs defaultValue="all" className="mb-4">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="all">الكل</TabsTrigger>
              <TabsTrigger value="entity">نوع المحتوى</TabsTrigger>
              <TabsTrigger value="event">نوع النشاط</TabsTrigger>
            </TabsList>
            <TabsContent value="entity" className="mt-2">
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={selectedEntityType === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedEntityType('all')}
                >
                  الكل
                </Badge>
                {Object.entries(entityTypeLabels).map(([key, label]) => (
                  <Badge
                    key={key}
                    variant={selectedEntityType === key ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedEntityType(key)}
                  >
                    {label}
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
                  الكل
                </Badge>
                {Object.entries(eventTypeLabels).map(([key, label]) => (
                  <Badge
                    key={key}
                    variant={selectedEventType === key ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedEventType(key)}
                  >
                    {label}
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
                لا توجد أنشطة للعرض
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
                      <span className="text-sm font-medium">مستخدم</span>
                      <Badge variant="outline" className="text-xs">
                        {entityTypeLabels[activity.entity_type]}
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