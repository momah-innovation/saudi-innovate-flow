import { useNavigate } from "react-router-dom";
import { CampaignsManagement } from "@/components/admin/CampaignsManagement";
import { Header } from "@/components/layout/Header";
import { AppSidebar } from "@/components/layout/Sidebar";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function CampaignsManagementPage() {
  const navigate = useNavigate();

  const handleTabChange = (tab: string) => {
    if (tab === "evaluations") {
      navigate("/admin/evaluations");
    } else if (tab === "campaigns") {
      navigate("/admin/campaigns");
    } else if (tab === "events") {
      navigate("/admin/events");
    } else if (tab === "stakeholders") {
      navigate("/admin/stakeholders");
    } else {
      navigate("/");
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar activeTab="campaigns" onTabChange={handleTabChange} />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          <div className="flex items-center gap-4 px-6 py-3 border-b bg-background/95">
            <SidebarTrigger />
            <BreadcrumbNav activeTab="campaigns" />
          </div>
          
          <main className="flex-1 overflow-auto">
            <CampaignsManagement />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}