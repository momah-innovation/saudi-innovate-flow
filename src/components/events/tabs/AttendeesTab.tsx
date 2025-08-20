import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDirection } from '@/components/ui/direction-provider';
import { Calendar, Clock, UserCheck, UserX, Users, Download } from 'lucide-react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

interface EventParticipant {
  id: string;
  user_id: string;
  registration_date: string;
  attendance_status: string;
  check_in_time?: string;
  check_out_time?: string;
  registration_type: string;
  notes?: string;
}

interface AttendeesTabProps {
  participants: EventParticipant[];
  maxParticipants?: number;
  loading?: boolean;
  onUpdateStatus?: (participantId: string, newStatus: string) => Promise<void>;
  onCancelRegistration?: (participantId: string, targetEventId: string) => Promise<void>;
}

export const AttendeesTab = ({ 
  participants,
  maxParticipants,
  loading = false,
  onUpdateStatus,
  onCancelRegistration 
}: AttendeesTabProps) => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();

  const getAttendanceStatusColor = (status: string) => {
    switch (status) {
      case 'registered': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
      case 'checked_in': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400';
      case 'checked_out': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400';
      case 'no_show': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getRegistrationTypeColor = (type: string) => {
    switch (type) {
      case 'self_registered': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400';
      case 'invited': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
      case 'admin_added': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'registered': t('events:attendees.attendance_status.registered'),
      'checked_in': t('events:attendees.attendance_status.checked_in'),
      'checked_out': t('events:attendees.attendance_status.checked_out'),
      'no_show': t('events:attendees.attendance_status.no_show'),
      'cancelled': t('events:attendees.attendance_status.cancelled')
    };
    return statusMap[status] || status;
  };

  const getRegistrationTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      'self_registered': t('events:attendees.registration_type.self_registered'),
      'invited': t('events:attendees.registration_type.invited'),
      'admin_added': t('events:attendees.registration_type.admin_added')
    };
    return typeMap[type] || type;
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return isRTL ? 
      date.toLocaleDateString('ar-SA', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : 
      date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isRTL ? 
      date.toLocaleDateString('ar-SA', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      }) : 
      date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
  };

  // Calculate statistics
  const checkedInCount = participants.filter(p => p.attendance_status === 'checked_in' || p.attendance_status === 'checked_out').length;
  const noShowCount = participants.filter(p => p.attendance_status === 'no_show').length;
  const attendanceRate = participants.length > 0 ? (checkedInCount / participants.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Statistics Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
          <div className="text-2xl font-bold">{participants.length}</div>
          <div className="text-xs text-muted-foreground">
            {t('events:attendance.registered')}
          </div>
          {maxParticipants && (
            <div className="text-xs text-muted-foreground">
              {isRTL ? `من ${maxParticipants}` : `of ${maxParticipants}`}
            </div>
          )}
        </div>
        
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <UserCheck className="w-6 h-6 mx-auto mb-2 text-green-600" />
          <div className="text-2xl font-bold text-green-600">{checkedInCount}</div>
          <div className="text-xs text-muted-foreground">
            {t('events:attendance.attended')}
          </div>
        </div>
        
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <UserX className="w-6 h-6 mx-auto mb-2 text-red-600" />
          <div className="text-2xl font-bold text-red-600">{noShowCount}</div>
          <div className="text-xs text-muted-foreground">
            {t('events:attendance.no_show')}
          </div>
        </div>
        
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold text-primary">{attendanceRate.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">
            {t('events:attendees.attendance_rate')}
          </div>
        </div>
      </div>

      {/* Export Actions */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold flex items-center gap-2">
          <Users className="w-4 h-4" />
          {t('events:attendees.title')}
          <Badge variant="secondary" className="ml-2">
            {participants.length}
          </Badge>
        </h4>
        
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          {t('events:attendees.export_list')}
        </Button>
      </div>

      {/* Participants List */}
      {participants.length > 0 ? (
        <div className="space-y-3">
          {participants.map((participant) => (
            <div key={participant.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {t('events:attendees.participant')} #{participant.user_id.slice(-8)}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {t('events:attendees.registration_date')}: {formatDate(participant.registration_date)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <Badge className={getAttendanceStatusColor(participant.attendance_status)}>
                      {getStatusText(participant.attendance_status)}
                    </Badge>
                    <Badge className={getRegistrationTypeColor(participant.registration_type)} variant="outline">
                      {getRegistrationTypeText(participant.registration_type)}
                    </Badge>
                  </div>
                  
                  {(participant.check_in_time || participant.check_out_time) && (
                    <div className="text-sm text-muted-foreground space-y-1">
                      {participant.check_in_time && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-green-600" />
                          {t('events:attendees.check_in_time')}: {formatDateTime(participant.check_in_time)}
                        </div>
                      )}
                      {participant.check_out_time && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-purple-600" />
                          {t('events:attendees.check_out_time')}: {formatDateTime(participant.check_out_time)}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {participant.notes && (
                    <div className="mt-2 text-sm text-muted-foreground p-2 bg-muted/50 rounded">
                      <strong>{t('events:attendees.notes')}: </strong>
                      {participant.notes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {t('events:attendees.no_attendees')}
        </div>
      )}
    </div>
  );
};
