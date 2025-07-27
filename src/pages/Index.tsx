import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { InnovatorDashboard } from "@/components/dashboard/InnovatorDashboard";
import { AdminChallengeManagement } from "@/components/admin/AdminChallengeManagement";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageContainer, Section, ContentArea, PageHeader } from "@/components/ui";
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
    const wrapInSection = (title: string, description: string, content: React.ReactNode) => (
      <>
        <PageHeader title={title} description={description} />
        <Section>
          <ContentArea>
            {content}
          </ContentArea>
        </Section>
      </>
    );

    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "challenges":
        return <InnovatorDashboard />;
      case "ideas":
        return wrapInSection(
          "My Ideas",
          "Ideas management interface will be implemented here.",
          <div>Ideas content placeholder</div>
        );
      case "evaluations":
        return wrapInSection(
          "Evaluations",
          "Expert evaluation interface will be implemented here.",
          <div>Evaluations content placeholder</div>
        );
      case "expertise":
        return wrapInSection(
          "Expertise Profile",
          "Expert profile management will be implemented here.",
          <div>Expertise content placeholder</div>
        );
      case "campaigns":
        return wrapInSection(
          "Campaigns",
          "Campaign management interface will be implemented here.",
          <div>Campaigns content placeholder</div>
        );
      case "events":
        return wrapInSection(
          "Events",
          "Event management interface will be implemented here.",
          <div>Events content placeholder</div>
        );
      case "innovation-teams":
        return wrapInSection(
          "Innovation Teams",
          "Manage and coordinate innovation teams",
          <TeamManagement />
        );
      case "stakeholders":
        return wrapInSection(
          "Stakeholders",
          "Stakeholder management interface will be implemented here.",
          <div>Stakeholders content placeholder</div>
        );
      case "analytics":
        return wrapInSection(
          "Analytics",
          "Analytics dashboard will be implemented here.",
          <div>Analytics content placeholder</div>
        );
      case "trends":
        return wrapInSection(
          "Trends & Insights",
          "Trends and insights interface will be implemented here.",
          <div>Trends content placeholder</div>
        );
      case "reports":
        return wrapInSection(
          "Reports",
          "Reports interface will be implemented here.",
          <div>Reports content placeholder</div>
        );
      case "system-analytics":
        return wrapInSection(
          "System Analytics",
          "System analytics interface will be implemented here.",
          <div>System Analytics content placeholder</div>
        );
      case "organization":
        return wrapInSection(
          "Organization",
          "Organization management interface will be implemented here.",
          <div>Organization content placeholder</div>
        );
      case "user-management":
        return wrapInSection(
          "User Management",
          "User management interface will be implemented here.",
          <div>User Management content placeholder</div>
        );
      case "challenge-management":
        return wrapInSection(
          "Challenge Management",
          "Manage and configure innovation challenges",
          <AdminChallengeManagement />
        );
      case "settings":
        return wrapInSection(
          "Settings",
          "Settings interface will be implemented here.",
          <div>Settings content placeholder</div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  const breadcrumbs = [
    { label: "Dashboard", href: "/" }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <PageContainer maxWidth="full" padding="lg">
        {renderContent()}
      </PageContainer>
    </AppLayout>
  );
};

export default Index;