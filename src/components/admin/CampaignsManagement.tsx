import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ViewLayouts } from "@/components/ui/view-layouts";
import { DataCard } from "@/components/ui/data-card";
import { MultiStepForm } from "@/components/ui/multi-step-form";
import { useTranslation } from "@/hooks/useTranslation";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Calendar,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronsUpDown,
  Check,
  Archive,
  Download
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

interface CampaignsManagementProps {
  viewMode?: 'cards' | 'list' | 'grid';
  searchTerm?: string;
  showAddDialog?: boolean;
  onAddDialogChange?: (open: boolean) => void;
}

export function CampaignsManagement({ 
  viewMode = 'cards', 
  searchTerm: externalSearchTerm = '',
  showAddDialog = false,
  onAddDialogChange
}: CampaignsManagementProps = {}) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState(externalSearchTerm);
  
  // Update internal search term when external prop changes
  useEffect(() => {
    setSearchTerm(externalSearchTerm);
  }, [externalSearchTerm]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [themeFilter, setThemeFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState(false);
  
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  
  const { toast } = useToast();
  const { t, getDynamicText, getStatusText, getThemeText } = useTranslation();
  
  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const [stepErrors, setStepErrors] = useState<{[key: number]: string[]}>({});
  
  // Organization search states
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


  useEffect(() => {
    fetchCampaigns();
    fetchRelatedData();
  }, []);

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
        title: t('error'),
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

  const getFilteredCampaigns = () => {
    return campaigns.filter(campaign => {
      const matchesSearch = !searchTerm || 
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.title_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.theme?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.success_metrics?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || !statusFilter || campaign.status === statusFilter;
      const matchesTheme = themeFilter === 'all' || !themeFilter || campaign.theme === themeFilter;
      
      return matchesSearch && matchesStatus && matchesTheme;
    });
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
    
    onAddDialogChange?.(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: t('success'),
        description: "Campaign deleted successfully",
      });

      fetchCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        title: t('error'),
        description: "Failed to delete campaign",
        variant: "destructive",
      });
    }
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

  // Selection handlers
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedItems(getFilteredCampaigns().map(campaign => campaign.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  // Bulk actions - More specific to campaigns
  const bulkActions = [
    {
      id: 'archive',
      label: t('archiveCampaigns'),
      icon: <Archive className="w-4 h-4" />,
      onClick: (ids: string[]) => {
        console.log('Archive campaigns:', ids);
        // Handle bulk archive
      },
      variant: 'outline'
    },
    {
      id: 'export',
      label: t('exportCampaigns'),
      icon: <Download className="w-4 h-4" />,
      onClick: (ids: string[]) => {
        console.log('Export campaigns:', ids);
        // Handle bulk export
      },
      variant: 'outline'
    },
    {
      id: 'delete',
      label: t('deleteCampaigns'),
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (ids: string[]) => {
        if (confirm(`Delete ${ids.length} selected campaigns?`)) {
          ids.forEach(id => handleDelete(id));
          setSelectedItems([]);
        }
      },
      variant: 'destructive'
    }
  ];

  // Filter options
  const statusOptions = [
    { label: t('filterByStatus'), value: 'all' },
    { label: getStatusText('planning'), value: 'planning' },
    { label: getStatusText('active'), value: 'active' },
    { label: getStatusText('completed'), value: 'completed' },
    { label: getStatusText('archived'), value: 'archived' }
  ];

  const themeOptions = [
    { label: t('filterByTheme'), value: 'all' },
    { label: getThemeText('digital_transformation'), value: 'digital_transformation' },
    { label: getThemeText('sustainability'), value: 'sustainability' },
    { label: getThemeText('smart_cities'), value: 'smart_cities' },
    { label: getThemeText('healthcare'), value: 'healthcare' }
  ];

  const filteredCampaigns = getFilteredCampaigns();

  const renderCampaigns = () => {
    return filteredCampaigns.map((campaign) => (
      <DataCard
        key={campaign.id}
        item={campaign}
        title={getDynamicText(campaign.title_ar || campaign.title, campaign.title)}
        description={getDynamicText(campaign.description_ar || campaign.description || '', campaign.description)}
        selected={bulkMode ? selectedItems.includes(campaign.id) : false}
        onSelect={bulkMode ? (selected) => handleSelectItem(campaign.id, selected) : undefined}
        badges={[
          { 
            label: getStatusText(campaign.status),
            variant: 'outline'
          }
        ]}
        metadata={[
          {
            icon: <Calendar className="w-4 h-4" />,
            label: t('period'),
            value: `${campaign.start_date} - ${campaign.end_date}`
          },
          ...(campaign.target_participants ? [{
            icon: <Target className="w-4 h-4" />,
            label: t('target'),
            value: `${campaign.target_participants} ${t('participants')}`
          }] : []),
          ...(campaign.budget ? [{
            icon: <span>💰</span>,
            label: t('budget'),
            value: `$${campaign.budget.toLocaleString()}`
          }] : [])
        ]}
        actions={
          <div className="flex items-center gap-1">
            <Button 
              variant="action-edit" 
              size="action-icon" 
              onClick={() => handleEdit(campaign)}
              title={t('edit')}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="action-delete" 
                  size="action-icon"
                  title={t('delete')}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('delete')} {t('campaign')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{getDynamicText(campaign.title_ar || campaign.title, campaign.title)}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(campaign.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {t('delete')} {t('campaign')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        }
      />
    ));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setThemeFilter('all');
  };

  const hasActiveFilters = searchTerm.length > 0 || (statusFilter !== 'all' && statusFilter.length > 0) || (themeFilter !== 'all' && themeFilter.length > 0);

  // Wizard Steps Configuration
  const createWizardSteps = () => [
    {
      id: 'basic-info',
      title: t('basicInformation'),
      description: t('campaignBasicInfoDesc'),
      content: (
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t('title')} (EN)</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter campaign title in English"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title_ar">{t('title')} (AR)</Label>
              <Input
                id="title_ar"
                value={formData.title_ar}
                onChange={(e) => setFormData(prev => ({ ...prev, title_ar: e.target.value }))}
                placeholder="أدخل عنوان الحملة بالعربية"
                dir="rtl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description">{t('description')} (EN)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter campaign description in English"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description_ar">{t('description')} (AR)</Label>
              <Textarea
                id="description_ar"
                value={formData.description_ar}
                onChange={(e) => setFormData(prev => ({ ...prev, description_ar: e.target.value }))}
                placeholder="أدخل وصف الحملة بالعربية"
                dir="rtl"
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">{t('status')}</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">{getStatusText('planning')}</SelectItem>
                  <SelectItem value="active">{getStatusText('active')}</SelectItem>
                  <SelectItem value="completed">{getStatusText('completed')}</SelectItem>
                  <SelectItem value="archived">{getStatusText('archived')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme">{t('theme')}</Label>
              <Select
                value={formData.theme}
                onValueChange={(value) => setFormData(prev => ({ ...prev, theme: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="digital_transformation">{getThemeText('digital_transformation')}</SelectItem>
                  <SelectItem value="sustainability">{getThemeText('sustainability')}</SelectItem>
                  <SelectItem value="smart_cities">{getThemeText('smart_cities')}</SelectItem>
                  <SelectItem value="healthcare">{getThemeText('healthcare')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ),
      validation: () => {
        return formData.title.length > 0 && formData.title_ar.length > 0;
      }
    },
    {
      id: 'timeline-targets',
      title: t('timelineAndTargets'),
      description: t('campaignTimelineTargetsDesc'),
      content: (
        <div className="space-y-6">
          {/* Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">{t('startDate')}</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">{t('endDate')}</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registration_deadline">{t('registrationDeadline')}</Label>
              <Input
                id="registration_deadline"
                type="date"
                value={formData.registration_deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, registration_deadline: e.target.value }))}
              />
            </div>
          </div>

          {/* Targets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target_participants">{t('targetParticipants')}</Label>
              <Input
                id="target_participants"
                type="number"
                value={formData.target_participants}
                onChange={(e) => setFormData(prev => ({ ...prev, target_participants: e.target.value }))}
                placeholder="Enter target number of participants"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_ideas">{t('targetIdeas')}</Label>
              <Input
                id="target_ideas"
                type="number"
                value={formData.target_ideas}
                onChange={(e) => setFormData(prev => ({ ...prev, target_ideas: e.target.value }))}
                placeholder="Enter target number of ideas"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">{t('budget')}</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                placeholder="Enter campaign budget"
              />
            </div>
          </div>

          {/* Success Metrics */}
          <div className="space-y-2">
            <Label htmlFor="success_metrics">{t('successMetrics')}</Label>
            <Textarea
              id="success_metrics"
              value={formData.success_metrics}
              onChange={(e) => setFormData(prev => ({ ...prev, success_metrics: e.target.value }))}
              placeholder="Define success metrics and KPIs"
              rows={3}
            />
          </div>
        </div>
      ),
      validation: () => {
        return formData.start_date.length > 0 && formData.end_date.length > 0;
      }
    },
    {
      id: 'organization',
      title: t('organizationalAlignment'),
      description: t('campaignOrgAlignmentDesc'),
      content: (
        <div className="space-y-6">
          {/* Campaign Manager */}
          <div className="space-y-2">
            <Label>{t('campaignManager')}</Label>
            <Popover open={openCampaignManager} onOpenChange={setOpenCampaignManager}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between">
                  {formData.campaign_manager_id 
                    ? campaignManagers.find(m => m.id === formData.campaign_manager_id)?.name || "Select manager"
                    : "Select campaign manager"
                  }
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput 
                    placeholder="Search managers..." 
                    value={campaignManagerSearch}
                    onValueChange={setCampaignManagerSearch}
                  />
                  <CommandEmpty>No manager found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {campaignManagers
                        .filter(manager => 
                          manager.name.toLowerCase().includes(campaignManagerSearch.toLowerCase()) ||
                          manager.email.toLowerCase().includes(campaignManagerSearch.toLowerCase())
                        )
                        .map(manager => (
                          <CommandItem
                            key={manager.id}
                            value={manager.id}
                            onSelect={() => {
                              setFormData(prev => ({ ...prev, campaign_manager_id: manager.id }));
                              setOpenCampaignManager(false);
                            }}
                          >
                            <Check className={`mr-2 h-4 w-4 ${formData.campaign_manager_id === manager.id ? "opacity-100" : "opacity-0"}`} />
                            <div>
                              <div className="font-medium">{manager.name}</div>
                              <div className="text-sm text-muted-foreground">{manager.email} • {manager.position}</div>
                            </div>
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Organizational Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('sector')}</Label>
              <Popover open={openSector} onOpenChange={setOpenSector}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between">
                    {formData.sector_id 
                      ? sectors.find(s => s.id === formData.sector_id)?.name || "Select sector"
                      : "Select sector"
                    }
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search sectors..." />
                    <CommandEmpty>No sector found.</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {sectors.map(sector => (
                          <CommandItem
                            key={sector.id}
                            value={sector.id}
                            onSelect={() => {
                              setFormData(prev => ({ ...prev, sector_id: sector.id }));
                              setOpenSector(false);
                            }}
                          >
                            <Check className={`mr-2 h-4 w-4 ${formData.sector_id === sector.id ? "opacity-100" : "opacity-0"}`} />
                            {getDynamicText(sector.name_ar, sector.name)}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>{t('deputy')}</Label>
              <Popover open={openDeputy} onOpenChange={setOpenDeputy}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between">
                    {formData.deputy_id 
                      ? deputies.find(d => d.id === formData.deputy_id)?.name || "Select deputy"
                      : "Select deputy"
                    }
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search deputies..." />
                    <CommandEmpty>No deputy found.</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {deputies.map(deputy => (
                          <CommandItem
                            key={deputy.id}
                            value={deputy.id}
                            onSelect={() => {
                              setFormData(prev => ({ ...prev, deputy_id: deputy.id }));
                              setOpenDeputy(false);
                            }}
                          >
                            <Check className={`mr-2 h-4 w-4 ${formData.deputy_id === deputy.id ? "opacity-100" : "opacity-0"}`} />
                            {getDynamicText(deputy.name_ar, deputy.name)}
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
      ),
      validation: () => {
        return formData.campaign_manager_id.length > 0;
      }
    }
  ];

  const handleWizardComplete = async () => {
    try {
      // TODO: Implement save functionality
      console.log('Save campaign:', formData);
      
      toast({
        title: t('success'),
        description: editingCampaign ? t('campaignUpdated') : t('campaignCreated'),
      });
      
      onAddDialogChange?.(false);
      resetForm();
      fetchCampaigns();
    } catch (error) {
      console.error('Error saving campaign:', error);
      toast({
        title: t('error'),
        description: "Failed to save campaign",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Content only - header is handled by PageLayout */}
      <ViewLayouts viewMode={viewMode}>
        {renderCampaigns()}
      </ViewLayouts>

      {/* Campaign Form Wizard */}
      <MultiStepForm
        isOpen={showAddDialog}
        onClose={() => {
          onAddDialogChange?.(false);
          resetForm();
          setEditingCampaign(null);
        }}
        title={editingCampaign ? t('editCampaign') : t('createCampaign')}
        steps={createWizardSteps()}
        onComplete={handleWizardComplete}
        showProgress={true}
        allowSkip={false}
      />
    </>
  );
}