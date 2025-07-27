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
        <Section>
          <ContentArea>
            <CampaignsManagement />
          </ContentArea>
        </Section>
      </PageContainer>
    </AppLayout>
  );
}