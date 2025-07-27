import { PartnersManagement } from "@/components/admin/PartnersManagement";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageContainer, PageHeader, Section, ContentArea } from "@/components/ui";

export default function PartnersManagementPage() {
  const breadcrumbs = [
    { label: "Admin", href: "/admin" },
    { label: "Partners", href: "/admin/partners" }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <PageContainer maxWidth="full" padding="lg">
        <PageHeader 
          title="Partners Management" 
          description="Manage innovation partners and collaborators" 
        />
        <Section>
          <ContentArea>
            <PartnersManagement />
          </ContentArea>
        </Section>
      </PageContainer>
    </AppLayout>
  );
}