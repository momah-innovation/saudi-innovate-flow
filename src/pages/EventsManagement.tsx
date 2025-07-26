import { useNavigate } from "react-router-dom";
import { EventsManagement } from "@/components/admin/EventsManagement";
import { Header } from "@/components/layout/Header";
import { AppSidebar } from "@/components/layout/Sidebar";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function EventsManagementPage() {
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
        <AppSidebar activeTab="events" onTabChange={handleTabChange} />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          <div className="flex items-center gap-4 px-6 py-3 border-b bg-background/95">
            <SidebarTrigger />
            <BreadcrumbNav activeTab="events" />
          </div>
          
          <main className="flex-1 overflow-auto">
            <EventsManagement />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}