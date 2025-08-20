
import React from 'react';
import { ActivityEvent } from '@/types/activity';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { formatDistanceToNow } from 'date-fns';
import { 
  User, 
  Target, 
  Lightbulb, 
  Calendar, 
  Users, 
  Award, 
  Settings,
  Activity,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityFeedCardProps {
  activity: ActivityEvent;
  showDetails?: boolean;
  compact?: boolean;
}

const getActivityIcon = (actionType: string, entityType: string) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'challenge_created': Target,
    'challenge_updated': Target,
    'challenge_published': Target,
    'idea_created': Lightbulb,
    'idea_submitted': Lightbulb,
    'idea_reviewed': Lightbulb,
    'event_created': Calendar,
    'event_registered': Calendar,
    'user_login': User,
    'user_logout': User,
    'team_joined': Users,
    'role_assigned': Award,
    'file_uploaded': FileText,
    'workspace_created': Settings,
    'default': Activity
  };

  const key = `${entityType}_${actionType}` in iconMap ? `${entityType}_${actionType}` : actionType;
  return iconMap[key] || iconMap.default;
};

const getActivityColor = (actionType: string, severity: string) => {
  if (severity === 'critical') return 'destructive';
  if (severity === 'error') return 'destructive';
  if (severity === 'warning') return 'secondary';
  
  const colorMap: Record<string, string> = {
    'challenge_created': 'bg-blue-500',
    'challenge_published': 'bg-green-500',
    'idea_submitted': 'bg-purple-500',
    'user_login': 'bg-gray-500',
    'role_assigned': 'bg-yellow-500',
    'default': 'bg-blue-500'
  };

  return colorMap[actionType] || colorMap.default;
};

const formatActivityMessage = (activity: ActivityEvent) => {
  const { action_type, entity_type, metadata } = activity;
  
  // Generate human-readable messages based on activity type
  const messageMap: Record<string, string> = {
    'challenge_created': `Created a new ${entity_type}`,
    'challenge_updated': `Updated ${entity_type}`,
    'challenge_published': `Published ${entity_type}`,
    'idea_submitted': `Submitted an idea for ${metadata?.challenge_title || entity_type}`,
    'idea_reviewed': `Reviewed an idea`,
    'user_login': 'Signed in to the platform',
    'user_logout': 'Signed out',
    'team_joined': `Joined team: ${metadata?.team_name || 'Unknown Team'}`,
    'role_assigned': `Was assigned role: ${metadata?.role || 'Unknown Role'}`,
    'file_uploaded': `Uploaded file: ${metadata?.file_name || 'Unknown File'}`,
    'workspace_created': `Created workspace: ${metadata?.workspace_name || 'Unknown Workspace'}`
  };

  return messageMap[action_type] || `Performed ${action_type} on ${entity_type}`;
};

export function ActivityFeedCard({ activity, showDetails = true, compact = false }: ActivityFeedCardProps) {
  const { t } = useUnifiedTranslation();
  
  const Icon = getActivityIcon(activity.action_type, activity.entity_type);
  const iconColor = getActivityColor(activity.action_type, activity.severity);
  const message = formatActivityMessage(activity);
  const timeAgo = formatDistanceToNow(new Date(activity.created_at), { addSuffix: true });

  if (compact) {
    return (
      <div className="flex items-center space-x-3 py-2">
        <div className={cn("p-1.5 rounded-full", iconColor)}>
          <Icon className="h-3 w-3 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm truncate">{message}</p>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
        {activity.privacy_level !== 'public' && (
          <Badge variant="outline" className="text-xs">
            {activity.privacy_level}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          {/* Avatar/Icon */}
          <div className="flex-shrink-0">
            <Avatar className="h-10 w-10">
              <AvatarFallback className={cn("text-white", iconColor)}>
                <Icon className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">
                  {activity.metadata?.actor_name || 'Unknown User'}
                </p>
                {activity.privacy_level !== 'public' && (
                  <Badge variant="outline" className="text-xs">
                    {activity.privacy_level}
                  </Badge>
                )}
                {activity.severity !== 'info' && (
                  <Badge 
                    variant={activity.severity === 'error' || activity.severity === 'critical' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {activity.severity}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{timeAgo}</p>
            </div>

            <p className="text-sm text-muted-foreground mt-1">
              {message}
            </p>

            {/* Tags */}
            {activity.tags && activity.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {activity.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Additional Details */}
            {showDetails && activity.metadata && Object.keys(activity.metadata).length > 0 && (
              <div className="mt-3 p-2 bg-muted/50 rounded text-xs">
                <details>
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                    View Details
                  </summary>
                  <pre className="mt-2 text-xs overflow-x-auto">
                    {JSON.stringify(activity.metadata, null, 2)}
                  </pre>
                </details>
              </div>
            )}

            {/* Workspace Info */}
            {activity.workspace_id && (
              <div className="flex items-center mt-2 text-xs text-muted-foreground">
                <Settings className="h-3 w-3 mr-1" />
                Workspace: {activity.workspace_type || 'Unknown'}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
