import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Calendar, MapPin, Users, Clock, Edit, Trash2, Eye, Grid, List, LayoutGrid } from "lucide-react";
import { format } from "date-fns";
import { EventDialog } from "@/components/events/EventDialog";
import { EventFilters } from "@/components/events/EventFilters";
import { EventBulkActions } from "@/components/events/EventBulkActions";

interface Event {
  id: string;
  title: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  event_type?: string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  virtual_link?: string;
  format?: string;
  max_participants?: number;
  registered_participants?: number;
  actual_participants?: number;
  status?: string;
  budget?: number;
  event_manager_id?: string;
  campaign_id?: string;
  challenge_id?: string;
  sector_id?: string;
  target_stakeholder_groups?: string[];
  created_at?: string;
  // Relationships for display
  sectors?: any[];
  challenges?: any[];
  partners?: any[];
  stakeholders?: any[];
  focusQuestions?: any[];
}

export function EventsManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"card" | "list" | "grid">("card");
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [selectedSector, setSelectedSector] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  
  // Dialog states
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
    fetchRelatedData();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, statusFilter, formatFilter, typeFilter, categoryFilter, visibilityFilter, selectedCampaign, selectedSector, dateFrom, dateTo]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      });
    }
  };

  const fetchRelatedData = async () => {
    try {
      const [campaignsRes, sectorsRes] = await Promise.all([
        supabase.from('campaigns').select('*').order('name'),
        supabase.from('sectors').select('*').order('name')
      ]);

      setCampaigns(campaignsRes.data || []);
      setSectors(sectorsRes.data || []);
    } catch (error) {
      console.error('Error fetching related data:', error);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        (event.title_ar && event.title_ar.toLowerCase().includes(searchLower)) ||
        (event.description && event.description.toLowerCase().includes(searchLower)) ||
        (event.description_ar && event.description_ar.toLowerCase().includes(searchLower)) ||
        (event.location && event.location.toLowerCase().includes(searchLower)) ||
        (event.event_type && event.event_type.toLowerCase().includes(searchLower)) ||
        (event.format && event.format.toLowerCase().includes(searchLower)) ||
        (event.status && event.status.toLowerCase().includes(searchLower)) ||
        (event.virtual_link && event.virtual_link.toLowerCase().includes(searchLower))
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    if (formatFilter !== "all") {
      filtered = filtered.filter(event => event.format === formatFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(event => event.event_type === typeFilter);
    }

    if (selectedCampaign !== "all") {
      filtered = filtered.filter(event => event.campaign_id === selectedCampaign);
    }

    if (selectedSector !== "all") {
      filtered = filtered.filter(event => event.sector_id === selectedSector);
    }

    if (dateFrom) {
      filtered = filtered.filter(event => new Date(event.event_date) >= dateFrom);
    }

    if (dateTo) {
      filtered = filtered.filter(event => new Date(event.event_date) <= dateTo);
    }

    setFilteredEvents(filtered);
  };

  const handleView = async (event: Event) => {
    try {
      // Fetch detailed relationship data for viewing
      const [partnersRes, stakeholdersRes, focusQuestionsRes] = await Promise.all([
        supabase
          .from('event_partner_links')
          .select(`
            partner_id,
            partners!inner(*)
          `)
          .eq('event_id', event.id),
        supabase
          .from('event_stakeholder_links')
          .select(`
            stakeholder_id,
            stakeholders!inner(*)
          `)
          .eq('event_id', event.id),
        supabase
          .from('event_focus_question_links')
          .select(`
            focus_question_id,
            focus_questions!inner(*)
          `)
          .eq('event_id', event.id)
      ]);

      const enhancedEvent = {
        ...event,
        partners: partnersRes.data?.map(item => item.partners) || [],
        stakeholders: stakeholdersRes.data?.map(item => item.stakeholders) || [],
        focusQuestions: focusQuestionsRes.data?.map(item => item.focus_questions) || []
      };

      setViewingEvent(enhancedEvent);
    } catch (error) {
      console.error('Error loading event details:', error);
      setViewingEvent(event);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setShowEventDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;

    try {
      // Delete related links first
      await Promise.all([
        supabase.from('event_partner_links').delete().eq('event_id', id),
        supabase.from('event_stakeholder_links').delete().eq('event_id', id),
        supabase.from('event_focus_question_links').delete().eq('event_id', id),
        supabase.from('event_challenge_links').delete().eq('event_id', id)
      ]);

      // Then delete the event
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
      
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const handleEventSave = () => {
    setShowEventDialog(false);
    setEditingEvent(null);
    fetchEvents();
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setFormatFilter("all");
    setTypeFilter("all");
    setCategoryFilter("all");
    setVisibilityFilter("all");
    setSelectedCampaign("all");
    setSelectedSector("all");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter !== "all") count++;
    if (formatFilter !== "all") count++;
    if (typeFilter !== "all") count++;
    if (categoryFilter !== "all") count++;
    if (visibilityFilter !== "all") count++;
    if (selectedCampaign !== "all") count++;
    if (selectedSector !== "all") count++;
    if (dateFrom) count++;
    if (dateTo) count++;
    return count;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'postponed': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'in_person': return 'bg-purple-100 text-purple-800';
      case 'virtual': return 'bg-cyan-100 text-cyan-800';
      case 'hybrid': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Events Management</h1>
          <p className="text-muted-foreground">Manage and organize all events</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Layout Selector */}
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "card" | "list" | "grid")}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="card" className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                Cards
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                List
              </TabsTrigger>
              <TabsTrigger value="grid" className="flex items-center gap-2">
                <Grid className="h-4 w-4" />
                Grid
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button onClick={() => setShowEventDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      <EventFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        formatFilter={formatFilter}
        onFormatChange={setFormatFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        visibilityFilter={visibilityFilter}
        onVisibilityChange={setVisibilityFilter}
        selectedCampaign={selectedCampaign}
        onCampaignChange={setSelectedCampaign}
        selectedSector={selectedSector}
        onSectorChange={setSelectedSector}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        campaigns={campaigns}
        sectors={sectors}
        onClearFilters={clearAllFilters}
        activeFiltersCount={getActiveFiltersCount()}
      />

      <EventBulkActions
        selectedEvents={selectedEvents}
        onSelectionChange={setSelectedEvents}
        events={filteredEvents}
        onRefresh={fetchEvents}
      />

      {/* Events Display with Different View Modes */}
      <Tabs value={viewMode} className="w-full">
        <TabsContent value="card" className="space-y-4">
          <div className="grid gap-4">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      {event.title_ar && (
                        <p className="text-sm text-muted-foreground mt-1" dir="rtl">
                          {event.title_ar}
                        </p>
                      )}
                      <div className="flex gap-2 mt-2">
                        <Badge className={getStatusColor(event.status || 'scheduled')}>
                          {event.status || 'scheduled'}
                        </Badge>
                        <Badge className={getFormatColor(event.format || 'in_person')}>
                          {event.format || 'in_person'}
                        </Badge>
                        {event.event_type && (
                          <Badge variant="outline">
                            {event.event_type}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(event)}
                        className="h-9 w-9 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(event)}
                        className="h-9 w-9 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(event.id)}
                        className="h-9 w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(new Date(event.event_date), 'PPP')}</span>
                    </div>
                    {event.start_time && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{event.start_time} - {event.end_time}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                    {event.max_participants && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{event.registered_participants || 0}/{event.max_participants}</span>
                      </div>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-2">
          <div className="space-y-2">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="py-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                      <div className="md:col-span-2">
                        <h3 className="font-medium">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.event_type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{format(new Date(event.event_date), 'MMM dd, yyyy')}</span>
                      </div>
                      <div>
                        <Badge className={getStatusColor(event.status || 'scheduled')} variant="outline">
                          {event.status || 'scheduled'}
                        </Badge>
                      </div>
                      <div>
                        <Badge className={getFormatColor(event.format || 'in_person')} variant="outline">
                          {event.format || 'in_person'}
                        </Badge>
                      </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{event.registered_participants || 0}/{event.max_participants || '∞'}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(event)}
                      className="h-9 w-9 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(event)}
                      className="h-9 w-9 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(event.id)}
                      className="h-9 w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-base line-clamp-1">{event.title}</CardTitle>
                       <div className="flex gap-1 mt-2">
                         <Badge variant="outline" className={`text-xs ${getStatusColor(event.status || 'scheduled')}`}>
                           {event.status || 'scheduled'}
                         </Badge>
                         <Badge variant="outline" className={`text-xs ${getFormatColor(event.format || 'in_person')}`}>
                           {event.format || 'in_person'}
                         </Badge>
                       </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(event)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(event)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(event.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>{format(new Date(event.event_date), 'MMM dd')}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate text-xs">{event.location}</span>
                      </div>
                    )}
                    {event.max_participants && (
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{event.registered_participants || 0}/{event.max_participants}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredEvents.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No events found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      <EventDialog
        isOpen={showEventDialog}
        onClose={() => {
          setShowEventDialog(false);
          setEditingEvent(null);
        }}
        event={editingEvent}
        onSave={handleEventSave}
      />

      <Dialog open={!!viewingEvent} onOpenChange={(open) => !open && setViewingEvent(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {viewingEvent?.title}
            </DialogTitle>
          </DialogHeader>
          {viewingEvent && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Event Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Date:</strong> {format(new Date(viewingEvent.event_date), 'PPP')}</p>
                    <p><strong>Time:</strong> {viewingEvent.start_time} - {viewingEvent.end_time}</p>
                    <p><strong>Format:</strong> {viewingEvent.format}</p>
                    <p><strong>Status:</strong> {viewingEvent.status}</p>
                    {viewingEvent.location && <p><strong>Location:</strong> {viewingEvent.location}</p>}
                    {viewingEvent.virtual_link && <p><strong>Virtual Link:</strong> {viewingEvent.virtual_link}</p>}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Participants</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Max Participants:</strong> {viewingEvent.max_participants || 'No limit'}</p>
                    <p><strong>Registered:</strong> {viewingEvent.registered_participants || 0}</p>
                    <p><strong>Actual:</strong> {viewingEvent.actual_participants || 0}</p>
                    {viewingEvent.budget && <p><strong>Budget:</strong> ${viewingEvent.budget}</p>}
                  </div>
                </div>
              </div>
              
              {viewingEvent.description && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm">{viewingEvent.description}</p>
                </div>
              )}

              {viewingEvent.partners && viewingEvent.partners.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Partners</h4>
                  <div className="flex gap-2 flex-wrap">
                    {viewingEvent.partners.map((partner: any) => (
                      <Badge key={partner.id} variant="outline">
                        {partner.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {viewingEvent.stakeholders && viewingEvent.stakeholders.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Stakeholders</h4>
                  <div className="flex gap-2 flex-wrap">
                    {viewingEvent.stakeholders.map((stakeholder: any) => (
                      <Badge key={stakeholder.id} variant="outline">
                        {stakeholder.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {viewingEvent.focusQuestions && viewingEvent.focusQuestions.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Focus Questions</h4>
                  <div className="space-y-2">
                    {viewingEvent.focusQuestions.map((question: any) => (
                      <div key={question.id} className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">{question.question_text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}