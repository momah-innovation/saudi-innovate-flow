import React from 'react';
import { Separator } from '@/components/ui/separator';
import { ColorToken } from '../components/ColorToken';

export const ColorsSection: React.FC = () => {
  return (
    <div className="space-y-8">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

        <Separator className="my-8" />

        {/* Theme Variants */}
        <h3 className="text-xl font-semibold mb-4">Theme Variants</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 border rounded-lg bg-background">
            <h4 className="font-medium mb-2">Vision 2030 (Default)</h4>
            <div className="space-y-2">
              <div className="h-4 w-full bg-primary rounded"></div>
              <div className="h-4 w-full bg-accent rounded"></div>
              <div className="h-4 w-full bg-secondary rounded"></div>
            </div>
          </div>
          <div className="p-4 border rounded-lg theme-modern">
            <h4 className="font-medium mb-2">Modern</h4>
            <div className="space-y-2">
              <div className="h-4 w-full bg-primary rounded"></div>
              <div className="h-4 w-full bg-accent rounded"></div>
              <div className="h-4 w-full bg-secondary rounded"></div>
            </div>
          </div>
          <div className="p-4 border rounded-lg theme-minimal">
            <h4 className="font-medium mb-2">Minimal</h4>
            <div className="space-y-2">
              <div className="h-4 w-full bg-primary rounded"></div>
              <div className="h-4 w-full bg-accent rounded"></div>
              <div className="h-4 w-full bg-secondary rounded"></div>
            </div>
          </div>
          <div className="p-4 border rounded-lg theme-vibrant">
            <h4 className="font-medium mb-2">Vibrant</h4>
            <div className="space-y-2">
              <div className="h-4 w-full bg-primary rounded"></div>
              <div className="h-4 w-full bg-accent rounded"></div>
              <div className="h-4 w-full bg-secondary rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};