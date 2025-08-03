import React from 'react';
import { 
  CheckCircle, AlertCircle, Sparkles, Calendar, Users, Search,
  Plus, Edit, Trash2, Upload, Download, Bell, Settings, Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ComponentShowcase } from '../components/ComponentShowcase';

export const ComponentsSection: React.FC = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-6">Component Showcase</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Buttons */}
        <ComponentShowcase title="Buttons" description="All button variants and sizes">
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
          <div className="flex flex-wrap gap-3">
            <Button><Plus className="w-4 h-4 mr-2" />Add Item</Button>
            <Button variant="outline"><Edit className="w-4 h-4 mr-2" />Edit</Button>
            <Button variant="destructive"><Trash2 className="w-4 h-4 mr-2" />Delete</Button>
          </div>
        </ComponentShowcase>

        {/* Badges */}
        <ComponentShowcase title="Badges" description="Status and semantic badges">
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge className="badge-success">
              <CheckCircle className="w-3 h-3 mr-1" />
              Success
            </Badge>
            <Badge className="badge-warning">
              <AlertCircle className="w-3 h-3 mr-1" />
              Warning
            </Badge>
            <Badge className="badge-innovation">
              <Sparkles className="w-3 h-3 mr-1" />
              Innovation
            </Badge>
          </div>
        </ComponentShowcase>

        {/* Form Elements */}
        <ComponentShowcase title="Form Elements" description="Input fields and form controls">
          <div className="space-y-3">
            <Input placeholder="Default input" />
            <Input placeholder="Search..." type="search" />
            <Input placeholder="Email" type="email" />
            <Input placeholder="Disabled input" disabled />
          </div>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input placeholder="Input with button" className="flex-1" />
              <Button><Search className="w-4 h-4" /></Button>
            </div>
          </div>
        </ComponentShowcase>

        {/* Status Indicators */}
        <ComponentShowcase title="Status Indicators" description="Visual status communication">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full indicator-online"></div>
              <span>Online Status</span>
              <Badge className="badge-success">Active</Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full indicator-busy"></div>
              <span>Busy Status</span>
              <Badge className="badge-warning">Busy</Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full indicator-away"></div>
              <span>Away Status</span>
              <Badge className="badge-error">Offline</Badge>
            </div>
          </div>
        </ComponentShowcase>

        {/* Progress & Loading */}
        <ComponentShowcase title="Progress & Loading" description="Progress indicators and loading states">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Normal Progress</span>
                <span>65%</span>
              </div>
              <Progress value={65} className="progress-normal" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>High Workload</span>
                <span>85%</span>
              </div>
              <Progress value={85} className="progress-high" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Critical Load</span>
                <span>95%</span>
              </div>
              <Progress value={95} className="progress-critical" />
            </div>
          </div>
        </ComponentShowcase>

        {/* Navigation Elements */}
        <ComponentShowcase title="Navigation" description="Navigation and action elements">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm"><Bell className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm"><Settings className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm"><Mail className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm"><Users className="w-4 h-4" /></Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />Upload
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />Download
              </Button>
            </div>
          </div>
        </ComponentShowcase>

        {/* Interactive States */}
        <ComponentShowcase title="Interactive States" description="Hover and focus effects">
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

        {/* Event Status Examples */}
        <ComponentShowcase title="Event & Activity Status" description="Status examples for events and activities">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 icon-info" />
                <span>Scheduled Event</span>
              </div>
              <Badge className="event-scheduled">Scheduled</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 icon-success" />
                <span>Ongoing Event</span>
              </div>
              <Badge className="event-ongoing">Live</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Completed Event</span>
              </div>
              <Badge className="event-completed">Completed</Badge>
            </div>
          </div>
        </ComponentShowcase>
      </div>
    </div>
  );
};