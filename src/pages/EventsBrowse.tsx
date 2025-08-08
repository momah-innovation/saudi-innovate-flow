import { useState, useEffect } from 'react';
import { StandardBrowseLayout } from '@/components/layout/StandardBrowseLayout';
import { PageLayout } from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LayoutSelector, ViewMode } from '@/components/ui/layout-selector';
import { ViewLayouts } from '@/components/ui/view-layouts';
import { useToast } from '@/hooks/use-toast';
import { useDirection } from '@/components/ui/direction-provider';
import { EnhancedEventCard } from '@/components/events/EnhancedEventCard';
import { ComprehensiveEventDialog } from '@/components/events/ComprehensiveEventDialog';
import { EventsHero } from '@/components/events/EventsHero';
import { EventAdvancedFilters } from '@/components/events/EventAdvancedFilters';
import { EventRecommendations } from '@/components/events/EventRecommendations';
import { EventCalendarView } from '@/components/events/EventCalendarView';
import { EventWaitlistDialog } from '@/components/events/EventWaitlistDialog';
import { EventReviewsDialog } from '@/components/events/EventReviewsDialog';
import { EventSocialShare } from '@/components/events/EventSocialShare';
import { EnhancedEventsHero } from '@/components/events/EnhancedEventsHero';
import { logger } from '@/utils/logger';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

import { EventAnalyticsDashboard } from '@/components/events/EventAnalyticsDashboard';
import { TrendingEventsWidget } from '@/components/events/TrendingEventsWidget';
import { EventStatsWidget } from '@/components/events/EventStatsWidget';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useParticipants } from '@/hooks/useParticipants';
import { Plus, Calendar, TrendingUp, MapPin, Grid, List, CalendarDays, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
  image_url?: string;
}

const EventsBrowse = () => {
  const { isRTL } = useDirection();
  const { toast } = useToast();
  const { user, userProfile, hasRole } = useAuth();
  
  // State management
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showWaitlistDialog, setShowWaitlistDialog] = useState(false);
  const [showReviewsDialog, setShowReviewsDialog] = useState(false);
  const [waitlistEvent, setWaitlistEvent] = useState<Event | null>(null);
  const [reviewsEvent, setReviewsEvent] = useState<Event | null>(null);
  
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
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      const threeMonthsAgoStr = threeMonthsAgo.toISOString().split('T')[0];
      
      if (activeTab === 'upcoming') {
        query = query.gte('event_date', today);
      } else if (activeTab === 'past') {
        // Only show past events from the last 3 months
        query = query.lt('event_date', today).gte('event_date', threeMonthsAgoStr);
      } else if (activeTab === 'today') {
        query = query.eq('event_date', today);
      }

      const { data: eventsData, error: eventsError } = await query;

      if (eventsError) throw eventsError;

      // Get participant counts for each event and add default images
      const eventsWithCounts = await Promise.all(
        (eventsData || []).map(async (event) => {
          const { count, error: countError } = await supabase
            .from('event_participants')
            .select('*', { count: 'exact' })
            .eq('event_id', event.id);

          if (countError) {
            logger.error('Failed to get participant count', { component: 'EventsBrowse', action: 'getParticipantCount', eventId: event.id }, countError as Error);
            return { 
              ...event, 
              registered_participants: 0,
              image_url: event.image_url || '/event-images/innovation.jpg'
            };
          }

          return { 
            ...event, 
            registered_participants: count || 0,
            image_url: event.image_url || getDefaultEventImage(event.event_type)
          };
        })
      );

      setEvents(eventsWithCounts);
      
    } catch (error) {
      logger.error('Failed to load events', { component: 'EventsBrowse', action: 'loadEvents' }, error as Error);
      toast({
        title: isRTL ? 'خطأ في تحميل الفعاليات' : 'Error loading events',
        description: isRTL ? 'حدث خطأ أثناء تحميل الفعاليات' : 'An error occurred while loading events',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get default event images
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

    // Check if event is in the past
    const eventDate = new Date(event.event_date);
    const now = new Date();
    if (eventDate < now) {
      toast({
        title: isRTL ? 'لا يمكن التسجيل' : 'Registration Not Available',
        description: isRTL ? 'لا يمكن التسجيل في فعالية انتهت' : 'Cannot register for a past event',
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
      logger.error('Failed to register for event', { component: 'EventsBrowse', action: 'registerForEvent' }, error as Error);
      toast({
        title: isRTL ? 'خطأ في التسجيل' : 'Registration Error',
        description: isRTL ? 'حدث خطأ أثناء التسجيل في الفعالية' : 'An error occurred while registering for the event',
        variant: 'destructive'
      });
    }
  };

  const cancelRegistration = async (event: Event) => {
    if (!user) {
      toast({
        title: isRTL ? 'يرجى تسجيل الدخول' : 'Please log in',
        description: isRTL ? 'يجب تسجيل الدخول لإلغاء التسجيل' : 'You need to log in to cancel registration',
        variant: 'destructive'
      });
      return;
    }

    // Check if event is in the past
    const eventDate = new Date(event.event_date);
    const now = new Date();
    if (eventDate < now) {
      toast({
        title: isRTL ? 'لا يمكن إلغاء التسجيل' : 'Cannot Cancel Registration',
        description: isRTL ? 'لا يمكن إلغاء التسجيل من فعالية انتهت' : 'Cannot cancel registration for a past event',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Find the user's participation record
      const { data: participation, error: findError } = await supabase
        .from('event_participants')
        .select('id')
        .eq('event_id', event.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (findError) throw findError;

      if (!participation) {
        toast({
          title: isRTL ? 'لم يتم العثور على التسجيل' : 'Registration not found',
          description: isRTL ? 'لم يتم العثور على تسجيلك في هذه الفعالية' : 'Your registration for this event was not found',
          variant: 'destructive'
        });
        return;
      }

      // Delete the participation record
      const { error: deleteError } = await supabase
        .from('event_participants')
        .delete()
        .eq('id', participation.id);

      if (deleteError) throw deleteError;

      // Update event registered participants count
      const { error: updateError } = await supabase
        .from('events')
        .update({ 
          registered_participants: Math.max(0, event.registered_participants - 1)
        })
        .eq('id', event.id);

      if (updateError) throw updateError;

      toast({
        title: isRTL ? 'تم إلغاء التسجيل بنجاح!' : 'Successfully Cancelled!',
        description: isRTL ? `تم إلغاء تسجيلك من فعالية "${event.title_ar}"` : `Your registration for "${event.title_ar}" has been cancelled`,
      });

      // Reload events to update participant count
      loadEvents();
      
    } catch (error) {
      logger.error('Failed to cancel registration', { component: 'EventsBrowse', action: 'cancelRegistration' }, error as Error);
      toast({
        title: isRTL ? 'خطأ في إلغاء التسجيل' : 'Cancellation Error',
        description: isRTL ? 'حدث خطأ أثناء إلغاء التسجيل' : 'An error occurred while cancelling registration',
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
  const renderEventCards = (events: Event[]) => {
    if (viewMode === 'calendar') {
      return null; // Calendar view is handled separately
    }
    
    return (
      <ViewLayouts viewMode={viewMode}>
        {events.map((event) => (
          <EnhancedEventCard
            key={event.id}
            event={event}
            onViewDetails={handleViewDetails}
            onRegister={registerForEvent}
            onCancelRegistration={cancelRegistration}
            viewMode={viewMode as 'cards' | 'list' | 'grid'}
          />
        ))}
      </ViewLayouts>
    );
  };

  return (
    <StandardBrowseLayout
      hero={
        <EnhancedEventsHero
          totalEvents={events.length}
          upcomingEvents={upcomingCount}
          todayEvents={todayCount}
          onCreateEvent={user && (hasRole('admin') || hasRole('super_admin') || hasRole('innovation_team_member')) ? 
            () => logger.info('Create event requested', { component: 'EventsBrowse', action: 'onCreateEvent' }) : 
            () => {}}
          onShowFilters={() => setShowAdvancedFilters(true)}
          canCreateEvent={user && (hasRole('admin') || hasRole('super_admin') || hasRole('innovation_team_member'))}
          featuredEvent={events.length > 0 ? {
            id: events[0].id,
            title_ar: events[0].title_ar,
            participants: events[0].registered_participants || 0,
            date: events[0].event_date,
            image: events[0].image_url
          } : undefined}
        />
      }
      mainContent={
        <div className="space-y-6">
          {/* Page Title and Description */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {isRTL ? 'استكشاف الفعاليات' : 'Browse Events'}
            </h1>
            <p className="text-muted-foreground">
              {isRTL ? 'اكتشف وسجل في أحدث الفعاليات والأنشطة الابتكارية' : 'Discover and register for the latest innovation events and activities'}
              {` (${filteredEvents.length} ${filteredEvents.length === 1 ? (isRTL ? 'عنصر' : 'Item') : (isRTL ? 'عناصر' : 'Items')})`}
            </p>
          </div>

          {/* Controls Row */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Left side - Search */}
            <div className="flex-1">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2" />
                <Input
                  className="pl-10 h-9"
                  placeholder={isRTL ? 'البحث في الفعاليات...' : 'Search events...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Right side - Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => logger.info('Analytics requested', { component: 'EventsBrowse', action: 'showAnalytics' })}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                {isRTL ? 'الإحصائيات' : 'Analytics'}
              </Button>
              <LayoutSelector
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                supportedLayouts={['cards', 'list', 'grid', 'calendar']}
              />
              {user && (hasRole('admin') || hasRole('super_admin') || hasRole('innovation_team_member')) && (
                <Button onClick={() => logger.info('New event requested', { component: 'EventsBrowse', action: 'createNewEvent' })}>
                  <Plus className="w-4 h-4 mr-2" />
                  {isRTL ? 'فعالية جديدة' : 'New Event'}
                </Button>
              )}
            </div>
          </div>
          {/* Content */}
          <div className="space-y-6">
            {/* Calendar View */}
            {viewMode === 'calendar' ? (
              <EventCalendarView
                events={filteredEvents}
                onEventSelect={(event) => {
                  setSelectedEvent(event);
                  setDetailDialogOpen(true);
                }}
                loading={loading}
              />
            ) : (
              /* Tabs Navigation */
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
                    <span className="ml-2 bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs">
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
                    <span className="ml-2 bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs">
                      {filteredEvents.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="past" className="animate-fade-in">
                  <MapPin className="w-4 h-4 mr-2" />
                  {isRTL ? 'السابقة' : 'Past'}
                  {activeTab === 'past' && (
                    <span className="ml-2 bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs">
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
            )}
          </div>
        </div>
      }
      sidebar={
        <div className="space-y-4">
          {/* Event Stats Widget */}
          <EventStatsWidget />

          {/* Trending Events Widget */}
          {viewMode !== 'calendar' && (
            <TrendingEventsWidget
              onEventSelect={(eventId) => {
                if (eventId === 'all') {
                  // Handle view all trending events
                  return;
                }
                const event = events.find(e => e.id === eventId);
                if (event) {
                  setSelectedEvent(event);
                  setDetailDialogOpen(true);
                }
              }}
            />
          )}

          {/* Personalized Recommendations */}
          {user && activeTab === 'upcoming' && viewMode !== 'calendar' && (
            <EventRecommendations 
              onEventSelect={(eventId) => {
                if (eventId === 'all-recommendations') {
                  // Handle view all recommendations
                  return;
                }
                const event = events.find(e => e.id === eventId);
                if (event) {
                  setSelectedEvent(event);
                  setDetailDialogOpen(true);
                }
              }}
            />
          )}
        </div>
      }
      dialogs={
        <>
          {/* Enhanced Event Detail Dialog */}
          <ComprehensiveEventDialog
            event={selectedEvent}
            open={detailDialogOpen}
            onOpenChange={setDetailDialogOpen}
            onRegister={registerForEvent}
          />

          {/* Waitlist Dialog */}
          <EventWaitlistDialog
            event={waitlistEvent}
            open={showWaitlistDialog}
            onOpenChange={setShowWaitlistDialog}
            onSuccess={() => {
              loadEvents(); // Refresh events after joining waitlist
            }}
          />

          {/* Reviews Dialog */}
          <EventReviewsDialog
            event={reviewsEvent}
            open={showReviewsDialog}
            onOpenChange={setShowReviewsDialog}
          />
          
          {/* Advanced Filters Dialog */}
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
        </>
      }
    />
  );
};

export default EventsBrowse;