import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Target,
  Building,
  UserCheck,
  HelpCircle,
  Settings,
  Edit, 
  Trash2, 
  Eye,
  Check,
  ChevronsUpDown,
  X,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { updateEventPartners, updateEventStakeholders, updateEventFocusQuestions } from "@/lib/relationshipHelpers";

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
  // Relationships
  sectors?: any[];
  deputies?: any[];
  departments?: any[];
  challenges?: any[];
  partners?: any[];
  stakeholders?: any[];
  focusQuestions?: any[];
}

export function EventsManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  
  // Filters
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
  const totalSteps = 5;
  
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
    registered_participants: "",
    actual_participants: "",
    status: "scheduled",
    budget: "",
    event_manager_id: "",
    campaign_id: "",
    challenge_id: "",
    sector_id: "",
    deputy_id: "",
    department_id: "",
    domain_id: "",
    sub_domain_id: "",
    service_id: "",
    target_stakeholder_groups: [] as string[],
  });

  // Related data
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [deputies, setDeputies] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [domains, setDomains] = useState<any[]>([]);
  const [subDomains, setSubDomains] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [stakeholders, setStakeholders] = useState<any[]>([]);
  const [focusQuestions, setFocusQuestions] = useState<any[]>([]);
  const [eventManagers, setEventManagers] = useState<any[]>([]);
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const [selectedStakeholders, setSelectedStakeholders] = useState<string[]>([]);
  const [selectedFocusQuestions, setSelectedFocusQuestions] = useState<string[]>([]);
  
  // Organizational structure selections
  const [selectedDeputy, setSelectedDeputy] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [selectedSubDomain, setSelectedSubDomain] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  
  // Search states for dropdowns
  const [openEventManager, setOpenEventManager] = useState(false);
  const [eventManagerSearch, setEventManagerSearch] = useState("");

  // Relationship link data
  const [campaignChallengeLinks, setCampaignChallengeLinks] = useState<any[]>([]);
  const [challengeSectorLinks, setChallengeSectorLinks] = useState<any[]>([]);
  const [campaignPartnerLinks, setCampaignPartnerLinks] = useState<any[]>([]);
  const [campaignStakeholderLinks, setCampaignStakeholderLinks] = useState<any[]>([]);
  const [challengePartnerLinks, setChallengePartnerLinks] = useState<any[]>([]);
  const [challengeStakeholderLinks, setChallengeStakeholderLinks] = useState<any[]>([]);

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
      const [
        campaignsRes, 
        challengesRes, 
        sectorsRes,
        deputiesRes,
        departmentsRes,
        domainsRes,
        subDomainsRes,
        servicesRes,
        partnersRes, 
        stakeholdersRes, 
        focusQuestionsRes,
        eventManagersRes,
        campaignChallengeLinksRes,
        challengeSectorLinksRes,
        campaignPartnerLinksRes,
        campaignStakeholderLinksRes,
        challengePartnerLinksRes,
        challengeStakeholderLinksRes
      ] = await Promise.all([
        supabase.from('campaigns').select('*'),
        supabase.from('challenges').select('*'),
        supabase.from('sectors').select('*'),
        supabase.from('deputies').select('*'),
        supabase.from('departments').select('*'),
        supabase.from('domains').select('*'),
        supabase.from('sub_domains').select('*'),
        supabase.from('services').select('*'),
        supabase.from('partners').select('*'),
        supabase.from('stakeholders').select('*'),
        supabase.from('focus_questions').select('*'),
        supabase.from('profiles').select('id, name, email, position').order('name'),
        supabase.from('campaign_challenge_links').select('*'),
        supabase.from('campaign_sector_links').select('*'),
        supabase.from('campaign_partner_links').select('*'),
        supabase.from('campaign_stakeholder_links').select('*'),
        supabase.from('challenge_partners').select('*'),
        supabase.from('stakeholders').select('*') // Challenge stakeholders can be derived from general stakeholders
      ]);

      setCampaigns(campaignsRes.data || []);
      setChallenges(challengesRes.data || []);
      setSectors(sectorsRes.data || []);
      setDeputies(deputiesRes.data || []);
      setDepartments(departmentsRes.data || []);
      setDomains(domainsRes.data || []);
      setSubDomains(subDomainsRes.data || []);
      setServices(servicesRes.data || []);
      setPartners(partnersRes.data || []);
      setStakeholders(stakeholdersRes.data || []);
      setFocusQuestions(focusQuestionsRes.data || []);
      setEventManagers(eventManagersRes.data || []);
      setCampaignChallengeLinks(campaignChallengeLinksRes.data || []);
      setChallengeSectorLinks(challengeSectorLinksRes.data || []);
      setCampaignPartnerLinks(campaignPartnerLinksRes.data || []);
      setCampaignStakeholderLinks(campaignStakeholderLinksRes.data || []);
      setChallengePartnerLinks(challengePartnerLinksRes.data || []);
      setChallengeStakeholderLinks(challengeStakeholderLinksRes.data || []);
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
      registered_participants: "",
      actual_participants: "",
      status: "scheduled",
      budget: "",
      event_manager_id: "",
      campaign_id: "",
      challenge_id: "",
      sector_id: "",
      deputy_id: "",
      department_id: "",
      domain_id: "",
      sub_domain_id: "",
      service_id: "",
      target_stakeholder_groups: [],
    });
    setSelectedPartners([]);
    setSelectedStakeholders([]);
    setSelectedFocusQuestions([]);
    setSelectedDeputy("");
    setSelectedDepartment("");
    setSelectedDomain("");
    setSelectedSubDomain("");
    setSelectedService("");
    setCurrentStep(1);
    setStepErrors({});
    
    // Reset search states
    setPartnerSearch("");
    setStakeholderSearch("");
    setFocusQuestionSearch("");
    setEventManagerSearch("");
    
    // Reset dropdown states
    setOpenCampaign(false);
    setOpenChallenge(false);
    setOpenSector(false);
    setOpenEventManager(false);
  };

  const validateStep = (step: number): string[] => {
    const errors: string[] = [];

    switch (step) {
      case 1: // Basic Information
        if (!formData.title.trim()) errors.push("Title is required");
        if (!formData.event_type) errors.push("Event type is required");
        break;
      case 2: // Event Details
        if (!formData.event_date) errors.push("Event date is required");
        if (!formData.format) errors.push("Event format is required");
        if (formData.format === "in_person" && !formData.location?.trim()) {
          errors.push("Location is required for in-person events");
        }
        if (formData.format === "virtual" && !formData.virtual_link?.trim()) {
          errors.push("Virtual link is required for virtual events");
        }
        if (formData.max_participants && parseInt(formData.max_participants) <= 0) {
          errors.push("Maximum participants must be greater than 0");
        }
        if (formData.budget && parseFloat(formData.budget) < 0) {
          errors.push("Budget cannot be negative");
        }
        if (formData.start_time && formData.end_time && formData.start_time >= formData.end_time) {
          errors.push("End time must be after start time");
        }
        break;
      case 3: // Organizational Structure
        // Optional validations
        break;
      case 4: // Partners & Stakeholders
        // Optional validations
        break;
      case 5: // Focus Questions & Settings
        // Optional validations
        break;
    }

    return errors;
  };

  const nextStep = () => {
    const errors = validateStep(currentStep);
    if (errors.length > 0) {
      setStepErrors({ ...stepErrors, [currentStep]: errors });
      toast({
        title: "Validation Error",
        description: errors.join(", "),
        variant: "destructive",
      });
      return;
    }

    setStepErrors({ ...stepErrors, [currentStep]: [] });
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Filter data based on relationships
  const getFilteredChallenges = () => {
    if (!formData.campaign_id) return challenges;
    // Filter challenges that are linked to the selected campaign
    return challenges.filter(challenge => {
      return campaignChallengeLinks.some(link => 
        link.campaign_id === formData.campaign_id && link.challenge_id === challenge.id
      );
    });
  };

  const getFilteredSectors = () => {
    if (!formData.challenge_id) return sectors;
    // Filter sectors that are linked to the selected challenge
    return sectors.filter(sector => {
      return challengeSectorLinks.some(link => 
        link.challenge_id === formData.challenge_id && link.sector_id === sector.id
      );
    });
  };

  // Organizational Structure Dynamic Filtering
  const getFilteredDeputies = () => {
    if (!formData.sector_id) return deputies;
    return deputies.filter(deputy => deputy.sector_id === formData.sector_id);
  };

  const getFilteredDepartments = () => {
    if (!selectedDeputy) return departments;
    return departments.filter(department => department.deputy_id === selectedDeputy);
  };

  const getFilteredDomains = () => {
    if (!selectedDepartment) return domains;
    return domains.filter(domain => domain.department_id === selectedDepartment);
  };

  const getFilteredSubDomains = () => {
    if (!selectedDomain) return subDomains;
    return subDomains.filter(subDomain => subDomain.domain_id === selectedDomain);
  };

  const getFilteredServices = () => {
    if (!selectedSubDomain) return services;
    return services.filter(service => service.sub_domain_id === selectedSubDomain);
  };

  const getFilteredPartners = () => {
    const basePartners = partners.filter(partner => 
      partner.name.toLowerCase().includes(partnerSearch.toLowerCase())
    );
    
    // First filter by organizational structure
    let filteredByOrg = basePartners;
    if (formData.sector_id || selectedDeputy || selectedDepartment || selectedDomain || selectedSubDomain || selectedService) {
      filteredByOrg = basePartners.filter(partner => {
        // Filter partners based on organizational alignment
        return (
          !formData.sector_id || partner.sector_id === formData.sector_id ||
          !selectedDeputy || partner.deputy_id === selectedDeputy ||
          !selectedDepartment || partner.department_id === selectedDepartment ||
          !selectedDomain || partner.domain_id === selectedDomain ||
          !selectedSubDomain || partner.sub_domain_id === selectedSubDomain ||
          !selectedService || partner.service_id === selectedService
        );
      });
    }
    
    // Then filter by campaign or challenge relationships
    if (!formData.campaign_id && !formData.challenge_id) return filteredByOrg;
    
    return filteredByOrg.filter(partner => {
      if (formData.campaign_id) {
        return campaignPartnerLinks.some(link => 
          link.campaign_id === formData.campaign_id && link.partner_id === partner.id
        );
      }
      if (formData.challenge_id) {
        return challengePartnerLinks.some(link => 
          link.challenge_id === formData.challenge_id && link.partner_id === partner.id
        );
      }
      return true;
    });
  };

  const getFilteredStakeholders = () => {
    const baseStakeholders = stakeholders.filter(stakeholder => 
      stakeholder.name.toLowerCase().includes(stakeholderSearch.toLowerCase())
    );
    
    // First filter by organizational structure
    let filteredByOrg = baseStakeholders;
    if (formData.sector_id || selectedDeputy || selectedDepartment || selectedDomain || selectedSubDomain || selectedService) {
      filteredByOrg = baseStakeholders.filter(stakeholder => {
        // Filter stakeholders based on organizational alignment
        return (
          !formData.sector_id || stakeholder.sector_id === formData.sector_id ||
          !selectedDeputy || stakeholder.deputy_id === selectedDeputy ||
          !selectedDepartment || stakeholder.department_id === selectedDepartment ||
          !selectedDomain || stakeholder.domain_id === selectedDomain ||
          !selectedSubDomain || stakeholder.sub_domain_id === selectedSubDomain ||
          !selectedService || stakeholder.service_id === selectedService
        );
      });
    }
    
    // Then filter by campaign or challenge relationships
    if (!formData.campaign_id && !formData.challenge_id) return filteredByOrg;
    
    return filteredByOrg.filter(stakeholder => {
      if (formData.campaign_id) {
        return campaignStakeholderLinks.some(link => 
          link.campaign_id === formData.campaign_id && link.stakeholder_id === stakeholder.id
        );
      }
      if (formData.challenge_id) {
        return challengeStakeholderLinks.some(link => 
          link.challenge_id === formData.challenge_id && link.stakeholder_id === stakeholder.id
        );
      }
      return true;
    });
  };

  const getFilteredFocusQuestions = () => {
    const baseFocusQuestions = focusQuestions.filter(question => 
      question.question_text.toLowerCase().includes(focusQuestionSearch.toLowerCase())
    );
    
    if (!formData.challenge_id) return baseFocusQuestions;
    
    // Filter focus questions that belong to the selected challenge
    return baseFocusQuestions.filter(question => 
      question.challenge_id === formData.challenge_id
    );
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

      // Set form data including fetched relationships
      setFormData({
        title: event.title || "",
        title_ar: event.title_ar || "",
        description: event.description || "",
        description_ar: event.description_ar || "",
        event_type: event.event_type || "workshop",
        event_date: event.event_date || "",
        start_time: event.start_time || "",
        end_time: event.end_time || "",
        location: event.location || "",
        virtual_link: event.virtual_link || "",
        format: event.format || "in_person",
        max_participants: event.max_participants?.toString() || "",
        registered_participants: event.registered_participants?.toString() || "",
        actual_participants: event.actual_participants?.toString() || "",
        status: event.status || "scheduled",
        budget: event.budget?.toString() || "",
        event_manager_id: event.event_manager_id || "",
        campaign_id: event.campaign_id || "",
        challenge_id: event.challenge_id || "",
        sector_id: event.sector_id || "",
        deputy_id: (event as any).deputy_id || "",
        department_id: (event as any).department_id || "",
        domain_id: (event as any).domain_id || "",
        sub_domain_id: (event as any).sub_domain_id || "",
        service_id: (event as any).service_id || "",
        target_stakeholder_groups: event.target_stakeholder_groups || [],
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
    for (let i = 1; i <= totalSteps; i++) {
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
        registered_participants: formData.registered_participants ? parseInt(formData.registered_participants) : 0,
        actual_participants: formData.actual_participants ? parseInt(formData.actual_participants) : 0,
        status: formData.status,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        event_manager_id: formData.event_manager_id || null,
        campaign_id: formData.campaign_id || null,
        challenge_id: formData.challenge_id || null,
        sector_id: formData.sector_id || null,
        target_stakeholder_groups: formData.target_stakeholder_groups.length > 0 ? formData.target_stakeholder_groups : null,
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

      // Insert new relationships using helper functions
      await Promise.all([
        updateEventPartners(eventId, selectedPartners),
        updateEventStakeholders(eventId, selectedStakeholders),
        updateEventFocusQuestions(eventId, selectedFocusQuestions)
      ]);

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

  // Render step content
  const renderBasicInformation = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Basic Information</h3>
      </div>

      {/* Error Messages */}
      {stepErrors[1] && stepErrors[1].length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">Please fix the following errors:</span>
          </div>
          <ul className="mt-2 text-sm text-destructive ml-6 list-disc">
            {stepErrors[1].map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title (English) *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Event title in English"
            className={stepErrors[1]?.some(error => error.includes("Title")) ? "border-destructive" : ""}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="title_ar">Title (Arabic)</Label>
          <Input
            id="title_ar"
            value={formData.title_ar}
            onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
            placeholder="Event title in Arabic"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (English)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Event description in English"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description_ar">Description (Arabic)</Label>
        <Textarea
          id="description_ar"
          value={formData.description_ar}
          onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
          placeholder="Event description in Arabic"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="event_type">Event Type *</Label>
        <Select
          value={formData.event_type}
          onValueChange={(value) => setFormData({ ...formData, event_type: value })}
        >
          <SelectTrigger className={stepErrors[1]?.some(error => error.includes("Event type")) ? "border-destructive" : ""}>
            <SelectValue placeholder="Select event type" />
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
    </div>
  );

  const renderEventDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Event Details</h3>
      </div>

      {/* Error Messages */}
      {stepErrors[2] && stepErrors[2].length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">Please fix the following errors:</span>
          </div>
          <ul className="mt-2 text-sm text-destructive ml-6 list-disc">
            {stepErrors[2].map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="event_date">Event Date *</Label>
          <Input
            id="event_date"
            type="date"
            value={formData.event_date}
            onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
            className={stepErrors[2]?.some(error => error.includes("Event date")) ? "border-destructive" : ""}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="format">Event Format *</Label>
          <Select
            value={formData.format}
            onValueChange={(value) => setFormData({ ...formData, format: value })}
          >
            <SelectTrigger className={stepErrors[2]?.some(error => error.includes("Event format")) ? "border-destructive" : ""}>
              <SelectValue placeholder="Select event format" />
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
      </div>

      <div className="grid grid-cols-2 gap-4">
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
            className={stepErrors[2]?.some(error => error.includes("End time")) ? "border-destructive" : ""}
          />
        </div>
      </div>

      {formData.format === "in_person" && (
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Event location"
            className={stepErrors[2]?.some(error => error.includes("Location")) ? "border-destructive" : ""}
          />
        </div>
      )}

      {formData.format === "virtual" && (
        <div className="space-y-2">
          <Label htmlFor="virtual_link">Virtual Link *</Label>
          <Input
            id="virtual_link"
            value={formData.virtual_link}
            onChange={(e) => setFormData({ ...formData, virtual_link: e.target.value })}
            placeholder="Virtual meeting link"
            className={stepErrors[2]?.some(error => error.includes("Virtual link")) ? "border-destructive" : ""}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="event_manager_id">Event Manager *</Label>
        <Popover open={openEventManager} onOpenChange={setOpenEventManager}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openEventManager}
              className="w-full justify-between"
            >
              {formData.event_manager_id
                ? eventManagers.find((manager) => manager.id === formData.event_manager_id)?.name
                : "Select event manager..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput 
                placeholder="Search event managers..." 
                value={eventManagerSearch}
                onValueChange={setEventManagerSearch}
              />
              <CommandEmpty>No event manager found.</CommandEmpty>
              <CommandGroup>
                <CommandList>
                  {eventManagers
                    .filter((manager) =>
                      manager.name.toLowerCase().includes(eventManagerSearch.toLowerCase()) ||
                      (manager.email && manager.email.toLowerCase().includes(eventManagerSearch.toLowerCase())) ||
                      (manager.position && manager.position.toLowerCase().includes(eventManagerSearch.toLowerCase()))
                    )
                    .map((manager) => (
                      <CommandItem
                        key={manager.id}
                        value={manager.id}
                        onSelect={(currentValue) => {
                          setFormData({ ...formData, event_manager_id: currentValue === formData.event_manager_id ? "" : currentValue });
                          setOpenEventManager(false);
                          setEventManagerSearch("");
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            formData.event_manager_id === manager.id ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{manager.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {manager.position || 'No position'} • {manager.email}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                </CommandList>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <p className="text-xs text-muted-foreground">
          Person responsible for managing this event
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="max_participants">Maximum Participants</Label>
          <Input
            id="max_participants"
            type="number"
            value={formData.max_participants}
            onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
            placeholder="Maximum number of participants"
            className={stepErrors[2]?.some(error => error.includes("Maximum participants")) ? "border-destructive" : ""}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="registered_participants">Registered Participants</Label>
          <Input
            id="registered_participants"
            type="number"
            value={formData.registered_participants}
            onChange={(e) => setFormData({ ...formData, registered_participants: e.target.value })}
            placeholder="Number registered"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="actual_participants">Actual Participants</Label>
          <Input
            id="actual_participants"
            type="number"
            value={formData.actual_participants}
            onChange={(e) => setFormData({ ...formData, actual_participants: e.target.value })}
            placeholder="Number attended"
          />
        </div>
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
          className={stepErrors[2]?.some(error => error.includes("Budget")) ? "border-destructive" : ""}
        />
      </div>
    </div>
  );

  const renderOrganizationalStructure = () => {
    const filteredChallenges = getFilteredChallenges();
    const filteredSectors = getFilteredSectors();
    const filteredDeputies = getFilteredDeputies();
    const filteredDepartments = getFilteredDepartments();
    const filteredDomains = getFilteredDomains();
    const filteredSubDomains = getFilteredSubDomains();
    const filteredServices = getFilteredServices();

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Building className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Organizational Structure</h3>
        </div>

        {/* Campaign & Challenge Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="campaign_id">Related Campaign</Label>
            <Select
              value={formData.campaign_id}
              onValueChange={(value) => {
                setFormData({ 
                  ...formData, 
                  campaign_id: value,
                  challenge_id: "",
                  sector_id: ""
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select campaign..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {campaigns.map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="challenge_id">Related Challenge</Label>
            <Select
              value={formData.challenge_id}
              onValueChange={(value) => {
                setFormData({ 
                  ...formData, 
                  challenge_id: value,
                  sector_id: ""
                });
              }}
              disabled={formData.campaign_id && filteredChallenges.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  filteredChallenges.length === 0 && formData.campaign_id
                    ? "No challenges available"
                    : "Select challenge..."
                } />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {filteredChallenges.map((challenge) => (
                  <SelectItem key={challenge.id} value={challenge.id}>
                    {challenge.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sector_id">Sector</Label>
            <Select
              value={formData.sector_id}
              onValueChange={(value) => {
                setFormData({ ...formData, sector_id: value });
                setSelectedDeputy("");
                setSelectedDepartment("");
                setSelectedDomain("");
                setSelectedSubDomain("");
                setSelectedService("");
              }}
              disabled={formData.challenge_id && filteredSectors.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  filteredSectors.length === 0 && formData.challenge_id
                    ? "No sectors available"
                    : "Select sector..."
                } />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {filteredSectors.map((sector) => (
                  <SelectItem key={sector.id} value={sector.id}>
                    {sector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Hierarchical Organizational Structure */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="deputy_id">Deputy</Label>
            <Select
              value={selectedDeputy}
              onValueChange={(value) => {
                setSelectedDeputy(value);
                setSelectedDepartment("");
                setSelectedDomain("");
                setSelectedSubDomain("");
                setSelectedService("");
                setFormData({ ...formData, deputy_id: value });
              }}
              disabled={!formData.sector_id}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  !formData.sector_id ? "Select sector first" : "Select deputy..."
                } />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {filteredDeputies.map((deputy) => (
                  <SelectItem key={deputy.id} value={deputy.id}>
                    {deputy.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department_id">Department</Label>
            <Select
              value={selectedDepartment}
              onValueChange={(value) => {
                setSelectedDepartment(value);
                setSelectedDomain("");
                setSelectedSubDomain("");
                setSelectedService("");
                setFormData({ ...formData, department_id: value });
              }}
              disabled={!selectedDeputy}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  !selectedDeputy ? "Select deputy first" : "Select department..."
                } />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {filteredDepartments.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain_id">Domain</Label>
            <Select
              value={selectedDomain}
              onValueChange={(value) => {
                setSelectedDomain(value);
                setSelectedSubDomain("");
                setSelectedService("");
                setFormData({ ...formData, domain_id: value });
              }}
              disabled={!selectedDepartment}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  !selectedDepartment ? "Select department first" : "Select domain..."
                } />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {filteredDomains.map((domain) => (
                  <SelectItem key={domain.id} value={domain.id}>
                    {domain.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sub_domain_id">Sub-Domain</Label>
            <Select
              value={selectedSubDomain}
              onValueChange={(value) => {
                setSelectedSubDomain(value);
                setSelectedService("");
                setFormData({ ...formData, sub_domain_id: value });
              }}
              disabled={!selectedDomain}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  !selectedDomain ? "Select domain first" : "Select sub-domain..."
                } />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {filteredSubDomains.map((subDomain) => (
                  <SelectItem key={subDomain.id} value={subDomain.id}>
                    {subDomain.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service_id">Service</Label>
            <Select
              value={selectedService}
              onValueChange={(value) => {
                setSelectedService(value);
                setFormData({ ...formData, service_id: value });
              }}
              disabled={!selectedSubDomain}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  !selectedSubDomain ? "Select sub-domain first" : "Select service..."
                } />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {filteredServices.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  };

  const renderPartnersStakeholders = () => {
    const filteredPartners = getFilteredPartners();
    const filteredStakeholders = getFilteredStakeholders();

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <UserCheck className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Partners & Stakeholders</h3>
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
      </div>
    );
  };

  const renderFocusQuestionsSettings = () => {
    const filteredFocusQuestions = getFilteredFocusQuestions();

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Focus Questions & Settings</h3>
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

        {/* Event Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Event Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select event status" />
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
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInformation();
      case 2:
        return renderEventDetails();
      case 3:
        return renderOrganizationalStructure();
      case 4:
        return renderPartnersStakeholders();
      case 5:
        return renderFocusQuestionsSettings();
      default:
        return renderBasicInformation();
    }
  };

  const steps = [
    { number: 1, title: "Basic Info", icon: Target },
    { number: 2, title: "Event Details", icon: Calendar },
    { number: 3, title: "Organization", icon: Building },
    { number: 4, title: "Partners", icon: UserCheck },
    { number: 5, title: "Questions", icon: HelpCircle },
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
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Step {currentStep} of {totalSteps}</span>
                  <div className="flex space-x-1">
                    {Array.from({ length: totalSteps }, (_, i) => (
                      <div
                        key={i + 1}
                        className={`h-2 w-2 rounded-full transition-colors ${
                          i + 1 === currentStep
                            ? 'bg-primary'
                            : i + 1 < currentStep
                            ? 'bg-primary/60'
                            : 'bg-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {currentStep < totalSteps ? (
                  <Button
                    onClick={nextStep}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={formatFilter} onValueChange={setFormatFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Format" />
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
          <SelectTrigger>
            <SelectValue placeholder="Type" />
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

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleView(event)}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(event);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(event.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {new Date(event.event_date).toLocaleDateString()}
                {event.start_time && (
                  <>
                    <Clock className="h-4 w-4 ml-2" />
                    {event.start_time}
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {event.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{event.event_type}</Badge>
                  <Badge variant="outline">{event.format}</Badge>
                  <Badge variant={event.status === 'completed' ? 'default' : 'secondary'}>
                    {event.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  {event.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  )}
                  {event.max_participants && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{event.registered_participants || 0}/{event.max_participants}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Event Dialog */}
      <Dialog open={!!viewingEvent} onOpenChange={() => setViewingEvent(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {viewingEvent && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  {viewingEvent.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Event Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(viewingEvent.event_date).toLocaleDateString()}
                      </div>
                      {viewingEvent.start_time && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {viewingEvent.start_time} - {viewingEvent.end_time}
                        </div>
                      )}
                      {viewingEvent.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {viewingEvent.location}
                        </div>
                      )}
                    </div>
                  </div>

                  {viewingEvent.description && (
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">{viewingEvent.description}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{viewingEvent.event_type}</Badge>
                    <Badge variant="outline">{viewingEvent.format}</Badge>
                    <Badge variant={viewingEvent.status === 'completed' ? 'default' : 'secondary'}>
                      {viewingEvent.status}
                    </Badge>
                  </div>

                  {viewingEvent.partners && viewingEvent.partners.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Partners</h4>
                      <div className="flex flex-wrap gap-1">
                        {viewingEvent.partners.map((partner: any) => (
                          <Badge key={partner.id} variant="outline" className="text-xs">
                            {partner.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {viewingEvent.stakeholders && viewingEvent.stakeholders.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Stakeholders</h4>
                      <div className="flex flex-wrap gap-1">
                        {viewingEvent.stakeholders.map((stakeholder: any) => (
                          <Badge key={stakeholder.id} variant="outline" className="text-xs">
                            {stakeholder.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
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