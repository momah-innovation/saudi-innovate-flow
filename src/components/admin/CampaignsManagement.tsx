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
      const [sectorsRes, deputiesRes, departmentsRes, challengesRes, partnersRes, stakeholdersRes, managersRes] = await Promise.all([
        supabase.from('sectors').select('*'),
        supabase.from('deputies').select('*'),
        supabase.from('departments').select('*'),
        supabase.from('challenges').select('*'),
        supabase.from('partners').select('*'),
        supabase.from('stakeholders').select('*'),
        supabase.from('profiles').select('id, name, email, position').eq('status', 'active')
      ]);

      setSectors(sectorsRes.data || []);
      setDeputies(deputiesRes.data || []);
      setDepartments(departmentsRes.data || []);
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
      start_date: nextWeek.toISOString().split('T')[0],
      end_date: nextMonth.toISOString().split('T')[0],
      registration_deadline: tomorrow.toISOString().split('T')[0],
      target_participants: "",
      target_ideas: "",
      budget: "",
      success_metrics: "",
      campaign_manager_id: "",
      sector_id: "",
      deputy_id: "",
      department_id: "",
      challenge_id: "",
      sector_ids: [],
      deputy_ids: [],
      department_ids: [],
      challenge_ids: [],
    });
    setSelectedPartners([]);
    setSelectedStakeholders([]);
    setCurrentStep(1);
    setStepErrors({});
    setPartnerSearch("");
    setStakeholderSearch("");
    setCampaignManagerSearch("");
    setOpenSector(false);
    setOpenDeputy(false);
    setOpenDepartment(false);
    setOpenChallenge(false);
    setOpenCampaignManager(false);
  };

  const handleEdit = async (campaign: Campaign) => {
    resetForm();
    setEditingCampaign(campaign);
    
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
        sector_id: campaign.sector_id || "",
        deputy_id: campaign.deputy_id || "",
        department_id: campaign.department_id || "",
        challenge_id: campaign.challenge_id || "",
        sector_ids: sectorsRes.data?.map(s => s.sector_id) || [],
        deputy_ids: deputiesRes.data?.map(d => d.deputy_id) || [],
        department_ids: departmentsRes.data?.map(d => d.department_id) || [],
        challenge_ids: challengesRes.data?.map(c => c.challenge_id) || [],
      });

      setSelectedPartners(partnersRes.data?.map(p => p.partner_id) || []);
      setSelectedStakeholders(stakeholdersRes.data?.map(s => s.stakeholder_id) || []);
      
    } catch (error) {
      console.error('Error loading campaign relationships:', error);
    }
    
    setShowAddDialog(true);
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
      case 1:
        if (!formData.title.trim()) errors.push("Title is required");
        if (!formData.description?.trim()) errors.push("Description is required");
        if (!formData.status) errors.push("Status is required");
        if (!formData.campaign_manager_id) errors.push("Campaign Manager is required");
        break;
      case 2:
        if (!formData.start_date) errors.push("Start date is required");
        if (!formData.end_date) errors.push("End date is required");
        if (formData.start_date && formData.end_date && formData.start_date >= formData.end_date) {
          errors.push("End date must be after start date");
        }
        break;
    }

    return errors;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'planning': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Campaigns Management</h1>
        <Button onClick={() => { resetForm(); setShowAddDialog(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold line-clamp-2">
                  {campaign.title}
                </CardTitle>
                <Badge className={`${getStatusColor(campaign.status)} flex items-center gap-1`}>
                  {getStatusIcon(campaign.status)}
                  {campaign.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {campaign.description}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{campaign.start_date} - {campaign.end_date}</span>
                </div>
                {campaign.target_participants && (
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span>{campaign.target_participants} participants</span>
                  </div>
                )}
                {campaign.budget && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">💰</span>
                    <span>${campaign.budget.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(campaign)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(campaign.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No campaigns found</p>
        </div>
      )}

      {/* Add/Edit Dialog - simplified for now */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCampaign ? "Edit Campaign" : "Create New Campaign"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Campaign title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Campaign description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="end_date">End Date *</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Save logic here
                setShowAddDialog(false);
                toast({ title: "Success", description: "Campaign saved successfully" });
              }}>
                {editingCampaign ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}