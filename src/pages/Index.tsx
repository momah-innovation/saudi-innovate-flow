import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EnhancedDashboardOverview } from "@/components/dashboard/EnhancedDashboardOverview";
import { InnovatorDashboard } from "@/components/dashboard/InnovatorDashboard";
import { AdminChallengeManagement } from "@/components/admin/AdminChallengeManagement";
import { AppShell } from "@/components/layout/AppShell";
import { PageContainer, Section, ContentArea, PageHeader } from "@/components/ui";
import TeamManagement from "./TeamManagement";
import { useTranslation } from "@/hooks/useTranslation";

// Force cache refresh

const Index = () => {
  const { t } = useTranslation();
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
        return <EnhancedDashboardOverview />;
      case "challenges":
        return <InnovatorDashboard />;
      case "ideas":
        return wrapInSection(
          t('myIdeas'),
          t('ideasManagement'),
          <div>{t('ideasManagement')}</div>
        );
      case "evaluations":
        return wrapInSection(
          t('evaluations'),
          t('evaluations'),
          <div>{t('evaluations')}</div>
        );
      case "expertise":
        return wrapInSection(
          t('expertiseProfile'),
          t('expertiseProfile'),
          <div>{t('expertiseProfile')}</div>
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
          t('innovationTeamsNav'),
          t('manageCoordinateTeams'),
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
          t('challengeManagementNav'),
          t('manageChallengesDesc'),
          <AdminChallengeManagement />
        );
      case "settings":
        return wrapInSection(
          "Settings",
          "Settings interface will be implemented here.",
          <div>Settings content placeholder</div>
        );
      default:
        return <EnhancedDashboardOverview />;
    }
  };

  const breadcrumbs = [
    { label: t('dashboard'), href: "/" }
  ];

  return (
    <AppShell>
      <PageContainer maxWidth="full" padding="lg">
        {renderContent()}
      </PageContainer>
    </AppShell>
  );
};

export default Index;