import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme, themePresets } from "./theme-provider";
import { Palette, Settings, Monitor, Sun, Moon } from "lucide-react";

export function ThemeCustomizer() {
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
          Theme Customizer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="presets" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          
          <TabsContent value="presets" className="space-y-4">
            <div>
              <Label htmlFor="theme-preset">Theme Variant</Label>
              <Select value={theme.variant} onValueChange={(value) => handlePresetChange(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="vibrant">Vibrant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="color-scheme">Color Scheme</Label>
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
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="auto">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      Auto
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <div>
              <Label htmlFor="border-radius">Border Radius</Label>
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
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                  <SelectItem value="xl">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="animations">Animations</Label>
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
              <Label htmlFor="compact-mode">Compact Mode</Label>
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
            Reset to Default
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}