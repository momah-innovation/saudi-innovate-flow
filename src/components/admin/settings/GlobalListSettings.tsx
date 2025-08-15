import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Trash2, Plus, List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useDirection } from "@/components/ui/direction-provider";
import { useSettings } from "@/contexts/SettingsContext";
import type { AllSystemSettings } from "@/contexts/SettingsContext";

interface GlobalListSettingsProps {}

export function GlobalListSettings({}: GlobalListSettingsProps) {
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { isRTL } = useDirection();
  const [editingList, setEditingList] = useState<string | null>(null);
  const [newItem, setNewItem] = useState("");
  const { updateSetting, ...settings } = useSettings();

  // Global system lists with standardized English values for setting_key.setting_value translation
  const globalLists = {
    // Language and localization
    supported_languages: settings.supported_languages || ["english", "arabic", "hebrew", "persian"],
    ui_themes: settings.ui_themes || ["light", "dark", "auto"],
    currency_codes: settings.currency_codes || ["SAR", "USD", "EUR", "GBP"],
    
    // Time and frequency
    time_zones: settings.time_zones || ["asia_riyadh", "utc", "asia_dubai", "europe_london"],
    frequency_options: settings.frequency_options || ["daily", "weekly", "monthly", "yearly"],
    
    // File and data formats
    file_formats: settings.file_formats || ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "jpg", "png"],
    export_formats: settings.export_formats || ["csv", "excel", "pdf", "json", "xml"],
    
    // System-wide classifications
    sensitivity_levels: settings.sensitivityLevels || ["normal", "sensitive", "confidential", "top_secret"],
    priority_levels: settings.priorityLevels || ["low", "medium", "high", "urgent", "critical"],
    
    // User interface
    color_schemes: settings.color_schemes || ["blue", "green", "purple", "orange", "red"],
    font_sizes: settings.font_sizes || ["small", "medium", "large", "extra_large"],
    
    // Communication
    notification_channels: settings.notification_channels || ["email", "sms", "push", "in_app"],
    communication_methods: settings.communication_methods || ["email", "phone", "video_call", "in_person"],
    
    // System administration
    log_levels: settings.log_levels || ["debug", "info", "warning", "error", "critical"],
    backup_types: settings.backup_types || ["full", "incremental", "differential"],
    
    // Generic classifications
    status_types: settings.status_types || ["active", "inactive", "pending", "completed", "cancelled"],
    rating_scales: settings.rating_scales || ["one_to_five", "one_to_ten", "percentage", "letter_grade"],
  };

  const listLabels = {
    supported_languages: t('admin.settings.supported_languages') || "Supported Languages",
    ui_themes: t('admin.settings.ui_themes') || "UI Themes", 
    currency_codes: t('admin.settings.currency_codes') || "Currency Codes",
    time_zones: t('admin.settings.time_zones') || "Time Zones",
    frequency_options: t('admin.settings.frequency_options') || "Frequency Options",
    file_formats: t('admin.settings.file_formats') || "File Formats",
    export_formats: t('admin.settings.export_formats') || "Export Formats",
    sensitivity_levels: t('admin.settings.sensitivity_levels') || "Sensitivity Levels",
    priority_levels: t('admin.settings.priority_levels') || "Priority Levels",
    color_schemes: t('admin.settings.color_schemes') || "Color Schemes",
    font_sizes: t('admin.settings.font_sizes') || "Font Sizes",
    notification_channels: t('admin.settings.notification_channels') || "Notification Channels",
    communication_methods: t('admin.settings.communication_methods') || "Communication Methods",
    log_levels: t('admin.settings.log_levels') || "Log Levels",
    backup_types: t('admin.settings.backup_types') || "Backup Types",
    status_types: t('admin.settings.status_types') || "Status Types",
    rating_scales: t('admin.settings.rating_scales') || "Rating Scales",
  };

  // Helper function to get translated item using setting_key.setting_value pattern
  const getTranslatedItem = (item: string, listKey: string) => {
    // Use setting_key.setting_value pattern: e.g., "ui_themes.dark", "status_types.active"
    const translationKey = `${listKey}.${item}`;
    const translated = t(translationKey);
    
    // If translation exists (different from key), use it; otherwise use formatted English
    if (translated !== translationKey) {
      return translated;
    }
    
    // Fallback: format English value (replace underscores with spaces, capitalize)
    return item.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Map UI keys to actual setting keys
  const settingKeyMap: Record<string, keyof AllSystemSettings> = {
    supported_languages: 'supported_languages',
    ui_themes: 'ui_themes',
    currency_codes: 'currency_codes',
    time_zones: 'time_zones',
    frequency_options: 'frequency_options',
    file_formats: 'file_formats',
    export_formats: 'export_formats',
    sensitivity_levels: 'sensitivityLevels',
    priority_levels: 'priorityLevels',
    color_schemes: 'color_schemes',
    font_sizes: 'font_sizes',
    notification_channels: 'notification_channels',
    communication_methods: 'communication_methods',
    log_levels: 'log_levels',
    backup_types: 'backup_types',
    status_types: 'status_types',
    rating_scales: 'rating_scales',
  };

  const addItem = async (listKey: string) => {
    if (!newItem.trim()) {
      toast({
        title: t('error'),
        description: isRTL ? "يرجى إدخال عنصر صحيح" : "Please enter a valid item",
        variant: "destructive"
      });
      return;
    }

    const currentList = globalLists[listKey as keyof typeof globalLists] || [];
    if (currentList.includes(newItem.trim())) {
      toast({
        title: t('error'),
        description: isRTL ? "هذا العنصر موجود بالفعل" : "This item already exists",
        variant: "destructive"
      });
      return;
    }

    try {
      const updatedList = [...currentList, newItem.trim()];
      const settingKey = settingKeyMap[listKey] as keyof AllSystemSettings;
      if (settingKey) {
        await updateSetting(settingKey, updatedList);
        setNewItem("");
        setEditingList(null);
        
        toast({
          title: t('success'),
          description: t('itemAddedSuccessfully')
        });
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: isRTL ? "فشل في إضافة العنصر" : "Failed to add item",
        variant: "destructive"
      });
    }
  };

  const removeItem = async (listKey: string, itemIndex: number) => {
    try {
      const currentList = globalLists[listKey as keyof typeof globalLists] || [];
      const updatedList = currentList.filter((_, index) => index !== itemIndex);
      const settingKey = settingKeyMap[listKey] as keyof AllSystemSettings;
      if (settingKey) {
        await updateSetting(settingKey, updatedList);
        
        toast({
          title: t('success'),
          description: t('itemRemovedSuccessfully')
        });
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: isRTL ? "فشل في حذف العنصر" : "Failed to remove item",
        variant: "destructive"
      });
    }
  };

  const renderList = (listKey: string, items: string[]) => (
    <Card key={listKey}>
      <CardHeader>
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <CardTitle className="text-lg">{listLabels[listKey as keyof typeof listLabels]}</CardTitle>
            <CardDescription>
              {isRTL ? `إدارة قائمة ${listLabels[listKey as keyof typeof listLabels]}` : `Manage ${listLabels[listKey as keyof typeof listLabels]} list`}
            </CardDescription>
          </div>
          <Badge variant="outline">{items.length} {isRTL ? 'عنصر' : 'items'}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className={`flex items-center justify-between p-2 bg-muted rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="flex-1">{getTranslatedItem(item, listKey)}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(listKey, index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {editingList === listKey ? (
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={isRTL ? "أدخل عنصر جديد..." : "Enter new item..."}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addItem(listKey);
                } else if (e.key === 'Escape') {
                  setEditingList(null);
                  setNewItem("");
                }
              }}
              autoFocus
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={() => addItem(listKey)} size="sm">
              {isRTL ? 'إضافة' : 'Add'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setEditingList(null);
                setNewItem("");
              }}
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditingList(listKey)}
            className="w-full"
          >
            <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {isRTL ? 'إضافة عنصر جديد' : 'Add New Item'}
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <List className="w-5 h-5" />
            {isRTL ? 'إدارة القوائم العامة' : 'Global Lists Management'}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? 'إدارة القوائم العامة والإعدادات النظامية التي تؤثر على جميع أجزاء النظام'
              : 'Manage global lists and system-wide settings that affect all parts of the platform'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="language-localization">
              <AccordionTrigger className={isRTL ? 'text-right' : 'text-left'}>
                {isRTL ? 'اللغة والتوطين' : 'Language & Localization'}
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {renderList('supported_languages', globalLists.supported_languages)}
                {renderList('ui_themes', globalLists.ui_themes)}
                {renderList('currency_codes', globalLists.currency_codes)}
                {renderList('time_zones', globalLists.time_zones)}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="file-data">
              <AccordionTrigger className={isRTL ? 'text-right' : 'text-left'}>
                {isRTL ? 'الملفات والبيانات' : 'Files & Data'}
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {renderList('file_formats', globalLists.file_formats)}
                {renderList('export_formats', globalLists.export_formats)}
                {renderList('frequency_options', globalLists.frequency_options)}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="classification">
              <AccordionTrigger className={isRTL ? 'text-right' : 'text-left'}>
                {isRTL ? 'التصنيفات العامة' : 'General Classifications'}
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {renderList('sensitivity_levels', globalLists.sensitivity_levels)}
                {renderList('priority_levels', globalLists.priority_levels)}
                {renderList('status_types', globalLists.status_types)}
                {renderList('rating_scales', globalLists.rating_scales)}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="ui-appearance">
              <AccordionTrigger className={isRTL ? 'text-right' : 'text-left'}>
                {isRTL ? 'الواجهة والمظهر' : 'UI & Appearance'}
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {renderList('color_schemes', globalLists.color_schemes)}
                {renderList('font_sizes', globalLists.font_sizes)}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="communication">
              <AccordionTrigger className={isRTL ? 'text-right' : 'text-left'}>
                {isRTL ? 'التواصل والإشعارات' : 'Communication & Notifications'}
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {renderList('notification_channels', globalLists.notification_channels)}
                {renderList('communication_methods', globalLists.communication_methods)}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="system-admin">
              <AccordionTrigger className={isRTL ? 'text-right' : 'text-left'}>
                {isRTL ? 'إدارة النظام' : 'System Administration'}
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {renderList('log_levels', globalLists.log_levels)}
                {renderList('backup_types', globalLists.backup_types)}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}