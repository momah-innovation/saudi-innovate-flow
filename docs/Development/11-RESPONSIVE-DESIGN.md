# 📱 Responsive Design Guide

## Overview
Comprehensive guide for implementing mobile-first responsive design in the Ruwād Platform.

## Mobile-First Approach

### Design Principles
```css
/* Mobile-first CSS structure */
.component {
  /* Mobile styles (base) */
  padding: 1rem;
  
  /* Tablet and up */
  @media (min-width: 768px) {
    padding: 1.5rem;
  }
  
  /* Desktop and up */
  @media (min-width: 1024px) {
    padding: 2rem;
  }
}
```

### Tailwind Breakpoints
```typescript
// tailwind.config.ts breakpoints
const breakpoints = {
  sm: '640px',   // Small devices
  md: '768px',   // Medium devices  
  lg: '1024px',  // Large devices
  xl: '1280px',  // Extra large devices
  '2xl': '1536px' // 2X large devices
}
```

## Component Patterns

### Responsive Layout Components
```tsx
// Responsive Grid Container
export const ResponsiveGrid = ({ children, cols = "1 md:2 lg:3" }) => (
  <div className={`grid grid-cols-${cols} gap-4 md:gap-6 lg:gap-8`}>
    {children}
  </div>
);

// Responsive Stack
export const ResponsiveStack = ({ children, direction = "col md:row" }) => (
  <div className={`flex flex-${direction} gap-4 md:gap-6`}>
    {children}
  </div>
);
```

### Navigation Patterns
```tsx
// Mobile-first Navigation
export const ResponsiveNav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <nav className="w-full">
      {/* Mobile menu button */}
      <div className="md:hidden">
        <Button 
          variant="ghost" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Desktop navigation */}
      <div className="hidden md:flex space-x-4">
        <NavItem href="/challenges">التحديات</NavItem>
        <NavItem href="/ideas">الأفكار</NavItem>
        <NavItem href="/events">الفعاليات</NavItem>
      </div>
      
      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-t">
          <div className="p-4 space-y-2">
            <NavItem href="/challenges">التحديات</NavItem>
            <NavItem href="/ideas">الأفكار</NavItem>
            <NavItem href="/events">الفعاليات</NavItem>
          </div>
        </div>
      )}
    </nav>
  );
};
```

## Typography & Spacing

### Responsive Typography
```css
/* Design system typography scale */
:root {
  /* Mobile typography */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  
  /* Desktop adjustments */
  @media (min-width: 1024px) {
    --text-lg: 1.25rem;
    --text-xl: 1.5rem;
    --text-2xl: 1.875rem;
    --text-3xl: 2.25rem;
  }
}
```

### Responsive Spacing
```tsx
// Spacing utilities component
export const ResponsiveSection = ({ children, size = "normal" }) => {
  const spacingMap = {
    tight: "py-4 md:py-6 lg:py-8",
    normal: "py-6 md:py-8 lg:py-12",
    loose: "py-8 md:py-12 lg:py-16"
  };
  
  return (
    <section className={`px-4 md:px-6 lg:px-8 ${spacingMap[size]}`}>
      {children}
    </section>
  );
};
```

## Image Optimization

### Responsive Images
```tsx
export const ResponsiveImage = ({ src, alt, sizes, className }) => (
  <img
    src={src}
    alt={alt}
    sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
    className={`w-full h-auto object-cover ${className}`}
    loading="lazy"
  />
);

// Usage
<ResponsiveImage
  src="/hero-image.jpg"
  alt="صورة رئيسية للمنصة"
  sizes="(max-width: 768px) 100vw, 80vw"
  className="rounded-lg"
/>
```

### Progressive Loading
```tsx
export const useProgressiveImage = (src: string, placeholder: string) => {
  const [imgSrc, setImgSrc] = useState(placeholder);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImgSrc(src);
      setLoading(false);
    };
    img.src = src;
  }, [src]);

  return { imgSrc, loading };
};
```

## Forms & Inputs

### Responsive Form Layouts
```tsx
export const ResponsiveForm = ({ children }) => (
  <form className="space-y-4 md:space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {children}
    </div>
  </form>
);

// Responsive Input Groups
export const ResponsiveFieldset = ({ legend, children }) => (
  <fieldset className="space-y-4">
    <legend className="text-lg md:text-xl font-semibold">{legend}</legend>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  </fieldset>
);
```

### Touch-Friendly Interactions
```css
/* Minimum touch target sizes */
.touch-target {
  min-height: 44px; /* iOS recommendation */
  min-width: 44px;
  
  @media (min-width: 768px) {
    min-height: 40px; /* Desktop can be smaller */
    min-width: 40px;
  }
}

/* Hover states for non-touch devices */
@media (hover: hover) {
  .hover-effect:hover {
    background-color: hsl(var(--muted));
  }
}
```

## Performance Considerations

### Lazy Loading Components
```tsx
// Lazy load heavy components on larger screens
const HeavyChart = lazy(() => import('./HeavyChart'));

export const DashboardSection = () => {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  
  return (
    <div>
      {isLargeScreen ? (
        <Suspense fallback={<ChartSkeleton />}>
          <HeavyChart />
        </Suspense>
      ) : (
        <SimpleStats />
      )}
    </div>
  );
};
```

### Conditional Rendering
```tsx
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

// Usage
const isMobile = useMediaQuery('(max-width: 767px)');
```

## RTL Support

### Responsive RTL Layout
```css
/* RTL-aware responsive design */
.rtl-container {
  padding-inline-start: 1rem;
  padding-inline-end: 1rem;
  
  @media (min-width: 768px) {
    padding-inline-start: 2rem;
    padding-inline-end: 2rem;
  }
}

/* Logical properties for RTL */
.rtl-text {
  text-align: start; /* Not left/right */
  margin-inline-end: 1rem; /* Not margin-right */
}
```

## Testing Responsive Design

### Device Testing Strategy
```typescript
// Responsive testing viewports
export const testViewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 },
  ultrawide: { width: 1920, height: 1080 }
};

// Responsive component testing
export const ResponsiveTest = ({ component: Component, props }) => (
  <div className="space-y-8">
    {Object.entries(testViewports).map(([device, { width }]) => (
      <div key={device} style={{ width }} className="border p-4">
        <h3>{device} - {width}px</h3>
        <Component {...props} />
      </div>
    ))}
  </div>
);
```

### Accessibility in Responsive Design
```tsx
// Responsive focus management
export const useResponsiveFocus = () => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  
  const focusFirst = useCallback(() => {
    const selector = isMobile ? 
      '[data-mobile-focus]' : 
      '[data-desktop-focus]';
    
    const element = document.querySelector(selector);
    element?.focus();
  }, [isMobile]);
  
  return { focusFirst };
};
```

## Common Patterns

### Responsive Cards
```tsx
export const ResponsiveCard = ({ children, variant = "default" }) => {
  const variants = {
    default: "p-4 md:p-6",
    compact: "p-3 md:p-4",
    spacious: "p-6 md:p-8 lg:p-10"
  };
  
  return (
    <Card className={`${variants[variant]} rounded-lg md:rounded-xl`}>
      {children}
    </Card>
  );
};
```

### Responsive Modals
```tsx
export const ResponsiveModal = ({ children, isOpen, onClose }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="w-[95vw] max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto">
      <div className="p-4 md:p-6">
        {children}
      </div>
    </DialogContent>
  </Dialog>
);
```

## Best Practices

### 1. **Progressive Enhancement**
- Start with mobile experience
- Enhance for larger screens
- Ensure core functionality works everywhere

### 2. **Performance First**
- Minimize layout shifts
- Optimize images for each breakpoint
- Use efficient CSS selectors

### 3. **Touch-First Design**
- Minimum 44px touch targets
- Adequate spacing between interactive elements
- Consider thumb reach zones

### 4. **Content Strategy**
- Prioritize content for small screens
- Use progressive disclosure
- Maintain information hierarchy

---

**Last Updated**: January 17, 2025  
**Guide Version**: 1.0  
**Next Review**: Quarterly updates