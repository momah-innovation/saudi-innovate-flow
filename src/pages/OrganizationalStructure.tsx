import { OrganizationalStructureManagement } from "@/components/admin/OrganizationalStructureManagement";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageContainer, PageHeader, Section, ContentArea } from "@/components/ui";

export default function OrganizationalStructurePage() {
  const breadcrumbs = [
    { label: "الإدارة", href: "/admin" },
    { label: "التنظيم", href: "/admin/organizational-structure" }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <PageContainer maxWidth="full" padding="lg">
        <OrganizationalStructureManagement />
      </PageContainer>
    </AppLayout>
  );
}