import { useState, ReactNode } from 'react';
import { Search, Menu, Languages, Moon, Sun, Plus, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { UserMenu } from './UserMenu';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { useDirection } from '@/components/ui/direction-provider';
import { useTheme } from '@/components/ui/theme-provider';
import { useSystemLists } from '@/hooks/useSystemLists';
import { useUnifiedTranslation } from '@/hooks/useAppTranslation';
import { getInitials, useSystemSettings } from '@/contexts/SystemSettingsContext';
import { cn } from '@/lib/utils';

type HeaderVariant = 'system' | 'page' | 'admin' | 'portal';
type UserRole = 'admin' | 'expert' | 'partner' | 'stakeholder' | 'user' | 'moderator' | 'organization_admin' | 'team_lead';

interface ActionButton {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  requiresRole?: UserRole[];
  visible?: boolean;
}

interface UnifiedHeaderProps {
  // Layout & Behavior
  variant?: HeaderVariant;
  onSidebarToggle?: () => void;
  className?: string;
  
  // Page Header Features
  title?: string;
  description?: string;
  itemCount?: number;
  primaryAction?: ActionButton;
  secondaryActions?: ReactNode;
  
  // Search Features
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  
  // System Features
  showLanguageSwitch?: boolean;
  showThemeSwitch?: boolean;
  showNotifications?: boolean;
  showUserMenu?: boolean;
  
  // Custom Content
  children?: ReactNode;
  centerContent?: ReactNode;
  rightContent?: ReactNode;
}

/**
 * UnifiedHeader - Single header component that replaces all other headers
 * Features:
 * - Role-based access control
 * - Full RTL/LTR support
 * - i18n integration
 * - Multiple variants (system, page, admin, portal)
 * - Responsive design
 * - Modern animations and design
 */
export function UnifiedHeader({
  variant = 'system',
  onSidebarToggle,
  className,
  title,
  description,
  itemCount,
  primaryAction,
  secondaryActions,
  showSearch = false,
  searchValue = '',
  onSearchChange,
  searchPlaceholder,
  showLanguageSwitch = true,
  showThemeSwitch = true,
  showNotifications = true,
  showUserMenu = true,
  children,
  centerContent,
  rightContent,
}: UnifiedHeaderProps) {
  const [searchQuery, setSearchQuery] = useState(searchValue);
  const { userProfile } = useAuth();
  const { isRTL, language, setLanguage, toggleDirection } = useDirection();
  const { theme, setTheme } = useTheme();
  const { supportedLanguages } = useSystemLists();
  const { t } = useUnifiedTranslation();
  const { uiInitialsMaxLength } = useSystemSettings();

  // Role-based access check
  const hasRole = (requiredRoles?: UserRole[]): boolean => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    // TODO: Implement actual role checking logic with user's roles
    return true; // Temporary - replace with actual role check
  };

  // Dynamic content based on variant
  const getSystemTitle = () => {
    return language === 'ar' ? 'نظام رواد للابتكار' : 'Ruwād Innovation System';
  };

  const getSearchPlaceholder = () => {
    return searchPlaceholder || (language === 'ar' ? 'البحث...' : 'Search...');
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange?.(value);
  };

  const toggleTheme = () => {
    setTheme({
      colorScheme: theme.colorScheme === 'dark' ? 'light' : 'dark'
    });
  };

  // Render different header layouts based on variant
  const renderSystemHeader = () => (
    <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className={cn(
        "container flex items-center justify-between px-4 h-full max-w-none",
        isRTL && "flex-row-reverse"
      )}>
        
        {/* Left Section: Logo, Sidebar Toggle, Title */}
        <div className={cn(
          "flex items-center gap-3 min-w-0",
          isRTL && "flex-row-reverse"
        )}>
          {onSidebarToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSidebarToggle}
              className="shrink-0 hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label={t('open_navigation')}
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          
          {/* Logo & Title */}
          <div className={cn(
            "flex items-center gap-2 min-w-0",
            isRTL && "flex-row-reverse"
          )}>
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center shrink-0 shadow-lg">
              <span className="text-primary-foreground font-bold text-sm">🏗️</span>
            </div>
            <div className={cn(
              "hidden sm:block min-w-0",
              isRTL && "text-right"
            )}>
              <h1 className={cn(
                "font-semibold text-sm truncate transition-colors",
                language === 'ar' ? 'font-arabic' : 'font-english'
              )}>
                {title || getSystemTitle()}
              </h1>
            </div>
          </div>
        </div>

        {/* Center Section: Search or Custom Content */}
        <div className="flex-1 max-w-md mx-4">
          {centerContent || (showSearch && (
            <div className="relative">
              <Search className={cn(
                "absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors",
                isRTL ? "right-3" : "left-3"
              )} />
              <Input
                type="search"
                placeholder={getSearchPlaceholder()}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className={cn(
                  "h-9 transition-all duration-200 focus:ring-2 focus:ring-primary/20",
                  isRTL ? "pr-10 text-right font-arabic" : "pl-10 font-english"
                )}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
          ))}
        </div>

        {/* Right Section: Actions & User */}
        <div className={cn(
          "flex items-center gap-2",
          isRTL && "flex-row-reverse"
        )}>
          {rightContent || (
            <>
              {/* Language Toggle */}
              {showLanguageSwitch && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-9 w-9 p-0"
                  onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                  title={t('switch_language')}
                >
                  <Languages className="h-4 w-4" />
                  <span className="sr-only">
                    {t('switch_language')}
                  </span>
                </Button>
              )}

              {/* Theme Toggle */}
              {showThemeSwitch && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-9 w-9 p-0"
                  onClick={toggleTheme}
                  title={t('toggle_theme')}
                >
                  {theme.colorScheme === 'dark' ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
              )}
              
              {/* Notifications */}
              {showNotifications && <NotificationCenter />}
              
              {/* User Menu */}
              {showUserMenu && <UserMenu />}
            </>
          )}
        </div>
      </div>
    </header>
  );

  const renderPageHeader = () => (
    <div className={cn(
      'flex items-start justify-between gap-4 mb-6 p-6 bg-background/50 backdrop-blur-sm rounded-lg border border-border/50 shadow-sm',
      isRTL && 'flex-row-reverse',
      className
    )}>
      <div className={cn('flex-1', isRTL && 'text-right')}>
        <div className="flex items-center gap-3 mb-2">
          {title && (
            <h1 className={cn(
              "text-3xl font-bold tracking-tight text-foreground transition-colors",
              language === 'ar' ? 'font-arabic' : 'font-english'
            )}>
              {title}
            </h1>
          )}
          {itemCount !== undefined && (
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {itemCount}
            </Badge>
          )}
        </div>
        {description && (
          <p className={cn(
            "text-muted-foreground text-lg transition-colors",
            language === 'ar' ? 'font-arabic' : 'font-english'
          )}>
            {description}
          </p>
        )}
        {children}
      </div>
      
      {(secondaryActions || primaryAction) && (
        <div className="flex-shrink-0 flex items-center gap-2">
          {secondaryActions}
          {primaryAction && hasRole(primaryAction.requiresRole) && (
            <Button 
              onClick={primaryAction.onClick}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 border-0 shadow-lg transition-all duration-300 hover:scale-105"
            >
              {primaryAction.icon || <Plus className="w-4 h-4" />}
              {primaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );

  const renderAdminHeader = () => (
    <header className={cn(
      'flex items-center justify-between h-16 px-4 bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-border/50',
      isRTL && 'flex-row-reverse',
      className
    )}>
      <div className={cn('flex items-center gap-4', isRTL && 'flex-row-reverse')}>
        {onSidebarToggle && (
          <Button variant="ghost" size="sm" onClick={onSidebarToggle}>
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        {title && (
          <div className="flex items-center gap-2">
            <h1 className={cn(
              "text-xl font-semibold text-foreground",
              language === 'ar' ? 'font-arabic' : 'font-english'
            )}>
              {title}
            </h1>
            <Badge variant="outline" className="text-xs">
              {language === 'ar' ? 'إدارة' : 'Admin'}
            </Badge>
          </div>
        )}
        
        {children}
      </div>

      <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
        {renderSystemControls()}
        {showNotifications && <NotificationCenter />}
        {showUserMenu && <UserMenu />}
      </div>
    </header>
  );

  const renderSystemControls = () => (
    <>
      {showLanguageSwitch && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 w-9 p-0"
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          title={t('switch_language')}
        >
          <Languages className="h-4 w-4" />
          <span className="sr-only">
            {t('switch_language')}
          </span>
        </Button>
      )}

      {showThemeSwitch && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 w-9 p-0"
          onClick={toggleTheme}
          title={t('toggle_theme')}
        >
          {theme.colorScheme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      )}
    </>
  );

  // Render based on variant
  switch (variant) {
    case 'page':
      return renderPageHeader();
    case 'admin':
      return renderAdminHeader();
    case 'portal':
      return renderAdminHeader(); // Similar to admin for now
    case 'system':
    default:
      return renderSystemHeader();
  }
}

// Specialized header components for easier migration
export function SystemHeader({ onSidebarToggle, ...props }: { onSidebarToggle: () => void } & Partial<UnifiedHeaderProps>) {
  return <UnifiedHeader variant="system" onSidebarToggle={onSidebarToggle} {...props} />;
}

export function PageHeader({ title, description, itemCount, primaryAction, secondaryActions, children, className }: Partial<UnifiedHeaderProps>) {
  return (
    <UnifiedHeader
      variant="page"
      title={title}
      description={description}
      itemCount={itemCount}
      primaryAction={primaryAction}
      secondaryActions={secondaryActions}
      className={className}
    >
      {children}
    </UnifiedHeader>
  );
}

export function AdminHeader({ title = "Admin Dashboard", ...props }: Partial<UnifiedHeaderProps> & { title?: string }) {
  return <UnifiedHeader variant="admin" title={title} {...props} />;
}

export function DirectionalHeader(props: Partial<UnifiedHeaderProps>) {
  return <UnifiedHeader variant="system" {...props} />;
}

// Role-based header wrapper
export function RoleAwareHeader({ userRole, ...props }: { userRole?: UserRole } & UnifiedHeaderProps) {
  // Filter actions based on user role
  const filteredProps = {
    ...props,
    primaryAction: props.primaryAction && (!props.primaryAction.requiresRole || props.primaryAction.requiresRole.includes(userRole || 'user')) 
      ? props.primaryAction 
      : undefined
  };

  return <UnifiedHeader {...filteredProps} />;
}