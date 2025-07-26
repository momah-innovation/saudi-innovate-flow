import { useNavigate } from "react-router-dom";
import { RelationshipOverview } from "@/components/admin/RelationshipOverview";
import { Header } from "@/components/layout/Header";
import { AppSidebar } from "@/components/layout/Sidebar";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function RelationshipOverviewPage() {
  const navigate = useNavigate();

  const handleTabChange = (tab: string) => {
    if (tab === "relationships") {
      navigate("/admin/relationships");
    } else if (tab === "evaluations") {
      navigate("/admin/evaluations");
    } else if (tab === "campaigns") {
      navigate("/admin/campaigns");
    } else if (tab === "events") {
      navigate("/admin/events");
    } else if (tab === "stakeholders") {
      navigate("/admin/stakeholders");
    } else if (tab === "partners") {
      navigate("/admin/partners");
    } else if (tab === "expert-assignments") {
      navigate("/admin/expert-assignments");
    } else {
      navigate("/");
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar activeTab="relationships" onTabChange={handleTabChange} />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          <div className="flex items-center gap-4 px-6 py-3 border-b bg-background/95">
            <SidebarTrigger />
            <BreadcrumbNav activeTab="relationships" />
          </div>
          
          <main className="flex-1 overflow-auto">
            <RelationshipOverview />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}