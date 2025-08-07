import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Database, List, Bot, Palette, Zap, Filter, Languages } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { UnifiedSettingsManager } from "@/components/admin/settings/UnifiedSettingsManager";
import TranslationManagement from "@/components/admin/TranslationManagement";
import { useDirection } from "@/components/ui/direction-provider";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { usePerformanceMonitor } from "@/hooks/performance/use-optimization";
import { useToast } from "@/hooks/use-toast";
import { useSystemSettings } from "@/contexts/SystemSettingsContext";
import { useDebounce } from "@/hooks/useDebounce";
import { logger } from "@/utils/logger";
const SystemSettings = () => {
  const { t } = useUnifiedTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { isRTL } = useDirection();
  
  // Authentication and permissions
  const { userProfile, hasRole } = useAuth();
  const { permissions } = useRoleAccess();
  
  // Essential hooks for system settings functionality
  const { toast } = useToast();
  const systemSettings = useSystemSettings();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const performanceMonitor = usePerformanceMonitor('SystemSettings');
  
  // Track admin access to system settings
  useEffect(() => {
    if (userProfile && permissions.canManageSystem) {
      // Log admin access for security audit
      logger.info('Admin system settings accessed', {
        userId: userProfile.id,
        component: 'SystemSettings',
        action: 'page_access'
      });
    }
  }, [userProfile, permissions.canManageSystem]);
  
  // Track tab changes for analytics
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Simple analytics tracking
    logger.info('System settings tab changed', {
      userId: userProfile?.id,
      component: 'SystemSettings',
      action: 'tab_change',
      type: tab
    });
  };
  
  // Early return if no permissions
  if (!permissions.canManageSystem) {
    return (
      <AppShell>
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-2xl font-bold mb-2">{t('accessDenied', 'Access Denied')}</h2>
              <p className="text-muted-foreground">{t('adminPermissionRequired', 'System administrator permissions required')}</p>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  const categories = [
    { key: "all", label: t('all', 'All'), icon: Database },
    { key: "general", label: t('general', 'General'), icon: Settings },
    { key: "challenges", label: t('system_settings_page.challenges', 'Challenges'), icon: Settings },
    { key: "ideas", label: t('system_settings_page.ideas', 'Ideas'), icon: Settings },
    { key: "events", label: t('settings.category.events', 'Events'), icon: Settings },
    { key: "campaigns", label: t('system_settings_page.campaigns', 'Campaigns'), icon: Settings },
    { key: "partners", label: t('system_settings_page.partners', 'Partners'), icon: Settings },
    { key: "opportunities", label: t('system_settings_page.opportunities', 'Opportunities'), icon: Settings },
    { key: "analytics", label: t('system_settings_page.analytics', 'Analytics'), icon: Settings },
    { key: "security", label: t('security', 'Security'), icon: Settings },
    { key: "ai", label: t('system_settings_page.ai', 'AI'), icon: Bot },
    { key: "ui", label: t('system_settings_page.ui', 'UI'), icon: Palette },
    { key: "performance", label: t('system_settings_page.performance', 'Performance'), icon: Zap },
    { key: "translations", label: t('system_settings_page.translation_management', 'Translation Management'), icon: Languages },
  ];

  return (
    <AppShell>
      <div className={`container mx-auto p-6 space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        {/* Header */}
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="text-3xl font-bold">{t('systemSettings', 'System Settings')}</h1>
          <p className="text-muted-foreground">{t('systemSettingsDescription', 'Manage and configure system-wide settings and preferences')}</p>
        </div>

        {/* Settings Management */}
        <Card>
          <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              {t('system_settings_page.title', 'System Configuration')}
            </CardTitle>
            <CardDescription>
              {t('systemSettingsDescription', 'Manage and configure system-wide settings and preferences')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Category Filter Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
              <TabsList className={`grid w-full grid-cols-4 lg:grid-cols-8 xl:grid-cols-13 ${isRTL ? 'text-right' : 'text-left'}`}>
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category.key} 
                    value={category.key}
                    className={`flex items-center gap-1 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <category.icon className="w-3 h-3" />
                    <span className="hidden sm:inline">{category.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Unified Settings Manager for each category */}
              {categories.map((category) => (
                <TabsContent key={category.key} value={category.key}>
                  {category.key === 'translations' ? (
                    <TranslationManagement />
                  ) : (
                    <UnifiedSettingsManager 
                      category={category.key === 'all' ? undefined : category.key}
                      showSharedOnly={false}
                    />
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Shared Settings Information */}
        <Card>
          <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
            <CardTitle className="flex items-center gap-2">
              <List className="w-5 h-5" />
              {t('system_settings_page.shared_settings', 'Shared Settings')}
            </CardTitle>
            <CardDescription>
              {t('sharedSettingsDescription', 'Settings that are shared across multiple system components')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UnifiedSettingsManager showSharedOnly={true} />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default SystemSettings;