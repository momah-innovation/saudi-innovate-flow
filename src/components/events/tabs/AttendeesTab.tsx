import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDirection } from '@/components/ui/direction-provider';
import { useRTLAware } from '@/hooks/useRTLAware';
import { Calendar, Clock, UserCheck, UserX, Users, Download } from 'lucide-react';

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
  const { me, ms } = useRTLAware();

  const getAttendanceStatusColor = (status: string) => {
    switch (status) {
      case 'registered': return 'bg-primary/10 text-primary border-primary/20';
      case 'checked_in': return 'bg-success/10 text-success border-success/20';
      case 'checked_out': return 'bg-accent/10 text-accent border-accent/20';
      case 'no_show': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'cancelled': return 'bg-muted text-muted-foreground border-muted-foreground/20';
      default: return 'bg-muted text-muted-foreground border-muted-foreground/20';
    }
  };

  const getRegistrationTypeColor = (type: string) => {
    switch (type) {
      case 'self_registered': return 'bg-success/10 text-success border-success/20';
      case 'invited': return 'bg-primary/10 text-primary border-primary/20';
      case 'admin_added': return 'bg-accent/10 text-accent border-accent/20';
      default: return 'bg-muted text-muted-foreground border-muted-foreground/20';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      'registered': isRTL ? 'مسجل' : 'Registered',
      'checked_in': isRTL ? 'حضر' : 'Checked In',
      'checked_out': isRTL ? 'غادر' : 'Checked Out', 
      'no_show': isRTL ? 'لم يحضر' : 'No Show',
      'cancelled': isRTL ? 'ملغي' : 'Cancelled'
    };
    return statusMap[status] || status;
  };

  const getRegistrationTypeText = (type: string) => {
    const typeMap = {
      'self_registered': isRTL ? 'تسجيل ذاتي' : 'Self Registered',
      'invited': isRTL ? 'مدعو' : 'Invited',
      'admin_added': isRTL ? 'أضيف إدارياً' : 'Admin Added'
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
            {isRTL ? 'المسجلين' : 'Registered'}
          </div>
          {maxParticipants && (
            <div className="text-xs text-muted-foreground">
              {isRTL ? `من ${maxParticipants}` : `of ${maxParticipants}`}
            </div>
          )}
        </div>
        
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <UserCheck className="w-6 h-6 mx-auto mb-2 text-success" />
          <div className="text-2xl font-bold text-success">{checkedInCount}</div>
          <div className="text-xs text-muted-foreground">
            {isRTL ? 'حضر' : 'Attended'}
          </div>
        </div>
        
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <UserX className="w-6 h-6 mx-auto mb-2 text-destructive" />
          <div className="text-2xl font-bold text-destructive">{noShowCount}</div>
          <div className="text-xs text-muted-foreground">
            {isRTL ? 'لم يحضر' : 'No Show'}
          </div>
        </div>
        
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold text-primary">{attendanceRate.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">
            {isRTL ? 'معدل الحضور' : 'Attendance Rate'}
          </div>
        </div>
      </div>

      {/* Export Actions */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold flex items-center gap-2">
          <Users className="w-4 h-4" />
          {isRTL ? 'قائمة الحضور' : 'Attendee List'}
          <Badge variant="secondary" className={ms('2')}>
            {participants.length}
          </Badge>
        </h4>
        
        <Button variant="outline" size="sm">
          <Download className={`w-4 h-4 ${me('2')}`} />
          {isRTL ? 'تصدير القائمة' : 'Export List'}
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
                        {isRTL ? 'مشارك' : 'Participant'} #{participant.user_id.slice(-8)}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {isRTL ? 'سجل في: ' : 'Registered: '}{formatDate(participant.registration_date)}
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
                          <Clock className="w-3 h-3 text-success" />
                          {isRTL ? 'دخل: ' : 'Checked in: '}{formatDateTime(participant.check_in_time)}
                        </div>
                      )}
                      {participant.check_out_time && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-accent" />
                          {isRTL ? 'خرج: ' : 'Checked out: '}{formatDateTime(participant.check_out_time)}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {participant.notes && (
                    <div className="mt-2 text-sm text-muted-foreground p-2 bg-muted/50 rounded">
                      <strong>{isRTL ? 'ملاحظات: ' : 'Notes: '}</strong>
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
          {isRTL ? 'لا يوجد مشاركين مسجلين في هذه الفعالية' : 'No participants registered for this event'}
        </div>
      )}
    </div>
  );
};