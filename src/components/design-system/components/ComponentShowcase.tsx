import React from 'react';
import { Card } from '@/components/ui/card';

interface ComponentShowcaseProps {
  title: string;
  children: React.ReactNode;
}

export const ComponentShowcase = ({ title, children }: ComponentShowcaseProps) => (
  <Card className="p-6">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="space-y-4">
      {children}
    </div>
  </Card>
);