import React, { useState } from 'react';
import { 
  Palette, Eye, Type, Layout, Zap, Copy, Check, 
  Sun, Moon, ChevronDown, ChevronRight, Star,
  Heart, AlertCircle, CheckCircle, Info, X,
  Sparkles, Award, Clock, Users, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const DesignSystem = () => {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
      duration: 2000,
    });
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const ColorToken = ({ name, className, description }: { name: string, className: string, description: string }) => (
    <div className="group relative">
      <div 
        className={cn("h-16 w-full rounded-lg border cursor-pointer transition-all hover:scale-105", className)}
        onClick={() => copyToClipboard(className, name)}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {copiedToken === className ? (
            <Check className="h-5 w-5 text-white" />
          ) : (
            <Copy className="h-5 w-5 text-white" />
          )}
        </div>
      </div>
      <div className="mt-2 space-y-1">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
        <code className="text-xs bg-muted px-2 py-1 rounded">{className}</code>
      </div>
    </div>
  );

  const ComponentShowcase = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 border-b">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Design System</h1>
              <p className="text-lg text-muted-foreground">
                Complete showcase of semantic tokens, components, and design patterns
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              Toggle Theme
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="components" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Components
            </TabsTrigger>
            <TabsTrigger value="effects" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Effects
            </TabsTrigger>
            <TabsTrigger value="patterns" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Patterns
            </TabsTrigger>
          </TabsList>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-8">
            {/* Primary Colors */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Semantic Color Tokens</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                <ColorToken 
                  name="Primary" 
                  className="bg-primary text-primary-foreground" 
                  description="Main brand color"
                />
                <ColorToken 
                  name="Secondary" 
                  className="bg-secondary text-secondary-foreground" 
                  description="Supporting brand color"
                />
                <ColorToken 
                  name="Accent" 
                  className="bg-accent text-accent-foreground" 
                  description="Highlight and interaction"
                />
                <ColorToken 
                  name="Muted" 
                  className="bg-muted text-muted-foreground" 
                  description="Subtle backgrounds"
                />
              </div>

              <Separator className="my-8" />

              {/* Status Colors */}
              <h3 className="text-xl font-semibold mb-4">Status Colors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <ColorToken 
                  name="Success" 
                  className="bg-success text-success-foreground" 
                  description="Positive actions"
                />
                <ColorToken 
                  name="Warning" 
                  className="bg-warning text-warning-foreground" 
                  description="Caution states"
                />
                <ColorToken 
                  name="Destructive" 
                  className="bg-destructive text-destructive-foreground" 
                  description="Danger and errors"
                />
                <ColorToken 
                  name="Innovation" 
                  className="bg-innovation text-innovation-foreground" 
                  description="Creative highlights"
                />
              </div>

              <Separator className="my-8" />

              {/* Role-based Colors */}
              <h3 className="text-xl font-semibold mb-4">Role-based Colors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ColorToken 
                  name="Expert" 
                  className="bg-expert text-expert-foreground" 
                  description="Expert designation"
                />
                <ColorToken 
                  name="Partner" 
                  className="bg-partner text-partner-foreground" 
                  description="Partner branding"
                />
                <ColorToken 
                  name="Innovator" 
                  className="bg-innovator text-innovator-foreground" 
                  description="Innovator identity"
                />
              </div>
            </div>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Typography Scale</h2>
              
              <Card className="p-6 space-y-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2">Heading 1 - 4xl Bold</h1>
                  <code className="text-sm bg-muted px-2 py-1 rounded">text-4xl font-bold</code>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">Heading 2 - 3xl Bold</h2>
                  <code className="text-sm bg-muted px-2 py-1 rounded">text-3xl font-bold</code>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Heading 3 - 2xl Semibold</h3>
                  <code className="text-sm bg-muted px-2 py-1 rounded">text-2xl font-semibold</code>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Heading 4 - xl Semibold</h4>
                  <code className="text-sm bg-muted px-2 py-1 rounded">text-xl font-semibold</code>
                </div>
                <div>
                  <h5 className="text-lg font-medium mb-2">Heading 5 - lg Medium</h5>
                  <code className="text-sm bg-muted px-2 py-1 rounded">text-lg font-medium</code>
                </div>
                <div>
                  <p className="text-base mb-2">Body Text - base Regular</p>
                  <code className="text-sm bg-muted px-2 py-1 rounded">text-base</code>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Small Text - sm Muted</p>
                  <code className="text-sm bg-muted px-2 py-1 rounded">text-sm text-muted-foreground</code>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Caption - xs Muted</p>
                  <code className="text-sm bg-muted px-2 py-1 rounded">text-xs text-muted-foreground</code>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Component Showcase</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ComponentShowcase title="Buttons">
                  <div className="flex flex-wrap gap-3">
                    <Button variant="default">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button disabled>Disabled</Button>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Badges">
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Badge className="bg-success text-success-foreground">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Success
                    </Badge>
                    <Badge className="bg-warning text-warning-foreground">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Warning
                    </Badge>
                    <Badge className="bg-innovation text-innovation-foreground">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Innovation
                    </Badge>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Status Indicators">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-success"></div>
                      <span>Active Challenge</span>
                      <Badge className="bg-success/90 text-success-foreground">Active</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-warning"></div>
                      <span>Upcoming Challenge</span>
                      <Badge className="bg-warning/90 text-warning-foreground">Upcoming</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-destructive"></div>
                      <span>Closed Challenge</span>
                      <Badge className="bg-destructive/90 text-destructive-foreground">Closed</Badge>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Interactive States">
                  <div className="space-y-3">
                    <Button className="w-full hover:scale-105 transition-transform">
                      Hover Scale Effect
                    </Button>
                    <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                      Hover Background Change
                    </div>
                    <div className="p-4 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" tabIndex={0}>
                      Focus Ring Effect
                    </div>
                  </div>
                </ComponentShowcase>
              </div>
            </div>
          </TabsContent>

          {/* Effects Tab */}
          <TabsContent value="effects" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Visual Effects</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ComponentShowcase title="Gradients">
                  <div className="space-y-4">
                    <div className="h-16 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center text-primary-foreground font-medium">
                      Primary to Secondary
                    </div>
                    <div className="h-16 bg-gradient-to-r from-accent via-primary to-secondary rounded-lg flex items-center justify-center text-primary-foreground font-medium">
                      Multi-color Gradient
                    </div>
                    <div className="h-16 bg-gradient-to-br from-success/20 to-innovation/20 rounded-lg flex items-center justify-center font-medium border">
                      Subtle Background Gradient
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Glass Morphism">
                  <div className="relative h-48 bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30 rounded-lg overflow-hidden">
                    <div className="absolute inset-4 bg-background/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                      <p className="text-foreground/90 font-medium">Glass Morphism Card</p>
                      <p className="text-foreground/70 text-sm mt-2">Backdrop blur with semi-transparent background</p>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Shadows & Elevation">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-20 bg-card rounded-lg shadow-sm flex items-center justify-center text-sm">
                      Small
                    </div>
                    <div className="h-20 bg-card rounded-lg shadow-md flex items-center justify-center text-sm">
                      Medium
                    </div>
                    <div className="h-20 bg-card rounded-lg shadow-lg flex items-center justify-center text-sm">
                      Large
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Animations">
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-primary rounded-lg animate-pulse flex items-center justify-center">
                        <span className="text-primary-foreground text-xs">Pulse</span>
                      </div>
                      <div className="w-16 h-16 bg-secondary rounded-lg animate-bounce flex items-center justify-center">
                        <span className="text-secondary-foreground text-xs">Bounce</span>
                      </div>
                      <div className="w-16 h-16 bg-accent rounded-lg animate-fade-in flex items-center justify-center">
                        <span className="text-accent-foreground text-xs">Fade</span>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>
              </div>
            </div>
          </TabsContent>

          {/* Patterns Tab */}
          <TabsContent value="patterns" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Design Patterns</h2>
              
              <div className="space-y-6">
                <ComponentShowcase title="Challenge Cards">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <Badge className="bg-success/90 text-success-foreground">Active</Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>45</span>
                        </div>
                      </div>
                      <h3 className="font-semibold mb-2">Smart City Solutions</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Develop innovative solutions for urban challenges
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm">
                          <Award className="w-4 h-4 text-warning" />
                          <span>$10,000</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>15 days left</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 hover:shadow-lg transition-shadow border-l-4 border-l-innovation">
                      <div className="flex items-start justify-between mb-3">
                        <Badge className="bg-innovation/90 text-innovation-foreground">Featured</Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Target className="w-4 h-4" />
                          <span>32</span>
                        </div>
                      </div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        AI Healthcare Platform
                        <Star className="w-4 h-4 text-warning fill-current" />
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Revolutionary AI-powered healthcare solutions
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm">
                          <Award className="w-4 h-4 text-warning" />
                          <span>$25,000</span>
                        </div>
                        <Badge className="bg-accent/90 text-accent-foreground animate-pulse">
                          Trending
                        </Badge>
                      </div>
                    </Card>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Notification Patterns">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-success/10 border border-success/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <div>
                        <p className="font-medium text-success">Success notification</p>
                        <p className="text-sm text-success/80">Your submission was successful</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-warning" />
                      <div>
                        <p className="font-medium text-warning">Warning notification</p>
                        <p className="text-sm text-warning/80">Deadline approaching in 2 days</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <X className="w-5 h-5 text-destructive" />
                      <div>
                        <p className="font-medium text-destructive">Error notification</p>
                        <p className="text-sm text-destructive/80">Something went wrong</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-accent/10 border border-accent/20 rounded-lg">
                      <Info className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-medium text-accent">Info notification</p>
                        <p className="text-sm text-accent/80">New feature available</p>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DesignSystem;