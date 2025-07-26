import { useNavigate } from "react-router-dom";
import UserManagement from "@/pages/UserManagement";
import { Header } from "@/components/layout/Header";
import { AppSidebar } from "@/components/layout/Sidebar";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function UserManagementPage() {
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
    } else if (tab === "user-management") {
      navigate("/admin/users");
    } else {
      navigate("/");
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar activeTab="user-management" onTabChange={handleTabChange} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-6 space-y-6">
              <BreadcrumbNav activeTab="user-management" />
              <UserManagement />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}