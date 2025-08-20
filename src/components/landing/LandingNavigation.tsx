import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { 
  Home, Info, Megaphone, Target, Calendar, 
  ShoppingBag, DollarSign, BarChart3, HelpCircle, User, ArrowRight
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  arabicLabel: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  arabicDescription: string;
}

interface LandingNavigationProps {
  user?: SupabaseUser | null;
  loading?: boolean;
}

export function LandingNavigation({ user, loading }: LandingNavigationProps) {
  const { isRTL, language } = useDirection();
  const location = useLocation();
  const { t } = useUnifiedTranslation();

  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: t('navigation.main.home'),
      arabicLabel: t('navigation.main.home'),
      path: '/',
      icon: Home,
      description: t('Platform overview and introduction'),
      arabicDescription: t('Platform overview and introduction')
    },
    {
      id: 'about',
      label: t('navigation.landing.about'),
      arabicLabel: t('navigation.landing.about'),
      path: '/about',
      icon: Info,
      description: t('Learn about platform'),
      arabicDescription: t('Learn about platform')
    },
    {
      id: 'campaigns',
      label: t('navigation.landing.campaigns'),
      arabicLabel: t('navigation.landing.campaigns'),
      path: '/campaigns',
      icon: Megaphone,
      description: t('Ongoing innovation campaigns'),
      arabicDescription: t('Ongoing innovation campaigns')
    },
    {
      id: 'challenges',
      label: t('navigation.main.challenges'),
      arabicLabel: t('navigation.main.challenges'),
      path: '/challenges',
      icon: Target,
      description: t('Browse public challenges'),
      arabicDescription: t('Browse public challenges')
    },
    {
      id: 'events',
      label: t('navigation.main.events'),
      arabicLabel: t('navigation.main.events'),
      path: '/events',
      icon: Calendar,
      description: t('Upcoming innovation events'),
      arabicDescription: t('Upcoming innovation events')
    },
    {
      id: 'marketplace',
      label: t('navigation.landing.marketplace'),
      arabicLabel: t('navigation.landing.marketplace'),
      path: '/marketplace',
      icon: ShoppingBag,
      description: t('Innovation opportunities & partnerships'),
      arabicDescription: t('Innovation opportunities & partnerships')
    },
    {
      id: 'pricing',
      label: t('navigation.landing.pricing'),
      arabicLabel: t('navigation.landing.pricing'),
      path: '/pricing',
      icon: DollarSign,
      description: t('Subscription plans and pricing'),
      arabicDescription: t('Subscription plans and pricing')
    },
    {
      id: 'statistics',
      label: t('navigation.main.statistics'),
      arabicLabel: t('navigation.main.statistics'),
      path: '/statistics',
      icon: BarChart3,
      description: t('Platform statistics and insights'),
      arabicDescription: t('Platform statistics and insights')
    },
    {
      id: 'help',
      label: t('navigation.main.help'),
      arabicLabel: t('navigation.main.help'),
      path: '/help',
      icon: HelpCircle,
      description: t('Help and documentation'),
      arabicDescription: t('Help and documentation')
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className={cn("flex items-center", isRTL && "flex-row-reverse")}>
            <Link to="/" className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className={cn("text-xl font-bold text-foreground", isRTL ? "font-arabic" : "font-english")}>
                {t('navigation:landing.logo_text')}
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className={cn("hidden md:flex items-center gap-1", isRTL && "flex-row-reverse")}>
            {navigationItems.slice(0, 6).map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive(item.path) 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground",
                  isRTL ? "font-arabic" : "font-english"
                )}
                title={isRTL ? item.arabicDescription : item.description}
              >
                <div className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
                  <item.icon className="w-4 h-4" />
                  <span>{isRTL ? item.arabicLabel : item.label}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Auth Actions - Different content for authenticated/unauthenticated users */}
          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            {loading ? (
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary"></div>
            ) : user ? (
              /* Authenticated User Menu */
              <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                <span className={cn("text-sm text-muted-foreground", isRTL ? "font-arabic" : "font-english")}>
                  {t('navigation:landing.welcome')}
                </span>
                <Button asChild>
                  <Link to="/dashboard">
                    <User className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                    {t('navigation:landing.dashboard')}
                  </Link>
                </Button>
              </div>
            ) : (
              /* Unauthenticated User Actions */
              <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <Button variant="ghost" asChild className={isRTL ? "font-arabic" : "font-english"}>
                  <Link to="/login">
                    {t('navigation:landing.login')}
                  </Link>
                </Button>
                <Button asChild className={isRTL ? "font-arabic" : "font-english"}>
                  <Link to="/signup">
                    {t('navigation:landing.get_started')}
                    <ArrowRight className={cn("h-4 w-4", isRTL ? "mr-2 rotate-180" : "ml-2")} />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="grid grid-cols-3 gap-2">
            {navigationItems.slice(0, 9).map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  "flex flex-col items-center p-2 rounded-md text-xs transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive(item.path) 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="w-5 h-5 mb-1" />
                <span className="text-center">
                  {isRTL ? item.arabicLabel : item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
