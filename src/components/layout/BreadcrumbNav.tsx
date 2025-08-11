import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useDirection } from "@/components/ui/direction-provider";

interface BreadcrumbNavProps {
  activeTab: string;
}

export const BreadcrumbNav = ({ activeTab }: BreadcrumbNavProps) => {
  const { t } = useUnifiedTranslation();
  const { direction } = useDirection();
  
  const getPageTitle = (tab: string) => {
    const titleKeys: Record<string, string> = {
      dashboard: "dashboard",
      challenges: "challenges",
      ideas: "ideas",
      evaluations: "evaluations",
      expertise: "expertiseProfile",
      campaigns: "campaigns",
      events: "events",
      "innovation-teams": "innovationTeams",
      stakeholders: "stakeholders",
      analytics: "analytics",
      trends: "trendsInsights",
      reports: "reports",
      "system-analytics": "systemAnalytics",
      "challenge-management": "challengeManagement",
      "focus-questions": "focusQuestionsManagement",
      "partners": "partnersManagement", 
      "sectors": "sectorsManagement",
      "organizational-structure": "organizationalStructure",
      "expert-assignments": "expertAssignments",
      "relationships": "relationshipOverview",
      organization: "organization",
      "user-management": "userManagement",
      "system-documentation": "systemDocumentation",
      settings: "settings",
    };
    
    return titleKeys[tab] ? t(titleKeys[tab]) : t("page");
  };

  const getCategory = (tab: string) => {
    if (["challenges", "ideas", "evaluations", "expertise"].includes(tab)) {
      return t("workflow");
    }
    if (["campaigns", "events", "innovation-teams", "stakeholders"].includes(tab)) {
      return t("management");
    }
    if (["analytics", "trends", "reports", "system-analytics"].includes(tab)) {
      return t("analyticsNav");
    }
    if (["challenge-management", "focus-questions", "partners", "sectors", "organizational-structure", "expert-assignments", "relationships", "organization", "user-management", "system-documentation"].includes(tab)) {
      return t("administration");
    }
    return null;
  };

  const category = getCategory(activeTab);
  const pageTitle = getPageTitle(activeTab);

  return (
    <Breadcrumb className={direction === 'rtl' ? 'flex-row-reverse' : ''}>
      <BreadcrumbList className={direction === 'rtl' ? 'flex-row-reverse' : ''}>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className={`flex items-center gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <Home className="h-4 w-4" />
              {t("platformName")}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {category && (
          <>
            <BreadcrumbSeparator className={direction === 'rtl' ? 'rotate-180' : ''} />
            <BreadcrumbItem>
              <BreadcrumbLink>{category}</BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
        
        <BreadcrumbSeparator className={direction === 'rtl' ? 'rotate-180' : ''} />
        <BreadcrumbItem>
          <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};