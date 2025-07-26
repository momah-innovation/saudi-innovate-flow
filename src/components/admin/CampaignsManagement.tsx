import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Megaphone,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Calendar,
  Users,
  Target,
  DollarSign,
  Building,
  ChevronRight,
  ChevronLeft,
  Check,
  MapPin,
  Trophy
} from "lucide-react";
import { updateCampaignPartners, updateCampaignStakeholders } from "@/lib/relationshipHelpers";

interface Campaign {
  id: string;
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  status: string;
  theme: string;
  start_date: string;
  end_date: string;
  registration_deadline?: string;
  target_participants?: number;
  target_ideas?: number;
  budget?: number;
  success_metrics?: string;
  sector_id?: string;
  deputy_id?: string;
  department_id?: string;
  challenge_id?: string;
  sector?: { id: string; name: string };
  deputy?: { id: string; name: string };
  department?: { id: string; name: string };
  challenge?: { id: string; title: string };
  partners?: Array<{ id: string; name: string }>;
  stakeholders?: Array<{ id: string; name: string }>;
  created_at: string;
}

const statusOptions = ["active", "planning", "completed", "cancelled", "on_hold"];
const themeOptions = ["digital_transformation", "sustainability", "innovation_culture", "process_improvement", "customer_experience", "emerging_technologies"];

export function CampaignsManagement() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [viewingCampaign, setViewingCampaign] = useState<Campaign | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [themeFilter, setThemeFilter] = useState("all");
  
  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const [stepErrors, setStepErrors] = useState<{[key: number]: string[]}>({});
  
  // Form data
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
    sector_id: "",
    deputy_id: "",
    department_id: "",
    challenge_id: "",
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

  const fetchRelatedData = async () => {
    try {
      const [sectorsRes, deputiesRes, departmentsRes, challengesRes, partnersRes, stakeholdersRes] = await Promise.all([
        supabase.from("sectors").select("*").order("name"),
        supabase.from("deputies").select("*").order("name"),
        supabase.from("departments").select("*").order("name"),
        supabase.from("challenges").select("*").order("title"),
        supabase.from("partners").select("*").order("name"),
        supabase.from("stakeholders").select("*").order("name")
      ]);

      setSectors(sectorsRes.data || []);
      setDeputies(deputiesRes.data || []);
      setDepartments(departmentsRes.data || []);
      setChallenges(challengesRes.data || []);
      setPartners(partnersRes.data || []);
      setStakeholders(stakeholdersRes.data || []);
    } catch (error) {
      console.error("Error fetching relationship data:", error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      
      // Fetch campaigns first
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Fetch relationships separately to avoid PostgREST foreign key ambiguity
      const campaignsWithRelationships = await Promise.all(
        (data || []).map(async (campaign) => {
          // Fetch related entities
          const [challengeRes, sectorRes, departmentRes, deputyRes, partnerLinks, stakeholderLinks] = await Promise.all([
            campaign.challenge_id ? supabase.from('challenges').select('id, title').eq('id', campaign.challenge_id).single() : Promise.resolve({ data: null }),
            campaign.sector_id ? supabase.from('sectors').select('id, name').eq('id', campaign.sector_id).single() : Promise.resolve({ data: null }),
            campaign.department_id ? supabase.from('departments').select('id, name').eq('id', campaign.department_id).single() : Promise.resolve({ data: null }),
            campaign.deputy_id ? supabase.from('deputies').select('id, name').eq('id', campaign.deputy_id).single() : Promise.resolve({ data: null }),
            supabase.from('campaign_partner_links').select('partners(id, name)').eq('campaign_id', campaign.id),
            supabase.from('campaign_stakeholder_links').select('stakeholders(id, name)').eq('campaign_id', campaign.id)
          ]);
          
          return {
            ...campaign,
            partners: partnerLinks.data?.map((link: any) => link.partners).filter(Boolean) || [],
            stakeholders: stakeholderLinks.data?.map((link: any) => link.stakeholders).filter(Boolean) || [],
            challenge: challengeRes.data || undefined,
            sector: sectorRes.data || undefined,
            department: departmentRes.data || undefined,
            deputy: deputyRes.data || undefined
          };
        })
      );
      
      setCampaigns(campaignsWithRelationships);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast({
        title: "Error",
        description: "Failed to fetch campaigns",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
      sector_id: "",
      deputy_id: "",
      department_id: "",
      challenge_id: "",
    });
    setSelectedPartners([]);
    setSelectedStakeholders([]);
    setCurrentStep(1);
    setStepErrors({});
  };

  const validateStep = (step: number): string[] => {
    const errors: string[] = [];
    
    switch (step) {
      case 1: // Basic Information
        if (!formData.title.trim()) errors.push("Title is required");
        if (!formData.description.trim()) errors.push("Description is required");
        break;
      case 2: // Timeline & Targets
        if (!formData.start_date) errors.push("Start date is required");
        if (!formData.end_date) errors.push("End date is required");
        if (formData.start_date && formData.end_date && formData.start_date >= formData.end_date) {
          errors.push("End date must be after start date");
        }
        break;
      case 3: // Organization (no required fields)
        break;
      case 4: // Partners & Stakeholders (no required fields)
        break;
      case 5: // Success Metrics (no required fields)
        break;
    }
    
    return errors;
  };

  const handleStepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateStep(currentStep);
    setStepErrors({ ...stepErrors, [currentStep]: errors });
    
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(", "),
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    try {
      const campaignData = {
        ...formData,
        target_participants: formData.target_participants ? parseInt(formData.target_participants) : null,
        target_ideas: formData.target_ideas ? parseInt(formData.target_ideas) : null,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        sector_id: formData.sector_id || null,
        deputy_id: formData.deputy_id || null,
        department_id: formData.department_id || null,
        challenge_id: formData.challenge_id || null,
        registration_deadline: formData.registration_deadline || null,
        title_ar: formData.title_ar || null,
        description_ar: formData.description_ar || null,
        success_metrics: formData.success_metrics || null,
      };

      let result;
      if (editingCampaign) {
        result = await supabase
          .from("campaigns")
          .update(campaignData)
          .eq("id", editingCampaign.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from("campaigns")
          .insert(campaignData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      // Update relationships
      if (selectedPartners.length > 0 || editingCampaign) {
        await updateCampaignPartners(result.data.id, selectedPartners);
      }
      if (selectedStakeholders.length > 0 || editingCampaign) {
        await updateCampaignStakeholders(result.data.id, selectedStakeholders);
      }

      toast({
        title: "Success",
        description: `Campaign ${editingCampaign ? "updated" : "created"} successfully`,
      });

      setIsDialogOpen(false);
      resetForm();
      fetchCampaigns();
    } catch (error) {
      console.error("Error saving campaign:", error);
      toast({
        title: "Error",
        description: `Failed to ${editingCampaign ? "update" : "create"} campaign`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      title: campaign.title,
      title_ar: campaign.title_ar || "",
      description: campaign.description,
      description_ar: campaign.description_ar || "",
      status: campaign.status,
      theme: campaign.theme,
      start_date: campaign.start_date,
      end_date: campaign.end_date,
      registration_deadline: campaign.registration_deadline || "",
      target_participants: campaign.target_participants?.toString() || "",
      target_ideas: campaign.target_ideas?.toString() || "",
      budget: campaign.budget?.toString() || "",
      success_metrics: campaign.success_metrics || "",
      sector_id: campaign.sector_id || "",
      deputy_id: campaign.deputy_id || "",
      department_id: campaign.department_id || "",
      challenge_id: campaign.challenge_id || "",
    });
    setSelectedPartners(campaign.partners?.map(p => p.id) || []);
    setSelectedStakeholders(campaign.stakeholders?.map(s => s.id) || []);
    setCurrentStep(1);
    setStepErrors({});
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("campaigns").delete().eq("id", id);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Campaign deleted successfully",
      });
      fetchCampaigns();
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast({
        title: "Error",
        description: "Failed to delete campaign",
        variant: "destructive",
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepTitle = (step: number): string => {
    switch (step) {
      case 1: return "Basic Information";
      case 2: return "Timeline & Targets";
      case 3: return "Organization & Structure";
      case 4: return "Partners & Stakeholders";
      case 5: return "Success Metrics & Review";
      default: return "";
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInformation();
      case 2:
        return renderTimelineTargets();
      case 3:
        return renderOrganization();
      case 4:
        return renderPartnersStakeholders();
      case 5:
        return renderReview();
      default:
        return null;
    }
  };

  const renderBasicInformation = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Megaphone className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Campaign Basic Information</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Campaign Title (English) *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter campaign title..."
            className={stepErrors[1]?.includes("Title is required") ? "border-red-500" : ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title_ar">Campaign Title (Arabic)</Label>
          <Input
            id="title_ar"
            value={formData.title_ar}
            onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
            placeholder="أدخل عنوان الحملة..."
            dir="rtl"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (English) *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the campaign objectives and goals..."
          rows={4}
          className={stepErrors[1]?.includes("Description is required") ? "border-red-500" : ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description_ar">Description (Arabic)</Label>
        <Textarea
          id="description_ar"
          value={formData.description_ar}
          onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
          placeholder="وصف أهداف ومقاصد الحملة..."
          rows={4}
          dir="rtl"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Campaign Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="theme">Campaign Theme</Label>
          <Select value={formData.theme} onValueChange={(value) => setFormData({ ...formData, theme: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {themeOptions.map((theme) => (
                <SelectItem key={theme} value={theme}>
                  {theme.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderTimelineTargets = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Timeline & Targets</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date *</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            className={stepErrors[2]?.some(e => e.includes("Start date")) ? "border-red-500" : ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date">End Date *</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            className={stepErrors[2]?.some(e => e.includes("End date")) ? "border-red-500" : ""}
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

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="target_participants" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Target Participants
          </Label>
          <Input
            id="target_participants"
            type="number"
            value={formData.target_participants}
            onChange={(e) => setFormData({ ...formData, target_participants: e.target.value })}
            placeholder="Expected number of participants"
            min="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="target_ideas" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Target Ideas
          </Label>
          <Input
            id="target_ideas"
            type="number"
            value={formData.target_ideas}
            onChange={(e) => setFormData({ ...formData, target_ideas: e.target.value })}
            placeholder="Expected number of ideas"
            min="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="budget" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Budget (SAR)
          </Label>
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

  const renderOrganization = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Building className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Organization & Structure</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sector_id">Sector</Label>
          <Select value={formData.sector_id} onValueChange={(value) => setFormData({ ...formData, sector_id: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {sectors.map((sector) => (
                <SelectItem key={sector.id} value={sector.id}>
                  {sector.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="deputy_id">Deputy</Label>
          <Select value={formData.deputy_id} onValueChange={(value) => setFormData({ ...formData, deputy_id: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select deputy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {deputies.map((deputy) => (
                <SelectItem key={deputy.id} value={deputy.id}>
                  {deputy.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="department_id">Department</Label>
          <Select value={formData.department_id} onValueChange={(value) => setFormData({ ...formData, department_id: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {departments.map((department) => (
                <SelectItem key={department.id} value={department.id}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="challenge_id">Related Challenge</Label>
          <Select value={formData.challenge_id} onValueChange={(value) => setFormData({ ...formData, challenge_id: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select challenge" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {challenges.map((challenge) => (
                <SelectItem key={challenge.id} value={challenge.id}>
                  {challenge.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderPartnersStakeholders = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Partners & Stakeholders</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="text-base font-medium">Partner Organizations</Label>
          <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
            {partners.length > 0 ? (
              partners.map((partner) => (
                <div key={partner.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`partner-${partner.id}`}
                    checked={selectedPartners.includes(partner.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedPartners([...selectedPartners, partner.id]);
                      } else {
                        setSelectedPartners(selectedPartners.filter(id => id !== partner.id));
                      }
                    }}
                  />
                  <Label htmlFor={`partner-${partner.id}`} className="text-sm font-normal cursor-pointer">
                    {partner.name}
                  </Label>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No partners available</p>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Selected: {selectedPartners.length} partner(s)
          </p>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium">Target Stakeholders</Label>
          <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
            {stakeholders.length > 0 ? (
              stakeholders.map((stakeholder) => (
                <div key={stakeholder.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`stakeholder-${stakeholder.id}`}
                    checked={selectedStakeholders.includes(stakeholder.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedStakeholders([...selectedStakeholders, stakeholder.id]);
                      } else {
                        setSelectedStakeholders(selectedStakeholders.filter(id => id !== stakeholder.id));
                      }
                    }}
                  />
                  <Label htmlFor={`stakeholder-${stakeholder.id}`} className="text-sm font-normal cursor-pointer">
                    {stakeholder.name}
                  </Label>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No stakeholders available</p>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Selected: {selectedStakeholders.length} stakeholder(s)
          </p>
        </div>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Success Metrics & Final Review</h3>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="success_metrics">Success Metrics & KPIs</Label>
        <Textarea
          id="success_metrics"
          value={formData.success_metrics}
          onChange={(e) => setFormData({ ...formData, success_metrics: e.target.value })}
          placeholder="Define how success will be measured for this campaign..."
          rows={4}
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="font-medium text-lg">Campaign Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Title</Label>
              <p className="text-sm">{formData.title || "Not specified"}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Status & Theme</Label>
              <div className="flex gap-2">
                <Badge variant="secondary">
                  {formData.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Badge>
                <Badge variant="outline">
                  {formData.theme.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Timeline</Label>
              <p className="text-sm">{formData.start_date} to {formData.end_date}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Targets</Label>
              <div className="text-sm space-y-1">
                {formData.target_participants && <p>Participants: {formData.target_participants}</p>}
                {formData.target_ideas && <p>Ideas: {formData.target_ideas}</p>}
                {formData.budget && <p>Budget: {parseFloat(formData.budget).toLocaleString()} SAR</p>}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Relationships</Label>
              <div className="text-sm space-y-1">
                <p>Partners: {selectedPartners.length}</p>
                <p>Stakeholders: {selectedStakeholders.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    const matchesTheme = themeFilter === "all" || campaign.theme === themeFilter;
    return matchesSearch && matchesStatus && matchesTheme;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setThemeFilter("all");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "planning": return "secondary";
      case "completed": return "outline";
      case "cancelled": return "destructive";
      case "on_hold": return "secondary";
      default: return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading campaigns...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Campaigns Management</h1>
          <p className="text-muted-foreground">Manage innovation campaigns and initiatives</p>
        </div>
        
        {/* Add/Edit Campaign Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingCampaign(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                {editingCampaign ? "Edit Campaign" : "Add New Campaign"}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep === step ? 'bg-primary text-primary-foreground' :
                      currentStep > step ? 'bg-green-500 text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {currentStep > step ? <Check className="h-4 w-4" /> : step}
                    </div>
                    {step < 5 && (
                      <div className={`w-8 h-0.5 ${
                        currentStep > step ? 'bg-green-500' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Step {currentStep} of 5: {getStepTitle(currentStep)}
              </div>
            </DialogHeader>
            
            <form onSubmit={handleStepSubmit} className="space-y-6">
              {renderCurrentStep()}
              
              <div className="flex justify-between pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={currentStep === 1 ? () => setIsDialogOpen(false) : handlePrevious}
                >
                  {currentStep === 1 ? "Cancel" : (
                    <><ChevronLeft className="h-4 w-4 mr-1" /> Previous</>
                  )}
                </Button>
                
                <div className="flex gap-2">
                  {currentStep < 5 ? (
                    <Button type="submit">
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      <Check className="h-4 w-4 mr-2" />
                      {editingCampaign ? "Update Campaign" : "Create Campaign"}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search campaigns by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm("")}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={themeFilter} onValueChange={setThemeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Themes</SelectItem>
                {themeOptions.map((theme) => (
                  <SelectItem key={theme} value={theme}>
                    {theme.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {(searchTerm || statusFilter !== "all" || themeFilter !== "all") && (
              <Button variant="outline" onClick={clearFilters} size="sm">
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setViewingCampaign(campaign); setIsDetailOpen(true); }}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5" />
                    {campaign.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant={getStatusBadge(campaign.status)}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </Badge>
                    <Badge variant="outline">
                      {campaign.theme.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Badge>
                  </div>
                  <CardDescription className="mt-2 line-clamp-2">
                    {campaign.description}
                  </CardDescription>
                </div>
                <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(campaign)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(campaign.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}

        {filteredCampaigns.length === 0 && (searchTerm || statusFilter !== "all" || themeFilter !== "all") && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No campaigns found matching your criteria</p>
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="mt-2"
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        )}

        {campaigns.length === 0 && !(searchTerm || statusFilter !== "all" || themeFilter !== "all") && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No campaigns found</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detail View Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              {viewingCampaign?.title}
            </DialogTitle>
          </DialogHeader>
          
          {viewingCampaign && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Badge variant={getStatusBadge(viewingCampaign.status)}>
                  {viewingCampaign.status.charAt(0).toUpperCase() + viewingCampaign.status.slice(1)}
                </Badge>
                <Badge variant="outline">
                  {viewingCampaign.theme.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Badge>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-muted-foreground">{viewingCampaign.description}</p>
                {viewingCampaign.description_ar && (
                  <p className="text-muted-foreground mt-2" dir="rtl">{viewingCampaign.description_ar}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Start: {new Date(viewingCampaign.start_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>End: {new Date(viewingCampaign.end_date).toLocaleDateString()}</span>
                    </div>
                    {viewingCampaign.registration_deadline && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Registration: {new Date(viewingCampaign.registration_deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Targets</h4>
                  <div className="space-y-2 text-sm">
                    {viewingCampaign.target_participants && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Participants: {viewingCampaign.target_participants}</span>
                      </div>
                    )}
                    {viewingCampaign.target_ideas && (
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        <span>Ideas: {viewingCampaign.target_ideas}</span>
                      </div>
                    )}
                    {viewingCampaign.budget && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>Budget: {viewingCampaign.budget.toLocaleString()} SAR</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-2 text-sm">Organization</h5>
                  <div className="space-y-2 text-sm">
                    {viewingCampaign.challenge && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Challenge:</span>
                        <span className="text-muted-foreground">
                          {viewingCampaign.challenge.title}
                        </span>
                      </div>
                    )}
                    {viewingCampaign.sector && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Sector:</span>
                        <span className="text-muted-foreground">
                          {viewingCampaign.sector.name}
                        </span>
                      </div>
                    )}
                    {viewingCampaign.deputy && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Deputy:</span>
                        <span className="text-muted-foreground">
                          {viewingCampaign.deputy.name}
                        </span>
                      </div>
                    )}
                    {viewingCampaign.department && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Department:</span>
                        <span className="text-muted-foreground">
                          {viewingCampaign.department.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium mb-2 text-sm">Stakeholders & Partners</h5>
                  <div className="space-y-2 text-sm">
                    {viewingCampaign.stakeholders && viewingCampaign.stakeholders.length > 0 && (
                      <div>
                        <span className="font-medium">Target Stakeholders:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {viewingCampaign.stakeholders.map((stakeholder, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {stakeholder.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {viewingCampaign.partners && viewingCampaign.partners.length > 0 && (
                      <div>
                        <span className="font-medium">Partner Organizations:</span>
                        <div className="space-y-1 mt-1">
                          {viewingCampaign.partners.map((partner, index) => (
                            <div key={index} className="text-muted-foreground">
                              {partner.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {viewingCampaign.success_metrics && (
                <div>
                  <h4 className="font-medium mb-2">Success Metrics</h4>
                  <p className="text-muted-foreground">{viewingCampaign.success_metrics}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
