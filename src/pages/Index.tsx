import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { ChallengeList } from "@/components/challenges/ChallengeList";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "challenges":
        return <ChallengeList />;
      case "ideas":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Innovation Ideas</h2>
            <p className="text-muted-foreground">Ideas management coming soon...</p>
          </div>
        );
      case "stakeholders":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Stakeholders</h2>
            <p className="text-muted-foreground">Stakeholder management coming soon...</p>
          </div>
        );
      case "campaigns":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Innovation Campaigns</h2>
            <p className="text-muted-foreground">Campaign management coming soon...</p>
          </div>
        );
      case "events":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Events</h2>
            <p className="text-muted-foreground">Event management coming soon...</p>
          </div>
        );
      case "innovation-teams":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Innovation Teams</h2>
            <p className="text-muted-foreground">Team management coming soon...</p>
          </div>
        );
      case "analytics":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Analytics</h2>
            <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
          </div>
        );
      case "trends":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Trends & Insights</h2>
            <p className="text-muted-foreground">Trend analysis coming soon...</p>
          </div>
        );
      case "reports":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Reports</h2>
            <p className="text-muted-foreground">Report generation coming soon...</p>
          </div>
        );
      case "organization":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Organization Structure</h2>
            <p className="text-muted-foreground">Organization management coming soon...</p>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Settings</h2>
            <p className="text-muted-foreground">System settings coming soon...</p>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;