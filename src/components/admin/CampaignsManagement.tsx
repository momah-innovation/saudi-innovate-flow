import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useUrlHighlight } from "@/hooks/useUrlHighlight";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ViewLayouts } from "@/components/ui/view-layouts";
import { ManagementCard } from "@/components/ui/management-card";
import { CampaignWizard } from "./CampaignWizard";
import { 
  Edit, 
  Trash2, 
  Users, 
  Calendar,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  Archive,
  Download,
  DollarSign
} from "lucide-react";

interface Campaign {
  id: string;
  title_ar: string;
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
  sector_id?: string;
  deputy_id?: string;
  department_id?: string;
  challenge_id?: string;
  created_at?: string;
  // Additional arrays for wizard compatibility
  sector_ids?: string[];
  deputy_ids?: string[];
  department_ids?: string[];
  challenge_ids?: string[];
  partner_ids?: string[];
  stakeholder_ids?: string[];
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
  const { highlightId } = useUrlHighlight();
  const [statusFilter, setStatusFilter] = useState("all");
  const [themeFilter, setThemeFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const { toast } = useToast();

  // Update internal search term when external prop changes
  useEffect(() => {
    setSearchTerm(externalSearchTerm);
  }, [externalSearchTerm]);

  useEffect(() => {
    fetchCampaigns();
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
      console.error('خطأ في جلب الحملات:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل الحملات",
        variant: "destructive",
      });
    }
  };

  const getFilteredCampaigns = () => {
    return campaigns.filter(campaign => {
      const matchesSearch = !searchTerm || 
        campaign.title_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.theme?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.success_metrics?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || !statusFilter || campaign.status === statusFilter;
      const matchesTheme = themeFilter === 'all' || !themeFilter || campaign.theme === themeFilter;
      
      return matchesSearch && matchesStatus && matchesTheme;
    });
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    onAddDialogChange?.(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // Delete related links first
      await Promise.all([
        supabase.from('campaign_sector_links').delete().eq('campaign_id', id),
        supabase.from('campaign_deputy_links').delete().eq('campaign_id', id),
        supabase.from('campaign_department_links').delete().eq('campaign_id', id),
        supabase.from('campaign_challenge_links').delete().eq('campaign_id', id),
        supabase.from('campaign_partner_links').delete().eq('campaign_id', id),
        supabase.from('campaign_stakeholder_links').delete().eq('campaign_id', id)
      ]);

      // Delete the campaign
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "نجح الحذف",
        description: "تم حذف الحملة بنجاح",
      });

      fetchCampaigns();
    } catch (error) {
      console.error('خطأ في حذف الحملة:', error);
      toast({
        title: "خطأ في الحذف",
        description: "فشل في حذف الحملة",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'planning': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'archived': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشطة';
      case 'planning': return 'تخطيط';
      case 'completed': return 'مكتملة';
      case 'cancelled': return 'ملغية';
      case 'archived': return 'مؤرشفة';
      default: return status;
    }
  };

  const getThemeText = (theme: string) => {
    switch (theme) {
      case 'digital_transformation': return 'التحول الرقمي';
      case 'sustainability': return 'الاستدامة';
      case 'smart_cities': return 'المدن الذكية';
      case 'healthcare': return 'الرعاية الصحية';
      case 'education': return 'التعليم';
      case 'fintech': return 'التكنولوجيا المالية';
      case 'energy': return 'الطاقة';
      case 'transportation': return 'النقل';
      default: return theme;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'planning': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      case 'archived': return <Archive className="w-4 h-4" />;
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

  // Bulk actions
  const bulkActions = [
    {
      id: 'archive',
      label: 'أرشفة الحملات',
      icon: <Archive className="w-4 h-4" />,
      onClick: (ids: string[]) => {
        console.log('أرشفة الحملات:', ids);
        // Handle bulk archive
      },
      variant: 'outline'
    },
    {
      id: 'export',
      label: 'تصدير الحملات',
      icon: <Download className="w-4 h-4" />,
      onClick: (ids: string[]) => {
        console.log('تصدير الحملات:', ids);
        // Handle bulk export
      },
      variant: 'outline'
    },
    {
      id: 'delete',
      label: 'حذف الحملات',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (ids: string[]) => {
        if (confirm(`هل تريد حذف ${ids.length} حملة محددة؟`)) {
          ids.forEach(id => handleDelete(id));
          setSelectedItems([]);
        }
      },
      variant: 'destructive'
    }
  ];

  const filteredCampaigns = getFilteredCampaigns();

  const renderCampaigns = () => {
    return filteredCampaigns.map((campaign) => (
      <ManagementCard
        key={campaign.id}
        id={campaign.id}
        title={campaign.title_ar}
        description={campaign.description_ar}
        viewMode={viewMode}
        className={highlightId === campaign.id ? "ring-2 ring-primary animate-pulse" : ""}
        badges={[
          { 
            label: getStatusText(campaign.status),
            variant: 'outline' as const
          },
          ...(campaign.theme ? [{ 
            label: getThemeText(campaign.theme),
            variant: 'secondary' as const
          }] : [])
        ]}
        metadata={[
          {
            icon: <Calendar className="w-4 h-4" />,
            label: "الفترة",
            value: `${campaign.start_date} - ${campaign.end_date}`
          },
          ...(campaign.target_participants ? [{
            icon: <Target className="w-4 h-4" />,
            label: "الهدف",
            value: `${campaign.target_participants} مشارك`
          }] : []),
          ...(campaign.budget ? [{
            icon: <DollarSign className="w-4 h-4" />,
            label: "الميزانية",
            value: `${campaign.budget.toLocaleString()} ر.س`
          }] : [])
        ]}
        actions={[
          {
            type: 'edit',
            label: 'تعديل',
            onClick: () => handleEdit(campaign)
          },
          {
            type: 'delete',
            label: 'حذف',
            onClick: () => {
              if (confirm(`هل أنت متأكد من حذف الحملة "${campaign.title_ar}"؟`)) {
                handleDelete(campaign.id);
              }
            }
          }
        ]}
        onClick={() => handleEdit(campaign)}
      />
    ));
  };

  const handleWizardClose = () => {
    setEditingCampaign(null);
    onAddDialogChange?.(false);
  };

  const handleWizardSuccess = () => {
    fetchCampaigns();
    setEditingCampaign(null);
  };

  // Convert Campaign to CampaignData for the wizard
  const convertToWizardData = (campaign: Campaign) => ({
    ...campaign,
    description_ar: campaign.description_ar || "",
    theme: campaign.theme || "",
    success_metrics: campaign.success_metrics || "",
    campaign_manager_id: campaign.campaign_manager_id || "",
    sector_id: campaign.sector_id || "",
    deputy_id: campaign.deputy_id || "",
    department_id: campaign.department_id || "",
    challenge_id: campaign.challenge_id || "",
    registration_deadline: campaign.registration_deadline || "",
    target_participants: campaign.target_participants || null,
    target_ideas: campaign.target_ideas || null,
    budget: campaign.budget || null,
    sector_ids: campaign.sector_ids || [],
    deputy_ids: campaign.deputy_ids || [],
    department_ids: campaign.department_ids || [],
    challenge_ids: campaign.challenge_ids || [],
    partner_ids: campaign.partner_ids || [],
    stakeholder_ids: campaign.stakeholder_ids || []
  });

  return (
    <>
      <div className="space-y-6">
        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">لا توجد حملات</h3>
            <p className="text-muted-foreground">لم يتم العثور على أي حملات. ابدأ بإنشاء حملة جديدة.</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
            viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {renderCampaigns()}
          </div>
        )}
      </div>

      <CampaignWizard
        open={showAddDialog}
        onOpenChange={handleWizardClose}
        editingCampaign={editingCampaign ? convertToWizardData(editingCampaign) : null}
        onSuccess={handleWizardSuccess}
      />
    </>
  );
}