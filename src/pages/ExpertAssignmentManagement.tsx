import { ExpertAssignmentManagement } from "@/components/admin/ExpertAssignmentManagement";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageContainer, PageHeader, Section, ContentArea } from "@/components/ui";

export default function ExpertAssignmentManagementPage() {
  const breadcrumbs = [
    { label: "الإدارة", href: "/admin" },
    { label: "مهام الخبراء", href: "/admin/expert-assignments" }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <PageContainer maxWidth="full" padding="lg">
        <ExpertAssignmentManagement />
      </PageContainer>
    </AppLayout>
  );
}