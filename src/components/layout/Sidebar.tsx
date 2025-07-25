import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Target,
  Lightbulb,
  Users,
  Calendar,
  TrendingUp,
  FileText,
  Settings,
  PieChart,
  Briefcase,
  Award,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, badge: null },
    { id: "challenges", label: "Challenges", icon: Target, badge: 12 },
    { id: "ideas", label: "Ideas", icon: Lightbulb, badge: 45 },
    { id: "stakeholders", label: "Stakeholders", icon: Users, badge: null },
    { id: "campaigns", label: "Campaigns", icon: Calendar, badge: 3 },
    { id: "events", label: "Events", icon: Award, badge: 2 },
    { id: "innovation-teams", label: "Innovation Teams", icon: Zap, badge: null },
    { id: "analytics", label: "Analytics", icon: PieChart, badge: null },
    { id: "trends", label: "Trends & Insights", icon: TrendingUp, badge: null },
    { id: "reports", label: "Reports", icon: FileText, badge: null },
    { id: "organization", label: "Organization", icon: Briefcase, badge: null },
    { id: "settings", label: "Settings", icon: Settings, badge: null },
  ];

  return (
    <aside className="w-64 bg-card border-r h-full overflow-y-auto">
      <div className="p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-left",
                  activeTab === item.id && "bg-primary/10 text-primary font-medium"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
                {item.badge && (
                  <Badge 
                    variant="secondary" 
                    className="ml-auto bg-primary/10 text-primary"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};