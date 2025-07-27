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
  X
} from "lucide-react";

interface Campaign {
  id: string;
  title: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  status: string;
  theme?: string;
  start_date: string;
  end_date: string;
  registration_deadline?: string;
  target_participants?: number;
  target_ideas?: number;
  budget?: number;
  success_metrics?: string;
  campaign_manager_id?: string;
  // Single select fields from campaigns table
  sector_id?: string;
  deputy_id?: string;
  department_id?: string;
  challenge_id?: string;
  // Multi-select arrays for compatibility
  sector_ids?: string[];
  deputy_ids?: string[];
  department_ids?: string[];
  challenge_ids?: string[];
  partner_ids?: string[];
  stakeholder_ids?: string[];
  created_at?: string;
}

export function CampaignsManagement() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [viewingCampaign, setViewingCampaign] = useState<Campaign | null>(null);
  
  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const [stepErrors, setStepErrors] = useState<{[key: number]: string[]}>({});
  
  // Organization search states (moved to top level to avoid hooks violations)
  const [openSector, setOpenSector] = useState(false);
  const [openDeputy, setOpenDeputy] = useState(false);
  const [openDepartment, setOpenDepartment] = useState(false);
  const [openChallenge, setOpenChallenge] = useState(false);
  
  // Partners & Stakeholders search states
  const [partnerSearch, setPartnerSearch] = useState("");
  const [stakeholderSearch, setStakeholderSearch] = useState("");
  
  // Form data with both single and multi-select fields
  const [formData, setFormData] = useState({
    title: "",
    title_ar: "",
    description: "",
    description_ar: "",
    status: "planning",
    theme: "digital_transformation",
    start_date: "",
    end_date: "",
    registration_deadline: "",
    target_participants: "",
    target_ideas: "",
    budget: "",
    success_metrics: "",
    campaign_manager_id: "",
    // Single select fields from campaigns table
    sector_id: "",
    deputy_id: "",
    department_id: "",
    challenge_id: "",
    // Multi-select arrays for linking tables
    sector_ids: [] as string[],
    deputy_ids: [] as string[],
    department_ids: [] as string[],
    challenge_ids: [] as string[],
  });

  // Related data
  const [sectors, setSectors] = useState<any[]>([]);
  const [deputies, setDeputies] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [domains, setDomains] = useState<any[]>([]);
  const [subDomains, setSubDomains] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [stakeholders, setStakeholders] = useState<any[]>([]);
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const [selectedStakeholders, setSelectedStakeholders] = useState<string[]>([]);
  const [campaignManagers, setCampaignManagers] = useState<any[]>([]);
  const [campaignManagerSearch, setCampaignManagerSearch] = useState("");
  const [openCampaignManager, setOpenCampaignManager] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    fetchCampaigns();
    fetchRelatedData();
  }, []);

  useEffect(() => {
    filterCampaigns();
  }, [campaigns, searchTerm, statusFilter]);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: "Error",
        description: "Failed to fetch campaigns",
        variant: "destructive",
      });
    }
  };

  const fetchRelatedData = async () => {
    try {
      const [sectorsRes, deputiesRes, departmentsRes, domainsRes, subDomainsRes, servicesRes, challengesRes, partnersRes, stakeholdersRes, managersRes] = await Promise.all([
        supabase.from('sectors').select('*'),
        supabase.from('deputies').select('*'),
        supabase.from('departments').select('*'),
        supabase.from('domains').select('*'),
        supabase.from('sub_domains').select('*'),
        supabase.from('services').select('*'),
        supabase.from('challenges').select('*'),
        supabase.from('partners').select('*'),
        supabase.from('stakeholders').select('*'),
        supabase.from('profiles').select('id, name, email, position').eq('status', 'active')
      ]);

      setSectors(sectorsRes.data || []);
      setDeputies(deputiesRes.data || []);
      setDepartments(departmentsRes.data || []);
      setDomains(domainsRes.data || []);
      setSubDomains(subDomainsRes.data || []);
      setServices(servicesRes.data || []);
      setChallenges(challengesRes.data || []);
      setPartners(partnersRes.data || []);
      setStakeholders(stakeholdersRes.data || []);
      setCampaignManagers(managersRes.data || []);
    } catch (error) {
      console.error('Error fetching related data:', error);
    }
  };

  const filterCampaigns = () => {
    let filtered = campaigns;

    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(campaign => campaign.status === statusFilter);
    }

    setFilteredCampaigns(filtered);
  };

  const resetForm = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    setFormData({
      title: "",
      title_ar: "",
      description: "",
      description_ar: "",
      status: "planning",
      theme: "digital_transformation",
      start_date: nextWeek.toISOString().split('T')[0], // Default to next week
      end_date: nextMonth.toISOString().split('T')[0], // Default to next month
      registration_deadline: tomorrow.toISOString().split('T')[0], // Default to tomorrow
      target_participants: "",
      target_ideas: "",
      budget: "",
      success_metrics: "",
      campaign_manager_id: "",
      // Single select fields
      sector_id: "",
      deputy_id: "",
      department_id: "",
      challenge_id: "",
      // Multi-select arrays
      sector_ids: [],
      deputy_ids: [],
      department_ids: [],
      challenge_ids: [],
    });
    setSelectedPartners([]);
    setSelectedStakeholders([]);
    setCurrentStep(1);
    setStepErrors({});
    
    // Reset search states
    setPartnerSearch("");
    setStakeholderSearch("");
    setCampaignManagerSearch("");
    
    // Reset dropdown states
    setOpenSector(false);
    setOpenDeputy(false);
    setOpenDepartment(false);
    setOpenChallenge(false);
    setOpenCampaignManager(false);
  };

  const handleEdit = async (campaign: Campaign) => {
    // First reset all form state to ensure clean slate
    resetForm();
    
    setEditingCampaign(campaign);
    
    // Load existing relationships from linking tables
    try {
      const [sectorsRes, deputiesRes, departmentsRes, challengesRes, partnersRes, stakeholdersRes] = await Promise.all([
        supabase.from('campaign_sector_links').select('sector_id').eq('campaign_id', campaign.id),
        supabase.from('campaign_deputy_links').select('deputy_id').eq('campaign_id', campaign.id),
        supabase.from('campaign_department_links').select('department_id').eq('campaign_id', campaign.id),
        supabase.from('campaign_challenge_links').select('challenge_id').eq('campaign_id', campaign.id),
        supabase.from('campaign_partner_links').select('partner_id').eq('campaign_id', campaign.id),
        supabase.from('campaign_stakeholder_links').select('stakeholder_id').eq('campaign_id', campaign.id)
      ]);

      setFormData({
        title: campaign.title || "",
        title_ar: campaign.title_ar || "",
        description: campaign.description || "",
        description_ar: campaign.description_ar || "",
        status: campaign.status || "planning",
        theme: campaign.theme || "digital_transformation",
        start_date: campaign.start_date || "",
        end_date: campaign.end_date || "",
        registration_deadline: campaign.registration_deadline || "",
        target_participants: campaign.target_participants?.toString() || "",
        target_ideas: campaign.target_ideas?.toString() || "",
        budget: campaign.budget?.toString() || "",
        success_metrics: campaign.success_metrics || "",
        campaign_manager_id: campaign.campaign_manager_id || "",
        // Single select fields
        sector_id: campaign.sector_id || "",
        deputy_id: campaign.deputy_id || "",
        department_id: campaign.department_id || "",
        challenge_id: campaign.challenge_id || "",
        // Load from linking tables, fallback to old single fields for backward compatibility
        sector_ids: sectorsRes.data?.map(s => s.sector_id) || ((campaign as any).sector_id ? [(campaign as any).sector_id] : []),
        deputy_ids: deputiesRes.data?.map(d => d.deputy_id) || ((campaign as any).deputy_id ? [(campaign as any).deputy_id] : []),
        department_ids: departmentsRes.data?.map(d => d.department_id) || ((campaign as any).department_id ? [(campaign as any).department_id] : []),
        challenge_ids: challengesRes.data?.map(c => c.challenge_id) || ((campaign as any).challenge_id ? [(campaign as any).challenge_id] : []),
      });

      // Set partner and stakeholder selections
      setSelectedPartners(partnersRes.data?.map(p => p.partner_id) || []);
      setSelectedStakeholders(stakeholdersRes.data?.map(s => s.stakeholder_id) || []);
      
    } catch (error) {
      console.error('Error loading campaign relationships:', error);
      // Fallback to basic campaign data
      setFormData({
        title: campaign.title || "",
        title_ar: campaign.title_ar || "",
        description: campaign.description || "",
        description_ar: campaign.description_ar || "",
        status: campaign.status || "planning",
        theme: campaign.theme || "digital_transformation",
        start_date: campaign.start_date || "",
        end_date: campaign.end_date || "",
        registration_deadline: campaign.registration_deadline || "",
        target_participants: campaign.target_participants?.toString() || "",
        target_ideas: campaign.target_ideas?.toString() || "",
        budget: campaign.budget?.toString() || "",
        success_metrics: campaign.success_metrics || "",
        campaign_manager_id: campaign.campaign_manager_id || "",
        // Single select fields
        sector_id: campaign.sector_id || "",
        deputy_id: campaign.deputy_id || "",
        department_id: campaign.department_id || "",
        challenge_id: campaign.challenge_id || "",
        // Multi-select arrays
        sector_ids: [],
        deputy_ids: [],
        department_ids: [],
        challenge_ids: [],
      });
    }
    
    // Reset search states
    setPartnerSearch("");
    setStakeholderSearch("");
    setCampaignManagerSearch("");
    
    // Reset dropdown states
    setOpenSector(false);
    setOpenDeputy(false);
    setOpenDepartment(false);
    setOpenChallenge(false);
    setOpenCampaignManager(false);
    
    setShowAddDialog(true);
  };

  const handleView = async (campaign: Campaign) => {
    // Load complete campaign details with relationships
    try {
      const [sectorsRes, deputiesRes, departmentsRes, challengesRes, partnersRes, stakeholdersRes] = await Promise.all([
        supabase.from('campaign_sector_links').select('sector_id').eq('campaign_id', campaign.id),
        supabase.from('campaign_deputy_links').select('deputy_id').eq('campaign_id', campaign.id),
        supabase.from('campaign_department_links').select('department_id').eq('campaign_id', campaign.id),
        supabase.from('campaign_challenge_links').select('challenge_id').eq('campaign_id', campaign.id),
        supabase.from('campaign_partner_links').select('partner_id').eq('campaign_id', campaign.id),
        supabase.from('campaign_stakeholder_links').select('stakeholder_id').eq('campaign_id', campaign.id)
      ]);

      // Enhance campaign object with relationship data
      const enhancedCampaign = {
        ...campaign,
        sector_ids: sectorsRes.data?.map(item => item.sector_id) || [],
        deputy_ids: deputiesRes.data?.map(item => item.deputy_id) || [],
        department_ids: departmentsRes.data?.map(item => item.department_id) || [],
        challenge_ids: challengesRes.data?.map(item => item.challenge_id) || [],
        partner_ids: partnersRes.data?.map(item => item.partner_id) || [],
        stakeholder_ids: stakeholdersRes.data?.map(item => item.stakeholder_id) || []
      };

      setViewingCampaign(enhancedCampaign);
    } catch (error) {
      console.error('Error loading campaign details:', error);
      setViewingCampaign(campaign); // fallback to basic campaign data
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;

    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Campaign deleted successfully",
      });

      fetchCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        title: "Error",
        description: "Failed to delete campaign",
        variant: "destructive",
      });
    }
  };

  const validateStep = (step: number): string[] => {
    const errors: string[] = [];

    switch (step) {
      case 1: // Basic Information
        if (!formData.title.trim()) errors.push("Title is required");
        if (!formData.description?.trim()) errors.push("Description is required");
        if (!formData.status) errors.push("Status is required");
        if (!formData.campaign_manager_id) errors.push("Campaign Manager is required");
        break;
      case 2: // Campaign Details
        if (!formData.start_date) errors.push("Start date is required");
        if (!formData.end_date) errors.push("End date is required");
        if (formData.start_date && formData.end_date && formData.start_date >= formData.end_date) {
          errors.push("End date must be after start date");
        }
        if (formData.registration_deadline && formData.start_date && formData.registration_deadline >= formData.start_date) {
          errors.push("Registration deadline must be before start date");
        }
        break;
      case 3: // Organizational Structure
        // Multi-select validation can be optional
        break;
      case 4: // Partners & Stakeholders
        // Optional validation
        break;
      case 5: // Additional Settings
        if (formData.target_participants && parseInt(formData.target_participants) <= 0) {
          errors.push("Target participants must be a positive number");
        }
        if (formData.target_ideas && parseInt(formData.target_ideas) <= 0) {
          errors.push("Target ideas must be a positive number");
        }
        if (formData.budget && parseFloat(formData.budget) <= 0) {
          errors.push("Budget must be a positive number");
        }
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
        description: `Please fix the errors in step ${currentStep} before proceeding`,
        variant: "destructive",
      });
      // Scroll to top of form to show errors
      document.querySelector('.dialog-content')?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setStepErrors({ ...stepErrors, [currentStep]: [] });
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      // Success feedback for step completion
      toast({
        title: "Step Complete",
        description: `Step ${currentStep} completed successfully`,
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      // Clear current step errors when going back
      setStepErrors({ ...stepErrors, [currentStep]: [] });
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    console.log('Starting campaign submission...');
    
    // Validate all steps
    const allErrors: string[] = [];
    for (let i = 1; i <= 5; i++) {
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
      const campaignData = {
        title: formData.title,
        title_ar: formData.title_ar || null,
        description: formData.description || null,
        description_ar: formData.description_ar || null,
        status: formData.status,
        theme: formData.theme,
        start_date: formData.start_date,
        end_date: formData.end_date,
        registration_deadline: formData.registration_deadline || null,
        target_participants: formData.target_participants ? parseInt(formData.target_participants) : null,
        target_ideas: formData.target_ideas ? parseInt(formData.target_ideas) : null,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        success_metrics: formData.success_metrics || null,
        campaign_manager_id: formData.campaign_manager_id || null,
        // Single select fields
        sector_id: formData.sector_id || null,
        deputy_id: formData.deputy_id || null,
        department_id: formData.department_id || null,
        challenge_id: formData.challenge_id || null,
      };

      let campaignId: string;
      
      if (editingCampaign) {
        // Update existing campaign
        const { error } = await supabase
          .from('campaigns')
          .update(campaignData)
          .eq('id', editingCampaign.id);

        if (error) throw error;
        campaignId = editingCampaign.id;
        
        // Delete existing relationships
        await Promise.all([
          supabase.from('campaign_sector_links').delete().eq('campaign_id', campaignId),
          supabase.from('campaign_deputy_links').delete().eq('campaign_id', campaignId),
          supabase.from('campaign_department_links').delete().eq('campaign_id', campaignId),
          supabase.from('campaign_challenge_links').delete().eq('campaign_id', campaignId),
          supabase.from('campaign_partner_links').delete().eq('campaign_id', campaignId),
          supabase.from('campaign_stakeholder_links').delete().eq('campaign_id', campaignId)
        ]);
      } else {
        // Create new campaign
        const { data, error } = await supabase
          .from('campaigns')
          .insert([campaignData])
          .select('id')
          .single();

        if (error) throw error;
        campaignId = data.id;
      }

      // Insert new relationships
      const relationshipInserts = [];
      
      // Sectors
      if (formData.sector_ids.length > 0) {
        relationshipInserts.push(
          supabase.from('campaign_sector_links').insert(
            formData.sector_ids.map(sectorId => ({ campaign_id: campaignId, sector_id: sectorId }))
          )
        );
      }
      
      // Deputies
      if (formData.deputy_ids.length > 0) {
        relationshipInserts.push(
          supabase.from('campaign_deputy_links').insert(
            formData.deputy_ids.map(deputyId => ({ campaign_id: campaignId, deputy_id: deputyId }))
          )
        );
      }
      
      // Departments
      if (formData.department_ids.length > 0) {
        relationshipInserts.push(
          supabase.from('campaign_department_links').insert(
            formData.department_ids.map(departmentId => ({ campaign_id: campaignId, department_id: departmentId }))
          )
        );
      }
      
      // Challenges
      if (formData.challenge_ids.length > 0) {
        relationshipInserts.push(
          supabase.from('campaign_challenge_links').insert(
            formData.challenge_ids.map(challengeId => ({ campaign_id: campaignId, challenge_id: challengeId }))
          )
        );
      }
      
      // Partners
      if (selectedPartners.length > 0) {
        relationshipInserts.push(
          supabase.from('campaign_partner_links').insert(
            selectedPartners.map(partnerId => ({ campaign_id: campaignId, partner_id: partnerId }))
          )
        );
      }
      
      // Stakeholders
      if (selectedStakeholders.length > 0) {
        relationshipInserts.push(
          supabase.from('campaign_stakeholder_links').insert(
            selectedStakeholders.map(stakeholderId => ({ campaign_id: campaignId, stakeholder_id: stakeholderId }))
          )
        );
      }

      // Execute all relationship inserts
      if (relationshipInserts.length > 0) {
        const results = await Promise.all(relationshipInserts);
        const errors = results.filter(result => result.error);
        if (errors.length > 0) {
          console.error('Error saving relationships:', errors);
          throw new Error('Failed to save some campaign relationships');
        }
      }

      toast({
        title: "Success",
        description: `Campaign ${editingCampaign ? 'updated' : 'created'} successfully`,
      });

      setShowAddDialog(false);
      setEditingCampaign(null);
      resetForm();
      fetchCampaigns();
    } catch (error) {
      console.error('Error saving campaign:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingCampaign ? 'update' : 'create'} campaign`,
        variant: "destructive",
      });
    }
  };

  const renderBasicInformation = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Basic Information</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Campaign Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter campaign title"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="title_ar">Campaign Title (Arabic)</Label>
          <Input
            id="title_ar"
            value={formData.title_ar}
            onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
            placeholder="عنوان الحملة"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter campaign description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description_ar">Description (Arabic)</Label>
        <Textarea
          id="description_ar"
          value={formData.description_ar}
          onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
          placeholder="وصف الحملة"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <Select value={formData.theme} onValueChange={(value) => setFormData({ ...formData, theme: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="digital_transformation">Digital Transformation</SelectItem>
              <SelectItem value="sustainability">Sustainability</SelectItem>
              <SelectItem value="healthcare">Healthcare Innovation</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="smart_cities">Smart Cities</SelectItem>
              <SelectItem value="fintech">Financial Technology</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="registration_open">Registration Open</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="evaluation">Evaluation</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="campaign_manager_id">Campaign Manager *</Label>
          <Popover open={openCampaignManager} onOpenChange={setOpenCampaignManager}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCampaignManager}
                className={`w-full justify-between ${stepErrors[1]?.includes("Campaign Manager is required") ? "border-destructive" : ""}`}
              >
                {formData.campaign_manager_id
                  ? campaignManagers.find((manager) => manager.id === formData.campaign_manager_id)?.name
                  : "Select campaign manager..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput 
                  placeholder="Search campaign managers..." 
                  value={campaignManagerSearch}
                  onValueChange={setCampaignManagerSearch}
                />
                <CommandEmpty>No campaign manager found.</CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {campaignManagers
                      .filter((manager) =>
                        manager.name.toLowerCase().includes(campaignManagerSearch.toLowerCase()) ||
                        (manager.email && manager.email.toLowerCase().includes(campaignManagerSearch.toLowerCase())) ||
                        (manager.position && manager.position.toLowerCase().includes(campaignManagerSearch.toLowerCase()))
                      )
                      .map((manager) => (
                        <CommandItem
                          key={manager.id}
                          value={manager.id}
                          onSelect={(currentValue) => {
                            setFormData({ ...formData, campaign_manager_id: currentValue === formData.campaign_manager_id ? "" : currentValue });
                            setOpenCampaignManager(false);
                            setCampaignManagerSearch("");
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              formData.campaign_manager_id === manager.id ? "opacity-100" : "opacity-0"
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
          {stepErrors[1]?.includes("Campaign Manager is required") && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Campaign Manager is required
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Person responsible for managing this campaign
          </p>
        </div>
      </div>
    </div>
  );

  const renderCampaignDetails = () => (
    <div className="space-y-6">
      {stepErrors[2] && stepErrors[2].length > 0 && (
        <div className="bg-destructive/15 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">Please fix the following errors:</span>
          </div>
          <ul className="list-disc list-inside text-sm text-destructive/80">
            {stepErrors[2].map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Campaign Timeline</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date *</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            className={stepErrors[2]?.includes("Start date is required") ? "border-destructive" : ""}
          />
          {stepErrors[2]?.includes("Start date is required") && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Start date is required
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date">End Date *</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            className={stepErrors[2]?.includes("End date is required") || stepErrors[2]?.includes("End date must be after start date") ? "border-destructive" : ""}
          />
          {(stepErrors[2]?.includes("End date is required") || stepErrors[2]?.includes("End date must be after start date")) && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {stepErrors[2]?.includes("End date is required") ? "End date is required" : "End date must be after start date"}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="registration_deadline">Registration Deadline</Label>
          <Input
            id="registration_deadline"
            type="date"
            value={formData.registration_deadline}
            onChange={(e) => setFormData({ ...formData, registration_deadline: e.target.value })}
            className={stepErrors[2]?.includes("Registration deadline must be before start date") ? "border-destructive" : ""}
          />
          <p className="text-xs text-muted-foreground">
            When participants can register until
          </p>
          {stepErrors[2]?.includes("Registration deadline must be before start date") && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Registration deadline must be before start date
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderAdditionalSettings = () => (
    <div className="space-y-6">
      {stepErrors[5] && stepErrors[5].length > 0 && (
        <div className="bg-destructive/15 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">Please fix the following errors:</span>
          </div>
          <ul className="list-disc list-inside text-sm text-destructive/80">
            {stepErrors[5].map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Goals & Metrics</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="target_participants">Target Participants</Label>
          <Input
            id="target_participants"
            type="number"
            min="1"
            value={formData.target_participants}
            onChange={(e) => setFormData({ ...formData, target_participants: e.target.value })}
            placeholder="100"
            className={stepErrors[5]?.includes("Target participants must be a positive number") ? "border-destructive" : ""}
          />
          <p className="text-xs text-muted-foreground">
            Expected number of participants
          </p>
          {stepErrors[5]?.includes("Target participants must be a positive number") && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Must be a positive number
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="target_ideas">Target Ideas</Label>
          <Input
            id="target_ideas"
            type="number"
            min="1"
            value={formData.target_ideas}
            onChange={(e) => setFormData({ ...formData, target_ideas: e.target.value })}
            placeholder="50"
            className={stepErrors[5]?.includes("Target ideas must be a positive number") ? "border-destructive" : ""}
          />
          <p className="text-xs text-muted-foreground">
            Expected number of ideas/submissions
          </p>
          {stepErrors[5]?.includes("Target ideas must be a positive number") && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Must be a positive number
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="budget">Budget (SAR)</Label>
          <Input
            id="budget"
            type="number"
            min="0"
            step="0.01"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            placeholder="10000.00"
            className={stepErrors[5]?.includes("Budget must be a positive number") ? "border-destructive" : ""}
          />
          <p className="text-xs text-muted-foreground">
            Total budget allocated for this campaign
          </p>
          {stepErrors[5]?.includes("Budget must be a positive number") && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Must be a positive number
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="success_metrics">Success Metrics & KPIs</Label>
          <Textarea
            id="success_metrics"
            value={formData.success_metrics}
            onChange={(e) => setFormData({ ...formData, success_metrics: e.target.value })}
            placeholder="Define how success will be measured (e.g., number of submissions, quality scores, participant engagement, innovation metrics)"
            className="min-h-[100px]"
          />
          <p className="text-xs text-muted-foreground">
            Describe the key performance indicators and success criteria
          </p>
        </div>
      </div>
    </div>
  );

  const renderOrganizationalStructure = () => {
    // Filter deputies based on selected sectors
    const filteredDeputies = formData.sector_ids.length > 0
      ? deputies.filter(deputy => formData.sector_ids.includes(deputy.sector_id))
      : deputies;

    // Filter departments based on selected deputies
    const filteredDepartments = formData.deputy_ids.length > 0
      ? departments.filter(department => formData.deputy_ids.includes(department.deputy_id))
      : departments;

    const getSelectedSectorNames = () => {
      if (formData.sector_ids.length === 0) return "Select sectors";
      return `${formData.sector_ids.length} selected`;
    };

    const getSelectedDeputyNames = () => {
      if (formData.deputy_ids.length === 0) return "Select deputies";
      return `${formData.deputy_ids.length} selected`;
    };

    const getSelectedDepartmentNames = () => {
      if (formData.department_ids.length === 0) return "Select departments";
      return `${formData.department_ids.length} selected`;
    };

    const getSelectedChallengeNames = () => {
      if (formData.challenge_ids.length === 0) return "Select challenges";
      return `${formData.challenge_ids.length} selected`;
    };

    const handleSectorToggle = (value: string) => {
      setFormData(prev => {
        const newSectorIds = prev.sector_ids.includes(value)
          ? prev.sector_ids.filter(id => id !== value)
          : [...prev.sector_ids, value];
        
        // Filter valid deputies based on new sector selection
        const validDeputyIds = prev.deputy_ids.filter(deputyId => {
          const deputy = deputies.find(d => d.id === deputyId);
          return deputy && newSectorIds.includes(deputy.sector_id);
        });
        
        // Filter valid departments based on remaining valid deputies
        const validDepartmentIds = prev.department_ids.filter(deptId => {
          const department = departments.find(d => d.id === deptId);
          return department && validDeputyIds.includes(department.deputy_id);
        });
        
        return {
          ...prev,
          sector_ids: newSectorIds,
          deputy_ids: validDeputyIds,
          department_ids: validDepartmentIds
        };
      });
    };

    const handleDeputyToggle = (value: string) => {
      setFormData(prev => {
        const newDeputyIds = prev.deputy_ids.includes(value)
          ? prev.deputy_ids.filter(id => id !== value)
          : [...prev.deputy_ids, value];
        
        // Filter valid departments based on new deputy selection
        const validDepartmentIds = prev.department_ids.filter(deptId => {
          const department = departments.find(d => d.id === deptId);
          return department && newDeputyIds.includes(department.deputy_id);
        });
        
        return {
          ...prev,
          deputy_ids: newDeputyIds,
          department_ids: validDepartmentIds
        };
      });
    };

    const handleDepartmentToggle = (value: string) => {
      setFormData(prev => ({
        ...prev,
        department_ids: prev.department_ids.includes(value)
          ? prev.department_ids.filter(id => id !== value)
          : [...prev.department_ids, value]
      }));
    };

    const handleChallengeToggle = (value: string) => {
      setFormData(prev => ({
        ...prev,
        challenge_ids: prev.challenge_ids.includes(value)
          ? prev.challenge_ids.filter(id => id !== value)
          : [...prev.challenge_ids, value]
      }));
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Building className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Organization & Structure</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sector_id">Sectors</Label>
            <Popover open={openSector} onOpenChange={setOpenSector}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openSector}
                  className="w-full justify-between"
                >
                  {getSelectedSectorNames()}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search sectors..." />
                  <CommandList>
                    <CommandEmpty>No sector found.</CommandEmpty>
                    <CommandGroup>
                      {sectors.map((sector) => (
                        <CommandItem
                          key={sector.id}
                          value={sector.name}
                          onSelect={() => handleSectorToggle(sector.id)}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              formData.sector_ids.includes(sector.id) ? "opacity-100" : "opacity-0"
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
            {formData.sector_ids.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.sector_ids.map(id => {
                  const sector = sectors.find(s => s.id === id);
                  return sector ? (
                    <Badge key={id} variant="secondary" className="text-xs">
                      {sector.name}
                      <X 
                        className="ml-1 h-3 w-3 cursor-pointer" 
                        onClick={() => handleSectorToggle(id)}
                      />
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deputy_id">Deputies</Label>
            <Popover open={openDeputy} onOpenChange={setOpenDeputy}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openDeputy}
                  className="w-full justify-between"
                >
                  {getSelectedDeputyNames()}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search deputies..." />
                  <CommandList>
                    <CommandEmpty>No deputy found.</CommandEmpty>
                    <CommandGroup>
                      {filteredDeputies.map((deputy) => (
                        <CommandItem
                          key={deputy.id}
                          value={deputy.name}
                          onSelect={() => handleDeputyToggle(deputy.id)}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              formData.deputy_ids.includes(deputy.id) ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          {deputy.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {formData.deputy_ids.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.deputy_ids.map(id => {
                  const deputy = filteredDeputies.find(d => d.id === id);
                  return deputy ? (
                    <Badge key={id} variant="secondary" className="text-xs">
                      {deputy.name}
                      <X 
                        className="ml-1 h-3 w-3 cursor-pointer" 
                        onClick={() => handleDeputyToggle(id)}
                      />
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="department_id">Departments</Label>
            <Popover open={openDepartment} onOpenChange={setOpenDepartment}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openDepartment}
                  className="w-full justify-between"
                >
                  {getSelectedDepartmentNames()}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search departments..." />
                  <CommandList>
                    <CommandEmpty>No department found.</CommandEmpty>
                    <CommandGroup>
                      {filteredDepartments.map((department) => (
                        <CommandItem
                          key={department.id}
                          value={department.name}
                          onSelect={() => handleDepartmentToggle(department.id)}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              formData.department_ids.includes(department.id) ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          {department.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {formData.department_ids.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.department_ids.map(id => {
                  const department = filteredDepartments.find(d => d.id === id);
                  return department ? (
                    <Badge key={id} variant="secondary" className="text-xs">
                      {department.name}
                      <X 
                        className="ml-1 h-3 w-3 cursor-pointer" 
                        onClick={() => handleDepartmentToggle(id)}
                      />
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="challenge_id">Related Challenges</Label>
            <Popover open={openChallenge} onOpenChange={setOpenChallenge}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openChallenge}
                  className="w-full justify-between"
                >
                  {getSelectedChallengeNames()}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search challenges..." />
                  <CommandList>
                    <CommandEmpty>No challenge found.</CommandEmpty>
                    <CommandGroup>
                      {challenges.map((challenge) => (
                        <CommandItem
                          key={challenge.id}
                          value={challenge.title}
                          onSelect={() => handleChallengeToggle(challenge.id)}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              formData.challenge_ids.includes(challenge.id) ? "opacity-100" : "opacity-0"
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
            {formData.challenge_ids.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.challenge_ids.map(id => {
                  const challenge = challenges.find(c => c.id === id);
                  return challenge ? (
                    <Badge key={id} variant="secondary" className="text-xs">
                      {challenge.title}
                      <X 
                        className="ml-1 h-3 w-3 cursor-pointer" 
                        onClick={() => handleChallengeToggle(id)}
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

  const renderPartnersStakeholders = () => {
    const filteredPartners = partners.filter(partner => 
      partner.name.toLowerCase().includes(partnerSearch.toLowerCase())
    );

    const filteredStakeholders = stakeholders.filter(stakeholder => 
      stakeholder.name.toLowerCase().includes(stakeholderSearch.toLowerCase())
    );

    return (
      <div className="space-y-6">
        {stepErrors[4] && stepErrors[4].length > 0 && (
          <div className="bg-destructive/15 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Please fix the following errors:</span>
            </div>
            <ul className="list-disc list-inside text-sm text-destructive/80">
              {stepErrors[4].map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        {stepErrors[3] && stepErrors[3].length > 0 && (
          <div className="bg-destructive/15 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Please fix the following errors:</span>
            </div>
            <ul className="list-disc list-inside text-sm text-destructive/80">
              {stepErrors[3].map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-primary" />
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

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInformation();
      case 2:
        return renderCampaignDetails();
      case 3:
        return renderOrganizationalStructure();
      case 4:
        return renderPartnersStakeholders();
      case 5:
        return renderAdditionalSettings();
      default:
        return renderBasicInformation();
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      planning: { variant: "secondary" as const, color: "text-blue-600" },
      active: { variant: "default" as const, color: "text-green-600" },
      registration_open: { variant: "outline" as const, color: "text-orange-600" },
      ongoing: { variant: "default" as const, color: "text-blue-600" },
      evaluation: { variant: "secondary" as const, color: "text-purple-600" },
      completed: { variant: "outline" as const, color: "text-green-600" },
      cancelled: { variant: "destructive" as const, color: "text-red-600" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.planning;
    
    return (
      <Badge variant={config.variant} className={config.color}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Campaigns Management</h1>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingCampaign(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCampaign ? 'Edit Campaign' : 'Add New Campaign'}</DialogTitle>
            </DialogHeader>

            {/* Multi-step form */}
            <div className="space-y-6">
              {/* Step indicator */}
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`flex items-center ${step < 3 ? 'flex-1' : ''}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep === step
                          ? 'bg-primary text-primary-foreground'
                          : currentStep > step
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {step}
                    </div>
                    {step < 3 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 ${
                          currentStep > step ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step content */}
              <div className="min-h-[400px]">
                {renderCurrentStep()}
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                
                <div className="flex gap-2">
                  {currentStep < 3 ? (
                    <Button onClick={nextStep}>
                      Next
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit}>
                      {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search campaigns..."
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
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="registration_open">Registration Open</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="evaluation">Evaluation</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campaigns grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
          <Card 
            key={campaign.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleView(campaign)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{campaign.title}</CardTitle>
                {getStatusBadge(campaign.status)}
              </div>
              {campaign.theme && (
                <Badge variant="outline" className="w-fit text-xs">
                  {campaign.theme.replace('_', ' ')}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {campaign.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {campaign.description}
                </p>
              )}
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{campaign.start_date} - {campaign.end_date}</span>
                </div>
                
                {campaign.target_participants && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{campaign.target_participants} participants</span>
                  </div>
                )}
                
                {campaign.budget && (
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span>Budget: ${campaign.budget.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(campaign);
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
                    handleDelete(campaign.id);
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

      {filteredCampaigns.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== "all" 
              ? "No campaigns found matching your criteria." 
              : "No campaigns created yet. Create your first campaign to get started."}
          </p>
        </Card>
      )}

      {/* Campaign Details View Dialog */}
      <Dialog open={!!viewingCampaign} onOpenChange={() => setViewingCampaign(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Campaign Details
            </DialogTitle>
          </DialogHeader>
          
          {viewingCampaign && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  {getStatusBadge(viewingCampaign.status)}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                    <p className="text-sm">{viewingCampaign.title}</p>
                  </div>
                  {viewingCampaign.title_ar && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Title (Arabic)</Label>
                      <p className="text-sm">{viewingCampaign.title_ar}</p>
                    </div>
                )}
              </div>

              {/* Organizational Structure */}
              {(viewingCampaign.sector_ids?.length || viewingCampaign.deputy_ids?.length || 
                viewingCampaign.department_ids?.length || viewingCampaign.challenge_ids?.length) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Organizational Structure
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {viewingCampaign.sector_ids?.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Sectors</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {viewingCampaign.sector_ids.map(sectorId => {
                            const sector = sectors.find(s => s.id === sectorId);
                            return sector ? (
                              <Badge key={sectorId} variant="secondary" className="text-xs">
                                {sector.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {viewingCampaign.deputy_ids?.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Deputies</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {viewingCampaign.deputy_ids.map(deputyId => {
                            const deputy = deputies.find(d => d.id === deputyId);
                            return deputy ? (
                              <Badge key={deputyId} variant="secondary" className="text-xs">
                                {deputy.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {viewingCampaign.department_ids?.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Departments</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {viewingCampaign.department_ids.map(departmentId => {
                            const department = departments.find(d => d.id === departmentId);
                            return department ? (
                              <Badge key={departmentId} variant="secondary" className="text-xs">
                                {department.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {viewingCampaign.challenge_ids?.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Related Challenges</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {viewingCampaign.challenge_ids.map(challengeId => {
                            const challenge = challenges.find(c => c.id === challengeId);
                            return challenge ? (
                              <Badge key={challengeId} variant="secondary" className="text-xs">
                                {challenge.title}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Partners & Stakeholders */}
              {(viewingCampaign.partner_ids?.length || viewingCampaign.stakeholder_ids?.length) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Partners & Stakeholders
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {viewingCampaign.partner_ids?.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Partner Organizations</Label>
                        <div className="space-y-2 mt-2">
                          {viewingCampaign.partner_ids.map(partnerId => {
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

                    {viewingCampaign.stakeholder_ids?.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Target Stakeholders</Label>
                        <div className="space-y-2 mt-2">
                          {viewingCampaign.stakeholder_ids.map(stakeholderId => {
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
                </div>
              )}

                {viewingCampaign.description && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                    <p className="text-sm">{viewingCampaign.description}</p>
                  </div>
                )}

                {viewingCampaign.description_ar && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Description (Arabic)</Label>
                    <p className="text-sm">{viewingCampaign.description_ar}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Theme</Label>
                    <p className="text-sm">{viewingCampaign.theme?.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Start Date</Label>
                    <p className="text-sm">{viewingCampaign.start_date}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">End Date</Label>
                    <p className="text-sm">{viewingCampaign.end_date}</p>
                  </div>
                </div>

                {viewingCampaign.registration_deadline && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Registration Deadline</Label>
                    <p className="text-sm">{viewingCampaign.registration_deadline}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {viewingCampaign.target_participants && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Target Participants</Label>
                      <p className="text-sm">{viewingCampaign.target_participants}</p>
                    </div>
                  )}
                  {viewingCampaign.target_ideas && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Target Ideas</Label>
                      <p className="text-sm">{viewingCampaign.target_ideas}</p>
                    </div>
                  )}
                  {viewingCampaign.budget && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Budget</Label>
                      <p className="text-sm">${viewingCampaign.budget.toLocaleString()}</p>
                    </div>
                  )}
                </div>

                {viewingCampaign.success_metrics && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Success Metrics</Label>
                    <p className="text-sm">{viewingCampaign.success_metrics}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setViewingCampaign(null);
                    handleEdit(viewingCampaign);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Campaign
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setViewingCampaign(null)}
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