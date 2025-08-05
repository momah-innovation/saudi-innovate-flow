import React from 'react';
import { useTheme, useSpecializedTheme, GlobalTheme, SpecializedTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crown, Building2, Users, Lightbulb, BarChart3, Handshake, Trophy, Rocket, Palette, Monitor, Sun, Moon, Contrast, Printer } from 'lucide-react';

export function ThemeShowcase() {
  const {
    globalTheme,
    setGlobalTheme,
    specializedTheme,
    setSpecializedTheme,
    isDark,
    isHighContrast,
    systemPrefersDark,
    respectSystemPreference,
    setRespectSystemPreference,
    resetToDefaults,
  } = useTheme();

  const globalThemes: { value: GlobalTheme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
    { value: 'high-contrast', label: 'High Contrast', icon: <Contrast className="w-4 h-4" /> },
    { value: 'print', label: 'Print', icon: <Printer className="w-4 h-4" /> },
  ];

  const specializedThemes: { value: SpecializedTheme; label: string; description: string; icon: any; color: string }[] = [
    { value: null, label: 'Default', description: 'Standard application theme', icon: Palette, color: 'from-gray-500 to-gray-700' },
    { value: 'admin', label: 'Admin', description: 'Professional, data-focused interface', icon: Building2, color: 'from-slate-600 to-blue-600' },
    { value: 'events', label: 'Events', description: 'Vibrant, engaging event theme', icon: Trophy, color: 'from-orange-500 to-red-500' },
    { value: 'challenges', label: 'Challenges', description: 'Competitive, energetic design', icon: Crown, color: 'from-teal-500 to-green-500' },
    { value: 'ideas', label: 'Ideas', description: 'Creative, inspiring innovation theme', icon: Lightbulb, color: 'from-purple-500 to-indigo-500' },
    { value: 'evaluation', label: 'Evaluation', description: 'Analytical, precise assessment theme', icon: BarChart3, color: 'from-blue-500 to-cyan-500' },
    { value: 'partners', label: 'Partners', description: 'Professional, trustworthy partnership theme', icon: Handshake, color: 'from-green-500 to-emerald-500' },
    { value: 'opportunities', label: 'Opportunities', description: 'Growth-focused success theme', icon: Rocket, color: 'from-yellow-500 to-orange-500' },
    { value: 'experts', label: 'Experts', description: 'Knowledge, authority-focused theme', icon: Users, color: 'from-indigo-500 to-purple-500' },
  ];

  const enhancedThemes = [
    { id: 'executive', name: 'Executive', icon: Crown, color: 'from-slate-800 to-amber-600', description: 'Premium leadership interface' },
    { id: 'operational', name: 'Operational', icon: Building2, color: 'from-blue-600 to-blue-800', description: 'Efficient workflow management' },
    { id: 'citizen', name: 'Citizen', icon: Users, color: 'from-emerald-600 to-teal-600', description: 'Accessible public interface' },
    { id: 'innovation', name: 'Innovation', icon: Lightbulb, color: 'from-purple-600 to-violet-600', description: 'Research & development' },
    { id: 'partnerships', name: 'Partnerships', icon: Handshake, color: 'from-blue-500 to-cyan-500', description: 'Collaboration focus' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, color: 'from-blue-600 to-green-600', description: 'Data visualization' },
    { id: 'achievements', name: 'Achievements', icon: Trophy, color: 'from-yellow-500 to-orange-500', description: 'Success & recognition' },
  ] as const;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-3xl font-bold">
          <Palette className="w-8 h-8 text-primary" />
          Design System Showcase
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our comprehensive multi-layered theming system with global themes, 
          specialized feature themes, and component-level styling options.
        </p>
      </div>

      <Tabs defaultValue="enhanced" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="enhanced">Enhanced Themes</TabsTrigger>
          <TabsTrigger value="global">Global Themes</TabsTrigger>
          <TabsTrigger value="specialized">Legacy Themes</TabsTrigger>
          <TabsTrigger value="components">Component Showcase</TabsTrigger>
          <TabsTrigger value="settings">Theme Settings</TabsTrigger>
        </TabsList>

        {/* Enhanced Themes Tab */}
        <TabsContent value="enhanced" className="space-y-6">
          <div className="text-center space-y-4 mb-8">
            <div className="flex items-center justify-center gap-3">
              <Rocket className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Professional Design System
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Enhanced themes for the Ruwād Innovation Platform with Saudi Vision 2030 integration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {enhancedThemes.map((theme) => {
              const Icon = theme.icon;
              const isActive = false; // Theme selection logic to be implemented
              
              return (
                <Card 
                  key={theme.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                    isActive ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
                  }`}
                  onClick={() => setSpecializedTheme(theme.id as any)}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${theme.color} flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{theme.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {theme.description}
                      </p>
                    </div>
                    {isActive && (
                      <Badge className="bg-primary text-primary-foreground">
                        Active
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Component Showcase for Active Theme */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Component Showcase</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Buttons */}
              <div className="space-y-4">
                <h4 className="font-semibold">Button Variants</h4>
                <div className="flex flex-wrap gap-4">
                  <Button className="btn-executive">Executive Button</Button>
                  <Button className="btn-operational">Operational Button</Button>
                  <Button className="btn-citizen">Citizen Button</Button>
                  <Button className="btn-innovation">Innovation Button</Button>
                </div>
              </div>

              {/* Cards */}
              <div className="space-y-4">
                <h4 className="font-semibold">Card Variants</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="card-executive">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Crown className="w-5 h-5" />
                        <span className="font-semibold">Executive</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Premium interface</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="card-operational">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-5 h-5" />
                        <span className="font-semibold">Operational</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Workflow focus</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="card-citizen">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5" />
                        <span className="font-semibold">Citizen</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Public interface</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="card-innovation">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-5 h-5" />
                        <span className="font-semibold">Innovation</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Creative design</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Badges */}
              <div className="space-y-4">
                <h4 className="font-semibold">Badge Variants</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge className="badge-executive">Executive</Badge>
                  <Badge className="badge-status-active">Active</Badge>
                  <Badge className="badge-status-pending">Pending</Badge>
                  <Badge className="badge-priority-high">High Priority</Badge>
                  <Badge className="badge-priority-medium">Medium</Badge>
                  <Badge className="badge-priority-low">Low Priority</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Global Themes Tab */}
        <TabsContent value="global" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Theme Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {globalThemes.map((theme) => (
                  <Button
                    key={theme.value}
                    variant={globalTheme === theme.value ? "default" : "outline"}
                    onClick={() => setGlobalTheme(theme.value)}
                    className="h-16 flex-col gap-2"
                  >
                    {theme.icon}
                    {theme.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Theme Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Active Global Theme</Label>
                  <Badge variant="secondary" className="text-sm">
                    {globalTheme}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label>Theme Properties</Label>
                  <div className="text-sm space-y-1">
                    <div>Dark Mode: {isDark ? '✅' : '❌'}</div>
                    <div>High Contrast: {isHighContrast ? '✅' : '❌'}</div>
                    <div>System Prefers Dark: {systemPrefersDark ? '✅' : '❌'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Integration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="respect-system">Follow System Theme</Label>
                  <Switch
                    id="respect-system"
                    checked={respectSystemPreference}
                    onCheckedChange={setRespectSystemPreference}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  When enabled, the theme will automatically switch based on your system's 
                  dark/light mode preference.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Specialized Themes Tab */}
        <TabsContent value="specialized" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Specialized Theme Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {specializedThemes.map((theme) => (
                  <div key={theme.value || 'default'} className="flex items-center space-x-4">
                    <Button
                      variant={specializedTheme === theme.value ? "default" : "outline"}
                      onClick={() => setSpecializedTheme(theme.value)}
                      className="w-32"
                    >
                      {theme.label}
                    </Button>
                    <div className="flex-1">
                      <div className="font-medium">{theme.label}</div>
                      <div className="text-sm text-muted-foreground">{theme.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {specializedTheme && (
            <Card className={`theme-${specializedTheme}`}>
              <CardHeader>
                <CardTitle>Preview: {specializedThemes.find(t => t.value === specializedTheme)?.label} Theme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <Button className={`btn-theme-${specializedTheme}`}>
                    Primary Button
                  </Button>
                  <Button variant="outline">
                    Outline Button
                  </Button>
                  <Button variant="secondary">
                    Secondary Button
                  </Button>
                </div>
                <Card className={`card-theme-${specializedTheme}`}>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Themed Card Component</h4>
                    <p className="text-sm text-muted-foreground">
                      This card demonstrates the {specializedTheme} theme styling.
                    </p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Component Examples Tab */}
        <TabsContent value="components" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Form Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="demo-input">Input Field</Label>
                  <Input id="demo-input" placeholder="Enter text here..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="demo-select">Select Dropdown</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Badges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className="badge-theme-status-success">Success</Badge>
                  <Badge className="badge-theme-status-warning">Warning</Badge>
                  <Badge className="badge-theme-status-error">Error</Badge>
                  <Badge className="badge-theme-status-info">Info</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Themed Component Variations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {specializedThemes.slice(1).map((theme) => (
                  <div key={theme.value} className="space-y-2">
                    <h4 className="font-semibold">{theme.label} Theme Components</h4>
                    <div className="flex gap-4 items-center">
                      <Button className={`btn-theme-${theme.value}`} size="sm">
                        {theme.label} Button
                      </Button>
                      <Badge className={`badge-theme-${theme.value}`}>
                        {theme.label} Badge
                      </Badge>
                      <div className={`card-theme-${theme.value} p-3 rounded border text-sm`}>
                        {theme.label} Card Style
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Current Configuration</h4>
                  <div className="text-sm space-y-1 bg-muted p-3 rounded">
                    <div>Global Theme: <strong>{globalTheme}</strong></div>
                    <div>Specialized Theme: <strong>{specializedTheme || 'None'}</strong></div>
                    <div>System Preference: <strong>{respectSystemPreference ? 'Enabled' : 'Disabled'}</strong></div>
                    <div>System Dark Mode: <strong>{systemPrefersDark ? 'Yes' : 'No'}</strong></div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={resetToDefaults} variant="outline">
                    Reset to Defaults
                  </Button>
                  <Button onClick={() => {
                    setGlobalTheme('dark');
                    setSpecializedTheme('admin');
                  }}>
                    Apply Dark Admin Theme
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Quick Theme Combinations</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => { setGlobalTheme('light'); setSpecializedTheme('events'); }}
                    className="justify-start"
                  >
                    Light + Events Theme
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => { setGlobalTheme('dark'); setSpecializedTheme('challenges'); }}
                    className="justify-start"
                  >
                    Dark + Challenges Theme
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => { setGlobalTheme('light'); setSpecializedTheme('admin'); }}
                    className="justify-start"
                  >
                    Light + Admin Theme
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => { setGlobalTheme('high-contrast'); setSpecializedTheme(null); }}
                    className="justify-start"
                  >
                    High Contrast Mode
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}