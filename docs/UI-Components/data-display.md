# Data Display Components

Components for presenting, organizing, and visualizing data in the enterprise management system.

## 📊 Tables & Lists

### DataTable Component
**Location**: `src/components/ui/data-table.tsx`

The primary table component used throughout the system.

```typescript
import { DataTable, Column } from '@/components/ui/data-table';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

const columns: Column<User>[] = [
  { key: 'name', title: 'Name' },
  { key: 'email', title: 'Email' },
  { key: 'status', title: 'Status' }
];

<DataTable 
  data={users}
  columns={columns}
  searchable
  sortable
  onSort={(key, direction) => handleSort(key, direction)}
/>
```

**Features**:
- **Sorting**: Click column headers to sort
- **Search**: Built-in search functionality
- **Pagination**: Automatic pagination for large datasets
- **Selection**: Multi-select with bulk actions
- **Filtering**: Advanced filtering capabilities
- **Responsive**: Mobile-friendly layouts
- **Loading States**: Skeleton loading during data fetch

**Props**:
```typescript
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  selectedItems?: string[];
  onSelectItem?: (id: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  searchable?: boolean;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  sortKey?: keyof T;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
  loading?: boolean;
  emptyMessage?: string;
}
```

### Advanced DataTable
**Location**: `src/components/ui/advanced-data-table.tsx`

Enhanced table with advanced features:

```typescript
import { AdvancedDataTable } from '@/components/ui/advanced-data-table';

<AdvancedDataTable
  data={data}
  columns={columns}
  filters={filterConfig}
  actions={tableActions}
  exportOptions={['csv', 'excel', 'pdf']}
  virtualScroll
  groupBy="category"
/>
```

**Advanced Features**:
- **Virtual Scrolling**: Handle thousands of rows
- **Grouping**: Group rows by column values
- **Export**: Built-in export to CSV, Excel, PDF
- **Column Resizing**: Drag to resize columns
- **Column Reordering**: Drag to reorder columns
- **Fixed Headers**: Sticky headers during scroll
- **Cell Editing**: Inline editing capabilities

### Action Menu
**Location**: `src/components/ui/action-menu.tsx`

Dropdown menu for row actions:

```typescript
import { ActionMenu, getViewEditDeleteActions } from '@/components/ui/action-menu';

const actions = getViewEditDeleteActions(
  () => handleView(item),
  () => handleEdit(item),
  () => handleDelete(item)
);

<ActionMenu actions={actions} />
```

## 📈 Charts & Visualizations

### Chart Components
**Location**: Various chart components using Recharts

#### Line Chart
```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="value" stroke="#8884d8" />
  </LineChart>
</ResponsiveContainer>
```

#### Bar Chart
```typescript
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="value" fill="#8884d8" />
  </BarChart>
</ResponsiveContainer>
```

#### Pie Chart
```typescript
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      labelLine={false}
      outerRadius={80}
      fill="#8884d8"
      dataKey="value"
    />
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>
```

## 📅 Calendar Components

### Calendar Scheduler
**Location**: `src/components/ui/calendar-scheduler.tsx`

Full-featured calendar with event management:

```typescript
import { CalendarView } from '@/components/ui/calendar-scheduler';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'meeting' | 'task' | 'reminder';
  description?: string;
}

<CalendarView
  events={events}
  onEventClick={handleEventClick}
  onDateSelect={handleDateSelect}
  onEventCreate={handleEventCreate}
  view="month" // 'month' | 'week' | 'day'
/>
```

**Features**:
- **Multiple Views**: Month, week, day views
- **Event Management**: Create, edit, delete events
- **Drag & Drop**: Move events between dates
- **Recurring Events**: Support for recurring patterns
- **Time Zones**: Multi-timezone support
- **Export**: iCal export functionality

### Date Picker
**Location**: `src/components/ui/calendar.tsx`

```typescript
import { Calendar } from '@/components/ui/calendar';

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  className="rounded-md border"
/>
```

## 🏷️ Badge & Status Components

### Status Badge
**Location**: `src/components/ui/StatusBadge.tsx`

```typescript
import { StatusBadge } from '@/components/ui/StatusBadge';

<StatusBadge status="active" />    {/* Green */}
<StatusBadge status="pending" />   {/* Yellow */}
<StatusBadge status="inactive" />  {/* Gray */}
<StatusBadge status="error" />     {/* Red */}
```

### Priority Badge
**Location**: `src/components/ui/PriorityBadge.tsx`

```typescript
import { PriorityBadge } from '@/components/ui/PriorityBadge';

<PriorityBadge priority="high" />     {/* Red */}
<PriorityBadge priority="medium" />   {/* Orange */}
<PriorityBadge priority="low" />      {/* Green */}
```

### Type Badge
**Location**: `src/components/ui/TypeBadge.tsx`

```typescript
import { TypeBadge } from '@/components/ui/TypeBadge';

<TypeBadge type="challenge" />
<TypeBadge type="event" />
<TypeBadge type="opportunity" />
```

## 📋 List Components

### Filtered List
```typescript
import { useFilters } from '@/hooks/useFilters';

const { filteredData, setFilter, clearFilters } = useFilters(data, {
  searchFields: ['name', 'description'],
  filters: [
    { key: 'status', type: 'select', options: ['active', 'inactive'] },
    { key: 'priority', type: 'multiselect', options: ['high', 'medium', 'low'] }
  ]
});

// Render filtered list
{filteredData.map(item => (
  <div key={item.id}>{item.name}</div>
))}
```

### Advanced Filters
**Location**: `src/components/ui/advanced-filters.tsx`

```typescript
import { AdvancedFilters } from '@/components/ui/advanced-filters';

<AdvancedFilters
  filters={filterConfig}
  values={filterValues}
  onChange={setFilterValues}
  onReset={resetFilters}
/>
```

## 📊 Dashboard Components

### Metric Cards
```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
    <Users className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">1,234</div>
    <p className="text-xs text-muted-foreground">
      +20.1% from last month
    </p>
  </CardContent>
</Card>
```

### Progress Indicators
```typescript
import { Progress } from '@/components/ui/progress';

<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span>Progress</span>
    <span>75%</span>
  </div>
  <Progress value={75} className="h-2" />
</div>
```

## 🔍 Search Components

### Advanced Search
**Location**: `src/components/ui/advanced-search.tsx`

```typescript
import { AdvancedSearch } from '@/components/ui/advanced-search';

<AdvancedSearch
  placeholder="Search..."
  filters={searchFilters}
  sortOptions={sortOptions}
  onSearch={handleSearch}
  onFilterChange={handleFilterChange}
/>
```

### Global Search
**Location**: `src/components/AdvancedSearch.tsx`

System-wide search component:
```typescript
import { AdvancedSearch } from '@/components/AdvancedSearch';

<AdvancedSearch
  onSearch={handleGlobalSearch}
  categories={['users', 'challenges', 'events']}
/>
```

## 🎨 Design System Integration

### Color System
All data display components use semantic color tokens:
```css
/* Status colors */
--success: hsl(142, 76%, 36%);
--warning: hsl(38, 92%, 50%);
--error: hsl(0, 84%, 60%);
--info: hsl(214, 92%, 60%);

/* Priority colors */
--priority-high: hsl(0, 84%, 60%);
--priority-medium: hsl(38, 92%, 50%);
--priority-low: hsl(142, 76%, 36%);
```

### Typography Scale
- **Data labels**: text-sm font-medium
- **Values**: text-lg font-semibold
- **Descriptions**: text-xs text-muted-foreground

### Spacing System
- **Card padding**: p-6
- **Section spacing**: space-y-4
- **Item spacing**: gap-2

## ♿ Accessibility Features

- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Proper focus indicators
- **Color Contrast**: WCAG AA compliant colors
- **Alternative Text**: Meaningful alt text for visual elements

## 📱 Responsive Design

All data display components are mobile-friendly:
- **Responsive Tables**: Horizontal scroll on mobile
- **Adaptive Charts**: Scale to container width
- **Touch-Friendly**: Larger touch targets on mobile
- **Optimized Loading**: Progressive loading for large datasets

---

*Data Display Components: 25+ components documented*
*Features: Sorting, filtering, searching, exporting, real-time updates*
*Status: ✅ Production ready with enterprise features*