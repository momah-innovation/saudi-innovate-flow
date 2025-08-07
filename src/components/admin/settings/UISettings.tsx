import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useDirection } from "@/components/ui/direction-provider";

interface UISettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function UISettings({ settings, onSettingChange }: UISettingsProps) {
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { isRTL } = useDirection();
  const [newTheme, setNewTheme] = useState("");
  const [newComponentVariant, setNewComponentVariant] = useState("");
  
  const themes = settings.ui_themes || ["light", "dark", "system", "blue", "green", "purple"];
  const componentVariants = settings.component_variants || ["default", "outline", "ghost", "link", "destructive"];

  const addTheme = () => {
    if (newTheme.trim() && !themes.includes(newTheme)) {
      const updatedThemes = [...themes, newTheme.trim()];
      onSettingChange('ui_themes', updatedThemes);
      setNewTheme("");
      toast({
        title: t('success'),
        description: t('itemAddedSuccessfully')
      });
    }
  };

  const removeTheme = (themeToRemove: string) => {
    const updatedThemes = themes.filter((theme: string) => theme !== themeToRemove);
    onSettingChange('ui_themes', updatedThemes);
    toast({
      title: t('success'),
      description: t('itemRemovedSuccessfully')
    });
  };

  const addComponentVariant = () => {
    if (newComponentVariant.trim() && !componentVariants.includes(newComponentVariant)) {
      const updatedVariants = [...componentVariants, newComponentVariant.trim()];
      onSettingChange('component_variants', updatedVariants);
      setNewComponentVariant("");
      toast({
        title: t('success'),
        description: t('itemAddedSuccessfully')
      });
    }
  };

  const removeComponentVariant = (variantToRemove: string) => {
    const updatedVariants = componentVariants.filter((variant: string) => variant !== variantToRemove);
    onSettingChange('component_variants', updatedVariants);
    toast({
      title: t('success'),
      description: t('itemRemovedSuccessfully')
    });
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Palette className="w-5 h-5" />
            {isRTL ? 'موضوعات واجهة المستخدم' : 'UI Themes'}
          </CardTitle>
          <CardDescription>
            {isRTL ? 'إدارة موضوعات واجهة المستخدم المتاحة' : 'Manage available UI themes'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newTheme}
              onChange={(e) => setNewTheme(e.target.value)}
              placeholder={isRTL ? "أضف موضوع جديد" : "Add new theme"}
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addTheme} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {themes.map((theme: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{t(`themes.${theme}`) || theme}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeTheme(theme)}
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
          <CardTitle>{isRTL ? 'أشكال المكونات' : 'Component Variants'}</CardTitle>
          <CardDescription>
            {isRTL ? 'إدارة أشكال المكونات المتاحة' : 'Manage available component variants'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newComponentVariant}
              onChange={(e) => setNewComponentVariant(e.target.value)}
              placeholder={isRTL ? "أضف شكل مكون جديد" : "Add new component variant"}
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addComponentVariant} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {componentVariants.map((variant: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{t(`componentVariants.${variant}`) || variant}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeComponentVariant(variant)}
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
          <CardTitle>{isRTL ? 'إعدادات واجهة المستخدم' : 'UI Settings'}</CardTitle>
          <CardDescription>
            {isRTL ? 'التحكم في إعدادات واجهة المستخدم' : 'Control user interface settings'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <Label htmlFor="defaultTheme">
                {isRTL ? 'الموضوع الافتراضي' : 'Default Theme'}
              </Label>
              <Select 
                value={settings.defaultTheme || 'system'} 
                onValueChange={(value) => onSettingChange('defaultTheme', value)}
              >
                <SelectTrigger className={isRTL ? 'text-right' : 'text-left'}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((theme: string) => (
                    <SelectItem key={theme} value={theme}>
                      {t(`themes.${theme}`) || theme}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultDirection">
                {isRTL ? 'اتجاه النص الافتراضي' : 'Default Text Direction'}
              </Label>
              <Select 
                value={settings.defaultDirection || 'auto'} 
                onValueChange={(value) => onSettingChange('defaultDirection', value)}
              >
                <SelectTrigger className={isRTL ? 'text-right' : 'text-left'}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">{isRTL ? 'تلقائي' : 'Auto'}</SelectItem>
                  <SelectItem value="ltr">{isRTL ? 'من اليسار إلى اليمين' : 'Left to Right'}</SelectItem>
                  <SelectItem value="rtl">{isRTL ? 'من اليمين إلى اليسار' : 'Right to Left'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sidebarWidth">
                {isRTL ? 'عرض الشريط الجانبي (بكسل)' : 'Sidebar Width (px)'}
              </Label>
              <Input
                id="sidebarWidth"
                type="number"
                min="200"
                max="400"
                value={settings.sidebarWidth || 280}
                onChange={(e) => onSettingChange('sidebarWidth', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxContentWidth">
                {isRTL ? 'أقصى عرض للمحتوى (بكسل)' : 'Max Content Width (px)'}
              </Label>
              <Input
                id="maxContentWidth"
                type="number"
                min="800"
                max="2000"
                value={settings.maxContentWidth || 1200}
                onChange={(e) => onSettingChange('maxContentWidth', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">
                {isRTL ? 'تفعيل الوضع المظلم' : 'Enable Dark Mode'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'السماح للمستخدمين بتفعيل الوضع المظلم' : 'Allow users to enable dark mode'}
              </p>
            </div>
            <Switch
              checked={settings.enableDarkMode !== false}
              onCheckedChange={(checked) => onSettingChange('enableDarkMode', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">
                {isRTL ? 'تخصيص الموضوعات' : 'Theme Customization'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'السماح للمستخدمين بتخصيص الموضوعات' : 'Allow users to customize themes'}
              </p>
            </div>
            <Switch
              checked={settings.enableThemeCustomization || false}
              onCheckedChange={(checked) => onSettingChange('enableThemeCustomization', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">
                {isRTL ? 'الشريط الجانبي القابل للطي' : 'Collapsible Sidebar'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'السماح بطي وإظهار الشريط الجانبي' : 'Allow collapsing and expanding the sidebar'}
              </p>
            </div>
            <Switch
              checked={settings.enableCollapsibleSidebar !== false}
              onCheckedChange={(checked) => onSettingChange('enableCollapsibleSidebar', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">
                {isRTL ? 'الرسوم المتحركة' : 'Animations'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'تفعيل الرسوم المتحركة في الواجهة' : 'Enable animations in the interface'}
              </p>
            </div>
            <Switch
              checked={settings.enableAnimations !== false}
              onCheckedChange={(checked) => onSettingChange('enableAnimations', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}