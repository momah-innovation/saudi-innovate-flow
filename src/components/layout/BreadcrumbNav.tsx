import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

interface BreadcrumbNavProps {
  activeTab: string;
}

export const BreadcrumbNav = ({ activeTab }: BreadcrumbNavProps) => {
  const getPageTitle = (tab: string) => {
    const titles: Record<string, string> = {
      dashboard: "Dashboard",
      challenges: "Challenges",
      ideas: "Ideas",
      evaluations: "Evaluations",
      expertise: "Expertise Profile",
      campaigns: "Campaigns",
      events: "Events",
      "innovation-teams": "Innovation Teams",
      stakeholders: "Stakeholders",
      analytics: "Analytics",
      trends: "Trends & Insights",
      reports: "Reports",
      "system-analytics": "System Analytics",
      "challenge-management": "Challenge Management",
      organization: "Organization",
      "user-management": "User Management",
      settings: "Settings",
    };
    
    return titles[tab] || "Page";
  };

  const getCategory = (tab: string) => {
    if (["challenges", "ideas", "evaluations", "expertise"].includes(tab)) {
      return "Workflow";
    }
    if (["campaigns", "events", "innovation-teams", "stakeholders"].includes(tab)) {
      return "Management";
    }
    if (["analytics", "trends", "reports", "system-analytics"].includes(tab)) {
      return "Analytics";
    }
    if (["challenge-management", "organization", "user-management"].includes(tab)) {
      return "Administration";
    }
    return null;
  };

  const category = getCategory(activeTab);
  const pageTitle = getPageTitle(activeTab);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Ruwād
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {category && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{category}</BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
        
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};