import React, { useState } from 'react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Users,
  Plus,
  MoreHorizontal,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Meeting {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  meeting_type: 'team-sync' | 'project-review' | 'brainstorming' | 'one-on-one';
  location?: string;
  virtual_link?: string;
  organizer_id: string;
  organizer_name: string;
  attendees: Array<{
    id: string;
    name: string;
    avatar_url?: string;
    status: 'accepted' | 'declined' | 'pending';
  }>;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  agenda?: string[];
}

interface MeetingSchedulingProps {
  teamId: string;
  canSchedule: boolean;
}

const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Weekly Team Sync',
    description: 'Regular team synchronization meeting to discuss progress and blockers',
    start_time: '2025-01-20T10:00:00Z',
    end_time: '2025-01-20T11:00:00Z',
    meeting_type: 'team-sync',
    virtual_link: 'https://meet.google.com/abc-defg-hij',
    organizer_id: 'user1',
    organizer_name: 'Ahmed Salem',
    attendees: [
      { id: 'user1', name: 'Ahmed Salem', status: 'accepted' },
      { id: 'user2', name: 'Sara Mohamed', status: 'accepted' },
      { id: 'user3', name: 'Omar Ali', status: 'pending' },
      { id: 'user4', name: 'Fatima Hassan', status: 'declined' }
    ],
    status: 'scheduled',
    agenda: [
      'Review last week\'s progress',
      'Discuss current blockers',
      'Plan next week\'s tasks',
      'Q&A session'
    ]
  },
  {
    id: '2',
    title: 'Project Kickoff Meeting',
    description: 'Kickoff meeting for the new mobile app development project',
    start_time: '2025-01-22T14:00:00Z',
    end_time: '2025-01-22T15:30:00Z',
    meeting_type: 'project-review',
    location: 'Conference Room A',
    organizer_id: 'user2',
    organizer_name: 'Sara Mohamed',
    attendees: [
      { id: 'user1', name: 'Ahmed Salem', status: 'pending' },
      { id: 'user2', name: 'Sara Mohamed', status: 'accepted' },
      { id: 'user5', name: 'Khalid Nasser', status: 'pending' }
    ],
    status: 'scheduled',
    agenda: [
      'Project overview and objectives',
      'Team roles and responsibilities',
      'Timeline and milestones',
      'Resource allocation'
    ]
  }
];

export function MeetingScheduling({ teamId, canSchedule }: MeetingSchedulingProps) {
  const { t } = useUnifiedTranslation();
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  const getMeetingTypeBadge = (type: string) => {
    const colors = {
      'team-sync': 'bg-blue-100 text-blue-800',
      'project-review': 'bg-green-100 text-green-800',
      'brainstorming': 'bg-purple-100 text-purple-800',
      'one-on-one': 'bg-orange-100 text-orange-800'
    };

    return (
      <Badge className={colors[type] || 'bg-gray-100 text-gray-800'}>
        {t(`workspace.team.meeting.types.${type.replace('-', '_')}`)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
        {t(`workspace.team.meeting.status.${status.replace('-', '_')}`)}
      </Badge>
    );
  };

  const getAttendeeStatus = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'declined':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString([], {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t('workspace.team.meetings.title')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('workspace.team.meetings.description')}
          </p>
        </div>

        {canSchedule && (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {t('workspace.team.meetings.schedule')}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meetings List */}
        <div className="space-y-4">
          <h4 className="font-medium">{t('workspace.team.meetings.upcoming')}</h4>
          
          {mockMeetings.map((meeting) => (
            <Card 
              key={meeting.id}
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                selectedMeeting?.id === meeting.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedMeeting(meeting)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{meeting.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getMeetingTypeBadge(meeting.meeting_type)}
                      {getStatusBadge(meeting.status)}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>{t('team:actions.edit_meeting')}</DropdownMenuItem>
                      <DropdownMenuItem>{t('team:actions.copy_link')}</DropdownMenuItem>
                      <DropdownMenuItem>{t('team:actions.send_reminder')}</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        {t('team:actions.cancel_meeting')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(meeting.start_time)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {formatTime(meeting.start_time)} - {formatTime(meeting.end_time)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm">
                  {meeting.virtual_link ? (
                    <>
                      <Video className="h-4 w-4 text-muted-foreground" />
                      <span>{t('workspace.team.meetings.virtual')}</span>
                    </>
                  ) : meeting.location ? (
                    <>
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{meeting.location}</span>
                    </>
                  ) : null}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {meeting.attendees.slice(0, 4).map((attendee) => (
                      <div key={attendee.id} className="relative">
                        <Avatar className="h-6 w-6 border-2 border-background">
                          <AvatarImage src={attendee.avatar_url} />
                          <AvatarFallback className="text-xs">
                            {attendee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1">
                          {getAttendeeStatus(attendee.status)}
                        </div>
                      </div>
                    ))}
                    {meeting.attendees.length > 4 && (
                      <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                        +{meeting.attendees.length - 4}
                      </div>
                    )}
                  </div>

                  <span className="text-xs text-muted-foreground">
                    {t('workspace.team.meetings.organizer')}: {meeting.organizer_name}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Meeting Details */}
        {selectedMeeting && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{selectedMeeting.title}</CardTitle>
                {selectedMeeting.description && (
                  <p className="text-sm text-muted-foreground">
                    {selectedMeeting.description}
                  </p>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>{t('workspace.team.meetings.date')}:</strong>
                    <br />
                    {formatDate(selectedMeeting.start_time)}
                  </div>
                  <div>
                    <strong>{t('workspace.team.meetings.time')}:</strong>
                    <br />
                    {formatTime(selectedMeeting.start_time)} - {formatTime(selectedMeeting.end_time)}
                  </div>
                  <div>
                    <strong>{t('workspace.team.meetings.type')}:</strong>
                    <br />
                    {getMeetingTypeBadge(selectedMeeting.meeting_type)}
                  </div>
                  <div>
                    <strong>{t('workspace.team.meetings.status')}:</strong>
                    <br />
                    {getStatusBadge(selectedMeeting.status)}
                  </div>
                </div>

                {(selectedMeeting.virtual_link || selectedMeeting.location) && (
                  <div>
                    <strong className="text-sm">
                      {selectedMeeting.virtual_link ? 
                        t('workspace.team.meetings.join_link') : 
                        t('workspace.team.meetings.location')
                      }:
                    </strong>
                    <br />
                    <span className="text-sm">
                      {selectedMeeting.virtual_link || selectedMeeting.location}
                    </span>
                  </div>
                )}

                {selectedMeeting.agenda && selectedMeeting.agenda.length > 0 && (
                  <div>
                    <strong className="text-sm">{t('workspace.team.meetings.agenda')}:</strong>
                    <ul className="mt-1 text-sm space-y-1">
                      {selectedMeeting.agenda.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-muted-foreground">{index + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <strong className="text-sm">{t('workspace.team.meetings.attendees')}:</strong>
                  <div className="mt-2 space-y-2">
                    {selectedMeeting.attendees.map((attendee) => (
                      <div key={attendee.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={attendee.avatar_url} />
                            <AvatarFallback className="text-xs">
                              {attendee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{attendee.name}</span>
                        </div>
                        {getAttendeeStatus(attendee.status)}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button size="sm" className="flex-1">
                    {selectedMeeting.virtual_link ? 
                      t('workspace.team.meetings.join') : 
                      t('workspace.team.meetings.directions')
                    }
                  </Button>
                  <Button variant="outline" size="sm">
                    {t('workspace.team.meetings.add_to_calendar')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
