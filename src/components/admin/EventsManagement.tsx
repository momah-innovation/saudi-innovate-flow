import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Calendar, MapPin, Users, Clock, Edit, Trash2, Eye } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { format } from "date-fns";
import { EventDialog } from "@/components/events/EventDialog";

// New UI Library Components
import { PageHeader } from "@/components/ui/page-header";
import { LayoutSelector } from "@/components/ui/layout-selector";
import { SearchAndFilters } from "@/components/ui/search-and-filters";
import { EmptyState } from "@/components/ui/empty-state";
import { DeleteConfirmation } from "@/components/ui/delete-confirmation";
import { ViewLayouts } from "@/components/ui/view-layouts";
import { BulkActions } from "@/components/ui/bulk-actions";

interface Event {
  id: string;
  title_ar: string;
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

interface EventsManagementProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  viewMode?: 'cards' | 'list' | 'grid';
  onViewModeChange?: (mode: 'cards' | 'list' | 'grid') => void;
  showAddDialog?: boolean;
  setShowAddDialog?: (show: boolean) => void;
}

export function EventsManagement({
  searchValue,
  onSearchChange,
  viewMode: externalViewMode,
  onViewModeChange,
  showAddDialog: externalShowAddDialog,
  setShowAddDialog: externalSetShowAddDialog
}: EventsManagementProps = {}) {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [selectedSector, setSelectedSector] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Dialog states
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);

  // Use external controls if provided, otherwise use internal state
  const currentSearchTerm = searchValue ?? searchTerm;
  const currentViewMode = externalViewMode ?? viewMode;
  const currentShowAddDialog = externalShowAddDialog ?? showEventDialog;

  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
    fetchRelatedData();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, currentSearchTerm, statusFilter, formatFilter, typeFilter, selectedCampaign, selectedSector]);

  // Update internal search when external search changes
  useEffect(() => {
    if (searchValue !== undefined) {
      setSearchTerm(searchValue);
    }
  }, [searchValue]);

  // Update external view mode when internal changes
  useEffect(() => {
    if (onViewModeChange && externalViewMode === undefined) {
      onViewModeChange(viewMode);
    }
  }, [viewMode, onViewModeChange, externalViewMode]);

  // Handle external add dialog
  useEffect(() => {
    if (externalShowAddDialog !== undefined) {
      setShowEventDialog(externalShowAddDialog);
    }
  }, [externalShowAddDialog]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;
      setEvents((data as any) || []);
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
        supabase.from('campaigns').select('*').order('title_ar'),
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

    if (currentSearchTerm) {
      const searchLower = currentSearchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.title_ar.toLowerCase().includes(searchLower) ||
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

    setFilteredEvents(filtered);
  };

  const handleView = async (event: Event) => {
    try {
      const [partnersRes, stakeholdersRes, focusQuestionsRes] = await Promise.all([
        supabase
          .from('event_partner_links')
          .select('partner_id, partners!inner(*)')
          .eq('event_id', event.id),
        supabase
          .from('event_stakeholder_links')
          .select('stakeholder_id, stakeholders!inner(*)')
          .eq('event_id', event.id),
        supabase
          .from('event_focus_question_links')
          .select('focus_question_id, focus_questions!inner(*)')
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
    try {
      await Promise.all([
        supabase.from('event_partner_links').delete().eq('event_id', id),
        supabase.from('event_stakeholder_links').delete().eq('event_id', id),
        supabase.from('event_focus_question_links').delete().eq('event_id', id),
        supabase.from('event_challenge_links').delete().eq('event_id', id)
      ]);

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
    if (externalSetShowAddDialog) {
      externalSetShowAddDialog(false);
    }
    setEditingEvent(null);
    fetchEvents();
  };

  const handleCreateNew = () => {
    if (externalSetShowAddDialog) {
      externalSetShowAddDialog(true);
    } else {
      setShowEventDialog(true);
    }
  };

  const clearAllFilters = () => {
    if (onSearchChange) {
      onSearchChange("");
    } else {
      setSearchTerm("");
    }
    setStatusFilter("all");
    setFormatFilter("all");
    setTypeFilter("all");
    setSelectedCampaign("all");
    setSelectedSector("all");
  };

  const hasActiveFilters = () => {
    return statusFilter !== "all" || formatFilter !== "all" || typeFilter !== "all" || 
           selectedCampaign !== "all" || selectedSector !== "all";
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

  const renderEventCard = (event: Event) => (
    <Card key={event.id} className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{event.title_ar}</CardTitle>
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
            <Button variant="ghost" size="sm" onClick={() => handleView(event)} className="h-9 w-9 p-0">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleEdit(event)} className="h-9 w-9 p-0">
              <Edit className="h-4 w-4" />
            </Button>
            <DeleteConfirmation
              title="Delete Event"
              description={`Are you sure you want to delete "${event.title_ar}"? This action cannot be undone and will permanently remove the event and all associated data.`}
              onConfirm={() => handleDelete(event.id)}
            />
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
        {event.description_ar && (
          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
            {event.description_ar}
          </p>
        )}
      </CardContent>
    </Card>
  );

  const renderListView = (events: React.ReactNode[]) => (
    <div className="space-y-3">
      {filteredEvents.map((event) => (
        <Card key={event.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold">{event.title_ar}</h3>
                <Badge className={`${getStatusColor(event.status || 'scheduled')} flex items-center gap-1`}>
                  {event.status || 'scheduled'}
                </Badge>
                <Badge className={`${getFormatColor(event.format || 'in_person')} flex items-center gap-1`}>
                  {event.format || 'in_person'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">{event.description_ar}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(event.event_date), 'PPP')}
                </span>
                {event.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {event.location}
                  </span>
                )}
                {event.max_participants && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {event.registered_participants || 0}/{event.max_participants}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleView(event)}>
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>
                <Edit className="w-4 h-4" />
              </Button>
              <DeleteConfirmation
                title="Delete Event"
                description={`Are you sure you want to delete "${event.title_ar}"? This action cannot be undone.`}
                onConfirm={() => handleDelete(event.id)}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <div>
            <Label htmlFor="status-filter">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="postponed">Postponed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="format-filter">Format</Label>
            <Select value={formatFilter} onValueChange={setFormatFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All formats" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Formats</SelectItem>
                <SelectItem value="in_person">In Person</SelectItem>
                <SelectItem value="virtual">Virtual</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="type-filter">Type</Label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="seminar">Seminar</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
                <SelectItem value="networking">Networking</SelectItem>
                <SelectItem value="training">Training</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="campaign-filter">Campaign</Label>
            <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
              <SelectTrigger>
                <SelectValue placeholder="All campaigns" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                 {campaigns.map((campaign) => (
                   <SelectItem key={campaign.id} value={campaign.id}>
                     {campaign.title_ar}
                   </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="sector-filter">Sector</Label>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger>
                <SelectValue placeholder="All sectors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {sectors.map((sector) => (
                  <SelectItem key={sector.id} value={sector.id}>
                    {sector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <BulkActions
        selectedItems={selectedEvents}
        onSelectAll={(selected) => {
          if (selected) {
            setSelectedEvents(filteredEvents.map(e => e.id));
          } else {
            setSelectedEvents([]);
          }
        }}
        onSelectItem={(id, selected) => {
          if (selected) {
            setSelectedEvents([...selectedEvents, id]);
          } else {
            setSelectedEvents(selectedEvents.filter(eventId => eventId !== id));
          }
        }}
        totalItems={filteredEvents.length}
        actions={[
          {
            id: 'delete',
            label: 'Delete Selected',
            icon: <Trash2 className="w-4 h-4" />,
            variant: 'destructive',
            onClick: (selectedIds) => {
              if (confirm(`Are you sure you want to delete ${selectedIds.length} events?`)) {
                Promise.all(selectedIds.map(id => handleDelete(id)))
                  .then(() => setSelectedEvents([]));
              }
            }
          }
        ]}
      />

      <ViewLayouts
        viewMode={currentViewMode}
        listRenderer={renderListView}
      >
        {filteredEvents.map(renderEventCard)}
      </ViewLayouts>

      {filteredEvents.length === 0 && (
        <EmptyState
          title="No events found"
          description={
            currentSearchTerm || hasActiveFilters()
              ? "Try adjusting your search criteria or filters"
              : "Get started by creating your first event"
          }
          action={
            !currentSearchTerm && !hasActiveFilters()
              ? { label: "Create First Event", onClick: handleCreateNew }
              : undefined
          }
          isFiltered={currentSearchTerm !== "" || hasActiveFilters()}
        />
      )}


      <EventDialog
        isOpen={currentShowAddDialog}
        onClose={() => {
          if (externalSetShowAddDialog) {
            externalSetShowAddDialog(false);
          } else {
            setShowEventDialog(false);
          }
          setEditingEvent(null);
        }}
        event={editingEvent}
        onSave={handleEventSave}
      />

      <Dialog open={!!viewingEvent} onOpenChange={(open) => !open && setViewingEvent(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingEvent?.title_ar}</DialogTitle>
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
              
              {viewingEvent.description_ar && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm">{viewingEvent.description_ar}</p>
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