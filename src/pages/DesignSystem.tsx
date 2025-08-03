import React, { useState } from 'react';
import { 
  Palette, Eye, Type, Layout, Zap, Copy, Check, 
  Sun, Moon, ChevronDown, ChevronRight, Star,
  Heart, AlertCircle, CheckCircle, Info, X,
  Sparkles, Award, Clock, Users, Target, Search,
  Upload, Download, Play, Pause, Settings, Home,
  Mail, Phone, MapPin, Calendar, Edit, Trash2,
  Plus, Minus, Filter, ArrowUpDown, Grid, List, Bell,
  Shield, Lock, Unlock, User, CreditCard, Gift,
  Loader2, Wifi, WifiOff, Battery, Volume2, VolumeX
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
          <TabsList className="grid w-full grid-cols-8">
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
            <TabsTrigger value="forms" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Forms
            </TabsTrigger>
            <TabsTrigger value="spacing" className="flex items-center gap-2">
              <Grid className="h-4 w-4" />
              Spacing
            </TabsTrigger>
            <TabsTrigger value="effects" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Effects
            </TabsTrigger>
            <TabsTrigger value="patterns" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Patterns
            </TabsTrigger>
            <TabsTrigger value="states" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
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