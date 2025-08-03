import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ui/theme-provider';
import { ThemeSelector } from '@/components/ui/theme-selector';
import { DesignSystemTabs } from '@/components/design-system/DesignSystemTabs';

const DesignSystem = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Design System</h1>
              <p className="text-muted-foreground mt-1">
                Explore tokens, components, and design patterns
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeSelector />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme({ 
                  colorScheme: theme.colorScheme === 'dark' ? 'light' : 'dark' 
                })}
              >
                {theme.colorScheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <DesignSystemTabs />
      </div>
    </div>
  );
};

export default DesignSystem;