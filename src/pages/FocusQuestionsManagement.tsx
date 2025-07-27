import { useNavigate } from "react-router-dom";
import { Header } from "@/components/ui/header";
import { AppSidebar } from "@/components/layout/Sidebar";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import FocusQuestionsManagementComponent from "@/components/admin/FocusQuestionsManagement";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const FocusQuestionsManagement = () => {
  const navigate = useNavigate();

  const handleTabChange = (tab: string) => {
    // Navigate to different routes based on the tab
    switch (tab) {
      case "dashboard":
        navigate("/");
        break;
      case "challenge-management":
        navigate("/");
        // The main app will handle setting the correct tab
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: { tab: 'challenge-management' } }));
        }, 100);
        break;
      default:
        navigate("/");
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: { tab } }));
        }, 100);
        break;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar activeTab="focus-questions" onTabChange={handleTabChange} />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          <div className="flex items-center gap-4 px-6 py-3 border-b bg-background/95">
            <SidebarTrigger />
            <BreadcrumbNav activeTab="focus-questions" />
          </div>
          
          <main className="flex-1 overflow-auto">
            <FocusQuestionsManagementComponent />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default FocusQuestionsManagement;