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
import { StandardPageLayout, BulkAction } from "@/components/layout/StandardPageLayout";
import { DataCard } from "@/components/ui/data-card";
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

export function CampaignsManagement() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [themeFilter, setThemeFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
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
    
    setShowAddDialog(true);
  };

  const handleDelete = async (id: string) => {
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
  const bulkActions: BulkAction[] = [
    {
      id: 'archive',
      label: t('archiveCampaigns'),
      icon: <Archive className="w-4 h-4" />,
      onClick: (ids) => {
        console.log('Archive campaigns:', ids);
        // Handle bulk archive
      },
      variant: 'outline'
    },
    {
      id: 'export',
      label: t('exportCampaigns'),
      icon: <Download className="w-4 h-4" />,
      onClick: (ids) => {
        console.log('Export campaigns:', ids);
        // Handle bulk export
      },
      variant: 'outline'
    },
    {
      id: 'delete',
      label: t('deleteCampaigns'),
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (ids) => {
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
        title={getDynamicText(campaign.title, campaign.title_ar)}
        description={getDynamicText(campaign.description || '', campaign.description_ar)}
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
            label: 'Period',
            value: `${campaign.start_date} - ${campaign.end_date}`
          },
          ...(campaign.target_participants ? [{
            icon: <Target className="w-4 h-4" />,
            label: 'Target',
            value: `${campaign.target_participants} participants`
          }] : []),
          ...(campaign.budget ? [{
            icon: <span>💰</span>,
            label: 'Budget',
            value: `$${campaign.budget.toLocaleString()}`
          }] : [])
        ]}
        actions={
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => handleEdit(campaign)}>
              <Edit className="w-4 h-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{campaign.title}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(campaign.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Campaign
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

  return (
    <>
      <StandardPageLayout
        title={t('campaignManagement')}
        description={t('campaignManagementDesc')}
        itemCount={filteredCampaigns.length}
        
        // Add button
        addButton={{
          label: t('createCampaign'),
          onClick: () => {
            resetForm();
            setEditingCampaign(null);
            setShowAddDialog(true);
          }
        }}
        
        // Layout options
        supportedLayouts={['cards', 'list', 'grid']}
        defaultLayout="cards"
        
        // Search and filters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            id: 'status',
            label: t('status'),
            type: 'select' as const,
            options: statusOptions,
            placeholder: t('filterByStatus'),
            value: statusFilter,
            onChange: (value: string) => setStatusFilter(value)
          },
          {
            id: 'theme',
            label: t('theme'),
            type: 'select' as const,
            options: themeOptions,
            placeholder: t('filterByTheme'),
            value: themeFilter,
            onChange: (value: string) => setThemeFilter(value)
          }
        ]}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
        // Bulk actions
        selectedItems={selectedItems}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        bulkActions={bulkActions}
        totalItems={filteredCampaigns.length}
        bulkMode={bulkMode}
        onToggleBulkMode={() => {
          setBulkMode(!bulkMode);
          if (bulkMode) {
            setSelectedItems([]); // Clear selections when exiting bulk mode
          }
        }}
        
        // Additional header actions
        headerActions={
          <div className="flex gap-2">
            <Select onValueChange={(value) => {
              console.log('Export type:', value);
              // Handle export based on value (csv, excel, pdf)
            }}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">Export CSV</SelectItem>
                <SelectItem value="excel">Export Excel</SelectItem>
                <SelectItem value="pdf">Export PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {renderCampaigns()}
      </StandardPageLayout>

      {/* Form Dialog - keeping existing implementation */}
      {/* ... existing form dialog code would go here ... */}
    </>
  );
}