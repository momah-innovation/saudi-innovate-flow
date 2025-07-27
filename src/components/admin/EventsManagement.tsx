import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Users, 
  Calendar,
  MapPin,
  Building,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  ChevronsUpDown,
  Check,
  X,
  Video,
  Globe
} from "lucide-react";

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
  status: string;
  budget?: number;
  event_manager_id?: string;
  campaign_id?: string;
  challenge_id?: string;
  sector_id?: string;
  partner_ids?: string[];
  stakeholder_ids?: string[];
  focus_question_ids?: string[];
  created_at?: string;
}

export function EventsManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [stepErrors, setStepErrors] = useState<{[key: number]: string[]}>({});
  const totalSteps = 3;
  
  // Search states for dropdowns
  const [openCampaign, setOpenCampaign] = useState(false);
  const [openChallenge, setOpenChallenge] = useState(false);
  const [openSector, setOpenSector] = useState(false);
  const [partnerSearch, setPartnerSearch] = useState("");
  const [stakeholderSearch, setStakeholderSearch] = useState("");
  const [focusQuestionSearch, setFocusQuestionSearch] = useState("");
  
  // Form data
  const [formData, setFormData] = useState({
    title: "",
    title_ar: "",
    description: "",
    description_ar: "",
    event_type: "workshop",
    event_date: "",
    start_time: "",
    end_time: "",
    location: "",
    virtual_link: "",
    format: "in_person",
    max_participants: "",
    status: "scheduled",
    budget: "",
    campaign_id: "",
    challenge_id: "",
    sector_id: "",
  });

  // Related data
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [stakeholders, setStakeholders] = useState<any[]>([]);
  const [focusQuestions, setFocusQuestions] = useState<any[]>([]);
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const [selectedStakeholders, setSelectedStakeholders] = useState<string[]>([]);
  const [selectedFocusQuestions, setSelectedFocusQuestions] = useState<string[]>([]);

  const { toast } = useToast();

  // Event type and format options
  const eventTypes = [
    { value: "workshop", label: "Workshop" },
    { value: "seminar", label: "Seminar" },
    { value: "conference", label: "Conference" },
    { value: "networking", label: "Networking Event" },
    { value: "hackathon", label: "Hackathon" },
    { value: "pitch_session", label: "Pitch Session" },
    { value: "training", label: "Training Session" }
  ];

  const formatOptions = [
    { value: "in_person", label: "In Person" },
    { value: "virtual", label: "Virtual" },
    { value: "hybrid", label: "Hybrid" }
  ];

  const statusOptions = [
    { value: "scheduled", label: "Scheduled" },
    { value: "ongoing", label: "Ongoing" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "postponed", label: "Postponed" }
  ];

  useEffect(() => {
    fetchEvents();
    fetchRelatedData();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, statusFilter, formatFilter, typeFilter]);

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
      const [campaignsRes, challengesRes, sectorsRes, partnersRes, stakeholdersRes, focusQuestionsRes] = await Promise.all([
        supabase.from('campaigns').select('*'),
        supabase.from('challenges').select('*'),
        supabase.from('sectors').select('*'),
        supabase.from('partners').select('*'),
        supabase.from('stakeholders').select('*'),
        supabase.from('focus_questions').select('*')
      ]);

      setCampaigns(campaignsRes.data || []);
      setChallenges(challengesRes.data || []);
      setSectors(sectorsRes.data || []);
      setPartners(partnersRes.data || []);
      setStakeholders(stakeholdersRes.data || []);
      setFocusQuestions(focusQuestionsRes.data || []);
    } catch (error) {
      console.error('Error fetching related data:', error);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()))
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

    setFilteredEvents(filtered);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      title_ar: "",
      description: "",
      description_ar: "",
      event_type: "workshop",
      event_date: "",
      start_time: "",
      end_time: "",
      location: "",
      virtual_link: "",
      format: "in_person",
      max_participants: "",
      status: "scheduled",
      budget: "",
      campaign_id: "",
      challenge_id: "",
      sector_id: "",
    });
    setSelectedPartners([]);
    setSelectedStakeholders([]);
    setSelectedFocusQuestions([]);
    setCurrentStep(1);
    setStepErrors({});
    
    // Reset search states
    setPartnerSearch("");
    setStakeholderSearch("");
    setFocusQuestionSearch("");
    
    // Reset dropdown states
    setOpenCampaign(false);
    setOpenChallenge(false);
    setOpenSector(false);
  };

  const validateStep = (step: number): string[] => {
    const errors: string[] = [];
    
    switch (step) {
      case 1:
        if (!formData.title.trim()) errors.push("Title is required");
        if (!formData.description.trim()) errors.push("Description is required");
        if (!formData.event_date) errors.push("Event date is required");
        break;
      case 2:
        // Organization validation - optional but if selected, should be valid
        break;
      case 3:
        // Partners/stakeholders validation - all optional
        break;
    }
    
    return errors;
  };

  const nextStep = () => {
    const errors = validateStep(currentStep);
    setStepErrors({...stepErrors, [currentStep]: errors});
    
    if (errors.length === 0 && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(", "),
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleView = async (event: Event) => {
    // Load complete event details with relationships
    try {
      const [partnersRes, stakeholdersRes, focusQuestionsRes] = await Promise.all([
        supabase.from('event_partner_links').select('partner_id').eq('event_id', event.id),
        supabase.from('event_stakeholder_links').select('stakeholder_id').eq('event_id', event.id),
        supabase.from('event_focus_question_links').select('focus_question_id').eq('event_id', event.id)
      ]);

      // Enhance event object with relationship data
      const enhancedEvent = {
        ...event,
        partner_ids: partnersRes.data?.map(item => item.partner_id) || [],
        stakeholder_ids: stakeholdersRes.data?.map(item => item.stakeholder_id) || [],
        focus_question_ids: focusQuestionsRes.data?.map(item => item.focus_question_id) || []
      };

      setViewingEvent(enhancedEvent);
    } catch (error) {
      console.error('Error loading event details:', error);
      setViewingEvent(event); // fallback to basic event data
    }
  };

  const handleEdit = async (event: Event) => {
    // First reset all form state to ensure clean slate
    resetForm();
    
    setEditingEvent(event);
    
    // Load existing relationships from linking tables
    try {
      const [partnersRes, stakeholdersRes, focusQuestionsRes] = await Promise.all([
        supabase.from('event_partner_links').select('partner_id').eq('event_id', event.id),
        supabase.from('event_stakeholder_links').select('stakeholder_id').eq('event_id', event.id),
        supabase.from('event_focus_question_links').select('focus_question_id').eq('event_id', event.id)
      ]);

      setFormData({
        title: event.title,
        title_ar: event.title_ar || "",
        description: event.description || "",
        description_ar: event.description_ar || "",
        event_type: event.event_type || "workshop",
        event_date: event.event_date,
        start_time: event.start_time || "",
        end_time: event.end_time || "",
        location: event.location || "",
        virtual_link: event.virtual_link || "",
        format: event.format || "in_person",
        max_participants: event.max_participants?.toString() || "",
        status: event.status,
        budget: event.budget?.toString() || "",
        campaign_id: event.campaign_id || "",
        challenge_id: event.challenge_id || "",
        sector_id: event.sector_id || "",
      });

      setSelectedPartners(partnersRes.data?.map(item => item.partner_id) || []);
      setSelectedStakeholders(stakeholdersRes.data?.map(item => item.stakeholder_id) || []);
      setSelectedFocusQuestions(focusQuestionsRes.data?.map(item => item.focus_question_id) || []);
    } catch (error) {
      console.error('Error loading event relationships:', error);
    }
    
    setShowAddDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      // Delete related links first
      await Promise.all([
        supabase.from('event_partner_links').delete().eq('event_id', id),
        supabase.from('event_stakeholder_links').delete().eq('event_id', id),
        supabase.from('event_focus_question_links').delete().eq('event_id', id)
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

  const handleSubmit = async () => {
    // Validate all steps
    const allErrors: string[] = [];
    for (let i = 1; i <= 3; i++) {
      const stepErrors = validateStep(i);
      allErrors.push(...stepErrors);
    }

    if (allErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: allErrors.join(", "),
        variant: "destructive",
      });
      return;
    }

    try {
      const eventData = {
        title: formData.title,
        title_ar: formData.title_ar || null,
        description: formData.description || null,
        description_ar: formData.description_ar || null,
        event_type: formData.event_type,
        event_date: formData.event_date,
        start_time: formData.start_time || null,
        end_time: formData.end_time || null,
        location: formData.location || null,
        virtual_link: formData.virtual_link || null,
        format: formData.format,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
        status: formData.status,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        campaign_id: formData.campaign_id || null,
        challenge_id: formData.challenge_id || null,
        sector_id: formData.sector_id || null,
        registered_participants: 0,
        actual_participants: 0,
      };

      let eventId: string;
      
      if (editingEvent) {
        // Update existing event
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id);

        if (error) throw error;
        eventId = editingEvent.id;
        
        // Delete existing relationships
        await Promise.all([
          supabase.from('event_partner_links').delete().eq('event_id', eventId),
          supabase.from('event_stakeholder_links').delete().eq('event_id', eventId),
          supabase.from('event_focus_question_links').delete().eq('event_id', eventId)
        ]);
      } else {
        // Create new event
        const { data, error } = await supabase
          .from('events')
          .insert([eventData])
          .select('id')
          .single();

        if (error) throw error;
        eventId = data.id;
      }

      // Insert new relationships
      const relationshipInserts = [];
      
      // Partners
      if (selectedPartners.length > 0) {
        relationshipInserts.push(
          supabase.from('event_partner_links').insert(
            selectedPartners.map(partnerId => ({ event_id: eventId, partner_id: partnerId }))
          )
        );
      }
      
      // Stakeholders
      if (selectedStakeholders.length > 0) {
        relationshipInserts.push(
          supabase.from('event_stakeholder_links').insert(
            selectedStakeholders.map(stakeholderId => ({ event_id: eventId, stakeholder_id: stakeholderId }))
          )
        );
      }
      
      // Focus Questions
      if (selectedFocusQuestions.length > 0) {
        relationshipInserts.push(
          supabase.from('event_focus_question_links').insert(
            selectedFocusQuestions.map(focusQuestionId => ({ event_id: eventId, focus_question_id: focusQuestionId }))
          )
        );
      }

      // Execute all relationship inserts
      if (relationshipInserts.length > 0) {
        const results = await Promise.all(relationshipInserts);
        const errors = results.filter(result => result.error);
        if (errors.length > 0) {
          console.error('Error saving relationships:', errors);
          throw new Error('Failed to save some event relationships');
        }
      }

      toast({
        title: "Success",
        description: `Event ${editingEvent ? 'updated' : 'created'} successfully`,
      });

      setShowAddDialog(false);
      setEditingEvent(null);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingEvent ? 'update' : 'create'} event`,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled": return <Badge variant="default">Scheduled</Badge>;
      case "ongoing": return <Badge variant="default" className="bg-green-500">Ongoing</Badge>;
      case "completed": return <Badge variant="secondary">Completed</Badge>;
      case "cancelled": return <Badge variant="destructive">Cancelled</Badge>;
      case "postponed": return <Badge variant="outline">Postponed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "virtual": return <Video className="h-4 w-4" />;
      case "hybrid": return <Globe className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  // Step rendering functions
  const renderBasicInformation = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Basic Information</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Event Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter event title"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="title_ar">Event Title (Arabic)</Label>
          <Input
            id="title_ar"
            value={formData.title_ar}
            onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
            placeholder="عنوان الحدث"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter event description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description_ar">Description (Arabic)</Label>
        <Textarea
          id="description_ar"
          value={formData.description_ar}
          onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
          placeholder="وصف الحدث"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="event_type">Event Type</Label>
          <Select value={formData.event_type} onValueChange={(value) => setFormData({ ...formData, event_type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="format">Format</Label>
          <Select value={formData.format} onValueChange={(value) => setFormData({ ...formData, format: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {formatOptions.map((format) => (
                <SelectItem key={format.value} value={format.value}>
                  {format.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="event_date">Event Date *</Label>
          <Input
            id="event_date"
            type="date"
            value={formData.event_date}
            onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="start_time">Start Time</Label>
          <Input
            id="start_time"
            type="time"
            value={formData.start_time}
            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="end_time">End Time</Label>
          <Input
            id="end_time"
            type="time"
            value={formData.end_time}
            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Event venue or address"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="virtual_link">Virtual Link</Label>
          <Input
            id="virtual_link"
            value={formData.virtual_link}
            onChange={(e) => setFormData({ ...formData, virtual_link: e.target.value })}
            placeholder="Virtual meeting link"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="max_participants">Maximum Participants</Label>
          <Input
            id="max_participants"
            type="number"
            value={formData.max_participants}
            onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
            placeholder="Maximum number of participants"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="budget">Budget</Label>
          <Input
            id="budget"
            type="number"
            step="0.01"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            placeholder="Event budget"
          />
        </div>
      </div>
    </div>
  );

  const renderOrganizationalStructure = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Building className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Organizational Structure</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="campaign_id">Related Campaign</Label>
          <Popover open={openCampaign} onOpenChange={setOpenCampaign}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCampaign}
                className="w-full justify-between"
              >
                {formData.campaign_id 
                  ? campaigns.find(c => c.id === formData.campaign_id)?.title || "Select campaign..."
                  : "Select campaign..."
                }
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search campaigns..." />
                <CommandList>
                  <CommandEmpty>No campaign found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="none"
                      onSelect={() => {
                        setFormData({ ...formData, campaign_id: "" });
                        setOpenCampaign(false);
                      }}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          !formData.campaign_id ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      None
                    </CommandItem>
                    {campaigns.map((campaign) => (
                      <CommandItem
                        key={campaign.id}
                        value={campaign.title}
                        onSelect={() => {
                          setFormData({ ...formData, campaign_id: campaign.id });
                          setOpenCampaign(false);
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            formData.campaign_id === campaign.id ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        {campaign.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="challenge_id">Related Challenge</Label>
          <Popover open={openChallenge} onOpenChange={setOpenChallenge}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openChallenge}
                className="w-full justify-between"
              >
                {formData.challenge_id 
                  ? challenges.find(c => c.id === formData.challenge_id)?.title || "Select challenge..."
                  : "Select challenge..."
                }
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search challenges..." />
                <CommandList>
                  <CommandEmpty>No challenge found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="none"
                      onSelect={() => {
                        setFormData({ ...formData, challenge_id: "" });
                        setOpenChallenge(false);
                      }}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          !formData.challenge_id ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      None
                    </CommandItem>
                    {challenges.map((challenge) => (
                      <CommandItem
                        key={challenge.id}
                        value={challenge.title}
                        onSelect={() => {
                          setFormData({ ...formData, challenge_id: challenge.id });
                          setOpenChallenge(false);
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            formData.challenge_id === challenge.id ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        {challenge.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sector_id">Related Sector</Label>
          <Popover open={openSector} onOpenChange={setOpenSector}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openSector}
                className="w-full justify-between"
              >
                {formData.sector_id 
                  ? sectors.find(s => s.id === formData.sector_id)?.name || "Select sector..."
                  : "Select sector..."
                }
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search sectors..." />
                <CommandList>
                  <CommandEmpty>No sector found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="none"
                      onSelect={() => {
                        setFormData({ ...formData, sector_id: "" });
                        setOpenSector(false);
                      }}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          !formData.sector_id ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      None
                    </CommandItem>
                    {sectors.map((sector) => (
                      <CommandItem
                        key={sector.id}
                        value={sector.name}
                        onSelect={() => {
                          setFormData({ ...formData, sector_id: sector.id });
                          setOpenSector(false);
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            formData.sector_id === sector.id ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        {sector.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );

  const renderPartnersStakeholders = () => {
    const filteredPartners = partners.filter(partner => 
      partner.name.toLowerCase().includes(partnerSearch.toLowerCase())
    );

    const filteredStakeholders = stakeholders.filter(stakeholder => 
      stakeholder.name.toLowerCase().includes(stakeholderSearch.toLowerCase())
    );

    const filteredFocusQuestions = focusQuestions.filter(question => 
      question.question_text.toLowerCase().includes(focusQuestionSearch.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Partners, Stakeholders & Focus Questions</h3>
        </div>

        {/* Partner Organizations */}
        <div className="space-y-4">
          <Label>Partner Organizations</Label>
          <div className="space-y-2">
            <Input
              placeholder="Search partners..."
              value={partnerSearch}
              onChange={(e) => setPartnerSearch(e.target.value)}
            />
            <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
              {filteredPartners.map((partner) => (
                <div key={partner.id} className="flex items-center space-x-2 py-1">
                  <input
                    type="checkbox"
                    id={`partner-${partner.id}`}
                    checked={selectedPartners.includes(partner.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPartners([...selectedPartners, partner.id]);
                      } else {
                        setSelectedPartners(selectedPartners.filter(id => id !== partner.id));
                      }
                    }}
                  />
                  <Label htmlFor={`partner-${partner.id}`} className="text-sm">
                    {partner.name}
                  </Label>
                </div>
              ))}
            </div>
            {selectedPartners.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedPartners.map(id => {
                  const partner = partners.find(p => p.id === id);
                  return partner ? (
                    <Badge key={id} variant="outline" className="text-xs">
                      {partner.name}
                      <X 
                        className="ml-1 h-3 w-3 cursor-pointer" 
                        onClick={() => setSelectedPartners(selectedPartners.filter(pid => pid !== id))}
                      />
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>

        {/* Target Stakeholders */}
        <div className="space-y-4">
          <Label>Target Stakeholders</Label>
          <div className="space-y-2">
            <Input
              placeholder="Search stakeholders..."
              value={stakeholderSearch}
              onChange={(e) => setStakeholderSearch(e.target.value)}
            />
            <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
              {filteredStakeholders.map((stakeholder) => (
                <div key={stakeholder.id} className="flex items-center space-x-2 py-1">
                  <input
                    type="checkbox"
                    id={`stakeholder-${stakeholder.id}`}
                    checked={selectedStakeholders.includes(stakeholder.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStakeholders([...selectedStakeholders, stakeholder.id]);
                      } else {
                        setSelectedStakeholders(selectedStakeholders.filter(id => id !== stakeholder.id));
                      }
                    }}
                  />
                  <Label htmlFor={`stakeholder-${stakeholder.id}`} className="text-sm">
                    {stakeholder.name}
                  </Label>
                </div>
              ))}
            </div>
            {selectedStakeholders.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedStakeholders.map(id => {
                  const stakeholder = stakeholders.find(s => s.id === id);
                  return stakeholder ? (
                    <Badge key={id} variant="outline" className="text-xs">
                      {stakeholder.name}
                      <X 
                        className="ml-1 h-3 w-3 cursor-pointer" 
                        onClick={() => setSelectedStakeholders(selectedStakeholders.filter(sid => sid !== id))}
                      />
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>

        {/* Related Focus Questions */}
        <div className="space-y-4">
          <Label>Related Focus Questions</Label>
          <div className="space-y-2">
            <Input
              placeholder="Search focus questions..."
              value={focusQuestionSearch}
              onChange={(e) => setFocusQuestionSearch(e.target.value)}
            />
            <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
              {filteredFocusQuestions.map((question) => (
                <div key={question.id} className="flex items-center space-x-2 py-1">
                  <input
                    type="checkbox"
                    id={`question-${question.id}`}
                    checked={selectedFocusQuestions.includes(question.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFocusQuestions([...selectedFocusQuestions, question.id]);
                      } else {
                        setSelectedFocusQuestions(selectedFocusQuestions.filter(id => id !== question.id));
                      }
                    }}
                  />
                  <Label htmlFor={`question-${question.id}`} className="text-sm">
                    {question.question_text}
                  </Label>
                </div>
              ))}
            </div>
            {selectedFocusQuestions.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedFocusQuestions.map(id => {
                  const question = focusQuestions.find(q => q.id === id);
                  return question ? (
                    <Badge key={id} variant="outline" className="text-xs">
                      {question.question_text}
                      <X 
                        className="ml-1 h-3 w-3 cursor-pointer" 
                        onClick={() => setSelectedFocusQuestions(selectedFocusQuestions.filter(qid => qid !== id))}
                      />
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInformation();
      case 2:
        return renderOrganizationalStructure();
      case 3:
        return renderPartnersStakeholders();
      default:
        return renderBasicInformation();
    }
  };

  const steps = [
    { number: 1, title: "Basic Information", icon: Target },
    { number: 2, title: "Organization", icon: Building },
    { number: 3, title: "Partners & Questions", icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Events Management</h1>
          <p className="text-muted-foreground">Manage innovation events and activities</p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingEvent(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Enhanced Wizard Step Indicator */}
              <div className="relative">
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-10"></div>
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isCompleted = currentStep > step.number;
                    const isCurrent = currentStep === step.number;
                    const isUpcoming = currentStep < step.number;
                    
                    return (
                      <div key={step.number} className="flex flex-col items-center space-y-2">
                        <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                          isCompleted 
                            ? 'bg-primary border-primary text-primary-foreground shadow-lg' 
                            : isCurrent
                            ? 'bg-primary/10 border-primary text-primary shadow-md'
                            : 'bg-background border-muted-foreground/30 text-muted-foreground'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <StepIcon className="h-5 w-5" />
                          )}
                          {isCurrent && (
                            <div className="absolute -inset-1 rounded-full border-2 border-primary/30 animate-pulse"></div>
                          )}
                        </div>
                        <div className="text-center">
                          <p className={`text-sm font-medium ${
                            isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {step.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Step {step.number} of {totalSteps}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Progress Line */}
                <div 
                  className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-300 -z-10"
                  style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                ></div>
              </div>

              {/* Step content */}
              <div className="min-h-[400px]">
                {renderCurrentStep()}
              </div>

              {/* Enhanced Navigation Buttons */}
              <div className="flex justify-between items-center pt-6 border-t bg-muted/30 -mx-6 px-6 -mb-6 pb-6">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="min-w-[100px]"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4">←</div>
                    Previous
                  </div>
                </Button>
                
                <div className="flex items-center gap-3">
                  <div className="text-sm text-muted-foreground">
                    Step {currentStep} of {totalSteps}
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: totalSteps }, (_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          i + 1 <= currentStep ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {currentStep < totalSteps ? (
                    <Button onClick={nextStep} className="min-w-[100px]">
                      <div className="flex items-center gap-2">
                        Next
                        <div className="h-4 w-4">→</div>
                      </div>
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} className="min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        {editingEvent ? 'Update Event' : 'Create Event'}
                      </div>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={formatFilter} onValueChange={setFormatFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Formats</SelectItem>
            {formatOptions.map((format) => (
              <SelectItem key={format.value} value={format.value}>
                {format.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {eventTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Events grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card 
            key={event.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleView(event)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{event.title}</CardTitle>
                {getStatusBadge(event.status)}
              </div>
              {event.event_type && (
                <Badge variant="outline" className="w-fit text-xs">
                  {eventTypes.find(t => t.value === event.event_type)?.label || event.event_type}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {event.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {event.description}
                </p>
              )}
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{event.event_date}</span>
                  {event.start_time && (
                    <span className="text-muted-foreground">
                      {event.start_time}
                      {event.end_time && ` - ${event.end_time}`}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {getFormatIcon(event.format || 'in_person')}
                  <span>
                    {event.format === 'virtual' ? 'Virtual Event' :
                     event.format === 'hybrid' ? 'Hybrid Event' :
                     event.location || 'In Person'}
                  </span>
                </div>
                
                {event.max_participants && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Max {event.max_participants} participants</span>
                  </div>
                )}
                
                {event.budget && (
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span>Budget: ${event.budget.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(event);
                  }}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(event.id);
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== "all" || formatFilter !== "all" || typeFilter !== "all"
              ? "No events found matching your criteria." 
              : "No events created yet. Create your first event to get started."}
          </p>
        </Card>
      )}

      {/* Event Details View Dialog */}
      <Dialog open={!!viewingEvent} onOpenChange={() => setViewingEvent(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Event Details
            </DialogTitle>
          </DialogHeader>
          
          {viewingEvent && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  {getStatusBadge(viewingEvent.status)}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                    <p className="text-sm">{viewingEvent.title}</p>
                  </div>
                  {viewingEvent.title_ar && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Title (Arabic)</Label>
                      <p className="text-sm">{viewingEvent.title_ar}</p>
                    </div>
                  )}
                </div>

                {viewingEvent.description && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                    <p className="text-sm">{viewingEvent.description}</p>
                  </div>
                )}

                {viewingEvent.description_ar && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Description (Arabic)</Label>
                    <p className="text-sm">{viewingEvent.description_ar}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Event Type</Label>
                    <p className="text-sm">{eventTypes.find(t => t.value === viewingEvent.event_type)?.label || viewingEvent.event_type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Format</Label>
                    <p className="text-sm">{formatOptions.find(f => f.value === viewingEvent.format)?.label || viewingEvent.format}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Event Date</Label>
                    <p className="text-sm">{viewingEvent.event_date}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {viewingEvent.start_time && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Start Time</Label>
                      <p className="text-sm">{viewingEvent.start_time}</p>
                    </div>
                  )}
                  {viewingEvent.end_time && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">End Time</Label>
                      <p className="text-sm">{viewingEvent.end_time}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {viewingEvent.location && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                      <p className="text-sm">{viewingEvent.location}</p>
                    </div>
                  )}
                  {viewingEvent.virtual_link && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Virtual Link</Label>
                      <p className="text-sm break-all">{viewingEvent.virtual_link}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {viewingEvent.max_participants && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Max Participants</Label>
                      <p className="text-sm">{viewingEvent.max_participants}</p>
                    </div>
                  )}
                  {viewingEvent.registered_participants !== undefined && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Registered</Label>
                      <p className="text-sm">{viewingEvent.registered_participants}</p>
                    </div>
                  )}
                  {viewingEvent.budget && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Budget</Label>
                      <p className="text-sm">${viewingEvent.budget.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Organizational Structure */}
              {(viewingEvent.campaign_id || viewingEvent.challenge_id || viewingEvent.sector_id) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Organizational Structure
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {viewingEvent.campaign_id && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Campaign</Label>
                        <Badge variant="secondary" className="text-xs">
                          {campaigns.find(c => c.id === viewingEvent.campaign_id)?.title || 'Unknown Campaign'}
                        </Badge>
                      </div>
                    )}

                    {viewingEvent.challenge_id && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Challenge</Label>
                        <Badge variant="secondary" className="text-xs">
                          {challenges.find(c => c.id === viewingEvent.challenge_id)?.title || 'Unknown Challenge'}
                        </Badge>
                      </div>
                    )}

                    {viewingEvent.sector_id && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Sector</Label>
                        <Badge variant="secondary" className="text-xs">
                          {sectors.find(s => s.id === viewingEvent.sector_id)?.name || 'Unknown Sector'}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Partners, Stakeholders & Focus Questions */}
              {(viewingEvent.partner_ids?.length || viewingEvent.stakeholder_ids?.length || viewingEvent.focus_question_ids?.length) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Partners, Stakeholders & Focus Questions
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {viewingEvent.partner_ids?.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Partner Organizations</Label>
                        <div className="space-y-2 mt-2">
                          {viewingEvent.partner_ids.map(partnerId => {
                            const partner = partners.find(p => p.id === partnerId);
                            return partner ? (
                              <div key={partnerId} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                                <Badge variant="outline" className="text-xs">
                                  {partner.partner_type}
                                </Badge>
                                <span className="text-sm">{partner.name}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {viewingEvent.stakeholder_ids?.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Target Stakeholders</Label>
                        <div className="space-y-2 mt-2">
                          {viewingEvent.stakeholder_ids.map(stakeholderId => {
                            const stakeholder = stakeholders.find(s => s.id === stakeholderId);
                            return stakeholder ? (
                              <div key={stakeholderId} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                                <Badge variant="outline" className="text-xs">
                                  {stakeholder.stakeholder_type}
                                </Badge>
                                <span className="text-sm">{stakeholder.name}</span>
                                <span className="text-xs text-muted-foreground">({stakeholder.organization})</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {viewingEvent.focus_question_ids?.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Related Focus Questions</Label>
                      <div className="space-y-2 mt-2">
                        {viewingEvent.focus_question_ids.map(questionId => {
                          const question = focusQuestions.find(q => q.id === questionId);
                          return question ? (
                            <div key={questionId} className="p-2 bg-muted/50 rounded-md">
                              <span className="text-sm">{question.question_text}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setViewingEvent(null);
                    handleEdit(viewingEvent);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Event
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setViewingEvent(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}