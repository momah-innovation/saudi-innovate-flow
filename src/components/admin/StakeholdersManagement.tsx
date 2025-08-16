import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ManagementCard } from '@/components/ui/management-card';
import { ViewLayouts } from '@/components/ui/view-layouts';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useStatusTranslations } from '@/utils/statusMappings';
import { StakeholderWizard } from './StakeholderWizard';
import { 
  User,
  Mail,
  Phone,
  Building,
  Target,
  Activity
} from 'lucide-react';
import { debugLog } from '@/utils/debugLogger';
import { currentTimestamp } from '@/utils/unified-date-handler';

interface StakeholdersManagementProps {
  viewMode: 'cards' | 'list' | 'grid';
  searchTerm: string;
  showAddDialog: boolean;
  onAddDialogChange: (open: boolean) => void;
}

interface StakeholderData {
  id: string;
  name: string;
  organization: string;
  position: string;
  email: string;
  phone: string;
  stakeholder_type: string;
  influence_level: string;
  interest_level: string;
  engagement_status: string;
  notes: string;
  projects_count: number;
  last_interaction: string;
}

export function StakeholdersManagement({ viewMode, searchTerm, showAddDialog, onAddDialogChange }: StakeholdersManagementProps) {
  const { t } = useUnifiedTranslation();
  const { getStatusLabel } = useStatusTranslations();
  const [selectedStakeholder, setSelectedStakeholder] = useState<StakeholderData | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [stakeholderToDelete, setStakeholderToDelete] = useState<StakeholderData | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [stakeholders, setStakeholders] = useState<StakeholderData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStakeholders();
  }, []);

  const fetchStakeholders = async () => {
    try {
      setLoading(true);
      
      // Fetch from stakeholders table when available
      const { data, error } = await supabase
        .from('stakeholders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        debugLog.error('Error fetching stakeholders', { component: 'StakeholdersManagement' }, error);
        setStakeholders([]);
        return;
      }

      // Transform data to match interface
      const transformedStakeholders = (data || []).map(item => ({
        id: item.id,
        name: item.name || 'غير محدد',
        organization: item.organization || 'غير محدد',
        position: item.position || 'غير محدد',
        email: item.email || '',
        phone: item.phone || '',
        stakeholder_type: item.stakeholder_type || 'غير محدد',
        influence_level: item.influence_level || 'متوسط',
        interest_level: item.interest_level || 'متوسط',
        engagement_status: item.engagement_status || 'pending',
        notes: item.notes || '',
        projects_count: 0,
        last_interaction: item.updated_at || currentTimestamp()
      }));

      setStakeholders(transformedStakeholders);
    } catch (error) {
      debugLog.error('Error in fetchStakeholders', { component: 'StakeholdersManagement' }, error);
      setStakeholders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (stakeholder: StakeholderData) => {
    setSelectedStakeholder(stakeholder);
    onAddDialogChange(true);
  };

  const handleView = (stakeholder: StakeholderData) => {
    setSelectedStakeholder(stakeholder);
    setShowViewDialog(true);
  };

  const handleDelete = (stakeholder: StakeholderData) => {
    setStakeholderToDelete(stakeholder);
    setShowDeleteConfirmation(true);
  };

  const filteredStakeholders = stakeholders.filter(stakeholder =>
    !searchTerm || 
    stakeholder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stakeholder.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stakeholder.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <ViewLayouts viewMode={viewMode}>
        {filteredStakeholders.map((stakeholder) => (
          <ManagementCard
            key={stakeholder.id}
            id={stakeholder.id}
            title={stakeholder.name}
            subtitle={`${stakeholder.position} - ${stakeholder.organization}`}
            description={stakeholder.notes}
            viewMode={viewMode}
            badges={[
              {
                label: stakeholder.stakeholder_type,
                variant: 'default' as const
              },
              {
                label: `تأثير ${stakeholder.influence_level}`,
                variant: stakeholder.influence_level === 'عالي' ? 'destructive' as const : 'default' as const
              },
              {
                label: stakeholder.engagement_status === 'active' ? 'نشط' : 
                       stakeholder.engagement_status === 'pending' ? 'معلق' : 'غير نشط',
                variant: stakeholder.engagement_status === 'active' ? 'default' as const :
                         stakeholder.engagement_status === 'pending' ? 'outline' as const : 'secondary' as const
              }
            ]}
            metadata={[
              {
                icon: <Mail className="w-4 h-4" />,
                label: 'البريد الإلكتروني',
                value: stakeholder.email
              },
              {
                icon: <Phone className="w-4 h-4" />,
                label: 'الهاتف',
                value: stakeholder.phone
              },
              {
                icon: <Target className="w-4 h-4" />,
                label: 'مستوى الاهتمام',
                value: stakeholder.interest_level
              },
              {
                icon: <Activity className="w-4 h-4" />,
                label: 'المشاريع',
                value: `${stakeholder.projects_count} مشروع`
              }
            ]}
            actions={[
              {
                type: 'view',
                label: 'عرض',
                onClick: () => handleView(stakeholder)
              },
              {
                type: 'edit',
                label: 'تعديل',
                onClick: () => handleEdit(stakeholder)
              },
              {
                type: 'delete',
                label: 'حذف',
                onClick: () => handleDelete(stakeholder)
              }
            ]}
            onClick={() => handleView(stakeholder)}
          />
        ))}
      </ViewLayouts>

      <StakeholderWizard
        isOpen={showAddDialog}
        onClose={() => {
          onAddDialogChange(false);
          setSelectedStakeholder(null);
        }}
        stakeholder={selectedStakeholder}
        onSave={() => {
          onAddDialogChange(false);
          setSelectedStakeholder(null);
        }}
      />
    </>
  );
}