import { StakeholdersManagement } from "@/components/admin/StakeholdersManagement";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageContainer, PageHeader, Section, ContentArea } from "@/components/ui";

export default function StakeholdersManagementPage() {
  const breadcrumbs = [
    { label: "الإدارة", href: "/admin" },
    { label: "أصحاب المصلحة", href: "/admin/stakeholders" }
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