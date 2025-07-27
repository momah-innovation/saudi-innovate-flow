import { CampaignsManagement } from "@/components/admin/CampaignsManagement";
import { AppLayout } from "@/components/layout/AppLayout";
import { SimplePageLayout } from "@/components/layout/SimplePageLayout";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";

export default function CampaignsManagementPage() {
  return (
    <AppLayout>
      <SimplePageLayout spacing="md">
        <div className="space-y-6">
          <BreadcrumbNav activeTab="campaigns" />
          <CampaignsManagement />
        </div>
      </SimplePageLayout>
    </AppLayout>
  );
}