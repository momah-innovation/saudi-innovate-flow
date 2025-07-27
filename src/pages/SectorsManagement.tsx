import { SectorsManagement } from "@/components/admin/SectorsManagement";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageContainer, PageHeader, Section, ContentArea } from "@/components/ui";

export default function SectorsManagementPage() {
  const breadcrumbs = [
    { label: "الإدارة", href: "/admin" },
    { label: "القطاعات", href: "/admin/sectors" }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <PageContainer maxWidth="full" padding="lg">
        <PageHeader 
          title="Sectors Management" 
          description="Manage innovation sectors and categories" 
        />
        <Section>
          <ContentArea>
            <SectorsManagement />
          </ContentArea>
        </Section>
      </PageContainer>
    </AppLayout>
  );
}