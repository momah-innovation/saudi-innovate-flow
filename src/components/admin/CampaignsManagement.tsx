import { useState, useEffect } from 'react';
import { ViewLayouts } from '@/components/ui/view-layouts';
import { ManagementCard } from '@/components/ui/management-card';
import { useTranslation } from '@/hooks/useTranslation';
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


const statusConfig = {
  planning: { label: 'قيد التخطيط', variant: 'secondary' as const },
  active: { label: 'نشط', variant: 'default' as const },
  paused: { label: 'متوقف', variant: 'destructive' as const },
  completed: { label: 'مكتمل', variant: 'outline' as const }
};

const priorityConfig = {
  low: { label: 'منخفض', variant: 'secondary' as const },
  medium: { label: 'متوسط', variant: 'default' as const },
  high: { label: 'عالي', variant: 'destructive' as const }
};

interface CampaignsManagementProps {
  viewMode: 'cards' | 'list' | 'grid';
  searchTerm: string;
  showAddDialog: boolean;
  onAddDialogChange: (open: boolean) => void;
}

export function CampaignsManagement({ viewMode, searchTerm, showAddDialog, onAddDialogChange }: CampaignsManagementProps) {
  const { language } = useTranslation();
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
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
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error loading campaigns:', error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (campaign: any) => {
    setSelectedCampaign(campaign);
    onAddDialogChange(true);
  };

  const handleView = (campaign: any) => {
    console.log('View campaign:', campaign);
  };

  const handleDelete = (campaign: any) => {
    console.log('Delete campaign:', campaign);
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
                label: statusConfig[campaign.status as keyof typeof statusConfig]?.label,
                variant: statusConfig[campaign.status as keyof typeof statusConfig]?.variant
              },
              {
                label: campaign.sector,
                variant: 'secondary' as const
              },
              {
                label: priorityConfig[campaign.priority as keyof typeof priorityConfig]?.label,
                variant: priorityConfig[campaign.priority as keyof typeof priorityConfig]?.variant
              }
            ]}
            metadata={[
              {
                icon: <Calendar className="w-4 h-4" />,
                label: 'تاريخ البداية',
                value: new Date(campaign.start_date).toLocaleDateString('ar-SA')
              },
              {
                icon: <Users className="w-4 h-4" />,
                label: 'المشاركون',
                value: `${campaign.registered_participants}/${campaign.target_participants}`
              },
              {
                icon: <Target className="w-4 h-4" />,
                label: 'الأفكار',
                value: `${campaign.submitted_ideas}/${campaign.target_ideas}`
              },
              {
                icon: <DollarSign className="w-4 h-4" />,
                label: 'الميزانية',
                value: `${campaign.budget?.toLocaleString()} ريال`
              }
            ]}
            actions={[
              {
                type: 'view' as const,
                label: 'عرض',
                onClick: () => handleView(campaign)
              },
              {
                type: 'edit' as const,
                label: 'تعديل',
                onClick: () => handleEdit(campaign)
              },
              {
                type: 'delete' as const,
                label: 'حذف',
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