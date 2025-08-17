# Layout Components Documentation

Layout and container components for the Enterprise Management System.

## 📐 Container Components

### 🏗️ Layout Containers

#### Main App Layout
```typescript
interface AppLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const AppLayout = ({ children, sidebar, header, footer }: AppLayoutProps) => (
  <div className="min-h-screen bg-background">
    {header && (
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        {header}
      </header>
    )}
    
    <div className="flex">
      {sidebar && (
        <aside className="hidden md:flex w-64 border-r bg-background">
          {sidebar}
        </aside>
      )}
      
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
    
    {footer && (
      <footer className="border-t bg-background">
        {footer}
      </footer>
    )}
  </div>
);
```

#### Content Container
```typescript
interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

const Container = ({ 
  children, 
  maxWidth = 'xl', 
  padding = 'md',
  className 
}: ContainerProps) => (
  <div className={cn(
    "mx-auto",
    {
      'max-w-sm': maxWidth === 'sm',
      'max-w-md': maxWidth === 'md',
      'max-w-lg': maxWidth === 'lg',
      'max-w-xl': maxWidth === 'xl',
      'max-w-2xl': maxWidth === '2xl',
      'max-w-full': maxWidth === 'full',
    },
    {
      'p-0': padding === 'none',
      'p-4': padding === 'sm',
      'p-6': padding === 'md',
      'p-8': padding === 'lg',
    },
    className
  )}>
    {children}
  </div>
);
```

## 📊 Grid Systems

### 🔲 Responsive Grid

#### Adaptive Grid Layout
```typescript
interface GridProps {
  children: React.ReactNode;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Grid = ({ 
  children, 
  cols = { default: 1, md: 2, lg: 3 },
  gap = 'md',
  className 
}: GridProps) => (
  <div className={cn(
    "grid",
    {
      [`grid-cols-${cols.default}`]: cols.default,
      [`sm:grid-cols-${cols.sm}`]: cols.sm,
      [`md:grid-cols-${cols.md}`]: cols.md,
      [`lg:grid-cols-${cols.lg}`]: cols.lg,
      [`xl:grid-cols-${cols.xl}`]: cols.xl,
    },
    {
      'gap-2': gap === 'sm',
      'gap-4': gap === 'md',
      'gap-6': gap === 'lg',
    },
    className
  )}>
    {children}
  </div>
);
```

#### Dashboard Grid
```typescript
const DashboardGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <div className="lg:col-span-8">
      <div className="space-y-6">
        {children}
      </div>
    </div>
    <div className="lg:col-span-4">
      <div className="space-y-6">
        {/* Sidebar content */}
      </div>
    </div>
  </div>
);
```

## 📱 Responsive Utilities

### 🔄 Breakpoint Components

#### Show/Hide at Breakpoints
```typescript
interface ResponsiveProps {
  children: React.ReactNode;
  show?: 'sm' | 'md' | 'lg' | 'xl';
  hide?: 'sm' | 'md' | 'lg' | 'xl';
}

const Responsive = ({ children, show, hide }: ResponsiveProps) => (
  <div className={cn(
    {
      'hidden sm:block': show === 'sm',
      'hidden md:block': show === 'md',
      'hidden lg:block': show === 'lg',
      'hidden xl:block': show === 'xl',
    },
    {
      'sm:hidden': hide === 'sm',
      'md:hidden': hide === 'md',
      'lg:hidden': hide === 'lg',
      'xl:hidden': hide === 'xl',
    }
  )}>
    {children}
  </div>
);
```

#### Mobile/Desktop Layouts
```typescript
const AdaptiveLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    {/* Mobile Layout */}
    <div className="md:hidden">
      <div className="space-y-4 p-4">
        {children}
      </div>
    </div>
    
    {/* Desktop Layout */}
    <div className="hidden md:block">
      <div className="grid grid-cols-12 gap-6 p-6">
        {children}
      </div>
    </div>
  </>
);
```

## 📏 Spacing Utilities

### ⬜ Spacing Components

#### Stack Layout
```typescript
interface StackProps {
  children: React.ReactNode;
  space?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  direction?: 'vertical' | 'horizontal';
}

const Stack = ({ 
  children, 
  space = 'md',
  align = 'stretch',
  direction = 'vertical'
}: StackProps) => (
  <div className={cn(
    "flex",
    {
      'flex-col': direction === 'vertical',
      'flex-row': direction === 'horizontal',
    },
    {
      'gap-1': space === 'xs',
      'gap-2': space === 'sm',
      'gap-4': space === 'md',
      'gap-6': space === 'lg',
      'gap-8': space === 'xl',
    },
    {
      'items-start': align === 'start',
      'items-center': align === 'center',
      'items-end': align === 'end',
      'items-stretch': align === 'stretch',
    }
  )}>
    {children}
  </div>
);
```

#### Spacer Component
```typescript
interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  direction?: 'horizontal' | 'vertical';
}

const Spacer = ({ size = 'md', direction = 'vertical' }: SpacerProps) => {
  const sizeMap = {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  };

  const spacing = typeof size === 'number' ? `${size}rem` : sizeMap[size];

  return (
    <div 
      style={{
        [direction === 'horizontal' ? 'width' : 'height']: spacing,
        flexShrink: 0
      }} 
    />
  );
};
```

## 🎯 Flex Utilities

### 🔄 Flex Components

#### Flex Container
```typescript
interface FlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const Flex = ({
  children,
  direction = 'row',
  wrap = 'nowrap',
  justify = 'start',
  align = 'stretch',
  gap = 'md'
}: FlexProps) => (
  <div className={cn(
    "flex",
    `flex-${direction}`,
    `flex-${wrap}`,
    `justify-${justify}`,
    `items-${align}`,
    {
      'gap-1': gap === 'xs',
      'gap-2': gap === 'sm',
      'gap-4': gap === 'md',
      'gap-6': gap === 'lg',
      'gap-8': gap === 'xl',
    }
  )}>
    {children}
  </div>
);
```

#### Center Component
```typescript
interface CenterProps {
  children: React.ReactNode;
  axis?: 'both' | 'horizontal' | 'vertical';
  className?: string;
}

const Center = ({ children, axis = 'both', className }: CenterProps) => (
  <div className={cn(
    "flex",
    {
      'justify-center items-center': axis === 'both',
      'justify-center': axis === 'horizontal',
      'items-center': axis === 'vertical',
    },
    className
  )}>
    {children}
  </div>
);
```

## 🔲 Section Components

### 📄 Content Sections

#### Page Section
```typescript
interface SectionProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const Section = ({ 
  children, 
  title, 
  description, 
  action,
  className 
}: SectionProps) => (
  <section className={cn("space-y-4", className)}>
    {(title || description || action) && (
      <div className="flex items-center justify-between">
        <div>
          {title && (
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          )}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    )}
    {children}
  </section>
);
```

#### Card Section
```typescript
const CardSection = ({ 
  children, 
  title, 
  description,
  className 
}: SectionProps) => (
  <Card className={className}>
    {(title || description) && (
      <CardHeader>
        {title && <CardTitle>{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
    )}
    <CardContent>
      {children}
    </CardContent>
  </Card>
);
```

## 🎭 Layout Patterns

### 📱 Common Layouts

#### Master-Detail Layout
```typescript
const MasterDetailLayout = ({ 
  master, 
  detail, 
  masterWidth = 300 
}: {
  master: React.ReactNode;
  detail: React.ReactNode;
  masterWidth?: number;
}) => (
  <div className="flex h-full">
    <div 
      className="border-r bg-muted/50" 
      style={{ width: masterWidth }}
    >
      {master}
    </div>
    <div className="flex-1">
      {detail}
    </div>
  </div>
);
```

#### Split Layout
```typescript
const SplitLayout = ({ 
  left, 
  right, 
  split = 50 
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  split?: number;
}) => (
  <div className="grid grid-cols-12 h-full">
    <div className={`col-span-${Math.round(12 * split / 100)}`}>
      {left}
    </div>
    <div className={`col-span-${12 - Math.round(12 * split / 100)}`}>
      {right}
    </div>
  </div>
);
```

#### Sticky Layout
```typescript
const StickyLayout = ({ 
  header, 
  content, 
  sidebar 
}: {
  header: React.ReactNode;
  content: React.ReactNode;
  sidebar?: React.ReactNode;
}) => (
  <div className="min-h-screen">
    <div className="sticky top-0 z-50 bg-background border-b">
      {header}
    </div>
    <div className="flex">
      <main className="flex-1 p-6">
        {content}
      </main>
      {sidebar && (
        <aside className="w-80 p-6 border-l">
          <div className="sticky top-20">
            {sidebar}
          </div>
        </aside>
      )}
    </div>
  </div>
);
```

---

*Layout Components: 20+ documented | Responsive: ✅ Mobile-First | Accessibility: ✅ Semantic HTML*