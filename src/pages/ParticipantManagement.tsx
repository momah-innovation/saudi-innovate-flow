import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ParticipantManagement } from "@/components/events/ParticipantManagement";
import { AppShell } from "@/components/layout/AppShell";
import { useToast } from "@/hooks/use-toast";
import { logger } from '@/utils/logger';

interface Event {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
}

const ParticipantManagementPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) throw error;

      setEvent(data);
    } catch (error) {
      logger.error('Error fetching event', { eventId }, error as Error);
      toast({
        title: "Error",
        description: "Failed to fetch event details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading...</div>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!event) {
    return (
      <AppShell>
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Event not found</h1>
            <p className="text-gray-600">The requested event could not be found.</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{event.title_ar}</h1>
            <p className="text-muted-foreground">Manage participants for this event</p>
          </div>
          <ParticipantManagement eventId={eventId!} eventTitle={event.title_ar} />
        </div>
      </div>
    </AppShell>
  );
};

export default ParticipantManagementPage;