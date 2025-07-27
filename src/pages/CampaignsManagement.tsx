import { CampaignsManagement } from "@/components/admin/CampaignsManagement";
import { AppLayout } from "@/components/layout/AppLayout";
import { SimplePageLayout } from "@/components/layout/SimplePageLayout";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";

export default function CampaignsManagementPage() {
  return (
    <AppLayout>
      <SimplePageLayout spacing="md">
        <BreadcrumbNav activeTab="campaigns" />
        <CampaignsManagement />
      </SimplePageLayout>
    </AppLayout>
  );
}