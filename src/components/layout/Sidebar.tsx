import { useAuth } from '@/contexts/AuthContext';
import { useDirection } from '@/components/ui/direction-provider';
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
  Zap,
  Shield,
  BookOpen,
  BarChart3,
  UserCheck,
  Network
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AppSidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const { state } = useSidebar();
  const { userProfile, hasRole } = useAuth();
  const { isRTL, language } = useDirection();

  // Role-based menu items
  const getMenuItems = () => {
    const baseItems = [
      { id: "dashboard", label: "Dashboard", icon: Home, badge: null, roles: ["all"] },
    ];

    const innovatorItems = [
      { id: "challenges", label: "Challenges", icon: Target, badge: 12, roles: ["innovator", "all"] },
      { id: "ideas", label: "My Ideas", icon: Lightbulb, badge: 3, roles: ["innovator"] },
    ];

    const expertItems = [
      { id: "evaluations", label: "Evaluations", icon: UserCheck, badge: 8, roles: ["expert", "team", "admin"] },
      { id: "expertise", label: "Expertise Profile", icon: BookOpen, badge: null, roles: ["expert"] },
    ];

    const teamItems = [
      { id: "campaigns", label: "Campaigns", icon: Calendar, badge: 3, roles: ["team", "admin"] },
      { id: "events", label: "Events", icon: Award, badge: 2, roles: ["team", "admin"] },
      { id: "innovation-teams", label: "Innovation Teams", icon: Zap, badge: null, roles: ["team", "admin"] },
      { id: "stakeholders", label: "Stakeholders", icon: Users, badge: null, roles: ["team", "admin"] },
    ];

    const analyticsItems = [
      { id: "analytics", label: "Analytics", icon: PieChart, badge: null, roles: ["team", "admin"] },
      { id: "trends", label: "Trends & Insights", icon: TrendingUp, badge: null, roles: ["team", "admin"] },
      { id: "reports", label: "Reports", icon: FileText, badge: null, roles: ["team", "admin"] },
    ];

    const adminItems = [
      { id: "challenge-management", label: "Challenge Management", icon: Target, badge: null, roles: ["admin"] },
      { id: "focus-questions", label: "Focus Questions", icon: FileText, badge: null, roles: ["admin"] },
      { id: "partners", label: "Partners", icon: Briefcase, badge: null, roles: ["admin"] },
      { id: "sectors", label: "Sectors", icon: Shield, badge: null, roles: ["admin"] },
      { id: "organizational-structure", label: "Organizational Structure", icon: Users, badge: null, roles: ["admin"] },
      { id: "expert-assignments", label: "Expert Assignments", icon: UserCheck, badge: null, roles: ["admin"] },
      { id: "relationships", label: "Relationship Overview", icon: Network, badge: null, roles: ["admin"] },
      { id: "user-management", label: "User Management", icon: UserCheck, badge: null, roles: ["admin"] },
      { id: "system-documentation", label: "System Documentation", icon: BookOpen, badge: null, roles: ["all"] },
      { id: "system-settings", label: "System Settings", icon: Settings, badge: null, roles: ["admin", "super_admin"] },
      { id: "system-analytics", label: "System Analytics", icon: BarChart3, badge: null, roles: ["admin"] },
    ];

    const settingsItems = [
      { id: "settings", label: "Settings", icon: Settings, badge: null, roles: ["all"] },
    ];

    return [...baseItems, ...innovatorItems, ...expertItems, ...teamItems, ...analyticsItems, ...adminItems, ...settingsItems];
  };

  const isItemVisible = (item: any) => {
    if (item.roles.includes("all")) return true;
    
    // For users without specific roles, show basic innovator interface
    if (!userProfile || !userProfile.user_roles || userProfile.user_roles.length === 0) {
      return item.roles.includes("innovator");
    }
    
    const userRoles = [];
    if (userProfile?.innovator_profile) userRoles.push("innovator");
    if (userProfile?.expert_profile) userRoles.push("expert");
    if (hasRole("admin")) userRoles.push("admin");
    if (hasRole("team_member")) userRoles.push("team");
    
    return item.roles.some((role: string) => userRoles.includes(role));
  };

  const menuItems = getMenuItems().filter(isItemVisible);

  // Group items by category
  const dashboardItems = menuItems.filter(item => item.id === "dashboard");
  const workflowItems = menuItems.filter(item => 
    ["challenges", "ideas", "evaluations", "expertise"].includes(item.id)
  );
  const managementItems = menuItems.filter(item => 
    ["campaigns", "events", "innovation-teams", "stakeholders"].includes(item.id)
  );
  const analyticsItems = menuItems.filter(item => 
    ["analytics", "trends", "reports", "system-analytics"].includes(item.id)
  );
  const adminItems = menuItems.filter(item => 
    ["challenge-management", "focus-questions", "partners", "sectors", "organizational-structure", "expert-assignments", "relationships", "user-management", "system-documentation", "system-settings"].includes(item.id)
  );
  const settingsItems = menuItems.filter(item => item.id === "settings");

  const renderMenuItems = (items: any[], groupLabel?: string) => {
    if (items.length === 0) return null;
    
    const getLocalizedLabel = (item: any) => {
      // Add Arabic translations for menu items
      const arabicLabels: Record<string, string> = {
        'Dashboard': 'لوحة التحكم',
        'Challenges': 'التحديات',
        'My Ideas': 'أفكاري',
        'Evaluations': 'التقييمات',
        'Expertise Profile': 'ملف الخبرة',
        'Campaigns': 'الحملات',
        'Events': 'الفعاليات',
        'Innovation Teams': 'فرق الابتكار',
        'Stakeholders': 'المعنيين',
        'Analytics': 'التحليلات',
        'Trends & Insights': 'الاتجاهات والرؤى',
        'Reports': 'التقارير',
        'Challenge Management': 'إدارة التحديات',
        'Focus Questions': 'الأسئلة المحورية',
        'Partners': 'الشركاء',
        'Sectors': 'القطاعات',
        'Organizational Structure': 'الهيكل التنظيمي',
        'Expert Assignments': 'تعيين الخبراء',
        'Relationship Overview': 'نظرة عامة على العلاقات',
        'User Management': 'إدارة المستخدمين',
        'System Documentation': 'وثائق النظام',
        'System Settings': 'إعدادات النظام',
        'System Analytics': 'تحليلات النظام',
        'Settings': 'الإعدادات'
      };
      
      return isRTL && language === 'ar' ? arabicLabels[item.label] || item.label : item.label;
    };

    const getLocalizedGroupLabel = (label?: string) => {
      if (!label) return undefined;
      const arabicGroupLabels: Record<string, string> = {
        'Workflow': 'سير العمل',
        'Management': 'الإدارة',
        'Analytics': 'التحليلات',
        'Administration': 'الإدارة العامة'
      };
      
      return isRTL && language === 'ar' ? arabicGroupLabels[label] || label : label;
    };
    
    return (
      <SidebarGroup>
        {groupLabel && (
          <SidebarGroupLabel className={cn(isRTL && 'text-right')}>
            {getLocalizedGroupLabel(groupLabel)}
          </SidebarGroupLabel>
        )}
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    asChild
                    className={cn(
                      isActive ? "bg-primary/10 text-primary font-medium" : "",
                      isRTL && "flex-row-reverse"
                    )}
                  >
                    <button onClick={() => onTabChange(item.id)} className={cn(
                      "w-full",
                      isRTL && "flex-row-reverse"
                    )}>
                      <Icon className="h-4 w-4" />
                      {state !== "collapsed" && (
                        <>
                          <span className={cn(isRTL && "text-right")}>
                            {getLocalizedLabel(item)}
                          </span>
                          {item.badge && (
                            <Badge variant="secondary" className={cn(
                              "bg-primary/10 text-primary",
                              isRTL ? "mr-auto" : "ml-auto"
                            )}>
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  };

  return (
    <Sidebar 
      className={cn(
        state === "collapsed" ? "w-14" : "w-60",
        isRTL && "border-l border-r-0"
      )} 
      collapsible="icon"
      side={isRTL ? "right" : "left"}
    >
      <SidebarContent className={cn(isRTL && "text-right")}>
        {renderMenuItems(dashboardItems)}
        {renderMenuItems(workflowItems, "Workflow")}
        {renderMenuItems(managementItems, "Management")}
        {renderMenuItems(analyticsItems, "Analytics")}
        {renderMenuItems(adminItems, "Administration")}
        {renderMenuItems(settingsItems)}
      </SidebarContent>
    </Sidebar>
  );
};

// Also export as Sidebar for backward compatibility
export { AppSidebar as Sidebar };