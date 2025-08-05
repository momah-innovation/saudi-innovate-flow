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
  GripVertical, Move, Maximize2, Minimize2, Share,
  Menu, ArrowRight, ArrowLeft, Languages, ThumbsUp,
  ExternalLink, TrendingUp, FileText, Image as ImageIcon, Code
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/components/ui/theme-provider';
import { EnhancedBreadcrumb } from '@/components/ui/enhanced-breadcrumb';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { NotificationCenter } from '@/components/ui/notification-center';
import { AdvancedDataTable } from '@/components/ui/advanced-data-table';
import { MediaGallery } from '@/components/ui/media-gallery';
import { FileUploader } from '@/components/ui/file-uploader-advanced';
import { CommandPalette, useCommandPalette } from '@/components/ui/command-palette';
import { StarRating, FeedbackForm } from '@/components/ui/feedback';
import { ProductTour, useProductTour } from '@/components/ui/product-tour';
import { SimpleLineChart, SimpleBarChart, SimpleDonutChart, MetricCard, AnalyticsOverview } from '@/components/ui/charts';
import { SplitView, ResizablePanel, MasonryLayout } from '@/components/ui/layout-components';
import { AdvancedSearch } from '@/components/ui/advanced-search';
import { CalendarView } from '@/components/ui/calendar-scheduler';

import { cn } from '@/lib/utils';

const DesignSystem = () => {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  // Sample data for component demonstrations
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'New Challenge Available',
      message: 'A new innovation challenge has been posted that matches your expertise.',
      type: 'info' as const,
      timestamp: new Date(),
      read: false
    },
    {
      id: '2', 
      title: 'Evaluation Complete',
      message: 'Your idea evaluation has been completed by the expert panel.',
      type: 'success' as const,
      timestamp: new Date(Date.now() - 86400000),
      read: true
    }
  ]);

  const sampleTableData = [
    { id: 1, name: 'Innovation Challenge 2024', status: 'Active', participants: 45, deadline: '2024-12-31' },
    { id: 2, name: 'Smart City Solutions', status: 'Draft', participants: 12, deadline: '2024-11-30' },
    { id: 3, name: 'Sustainability Initiative', status: 'Completed', participants: 89, deadline: '2024-10-15' }
  ];

  const sampleMedia = [
    { id: '1', src: '/placeholder.svg', type: 'image' as const, title: 'Innovation Workshop', size: '2.3 MB' },
    { id: '2', src: '/placeholder.svg', type: 'image' as const, title: 'Team Collaboration', size: '1.8 MB' },
    { id: '3', src: '/placeholder.svg', type: 'document' as const, title: 'Project Report.pdf', size: '5.2 MB' }
  ];

  // Command palette setup
  const commandActions = [
    { id: 'new-challenge', title: 'Create Challenge', description: 'Start a new innovation challenge', category: 'Create', onSelect: () => toast({ title: 'Creating challenge...' }) },
    { id: 'new-idea', title: 'Submit Idea', description: 'Share your innovative idea', category: 'Create', onSelect: () => toast({ title: 'Opening idea form...' }) },
    { id: 'analytics', title: 'View Analytics', description: 'Check platform insights', category: 'Navigate', onSelect: () => toast({ title: 'Opening analytics...' }) }
  ];
  
  const { isOpen: isCommandOpen, open: openCommand, close: closeCommand, updateRecent } = useCommandPalette(commandActions);

  // Sample data for new components
  const chartData = [
    { label: 'Jan', value: 65 },
    { label: 'Feb', value: 78 },
    { label: 'Mar', value: 82 },
    { label: 'Apr', value: 95 }
  ];

  const searchFilters = [
    { id: 'status', label: 'Status', type: 'select' as const, options: [
      { value: 'active', label: 'Active' },
      { value: 'completed', label: 'Completed' },
      { value: 'draft', label: 'Draft' }
    ]},
    { id: 'category', label: 'Category', type: 'multiselect' as const, options: [
      { value: 'innovation', label: 'Innovation' },
      { value: 'tech', label: 'Technology' },
      { value: 'design', label: 'Design' }
    ]}
  ];

  const calendarEvents = [
    {
      id: '1',
      title: 'Innovation Workshop',
      startDate: new Date(2024, 11, 15, 9, 0),
      endDate: new Date(2024, 11, 15, 11, 0),
      color: 'hsl(var(--primary))',
      attendees: 25,
      location: 'Conference Room A'
    },
    {
      id: '2', 
      title: 'Design Review',
      startDate: new Date(2024, 11, 18, 14, 0),
      endDate: new Date(2024, 11, 18, 15, 30),
      color: 'hsl(var(--success))',
      attendees: 8,
      type: 'meeting' as const
    }
  ];

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
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-primary/20 backdrop-blur-sm rounded-lg">
          {copiedToken === className ? (
            <Check className="h-5 w-5 text-primary-foreground" />
          ) : (
            <Copy className="h-5 w-5 text-primary-foreground" />
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
      {/* Hero Header with Primary Theme */}
      <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 border-b">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-primary-foreground mb-2">Design System</h1>
              <p className="text-primary-foreground/80 text-lg">
                Explore tokens, components, and design patterns
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme({ 
                  colorScheme: theme.colorScheme === 'dark' ? 'light' : 'dark' 
                })}
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              >
                {theme.colorScheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="index" className="w-full">
          <TabsList className="inline-flex h-10 w-full items-center justify-start rounded-xl bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 backdrop-blur-sm border border-primary/20 p-1 text-muted-foreground shadow-lg overflow-x-auto scrollbar-thin scrollbar-thumb-primary/20">
            <TabsTrigger value="index" className="flex items-center gap-1 text-xs px-3 py-1.5 whitespace-nowrap font-medium bg-primary/90 text-primary-foreground">
              <Grid className="h-3 w-3" />
              📋 Index
            </TabsTrigger>
            <TabsTrigger value="colors" className="flex items-center gap-1 text-xs px-2 py-1 whitespace-nowrap">
              <Palette className="h-3 w-3" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center gap-1 text-xs px-2 py-1 whitespace-nowrap">
              <Type className="h-3 w-3" />
              Type
            </TabsTrigger>
            <TabsTrigger value="components" className="flex items-center gap-1 text-xs px-2 py-1 whitespace-nowrap">
              <Layout className="h-3 w-3" />
              UI
            </TabsTrigger>
            <TabsTrigger value="forms" className="flex items-center gap-1 text-xs px-2 py-1 whitespace-nowrap">
              <Edit className="h-3 w-3" />
              Forms
            </TabsTrigger>
            <TabsTrigger value="navigation" className="flex items-center gap-1 text-xs px-2 py-1 whitespace-nowrap">
              <Home className="h-3 w-3" />
              Nav
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-1 text-xs px-2 py-1 whitespace-nowrap">
              <Grid className="h-3 w-3" />
              Data
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-1 text-xs px-2 py-1 whitespace-nowrap">
              <Play className="h-3 w-3" />
              Media
            </TabsTrigger>
            <TabsTrigger value="communication" className="flex items-center gap-1 text-xs px-2 py-1 whitespace-nowrap">
              <Bell className="h-3 w-3" />
              Comms
            </TabsTrigger>
            <TabsTrigger value="interactions" className="flex items-center gap-1 text-xs px-2 py-1 whitespace-nowrap">
              <Zap className="h-3 w-3" />
              FX
            </TabsTrigger>
            <TabsTrigger value="spacing" className="flex items-center gap-1 text-xs px-2 py-1 whitespace-nowrap">
              <Target className="h-3 w-3" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="patterns" className="flex items-center gap-1 text-xs px-2 py-1 whitespace-nowrap">
              <Eye className="h-3 w-3" />
              Patterns
            </TabsTrigger>
            <TabsTrigger value="states" className="flex items-center gap-1 text-xs px-2 py-1 whitespace-nowrap">
              <Settings className="h-3 w-3" />
              States
            </TabsTrigger>
            <TabsTrigger value="widgets" className="flex items-center gap-1 text-xs px-2 py-1 whitespace-nowrap">
              <Grid className="h-3 w-3" />
              Widgets
            </TabsTrigger>
            <TabsTrigger value="animations" className="flex items-center gap-1 text-xs px-2 py-1 whitespace-nowrap">
              <Zap className="h-3 w-3" />
              Icons
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center gap-1 text-xs px-2 py-1 whitespace-nowrap">
              <Award className="h-3 w-3" />
              Brand
            </TabsTrigger>
            <TabsTrigger value="css-vs-tailwind" className="flex items-center gap-1 text-xs px-2 py-1 whitespace-nowrap">
              <Code className="h-3 w-3" />
              CSS vs Tailwind
            </TabsTrigger>
            <TabsTrigger value="enhanced" className="flex items-center gap-1 text-xs px-2 py-1 whitespace-nowrap bg-primary/90 text-primary-foreground">
              <Sparkles className="h-3 w-3" />
              ✨ New
            </TabsTrigger>
          </TabsList>

          {/* Index Tab */}
          <TabsContent value="index" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">📋 Design System Index</h2>
              <p className="text-muted-foreground mb-8">
                Complete overview of all components, patterns, and design tokens available in this system.
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                
                {/* Colors & Theming */}
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Palette className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Colors & Theming</h3>
                      <p className="text-sm text-muted-foreground">Semantic color tokens & themes</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Primary Colors</span>
                      <Badge variant="outline" className="text-xs">4 tokens</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Status Colors</span>
                      <Badge variant="outline" className="text-xs">4 tokens</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Role Colors</span>
                      <Badge variant="outline" className="text-xs">3 tokens</Badge>
                    </div>
                  </div>
                </Card>

                {/* Typography */}
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                      <Type className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Typography</h3>
                      <p className="text-sm text-muted-foreground">Text scales & hierarchy</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Heading Levels</span>
                      <Badge variant="outline" className="text-xs">5 levels</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Body Text</span>
                      <Badge variant="outline" className="text-xs">3 sizes</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Font Weights</span>
                      <Badge variant="outline" className="text-xs">4 weights</Badge>
                    </div>
                  </div>
                </Card>

                {/* Components */}
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                      <Layout className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">UI Components</h3>
                      <p className="text-sm text-muted-foreground">Interactive elements</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Buttons</span>
                      <Badge variant="outline" className="text-xs">5 variants</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Badges</span>
                      <Badge variant="outline" className="text-xs">4 variants</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Status Indicators</span>
                      <Badge variant="outline" className="text-xs">3 states</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Interactive States</span>
                      <Badge variant="outline" className="text-xs">3 effects</Badge>
                    </div>
                  </div>
                </Card>

                {/* Forms */}
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-success to-innovation flex items-center justify-center">
                      <Edit className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Form Components</h3>
                      <p className="text-sm text-muted-foreground">Input & form elements</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Input Types</span>
                      <Badge variant="outline" className="text-xs">8 types</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Validation States</span>
                      <Badge variant="outline" className="text-xs">3 states</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Multi-step Wizards</span>
                      <Badge variant="outline" className="text-xs">4 steps</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Advanced Inputs</span>
                      <Badge variant="outline" className="text-xs">6 components</Badge>
                    </div>
                  </div>
                </Card>

                {/* Navigation */}
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-warning to-destructive flex items-center justify-center">
                      <Home className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Navigation</h3>
                      <p className="text-sm text-muted-foreground">Headers & navigation systems</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>System Headers</span>
                      <Badge variant="outline" className="text-xs">3 types</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Breadcrumbs</span>
                      <Badge variant="outline" className="text-xs">2 styles</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Tab Systems</span>
                      <Badge variant="outline" className="text-xs">4 variants</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Sidebar Navigation</span>
                      <Badge variant="outline" className="text-xs">2 layouts</Badge>
                    </div>
                  </div>
                </Card>

                {/* Data Display */}
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-expert to-partner flex items-center justify-center">
                      <Grid className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Data Display</h3>
                      <p className="text-sm text-muted-foreground">Tables & data visualization</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Data Tables</span>
                      <Badge variant="outline" className="text-xs">3 variants</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Card Layouts</span>
                      <Badge variant="outline" className="text-xs">4 types</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Lists</span>
                      <Badge variant="outline" className="text-xs">3 styles</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Grid Systems</span>
                      <Badge variant="outline" className="text-xs">5 layouts</Badge>
                    </div>
                  </div>
                </Card>

                {/* Media */}
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-innovator to-success flex items-center justify-center">
                      <Play className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Media Components</h3>
                      <p className="text-sm text-muted-foreground">Images, video & media</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Image Galleries</span>
                      <Badge variant="outline" className="text-xs">3 layouts</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Video Players</span>
                      <Badge variant="outline" className="text-xs">2 styles</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Media Cards</span>
                      <Badge variant="outline" className="text-xs">4 variants</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Carousels</span>
                      <Badge variant="outline" className="text-xs">2 types</Badge>
                    </div>
                  </div>
                </Card>

                {/* Communication */}
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-warning to-innovation flex items-center justify-center">
                      <Bell className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Communication</h3>
                      <p className="text-sm text-muted-foreground">Notifications & messaging</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Notifications</span>
                      <Badge variant="outline" className="text-xs">4 types</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Toast Messages</span>
                      <Badge variant="outline" className="text-xs">4 variants</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Chat Interfaces</span>
                      <Badge variant="outline" className="text-xs">2 layouts</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Alert Dialogs</span>
                      <Badge variant="outline" className="text-xs">3 types</Badge>
                    </div>
                  </div>
                </Card>

                {/* Interactions */}
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-destructive to-warning flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Interactions</h3>
                      <p className="text-sm text-muted-foreground">Animations & micro-interactions</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Hover Effects</span>
                      <Badge variant="outline" className="text-xs">5 effects</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Loading States</span>
                      <Badge variant="outline" className="text-xs">4 animations</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Transitions</span>
                      <Badge variant="outline" className="text-xs">6 types</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Progress Indicators</span>
                      <Badge variant="outline" className="text-xs">3 styles</Badge>
                    </div>
                  </div>
                </Card>

                {/* Spacing & Layout */}
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
                      <Target className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Spacing & Layout</h3>
                      <p className="text-sm text-muted-foreground">Grid systems & spacing</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Grid Layouts</span>
                      <Badge variant="outline" className="text-xs">6 systems</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Spacing Utilities</span>
                      <Badge variant="outline" className="text-xs">8 scales</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Responsive Breakpoints</span>
                      <Badge variant="outline" className="text-xs">5 sizes</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Layout Debugging</span>
                      <Badge variant="outline" className="text-xs">4 tools</Badge>
                    </div>
                  </div>
                </Card>

                {/* Design Patterns */}
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-innovation flex items-center justify-center">
                      <Eye className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Design Patterns</h3>
                      <p className="text-sm text-muted-foreground">Complex UI patterns</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Challenge Cards</span>
                      <Badge variant="outline" className="text-xs">4 variants</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Profile Cards</span>
                      <Badge variant="outline" className="text-xs">3 layouts</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Dashboard Cards</span>
                      <Badge variant="outline" className="text-xs">6 types</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Timeline Components</span>
                      <Badge variant="outline" className="text-xs">2 styles</Badge>
                    </div>
                  </div>
                </Card>

                {/* States & Feedback */}
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-expert to-warning flex items-center justify-center">
                      <Settings className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">States & Feedback</h3>
                      <p className="text-sm text-muted-foreground">Loading, error & empty states</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Loading States</span>
                      <Badge variant="outline" className="text-xs">5 types</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Error States</span>
                      <Badge variant="outline" className="text-xs">4 variants</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Empty States</span>
                      <Badge variant="outline" className="text-xs">3 layouts</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Success States</span>
                      <Badge variant="outline" className="text-xs">3 types</Badge>
                    </div>
                  </div>
                </Card>

                {/* Widgets */}
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-partner to-innovator flex items-center justify-center">
                      <Grid className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Widgets</h3>
                      <p className="text-sm text-muted-foreground">Complex dashboard components</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Analytics Widgets</span>
                      <Badge variant="outline" className="text-xs">6 types</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Calendar Widgets</span>
                      <Badge variant="outline" className="text-xs">3 layouts</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Social Widgets</span>
                      <Badge variant="outline" className="text-xs">4 components</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Financial Widgets</span>
                      <Badge variant="outline" className="text-xs">5 types</Badge>
                    </div>
                  </div>
                </Card>

                {/* Animations & Icons */}
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-success to-accent flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Animations & Icons</h3>
                      <p className="text-sm text-muted-foreground">Motion design & iconography</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Icon Library</span>
                      <Badge variant="outline" className="text-xs">50+ icons</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Micro-animations</span>
                      <Badge variant="outline" className="text-xs">8 effects</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Icon Animations</span>
                      <Badge variant="outline" className="text-xs">4 styles</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Loading Animations</span>
                      <Badge variant="outline" className="text-xs">6 variants</Badge>
                    </div>
                  </div>
                </Card>

                {/* Logo & Branding */}
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-innovation to-expert flex items-center justify-center">
                      <Award className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Logo & Branding</h3>
                      <p className="text-sm text-muted-foreground">Brand identity elements</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Logo Variations</span>
                      <Badge variant="outline" className="text-xs">4 formats</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Brand Colors</span>
                      <Badge variant="outline" className="text-xs">12 colors</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Typography Pairs</span>
                      <Badge variant="outline" className="text-xs">3 combinations</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Brand Guidelines</span>
                      <Badge variant="outline" className="text-xs">5 sections</Badge>
                    </div>
                  </div>
                </Card>

              </div>

              <div className="mt-8 p-6 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 rounded-xl border">
                <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">200+</div>
                    <div className="text-sm text-muted-foreground">Components</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">50+</div>
                    <div className="text-sm text-muted-foreground">Patterns</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">30+</div>
                    <div className="text-sm text-muted-foreground">Color Tokens</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">15</div>
                    <div className="text-sm text-muted-foreground">Categories</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

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
                <ComponentShowcase title="Headers & Navigation Systems">
                  <div className="space-y-8">
                    {/* System Headers */}
                    <div>
                      <h4 className="font-medium mb-4">System Headers</h4>
                      <div className="space-y-4">
                        {/* Main System Header */}
                        <div className="border rounded-lg overflow-hidden">
                          <div className="h-14 border-b bg-background/95 backdrop-blur">
                            <div className="container flex items-center justify-between px-4 h-full">
                              <div className="flex items-center gap-3">
                                <Menu className="w-5 h-5" />
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                                    <span className="text-primary-foreground font-bold text-sm">🏗️</span>
                                  </div>
                                  <h1 className="font-semibold text-sm">Ruwād Innovation System</h1>
                                </div>
                              </div>
                              <div className="flex-1 max-w-md mx-4">
                                <div className="relative">
                                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <input className="w-full h-9 pl-10 pr-4 border rounded-md" placeholder="Search..." />
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Bell className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <User className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Compact System Header */}
                        <div className="border rounded-lg overflow-hidden">
                          <div className="h-12 border-b bg-background">
                            <div className="flex items-center justify-between px-4 h-full">
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                                  <span className="text-primary-foreground text-xs">R</span>
                                </div>
                                <span className="font-medium text-sm">Ruwād</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm">
                                  <Settings className="w-4 h-4" />
                                </Button>
                                <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                                  <span className="text-xs">J</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Page Headers */}
                    <div>
                      <h4 className="font-medium mb-4">Page Headers</h4>
                      <div className="space-y-4">
                        {/* Standard Page Header */}
                        <div className="border rounded-lg p-6">
                          <div className="flex items-start justify-between mb-6">
                            <div>
                              <h1 className="text-3xl font-bold tracking-tight mb-2">Innovation Challenges</h1>
                              <p className="text-muted-foreground text-lg">Discover and participate in cutting-edge technology challenges</p>
                            </div>
                            <Button>
                              <Plus className="w-4 h-4 mr-2" />
                              Create Challenge
                            </Button>
                          </div>
                        </div>
                        
                        {/* Page Header with Stats */}
                        <div className="border rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold tracking-tight">Projects Dashboard</h1>
                                <span className="text-lg text-muted-foreground">(24)</span>
                              </div>
                              <p className="text-muted-foreground">Manage your active and completed projects</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline">
                                <Filter className="w-4 h-4 mr-2" />
                                Filter
                              </Button>
                              <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                New Project
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary">12</div>
                              <div className="text-sm text-muted-foreground">Active</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">8</div>
                              <div className="text-sm text-muted-foreground">Completed</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-amber-600">4</div>
                              <div className="text-sm text-muted-foreground">In Review</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Breadcrumb Page Header */}
                        <div className="border rounded-lg p-6">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                            <Home className="w-4 h-4" />
                            <ChevronRight className="w-4 h-4" />
                            <span>Projects</span>
                            <ChevronRight className="w-4 h-4" />
                            <span>AI Solutions</span>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-foreground">Healthcare Assistant</span>
                          </div>
                          <div className="flex items-start justify-between">
                            <div>
                              <h1 className="text-2xl font-bold mb-2">Healthcare Assistant Project</h1>
                              <p className="text-muted-foreground">AI-powered diagnostic tool for early disease detection</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Share className="w-4 h-4 mr-2" />
                                Share
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hero Headers */}
                    <div>
                      <h4 className="font-medium mb-4">Hero Headers</h4>
                      <div className="space-y-4">
                        {/* Events Hero */}
                        <div className="border rounded-lg overflow-hidden">
                          <div className="relative bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 p-8">
                            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                            <div className="relative z-10">
                              <div className="text-center mb-8">
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-4">
                                  Innovation Events
                                </h1>
                                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                  Join cutting-edge events that shape the future of technology and innovation
                                </p>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-6 mb-8">
                                <div className="text-center p-4 rounded-lg bg-background/50 border hover:scale-105 transition-transform">
                                  <div className="text-2xl font-bold text-primary mb-1">42</div>
                                  <div className="text-sm text-muted-foreground">Total Events</div>
                                </div>
                                <div className="text-center p-4 rounded-lg bg-background/50 border hover:scale-105 transition-transform">
                                  <div className="text-2xl font-bold text-accent mb-1">8</div>
                                  <div className="text-sm text-muted-foreground">This Week</div>
                                </div>
                                <div className="text-center p-4 rounded-lg bg-background/50 border hover:scale-105 transition-transform">
                                  <div className="text-2xl font-bold text-secondary mb-1">3</div>
                                  <div className="text-sm text-muted-foreground">Today</div>
                                </div>
                              </div>
                              
                              <div className="flex justify-center gap-3">
                                <Button size="lg">
                                  <Plus className="w-4 h-4 mr-2" />
                                  Create Event
                                </Button>
                                <Button variant="outline" size="lg">
                                  <Filter className="w-4 h-4 mr-2" />
                                  Browse Events
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Landing Hero */}
                        <div className="border rounded-lg overflow-hidden">
                          <div className="bg-gradient-to-r from-primary to-secondary p-12 text-center text-white">
                            <h1 className="text-5xl font-bold mb-4">Welcome to Ruwād</h1>
                            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                              Empowering innovators to solve tomorrow's challenges with cutting-edge technology and collaborative innovation
                            </p>
                            <div className="flex justify-center gap-4">
                              <Button size="lg" variant="secondary">
                                Get Started
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                                <Play className="w-4 h-4 mr-2" />
                                Watch Demo
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Headers */}
                    <div>
                      <h4 className="font-medium mb-4">Mobile Headers</h4>
                      <div className="space-y-4">
                        {/* Mobile System Header */}
                        <div className="border rounded-lg overflow-hidden max-w-sm mx-auto">
                          <div className="h-14 border-b bg-background flex items-center justify-between px-4">
                            <Button variant="ghost" size="sm">
                              <Menu className="w-5 h-5" />
                            </Button>
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground text-xs">R</span>
                              </div>
                              <span className="font-semibold text-sm">Ruwād</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <User className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Mobile Page Header */}
                        <div className="border rounded-lg overflow-hidden max-w-sm mx-auto">
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4" />
                              </Button>
                              <h1 className="font-semibold">Challenge Details</h1>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="text-center">
                              <h2 className="text-lg font-bold mb-1">AI Healthcare Challenge</h2>
                              <p className="text-sm text-muted-foreground">Due in 5 days</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Directional Headers (RTL/LTR) */}
                    <div>
                      <h4 className="font-medium mb-4">Directional Headers</h4>
                      <div className="space-y-4">
                        {/* LTR Header */}
                        <div className="border rounded-lg overflow-hidden">
                          <div className="h-14 border-b bg-background">
                            <div className="flex items-center justify-between px-4 h-full">
                              <div className="flex items-center gap-4">
                                <Button variant="ghost" size="sm">
                                  <Menu className="w-5 h-5" />
                                </Button>
                                <h1 className="text-xl font-semibold">Innovation System</h1>
                                <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">LTR</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Languages className="w-4 h-4" />
                                  English
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Sun className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* RTL Header */}
                        <div className="border rounded-lg overflow-hidden" dir="rtl">
                          <div className="h-14 border-b bg-background">
                            <div className="flex items-center justify-between px-4 h-full">
                              <div className="flex items-center gap-4">
                                <Button variant="ghost" size="sm">
                                  <Menu className="w-5 h-5" />
                                </Button>
                                <h1 className="text-xl font-semibold">نظام رواد للابتكار</h1>
                                <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">RTL</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Languages className="w-4 h-4" />
                                  العربية
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Moon className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Header States */}
                    <div>
                      <h4 className="font-medium mb-4">Header States & Variants</h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Loading State */}
                        <div className="border rounded-lg overflow-hidden">
                          <div className="h-14 border-b bg-background/95 backdrop-blur">
                            <div className="flex items-center justify-between px-4 h-full">
                              <div className="flex items-center gap-3">
                                <div className="w-5 h-5 bg-muted animate-pulse rounded"></div>
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 bg-muted animate-pulse rounded-md"></div>
                                  <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-muted animate-pulse rounded"></div>
                                <div className="w-8 h-8 bg-muted animate-pulse rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Error State */}
                        <div className="border rounded-lg overflow-hidden border-destructive/20">
                          <div className="h-14 border-b border-destructive/20 bg-destructive/5">
                            <div className="flex items-center justify-between px-4 h-full">
                              <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-destructive" />
                                <span className="text-sm text-destructive">Connection Error</span>
                              </div>
                              <Button variant="outline" size="sm" className="border-destructive/20 text-destructive hover:bg-destructive/10">
                                Retry
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Notification Header */}
                        <div className="border rounded-lg overflow-hidden border-amber-200 bg-amber-50">
                          <div className="h-14 border-b border-amber-200">
                            <div className="flex items-center justify-between px-4 h-full">
                              <div className="flex items-center gap-3">
                                <Bell className="w-5 h-5 text-amber-600" />
                                <span className="text-sm text-amber-800">System maintenance in 30 minutes</span>
                              </div>
                              <Button variant="ghost" size="sm" className="text-amber-600">
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Success Header */}
                        <div className="border rounded-lg overflow-hidden border-green-200 bg-green-50">
                          <div className="h-14 border-b border-green-200">
                            <div className="flex items-center justify-between px-4 h-full">
                              <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="text-sm text-green-800">Profile updated successfully</span>
                              </div>
                              <Button variant="ghost" size="sm" className="text-green-600">
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
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

                 <ComponentShowcase title="Multi-step Form Wizard">
                   <div className="space-y-6">
                     <div className="flex items-center justify-between mb-6">
                       <div className="flex items-center space-x-4">
                         <div className="flex items-center">
                           <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                             ✓
                           </div>
                           <span className="ml-2 text-sm font-medium">Personal Info</span>
                         </div>
                         <div className="w-12 h-0.5 bg-primary"></div>
                         <div className="flex items-center">
                           <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                             2
                           </div>
                           <span className="ml-2 text-sm font-medium">Account Setup</span>
                         </div>
                         <div className="w-12 h-0.5 bg-muted"></div>
                         <div className="flex items-center">
                           <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">
                             3
                           </div>
                           <span className="ml-2 text-sm text-muted-foreground">Preferences</span>
                         </div>
                         <div className="w-12 h-0.5 bg-muted"></div>
                         <div className="flex items-center">
                           <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">
                             4
                           </div>
                           <span className="ml-2 text-sm text-muted-foreground">Complete</span>
                         </div>
                       </div>
                     </div>
                     
                     <Card className="p-6">
                       <h4 className="font-medium mb-4">Step 2: Account Setup</h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                           <label className="text-sm font-medium mb-2 block">Username</label>
                           <input 
                             type="text" 
                             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary" 
                             placeholder="Choose a username"
                           />
                         </div>
                         <div>
                           <label className="text-sm font-medium mb-2 block">Password</label>
                           <input 
                             type="password" 
                             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary" 
                             placeholder="Create a password"
                           />
                         </div>
                         <div>
                           <label className="text-sm font-medium mb-2 block">Confirm Password</label>
                           <input 
                             type="password" 
                             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary" 
                             placeholder="Confirm your password"
                           />
                         </div>
                         <div>
                           <label className="text-sm font-medium mb-2 block">Security Question</label>
                           <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background">
                             <option>What was your first pet's name?</option>
                             <option>What city were you born in?</option>
                             <option>What's your mother's maiden name?</option>
                           </select>
                         </div>
                       </div>
                       <div className="flex justify-between mt-6">
                         <Button variant="outline">
                           <ChevronLeft className="w-4 h-4 mr-2" />
                           Previous
                         </Button>
                         <Button>
                           Next Step
                           <ChevronRight className="w-4 h-4 ml-2" />
                         </Button>
                       </div>
                     </Card>
                   </div>
                 </ComponentShowcase>

                 <ComponentShowcase title="Form Validation & Error Handling">
                   <div className="space-y-6">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <div className="space-y-4">
                         <h4 className="font-medium">Validation States</h4>
                         <div>
                           <label className="text-sm font-medium mb-2 block">Valid Input</label>
                           <input 
                             type="email" 
                             className="w-full p-3 border border-success rounded-lg focus:ring-2 focus:ring-success/50" 
                             value="user@example.com"
                             readOnly
                           />
                           <p className="text-sm text-success mt-1 flex items-center gap-1">
                             <CheckCircle className="w-4 h-4" />
                             Email format is valid
                           </p>
                         </div>
                         
                         <div>
                           <label className="text-sm font-medium mb-2 block">Invalid Input</label>
                           <input 
                             type="email" 
                             className="w-full p-3 border border-destructive rounded-lg focus:ring-2 focus:ring-destructive/50" 
                             value="invalid-email"
                             readOnly
                           />
                           <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                             <AlertCircle className="w-4 h-4" />
                             Please enter a valid email address
                           </p>
                         </div>
                         
                         <div>
                           <label className="text-sm font-medium mb-2 block">Warning State</label>
                           <input 
                             type="password" 
                             className="w-full p-3 border border-warning rounded-lg focus:ring-2 focus:ring-warning/50" 
                             value="weak123"
                             readOnly
                           />
                           <p className="text-sm text-warning mt-1 flex items-center gap-1">
                             <AlertCircle className="w-4 h-4" />
                             Password strength: Weak
                           </p>
                         </div>
                       </div>
                       
                       <div className="space-y-4">
                         <h4 className="font-medium">Real-time Validation</h4>
                         <div>
                           <label className="text-sm font-medium mb-2 block">Password Requirements</label>
                           <input 
                             type="password" 
                             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary" 
                             placeholder="Enter password"
                           />
                           <div className="mt-2 space-y-1">
                             <div className="flex items-center gap-2 text-sm">
                               <CheckCircle className="w-4 h-4 text-success" />
                               <span className="text-success">At least 8 characters</span>
                             </div>
                             <div className="flex items-center gap-2 text-sm">
                               <CheckCircle className="w-4 h-4 text-success" />
                               <span className="text-success">Contains uppercase letter</span>
                             </div>
                             <div className="flex items-center gap-2 text-sm">
                               <X className="w-4 h-4 text-destructive" />
                               <span className="text-destructive">Contains number</span>
                             </div>
                             <div className="flex items-center gap-2 text-sm">
                               <X className="w-4 h-4 text-destructive" />
                               <span className="text-destructive">Contains special character</span>
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </ComponentShowcase>

                 <ComponentShowcase title="Advanced Input Components">
                   <div className="space-y-6">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <div className="space-y-4">
                         <div>
                           <label className="text-sm font-medium mb-2 block">Date Range Picker</label>
                           <div className="flex items-center gap-2">
                             <input 
                               type="date" 
                               className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary" 
                               value="2024-01-01"
                             />
                             <span className="text-muted-foreground">to</span>
                             <input 
                               type="date" 
                               className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary" 
                               value="2024-12-31"
                             />
                           </div>
                         </div>
                         
                         <div>
                           <label className="text-sm font-medium mb-2 block">Time Picker</label>
                           <div className="flex items-center gap-2">
                             <select className="flex-1 p-3 border rounded-lg bg-background">
                               <option>09</option>
                               <option>10</option>
                               <option>11</option>
                             </select>
                             <span>:</span>
                             <select className="flex-1 p-3 border rounded-lg bg-background">
                               <option>00</option>
                               <option>15</option>
                               <option>30</option>
                               <option>45</option>
                             </select>
                             <select className="flex-1 p-3 border rounded-lg bg-background">
                               <option>AM</option>
                               <option>PM</option>
                             </select>
                           </div>
                         </div>
                         
                         <div>
                           <label className="text-sm font-medium mb-2 block">Tags Input</label>
                           <div className="flex flex-wrap gap-2 p-3 border rounded-lg min-h-[50px]">
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
                               className="flex-1 min-w-[120px] outline-none bg-transparent" 
                               placeholder="Add tag..."
                             />
                           </div>
                         </div>
                       </div>
                       
                       <div className="space-y-4">
                         <div>
                           <label className="text-sm font-medium mb-2 block">Slider Range</label>
                           <div className="px-3">
                             <div className="relative">
                               <input 
                                 type="range" 
                                 min="0" 
                                 max="100" 
                                 value="75" 
                                 className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider" 
                               />
                               <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                 <span>0</span>
                                 <span>50</span>
                                 <span>100</span>
                               </div>
                             </div>
                             <p className="text-sm text-center mt-2">Value: <span className="font-medium">75</span></p>
                           </div>
                         </div>
                         
                         <div>
                           <label className="text-sm font-medium mb-2 block">Auto-complete</label>
                           <div className="relative">
                             <input 
                               type="text" 
                               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary" 
                               placeholder="Type to search..."
                               value="react"
                             />
                             <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-10">
                               <div className="p-2 space-y-1">
                                 <div className="px-3 py-2 bg-primary/10 text-primary rounded cursor-pointer">React</div>
                                 <div className="px-3 py-2 hover:bg-accent rounded cursor-pointer">React Native</div>
                                 <div className="px-3 py-2 hover:bg-accent rounded cursor-pointer">React Router</div>
                               </div>
                             </div>
                           </div>
                         </div>
                         
                         <div>
                           <label className="text-sm font-medium mb-2 block">Phone Number</label>
                           <div className="flex">
                             <select className="w-20 p-3 border border-r-0 rounded-l-lg bg-background">
                               <option>🇺🇸 +1</option>
                               <option>🇬🇧 +44</option>
                               <option>🇩🇪 +49</option>
                             </select>
                             <input 
                               type="tel" 
                               className="flex-1 p-3 border rounded-r-lg focus:ring-2 focus:ring-primary/50 focus:border-primary" 
                               placeholder="(555) 123-4567"
                             />
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </ComponentShowcase>

                 <ComponentShowcase title="File Upload & Rich Media">
                   <div className="space-y-6">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <div className="space-y-4">
                         <div>
                           <label className="text-sm font-medium mb-2 block">Drag & Drop Upload</label>
                           <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                             <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                             <p className="text-sm font-medium mb-2">Drag files here or click to browse</p>
                             <p className="text-xs text-muted-foreground">PNG, JPG, PDF up to 10MB</p>
                             <Button variant="outline" size="sm" className="mt-3">
                               Choose Files
                             </Button>
                           </div>
                         </div>
                         
                         <div>
                           <label className="text-sm font-medium mb-2 block">Upload Progress</label>
                           <div className="space-y-3">
                             <div className="flex items-center gap-3 p-3 border rounded-lg">
                               <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                                 📄
                               </div>
                               <div className="flex-1">
                                 <p className="text-sm font-medium">document.pdf</p>
                                 <div className="flex items-center gap-2 mt-1">
                                   <div className="flex-1 h-1.5 bg-muted rounded-full">
                                     <div className="w-3/4 h-full bg-primary rounded-full"></div>
                                   </div>
                                   <span className="text-xs text-muted-foreground">75%</span>
                                 </div>
                               </div>
                               <Button variant="ghost" size="sm">
                                 <X className="w-4 h-4" />
                               </Button>
                             </div>
                             
                             <div className="flex items-center gap-3 p-3 border border-success/20 bg-success/5 rounded-lg">
                               <div className="w-8 h-8 bg-success/10 rounded flex items-center justify-center">
                                 🖼️
                               </div>
                               <div className="flex-1">
                                 <p className="text-sm font-medium">image.jpg</p>
                                 <p className="text-xs text-success">Upload complete</p>
                               </div>
                               <CheckCircle className="w-4 h-4 text-success" />
                             </div>
                           </div>
                         </div>
                       </div>
                       
                       <div className="space-y-4">
                         <div>
                           <label className="text-sm font-medium mb-2 block">Rich Text Editor</label>
                           <div className="border rounded-lg">
                             <div className="flex items-center gap-1 p-2 border-b bg-muted/50">
                               <Button variant="ghost" size="sm" className="h-8 w-8">
                                 <strong>B</strong>
                               </Button>
                               <Button variant="ghost" size="sm" className="h-8 w-8">
                                 <em>I</em>
                               </Button>
                               <Button variant="ghost" size="sm" className="h-8 w-8">
                                 <u>U</u>
                               </Button>
                               <Separator orientation="vertical" className="h-6 mx-1" />
                               <Button variant="ghost" size="sm" className="h-8 w-8">
                                 📝
                               </Button>
                               <Button variant="ghost" size="sm" className="h-8 w-8">
                                 🔗
                               </Button>
                               <Button variant="ghost" size="sm" className="h-8 w-8">
                                 📎
                               </Button>
                             </div>
                             <div className="p-4 min-h-[120px] text-sm">
                               <p>This is a <strong>rich text editor</strong> with formatting options. You can make text <em>italic</em>, add <u>underlines</u>, and insert links.</p>
                             </div>
                           </div>
                         </div>
                         
                         <div>
                           <label className="text-sm font-medium mb-2 block">Image Preview</label>
                           <div className="grid grid-cols-3 gap-2">
                             <div className="aspect-square border rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                               <div className="text-2xl">🖼️</div>
                             </div>
                             <div className="aspect-square border rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                               <div className="text-2xl">📷</div>
                             </div>
                             <div className="aspect-square border-2 border-dashed border-muted rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/50">
                               <Plus className="w-6 h-6 text-muted-foreground" />
                             </div>
                           </div>
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

                 <ComponentShowcase title="Advanced Mobile Navigation">
                   <div className="space-y-6">
                     <div className="border rounded-lg overflow-hidden max-w-sm mx-auto">
                       <div className="bg-card border-b p-4 flex items-center justify-between">
                         <Button variant="ghost" size="sm">
                           <Menu className="w-4 h-4" />
                         </Button>
                         <span className="font-semibold">Mobile App</span>
                         <Button variant="ghost" size="sm">
                           <User className="w-4 h-4" />
                         </Button>
                       </div>
                       
                       <div className="bg-card">
                         <div className="grid grid-cols-5 gap-1 p-2">
                           <div className="flex flex-col items-center gap-1 p-2 bg-primary/10 rounded-lg">
                             <Home className="w-4 h-4 text-primary" />
                             <span className="text-xs text-primary font-medium">Home</span>
                           </div>
                           <div className="flex flex-col items-center gap-1 p-2 hover:bg-accent rounded-lg">
                             <Search className="w-4 h-4 text-muted-foreground" />
                             <span className="text-xs text-muted-foreground">Search</span>
                           </div>
                           <div className="flex flex-col items-center gap-1 p-2 hover:bg-accent rounded-lg relative">
                             <Bell className="w-4 h-4 text-muted-foreground" />
                             <span className="text-xs text-muted-foreground">Alerts</span>
                             <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></div>
                           </div>
                           <div className="flex flex-col items-center gap-1 p-2 hover:bg-accent rounded-lg">
                             <MessageCircle className="w-4 h-4 text-muted-foreground" />
                             <span className="text-xs text-muted-foreground">Chat</span>
                           </div>
                           <div className="flex flex-col items-center gap-1 p-2 hover:bg-accent rounded-lg">
                             <Settings className="w-4 h-4 text-muted-foreground" />
                             <span className="text-xs text-muted-foreground">More</span>
                           </div>
                         </div>
                       </div>
                     </div>
                     
                     <div className="border rounded-lg overflow-hidden max-w-sm mx-auto">
                       <div className="bg-card p-4">
                         <h4 className="font-medium mb-3">Swipe Navigation</h4>
                         <div className="flex space-x-2 overflow-x-auto pb-2">
                           <div className="flex-shrink-0 w-20 h-16 bg-primary/10 rounded-lg flex flex-col items-center justify-center">
                             <Target className="w-5 h-5 text-primary" />
                             <span className="text-xs mt-1">Active</span>
                           </div>
                           <div className="flex-shrink-0 w-20 h-16 bg-muted rounded-lg flex flex-col items-center justify-center">
                             <Calendar className="w-5 h-5 text-muted-foreground" />
                             <span className="text-xs mt-1">Events</span>
                           </div>
                           <div className="flex-shrink-0 w-20 h-16 bg-muted rounded-lg flex flex-col items-center justify-center">
                             <Users className="w-5 h-5 text-muted-foreground" />
                             <span className="text-xs mt-1">Team</span>
                           </div>
                           <div className="flex-shrink-0 w-20 h-16 bg-muted rounded-lg flex flex-col items-center justify-center">
                             <Award className="w-5 h-5 text-muted-foreground" />
                             <span className="text-xs mt-1">Awards</span>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </ComponentShowcase>

                 <ComponentShowcase title="Advanced Breadcrumbs & Context Navigation">
                   <div className="space-y-6">
                     <div>
                       <h4 className="font-medium mb-4">Hierarchical Breadcrumbs</h4>
                       <nav className="flex items-center space-x-2 text-sm p-3 bg-muted/30 rounded-lg">
                         <Home className="w-4 h-4 text-muted-foreground" />
                         <ChevronRight className="w-4 h-4 text-muted-foreground" />
                         <a href="#" className="text-muted-foreground hover:text-foreground">Government</a>
                         <ChevronRight className="w-4 h-4 text-muted-foreground" />
                         <a href="#" className="text-muted-foreground hover:text-foreground">Innovation Hub</a>
                         <ChevronRight className="w-4 h-4 text-muted-foreground" />
                         <a href="#" className="text-muted-foreground hover:text-foreground">Challenges</a>
                         <ChevronRight className="w-4 h-4 text-muted-foreground" />
                         <span className="text-foreground font-medium">AI Healthcare Platform</span>
                       </nav>
                     </div>
                     
                     <div>
                       <h4 className="font-medium mb-4">Collapsible Breadcrumbs</h4>
                       <nav className="flex items-center space-x-2 text-sm p-3 bg-muted/30 rounded-lg">
                         <Home className="w-4 h-4 text-muted-foreground" />
                         <ChevronRight className="w-4 h-4 text-muted-foreground" />
                         <span className="text-muted-foreground">...</span>
                         <ChevronRight className="w-4 h-4 text-muted-foreground" />
                         <a href="#" className="text-muted-foreground hover:text-foreground">Challenges</a>
                         <ChevronRight className="w-4 h-4 text-muted-foreground" />
                         <a href="#" className="text-muted-foreground hover:text-foreground">Technology</a>
                         <ChevronRight className="w-4 h-4 text-muted-foreground" />
                         <span className="text-foreground font-medium">Current Page</span>
                       </nav>
                     </div>
                     
                     <div>
                       <h4 className="font-medium mb-4">Context Navigation</h4>
                       <div className="flex items-center justify-between p-3 border rounded-lg">
                         <div className="flex items-center gap-3">
                           <Button variant="ghost" size="sm">
                             <ChevronLeft className="w-4 h-4" />
                           </Button>
                           <div>
                             <p className="text-sm font-medium">AI Healthcare Platform</p>
                             <p className="text-xs text-muted-foreground">Challenge 3 of 12</p>
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                           <div className="flex space-x-1">
                             {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                               <div 
                                 key={i} 
                                 className={`w-2 h-2 rounded-full ${i === 3 ? 'bg-primary' : i < 3 ? 'bg-primary/50' : 'bg-muted'}`}
                               ></div>
                             ))}
                           </div>
                           <Button variant="ghost" size="sm">
                             <ChevronRight className="w-4 h-4" />
                           </Button>
                         </div>
                       </div>
                     </div>
                   </div>
                 </ComponentShowcase>

                 <ComponentShowcase title="Navigation Patterns & Mega Menus">
                   <div className="space-y-6">
                     <div>
                       <h4 className="font-medium mb-4">Mega Menu Preview</h4>
                       <div className="border rounded-lg p-4 bg-card">
                         <div className="grid grid-cols-4 gap-6">
                           <div>
                             <h5 className="font-medium mb-3 text-primary">Challenges</h5>
                             <div className="space-y-2">
                               <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">Technology</a>
                               <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">Healthcare</a>
                               <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">Education</a>
                               <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">Environment</a>
                             </div>
                           </div>
                           <div>
                             <h5 className="font-medium mb-3 text-primary">Community</h5>
                             <div className="space-y-2">
                               <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">Forums</a>
                               <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">Events</a>
                               <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">Teams</a>
                               <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">Mentorship</a>
                             </div>
                           </div>
                           <div>
                             <h5 className="font-medium mb-3 text-primary">Resources</h5>
                             <div className="space-y-2">
                               <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">Documentation</a>
                               <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">API Reference</a>
                               <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">Tutorials</a>
                               <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">Best Practices</a>
                             </div>
                           </div>
                           <div>
                             <h5 className="font-medium mb-3 text-primary">Featured</h5>
                             <div className="p-3 bg-primary/10 rounded-lg">
                               <p className="text-sm font-medium mb-1">New Challenge</p>
                               <p className="text-xs text-muted-foreground mb-2">AI for Climate Change</p>
                               <Button size="sm" variant="outline" className="h-6 text-xs">
                                 Learn More
                               </Button>
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>

                     <div>
                       <h4 className="font-medium mb-4">Quick Actions Navigation</h4>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                         <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer text-center">
                           <Plus className="w-8 h-8 mx-auto mb-2 text-primary" />
                           <p className="text-sm font-medium">Create Challenge</p>
                           <p className="text-xs text-muted-foreground">Start new project</p>
                         </div>
                         <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer text-center">
                           <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                           <p className="text-sm font-medium">Join Team</p>
                           <p className="text-xs text-muted-foreground">Collaborate now</p>
                         </div>
                         <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer text-center">
                           <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
                           <p className="text-sm font-medium">View Events</p>
                           <p className="text-xs text-muted-foreground">Upcoming activities</p>
                         </div>
                         <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer text-center">
                           <Award className="w-8 h-8 mx-auto mb-2 text-primary" />
                           <p className="text-sm font-medium">My Achievements</p>
                           <p className="text-xs text-muted-foreground">Track progress</p>
                         </div>
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
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
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
                          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-medium">
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
                          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-medium">
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

                 <ComponentShowcase title="Advanced Data Tables">
                   <div className="space-y-6">
                     <div>
                       <h4 className="font-medium mb-4">Sortable & Filterable Table</h4>
                       <div className="border rounded-lg overflow-hidden">
                         <div className="p-4 bg-muted/30 border-b flex items-center justify-between">
                           <div className="flex items-center gap-4">
                             <div className="relative">
                               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                               <input 
                                 type="text" 
                                 className="pl-10 pr-3 py-2 border rounded-md bg-background text-sm" 
                                 placeholder="Search challenges..."
                               />
                             </div>
                             <select className="px-3 py-2 border rounded-md bg-background text-sm">
                               <option>All Categories</option>
                               <option>Technology</option>
                               <option>Healthcare</option>
                             </select>
                           </div>
                           <div className="flex items-center gap-2">
                             <Button variant="outline" size="sm">
                               <Filter className="w-4 h-4 mr-2" />
                               Filter
                             </Button>
                             <Button variant="outline" size="sm">
                               <Download className="w-4 h-4 mr-2" />
                               Export
                             </Button>
                           </div>
                         </div>
                         
                         <div className="overflow-x-auto">
                           <table className="w-full">
                             <thead className="bg-muted/50">
                               <tr>
                                 <th className="text-left p-3 text-sm font-medium">
                                   <div className="flex items-center gap-2">
                                     Challenge
                                     <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                                   </div>
                                 </th>
                                 <th className="text-left p-3 text-sm font-medium">
                                   <div className="flex items-center gap-2">
                                     Category
                                     <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                                   </div>
                                 </th>
                                 <th className="text-left p-3 text-sm font-medium">
                                   <div className="flex items-center gap-2">
                                     Participants
                                     <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                                   </div>
                                 </th>
                                 <th className="text-left p-3 text-sm font-medium">Status</th>
                                 <th className="text-left p-3 text-sm font-medium">Actions</th>
                               </tr>
                             </thead>
                             <tbody>
                               <tr className="border-b hover:bg-accent/50">
                                 <td className="p-3">
                                   <div>
                                     <p className="font-medium">AI Healthcare Platform</p>
                                     <p className="text-sm text-muted-foreground">Innovative medical solutions</p>
                                   </div>
                                 </td>
                                 <td className="p-3">
                                   <Badge variant="outline">Healthcare</Badge>
                                 </td>
                                 <td className="p-3">
                                   <div className="flex items-center gap-2">
                                     <span className="text-sm font-medium">147</span>
                                     <div className="flex -space-x-1">
                                       <div className="w-6 h-6 bg-primary rounded-full border-2 border-background"></div>
                                       <div className="w-6 h-6 bg-secondary rounded-full border-2 border-background"></div>
                                       <div className="w-6 h-6 bg-accent rounded-full border-2 border-background"></div>
                                     </div>
                                   </div>
                                 </td>
                                 <td className="p-3">
                                   <Badge variant="default" className="bg-success text-success-foreground">Active</Badge>
                                 </td>
                                 <td className="p-3">
                                   <div className="flex items-center gap-2">
                                     <Button variant="ghost" size="sm">
                                       <Eye className="w-4 h-4" />
                                     </Button>
                                     <Button variant="ghost" size="sm">
                                       <Edit className="w-4 h-4" />
                                     </Button>
                                     <Button variant="ghost" size="sm">
                                       <MoreVertical className="w-4 h-4" />
                                     </Button>
                                   </div>
                                 </td>
                               </tr>
                               <tr className="border-b hover:bg-accent/50">
                                 <td className="p-3">
                                   <div>
                                     <p className="font-medium">Smart City Infrastructure</p>
                                     <p className="text-sm text-muted-foreground">Urban development solutions</p>
                                   </div>
                                 </td>
                                 <td className="p-3">
                                   <Badge variant="outline">Technology</Badge>
                                 </td>
                                 <td className="p-3">
                                   <div className="flex items-center gap-2">
                                     <span className="text-sm font-medium">89</span>
                                     <div className="flex -space-x-1">
                                       <div className="w-6 h-6 bg-warning rounded-full border-2 border-background"></div>
                                       <div className="w-6 h-6 bg-destructive rounded-full border-2 border-background"></div>
                                     </div>
                                   </div>
                                 </td>
                                 <td className="p-3">
                                   <Badge variant="secondary">Draft</Badge>
                                 </td>
                                 <td className="p-3">
                                   <div className="flex items-center gap-2">
                                     <Button variant="ghost" size="sm">
                                       <Eye className="w-4 h-4" />
                                     </Button>
                                     <Button variant="ghost" size="sm">
                                       <Edit className="w-4 h-4" />
                                     </Button>
                                     <Button variant="ghost" size="sm">
                                       <MoreVertical className="w-4 h-4" />
                                     </Button>
                                   </div>
                                 </td>
                               </tr>
                             </tbody>
                           </table>
                         </div>
                         
                         <div className="p-4 border-t bg-muted/30 flex items-center justify-between">
                           <p className="text-sm text-muted-foreground">Showing 1-10 of 47 results</p>
                           <div className="flex items-center gap-2">
                             <Button variant="outline" size="sm" disabled>
                               <ChevronLeft className="w-4 h-4" />
                             </Button>
                             <Button variant="outline" size="sm">1</Button>
                             <Button variant="ghost" size="sm">2</Button>
                             <Button variant="ghost" size="sm">3</Button>
                             <span className="text-muted-foreground">...</span>
                             <Button variant="ghost" size="sm">5</Button>
                             <Button variant="outline" size="sm">
                               <ChevronRight className="w-4 h-4" />
                             </Button>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </ComponentShowcase>

                 <ComponentShowcase title="Data Visualization Components">
                   <div className="space-y-6">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <div className="space-y-4">
                         <h4 className="font-medium">Real-time Analytics Dashboard</h4>
                         <div className="grid grid-cols-2 gap-4">
                           <Card className="p-4">
                             <div className="flex items-center justify-between mb-2">
                               <h5 className="text-sm font-medium text-muted-foreground">Total Users</h5>
                               <Users className="w-4 h-4 text-primary" />
                             </div>
                             <p className="text-2xl font-bold">24,567</p>
                             <div className="flex items-center gap-1 mt-2">
                               <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">+12.5%</span>
                               <span className="text-xs text-muted-foreground">vs last month</span>
                             </div>
                           </Card>
                           
                           <Card className="p-4">
                             <div className="flex items-center justify-between mb-2">
                               <h5 className="text-sm font-medium text-muted-foreground">Active Challenges</h5>
                               <Target className="w-4 h-4 text-warning" />
                             </div>
                             <p className="text-2xl font-bold">1,234</p>
                             <div className="flex items-center gap-1 mt-2">
                               <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded-full">+5.2%</span>
                               <span className="text-xs text-muted-foreground">vs last week</span>
                             </div>
                           </Card>
                           
                           <Card className="p-4">
                             <div className="flex items-center justify-between mb-2">
                               <h5 className="text-sm font-medium text-muted-foreground">Completed Projects</h5>
                               <CheckCircle className="w-4 h-4 text-success" />
                             </div>
                             <p className="text-2xl font-bold">856</p>
                             <div className="flex items-center gap-1 mt-2">
                               <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">+18.1%</span>
                               <span className="text-xs text-muted-foreground">vs last month</span>
                             </div>
                           </Card>
                           
                           <Card className="p-4">
                             <div className="flex items-center justify-between mb-2">
                               <h5 className="text-sm font-medium text-muted-foreground">Revenue</h5>
                               <CreditCard className="w-4 h-4 text-primary" />
                             </div>
                             <p className="text-2xl font-bold">$45.2K</p>
                             <div className="flex items-center gap-1 mt-2">
                               <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">-2.4%</span>
                               <span className="text-xs text-muted-foreground">vs last month</span>
                             </div>
                           </Card>
                         </div>
                       </div>
                       
                       <div className="space-y-4">
                         <h4 className="font-medium">Interactive Charts</h4>
                         <Card className="p-4">
                           <h5 className="text-sm font-medium mb-4">Challenge Participation Trends</h5>
                           <div className="h-32 flex items-end gap-2">
                             <div className="flex-1 bg-primary/20 rounded-t" style={{height: '60%'}}></div>
                             <div className="flex-1 bg-primary/40 rounded-t" style={{height: '80%'}}></div>
                             <div className="flex-1 bg-primary/60 rounded-t" style={{height: '45%'}}></div>
                             <div className="flex-1 bg-primary/80 rounded-t" style={{height: '90%'}}></div>
                             <div className="flex-1 bg-primary rounded-t" style={{height: '75%'}}></div>
                             <div className="flex-1 bg-primary/70 rounded-t" style={{height: '65%'}}></div>
                             <div className="flex-1 bg-primary/50 rounded-t" style={{height: '85%'}}></div>
                           </div>
                           <div className="flex justify-between text-xs text-muted-foreground mt-2">
                             <span>Mon</span>
                             <span>Tue</span>
                             <span>Wed</span>
                             <span>Thu</span>
                             <span>Fri</span>
                             <span>Sat</span>
                             <span>Sun</span>
                           </div>
                         </Card>
                         
                         <Card className="p-4">
                           <h5 className="text-sm font-medium mb-4">Category Distribution</h5>
                           <div className="flex items-center justify-center">
                             <div className="relative w-32 h-32">
                               <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
                                 <circle cx="64" cy="64" r="48" fill="none" stroke="currentColor" strokeWidth="16" className="text-muted" />
                                 <circle cx="64" cy="64" r="48" fill="none" stroke="currentColor" strokeWidth="16" className="text-primary" strokeDasharray="301.593" strokeDashoffset="90.478" strokeLinecap="round" />
                                 <circle cx="64" cy="64" r="48" fill="none" stroke="currentColor" strokeWidth="16" className="text-secondary" strokeDasharray="301.593" strokeDashoffset="150.796" strokeLinecap="round" />
                                 <circle cx="64" cy="64" r="48" fill="none" stroke="currentColor" strokeWidth="16" className="text-accent" strokeDasharray="301.593" strokeDashoffset="211.114" strokeLinecap="round" />
                               </svg>
                               <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="text-center">
                                   <p className="text-lg font-bold">100%</p>
                                   <p className="text-xs text-muted-foreground">Total</p>
                                 </div>
                               </div>
                             </div>
                           </div>
                           <div className="grid grid-cols-2 gap-2 mt-4">
                             <div className="flex items-center gap-2">
                               <div className="w-3 h-3 bg-primary rounded-full"></div>
                               <span className="text-xs">Tech (40%)</span>
                             </div>
                             <div className="flex items-center gap-2">
                               <div className="w-3 h-3 bg-secondary rounded-full"></div>
                               <span className="text-xs">Health (30%)</span>
                             </div>
                             <div className="flex items-center gap-2">
                               <div className="w-3 h-3 bg-accent rounded-full"></div>
                               <span className="text-xs">Edu (20%)</span>
                             </div>
                             <div className="flex items-center gap-2">
                               <div className="w-3 h-3 bg-muted rounded-full"></div>
                               <span className="text-xs">Other (10%)</span>
                             </div>
                           </div>
                         </Card>
                       </div>
                     </div>
                   </div>
                 </ComponentShowcase>

                 <ComponentShowcase title="Data Export & Reporting">
                   <div className="space-y-6">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <Card className="p-6">
                         <h4 className="font-medium mb-4">Export Options</h4>
                         <div className="space-y-3">
                           <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer">
                             <div className="flex items-center gap-3">
                               <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                                 📊
                               </div>
                               <div>
                                 <p className="text-sm font-medium">Excel Report</p>
                                 <p className="text-xs text-muted-foreground">Detailed spreadsheet with all data</p>
                               </div>
                             </div>
                             <Download className="w-4 h-4 text-muted-foreground" />
                           </div>
                           
                           <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer">
                             <div className="flex items-center gap-3">
                               <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
                                 📄
                               </div>
                               <div>
                                 <p className="text-sm font-medium">PDF Summary</p>
                                 <p className="text-xs text-muted-foreground">Executive summary report</p>
                               </div>
                             </div>
                             <Download className="w-4 h-4 text-muted-foreground" />
                           </div>
                           
                           <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer">
                             <div className="flex items-center gap-3">
                               <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                                 💾
                               </div>
                               <div>
                                 <p className="text-sm font-medium">CSV Data</p>
                                 <p className="text-xs text-muted-foreground">Raw data for analysis</p>
                               </div>
                             </div>
                             <Download className="w-4 h-4 text-muted-foreground" />
                           </div>
                         </div>
                       </Card>
                       
                       <Card className="p-6">
                         <h4 className="font-medium mb-4">Scheduled Reports</h4>
                         <div className="space-y-3">
                           <div className="flex items-center justify-between p-3 border rounded-lg">
                             <div>
                               <p className="text-sm font-medium">Weekly Analytics</p>
                               <p className="text-xs text-muted-foreground">Every Monday at 9:00 AM</p>
                             </div>
                             <Badge variant="outline" className="text-success border-success">Active</Badge>
                           </div>
                           
                           <div className="flex items-center justify-between p-3 border rounded-lg">
                             <div>
                               <p className="text-sm font-medium">Monthly Summary</p>
                               <p className="text-xs text-muted-foreground">First day of each month</p>
                             </div>
                             <Badge variant="outline" className="text-success border-success">Active</Badge>
                           </div>
                           
                           <div className="flex items-center justify-between p-3 border rounded-lg opacity-50">
                             <div>
                               <p className="text-sm font-medium">Quarterly Review</p>
                               <p className="text-xs text-muted-foreground">End of each quarter</p>
                             </div>
                             <Badge variant="outline">Paused</Badge>
                           </div>
                         </div>
                         
                         <Button className="w-full mt-4" variant="outline">
                           <Plus className="w-4 h-4 mr-2" />
                           Create New Schedule
                         </Button>
                       </Card>
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

                 <ComponentShowcase title="Video Streaming Controls">
                   <div className="space-y-6">
                     <div className="border rounded-lg overflow-hidden bg-black">
                       <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                         <div className="text-center text-white">
                           <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                             <Play className="w-8 h-8 text-white ml-1" />
                           </div>
                           <p className="text-lg font-medium">Government Innovation Summit 2024</p>
                           <p className="text-sm opacity-80">Live Stream - 1,247 viewers</p>
                         </div>
                         
                         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                           <div className="flex items-center gap-4">
                             <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                               <Play className="w-4 h-4" />
                             </Button>
                             <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                               <Volume2 className="w-4 h-4" />
                             </Button>
                             <div className="flex-1 flex items-center gap-2">
                               <span className="text-xs text-white">12:34</span>
                               <div className="flex-1 h-1 bg-white/30 rounded-full">
                                 <div className="w-1/3 h-full bg-white rounded-full"></div>
                               </div>
                               <span className="text-xs text-white">45:20</span>
                             </div>
                             <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                               <Settings className="w-4 h-4" />
                             </Button>
                             <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                               <Maximize2 className="w-4 h-4" />
                             </Button>
                           </div>
                         </div>
                         
                         <div className="absolute top-4 right-4">
                           <Badge variant="destructive" className="bg-red-600 text-white">
                             ● LIVE
                           </Badge>
                         </div>
                       </div>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <Card className="p-4">
                         <h4 className="font-medium mb-3">Video Quality Settings</h4>
                         <div className="space-y-2">
                           <div className="flex items-center justify-between p-2 border rounded hover:bg-accent cursor-pointer">
                             <span className="text-sm">Auto (720p)</span>
                             <div className="w-2 h-2 bg-primary rounded-full"></div>
                           </div>
                           <div className="flex items-center justify-between p-2 hover:bg-accent cursor-pointer">
                             <span className="text-sm">1080p HD</span>
                           </div>
                           <div className="flex items-center justify-between p-2 hover:bg-accent cursor-pointer">
                             <span className="text-sm">720p</span>
                           </div>
                           <div className="flex items-center justify-between p-2 hover:bg-accent cursor-pointer">
                             <span className="text-sm">480p</span>
                           </div>
                         </div>
                       </Card>
                       
                       <Card className="p-4">
                         <h4 className="font-medium mb-3">Playback Speed</h4>
                         <div className="space-y-2">
                           <div className="flex items-center justify-between p-2 hover:bg-accent cursor-pointer">
                             <span className="text-sm">0.5x</span>
                           </div>
                           <div className="flex items-center justify-between p-2 hover:bg-accent cursor-pointer">
                             <span className="text-sm">0.75x</span>
                           </div>
                           <div className="flex items-center justify-between p-2 border rounded hover:bg-accent cursor-pointer">
                             <span className="text-sm">1x Normal</span>
                             <div className="w-2 h-2 bg-primary rounded-full"></div>
                           </div>
                           <div className="flex items-center justify-between p-2 hover:bg-accent cursor-pointer">
                             <span className="text-sm">1.25x</span>
                           </div>
                           <div className="flex items-center justify-between p-2 hover:bg-accent cursor-pointer">
                             <span className="text-sm">1.5x</span>
                           </div>
                           <div className="flex items-center justify-between p-2 hover:bg-accent cursor-pointer">
                             <span className="text-sm">2x</span>
                           </div>
                         </div>
                       </Card>
                     </div>
                   </div>
                 </ComponentShowcase>

                 <ComponentShowcase title="Audio & Podcast Controls">
                   <div className="space-y-6">
                     <Card className="p-6">
                       <div className="flex items-center gap-4">
                         <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                           <span className="text-white font-bold text-lg">IP</span>
                         </div>
                         <div className="flex-1">
                           <h4 className="font-medium">Innovation Podcast</h4>
                           <p className="text-sm text-muted-foreground">Episode 42: Future of AI in Government</p>
                           <p className="text-xs text-muted-foreground">Dr. Sarah Chen • 45 min</p>
                         </div>
                         <Button variant="ghost" size="sm">
                           <Share className="w-4 h-4" />
                         </Button>
                       </div>
                       
                       <div className="mt-6 space-y-4">
                         <div className="flex items-center gap-2">
                           <span className="text-sm text-muted-foreground">12:34</span>
                           <div className="flex-1 h-2 bg-muted rounded-full cursor-pointer">
                             <div className="w-1/3 h-full bg-primary rounded-full relative">
                               <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full border-2 border-background"></div>
                             </div>
                           </div>
                           <span className="text-sm text-muted-foreground">45:20</span>
                         </div>
                         
                         <div className="flex items-center justify-center gap-4">
                           <Button variant="ghost" size="sm">
                             <ChevronLeft className="w-4 h-4" />
                             <span className="text-xs ml-1">15</span>
                           </Button>
                           <Button variant="ghost" size="sm">
                             <Pause className="w-5 h-5" />
                           </Button>
                           <Button variant="ghost" size="sm">
                             <span className="text-xs mr-1">30</span>
                             <ChevronRight className="w-4 h-4" />
                           </Button>
                         </div>
                         
                         <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                             <Button variant="ghost" size="sm">
                               <Volume2 className="w-4 h-4" />
                             </Button>
                             <div className="w-20 h-1 bg-muted rounded-full">
                               <div className="w-3/4 h-full bg-primary rounded-full"></div>
                             </div>
                           </div>
                           <div className="flex items-center gap-2">
                             <Button variant="ghost" size="sm">1x</Button>
                             <Button variant="ghost" size="sm">
                               <Heart className="w-4 h-4" />
                             </Button>
                             <Button variant="ghost" size="sm">
                               <Download className="w-4 h-4" />
                             </Button>
                           </div>
                         </div>
                       </div>
                     </Card>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <Card className="p-4">
                         <h4 className="font-medium mb-3">Chapters</h4>
                         <div className="space-y-2">
                           <div className="flex items-center gap-3 p-2 bg-primary/10 rounded cursor-pointer">
                             <div className="w-2 h-2 bg-primary rounded-full"></div>
                             <div className="flex-1">
                               <p className="text-sm font-medium">Introduction</p>
                               <p className="text-xs text-muted-foreground">0:00 - 2:15</p>
                             </div>
                           </div>
                           <div className="flex items-center gap-3 p-2 hover:bg-accent rounded cursor-pointer">
                             <div className="w-2 h-2 bg-muted rounded-full"></div>
                             <div className="flex-1">
                               <p className="text-sm">AI in Healthcare</p>
                               <p className="text-xs text-muted-foreground">2:15 - 18:45</p>
                             </div>
                           </div>
                           <div className="flex items-center gap-3 p-2 hover:bg-accent rounded cursor-pointer">
                             <div className="w-2 h-2 bg-muted rounded-full"></div>
                             <div className="flex-1">
                               <p className="text-sm">Government Applications</p>
                               <p className="text-xs text-muted-foreground">18:45 - 32:10</p>
                             </div>
                           </div>
                         </div>
                       </Card>
                       
                       <Card className="p-4">
                         <h4 className="font-medium mb-3">Related Episodes</h4>
                         <div className="space-y-3">
                           <div className="flex items-center gap-3 cursor-pointer hover:bg-accent p-2 rounded">
                             <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center">
                               <span className="text-white text-xs font-bold">41</span>
                             </div>
                             <div className="flex-1">
                               <p className="text-sm font-medium">Digital Transformation</p>
                               <p className="text-xs text-muted-foreground">38 min</p>
                             </div>
                           </div>
                           <div className="flex items-center gap-3 cursor-pointer hover:bg-accent p-2 rounded">
                             <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
                               <span className="text-white text-xs font-bold">40</span>
                             </div>
                             <div className="flex-1">
                               <p className="text-sm font-medium">Cybersecurity Trends</p>
                               <p className="text-xs text-muted-foreground">42 min</p>
                             </div>
                           </div>
                         </div>
                       </Card>
                     </div>
                   </div>
                 </ComponentShowcase>

                 <ComponentShowcase title="Media Upload & Processing">
                   <div className="space-y-6">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <Card className="p-6">
                         <h4 className="font-medium mb-4">Bulk Media Upload</h4>
                         <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                           <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                           <p className="text-sm font-medium mb-2">Drag multiple files here</p>
                           <p className="text-xs text-muted-foreground mb-4">
                             Images, Videos, Audio files up to 100MB each
                           </p>
                           <Button variant="outline">
                             Choose Files
                           </Button>
                         </div>
                         
                         <div className="mt-4 space-y-3">
                           <div className="flex items-center gap-3 p-3 border rounded-lg">
                             <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                               🎥
                             </div>
                             <div className="flex-1">
                               <p className="text-sm font-medium">summit-highlights.mp4</p>
                               <div className="flex items-center gap-2 mt-1">
                                 <div className="flex-1 h-1.5 bg-muted rounded-full">
                                   <div className="w-2/3 h-full bg-primary rounded-full"></div>
                                 </div>
                                 <span className="text-xs text-muted-foreground">Processing... 67%</span>
                               </div>
                             </div>
                           </div>
                           
                           <div className="flex items-center gap-3 p-3 border border-success/20 bg-success/5 rounded-lg">
                             <div className="w-10 h-10 bg-success/10 rounded flex items-center justify-center">
                               🖼️
                             </div>
                             <div className="flex-1">
                               <p className="text-sm font-medium">team-photo.jpg</p>
                               <p className="text-xs text-success">Upload complete</p>
                             </div>
                             <CheckCircle className="w-4 h-4 text-success" />
                           </div>
                         </div>
                       </Card>
                       
                       <Card className="p-6">
                         <h4 className="font-medium mb-4">Media Processing Queue</h4>
                         <div className="space-y-3">
                           <div className="flex items-center justify-between p-3 border rounded-lg">
                             <div className="flex items-center gap-3">
                               <Loader2 className="w-4 h-4 animate-spin text-primary" />
                               <div>
                                 <p className="text-sm font-medium">Generating thumbnails</p>
                                 <p className="text-xs text-muted-foreground">3 files remaining</p>
                               </div>
                             </div>
                             <Badge variant="outline">Processing</Badge>
                           </div>
                           
                           <div className="flex items-center justify-between p-3 border rounded-lg">
                             <div className="flex items-center gap-3">
                               <Clock className="w-4 h-4 text-warning" />
                               <div>
                                 <p className="text-sm font-medium">Video compression</p>
                                 <p className="text-xs text-muted-foreground">Queued for processing</p>
                               </div>
                             </div>
                             <Badge variant="outline">Queued</Badge>
                           </div>
                           
                           <div className="flex items-center justify-between p-3 border border-success/20 bg-success/5 rounded-lg">
                             <div className="flex items-center gap-3">
                               <CheckCircle className="w-4 h-4 text-success" />
                               <div>
                                 <p className="text-sm font-medium">Audio optimization</p>
                                 <p className="text-xs text-success">Completed successfully</p>
                               </div>
                             </div>
                             <Badge variant="outline" className="text-success border-success">Complete</Badge>
                           </div>
                         </div>
                         
                         <Button className="w-full mt-4" variant="outline">
                           View Processing History
                         </Button>
                       </Card>
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

                 <ComponentShowcase title="Video Call Interface">
                   <div className="space-y-6">
                     <Card className="p-4 bg-black text-white">
                       <div className="grid grid-cols-2 gap-4 mb-4">
                         <div className="aspect-video bg-gradient-to-br from-primary/30 to-secondary/30 rounded-lg flex items-center justify-center relative">
                           <div className="text-center">
                             <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                               <User className="w-8 h-8" />
                             </div>
                             <p className="text-sm font-medium">Dr. Sarah Chen</p>
                             <p className="text-xs opacity-80">Host</p>
                           </div>
                           <div className="absolute top-2 left-2">
                             <Badge variant="destructive" className="bg-red-600 text-white text-xs">
                               ● LIVE
                             </Badge>
                           </div>
                           <div className="absolute bottom-2 left-2">
                             <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-6 w-6 p-0">
                               <Volume2 className="w-3 h-3" />
                             </Button>
                           </div>
                         </div>
                         
                         <div className="aspect-video bg-gradient-to-br from-accent/30 to-primary/30 rounded-lg flex items-center justify-center relative">
                           <div className="text-center">
                             <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                               <User className="w-8 h-8" />
                             </div>
                             <p className="text-sm font-medium">You</p>
                           </div>
                           <div className="absolute bottom-2 left-2">
                             <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-6 w-6 p-0">
                               <VolumeX className="w-3 h-3" />
                             </Button>
                           </div>
                         </div>
                       </div>
                       
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <span className="text-sm">Government Innovation Meeting</span>
                           <Badge variant="outline" className="text-white border-white/30">
                             12 participants
                           </Badge>
                         </div>
                         <div className="flex items-center gap-1">
                           <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                             <VolumeX className="w-4 h-4" />
                           </Button>
                           <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                             <Eye className="w-4 h-4" />
                           </Button>
                           <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                             <MessageCircle className="w-4 h-4" />
                           </Button>
                           <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                             <Share className="w-4 h-4" />
                           </Button>
                           <Button variant="destructive" size="sm">
                             <Phone className="w-4 h-4 mr-2" />
                             Leave
                           </Button>
                         </div>
                       </div>
                     </Card>
                     
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <Card className="p-4">
                         <h4 className="font-medium mb-3">Participants (12)</h4>
                         <div className="space-y-2 max-h-48 overflow-y-auto">
                           <div className="flex items-center gap-3 p-2 hover:bg-accent rounded">
                             <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                               <span className="text-white text-sm font-bold">SC</span>
                             </div>
                             <div className="flex-1">
                               <p className="text-sm font-medium">Dr. Sarah Chen</p>
                               <p className="text-xs text-muted-foreground">Host</p>
                             </div>
                             <div className="w-2 h-2 bg-success rounded-full"></div>
                           </div>
                           <div className="flex items-center gap-3 p-2 hover:bg-accent rounded">
                             <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                               <span className="text-white text-sm font-bold">JD</span>
                             </div>
                             <div className="flex-1">
                               <p className="text-sm font-medium">John Doe</p>
                               <p className="text-xs text-muted-foreground">Participant</p>
                             </div>
                             <VolumeX className="w-3 h-3 text-muted-foreground" />
                           </div>
                           <div className="flex items-center gap-3 p-2 hover:bg-accent rounded">
                             <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                               <span className="text-white text-sm font-bold">AM</span>
                             </div>
                             <div className="flex-1">
                               <p className="text-sm font-medium">Alice Miller</p>
                               <p className="text-xs text-muted-foreground">Participant</p>
                             </div>
                             <div className="w-2 h-2 bg-success rounded-full"></div>
                           </div>
                         </div>
                       </Card>
                       
                       <Card className="p-4">
                         <h4 className="font-medium mb-3">Chat</h4>
                         <div className="space-y-3 max-h-48 overflow-y-auto mb-3">
                           <div className="text-sm">
                             <span className="font-medium text-primary">Dr. Sarah Chen:</span>
                             <span className="ml-2">Welcome everyone to today's innovation meeting!</span>
                           </div>
                           <div className="text-sm">
                             <span className="font-medium text-secondary">John Doe:</span>
                             <span className="ml-2">Thank you for hosting. Looking forward to the discussion.</span>
                           </div>
                           <div className="text-sm">
                             <span className="font-medium text-accent">Alice Miller:</span>
                             <span className="ml-2">Could you share the presentation link?</span>
                           </div>
                         </div>
                         <div className="flex gap-2">
                           <input 
                             type="text" 
                             className="flex-1 px-3 py-2 border rounded-lg text-sm" 
                             placeholder="Type a message..."
                           />
                           <Button size="sm">
                             <Send className="w-4 h-4" />
                           </Button>
                         </div>
                       </Card>
                       
                       <Card className="p-4">
                         <h4 className="font-medium mb-3">Meeting Controls</h4>
                         <div className="space-y-3">
                           <div className="flex items-center justify-between">
                             <span className="text-sm">Camera</span>
                             <div className="flex items-center gap-2">
                               <div className="w-8 h-4 bg-success rounded-full relative cursor-pointer">
                                 <div className="absolute right-0 top-0 w-4 h-4 bg-white rounded-full border-2 border-success"></div>
                               </div>
                             </div>
                           </div>
                           <div className="flex items-center justify-between">
                             <span className="text-sm">Microphone</span>
                             <div className="flex items-center gap-2">
                               <div className="w-8 h-4 bg-muted rounded-full relative cursor-pointer">
                                 <div className="absolute left-0 top-0 w-4 h-4 bg-white rounded-full border-2 border-muted"></div>
                               </div>
                             </div>
                           </div>
                           <div className="flex items-center justify-between">
                             <span className="text-sm">Screen Share</span>
                             <Button variant="outline" size="sm">
                               Start
                             </Button>
                           </div>
                           <div className="flex items-center justify-between">
                             <span className="text-sm">Recording</span>
                             <Button variant="outline" size="sm" className="text-destructive border-destructive">
                               <div className="w-2 h-2 bg-destructive rounded-full mr-2"></div>
                               Record
                             </Button>
                           </div>
                         </div>
                       </Card>
                     </div>
                   </div>
                 </ComponentShowcase>

                 <ComponentShowcase title="Advanced Chat Interface">
                   <div className="space-y-6">
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                       <Card className="lg:col-span-2 p-0 overflow-hidden">
                         <div className="border-b p-4 bg-muted/30">
                           <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                 <Users className="w-5 h-5 text-white" />
                               </div>
                               <div>
                                 <h4 className="font-medium">Innovation Team</h4>
                                 <p className="text-sm text-muted-foreground">8 members • 3 online</p>
                               </div>
                             </div>
                             <div className="flex items-center gap-2">
                               <Button variant="ghost" size="sm">
                                 <Phone className="w-4 h-4" />
                               </Button>
                               <Button variant="ghost" size="sm">
                                 <Settings className="w-4 h-4" />
                               </Button>
                             </div>
                           </div>
                         </div>
                         
                         <div className="h-96 overflow-y-auto p-4 space-y-4">
                           <div className="flex items-start gap-3">
                             <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                               <span className="text-white text-sm font-bold">SC</span>
                             </div>
                             <div className="flex-1">
                               <div className="flex items-center gap-2 mb-1">
                                 <span className="text-sm font-medium">Dr. Sarah Chen</span>
                                 <span className="text-xs text-muted-foreground">10:30 AM</span>
                               </div>
                               <div className="bg-muted p-3 rounded-lg rounded-tl-none">
                                 <p className="text-sm">Good morning team! I've uploaded the new AI governance framework document. Please review it before our meeting tomorrow.</p>
                               </div>
                               <div className="mt-2 p-3 border rounded-lg bg-background">
                                 <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                                     📄
                                   </div>
                                   <div className="flex-1">
                                     <p className="text-sm font-medium">AI-Governance-Framework-v2.pdf</p>
                                     <p className="text-xs text-muted-foreground">2.4 MB • PDF</p>
                                   </div>
                                   <Button variant="ghost" size="sm">
                                     <Download className="w-4 h-4" />
                                   </Button>
                                 </div>
                               </div>
                             </div>
                           </div>
                           
                           <div className="flex items-start gap-3 justify-end">
                             <div className="flex-1 max-w-md">
                               <div className="flex items-center gap-2 mb-1 justify-end">
                                 <span className="text-xs text-muted-foreground">10:32 AM</span>
                                 <span className="text-sm font-medium">You</span>
                               </div>
                               <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-tr-none">
                                 <p className="text-sm">Thanks Sarah! I'll review it this afternoon. Should we also discuss the implementation timeline?</p>
                               </div>
                             </div>
                             <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                               <span className="text-white text-sm font-bold">JD</span>
                             </div>
                           </div>
                           
                           <div className="flex items-start gap-3">
                             <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                               <span className="text-white text-sm font-bold">AM</span>
                             </div>
                             <div className="flex-1">
                               <div className="flex items-center gap-2 mb-1">
                                 <span className="text-sm font-medium">Alice Miller</span>
                                 <span className="text-xs text-muted-foreground">10:35 AM</span>
                                 <Badge variant="outline" className="text-xs">AI Assistant</Badge>
                               </div>
                               <div className="bg-muted p-3 rounded-lg rounded-tl-none">
                                 <p className="text-sm">I've created a summary of the key action items from our last meeting. Here they are:</p>
                                 <ul className="mt-2 space-y-1 text-sm">
                                   <li className="flex items-center gap-2">
                                     <CheckCircle className="w-4 h-4 text-success" />
                                     <span className="line-through text-muted-foreground">Review security protocols</span>
                                   </li>
                                   <li className="flex items-center gap-2">
                                     <Clock className="w-4 h-4 text-warning" />
                                     <span>Draft implementation plan</span>
                                   </li>
                                   <li className="flex items-center gap-2">
                                     <Clock className="w-4 h-4 text-warning" />
                                     <span>Schedule stakeholder meetings</span>
                                   </li>
                                 </ul>
                               </div>
                             </div>
                           </div>
                           
                           <div className="flex items-center justify-center">
                             <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">Today</span>
                           </div>
                         </div>
                         
                         <div className="border-t p-4">
                           <div className="flex items-center gap-2">
                             <Button variant="ghost" size="sm">
                               <Plus className="w-4 h-4" />
                             </Button>
                             <input 
                               type="text" 
                               className="flex-1 px-3 py-2 border rounded-lg" 
                               placeholder="Type a message..."
                             />
                             <Button variant="ghost" size="sm">
                               <Sparkles className="w-4 h-4" />
                             </Button>
                             <Button size="sm">
                               <Send className="w-4 h-4" />
                             </Button>
                           </div>
                         </div>
                       </Card>
                       
                       <Card className="p-4">
                         <h4 className="font-medium mb-4">Team Members</h4>
                         <div className="space-y-3">
                           <div className="flex items-center gap-3">
                             <div className="relative">
                               <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                 <span className="text-white text-sm font-bold">SC</span>
                               </div>
                               <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background"></div>
                             </div>
                             <div className="flex-1">
                               <p className="text-sm font-medium">Dr. Sarah Chen</p>
                               <p className="text-xs text-muted-foreground">Team Lead • Online</p>
                             </div>
                           </div>
                           
                           <div className="flex items-center gap-3">
                             <div className="relative">
                               <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                                 <span className="text-white text-sm font-bold">JD</span>
                               </div>
                               <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background"></div>
                             </div>
                             <div className="flex-1">
                               <p className="text-sm font-medium">John Doe</p>
                               <p className="text-xs text-muted-foreground">Developer • Online</p>
                             </div>
                           </div>
                           
                           <div className="flex items-center gap-3">
                             <div className="relative">
                               <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                                 <span className="text-white text-sm font-bold">AM</span>
                               </div>
                               <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background"></div>
                             </div>
                             <div className="flex-1">
                               <p className="text-sm font-medium">Alice Miller</p>
                               <p className="text-xs text-muted-foreground">AI Assistant • Online</p>
                             </div>
                           </div>
                           
                           <div className="flex items-center gap-3 opacity-50">
                             <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                               <span className="text-muted-foreground text-sm font-bold">BW</span>
                             </div>
                             <div className="flex-1">
                               <p className="text-sm font-medium">Bob Wilson</p>
                               <p className="text-xs text-muted-foreground">Designer • Away</p>
                             </div>
                           </div>
                         </div>
                         
                         <Button className="w-full mt-4" variant="outline">
                           <Plus className="w-4 h-4 mr-2" />
                           Add Members
                         </Button>
                       </Card>
                     </div>
                   </div>
                 </ComponentShowcase>

                 <ComponentShowcase title="Real-time Collaboration & Notifications">
                   <div className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <Card className="p-6">
                         <h4 className="font-medium mb-4">Live Activity Feed</h4>
                         <div className="space-y-4 max-h-64 overflow-y-auto">
                           <div className="flex items-start gap-3">
                             <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                             <div className="flex-1">
                               <p className="text-sm">
                                 <span className="font-medium">Dr. Sarah Chen</span> started a new challenge: 
                                 <span className="text-primary"> "Smart Traffic Management"</span>
                               </p>
                               <p className="text-xs text-muted-foreground">2 minutes ago</p>
                             </div>
                           </div>
                           
                           <div className="flex items-start gap-3">
                             <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                             <div className="flex-1">
                               <p className="text-sm">
                                 <span className="font-medium">John Doe</span> completed the 
                                 <span className="text-success"> "AI Healthcare Platform"</span> challenge
                               </p>
                               <p className="text-xs text-muted-foreground">5 minutes ago</p>
                             </div>
                           </div>
                           
                           <div className="flex items-start gap-3">
                             <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                             <div className="flex-1">
                               <p className="text-sm">
                                 <span className="font-medium">Alice Miller</span> shared a document in 
                                 <span className="text-warning"> "Innovation Team"</span>
                               </p>
                               <p className="text-xs text-muted-foreground">12 minutes ago</p>
                             </div>
                           </div>
                           
                           <div className="flex items-start gap-3">
                             <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                             <div className="flex-1">
                               <p className="text-sm">
                                 <span className="font-medium">Bob Wilson</span> joined the platform
                               </p>
                               <p className="text-xs text-muted-foreground">1 hour ago</p>
                             </div>
                           </div>
                         </div>
                       </Card>
                       
                       <Card className="p-6">
                         <h4 className="font-medium mb-4">Smart Notifications</h4>
                         <div className="space-y-3">
                           <div className="flex items-center justify-between">
                             <span className="text-sm">Push Notifications</span>
                             <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                               <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full"></div>
                             </div>
                           </div>
                           
                           <div className="flex items-center justify-between">
                             <span className="text-sm">Email Digest</span>
                             <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                               <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full"></div>
                             </div>
                           </div>
                           
                           <div className="flex items-center justify-between">
                             <span className="text-sm">Desktop Alerts</span>
                             <div className="w-10 h-6 bg-muted rounded-full relative cursor-pointer">
                               <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full"></div>
                             </div>
                           </div>
                           
                           <Separator className="my-4" />
                           
                           <div className="space-y-2">
                             <h5 className="text-sm font-medium">Notification Types</h5>
                             <div className="space-y-2">
                               <label className="flex items-center gap-2 cursor-pointer">
                                 <input type="checkbox" className="rounded" defaultChecked />
                                 <span className="text-sm">New challenges</span>
                               </label>
                               <label className="flex items-center gap-2 cursor-pointer">
                                 <input type="checkbox" className="rounded" defaultChecked />
                                 <span className="text-sm">Team messages</span>
                               </label>
                               <label className="flex items-center gap-2 cursor-pointer">
                                 <input type="checkbox" className="rounded" />
                                 <span className="text-sm">System updates</span>
                               </label>
                               <label className="flex items-center gap-2 cursor-pointer">
                                 <input type="checkbox" className="rounded" defaultChecked />
                                 <span className="text-sm">Achievement unlocked</span>
                               </label>
                             </div>
                           </div>
                         </div>
                       </Card>
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

                 <ComponentShowcase title="Gesture Controls & Touch Interactions">
                   <div className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <Card className="p-6">
                         <h4 className="font-medium mb-4">Swipe Gestures</h4>
                         <div className="space-y-4">
                           <div className="p-4 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5 text-center">
                             <div className="flex items-center justify-center gap-2 mb-2">
                               <ChevronLeft className="w-4 h-4 text-primary" />
                               <span className="text-sm font-medium">Swipe Left</span>
                               <ChevronRight className="w-4 h-4 text-primary" />
                             </div>
                             <p className="text-xs text-muted-foreground">Navigate between pages</p>
                           </div>
                           
                           <div className="p-4 border-2 border-dashed border-success/30 rounded-lg bg-success/5 text-center">
                             <div className="flex items-center justify-center gap-2 mb-2">
                               <ChevronDown className="w-4 h-4 text-success" />
                               <span className="text-sm font-medium">Pull to Refresh</span>
                             </div>
                             <p className="text-xs text-muted-foreground">Refresh content</p>
                           </div>
                           
                           <div className="p-4 border-2 border-dashed border-warning/30 rounded-lg bg-warning/5 text-center">
                             <div className="flex items-center justify-center gap-2 mb-2">
                               <span className="text-sm font-medium">Pinch to Zoom</span>
                             </div>
                             <p className="text-xs text-muted-foreground">Scale content</p>
                           </div>
                         </div>
                       </Card>
                       
                       <Card className="p-6">
                         <h4 className="font-medium mb-4">Touch Feedback</h4>
                         <div className="space-y-4">
                           <Button className="w-full relative overflow-hidden">
                             <span>Tap for Ripple Effect</span>
                             <div className="absolute inset-0 bg-white/20 rounded-full scale-0 animate-ping"></div>
                           </Button>
                           
                           <div className="p-4 border rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer">
                             <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                 <User className="w-5 h-5 text-primary" />
                               </div>
                               <div>
                                 <p className="text-sm font-medium">Long Press Action</p>
                                 <p className="text-xs text-muted-foreground">Hold for context menu</p>
                               </div>
                             </div>
                           </div>
                           
                           <div className="grid grid-cols-2 gap-2">
                             <div className="aspect-square border rounded-lg hover:bg-accent transition-colors cursor-pointer flex items-center justify-center">
                               <span className="text-xs">Tap</span>
                             </div>
                             <div className="aspect-square border rounded-lg hover:bg-accent transition-colors cursor-pointer flex items-center justify-center">
                               <span className="text-xs">Double Tap</span>
                             </div>
                           </div>
                         </div>
                       </Card>
                     </div>
                   </div>
                 </ComponentShowcase>

                 <ComponentShowcase title="Micro-interactions & Animations">
                   <div className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <Card className="p-6">
                         <h4 className="font-medium mb-4">Button States</h4>
                         <div className="space-y-3">
                           <Button className="w-full transition-all duration-300 hover:scale-105">
                             Hover to Scale
                           </Button>
                           <Button variant="outline" className="w-full transition-all duration-300 hover:shadow-lg">
                             Hover for Shadow
                           </Button>
                           <Button variant="ghost" className="w-full relative overflow-hidden group">
                             <span className="relative z-10">Slide Background</span>
                             <div className="absolute inset-0 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                           </Button>
                         </div>
                       </Card>
                       
                       <Card className="p-6">
                         <h4 className="font-medium mb-4">Loading Animations</h4>
                         <div className="space-y-4">
                           <div className="flex items-center gap-2">
                             <Loader2 className="w-4 h-4 animate-spin text-primary" />
                             <span className="text-sm">Spinning loader</span>
                           </div>
                           
                           <div className="flex items-center gap-2">
                             <div className="flex space-x-1">
                               <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                               <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                               <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                             </div>
                             <span className="text-sm">Bouncing dots</span>
                           </div>
                           
                           <div className="space-y-2">
                             <span className="text-sm">Progress bar</span>
                             <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                               <div className="h-full bg-primary rounded-full animate-pulse" style={{width: '60%'}}></div>
                             </div>
                           </div>
                           
                           <div className="space-y-2">
                             <span className="text-sm">Skeleton loading</span>
                             <div className="space-y-2">
                               <div className="h-4 bg-muted animate-pulse rounded"></div>
                               <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                               <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
                             </div>
                           </div>
                         </div>
                       </Card>
                       
                       <Card className="p-6">
                         <h4 className="font-medium mb-4">Interactive Elements</h4>
                         <div className="space-y-4">
                           <div className="group cursor-pointer">
                             <div className="w-full h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                               <span className="text-white font-medium">Gradient Hover</span>
                             </div>
                           </div>
                           
                           <div className="relative overflow-hidden rounded-lg">
                             <div className="w-full h-12 bg-accent flex items-center justify-center cursor-pointer">
                               <span className="text-accent-foreground font-medium">Shine Effect</span>
                               <div className="absolute inset-0 transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                             </div>
                           </div>
                           
                           <div className="space-y-2">
                             <span className="text-sm">Toggle switch</span>
                             <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                               <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300"></div>
                             </div>
                           </div>
                           
                           <div className="space-y-2">
                             <span className="text-sm">Rating stars</span>
                             <div className="flex gap-1">
                               {[1, 2, 3, 4, 5].map((star) => (
                                 <Star 
                                   key={star} 
                                   className="w-5 h-5 cursor-pointer transition-all duration-200 hover:scale-125 text-warning fill-current" 
                                 />
                               ))}
                             </div>
                           </div>
                         </div>
                       </Card>
                     </div>
                   </div>
                 </ComponentShowcase>

                 <ComponentShowcase title="Advanced Interactions & Feedback">
                   <div className="space-y-6">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <Card className="p-6">
                         <h4 className="font-medium mb-4">Drag & Drop Interface</h4>
                         <div className="space-y-4">
                           <div className="grid grid-cols-3 gap-2">
                             <div className="aspect-square border-2 border-dashed border-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground">
                               Drop Zone
                             </div>
                             <div className="aspect-square border-2 border-dashed border-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground">
                               Drop Zone
                             </div>
                             <div className="aspect-square border-2 border-dashed border-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground">
                               Drop Zone
                             </div>
                           </div>
                           
                           <div className="flex gap-2">
                             <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center cursor-move hover:shadow-lg transition-all">
                               <GripVertical className="w-4 h-4 text-white" />
                             </div>
                             <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center cursor-move hover:shadow-lg transition-all">
                               <Move className="w-4 h-4 text-white" />
                             </div>
                             <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center cursor-move hover:shadow-lg transition-all">
                               <span className="text-white text-xs">Item</span>
                             </div>
                           </div>
                           
                           <p className="text-xs text-muted-foreground text-center">
                             Drag items to drop zones above
                           </p>
                         </div>
                       </Card>
                       
                       <Card className="p-6">
                         <h4 className="font-medium mb-4">Contextual Feedback</h4>
                         <div className="space-y-4">
                           <div className="relative group">
                             <Button variant="outline" className="w-full">
                               Hover for Tooltip
                             </Button>
                             <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                               This is a helpful tooltip
                               <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                             </div>
                           </div>
                           
                           <div className="space-y-2">
                             <input 
                               type="text" 
                               className="w-full p-3 border border-success rounded-lg focus:ring-2 focus:ring-success/50" 
                               value="Valid input"
                               readOnly
                             />
                             <div className="flex items-center gap-2 text-success">
                               <CheckCircle className="w-4 h-4" />
                               <span className="text-sm">Input is valid</span>
                             </div>
                           </div>
                           
                           <div className="space-y-2">
                             <input 
                               type="text" 
                               className="w-full p-3 border border-destructive rounded-lg focus:ring-2 focus:ring-destructive/50" 
                               value="Invalid input"
                               readOnly
                             />
                             <div className="flex items-center gap-2 text-destructive">
                               <AlertCircle className="w-4 h-4" />
                               <span className="text-sm">Please correct this field</span>
                             </div>
                           </div>
                           
                           <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                             <div className="flex items-center gap-2 mb-2">
                               <Info className="w-4 h-4 text-primary" />
                               <span className="text-sm font-medium text-primary">Pro Tip</span>
                             </div>
                             <p className="text-sm text-muted-foreground">
                               Use keyboard shortcuts to work more efficiently!
                             </p>
                           </div>
                         </div>
                       </Card>
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

                 <ComponentShowcase title="Grid Systems & Layout Overlays">
                   <div className="space-y-6">
                     <div>
                       <h4 className="font-medium mb-4">12-Column Grid System</h4>
                       <div className="grid grid-cols-12 gap-2 mb-4">
                         {Array.from({ length: 12 }, (_, i) => (
                           <div key={i} className="h-8 bg-primary/20 rounded flex items-center justify-center text-xs font-mono">
                             {i + 1}
                           </div>
                         ))}
                       </div>
                       <div className="space-y-2">
                         <div className="grid grid-cols-12 gap-2">
                           <div className="col-span-6 h-12 bg-primary/40 rounded flex items-center justify-center text-sm">
                             col-span-6
                           </div>
                           <div className="col-span-6 h-12 bg-secondary/40 rounded flex items-center justify-center text-sm">
                             col-span-6
                           </div>
                         </div>
                         <div className="grid grid-cols-12 gap-2">
                           <div className="col-span-4 h-12 bg-accent/40 rounded flex items-center justify-center text-sm">
                             col-span-4
                           </div>
                           <div className="col-span-8 h-12 bg-primary/40 rounded flex items-center justify-center text-sm">
                             col-span-8
                           </div>
                         </div>
                         <div className="grid grid-cols-12 gap-2">
                           <div className="col-span-3 h-12 bg-success/40 rounded flex items-center justify-center text-sm">
                             col-span-3
                           </div>
                           <div className="col-span-3 h-12 bg-warning/40 rounded flex items-center justify-center text-sm">
                             col-span-3
                           </div>
                           <div className="col-span-3 h-12 bg-destructive/40 rounded flex items-center justify-center text-sm">
                             col-span-3
                           </div>
                           <div className="col-span-3 h-12 bg-info/40 rounded flex items-center justify-center text-sm">
                             col-span-3
                           </div>
                         </div>
                       </div>
                     </div>
                     
                     <div>
                       <h4 className="font-medium mb-4">Visual Grid Overlay</h4>
                       <div className="relative p-6 border rounded-lg bg-muted/30">
                         <div className="absolute inset-0 pointer-events-none">
                           <div className="h-full grid grid-cols-12 gap-2 p-6">
                             {Array.from({ length: 12 }, (_, i) => (
                               <div key={i} className="h-full border-r border-primary/20 border-dashed"></div>
                             ))}
                           </div>
                         </div>
                         <div className="relative z-10">
                           <h5 className="text-lg font-medium mb-2">Content with Grid Overlay</h5>
                           <p className="text-sm text-muted-foreground mb-4">
                             This demonstrates how content aligns with the underlying grid system.
                             The dashed lines show the column boundaries.
                           </p>
                           <Button>Call to Action</Button>
                         </div>
                       </div>
                     </div>
                   </div>
                 </ComponentShowcase>

                 <ComponentShowcase title="Advanced Spacing Utilities">
                   <div className="space-y-6">
                     <div>
                       <h4 className="font-medium mb-4">Consistent Spacing Patterns</h4>
                       <div className="space-y-4">
                         <div className="p-2 border rounded-lg">
                           <span className="text-xs text-muted-foreground">p-2 (8px)</span>
                         </div>
                         <div className="p-4 border rounded-lg">
                           <span className="text-xs text-muted-foreground">p-4 (16px)</span>
                         </div>
                         <div className="p-6 border rounded-lg">
                           <span className="text-xs text-muted-foreground">p-6 (24px)</span>
                         </div>
                         <div className="p-8 border rounded-lg">
                           <span className="text-xs text-muted-foreground">p-8 (32px)</span>
                         </div>
                       </div>
                     </div>
                     
                     <div>
                       <h4 className="font-medium mb-4">Margin & Gap Relationships</h4>
                       <div className="space-y-4">
                         <div className="flex gap-2">
                           <div className="flex-1 h-12 bg-primary/20 rounded flex items-center justify-center text-xs">
                             gap-2
                           </div>
                           <div className="flex-1 h-12 bg-primary/20 rounded flex items-center justify-center text-xs">
                             gap-2
                           </div>
                           <div className="flex-1 h-12 bg-primary/20 rounded flex items-center justify-center text-xs">
                             gap-2
                           </div>
                         </div>
                         <div className="flex gap-4">
                           <div className="flex-1 h-12 bg-secondary/20 rounded flex items-center justify-center text-xs">
                             gap-4
                           </div>
                           <div className="flex-1 h-12 bg-secondary/20 rounded flex items-center justify-center text-xs">
                             gap-4
                           </div>
                         </div>
                         <div className="flex gap-6">
                           <div className="flex-1 h-12 bg-accent/20 rounded flex items-center justify-center text-xs">
                             gap-6
                           </div>
                           <div className="flex-1 h-12 bg-accent/20 rounded flex items-center justify-center text-xs">
                             gap-6
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </ComponentShowcase>

                 <ComponentShowcase title="Layout Debugging & Guides">
                   <div className="space-y-6">
                     <div>
                       <h4 className="font-medium mb-4">Container Size Indicators</h4>
                       <div className="space-y-3">
                         <div className="max-w-sm mx-auto p-4 bg-primary/10 border-2 border-primary/30 rounded-lg text-center">
                           <span className="text-sm font-medium">max-w-sm (384px)</span>
                         </div>
                         <div className="max-w-md mx-auto p-4 bg-secondary/10 border-2 border-secondary/30 rounded-lg text-center">
                           <span className="text-sm font-medium">max-w-md (448px)</span>
                         </div>
                         <div className="max-w-lg mx-auto p-4 bg-accent/10 border-2 border-accent/30 rounded-lg text-center">
                           <span className="text-sm font-medium">max-w-lg (512px)</span>
                         </div>
                         <div className="max-w-xl mx-auto p-4 bg-success/10 border-2 border-success/30 rounded-lg text-center">
                           <span className="text-sm font-medium">max-w-xl (576px)</span>
                         </div>
                       </div>
                     </div>
                     
                     <div>
                       <h4 className="font-medium mb-4">Alignment Guides</h4>
                       <div className="relative">
                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                           <div className="w-px h-full bg-primary/30 border-l border-dashed"></div>
                         </div>
                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                           <div className="w-full h-px bg-primary/30 border-t border-dashed"></div>
                         </div>
                         <div className="grid grid-cols-3 gap-4 h-32">
                           <div className="bg-muted/50 rounded flex items-center justify-center">
                             <span className="text-xs">Left</span>
                           </div>
                           <div className="bg-primary/20 rounded flex items-center justify-center">
                             <span className="text-xs font-medium">Center</span>
                           </div>
                           <div className="bg-muted/50 rounded flex items-center justify-center">
                             <span className="text-xs">Right</span>
                           </div>
                         </div>
                       </div>
                     </div>
                     
                     <div>
                       <h4 className="font-medium mb-4">Safe Area Visualization</h4>
                       <div className="relative border-2 border-dashed border-warning/50 rounded-lg p-8">
                         <div className="absolute top-2 left-2 text-xs text-warning font-medium">Safe Area</div>
                         <div className="border-2 border-dashed border-primary/50 rounded p-4">
                           <div className="absolute top-10 left-6 text-xs text-primary font-medium">Content Area</div>
                           <div className="bg-card rounded p-4 text-center">
                             <h5 className="font-medium mb-2">Important Content</h5>
                             <p className="text-sm text-muted-foreground">
                               This content stays within safe boundaries for all device sizes
                             </p>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </ComponentShowcase>

                 <ComponentShowcase title="Responsive Spacing & Breakpoint Utilities">
                   <div className="space-y-6">
                     <div>
                       <h4 className="font-medium mb-4">Responsive Padding</h4>
                       <div className="space-y-3">
                         <div className="p-2 md:p-4 lg:p-6 xl:p-8 border rounded-lg bg-muted/30">
                           <span className="text-sm font-mono">p-2 md:p-4 lg:p-6 xl:p-8</span>
                           <p className="text-xs text-muted-foreground mt-1">
                             Padding increases with screen size
                           </p>
                         </div>
                       </div>
                     </div>
                     
                     <div>
                       <h4 className="font-medium mb-4">Responsive Grid Gaps</h4>
                       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6">
                         <div className="h-16 bg-primary/20 rounded flex items-center justify-center text-xs">
                           Item 1
                         </div>
                         <div className="h-16 bg-secondary/20 rounded flex items-center justify-center text-xs">
                           Item 2
                         </div>
                         <div className="h-16 bg-accent/20 rounded flex items-center justify-center text-xs">
                           Item 3
                         </div>
                         <div className="h-16 bg-success/20 rounded flex items-center justify-center text-xs">
                           Item 4
                         </div>
                       </div>
                       <p className="text-xs text-muted-foreground mt-2">
                         <span className="font-mono">gap-2 md:gap-4 lg:gap-6</span> - Gap increases with breakpoints
                       </p>
                     </div>
                     
                     <div>
                       <h4 className="font-medium mb-4">Breakpoint Indicators</h4>
                       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                         <div className="p-3 bg-primary/20 rounded text-center text-xs">
                           <span className="block sm:hidden">Mobile</span>
                           <span className="hidden sm:block md:hidden">Small</span>
                           <span className="hidden md:block lg:hidden">Medium</span>
                           <span className="hidden lg:block xl:hidden">Large</span>
                           <span className="hidden xl:block">XLarge</span>
                         </div>
                         <div className="p-3 bg-secondary/20 rounded text-center text-xs hidden sm:block">
                           sm: 640px+
                         </div>
                         <div className="p-3 bg-accent/20 rounded text-center text-xs hidden md:block">
                           md: 768px+
                         </div>
                         <div className="p-3 bg-success/20 rounded text-center text-xs hidden lg:block">
                           lg: 1024px+
                         </div>
                         <div className="p-3 bg-warning/20 rounded text-center text-xs hidden xl:block">
                           xl: 1280px+
                         </div>
                       </div>
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
                  <div className="space-y-8">
                    
                    {/* Standard Variants */}
                    <div>
                      <h4 className="font-medium mb-4">Standard Challenge Cards</h4>
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
                    </div>

                    {/* Compact Variants */}
                    <div>
                      <h4 className="font-medium mb-4">Compact Challenge Cards</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Card className="p-3 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className="bg-success/90 text-success-foreground text-xs">Active</Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Users className="w-3 h-3" />
                              <span>23</span>
                            </div>
                          </div>
                          <h4 className="font-medium text-sm mb-1">Blockchain Security</h4>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-warning font-medium">$5,000</span>
                            <span className="text-muted-foreground">8 days</span>
                          </div>
                        </Card>

                        <Card className="p-3 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className="bg-warning/90 text-warning-foreground text-xs">Review</Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Users className="w-3 h-3" />
                              <span>67</span>
                            </div>
                          </div>
                          <h4 className="font-medium text-sm mb-1">Green Energy Tech</h4>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-warning font-medium">$15,000</span>
                            <span className="text-muted-foreground">2 days</span>
                          </div>
                        </Card>

                        <Card className="p-3 hover:shadow-md transition-shadow opacity-60">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className="bg-muted text-muted-foreground text-xs">Closed</Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Users className="w-3 h-3" />
                              <span>156</span>
                            </div>
                          </div>
                          <h4 className="font-medium text-sm mb-1">Space Innovation</h4>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">$50,000</span>
                            <span className="text-muted-foreground">Ended</span>
                          </div>
                        </Card>
                      </div>
                    </div>

                    {/* Image Card Variants */}
                    <div>
                      <h4 className="font-medium mb-4">Image Challenge Cards</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="aspect-video bg-gradient-primary relative">
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-success/90 text-success-foreground">Active</Badge>
                            </div>
                            <div className="absolute top-3 right-3">
                              <div className="flex items-center gap-1 text-white text-sm bg-black/30 backdrop-blur-sm rounded px-2 py-1">
                                <Users className="w-3 h-3" />
                                <span>89</span>
                              </div>
                            </div>
                            <div className="absolute bottom-3 left-3 text-white">
                              <div className="flex items-center gap-1 text-sm">
                                <Award className="w-4 h-4" />
                                <span className="font-semibold">$30,000</span>
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold mb-2">Ocean Cleanup Technology</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              Innovative solutions for marine plastic pollution
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>12 days left</span>
                              </div>
                              <Button size="sm">Join Challenge</Button>
                            </div>
                          </div>
                        </Card>

                        <Card className="overflow-hidden hover:shadow-lg transition-shadow border border-innovation/50">
                          <div className="aspect-video bg-gradient-primary relative">
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-innovation/90 text-innovation-foreground">Featured</Badge>
                            </div>
                            <div className="absolute top-3 right-3">
                              <Star className="w-5 h-5 text-yellow-300 fill-current" />
                            </div>
                            <div className="absolute bottom-3 left-3 text-white">
                              <div className="flex items-center gap-1 text-sm">
                                <Award className="w-4 h-4" />
                                <span className="font-semibold">$100,000</span>
                              </div>
                            </div>
                            <div className="absolute bottom-3 right-3">
                              <Badge className="bg-accent/90 text-accent-foreground animate-pulse">
                                🔥 Hot
                              </Badge>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold mb-2">AI for Climate Action</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              Machine learning solutions for climate change
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Users className="w-4 h-4" />
                                <span>234 participants</span>
                              </div>
                              <Button size="sm" className="bg-innovation text-innovation-foreground">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>

                    {/* Progress Card Variants */}
                    <div>
                      <h4 className="font-medium mb-4">Progress Challenge Cards</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-4 hover:shadow-lg transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <Badge className="bg-success/90 text-success-foreground">Active</Badge>
                            <div className="text-right">
                              <div className="text-sm font-medium">68%</div>
                              <div className="text-xs text-muted-foreground">Complete</div>
                            </div>
                          </div>
                          <h3 className="font-semibold mb-2">Smart Agriculture Platform</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            IoT solutions for modern farming techniques
                          </p>
                          <div className="space-y-3">
                            <Progress value={68} className="h-2" />
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span>45/75 participants</span>
                              </div>
                              <div className="flex items-center gap-1 text-warning">
                                <Award className="w-4 h-4" />
                                <span>$20,000</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Started 3 weeks ago</span>
                              <span>5 days remaining</span>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4 hover:shadow-lg transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <Badge className="bg-warning/90 text-warning-foreground">Ending Soon</Badge>
                            <div className="text-right">
                              <div className="text-sm font-medium">92%</div>
                              <div className="text-xs text-muted-foreground">Complete</div>
                            </div>
                          </div>
                          <h3 className="font-semibold mb-2">Quantum Computing Solutions</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Next-generation computing algorithms
                          </p>
                          <div className="space-y-3">
                            <Progress value={92} className="h-2" />
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span>156/200 participants</span>
                              </div>
                              <div className="flex items-center gap-1 text-warning">
                                <Award className="w-4 h-4" />
                                <span>$75,000</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Started 8 weeks ago</span>
                              <span className="text-destructive font-medium">2 hours left!</span>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>

                    {/* Priority/Urgent Variants */}
                    <div>
                      <h4 className="font-medium mb-4">Priority & Urgent Challenge Cards</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-4 hover:shadow-lg transition-shadow border-2 border-destructive/50 bg-destructive/5">
                          <div className="flex items-start justify-between mb-3">
                            <Badge className="bg-destructive text-destructive-foreground animate-pulse">
                              🚨 Urgent
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Users className="w-4 h-4" />
                              <span>12</span>
                            </div>
                          </div>
                          <h3 className="font-semibold mb-2 text-destructive">Emergency Response System</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Critical infrastructure for disaster management
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-sm text-destructive font-semibold">
                              <Award className="w-4 h-4" />
                              <span>$200,000</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-destructive font-medium">
                              <Clock className="w-4 h-4 animate-pulse" />
                              <span>6 hours left!</span>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4 hover:shadow-lg transition-shadow border-2 border-warning/50 bg-warning/5">
                          <div className="flex items-start justify-between mb-3">
                            <Badge className="bg-warning text-warning-foreground">
                              ⚡ High Priority
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Target className="w-4 h-4" />
                              <span>28</span>
                            </div>
                          </div>
                          <h3 className="font-semibold mb-2">Cybersecurity Defense</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Advanced threat detection and prevention
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-sm text-warning font-semibold">
                              <Award className="w-4 h-4" />
                              <span>$80,000</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-warning">
                              <Clock className="w-4 h-4" />
                              <span>3 days left</span>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>

                    {/* Category-specific Variants */}
                    <div>
                      <h4 className="font-medium mb-4">Category-specific Challenge Cards</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="p-4 hover:shadow-lg transition-shadow border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20">
                          <div className="flex items-start justify-between mb-3">
                            <Badge className="bg-blue-500/90 text-white">Technology</Badge>
                            <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded">
                              <Zap className="w-4 h-4 text-blue-600" />
                            </div>
                          </div>
                          <h3 className="font-semibold mb-2">Neural Network Optimization</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Deep learning efficiency improvements
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-blue-600 font-medium">$45,000</span>
                            <span className="text-xs text-muted-foreground">AI/ML</span>
                          </div>
                        </Card>

                        <Card className="p-4 hover:shadow-lg transition-shadow border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20">
                          <div className="flex items-start justify-between mb-3">
                            <Badge className="bg-green-500/90 text-white">Health</Badge>
                            <div className="p-1 bg-green-100 dark:bg-green-900 rounded">
                              <Heart className="w-4 h-4 text-green-600" />
                            </div>
                          </div>
                          <h3 className="font-semibold mb-2">Telemedicine Platform</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Remote healthcare accessibility
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-green-600 font-medium">$60,000</span>
                            <span className="text-xs text-muted-foreground">Healthcare</span>
                          </div>
                        </Card>

                        <Card className="p-4 hover:shadow-lg transition-shadow border-l-4 border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20">
                          <div className="flex items-start justify-between mb-3">
                            <Badge className="bg-purple-500/90 text-white">Finance</Badge>
                            <div className="p-1 bg-purple-100 dark:bg-purple-900 rounded">
                              <CreditCard className="w-4 h-4 text-purple-600" />
                            </div>
                          </div>
                          <h3 className="font-semibold mb-2">DeFi Trading Platform</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Decentralized finance solutions
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-purple-600 font-medium">$90,000</span>
                            <span className="text-xs text-muted-foreground">Blockchain</span>
                          </div>
                        </Card>
                      </div>
                    </div>

                    {/* List Layout Variant */}
                    <div>
                      <h4 className="font-medium mb-4">List Layout Challenge Cards</h4>
                      <div className="space-y-3">
                        <Card className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold">Renewable Energy Storage</h3>
                                <p className="text-sm text-muted-foreground">Advanced battery technology solutions</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-center">
                                <div className="text-sm font-medium">$35,000</div>
                                <div className="text-xs text-muted-foreground">Prize</div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm font-medium">89</div>
                                <div className="text-xs text-muted-foreground">Participants</div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm font-medium">7 days</div>
                                <div className="text-xs text-muted-foreground">Remaining</div>
                              </div>
                              <Badge className="bg-success/90 text-success-foreground">Active</Badge>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-secondary to-innovation rounded-lg flex items-center justify-center">
                                <Shield className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold">Data Privacy Framework</h3>
                                <p className="text-sm text-muted-foreground">Next-gen privacy protection systems</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-center">
                                <div className="text-sm font-medium">$55,000</div>
                                <div className="text-xs text-muted-foreground">Prize</div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm font-medium">123</div>
                                <div className="text-xs text-muted-foreground">Participants</div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm font-medium">14 days</div>
                                <div className="text-xs text-muted-foreground">Remaining</div>
                              </div>
                              <Badge className="bg-innovation/90 text-innovation-foreground">Featured</Badge>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>

                    {/* Interactive States */}
                    <div>
                      <h4 className="font-medium mb-4">Interactive States</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="p-4 transition-shadow cursor-pointer hover:shadow-lg hover:scale-[1.02]">
                          <Badge className="bg-success/90 text-success-foreground mb-3">Hover Effect</Badge>
                          <h3 className="font-semibold mb-2">Hover to See</h3>
                          <p className="text-sm text-muted-foreground">Hover over this card for effects</p>
                        </Card>

                        <Card className="p-4 transition-shadow border-2 border-primary bg-primary/5">
                          <Badge className="bg-primary/90 text-primary-foreground mb-3">Selected</Badge>
                          <h3 className="font-semibold mb-2">Selected State</h3>
                          <p className="text-sm text-muted-foreground">This card is selected</p>
                        </Card>

                        <Card className="p-4 opacity-50 cursor-not-allowed">
                          <Badge className="bg-muted text-muted-foreground mb-3">Disabled</Badge>
                          <h3 className="font-semibold mb-2 text-muted-foreground">Disabled State</h3>
                          <p className="text-sm text-muted-foreground">This card is disabled</p>
                        </Card>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Data Tables">
                  <div className="space-y-8">

                    {/* Basic Data Table */}
                    <div>
                      <h4 className="font-medium mb-4">Basic Data Table</h4>
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
                    </div>

                    {/* Compact Data Table */}
                    <div>
                      <h4 className="font-medium mb-4">Compact Data Table</h4>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/30">
                            <tr>
                              <th className="text-left p-2 font-medium">Challenge</th>
                              <th className="text-left p-2 font-medium">Status</th>
                              <th className="text-left p-2 font-medium">Users</th>
                              <th className="text-left p-2 font-medium">Prize</th>
                              <th className="text-left p-2 font-medium">Deadline</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-t hover:bg-muted/20">
                              <td className="p-2">AI Healthcare</td>
                              <td className="p-2"><Badge className="bg-success/90 text-success-foreground text-xs">Active</Badge></td>
                              <td className="p-2">234</td>
                              <td className="p-2 font-medium">$25K</td>
                              <td className="p-2 text-muted-foreground">5 days</td>
                            </tr>
                            <tr className="border-t hover:bg-muted/20">
                              <td className="p-2">Blockchain Security</td>
                              <td className="p-2"><Badge className="bg-warning/90 text-warning-foreground text-xs">Review</Badge></td>
                              <td className="p-2">89</td>
                              <td className="p-2 font-medium">$15K</td>
                              <td className="p-2 text-muted-foreground">2 days</td>
                            </tr>
                            <tr className="border-t hover:bg-muted/20">
                              <td className="p-2">Space Innovation</td>
                              <td className="p-2"><Badge className="bg-muted text-muted-foreground text-xs">Closed</Badge></td>
                              <td className="p-2">456</td>
                              <td className="p-2 font-medium">$100K</td>
                              <td className="p-2 text-muted-foreground">Ended</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Selectable Rows Table */}
                    <div>
                      <h4 className="font-medium mb-4">Selectable Rows Table</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <input type="checkbox" className="rounded border-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Select all</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" disabled>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete (0)
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Export
                            </Button>
                          </div>
                        </div>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="text-left p-4 w-12">
                                  <input type="checkbox" className="rounded border-muted-foreground" />
                                </th>
                                <th className="text-left p-4 font-medium">Participant</th>
                                <th className="text-left p-4 font-medium">Score</th>
                                <th className="text-left p-4 font-medium">Submissions</th>
                                <th className="text-left p-4 font-medium">Last Active</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-t hover:bg-muted/30 bg-primary/5">
                                <td className="p-4">
                                  <input type="checkbox" className="rounded border-muted-foreground" checked />
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                                      A
                                    </div>
                                    <div>
                                      <p className="font-medium">Ahmed Al-Rashid</p>
                                      <p className="text-sm text-muted-foreground">Innovator Level</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-success">2,450</span>
                                    <Badge className="bg-success/10 text-success">+150</Badge>
                                  </div>
                                </td>
                                <td className="p-4 text-muted-foreground">12</td>
                                <td className="p-4 text-muted-foreground">2 hours ago</td>
                              </tr>
                              <tr className="border-t hover:bg-muted/30">
                                <td className="p-4">
                                  <input type="checkbox" className="rounded border-muted-foreground" />
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white text-sm font-medium">
                                      S
                                    </div>
                                    <div>
                                      <p className="font-medium">Sarah Chen</p>
                                      <p className="text-sm text-muted-foreground">Expert Level</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold">1,890</span>
                                    <Badge className="bg-warning/10 text-warning">+50</Badge>
                                  </div>
                                </td>
                                <td className="p-4 text-muted-foreground">8</td>
                                <td className="p-4 text-muted-foreground">1 day ago</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Sortable Columns Table */}
                    <div>
                      <h4 className="font-medium mb-4">Sortable Columns Table</h4>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="text-left p-4 font-medium cursor-pointer hover:bg-muted/30">
                                <div className="flex items-center gap-2">
                                  Challenge Name
                                  <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                                </div>
                              </th>
                              <th className="text-left p-4 font-medium cursor-pointer hover:bg-muted/30">
                                <div className="flex items-center gap-2">
                                  Created Date
                                  <ChevronDown className="w-4 h-4 text-primary" />
                                </div>
                              </th>
                              <th className="text-left p-4 font-medium cursor-pointer hover:bg-muted/30">
                                <div className="flex items-center gap-2">
                                  Prize Amount
                                  <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                                </div>
                              </th>
                              <th className="text-left p-4 font-medium cursor-pointer hover:bg-muted/30">
                                <div className="flex items-center gap-2">
                                  Participants
                                  <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-t hover:bg-muted/30">
                              <td className="p-4 font-medium">AI for Climate Action</td>
                              <td className="p-4 text-muted-foreground">Mar 15, 2024</td>
                              <td className="p-4 text-success font-semibold">$100,000</td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <span>234</span>
                                  <Progress value={78} className="w-16 h-2" />
                                </div>
                              </td>
                            </tr>
                            <tr className="border-t hover:bg-muted/30">
                              <td className="p-4 font-medium">Smart City Solutions</td>
                              <td className="p-4 text-muted-foreground">Mar 10, 2024</td>
                              <td className="p-4 text-success font-semibold">$75,000</td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <span>156</span>
                                  <Progress value={52} className="w-16 h-2" />
                                </div>
                              </td>
                            </tr>
                            <tr className="border-t hover:bg-muted/30">
                              <td className="p-4 font-medium">Blockchain Security</td>
                              <td className="p-4 text-muted-foreground">Mar 8, 2024</td>
                              <td className="p-4 text-success font-semibold">$50,000</td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <span>89</span>
                                  <Progress value={30} className="w-16 h-2" />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Expandable Rows Table */}
                    <div>
                      <h4 className="font-medium mb-4">Expandable Rows Table</h4>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="text-left p-4 w-12"></th>
                              <th className="text-left p-4 font-medium">Project</th>
                              <th className="text-left p-4 font-medium">Status</th>
                              <th className="text-left p-4 font-medium">Progress</th>
                              <th className="text-left p-4 font-medium">Team</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-t hover:bg-muted/30">
                              <td className="p-4">
                                <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                                  <ChevronRight className="w-4 h-4" />
                                </Button>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-innovation/20 rounded-lg flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-innovation" />
                                  </div>
                                  <div>
                                    <p className="font-medium">Neural Network Platform</p>
                                    <p className="text-sm text-muted-foreground">Deep learning infrastructure</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge className="bg-success/90 text-success-foreground">In Progress</Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <Progress value={68} className="w-20 h-2" />
                                  <span className="text-sm text-muted-foreground">68%</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex -space-x-2">
                                  <div className="w-6 h-6 bg-primary rounded-full border-2 border-background flex items-center justify-center text-xs text-white">A</div>
                                  <div className="w-6 h-6 bg-secondary rounded-full border-2 border-background flex items-center justify-center text-xs text-white">S</div>
                                  <div className="w-6 h-6 bg-accent rounded-full border-2 border-background flex items-center justify-center text-xs text-white">M</div>
                                  <div className="w-6 h-6 bg-muted rounded-full border-2 border-background flex items-center justify-center text-xs text-muted-foreground">+3</div>
                                </div>
                              </td>
                            </tr>
                            <tr className="border-t bg-muted/20">
                              <td colSpan={5} className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <h5 className="font-medium mb-2">Project Details</h5>
                                    <p className="text-muted-foreground">Advanced neural network platform for real-time data processing and machine learning inference.</p>
                                  </div>
                                  <div>
                                    <h5 className="font-medium mb-2">Timeline</h5>
                                    <div className="space-y-1">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Started:</span>
                                        <span>Feb 1, 2024</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Deadline:</span>
                                        <span>May 15, 2024</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h5 className="font-medium mb-2">Key Metrics</h5>
                                    <div className="space-y-1">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Budget:</span>
                                        <span className="text-success">$50,000</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">ROI:</span>
                                        <span className="text-success">+245%</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <tr className="border-t hover:bg-muted/30">
                              <td className="p-4">
                                <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                                  <ChevronDown className="w-4 h-4" />
                                </Button>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                                    <Shield className="w-4 h-4 text-warning" />
                                  </div>
                                  <div>
                                    <p className="font-medium">Security Framework</p>
                                    <p className="text-sm text-muted-foreground">Enterprise security solution</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge className="bg-warning/90 text-warning-foreground">Review</Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <Progress value={95} className="w-20 h-2" />
                                  <span className="text-sm text-muted-foreground">95%</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex -space-x-2">
                                  <div className="w-6 h-6 bg-expert rounded-full border-2 border-background flex items-center justify-center text-xs text-white">E</div>
                                  <div className="w-6 h-6 bg-partner rounded-full border-2 border-background flex items-center justify-center text-xs text-white">P</div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Card-Style Table */}
                    <div>
                      <h4 className="font-medium mb-4">Card-Style Data Table</h4>
                      <div className="space-y-3">
                        <Card className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                                <Award className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold">Climate Solutions Challenge</h3>
                                <p className="text-sm text-muted-foreground">Environmental innovation competition</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6 text-right">
                              <div>
                                <div className="text-sm font-medium text-success">$75,000</div>
                                <div className="text-xs text-muted-foreground">Prize Pool</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium">156</div>
                                <div className="text-xs text-muted-foreground">Participants</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium">12 days</div>
                                <div className="text-xs text-muted-foreground">Remaining</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-success/90 text-success-foreground">Active</Badge>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-secondary to-innovation rounded-xl flex items-center justify-center">
                                <Zap className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold">AI Innovation Summit</h3>
                                <p className="text-sm text-muted-foreground">Machine learning showcase event</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6 text-right">
                              <div>
                                <div className="text-sm font-medium text-success">$100,000</div>
                                <div className="text-xs text-muted-foreground">Prize Pool</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium">289</div>
                                <div className="text-xs text-muted-foreground">Participants</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium">3 days</div>
                                <div className="text-xs text-muted-foreground">Remaining</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-innovation/90 text-innovation-foreground">Featured</Badge>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>

                    {/* Mobile-Responsive Stack Table */}
                    <div>
                      <h4 className="font-medium mb-4">Mobile-Responsive Stack Table</h4>
                      <div className="space-y-3 md:space-y-0">
                        {/* Desktop View */}
                        <div className="hidden md:block border rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="text-left p-4 font-medium">Challenge</th>
                                <th className="text-left p-4 font-medium">Status</th>
                                <th className="text-left p-4 font-medium">Participants</th>
                                <th className="text-left p-4 font-medium">Prize</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-t hover:bg-muted/30">
                                <td className="p-4 font-medium">Healthcare AI</td>
                                <td className="p-4"><Badge className="bg-success/90 text-success-foreground">Active</Badge></td>
                                <td className="p-4">234</td>
                                <td className="p-4 text-success font-semibold">$60,000</td>
                              </tr>
                              <tr className="border-t hover:bg-muted/30">
                                <td className="p-4 font-medium">Green Energy</td>
                                <td className="p-4"><Badge className="bg-warning/90 text-warning-foreground">Review</Badge></td>
                                <td className="p-4">156</td>
                                <td className="p-4 text-success font-semibold">$45,000</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        
                        {/* Mobile View */}
                        <div className="md:hidden space-y-3">
                          <Card className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">Healthcare AI</h3>
                              <Badge className="bg-success/90 text-success-foreground">Active</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Participants:</span>
                                <span className="ml-1 font-medium">234</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Prize:</span>
                                <span className="ml-1 font-medium text-success">$60,000</span>
                              </div>
                            </div>
                          </Card>
                          <Card className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">Green Energy</h3>
                              <Badge className="bg-warning/90 text-warning-foreground">Review</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Participants:</span>
                                <span className="ml-1 font-medium">156</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Prize:</span>
                                <span className="ml-1 font-medium text-success">$45,000</span>
                              </div>
                            </div>
                          </Card>
                        </div>
                      </div>
                    </div>

                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Dashboard Widgets">
                  <div className="space-y-8">

                    {/* Basic Metric Widgets */}
                    <div>
                      <h4 className="font-medium mb-4">Basic Metric Widgets</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-muted-foreground">Total Users</h4>
                            <Users className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <p className="text-2xl font-bold">12,543</p>
                          <p className="text-sm text-success flex items-center gap-1">
                            +12.5% from last month
                          </p>
                        </Card>
                        <Card className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-muted-foreground">Active Challenges</h4>
                            <Target className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <p className="text-2xl font-bold">24</p>
                          <p className="text-sm text-warning flex items-center gap-1">
                            +3 this week
                          </p>
                        </Card>
                        <Card className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-muted-foreground">Total Prizes</h4>
                            <Award className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <p className="text-2xl font-bold">$2.1M</p>
                          <p className="text-sm text-success flex items-center gap-1">
                            +$250K this quarter
                          </p>
                        </Card>
                        <Card className="p-4 hover:shadow-md transition-shadow">
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
                    </div>

                    {/* Progress & Status Widgets */}
                    <div>
                      <h4 className="font-medium mb-4">Progress & Status Widgets</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium">Challenge Completion</h4>
                            <Badge className="bg-success/10 text-success">On Track</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span className="font-medium">68%</span>
                            </div>
                            <Progress value={68} className="h-2" />
                            <p className="text-xs text-muted-foreground">12 of 18 challenges completed</p>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium">Innovation Score</h4>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-warning fill-current" />
                              <span className="text-sm font-medium">4.8</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Rating</span>
                              <span className="font-medium">Excellent</span>
                            </div>
                            <Progress value={96} className="h-2" />
                            <p className="text-xs text-muted-foreground">Based on 234 evaluations</p>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium">Team Collaboration</h4>
                            <div className="flex -space-x-1">
                              <div className="w-6 h-6 bg-primary rounded-full border-2 border-background"></div>
                              <div className="w-6 h-6 bg-secondary rounded-full border-2 border-background"></div>
                              <div className="w-6 h-6 bg-accent rounded-full border-2 border-background"></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Active Members</span>
                              <span className="font-medium">8/12</span>
                            </div>
                            <Progress value={67} className="h-2" />
                            <p className="text-xs text-muted-foreground">67% team participation</p>
                          </div>
                        </Card>
                      </div>
                    </div>

                    {/* Chart Widgets */}
                    <div>
                      <h4 className="font-medium mb-4">Chart Widgets</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">Weekly Activity</h4>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Submissions</span>
                              <span className="text-2xl font-bold">142</span>
                            </div>
                            <div className="h-24 bg-muted/20 rounded flex items-end justify-center gap-1 p-2">
                              <div className="w-4 bg-primary/60 rounded-t" style={{height: '20%'}}></div>
                              <div className="w-4 bg-primary/70 rounded-t" style={{height: '40%'}}></div>
                              <div className="w-4 bg-primary/80 rounded-t" style={{height: '60%'}}></div>
                              <div className="w-4 bg-primary/90 rounded-t" style={{height: '80%'}}></div>
                              <div className="w-4 bg-primary rounded-t" style={{height: '100%'}}></div>
                              <div className="w-4 bg-primary/80 rounded-t" style={{height: '70%'}}></div>
                              <div className="w-4 bg-primary/60 rounded-t" style={{height: '45%'}}></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Mon</span>
                              <span>Tue</span>
                              <span>Wed</span>
                              <span>Thu</span>
                              <span>Fri</span>
                              <span>Sat</span>
                              <span>Sun</span>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">Challenge Categories</h4>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center justify-center">
                              <div className="relative w-24 h-24">
                                <div className="absolute inset-0 rounded-full border-8 border-muted"></div>
                                <div className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent transform rotate-45"></div>
                                <div className="absolute inset-2 rounded-full border-6 border-secondary border-r-transparent transform -rotate-12"></div>
                                <div className="absolute inset-4 rounded-full border-4 border-accent border-b-transparent transform rotate-90"></div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                                  <span className="text-sm">Technology</span>
                                </div>
                                <span className="text-sm font-medium">45%</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-secondary rounded-full"></div>
                                  <span className="text-sm">Health</span>
                                </div>
                                <span className="text-sm font-medium">30%</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                                  <span className="text-sm">Environment</span>
                                </div>
                                <span className="text-sm font-medium">25%</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>

                    {/* Action Widgets */}
                    <div>
                      <h4 className="font-medium mb-4">Action Widgets</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Plus className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">Create Challenge</h4>
                              <p className="text-sm text-muted-foreground">Launch new innovation</p>
                            </div>
                          </div>
                          <Button className="w-full" size="sm">
                            Get Started
                          </Button>
                        </Card>

                        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                              <Upload className="w-5 h-5 text-secondary" />
                            </div>
                            <div>
                              <h4 className="font-medium">Submit Solution</h4>
                              <p className="text-sm text-muted-foreground">Share your innovation</p>
                            </div>
                          </div>
                          <Button variant="secondary" className="w-full" size="sm">
                            Upload Files
                          </Button>
                        </Card>

                        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                              <Users className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                              <h4 className="font-medium">Join Team</h4>
                              <p className="text-sm text-muted-foreground">Collaborate with others</p>
                            </div>
                          </div>
                          <Button variant="outline" className="w-full" size="sm">
                            Find Teams
                          </Button>
                        </Card>
                      </div>
                    </div>

                    {/* List Widgets */}
                    <div>
                      <h4 className="font-medium mb-4">List Widgets</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">Recent Activity</h4>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-success" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">Challenge completed</p>
                                <p className="text-xs text-muted-foreground">AI Healthcare Platform</p>
                              </div>
                              <span className="text-xs text-muted-foreground">2h ago</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <Star className="w-4 h-4 text-primary" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">New achievement</p>
                                <p className="text-xs text-muted-foreground">Innovation Expert Badge</p>
                              </div>
                              <span className="text-xs text-muted-foreground">1d ago</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-warning" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">Team invitation</p>
                                <p className="text-xs text-muted-foreground">Climate Solutions Team</p>
                              </div>
                              <span className="text-xs text-muted-foreground">3d ago</span>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">Top Performers</h4>
                            <Button variant="ghost" size="sm">
                              <Award className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-warning rounded-full flex items-center justify-center text-xs font-bold text-white">1</div>
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">A</div>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">Ahmed Al-Rashid</p>
                                <p className="text-xs text-muted-foreground">2,450 points</p>
                              </div>
                              <Badge className="bg-warning/10 text-warning">Expert</Badge>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-bold">2</div>
                                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white text-sm font-medium">S</div>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">Sarah Chen</p>
                                <p className="text-xs text-muted-foreground">2,180 points</p>
                              </div>
                              <Badge className="bg-secondary/10 text-secondary">Pro</Badge>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-bold">3</div>
                                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-medium">M</div>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">Mohammed Hassan</p>
                                <p className="text-xs text-muted-foreground">1,950 points</p>
                              </div>
                              <Badge className="bg-accent/10 text-accent">Rising</Badge>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>

                    {/* Notification Widgets */}
                    <div>
                      <h4 className="font-medium mb-4">Notification Widgets</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-4 border-l-4 border-l-warning">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
                              <Clock className="w-4 h-4 text-warning" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-warning">Deadline Approaching</h4>
                              <p className="text-sm text-muted-foreground mb-2">Climate Challenge submissions due in 2 days</p>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">Remind Later</Button>
                                <Button size="sm" className="bg-warning text-warning-foreground">Submit Now</Button>
                              </div>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4 border-l-4 border-l-success">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                              <Gift className="w-4 h-4 text-success" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-success">Congratulations!</h4>
                              <p className="text-sm text-muted-foreground mb-2">You've earned the Innovation Expert badge</p>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">Share</Button>
                                <Button size="sm" className="bg-success text-success-foreground">View Badge</Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>

                    {/* Complex Interactive Widgets */}
                    <div>
                      <h4 className="font-medium mb-4">Complex Interactive Widgets</h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">Innovation Pipeline</h4>
                            <Button variant="ghost" size="sm">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <span className="text-sm font-medium">Ideas</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm">23</span>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-warning rounded-full"></div>
                                <span className="text-sm font-medium">In Review</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm">8</span>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Eye className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-success rounded-full"></div>
                                <span className="text-sm font-medium">Implemented</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm">12</span>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <CheckCircle className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">Quick Actions</h4>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="flex items-center gap-2 justify-start p-3 h-auto">
                              <Search className="w-4 h-4" />
                              <div className="text-left">
                                <div className="text-sm font-medium">Find Experts</div>
                                <div className="text-xs text-muted-foreground">Connect with specialists</div>
                              </div>
                            </Button>
                            <Button variant="outline" className="flex items-center gap-2 justify-start p-3 h-auto">
                              <Calendar className="w-4 h-4" />
                              <div className="text-left">
                                <div className="text-sm font-medium">Schedule Meet</div>
                                <div className="text-xs text-muted-foreground">Book a session</div>
                              </div>
                            </Button>
                            <Button variant="outline" className="flex items-center gap-2 justify-start p-3 h-auto">
                              <Download className="w-4 h-4" />
                              <div className="text-left">
                                <div className="text-sm font-medium">Export Data</div>
                                <div className="text-xs text-muted-foreground">Download reports</div>
                              </div>
                            </Button>
                            <Button variant="outline" className="flex items-center gap-2 justify-start p-3 h-auto">
                              <Share className="w-4 h-4" />
                              <div className="text-left">
                                <div className="text-sm font-medium">Share Project</div>
                                <div className="text-xs text-muted-foreground">Invite collaborators</div>
                              </div>
                            </Button>
                          </div>
                        </Card>
                      </div>
                    </div>

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
                <ComponentShowcase title="Landing Page, Splash & Auth Patterns">
                  <div className="space-y-8">
                    {/* Landing Page Patterns */}
                    <div>
                      <h4 className="font-medium mb-4">Hero Section Size Variants</h4>
                      <div className="space-y-6">
                        
                         {/* Compact Hero */}
                         <div>
                           <h5 className="text-sm font-medium text-muted-foreground mb-3">Compact Hero</h5>
                           <div className="border rounded-lg overflow-hidden">
                              <div className="relative bg-gradient-to-r from-primary/60 via-accent/50 to-secondary/60 p-6 border-l-4 border-l-accent/70">
                                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20" />
                                <div className="max-w-4xl mx-auto text-center text-white relative z-10">
                                  <div className="flex items-center justify-center gap-2 mb-4">
                                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/40">
                                       <Sparkles className="w-6 h-6 text-accent" />
                                     </div>
                                     <Badge variant="secondary" className="bg-white/25 text-white border-white/60">Featured</Badge>
                                   </div>
                                   <h1 className="text-2xl md:text-3xl font-bold mb-3 drop-shadow-lg">
                                     Innovation <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary drop-shadow-sm">Made Simple</span>
                                   </h1>
                                   <p className="text-sm text-white/90 mb-4 max-w-xl mx-auto drop-shadow-md">Quick access to challenges and opportunities</p>
                                   <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
                                     <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg">
                                       Get Started <ArrowRight className="w-4 h-4 ml-1" />
                                     </Button>
                                     <Button size="sm" variant="outline" className="border-white/60 text-white bg-white/40 hover:bg-white/50 hover:border-white/80 backdrop-blur-sm">
                                       <Play className="w-4 h-4 mr-1 text-accent" /> Demo
                                     </Button>
                                   </div>
                                  <div className="flex justify-center gap-6 text-sm">
                                    <div className="text-center">
                                      <div className="font-bold text-blue-200 drop-shadow-sm">5K+</div>
                                      <div className="text-xs text-white/90">Users</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="font-bold text-green-200 drop-shadow-sm">200+</div>
                                      <div className="text-xs text-white/90">Projects</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="font-bold text-purple-200 drop-shadow-sm">98%</div>
                                      <div className="text-xs text-white/90">Success</div>
                                    </div>
                                 </div>
                              </div>
                            </div>
                          </div>
                        </div>

                         {/* Default Hero */}
                         <div>
                           <h5 className="text-sm font-medium text-muted-foreground mb-3">Default Hero</h5>
                           <div className="border rounded-lg overflow-hidden">
                              <div className="relative bg-gradient-to-r from-primary/60 via-accent/50 to-secondary/60 p-8 border-l-4 border-l-accent/70">
                                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20" />
                                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
                                  <div className="text-white">
                                    <div className="flex items-center gap-3 mb-4">
                                       <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/40">
                                         <Sparkles className="w-8 h-8 text-accent" />
                                       </div>
                                       <Badge variant="secondary" className="bg-white/25 text-white border-white/60">Latest</Badge>
                                     </div>
                                     <h1 className="text-3xl lg:text-4xl font-bold mb-4 drop-shadow-lg">
                                       Shape <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary drop-shadow-sm">the Future</span>
                                     </h1>
                                     <p className="text-lg text-white/90 mb-6 drop-shadow-md">Join innovators solving real-world challenges.</p>
                                     <div className="grid grid-cols-2 gap-3 mb-6">
                                       <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/40">
                                         <div className="flex items-center gap-2">
                                           <Target className="w-4 h-4 text-primary" />
                                           <div>
                                             <div className="font-bold drop-shadow-sm">10K+</div>
                                             <div className="text-xs text-white/90">Challenges</div>
                                           </div>
                                         </div>
                                       </div>
                                       <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/40">
                                         <div className="flex items-center gap-2">
                                           <Award className="w-4 h-4 text-accent" />
                                           <div>
                                             <div className="font-bold drop-shadow-sm">$2M+</div>
                                             <div className="text-xs text-white/90">Rewards</div>
                                           </div>
                                         </div>
                                       </div>
                                     </div>
                                     <div className="flex flex-col sm:flex-row gap-3">
                                       <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg">
                                         Start Journey <ArrowRight className="w-4 h-4 ml-2" />
                                       </Button>
                                       <Button variant="outline" className="border-white/60 text-white bg-white/40 hover:bg-white/50 hover:border-white/80 backdrop-blur-sm">
                                         <Play className="w-4 h-4 mr-2 text-accent" /> Watch Demo
                                       </Button>
                                     </div>
                                 </div>
                                  <div>
                                    <Card className="overflow-hidden border border-white/30 bg-white/15 backdrop-blur-sm">
                                      <div className="aspect-video bg-gradient-overlay relative">
                                        <div className="absolute bottom-3 left-3 text-white">
                                          <div className="flex items-center gap-1 text-xs mb-1">
                                            <Calendar className="h-3 w-3 text-purple-200" />
                                           <span>Ends March 30</span>
                                         </div>
                                         <h3 className="font-semibold text-sm drop-shadow-sm">AI for Climate</h3>
                                         <p className="text-xs opacity-95 drop-shadow-sm">$50K prize</p>
                                       </div>
                                       <div className="absolute top-3 right-3">
                                         <Badge className="bg-red-500/30 text-white text-xs border border-red-300/30">🔥 Hot</Badge>
                                       </div>
                                     </div>
                                     <div className="p-3">
                                       <div className="flex items-center justify-between mb-2">
                                         <div className="text-xs text-white/90">1.2k participants</div>
                                         <Button size="sm" variant="outline" className="border-white/60 text-white text-xs px-2 py-1 h-auto bg-white/40 hover:bg-white/50 hover:border-white/80 backdrop-blur-sm">Join</Button>
                                       </div>
                                       <Progress value={68} className="h-1.5 bg-white/20" />
                                     </div>
                                   </Card>
                                 </div>
                              </div>
                            </div>
                          </div>
                        </div>

                         {/* Large Hero */}
                         <div>
                           <h5 className="text-sm font-medium text-muted-foreground mb-3">Large/Full Hero</h5>
                           <div className="border rounded-lg overflow-hidden">
                               <div className="relative bg-gradient-to-r from-primary/60 via-accent/50 to-secondary/60 p-12 border-l-8 border-l-accent/80">
                                 <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20" />
                                 <div className="absolute inset-0 overflow-hidden">
                                   <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/15 rounded-full blur-3xl animate-pulse" />
                                   <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-pulse" />
                                 </div>
                                 <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
                                   <div className="text-white">
                                     <div className="flex items-center gap-4 mb-6">
                                       <div className="relative">
                                         <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full ring-4 ring-white/40 border border-white/30">
                                           <Sparkles className="w-12 h-12 animate-pulse text-accent" />
                                         </div>
                                         <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full animate-ping" />
                                       </div>
                                       <Badge variant="secondary" className="bg-white/25 text-white border-white/60">🎯 Latest</Badge>
                                     </div>
                                     <h1 className="text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg">
                                       <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary drop-shadow-sm">Shape</span> the Future
                                     </h1>
                                     <p className="text-xl text-white/90 mb-8 drop-shadow-md">Join thousands of innovators solving real challenges.</p>
                                     <div className="grid grid-cols-2 gap-4 mb-8">
                                       <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/40 hover:scale-105 transition-transform cursor-pointer">
                                         <div className="flex items-center gap-3">
                                           <div className="p-2 bg-primary/40 rounded-lg border border-white/30">
                                             <Target className="w-5 h-5 text-primary" />
                                           </div>
                                           <div>
                                             <div className="text-2xl font-bold drop-shadow-sm">10K+</div>
                                             <div className="text-xs text-white/90">Challenges</div>
                                           </div>
                                         </div>
                                       </div>
                                       <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/40 hover:scale-105 transition-transform cursor-pointer">
                                         <div className="flex items-center gap-3">
                                           <div className="p-2 bg-accent/40 rounded-lg border border-white/30">
                                             <Award className="w-5 h-5 text-accent" />
                                           </div>
                                           <div>
                                             <div className="text-2xl font-bold drop-shadow-sm">$2M+</div>
                                             <div className="text-xs text-white/90">Rewards</div>
                                           </div>
                                         </div>
                                       </div>
                                     </div>
                                     <div className="flex flex-col sm:flex-row gap-4">
                                       <Button size="lg" className="px-8 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all shadow-lg">
                                         Start Journey <ArrowRight className="w-4 h-4 ml-2" />
                                       </Button>
                                       <Button size="lg" variant="outline" className="px-8 border-white/60 text-white bg-white/40 hover:bg-white/50 hover:border-white/80 backdrop-blur-sm">
                                         <Play className="w-4 h-4 mr-2 text-accent" /> Watch Demo
                                       </Button>
                                     </div>
                                 </div>
                                  <div className="space-y-6">
                                    <Card className="overflow-hidden border border-white/30 bg-white/15 backdrop-blur-sm hover:scale-105 transition-transform">
                                      <div className="aspect-video bg-gradient-overlay relative">
                                        <div className="absolute bottom-4 left-4 text-white">
                                          <div className="flex items-center gap-2 text-sm mb-2">
                                            <Calendar className="h-4 w-4 text-purple-200" />
                                            <span>Ends March 30, 2024</span>
                                          </div>
                                          <h3 className="font-semibold text-lg mb-1 drop-shadow-sm">AI for Climate Action</h3>
                                          <p className="text-sm opacity-95 drop-shadow-sm">$50K prize • Global impact</p>
                                        </div>
                                        <div className="absolute top-4 right-4">
                                          <Badge className="bg-red-500/30 text-white border-red-300/40">🔥 Trending</Badge>
                                        </div>
                                      </div>
                                      <div className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                          <div className="text-sm text-white/90">1.2k participants • Global</div>
                                           <Button size="sm" variant="outline" className="border-white/60 text-white bg-white/40 hover:bg-white/50 hover:border-white/80 backdrop-blur-sm">
                                             <ExternalLink className="h-4 w-4 mr-1" /> Join
                                           </Button>
                                        </div>
                                        <Progress value={68} className="h-2 bg-white/20" />
                                      </div>
                                    </Card>
                                    <div className="grid grid-cols-2 gap-4">
                                      <Card className="p-4 hover:scale-105 transition-transform cursor-pointer border-white/30 bg-white/15 backdrop-blur-sm">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-lg bg-blue-500/40 flex items-center justify-center">
                                            <Zap className="h-4 w-4 text-yellow-200" />
                                          </div>
                                          <div>
                                            <p className="font-medium text-sm text-white drop-shadow-sm">Trending</p>
                                            <p className="text-xs text-white/90">Hot challenges</p>
                                          </div>
                                        </div>
                                      </Card>
                                      <Card className="p-4 hover:scale-105 transition-transform cursor-pointer border-white/30 bg-white/15 backdrop-blur-sm">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-lg bg-green-500/40 flex items-center justify-center">
                                            <Award className="h-4 w-4 text-purple-200" />
                                          </div>
                                          <div>
                                            <p className="font-medium text-sm text-white drop-shadow-sm">Leaderboard</p>
                                            <p className="text-xs text-white/90">Top innovators</p>
                                          </div>
                                        </div>
                                      </Card>
                                    </div>
                                  </div>
                               </div>
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Splash Screen Patterns */}
                    <div>
                      <h4 className="font-medium mb-4">Splash Screen Patterns</h4>
                      <div className="space-y-6">
                        {/* Loading Splash */}
                        <div className="border rounded-lg overflow-hidden">
                          <div className="bg-gradient-to-br from-primary to-secondary p-12 text-center text-white min-h-[400px] flex flex-col justify-center">
                            <div className="mb-8">
                              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6 mx-auto backdrop-blur-sm">
                                <span className="text-3xl">🏗️</span>
                              </div>
                              <h1 className="text-4xl font-bold mb-4">Ruwād</h1>
                              <p className="text-xl opacity-90">Innovation Platform</p>
                            </div>
                            <div className="space-y-4">
                              <div className="flex justify-center">
                                <Loader2 className="w-8 h-8 animate-spin opacity-80" />
                              </div>
                              <p className="text-sm opacity-70">Loading your innovation journey...</p>
                            </div>
                          </div>
                        </div>

                        {/* Progressive Loading */}
                        <div className="border rounded-lg overflow-hidden">
                          <div className="bg-background p-8 text-center min-h-[300px] flex flex-col justify-center">
                            <div className="mb-8">
                              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-4 mx-auto">
                                <span className="text-white text-2xl">R</span>
                              </div>
                              <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
                              <p className="text-muted-foreground">Setting up your workspace</p>
                            </div>
                            <div className="space-y-3 max-w-sm mx-auto">
                              <div className="flex items-center gap-3">
                                <CheckCircle className="w-4 h-4 text-success" />
                                <span className="text-sm">Loading challenges</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <CheckCircle className="w-4 h-4 text-success" />
                                <span className="text-sm">Preparing dashboard</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                <span className="text-sm">Syncing notifications</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2 mt-4">
                                <div className="bg-primary h-2 rounded-full transition-all duration-1000" style={{width: '75%'}}></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Brand Intro Splash */}
                        <div className="border rounded-lg overflow-hidden">
                          <div className="bg-card p-12 text-center min-h-[350px] flex flex-col justify-center">
                            <div className="max-w-md mx-auto">
                              <div className="w-24 h-24 bg-gradient-to-br from-primary via-accent to-secondary rounded-full flex items-center justify-center mb-6 mx-auto">
                                <span className="text-white text-3xl font-bold">🌟</span>
                              </div>
                              <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                                Innovation Awaits
                              </h1>
                              <p className="text-muted-foreground mb-8">
                                Discover challenges that matter. Build solutions that last. 
                                Create impact that transforms communities.
                              </p>
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Signin/Signup Patterns */}
                    <div>
                      <h4 className="font-medium mb-4">Authentication Patterns</h4>
                      <div className="space-y-6">
                        {/* Sign In Form */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="border rounded-lg p-8">
                            <div className="max-w-sm mx-auto">
                              <div className="text-center mb-8">
                                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4 mx-auto">
                                  <span className="text-white font-bold">R</span>
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
                                <p className="text-muted-foreground">Sign in to your Ruwād account</p>
                              </div>
                              
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium mb-2 block">Email</label>
                                  <input 
                                    type="email" 
                                    className="w-full p-3 border rounded-lg" 
                                    placeholder="your@email.com"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium mb-2 block">Password</label>
                                  <input 
                                    type="password" 
                                    className="w-full p-3 border rounded-lg" 
                                    placeholder="Enter your password"
                                  />
                                </div>
                                <div className="flex items-center justify-between">
                                  <label className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" className="rounded" />
                                    Remember me
                                  </label>
                                  <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
                                </div>
                                <Button className="w-full">Sign In</Button>
                                
                                <div className="relative my-6">
                                  <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t"></div>
                                  </div>
                                  <div className="relative flex justify-center text-sm">
                                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3">
                                  <Button variant="outline">
                                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                      <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                      <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                      <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                      <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    Google
                                  </Button>
                                  <Button variant="outline">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd"/>
                                    </svg>
                                    Facebook
                                  </Button>
                                </div>
                                
                                <p className="text-center text-sm text-muted-foreground">
                                  Don't have an account? <a href="#" className="text-primary hover:underline">Sign up</a>
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Sign Up Form */}
                          <div className="border rounded-lg p-8">
                            <div className="max-w-sm mx-auto">
                              <div className="text-center mb-8">
                                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4 mx-auto">
                                  <span className="text-white font-bold">+</span>
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Join Ruwād</h2>
                                <p className="text-muted-foreground">Start your innovation journey today</p>
                              </div>
                              
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-sm font-medium mb-2 block">First Name</label>
                                    <input 
                                      type="text" 
                                      className="w-full p-3 border rounded-lg" 
                                      placeholder="John"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium mb-2 block">Last Name</label>
                                    <input 
                                      type="text" 
                                      className="w-full p-3 border rounded-lg" 
                                      placeholder="Doe"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium mb-2 block">Email</label>
                                  <input 
                                    type="email" 
                                    className="w-full p-3 border rounded-lg" 
                                    placeholder="your@email.com"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium mb-2 block">Password</label>
                                  <input 
                                    type="password" 
                                    className="w-full p-3 border rounded-lg" 
                                    placeholder="Create a strong password"
                                  />
                                  <div className="mt-2 text-xs text-muted-foreground">
                                    Must be at least 8 characters with numbers and letters
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium mb-2 block">I'm interested in</label>
                                  <select className="w-full p-3 border rounded-lg">
                                    <option>Select your field</option>
                                    <option>Artificial Intelligence</option>
                                    <option>Healthcare Technology</option>
                                    <option>Climate Solutions</option>
                                    <option>Smart Cities</option>
                                    <option>Education Technology</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="flex items-start gap-2 text-sm">
                                    <input type="checkbox" className="rounded mt-0.5" />
                                    <span>I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a></span>
                                  </label>
                                </div>
                                <Button className="w-full">Create Account</Button>
                                
                                <p className="text-center text-sm text-muted-foreground">
                                  Already have an account? <a href="#" className="text-primary hover:underline">Sign in</a>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Password Reset */}
                        <div className="border rounded-lg p-8 max-w-md mx-auto">
                          <div className="text-center mb-8">
                            <div className="w-12 h-12 bg-warning rounded-lg flex items-center justify-center mb-4 mx-auto">
                              <Lock className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
                            <p className="text-muted-foreground">Enter your email to receive reset instructions</p>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">Email Address</label>
                              <input 
                                type="email" 
                                className="w-full p-3 border rounded-lg" 
                                placeholder="your@email.com"
                              />
                            </div>
                            <Button className="w-full">Send Reset Link</Button>
                            <div className="text-center">
                              <a href="#" className="text-sm text-primary hover:underline">Back to sign in</a>
                            </div>
                          </div>
                        </div>

                        {/* Verification States */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="border rounded-lg p-8 text-center">
                            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mb-4 mx-auto">
                              <CheckCircle className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Account Verified!</h3>
                            <p className="text-muted-foreground mb-6">Your email has been successfully verified. You can now access all features.</p>
                            <Button>Continue to Dashboard</Button>
                          </div>
                          
                          <div className="border border-warning/20 rounded-lg p-8 text-center bg-warning/5">
                            <div className="w-16 h-16 bg-warning rounded-full flex items-center justify-center mb-4 mx-auto">
                              <Mail className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Check Your Email</h3>
                            <p className="text-muted-foreground mb-6">We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.</p>
                            <div className="space-y-3">
                              <Button variant="outline" className="w-full">Resend Email</Button>
                              <p className="text-sm text-muted-foreground">Didn't receive it? Check your spam folder</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Layout & Structure Patterns">
                  <div className="space-y-8">
                    {/* Grid Systems */}
                    <div>
                      <h4 className="font-medium mb-4">Grid Systems</h4>
                      <div className="space-y-6">
                        {/* 12 Column Grid */}
                        <div>
                          <h5 className="text-sm font-medium mb-3">12-Column Grid</h5>
                          <div className="grid grid-cols-12 gap-2 mb-2">
                            {Array.from({length: 12}).map((_, i) => (
                              <div key={i} className="bg-primary/20 p-2 text-center text-xs rounded">
                                {i + 1}
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-6 bg-accent/20 p-4 rounded">6 cols</div>
                            <div className="col-span-6 bg-secondary/20 p-4 rounded">6 cols</div>
                            <div className="col-span-4 bg-success/20 p-4 rounded">4 cols</div>
                            <div className="col-span-4 bg-warning/20 p-4 rounded">4 cols</div>
                            <div className="col-span-4 bg-innovation/20 p-4 rounded">4 cols</div>
                          </div>
                        </div>

                        {/* Flexbox Grid */}
                        <div>
                          <h5 className="text-sm font-medium mb-3">Flexbox Layout</h5>
                          <div className="flex gap-4 mb-4">
                            <div className="flex-1 bg-primary/20 p-4 rounded">Flex 1</div>
                            <div className="flex-2 bg-accent/20 p-4 rounded">Flex 2</div>
                            <div className="flex-1 bg-secondary/20 p-4 rounded">Flex 1</div>
                          </div>
                          <div className="flex gap-4">
                            <div className="w-64 bg-success/20 p-4 rounded">Fixed Width</div>
                            <div className="flex-1 bg-warning/20 p-4 rounded">Flexible</div>
                            <div className="w-32 bg-innovation/20 p-4 rounded">Fixed</div>
                          </div>
                        </div>

                        {/* Masonry Grid */}
                        <div>
                          <h5 className="text-sm font-medium mb-3">Masonry Layout</h5>
                          <div className="columns-3 gap-4">
                            <div className="break-inside-avoid mb-4 bg-primary/20 p-4 rounded h-32">Card 1</div>
                            <div className="break-inside-avoid mb-4 bg-accent/20 p-4 rounded h-48">Card 2</div>
                            <div className="break-inside-avoid mb-4 bg-secondary/20 p-4 rounded h-24">Card 3</div>
                            <div className="break-inside-avoid mb-4 bg-success/20 p-4 rounded h-40">Card 4</div>
                            <div className="break-inside-avoid mb-4 bg-warning/20 p-4 rounded h-28">Card 5</div>
                            <div className="break-inside-avoid mb-4 bg-innovation/20 p-4 rounded h-36">Card 6</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content Layouts */}
                    <div>
                      <h4 className="font-medium mb-4">Content Layouts</h4>
                      <div className="space-y-6">
                        {/* Sidebar Layout */}
                        <div>
                          <h5 className="text-sm font-medium mb-3">Sidebar Layout</h5>
                          <div className="border rounded-lg overflow-hidden h-64">
                            <div className="flex h-full">
                              <div className="w-64 bg-muted/30 p-4 border-r">
                                <h6 className="font-medium mb-4">Navigation</h6>
                                <div className="space-y-2">
                                  <div className="p-2 rounded bg-primary/20">Dashboard</div>
                                  <div className="p-2 rounded hover:bg-accent/20">Projects</div>
                                  <div className="p-2 rounded hover:bg-accent/20">Settings</div>
                                </div>
                              </div>
                              <div className="flex-1 p-4">
                                <h6 className="font-medium mb-2">Main Content</h6>
                                <p className="text-sm text-muted-foreground">Primary content area with flexible width</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Split View Layout */}
                        <div>
                          <h5 className="text-sm font-medium mb-3">Split View Layout</h5>
                          <div className="border rounded-lg overflow-hidden h-64">
                            <div className="flex h-full">
                              <div className="w-1/2 p-4 border-r">
                                <h6 className="font-medium mb-2">Left Panel</h6>
                                <div className="space-y-2">
                                  <div className="h-4 bg-muted rounded"></div>
                                  <div className="h-4 bg-muted rounded w-3/4"></div>
                                  <div className="h-4 bg-muted rounded w-1/2"></div>
                                </div>
                              </div>
                              <div className="w-1/2 p-4">
                                <h6 className="font-medium mb-2">Right Panel</h6>
                                <div className="space-y-2">
                                  <div className="h-4 bg-muted rounded"></div>
                                  <div className="h-4 bg-muted rounded w-2/3"></div>
                                  <div className="h-4 bg-muted rounded w-4/5"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Container Patterns */}
                        <div>
                          <h5 className="text-sm font-medium mb-3">Container Patterns</h5>
                          <div className="space-y-4">
                            <div className="max-w-4xl mx-auto bg-primary/10 p-4 rounded">
                              <span className="text-sm font-medium">Fixed Container (max-width)</span>
                            </div>
                            <div className="w-full bg-accent/10 p-4 rounded">
                              <span className="text-sm font-medium">Fluid Container (full-width)</span>
                            </div>
                            <div className="max-w-6xl mx-auto bg-secondary/10 p-4 rounded relative">
                              <span className="text-sm font-medium">Breakout Container</span>
                              <div className="absolute -left-8 -right-8 bg-success/20 p-2 mt-2 rounded">
                                <span className="text-xs">Extends beyond parent</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Content Patterns">
                  <div className="space-y-8">
                    {/* Article Layouts */}
                    <div>
                      <h4 className="font-medium mb-4">Article/Blog Layouts</h4>
                      <div className="space-y-6">
                        <div className="border rounded-lg p-6 max-w-2xl">
                          <div className="mb-4">
                            <Badge className="mb-2">Technology</Badge>
                            <h2 className="text-2xl font-bold mb-2">The Future of AI in Healthcare</h2>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-medium">JD</span>
                                </div>
                                <span>John Doe</span>
                              </div>
                              <span>•</span>
                              <span>March 15, 2024</span>
                              <span>•</span>
                              <span>5 min read</span>
                            </div>
                          </div>
                          <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center">
                            <span className="text-4xl">🏥</span>
                          </div>
                          <div className="space-y-4 text-sm text-muted-foreground">
                            <p>Artificial Intelligence is revolutionizing healthcare delivery...</p>
                            <p>From diagnostic accuracy to treatment personalization...</p>
                          </div>
                          <div className="flex items-center gap-4 mt-6 pt-4 border-t">
                            <Button variant="ghost" size="sm">
                              <Heart className="w-4 h-4 mr-2" />
                              24
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              8
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share className="w-4 h-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Profile Pages */}
                    <div>
                      <h4 className="font-medium mb-4">Profile Layouts</h4>
                      <div className="space-y-6">
                        {/* User Profile */}
                        <div className="border rounded-lg overflow-hidden max-w-2xl">
                          <div className="h-32 bg-gradient-to-r from-primary to-accent"></div>
                          <div className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                              <div className="w-20 h-20 bg-white border-4 border-white rounded-full -mt-12 flex items-center justify-center shadow-lg">
                                <span className="text-2xl font-bold text-primary">JD</span>
                              </div>
                              <div className="flex-1 mt-2">
                                <h3 className="text-xl font-bold">Dr. Jane Doe</h3>
                                <p className="text-muted-foreground">AI Research Scientist</p>
                                <p className="text-sm text-muted-foreground">San Francisco, CA</p>
                              </div>
                              <Button size="sm">Follow</Button>
                            </div>
                            <p className="text-sm mb-4">
                              Passionate about developing AI solutions for healthcare challenges. 
                              10+ years experience in machine learning and medical technology.
                            </p>
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div>
                                <div className="text-xl font-bold text-primary">15</div>
                                <div className="text-xs text-muted-foreground">Challenges Won</div>
                              </div>
                              <div>
                                <div className="text-xl font-bold text-accent">1.2k</div>
                                <div className="text-xs text-muted-foreground">Followers</div>
                              </div>
                              <div>
                                <div className="text-xl font-bold text-secondary">850</div>
                                <div className="text-xs text-muted-foreground">Following</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Company Profile */}
                        <div className="border rounded-lg p-6 max-w-2xl">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-innovation to-expert rounded-lg flex items-center justify-center">
                              <span className="text-white text-xl font-bold">TC</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold">TechCorp Solutions</h3>
                              <p className="text-muted-foreground">Enterprise Software Company</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>Global</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  <span>1,000+ employees</span>
                                </div>
                              </div>
                            </div>
                            <Badge>Verified</Badge>
                          </div>
                          <p className="text-sm mb-4">
                            Leading provider of AI-powered enterprise solutions. Specializing in automation, 
                            analytics, and digital transformation for Fortune 500 companies.
                          </p>
                          <div className="flex gap-2 mb-4">
                            <Badge variant="secondary">AI/ML</Badge>
                            <Badge variant="secondary">Enterprise</Badge>
                            <Badge variant="secondary">SaaS</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-lg font-bold text-innovation">25</div>
                              <div className="text-xs text-muted-foreground">Active Projects</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-expert">$50M+</div>
                              <div className="text-xs text-muted-foreground">Invested</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-partner">98%</div>
                              <div className="text-xs text-muted-foreground">Success Rate</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pricing Tables */}
                    <div>
                      <h4 className="font-medium mb-4">Pricing Tables</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="border rounded-lg p-6 text-center">
                          <h3 className="text-lg font-bold mb-2">Starter</h3>
                          <div className="text-3xl font-bold mb-4">
                            <span className="text-lg text-muted-foreground">$</span>19
                            <span className="text-lg text-muted-foreground">/mo</span>
                          </div>
                          <ul className="space-y-2 text-sm mb-6">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-success" />
                              <span>5 Projects</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-success" />
                              <span>10GB Storage</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-success" />
                              <span>Email Support</span>
                            </li>
                          </ul>
                          <Button variant="outline" className="w-full">Get Started</Button>
                        </div>

                        <div className="border-2 border-primary rounded-lg p-6 text-center relative">
                          <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">Most Popular</Badge>
                          <h3 className="text-lg font-bold mb-2">Pro</h3>
                          <div className="text-3xl font-bold mb-4">
                            <span className="text-lg text-muted-foreground">$</span>49
                            <span className="text-lg text-muted-foreground">/mo</span>
                          </div>
                          <ul className="space-y-2 text-sm mb-6">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-success" />
                              <span>25 Projects</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-success" />
                              <span>100GB Storage</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-success" />
                              <span>Priority Support</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-success" />
                              <span>Advanced Analytics</span>
                            </li>
                          </ul>
                          <Button className="w-full">Upgrade to Pro</Button>
                        </div>

                        <div className="border rounded-lg p-6 text-center">
                          <h3 className="text-lg font-bold mb-2">Enterprise</h3>
                          <div className="text-3xl font-bold mb-4">Custom</div>
                          <ul className="space-y-2 text-sm mb-6">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-success" />
                              <span>Unlimited Projects</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-success" />
                              <span>Unlimited Storage</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-success" />
                              <span>24/7 Support</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-success" />
                              <span>Custom Integration</span>
                            </li>
                          </ul>
                          <Button variant="outline" className="w-full">Contact Sales</Button>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Patterns */}
                    <div>
                      <h4 className="font-medium mb-4">Timeline Patterns</h4>
                      <div className="space-y-6">
                        {/* Vertical Timeline */}
                        <div>
                          <h5 className="text-sm font-medium mb-3">Vertical Timeline</h5>
                          <div className="space-y-4 max-w-2xl">
                            <div className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className="w-3 h-3 bg-primary rounded-full"></div>
                                <div className="w-px h-12 bg-muted"></div>
                              </div>
                              <div className="flex-1 pb-4">
                                <div className="flex items-center gap-2 mb-1">
                                  <h6 className="font-medium">Project Started</h6>
                                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                                </div>
                                <p className="text-sm text-muted-foreground">AI Healthcare Challenge officially launched</p>
                              </div>
                            </div>
                            <div className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className="w-3 h-3 bg-accent rounded-full"></div>
                                <div className="w-px h-12 bg-muted"></div>
                              </div>
                              <div className="flex-1 pb-4">
                                <div className="flex items-center gap-2 mb-1">
                                  <h6 className="font-medium">First Submission</h6>
                                  <span className="text-xs text-muted-foreground">1 day ago</span>
                                </div>
                                <p className="text-sm text-muted-foreground">Team Alpha submitted their initial prototype</p>
                              </div>
                            </div>
                            <div className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className="w-3 h-3 bg-success rounded-full"></div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h6 className="font-medium">Milestone Reached</h6>
                                  <span className="text-xs text-muted-foreground">3 days ago</span>
                                </div>
                                <p className="text-sm text-muted-foreground">50 participants joined the challenge</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Activity Feed */}
                        <div>
                          <h5 className="text-sm font-medium mb-3">Activity Feed</h5>
                          <div className="border rounded-lg p-4 space-y-3 max-w-2xl">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-medium">JD</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm">
                                  <span className="font-medium">John Doe</span> submitted a solution to 
                                  <span className="font-medium text-primary"> AI Healthcare Challenge</span>
                                </p>
                                <span className="text-xs text-muted-foreground">5 minutes ago</span>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-medium">SM</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm">
                                  <span className="font-medium">Sarah Miller</span> commented on 
                                  <span className="font-medium text-primary">Smart City Solutions</span>
                                </p>
                                <span className="text-xs text-muted-foreground">1 hour ago</span>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-medium">TC</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm">
                                  <span className="font-medium">TechCorp</span> started following you
                                </p>
                                <span className="text-xs text-muted-foreground">2 hours ago</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Interactive Patterns">
                  <div className="space-y-8">
                    {/* Modal/Dialog Patterns */}
                    <div>
                      <h4 className="font-medium mb-4">Modal/Dialog Patterns</h4>
                      <div className="space-y-6">
                        {/* Confirmation Modal */}
                        <div>
                          <h5 className="text-sm font-medium mb-3">Confirmation Dialog</h5>
                          <div className="border rounded-lg p-4 bg-black/5 max-w-sm mx-auto">
                            <div className="bg-background border rounded-lg shadow-lg p-6">
                              <div className="text-center">
                                <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <AlertCircle className="w-6 h-6 text-destructive" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Delete Challenge?</h3>
                                <p className="text-sm text-muted-foreground mb-6">
                                  This action cannot be undone. All submissions and data will be permanently removed.
                                </p>
                                <div className="flex gap-2">
                                  <Button variant="outline" className="flex-1">Cancel</Button>
                                  <Button variant="destructive" className="flex-1">Delete</Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Form Modal */}
                        <div>
                          <h5 className="text-sm font-medium mb-3">Form Modal</h5>
                          <div className="border rounded-lg p-4 bg-black/5 max-w-md mx-auto">
                            <div className="bg-background border rounded-lg shadow-lg p-6">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Create New Project</h3>
                                <Button variant="ghost" size="sm">
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium mb-2 block">Project Name</label>
                                  <input className="w-full p-2 border rounded" placeholder="Enter project name" />
                                </div>
                                <div>
                                  <label className="text-sm font-medium mb-2 block">Description</label>
                                  <textarea className="w-full p-2 border rounded h-20" placeholder="Project description"></textarea>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" className="flex-1">Cancel</Button>
                                  <Button className="flex-1">Create</Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Wizard/Stepper Patterns */}
                    <div>
                      <h4 className="font-medium mb-4">Wizard/Stepper Patterns</h4>
                      <div className="space-y-6">
                        <div className="border rounded-lg p-6 max-w-2xl mx-auto">
                          {/* Stepper Header */}
                          <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                                1
                              </div>
                              <div className="w-16 h-1 bg-primary mx-2"></div>
                              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                                2
                              </div>
                              <div className="w-16 h-1 bg-muted mx-2"></div>
                              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-sm font-medium">
                                3
                              </div>
                            </div>
                          </div>
                          
                          {/* Step Content */}
                          <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-2">Project Details</h3>
                            <p className="text-sm text-muted-foreground mb-4">Tell us about your innovation project</p>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium mb-2 block">Project Title</label>
                                <input className="w-full p-2 border rounded" placeholder="Enter project title" />
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-2 block">Category</label>
                                <select className="w-full p-2 border rounded">
                                  <option>Select category</option>
                                  <option>AI & Machine Learning</option>
                                  <option>Healthcare</option>
                                  <option>Climate Tech</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          
                          {/* Navigation */}
                          <div className="flex justify-between">
                            <Button variant="outline">Previous</Button>
                            <Button>Next Step</Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Accordion Patterns */}
                    <div>
                      <h4 className="font-medium mb-4">Accordion/Collapse Patterns</h4>
                      <div className="space-y-4 max-w-2xl">
                        <div className="border rounded-lg">
                          <button className="w-full flex items-center justify-between p-4 text-left hover:bg-accent/50">
                            <span className="font-medium">Challenge Guidelines</span>
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <div className="p-4 border-t bg-muted/30">
                            <p className="text-sm text-muted-foreground">
                              All submissions must include original code, documentation, and a demo video. 
                              Projects will be evaluated based on innovation, technical implementation, and potential impact.
                            </p>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg">
                          <button className="w-full flex items-center justify-between p-4 text-left hover:bg-accent/50">
                            <span className="font-medium">Submission Requirements</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="border rounded-lg">
                          <button className="w-full flex items-center justify-between p-4 text-left hover:bg-accent/50">
                            <span className="font-medium">Judging Criteria</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Sidebar Patterns */}
                    <div>
                      <h4 className="font-medium mb-4">Sidebar Patterns</h4>
                      <div className="space-y-6">
                        {/* Overlay Sidebar */}
                        <div>
                          <h5 className="text-sm font-medium mb-3">Overlay Sidebar</h5>
                          <div className="border rounded-lg overflow-hidden h-64 relative">
                            <div className="w-full h-full bg-muted/20 p-4">
                              <p className="text-sm text-muted-foreground">Main content area</p>
                            </div>
                            <div className="absolute top-0 left-0 w-64 h-full bg-background border-r shadow-lg p-4">
                              <div className="flex items-center justify-between mb-4">
                                <h6 className="font-medium">Navigation</h6>
                                <Button variant="ghost" size="sm">
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="space-y-2">
                                <div className="p-2 rounded bg-primary/20">Dashboard</div>
                                <div className="p-2 rounded hover:bg-accent/20">Projects</div>
                                <div className="p-2 rounded hover:bg-accent/20">Settings</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Collapsible Sidebar */}
                        <div>
                          <h5 className="text-sm font-medium mb-3">Collapsible Sidebar</h5>
                          <div className="border rounded-lg overflow-hidden h-64 flex">
                            <div className="w-16 bg-muted/30 p-2 flex flex-col items-center border-r">
                              <Button variant="ghost" size="sm" className="mb-4">
                                <Menu className="w-4 h-4" />
                              </Button>
                              <div className="space-y-2">
                                <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center">
                                  <Home className="w-4 h-4" />
                                </div>
                                <div className="w-8 h-8 rounded flex items-center justify-center hover:bg-accent/20">
                                  <Target className="w-4 h-4" />
                                </div>
                                <div className="w-8 h-8 rounded flex items-center justify-center hover:bg-accent/20">
                                  <Settings className="w-4 h-4" />
                                </div>
                              </div>
                            </div>
                            <div className="flex-1 p-4">
                              <p className="text-sm text-muted-foreground">Main content with collapsed sidebar</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Data Visualization Patterns">
                  <div className="space-y-8">
                    {/* Chart Patterns */}
                    <div>
                      <h4 className="font-medium mb-4">Chart/Graph Patterns</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Bar Chart */}
                        <div className="border rounded-lg p-4">
                          <h5 className="font-medium mb-4">Bar Chart</h5>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <span className="text-sm w-16">AI/ML</span>
                              <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{width: '85%'}}></div>
                              </div>
                              <span className="text-sm font-medium">85%</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm w-16">Healthcare</span>
                              <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-accent rounded-full" style={{width: '72%'}}></div>
                              </div>
                              <span className="text-sm font-medium">72%</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm w-16">Climate</span>
                              <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-secondary rounded-full" style={{width: '68%'}}></div>
                              </div>
                              <span className="text-sm font-medium">68%</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm w-16">Education</span>
                              <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-success rounded-full" style={{width: '45%'}}></div>
                              </div>
                              <span className="text-sm font-medium">45%</span>
                            </div>
                          </div>
                        </div>

                        {/* Line Chart */}
                        <div className="border rounded-lg p-4">
                          <h5 className="font-medium mb-4">Progress Chart</h5>
                          <div className="h-32 relative">
                            <svg className="w-full h-full" viewBox="0 0 300 120">
                              <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3"/>
                                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0"/>
                                </linearGradient>
                              </defs>
                              <path d="M 0 100 L 50 80 L 100 60 L 150 40 L 200 35 L 250 25 L 300 20" 
                                    stroke="hsl(var(--primary))" strokeWidth="2" fill="none"/>
                              <path d="M 0 100 L 50 80 L 100 60 L 150 40 L 200 35 L 250 25 L 300 20 L 300 120 L 0 120 Z" 
                                    fill="url(#gradient)"/>
                            </svg>
                            <div className="absolute top-2 left-2 text-xs text-muted-foreground">Submissions Over Time</div>
                          </div>
                        </div>

                        {/* Pie Chart */}
                        <div className="border rounded-lg p-4">
                          <h5 className="font-medium mb-4">Distribution Chart</h5>
                          <div className="flex items-center gap-4">
                            <div className="w-24 h-24 rounded-full relative" style={{
                              background: `conic-gradient(hsl(var(--primary)) 0deg 126deg, hsl(var(--accent)) 126deg 216deg, hsl(var(--secondary)) 216deg 288deg, hsl(var(--success)) 288deg 360deg)`
                            }}>
                              <div className="absolute inset-2 bg-background rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium">100%</span>
                              </div>
                            </div>
                            <div className="space-y-2 text-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-primary rounded"></div>
                                <span>AI/ML (35%)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-accent rounded"></div>
                                <span>Healthcare (25%)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-secondary rounded"></div>
                                <span>Climate (20%)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-success rounded"></div>
                                <span>Education (20%)</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Progress Rings */}
                        <div className="border rounded-lg p-4">
                          <h5 className="font-medium mb-4">Progress Indicators</h5>
                          <div className="flex justify-around">
                            <div className="text-center">
                              <div className="w-16 h-16 rounded-full border-4 border-muted relative mb-2" style={{
                                borderTopColor: 'hsl(var(--primary))',
                                transform: 'rotate(225deg)'
                              }}>
                                <div className="absolute inset-0 flex items-center justify-center" style={{transform: 'rotate(-225deg)'}}>
                                  <span className="text-xs font-medium">75%</span>
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground">Completion</span>
                            </div>
                            <div className="text-center">
                              <div className="w-16 h-16 rounded-full border-4 border-muted relative mb-2" style={{
                                borderTopColor: 'hsl(var(--accent))',
                                borderRightColor: 'hsl(var(--accent))',
                                transform: 'rotate(180deg)'
                              }}>
                                <div className="absolute inset-0 flex items-center justify-center" style={{transform: 'rotate(-180deg)'}}>
                                  <span className="text-xs font-medium">50%</span>
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground">Quality</span>
                            </div>
                            <div className="text-center">
                              <div className="w-16 h-16 rounded-full border-4 border-muted relative mb-2" style={{
                                borderTopColor: 'hsl(var(--success))',
                                borderRightColor: 'hsl(var(--success))',
                                borderBottomColor: 'hsl(var(--success))',
                                transform: 'rotate(270deg)'
                              }}>
                                <div className="absolute inset-0 flex items-center justify-center" style={{transform: 'rotate(-270deg)'}}>
                                  <span className="text-xs font-medium">90%</span>
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground">Score</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Statistics Display */}
                    <div>
                      <h4 className="font-medium mb-4">Statistics Display</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="border rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-primary mb-1">2.5k</div>
                          <div className="text-sm text-muted-foreground">Active Users</div>
                          <div className="text-xs text-success mt-1">↗ +12.5%</div>
                        </div>
                        <div className="border rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-accent mb-1">156</div>
                          <div className="text-sm text-muted-foreground">Challenges</div>
                          <div className="text-xs text-success mt-1">↗ +8.2%</div>
                        </div>
                        <div className="border rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-secondary mb-1">$1.2M</div>
                          <div className="text-sm text-muted-foreground">Total Prizes</div>
                          <div className="text-xs text-warning mt-1">→ 0%</div>
                        </div>
                        <div className="border rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-success mb-1">94%</div>
                          <div className="text-sm text-muted-foreground">Success Rate</div>
                          <div className="text-xs text-destructive mt-1">↘ -2.1%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Error & Empty State Patterns">
                  <div className="space-y-8">
                    {/* Error Pages */}
                    <div>
                      <h4 className="font-medium mb-4">Error Pages</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 404 Error */}
                        <div className="border rounded-lg p-8 text-center">
                          <div className="text-6xl mb-4">🔍</div>
                          <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
                          <p className="text-muted-foreground mb-6">
                            The page you're looking for doesn't exist or has been moved.
                          </p>
                          <div className="flex gap-2 justify-center">
                            <Button variant="outline">Go Back</Button>
                            <Button>Go Home</Button>
                          </div>
                        </div>

                        {/* Server Error */}
                        <div className="border border-destructive/20 rounded-lg p-8 text-center bg-destructive/5">
                          <div className="text-6xl mb-4">⚠️</div>
                          <h2 className="text-2xl font-bold mb-2 text-destructive">Server Error</h2>
                          <p className="text-muted-foreground mb-6">
                            Something went wrong on our servers. Our team has been notified.
                          </p>
                          <div className="flex gap-2 justify-center">
                            <Button variant="outline">Try Again</Button>
                            <Button variant="outline">Contact Support</Button>
                          </div>
                        </div>

                        {/* Access Denied */}
                        <div className="border border-warning/20 rounded-lg p-8 text-center bg-warning/5">
                          <div className="text-6xl mb-4">🔒</div>
                          <h2 className="text-2xl font-bold mb-2 text-warning">Access Denied</h2>
                          <p className="text-muted-foreground mb-6">
                            You don't have permission to access this resource.
                          </p>
                          <div className="flex gap-2 justify-center">
                            <Button variant="outline">Request Access</Button>
                            <Button>Sign In</Button>
                          </div>
                        </div>

                        {/* Maintenance */}
                        <div className="border border-accent/20 rounded-lg p-8 text-center bg-accent/5">
                          <div className="text-6xl mb-4">🔧</div>
                          <h2 className="text-2xl font-bold mb-2 text-accent">Under Maintenance</h2>
                          <p className="text-muted-foreground mb-6">
                            We're performing scheduled maintenance. Please check back soon.
                          </p>
                          <div className="flex gap-2 justify-center">
                            <Button variant="outline">Check Status</Button>
                            <Button variant="outline">Subscribe to Updates</Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Empty States */}
                    <div>
                      <h4 className="font-medium mb-4">Empty State Designs</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* No Data */}
                        <div className="border rounded-lg p-8 text-center">
                          <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Grid className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <h3 className="font-semibold mb-2">No Challenges Yet</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Start your innovation journey by creating your first challenge.
                          </p>
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Challenge
                          </Button>
                        </div>

                        {/* No Search Results */}
                        <div className="border rounded-lg p-8 text-center">
                          <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <h3 className="font-semibold mb-2">No Results Found</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Try adjusting your search criteria or filters.
                          </p>
                          <div className="flex gap-2 justify-center">
                            <Button variant="outline">Clear Filters</Button>
                            <Button variant="outline">Browse All</Button>
                          </div>
                        </div>

                        {/* Empty Cart */}
                        <div className="border rounded-lg p-8 text-center">
                          <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🛒</span>
                          </div>
                          <h3 className="font-semibold mb-2">Your Cart is Empty</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Looks like you haven't added anything to your cart yet.
                          </p>
                          <Button>Start Shopping</Button>
                        </div>

                        {/* Empty Inbox */}
                        <div className="border rounded-lg p-8 text-center">
                          <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <h3 className="font-semibold mb-2">Inbox Zero!</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            All caught up! You have no new messages.
                          </p>
                          <Button variant="outline">Compose Message</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Communication Patterns">
                  <div className="space-y-8">
                    {/* Chat Interface */}
                    <div>
                      <h4 className="font-medium mb-4">Chat/Messaging Interface</h4>
                      <div className="border rounded-lg overflow-hidden h-96 flex flex-col max-w-md mx-auto">
                        <div className="bg-card border-b p-4 flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium text-sm">
                            TC
                          </div>
                          <div>
                            <p className="font-medium">Team Challenge</p>
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
                                <span className="font-medium text-sm">John</span>
                                <span className="text-xs text-muted-foreground">2:30 PM</span>
                              </div>
                              <div className="bg-muted rounded-lg p-3 max-w-xs">
                                <p className="text-sm">Hey team! Just submitted our AI model 🚀</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-3 justify-end">
                            <div className="max-w-xs">
                              <div className="flex items-center gap-2 mb-1 justify-end">
                                <span className="text-xs text-muted-foreground">2:32 PM</span>
                                <span className="font-medium text-sm">You</span>
                              </div>
                              <div className="bg-primary text-primary-foreground rounded-lg p-3">
                                <p className="text-sm">Awesome work! Let's review it together</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-3">
                            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-medium text-sm">
                              SM
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">Sarah</span>
                                <span className="text-xs text-muted-foreground">2:35 PM</span>
                              </div>
                              <div className="bg-muted rounded-lg p-3 max-w-xs">
                                <p className="text-sm">Great job everyone! 💪</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t p-4">
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              className="flex-1 p-2 border rounded-lg text-sm" 
                              placeholder="Type your message..."
                            />
                            <Button size="sm">
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Comment System */}
                    <div>
                      <h4 className="font-medium mb-4">Comment System</h4>
                      <div className="border rounded-lg p-6 max-w-2xl">
                        <div className="space-y-4">
                          {/* Parent Comment */}
                          <div className="flex gap-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium text-sm">
                              JD
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">John Doe</span>
                                <span className="text-xs text-muted-foreground">2 hours ago</span>
                              </div>
                              <p className="text-sm mb-2">
                                This is a fantastic approach to the healthcare challenge! 
                                The AI model shows great potential for early diagnosis.
                              </p>
                              <div className="flex items-center gap-4 text-xs">
                                <button className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                                  <ThumbsUp className="w-3 h-3" />
                                  <span>5</span>
                                </button>
                                <button className="text-muted-foreground hover:text-primary">Reply</button>
                              </div>
                            </div>
                          </div>

                          {/* Nested Reply */}
                          <div className="ml-11 flex gap-3">
                            <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white font-medium text-xs">
                              SM
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-xs">Sarah Miller</span>
                                <span className="text-xs text-muted-foreground">1 hour ago</span>
                              </div>
                              <p className="text-xs mb-2">
                                Thanks John! We're excited about the early results.
                              </p>
                              <div className="flex items-center gap-4 text-xs">
                                <button className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                                  <ThumbsUp className="w-3 h-3" />
                                  <span>2</span>
                                </button>
                                <button className="text-muted-foreground hover:text-primary">Reply</button>
                              </div>
                            </div>
                          </div>

                          {/* Comment Input */}
                          <div className="border-t pt-4">
                            <div className="flex gap-3">
                              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <div className="flex-1">
                                <textarea 
                                  className="w-full p-3 border rounded-lg text-sm" 
                                  rows={3}
                                  placeholder="Add a comment..."
                                ></textarea>
                                <div className="flex justify-end mt-2">
                                  <Button size="sm">Post Comment</Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Forum Discussion */}
                    <div>
                      <h4 className="font-medium mb-4">Forum/Discussion Layout</h4>
                      <div className="space-y-4 max-w-3xl">
                        <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                              JD
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">Best practices for AI model evaluation?</h3>
                                <Badge variant="secondary" className="text-xs">Question</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                Looking for recommendations on evaluating AI models for healthcare applications...
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>By John Doe</span>
                                <span>•</span>
                                <span>5 hours ago</span>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <MessageCircle className="w-3 h-3" />
                                  <span>12 replies</span>
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  <span>156 views</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right text-xs text-muted-foreground">
                              <div className="font-medium">Last reply</div>
                              <div>2 hours ago</div>
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors border-l-4 border-l-accent">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-medium">
                              SM
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">Announcing new healthcare challenge!</h3>
                                <Badge className="text-xs">Announcement</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                Excited to launch our biggest healthcare innovation challenge yet...
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>By Sarah Miller</span>
                                <span>•</span>
                                <span>1 day ago</span>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <MessageCircle className="w-3 h-3" />
                                  <span>25 replies</span>
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  <span>342 views</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right text-xs text-muted-foreground">
                              <div className="font-medium">Last reply</div>
                              <div>30 min ago</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                 </ComponentShowcase>

                 <ComponentShowcase title="Search & Filter Patterns">
                   <div className="space-y-6">
                     <div>
                       <h4 className="font-medium mb-4">Advanced Search Interface</h4>
                       <Card className="p-6">
                         <div className="space-y-4">
                           <div className="relative">
                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                             <input 
                               type="text" 
                               className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary" 
                               placeholder="Search challenges, teams, or experts..."
                               value="AI healthcare"
                             />
                             <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8">
                               Search
                             </Button>
                           </div>
                           
                           <div className="flex flex-wrap gap-2">
                             <Badge variant="secondary" className="text-xs">
                               Recent: "smart cities"
                             </Badge>
                             <Badge variant="secondary" className="text-xs">
                               Recent: "blockchain government"
                             </Badge>
                             <Badge variant="secondary" className="text-xs">
                               Recent: "digital transformation"
                             </Badge>
                           </div>
                         </div>
                       </Card>
                     </div>

                     <div>
                       <h4 className="font-medium mb-4">Faceted Search & Filters</h4>
                       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                         <Card className="p-4">
                           <h5 className="font-medium mb-3">Categories</h5>
                           <div className="space-y-2">
                             <label className="flex items-center gap-2 cursor-pointer">
                               <input type="checkbox" className="rounded" defaultChecked />
                               <span className="text-sm">Healthcare (47)</span>
                             </label>
                             <label className="flex items-center gap-2 cursor-pointer">
                               <input type="checkbox" className="rounded" defaultChecked />
                               <span className="text-sm">Technology (32)</span>
                             </label>
                             <label className="flex items-center gap-2 cursor-pointer">
                               <input type="checkbox" className="rounded" />
                               <span className="text-sm">Education (28)</span>
                             </label>
                             <label className="flex items-center gap-2 cursor-pointer">
                               <input type="checkbox" className="rounded" />
                               <span className="text-sm">Environment (15)</span>
                             </label>
                           </div>
                         </Card>

                         <Card className="p-4">
                           <h5 className="font-medium mb-3">Difficulty</h5>
                           <div className="space-y-2">
                             <label className="flex items-center gap-2 cursor-pointer">
                               <input type="radio" name="difficulty" className="rounded-full" />
                               <span className="text-sm">Beginner</span>
                             </label>
                             <label className="flex items-center gap-2 cursor-pointer">
                               <input type="radio" name="difficulty" className="rounded-full" defaultChecked />
                               <span className="text-sm">Intermediate</span>
                             </label>
                             <label className="flex items-center gap-2 cursor-pointer">
                               <input type="radio" name="difficulty" className="rounded-full" />
                               <span className="text-sm">Advanced</span>
                             </label>
                           </div>
                         </Card>

                         <Card className="p-4">
                           <h5 className="font-medium mb-3">Duration</h5>
                           <div className="space-y-3">
                             <div>
                               <label className="text-xs text-muted-foreground">1 week - 6 months</label>
                               <input type="range" min="1" max="24" value="12" className="w-full mt-1" />
                               <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                 <span>1w</span>
                                 <span>6m</span>
                               </div>
                             </div>
                           </div>
                         </Card>

                         <Card className="p-4">
                           <h5 className="font-medium mb-3">Active Filters</h5>
                           <div className="space-y-2">
                             <div className="flex items-center gap-2">
                               <Badge variant="outline" className="text-xs flex items-center gap-1">
                                 Healthcare
                                 <X className="w-3 h-3 cursor-pointer" />
                               </Badge>
                             </div>
                             <div className="flex items-center gap-2">
                               <Badge variant="outline" className="text-xs flex items-center gap-1">
                                 Technology
                                 <X className="w-3 h-3 cursor-pointer" />
                               </Badge>
                             </div>
                             <div className="flex items-center gap-2">
                               <Badge variant="outline" className="text-xs flex items-center gap-1">
                                 Intermediate
                                 <X className="w-3 h-3 cursor-pointer" />
                               </Badge>
                             </div>
                             <Button variant="ghost" size="sm" className="text-xs h-6 mt-2">
                               Clear All
                             </Button>
                           </div>
                         </Card>
                       </div>
                     </div>
                   </div>
                 </ComponentShowcase>

                 <ComponentShowcase title="Onboarding & Progressive Disclosure Patterns">
                   <div className="space-y-6">
                     <div>
                       <h4 className="font-medium mb-4">Feature Tour & Walkthrough</h4>
                       <Card className="p-6 relative">
                         <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                           <Card className="p-6 bg-background max-w-sm">
                             <div className="flex items-center justify-between mb-4">
                               <h5 className="font-medium">Welcome Tour</h5>
                               <div className="flex items-center gap-2">
                                 <span className="text-xs text-muted-foreground">2 of 5</span>
                                 <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                   <X className="w-4 h-4" />
                                 </Button>
                               </div>
                             </div>
                             <div className="space-y-4">
                               <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                   <Target className="w-5 h-5 text-primary" />
                                 </div>
                                 <div>
                                   <p className="font-medium">Create Your First Challenge</p>
                                   <p className="text-sm text-muted-foreground">Start by defining your innovation goal</p>
                                 </div>
                               </div>
                               <div className="flex justify-between">
                                 <Button variant="outline" size="sm">Previous</Button>
                                 <Button size="sm">Next</Button>
                               </div>
                             </div>
                           </Card>
                         </div>
                         
                         <div className="opacity-30">
                           <h3 className="text-lg font-semibold mb-4">Dashboard Overview</h3>
                           <div className="grid grid-cols-3 gap-4">
                             <div className="h-20 bg-muted rounded-lg"></div>
                             <div className="h-20 bg-muted rounded-lg border-2 border-primary"></div>
                             <div className="h-20 bg-muted rounded-lg"></div>
                           </div>
                         </div>
                       </Card>
                     </div>

                     <div>
                       <h4 className="font-medium mb-4">Progressive Form Disclosure</h4>
                       <Card className="p-6">
                         <div className="space-y-6">
                           <div className="flex items-center justify-between">
                             <h5 className="font-medium">Challenge Setup</h5>
                             <div className="flex space-x-1">
                               <div className="w-8 h-1 bg-primary rounded-full"></div>
                               <div className="w-8 h-1 bg-primary rounded-full"></div>
                               <div className="w-8 h-1 bg-primary/30 rounded-full"></div>
                               <div className="w-8 h-1 bg-muted rounded-full"></div>
                             </div>
                           </div>
                           
                           <div className="space-y-4">
                             <div>
                               <label className="text-sm font-medium mb-2 block">Challenge Title *</label>
                               <input 
                                 type="text" 
                                 className="w-full p-3 border rounded-lg" 
                                 value="AI-Powered Healthcare Diagnosis"
                               />
                             </div>
                             
                             <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-l-primary">
                               <div className="flex items-start gap-3">
                                 <Info className="w-5 h-5 text-primary mt-0.5" />
                                 <div>
                                   <p className="text-sm font-medium">Next Steps</p>
                                   <p className="text-xs text-muted-foreground">After this, we'll help you define success criteria and timeline.</p>
                                 </div>
                               </div>
                             </div>
                           </div>
                         </div>
                       </Card>
                     </div>

                     <div>
                       <h4 className="font-medium mb-4">Help & Tooltips System</h4>
                       <Card className="p-6">
                         <div className="space-y-4">
                           <div className="flex items-center gap-3">
                             <label className="text-sm font-medium">Project Scope</label>
                             <div className="relative group">
                               <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                               <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity max-w-xs">
                                 Define the boundaries and deliverables for your innovation challenge
                                 <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                               </div>
                             </div>
                           </div>
                           
                           <div className="flex items-center gap-3">
                             <label className="text-sm font-medium">Success Metrics</label>
                             <div className="relative group">
                               <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                               <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity max-w-xs">
                                 How will you measure the success of this challenge? Include quantifiable goals.
                                 <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                               </div>
                             </div>
                           </div>
                         </div>
                       </Card>
                     </div>
                   </div>
                 </ComponentShowcase>

                 <ComponentShowcase title="Social & Community Patterns">
                   <div className="space-y-6">
                     <div>
                       <h4 className="font-medium mb-4">Activity Feed & Timeline</h4>
                       <Card className="p-6">
                         <div className="space-y-4">
                           <div className="flex items-start gap-4">
                             <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                               <span className="text-white text-sm font-bold">SC</span>
                             </div>
                             <div className="flex-1">
                               <div className="flex items-center gap-2 mb-1">
                                 <span className="font-medium">Dr. Sarah Chen</span>
                                 <Badge variant="outline" className="text-xs">Expert</Badge>
                                 <span className="text-xs text-muted-foreground">completed a challenge</span>
                                 <span className="text-xs text-muted-foreground">2 hours ago</span>
                               </div>
                               <div className="bg-muted/30 p-3 rounded-lg">
                                 <p className="text-sm font-medium mb-1">AI Healthcare Platform Challenge</p>
                                 <p className="text-xs text-muted-foreground">Successfully developed a prototype for AI-assisted diagnosis</p>
                               </div>
                               <div className="flex items-center gap-4 mt-2">
                                 <Button variant="ghost" size="sm" className="h-8 text-xs">
                                   <ThumbsUp className="w-3 h-3 mr-1" />
                                   12 Likes
                                 </Button>
                                 <Button variant="ghost" size="sm" className="h-8 text-xs">
                                   <MessageCircle className="w-3 h-3 mr-1" />
                                   3 Comments
                                 </Button>
                                 <Button variant="ghost" size="sm" className="h-8 text-xs">
                                   <Share className="w-3 h-3 mr-1" />
                                   Share
                                 </Button>
                               </div>
                             </div>
                           </div>

                           <div className="flex items-start gap-4">
                             <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                               <span className="text-white text-sm font-bold">JD</span>
                             </div>
                             <div className="flex-1">
                               <div className="flex items-center gap-2 mb-1">
                                 <span className="font-medium">John Doe</span>
                                 <span className="text-xs text-muted-foreground">joined a team</span>
                                 <span className="text-xs text-muted-foreground">4 hours ago</span>
                               </div>
                               <div className="bg-muted/30 p-3 rounded-lg">
                                 <p className="text-sm font-medium mb-1">Smart Cities Innovation Team</p>
                                 <p className="text-xs text-muted-foreground">Now collaborating on urban sustainability solutions</p>
                               </div>
                               <div className="flex items-center gap-4 mt-2">
                                 <Button variant="ghost" size="sm" className="h-8 text-xs">
                                   <ThumbsUp className="w-3 h-3 mr-1" />
                                   8 Likes
                                 </Button>
                                 <Button variant="ghost" size="sm" className="h-8 text-xs">
                                   <MessageCircle className="w-3 h-3 mr-1" />
                                   Welcome
                                 </Button>
                               </div>
                             </div>
                           </div>
                         </div>
                       </Card>
                     </div>

                     <div>
                       <h4 className="font-medium mb-4">User Profile Cards</h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                         <Card className="p-6 text-center">
                           <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                             <span className="text-white text-xl font-bold">SC</span>
                           </div>
                           <h5 className="font-semibold mb-1">Dr. Sarah Chen</h5>
                           <p className="text-sm text-muted-foreground mb-3">AI Research Expert</p>
                           <div className="flex justify-center gap-2 mb-4">
                             <Badge variant="outline" className="text-xs">Healthcare</Badge>
                             <Badge variant="outline" className="text-xs">AI/ML</Badge>
                           </div>
                           <div className="grid grid-cols-3 gap-2 text-center mb-4">
                             <div>
                               <p className="text-lg font-bold">47</p>
                               <p className="text-xs text-muted-foreground">Challenges</p>
                             </div>
                             <div>
                               <p className="text-lg font-bold">156</p>
                               <p className="text-xs text-muted-foreground">Followers</p>
                             </div>
                             <div>
                               <p className="text-lg font-bold">89</p>
                               <p className="text-xs text-muted-foreground">Following</p>
                             </div>
                           </div>
                           <div className="flex gap-2">
                             <Button size="sm" className="flex-1">Follow</Button>
                             <Button variant="outline" size="sm" className="flex-1">Message</Button>
                           </div>
                         </Card>

                         <Card className="p-6 text-center">
                           <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                             <span className="text-white text-xl font-bold">JD</span>
                           </div>
                           <h5 className="font-semibold mb-1">John Doe</h5>
                           <p className="text-sm text-muted-foreground mb-3">Full Stack Developer</p>
                           <div className="flex justify-center gap-2 mb-4">
                             <Badge variant="outline" className="text-xs">Technology</Badge>
                             <Badge variant="outline" className="text-xs">Frontend</Badge>
                           </div>
                           <div className="grid grid-cols-3 gap-2 text-center mb-4">
                             <div>
                               <p className="text-lg font-bold">23</p>
                               <p className="text-xs text-muted-foreground">Challenges</p>
                             </div>
                             <div>
                               <p className="text-lg font-bold">78</p>
                               <p className="text-xs text-muted-foreground">Followers</p>
                             </div>
                             <div>
                               <p className="text-lg font-bold">145</p>
                               <p className="text-xs text-muted-foreground">Following</p>
                             </div>
                           </div>
                           <div className="flex gap-2">
                             <Button variant="outline" size="sm" className="flex-1">Following</Button>
                             <Button variant="outline" size="sm" className="flex-1">Message</Button>
                           </div>
                         </Card>

                         <Card className="p-6 text-center">
                           <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                             <span className="text-white text-xl font-bold">AM</span>
                           </div>
                           <h5 className="font-semibold mb-1">Alice Miller</h5>
                           <p className="text-sm text-muted-foreground mb-3">UX Designer</p>
                           <div className="flex justify-center gap-2 mb-4">
                             <Badge variant="outline" className="text-xs">Design</Badge>
                             <Badge variant="outline" className="text-xs">Innovation</Badge>
                           </div>
                           <div className="grid grid-cols-3 gap-2 text-center mb-4">
                             <div>
                               <p className="text-lg font-bold">34</p>
                               <p className="text-xs text-muted-foreground">Challenges</p>
                             </div>
                             <div>
                               <p className="text-lg font-bold">92</p>
                               <p className="text-xs text-muted-foreground">Followers</p>
                             </div>
                             <div>
                               <p className="text-lg font-bold">67</p>
                               <p className="text-xs text-muted-foreground">Following</p>
                             </div>
                           </div>
                           <div className="flex gap-2">
                             <Button size="sm" className="flex-1">Follow</Button>
                             <Button variant="outline" size="sm" className="flex-1">Message</Button>
                           </div>
                         </Card>
                       </div>
                     </div>

                     <div>
                       <h4 className="font-medium mb-4">Social Interactions</h4>
                       <Card className="p-6">
                         <div className="space-y-4">
                           <div className="flex items-center justify-between p-3 border rounded-lg">
                             <div className="flex items-center gap-3">
                               <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                 <Bell className="w-4 h-4 text-white" />
                               </div>
                               <div>
                                 <p className="text-sm font-medium">Dr. Sarah Chen liked your solution</p>
                                 <p className="text-xs text-muted-foreground">2 minutes ago</p>
                               </div>
                             </div>
                             <Button variant="ghost" size="sm">
                               <Eye className="w-4 h-4" />
                             </Button>
                           </div>

                           <div className="flex items-center justify-between p-3 border rounded-lg">
                             <div className="flex items-center gap-3">
                               <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                                 <MessageCircle className="w-4 h-4 text-white" />
                               </div>
                               <div>
                                 <p className="text-sm font-medium">New comment on your challenge</p>
                                 <p className="text-xs text-muted-foreground">5 minutes ago</p>
                               </div>
                             </div>
                             <Button variant="ghost" size="sm">
                               <Eye className="w-4 h-4" />
                             </Button>
                           </div>

                           <div className="flex items-center justify-between p-3 border rounded-lg">
                             <div className="flex items-center gap-3">
                               <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                                 <Users className="w-4 h-4 text-white" />
                               </div>
                               <div>
                                 <p className="text-sm font-medium">John Doe wants to join your team</p>
                                 <p className="text-xs text-muted-foreground">10 minutes ago</p>
                               </div>
                             </div>
                             <div className="flex gap-2">
                               <Button size="sm" variant="outline" className="h-8 text-xs">Decline</Button>
                               <Button size="sm" className="h-8 text-xs">Accept</Button>
                             </div>
                           </div>
                         </div>
                       </Card>
                     </div>
                   </div>
                 </ComponentShowcase>

                 <ComponentShowcase title="E-commerce & Marketplace Patterns">
                   <div className="space-y-6">
                     <div>
                       <h4 className="font-medium mb-4">Service/Product Cards</h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                         <Card className="p-0 overflow-hidden hover:shadow-lg transition-shadow">
                           <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                             <div className="text-center">
                               <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                 <Settings className="w-8 h-8 text-primary" />
                               </div>
                               <span className="text-sm font-medium">AI Consulting</span>
                             </div>
                           </div>
                           <div className="p-4">
                             <div className="flex items-center justify-between mb-2">
                               <h5 className="font-semibold">AI Strategy Consultation</h5>
                               <Badge variant="outline" className="text-xs">Premium</Badge>
                             </div>
                             <p className="text-sm text-muted-foreground mb-3">
                               Expert guidance on AI implementation for government agencies
                             </p>
                             <div className="flex items-center justify-between mb-3">
                               <div className="flex items-center gap-1">
                                 {[1, 2, 3, 4, 5].map((star) => (
                                   <Star key={star} className="w-4 h-4 text-warning fill-current" />
                                 ))}
                                 <span className="text-sm text-muted-foreground ml-1">(24)</span>
                               </div>
                               <span className="text-lg font-bold">$2,500</span>
                             </div>
                             <div className="flex gap-2">
                               <Button size="sm" className="flex-1">Book Now</Button>
                               <Button variant="outline" size="sm">
                                 <Heart className="w-4 h-4" />
                               </Button>
                             </div>
                           </div>
                         </Card>

                         <Card className="p-0 overflow-hidden hover:shadow-lg transition-shadow">
                           <div className="aspect-video bg-gradient-to-br from-accent/20 to-success/20 flex items-center justify-center">
                             <div className="text-center">
                               <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                 <Users className="w-8 h-8 text-accent" />
                               </div>
                               <span className="text-sm font-medium">Team Training</span>
                             </div>
                           </div>
                           <div className="p-4">
                             <div className="flex items-center justify-between mb-2">
                               <h5 className="font-semibold">Innovation Workshop</h5>
                               <Badge className="text-xs bg-success">Popular</Badge>
                             </div>
                             <p className="text-sm text-muted-foreground mb-3">
                               2-day intensive workshop on design thinking and innovation
                             </p>
                             <div className="flex items-center justify-between mb-3">
                               <div className="flex items-center gap-1">
                                 {[1, 2, 3, 4, 5].map((star) => (
                                   <Star key={star} className="w-4 h-4 text-warning fill-current" />
                                 ))}
                                 <span className="text-sm text-muted-foreground ml-1">(156)</span>
                               </div>
                               <span className="text-lg font-bold">$1,800</span>
                             </div>
                             <div className="flex gap-2">
                               <Button size="sm" className="flex-1">Book Now</Button>
                               <Button variant="outline" size="sm">
                                 <Heart className="w-4 h-4" />
                               </Button>
                             </div>
                           </div>
                         </Card>

                         <Card className="p-0 overflow-hidden hover:shadow-lg transition-shadow">
                           <div className="aspect-video bg-gradient-to-br from-warning/20 to-destructive/20 flex items-center justify-center">
                             <div className="text-center">
                               <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                 <Award className="w-8 h-8 text-warning" />
                               </div>
                               <span className="text-sm font-medium">Certification</span>
                             </div>
                           </div>
                           <div className="p-4">
                             <div className="flex items-center justify-between mb-2">
                               <h5 className="font-semibold">Digital Transformation</h5>
                               <Badge variant="outline" className="text-xs">New</Badge>
                             </div>
                             <p className="text-sm text-muted-foreground mb-3">
                               Professional certification in digital government transformation
                             </p>
                             <div className="flex items-center justify-between mb-3">
                               <div className="flex items-center gap-1">
                                 {[1, 2, 3, 4, 5].map((star) => (
                                   <Star key={star} className="w-4 h-4 text-warning fill-current" />
                                 ))}
                                 <span className="text-sm text-muted-foreground ml-1">(8)</span>
                               </div>
                               <span className="text-lg font-bold">$3,200</span>
                             </div>
                             <div className="flex gap-2">
                               <Button size="sm" className="flex-1">Enroll Now</Button>
                               <Button variant="outline" size="sm">
                                 <Heart className="w-4 h-4" />
                               </Button>
                             </div>
                           </div>
                         </Card>
                       </div>
                     </div>

                     <div>
                       <h4 className="font-medium mb-4">Shopping Cart & Checkout</h4>
                       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                         <div className="lg:col-span-2">
                           <Card className="p-6">
                             <h5 className="font-medium mb-4">Cart Items (3)</h5>
                             <div className="space-y-4">
                               <div className="flex items-center gap-4 p-4 border rounded-lg">
                                 <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                                   <Settings className="w-8 h-8 text-primary" />
                                 </div>
                                 <div className="flex-1">
                                   <h6 className="font-medium">AI Strategy Consultation</h6>
                                   <p className="text-sm text-muted-foreground">1 session • 2 hours</p>
                                 </div>
                                 <div className="text-right">
                                   <p className="font-medium">$2,500</p>
                                   <Button variant="ghost" size="sm" className="text-destructive h-6 mt-1">
                                     Remove
                                   </Button>
                                 </div>
                               </div>

                               <div className="flex items-center gap-4 p-4 border rounded-lg">
                                 <div className="w-16 h-16 bg-accent/20 rounded-lg flex items-center justify-center">
                                   <Users className="w-8 h-8 text-accent" />
                                 </div>
                                 <div className="flex-1">
                                   <h6 className="font-medium">Innovation Workshop</h6>
                                   <p className="text-sm text-muted-foreground">2 days • Up to 20 participants</p>
                                 </div>
                                 <div className="text-right">
                                   <p className="font-medium">$1,800</p>
                                   <Button variant="ghost" size="sm" className="text-destructive h-6 mt-1">
                                     Remove
                                   </Button>
                                 </div>
                               </div>
                             </div>
                           </Card>
                         </div>

                         <Card className="p-6">
                           <h5 className="font-medium mb-4">Order Summary</h5>
                           <div className="space-y-3">
                             <div className="flex justify-between">
                               <span className="text-sm">Subtotal</span>
                               <span className="text-sm">$4,300</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-sm">Government Discount (15%)</span>
                               <span className="text-sm text-success">-$645</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-sm">Processing Fee</span>
                               <span className="text-sm">$50</span>
                             </div>
                             <Separator />
                             <div className="flex justify-between font-medium">
                               <span>Total</span>
                               <span>$3,705</span>
                             </div>
                           </div>
                           <Button className="w-full mt-6">
                             <CreditCard className="w-4 h-4 mr-2" />
                             Proceed to Checkout
                           </Button>
                           <p className="text-xs text-muted-foreground text-center mt-2">
                             Secure government payment processing
                           </p>
                         </Card>
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
                         <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: '75%' }}></div>
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
                     <div className="space-y-2">
                       <div className="flex justify-between text-sm">
                         <span>Processing</span>
                         <span className="flex items-center gap-2">
                           <Loader2 className="w-3 h-3 animate-spin" />
                           Processing...
                         </span>
                       </div>
                       <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                         <div className="bg-primary h-2 rounded-full animate-pulse w-1/3"></div>
                       </div>
                     </div>
                   </div>
                 </ComponentShowcase>

                 <ComponentShowcase title="Network & Sync States">
                   <div className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-3">
                         <h4 className="text-sm font-medium">Network Status</h4>
                         <div className="flex items-center gap-3 p-3 bg-success/10 border border-success/20 rounded-lg">
                           <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                           <span className="text-sm">Online - Fast Connection</span>
                         </div>
                         <div className="flex items-center gap-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                           <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                           <span className="text-sm">Online - Slow Connection</span>
                         </div>
                         <div className="flex items-center gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                           <div className="w-2 h-2 bg-muted rounded-full"></div>
                           <span className="text-sm text-muted-foreground">Offline</span>
                         </div>
                       </div>
                       
                       <div className="space-y-3">
                         <h4 className="text-sm font-medium">Sync Status</h4>
                         <div className="flex items-center gap-3 p-3 bg-success/10 border border-success/20 rounded-lg">
                           <CheckCircle className="w-4 h-4 text-success" />
                           <span className="text-sm">All changes saved</span>
                         </div>
                         <div className="flex items-center gap-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                           <Loader2 className="w-4 h-4 animate-spin text-warning" />
                           <span className="text-sm">Syncing changes...</span>
                         </div>
                         <div className="flex items-center gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                           <AlertCircle className="w-4 h-4 text-destructive" />
                           <span className="text-sm">Sync failed - Retry?</span>
                         </div>
                       </div>
                     </div>
                   </div>
                 </ComponentShowcase>

                 <ComponentShowcase title="Authentication States">
                   <div className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-3">
                         <h4 className="text-sm font-medium">User Status</h4>
                         <div className="flex items-center gap-3 p-3 border rounded-lg">
                           <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                             <User className="w-4 h-4 text-white" />
                           </div>
                           <div className="flex-1">
                             <p className="text-sm font-medium">John Doe</p>
                             <p className="text-xs text-muted-foreground">Authenticated</p>
                           </div>
                           <div className="w-2 h-2 bg-success rounded-full"></div>
                         </div>
                         
                         <div className="flex items-center gap-3 p-3 border rounded-lg">
                           <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                             <User className="w-4 h-4 text-muted-foreground" />
                           </div>
                           <div className="flex-1">
                             <p className="text-sm font-medium text-muted-foreground">Guest User</p>
                             <p className="text-xs text-muted-foreground">Limited access</p>
                           </div>
                           <div className="w-2 h-2 bg-warning rounded-full"></div>
                         </div>
                       </div>

                       <div className="space-y-3">
                         <h4 className="text-sm font-medium">Session Status</h4>
                         <div className="p-3 border border-success/20 bg-success/5 rounded-lg">
                           <div className="flex items-center gap-2 mb-2">
                             <Lock className="w-4 h-4 text-success" />
                             <span className="text-sm font-medium text-success">Session Active</span>
                           </div>
                           <p className="text-xs text-muted-foreground">Expires in 4 hours</p>
                         </div>
                         
                         <div className="p-3 border border-warning/20 bg-warning/5 rounded-lg">
                           <div className="flex items-center gap-2 mb-2">
                             <Clock className="w-4 h-4 text-warning" />
                             <span className="text-sm font-medium text-warning">Session Expiring</span>
                           </div>
                           <p className="text-xs text-muted-foreground">5 minutes remaining</p>
                           <Button variant="outline" size="sm" className="mt-2 h-6 text-xs">
                             Extend Session
                           </Button>
                         </div>
                         
                         <div className="p-3 border border-destructive/20 bg-destructive/5 rounded-lg">
                           <div className="flex items-center gap-2 mb-2">
                             <Unlock className="w-4 h-4 text-destructive" />
                             <span className="text-sm font-medium text-destructive">Session Expired</span>
                           </div>
                           <Button variant="outline" size="sm" className="mt-2 h-6 text-xs">
                             Sign In Again
                           </Button>
                         </div>
                       </div>
                     </div>
                   </div>
                 </ComponentShowcase>

                 <ComponentShowcase title="Permission & Access States">
                   <div className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-3">
                         <h4 className="text-sm font-medium">Resource Access</h4>
                         <div className="flex items-center gap-3 p-3 bg-success/10 border border-success/20 rounded-lg">
                           <CheckCircle className="w-4 h-4 text-success" />
                           <span className="text-sm">Full Access Granted</span>
                         </div>
                         <div className="flex items-center gap-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                           <Shield className="w-4 h-4 text-warning" />
                           <span className="text-sm">Read-Only Access</span>
                         </div>
                         <div className="flex items-center gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                           <X className="w-4 h-4 text-destructive" />
                           <span className="text-sm">Access Denied</span>
                         </div>
                       </div>

                       <div className="space-y-3">
                         <h4 className="text-sm font-medium">Permission Levels</h4>
                         <div className="space-y-2">
                           <div className="flex items-center justify-between p-2 border rounded">
                             <span className="text-sm">Admin</span>
                             <Badge variant="default" className="text-xs">Full Control</Badge>
                           </div>
                           <div className="flex items-center justify-between p-2 border rounded">
                             <span className="text-sm">Moderator</span>
                             <Badge variant="secondary" className="text-xs">Limited</Badge>
                           </div>
                           <div className="flex items-center justify-between p-2 border rounded">
                             <span className="text-sm">User</span>
                             <Badge variant="outline" className="text-xs">Basic</Badge>
                           </div>
                           <div className="flex items-center justify-between p-2 border rounded opacity-50">
                             <span className="text-sm">Guest</span>
                             <Badge variant="outline" className="text-xs opacity-50">No Access</Badge>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </ComponentShowcase>

                 <ComponentShowcase title="Notification States">
                   <div className="space-y-4">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <div className="space-y-3">
                         <h4 className="text-sm font-medium">System Notifications</h4>
                         <div className="space-y-2">
                           <div className="flex items-start gap-3 p-3 border border-primary/20 bg-primary/5 rounded-lg">
                             <Info className="w-4 h-4 text-primary mt-0.5" />
                             <div className="flex-1">
                               <p className="text-sm font-medium">System Update Available</p>
                               <p className="text-xs text-muted-foreground">New features and improvements</p>
                             </div>
                             <div className="w-2 h-2 bg-primary rounded-full"></div>
                           </div>
                           
                           <div className="flex items-start gap-3 p-3 border border-success/20 bg-success/5 rounded-lg">
                             <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                             <div className="flex-1">
                               <p className="text-sm font-medium">Backup Completed</p>
                               <p className="text-xs text-muted-foreground">All data backed up successfully</p>
                             </div>
                           </div>
                           
                           <div className="flex items-start gap-3 p-3 border border-warning/20 bg-warning/5 rounded-lg">
                             <AlertCircle className="w-4 h-4 text-warning mt-0.5" />
                             <div className="flex-1">
                               <p className="text-sm font-medium">High CPU Usage</p>
                               <p className="text-xs text-muted-foreground">Consider upgrading your plan</p>
                             </div>
                             <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                           </div>
                         </div>
                       </div>

                       <div className="space-y-3">
                         <h4 className="text-sm font-medium">User Notifications</h4>
                         <div className="space-y-2">
                           <div className="flex items-center gap-3 p-3 border rounded-lg">
                             <Bell className="w-4 h-4 text-primary" />
                             <div className="flex-1">
                               <p className="text-sm font-medium">Notifications Enabled</p>
                               <p className="text-xs text-muted-foreground">You'll receive all updates</p>
                             </div>
                           </div>
                           
                           <div className="flex items-center gap-3 p-3 border rounded-lg opacity-50">
                             <Bell className="w-4 h-4 text-muted-foreground" />
                             <div className="flex-1">
                               <p className="text-sm font-medium text-muted-foreground">Notifications Disabled</p>
                               <p className="text-xs text-muted-foreground">Enable to stay updated</p>
                             </div>
                           </div>

                           <div className="relative">
                             <div className="flex items-center gap-3 p-3 border rounded-lg">
                               <Bell className="w-4 h-4 text-primary" />
                               <div className="flex-1">
                                 <p className="text-sm font-medium">Smart Notifications</p>
                                 <p className="text-xs text-muted-foreground">Only important updates</p>
                               </div>
                             </div>
                             <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full flex items-center justify-center">
                               <span className="text-xs text-white font-bold">3</span>
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                </ComponentShowcase>
              </div>
            </div>
          </TabsContent>

          {/* Widgets Tab */}
          <TabsContent value="widgets" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Widget Components</h2>
              
              <div className="space-y-6">
                <ComponentShowcase title="Dashboard Analytics Widgets">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Active Challenges</h4>
                        <Target className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-3xl font-bold text-primary">24</p>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">+12%</span>
                        <span className="text-xs text-muted-foreground">vs last month</span>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Total Participants</h4>
                        <Users className="w-4 h-4 text-secondary" />
                      </div>
                      <p className="text-3xl font-bold text-secondary">1,247</p>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded-full">+5%</span>
                        <span className="text-xs text-muted-foreground">this week</span>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Prize Pool</h4>
                        <Award className="w-4 h-4 text-warning" />
                      </div>
                      <p className="text-3xl font-bold text-warning">$2.1M</p>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">+$250K</span>
                        <span className="text-xs text-muted-foreground">this quarter</span>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Success Rate</h4>
                        <CheckCircle className="w-4 h-4 text-success" />
                      </div>
                      <p className="text-3xl font-bold text-success">87%</p>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">+3%</span>
                        <span className="text-xs text-muted-foreground">completion rate</span>
                      </div>
                    </Card>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Progress & Status Widgets">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Linear Progress Widgets</h4>
                      <Card className="p-4">
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Challenge Progress</span>
                              <span className="text-sm text-muted-foreground">7/10 completed</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: '70%' }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Team Engagement</span>
                              <span className="text-sm text-muted-foreground">85%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div className="bg-success h-2 rounded-full transition-all duration-300" style={{ width: '85%' }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Innovation Score</span>
                              <span className="text-sm text-muted-foreground">92%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div className="bg-innovation h-2 rounded-full transition-all duration-300" style={{ width: '92%' }}></div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium">Circular Progress Widgets</h4>
                      <Card className="p-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="relative w-16 h-16 mx-auto mb-2">
                              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                                <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted" />
                                <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-primary" strokeDasharray="175.929" strokeDashoffset="52.778" strokeLinecap="round" />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-medium">70%</span>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">Completion</span>
                          </div>
                          
                          <div className="text-center">
                            <div className="relative w-16 h-16 mx-auto mb-2">
                              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                                <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted" />
                                <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-success" strokeDasharray="175.929" strokeDashoffset="26.389" strokeLinecap="round" />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-medium">85%</span>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">Quality</span>
                          </div>
                          
                          <div className="text-center">
                            <div className="relative w-16 h-16 mx-auto mb-2">
                              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                                <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted" />
                                <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-warning" strokeDasharray="175.929" strokeDashoffset="14.074" strokeLinecap="round" />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-medium">92%</span>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">Innovation</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Real-time Activity Widgets">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-4">
                      <h4 className="font-medium mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                        Live Activity Feed
                      </h4>
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-medium">
                            JD
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-medium">John Doe</span> submitted a solution to 
                              <span className="text-primary">AI Healthcare Challenge</span>
                            </p>
                            <p className="text-xs text-muted-foreground">2 minutes ago</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center text-white text-xs font-medium">
                            SM
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-medium">Sarah Miller</span> won first place in 
                              <span className="text-success">Climate Tech Innovation</span>
                            </p>
                            <p className="text-xs text-muted-foreground">5 minutes ago</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-xs font-medium">
                            TC
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-medium">Team Alpha</span> formed for 
                              <span className="text-accent">Blockchain Solutions</span>
                            </p>
                            <p className="text-xs text-muted-foreground">8 minutes ago</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center text-white text-xs font-medium">
                            MK
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-medium">Mike Chen</span> started 
                              <span className="text-warning">Smart City Challenge</span>
                            </p>
                            <p className="text-xs text-muted-foreground">12 minutes ago</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <h4 className="font-medium mb-4">Performance Metrics</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Server Response Time</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-muted rounded-full h-1.5">
                              <div className="bg-success h-1.5 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                            <span className="text-xs text-success">142ms</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm">API Success Rate</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-muted rounded-full h-1.5">
                              <div className="bg-success h-1.5 rounded-full" style={{ width: '99%' }}></div>
                            </div>
                            <span className="text-xs text-success">99.2%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Active Users</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-muted rounded-full h-1.5">
                              <div className="bg-primary h-1.5 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                            <span className="text-xs text-primary">1,247</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Memory Usage</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-muted rounded-full h-1.5">
                              <div className="bg-warning h-1.5 rounded-full" style={{ width: '68%' }}></div>
                            </div>
                            <span className="text-xs text-warning">68%</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="User Profile & Team Widgets">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="p-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-xl">
                          JD
                        </div>
                        <h4 className="font-semibold">John Doe</h4>
                        <p className="text-sm text-muted-foreground mb-3">AI Research Expert</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Challenges Won</span>
                            <span className="font-medium">12</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Innovation Score</span>
                            <span className="font-medium text-innovation">94/100</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Team Collaborations</span>
                            <span className="font-medium">8</span>
                          </div>
                        </div>
                        <Button size="sm" className="w-full mt-3">View Profile</Button>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Team Performance</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-medium">
                            A
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Team Alpha</span>
                              <span className="text-xs text-success">92%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1 mt-1">
                              <div className="bg-success h-1 rounded-full" style={{ width: '92%' }}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white text-xs font-medium">
                            B
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Team Beta</span>
                              <span className="text-xs text-warning">78%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1 mt-1">
                              <div className="bg-warning h-1 rounded-full" style={{ width: '78%' }}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-xs font-medium">
                            G
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Team Gamma</span>
                              <span className="text-xs text-primary">85%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1 mt-1">
                              <div className="bg-primary h-1 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Skill Distribution</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">AI/ML</span>
                            <span className="text-xs">40%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '40%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Frontend</span>
                            <span className="text-xs">30%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-secondary h-2 rounded-full" style={{ width: '30%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Backend</span>
                            <span className="text-xs">20%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-accent h-2 rounded-full" style={{ width: '20%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Design</span>
                            <span className="text-xs">10%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-innovation h-2 rounded-full" style={{ width: '10%' }}></div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Calendar & Scheduling Widgets">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Upcoming Events</h4>
                        <Button variant="ghost" size="sm">
                          <Calendar className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground">MAR</div>
                            <div className="text-lg font-bold text-primary">15</div>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">AI Healthcare Demo Day</p>
                            <p className="text-xs text-muted-foreground">2:00 PM - 5:00 PM</p>
                            <div className="flex items-center gap-1 mt-1">
                              <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                              <span className="text-xs text-success">Confirmed</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground">MAR</div>
                            <div className="text-lg font-bold text-warning">18</div>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">Climate Tech Workshop</p>
                            <p className="text-xs text-muted-foreground">10:00 AM - 12:00 PM</p>
                            <div className="flex items-center gap-1 mt-1">
                              <div className="w-1.5 h-1.5 bg-warning rounded-full"></div>
                              <span className="text-xs text-warning">Pending</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground">MAR</div>
                            <div className="text-lg font-bold text-accent">22</div>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">Innovation Summit</p>
                            <p className="text-xs text-muted-foreground">All Day Event</p>
                            <div className="flex items-center gap-1 mt-1">
                              <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                              <span className="text-xs text-accent">Registered</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <h4 className="font-medium mb-4">Challenge Timeline</h4>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 bg-success rounded-full"></div>
                            <div className="w-0.5 h-8 bg-muted"></div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Registration Open</p>
                            <p className="text-xs text-muted-foreground">March 1-15, 2024</p>
                          </div>
                          <Badge className="bg-success/90 text-success-foreground text-xs">Complete</Badge>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                            <div className="w-0.5 h-8 bg-muted"></div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Development Phase</p>
                            <p className="text-xs text-muted-foreground">March 16 - April 30, 2024</p>
                          </div>
                          <Badge className="bg-primary/90 text-primary-foreground text-xs">Active</Badge>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 bg-muted rounded-full"></div>
                            <div className="w-0.5 h-8 bg-muted"></div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Submission Deadline</p>
                            <p className="text-xs text-muted-foreground">May 1, 2024</p>
                          </div>
                          <Badge variant="outline" className="text-xs">Upcoming</Badge>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 bg-muted rounded-full"></div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Judging & Results</p>
                            <p className="text-xs text-muted-foreground">May 2-15, 2024</p>
                          </div>
                          <Badge variant="outline" className="text-xs">Upcoming</Badge>
                        </div>
                      </div>
                    </Card>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Social & Engagement Widgets">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-4">
                      <h4 className="font-medium mb-4">Leaderboard</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10">
                          <div className="w-6 h-6 bg-warning rounded-full flex items-center justify-center text-white text-xs font-bold">
                            1
                          </div>
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-medium">
                            SM
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">Sarah Miller</p>
                            <p className="text-xs text-muted-foreground">AI Research Expert</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm">2,450</p>
                            <p className="text-xs text-muted-foreground">points</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-2 rounded-lg">
                          <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-xs font-bold">
                            2
                          </div>
                          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white text-xs font-medium">
                            JD
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">John Doe</p>
                            <p className="text-xs text-muted-foreground">Full Stack Developer</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm">2,180</p>
                            <p className="text-xs text-muted-foreground">points</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-2 rounded-lg">
                          <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-xs font-bold">
                            3
                          </div>
                          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-xs font-medium">
                            MK
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">Mike Chen</p>
                            <p className="text-xs text-muted-foreground">Data Scientist</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm">1,920</p>
                            <p className="text-xs text-muted-foreground">points</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <h4 className="font-medium mb-4">Community Engagement</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-destructive" />
                            <span className="text-sm">Total Likes</span>
                          </div>
                          <span className="font-bold text-destructive">3,247</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-primary" />
                            <span className="text-sm">Comments</span>
                          </div>
                          <span className="font-bold text-primary">1,856</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Share className="w-4 h-4 text-accent" />
                            <span className="text-sm">Shares</span>
                          </div>
                          <span className="font-bold text-accent">642</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-warning" />
                            <span className="text-sm">Favorites</span>
                          </div>
                          <span className="font-bold text-warning">928</span>
                        </div>
                        
                        <Separator />
                        
                        <div className="text-center">
                          <p className="text-2xl font-bold text-success">94%</p>
                          <p className="text-sm text-muted-foreground">Engagement Rate</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="Financial & E-commerce Widgets">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="p-4">
                      <h4 className="font-medium mb-4">Prize Pool Distribution</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">🥇 First Place</span>
                          <span className="font-bold text-warning">$50,000</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">🥈 Second Place</span>
                          <span className="font-bold text-muted-foreground">$25,000</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">🥉 Third Place</span>
                          <span className="font-bold text-muted-foreground">$15,000</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">🏆 Special Awards</span>
                          <span className="font-bold text-primary">$10,000</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center font-bold">
                          <span>Total Prize Pool</span>
                          <span className="text-success">$100,000</span>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <h4 className="font-medium mb-4">Subscription Plans</h4>
                      <div className="space-y-3">
                        <div className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Basic</span>
                            <span className="text-lg font-bold">Free</span>
                          </div>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• 3 challenges per month</li>
                            <li>• Basic support</li>
                            <li>• Community access</li>
                          </ul>
                        </div>
                        
                        <div className="p-3 border-2 border-primary rounded-lg bg-primary/5">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Pro</span>
                            <span className="text-lg font-bold text-primary">$29/mo</span>
                          </div>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Unlimited challenges</li>
                            <li>• Priority support</li>
                            <li>• Advanced analytics</li>
                          </ul>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <h4 className="font-medium mb-4">Revenue Analytics</h4>
                      <div className="space-y-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-success">$247K</p>
                          <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">+12%</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Subscriptions</span>
                            <span>85%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Partnerships</span>
                            <span>15%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-accent h-2 rounded-full" style={{ width: '15%' }}></div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </ComponentShowcase>

                <ComponentShowcase title="System Status & Monitoring Widgets">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-4">
                      <h4 className="font-medium mb-4">System Health</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-success/10 rounded-lg">
                          <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center mx-auto mb-2">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-sm font-medium">API Status</p>
                          <p className="text-xs text-success">Operational</p>
                        </div>
                        
                        <div className="text-center p-3 bg-success/10 rounded-lg">
                          <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center mx-auto mb-2">
                            <Wifi className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-sm font-medium">Network</p>
                          <p className="text-xs text-success">Stable</p>
                        </div>
                        
                        <div className="text-center p-3 bg-warning/10 rounded-lg">
                          <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center mx-auto mb-2">
                            <AlertCircle className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-sm font-medium">Storage</p>
                          <p className="text-xs text-warning">78% Used</p>
                        </div>
                        
                        <div className="text-center p-3 bg-success/10 rounded-lg">
                          <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center mx-auto mb-2">
                            <Shield className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-sm font-medium">Security</p>
                          <p className="text-xs text-success">Protected</p>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <h4 className="font-medium mb-4">Resource Usage</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm">CPU Usage</span>
                            <span className="text-sm font-medium">45%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-success h-2 rounded-full transition-all duration-300" style={{ width: '45%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm">Memory</span>
                            <span className="text-sm font-medium">68%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-warning h-2 rounded-full transition-all duration-300" style={{ width: '68%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm">Disk Space</span>
                            <span className="text-sm font-medium">32%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: '32%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm">Bandwidth</span>
                            <span className="text-sm font-medium">89%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-destructive h-2 rounded-full transition-all duration-300" style={{ width: '89%' }}></div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </ComponentShowcase>
              </div>
            </div>
          </TabsContent>

          {/* Animations & Icons Tab */}
          <TabsContent value="animations" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Animations & Icons</h2>
              
              <div className="space-y-6">
                
                {/* Basic Animations */}
                <ComponentShowcase title="Basic Animations">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-4 hover:shadow-lg transition-shadow">
                      <h4 className="font-medium mb-3">Fade In</h4>
                      <div className="space-y-3">
                        <div className="w-full h-16 bg-primary/20 rounded-lg animate-fade-in"></div>
                        <code className="text-xs bg-muted px-2 py-1 rounded">animate-fade-in</code>
                      </div>
                    </Card>

                    <Card className="p-4 hover:shadow-lg transition-shadow">
                      <h4 className="font-medium mb-3">Scale In</h4>
                      <div className="space-y-3">
                        <div className="w-full h-16 bg-secondary/20 rounded-lg animate-scale-in"></div>
                        <code className="text-xs bg-muted px-2 py-1 rounded">animate-scale-in</code>
                      </div>
                    </Card>

                    <Card className="p-4 hover:shadow-lg transition-shadow">
                      <h4 className="font-medium mb-3">Pulse</h4>
                      <div className="space-y-3">
                        <div className="w-full h-16 bg-accent/20 rounded-lg animate-pulse"></div>
                        <code className="text-xs bg-muted px-2 py-1 rounded">animate-pulse</code>
                      </div>
                    </Card>

                    <Card className="p-4 hover:shadow-lg transition-shadow">
                      <h4 className="font-medium mb-3">Bounce</h4>
                      <div className="space-y-3">
                        <div className="w-full h-16 bg-warning/20 rounded-lg animate-bounce"></div>
                        <code className="text-xs bg-muted px-2 py-1 rounded">animate-bounce</code>
                      </div>
                    </Card>
                  </div>
                </ComponentShowcase>

                {/* Interactive Animations */}
                <ComponentShowcase title="Interactive Animations">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-6 text-center hover-scale cursor-pointer">
                      <Sparkles className="w-8 h-8 mx-auto mb-3 text-primary" />
                      <h4 className="font-medium mb-2">Hover Scale</h4>
                      <p className="text-sm text-muted-foreground">Hover to see effect</p>
                      <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">hover-scale</code>
                    </Card>

                    <Card className="p-6 text-center cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <Award className="w-8 h-8 mx-auto mb-3 text-secondary" />
                      <h4 className="font-medium mb-2">Combined Effects</h4>
                      <p className="text-sm text-muted-foreground">Scale + Shadow</p>
                      <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">hover:scale-105</code>
                    </Card>

                    <Card className="p-6 text-center cursor-pointer transition-all duration-200 hover:bg-accent/10">
                      <Heart className="w-8 h-8 mx-auto mb-3 text-destructive transition-colors hover:text-destructive/70" />
                      <h4 className="font-medium mb-2">Color Transition</h4>
                      <p className="text-sm text-muted-foreground">Hover for color change</p>
                      <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">transition-colors</code>
                    </Card>
                  </div>
                </ComponentShowcase>

                {/* Button Animations */}
                <ComponentShowcase title="Button Animations">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Button className="w-full transition-transform hover:scale-105">
                        <Zap className="w-4 h-4 mr-2" />
                        Scale Hover
                      </Button>
                      <code className="text-xs bg-muted px-2 py-1 rounded">hover:scale-105</code>
                    </div>

                    <div className="space-y-2">
                      <Button variant="secondary" className="w-full group">
                        <ArrowRight className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
                        Slide Icon
                      </Button>
                      <code className="text-xs bg-muted px-2 py-1 rounded">group-hover:translate-x-1</code>
                    </div>

                    <div className="space-y-2">
                      <Button variant="outline" className="w-full relative overflow-hidden group">
                        <span className="relative z-10">Sweep Effect</span>
                        <div className="absolute inset-0 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                        <Star className="w-4 h-4 ml-2 relative z-10" />
                      </Button>
                      <code className="text-xs bg-muted px-2 py-1 rounded">sweep animation</code>
                    </div>

                    <div className="space-y-2">
                      <Button variant="ghost" className="w-full story-link">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Underline
                      </Button>
                      <code className="text-xs bg-muted px-2 py-1 rounded">story-link</code>
                    </div>
                  </div>
                </ComponentShowcase>

                {/* Loading Animations */}
                <ComponentShowcase title="Loading Animations">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-4 text-center">
                      <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-primary" />
                      <h4 className="font-medium mb-2">Spinning Loader</h4>
                      <code className="text-xs bg-muted px-2 py-1 rounded">animate-spin</code>
                    </Card>

                    <Card className="p-4 text-center">
                      <div className="flex justify-center mb-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                      <h4 className="font-medium mb-2">Dot Loading</h4>
                      <code className="text-xs bg-muted px-2 py-1 rounded">staggered bounce</code>
                    </Card>

                    <Card className="p-4 text-center">
                      <div className="w-8 h-8 mx-auto mb-3 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
                      <h4 className="font-medium mb-2">Spinner</h4>
                      <code className="text-xs bg-muted px-2 py-1 rounded">border spinner</code>
                    </Card>

                    <Card className="p-4 text-center">
                      <div className="w-8 h-1 mx-auto mb-3 bg-muted rounded overflow-hidden">
                        <div className="w-full h-full bg-primary rounded animate-pulse"></div>
                      </div>
                      <h4 className="font-medium mb-2">Progress Bar</h4>
                      <code className="text-xs bg-muted px-2 py-1 rounded">animate-pulse</code>
                    </Card>
                  </div>
                </ComponentShowcase>

                {/* Icon Categories */}
                <ComponentShowcase title="Icon Categories">
                  <div className="space-y-6">
                    
                    {/* Navigation Icons */}
                    <div>
                      <h4 className="font-medium mb-4">Navigation Icons</h4>
                      <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4">
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Home className="w-6 h-6 mb-2" />
                          <span className="text-xs">Home</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Search className="w-6 h-6 mb-2" />
                          <span className="text-xs">Search</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Menu className="w-6 h-6 mb-2" />
                          <span className="text-xs">Menu</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <ArrowLeft className="w-6 h-6 mb-2" />
                          <span className="text-xs">Back</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <ArrowRight className="w-6 h-6 mb-2" />
                          <span className="text-xs">Forward</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <ChevronDown className="w-6 h-6 mb-2" />
                          <span className="text-xs">Expand</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <ChevronRight className="w-6 h-6 mb-2" />
                          <span className="text-xs">Next</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <ExternalLink className="w-6 h-6 mb-2" />
                          <span className="text-xs">External</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Icons */}
                    <div>
                      <h4 className="font-medium mb-4">Action Icons</h4>
                      <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4">
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Plus className="w-6 h-6 mb-2" />
                          <span className="text-xs">Add</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Edit className="w-6 h-6 mb-2" />
                          <span className="text-xs">Edit</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Trash2 className="w-6 h-6 mb-2" />
                          <span className="text-xs">Delete</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Share className="w-6 h-6 mb-2" />
                          <span className="text-xs">Share</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Copy className="w-6 h-6 mb-2" />
                          <span className="text-xs">Copy</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Download className="w-6 h-6 mb-2" />
                          <span className="text-xs">Download</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Upload className="w-6 h-6 mb-2" />
                          <span className="text-xs">Upload</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Settings className="w-6 h-6 mb-2" />
                          <span className="text-xs">Settings</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Icons */}
                    <div>
                      <h4 className="font-medium mb-4">Status Icons</h4>
                      <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4">
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <CheckCircle className="w-6 h-6 mb-2 text-success" />
                          <span className="text-xs">Success</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <AlertCircle className="w-6 h-6 mb-2 text-warning" />
                          <span className="text-xs">Warning</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <X className="w-6 h-6 mb-2 text-destructive" />
                          <span className="text-xs">Error</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Info className="w-6 h-6 mb-2 text-accent" />
                          <span className="text-xs">Info</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <HelpCircle className="w-6 h-6 mb-2" />
                          <span className="text-xs">Help</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Bell className="w-6 h-6 mb-2" />
                          <span className="text-xs">Notification</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Shield className="w-6 h-6 mb-2" />
                          <span className="text-xs">Security</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Lock className="w-6 h-6 mb-2" />
                          <span className="text-xs">Locked</span>
                        </div>
                      </div>
                    </div>

                    {/* Innovation & Business Icons */}
                    <div>
                      <h4 className="font-medium mb-4">Innovation & Business Icons</h4>
                      <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4">
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Sparkles className="w-6 h-6 mb-2 text-primary" />
                          <span className="text-xs">Innovation</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Target className="w-6 h-6 mb-2 text-accent" />
                          <span className="text-xs">Target</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Award className="w-6 h-6 mb-2 text-warning" />
                          <span className="text-xs">Award</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Star className="w-6 h-6 mb-2 text-warning" />
                          <span className="text-xs">Star</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Users className="w-6 h-6 mb-2" />
                          <span className="text-xs">Team</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Zap className="w-6 h-6 mb-2 text-primary" />
                          <span className="text-xs">Energy</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Clock className="w-6 h-6 mb-2" />
                          <span className="text-xs">Time</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Calendar className="w-6 h-6 mb-2" />
                          <span className="text-xs">Calendar</span>
                        </div>
                      </div>
                    </div>

                    {/* Communication Icons */}
                    <div>
                      <h4 className="font-medium mb-4">Communication Icons</h4>
                      <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4">
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Mail className="w-6 h-6 mb-2" />
                          <span className="text-xs">Email</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <MessageCircle className="w-6 h-6 mb-2" />
                          <span className="text-xs">Message</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Phone className="w-6 h-6 mb-2" />
                          <span className="text-xs">Phone</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Send className="w-6 h-6 mb-2" />
                          <span className="text-xs">Send</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <ThumbsUp className="w-6 h-6 mb-2" />
                          <span className="text-xs">Like</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Heart className="w-6 h-6 mb-2 text-destructive" />
                          <span className="text-xs">Love</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Eye className="w-6 h-6 mb-2" />
                          <span className="text-xs">View</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Languages className="w-6 h-6 mb-2" />
                          <span className="text-xs">Language</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </ComponentShowcase>

                {/* Icon Sizes & Variants */}
                <ComponentShowcase title="Icon Sizes & Variants">
                  <div className="space-y-6">
                    
                    {/* Size Variants */}
                    <div>
                      <h4 className="font-medium mb-4">Size Variants</h4>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <Sparkles className="w-4 h-4 mx-auto mb-2" />
                          <span className="text-xs">Small (16px)</span>
                        </div>
                        <div className="text-center">
                          <Sparkles className="w-5 h-5 mx-auto mb-2" />
                          <span className="text-xs">Medium (20px)</span>
                        </div>
                        <div className="text-center">
                          <Sparkles className="w-6 h-6 mx-auto mb-2" />
                          <span className="text-xs">Large (24px)</span>
                        </div>
                        <div className="text-center">
                          <Sparkles className="w-8 h-8 mx-auto mb-2" />
                          <span className="text-xs">XL (32px)</span>
                        </div>
                        <div className="text-center">
                          <Sparkles className="w-12 h-12 mx-auto mb-2" />
                          <span className="text-xs">XXL (48px)</span>
                        </div>
                      </div>
                    </div>

                    {/* Color Variants */}
                    <div>
                      <h4 className="font-medium mb-4">Color Variants</h4>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <Award className="w-6 h-6 mx-auto mb-2" />
                          <span className="text-xs">Default</span>
                        </div>
                        <div className="text-center">
                          <Award className="w-6 h-6 mx-auto mb-2 text-primary" />
                          <span className="text-xs">Primary</span>
                        </div>
                        <div className="text-center">
                          <Award className="w-6 h-6 mx-auto mb-2 text-secondary" />
                          <span className="text-xs">Secondary</span>
                        </div>
                        <div className="text-center">
                          <Award className="w-6 h-6 mx-auto mb-2 text-success" />
                          <span className="text-xs">Success</span>
                        </div>
                        <div className="text-center">
                          <Award className="w-6 h-6 mx-auto mb-2 text-warning" />
                          <span className="text-xs">Warning</span>
                        </div>
                        <div className="text-center">
                          <Award className="w-6 h-6 mx-auto mb-2 text-destructive" />
                          <span className="text-xs">Destructive</span>
                        </div>
                        <div className="text-center">
                          <Award className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                          <span className="text-xs">Muted</span>
                        </div>
                      </div>
                    </div>

                    {/* Icon with Backgrounds */}
                    <div>
                      <h4 className="font-medium mb-4">Icons with Backgrounds</h4>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Star className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-xs">Circle Soft</span>
                        </div>
                        <div className="text-center">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                            <Star className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-xs">Circle Solid</span>
                        </div>
                        <div className="text-center">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <Star className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-xs">Square Soft</span>
                        </div>
                        <div className="text-center">
                          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mx-auto mb-2">
                            <Star className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-xs">Square Solid</span>
                        </div>
                        <div className="text-center">
                          <div className="w-10 h-10 border-2 border-primary rounded-full flex items-center justify-center mx-auto mb-2">
                            <Star className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-xs">Outlined</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </ComponentShowcase>

                {/* Advanced Animations */}
                <ComponentShowcase title="Advanced Animations">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    <Card className="p-6 text-center">
                      <h4 className="font-medium mb-4">Accordion Animation</h4>
                      <div className="space-y-2">
                        <div className="p-3 bg-muted/20 rounded">Header 1</div>
                        <div className="overflow-hidden">
                          <div className="p-3 bg-muted/10 rounded animate-accordion-down">
                            This content slides down smoothly with opacity fade
                          </div>
                        </div>
                      </div>
                      <code className="text-xs bg-muted px-2 py-1 rounded mt-3 inline-block">animate-accordion-down</code>
                    </Card>

                    <Card className="p-6 text-center">
                      <h4 className="font-medium mb-4">Slide Animation</h4>
                      <div className="relative h-16 bg-muted/20 rounded overflow-hidden">
                        <div className="absolute inset-0 bg-primary/80 rounded animate-slide-in-right flex items-center justify-center text-white">
                          Slide In
                        </div>
                      </div>
                      <code className="text-xs bg-muted px-2 py-1 rounded mt-3 inline-block">animate-slide-in-right</code>
                    </Card>

                    <Card className="p-6 text-center">
                      <h4 className="font-medium mb-4">Floating Animation</h4>
                      <div className="flex justify-center">
                        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center animate-bounce">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <code className="text-xs bg-muted px-2 py-1 rounded mt-3 inline-block">animate-bounce</code>
                    </Card>

                  </div>
                </ComponentShowcase>

              </div>
            </div>
          </TabsContent>

          {/* Enhanced Brand Identity Tab */}
          <TabsContent value="branding" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Brand Identity System</h2>
              
              <div className="space-y-8">

                {/* Brand Overview */}
                <ComponentShowcase title="Brand Overview">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="p-8 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 border border-primary/20">
                      <div className="mb-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                            <Sparkles className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-primary">Ruwād</h3>
                            <p className="text-muted-foreground">Innovation Platform</p>
                          </div>
                        </div>
                        <p className="text-lg leading-relaxed">A comprehensive innovation ecosystem designed to empower creators, entrepreneurs, and visionaries across the region.</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <span className="text-sm">Founded on innovation principles</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-accent"></div>
                          <span className="text-sm">Community-driven development</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-secondary"></div>
                          <span className="text-sm">Technology-enabled solutions</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-8">
                      <h4 className="font-semibold text-lg mb-6">Brand Values</h4>
                      <div className="space-y-6">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h5 className="font-semibold mb-1">Innovation First</h5>
                            <p className="text-sm text-muted-foreground">Pushing boundaries and exploring new possibilities</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Users className="w-6 h-6 text-accent" />
                          </div>
                          <div>
                            <h5 className="font-semibold mb-1">Collaborative Spirit</h5>
                            <p className="text-sm text-muted-foreground">Building together for greater impact</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Target className="w-6 h-6 text-secondary" />
                          </div>
                          <div>
                            <h5 className="font-semibold mb-1">Purpose Driven</h5>
                            <p className="text-sm text-muted-foreground">Creating meaningful solutions for real challenges</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </ComponentShowcase>

                {/* Logo System */}
                <ComponentShowcase title="Logo System">
                  <div className="space-y-8">
                    
                    {/* Primary Logos */}
                    <div>
                      <h4 className="font-semibold text-lg mb-6">Primary Logo Variants</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="p-8 text-center bg-white border-2">
                          <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                              <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <div className="ml-4 text-left">
                              <h3 className="text-2xl font-bold text-primary">Ruwād</h3>
                              <p className="text-sm text-muted-foreground">Innovation Platform</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">Light Background</Badge>
                        </Card>

                        <Card className="p-8 text-center bg-slate-900 border-2 border-slate-700">
                          <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-sm">
                              <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <div className="ml-4 text-left">
                              <h3 className="text-2xl font-bold text-white">Ruwād</h3>
                              <p className="text-sm text-white/70">Innovation Platform</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs text-white bg-white/20">Dark Background</Badge>
                        </Card>

                        <Card className="p-8 text-center bg-gradient-to-br from-primary via-accent to-primary border-2 border-primary/30">
                          <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                              <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <div className="ml-4 text-left">
                              <h3 className="text-2xl font-bold text-white drop-shadow-sm">Ruwād</h3>
                              <p className="text-sm text-white/90">Innovation Platform</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs text-white bg-white/20">Gradient Background</Badge>
                        </Card>
                      </div>
                    </div>

                    {/* Icon Variations */}
                    <div>
                      <h4 className="font-semibold text-lg mb-6">Icon Variations</h4>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                        <Card className="p-6 text-center group hover:scale-105 transition-transform">
                          <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                            <Sparkles className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-xs text-muted-foreground font-medium">Standard</p>
                        </Card>

                        <Card className="p-6 text-center group hover:scale-105 transition-transform">
                          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                            <Sparkles className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-xs text-muted-foreground font-medium">Primary</p>
                        </Card>

                        <Card className="p-6 text-center group hover:scale-105 transition-transform">
                          <div className="w-16 h-16 bg-white border-2 border-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                            <Sparkles className="w-8 h-8 text-primary" />
                          </div>
                          <p className="text-xs text-muted-foreground font-medium">Outlined</p>
                        </Card>

                        <Card className="p-6 text-center group hover:scale-105 transition-transform">
                          <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                            <Sparkles className="w-8 h-8 text-primary" />
                          </div>
                          <p className="text-xs text-muted-foreground font-medium">Soft</p>
                        </Card>

                        <Card className="p-6 text-center group hover:scale-105 transition-transform">
                          <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                            <Sparkles className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-xs text-muted-foreground font-medium">Circle</p>
                        </Card>

                        <Card className="p-6 text-center group hover:scale-105 transition-transform">
                          <div className="w-16 h-16 bg-muted border border-border rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                            <Sparkles className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <p className="text-xs text-muted-foreground font-medium">Monochrome</p>
                        </Card>
                      </div>
                    </div>

                    {/* Size Guidelines */}
                    <div>
                      <h4 className="font-semibold text-lg mb-6">Size Guidelines</h4>
                      <Card className="p-8">
                        <div className="flex flex-wrap items-end gap-12 justify-center">
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-4">
                              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center shadow-md">
                                <Sparkles className="w-4 h-4 text-white" />
                              </div>
                              <span className="ml-2 text-lg font-bold">Ruwād</span>
                            </div>
                            <Badge variant="outline" className="text-xs">32px - Compact</Badge>
                          </div>

                          <div className="text-center">
                            <div className="flex items-center justify-center mb-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center shadow-md">
                                <Sparkles className="w-6 h-6 text-white" />
                              </div>
                              <span className="ml-3 text-xl font-bold">Ruwād</span>
                            </div>
                            <Badge variant="outline" className="text-xs">48px - Standard</Badge>
                          </div>

                          <div className="text-center">
                            <div className="flex items-center justify-center mb-4">
                              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                                <Sparkles className="w-8 h-8 text-white" />
                              </div>
                              <span className="ml-4 text-2xl font-bold">Ruwād</span>
                            </div>
                            <Badge variant="outline" className="text-xs">64px - Large</Badge>
                          </div>

                          <div className="text-center">
                            <div className="flex items-center justify-center mb-4">
                              <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-3xl flex items-center justify-center shadow-lg">
                                <Sparkles className="w-10 h-10 text-white" />
                              </div>
                              <span className="ml-4 text-3xl font-bold">Ruwād</span>
                            </div>
                            <Badge variant="outline" className="text-xs">80px - Hero</Badge>
                          </div>
                        </div>
                      </Card>
                    </div>

                  </div>
                </ComponentShowcase>

                {/* Brand Colors & Typography */}
                <ComponentShowcase title="Brand Color Palette">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-4">Primary Colors</h4>
                        <div className="grid grid-cols-1 gap-4">
                          <Card className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-xl bg-primary shadow-lg border-2 border-white"></div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h5 className="font-semibold">Primary</h5>
                                  <Button variant="ghost" size="sm" className="h-6 px-2">
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                </div>
                                <p className="text-sm font-mono text-muted-foreground">hsl(263, 70%, 50%)</p>
                                <p className="text-xs text-muted-foreground">Main brand color for primary actions</p>
                              </div>
                            </div>
                          </Card>
                          
                          <Card className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-xl bg-accent shadow-lg border-2 border-white"></div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h5 className="font-semibold">Accent</h5>
                                  <Button variant="ghost" size="sm" className="h-6 px-2">
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                </div>
                                <p className="text-sm font-mono text-muted-foreground">hsl(270, 95%, 75%)</p>
                                <p className="text-xs text-muted-foreground">Secondary highlights and emphasis</p>
                              </div>
                            </div>
                          </Card>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-lg mb-4">Supporting Colors</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <Card className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-secondary shadow-sm"></div>
                              <div className="flex-1 min-w-0">
                                <h6 className="font-medium text-sm">Secondary</h6>
                                <p className="text-xs text-muted-foreground font-mono truncate">hsl(210, 40%, 98%)</p>
                              </div>
                            </div>
                          </Card>
                          
                          <Card className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-success shadow-sm"></div>
                              <div className="flex-1 min-w-0">
                                <h6 className="font-medium text-sm">Success</h6>
                                <p className="text-xs text-muted-foreground font-mono truncate">hsl(142, 76%, 36%)</p>
                              </div>
                            </div>
                          </Card>
                          
                          <Card className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-warning shadow-sm"></div>
                              <div className="flex-1 min-w-0">
                                <h6 className="font-medium text-sm">Warning</h6>
                                <p className="text-xs text-muted-foreground font-mono truncate">hsl(38, 92%, 50%)</p>
                              </div>
                            </div>
                          </Card>
                          
                          <Card className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-destructive shadow-sm"></div>
                              <div className="flex-1 min-w-0">
                                <h6 className="font-medium text-sm">Destructive</h6>
                                <p className="text-xs text-muted-foreground font-mono truncate">hsl(0, 84%, 60%)</p>
                              </div>
                            </div>
                          </Card>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-4">Typography Scale</h4>
                      <Card className="p-6 space-y-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Hero</span>
                            <Badge variant="outline" className="text-xs">48px/52px</Badge>
                          </div>
                          <div className="text-5xl font-bold leading-tight">Innovation Starts Here</div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Heading 1</span>
                            <Badge variant="outline" className="text-xs">36px/40px</Badge>
                          </div>
                          <div className="text-4xl font-bold">Transform Ideas</div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Heading 2</span>
                            <Badge variant="outline" className="text-xs">24px/32px</Badge>
                          </div>
                          <div className="text-2xl font-semibold">Build the Future</div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Body</span>
                            <Badge variant="outline" className="text-xs">16px/24px</Badge>
                          </div>
                          <div className="text-base">Empowering innovators to create breakthrough solutions through collaborative technology and entrepreneurial excellence.</div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Caption</span>
                            <Badge variant="outline" className="text-xs">14px/20px</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">Supporting information and metadata</div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </ComponentShowcase>

                {/* Brand Assets Library */}
                <ComponentShowcase title="Brand Assets & Downloads">
                  <div className="space-y-8">
                    
                    <div>
                      <h4 className="font-semibold text-lg mb-6">Logo Assets</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Sparkles className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-sm">Primary Logo</h5>
                              <p className="text-xs text-muted-foreground">Full color version</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mb-4">
                            <Badge variant="outline" className="text-xs">SVG</Badge>
                            <Badge variant="outline" className="text-xs">PNG</Badge>
                            <Badge variant="secondary" className="text-xs">Vector</Badge>
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            <Download className="w-4 h-4 mr-2" />
                            Download Pack
                          </Button>
                        </Card>

                        <Card className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                              <Sparkles className="w-5 h-5 text-secondary" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-sm">Monochrome Logo</h5>
                              <p className="text-xs text-muted-foreground">Single color versions</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mb-4">
                            <Badge variant="outline" className="text-xs">SVG</Badge>
                            <Badge variant="outline" className="text-xs">PNG</Badge>
                            <Badge variant="secondary" className="text-xs">B&W</Badge>
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            <Download className="w-4 h-4 mr-2" />
                            Download Pack
                          </Button>
                        </Card>

                        <Card className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-sm">Icon Set</h5>
                              <p className="text-xs text-muted-foreground">Complete icon library</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mb-4">
                            <Badge variant="outline" className="text-xs">SVG</Badge>
                            <Badge variant="outline" className="text-xs">AI</Badge>
                            <Badge variant="secondary" className="text-xs">120 icons</Badge>
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            <Download className="w-4 h-4 mr-2" />
                            Download Pack
                          </Button>
                        </Card>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-6">Brand Templates</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-innovation/10 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-innovation" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-sm">Presentation Template</h5>
                              <p className="text-xs text-muted-foreground">Professional slide deck</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mb-4">
                            <Badge variant="outline" className="text-xs">PowerPoint</Badge>
                            <Badge variant="outline" className="text-xs">Keynote</Badge>
                            <Badge variant="secondary" className="text-xs">24 slides</Badge>
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </Card>

                        <Card className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-success" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-sm">Brand Guidelines</h5>
                              <p className="text-xs text-muted-foreground">Complete brand manual</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mb-4">
                            <Badge variant="outline" className="text-xs">PDF</Badge>
                            <Badge variant="outline" className="text-xs">InDesign</Badge>
                            <Badge variant="secondary" className="text-xs">32 pages</Badge>
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </Card>
                      </div>
                    </div>

                  </div>
                </ComponentShowcase>

                {/* Brand Voice & Tone */}
                <ComponentShowcase title="Brand Voice & Tone">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <h4 className="font-semibold">Inspiring</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Motivational and uplifting, encouraging innovation and creativity</p>
                      <div className="space-y-2">
                        <p className="text-sm italic">"Transform your boldest ideas into reality"</p>
                        <p className="text-sm italic">"Every great innovation starts with a single spark"</p>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                          <Shield className="w-5 h-5 text-secondary" />
                        </div>
                        <h4 className="font-semibold">Professional</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Credible and trustworthy, building confidence in our platform</p>
                      <div className="space-y-2">
                        <p className="text-sm italic">"Proven methodologies for sustainable innovation"</p>
                        <p className="text-sm italic">"Expert-guided innovation journey"</p>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-accent" />
                        </div>
                        <h4 className="font-semibold">Collaborative</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Emphasizing community, teamwork, and shared success</p>
                      <div className="space-y-2">
                        <p className="text-sm italic">"Together, we shape the future"</p>
                        <p className="text-sm italic">"Innovation thrives in collaboration"</p>
                      </div>
                    </Card>

                  </div>
                </ComponentShowcase>

                {/* Brand Applications */}
                <ComponentShowcase title="Brand Applications">
                  <div className="space-y-6">
                    
                    {/* Email Signatures */}
                    <div>
                      <h4 className="font-medium mb-4">Email Signature</h4>
                      <Card className="p-6 bg-muted/20">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h5 className="font-semibold">Ahmed Al-Rashid</h5>
                            <p className="text-sm text-muted-foreground">Innovation Manager</p>
                          </div>
                        </div>
                        <div className="border-l-4 border-l-primary pl-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-primary">Ruwād</span>
                            <span className="text-sm text-muted-foreground">Innovation Platform</span>
                          </div>
                          <p className="text-xs text-muted-foreground italic">Where Ideas Become Reality</p>
                          <div className="flex items-center gap-4 mt-2 text-xs">
                            <span>📧 ahmed@ruwad.com</span>
                            <span>🌐 www.ruwad.com</span>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Social Media Headers */}
                    <div>
                      <h4 className="font-medium mb-4">Social Media Applications</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <Card className="overflow-hidden">
                          <div className="h-24 bg-gradient-to-r from-primary via-accent to-secondary p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Sparkles className="w-6 h-6 text-white" />
                              </div>
                              <div className="text-white">
                                <h5 className="font-bold text-lg">Ruwād</h5>
                                <p className="text-sm opacity-90">Innovation Platform</p>
                              </div>
                            </div>
                            <Button size="sm" variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                              Follow
                            </Button>
                          </div>
                          <div className="p-4">
                            <p className="text-sm text-muted-foreground">LinkedIn Cover Design</p>
                          </div>
                        </Card>

                        <Card className="overflow-hidden">
                          <div className="h-24 bg-gradient-to-br from-primary to-accent p-4 flex items-center">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-primary" />
                              </div>
                              <div className="text-white">
                                <h5 className="font-bold text-lg">@RuwadPlatform</h5>
                                <p className="text-sm opacity-90">Innovate. Create. Lead.</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <p className="text-sm text-muted-foreground">Twitter/X Header Design</p>
                          </div>
                        </Card>

                      </div>
                    </div>

                    {/* Business Cards */}
                    <div>
                      <h4 className="font-medium mb-4">Business Card Design</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Front */}
                        <Card className="p-6 bg-gradient-to-br from-primary to-accent text-white">
                          <div className="flex items-center justify-between mb-6">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                              <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-right">
                              <h4 className="font-bold">Ruwād</h4>
                              <p className="text-xs opacity-90">Innovation Platform</p>
                            </div>
                          </div>
                          <div>
                            <h5 className="font-semibold text-lg">Sarah Al-Zahra</h5>
                            <p className="text-sm opacity-90">Senior Innovation Strategist</p>
                          </div>
                          <p className="text-xs mt-4 opacity-75">Front Side</p>
                        </Card>

                        {/* Back */}
                        <Card className="p-6 bg-white border-2 border-primary">
                          <div className="text-center mb-4">
                            <p className="text-sm font-medium text-primary italic">"Where Ideas Become Reality"</p>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-primary" />
                              <span>sarah@ruwad.com</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-primary" />
                              <span>+966 50 123 4567</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <ExternalLink className="w-4 h-4 text-primary" />
                              <span>www.ruwad.com</span>
                            </div>
                          </div>
                          <p className="text-xs mt-4 text-muted-foreground">Back Side</p>
                        </Card>

                      </div>
                    </div>

                  </div>
                </ComponentShowcase>

                {/* Brand Guidelines */}
                <ComponentShowcase title="Brand Usage Guidelines">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Do's */}
                    <Card className="p-6 border-l-4 border-l-success">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="w-5 h-5 text-success" />
                        <h4 className="font-semibold text-success">Do's</h4>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-success rounded-full mt-2"></div>
                          <span>Use the logo on clean, uncluttered backgrounds</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-success rounded-full mt-2"></div>
                          <span>Maintain minimum clear space around the logo</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-success rounded-full mt-2"></div>
                          <span>Use approved color variations only</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-success rounded-full mt-2"></div>
                          <span>Scale proportionally to maintain integrity</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-success rounded-full mt-2"></div>
                          <span>Use consistent typography with brand voice</span>
                        </li>
                      </ul>
                    </Card>

                    {/* Don'ts */}
                    <Card className="p-6 border-l-4 border-l-destructive">
                      <div className="flex items-center gap-2 mb-4">
                        <X className="w-5 h-5 text-destructive" />
                        <h4 className="font-semibold text-destructive">Don'ts</h4>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-2"></div>
                          <span>Don't stretch or distort the logo</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-2"></div>
                          <span>Don't use unauthorized color combinations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-2"></div>
                          <span>Don't place logo on busy or competing backgrounds</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-2"></div>
                          <span>Don't recreate or modify the logo design</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-2"></div>
                          <span>Don't use outdated versions of brand elements</span>
                        </li>
                      </ul>
                    </Card>

                  </div>
                </ComponentShowcase>

              </div>
            </div>
          </TabsContent>

          {/* CSS vs Tailwind Comparison Tab */}
          <TabsContent value="css-vs-tailwind" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">CSS vs Tailwind Comparison</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Explore how the same designs can be achieved using traditional CSS and Tailwind CSS, with our design tokens.
              </p>

              <div className="space-y-8">

                {/* Button Styling Comparison */}
                <ComponentShowcase title="Button Styling Approaches">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* CSS Approach */}
                    <Card className="p-6">
                      <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Traditional CSS
                      </h4>
                      
                      <div className="space-y-4">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors">
                          CSS Styled Button
                        </Button>
                        
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="text-sm font-medium mb-2">CSS Code:</p>
                          <pre className="text-xs text-muted-foreground overflow-x-auto">
{`.primary-button {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.primary-button:hover {
  background-color: hsl(var(--primary) / 0.9);
}`}
                          </pre>
                        </div>
                      </div>
                    </Card>

                    {/* Tailwind Approach */}
                    <Card className="p-6">
                      <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-accent" />
                        Tailwind CSS
                      </h4>
                      
                      <div className="space-y-4">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors">
                          Tailwind Styled Button
                        </Button>
                        
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="text-sm font-medium mb-2">Tailwind Classes:</p>
                          <pre className="text-xs text-muted-foreground overflow-x-auto">
{`<button class="
  bg-primary 
  hover:bg-primary/90 
  text-primary-foreground 
  px-6 py-2 
  rounded-lg 
  font-medium 
  transition-colors
">
  Tailwind Styled Button
</button>`}
                          </pre>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Pros and Cons */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    <Card className="p-6 border-l-4 border-l-primary">
                      <h5 className="font-semibold mb-3 text-primary">CSS Advantages</h5>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span>Better separation of concerns</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span>Reusable component classes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span>Complex animations easier</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span>Traditional developer familiarity</span>
                        </li>
                      </ul>
                    </Card>

                    <Card className="p-6 border-l-4 border-l-accent">
                      <h5 className="font-semibold mb-3 text-accent">Tailwind Advantages</h5>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span>Faster development speed</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span>Consistent design system</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span>Smaller bundle size (purged)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span>No CSS naming conflicts</span>
                        </li>
                      </ul>
                    </Card>
                  </div>
                </ComponentShowcase>

                {/* Design Tokens Integration */}
                <ComponentShowcase title="Design Tokens Integration">
                  <div className="space-y-8">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <Card className="p-6">
                        <h4 className="font-semibold text-lg mb-4">CSS Custom Properties</h4>
                        <div className="space-y-4">
                          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                            <p className="text-primary font-medium">Using Design Tokens</p>
                          </div>
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <pre className="text-xs text-muted-foreground overflow-x-auto">
{`:root {
  --primary: 263 70% 50%;
  --accent: 270 95% 75%;
  --background: 0 0% 100%;
}

.token-box {
  background: hsl(var(--primary) / 0.1);
  border: 1px solid hsl(var(--primary) / 0.2);
  color: hsl(var(--primary));
}`}
                            </pre>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-6">
                        <h4 className="font-semibold text-lg mb-4">Tailwind Configuration</h4>
                        <div className="space-y-4">
                          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                            <p className="text-primary font-medium">Using Design Tokens</p>
                          </div>
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <pre className="text-xs text-muted-foreground overflow-x-auto">
{`// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
        accent: 'hsl(var(--accent))',
        background: 'hsl(var(--background))'
      }
    }
  }
}

// Usage: bg-primary/10 border-primary/20`}
                            </pre>
                          </div>
                        </div>
                      </Card>
                    </div>

                    <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/5">
                      <h4 className="font-semibold text-lg mb-4">Best Practice: Hybrid Approach</h4>
                      <p className="text-muted-foreground mb-4">
                        Our design system uses both approaches strategically for optimal developer experience and maintainability.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-background/50 rounded-lg">
                          <Palette className="w-8 h-8 text-primary mx-auto mb-2" />
                          <h5 className="font-medium mb-1">Design Tokens</h5>
                          <p className="text-xs text-muted-foreground">CSS variables for consistency</p>
                        </div>
                        <div className="text-center p-4 bg-background/50 rounded-lg">
                          <Layout className="w-8 h-8 text-accent mx-auto mb-2" />
                          <h5 className="font-medium mb-1">Utility Classes</h5>
                          <p className="text-xs text-muted-foreground">Tailwind for rapid development</p>
                        </div>
                        <div className="text-center p-4 bg-background/50 rounded-lg">
                          <Target className="w-8 h-8 text-secondary mx-auto mb-2" />
                          <h5 className="font-medium mb-1">Component CSS</h5>
                          <p className="text-xs text-muted-foreground">Complex components in CSS</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </ComponentShowcase>

                {/* Performance Comparison */}
                <ComponentShowcase title="Performance & Bundle Size">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-primary" />
                      </div>
                      <h4 className="font-semibold mb-2">Traditional CSS</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Bundle: 45-120KB</p>
                        <p>Runtime: Fast</p>
                        <p>Dev Speed: Medium</p>
                      </div>
                      <Progress value={75} className="mt-4" />
                    </Card>

                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-8 h-8 text-accent" />
                      </div>
                      <h4 className="font-semibold mb-2">Tailwind CSS</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Bundle: 8-25KB (purged)</p>
                        <p>Runtime: Fast</p>
                        <p>Dev Speed: Very Fast</p>
                      </div>
                      <Progress value={95} className="mt-4" />
                    </Card>

                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Target className="w-8 h-8 text-success" />
                      </div>
                      <h4 className="font-semibold mb-2">Hybrid Approach</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Bundle: 15-35KB</p>
                        <p>Runtime: Fast</p>
                        <p>Dev Speed: Fast</p>
                      </div>
                      <Progress value={90} className="mt-4" />
                    </Card>
                  </div>
                </ComponentShowcase>

              </div>
            </div>
          </TabsContent>

          {/* Enhanced Components Tab */}
          <TabsContent value="enhanced" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">✨ Enhanced Components</h2>
              <p className="text-muted-foreground mb-8">
                Professional-grade components designed for enterprise innovation platforms.
              </p>

              <div className="space-y-8">
                {/* Enhanced Breadcrumb */}
                <ComponentShowcase title="Enhanced Breadcrumb Navigation">
                  <div className="space-y-4">
                    <EnhancedBreadcrumb 
                      items={[
                        { label: 'Projects', href: '/projects' },
                        { label: 'Innovation Lab', href: '/projects/innovation' },
                        { label: 'Current Challenge' }
                      ]}
                    />
                    
                    <EnhancedBreadcrumb 
                      items={[
                        { label: 'Admin', href: '/admin', icon: Settings },
                        { label: 'User Management', href: '/admin/users', icon: Users },
                        { label: 'Role Configuration' }
                      ]}
                      showHome={false}
                    />
                  </div>
                </ComponentShowcase>

                {/* Status Indicators */}
                <ComponentShowcase title="Status Indicators & Progress">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                      <StatusIndicator status="success" label="Completed" />
                      <StatusIndicator status="pending" label="In Review" />
                      <StatusIndicator status="warning" label="Attention Required" />
                      <StatusIndicator status="error" label="Failed" />
                      <StatusIndicator status="loading" label="Processing" />
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <StatusIndicator status="success" size="sm" />
                      <StatusIndicator status="warning" size="lg" showIcon={false} />
                    </div>
                  </div>
                </ComponentShowcase>

                {/* Notification Center */}
                <ComponentShowcase title="Notification Center">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Real-time notification system with status tracking and actions.
                    </p>
                    <NotificationCenter
                      notifications={notifications}
                      onMarkAsRead={(id) => {
                        setNotifications(prev => 
                          prev.map(n => n.id === id ? { ...n, read: true } : n)
                        );
                      }}
                      onMarkAllAsRead={() => {
                        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                      }}
                      onRemove={(id) => {
                        setNotifications(prev => prev.filter(n => n.id !== id));
                      }}
                    />
                  </div>
                </ComponentShowcase>

                {/* Advanced Data Table */}
                <ComponentShowcase title="Advanced Data Table">
                  <AdvancedDataTable
                    data={sampleTableData}
                    columns={[
                      { key: 'name', label: 'Challenge Name', sortable: true },
                      { 
                        key: 'status', 
                        label: 'Status', 
                        render: (value) => (
                          <StatusIndicator 
                            status={value === 'Active' ? 'success' : value === 'Draft' ? 'pending' : 'warning'} 
                            label={value}
                            size="sm"
                          />
                        )
                      },
                      { key: 'participants', label: 'Participants', sortable: true },
                      { key: 'deadline', label: 'Deadline' }
                    ]}
                    actions={[
                      { label: 'Edit', onClick: () => toast({ title: 'Edit clicked' }) },
                      { label: 'Delete', onClick: () => toast({ title: 'Delete clicked' }), variant: 'destructive' }
                    ]}
                    selectable
                    onSelectionChange={(selected) => console.log('Selected:', selected)}
                  />
                </ComponentShowcase>

                {/* Media Gallery */}
                <ComponentShowcase title="Media Gallery">
                  <MediaGallery
                    items={sampleMedia}
                    columns={3}
                    onDownload={(item) => toast({ title: `Downloading ${item.title}` })}
                    onShare={(item) => toast({ title: `Sharing ${item.title}` })}
                  />
                </ComponentShowcase>

                {/* Animation Examples */}
                <ComponentShowcase title="Professional Animations">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 hover-lift">
                      <h4 className="font-medium mb-2">Hover Lift Effect</h4>
                      <p className="text-sm text-muted-foreground">Subtle elevation on hover</p>
                    </Card>
                    
                    <Card className="p-4 animate-scale-in">
                      <h4 className="font-medium mb-2">Scale In Animation</h4>
                      <p className="text-sm text-muted-foreground">Smooth entry animation</p>
                    </Card>
                    
                    <Card className="p-4 animate-fade-in-up">
                      <h4 className="font-medium mb-2">Fade In Up</h4>
                      <p className="text-sm text-muted-foreground">Elegant slide and fade</p>
                    </Card>
                  </div>
                </ComponentShowcase>

                {/* File Uploader */}
                <ComponentShowcase title="Advanced File Uploader">
                  <FileUploader
                    onFilesSelected={(files) => toast({ title: `${files.length} files selected` })}
                    acceptedTypes={['image/*', '.pdf', '.doc', '.docx']}
                    maxFiles={5}
                    maxSize={10}
                  />
                </ComponentShowcase>

                {/* Command Palette */}
                <ComponentShowcase title="Command Palette">
                  <div className="space-y-4">
                    <Button onClick={openCommand} variant="outline" className="w-full">
                      Open Command Palette (⌘K)
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Fast navigation and actions. Try pressing ⌘K (Cmd+K) or Ctrl+K anywhere in the app.
                    </p>
                  </div>
                </ComponentShowcase>

                {/* Feedback Components */}
                <ComponentShowcase title="Feedback & Rating System">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Star Rating</h4>
                      <StarRating 
                        rating={4} 
                        onChange={(rating) => toast({ title: `Rated ${rating} stars` })}
                        showLabel
                      />
                    </div>
                    
                    <FeedbackForm
                      onSubmit={(feedback) => toast({ title: 'Feedback submitted!', description: `Rating: ${feedback.rating}, Comment: ${feedback.comment}` })}
                      title="Quick Feedback"
                      showRating={false}
                      showLikeDislike
                    />
                  </div>
                </ComponentShowcase>

                {/* Data Visualization */}
                <ComponentShowcase title="Data Visualization & Charts">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SimpleLineChart data={chartData} />
                      <SimpleBarChart data={chartData} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <MetricCard
                        title="Total Users"
                        value="2,847"
                        change={{ value: 12, period: "last month", trend: "up" }}
                        icon={Users}
                        data={[45, 52, 38, 67, 73, 89, 95]}
                      />
                      <MetricCard
                        title="Active Challenges"
                        value="23"
                        change={{ value: 8, period: "last week", trend: "up" }}
                        icon={Target}
                      />
                      <MetricCard
                        title="Success Rate"
                        value="94.2%"
                        change={{ value: 2, period: "last quarter", trend: "up" }}
                        icon={TrendingUp}
                      />
                    </div>
                  </div>
                </ComponentShowcase>

                {/* Advanced Search */}
                <ComponentShowcase title="Advanced Search & Filtering">
                  <AdvancedSearch
                    onSearch={(query) => toast({ title: `Searching for: ${query}` })}
                    onFiltersChange={(filters) => toast({ title: 'Filters updated', description: JSON.stringify(filters) })}
                    onSortChange={(sort) => toast({ title: 'Sort updated', description: sort ? `${sort.field} ${sort.direction}` : 'Cleared' })}
                    filters={searchFilters}
                    sortOptions={[
                      { field: 'title', label: 'Title' },
                      { field: 'created', label: 'Created Date' },
                      { field: 'status', label: 'Status' }
                    ]}
                    placeholder="Search challenges, ideas, events..."
                  />
                </ComponentShowcase>

                {/* Layout Components */}
                <ComponentShowcase title="Advanced Layout Components">
                  <div className="space-y-6">
                    <div className="h-64">
                      <SplitView
                        leftPanel={
                          <Card className="h-full p-4">
                            <h4 className="font-medium mb-2">Left Panel</h4>
                            <p className="text-sm text-muted-foreground">Resizable panel content. Drag the splitter to resize.</p>
                          </Card>
                        }
                        rightPanel={
                          <Card className="h-full p-4">
                            <h4 className="font-medium mb-2">Right Panel</h4>
                            <p className="text-sm text-muted-foreground">This panel adjusts automatically. Try collapsing with the button.</p>
                          </Card>
                        }
                        defaultSplit={30}
                      />
                    </div>
                  </div>
                </ComponentShowcase>

                {/* Calendar Scheduler */}
                <ComponentShowcase title="Calendar & Event Scheduler">
                  <CalendarView
                    events={calendarEvents}
                    onEventClick={(event) => toast({ title: event.title, description: `Event on ${event.startDate.toLocaleDateString()}` })}
                    onDateClick={(date) => toast({ title: 'Date selected', description: date.toLocaleDateString() })}
                    onEventCreate={(date) => toast({ title: 'Create event', description: `New event on ${date.toLocaleDateString()}` })}
                  />
                </ComponentShowcase>
              </div>
            </div>
          </TabsContent>

          {/* Command Palette */}
          <CommandPalette
            isOpen={isCommandOpen}
            onClose={closeCommand}
            actions={commandActions}
            onRecentUpdate={updateRecent}
          />
        </Tabs>
      </div>
    </div>
  );
};

export default DesignSystem;