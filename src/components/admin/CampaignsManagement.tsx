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
  sector_ids?: string[];
  deputy_ids?: string[];
  department_ids?: string[];
  challenge_ids?: string[];
  campaign_manager_id?: string;
  created_at?: string;
}

export function CampaignsManagement() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  
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
  
  // Form data with multi-select arrays
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
      const [sectorsRes, deputiesRes, departmentsRes, challengesRes, partnersRes, stakeholdersRes] = await Promise.all([
        supabase.from('sectors').select('*'),
        supabase.from('deputies').select('*'),
        supabase.from('departments').select('*'),
        supabase.from('challenges').select('*'),
        supabase.from('partners').select('*'),
        supabase.from('stakeholders').select('*')
      ]);

      setSectors(sectorsRes.data || []);
      setDeputies(deputiesRes.data || []);
      setDepartments(departmentsRes.data || []);
      setChallenges(challengesRes.data || []);
      setPartners(partnersRes.data || []);
      setStakeholders(stakeholdersRes.data || []);
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
    setFormData({
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
      sector_ids: [],
      deputy_ids: [],
      department_ids: [],
      challenge_ids: [],
    });
    setSelectedPartners([]);
    setSelectedStakeholders([]);
    setCurrentStep(1);
    setStepErrors({});
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
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
      sector_ids: campaign.sector_ids || [],
      deputy_ids: campaign.deputy_ids || [],
      department_ids: campaign.department_ids || [],
      challenge_ids: campaign.challenge_ids || [],
    });
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
      case 1: // Basic Information
        if (!formData.title.trim()) errors.push("Title is required");
        if (!formData.start_date) errors.push("Start date is required");
        if (!formData.end_date) errors.push("End date is required");
        if (formData.start_date && formData.end_date && formData.start_date >= formData.end_date) {
          errors.push("End date must be after start date");
        }
        break;
      case 2: // Organization & Structure
        // Multi-select validation can be optional
        break;
      case 3: // Partners & Stakeholders
        // Optional validation
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
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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
        // Note: These array fields would need corresponding database columns
        // sector_ids: formData.sector_ids,
        // deputy_ids: formData.deputy_ids,
        // department_ids: formData.department_ids,
        // challenge_ids: formData.challenge_ids,
      };

      let result;
      if (editingCampaign) {
        result = await supabase
          .from('campaigns')
          .update(campaignData)
          .eq('id', editingCampaign.id);
      } else {
        result = await supabase
          .from('campaigns')
          .insert([campaignData]);
      }

      if (result.error) throw result.error;

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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date *</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">End Date *</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="registration_deadline">Registration Deadline</Label>
          <Input
            id="registration_deadline"
            type="date"
            value={formData.registration_deadline}
            onChange={(e) => setFormData({ ...formData, registration_deadline: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="target_participants">Target Participants</Label>
          <Input
            id="target_participants"
            type="number"
            value={formData.target_participants}
            onChange={(e) => setFormData({ ...formData, target_participants: e.target.value })}
            placeholder="Number of participants"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="target_ideas">Target Ideas</Label>
          <Input
            id="target_ideas"
            type="number"
            value={formData.target_ideas}
            onChange={(e) => setFormData({ ...formData, target_ideas: e.target.value })}
            placeholder="Number of ideas"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">Budget</Label>
          <Input
            id="budget"
            type="number"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            placeholder="Campaign budget"
            min="0"
            step="0.01"
          />
        </div>
      </div>
    </div>
  );

  const renderOrganization = () => {
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
        return renderOrganization();
      case 3:
        return renderPartnersStakeholders();
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
          <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
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

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(campaign)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(campaign.id)}
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
    </div>
  );
}