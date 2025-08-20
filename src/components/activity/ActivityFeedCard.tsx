
import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ActivityEvent } from '@/types/activity';
import { 
  Activity, 
  User, 
  Calendar, 
  FileText, 
  Users, 
  MessageCircle,
  Heart,
  Bookmark,
  Share,
  Upload,
  AlertCircle,
  AlertTriangle,
  Info,
  XCircle
} from 'lucide-react';

interface ActivityFeedCardProps {
  activity: ActivityEvent;
  variant?: 'default' | 'compact';
  showMetadata?: boolean;
}

const ACTION_ICONS: Record<string, React.ComponentType<any>> = {
  challenge_created: FileText,
  challenge_updated: FileText,
  challenge_published: FileText,
  idea_created: Activity,
  idea_submitted: Activity,
  event_created: Calendar,
  event_registered: Calendar,
  user_login: User,
  team_joined: Users,
  liked: Heart,
  bookmarked: Bookmark,
  shared: Share,
  commented: MessageCircle,
  file_uploaded: Upload,
};

const SEVERITY_ICONS: Record<string, React.ComponentType<any>> = {
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
  critical: AlertCircle,
};

const SEVERITY_COLORS: Record<string, string> = {
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 font-bold',
};

export function ActivityFeedCard({ 
  activity, 
  variant = 'default',
  showMetadata = true 
}: ActivityFeedCardProps) {
  const { t, i18n } = useTranslation('activity');
  const isRTL = i18n.language === 'ar';

  const ActionIcon = ACTION_ICONS[activity.action_type] || Activity;
  const SeverityIcon = SEVERITY_ICONS[activity.severity] || Info;

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const locale = isRTL ? ar : enUS;
    
    try {
      return formatDistanceToNow(date, { 
        addSuffix: true, 
        locale 
      });
    } catch (error) {
      // Fallback to simple time display
      return date.toLocaleString(isRTL ? 'ar' : 'en');
    }
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 py-2 px-3 hover:bg-muted/50 rounded-lg transition-colors">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <ActionIcon className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground truncate">
            {t(`actions.${activity.action_type}`, activity.action_type)} {t(`entities.${activity.entity_type}`, activity.entity_type)}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatTimeAgo(activity.created_at)}
          </p>
        </div>
        {activity.severity !== 'info' && (
          <Badge variant="secondary" className={`text-xs ${SEVERITY_COLORS[activity.severity]}`}>
            <SeverityIcon className="w-3 h-3 mr-1" />
            {t(`severity.${activity.severity}`)}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <ActionIcon className="w-5 h-5 text-primary" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {t(`actions.${activity.action_type}`, activity.action_type)} {t(`entities.${activity.entity_type}`, activity.entity_type)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatTimeAgo(activity.created_at)}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {activity.privacy_level !== 'public' && (
                <Badge variant="outline" className="text-xs">
                  {t(`privacy.${activity.privacy_level}`)}
                </Badge>
              )}
              {activity.severity !== 'info' && (
                <Badge variant="secondary" className={`text-xs ${SEVERITY_COLORS[activity.severity]}`}>
                  <SeverityIcon className="w-3 h-3 mr-1" />
                  {t(`severity.${activity.severity}`)}
                </Badge>
              )}
            </div>
          </div>

          {showMetadata && activity.metadata && Object.keys(activity.metadata).length > 0 && (
            <div className="mt-3 p-2 bg-muted/50 rounded text-xs">
              <details className="cursor-pointer">
                <summary className="text-muted-foreground hover:text-foreground">
                  Activity Details
                </summary>
                <pre className="mt-2 text-xs overflow-x-auto">
                  {JSON.stringify(activity.metadata, null, 2)}
                </pre>
              </details>
            </div>
          )}

          {activity.tags && activity.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {activity.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
