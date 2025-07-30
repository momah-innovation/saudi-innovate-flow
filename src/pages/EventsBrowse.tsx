import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LayoutSelector } from '@/components/ui/layout-selector';
import { ViewLayouts } from '@/components/ui/view-layouts';
import { useToast } from '@/hooks/use-toast';
import { useDirection } from '@/components/ui/direction-provider';
import { EnhancedEventCard } from '@/components/events/EnhancedEventCard';
import { EnhancedEventDetailDialog } from '@/components/events/EnhancedEventDetailDialog';
import { EventsHero } from '@/components/events/EventsHero';
import { EventAdvancedFilters } from '@/components/events/EventAdvancedFilters';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Calendar, TrendingUp, MapPin } from 'lucide-react';

interface Event {
  id: string;
  title_ar: string;
  description_ar: string;
  event_date: string;
  start_time: string;
  end_time: string;
  end_date?: string;
  location?: string;
  virtual_link?: string;
  format: string;
  event_type: string;
  event_category: string;
  status: string;
  max_participants?: number;
  registered_participants: number;
  actual_participants: number;
  budget?: number;
  campaign_id?: string;
  challenge_id?: string;
  sector_id?: string;
  event_manager_id?: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  target_stakeholder_groups?: string[];
  partner_organizations?: string[];
  related_focus_questions?: string[];
  event_visibility?: string;
  created_at?: string;
  updated_at?: string;
}

const EventsBrowse = () => {
  const { isRTL } = useDirection();
  const { toast } = useToast();
  const { user, userProfile } = useAuth();
  
  // State management
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Basic filters
  const [searchQuery, setSearchQuery] = useState('');
  
  // Advanced filters
  const [filters, setFilters] = useState({
    eventTypes: [],
    formats: [],
    status: [],
    dateRange: {},
    location: '',
    priceRange: '',
    capacity: ''
  });

  // Load events with real-time updates
  useEffect(() => {
    loadEvents();
    
    // Set up real-time subscription for events and participants
    const eventsSubscription = supabase
      .channel('events-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
        loadEvents();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'event_participants' }, () => {
        loadEvents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(eventsSubscription);
    };
  }, [activeTab]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('events')
        .select(`
          *
        `)
        .order('event_date', { ascending: true });

      // Apply tab-based filtering
      const today = new Date().toISOString().split('T')[0];
      
      if (activeTab === 'upcoming') {
        query = query.gte('event_date', today);
      } else if (activeTab === 'past') {
        query = query.lt('event_date', today);
      } else if (activeTab === 'today') {
        query = query.eq('event_date', today);
      }

      const { data: eventsData, error: eventsError } = await query;

      if (eventsError) throw eventsError;

      // Get participant counts for each event
      const eventsWithCounts = await Promise.all(
        (eventsData || []).map(async (event) => {
          const { count, error: countError } = await supabase
            .from('event_participants')
            .select('*', { count: 'exact' })
            .eq('event_id', event.id);

          if (countError) {
            console.error('Error getting participant count:', countError);
            return { ...event, registered_participants: 0 };
          }

          return { ...event, registered_participants: count || 0 };
        })
      );

      setEvents(eventsWithCounts);
      
    } catch (error) {
      console.error('Error loading events:', error);
      toast({
        title: isRTL ? 'خطأ في تحميل الفعاليات' : 'Error loading events',
        description: isRTL ? 'حدث خطأ أثناء تحميل الفعاليات' : 'An error occurred while loading events',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Event handlers
  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setDetailDialogOpen(true);
  };

  const registerForEvent = async (event: Event) => {
    if (!user) {
      toast({
        title: isRTL ? 'يرجى تسجيل الدخول' : 'Please log in',
        description: isRTL ? 'يجب تسجيل الدخول للتسجيل في الفعاليات' : 'You need to log in to register for events',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('event_participants')
        .insert({
          event_id: event.id,
          user_id: user.id,
          registration_type: 'self_registered',
          attendance_status: 'registered'
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: isRTL ? 'مسجل مسبقاً' : 'Already registered',
            description: isRTL ? 'أنت مسجل في هذه الفعالية بالفعل' : 'You are already registered for this event',
            variant: 'destructive'
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: isRTL ? 'تم التسجيل بنجاح!' : 'Successfully Registered!',
        description: isRTL ? `تم تسجيلك في فعالية "${event.title_ar}"` : `You have been registered for "${event.title_ar}"`,
      });

      // Reload events to update participant count
      loadEvents();
      
    } catch (error) {
      console.error('Error registering for event:', error);
      toast({
        title: isRTL ? 'خطأ في التسجيل' : 'Registration Error',
        description: isRTL ? 'حدث خطأ أثناء التسجيل في الفعالية' : 'An error occurred while registering for the event',
        variant: 'destructive'
      });
    }
  };

  // Filter events based on search
  const getFilteredEvents = () => {
    let filtered = [...events];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.description_ar && event.description_ar.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  };

  const filteredEvents = getFilteredEvents();

  // Calculate stats for hero
  const upcomingCount = events.filter(e => new Date(e.event_date) >= new Date()).length;
  const todayCount = events.filter(e => {
    const eventDate = new Date(e.event_date);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  }).length;

  // Render event cards
  const renderEventCards = (events: Event[]) => (
    <ViewLayouts viewMode={viewMode}>
      {events.map((event) => (
        <EnhancedEventCard
          key={event.id}
          event={event}
          onViewDetails={handleViewDetails}
          onRegister={registerForEvent}
          viewMode={viewMode}
        />
      ))}
    </ViewLayouts>
  );

  return (
    <AppShell>
      <PageLayout
        title={isRTL ? 'استكشاف الفعاليات' : 'Browse Events'}
        description={isRTL ? 'اكتشف وسجل في أحدث الفعاليات والأنشطة الابتكارية' : 'Discover and register for the latest innovation events and activities'}
        itemCount={filteredEvents.length}
        primaryAction={{
          label: isRTL ? 'فعالية جديدة' : 'New Event',
          onClick: () => console.log('Create new event'),
          icon: <Plus className="w-4 h-4" />
        }}
        secondaryActions={
          <LayoutSelector
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        }
        showSearch={true}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={isRTL ? 'البحث في الفعاليات...' : 'Search events...'}
      >
        {/* Enhanced Hero Section */}
        <EventsHero
          totalEvents={events.length}
          upcomingEvents={upcomingCount}
          todayEvents={todayCount}
          onCreateEvent={() => console.log('Create event')}
          onShowFilters={() => setShowAdvancedFilters(true)}
        />

        <div className="space-y-6">
          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="upcoming" className="animate-fade-in">
                <Calendar className="w-4 h-4 mr-2" />
                {isRTL ? 'القادمة' : 'Upcoming'}
                {activeTab === 'upcoming' && (
                  <span className="ml-2 bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs">
                    {filteredEvents.filter(e => new Date(e.event_date) >= new Date()).length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="today" className="animate-fade-in">
                <TrendingUp className="w-4 h-4 mr-2" />
                {isRTL ? 'اليوم' : 'Today'}
                {activeTab === 'today' && (
                  <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                    {filteredEvents.filter(e => {
                      const eventDate = new Date(e.event_date);
                      const today = new Date();
                      return eventDate.toDateString() === today.toDateString();
                    }).length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="all" className="animate-fade-in">
                {isRTL ? 'جميع الفعاليات' : 'All Events'}
                {activeTab === 'all' && (
                  <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                    {filteredEvents.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="past" className="animate-fade-in">
                <MapPin className="w-4 h-4 mr-2" />
                {isRTL ? 'السابقة' : 'Past'}
                {activeTab === 'past' && (
                  <span className="ml-2 bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                    {filteredEvents.filter(e => new Date(e.event_date) < new Date()).length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">{isRTL ? 'جاري تحميل الفعاليات...' : 'Loading events...'}</p>
                </div>
              ) : filteredEvents.length > 0 ? (
                renderEventCards(filteredEvents)
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {isRTL ? 'لا توجد فعاليات' : 'No events found'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? 
                      (isRTL ? `لا توجد فعاليات تطابق البحث "${searchQuery}"` : `No events match your search for "${searchQuery}"`) :
                      (isRTL ? 'لا توجد فعاليات في الوقت الحالي' : 'No events available at the moment')
                    }
                  </p>
                  {searchQuery && (
                    <Button variant="outline" onClick={() => setSearchQuery('')}>
                      {isRTL ? 'مسح البحث' : 'Clear Search'}
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Enhanced Event Detail Dialog */}
        <EnhancedEventDetailDialog
          event={selectedEvent}
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          onRegister={registerForEvent}
        />

        {/* Advanced Filters */}
        <EventAdvancedFilters
          open={showAdvancedFilters}
          onOpenChange={setShowAdvancedFilters}
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={() => setFilters({
            eventTypes: [],
            formats: [],
            status: [],
            dateRange: {},
            location: '',
            priceRange: '',
            capacity: ''
          })}
        />
      </PageLayout>
    </AppShell>
  );
};

export default EventsBrowse;