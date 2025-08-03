import React from 'react';
import { Card } from '@/components/ui/card';

interface ComponentShowcaseProps {
  title: string;
  children: React.ReactNode;
  description?: string;
}

export const ComponentShowcase: React.FC<ComponentShowcaseProps> = ({ title, children, description }) => (
  <Card className="p-6">
    <div className="mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </Card>
);