import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, Type, Layout, Target, Zap, Settings
} from 'lucide-react';

import { ColorsSection } from './sections/ColorsSection';
import { TypographySection } from './sections/TypographySection';
import { ComponentsSection } from './sections/ComponentsSection';
import { PatternsSection } from './sections/PatternsSection';
import { TokensSection } from './sections/TokensSection';
import { InteractionsSection } from './sections/InteractionsSection';

export const DesignSystemTabs: React.FC = () => {
  return (
    <Tabs defaultValue="colors" className="w-full">
      <TabsList className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 backdrop-blur-sm border border-primary/20 p-1.5 text-muted-foreground shadow-lg overflow-x-auto">
        <TabsTrigger value="colors" className="flex items-center gap-2 text-sm px-4 py-2 whitespace-nowrap">
          <Palette className="h-4 w-4" />
          Colors & Theming
        </TabsTrigger>
        <TabsTrigger value="typography" className="flex items-center gap-2 text-sm px-4 py-2 whitespace-nowrap">
          <Type className="h-4 w-4" />
          Typography
        </TabsTrigger>
        <TabsTrigger value="components" className="flex items-center gap-2 text-sm px-4 py-2 whitespace-nowrap">
          <Layout className="h-4 w-4" />
          Components
        </TabsTrigger>
        <TabsTrigger value="patterns" className="flex items-center gap-2 text-sm px-4 py-2 whitespace-nowrap">
          <Target className="h-4 w-4" />
          Patterns
        </TabsTrigger>
        <TabsTrigger value="tokens" className="flex items-center gap-2 text-sm px-4 py-2 whitespace-nowrap">
          <Settings className="h-4 w-4" />
          Tokens
        </TabsTrigger>
        <TabsTrigger value="interactions" className="flex items-center gap-2 text-sm px-4 py-2 whitespace-nowrap">
          <Zap className="h-4 w-4" />
          Interactions
        </TabsTrigger>
      </TabsList>

      <TabsContent value="colors" className="space-y-8">
        <ColorsSection />
      </TabsContent>

      <TabsContent value="typography" className="space-y-8">
        <TypographySection />
      </TabsContent>

      <TabsContent value="components" className="space-y-8">
        <ComponentsSection />
      </TabsContent>

      <TabsContent value="patterns" className="space-y-8">
        <PatternsSection />
      </TabsContent>

      <TabsContent value="tokens" className="space-y-8">
        <TokensSection />
      </TabsContent>

      <TabsContent value="interactions" className="space-y-8">
        <InteractionsSection />
      </TabsContent>
    </Tabs>
  );
};