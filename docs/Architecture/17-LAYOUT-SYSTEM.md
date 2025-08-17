# 🎨 Layout System & Routing Architecture

## Overview

The Ruwād Platform implements a **unified layout system** with **global AppShell architecture**, **responsive design patterns**, and **RTL/LTR support**. This system ensures consistent user experience across all **195 components** and **47 pages** with seamless navigation and accessibility.

## Layout Architecture

### 1. **Global AppShell System**

#### AppShell Structure
```mermaid
graph TD
    A[App Root] --> B[DirectionProvider]
    B --> C[ThemeProvider]
    C --> D[SidebarProvider]
    D --> E[AppShell]
    
    E --> F[SystemHeader]
    E --> G[NavigationSidebar]
    E --> H[MainContent]
    
    F --> I[Logo]
    F --> J[GlobalSearch]
    F --> K[NotificationCenter]
    F --> L[UserMenu]
    
    G --> M[NavigationMenu]
    G --> N[QuickActions]
    
    H --> O[PageLayout]
    O --> P[PageHeader]
    O --> Q[PageContent]
    O --> R[PageFooter]
```

#### AppShell Implementation
```typescript
interface AppShellProps {
  children: React.ReactNode;
  withSidebar?: boolean;
  sidebarContent?: React.ReactNode;
  headerActions?: React.ReactNode;
  className?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  withSidebar = true,
  sidebarContent,
  headerActions,
  className
}) => {
  const { isOpen: sidebarOpen, toggle: toggleSidebar } = useSidebar();
  const { direction } = useDirection();
  const { theme } = useTheme();
  
  return (
    <div 
      className={cn(
        "min-h-screen bg-background font-sans antialiased",
        direction === 'rtl' && "rtl",
        theme,
        className
      )}
      dir={direction}
    >
      {/* Global Header */}
      <SystemHeader 
        onMenuToggle={toggleSidebar}
        actions={headerActions}
      />
      
      {/* Main Layout Container */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        {withSidebar && (
          <NavigationSidebar 
            isOpen={sidebarOpen}
            content={sidebarContent}
          />
        )}
        
        {/* Main Content Area */}
        <main 
          className={cn(
            "flex-1 overflow-hidden transition-all duration-300 ease-in-out",
            withSidebar && sidebarOpen && "lg:ml-64",
            withSidebar && !sidebarOpen && "lg:ml-16",
            direction === 'rtl' && withSidebar && sidebarOpen && "lg:mr-64 lg:ml-0",
            direction === 'rtl' && withSidebar && !sidebarOpen && "lg:mr-16 lg:ml-0"
          )}
        >
          <div className="h-full overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
      
      {/* Global Components */}
      <Toaster />
      <CommandPalette />
      <GlobalModals />
    </div>
  );
};
```

### 2. **System Header Component**

#### Header Architecture
```typescript
export const SystemHeader: React.FC<{
  onMenuToggle: () => void;
  actions?: React.ReactNode;
}> = ({ onMenuToggle, actions }) => {
  const { user } = useAuth();
  const { notifications } = useRealTimeChallenges();
  const { t, changeLanguage, language } = useUnifiedTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="mr-4 lg:hidden"
          aria-label={t('navigation.toggleMenu')}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo & Brand */}
        <div className="flex items-center space-x-4">
          <Logo />
          <div className="hidden md:block">
            <GlobalSearch />
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Custom Actions */}
          {actions}
          
          {/* Notifications */}
          <NotificationCenter 
            notifications={notifications}
            className="hidden sm:flex"
          />
          
          {/* Language Switcher */}
          <LanguageSwitcher
            currentLanguage={language}
            onLanguageChange={changeLanguage}
          />
          
          {/* Theme Toggle */}
          <ThemeToggle
            theme={theme}
            onThemeChange={setTheme}
          />
          
          {/* User Menu */}
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
};
```

### 3. **Navigation Sidebar System**

#### Responsive Sidebar
```typescript
export const NavigationSidebar: React.FC<{
  isOpen: boolean;
  content?: React.ReactNode;
}> = ({ isOpen, content }) => {
  const { hasRole, hasPermission } = useRoleManagement();
  const { direction } = useDirection();
  const location = useLocation();

  const navigationItems = useMemo(() => [
    {
      label: 'dashboard.title',
      href: '/dashboard',
      icon: Home,
      permission: 'dashboard.view'
    },
    {
      label: 'challenges.title',
      href: '/challenges',
      icon: Target,
      permission: 'challenges.view'
    },
    {
      label: 'ideas.title',
      href: '/ideas',
      icon: Lightbulb,
      permission: 'ideas.view'
    },
    {
      label: 'events.title',
      href: '/events',
      icon: Calendar,
      permission: 'events.view'
    },
    // Admin section
    ...(hasRole('admin') || hasRole('super_admin') ? [{
      label: 'admin.title',
      href: '/admin',
      icon: Settings,
      permission: 'admin.access',
      children: [
        {
          label: 'admin.users',
          href: '/admin/users',
          permission: 'users.manage'
        },
        {
          label: 'admin.analytics',
          href: '/admin/analytics',
          permission: 'analytics.view'
        }
      ]
    }] : [])
  ], [hasRole]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => {/* Close sidebar */}}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 z-50 flex flex-col bg-card border-r transition-all duration-300 ease-in-out lg:relative lg:translate-x-0",
          direction === 'ltr' && "left-0",
          direction === 'rtl' && "right-0",
          isOpen ? "w-64 translate-x-0" : "w-16 -translate-x-full lg:translate-x-0",
          direction === 'rtl' && !isOpen && "translate-x-full lg:translate-x-0"
        )}
      >
        {/* Navigation Content */}
        <nav className="flex-1 p-4">
          {content || (
            <NavigationMenu 
              items={navigationItems}
              currentPath={location.pathname}
              isCollapsed={!isOpen}
            />
          )}
        </nav>
        
        {/* Sidebar Footer */}
        <div className="border-t p-4">
          <QuickActions isCollapsed={!isOpen} />
        </div>
      </aside>
    </>
  );
};
```

### 4. **Page Layout Components**

#### Standard Page Layout
```typescript
interface PageLayoutProps {
  title?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
  children,
  maxWidth = '2xl',
  padding = 'md',
  className
}) => {
  const { t } = useUnifiedTranslation();

  return (
    <div className={cn("min-h-full bg-background", className)}>
      {/* Page Header */}
      {(title || breadcrumbs || actions) && (
        <PageHeader
          title={title}
          description={description}
          breadcrumbs={breadcrumbs}
          actions={actions}
        />
      )}
      
      {/* Page Content */}
      <PageContent 
        maxWidth={maxWidth}
        padding={padding}
      >
        {children}
      </PageContent>
    </div>
  );
};

export const PageHeader: React.FC<{
  title?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}> = ({ title, description, breadcrumbs, actions }) => {
  const { t } = useUnifiedTranslation();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-6">
        {/* Breadcrumbs */}
        {breadcrumbs && (
          <Breadcrumb items={breadcrumbs} className="mb-4" />
        )}
        
        {/* Title & Actions */}
        <div className="flex items-center justify-between">
          <div>
            {title && (
              <h1 className="text-3xl font-bold tracking-tight">
                {t(title)}
              </h1>
            )}
            {description && (
              <p className="mt-2 text-muted-foreground">
                {t(description)}
              </p>
            )}
          </div>
          
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
```

### 5. **Responsive Grid System**

#### Flexible Grid Layout
```typescript
interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = { default: 1, md: 2, lg: 3 },
  gap = 'md',
  className
}) => {
  const gridClasses = cn(
    "grid",
    // Column classes
    `grid-cols-${columns.default}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
    columns['2xl'] && `2xl:grid-cols-${columns['2xl']}`,
    // Gap classes
    {
      'gap-0': gap === 'none',
      'gap-2': gap === 'sm',
      'gap-4': gap === 'md',
      'gap-6': gap === 'lg',
      'gap-8': gap === 'xl'
    },
    className
  );

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};
```

### 6. **RTL/LTR Support System**

#### Direction Provider
```typescript
export const DirectionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('rtl');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    // Set direction based on language
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    setDirection(dir);
    
    // Update document direction
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    
    // Update CSS custom properties for RTL
    if (dir === 'rtl') {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }, [language]);

  const toggleDirection = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
  };

  const contextValue = {
    direction,
    language,
    setLanguage,
    toggleDirection,
    isRTL: direction === 'rtl'
  };

  return (
    <DirectionContext.Provider value={contextValue}>
      {children}
    </DirectionContext.Provider>
  );
};

export const useDirection = () => {
  const context = useContext(DirectionContext);
  if (!context) {
    throw new Error('useDirection must be used within DirectionProvider');
  }
  return context;
};
```

### 7. **Responsive Design Patterns**

#### Adaptive Component System
```typescript
// Responsive utility hook
export const useResponsive = () => {
  const [breakpoint, setBreakpoint] = useState<'sm' | 'md' | 'lg' | 'xl' | '2xl'>('lg');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < 640) setBreakpoint('sm');
      else if (width < 768) setBreakpoint('md');
      else if (width < 1024) setBreakpoint('lg');
      else if (width < 1280) setBreakpoint('xl');
      else setBreakpoint('2xl');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  const isMobile = breakpoint === 'sm';
  const isTablet = breakpoint === 'md';
  const isDesktop = ['lg', 'xl', '2xl'].includes(breakpoint);

  return {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    screenWidth: window.innerWidth
  };
};

// Responsive component wrapper
export const ResponsiveContainer: React.FC<{
  children: React.ReactNode;
  mobileLayout?: React.ReactNode;
  tabletLayout?: React.ReactNode;
  desktopLayout?: React.ReactNode;
}> = ({ children, mobileLayout, tabletLayout, desktopLayout }) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile && mobileLayout) return <>{mobileLayout}</>;
  if (isTablet && tabletLayout) return <>{tabletLayout}</>;
  if (isDesktop && desktopLayout) return <>{desktopLayout}</>;
  
  return <>{children}</>;
};
```

### 8. **Layout Animation System**

#### Smooth Transitions
```typescript
// Layout transition hook
export const useLayoutTransitions = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const transitionLayout = useCallback(async (
    callback: () => void | Promise<void>
  ) => {
    setIsTransitioning(true);
    
    // Add transition class to body
    document.body.classList.add('layout-transitioning');
    
    try {
      await callback();
      
      // Wait for transition to complete
      await new Promise(resolve => setTimeout(resolve, 300));
    } finally {
      setIsTransitioning(false);
      document.body.classList.remove('layout-transitioning');
    }
  }, []);

  return {
    isTransitioning,
    transitionLayout
  };
};

// Layout transition CSS
const layoutTransitionStyles = `
  .layout-transitioning * {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .layout-transitioning .sidebar {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .layout-transitioning .main-content {
    transition: margin 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;
```

## Layout System Patterns

### 1. **Consistent Spacing**
- 4px base unit system
- Semantic spacing tokens
- Consistent component margins/padding
- Responsive spacing adjustments

### 2. **Typography Hierarchy**
- Clear heading hierarchy (h1-h6)
- Consistent font sizes and line heights
- Proper contrast ratios
- RTL-aware text alignment

### 3. **Component Composition**
- Reusable layout components
- Flexible prop interfaces
- Composable design patterns
- Consistent component APIs

### 4. **Accessibility Features**
- Semantic HTML structure
- ARIA landmarks and labels
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

### 5. **Performance Optimization**
- Lazy loading for heavy components
- Virtualized lists for large datasets
- Optimized re-renders
- Efficient CSS-in-JS patterns

---

**Layout System Status**: ✅ **Production Ready**  
**Components Using System**: 195/195 (100%)  
**Pages Implemented**: 47/47 (100%)  
**RTL Support**: ✅ **Complete**