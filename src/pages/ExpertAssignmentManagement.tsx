import { useNavigate } from "react-router-dom";
import { ExpertAssignmentManagement } from "@/components/admin/ExpertAssignmentManagement";
import { Header } from "@/components/layout/Header";
import { AppSidebar } from "@/components/layout/Sidebar";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function ExpertAssignmentManagementPage() {
  const navigate = useNavigate();

  const handleTabChange = (tab: string) => {
    if (tab === "focus-questions") {
      navigate("/admin/focus-questions");
    } else if (tab === "partners") {
      navigate("/admin/partners");
    } else if (tab === "sectors") {
      navigate("/admin/sectors");
    } else if (tab === "organizational-structure") {
      navigate("/admin/organizational-structure");
    } else if (tab === "expert-assignments") {
      navigate("/admin/expert-assignments");
    } else {
      navigate("/");
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar activeTab="expert-assignments" onTabChange={handleTabChange} />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          <main className="flex-1 p-6 bg-muted/10">
            <div className="max-w-7xl mx-auto space-y-6">
              <BreadcrumbNav activeTab="expert-assignments" />
              
              <ExpertAssignmentManagement />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}