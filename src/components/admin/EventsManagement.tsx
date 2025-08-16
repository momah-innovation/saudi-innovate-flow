import { useState, useEffect } from 'react';
import { ManagementCard } from '@/components/ui/management-card';
import { ViewLayouts } from '@/components/ui/view-layouts';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { EventWizard } from '@/components/events/EventWizard';
import { ComprehensiveEventWizard } from '@/components/events/ComprehensiveEventWizard';
import { ComprehensiveEventDialog } from '@/components/events/ComprehensiveEventDialog';
import { AdminEventsHero } from '@/components/events/AdminEventsHero';
import { AdminEventCard } from '@/components/events/AdminEventCard';
import { supabase } from '@/integrations/supabase/client';
import { currentTimestamp } from '@/utils/unified-date-handler';
import { useToast } from '@/hooks/use-toast';
// Enhanced event management with proper types
import { logger } from '@/utils/logger';
import { 
  Calendar, 
  Clock,
  MapPin,
  Users,
  Monitor
} from 'lucide-react';

interface EventsManagementProps {
  viewMode: 'cards' | 'list' | 'grid';
  searchTerm: string;
  showAddDialog: boolean;
  onAddDialogChange: (open: boolean) => void;
}

interface EventData {
  id: string;
  title_ar: string;
  title_en?: string;
  status: string;
  event_type?: string;
  image_url?: string;
  registered_participants?: number;
  budget?: number;
  description_ar?: string;
  event_category?: string;
  event_visibility?: string;
  event_date?: string;
  start_time?: string;
  end_time?: string;
  format?: string;
  actual_participants?: number;
  // Additional properties to match EventFormData
  is_recurring?: boolean;
  target_stakeholder_groups?: string[];
  partner_organizations?: string[];
  related_focus_questions?: string[];
  inherit_from_campaign?: boolean;
}

export function EventsManagement({ viewMode, searchTerm, showAddDialog, onAddDialogChange }: EventsManagementProps) {
  const { t } = useUnifiedTranslation();
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [viewEvent, setViewEvent] = useState<EventData | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  // Load events from Supabase
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const { data: eventsData, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get participant counts for each event
      const eventsWithCounts = await Promise.all(
        (eventsData || []).map(async (event) => {
          const { count, error: countError } = await supabase
            .from('event_participants')
            .select('*', { count: 'exact' })
            .eq('event_id', event.id);

          return {
            ...event,
            registered_participants: count || 0,
            image_url: event.image_url || getDefaultEventImage(event.event_type)
          };
        })
      );

      setEvents(eventsWithCounts);
    } catch (error) {
      logger.error('Error loading events', { component: 'EventsManagement', action: 'loadEvents' }, error as Error);
      toast({
        title: t('events.load_error_title'),
        description: t('events.load_error_description'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getDefaultEventImage = (eventType: string) => {
    const imageMap: { [key: string]: string } = {
      'conference': '/event-images/tech-conference.jpg',
      'workshop': '/event-images/innovation-workshop.jpg',
      'summit': '/event-images/digital-summit.jpg',
      'expo': '/event-images/tech-expo.jpg',
      'hackathon': '/event-images/innovation-lightbulb.jpg',
      'forum': '/event-images/smart-city.jpg',
      'seminar': '/event-images/tech-conference.jpg',
      'training': '/event-images/innovation-workshop.jpg',
      'default': '/event-images/innovation.jpg'
    };
    return imageMap[eventType] || imageMap.default;
  };

  const handleEdit = (event: EventData) => {
    logger.info('Editing event', { component: 'EventsManagement', action: 'handleEdit', data: { eventId: event.id } });
    setSelectedEvent(event);
    onAddDialogChange(true);
  };

  const handleView = (event: EventData) => {
    logger.info('Viewing event', { component: 'EventsManagement', action: 'handleView', data: { eventId: event.id } });
    setViewEvent(event);
  };

  const handleDelete = async (event: EventData) => {
    try {
      logger.info('Deleting event', { component: 'EventsManagement', action: 'handleDelete', data: { eventId: event.id } });
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', event.id);

      if (error) throw error;

      toast({
        title: t('events.delete_success_title'),
        description: t('events.delete_success_description', { title: event.title_ar }),
      });

      loadEvents(); // Reload events
    } catch (error) {
      logger.error('Error deleting event', { component: 'EventsManagement', action: 'handleDelete' }, error as Error);
      toast({
        title: t('events.delete_error_title'),
        variant: 'destructive'
      });
    }
  };

  const handleStatusChange = async (event: EventData, newStatus: string) => {
    try {
      logger.info('Changing event status', { component: 'EventsManagement', action: 'handleStatusChange', data: { eventId: event.id, newStatus } });
      const { error } = await supabase
        .from('events')
        .update({ status: newStatus })
        .eq('id', event.id);

      if (error) throw error;

      toast({
        title: t('events.status_update_success_title'),
        description: t('events.status_update_success_description', { status: newStatus }),
      });

      loadEvents(); // Reload events
    } catch (error) {
      logger.error('Error updating event status', { component: 'EventsManagement', action: 'handleStatusChange' }, error as Error);
      toast({
        title: t('events.status_update_error_title'),
        variant: 'destructive'
      });
    }
  };

  // Filter events based on search term
  const filteredEvents = events.filter(event =>
    event.title_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description_ar.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate metrics for hero
  const totalEvents = events.length;
  const activeEvents = events.filter(e => e.status === 'active').length;
  const totalParticipants = events.reduce((sum, e) => sum + (e.registered_participants || 0), 0);
  const totalRevenue = events.reduce((sum, e) => sum + (e.budget || 0), 0);
  const upcomingEvents = events.filter(e => e.status === 'scheduled').length;
  const completedEvents = events.filter(e => e.status === 'completed').length;

  return (
    <>
      {/* Enhanced Hero Dashboard */}
      <AdminEventsHero 
        totalEvents={totalEvents}
        activeEvents={activeEvents}
        totalParticipants={totalParticipants}
        totalRevenue={totalRevenue}
        upcomingEvents={upcomingEvents}
        completedEvents={completedEvents}
      />

      <ViewLayouts viewMode={viewMode}>
        {loading ? [
          <div key="loading" className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('events.loading')}</p>
          </div>
        ] : filteredEvents.length > 0 ? 
          filteredEvents.map((event) => (
            <AdminEventCard
              key={event.id}
              event={{
                ...event,
                description_ar: event.description_ar || '',
                event_type: event.event_type || 'conference',
                event_category: event.event_category || 'standalone',
                event_visibility: event.event_visibility || 'public',
                event_date: event.event_date || currentTimestamp(),
                start_time: event.start_time || '09:00',
                end_time: event.end_time || '17:00',
                format: event.format || 'in-person',
                actual_participants: event.actual_participants || 0,
                registered_participants: event.registered_participants || 0
              }}
              viewMode={viewMode}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          )) : [
          <div key="empty" className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">{t('events.no_events_title')}</p>
            <p className="text-muted-foreground">{t('events.no_events_description')}</p>
          </div>
        ]}
      </ViewLayouts>

      <ComprehensiveEventWizard
        isOpen={showAddDialog}
        onClose={() => {
          onAddDialogChange(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent ? {
          ...selectedEvent,
          description_ar: selectedEvent.description_ar || '',
          title_ar: selectedEvent.title_ar || '',
          event_type: selectedEvent.event_type || '',
          event_category: selectedEvent.event_category || '',
          event_date: selectedEvent.event_date || '',
          start_time: selectedEvent.start_time || '',
          end_time: selectedEvent.end_time || '',
          format: selectedEvent.format || '',
          status: selectedEvent.status || '',
          event_visibility: selectedEvent.event_visibility || '',
          is_recurring: selectedEvent.is_recurring || false,
          target_stakeholder_groups: selectedEvent.target_stakeholder_groups || [],
          partner_organizations: selectedEvent.partner_organizations || [],
          related_focus_questions: selectedEvent.related_focus_questions || [],
          inherit_from_campaign: selectedEvent.inherit_from_campaign || false
        } : undefined}
        onSave={(eventData) => {
          // Event saved successfully
          loadEvents(); // Reload events after save
          onAddDialogChange(false);
        }}
      />

      {/* View Event Dialog */}
      <ComprehensiveEventDialog
        event={viewEvent ? { 
          ...viewEvent, 
          description_ar: viewEvent.description_ar || '',
          event_type: viewEvent.event_type || 'conference',
          event_category: viewEvent.event_category || 'standalone',
          event_visibility: viewEvent.event_visibility || 'public',
          event_date: viewEvent.event_date || new Date().toISOString(),
          start_time: viewEvent.start_time || '09:00',
          end_time: viewEvent.end_time || '17:00',
          format: viewEvent.format || 'in-person',
          actual_participants: viewEvent.actual_participants || 0,
          registered_participants: viewEvent.registered_participants || 0
        } : null}
        open={!!viewEvent}
        onOpenChange={(open) => !open && setViewEvent(null)}
        isAdmin={true}
      />
    </>
  );
}