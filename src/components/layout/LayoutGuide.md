# Layout Architecture Guide

## Overview
This guide outlines the containerization and structure system from global to local component levels to avoid layout issues.

## 1. Global Level (App Structure)

### App Root
```tsx
<App>
  <DirectionProvider>
    <ThemeProvider>
      <AuthContextProvider>
        <Router>
          <Routes />
        </Router>
      </AuthContextProvider>
    </ThemeProvider>
  </DirectionProvider>
</App>
```

### Layout Providers
- **DirectionProvider**: Handles RTL/LTR support
- **ThemeProvider**: Manages theme and design tokens
- **SidebarProvider**: Controls sidebar state

## 2. Page Level (Layout Templates)

### AdminLayout
```tsx
<AdminLayout breadcrumbs={breadcrumbs}>
  <PageContainer>
    <Section>
      <ContentArea layout="stack">
        {/* Page content */}
      </ContentArea>
    </Section>
  </PageContainer>
</AdminLayout>
```

### Components:
- **AdminLayout**: Main layout with header, sidebar, breadcrumbs
- **PageContainer**: Page wrapper with consistent spacing and max-width
- **Section**: Semantic sections with background and spacing options
- **ContentArea**: Flexible content layout (stack, grid, sidebar)

## 3. Container Level (Content Organization)

### Container Hierarchy:
```tsx
<PageContainer maxWidth="xl" padding="lg">
  <Section spacing="lg" background="card">
    <Container size="lg" center>
      <ContentArea layout="grid-3" gap="lg">
        {/* Content blocks */}
      </ContentArea>
    </Container>
  </Section>
</PageContainer>
```

### Spacing System:
- **none**: 0
- **sm**: 1rem (16px)
- **md**: 1.5rem (24px) 
- **lg**: 2rem (32px)
- **xl**: 3rem (48px)

## 4. Component Level (UI Components)

### Data Display Components:
```tsx
<ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
  <DataCard>
    <CardHeader>
      <PageHeader />
    </CardHeader>
    <CardContent>
      <ContentArea layout="stack" gap="sm">
        {/* Card content */}
      </ContentArea>
    </CardContent>
  </DataCard>
</ResponsiveGrid>
```

### Form Components:
```tsx
<FormLayout variant="single-column" spacing="lg">
  <FormFieldGroup title="Basic Information">
    <FormField>
      <Input />
    </FormField>
  </FormFieldGroup>
</FormLayout>
```

## 5. Responsive Design Patterns

### Breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: 1024px - 1280px
- **Wide**: > 1280px

### Grid Patterns:
```tsx
// Auto-fit grid
<ResponsiveGrid autoFit minItemWidth="300px" />

// Fixed columns
<ResponsiveGrid columns={{ mobile: 1, desktop: 3 }} />

// Sidebar layout
<ContentArea layout="sidebar-left" />
```

## 6. Position and Alignment

### Flexbox Utilities:
```tsx
<ContentArea 
  layout="stack" 
  align="center" 
  justify="between"
  gap="lg"
/>
```

### Grid Alignment:
```tsx
<ResponsiveGrid 
  columns={{ desktop: 3 }}
  className="items-start justify-items-center"
/>
```

## 7. Best Practices

### Layout Consistency:
1. Always use PageContainer for page-level spacing
2. Use Section for semantic content grouping
3. Apply ResponsiveGrid for item collections
4. Use ContentArea for flexible layouts

### Avoiding Layout Issues:
1. **Fixed Heights**: Avoid fixed heights, use min-height
2. **Overflow**: Set overflow-hidden on containers when needed
3. **Z-index**: Use semantic z-index values from design tokens
4. **Positioning**: Prefer flexbox/grid over absolute positioning

### Performance:
1. Use CSS Grid for 2D layouts
2. Use Flexbox for 1D layouts
3. Minimize nested containers
4. Use responsive utilities efficiently

## 8. Component API

### PageContainer Props:
- `maxWidth`: Container max-width
- `padding`: Internal spacing
- `background`: Background variant

### Section Props:
- `spacing`: Vertical padding
- `background`: Background color
- `border`: Add border
- `shadow`: Drop shadow

### ContentArea Props:
- `layout`: Layout pattern (stack, grid, sidebar)
- `gap`: Spacing between items
- `align`: Cross-axis alignment
- `justify`: Main-axis alignment

### ResponsiveGrid Props:
- `columns`: Responsive column configuration
- `gap`: Grid gap
- `autoFit`: Auto-fit based on min width
- `minItemWidth`: Minimum item width for auto-fit

## 9. Usage Examples

### Admin Page Structure:
```tsx
export function CampaignsPage() {
  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <Section spacing="lg">
        <PageHeader title="Campaigns" />
        
        <ContentArea layout="stack" gap="lg">
          <SearchAndFilters />
          
          <ResponsiveGrid 
            columns={{ mobile: 1, tablet: 2, desktop: 3 }}
            gap="md"
          >
            {campaigns.map(campaign => (
              <DataCard key={campaign.id} />
            ))}
          </ResponsiveGrid>
        </ContentArea>
      </Section>
    </AdminLayout>
  );
}
```

### Dashboard Layout:
```tsx
export function Dashboard() {
  return (
    <AdminLayout>
      <ContentArea layout="grid-3" gap="lg">
        <Section className="col-span-2">
          <MetricCard />
        </Section>
        
        <Section>
          <RecentActivity />
        </Section>
      </ContentArea>
    </AdminLayout>
  );
}
```

This architecture ensures consistent layouts, proper responsiveness, and maintainable component structure across the entire application.