import { useState } from 'react';
import { useStakeholderManagement } from '@/hooks/useStakeholderManagement';
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
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { createErrorHandler } from '@/utils/unified-error-handler';

interface StakeholdersManagementProps {
  viewMode: 'cards' | 'list' | 'grid';
  searchTerm: string;
  showAddDialog: boolean;
  onAddDialogChange: (open: boolean) => void;
}

// Using StakeholderItem interface from useStakeholderManagement

export function StakeholdersManagement({ viewMode, searchTerm, showAddDialog, onAddDialogChange }: StakeholdersManagementProps) {
  const { t } = useUnifiedTranslation();
  const { getStatusLabel } = useStatusTranslations();
  const { stakeholders, loading, deleteStakeholder } = useStakeholderManagement();
  const [selectedStakeholder, setSelectedStakeholder] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [stakeholderToDelete, setStakeholderToDelete] = useState<any>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // ✅ MIGRATED: Using unified loading and error handling
  const { isLoading, withLoading } = useUnifiedLoading({
    component: 'StakeholdersManagement',
    showToast: true,
    logErrors: true
  });
  const errorHandler = createErrorHandler({ component: 'StakeholdersManagement' });

  const handleEdit = (stakeholder: any) => {
    setSelectedStakeholder(stakeholder);
    onAddDialogChange(true);
  };

  const handleView = (stakeholder: any) => {
    setSelectedStakeholder(stakeholder);
    setShowViewDialog(true);
  };

  const handleDelete = (stakeholder: any) => {
    setStakeholderToDelete(stakeholder);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (!stakeholderToDelete) return;
    
    return withLoading('delete-stakeholder', async () => {
      await deleteStakeholder(stakeholderToDelete.id);
      setShowDeleteConfirmation(false);
      setStakeholderToDelete(null);
      return true;
    }, {
      successMessage: t('stakeholder.delete_success', 'تم حذف أصحاب المصلحة بنجاح'),
      errorMessage: t('stakeholder.delete_failed', 'فشل في حذف أصحاب المصلحة'),
      logContext: { stakeholderId: stakeholderToDelete.id, action: 'delete' }
    });
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