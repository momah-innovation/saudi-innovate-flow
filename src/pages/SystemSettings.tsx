import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Database, List, Bot, Palette, Zap, Filter, Languages } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { UnifiedSettingsManager } from "@/components/admin/settings/UnifiedSettingsManager";
import TranslationManagement from "@/components/admin/TranslationManagement";
import { useDirection } from "@/components/ui/direction-provider";
import { useTranslation } from "@/hooks/useAppTranslation";

const SystemSettings = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const { isRTL } = useDirection();

  const categories = [
    { key: "all", label: t('all'), icon: Database },
    { key: "general", label: t('general'), icon: Settings },
    { key: "challenges", label: isRTL ? 'التحديات' : 'Challenges', icon: Settings },
    { key: "ideas", label: isRTL ? 'الأفكار' : 'Ideas', icon: Settings },
    { key: "events", label: isRTL ? 'الفعاليات' : 'Events', icon: Settings },
    { key: "campaigns", label: isRTL ? 'الحملات' : 'Campaigns', icon: Settings },
    { key: "partners", label: isRTL ? 'الشركاء' : 'Partners', icon: Settings },
    { key: "opportunities", label: isRTL ? 'الفرص' : 'Opportunities', icon: Settings },
    { key: "analytics", label: isRTL ? 'التحليلات' : 'Analytics', icon: Settings },
    { key: "security", label: t('security'), icon: Settings },
    { key: "ai", label: isRTL ? 'الذكاء الاصطناعي' : 'AI', icon: Bot },
    { key: "ui", label: isRTL ? 'واجهة المستخدم' : 'UI', icon: Palette },
    { key: "performance", label: isRTL ? 'الأداء' : 'Performance', icon: Zap },
    { key: "translations", label: isRTL ? 'إدارة الترجمات' : 'Translation Management', icon: Languages },
  ];

  return (
    <AppShell>
      <div className={`container mx-auto p-6 space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        {/* Header */}
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="text-3xl font-bold">{t('systemSettings')}</h1>
          <p className="text-muted-foreground">{t('systemSettingsDescription')}</p>
        </div>

        {/* Settings Management */}
        <Card>
          <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              {t('system_settings_page.title')}
            </CardTitle>
            <CardDescription>
              {isRTL 
                ? 'إدارة شاملة لجميع إعدادات النظام مع دعم كامل للغة العربية والترجمة والتحديث المباشر للقاعدة' 
                : 'Comprehensive management of all system settings with full Arabic support, internationalization, and live database updates'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Category Filter Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
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
              {t('system_settings_page.shared_settings')}
            </CardTitle>
            <CardDescription>
              {isRTL 
                ? 'الإعدادات التي تؤثر على أنظمة متعددة ويتم توحيدها لضمان الاتساق'
                : 'Settings that affect multiple systems and are unified to ensure consistency'
              }
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