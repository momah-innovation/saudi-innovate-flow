# Layout Architecture Hierarchy

This document outlines the complete layout architecture from global to local component levels, with RTL/LTR support throughout.

## 🏗️ Architecture Overview

```
Global Level
├── DirectionProvider (RTL/LTR)
├── ThemeProvider (Light/Dark)
└── AppLayout (Layout Router)

Page Level
├── PageContainer (Max width, padding, background)
├── PageHeader (Title, description, actions)
└── Section (Semantic grouping)

Content Level
├── ContentArea (Main content wrapper)
├── ResponsiveGrid (Grid layouts)
└── Container (Responsive containers)

Component Level
├── Card, Table, Form components
├── DirectionalDropdownMenu
└── DirectionalSidebar

Local Level
└── Individual UI elements (Button, Input, etc.)
```

## 🌟 Global Level

### DirectionProvider
- **Purpose**: Manages RTL/LTR direction and language
- **Features**: Auto-detection, localStorage persistence, direction utils
- **Usage**: Wraps entire app in `main.tsx`

### ThemeProvider  
- **Purpose**: Manages light/dark mode and theme variants
- **Features**: System preference detection, theme presets
- **Usage**: Wraps app after DirectionProvider

### AppLayout
- **Purpose**: Routes between AdminLayout and public layout
- **Features**: Authentication-based layout switching
- **Usage**: Root layout component for all pages

## 📄 Page Level

### PageContainer
```tsx
<PageContainer maxWidth="full" padding="lg" background="default">
  {/* Page content */}
</PageContainer>
```
- **Purpose**: Consistent page wrapper with max-width and padding
- **Props**: `maxWidth`, `padding`, `background`, RTL-aware
- **Variants**: sm, md, lg, xl, 2xl, full

### PageHeader
```tsx
<PageHeader 
  title="Page Title"
  description="Page description"
  action={<Button>Action</Button>}
  itemCount={42}
/>
```
- **Purpose**: Standardized page headers with title, description, actions
- **Features**: RTL support, item counts, flexible actions
- **Usage**: At the top of page content

### Section
```tsx
<Section spacing="lg" background="card" border rounded>
  {/* Section content */}
</Section>
```
- **Purpose**: Semantic content grouping
- **Props**: `spacing`, `background`, `border`, `rounded`, `shadow`
- **Usage**: Wraps logical page sections

## 🎯 Content Level

### ContentArea
```tsx
<ContentArea maxWidth="4xl" spacing="lg">
  {/* Main content */}
</ContentArea>
```
- **Purpose**: Main content wrapper with consistent spacing
- **Features**: Responsive max-width, RTL support
- **Usage**: Inside sections for primary content

### ResponsiveGrid
```tsx
<ResponsiveGrid columns={3} gap="lg" minItemWidth="300px">
  {items.map(item => <Card key={item.id} />)}
</ResponsiveGrid>
```
- **Purpose**: Responsive grid layouts
- **Features**: Auto-responsive columns, RTL support
- **Usage**: For card grids, dashboards

### Container
```tsx
<Container size="xl" padding="lg" center>
  {/* Container content */}
</Container>
```
- **Purpose**: Responsive width containers
- **Features**: Breakpoint-based max-widths
- **Usage**: Content width management

## 🧩 Component Level

### Directional Components
All layout components support RTL/LTR:

- **DirectionalSidebar**: RTL-aware sidebar navigation
- **DirectionalHeader**: RTL-aware header with language switcher
- **DirectionalDropdownMenu**: RTL-aware dropdown menus
- **FlexLayout**: RTL-aware flex layouts

### Layout Grids
```tsx
<LayoutGrid columns="auto" gap="md" alignment="stretch">
  <Card />
  <Card />
  <Card />
</LayoutGrid>
```

## 🎨 Implementation Examples

### Admin Page Structure
```tsx
export default function AdminPage() {
  const breadcrumbs = [
    { label: "Admin", href: "/admin" },
    { label: "Users", href: "/admin/users" }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <PageContainer maxWidth="full" padding="lg">
        <PageHeader 
          title="User Management"
          description="Manage system users and permissions"
          action={<Button>Add User</Button>}
          itemCount={users.length}
        />
        
        <Section spacing="lg">
          <ContentArea>
            {/* Main content here */}
          </ContentArea>
        </Section>
      </PageContainer>
    </AppLayout>
  );
}
```

### Dashboard Layout
```tsx
export default function Dashboard() {
  return (
    <AppLayout>
      <PageContainer maxWidth="full" padding="lg">
        <PageHeader title="Dashboard" description="System overview" />
        
        <Section spacing="lg">
          <ResponsiveGrid columns="auto" gap="lg" minItemWidth="300px">
            <MetricCard title="Users" value={1234} />
            <MetricCard title="Projects" value={567} />
            <MetricCard title="Events" value={89} />
          </ResponsiveGrid>
        </Section>

        <Section spacing="lg" background="card" rounded>
          <ContentArea>
            <DataTable data={tableData} />
          </ContentArea>
        </Section>
      </PageContainer>
    </AppLayout>
  );
}
```

### Form Page Layout
```tsx
export default function FormPage() {
  return (
    <AppLayout>
      <PageContainer maxWidth="lg" padding="lg">
        <PageHeader title="Create Project" />
        
        <Section background="card" rounded>
          <ContentArea>
            <FormLayout>
              <FormFieldGroup title="Basic Information">
                <FormField label="Name" required>
                  <Input />
                </FormField>
                <FormField label="Description">
                  <Textarea />
                </FormField>
              </FormFieldGroup>
            </FormLayout>
          </ContentArea>
        </Section>
      </PageContainer>
    </AppLayout>
  );
}
```

## 🌍 RTL/LTR Support

### Direction Controls
- **Language Switcher**: EN/العربية button in header
- **Manual Toggle**: Direction toggle in language dropdown
- **Auto-Detection**: Browser language detection
- **Persistence**: localStorage saves preferences

### RTL-Aware Components
All layout components automatically adapt:
- **Text Alignment**: `text-left` becomes `text-right`
- **Flex Direction**: `flex-row` becomes `flex-row-reverse`
- **Margins/Padding**: `ml-4` becomes `mr-4` in RTL
- **Border Radius**: `rounded-l` becomes `rounded-r`

### Direction Utilities
```tsx
import { useDirection, directionUtils } from '@/components/ui';

const { isRTL } = useDirection();

// Utility functions
const marginClass = directionUtils.ml(isRTL); // 'mr' in RTL, 'ml' in LTR
const textAlign = directionUtils.textLeft(isRTL); // 'text-right' in RTL
```

## 📱 Responsive Behavior

### Breakpoint System
- **Mobile First**: All layouts start mobile-optimized
- **Container Sizes**: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- **Grid Adaptation**: Auto-responsive column counts
- **Spacing Scale**: Consistent spacing across breakpoints

### Mobile Optimizations
- **Sidebar Collapse**: Auto-collapse on mobile
- **Header Adaptation**: Compact header on small screens
- **Grid Stacking**: Cards stack on mobile
- **Touch Targets**: Larger touch areas on mobile

This architecture ensures consistent, accessible, and internationalized layouts across the entire application.