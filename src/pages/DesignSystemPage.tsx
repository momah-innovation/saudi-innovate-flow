import React from 'react';
import { ThemeShowcase } from '@/components/ThemeShowcase';
import { ThemeProvider } from '@/hooks/useTheme';

export default function DesignSystemPage() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <ThemeShowcase />
      </div>
    </ThemeProvider>
  );
}