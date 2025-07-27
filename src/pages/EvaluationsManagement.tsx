import { EvaluationsManagement } from "@/components/admin/EvaluationsManagement";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageContainer, PageHeader, Section, ContentArea } from "@/components/ui";

export default function EvaluationsManagementPage() {
  const breadcrumbs = [
    { label: "الإدارة", href: "/admin" },
    { label: "التقييمات", href: "/admin/evaluations" }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <PageContainer maxWidth="full" padding="lg">
        <PageHeader 
          title="Evaluations Management" 
          description="Manage expert evaluations and assessments" 
        />
        <Section>
          <ContentArea>
            <EvaluationsManagement />
          </ContentArea>
        </Section>
      </PageContainer>
    </AppLayout>
  );
}