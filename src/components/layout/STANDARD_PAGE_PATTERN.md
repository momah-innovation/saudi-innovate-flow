# Standard Page Pattern

This document outlines the standardized page pattern that should be used across all admin pages in the application.

## Overview

The `StandardPageLayout` component provides a consistent structure for all admin pages, including:

- **Page Header** with title, description, and action buttons
- **Layout Selector** for switching between Cards, List, Grid, and special layouts
- **Search and Filters** functionality
- **Bulk Actions** for selected items
- **Content Area** that adapts to the selected layout

## Basic Usage

```tsx
import { StandardPageLayout } from "@/components/layout/StandardPageLayout";

export function MyAdminPage() {
  return (
    <StandardPageLayout
      title="My Page Title"
      description="Page description"
      addButton={{
        label: "Add New Item",
        onClick: () => handleAdd()
      }}
    >
      {/* Your content items */}
    </StandardPageLayout>
  );
}
```

## Component Features

### 1. Page Header
- **Title and Description**: Clear page identification
- **Item Count**: Automatically displayed when provided
- **Add Button**: Standardized "Add New" functionality
- **Additional Actions**: Export, import, or other page-specific actions

### 2. Layout Options
Supports multiple view modes:
- **Cards**: Grid of cards (default)
- **List**: Vertical list layout
- **Grid**: Compact grid layout
- **Calendar**: For date-based content
- **Gantt**: For project timelines
- **Timeline**: For chronological content

### 3. Search and Filtering
- **Search Input**: Global text search
- **Quick Filters**: Badge-style filters
- **Advanced Filters**: Collapsible filter section
- **Clear Filters**: Reset all filters

### 4. Bulk Actions
- **Select All**: Master checkbox
- **Individual Selection**: Item-level checkboxes
- **Action Buttons**: Edit, Delete, Archive, etc.
- **Dynamic Visibility**: Only shown when items are available

## Configuration Options

### Add Button
```tsx
addButton={{
  label: "Add New Campaign",
  icon: <Plus className="w-4 h-4" />,
  onClick: () => openCreateDialog()
}}
```

### Layout Configuration
```tsx
supportedLayouts={['cards', 'list', 'grid']}
defaultLayout="cards"
onLayoutChange={(layout) => setCurrentLayout(layout)}
```

### Search and Filters
```tsx
searchTerm={searchTerm}
onSearchChange={setSearchTerm}
filters={[
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Draft', value: 'draft' }
    ],
    onChange: (value) => setStatusFilter(value)
  }
]}
onClearFilters={() => resetAllFilters()}
```

### Bulk Actions
```tsx
selectedItems={selectedIds}
onSelectAll={handleSelectAll}
onSelectItem={handleSelectItem}
bulkActions={[
  {
    id: 'delete',
    label: 'Delete Selected',
    icon: <Trash2 className="w-4 h-4" />,
    onClick: (ids) => handleBulkDelete(ids),
    variant: 'destructive'
  }
]}
```

## Page Scope Considerations

### Visibility Rules
- **Layout Selector**: Only visible if multiple layouts are supported
- **Search**: Only visible if `onSearchChange` is provided
- **Filters**: Only visible if filters array is not empty
- **Bulk Actions**: Only visible if bulk actions are defined and items exist

### Content-Specific Layouts
- **Calendar View**: For events, schedules, deadlines
- **Gantt Chart**: For project management, timelines
- **Timeline View**: For historical data, activity logs
- **Cards/List/Grid**: For general data display

## Implementation Guidelines

### 1. Required Props
Every page should have:
- `title`: Clear, descriptive page title
- `addButton`: For creating new records
- `children`: The content to display

### 2. Recommended Props
Most pages should include:
- `description`: Brief explanation of the page
- `itemCount`: Number of items being displayed
- `searchTerm` and `onSearchChange`: For search functionality
- `selectedItems` and bulk action handlers: For multi-item operations

### 3. Content Rendering
```tsx
// Render your items as an array of components
const renderItems = () => {
  return items.map((item) => (
    <DataCard
      key={item.id}
      item={item}
      title={item.title}
      selected={selectedItems.includes(item.id)}
      onSelect={(selected) => handleSelectItem(item.id, selected)}
    />
  ));
};

return (
  <StandardPageLayout {...props}>
    {renderItems()}
  </StandardPageLayout>
);
```

## Examples

### Basic Data Management Page
```tsx
export function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  return (
    <StandardPageLayout
      title="Campaigns Management"
      description="Manage innovation campaigns and initiatives"
      itemCount={campaigns.length}
      addButton={{
        label: "Create Campaign",
        onClick: () => openCreateDialog()
      }}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      selectedItems={selectedItems}
      onSelectAll={handleSelectAll}
      onSelectItem={handleSelectItem}
      bulkActions={campaignBulkActions}
      totalItems={campaigns.length}
    >
      {renderCampaigns()}
    </StandardPageLayout>
  );
}
```

### Special Layout Page (Calendar)
```tsx
export function EventsPage() {
  return (
    <StandardPageLayout
      title="Events Calendar"
      supportedLayouts={['calendar', 'cards', 'list']}
      defaultLayout="calendar"
      customRenderer={(layout, children) => {
        if (layout === 'calendar') {
          return <CalendarView events={children} />;
        }
        return children;
      }}
    >
      {events}
    </StandardPageLayout>
  );
}
```

## Migration from Existing Pages

To migrate an existing page:

1. Replace page wrapper with `StandardPageLayout`
2. Move page title/description to component props
3. Move add button to `addButton` prop
4. Implement search and filter props
5. Add bulk action support
6. Ensure content is rendered as array of components

This standardization ensures consistency across all admin pages while maintaining flexibility for page-specific requirements.