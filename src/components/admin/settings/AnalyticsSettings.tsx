import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useDirection } from "@/components/ui/direction-provider";
import { supabase } from "@/integrations/supabase/client";
import { AnalyticsSettingsProps } from "@/types/admin-settings";

export function AnalyticsSettings({ settings, onSettingChange }: AnalyticsSettingsProps) {
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { isRTL } = useDirection();
  const [newTagCategory, setNewTagCategory] = useState("");
  
  const tagCategories = settings.tag_categories || ["innovation", "digital", "sustainability", "efficiency", "technology", "business", "social", "environmental"];

  const addTagCategory = () => {
    if (newTagCategory.trim() && !tagCategories.includes(newTagCategory)) {
      const updatedCategories = [...tagCategories, newTagCategory.trim()];
      onSettingChange('tag_categories', updatedCategories);
      setNewTagCategory("");
      toast({
        title: t('success'),
        description: "تم إضافة فئة الوسم بنجاح"
      });
    }
  };

  const removeTagCategory = (categoryToRemove: string) => {
    const updatedCategories = tagCategories.filter((category: string) => category !== categoryToRemove);
    onSettingChange('tag_categories', updatedCategories);
    toast({
      title: t('success'),
      description: "تم حذف فئة الوسم بنجاح"
    });
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>{t('systemLists.tagCategories')}</CardTitle>
          <CardDescription>إدارة فئات الوسوم المتاحة للتحليلات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newTagCategory}
              onChange={(e) => setNewTagCategory(e.target.value)}
              placeholder="أضف فئة وسم جديدة"
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addTagCategory} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {tagCategories.map((category: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{t(`tagCategories.${category}`) || category}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeTagCategory(category)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>إعدادات التحليلات</CardTitle>
          <CardDescription>التحكم في جمع وعرض البيانات التحليلية</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <Label htmlFor="dataRetentionDays">فترة الاحتفاظ بالبيانات (بالأيام)</Label>
              <Input
                id="dataRetentionDays"
                type="number"
                value={settings.data_retention_days || 365}
                onChange={(e) => onSettingChange('data_retention_days', parseInt(e.target.value))}
                min="30"
                max="3650"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reportGenerationFrequency">تكرار إنتاج التقارير (بالساعات)</Label>
              <Input
                id="reportGenerationFrequency"
                type="number"
                value={settings.report_generation_frequency || 24}
                onChange={(e) => onSettingChange('report_generation_frequency', parseInt(e.target.value))}
                min="1"
                max="168"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxDashboardWidgets">الحد الأقصى لعناصر لوحة التحكم</Label>
              <Input
                id="maxDashboardWidgets"
                type="number"
                value={settings.max_dashboard_widgets || 12}
                onChange={(e) => onSettingChange('max_dashboard_widgets', parseInt(e.target.value))}
                min="4"
                max="50"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chartRefreshInterval">فترة تحديث الرسوم البيانية (بالثواني)</Label>
              <Input
                id="chartRefreshInterval"
                type="number"
                value={settings.chart_refresh_interval || 300}
                onChange={(e) => onSettingChange('chart_refresh_interval', parseInt(e.target.value))}
                min="30"
                max="3600"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">تتبع سلوك المستخدمين</Label>
              <p className="text-sm text-muted-foreground">جمع بيانات تفاعل المستخدمين لتحسين التجربة</p>
            </div>
            <Switch 
              checked={settings.enable_user_behavior_tracking !== false}
              onCheckedChange={(checked) => onSettingChange('enable_user_behavior_tracking', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">التحليلات في الوقت الفعلي</Label>
              <p className="text-sm text-muted-foreground">عرض البيانات التحليلية فور حدوثها</p>
            </div>
            <Switch 
              checked={settings.enable_real_time_analytics !== false}
              onCheckedChange={(checked) => onSettingChange('enable_real_time_analytics', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">التقارير التلقائية</Label>
              <p className="text-sm text-muted-foreground">إنتاج وإرسال التقارير بشكل تلقائي</p>
            </div>
            <Switch 
              checked={settings.enable_automatic_reports !== false}
              onCheckedChange={(checked) => onSettingChange('enable_automatic_reports', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">تصدير البيانات</Label>
              <p className="text-sm text-muted-foreground">السماح بتصدير البيانات التحليلية</p>
            </div>
            <Switch 
              checked={settings.enable_data_export !== false}
              onCheckedChange={(checked) => onSettingChange('enable_data_export', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">إخفاء هوية البيانات</Label>
              <p className="text-sm text-muted-foreground">إزالة المعلومات الشخصية من التحليلات</p>
            </div>
            <Switch 
              checked={settings.enable_data_anonymization !== false}
              onCheckedChange={(checked) => onSettingChange('enable_data_anonymization', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}