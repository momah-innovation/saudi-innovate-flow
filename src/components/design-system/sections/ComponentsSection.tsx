import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ComponentShowcase } from '../components/ComponentShowcase';
import { 
  CheckCircle, AlertCircle, Sparkles, Plus, Menu, Search, 
  Bell, User, Settings, Home, ChevronRight, Filter, Edit, 
  Share, ArrowRight, Play
} from 'lucide-react';

export const ComponentsSection = () => {
  return (
    <div className="space-y-8">
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
    </div>
  );
};