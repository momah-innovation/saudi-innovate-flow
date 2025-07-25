import { OrganizationalStructureManagement } from "@/components/admin/OrganizationalStructureManagement";
import { Header } from "@/components/layout/Header";
import { AppSidebar } from "@/components/layout/Sidebar";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function OrganizationalStructurePage() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar activeTab="organizational-structure" onTabChange={() => {}} />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          <div className="flex items-center gap-4 px-6 py-3 border-b bg-background/95">
            <SidebarTrigger />
            <BreadcrumbNav activeTab="organizational-structure" />
          </div>
          
          <main className="flex-1 overflow-auto">
            <OrganizationalStructureManagement />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}