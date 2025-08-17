# Navigation Components Documentation

Navigation and wayfinding components for the Enterprise Management System.

## 🧭 Core Navigation Components

### 🔗 SafeNavigationLink

**Location**: `src/components/ui/safe-navigation-link.tsx`

#### Purpose
Protected navigation component that checks user permissions before allowing navigation to sensitive routes.

#### Usage
```typescript
import { SafeNavigationLink } from '@/components/ui/safe-navigation-link';

<SafeNavigationLink 
  to="/admin/users"
  requiredRoles={['admin', 'hr_manager']}
  className="nav-link"
>
  User Management
</SafeNavigationLink>
```

#### Props Interface
```typescript
interface SafeNavigationLinkProps {
  to: string;
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
  className?: string;
  onClick?: () => void;
  fallbackComponent?: React.ComponentType;
}
```

#### Features
- **Role-based access control**: Automatic permission checking
- **Graceful fallbacks**: Custom components for unauthorized access
- **Accessibility**: Full keyboard navigation support
- **Loading states**: Shows loading while checking permissions

### 🗂️ Breadcrumb Navigation

**Location**: `src/components/ui/breadcrumb.tsx`

#### Dynamic Breadcrumbs
```typescript
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb';

const PageBreadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs(); // Auto-generated from route

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <BreadcrumbItem key={crumb.path}>
            {index === breadcrumbs.length - 1 ? (
              <span className="text-muted-foreground">{crumb.title}</span>
            ) : (
              <BreadcrumbLink href={crumb.path}>
                {crumb.title}
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
```

#### Custom Breadcrumb Structure
```typescript
// Manual breadcrumb definition
const CustomBreadcrumb = () => (
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="/challenges">Challenges</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <span>Innovation Challenge 2024</span>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
);
```

### 📱 Responsive Navigation Menu

**Location**: `src/components/ui/navigation-menu.tsx`

#### Main Navigation
```typescript
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';

const MainNavigation = () => {
  const { hasPermission } = useRolePermissions();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Challenges</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
              <li>
                <SafeNavigationLink 
                  to="/challenges/active"
                  className="block p-3 rounded-md hover:bg-accent"
                >
                  <div className="font-medium">Active Challenges</div>
                  <p className="text-sm text-muted-foreground">
                    Browse and participate in ongoing innovation challenges
                  </p>
                </SafeNavigationLink>
              </li>
              {hasPermission(['manage_challenges']) && (
                <li>
                  <SafeNavigationLink 
                    to="/admin/challenges"
                    className="block p-3 rounded-md hover:bg-accent"
                  >
                    <div className="font-medium">Manage Challenges</div>
                    <p className="text-sm text-muted-foreground">
                      Create and manage innovation challenges
                    </p>
                  </SafeNavigationLink>
                </li>
              )}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
```

### 🗂️ Tab Navigation

**Location**: `src/components/ui/tabs.tsx`

#### Content Tabs
```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ChallengeDetailTabs = ({ challenge }: { challenge: Challenge }) => (
  <Tabs defaultValue="overview" className="w-full">
    <TabsList className="grid w-full grid-cols-4">
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="submissions">Submissions</TabsTrigger>
      <TabsTrigger value="analytics">Analytics</TabsTrigger>
      <TabsTrigger value="settings">Settings</TabsTrigger>
    </TabsList>
    
    <TabsContent value="overview" className="mt-6">
      <ChallengeOverview challenge={challenge} />
    </TabsContent>
    
    <TabsContent value="submissions" className="mt-6">
      <SubmissionsList challengeId={challenge.id} />
    </TabsContent>
    
    <TabsContent value="analytics" className="mt-6">
      <ChallengeAnalytics challengeId={challenge.id} />
    </TabsContent>
    
    <TabsContent value="settings" className="mt-6">
      <ChallengeSettings challenge={challenge} />
    </TabsContent>
  </Tabs>
);
```

#### Vertical Tabs
```typescript
const VerticalTabs = () => (
  <Tabs defaultValue="profile" orientation="vertical" className="flex gap-6">
    <TabsList className="flex-col h-auto">
      <TabsTrigger value="profile" className="w-full justify-start">
        <User className="mr-2 h-4 w-4" />
        Profile
      </TabsTrigger>
      <TabsTrigger value="security" className="w-full justify-start">
        <Shield className="mr-2 h-4 w-4" />
        Security
      </TabsTrigger>
      <TabsTrigger value="notifications" className="w-full justify-start">
        <Bell className="mr-2 h-4 w-4" />
        Notifications
      </TabsTrigger>
    </TabsList>
    
    <div className="flex-1">
      <TabsContent value="profile">
        <ProfileSettings />
      </TabsContent>
      <TabsContent value="security">
        <SecuritySettings />
      </TabsContent>
      <TabsContent value="notifications">
        <NotificationSettings />
      </TabsContent>
    </div>
  </Tabs>
);
```

## 🎛️ Advanced Navigation Components

### 📂 Sidebar Navigation

**Location**: `src/components/ui/sidebar.tsx`

#### Main Application Sidebar
```typescript
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

const AppSidebar = () => {
  const { hasPermission } = useRolePermissions();
  const location = useLocation();

  const navigationItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      permissions: []
    },
    {
      title: "Challenges",
      url: "/challenges",
      icon: Trophy,
      permissions: []
    },
    {
      title: "Ideas",
      url: "/ideas",
      icon: Lightbulb,
      permissions: []
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart,
      permissions: ['view_analytics']
    },
    {
      title: "Administration",
      url: "/admin",
      icon: Settings,
      permissions: ['admin_access']
    }
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems
                .filter(item => 
                  item.permissions.length === 0 || 
                  hasPermission(item.permissions)
                )
                .map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      isActive={location.pathname.startsWith(item.url)}
                    >
                      <SafeNavigationLink to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SafeNavigationLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
```

#### Collapsible Sidebar Groups
```typescript
const CollapsibleSidebarSection = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center w-full text-left"
        >
          <ChevronRight 
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-90"
            )} 
          />
          Challenge Management
        </button>
      </SidebarGroupLabel>
      
      {isOpen && (
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <SafeNavigationLink to="/admin/challenges/create">
                  <Plus className="h-4 w-4" />
                  Create Challenge
                </SafeNavigationLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <SafeNavigationLink to="/admin/challenges/manage">
                  <Settings className="h-4 w-4" />
                  Manage Challenges
                </SafeNavigationLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      )}
    </SidebarGroup>
  );
};
```

### 🍔 Mobile Menu

**Location**: `src/components/ui/mobile-menu.tsx`

#### Responsive Mobile Navigation
```typescript
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="font-bold text-lg">Innovation Platform</div>
          </div>
          
          <NavigationMenuMobile onItemClick={() => setIsOpen(false)} />
        </nav>
      </SheetContent>
    </Sheet>
  );
};

const NavigationMenuMobile = ({ onItemClick }: { onItemClick: () => void }) => {
  const { hasPermission } = useRolePermissions();
  
  return (
    <div className="flex flex-col gap-2">
      <SafeNavigationLink 
        to="/dashboard"
        className="block px-3 py-2 rounded-md hover:bg-accent"
        onClick={onItemClick}
      >
        Dashboard
      </SafeNavigationLink>
      
      <SafeNavigationLink 
        to="/challenges"
        className="block px-3 py-2 rounded-md hover:bg-accent"
        onClick={onItemClick}
      >
        Challenges
      </SafeNavigationLink>
      
      {hasPermission(['admin_access']) && (
        <SafeNavigationLink 
          to="/admin"
          className="block px-3 py-2 rounded-md hover:bg-accent"
          onClick={onItemClick}
        >
          Administration
        </SafeNavigationLink>
      )}
    </div>
  );
};
```

## 🎯 Specialized Navigation Components

### 🔍 Search Navigation

**Location**: `src/components/ui/command.tsx`

#### Command Palette
```typescript
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

const GlobalCommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0">
        <Command>
          <CommandInput placeholder="Search challenges, users, or navigate..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            
            <CommandGroup heading="Navigation">
              <CommandItem onSelect={() => navigate('/dashboard')}>
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </CommandItem>
              <CommandItem onSelect={() => navigate('/challenges')}>
                <Trophy className="mr-2 h-4 w-4" />
                Challenges
              </CommandItem>
            </CommandGroup>
            
            <CommandGroup heading="Quick Actions">
              <CommandItem onSelect={() => navigate('/challenges/create')}>
                <Plus className="mr-2 h-4 w-4" />
                Create Challenge
              </CommandItem>
              <CommandItem onSelect={() => navigate('/ideas/submit')}>
                <Lightbulb className="mr-2 h-4 w-4" />
                Submit Idea
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};
```

### 🗺️ Contextual Navigation

#### Page-specific Navigation
```typescript
const ChallengeContextualNav = ({ challenge }: { challenge: Challenge }) => {
  const { hasPermission } = useRolePermissions();

  return (
    <nav className="flex items-center gap-4 border-b pb-4 mb-6">
      <h1 className="text-2xl font-bold">{challenge.title}</h1>
      
      <div className="flex items-center gap-2 ml-auto">
        <Badge variant="outline">{challenge.status}</Badge>
        
        {hasPermission(['manage_challenges']) && (
          <Button variant="outline" size="sm" asChild>
            <SafeNavigationLink to={`/admin/challenges/${challenge.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </SafeNavigationLink>
          </Button>
        )}
        
        <Button variant="outline" size="sm" asChild>
          <SafeNavigationLink to={`/challenges/${challenge.id}/submit`}>
            <Send className="h-4 w-4 mr-2" />
            Submit Idea
          </SafeNavigationLink>
        </Button>
      </div>
    </nav>
  );
};
```

### 📊 Analytics Navigation

#### Multi-level Analytics Navigation
```typescript
const AnalyticsNavigation = () => {
  const { pathname } = useLocation();
  const { hasPermission } = useRolePermissions();

  const analyticsRoutes = [
    {
      title: "Overview",
      path: "/analytics",
      icon: BarChart,
      permissions: ['view_basic_analytics']
    },
    {
      title: "User Engagement",
      path: "/analytics/engagement",
      icon: Users,
      permissions: ['view_user_analytics']
    },
    {
      title: "Challenge Performance",
      path: "/analytics/challenges",
      icon: Trophy,
      permissions: ['view_challenge_analytics']
    },
    {
      title: "System Health",
      path: "/analytics/system",
      icon: Activity,
      permissions: ['view_system_analytics']
    },
    {
      title: "Security Dashboard",
      path: "/analytics/security",
      icon: Shield,
      permissions: ['view_security_analytics']
    }
  ];

  return (
    <div className="flex space-x-1 border-b">
      {analyticsRoutes
        .filter(route => hasPermission(route.permissions))
        .map(route => (
          <SafeNavigationLink
            key={route.path}
            to={route.path}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-t-lg transition-colors",
              pathname === route.path
                ? "bg-background text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <route.icon className="h-4 w-4" />
            {route.title}
          </SafeNavigationLink>
        ))}
    </div>
  );
};
```

## 🔄 Navigation State Management

### 🧠 Navigation Context

```typescript
// Navigation context for global state
const NavigationContext = createContext<{
  currentPath: string;
  breadcrumbs: Breadcrumb[];
  navigationHistory: string[];
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => void;
  goForward: () => void;
}>({} as any);

export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const breadcrumbs = useMemo(() => 
    generateBreadcrumbs(location.pathname), 
    [location.pathname]
  );

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      const previousPath = navigationHistory[currentIndex - 1];
      navigate(previousPath);
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex, navigationHistory, navigate]);

  const goForward = useCallback(() => {
    if (currentIndex < navigationHistory.length - 1) {
      const nextPath = navigationHistory[currentIndex + 1];
      navigate(nextPath);
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, navigationHistory, navigate]);

  return (
    <NavigationContext.Provider value={{
      currentPath: location.pathname,
      breadcrumbs,
      navigationHistory,
      canGoBack: currentIndex > 0,
      canGoForward: currentIndex < navigationHistory.length - 1,
      goBack,
      goForward
    }}>
      {children}
    </NavigationContext.Provider>
  );
};
```

### 🎯 Route Guards

```typescript
// Protected route component with navigation guards
export const ProtectedRoute = ({ 
  children, 
  requiredRoles = [],
  fallbackPath = '/dashboard'
}) => {
  const { user } = useAuth();
  const { hasRole } = useRolePermissions();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};
```

---

*Navigation Components: 15+ documented | Accessibility: ✅ WCAG 2.1 AA | Mobile: ✅ Responsive*