import { Header } from "@/components/layout/Header";
import { AppSidebar } from "@/components/layout/Sidebar";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { FocusQuestionsManagement as FocusQuestionsManagementComponent } from "@/components/admin/FocusQuestionsManagement";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const FocusQuestionsManagement = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar activeTab="challenge-management" onTabChange={() => {}} />
        
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