import { CampaignsManagement } from "@/components/admin/CampaignsManagement";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageContainer, Section, ContentArea, PageHeader } from "@/components/ui";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";

export default function CampaignsManagementPage() {

  return (
    <AppLayout>
      <PageContainer maxWidth="full" padding="lg">
        <Section>
          <ContentArea>
            <BreadcrumbNav activeTab="campaigns" />
            <CampaignsManagement />
          </ContentArea>
        </Section>
      </PageContainer>
    </AppLayout>
  );
}