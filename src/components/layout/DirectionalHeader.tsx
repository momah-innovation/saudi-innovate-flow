import React from 'react';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Languages, Moon, Sun, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/ui/theme-provider';
import { Badge } from '@/components/ui/badge';
import { useSystemLists } from '@/hooks/useSystemLists';

interface DirectionalHeaderProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
  showLanguageSwitch?: boolean;
  showThemeSwitch?: boolean;
  onMenuClick?: () => void;
}

export function DirectionalHeader({
  title,
  children,
  className,
  showLanguageSwitch = true,
  showThemeSwitch = true,
  onMenuClick,
  ...props
}: DirectionalHeaderProps) {
  const { isRTL, language, setLanguage, toggleDirection } = useDirection();
  const { theme, setTheme } = useTheme();
  const { supportedLanguages } = useSystemLists();

  const languageOptions = supportedLanguages;

  const toggleTheme = () => {
    setTheme({
      colorScheme: theme.colorScheme === 'dark' ? 'light' : 'dark'
    });
  };

  return (
    <header
      className={cn(
        'flex items-center justify-between h-16 px-4 bg-background border-b border-border',
        isRTL && 'flex-row-reverse',
        className
      )}
      dir={isRTL ? 'rtl' : 'ltr'}
      {...props}
    >
      {/* Left section (Right in RTL) */}
      <div className={cn('flex items-center gap-4', isRTL && 'flex-row-reverse')}>
        {onMenuClick && (
          <Button variant="ghost" size="sm" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        {title && (
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            <Badge variant="secondary" className="text-xs">
              {isRTL ? 'RTL' : 'LTR'}
            </Badge>
          </div>
        )}
        
        {children}
      </div>

      {/* Right section (Left in RTL) */}
      <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
        {showLanguageSwitch && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Languages className="h-4 w-4" />
                <span className={cn('ml-2', isRTL && 'ml-0 mr-2')}>
                  {languageOptions.find(l => l.code === language)?.nativeLabel}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align={isRTL ? 'start' : 'end'}
              className="min-w-[180px]"
            >
              {languageOptions.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as any)}
                  className={cn(
                    'flex items-center justify-between',
                    language === lang.code && 'bg-accent'
                  )}
                >
                  <span>{lang.nativeLabel}</span>
                  <span className="text-muted-foreground text-sm">{lang.label}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={toggleDirection}
                className="border-t mt-1 pt-1"
              >
                Toggle Direction ({isRTL ? 'LTR' : 'RTL'})
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {showThemeSwitch && (
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {theme.colorScheme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </header>
  );
}

// Specialized header components
export function AdminHeader({ title = "Admin Dashboard", ...props }: Omit<DirectionalHeaderProps, 'title'> & { title?: string }) {
  return <DirectionalHeader title={title} {...props} />;
}

export function AppHeader({ title, ...props }: DirectionalHeaderProps) {
  return <DirectionalHeader title={title} {...props} />;
}