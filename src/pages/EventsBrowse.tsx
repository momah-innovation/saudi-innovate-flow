import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, MapPin, Users, Clock, Search, Filter,
  Eye, UserPlus, Building, Globe, ExternalLink
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AppShell } from '@/components/layout/AppShell';

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
}

interface EventFilters {
  format: string;
  event_type: string;
  event_category: string;
  status: string;
  date_range: string;
}

const EVENT_FORMATS = [
  { value: 'all', label: 'All Formats' },
  { value: 'virtual', label: 'Virtual' },
  { value: 'in_person', label: 'In Person' },
  { value: 'hybrid', label: 'Hybrid' }
];

const EVENT_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'conference', label: 'Conference' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'networking', label: 'Networking' },
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'training', label: 'Training' }
];

const DATE_RANGES = [
  { value: 'all', label: 'All Dates' },
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'next_month', label: 'Next Month' }
];

export default function EventsBrowse() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const [filters, setFilters] = useState<EventFilters>({
    format: 'all',
    event_type: 'all',
    event_category: 'all',
    status: 'all',
    date_range: 'all'
  });

  useEffect(() => {
    loadEvents();
  }, [activeTab, filters]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      // Apply status filter based on active tab
      if (activeTab === 'upcoming') {
        query = query.gte('event_date', new Date().toISOString().split('T')[0]);
      } else if (activeTab === 'past') {
        query = query.lt('event_date', new Date().toISOString().split('T')[0]);
      }

      // Apply filters
      if (filters.format !== 'all') {
        query = query.eq('format', filters.format);
      }
      if (filters.event_type !== 'all') {
        query = query.eq('event_type', filters.event_type);
      }
      if (filters.event_category !== 'all') {
        query = query.eq('event_category', filters.event_category);
      }
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;

      if (error) throw error;
      setEvents(data || []);
      
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Error loading events');
    } finally {
      setLoading(false);
    }
  };

  const registerForEvent = async (eventId: string) => {
    if (!userProfile?.id) {
      toast.error('Please log in to register for events');
      return;
    }

    try {
      const { error } = await supabase
        .from('event_participants')
        .insert({
          event_id: eventId,
          user_id: userProfile.id,
          registration_type: 'self_registered',
          attendance_status: 'registered'
        });

      if (error) throw error;

      toast.success('Successfully registered for event!');
      loadEvents(); // Reload to update participant count
      
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('You are already registered for this event');
      } else {
        console.error('Error registering for event:', error);
        toast.error('Error registering for event');
      }
    }
  };

  const getEventStatus = (event: Event) => {
    const eventDate = new Date(event.event_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    if (eventDate > today) return 'upcoming';
    if (eventDate.getTime() === today.getTime()) return 'today';
    return 'past';
  };

  const getStatusBadge = (event: Event) => {
    const status = getEventStatus(event);
    const isFullyBooked = event.max_participants && event.registered_participants >= event.max_participants;

    if (status === 'today') return <Badge variant="default">Today</Badge>;
    if (status === 'upcoming' && isFullyBooked) return <Badge variant="destructive">Fully Booked</Badge>;
    if (status === 'upcoming') return <Badge variant="outline">Open for Registration</Badge>;
    return <Badge variant="secondary">Past Event</Badge>;
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'virtual': return <Globe className="w-4 h-4" />;
      case 'in_person': return <MapPin className="w-4 h-4" />;
      case 'hybrid': return <Building className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const filteredEvents = events.filter(event =>
    event.title_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.description_ar && event.description_ar.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AppShell>
      <PageLayout
        title="استكشاف الفعاليات"
        description="اكتشف وسجل في أحدث الفعاليات والأنشطة الابتكارية"
        showSearch={true}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="البحث في الفعاليات..."
        filters={
          <div className="flex flex-wrap gap-2 items-center">
            <Select value={filters.format} onValueChange={(value) => setFilters(prev => ({ ...prev, format: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EVENT_FORMATS.map(format => (
                  <SelectItem key={format.value} value={format.value}>{format.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.event_type} onValueChange={(value) => setFilters(prev => ({ ...prev, event_type: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
        className="space-y-6"
      >

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Upcoming Events
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            All Events
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Past Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading events...</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getFormatIcon(event.format)}
                        <Badge variant="outline" className="capitalize">
                          {event.event_type}
                        </Badge>
                      </div>
                      {getStatusBadge(event)}
                    </div>
                    <CardTitle className="text-lg">{event.title_ar}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {event.description_ar}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Date and Time */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(event.event_date).toLocaleDateString('ar-SA')}
                        {event.start_time && ` • ${event.start_time}`}
                        {event.end_time && ` - ${event.end_time}`}
                      </span>
                    </div>

                    {/* Location */}
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}

                    {/* Virtual Link */}
                    {event.virtual_link && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Globe className="w-4 h-4" />
                        <span>Virtual Event</span>
                      </div>
                    )}

                    {/* Participants */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>
                        {event.registered_participants} registered
                        {event.max_participants && ` / ${event.max_participants} max`}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => navigate(`/events/${event.id}`)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      
                      {getEventStatus(event) === 'upcoming' && (
                        <Button
                          onClick={() => registerForEvent(event.id)}
                          size="sm"
                          className="flex-1"
                          disabled={event.max_participants && event.registered_participants >= event.max_participants}
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          {event.max_participants && event.registered_participants >= event.max_participants
                            ? 'Full' 
                            : 'Register'
                          }
                        </Button>
                      )}

                      {event.virtual_link && getEventStatus(event) === 'today' && (
                        <Button
                          onClick={() => window.open(event.virtual_link, '_blank')}
                          size="sm"
                          className="flex-1"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Join
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No events found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? `No events match your search for "${searchTerm}"`
                  : activeTab === 'upcoming' 
                    ? 'No upcoming events at the moment' 
                    : 'No events available'
                }
              </p>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            <Button onClick={() => navigate('/event-registration')} variant="outline">
              <UserPlus className="w-4 h-4 mr-2" />
              View My Registrations
            </Button>
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
      </PageLayout>
    </AppShell>
  );
}