
import React from 'react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
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
  const { t, language } = useUnifiedTranslation();
  const isRTL = language === 'ar';

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
            {t(`activity.actions.${activity.action_type}`, activity.action_type)} {t(`activity.entities.${activity.entity_type}`, activity.entity_type)}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatTimeAgo(activity.created_at)}
          </p>
        </div>
        {activity.severity !== 'info' && (
          <Badge variant="secondary" className={`text-xs ${SEVERITY_COLORS[activity.severity]}`}>
            <SeverityIcon className="w-3 h-3 mr-1" />
            {t(`activity.severity.${activity.severity}`)}
          </Badge>
        )}
      </div>
    );
  }

  // Enhanced activity content with better metadata display
  const getActivityTitle = () => {
    const entityTitle = activity.metadata?.entity_title || activity.metadata?.title || activity.metadata?.name;
    const actionText = t(`activity.actions.${activity.action_type}`, activity.action_type);
    const entityText = t(`activity.entities.${activity.entity_type}`, activity.entity_type);
    
    if (entityTitle) {
      return `${actionText} ${entityText}: "${entityTitle}"`;
    }
    return `${actionText} ${entityText}`;
  };

  const getActivityDescription = () => {
    return activity.metadata?.entity_description || activity.metadata?.description;
  };

  const getImportanceBadge = () => {
    const importance = activity.metadata?.importance;
    if (!importance || importance === 'medium') return null;
    
    const variant = importance === 'critical' ? 'destructive' : 'secondary';
    const color = importance === 'critical' ? 'text-red-600' : 'text-orange-600';
    
    return (
      <Badge variant={variant} className={`text-xs ${color}`}>
        {importance.toUpperCase()}
      </Badge>
    );
  };

  return (
    <Card className="group p-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary/50">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/30 transition-colors">
            <ActionIcon className="w-5 h-5 text-primary" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground leading-relaxed">
                {getActivityTitle()}
              </p>
              
              {getActivityDescription() && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {getActivityDescription()}
                </p>
              )}
              
              <div className="flex items-center gap-2 mt-2">
                <p className="text-xs text-muted-foreground">
                  {formatTimeAgo(activity.created_at)}
                </p>
                
                {activity.metadata?.user_agent && (
                  <span className="text-xs text-muted-foreground/70">•</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1 ml-2">
              {getImportanceBadge()}
              
              {activity.privacy_level !== 'public' && (
                <Badge variant="outline" className="text-xs">
                  {t(`activity.privacy.${activity.privacy_level}`)}
                </Badge>
              )}
              
              {activity.severity !== 'info' && (
                <Badge variant="secondary" className={`text-xs ${SEVERITY_COLORS[activity.severity]}`}>
                  <SeverityIcon className="w-3 h-3 mr-1" />
                  {t(`activity.severity.${activity.severity}`)}
                </Badge>
              )}
            </div>
          </div>

          {showMetadata && activity.metadata && Object.keys(activity.metadata).length > 0 && (
            <div className="mt-3 p-3 bg-muted/30 rounded-lg border border-muted/50">
              <details className="cursor-pointer group/details">
                <summary className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  <span className="group-open/details:rotate-90 transition-transform">▶</span>
                  Activity Details
                </summary>
                <div className="mt-2 space-y-1">
                  {activity.metadata.importance && (
                    <div className="text-xs">
                      <span className="font-medium">Importance:</span> {activity.metadata.importance}
                    </div>
                  )}
                  {activity.metadata.session_id && (
                    <div className="text-xs">
                      <span className="font-medium">Session:</span> {activity.metadata.session_id.slice(-8)}
                    </div>
                  )}
                  <details className="text-xs">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                      Raw Metadata
                    </summary>
                    <pre className="mt-1 text-xs overflow-x-auto bg-background/50 p-2 rounded border">
                      {JSON.stringify(activity.metadata, null, 2)}
                    </pre>
                  </details>
                </div>
              </details>
            </div>
          )}

          {activity.tags && activity.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {activity.tags.slice(0, 5).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs hover:bg-primary/10 transition-colors">
                  {tag}
                </Badge>
              ))}
              {activity.tags.length > 5 && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  +{activity.tags.length - 5} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
