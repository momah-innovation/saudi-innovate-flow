import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme, themePresets } from "./theme-provider";
import { Palette, Settings, Monitor, Sun, Moon } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export function ThemeCustomizer() {
  const { t } = useTranslation();
  const { theme, setTheme, applyTheme } = useTheme();

  const handlePresetChange = (presetName: string) => {
    const preset = themePresets[presetName as keyof typeof themePresets];
    if (preset) {
      setTheme(preset);
      applyTheme();
    }
  };

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          {t('themeCustomizer')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="presets" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="presets">{t('presets')}</TabsTrigger>
            <TabsTrigger value="custom">{t('custom')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="presets" className="space-y-4">
            <div>
              <Label htmlFor="theme-preset">{t('themeVariant')}</Label>
              <Select value={theme.variant} onValueChange={(value) => handlePresetChange(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">{t('default')}</SelectItem>
                  <SelectItem value="modern">{t('modern')}</SelectItem>
                  <SelectItem value="minimal">{t('minimal')}</SelectItem>
                  <SelectItem value="vibrant">{t('vibrant')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="color-scheme">{t('colorScheme')}</Label>
              <Select 
                value={theme.colorScheme} 
                onValueChange={(value: 'light' | 'dark' | 'auto') => {
                  setTheme({ colorScheme: value });
                  applyTheme();
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      {t('light')}
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      {t('dark')}
                    </div>
                  </SelectItem>
                  <SelectItem value="auto">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      {t('auto')}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <div>
              <Label htmlFor="border-radius">{t('borderRadius')}</Label>
              <Select 
                value={theme.borderRadius} 
                onValueChange={(value: 'none' | 'sm' | 'md' | 'lg' | 'xl') => {
                  setTheme({ borderRadius: value });
                  applyTheme();
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t('noneThing')}</SelectItem>
                  <SelectItem value="sm">{t('small')}</SelectItem>
                  <SelectItem value="md">{t('medium')}</SelectItem>
                  <SelectItem value="lg">{t('large')}</SelectItem>
                  <SelectItem value="xl">{t('extraLarge')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="animations">{t('animations')}</Label>
              <Switch
                id="animations"
                checked={theme.animations}
                onCheckedChange={(checked) => {
                  setTheme({ animations: checked });
                  applyTheme();
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="compact-mode">{t('compactMode')}</Label>
              <Switch
                id="compact-mode"
                checked={theme.compactMode}
                onCheckedChange={(checked) => {
                  setTheme({ compactMode: checked });
                  applyTheme();
                }}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-4 border-t">
          <Button 
            onClick={() => {
              setTheme(themePresets.default);
              applyTheme();
            }}
            variant="outline" 
            className="w-full"
          >
            {t('resetToDefault')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}