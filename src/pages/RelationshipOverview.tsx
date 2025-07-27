import { RelationshipOverview } from "@/components/admin/RelationshipOverview";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageContainer, PageHeader, Section, ContentArea } from "@/components/ui";

export default function RelationshipOverviewPage() {
  const breadcrumbs = [
    { label: "الإدارة", href: "/admin" },
    { label: "العلاقات", href: "/admin/relationships" }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <PageContainer maxWidth="full" padding="lg">
        <RelationshipOverview />
      </PageContainer>
    </AppLayout>
  );
}