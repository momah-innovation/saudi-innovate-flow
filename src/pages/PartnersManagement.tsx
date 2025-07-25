import { PartnersManagement } from "@/components/admin/PartnersManagement";
import { Header } from "@/components/layout/Header";
import { AppSidebar } from "@/components/layout/Sidebar";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function PartnersManagementPage() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar activeTab="partners" onTabChange={() => {}} />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          <div className="flex items-center gap-4 px-6 py-3 border-b bg-background/95">
            <SidebarTrigger />
            <BreadcrumbNav activeTab="partners" />
          </div>
          
          <main className="flex-1 overflow-auto">
            <PartnersManagement />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}