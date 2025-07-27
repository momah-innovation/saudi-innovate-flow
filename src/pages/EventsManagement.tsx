import { EventsManagement } from "@/components/admin/EventsManagement";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageContainer, PageHeader, Section, ContentArea } from "@/components/ui";

export default function EventsManagementPage() {
  const breadcrumbs = [
    { label: "الإدارة", href: "/admin" },
    { label: "الأحداث", href: "/admin/events" }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <PageContainer maxWidth="full" padding="lg">
        <PageHeader 
          title="Events Management" 
          description="Manage innovation events and activities" 
        />
        <Section>
          <ContentArea>
            <EventsManagement />
          </ContentArea>
        </Section>
      </PageContainer>
    </AppLayout>
  );
}