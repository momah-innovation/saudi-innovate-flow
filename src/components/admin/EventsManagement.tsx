import { useState, useEffect } from 'react';
import { ManagementCard } from '@/components/ui/management-card';
import { ViewLayouts } from '@/components/ui/view-layouts';
import { useTranslation } from '@/hooks/useAppTranslation';
import { EventWizard } from '@/components/events/EventWizard';
import { ComprehensiveEventWizard } from '@/components/events/ComprehensiveEventWizard';
import { ComprehensiveEventDialog } from '@/components/events/ComprehensiveEventDialog';
import { AdminEventsHero } from '@/components/events/AdminEventsHero';
import { EnhancedAdminEventCard } from '@/components/events/EnhancedAdminEventCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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

export function EventsManagement({ viewMode, searchTerm, showAddDialog, onAddDialogChange }: EventsManagementProps) {
  const { language } = useTranslation();
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [viewEvent, setViewEvent] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
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
      console.error('Error loading events:', error);
      toast({
        title: 'خطأ في تحميل الفعاليات',
        description: 'حدث خطأ أثناء تحميل الفعاليات',
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

  const handleEdit = (event: any) => {
    setSelectedEvent(event);
    onAddDialogChange(true);
  };

  const handleView = (event: any) => {
    setViewEvent(event);
  };

  const handleDelete = async (event: any) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', event.id);

      if (error) throw error;

      toast({
        title: 'تم حذف الفعالية بنجاح',
        description: `تم حذف فعالية "${event.title_ar}" بنجاح`,
      });

      loadEvents(); // Reload events
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: 'خطأ في حذف الفعالية',
        variant: 'destructive'
      });
    }
  };

  const handleStatusChange = async (event: any, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ status: newStatus })
        .eq('id', event.id);

      if (error) throw error;

      toast({
        title: 'تم تحديث حالة الفعالية',
        description: `تم تغيير حالة الفعالية إلى ${newStatus}`,
      });

      loadEvents(); // Reload events
    } catch (error) {
      console.error('Error updating event status:', error);
      toast({
        title: 'خطأ في تحديث الحالة',
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
  const activeEvents = events.filter(e => e.status === 'جاري').length;
  const totalParticipants = events.reduce((sum, e) => sum + (e.registered_participants || 0), 0);
  const totalRevenue = events.reduce((sum, e) => sum + (e.budget || 0), 0);
  const upcomingEvents = events.filter(e => e.status === 'مجدول').length;
  const completedEvents = events.filter(e => e.status === 'مكتمل').length;

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
            <p className="text-muted-foreground">جاري تحميل الفعاليات...</p>
          </div>
        ] : filteredEvents.length > 0 ? 
          filteredEvents.map((event) => (
            <EnhancedAdminEventCard
              key={event.id}
              event={{
                ...event,
                event_category: event.event_category || 'standalone',
                event_visibility: event.event_visibility || 'public'
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
            <p className="text-lg font-medium mb-2">لا توجد فعاليات</p>
            <p className="text-muted-foreground">لا توجد فعاليات تطابق البحث الحالي</p>
          </div>
        ]}
      </ViewLayouts>

      <ComprehensiveEventWizard
        isOpen={showAddDialog}
        onClose={() => {
          onAddDialogChange(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onSave={(eventData) => {
          // Event saved successfully
          loadEvents(); // Reload events after save
          onAddDialogChange(false);
        }}
      />

      {/* View Event Dialog */}
      <ComprehensiveEventDialog
        event={viewEvent}
        open={!!viewEvent}
        onOpenChange={(open) => !open && setViewEvent(null)}
        isAdmin={true}
      />
    </>
  );
}