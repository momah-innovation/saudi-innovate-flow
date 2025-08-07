import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { InnovatorDashboard } from "@/components/dashboard/InnovatorDashboard";
import { AdminChallengeManagement } from "@/components/admin/AdminChallengeManagement";
import { AppShell } from "@/components/layout/AppShell";
import { PageContainer, Section, ContentArea, PageHeader } from "@/components/ui";
import TeamManagement from "./TeamManagement";
import { useUnifiedTranslation } from "@/hooks/useAppTranslation";

// Force cache refresh

const Index = () => {
  const { t } = useUnifiedTranslation();
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
          t('campaigns'),
          t('campaignManagementDesc'),
          <div>{t('campaignsContentPlaceholder')}</div>
        );
      case "events":
        return wrapInSection(
          t('events'),
          t('eventManagementDesc'),
          <div>{t('eventsContentPlaceholder')}</div>
        );
      case "innovation-teams":
        return wrapInSection(
          t('innovationTeamsNav'),
          t('manageCoordinateTeams'),
          <TeamManagement />
        );
      case "stakeholders":
        return wrapInSection(
          t('stakeholders'),
          t('stakeholderManagementDesc'),
          <div>{t('stakeholdersContentPlaceholder')}</div>
        );
      case "analytics":
        return wrapInSection(
          t('analytics'),
          t('analyticsDashboardDesc'),
          <div>{t('analyticsContentPlaceholder')}</div>
        );
      case "trends":
        return wrapInSection(
          t('trendsInsights'),
          t('trendsInsightsDesc'),
          <div>{t('trendsContentPlaceholder')}</div>
        );
      case "reports":
        return wrapInSection(
          t('reports'),
          t('reportsInterfaceDesc'),
          <div>{t('reportsContentPlaceholder')}</div>
        );
      case "system-analytics":
        return wrapInSection(
          t('systemAnalytics'),
          t('systemAnalyticsDesc'),
          <div>{t('systemAnalyticsPlaceholder')}</div>
        );
      case "organization":
        return wrapInSection(
          t('organizations'),
          t('organizationManagementDesc'),
          <div>{t('organizationContentPlaceholder')}</div>
        );
      case "user-management":
        return wrapInSection(
          t('user_management'),
          t('userManagementDesc'),
          <div>{t('userManagementPlaceholder')}</div>
        );
      case "challenge-management":
        return wrapInSection(
          t('challengeManagementNav'),
          t('manageChallengesDesc'),
          <AdminChallengeManagement />
        );
      case "settings":
        return wrapInSection(
          t('settings'),
          t('settingsInterfaceDesc'),
          <div>{t('settingsContentPlaceholder')}</div>
        );
      default:
        return <DashboardOverview />;
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