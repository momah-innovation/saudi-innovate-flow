import React from 'react';
import { ThemedPageWrapper } from '@/components/layout/ThemedPageWrapper';
import { useComponentTheme } from '@/hooks/useComponentTheme';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Example of how to use the theming system
export function ChallengesThemed() {
  const headerTheme = useComponentTheme('header');
  const cardTheme = useComponentTheme('challenge-card');
  const buttonTheme = useComponentTheme('button');

  return (
    <ThemedPageWrapper pageType="challenges" className="min-h-screen">
      {/* Header automatically gets challenge theme */}
      <header className={headerTheme.className}>
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Innovation Challenges</h1>
          
          {/* Themed button */}
          <Button 
            {...buttonTheme.getThemedProps({ variant: 'default' })}
            className="mt-4"
          >
            Create Challenge
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Challenge cards automatically get themed styling */}
          <Card className={`${cardTheme.className} challenge-card p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Sustainability Challenge</h3>
              <Badge className="challenge-status">Active</Badge>
            </div>
            <p className="text-muted-foreground mb-4">
              Develop innovative solutions for sustainable energy management
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="themed-button">
                View Details
              </Button>
              <Button size="sm" className="themed-button">
                Join Challenge
              </Button>
            </div>
          </Card>

          {/* More challenge cards... */}
        </div>
      </main>
    </ThemedPageWrapper>
  );
}