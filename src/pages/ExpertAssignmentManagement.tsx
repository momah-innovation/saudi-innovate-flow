import { ExpertAssignmentManagement } from "@/components/admin/ExpertAssignmentManagement";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageContainer, PageHeader, Section, ContentArea } from "@/components/ui";

export default function ExpertAssignmentManagementPage() {
  const breadcrumbs = [
    { label: "Admin", href: "/admin" },
    { label: "Expert Assignments", href: "/admin/expert-assignments" }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <PageContainer maxWidth="full" padding="lg">
        <PageHeader 
          title="Expert Assignment Management" 
          description="Assign experts to challenges and manage evaluations" 
        />
        <Section>
          <ContentArea>
            <ExpertAssignmentManagement />
          </ContentArea>
        </Section>
      </PageContainer>
    </AppLayout>
  );
}