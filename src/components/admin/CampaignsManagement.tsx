import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Edit, Trash2, Calendar, Users, Target, Megaphone, Search, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  updateCampaignPartners,
  updateCampaignStakeholders
} from "@/lib/relationshipHelpers";

interface Campaign {
  id: string;
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  status: string;
  theme?: string;
  start_date: string;
  end_date: string;
  registration_deadline?: string;
  target_participants?: number;
  target_ideas?: number;
  budget?: number;
  campaign_manager_id?: string;
  success_metrics?: string;
  challenge_id?: string;
  sector_id?: string;
  deputy_id?: string;
  department_id?: string;
  created_at: string;
  updated_at: string;
  // Relationship data
  partners?: Array<{ id: string; name: string; }>;
  stakeholders?: Array<{ id: string; name: string; }>;
  challenge?: { id: string; title: string; };
  sector?: { id: string; name: string; };
  department?: { id: string; name: string; };
  deputy?: { id: string; name: string; };
}

export function CampaignsManagement() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Relationship data
  const [challenges, setChallenges] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [deputies, setDeputies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [partners, setPartners] = useState([]);
  const [stakeholders, setStakeholders] = useState([]);
  
  // Detail view states
  const [viewingCampaign, setViewingCampaign] = useState<Campaign | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [themeFilter, setThemeFilter] = useState("all");
  const { toast } = useToast();

  // Hardcoded options for now
  const statusOptions = ["planning", "active", "completed", "cancelled", "on_hold"];
  const themeOptions = ["innovation", "sustainability", "digital_transformation", "healthcare", "education", "smart_cities"];

  const [formData, setFormData] = useState({
    title: "",
    title_ar: "",
    description: "",
    description_ar: "",
    status: "planning",
    theme: "",
    start_date: "",
    end_date: "",
    registration_deadline: "",
    target_participants: "",
    target_ideas: "",
    budget: "",
    success_metrics: "",
    challenge_id: "",
    sector_id: "",
    deputy_id: "",
    department_id: "",
    target_stakeholder_groups: [] as string[],
    partner_organizations: [] as string[],
  });

  useEffect(() => {
    fetchCampaigns();
    fetchRelationshipData();
  }, []);

  const fetchRelationshipData = async () => {
    try {
      const [challengesRes, sectorsRes, deputiesRes, departmentsRes, partnersRes, stakeholdersRes] = await Promise.all([
        supabase.from("challenges").select("id, title").order("title"),
        supabase.from("sectors").select("id, name").order("name"),
        supabase.from("deputies").select("id, name").order("name"),
        supabase.from("departments").select("id, name").order("name"),
        supabase.from("partners").select("id, name").order("name"),
        supabase.from("stakeholders").select("id, name").order("name"),
      ]);

      setChallenges(challengesRes.data || []);
      setSectors(sectorsRes.data || []);
      setDeputies(deputiesRes.data || []);
      setDepartments(departmentsRes.data || []);
      setPartners(partnersRes.data || []);
      setStakeholders(stakeholdersRes.data || []);
    } catch (error) {
      console.error("Error fetching relationship data:", error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      
      // Fetch campaigns with relationships using proper JOINs
      const { data, error } = await supabase
        .from("campaigns")
        .select(`
          *,
          challenge:challenges!fk_campaigns_challenge_id(id, title),
          sector:sectors!fk_campaigns_sector_id(id, name),
          department:departments!fk_campaigns_department_id(id, name),
          deputy:deputies!fk_campaigns_deputy_id(id, name),
          partners:campaign_partner_links(
            partner:partners(id, name)
          ),
          stakeholders:campaign_stakeholder_links(
            stakeholder:stakeholders(id, name)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Transform the data to flatten relationships
      const transformedData = data?.map(campaign => ({
        ...campaign,
        partners: campaign.partners?.map((p: any) => p.partner).filter(Boolean) || [],
        stakeholders: campaign.stakeholders?.map((s: any) => s.stakeholder).filter(Boolean) || [],
        challenge: campaign.challenge || undefined,
        sector: campaign.sector || undefined,
        department: campaign.department || undefined,
        deputy: campaign.deputy || undefined
      })) || [];
      
      setCampaigns(transformedData);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const campaignData = {
        title: formData.title,
        title_ar: formData.title_ar || null,
        description: formData.description,
        description_ar: formData.description_ar || null,
        status: formData.status,
        theme: formData.theme || null,
        start_date: formData.start_date,
        end_date: formData.end_date,
        registration_deadline: formData.registration_deadline || null,
        target_participants: formData.target_participants ? parseInt(formData.target_participants) : null,
        target_ideas: formData.target_ideas ? parseInt(formData.target_ideas) : null,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        success_metrics: formData.success_metrics || null,
        challenge_id: formData.challenge_id || null,
        sector_id: formData.sector_id || null,
        deputy_id: formData.deputy_id || null,
        department_id: formData.department_id || null,
      };

      let campaignId: string;

      if (editingCampaign) {
        const { error } = await supabase
          .from("campaigns")
          .update(campaignData)
          .eq("id", editingCampaign.id);

        if (error) throw error;
        campaignId = editingCampaign.id;

        toast({
          title: "Success",
          description: "Campaign updated successfully",
        });
      } else {
        const { data, error } = await supabase
          .from("campaigns")
          .insert([campaignData])
          .select()
          .single();

        if (error) throw error;
        campaignId = data.id;

        toast({
          title: "Success",
          description: "Campaign created successfully",
        });
      }

      // Update junction table relationships
      await updateCampaignPartners(campaignId, formData.partner_organizations);
      await updateCampaignStakeholders(campaignId, formData.target_stakeholder_groups);

      setIsDialogOpen(false);
      setEditingCampaign(null);
      resetForm();
      fetchCampaigns();
    } catch (error) {
      console.error("Error saving campaign:", error);
      toast({
        title: "Error",
        description: "Failed to save campaign",
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
      theme: campaign.theme || "",
      start_date: campaign.start_date,
      end_date: campaign.end_date,
      registration_deadline: campaign.registration_deadline || "",
      target_participants: campaign.target_participants?.toString() || "",
      target_ideas: campaign.target_ideas?.toString() || "",
      budget: campaign.budget?.toString() || "",
      success_metrics: campaign.success_metrics || "",
      challenge_id: campaign.challenge_id || "",
      sector_id: campaign.sector_id || "",
      deputy_id: campaign.deputy_id || "",
      department_id: campaign.department_id || "",
      target_stakeholder_groups: campaign.stakeholders?.map(s => s.id) || [],
      partner_organizations: campaign.partners?.map(p => p.id) || [],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;

    try {
      const { error } = await supabase
        .from("campaigns")
        .delete()
        .eq("id", id);

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

  const resetForm = () => {
    setFormData({
      title: "",
      title_ar: "",
      description: "",
      description_ar: "",
      status: "planning",
      theme: "",
      start_date: "",
      end_date: "",
      registration_deadline: "",
      target_participants: "",
      target_ideas: "",
      budget: "",
      success_metrics: "",
      challenge_id: "",
      sector_id: "",
      deputy_id: "",
      department_id: "",
      target_stakeholder_groups: [],
      partner_organizations: [],
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700";
      case "completed": return "bg-blue-100 text-blue-700";
      case "cancelled": return "bg-red-100 text-red-700";
      case "on_hold": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "completed": return "secondary";
      case "cancelled": return "destructive";
      case "on_hold": return "outline";
      default: return "outline";
    }
  };

  // Filter campaigns based on search and filters
  const filteredCampaigns = campaigns.filter((campaign) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      campaign.title.toLowerCase().includes(searchLower) ||
      (campaign.description && campaign.description.toLowerCase().includes(searchLower)) ||
      (campaign.title_ar && campaign.title_ar.toLowerCase().includes(searchLower));
    
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    const matchesTheme = themeFilter === "all" || campaign.theme === themeFilter;
    
    return matchesSearch && matchesStatus && matchesTheme;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setThemeFilter("all");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading campaigns...</p>
        </div>
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
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingCampaign(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCampaign ? "Edit Campaign" : "Add New Campaign"}</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title (English)*</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title_ar">Title (Arabic)</Label>
                  <Input
                    id="title_ar"
                    value={formData.title_ar}
                    onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
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
                  <Label htmlFor="theme">Theme</Label>
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

              <div className="space-y-2">
                <Label htmlFor="description">Description (English)*</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description_ar">Description (Arabic)</Label>
                <Textarea
                  id="description_ar"
                  value={formData.description_ar}
                  onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date*</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date*</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target_ideas">Target Ideas</Label>
                  <Input
                    id="target_ideas"
                    type="number"
                    value={formData.target_ideas}
                    onChange={(e) => setFormData({ ...formData, target_ideas: e.target.value })}
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
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="success_metrics">Success Metrics</Label>
                <Textarea
                  id="success_metrics"
                  value={formData.success_metrics}
                  onChange={(e) => setFormData({ ...formData, success_metrics: e.target.value })}
                  rows={2}
                />
              </div>

              {/* Relationship Fields */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Relationships</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="challenge_id">Related Challenge</Label>
                    <Select value={formData.challenge_id} onValueChange={(value) => setFormData({ ...formData, challenge_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select challenge" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {challenges.map((challenge: any) => (
                          <SelectItem key={challenge.id} value={challenge.id}>
                            {challenge.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sector_id">Sector</Label>
                    <Select value={formData.sector_id} onValueChange={(value) => setFormData({ ...formData, sector_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sector" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {sectors.map((sector: any) => (
                          <SelectItem key={sector.id} value={sector.id}>
                            {sector.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="deputy_id">Deputy</Label>
                    <Select value={formData.deputy_id} onValueChange={(value) => setFormData({ ...formData, deputy_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select deputy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {deputies.map((deputy: any) => (
                          <SelectItem key={deputy.id} value={deputy.id}>
                            {deputy.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="department_id">Department</Label>
                    <Select value={formData.department_id} onValueChange={(value) => setFormData({ ...formData, department_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {departments.map((department: any) => (
                          <SelectItem key={department.id} value={department.id}>
                            {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCampaign ? "Update" : "Create"} Campaign
                </Button>
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
            <DialogDescription>Campaign Details</DialogDescription>
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
                        <span>Registration Deadline: {new Date(viewingCampaign.registration_deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Targets & Budget</h4>
                  <div className="space-y-2 text-sm">
                    {viewingCampaign.target_participants && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Target Participants: {viewingCampaign.target_participants}</span>
                      </div>
                    )}
                    {viewingCampaign.target_ideas && (
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        <span>Target Ideas: {viewingCampaign.target_ideas}</span>
                      </div>
                    )}
                    {viewingCampaign.budget && (
                      <div className="flex items-center gap-2">
                        <span>Budget: ${viewingCampaign.budget.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Relationships Section */}
              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Relationships</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium mb-2 text-sm">Organizational Context</h5>
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