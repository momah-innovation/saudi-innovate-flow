# Lovable AI Hooks Usage Guide

## 📚 Complete Hook Reference for Lovable AI Agents

This document provides comprehensive instructions for using all available React hooks in your Lovable project. Always reference this guide when implementing functionality.

---

## 🚀 Performance Optimization Hooks

### **useDebounce** - Input Optimization
```typescript
import { useDebounce } from '@/hooks/useDebounce';
// OR
import { useDebounce } from '@/hooks/performance/use-debounce-throttle';

const debouncedValue = useDebounce(searchQuery, 300);
```
**When to use:** Search inputs, form validation, API calls triggered by user input
**Example:** Search functionality, filter inputs, live validation

### **useThrottle** - Function Rate Limiting
```typescript
import { useThrottle } from '@/hooks/performance/use-debounce-throttle';

const throttledScrollHandler = useThrottle(handleScroll, 100);
```
**When to use:** Scroll handlers, resize events, frequent user interactions
**Example:** Infinite scroll, window resize, drag operations

### **useOptimizedCallback** - Memoized Callbacks
```typescript
import { useOptimizedCallback } from '@/hooks/performance/use-optimization';

const handleClick = useOptimizedCallback((id: string) => {
  // expensive operation
}, [dependencies]);
```
**When to use:** Expensive callback functions, preventing unnecessary re-renders
**Example:** Complex calculations, data transformations, event handlers

### **useExpensiveMemo** - Performance Monitoring Memo
```typescript
import { useExpensiveMemo } from '@/hooks/performance/use-optimization';

const expensiveValue = useExpensiveMemo(
  () => heavyComputation(data),
  [data],
  'HeavyComputation'
);
```
**When to use:** Heavy computations, data processing, expensive calculations
**Example:** Chart data processing, complex filtering, mathematical operations

### **usePerformanceMonitor** - Component Performance
```typescript
import { usePerformanceMonitor } from '@/hooks/performance/use-optimization';

const SystemSettings = () => {
  const performanceMonitor = usePerformanceMonitor('SystemSettings');
  // ... component logic
};
```
**When to use:** Critical components, performance bottlenecks, admin pages
**Example:** Dashboard components, data tables, complex forms

### **useRenderTracker** - Render Debugging
```typescript
import { useRenderTracker } from '@/hooks/performance/use-optimization';

const MyComponent = (props) => {
  useRenderTracker('MyComponent', props);
  // ... component logic
};
```
**When to use:** Debugging render issues, optimizing re-renders
**Example:** Components with frequent updates, performance debugging

---

## 🔍 UI Enhancement Hooks

### **useIntersectionObserver** - Visibility Detection
```typescript
import { useIntersectionObserver } from '@/hooks/performance/use-intersection';

const elementRef = useRef<HTMLDivElement>(null);
const { isIntersecting, hasIntersected } = useIntersectionObserver(
  elementRef,
  { threshold: 0.1 },
  (entry) => console.log('Element visible')
);
```
**When to use:** Lazy loading, animations on scroll, analytics tracking
**Example:** Image lazy loading, scroll animations, view tracking

### **useLazyImage** - Image Optimization
```typescript
import { useLazyImage } from '@/hooks/performance/use-intersection';

const { ref, src, isLoaded, hasError } = useLazyImage(
  'https://example.com/image.jpg',
  '/placeholder.jpg'
);

return <img ref={ref} src={src} className={isLoaded ? 'loaded' : 'loading'} />;
```
**When to use:** Image galleries, content with many images, performance optimization
**Example:** Photo galleries, user avatars, content images

### **useVirtualList** - Large List Optimization
```typescript
import { useVirtualList } from '@/hooks/performance/use-advanced';

const { visibleItems, totalHeight, offsetY, onScroll } = useVirtualList(
  items,
  50, // itemHeight
  400 // containerHeight
);
```
**When to use:** Large datasets, infinite lists, performance-critical lists
**Example:** Data tables, chat messages, search results

### **useElementSize** - Size Tracking
```typescript
import { useElementSize } from '@/hooks/performance/use-advanced';

const { ref, width, height } = useElementSize<HTMLDivElement>();

return <div ref={ref}>Size: {width}x{height}</div>;
```
**When to use:** Responsive components, dynamic layouts, size-dependent logic
**Example:** Responsive charts, dynamic grids, adaptive UI

### **useOptimizedSearch** - Advanced Search
```typescript
import { useOptimizedSearch } from '@/hooks/performance/use-advanced';

const { query, setQuery, results, isSearching } = useOptimizedSearch(
  items,
  (item, query) => item.name.toLowerCase().includes(query.toLowerCase()),
  300 // debounce delay
);
```
**When to use:** Complex search functionality, large datasets, filtered lists
**Example:** User search, content filtering, data exploration

### **usePrefetchOnHover** - Data Prefetching
```typescript
import { usePrefetchOnHover } from '@/hooks/performance/use-advanced';

const { onMouseEnter, onMouseLeave } = usePrefetchOnHover('userDetails', userId);
```
**When to use:** Improving perceived performance, predictive loading
**Example:** Navigation prefetch, modal content, user profiles

---

## 🔐 Authentication & Authorization

### **useAuth** - Authentication Context
```typescript
import { useAuth } from '@/contexts/AuthContext';

const { userProfile, hasRole, signIn, signOut, loading } = useAuth();
```
**When to use:** All authenticated components, user-specific functionality
**Example:** Profile pages, user actions, authentication gates

### **useRoleAccess** - Permission Management
```typescript
import { useRoleAccess } from '@/hooks/useRoleAccess';

const { permissions, getPrimaryRole, canAccess } = useRoleAccess();

if (!permissions.canManageSystem) {
  return <AccessDenied />;
}
```
**When to use:** Admin features, role-based UI, permission checks
**Example:** Admin panels, user management, feature toggles

---

## 🌐 Translation & Internationalization

### **useUnifiedTranslation** - Translation System
```typescript
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

const { t, language, isRTL, formatNumber } = useUnifiedTranslation();

// Usage examples:
const title = t('system_settings_page.title', 'System Settings');
const formattedPrice = formatNumber(1234.56);
```
**When to use:** All user-facing text, internationalized components
**Example:** Page titles, form labels, messages, numbers

### **useDirection** - RTL/LTR Support
```typescript
import { useDirection } from '@/components/ui/direction-provider';

const { isRTL, direction } = useDirection();

const className = `container ${isRTL ? 'text-right' : 'text-left'}`;
```
**When to use:** Layout components, text alignment, directional styling
**Example:** Page layouts, form alignment, navigation

---

## 📊 Data Management Hooks

### **useSystemSettings** - System Configuration
```typescript
import { useSystemSettings } from '@/contexts/SystemSettingsContext';

const { 
  uiInitialsMaxLength, 
  notificationFetchLimit, 
  loading, 
  refetch 
} = useSystemSettings();
```
**When to use:** Configuration-dependent features, system limits
**Example:** UI constraints, feature limits, system behavior

### **useSystemLists** - System Data Lists
```typescript
import { useSystemLists } from '@/hooks/useSystemLists';

const { 
  roleRequestStatusOptions, 
  challengeStatusOptions,
  refreshLists 
} = useSystemLists();
```
**When to use:** Dropdown options, status lists, system enumerations
**Example:** Status selects, category filters, option lists

### **useTags** - Tag Management
```typescript
import { useTags } from '@/hooks/useTags';

const { tags, createTag, updateTag, deleteTag, loading } = useTags();
```
**When to use:** Tagging systems, categorization features
**Example:** Content tags, categories, labels

---

## 📱 UI State Management

### **useToast** - User Notifications
```typescript
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

const handleSuccess = () => {
  toast({
    title: "Success",
    description: "Operation completed successfully",
    variant: "default"
  });
};
```
**When to use:** User feedback, operation results, error messages
**Example:** Form submissions, API responses, user actions

### **useIsMobile** - Responsive Design
```typescript
import { useIsMobile } from '@/hooks/use-mobile';

const isMobile = useIsMobile();

return (
  <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
    {content}
  </div>
);
```
**When to use:** Responsive components, mobile-specific features
**Example:** Navigation menus, layout changes, touch interactions

### **useBookmarks** - Bookmark Management
```typescript
import { useBookmarks } from '@/hooks/useBookmarks';

const { bookmarks, addBookmark, removeBookmark, isBookmarked } = useBookmarks();
```
**When to use:** Favorite systems, saved content, user preferences
**Example:** Saved articles, favorite challenges, bookmarked events

---

## 🔧 Specialized Hooks

### **useFileUploader** - File Upload Management
```typescript
import { useFileUploader } from '@/hooks/useFileUploader';

const { uploadFile, uploadProgress, isUploading, error } = useFileUploader();
```
**When to use:** File upload features, document management
**Example:** Profile images, document uploads, media content

### **useEventDetails** - Event Management
```typescript
import { useEventDetails } from '@/hooks/useEventDetails';

const { event, participants, loading, joinEvent, leaveEvent } = useEventDetails(eventId);
```
**When to use:** Event pages, event interactions, event data
**Example:** Event details, participant management, event actions

### **useRealTimeAnalytics** - Live Analytics
```typescript
import { useRealTimeAnalytics } from '@/hooks/useRealTimeAnalytics';

const { analytics, isConnected } = useRealTimeAnalytics({ 
  opportunityId,
  onAnalyticsUpdate: (data) => console.log(data)
});
```
**When to use:** Real-time dashboards, live metrics, analytics views
**Example:** Admin dashboards, real-time stats, live monitoring

### **useStorageAnalytics** - Storage Management
```typescript
import { useStorageAnalytics } from '@/hooks/useStorageAnalytics';

const { 
  totalUsage, 
  quotaLimit, 
  usageByType, 
  loading 
} = useStorageAnalytics();
```
**When to use:** Storage management, quota displays, usage tracking
**Example:** Storage dashboards, quota warnings, usage analytics

---

## ⚡ Best Practices for Hook Usage

### 1. **Always Import from Correct Paths**
```typescript
// ✅ Correct - specific imports
import { useDebounce } from '@/hooks/useDebounce';
import { useAuth } from '@/contexts/AuthContext';

// ❌ Avoid - generic imports
import * from '@/hooks';
```

### 2. **Performance Hook Combinations**
```typescript
// ✅ Combine for optimal performance
const Component = () => {
  const debouncedQuery = useDebounce(searchQuery, 300);
  const throttledScroll = useThrottle(handleScroll, 100);
  const performanceMonitor = usePerformanceMonitor('Component');
  
  const optimizedResults = useOptimizedSearch(
    items, 
    searchFunction, 
    300
  );
};
```

### 3. **Error Handling with Hooks**
```typescript
// ✅ Always handle loading and error states
const { data, loading, error, refetch } = useSystemSettings();

if (loading) return <Spinner />;
if (error) return <ErrorMessage onRetry={refetch} />;
```

### 4. **Conditional Hook Usage**
```typescript
// ✅ Use hooks conditionally when needed
const MyComponent = ({ enableAnalytics }) => {
  const analytics = enableAnalytics ? useRealTimeAnalytics() : null;
  const { toast } = useToast();
  
  // ... component logic
};
```

### 5. **Hook Dependencies**
```typescript
// ✅ Properly manage dependencies
const expensiveValue = useExpensiveMemo(
  () => processData(data, filters),
  [data, filters], // Include all dependencies
  'DataProcessing'
);
```

---

## 🎯 Hook Selection Guidelines

### **Authentication Required**
- `useAuth` - Always use for user-specific features
- `useRoleAccess` - Use for permission-based UI

### **Performance Critical**
- `useDebounce` - For search/input optimization
- `useThrottle` - For frequent events
- `usePerformanceMonitor` - For monitoring
- `useVirtualList` - For large lists

### **Internationalization**
- `useUnifiedTranslation` - For all text content
- `useDirection` - For layout adjustments

### **Data Management**
- `useSystemSettings` - For configuration data
- `useSystemLists` - For dropdown options
- Real-time hooks - For live data

### **User Experience**
- `useToast` - For user feedback
- `useIsMobile` - For responsive behavior
- `useIntersectionObserver` - For scroll-based features

---

## 🚨 Common Pitfalls to Avoid

1. **Don't use hooks conditionally in render**
2. **Always handle loading and error states**
3. **Use proper dependency arrays**
4. **Import from specific paths**
5. **Combine related hooks for better performance**
6. **Use TypeScript for better type safety**

---

*This guide should be referenced for all development work in Lovable projects. Keep it updated as new hooks are added.*