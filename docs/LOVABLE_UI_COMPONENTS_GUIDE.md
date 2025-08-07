# Lovable AI UI Components Guide

## 📚 Complete UI Component Reference for Lovable AI Agents

This document provides comprehensive instructions for using all available UI components in your Lovable project. Always reference this guide when building interfaces.

---

## 🎨 Design System Components

### **Core Layout Components**

#### **AppShell** - Application Container
```typescript
import { AppShell } from '@/components/layout/AppShell';

<AppShell>
  {/* Your app content */}
</AppShell>
```
**Purpose:** Main application wrapper with navigation, authentication, and theming
**When to use:** Root layout for all authenticated pages

#### **Card Components**
```typescript
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```
**Purpose:** Content containers with consistent styling
**When to use:** Content sections, feature highlights, information displays

---

## 🧩 Form Components

### **Input Components**
```typescript
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

<div>
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email" 
    type="email" 
    placeholder="Enter email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</div>

<Textarea 
  placeholder="Enter description"
  rows={4}
/>
```

### **Select Components**
```typescript
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### **Checkbox & Radio**
```typescript
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

<Checkbox 
  id="agree" 
  checked={agreed}
  onCheckedChange={setAgreed}
/>

<RadioGroup value={value} onValueChange={setValue}>
  <RadioGroupItem value="option1" id="option1" />
  <RadioGroupItem value="option2" id="option2" />
</RadioGroup>
```

### **Advanced Form Components**

#### **FileUploadField** - File Upload with Validation
```typescript
import { FileUploadField } from '@/components/ui/FileUploadField';

<FileUploadField
  accept="image/*"
  maxSize={5 * 1024 * 1024} // 5MB
  onFileSelect={(file) => setFile(file)}
  placeholder="Drop image here or click to upload"
/>
```

#### **AvatarUpload** - Profile Image Upload
```typescript
import { AvatarUpload } from '@/components/ui/avatar-upload';

<AvatarUpload
  currentImageUrl={user.avatar}
  onImageChange={(url) => updateAvatar(url)}
  size="lg"
/>
```

---

## 🖱️ Interactive Components

### **Button Components**
```typescript
import { Button } from '@/components/ui/button';

<Button variant="default" size="md">
  Default Button
</Button>

<Button variant="outline" size="sm">
  Outline Button
</Button>

<Button variant="ghost" size="lg">
  Ghost Button
</Button>
```
**Variants:** `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
**Sizes:** `sm`, `md`, `lg`, `icon`

### **Dialog Components**
```typescript
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    {/* Dialog content */}
  </DialogContent>
</Dialog>
```

### **Dropdown Menu**
```typescript
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
    <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### **Tabs Component**
```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    Tab 1 content
  </TabsContent>
  <TabsContent value="tab2">
    Tab 2 content
  </TabsContent>
</Tabs>
```

---

## 📊 Data Display Components

### **DataTable** - Advanced Table with Sorting/Filtering
```typescript
import { DataTable } from '@/components/ui/data-table';

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'status', label: 'Status', render: badgeRenderer(statusVariants) }
];

<DataTable
  data={users}
  columns={columns}
  searchable={true}
  filterable={true}
  pagination={true}
  onRowSelect={(user) => handleUserSelect(user)}
/>
```

### **AdvancedDataTable** - Enterprise-grade Table
```typescript
import { AdvancedDataTable } from '@/components/ui/advanced-data-table';

<AdvancedDataTable
  data={data}
  columns={columns}
  enableSorting={true}
  enableFiltering={true}
  enableColumnResizing={true}
  enableRowSelection={true}
  enableExport={true}
  onExport={(format) => exportData(format)}
/>
```

### **Charts Components**
```typescript
import { SimpleLineChart, SimpleBarChart, SimpleDonutChart } from '@/components/ui/charts';

<SimpleLineChart
  data={chartData}
  height={300}
  showGrid={true}
  showTooltip={true}
/>

<SimpleBarChart
  data={barData}
  height={200}
  showValues={true}
/>

<SimpleDonutChart
  data={pieData}
  centerText="Total"
  showLabels={true}
/>
```

### **Status & Badge Components**
```typescript
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';

<Badge variant="default">New</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Pending</Badge>

<StatusBadge 
  status="active" 
  showIcon={true}
  size="default"
/>
```

---

## 🎯 Specialized Components

### **Command Palette** - Quick Actions
```typescript
import { CommandPalette } from '@/components/ui/command-palette';

const actions = [
  {
    id: 'create-user',
    label: 'Create User',
    icon: UserPlus,
    action: () => navigate('/users/create'),
    keywords: ['user', 'add', 'create']
  }
];

<CommandPalette
  actions={actions}
  placeholder="Search actions..."
  open={isOpen}
  onOpenChange={setIsOpen}
/>
```

### **Advanced Search & Filters**
```typescript
import { AdvancedSearch } from '@/components/ui/advanced-search';
import { AdvancedFilters } from '@/components/ui/advanced-filters';

<AdvancedSearch
  value={searchQuery}
  onChange={setSearchQuery}
  suggestions={searchSuggestions}
  placeholder="Search anything..."
  showHistory={true}
/>

<AdvancedFilters
  filters={filterConfig}
  values={filterValues}
  onChange={setFilterValues}
  onReset={() => setFilterValues({})}
/>
```

### **Bulk Actions** - Multi-select Operations
```typescript
import { BulkActions } from '@/components/ui/bulk-actions';

<BulkActions
  selectedCount={selectedItems.length}
  actions={[
    { label: 'Delete', icon: Trash, action: handleBulkDelete, variant: 'destructive' },
    { label: 'Export', icon: Download, action: handleBulkExport }
  ]}
  onClearSelection={() => setSelectedItems([])}
/>
```

---

## 🎨 Visual Enhancement Components

### **Animation Components**
```typescript
import { SpringAnimation, StaggerContainer, Parallax } from '@/components/ui/advanced-animations';

<SpringAnimation trigger={isVisible} delay={100}>
  <div>Animated content</div>
</SpringAnimation>

<StaggerContainer delay={50}>
  {items.map((item, index) => (
    <div key={index}>{item.name}</div>
  ))}
</StaggerContainer>

<Parallax speed={0.5}>
  <div>Parallax background</div>
</Parallax>
```

### **Brand Assets** - Design System Elements
```typescript
import { BrandAsset, ColorPalette, TypographyScale } from '@/components/ui/brand-assets';

<BrandAsset 
  name="Primary Logo"
  asset="/logo-primary.svg"
  variants={['light', 'dark']}
  formats={['SVG', 'PNG']}
/>

<ColorPalette 
  name="Primary Colors"
  colors={primaryColors}
/>

<TypographyScale 
  title="Headings"
  samples={headingSamples}
/>
```

### **Dashboard Widgets**
```typescript
import { StatCard, ProgressCard, ActivityCard } from '@/components/ui/dashboard-widgets';

<StatCard
  title="Total Users"
  value="1,234"
  change="+12%"
  icon={Users}
/>

<ProgressCard
  title="Project Progress"
  progress={75}
  target={100}
  subtitle="3 tasks remaining"
/>

<ActivityCard
  title="Recent Activity"
  activities={recentActivities}
  showMore={() => navigate('/activity')}
/>
```

---

## 🔧 Utility Components

### **Error Boundary** - Error Handling
```typescript
import ErrorBoundary, { withErrorBoundary } from '@/components/ui/error-boundary';

// Wrap components
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>

// Or use HOC
const SafeComponent = withErrorBoundary(MyComponent);
```

### **Lazy Load Wrapper** - Performance Optimization
```typescript
import LazyLoadWrapper from '@/components/ui/lazy-load-wrapper';

<LazyLoadWrapper
  threshold={0.1}
  placeholder={<Skeleton />}
  onIntersect={() => console.log('Component visible')}
>
  <ExpensiveComponent />
</LazyLoadWrapper>
```

### **Direction Provider** - RTL/LTR Support
```typescript
import { DirectionProvider } from '@/components/ui/direction-provider';

<DirectionProvider>
  <App />
</DirectionProvider>
```

---

## 📱 Responsive & Adaptive Components

### **Mobile-First Components**
```typescript
// Use useIsMobile hook for responsive behavior
import { useIsMobile } from '@/hooks/use-mobile';

const ResponsiveComponent = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`${isMobile ? 'p-4' : 'p-8'}`}>
      {isMobile ? <MobileView /> : <DesktopView />}
    </div>
  );
};
```

### **Adaptive Layouts**
```typescript
// Use grid and flex utilities
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <Card key={item.id}>
      {/* Card content */}
    </Card>
  ))}
</div>
```

---

## 🎨 Design System Best Practices

### **1. Color Usage**
```typescript
// ✅ Use semantic tokens
<Button className="bg-primary text-primary-foreground">
<div className="bg-card text-card-foreground">

// ❌ Avoid direct colors
<Button className="bg-blue-500 text-white">
```

### **2. Spacing & Sizing**
```typescript
// ✅ Use consistent spacing scale
<div className="p-4 m-2 gap-4">
<Card className="w-full max-w-lg">

// ✅ Use semantic sizing
<Button size="sm" />
<Avatar size="lg" />
```

### **3. Typography**
```typescript
// ✅ Use semantic typography classes
<h1 className="text-2xl font-bold">
<p className="text-muted-foreground">

// ✅ Combine with translation
const { t } = useUnifiedTranslation();
<h1>{t('page.title', 'Default Title')}</h1>
```

### **4. Accessibility**
```typescript
// ✅ Always include accessibility props
<Button 
  aria-label="Close dialog"
  onClick={onClose}
>
  <X className="h-4 w-4" />
</Button>

<Input 
  aria-describedby="email-error"
  aria-invalid={!!error}
/>
```

---

## 🔄 Component Composition Patterns

### **1. Compound Components**
```typescript
// ✅ Use compound patterns for flexible APIs
<Card>
  <CardHeader>
    <CardTitle>User Profile</CardTitle>
  </CardHeader>
  <CardContent>
    <UserInfo />
  </CardContent>
</Card>
```

### **2. Render Props & Children**
```typescript
// ✅ Use children for flexible composition
<DataTable 
  data={users}
  columns={columns}
  renderRowActions={(user) => (
    <DropdownMenu>
      <DropdownMenuTrigger>⋮</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => editUser(user)}>
          Edit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )}
/>
```

### **3. Controlled vs Uncontrolled**
```typescript
// ✅ Controlled components for form data
<Input 
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// ✅ Uncontrolled for simple cases
<Input defaultValue="initial" />
```

---

## 🚨 Common Anti-Patterns to Avoid

### **1. Inline Styles**
```typescript
// ❌ Avoid inline styles
<div style={{ backgroundColor: '#blue' }}>

// ✅ Use CSS classes
<div className="bg-primary">
```

### **2. Hardcoded Text**
```typescript
// ❌ Hardcoded strings
<Button>Save Changes</Button>

// ✅ Use translation system
<Button>{t('actions.save', 'Save Changes')}</Button>
```

### **3. Missing Error States**
```typescript
// ❌ No error handling
<DataTable data={users} />

// ✅ Handle loading and error states
{loading && <Skeleton />}
{error && <ErrorMessage onRetry={refetch} />}
{data && <DataTable data={data} />}
```

### **4. Poor Accessibility**
```typescript
// ❌ Missing accessibility
<div onClick={handleClick}>Clickable</div>

// ✅ Proper interactive elements
<Button onClick={handleClick}>Clickable</Button>
```

---

## 📋 Component Checklist

Before implementing any component, ensure:

- [ ] **Accessibility**: ARIA labels, keyboard navigation, focus management
- [ ] **Internationalization**: All text uses translation system
- [ ] **Responsive**: Works on all screen sizes
- [ ] **Error Handling**: Loading and error states handled
- [ ] **Performance**: Optimized for rendering and interactions
- [ ] **Design System**: Uses semantic tokens and consistent styling
- [ ] **Type Safety**: Proper TypeScript types and interfaces
- [ ] **Testing**: Can be easily tested and has clear APIs

---

## 🎯 Component Selection Guidelines

### **Data Display**
- Simple lists → `ul/li` with styling
- Complex tables → `DataTable` or `AdvancedDataTable`
- Charts/graphs → `SimpleLineChart`, `SimpleBarChart`, `SimpleDonutChart`
- Key metrics → `StatCard`, `MetricCard`

### **User Input**
- Text input → `Input`, `Textarea`
- Selection → `Select`, `Checkbox`, `RadioGroup`
- File upload → `FileUploadField`, `AvatarUpload`
- Search → `AdvancedSearch`

### **Navigation**
- Page tabs → `Tabs`
- Menu options → `DropdownMenu`
- Quick actions → `CommandPalette`

### **Feedback**
- Notifications → `useToast`
- Status → `StatusBadge`, `Badge`
- Progress → `ProgressCard`
- Errors → `ErrorBoundary`

---

*This guide should be referenced for all UI development work in Lovable projects. Keep it updated as new components are added.*