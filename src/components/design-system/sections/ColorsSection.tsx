import React from 'react';
import { Separator } from '@/components/ui/separator';
import { ColorToken } from '../components/ColorToken';

export const ColorsSection = () => {
  return (
    <div className="space-y-8">
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
    </div>
  );
};