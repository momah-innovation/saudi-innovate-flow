import React, { useState } from 'react';
import { HeroPatterns } from '@/components/design-system/HeroPatterns';
import { 
  Palette, Eye, Type, Layout, Zap, Copy, Check, 
  Sun, Moon, ChevronDown, ChevronRight, ChevronLeft, Star,
  Heart, AlertCircle, CheckCircle, Info, X,
  Sparkles, Award, Clock, Users, Target, Search,
  Upload, Download, Play, Pause, Settings, Home,
  Mail, Phone, MapPin, Calendar, Edit, Trash2,
  Plus, Minus, Filter, ArrowUpDown, Grid, List, Bell,
  Shield, Lock, Unlock, User, CreditCard, Gift,
  Loader2, Wifi, WifiOff, Battery, Volume2, VolumeX,
  Send, MessageCircle, MoreVertical, HelpCircle,
  GripVertical, Move, Maximize2, Minimize2, Share,
  Menu, ArrowRight, ArrowLeft, Languages, ThumbsUp,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { ThemeSelector } from '@/components/ui/theme-selector';
import { useThemeSystem } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const DesignSystemClean = () => {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const { toast } = useToast();
  const { theme: darkModeTheme, setTheme: setDarkModeTheme } = useTheme();
  const { currentTheme } = useThemeSystem();

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

  const ComponentShowcase = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="border rounded-lg p-6 bg-muted/50">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar */}
            <div className="lg:w-64 space-y-4">
              <div className="sticky top-8">
                <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Palette className="w-6 h-6 text-primary" />
                  Design System
                </h1>
                <ThemeSelector />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <Tabs defaultValue="colors" className="space-y-6">
                <TabsList className="grid w-full grid-cols-6 lg:grid-cols-13">
                  <TabsTrigger value="colors">Colors</TabsTrigger>
                  <TabsTrigger value="typography">Typography</TabsTrigger>
                  <TabsTrigger value="components">Components</TabsTrigger>
                  <TabsTrigger value="forms">Forms</TabsTrigger>
                  <TabsTrigger value="navigation">Navigation</TabsTrigger>
                  <TabsTrigger value="data-display">Data Display</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                  <TabsTrigger value="communication">Communication</TabsTrigger>
                  <TabsTrigger value="interactions">Interactions</TabsTrigger>
                  <TabsTrigger value="spacing">Spacing</TabsTrigger>
                  <TabsTrigger value="states">States</TabsTrigger>
                  <TabsTrigger value="patterns">Patterns</TabsTrigger>
                  <TabsTrigger value="widgets">Widgets</TabsTrigger>
                </TabsList>

                <TabsContent value="colors" className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Color System</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <div className="h-20 bg-primary rounded-lg"></div>
                        <p className="text-sm font-medium">Primary</p>
                      </div>
                      <div className="space-y-2">
                        <div className="h-20 bg-secondary rounded-lg"></div>
                        <p className="text-sm font-medium">Secondary</p>
                      </div>
                      <div className="space-y-2">
                        <div className="h-20 bg-accent rounded-lg"></div>
                        <p className="text-sm font-medium">Accent</p>
                      </div>
                      <div className="space-y-2">
                        <div className="h-20 bg-muted rounded-lg"></div>
                        <p className="text-sm font-medium">Muted</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="typography" className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Typography</h2>
                    <div className="space-y-4">
                      <div>
                        <h1 className="text-4xl font-bold">Heading 1</h1>
                        <h2 className="text-3xl font-bold">Heading 2</h2>
                        <h3 className="text-2xl font-bold">Heading 3</h3>
                        <h4 className="text-xl font-bold">Heading 4</h4>
                        <p className="text-base">Body text - Lorem ipsum dolor sit amet consectetur.</p>
                        <p className="text-sm text-muted-foreground">Small text - Supporting information.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="components" className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Components</h2>
                    
                    <ComponentShowcase title="Buttons">
                      <div className="flex flex-wrap gap-4">
                        <Button>Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="destructive">Destructive</Button>
                      </div>
                    </ComponentShowcase>

                    <ComponentShowcase title="Cards">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-4">
                          <h3 className="font-semibold mb-2">Card Title</h3>
                          <p className="text-muted-foreground">Card content goes here.</p>
                        </Card>
                        <Card className="p-4">
                          <h3 className="font-semibold mb-2">Another Card</h3>
                          <p className="text-muted-foreground">More card content.</p>
                        </Card>
                      </div>
                    </ComponentShowcase>

                    <ComponentShowcase title="Badges">
                      <div className="flex flex-wrap gap-2">
                        <Badge>Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="outline">Outline</Badge>
                        <Badge variant="destructive">Destructive</Badge>
                      </div>
                    </ComponentShowcase>
                  </div>
                </TabsContent>

                <TabsContent value="forms" className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Forms</h2>
                    <ComponentShowcase title="Form Elements">
                      <div className="space-y-4 max-w-md">
                        <div>
                          <label className="text-sm font-medium">Input Field</label>
                          <input className="w-full mt-1 px-3 py-2 border rounded-md" placeholder="Enter text..." />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Select</label>
                          <select className="w-full mt-1 px-3 py-2 border rounded-md">
                            <option>Choose option...</option>
                            <option>Option 1</option>
                            <option>Option 2</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Textarea</label>
                          <textarea className="w-full mt-1 px-3 py-2 border rounded-md" rows={3} placeholder="Enter description..."></textarea>
                        </div>
                      </div>
                    </ComponentShowcase>
                  </div>
                </TabsContent>

                <TabsContent value="navigation" className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Navigation</h2>
                    <ComponentShowcase title="Navigation Elements">
                      <div className="space-y-6">
                        <div className="flex items-center gap-6">
                          <Button variant="ghost">Home</Button>
                          <Button variant="ghost">About</Button>
                          <Button variant="ghost">Services</Button>
                          <Button variant="ghost">Contact</Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">← Previous</Button>
                          <Button size="sm" variant="outline">1</Button>
                          <Button size="sm">2</Button>
                          <Button size="sm" variant="outline">3</Button>
                          <Button size="sm" variant="outline">Next →</Button>
                        </div>
                      </div>
                    </ComponentShowcase>
                  </div>
                </TabsContent>

                <TabsContent value="data-display" className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Data Display</h2>
                    <ComponentShowcase title="Tables & Lists">
                      <div className="space-y-4">
                        <table className="w-full border-collapse border border-border">
                          <thead>
                            <tr className="bg-muted">
                              <th className="border border-border p-2 text-left">Name</th>
                              <th className="border border-border p-2 text-left">Status</th>
                              <th className="border border-border p-2 text-left">Role</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-border p-2">John Doe</td>
                              <td className="border border-border p-2">
                                <Badge variant="secondary">Active</Badge>
                              </td>
                              <td className="border border-border p-2">Admin</td>
                            </tr>
                            <tr>
                              <td className="border border-border p-2">Jane Smith</td>
                              <td className="border border-border p-2">
                                <Badge>Online</Badge>
                              </td>
                              <td className="border border-border p-2">User</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </ComponentShowcase>
                  </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Media</h2>
                    <ComponentShowcase title="Images & Icons">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-white" />
                          </div>
                          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Search className="w-4 h-4" />
                          <Filter className="w-4 h-4" />
                          <Settings className="w-4 h-4" />
                          <Bell className="w-4 h-4" />
                        </div>
                      </div>
                    </ComponentShowcase>
                  </div>
                </TabsContent>

                <TabsContent value="communication" className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Communication</h2>
                    <ComponentShowcase title="Notifications & Alerts">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950/20 dark:border-green-800">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium text-green-800 dark:text-green-200">Success!</p>
                            <p className="text-sm text-green-600 dark:text-green-300">Your changes have been saved.</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-950/20 dark:border-yellow-800">
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                          <div>
                            <p className="font-medium text-yellow-800 dark:text-yellow-200">Warning</p>
                            <p className="text-sm text-yellow-600 dark:text-yellow-300">Please review your settings.</p>
                          </div>
                        </div>
                      </div>
                    </ComponentShowcase>
                  </div>
                </TabsContent>

                <TabsContent value="interactions" className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Interactions</h2>
                    <ComponentShowcase title="Interactive Elements">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Button className="hover:scale-105 transition-transform">Hover Effect</Button>
                          <Button variant="outline" className="group">
                            <span className="group-hover:text-primary transition-colors">Group Hover</span>
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{width: '60%'}}></div>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-secondary h-2 rounded-full transition-all duration-500" style={{width: '80%'}}></div>
                          </div>
                        </div>
                      </div>
                    </ComponentShowcase>
                  </div>
                </TabsContent>

                <TabsContent value="spacing" className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Spacing</h2>
                    <ComponentShowcase title="Spacing System">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="h-4 bg-primary/20 rounded"></div>
                          <div className="h-4 bg-primary/40 rounded ml-2"></div>
                          <div className="h-4 bg-primary/60 rounded ml-4"></div>
                          <div className="h-4 bg-primary/80 rounded ml-6"></div>
                          <div className="h-4 bg-primary rounded ml-8"></div>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="h-8 bg-muted rounded"></div>
                          <div className="h-8 bg-muted rounded"></div>
                          <div className="h-8 bg-muted rounded"></div>
                          <div className="h-8 bg-muted rounded"></div>
                        </div>
                      </div>
                    </ComponentShowcase>
                  </div>
                </TabsContent>

                <TabsContent value="states" className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-6">States</h2>
                    <ComponentShowcase title="Component States">
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <Button>Normal</Button>
                          <Button disabled>Disabled</Button>
                          <Button className="opacity-50">Loading</Button>
                        </div>
                        <div className="space-y-2">
                          <input className="w-full px-3 py-2 border rounded-md" placeholder="Normal input" />
                          <input className="w-full px-3 py-2 border-2 border-red-500 rounded-md" placeholder="Error state" />
                          <input className="w-full px-3 py-2 border-2 border-green-500 rounded-md" placeholder="Success state" />
                        </div>
                      </div>
                    </ComponentShowcase>
                  </div>
                </TabsContent>

                <TabsContent value="widgets" className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Widgets</h2>
                    <ComponentShowcase title="Dashboard Widgets">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-4">
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Analytics
                          </h3>
                          <p className="text-2xl font-bold text-primary">2.4K</p>
                          <p className="text-sm text-muted-foreground">Total views</p>
                        </Card>
                        <Card className="p-4">
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Users
                          </h3>
                          <p className="text-2xl font-bold text-secondary">1.8K</p>
                          <p className="text-sm text-muted-foreground">Active users</p>
                        </Card>
                      </div>
                    </ComponentShowcase>
                  </div>
                </TabsContent>

                <TabsContent value="patterns" className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Design Patterns</h2>
                    <HeroPatterns />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSystemClean;