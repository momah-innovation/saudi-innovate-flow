import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { cn } from '@/lib/utils';
import { 
  Home, Info, Megaphone, Target, Calendar, 
  ShoppingBag, DollarSign, BarChart3, HelpCircle 
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

export function LandingNavigation() {
  const { isRTL } = useUnifiedTranslation();
  const location = useLocation();

  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Home',
      arabicLabel: 'الرئيسية',
      path: '/',
      icon: Home,
      description: 'Platform overview and introduction',
      arabicDescription: 'نظرة عامة على المنصة والتعريف'
    },
    {
      id: 'about',
      label: 'About',
      arabicLabel: 'حول المنصة',
      path: '/about',
      icon: Info,
      description: 'Learn about Ruwād platform',
      arabicDescription: 'تعرف على منصة رواد'
    },
    {
      id: 'campaigns',
      label: 'Campaigns',
      arabicLabel: 'الحملات',
      path: '/campaigns',
      icon: Megaphone,
      description: 'Ongoing innovation campaigns',
      arabicDescription: 'حملات الابتكار الجارية'
    },
    {
      id: 'challenges',
      label: 'Challenges',
      arabicLabel: 'التحديات',
      path: '/challenges',
      icon: Target,
      description: 'Browse public challenges',
      arabicDescription: 'استكشف التحديات العامة'
    },
    {
      id: 'events',
      label: 'Events',
      arabicLabel: 'الفعاليات',
      path: '/events',
      icon: Calendar,
      description: 'Upcoming innovation events',
      arabicDescription: 'الفعاليات الابتكارية القادمة'
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      arabicLabel: 'السوق',
      path: '/marketplace',
      icon: ShoppingBag,
      description: 'Innovation opportunities & partnerships',
      arabicDescription: 'فرص الابتكار والشراكات'
    },
    {
      id: 'pricing',
      label: 'Pricing',
      arabicLabel: 'الأسعار',
      path: '/pricing',
      icon: DollarSign,
      description: 'Subscription plans and pricing',
      arabicDescription: 'خطط الاشتراك والأسعار'
    },
    {
      id: 'statistics',
      label: 'Statistics',
      arabicLabel: 'الإحصائيات',
      path: '/statistics',
      icon: BarChart3,
      description: 'Platform statistics and insights',
      arabicDescription: 'إحصائيات ورؤى المنصة'
    },
    {
      id: 'help',
      label: 'Help',
      arabicLabel: 'المساعدة',
      path: '/help',
      icon: HelpCircle,
      description: 'Help and documentation',
      arabicDescription: 'المساعدة والوثائق'
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
                {isRTL ? 'رواد' : 'Ruwād'}
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

          {/* Auth Buttons */}
          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <Button variant="ghost" asChild className={isRTL ? "font-arabic" : "font-english"}>
              <Link to="/login">
                {isRTL ? 'تسجيل الدخول' : 'Login'}
              </Link>
            </Button>
            <Button asChild className={isRTL ? "font-arabic" : "font-english"}>
              <Link to="/signup">
                {isRTL ? 'البدء' : 'Get Started'}
              </Link>
            </Button>
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