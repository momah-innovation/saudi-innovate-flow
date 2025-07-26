import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { AppSidebar } from "@/components/layout/Sidebar";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { InnovatorDashboard } from "@/components/dashboard/InnovatorDashboard";
import { AdminChallengeManagement } from "@/components/admin/AdminChallengeManagement";
import { ChallengeList } from "@/components/challenges/ChallengeList";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import TeamManagement from "./TeamManagement";

// Force cache refresh

const Index = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleTabChange = (tab: string) => {
    if (tab === "focus-questions") {
      navigate("/admin/focus-questions");
      return;
    }
    if (tab === "partners") {
      navigate("/admin/partners");
      return;
    }
    if (tab === "sectors") {
      navigate("/admin/sectors");
      return;
    }
    if (tab === "organizational-structure") {
      navigate("/admin/organizational-structure");
      return;
    }
    if (tab === "expert-assignments") {
      navigate("/admin/expert-assignments");
      return;
    }
    if (tab === "user-management") {
      navigate("/admin/users");
      return;
    }
    if (tab === "system-settings") {
      navigate("/admin/system-settings");
      return;
    }
    if (tab === "evaluations") {
      navigate("/admin/evaluations");
      return;
    }
    if (tab === "campaigns") {
      navigate("/admin/campaigns");
      return;
    }
    if (tab === "events") {
      navigate("/admin/events");
      return;
    }
    if (tab === "stakeholders") {
      navigate("/admin/stakeholders");
      return;
    }
    if (tab === "system-documentation") {
      navigate("/admin/system-documentation");
      return;
    }
    if (tab === "settings") {
      navigate("/settings");
      return;
    }
    setActiveTab(tab);
  };

  // Listen for navigation events from other pages
  useEffect(() => {
    const handleNavigateToTab = (event: CustomEvent) => {
      setActiveTab(event.detail.tab);
    };

    window.addEventListener('navigate-to-tab', handleNavigateToTab as EventListener);
    
    return () => {
      window.removeEventListener('navigate-to-tab', handleNavigateToTab as EventListener);
    };
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "challenges":
        return <InnovatorDashboard />;
      case "ideas":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">My Ideas</h2>
            <p className="text-muted-foreground">Ideas management interface will be implemented here.</p>
          </div>
        );
      case "evaluations":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Evaluations</h2>
            <p className="text-muted-foreground">Expert evaluation interface will be implemented here.</p>
          </div>
        );
      case "expertise":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Expertise Profile</h2>
            <p className="text-muted-foreground">Expert profile management will be implemented here.</p>
          </div>
        );
      case "campaigns":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Campaigns</h2>
            <p className="text-muted-foreground">Campaign management interface will be implemented here.</p>
          </div>
        );
      case "events":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Events</h2>
            <p className="text-muted-foreground">Event management interface will be implemented here.</p>
          </div>
        );
      case "innovation-teams":
        return <TeamManagement />;
      case "stakeholders":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Stakeholders</h2>
            <p className="text-muted-foreground">Stakeholder management interface will be implemented here.</p>
          </div>
        );
      case "analytics":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Analytics</h2>
            <p className="text-muted-foreground">Analytics dashboard will be implemented here.</p>
          </div>
        );
      case "trends":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Trends & Insights</h2>
            <p className="text-muted-foreground">Trends and insights interface will be implemented here.</p>
          </div>
        );
      case "reports":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Reports</h2>
            <p className="text-muted-foreground">Reports interface will be implemented here.</p>
          </div>
        );
      case "system-analytics":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">System Analytics</h2>
            <p className="text-muted-foreground">System analytics interface will be implemented here.</p>
          </div>
        );
      case "organization":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Organization</h2>
            <p className="text-muted-foreground">Organization management interface will be implemented here.</p>
          </div>
        );
      case "user-management":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <p className="text-muted-foreground">User management interface will be implemented here.</p>
          </div>
        );
      case "challenge-management":
        return <AdminChallengeManagement />;
      case "settings":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p className="text-muted-foreground">Settings interface will be implemented here.</p>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar activeTab={activeTab} onTabChange={handleTabChange} />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          <div className="flex items-center gap-4 px-6 py-3 border-b bg-background/95">
            <SidebarTrigger />
            <BreadcrumbNav activeTab={activeTab} />
          </div>
          
          <main className="flex-1 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;