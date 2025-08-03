import React, { useState } from 'react';
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
  GripVertical, Move, Maximize2, Minimize2
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
          <TabsList className="grid w-full grid-cols-12 text-xs">
            <TabsTrigger value="colors" className="flex items-center gap-1">
              <Palette className="h-3 w-3" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center gap-1">
              <Type className="h-3 w-3" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="components" className="flex items-center gap-1">
              <Layout className="h-3 w-3" />
              Components
            </TabsTrigger>
            <TabsTrigger value="forms" className="flex items-center gap-1">
              <Edit className="h-3 w-3" />
              Forms
            </TabsTrigger>
            <TabsTrigger value="navigation" className="flex items-center gap-1">
              <Home className="h-3 w-3" />
              Navigation
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-1">
              <Grid className="h-3 w-3" />
              Data Display
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-1">
              <Play className="h-3 w-3" />
              Media
            </TabsTrigger>
            <TabsTrigger value="communication" className="flex items-center gap-1">
              <Bell className="h-3 w-3" />
              Communication
            </TabsTrigger>
            <TabsTrigger value="interactions" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Interactions
            </TabsTrigger>
            <TabsTrigger value="spacing" className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              Spacing
            </TabsTrigger>
            <TabsTrigger value="patterns" className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              Patterns
            </TabsTrigger>
            <TabsTrigger value="states" className="flex items-center gap-1">
              <Settings className="h-3 w-3" />
              States
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

          {/* Forms Tab */}
          <TabsContent value="forms" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Form Components & Patterns</h2>
              
              <div className="space-y-6">
                <ComponentShowcase title="Input Variations">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Standard Input</label>
                        <input 
                          type="text" 
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" 
                          placeholder="Enter text here"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">With Icon</label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <input 
                            type="text" 
                            className="w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary" 
                            placeholder="Search..."
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">With Action Button</label>
                        <div className="flex gap-2">
                          <input 
                            type="email" 
                            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary" 
                            placeholder="Enter email"
                          />
                          <Button>Subscribe</Button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Select Dropdown</label>
                        <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background">
                          <option>Select an option</option>
                          <option>Option 1</option>
                          <option>Option 2</option>
                          <option>Option 3</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Textarea</label>
                        <textarea 
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none" 
                          rows={4}
                          placeholder="Enter your message here..."
                        />
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Form Layout Patterns">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-4">Inline Form</h4>
                      <div className="flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-48">
                          <label className="text-sm font-medium mb-2 block">Name</label>
                          <input type="text" className="w-full p-2 border rounded-md" placeholder="John Doe" />
                        </div>
                        <div className="flex-1 min-w-48">
                          <label className="text-sm font-medium mb-2 block">Email</label>
                          <input type="email" className="w-full p-2 border rounded-md" placeholder="john@example.com" />
                        </div>
                        <Button>Submit</Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-4">Stacked Form</h4>
                      <div className="max-w-md space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Full Name</label>
                          <input type="text" className="w-full p-3 border rounded-lg" placeholder="Enter your full name" />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Email Address</label>
                          <input type="email" className="w-full p-3 border rounded-lg" placeholder="Enter your email" />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Message</label>
                          <textarea className="w-full p-3 border rounded-lg resize-none" rows={4} placeholder="Your message"></textarea>
                        </div>
                        <Button className="w-full">Send Message</Button>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Form Controls">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-4">Checkboxes</h4>
                        <div className="space-y-3">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                            <span className="text-sm">I agree to the terms and conditions</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-300" />
                            <span className="text-sm">Subscribe to newsletter</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-300" disabled />
                            <span className="text-sm text-muted-foreground">This option is disabled</span>
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-4">Radio Buttons</h4>
                        <div className="space-y-3">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="radio" name="plan" value="basic" className="text-primary" defaultChecked />
                            <span className="text-sm">Basic Plan ($9/month)</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="radio" name="plan" value="pro" className="text-primary" />
                            <span className="text-sm">Pro Plan ($19/month)</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="radio" name="plan" value="enterprise" className="text-primary" />
                            <span className="text-sm">Enterprise Plan ($49/month)</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-4">Toggle Switches</h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">Email Notifications</p>
                              <p className="text-xs text-muted-foreground">Receive updates via email</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">Dark Mode</p>
                              <p className="text-xs text-muted-foreground">Toggle dark theme</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-4">Range Slider</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Budget Range</label>
                            <input type="range" min="0" max="100" defaultValue="50" className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider" />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>$0</span>
                              <span>$10,000</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="File Upload Patterns">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-4">Drag & Drop Upload</h4>
                      <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg font-medium mb-2">Drop files here or click to upload</p>
                        <p className="text-sm text-muted-foreground mb-4">Supports: PNG, JPG, PDF (max 10MB)</p>
                        <Button variant="outline" size="sm">
                          Choose Files
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-4">File List</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">PDF</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">project-proposal.pdf</p>
                            <p className="text-xs text-muted-foreground">2.5 MB</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-success" />
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="w-8 h-8 bg-secondary/10 rounded flex items-center justify-center">
                            <span className="text-xs font-medium text-secondary">IMG</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">screenshot.png</p>
                            <p className="text-xs text-muted-foreground">1.2 MB</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            <span className="text-xs text-muted-foreground">65%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Advanced Form Elements">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-4">Multi-step Indicator</h4>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                              1
                            </div>
                            <span className="ml-2 text-sm font-medium">Basic Info</span>
                          </div>
                          <div className="flex-1 h-0.5 bg-primary mx-4"></div>
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                              2
                            </div>
                            <span className="ml-2 text-sm font-medium">Details</span>
                          </div>
                          <div className="flex-1 h-0.5 bg-muted mx-4"></div>
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">
                              3
                            </div>
                            <span className="ml-2 text-sm text-muted-foreground">Review</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-4">Tags Input</h4>
                        <div className="border rounded-lg p-3 flex flex-wrap gap-2">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            React
                            <X className="w-3 h-3 cursor-pointer" />
                          </Badge>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            TypeScript
                            <X className="w-3 h-3 cursor-pointer" />
                          </Badge>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            Tailwind
                            <X className="w-3 h-3 cursor-pointer" />
                          </Badge>
                          <input 
                            type="text" 
                            className="flex-1 min-w-24 outline-none bg-transparent" 
                            placeholder="Add tag..."
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-4">Color Picker</h4>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg border-2 border-white shadow-lg" style={{ backgroundColor: '#3b82f6' }}></div>
                          <div className="flex-1">
                            <input type="text" value="#3b82f6" className="w-full p-2 border rounded-md font-mono text-sm" />
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-8 gap-2">
                          {['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'].map((color, i) => (
                            <div key={i} className="w-8 h-8 rounded border-2 border-white shadow cursor-pointer hover:scale-110 transition-transform" style={{ backgroundColor: color }}></div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-4">Rating Component</h4>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-6 h-6 cursor-pointer transition-colors ${star <= 4 ? 'text-warning fill-current' : 'text-muted-foreground'}`} 
                            />
                          ))}
                          <span className="ml-2 text-sm text-muted-foreground">(4.0 out of 5)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>
              </div>
            </div>
          </TabsContent>

          {/* Navigation Tab */}
          <TabsContent value="navigation" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Navigation Components</h2>
              
              <div className="space-y-6">
                <ComponentShowcase title="Sidebar Navigation">
                  <div className="border rounded-lg overflow-hidden h-96 flex">
                    <div className="w-64 bg-card border-r p-4">
                      <div className="space-y-1">
                        <div className="px-3 py-2 text-sm font-medium text-muted-foreground">MAIN</div>
                        <div className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm flex items-center gap-2">
                          <Home className="w-4 h-4" />
                          Dashboard
                        </div>
                        <div className="px-3 py-2 text-sm flex items-center gap-2 hover:bg-accent rounded-md cursor-pointer">
                          <Target className="w-4 h-4" />
                          Challenges
                        </div>
                        <div className="px-3 py-2 text-sm flex items-center gap-2 hover:bg-accent rounded-md cursor-pointer">
                          <Users className="w-4 h-4" />
                          Community
                        </div>
                        <div className="px-3 py-2 text-sm flex items-center gap-2 hover:bg-accent rounded-md cursor-pointer">
                          <Award className="w-4 h-4" />
                          Leaderboard
                        </div>
                        <div className="px-3 py-2 text-sm font-medium text-muted-foreground mt-4">ACCOUNT</div>
                        <div className="px-3 py-2 text-sm flex items-center gap-2 hover:bg-accent rounded-md cursor-pointer">
                          <User className="w-4 h-4" />
                          Profile
                        </div>
                        <div className="px-3 py-2 text-sm flex items-center gap-2 hover:bg-accent rounded-md cursor-pointer">
                          <Settings className="w-4 h-4" />
                          Settings
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 p-6 bg-background">
                      <h3 className="text-lg font-semibold mb-4">Main Content Area</h3>
                      <p className="text-muted-foreground">Navigation content goes here...</p>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Top Navigation Bar">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-card border-b p-4 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-primary-foreground" />
                          </div>
                          <span className="font-semibold">InnovateLab</span>
                        </div>
                        <nav className="hidden md:flex items-center gap-6">
                          <a href="#" className="text-sm font-medium">Challenges</a>
                          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Community</a>
                          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Resources</a>
                          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">About</a>
                        </nav>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <input 
                            type="text" 
                            className="pl-10 pr-3 py-2 border rounded-lg text-sm bg-background" 
                            placeholder="Search..."
                          />
                        </div>
                        <Button variant="ghost" size="sm">
                          <Bell className="w-4 h-4" />
                        </Button>
                        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Mobile Navigation">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-card border-b p-4 flex items-center justify-between">
                      <Button variant="ghost" size="sm">
                        <div className="w-4 h-4 flex flex-col gap-1">
                          <div className="w-4 h-0.5 bg-current"></div>
                          <div className="w-4 h-0.5 bg-current"></div>
                          <div className="w-4 h-0.5 bg-current"></div>
                        </div>
                      </Button>
                      <span className="font-semibold">InnovateLab</span>
                      <Button variant="ghost" size="sm">
                        <User className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="bg-card border-b">
                      <div className="grid grid-cols-4 gap-1 p-2">
                        <div className="flex flex-col items-center gap-1 p-3 bg-primary/10 rounded-lg">
                          <Home className="w-5 h-5 text-primary" />
                          <span className="text-xs text-primary font-medium">Home</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 p-3 hover:bg-accent rounded-lg">
                          <Target className="w-5 h-5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Challenges</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 p-3 hover:bg-accent rounded-lg">
                          <Users className="w-5 h-5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Community</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 p-3 hover:bg-accent rounded-lg">
                          <Award className="w-5 h-5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Awards</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Breadcrumb & Step Navigation">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-4">Breadcrumb Navigation</h4>
                      <nav className="flex items-center space-x-2 text-sm">
                        <a href="#" className="text-muted-foreground hover:text-foreground">Home</a>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        <a href="#" className="text-muted-foreground hover:text-foreground">Challenges</a>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        <a href="#" className="text-muted-foreground hover:text-foreground">Technology</a>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground font-medium">AI Healthcare Platform</span>
                      </nav>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-4">Step Navigation (Wizard)</h4>
                      <div className="flex items-center justify-between max-w-md">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium mb-2">
                            ✓
                          </div>
                          <span className="text-xs text-center">Basic Info</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-primary mx-2"></div>
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium mb-2">
                            2
                          </div>
                          <span className="text-xs text-center">Project Details</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-muted mx-2"></div>
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium mb-2">
                            3
                          </div>
                          <span className="text-xs text-center text-muted-foreground">Review</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-muted mx-2"></div>
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium mb-2">
                            4
                          </div>
                          <span className="text-xs text-center text-muted-foreground">Submit</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Pagination">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Showing 1 to 10 of 47 results</p>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" disabled>
                          Previous
                        </Button>
                        <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                          1
                        </Button>
                        <Button variant="outline" size="sm">2</Button>
                        <Button variant="outline" size="sm">3</Button>
                        <span className="text-muted-foreground px-2">...</span>
                        <Button variant="outline" size="sm">47</Button>
                        <Button variant="outline" size="sm">Next</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm">
                          «
                        </Button>
                        <Button variant="ghost" size="sm">
                          ‹
                        </Button>
                        <span className="px-4 py-2 text-sm">Page 2 of 10</span>
                        <Button variant="ghost" size="sm">
                          ›
                        </Button>
                        <Button variant="ghost" size="sm">
                          »
                        </Button>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>
              </div>
            </div>
          </TabsContent>

          {/* Data Display Tab */}
          <TabsContent value="data" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Data Display Components</h2>
              
              <div className="space-y-6">
                <ComponentShowcase title="Charts & Statistics">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Bar Chart Mockup</h4>
                      <div className="border rounded-lg p-4 bg-card">
                        <div className="flex items-end justify-between h-32 gap-2">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-8 bg-primary rounded-t" style={{ height: '80%' }}></div>
                            <span className="text-xs">Jan</span>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-8 bg-secondary rounded-t" style={{ height: '60%' }}></div>
                            <span className="text-xs">Feb</span>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-8 bg-accent rounded-t" style={{ height: '90%' }}></div>
                            <span className="text-xs">Mar</span>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-8 bg-primary rounded-t" style={{ height: '70%' }}></div>
                            <span className="text-xs">Apr</span>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-8 bg-secondary rounded-t" style={{ height: '85%' }}></div>
                            <span className="text-xs">May</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium">Donut Chart Mockup</h4>
                      <div className="border rounded-lg p-4 bg-card flex items-center justify-center">
                        <div className="relative w-32 h-32">
                          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeDasharray="60, 100"
                              className="text-primary"
                            />
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeDasharray="25, 100"
                              strokeDashoffset="-60"
                              className="text-secondary"
                            />
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeDasharray="15, 100"
                              strokeDashoffset="-85"
                              className="text-accent"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold">72%</span>
                            <span className="text-xs text-muted-foreground">Completion</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Data Tables">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Filter className="w-4 h-4 mr-2" />
                          Filter
                        </Button>
                        <Button variant="outline" size="sm">
                          <ArrowUpDown className="w-4 h-4 mr-2" />
                          Sort
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <List className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="bg-accent">
                          <Grid className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left p-4 font-medium">
                              <input type="checkbox" className="rounded" />
                            </th>
                            <th className="text-left p-4 font-medium">Challenge</th>
                            <th className="text-left p-4 font-medium">Status</th>
                            <th className="text-left p-4 font-medium">Participants</th>
                            <th className="text-left p-4 font-medium">Prize Pool</th>
                            <th className="text-left p-4 font-medium">Deadline</th>
                            <th className="text-left p-4 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t hover:bg-muted/30">
                            <td className="p-4">
                              <input type="checkbox" className="rounded" />
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                  <Sparkles className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">AI Climate Solutions</p>
                                  <p className="text-sm text-muted-foreground">Environmental technology</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge className="bg-success/90 text-success-foreground">Active</Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span>142</span>
                              </div>
                            </td>
                            <td className="p-4 font-medium">$75,000</td>
                            <td className="p-4 text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>12 days</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-t hover:bg-muted/30">
                            <td className="p-4">
                              <input type="checkbox" className="rounded" />
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                                  <Shield className="w-5 h-5 text-secondary" />
                                </div>
                                <div>
                                  <p className="font-medium">Cybersecurity Innovation</p>
                                  <p className="text-sm text-muted-foreground">Digital security solutions</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge className="bg-warning/90 text-warning-foreground">Review</Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span>89</span>
                              </div>
                            </td>
                            <td className="p-4 font-medium">$50,000</td>
                            <td className="p-4 text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>5 days</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="List Views & Timeline">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">Activity Timeline</h4>
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                            <div className="w-0.5 h-12 bg-muted mt-2"></div>
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="font-medium">Challenge Submitted</p>
                            <p className="text-sm text-muted-foreground">Your AI solution has been submitted successfully</p>
                            <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                              <Star className="w-4 h-4 text-white" />
                            </div>
                            <div className="w-0.5 h-12 bg-muted mt-2"></div>
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="font-medium">Featured Project</p>
                            <p className="text-sm text-muted-foreground">Your project was featured on the homepage</p>
                            <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                              <Award className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="font-medium">Achievement Unlocked</p>
                            <p className="text-sm text-muted-foreground">Earned "Innovation Master" badge</p>
                            <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-4">Contact List</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                            JD
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">John Doe</p>
                            <p className="text-sm text-muted-foreground">AI Researcher</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Phone className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50">
                          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-medium">
                            SM
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Sarah Miller</p>
                            <p className="text-sm text-muted-foreground">UX Designer</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Phone className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50">
                          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-medium">
                            MJ
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Mike Johnson</p>
                            <p className="text-sm text-muted-foreground">Data Scientist</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Phone className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Tree View & Hierarchical Data">
                  <div className="border rounded-lg p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 p-2 hover:bg-accent rounded">
                        <ChevronDown className="w-4 h-4" />
                        <span className="font-medium">📁 Innovation Challenges</span>
                      </div>
                      <div className="ml-6 space-y-1">
                        <div className="flex items-center gap-2 p-2 hover:bg-accent rounded">
                          <ChevronRight className="w-4 h-4" />
                          <span>🤖 AI & Machine Learning</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 hover:bg-accent rounded">
                          <ChevronDown className="w-4 h-4" />
                          <span>🌍 Climate Tech</span>
                        </div>
                        <div className="ml-6 space-y-1">
                          <div className="flex items-center gap-2 p-2 hover:bg-accent rounded">
                            <span className="w-4 h-4"></span>
                            <span>📄 Smart Grid Solutions</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 hover:bg-accent rounded">
                            <span className="w-4 h-4"></span>
                            <span>📄 Carbon Tracking</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 hover:bg-accent rounded">
                          <ChevronRight className="w-4 h-4" />
                          <span>💊 Healthcare Innovation</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 hover:bg-accent rounded">
                          <ChevronRight className="w-4 h-4" />
                          <span>🔒 Cybersecurity</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>
              </div>
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Media Components</h2>
              
              <div className="space-y-6">
                <ComponentShowcase title="Image Gallery & Lightbox">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="relative group cursor-pointer">
                        <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🖼️</span>
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="relative group cursor-pointer">
                        <div className="aspect-square bg-gradient-to-br from-accent/20 to-innovation/20 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🌅</span>
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="relative group cursor-pointer">
                        <div className="aspect-square bg-gradient-to-br from-success/20 to-warning/20 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🏙️</span>
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="relative group cursor-pointer">
                        <div className="aspect-square bg-gradient-to-br from-expert/20 to-partner/20 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🔬</span>
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 bg-black/5">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Lightbox Preview</h4>
                        <Button variant="ghost" size="sm">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                        <span className="text-4xl">🖼️</span>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <Button variant="ghost" size="sm">
                          <ChevronLeft className="w-4 h-4" />
                          Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">1 of 4</span>
                        <Button variant="ghost" size="sm">
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Video & Audio Players">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">Video Player</h4>
                      <div className="border rounded-lg overflow-hidden bg-black">
                        <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                          <div className="text-center text-white">
                            <Play className="w-16 h-16 mx-auto mb-4 opacity-80" />
                            <p className="text-lg font-medium">Innovation Challenge Demo</p>
                            <p className="text-sm opacity-70">Click to play</p>
                          </div>
                        </div>
                        <div className="bg-gray-900 p-4 text-white">
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                              <Play className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                              <Volume2 className="w-4 h-4" />
                            </Button>
                            <div className="flex-1 flex items-center gap-2">
                              <span className="text-sm">02:30</span>
                              <div className="flex-1 h-1 bg-gray-600 rounded-full">
                                <div className="w-1/3 h-full bg-primary rounded-full"></div>
                              </div>
                              <span className="text-sm">08:45</span>
                            </div>
                            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-4">Audio Player</h4>
                      <div className="border rounded-lg p-6 bg-card">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                            <span className="text-2xl">🎵</span>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium">Innovation Podcast</h5>
                            <p className="text-sm text-muted-foreground">Episode 42: AI in Healthcare</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">12:30</span>
                            <div className="flex-1 h-2 bg-muted rounded-full">
                              <div className="w-2/5 h-full bg-primary rounded-full"></div>
                            </div>
                            <span className="text-sm text-muted-foreground">31:20</span>
                          </div>
                          <div className="flex items-center justify-center gap-4">
                            <Button variant="ghost" size="sm">
                              <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button size="sm" className="rounded-full w-12 h-12">
                              <Pause className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="File Upload & Media Management">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-4">Advanced File Upload</h4>
                      <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg font-medium mb-2">Upload your project files</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Drag & drop files here, or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground mb-4">
                          Supports: Images (PNG, JPG, GIF), Videos (MP4, MOV), Documents (PDF, DOC, PPT) - Max 50MB per file
                        </p>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Choose Files
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-4">Upload Progress</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="w-10 h-10 bg-success/10 rounded flex items-center justify-center">
                            <span className="text-xs font-medium text-success">IMG</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium">project-hero.jpg</p>
                              <CheckCircle className="w-4 h-4 text-success" />
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>2.3 MB</span>
                              <span>Complete</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">MP4</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium">demo-video.mp4</p>
                              <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5 mb-1">
                              <div className="bg-primary h-1.5 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>15.7 MB of 24.2 MB</span>
                              <span>65% • 2 min left</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 border border-destructive/20 bg-destructive/5 rounded-lg">
                          <div className="w-10 h-10 bg-destructive/10 rounded flex items-center justify-center">
                            <span className="text-xs font-medium text-destructive">PDF</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium">large-document.pdf</p>
                              <X className="w-4 h-4 text-destructive" />
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-destructive">File too large (52 MB)</span>
                              <Button variant="ghost" size="sm" className="text-destructive h-auto p-0">
                                Retry
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Avatar & Profile Images">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">Avatar Variations</h4>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-medium text-xl">
                          JD
                        </div>
                        <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center text-white font-medium">
                          SM
                        </div>
                        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-medium text-sm">
                          MJ
                        </div>
                        <div className="w-10 h-10 bg-innovation rounded-full flex items-center justify-center text-white font-medium text-sm">
                          AK
                        </div>
                        <div className="w-8 h-8 bg-expert rounded-full flex items-center justify-center text-white font-medium text-xs">
                          TL
                        </div>
                      </div>
                      
                      <div className="mt-6 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                              JD
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success border-2 border-background rounded-full"></div>
                          </div>
                          <div>
                            <p className="font-medium">John Doe</p>
                            <p className="text-sm text-muted-foreground">Online</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white font-medium">
                              SM
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-warning border-2 border-background rounded-full"></div>
                          </div>
                          <div>
                            <p className="font-medium">Sarah Miller</p>
                            <p className="text-sm text-muted-foreground">Away</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground font-medium">
                              MJ
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-muted-foreground border-2 border-background rounded-full"></div>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">Mike Johnson</p>
                            <p className="text-sm text-muted-foreground">Offline</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-4">Profile Image Upload</h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-medium text-2xl">
                              JD
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-background border border-muted rounded-full flex items-center justify-center cursor-pointer hover:bg-accent">
                              <Edit className="w-3 h-3" />
                            </div>
                          </div>
                          <div>
                            <p className="font-medium">John Doe</p>
                            <p className="text-sm text-muted-foreground">Click the edit icon to change</p>
                            <Button variant="outline" size="sm" className="mt-2">
                              <Upload className="w-4 h-4 mr-2" />
                              Upload New
                            </Button>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4 bg-muted/50">
                          <h5 className="font-medium mb-2">Image Requirements</h5>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Minimum 200x200 pixels</li>
                            <li>• Maximum file size: 5MB</li>
                            <li>• Supported formats: JPG, PNG, GIF</li>
                            <li>• Square images work best</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>
              </div>
            </div>
          </TabsContent>

          {/* Communication Tab */}
          <TabsContent value="communication" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Communication Components</h2>
              
              <div className="space-y-6">
                <ComponentShowcase title="Toast Notifications">
                  <div className="space-y-4">
                    <h4 className="font-medium">Toast Examples</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-lg max-w-md">
                        <CheckCircle className="w-5 h-5 text-success" />
                        <div className="flex-1">
                          <p className="font-medium text-success">Success!</p>
                          <p className="text-sm text-success/80">Your challenge has been submitted successfully.</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-success">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg max-w-md">
                        <AlertCircle className="w-5 h-5 text-destructive" />
                        <div className="flex-1">
                          <p className="font-medium text-destructive">Error occurred</p>
                          <p className="text-sm text-destructive/80">Failed to upload file. Please try again.</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-warning/10 border border-warning/20 rounded-lg max-w-md">
                        <AlertCircle className="w-5 h-5 text-warning" />
                        <div className="flex-1">
                          <p className="font-medium text-warning">Warning</p>
                          <p className="text-sm text-warning/80">Challenge deadline is in 2 hours.</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-warning">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-accent/10 border border-accent/20 rounded-lg max-w-md">
                        <Info className="w-5 h-5 text-accent" />
                        <div className="flex-1">
                          <p className="font-medium text-accent">Information</p>
                          <p className="text-sm text-accent/80">New feature: Real-time collaboration is now available.</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-accent">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Toast Actions</h4>
                      <div className="flex gap-2">
                        <Button onClick={() => toast({ title: "Success!", description: "This is a success message", duration: 3000 })}>
                          Show Success
                        </Button>
                        <Button variant="destructive" onClick={() => toast({ title: "Error!", description: "This is an error message", duration: 3000 })}>
                          Show Error
                        </Button>
                        <Button variant="outline" onClick={() => toast({ title: "Info", description: "This is an info message", duration: 3000 })}>
                          Show Info
                        </Button>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Chat Interface">
                  <div className="border rounded-lg overflow-hidden h-96 flex flex-col">
                    <div className="bg-card border-b p-4 flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium text-sm">
                        TC
                      </div>
                      <div>
                        <p className="font-medium">Team Chat</p>
                        <p className="text-sm text-muted-foreground">5 members online</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white font-medium text-sm">
                          JD
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">John Doe</span>
                            <span className="text-xs text-muted-foreground">2:30 PM</span>
                          </div>
                          <div className="bg-muted rounded-lg p-3">
                            <p className="text-sm">Hey team! I just submitted our AI model. Looking great so far! 🚀</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-medium text-sm">
                          SM
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">Sarah Miller</span>
                            <span className="text-xs text-muted-foreground">2:32 PM</span>
                          </div>
                          <div className="bg-muted rounded-lg p-3">
                            <p className="text-sm">Awesome work! The UI integration is also ready. Should we schedule a final review?</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 justify-end">
                        <div className="max-w-xs">
                          <div className="flex items-center gap-2 mb-1 justify-end">
                            <span className="text-xs text-muted-foreground">2:35 PM</span>
                            <span className="font-medium text-sm">You</span>
                          </div>
                          <div className="bg-primary text-primary-foreground rounded-lg p-3">
                            <p className="text-sm">Perfect! Let's meet at 4 PM for the final review. Great teamwork everyone! 💪</p>
                          </div>
                        </div>
                        <div className="w-8 h-8 bg-innovation rounded-full flex items-center justify-center text-white font-medium text-sm">
                          Me
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t p-4">
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          className="flex-1 p-2 border rounded-lg" 
                          placeholder="Type your message..."
                        />
                        <Button size="sm">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Notification Center">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">Notification Dropdown</h4>
                      <div className="border rounded-lg overflow-hidden max-w-sm">
                        <div className="bg-card border-b p-4 flex items-center justify-between">
                          <h5 className="font-medium">Notifications</h5>
                          <Badge variant="secondary" className="text-xs">3 new</Badge>
                        </div>
                        
                        <div className="divide-y max-h-80 overflow-y-auto">
                          <div className="p-4 hover:bg-accent/50 bg-primary/5">
                            <div className="flex gap-3">
                              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <Award className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm">Challenge Won! 🎉</p>
                                <p className="text-sm text-muted-foreground">You won first place in AI Healthcare Challenge</p>
                                <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                              </div>
                              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                            </div>
                          </div>
                          
                          <div className="p-4 hover:bg-accent/50 bg-success/5">
                            <div className="flex gap-3">
                              <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm">New Team Member</p>
                                <p className="text-sm text-muted-foreground">Alex joined your Climate Tech team</p>
                                <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                              </div>
                              <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                            </div>
                          </div>
                          
                          <div className="p-4 hover:bg-accent/50 bg-warning/5">
                            <div className="flex gap-3">
                              <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center">
                                <Clock className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm">Deadline Reminder</p>
                                <p className="text-sm text-muted-foreground">Cybersecurity Challenge ends in 2 days</p>
                                <p className="text-xs text-muted-foreground mt-1">3 hours ago</p>
                              </div>
                              <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                            </div>
                          </div>
                          
                          <div className="p-4 hover:bg-accent/50">
                            <div className="flex gap-3">
                              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                                <Heart className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm">Project Liked</p>
                                <p className="text-sm text-muted-foreground">Someone liked your Smart City project</p>
                                <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t p-3">
                          <Button variant="ghost" className="w-full justify-center text-sm">
                            View All Notifications
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-4">Alert Banners</h4>
                      <div className="space-y-3">
                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-primary mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium text-primary">New Feature Available</p>
                              <p className="text-sm text-primary/80 mt-1">
                                Real-time collaboration is now live! Work together with your team seamlessly.
                              </p>
                            </div>
                            <Button variant="ghost" size="sm" className="text-primary">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium text-warning">Maintenance Notice</p>
                              <p className="text-sm text-warning/80 mt-1">
                                Scheduled maintenance on Sunday 2 AM - 4 AM UTC. Plan accordingly.
                              </p>
                            </div>
                            <Button variant="ghost" size="sm" className="text-warning">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium text-success">System Updated</p>
                              <p className="text-sm text-success/80 mt-1">
                                Platform has been updated with improved performance and new features.
                              </p>
                            </div>
                            <Button variant="ghost" size="sm" className="text-success">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Comment System">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium text-sm">
                          JD
                        </div>
                        <div className="flex-1">
                          <div className="bg-card border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-sm">John Doe</span>
                              <Badge variant="secondary" className="text-xs">Expert</Badge>
                              <span className="text-xs text-muted-foreground">2 hours ago</span>
                            </div>
                            <p className="text-sm mb-3">
                              Great approach to the AI healthcare problem! I particularly like how you've addressed the privacy concerns. Have you considered implementing federated learning for better data protection?
                            </p>
                            <div className="flex items-center gap-4">
                              <Button variant="ghost" size="sm" className="h-auto p-0">
                                <Heart className="w-4 h-4 mr-1" />
                                <span className="text-xs">12</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="h-auto p-0">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                <span className="text-xs">Reply</span>
                              </Button>
                            </div>
                          </div>
                          
                          <div className="ml-8 mt-3 flex gap-3">
                            <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-white font-medium text-xs">
                              S
                            </div>
                            <div className="flex-1">
                              <div className="bg-muted rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">Sarah</span>
                                  <span className="text-xs text-muted-foreground">1 hour ago</span>
                                </div>
                                <p className="text-sm">
                                  @John Great suggestion! Yes, we're exploring federated learning in our next iteration. Thanks for the feedback!
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-medium text-sm">
                          MK
                        </div>
                        <div className="flex-1">
                          <div className="bg-card border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-sm">Mike Chen</span>
                              <span className="text-xs text-muted-foreground">4 hours ago</span>
                            </div>
                            <p className="text-sm mb-3">
                              The scalability metrics look impressive. How does the system perform under high concurrent loads? Would love to see some stress test results.
                            </p>
                            <div className="flex items-center gap-4">
                              <Button variant="ghost" size="sm" className="h-auto p-0">
                                <Heart className="w-4 h-4 mr-1" />
                                <span className="text-xs">8</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="h-auto p-0">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                <span className="text-xs">Reply</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">Add Comment</h4>
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-innovation rounded-full flex items-center justify-center text-white font-medium text-sm">
                          Me
                        </div>
                        <div className="flex-1 space-y-3">
                          <textarea 
                            className="w-full p-3 border rounded-lg resize-none" 
                            rows={3}
                            placeholder="Share your thoughts on this project..."
                          />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                📷 Image
                              </Button>
                              <Button variant="ghost" size="sm">
                                📎 File
                              </Button>
                            </div>
                            <Button size="sm">Post Comment</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>
              </div>
            </div>
          </TabsContent>

          {/* Interactions Tab */}
          <TabsContent value="interactions" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Interactive Components</h2>
              
              <div className="space-y-6">
                <ComponentShowcase title="Modal & Dialog Systems">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Button>Simple Modal</Button>
                      <Button variant="outline">Confirmation Dialog</Button>
                      <Button variant="destructive">Delete Warning</Button>
                    </div>
                    
                    <div className="border rounded-lg p-6 bg-black/5">
                      <h4 className="font-medium mb-4">Modal Preview</h4>
                      <div className="bg-background border rounded-lg shadow-lg p-6 max-w-md mx-auto">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">Create New Challenge</h3>
                          <Button variant="ghost" size="sm">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Challenge Title</label>
                            <input type="text" className="w-full p-2 border rounded-md" placeholder="Enter title" />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Category</label>
                            <select className="w-full p-2 border rounded-md">
                              <option>AI & Machine Learning</option>
                              <option>Healthcare</option>
                              <option>Climate Tech</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-6">
                          <Button className="flex-1">Create Challenge</Button>
                          <Button variant="outline" className="flex-1">Cancel</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 bg-destructive/5">
                      <h4 className="font-medium mb-3">Confirmation Dialog</h4>
                      <div className="bg-background border rounded-lg shadow-lg p-6 max-w-sm mx-auto">
                        <div className="text-center">
                          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Delete Challenge?</h3>
                          <p className="text-sm text-muted-foreground mb-6">
                            This action cannot be undone. This will permanently delete the challenge and all associated data.
                          </p>
                          <div className="flex gap-2">
                            <Button variant="destructive" className="flex-1">Delete</Button>
                            <Button variant="outline" className="flex-1">Cancel</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Dropdown Menus & Context Menus">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">Dropdown Menu</h4>
                      <div className="space-y-4">
                        <div className="relative inline-block">
                          <Button variant="outline">
                            Actions
                            <ChevronDown className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                        
                        <div className="border rounded-lg shadow-lg bg-background p-1 max-w-48">
                          <div className="py-1">
                            <a href="#" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded">
                              <Edit className="w-4 h-4" />
                              Edit Challenge
                            </a>
                            <a href="#" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded">
                              <Copy className="w-4 h-4" />
                              Duplicate
                            </a>
                            <a href="#" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded">
                              <Download className="w-4 h-4" />
                              Export Data
                            </a>
                            <div className="border-t my-1"></div>
                            <a href="#" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-destructive/10 text-destructive rounded">
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-4">Context Menu</h4>
                      <div className="border rounded-lg p-4 bg-muted/30 text-center cursor-context-menu">
                        <p className="text-sm text-muted-foreground mb-2">Right-click anywhere in this area</p>
                        <div className="border rounded-lg shadow-lg bg-background p-1 max-w-48 mx-auto">
                          <div className="py-1">
                            <a href="#" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded">
                              <Copy className="w-4 h-4" />
                              Copy
                            </a>
                            <a href="#" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded">
                              <Edit className="w-4 h-4" />
                              Edit
                            </a>
                            <a href="#" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded">
                              <Search className="w-4 h-4" />
                              Inspect
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Tooltips & Popovers">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">Tooltip Examples</h4>
                      <div className="space-y-4">
                        <div className="flex gap-4 items-center">
                          <div className="relative group">
                            <Button variant="outline">
                              <HelpCircle className="w-4 h-4" />
                            </Button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                              <div className="bg-foreground text-background text-xs rounded py-1 px-2 whitespace-nowrap">
                                Click for help
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-foreground"></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="relative group">
                            <Button>
                              <Settings className="w-4 h-4" />
                            </Button>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 hidden group-hover:block">
                              <div className="bg-foreground text-background text-xs rounded py-1 px-2 whitespace-nowrap">
                                Settings
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-foreground"></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="relative group">
                            <Button variant="destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                              <div className="bg-foreground text-background text-xs rounded py-1 px-2 whitespace-nowrap">
                                Delete permanently
                                <div className="absolute top-full right-2 border-4 border-transparent border-t-foreground"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-4">Popover Content</h4>
                      <div className="space-y-4">
                        <Button variant="outline">
                          User Profile
                          <ChevronDown className="w-4 h-4 ml-2" />
                        </Button>
                        
                        <div className="border rounded-lg shadow-lg bg-background p-4 max-w-64">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                              JD
                            </div>
                            <div>
                              <p className="font-medium">John Doe</p>
                              <p className="text-sm text-muted-foreground">AI Researcher</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              john@example.com
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              San Francisco, CA
                            </div>
                          </div>
                          <div className="border-t mt-3 pt-3">
                            <Button size="sm" className="w-full">View Profile</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Accordion & Collapsible Content">
                  <div className="space-y-4">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="border-b">
                        <button className="w-full flex items-center justify-between p-4 text-left hover:bg-accent">
                          <span className="font-medium">Challenge Guidelines</span>
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <div className="p-4 bg-muted/30">
                          <p className="text-sm text-muted-foreground">
                            All submissions must include original code, documentation, and a demo video. 
                            Projects will be evaluated based on innovation, technical implementation, and potential impact.
                          </p>
                        </div>
                      </div>
                      
                      <div className="border-b">
                        <button className="w-full flex items-center justify-between p-4 text-left hover:bg-accent">
                          <span className="font-medium">Submission Requirements</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="border-b">
                        <button className="w-full flex items-center justify-between p-4 text-left hover:bg-accent">
                          <span className="font-medium">Judging Criteria</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div>
                        <button className="w-full flex items-center justify-between p-4 text-left hover:bg-accent">
                          <span className="font-medium">Prize Information</span>
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <div className="p-4 bg-muted/30">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>🥇 First Place</span>
                              <span className="font-medium">$50,000</span>
                            </div>
                            <div className="flex justify-between">
                              <span>🥈 Second Place</span>
                              <span className="font-medium">$25,000</span>
                            </div>
                            <div className="flex justify-between">
                              <span>🥉 Third Place</span>
                              <span className="font-medium">$10,000</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Calendar & Date Picker">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">Date Picker</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Challenge Deadline</label>
                          <div className="relative">
                            <input 
                              type="text" 
                              className="w-full p-3 border rounded-lg pr-10" 
                              placeholder="Select date"
                              value="March 15, 2024"
                              readOnly
                            />
                            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4 bg-background shadow-lg max-w-sm">
                          <div className="flex items-center justify-between mb-4">
                            <Button variant="ghost" size="sm">
                              <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <span className="font-medium">March 2024</span>
                            <Button variant="ghost" size="sm">
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-7 gap-1 mb-2">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                              <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                                {day}
                              </div>
                            ))}
                          </div>
                          
                          <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: 35 }, (_, i) => {
                              const day = i - 5;
                              const isCurrentMonth = day > 0 && day <= 31;
                              const isSelected = day === 15;
                              const isToday = day === 12;
                              
                              return (
                                <button
                                  key={i}
                                  className={`text-center text-sm p-2 rounded hover:bg-accent ${
                                    !isCurrentMonth ? 'text-muted-foreground' :
                                    isSelected ? 'bg-primary text-primary-foreground' :
                                    isToday ? 'bg-accent font-medium' : ''
                                  }`}
                                >
                                  {isCurrentMonth ? day : ''}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-4">Time Picker</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Submission Time</label>
                          <div className="flex gap-2">
                            <select className="flex-1 p-2 border rounded-md">
                              {Array.from({ length: 12 }, (_, i) => (
                                <option key={i} value={i + 1}>{i + 1}</option>
                              ))}
                            </select>
                            <select className="flex-1 p-2 border rounded-md">
                              {Array.from({ length: 60 }, (_, i) => (
                                <option key={i} value={i.toString().padStart(2, '0')}>
                                  {i.toString().padStart(2, '0')}
                                </option>
                              ))}
                            </select>
                            <select className="p-2 border rounded-md">
                              <option>AM</option>
                              <option>PM</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-2 block">Duration</label>
                          <div className="flex items-center gap-2">
                            <input type="range" min="1" max="24" defaultValue="8" className="flex-1" />
                            <span className="text-sm font-medium w-16">8 hours</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Drag & Drop Interfaces">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-4">Sortable Task List</h4>
                      <div className="space-y-2 max-w-md">
                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-background cursor-move hover:shadow-md transition-shadow">
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium">Define project requirements</p>
                            <p className="text-sm text-muted-foreground">High priority</p>
                          </div>
                          <Badge className="bg-destructive/90 text-destructive-foreground">High</Badge>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-background cursor-move hover:shadow-md transition-shadow">
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium">Design system architecture</p>
                            <p className="text-sm text-muted-foreground">Medium priority</p>
                          </div>
                          <Badge className="bg-warning/90 text-warning-foreground">Medium</Badge>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-background cursor-move hover:shadow-md transition-shadow">
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium">Create documentation</p>
                            <p className="text-sm text-muted-foreground">Low priority</p>
                          </div>
                          <Badge className="bg-success/90 text-success-foreground">Low</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-4">Kanban Board</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-4 bg-muted/30">
                          <h5 className="font-medium mb-3 flex items-center justify-between">
                            To Do
                            <Badge variant="secondary">3</Badge>
                          </h5>
                          <div className="space-y-2">
                            <div className="p-3 bg-background border rounded-lg cursor-move hover:shadow-md transition-shadow">
                              <p className="font-medium text-sm">AI Model Training</p>
                              <p className="text-xs text-muted-foreground mt-1">Due in 3 days</p>
                            </div>
                            <div className="p-3 bg-background border rounded-lg cursor-move hover:shadow-md transition-shadow">
                              <p className="font-medium text-sm">Data Preprocessing</p>
                              <p className="text-xs text-muted-foreground mt-1">Due in 5 days</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4 bg-primary/5">
                          <h5 className="font-medium mb-3 flex items-center justify-between">
                            In Progress
                            <Badge variant="secondary">2</Badge>
                          </h5>
                          <div className="space-y-2">
                            <div className="p-3 bg-background border rounded-lg cursor-move hover:shadow-md transition-shadow">
                              <p className="font-medium text-sm">UI Development</p>
                              <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                                <div className="bg-primary h-1.5 rounded-full" style={{ width: '60%' }}></div>
                              </div>
                            </div>
                            <div className="p-3 bg-background border rounded-lg cursor-move hover:shadow-md transition-shadow">
                              <p className="font-medium text-sm">API Integration</p>
                              <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                                <div className="bg-primary h-1.5 rounded-full" style={{ width: '30%' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4 bg-success/5">
                          <h5 className="font-medium mb-3 flex items-center justify-between">
                            Done
                            <Badge variant="secondary">4</Badge>
                          </h5>
                          <div className="space-y-2">
                            <div className="p-3 bg-background border rounded-lg opacity-75">
                              <p className="font-medium text-sm">Project Setup</p>
                              <div className="flex items-center gap-1 mt-1">
                                <CheckCircle className="w-3 h-3 text-success" />
                                <span className="text-xs text-success">Completed</span>
                              </div>
                            </div>
                            <div className="p-3 bg-background border rounded-lg opacity-75">
                              <p className="font-medium text-sm">Research Phase</p>
                              <div className="flex items-center gap-1 mt-1">
                                <CheckCircle className="w-3 h-3 text-success" />
                                <span className="text-xs text-success">Completed</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Resizable Panels & Layouts">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-4">Split Pane Layout</h4>
                      <div className="border rounded-lg overflow-hidden h-64 flex">
                        <div className="w-1/3 bg-muted/30 p-4 border-r">
                          <h5 className="font-medium mb-2">Sidebar</h5>
                          <p className="text-sm text-muted-foreground">Resizable sidebar content</p>
                        </div>
                        <div className="w-1 bg-border cursor-col-resize hover:bg-accent flex items-center justify-center">
                          <GripVertical className="w-3 h-3 text-muted-foreground rotate-90" />
                        </div>
                        <div className="flex-1 p-4">
                          <h5 className="font-medium mb-2">Main Content</h5>
                          <p className="text-sm text-muted-foreground">
                            This area adjusts as you resize the sidebar. Drag the divider to test.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-4">Resizable Cards</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative border rounded-lg p-4 bg-background min-h-32">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium">Chart Widget</h5>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Minimize2 className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Maximize2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">Resizable chart content</p>
                          <div className="absolute bottom-1 right-1 w-3 h-3 bg-muted cursor-se-resize"></div>
                        </div>
                        
                        <div className="relative border rounded-lg p-4 bg-background min-h-32">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium">Data Table</h5>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Minimize2 className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Maximize2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">Resizable table widget</p>
                          <div className="absolute bottom-1 right-1 w-3 h-3 bg-muted cursor-se-resize"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>
              </div>
            </div>
          </TabsContent>

          {/* Spacing Tab */}
          <TabsContent value="spacing" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Spacing & Layout</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ComponentShowcase title="Spacing Scale">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-8 bg-primary"></div>
                      <span className="text-sm">0.5rem (8px) - space-2</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-8 bg-primary"></div>
                      <span className="text-sm">1rem (16px) - space-4</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-8 bg-primary"></div>
                      <span className="text-sm">1.5rem (24px) - space-6</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary"></div>
                      <span className="text-sm">2rem (32px) - space-8</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-primary"></div>
                      <span className="text-sm">3rem (48px) - space-12</span>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Border Radius">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-16 bg-accent rounded-none border flex items-center justify-center text-sm">
                      None
                    </div>
                    <div className="h-16 bg-accent rounded-sm border flex items-center justify-center text-sm">
                      Small
                    </div>
                    <div className="h-16 bg-accent rounded-md border flex items-center justify-center text-sm">
                      Medium
                    </div>
                    <div className="h-16 bg-accent rounded-lg border flex items-center justify-center text-sm">
                      Large
                    </div>
                    <div className="h-16 bg-accent rounded-xl border flex items-center justify-center text-sm">
                      XL
                    </div>
                    <div className="h-16 bg-accent rounded-full border flex items-center justify-center text-sm">
                      Full
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Container Layouts">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Flex Row</h4>
                      <div className="flex gap-2">
                        <div className="flex-1 h-8 bg-primary/20 rounded"></div>
                        <div className="flex-1 h-8 bg-primary/40 rounded"></div>
                        <div className="flex-1 h-8 bg-primary/60 rounded"></div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Grid Layout</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-8 bg-secondary/20 rounded"></div>
                        <div className="h-8 bg-secondary/40 rounded"></div>
                        <div className="h-8 bg-secondary/60 rounded"></div>
                        <div className="h-8 bg-secondary/80 rounded"></div>
                        <div className="h-8 bg-secondary rounded"></div>
                        <div className="h-8 bg-secondary/60 rounded"></div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Responsive Breakpoints">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-primary rounded"></div>
                      <span className="text-sm">sm: 640px and up</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-secondary rounded"></div>
                      <span className="text-sm">md: 768px and up</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-accent rounded"></div>
                      <span className="text-sm">lg: 1024px and up</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-muted rounded"></div>
                      <span className="text-sm">xl: 1280px and up</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-innovation rounded"></div>
                      <span className="text-sm">2xl: 1536px and up</span>
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

                <ComponentShowcase title="Data Tables">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Filter className="w-4 h-4 mr-2" />
                          Filter
                        </Button>
                        <Button variant="outline" size="sm">
                          <ArrowUpDown className="w-4 h-4 mr-2" />
                          Sort
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <List className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Grid className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left p-4 font-medium">Name</th>
                            <th className="text-left p-4 font-medium">Status</th>
                            <th className="text-left p-4 font-medium">Participants</th>
                            <th className="text-left p-4 font-medium">Prize</th>
                            <th className="text-left p-4 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t hover:bg-muted/30">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                  <Sparkles className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">Climate Tech Innovation</p>
                                  <p className="text-sm text-muted-foreground">Environmental solutions</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge className="bg-success/90 text-success-foreground">Active</Badge>
                            </td>
                            <td className="p-4 text-muted-foreground">127</td>
                            <td className="p-4 font-medium">$50,000</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-t hover:bg-muted/30">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                                  <CreditCard className="w-4 h-4 text-secondary" />
                                </div>
                                <div>
                                  <p className="font-medium">Fintech Revolution</p>
                                  <p className="text-sm text-muted-foreground">Digital banking solutions</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge className="bg-warning/90 text-warning-foreground">Review</Badge>
                            </td>
                            <td className="p-4 text-muted-foreground">89</td>
                            <td className="p-4 font-medium">$30,000</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Dashboard Widgets">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Total Users</h4>
                        <Users className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-2xl font-bold">12,543</p>
                      <p className="text-sm text-success flex items-center gap-1">
                        +12.5% from last month
                      </p>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Active Challenges</h4>
                        <Target className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-2xl font-bold">24</p>
                      <p className="text-sm text-warning flex items-center gap-1">
                        +3 this week
                      </p>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Total Prizes</h4>
                        <Award className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-2xl font-bold">$2.1M</p>
                      <p className="text-sm text-success flex items-center gap-1">
                        +$250K this quarter
                      </p>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Submissions</h4>
                        <Upload className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-2xl font-bold">1,205</p>
                      <p className="text-sm text-destructive flex items-center gap-1">
                        -5.2% from last week
                      </p>
                    </Card>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Navigation Patterns">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-4">Breadcrumb Navigation</h4>
                      <nav className="flex items-center space-x-2 text-sm">
                        <a href="#" className="text-muted-foreground hover:text-foreground">Home</a>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        <a href="#" className="text-muted-foreground hover:text-foreground">Challenges</a>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground font-medium">Smart City Solutions</span>
                      </nav>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-4">Pagination</h4>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Showing 1 to 10 of 47 results</p>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" disabled>Previous</Button>
                          <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
                          <Button variant="outline" size="sm">2</Button>
                          <Button variant="outline" size="sm">3</Button>
                          <span className="text-muted-foreground">...</span>
                          <Button variant="outline" size="sm">47</Button>
                          <Button variant="outline" size="sm">Next</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-4">Tab Navigation</h4>
                      <div className="border-b">
                        <nav className="flex space-x-8">
                          <a href="#" className="border-b-2 border-primary text-primary py-2 px-1 text-sm font-medium">Overview</a>
                          <a href="#" className="text-muted-foreground hover:text-foreground py-2 px-1 text-sm font-medium">Participants</a>
                          <a href="#" className="text-muted-foreground hover:text-foreground py-2 px-1 text-sm font-medium">Submissions</a>
                          <a href="#" className="text-muted-foreground hover:text-foreground py-2 px-1 text-sm font-medium">Results</a>
                        </nav>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Search & Filter Patterns">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-4">Advanced Search</h4>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <input 
                              type="text" 
                              className="w-full pl-10 pr-3 py-2 border rounded-lg" 
                              placeholder="Search challenges..."
                            />
                          </div>
                          <Button>Search</Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <select className="border rounded-md px-3 py-1 text-sm">
                            <option>All Categories</option>
                            <option>Technology</option>
                            <option>Healthcare</option>
                            <option>Environment</option>
                          </select>
                          <select className="border rounded-md px-3 py-1 text-sm">
                            <option>All Status</option>
                            <option>Active</option>
                            <option>Coming Soon</option>
                            <option>Closed</option>
                          </select>
                          <select className="border rounded-md px-3 py-1 text-sm">
                            <option>Prize Amount</option>
                            <option>$0 - $1,000</option>
                            <option>$1,000 - $10,000</option>
                            <option>$10,000+</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-4">Active Filters</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          Technology
                          <X className="w-3 h-3 cursor-pointer" />
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          Active Status
                          <X className="w-3 h-3 cursor-pointer" />
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          $10,000+ Prize
                          <X className="w-3 h-3 cursor-pointer" />
                        </Badge>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          Clear all
                        </Button>
                      </div>
                    </div>
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

          {/* States Tab */}
          <TabsContent value="states" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Application States</h2>
              
              <div className="space-y-6">
                <ComponentShowcase title="Loading States">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 border rounded-lg">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      <span>Loading content...</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted animate-pulse rounded"></div>
                      <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                      <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-12 h-12 bg-muted animate-pulse rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted animate-pulse rounded"></div>
                        <div className="h-3 bg-muted animate-pulse rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Error States">
                  <div className="space-y-4">
                    <div className="text-center p-8 border border-destructive/20 rounded-lg bg-destructive/5">
                      <X className="w-12 h-12 text-destructive mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-destructive mb-2">Something went wrong</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        We encountered an error while loading this content.
                      </p>
                      <Button variant="outline" size="sm">
                        Try Again
                      </Button>
                    </div>
                    <div className="flex items-center gap-3 p-3 border border-warning/20 rounded-lg bg-warning/5">
                      <AlertCircle className="w-5 h-5 text-warning" />
                      <div className="flex-1">
                        <p className="font-medium text-warning">Connection Issue</p>
                        <p className="text-sm text-warning/80">Please check your internet connection</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Retry
                      </Button>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Empty States">
                  <div className="space-y-4">
                    <div className="text-center p-8 border-2 border-dashed border-muted rounded-lg">
                      <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No results found</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Try adjusting your search criteria or browse all challenges.
                      </p>
                      <Button variant="outline" size="sm">
                        Browse All
                      </Button>
                    </div>
                    <div className="text-center p-6 border rounded-lg">
                      <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                      <h4 className="font-medium mb-2">Start your first challenge</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Create a challenge to get started
                      </p>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Challenge
                      </Button>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Connection States">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-success/10 border border-success/20 rounded-lg">
                      <Wifi className="w-5 h-5 text-success" />
                      <span className="text-sm text-success">Connected</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                      <Wifi className="w-5 h-5 text-warning" />
                      <span className="text-sm text-warning">Reconnecting...</span>
                      <Loader2 className="w-4 h-4 animate-spin text-warning ml-auto" />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <WifiOff className="w-5 h-5 text-destructive" />
                      <span className="text-sm text-destructive">Offline</span>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Form States">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <input 
                        type="email" 
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary" 
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Password</label>
                      <input 
                        type="password" 
                        className="w-full p-2 border border-destructive rounded-md focus:ring-2 focus:ring-destructive/50" 
                        placeholder="Enter password"
                      />
                      <p className="text-xs text-destructive">Password must be at least 8 characters</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Username</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-success rounded-md focus:ring-2 focus:ring-success/50" 
                        placeholder="Enter username"
                      />
                      <p className="text-xs text-success">Username is available</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Bio (Optional)</label>
                      <textarea 
                        disabled
                        className="w-full p-2 border rounded-md bg-muted text-muted-foreground cursor-not-allowed" 
                        placeholder="Tell us about yourself"
                        rows={3}
                      />
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Progress Indicators">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Upload Progress</span>
                        <span>75%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Challenge Completion</span>
                        <span>3 of 5 steps</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 h-2 bg-success rounded-full"></div>
                        <div className="flex-1 h-2 bg-success rounded-full"></div>
                        <div className="flex-1 h-2 bg-success rounded-full"></div>
                        <div className="flex-1 h-2 bg-muted rounded-full"></div>
                        <div className="flex-1 h-2 bg-muted rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16">
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                          <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted" />
                          <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-primary" strokeDasharray="175.929" strokeDashoffset="52.778" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-medium">70%</span>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">Project Progress</p>
                        <p className="text-sm text-muted-foreground">7 out of 10 tasks completed</p>
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