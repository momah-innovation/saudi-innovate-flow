# Ruwād Innovation Platform - Development Guide

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Global Layout System](#global-layout-system)
3. [Admin Page Patterns](#admin-page-patterns)
4. [Component Guidelines](#component-guidelines)
5. [Design System Integration](#design-system-integration)
6. [Data Management Patterns](#data-management-patterns)
7. [Best Practices](#best-practices)
8. [Implementation Examples](#implementation-examples)

---

## 🏗️ Architecture Overview

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (Database, Auth, Storage)
- **State Management**: React Context + Hooks
- **Routing**: React Router Dom v6
- **Internationalization**: Custom RTL/LTR support

### Project Structure
```
src/
├── components/
│   ├── admin/          # Admin-specific components
│   ├── layout/         # Layout components
│   ├── ui/            # Reusable UI components
│   └── [feature]/     # Feature-specific components
├── pages/             # Route components
├── hooks/             # Custom React hooks
├── contexts/          # React Context providers
├── lib/               # Utility functions
└── assets/           # Static assets
```

---

## 🎨 Global Layout System

### Core Layout Components

#### 1. AppShell - Root Layout Container
```tsx
// Usage: Wrap entire application
<AppShell>
  {children}
</AppShell>
```

**Features:**
- Sidebar provider with collapsible navigation
- RTL/LTR support with automatic direction switching
- Responsive design with mobile-first approach
- Global loading states with Suspense boundaries

#### 2. SystemHeader - Global Navigation Bar
```tsx
// Automatically included in AppShell
// Features:
// - Global search functionality
// - User menu and notifications
// - Language toggle (Arabic/English)
// - Sidebar collapse trigger
// - System branding
```

#### 3. NavigationSidebar - Comprehensive Menu System
```tsx
// Role-based navigation with 8 menu groups:
// - Main (Dashboard)
// - Discover (Browse content)
// - Partners (Partnership tools)
// - Workflow (User tasks)
// - Management (Admin tools)
// - Analytics (Reports & insights)
// - Admin (System administration)
// - Settings (User preferences)
```

### Layout Hierarchy
```
AppShell
├── NavigationSidebar (Collapsible)
├── SystemHeader (Fixed)
└── Main Content
    ├── PageLayout (Simple pages)
    ├── StandardPageLayout (Complex data management)
    └── Custom Layouts (Special cases)
```

---

## 🛠️ Admin Page Patterns

### Standard Admin Page Structure

#### 1. Hero Section Pattern
Every admin page should include a hero section with key metrics:

```tsx
// Example: AdminEventsHero
<AdminEventsHero 
  totalEvents={totalEvents}
  activeEvents={activeEvents}
  totalParticipants={totalParticipants}
  totalRevenue={totalRevenue}
  upcomingEvents={upcomingEvents}
  completedEvents={completedEvents}
/>
```

**Hero Component Structure:**
- 4-column grid layout on desktop
- Key metrics with icons
- Gradient cards for emphasis
- Animated counters
- Color-coded status indicators

#### 2. Page Layout Wrapper
```tsx
<AppShell>
  <PageLayout 
    title={title}
    description={description}
    primaryAction={{
      label: createNewLabel,
      onClick: () => setShowAddDialog(true),
      icon: <Plus className="w-4 h-4" />
    }}
    secondaryActions={secondaryActions}
    showLayoutSelector={true}
    viewMode={viewMode}
    onViewModeChange={setViewMode}
    showSearch={true}
    searchValue={searchValue}
    onSearchChange={setSearchValue}
    searchPlaceholder={searchPlaceholder}
    filters={filters}
  >
    {/* Hero Section */}
    <HeroComponent {...heroProps} />
    
    {/* Content with ViewLayouts */}
    <ViewLayouts viewMode={viewMode}>
      {data.map(item => (
        <EnhancedCard key={item.id} {...item} />
      ))}
    </ViewLayouts>
    
    {/* Dialogs and Modals */}
    <ComponentDialog {...dialogProps} />
  </PageLayout>
</AppShell>
```

#### 3. Enhanced Card Components
All admin pages use enhanced card components with consistent styling:

```tsx
// Common card features:
// - Hover animations (hover-scale class)
// - Gradient borders on important cards
// - Consistent action buttons
// - Status badges with semantic colors
// - Loading and empty states
// - Responsive layouts
```

### Required Admin Page Elements

#### ✅ Essential Components
1. **Hero Section** - Metrics and KPIs
2. **Search & Filters** - Data discovery
3. **View Mode Selector** - Cards/List/Grid
4. **Enhanced Cards** - Data presentation
5. **Action Dialogs** - CRUD operations
6. **Loading States** - User feedback
7. **Empty States** - No data scenarios

#### 🎯 Data Integration Pattern
```tsx
const AdminPageComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('cards');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load data from Supabase
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('table_name')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setData(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Filter data based on search
  const filteredData = data.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    // Page structure...
  );
};
```

---

## 🧩 Component Guidelines

### UI Component Hierarchy

#### 1. Layout Components
- `AppShell` - Root application wrapper
- `PageLayout` - Simple page layouts
- `StandardPageLayout` - Advanced data management
- `PageContainer` - Content containers
- `PageHeader` - Standardized headers

#### 2. Data Display Components
- `ViewLayouts` - Grid/List/Card view switcher
- `EnhancedCard` - Feature-rich card components
- `DataTable` - Table data display
- `EmptyState` - No data scenarios
- `LoadingSpinner` - Loading indicators

#### 3. Form Components
- `FormWizard` - Multi-step forms
- `DialogForm` - Modal forms
- `SearchAndFilters` - Data filtering
- `BulkActions` - Mass operations

#### 4. Navigation Components
- `NavigationSidebar` - Main navigation
- `Breadcrumbs` - Page hierarchy
- `TabNavigation` - Section switching

### Component Naming Conventions

#### File Naming
```
PascalCase for components: AdminEventsHero.tsx
kebab-case for utilities: use-translation.ts
camelCase for hooks: useSystemLists.ts
```

#### Component Structure
```tsx
// Import dependencies
import { ... } from 'react';
import { ... } from '@/components/ui/...';

// Define interfaces
interface ComponentProps {
  // Props definition
}

// Export component
export function ComponentName({ 
  prop1, 
  prop2 
}: ComponentProps) {
  // Component logic
  
  return (
    // JSX
  );
}
```

---

## 🎨 Design System Integration

### Color System
```css
/* Use semantic tokens, never direct colors */
✅ Good: text-primary, bg-secondary, border-muted
❌ Bad: text-blue-500, bg-white, border-gray-200
```

### Typography Scale
```css
/* Standardized text sizes */
text-xs     /* 12px - Captions */
text-sm     /* 14px - Body text small */
text-base   /* 16px - Body text */
text-lg     /* 18px - Large text */
text-xl     /* 20px - Headings */
text-2xl    /* 24px - Page titles */
text-3xl    /* 30px - Hero titles */
```

### Spacing System
```css
/* Consistent spacing using Tailwind scale */
gap-2      /* 8px - Tight spacing */
gap-4      /* 16px - Default spacing */
gap-6      /* 24px - Section spacing */
gap-8      /* 32px - Component spacing */
```

### Animation Classes
```css
/* Pre-defined animations */
.hover-scale        /* Hover scale effect */
.fade-in           /* Fade in animation */
.gradient-border   /* Gradient border effect */
.gradient-card     /* Gradient background */
```

### Icon Usage
```tsx
// Standard icon sizing
<Icon className="w-4 h-4" />   // Default 16px
<Icon className="w-5 h-5" />   // Medium 20px
<Icon className="w-6 h-6" />   // Large 24px
<Icon className="w-8 h-8" />   // Extra large 32px
```

---

## 💾 Data Management Patterns

### Supabase Integration

#### 1. Database Queries
```tsx
// Standard query pattern
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .order('created_at', { ascending: false });
```

#### 2. Real-time Subscriptions
```tsx
// Real-time updates
useEffect(() => {
  const subscription = supabase
    .channel('table_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'table_name'
    }, loadData)
    .subscribe();
    
  return () => subscription.unsubscribe();
}, []);
```

#### 3. File Upload Pattern
```tsx
// Storage upload
const { data, error } = await supabase.storage
  .from('bucket_name')
  .upload(`folder/${fileName}`, file);
```

### Error Handling
```tsx
// Consistent error handling with toast notifications
try {
  // Supabase operation
} catch (error) {
  console.error('Operation failed:', error);
  toast({
    title: 'Error',
    description: error.message || 'Operation failed',
    variant: 'destructive'
  });
}
```

### Loading States
```tsx
// Standard loading pattern
if (loading) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p className="ml-4 text-muted-foreground">Loading...</p>
    </div>
  );
}
```

---

## ✅ Best Practices

### Performance Optimization

#### 1. React Optimization
```tsx
// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return complexCalculation(data);
}, [data]);

// Use useCallback for event handlers
const handleClick = useCallback((id: string) => {
  // Handler logic
}, [dependency]);
```

#### 2. Image Optimization
```tsx
// Use ES6 imports for images
import heroImage from '@/assets/hero-image.jpg';

// Implement lazy loading
<img 
  src={heroImage} 
  loading="lazy" 
  alt="Description"
  className="w-full h-auto"
/>
```

#### 3. Bundle Optimization
```tsx
// Dynamic imports for code splitting
const ComponentName = lazy(() => import('./ComponentName'));
```

### Accessibility Guidelines

#### 1. Semantic HTML
```tsx
// Use proper semantic elements
<main> {/* Main content */}
<nav>  {/* Navigation */}
<aside> {/* Sidebar content */}
<article> {/* Standalone content */}
```

#### 2. ARIA Labels
```tsx
// Provide descriptive labels
<button aria-label="Close dialog">
  <X className="w-4 h-4" />
</button>
```

#### 3. Keyboard Navigation
```tsx
// Ensure keyboard accessibility
<div 
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
```

### Code Organization

#### 1. File Structure
```
components/
├── admin/
│   ├── AdminHero.tsx          # Hero sections
│   ├── [Feature]Management.tsx # Main components
│   └── Enhanced[Feature]Card.tsx # Card components
├── ui/
│   ├── button.tsx             # Base components
│   ├── card.tsx
│   └── ...
└── layout/
    ├── AppShell.tsx
    ├── PageLayout.tsx
    └── ...
```

#### 2. Import Organization
```tsx
// 1. React imports
import { useState, useEffect } from 'react';

// 2. Third-party imports
import { format } from 'date-fns';

// 3. Internal imports (components)
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 4. Internal imports (hooks/utils)
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

// 5. Type imports
import type { User } from '@/types';
```

---

## 🔧 Implementation Examples

### Complete Admin Page Example

```tsx
// src/pages/AdminExamplePage.tsx
import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { AdminExampleHero } from '@/components/admin/AdminExampleHero';
import { ViewLayouts } from '@/components/ui/view-layouts';
import { EnhancedExampleCard } from '@/components/example/EnhancedExampleCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

export default function AdminExamplePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('cards');
  const [searchValue, setSearchValue] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('example_table')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setData(data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item =>
    item.title?.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Calculate metrics
  const totalItems = data.length;
  const activeItems = data.filter(item => item.status === 'active').length;
  const completedItems = data.filter(item => item.status === 'completed').length;

  return (
    <AppShell>
      <PageLayout 
        title="Example Management"
        description="Manage and monitor example items"
        primaryAction={{
          label: "Add Example",
          onClick: () => console.log('Add example'),
          icon: <Plus className="w-4 h-4" />
        }}
        showLayoutSelector={true}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showSearch={true}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search examples..."
      >
        {/* Hero Section */}
        <AdminExampleHero 
          totalItems={totalItems}
          activeItems={activeItems}
          completedItems={completedItems}
        />

        {/* Content */}
        <ViewLayouts viewMode={viewMode}>
          {loading ? [
            <div key="loading" className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading examples...</p>
            </div>
          ] : filteredData.length > 0 ? 
            filteredData.map((item) => (
              <EnhancedExampleCard
                key={item.id}
                item={item}
                viewMode={viewMode}
                onEdit={(item) => console.log('Edit:', item)}
                onView={(item) => console.log('View:', item)}
                onDelete={(item) => console.log('Delete:', item)}
              />
            )) : [
            <div key="empty" className="text-center py-12">
              <p className="text-lg font-medium mb-2">No Examples Found</p>
              <p className="text-muted-foreground">No examples match the current search criteria</p>
            </div>
          ]}
        </ViewLayouts>
      </PageLayout>
    </AppShell>
  );
}
```

### Enhanced Card Component Example

```tsx
// src/components/example/EnhancedExampleCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, Calendar } from 'lucide-react';

interface EnhancedExampleCardProps {
  item: {
    id: string;
    title: string;
    description: string;
    status: string;
    created_at: string;
  };
  viewMode: 'cards' | 'list' | 'grid';
  onEdit: (item: any) => void;
  onView: (item: any) => void;
  onDelete: (item: any) => void;
}

export function EnhancedExampleCard({
  item,
  viewMode,
  onEdit,
  onView,
  onDelete
}: EnhancedExampleCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div>
                <h3 className="font-medium text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <Badge className={`${getStatusColor(item.status)} text-xs`}>
                {item.status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(item.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => onView(item)}>
                <Eye className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                <Edit className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(item)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover-scale group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {item.title}
          </CardTitle>
          <Badge className={getStatusColor(item.status)}>
            {item.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {item.description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {new Date(item.created_at).toLocaleDateString()}
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => onView(item)}>
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
              <Edit className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(item)}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 📝 Conclusion

This guide provides the foundation for developing consistent, maintainable, and performant admin interfaces within the Ruwād Innovation Platform. Following these patterns ensures:

- **Consistency** across all admin pages
- **Performance** through optimized React patterns
- **Accessibility** for all users
- **Maintainability** through standardized code organization
- **Scalability** for future feature development

For questions or clarifications, refer to existing implementations in:
- `/admin/events` - Complete reference implementation
- `/admin/evaluations` - Enhanced patterns example
- `/admin/dashboard` - Hero section patterns