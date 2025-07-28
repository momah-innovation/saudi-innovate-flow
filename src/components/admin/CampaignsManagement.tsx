import { useState } from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { ManagementCard } from '@/components/ui/management-card';
import { useTranslation } from '@/hooks/useTranslation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CampaignWizard } from './CampaignWizard';
import { 
  Calendar, 
  Users, 
  Target, 
  DollarSign
} from 'lucide-react';

// Mock data - will be replaced with real data
const mockCampaigns = [
  {
    id: '1',
    title_ar: 'حملة الابتكار الرقمي',
    description_ar: 'حملة لتطوير الحلول الرقمية المبتكرة في القطاع الحكومي',
    status: 'active',
    start_date: '2024-02-01',
    end_date: '2024-06-30',
    target_participants: 500,
    registered_participants: 243,
    target_ideas: 100,
    submitted_ideas: 67,
    budget: 150000,
    sector: 'التكنولوجيا',
    priority: 'high',
    completion: 65,
    manager: 'أحمد محمد'
  },
  {
    id: '2',
    title_ar: 'حملة الاستدامة البيئية',
    description_ar: 'حملة لتطوير حلول مبتكرة للحفاظ على البيئة والاستدامة',
    status: 'planning',
    start_date: '2024-03-15',
    end_date: '2024-08-15',
    target_participants: 300,
    registered_participants: 0,
    target_ideas: 50,
    submitted_ideas: 0,
    budget: 120000,
    sector: 'البيئة',
    priority: 'medium',
    completion: 0,
    manager: 'فاطمة علي'
  },
  {
    id: '3',
    title_ar: 'حملة التعليم الذكي',
    description_ar: 'حملة لتطوير حلول تعليمية ذكية ومبتكرة',
    status: 'completed',
    start_date: '2023-09-01',
    end_date: '2024-01-31',
    target_participants: 400,
    registered_participants: 387,
    target_ideas: 80,
    submitted_ideas: 92,
    budget: 200000,
    sector: 'التعليم',
    priority: 'high',
    completion: 100,
    manager: 'محمد الأحمد'
  }
];

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

export function CampaignsManagement() {
  const { language } = useTranslation();
  const [showWizard, setShowWizard] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  const handleEdit = (campaign: any) => {
    setSelectedCampaign(campaign);
    setShowWizard(true);
  };

  const handleView = (campaign: any) => {
    console.log('View campaign:', campaign);
  };

  const handleDelete = (campaign: any) => {
    console.log('Delete campaign:', campaign);
  };

  return (
    <>
      <StandardPageLayout
        title="إدارة الحملات"
        description="إدارة وتنظيم حملات الابتكار والتحديات"
        itemCount={mockCampaigns.length}
        addButton={{
          label: "حملة جديدة",
          onClick: () => setShowWizard(true),
          icon: <Target className="w-4 h-4" />
        }}
        searchTerm=""
        onSearchChange={() => {}}
        filters={[
          {
            id: 'status',
            label: 'الحالة',
            type: 'select' as const,
            options: [
              { label: 'الكل', value: 'all' },
              { label: 'قيد التخطيط', value: 'planning' },
              { label: 'نشط', value: 'active' },
              { label: 'متوقف', value: 'paused' },
              { label: 'مكتمل', value: 'completed' }
            ],
            value: 'all',
            onChange: () => {}
          }
        ]}
      >
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {mockCampaigns.map((campaign) => (
            <ManagementCard
              key={campaign.id}
              id={campaign.id}
              title={campaign.title_ar}
              description={campaign.description_ar}
              badges={[
                {
                  label: statusConfig[campaign.status as keyof typeof statusConfig]?.label,
                  variant: statusConfig[campaign.status as keyof typeof statusConfig]?.variant
                },
                {
                  label: campaign.sector,
                  variant: 'secondary'
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
                  type: 'view',
                  label: 'عرض',
                  onClick: () => handleView(campaign)
                },
                {
                  type: 'edit',
                  label: 'تعديل',
                  onClick: () => handleEdit(campaign)
                },
                {
                  type: 'delete',
                  label: 'حذف',
                  onClick: () => handleDelete(campaign)
                }
              ]}
              onClick={() => handleView(campaign)}
            />
          ))}
        </div>
      </StandardPageLayout>

      <CampaignWizard
        open={showWizard}
        onOpenChange={setShowWizard}
        onSuccess={() => setShowWizard(false)}
      />
    </>
  );
}