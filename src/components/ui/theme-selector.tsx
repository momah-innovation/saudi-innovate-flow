import React, { useState } from 'react';
import { Check, ChevronDown, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useThemeSystem } from '@/contexts/ThemeContext';
import { ThemeConfig, getThemesByCategory } from '@/config/themes';
import { cn } from '@/lib/utils';

interface ThemeSelectorProps {
  className?: string;
  showPreview?: boolean;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  className,
  showPreview = true 
}) => {
  const { currentTheme, setTheme, availableThemes } = useThemeSystem();
  const [isOpen, setIsOpen] = useState(false);

  const roleThemes = getThemesByCategory('role');
  const functionalThemes = getThemesByCategory('functional');
  const workspaceThemes = getThemesByCategory('workspace');

  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId);
    setIsOpen(false);
  };

  const ThemePreview: React.FC<{ theme: ThemeConfig }> = ({ theme }) => (
    <div className="flex gap-1">
      <div 
        className="w-3 h-3 rounded-full border border-white/20" 
        style={{ backgroundColor: theme.colors.primary }}
      />
      <div 
        className="w-3 h-3 rounded-full border border-white/20" 
        style={{ backgroundColor: theme.colors.accent }}
      />
      <div 
        className="w-3 h-3 rounded-full border border-white/20" 
        style={{ backgroundColor: theme.colors.innovation }}
      />
    </div>
  );

  const ThemeOption: React.FC<{ theme: ThemeConfig }> = ({ theme }) => (
    <button
      onClick={() => handleThemeSelect(theme.id)}
      className={cn(
        "w-full flex items-center justify-between p-3 text-left hover:bg-accent rounded-lg transition-colors",
        currentTheme.id === theme.id && "bg-accent/50"
      )}
    >
      <div className="flex items-center gap-3">
        <ThemePreview theme={theme} />
        <div>
          <p className="font-medium text-sm">{theme.name}</p>
          <p className="text-xs text-muted-foreground">{theme.description}</p>
        </div>
      </div>
      {currentTheme.id === theme.id && (
        <Check className="w-4 h-4 text-primary" />
      )}
    </button>
  );

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
      >
        <div className="flex items-center gap-3">
          <Palette className="w-4 h-4" />
          <span>{currentTheme.name}</span>
          {showPreview && <ThemePreview theme={currentTheme} />}
        </div>
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
          <Card className="p-4 shadow-lg border bg-background">
            <div className="space-y-6">
              {/* Role-Based Themes */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">Role-Based</Badge>
                  <span className="text-sm font-medium text-muted-foreground">User Types</span>
                </div>
                <div className="space-y-1">
                  {roleThemes.map((theme) => (
                    <ThemeOption key={theme.id} theme={theme} />
                  ))}
                </div>
              </div>

              {/* Functional Area Themes */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">Functional</Badge>
                  <span className="text-sm font-medium text-muted-foreground">App Areas</span>
                </div>
                <div className="space-y-1">
                  {functionalThemes.map((theme) => (
                    <ThemeOption key={theme.id} theme={theme} />
                  ))}
                </div>
              </div>

              {/* Workspace Themes */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">Workspace</Badge>
                  <span className="text-sm font-medium text-muted-foreground">Work Areas</span>
                </div>
                <div className="space-y-1">
                  {workspaceThemes.map((theme) => (
                    <ThemeOption key={theme.id} theme={theme} />
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t mt-4 pt-4">
              <p className="text-xs text-muted-foreground text-center">
                Themes automatically apply to respective app sections
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};