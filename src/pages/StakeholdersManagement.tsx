import { StakeholdersManagement } from "@/components/admin/StakeholdersManagement";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageContainer, PageHeader, Section, ContentArea } from "@/components/ui";

export default function StakeholdersManagementPage() {
  const breadcrumbs = [
    { label: "Admin", href: "/admin" },
    { label: "Stakeholders", href: "/admin/stakeholders" }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <PageContainer maxWidth="full" padding="lg">
        <PageHeader 
          title="Stakeholders Management" 
          description="Manage innovation stakeholders and relationships" 
        />
        <Section>
          <ContentArea>
            <StakeholdersManagement />
          </ContentArea>
        </Section>
      </PageContainer>
    </AppLayout>
  );
}