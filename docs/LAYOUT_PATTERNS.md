# Layout Patterns & Standards

## 🚨 Critical Issues Fixed

### Double AppShell Wrapping (FIXED)
Many admin pages were double-wrapped:
- ✅ **Before**: `withAppShell: true` in routing + manual `<AppShell>` wrapping 
- ✅ **After**: Only `withAppShell: true` in routing + `PageLayout` inside

### Standard Patterns

## 1. **Authenticated Admin Pages** (Recommended)
**Use when**: Admin/authenticated pages with navigation
**Pattern**: `withAppShell: true` in routing + `PageLayout` in component

```tsx
// ✅ CORRECT - In routing (UnifiedRouter.tsx)
{
  path: '/admin/users',
  component: UserManagement,
  withAppShell: true,           // ← Provides AppShell
  requireAuth: true,
  requiredRole: ['admin']
}

// ✅ CORRECT - In component (UserManagement.tsx)
export default function UserManagement() {
  return (
    <PageLayout                  // ← Just PageLayout, no AppShell
      title="User Management"
      description="Manage system users"
      primaryAction={{...}}
      // ... other props
    >
      {/* Content */}
    </PageLayout>
  );
}
```

## 2. **Simple Pages Without Navigation**
**Use when**: Standalone pages, public pages, or pages needing custom shell
**Pattern**: Manual `<AppShell>` + `PageLayout`

```tsx
// ✅ CORRECT - For simple pages
export default function SimpleAdminPage() {
  return (
    <AppShell>                   // ← Manual AppShell
      <PageLayout
        title="Simple Page"
        // ... props
      >
        {/* Content */}
      </PageLayout>
    </AppShell>
  );
}
```

## 3. **Public Pages**
**Use when**: Landing pages, auth pages, marketing pages
**Pattern**: Custom layout or standalone `PageLayout`

```tsx
// ✅ CORRECT - For public pages
export default function PublicPage() {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <PageLayout
        title="Public Content"
        // ... props
      >
        {/* Content */}
      </PageLayout>
      <Footer />
    </div>
  );
}
```

## Component Responsibilities

### **AppShell**
- **Purpose**: Full app structure (navigation, header, sidebar, auth)
- **Provides**: Navigation, authentication, theme, internationalization
- **When**: Use for authenticated application pages

### **PageLayout** 
- **Purpose**: Content structure (title, actions, filters, search)
- **Provides**: Page header, actions, layout selector, search, filters
- **When**: Use INSIDE AppShell or for content-only layouts

### **PageHeader** (Deprecated)
- **Status**: ❌ Don't use with AppShell (causes conflicts)
- **Replacement**: Use `PageLayout` title/description props instead

## Migration Checklist

### ✅ Fixed Issues:
1. **Removed double AppShell wrapping** in 15+ admin pages
2. **Standardized pattern**: `withAppShell: true` routing + `PageLayout` component  
3. **Eliminated PageHeader conflicts** with AppShell
4. **Consistent header strategy** across all admin pages

### ✅ Current Status:
- **Admin pages**: All use `withAppShell: true` + `PageLayout` 
- **Dashboard pages**: Properly structured
- **Workspace pages**: Well-organized
- **Public pages**: Use appropriate layouts

## Rules Summary

1. **ONE AppShell rule**: Either routing (`withAppShell: true`) OR manual wrapping, never both
2. **PageLayout everywhere**: Use `PageLayout` for consistent content structure
3. **No PageHeader**: Don't mix `PageHeader` with `AppShell` 
4. **Components stay put**: Only move actual page files, keep components in place

## Examples of Fixes Made

### Before (❌ Wrong):
```tsx
// WRONG - Double wrapping
export default function AdminPage() {
  return (
    <AppShell>              // ← Manual wrap
      <PageLayout>          // ← AND routing has withAppShell: true
        {/* Content */}
      </PageLayout>
    </AppShell>
  );
}
```

### After (✅ Correct):
```tsx
// CORRECT - Single responsibility
export default function AdminPage() {
  return (
    <PageLayout>            // ← Only PageLayout
      {/* Content */}       // ← AppShell from routing
    </PageLayout>
  );
}
```

This ensures no duplicate headers, proper navigation, and consistent user experience across all pages.
