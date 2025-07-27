import { CampaignsManagement } from "@/components/admin/CampaignsManagement";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageContainer, Section, ContentArea, PageHeader } from "@/components/ui";

export default function CampaignsManagementPage() {
  const breadcrumbs = [
    { label: "Admin", href: "/admin" },
    { label: "Campaigns", href: "/admin/campaigns" }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <PageContainer maxWidth="full" padding="lg">
        <PageHeader 
          title="Campaigns Management" 
          description="Manage innovation campaigns and initiatives" 
        />
        <Section>
          <ContentArea>
            <CampaignsManagement />
          </ContentArea>
        </Section>
      </PageContainer>
    </AppLayout>
  );
}