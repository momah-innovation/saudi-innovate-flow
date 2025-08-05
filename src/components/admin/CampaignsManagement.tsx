import { useState, useEffect } from 'react';
import { ViewLayouts } from '@/components/ui/view-layouts';
import { ManagementCard } from '@/components/ui/management-card';
import { useTranslation } from '@/hooks/useAppTranslation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CampaignWizard } from './CampaignWizard';
import { supabase } from '@/integrations/supabase/client';
import { 
  Calendar, 
  Users, 
  Target, 
  DollarSign
} from 'lucide-react';

interface Campaign {
  id: string;
  title_ar: string;
  description_ar?: string;
  status: 'planning' | 'active' | 'paused' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  start_date: string;
  end_date: string;
  target_participants?: number;
  target_ideas?: number;
  budget?: number;
  registered_participants?: number;
  submitted_ideas?: number;
  sector?: string;
  created_at: string;
  updated_at: string;
  // Additional fields from database
  campaign_manager_id?: string;
  challenge_id?: string;
  department_id?: string;
  deputy_id?: string;
  registration_deadline?: string;
  sector_id?: string;
  success_metrics?: string;
  theme?: string;
}

const statusConfig = {
  planning: { labelKey: 'status_planning', variant: 'secondary' as const },
  active: { labelKey: 'status_active', variant: 'default' as const },
  paused: { labelKey: 'status_paused', variant: 'destructive' as const },
  completed: { labelKey: 'status_completed', variant: 'outline' as const }
};

const priorityConfig = {
  low: { labelKey: 'priority_low', variant: 'secondary' as const },
  medium: { labelKey: 'priority_medium', variant: 'default' as const },
  high: { labelKey: 'priority_high', variant: 'destructive' as const }
};

interface CampaignsManagementProps {
  viewMode: 'cards' | 'list' | 'grid';
  searchTerm: string;
  showAddDialog: boolean;
  onAddDialogChange: (open: boolean) => void;
}

export function CampaignsManagement({ viewMode, searchTerm, showAddDialog, onAddDialogChange }: CampaignsManagementProps) {
  const { t } = useTranslation();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns((data as Campaign[]) || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    onAddDialogChange(true);
  };

  const handleView = (campaign: Campaign) => {
    // TODO: Implement campaign view functionality
  };

  const handleDelete = (campaign: Campaign) => {
    // TODO: Implement campaign deletion
  };

  return (
    <>
      <ViewLayouts viewMode={viewMode}>
        {campaigns.map((campaign) => (
          <ManagementCard
            key={campaign.id}
            id={campaign.id}
            title={campaign.title_ar}
            subtitle={campaign.description_ar}
            badges={[
              {
                label: t(statusConfig[campaign.status as keyof typeof statusConfig]?.labelKey) || t(campaign.status),
                variant: statusConfig[campaign.status as keyof typeof statusConfig]?.variant || 'secondary'
              },
              ...(campaign.sector ? [{
                label: campaign.sector,
                variant: 'secondary' as const
              }] : []),
              ...(campaign.priority ? [{
                label: t(priorityConfig[campaign.priority as keyof typeof priorityConfig]?.labelKey) || t(campaign.priority),
                variant: priorityConfig[campaign.priority as keyof typeof priorityConfig]?.variant || 'secondary'
              }] : [])
            ]}
            metadata={[
              {
                icon: <Calendar className="w-4 h-4" />,
                label: t('start_date'),
                value: new Date(campaign.start_date).toLocaleDateString('ar-SA')
              },
              ...(campaign.target_participants ? [{
                icon: <Users className="w-4 h-4" />,
                label: t('participants'),
                value: `${campaign.registered_participants || 0}/${campaign.target_participants}`
              }] : []),
              ...(campaign.target_ideas ? [{
                icon: <Target className="w-4 h-4" />,
                label: t('ideas'),
                value: `${campaign.submitted_ideas || 0}/${campaign.target_ideas}`
              }] : []),
              ...(campaign.budget ? [{
                icon: <DollarSign className="w-4 h-4" />,
                label: t('budget'),
                value: `${campaign.budget.toLocaleString()} ${t('currency_sar')}`
              }] : [])
            ]}
            actions={[
              {
                type: 'view' as const,
                label: t('view'),
                onClick: () => handleView(campaign)
              },
              {
                type: 'edit' as const,
                label: t('edit'),
                onClick: () => handleEdit(campaign)
              },
              {
                type: 'delete' as const,
                label: t('delete'),
                onClick: () => handleDelete(campaign)
              }
            ]}
            viewMode={viewMode}
          />
        ))}
      </ViewLayouts>

      <CampaignWizard
        open={showAddDialog}
        onOpenChange={onAddDialogChange}
        onSuccess={() => onAddDialogChange(false)}
      />
    </>
  );
}