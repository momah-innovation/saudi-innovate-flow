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
              <Tabs defaultValue="patterns" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="colors">Colors</TabsTrigger>
                  <TabsTrigger value="typography">Typography</TabsTrigger>
                  <TabsTrigger value="components">Components</TabsTrigger>
                  <TabsTrigger value="patterns">Patterns</TabsTrigger>
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