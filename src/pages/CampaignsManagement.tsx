import { CampaignsManagement } from "@/components/admin/CampaignsManagement";
import { AppShell } from "@/components/layout/AppShell";
import { PageLayout } from "@/components/layout/PageLayout";
import { useDirection } from "@/components/ui/direction-provider";

export default function CampaignsManagementPage() {
  const { isRTL, language } = useDirection();
  
  const title = isRTL && language === 'ar' ? 'إدارة الحملات' : 'Campaign Management';
  const description = isRTL && language === 'ar' 
    ? 'إنشاء وإدارة حملات الابتكار' 
    : 'Create and manage innovation campaigns';

  const breadcrumbs = [
    { label: isRTL && language === 'ar' ? 'الإدارة' : 'Administration' },
    { label: isRTL && language === 'ar' ? 'الحملات' : 'Campaigns' }
  ];

  return (
    <AppShell>
      <PageLayout 
        title={title}
        description={description}
        spacing="md"
        maxWidth="full"
      >
        <CampaignsManagement />
      </PageLayout>
    </AppShell>
  );
}