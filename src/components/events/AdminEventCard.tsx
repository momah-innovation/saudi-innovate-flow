import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TypeBadge } from '@/components/ui/TypeBadge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  DollarSign,
  TrendingUp,
  Edit,
  Eye,
  MoreHorizontal,
  AlertCircle,
  CheckCircle2,
  Video,
  Globe
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Event {
  id: string;
  title_ar: string;
  description_ar: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location?: string;
  format: string;
  event_type: string;
  event_category?: string;
  status: string;
  max_participants?: number;
  registered_participants: number;
  actual_participants: number;
  budget?: number;
  image_url?: string;
  event_manager_id?: string;
  event_visibility?: string;
  virtual_link?: string;
}

interface AdminEventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onView: (event: Event) => void;
  onDelete: (event: Event) => void;
  onStatusChange?: (event: Event, newStatus: string) => void;
  viewMode?: 'cards' | 'list' | 'grid';
}

export const AdminEventCard = ({ 
  event, 
  onEdit, 
  onView, 
  onDelete,
  onStatusChange,
  viewMode = 'cards'
}: AdminEventCardProps) => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مجدول':
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
      case 'جاري':
      case 'ongoing': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400';
      case 'مكتمل':
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
      case 'ملغي':
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    if (status === 'مجدول') return t('events.status.scheduled');
    if (status === 'جاري') return t('events.status.ongoing');
    if (status === 'مكتمل') return t('events.status.completed');
    if (status === 'ملغي') return t('events.status.cancelled');
    return status;
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'badge-innovation';
      case 'conference': return 'badge-expert';
      case 'webinar': return 'badge-info';
      case 'meetup': return 'badge-warning';
      case 'hackathon': return 'badge-success';
      case 'summit': return 'badge-error';
      case 'expo': return 'badge-warning';
      case 'forum': return 'badge-partner';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isRTL ? 
      date.toLocaleDateString('ar-SA', { day: 'numeric', month: 'short', year: 'numeric' }) : 
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getRegistrationPercentage = () => {
    if (!event.max_participants) return 0;
    return Math.min((event.registered_participants / event.max_participants) * 100, 100);
  };

  const isEventFull = event.max_participants && event.registered_participants >= event.max_participants;
  const isHighCapacity = getRegistrationPercentage() > 80;

  const statusActions = [
    { value: 'مجدول', label: t('events.status.scheduled', 'Scheduled') },
    { value: 'جاري', label: t('events.status.ongoing', 'Ongoing') },
    { value: 'مكتمل', label: t('events.status.completed', 'Completed') },
    { value: 'ملغي', label: t('events.status.cancelled', 'Cancelled') }
  ];

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-all duration-300 hover-scale">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Event Image */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                {event.image_url ? (
                  <img 
                    src={event.image_url} 
                    alt={event.title_ar}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary/40" />
                  </div>
                )}
              </div>
              {event.format === 'virtual' && (
                <div className="absolute -top-1 -right-1">
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    <Video className="w-3 h-3" />
                  </Badge>
                </div>
              )}
            </div>

            {/* Event Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate text-foreground">{event.title_ar}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {event.description_ar}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(event.status)}>
                    {getStatusText(event.status)}
                  </Badge>
                  <TypeBadge type={event.event_type} size="sm" />
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(event.event_date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{event.start_time} - {event.end_time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                   <span className="truncate">{event.location || (event.format === 'virtual' ? t('events.location.online', 'Online') : 'TBD')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{event.registered_participants}/{event.max_participants || '∞'}</span>
                </div>
              </div>

              {/* Progress Bar */}
              {event.max_participants && (
                <div className="mb-2">
                  <Progress value={getRegistrationPercentage()} className="h-1.5" />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="info-subtle" size="icon-sm" onClick={() => onView(event)}>
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="warning-subtle" size="icon-sm" onClick={() => onEdit(event)}>
                <Edit className="w-4 h-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onStatusChange && statusActions.map((action) => (
                    <DropdownMenuItem key={action.value} onClick={() => onStatusChange(event, action.value)}>
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onDelete(event)} className="text-destructive">
                     {t('common.delete', 'Delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover-scale overflow-hidden">
      {/* Event Image */}
      <div className="relative h-40 overflow-hidden">
        {event.image_url ? (
          <img 
            src={event.image_url} 
            alt={event.title_ar}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Calendar className="w-12 h-12 text-primary/40" />
          </div>
        )}
        
        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className={getStatusColor(event.status)}>
            {getStatusText(event.status)}
          </Badge>
          {event.format === 'virtual' && (
            <Badge variant="secondary" className="bg-white/90 text-gray-700">
              <Globe className="w-3 h-3 mr-1" />
              {t('events.location.online', 'Online')}
            </Badge>
          )}
          {isHighCapacity && (
            <Badge className="bg-orange-100 text-orange-800 border-orange-200">
              {t('events.registration.limited', 'Limited')}
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/90 hover:bg-white"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(event)}>
                <Eye className="w-4 h-4 mr-2" />
                 {t('common.view', 'View')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(event)}>
                <Edit className="w-4 h-4 mr-2" />
                 {t('common.edit', 'Edit')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {onStatusChange && statusActions.map((action) => (
                <DropdownMenuItem key={action.value} onClick={() => onStatusChange(event, action.value)}>
                  {action.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(event)} className="text-destructive">
                {t('common.delete', 'Delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Date Badge */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-white/95 rounded-lg p-2 text-center min-w-[3rem]">
            <div className="text-xs font-medium text-muted-foreground">
              {new Date(event.event_date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', { month: 'short' })}
            </div>
            <div className="text-lg font-bold text-foreground">
              {new Date(event.event_date).getDate()}
            </div>
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-2 mb-2">
              {event.title_ar}
            </CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {event.description_ar}
            </p>
          </div>
          <TypeBadge type={event.event_type} size="sm" />
        </div>

        {/* Event Meta */}
        <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{event.start_time} - {event.end_time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{event.location || (event.format === 'virtual' ? t('events.location.online', 'Online') : 'TBD')}</span>
          </div>
        </div>

        {/* Registration Progress */}
        {event.max_participants && (
          <div className="mt-3">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>{t('events.registration.title', 'Registration')}</span>
              <span>{event.registered_participants}/{event.max_participants}</span>
            </div>
            <Progress value={getRegistrationPercentage()} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{Math.round(getRegistrationPercentage())}% {t('events.registration.full', 'full')}</span>
              {isHighCapacity && (
                <span className="text-orange-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {t('events.registration.limited_spots', 'Limited spots')}
                </span>
              )}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold text-foreground">{event.registered_participants}</div>
            <div className="text-xs text-muted-foreground">{t('events.stats.registered', 'Registered')}</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold text-foreground">{event.actual_participants}</div>
            <div className="text-xs text-muted-foreground">{t('events.stats.attended', 'Attended')}</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold text-foreground">
              {event.budget ? `${(event.budget / 1000).toFixed(0)}K` : t('events.budget.free', 'Free')}
            </div>
            <div className="text-xs text-muted-foreground">{t('events.budget.title', 'Budget')}</div>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            {getRegistrationPercentage() > 90 ? (
              <CheckCircle2 className="w-3 h-3 text-green-600" />
            ) : getRegistrationPercentage() > 70 ? (
              <TrendingUp className="w-3 h-3 text-orange-600" />
            ) : (
              <AlertCircle className="w-3 h-3 text-red-600" />
            )}
            <span>{t('events.registration.rate', 'Registration rate')}</span>
          </div>
          <span className="font-medium">{Math.round(getRegistrationPercentage())}%</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="primary" onClick={() => onView(event)} className="flex-1">
            <Eye className="w-4 h-4 mr-2" />
            {t('common.view', 'View')}
          </Button>
          <Button onClick={() => onEdit(event)} className="flex-1">
            <Edit className="w-4 h-4 mr-2" />
            {t('common.edit', 'Edit')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};