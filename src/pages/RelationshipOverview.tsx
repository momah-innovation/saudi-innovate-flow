import { RelationshipOverview } from "@/components/admin/RelationshipOverview";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageContainer, PageHeader, Section, ContentArea } from "@/components/ui";

export default function RelationshipOverviewPage() {
  const breadcrumbs = [
    { label: "Admin", href: "/admin" },
    { label: "Relationships", href: "/admin/relationships" }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <PageContainer maxWidth="full" padding="lg">
        <PageHeader 
          title="Relationship Overview" 
          description="Visualize and manage entity relationships across the system" 
        />
        <Section>
          <ContentArea>
            <RelationshipOverview />
          </ContentArea>
        </Section>
      </PageContainer>
    </AppLayout>
  );
}