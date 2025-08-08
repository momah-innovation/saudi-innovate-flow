import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from "@/utils/logger";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, UserCheck, UserX } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  virtual_link?: string;
  format?: string;
  max_participants?: number;
  registered_participants: number;
  actual_participants: number;
  status: string;
}

interface EventParticipant {
  id: string;
  attendance_status: string;
  registration_date: string;
}

interface ParticipantRegistrationProps {
  event: Event;
  onRegistrationChange?: () => void;
}

export function ParticipantRegistration({ event, onRegistrationChange }: ParticipantRegistrationProps) {
  const [participant, setParticipant] = useState<EventParticipant | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();

  useEffect(() => {
    if (user) {
      checkRegistrationStatus();
    }
  }, [event.id, user]);

  const checkRegistrationStatus = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('event_participants')
        .select('*')
        .eq('event_id', event.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      setParticipant(data);
    } catch (error) {
      logger.error('Failed to check registration status', { 
        component: 'ParticipantRegistration', 
        action: 'checkRegistrationStatus',
        eventId: event.id,
        userId: user?.id 
      }, error as Error);
      toast({
        title: "Error",
        description: "Failed to check registration status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const registerForEvent = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to register for events",
        variant: "destructive",
      });
      return;
    }

    try {
      setRegistering(true);
      
      // Check if event is full
      if (event.max_participants && event.registered_participants >= event.max_participants) {
        toast({
          title: "Event Full",
          description: "This event has reached maximum capacity",
          variant: "destructive",
        });
        return;
      }

      console.log('🔄 Registering for event in dialog:', event.id);
      const { error } = await supabase
        .from('event_participants')
        .insert({
          event_id: event.id,
          user_id: user.id,
          attendance_status: 'registered',
          registration_type: 'self_registered'
        });

      if (error) throw error;

      // Update event registered participants count
      const { error: updateError } = await supabase
        .from('events')
        .update({ 
          registered_participants: event.registered_participants + 1 
        })
        .eq('id', event.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Successfully registered for the event!",
      });

      // Immediate state refresh
      await checkRegistrationStatus();
      onRegistrationChange?.();
    } catch (error) {
      logger.error('Failed to register for event', { 
        component: 'ParticipantRegistration', 
        action: 'registerForEvent',
        eventId: event.id,
        userId: user.id 
      }, error as Error);
      toast({
        title: "Error",
        description: "Failed to register for event",
        variant: "destructive",
      });
    } finally {
      setRegistering(false);
    }
  };

  const cancelRegistration = async () => {
    if (!user || !participant) return;

    try {
      setRegistering(true);

      console.log('🔄 Cancelling registration in dialog:', event.id);
      const { error } = await supabase
        .from('event_participants')
        .delete()
        .eq('id', participant.id);

      if (error) throw error;

      // Update event registered participants count
      const { error: updateError } = await supabase
        .from('events')
        .update({ 
          registered_participants: Math.max(0, event.registered_participants - 1)
        })
        .eq('id', event.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Registration cancelled successfully",
      });

      // Immediate state refresh
      setParticipant(null);
      onRegistrationChange?.();
    } catch (error) {
      logger.error('Failed to cancel registration', { 
        component: 'ParticipantRegistration', 
        action: 'cancelRegistration',
        eventId: event.id,
        userId: user.id 
      }, error as Error);
      toast({
        title: "Error",
        description: "Failed to cancel registration",
        variant: "destructive",
      });
    } finally {
      setRegistering(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      registered: { label: t('registered'), variant: "default" as const, icon: UserCheck },
      confirmed: { label: "Confirmed", variant: "default" as const, icon: UserCheck },
      attended: { label: "Attended", variant: "secondary" as const, icon: UserCheck },
      no_show: { label: "No Show", variant: "destructive" as const, icon: UserX },
      cancelled: { label: "Cancelled", variant: "outline" as const, icon: UserX }
    }[status] || { label: status, variant: "outline" as const, icon: UserCheck };

    const StatusIcon = statusConfig.icon;
    
    return (
      <Badge variant={statusConfig.variant} className="flex items-center gap-1">
        <StatusIcon className="h-3 w-3" />
        {statusConfig.label}
      </Badge>
    );
  };

  const formatEventDate = () => {
    const startDate = new Date(event.event_date);
    const endDate = event.end_date ? new Date(event.end_date) : null;
    
    if (endDate && startDate.toDateString() !== endDate.toDateString()) {
      return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    }
    
    return startDate.toLocaleDateString();
  };

  const formatEventTime = () => {
    if (!event.start_time) return null;
    
    const startTime = event.start_time;
    const endTime = event.end_time;
    
    if (endTime) {
      return `${startTime} - ${endTime}`;
    }
    
    return `From ${startTime}`;
  };

  const isEventFull = event.max_participants && event.registered_participants >= event.max_participants;
  const canRegister = !participant && !isEventFull && event.status !== 'cancelled';
  const canCancel = participant && participant.attendance_status === 'registered';

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Event Registration</span>
          {participant && getStatusBadge(participant.attendance_status)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Event Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatEventDate()}</span>
          </div>
          
          {formatEventTime() && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatEventTime()}</span>
            </div>
          )}
          
          {event.location && event.format !== 'virtual' && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {event.registered_participants} registered
              {event.max_participants && ` of ${event.max_participants} max`}
            </span>
          </div>
        </div>

        {/* Registration Status & Actions */}
        <div className="space-y-3">
          {participant ? (
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Registration Status</p>
                <p className="text-xs text-muted-foreground">
                  Registered on {new Date(participant.registration_date).toLocaleDateString()}
                </p>
              </div>
              
              {canCancel && (
                <Button 
                  variant="destructive" 
                  onClick={cancelRegistration}
                  disabled={registering}
                  className="w-full"
                >
                  {registering ? "Cancelling..." : "Cancel Registration"}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {isEventFull && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                  This event has reached maximum capacity.
                </div>
              )}
              
              {event.status === 'cancelled' && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                  This event has been cancelled.
                </div>
              )}
              
              <Button 
                onClick={registerForEvent}
                disabled={!canRegister || registering}
                className="w-full"
              >
                {registering ? t('registering') : t('registerForEvent')}
              </Button>
            </div>
          )}
        </div>

        {/* Event Description */}
        {event.description && (
          <div className="pt-3 border-t">
            <p className="text-sm text-muted-foreground">{event.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}