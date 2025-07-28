import { useState } from 'react';
import { ManagementCard } from '@/components/ui/management-card';
import { ViewLayouts } from '@/components/ui/view-layouts';
import { useTranslation } from '@/hooks/useTranslation';
import { StakeholderWizard } from './StakeholderWizard';
import { 
  User,
  Mail,
  Phone,
  Building,
  Target,
  Activity
} from 'lucide-react';

// Mock data - will be replaced with real data
const mockStakeholders = [
  {
    id: '1',
    name: 'د. أحمد محمد العبدالله',
    organization: 'وزارة التقنية والابتكار',
    position: 'مدير عام الابتكار',
    email: 'ahmed.abdullah@tech.gov.sa',
    phone: '+966501234567',
    stakeholder_type: 'حكومي',
    influence_level: 'عالي',
    interest_level: 'عالي',
    engagement_status: 'نشط',
    notes: 'صاحب قرار رئيسي في مبادرات الابتكار الحكومي',
    projects_count: 12,
    last_interaction: '2024-03-01'
  },
  {
    id: '2',
    name: 'فاطمة علي الزهراني',
    organization: 'شركة أرامكو السعودية',
    position: 'رئيس قسم التطوير التقني',
    email: 'fatima.alzahrani@aramco.com',
    phone: '+966502345678',
    stakeholder_type: 'خاص',
    influence_level: 'عالي',
    interest_level: 'متوسط',
    engagement_status: 'نشط',
    notes: 'مهتمة بمشاريع الطاقة المتجددة والتكنولوجيا النظيفة',
    projects_count: 8,
    last_interaction: '2024-02-25'
  },
  {
    id: '3',
    name: 'أ.د. محمد إبراهيم الأحمد',
    organization: 'جامعة الملك سعود',
    position: 'أستاذ الذكاء الاصطناعي',
    email: 'm.alahmad@ksu.edu.sa',
    phone: '+966503456789',
    stakeholder_type: 'أكاديمي',
    influence_level: 'متوسط',
    interest_level: 'عالي',
    engagement_status: 'نشط',
    notes: 'خبير في الذكاء الاصطناعي وتطبيقاته في القطاع الحكومي',
    projects_count: 15,
    last_interaction: '2024-03-05'
  },
  {
    id: '4',
    name: 'نورا سعد المطيري',
    organization: 'مؤسسة محمد بن راشد للابتكار',
    position: 'مديرة البرامج',
    email: 'nora.almutairi@mbrf.ae',
    phone: '+971504567890',
    stakeholder_type: 'غير ربحي',
    influence_level: 'متوسط',
    interest_level: 'عالي',
    engagement_status: 'معلق',
    notes: 'تنسق برامج الابتكار الإقليمية',
    projects_count: 6,
    last_interaction: '2024-01-15'
  }
];

const typeConfig = {
  'حكومي': { label: 'حكومي', variant: 'default' as const },
  'خاص': { label: 'خاص', variant: 'secondary' as const },
  'أكاديمي': { label: 'أكاديمي', variant: 'outline' as const },
  'غير ربحي': { label: 'غير ربحي', variant: 'secondary' as const },
  'مجتمعي': { label: 'مجتمعي', variant: 'outline' as const },
  'دولي': { label: 'دولي', variant: 'default' as const }
};

const influenceConfig = {
  'عالي': { label: 'عالي', variant: 'destructive' as const },
  'متوسط': { label: 'متوسط', variant: 'default' as const },
  'منخفض': { label: 'منخفض', variant: 'secondary' as const }
};

const engagementConfig = {
  'نشط': { label: 'نشط', variant: 'default' as const },
  'غير نشط': { label: 'غير نشط', variant: 'secondary' as const },
  'معلق': { label: 'معلق', variant: 'outline' as const },
  'محظور': { label: 'محظور', variant: 'destructive' as const }
};

interface StakeholdersManagementProps {
  viewMode: 'cards' | 'list' | 'grid';
  searchTerm: string;
  showAddDialog: boolean;
  onAddDialogChange: (open: boolean) => void;
}

export function StakeholdersManagement({ viewMode, searchTerm, showAddDialog, onAddDialogChange }: StakeholdersManagementProps) {
  const { language } = useTranslation();
  const [selectedStakeholder, setSelectedStakeholder] = useState<any>(null);

  const handleEdit = (stakeholder: any) => {
    setSelectedStakeholder(stakeholder);
    onAddDialogChange(true);
  };

  const handleView = (stakeholder: any) => {
    console.log('View stakeholder:', stakeholder);
  };

  const handleDelete = (stakeholder: any) => {
    console.log('Delete stakeholder:', stakeholder);
  };

  return (
    <>
      <ViewLayouts viewMode={viewMode}>
        {mockStakeholders.map((stakeholder) => (
          <ManagementCard
            key={stakeholder.id}
            id={stakeholder.id}
            title={stakeholder.name}
            subtitle={`${stakeholder.position} - ${stakeholder.organization}`}
            description={stakeholder.notes}
            viewMode={viewMode}
            badges={[
              {
                label: typeConfig[stakeholder.stakeholder_type as keyof typeof typeConfig]?.label,
                variant: typeConfig[stakeholder.stakeholder_type as keyof typeof typeConfig]?.variant
              },
              {
                label: `تأثير ${stakeholder.influence_level}`,
                variant: influenceConfig[stakeholder.influence_level as keyof typeof influenceConfig]?.variant
              },
              {
                label: engagementConfig[stakeholder.engagement_status as keyof typeof engagementConfig]?.label,
                variant: engagementConfig[stakeholder.engagement_status as keyof typeof engagementConfig]?.variant
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