# ♿ Accessibility Guidelines

## Overview
Comprehensive accessibility (a11y) implementation guide for the Ruwād Platform ensuring WCAG 2.1 AA compliance.

## Core Principles (WCAG)

### 1. Perceivable
Content must be presentable to users in ways they can perceive.

### 2. Operable
Interface components must be operable by all users.

### 3. Understandable
Information and UI operation must be understandable.

### 4. Robust
Content must be robust enough for various assistive technologies.

## Implementation Patterns

### Semantic HTML Structure
```tsx
// Use proper heading hierarchy
export const AccessiblePage = () => (
  <main role="main">
    <header role="banner">
      <h1>عنوان الصفحة الرئيسي</h1>
    </header>
    
    <nav role="navigation" aria-label="التنقل الرئيسي">
      <ul>
        <li><a href="/challenges">التحديات</a></li>
        <li><a href="/ideas">الأفكار</a></li>
      </ul>
    </nav>
    
    <section aria-labelledby="challenges-heading">
      <h2 id="challenges-heading">التحديات الحالية</h2>
      {/* Content */}
    </section>
    
    <aside role="complementary" aria-label="معلومات إضافية">
      {/* Sidebar content */}
    </aside>
    
    <footer role="contentinfo">
      {/* Footer content */}
    </footer>
  </main>
);
```

### ARIA Labels and Descriptions
```tsx
// Accessible form components
export const AccessibleInput = ({ label, error, required, ...props }) => {
  const id = useId();
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;
  
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={required ? "required" : ""}>
        {label}
        {required && <span aria-label="مطلوب">*</span>}
      </Label>
      
      <Input
        id={id}
        aria-describedby={error ? errorId : helpId}
        aria-invalid={error ? "true" : "false"}
        aria-required={required}
        {...props}
      />
      
      {error && (
        <div id={errorId} role="alert" className="text-destructive text-sm">
          {error}
        </div>
      )}
      
      <div id={helpId} className="text-muted-foreground text-sm sr-only">
        تعليمات إضافية للحقل
      </div>
    </div>
  );
};
```

### Focus Management
```tsx
// Accessible modal with focus trap
export const AccessibleModal = ({ children, isOpen, onClose, title }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
    } else {
      previousFocus.current?.focus();
    }
  }, [isOpen]);
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <DialogHeader>
          <DialogTitle id="modal-title">{title}</DialogTitle>
        </DialogHeader>
        
        {children}
        
        <DialogClose 
          aria-label="إغلاق النافذة"
          className="absolute top-4 right-4"
        />
      </DialogContent>
    </Dialog>
  );
};
```

## Keyboard Navigation

### Tab Order and Focus Indicators
```css
/* Focus styles in design system */
:root {
  --focus-ring: 2px solid hsl(var(--primary));
  --focus-offset: 2px;
}

.focus-visible {
  outline: var(--focus-ring);
  outline-offset: var(--focus-offset);
  border-radius: 4px;
}

/* Skip link for keyboard users */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  padding: 8px;
  text-decoration: none;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 6px;
}
```

### Accessible Navigation
```tsx
// Keyboard-accessible dropdown menu
export const AccessibleDropdown = ({ trigger, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < items.length - 1 ? prev + 1 : 0
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : items.length - 1
        );
        break;
        
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0) {
          items[focusedIndex].onClick?.();
        }
        break;
        
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger 
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {trigger}
      </DropdownMenuTrigger>
      
      <DropdownMenuContent
        role="menu"
        onKeyDown={handleKeyDown}
      >
        {items.map((item, index) => (
          <DropdownMenuItem
            key={item.id}
            role="menuitem"
            tabIndex={focusedIndex === index ? 0 : -1}
            className={focusedIndex === index ? 'bg-muted' : ''}
            onClick={item.onClick}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```

## Screen Reader Support

### Accessible Data Tables
```tsx
export const AccessibleTable = ({ data, columns, caption }) => (
  <div className="overflow-x-auto">
    <table role="table" className="w-full">
      <caption className="sr-only">{caption}</caption>
      
      <thead>
        <tr role="row">
          {columns.map((col, index) => (
            <th 
              key={col.key}
              role="columnheader"
              scope="col"
              tabIndex={0}
              className="text-start p-4 font-semibold focus:bg-muted"
              aria-sort={col.sortable ? "none" : undefined}
            >
              {col.title}
              {col.sortable && (
                <span aria-label="قابل للترتيب" className="ml-2">
                  ↕️
                </span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={row.id} role="row">
            {columns.map((col, colIndex) => (
              <td 
                key={col.key}
                role={colIndex === 0 ? "rowheader" : "gridcell"}
                scope={colIndex === 0 ? "row" : undefined}
                className="p-4 border-t"
              >
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
```

### Live Regions for Dynamic Content
```tsx
// Accessible status announcements
export const useAnnouncer = () => {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcer = document.getElementById(`announcer-${priority}`);
    if (announcer) {
      announcer.textContent = message;
      // Clear after announcement
      setTimeout(() => {
        announcer.textContent = '';
      }, 1000);
    }
  }, []);
  
  return { announce };
};

// Live region component
export const LiveRegions = () => (
  <>
    <div 
      id="announcer-polite"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
    <div 
      id="announcer-assertive"
      aria-live="assertive"
      aria-atomic="true"
      className="sr-only"
    />
  </>
);
```

## Color and Contrast

### Accessible Color System
```css
/* WCAG AA compliant color tokens */
:root {
  /* High contrast pairs */
  --primary: 220 14% 20%;        /* #2D3748 */
  --primary-foreground: 0 0% 98%; /* #FAFAFA */
  
  --secondary: 220 14% 96%;      /* #F7FAFC */
  --secondary-foreground: 220 9% 25%; /* #4A5568 */
  
  /* Error states */
  --destructive: 0 84% 60%;      /* #F56565 */
  --destructive-foreground: 0 0% 98%;
  
  /* Success states */
  --success: 142 71% 45%;        /* #38A169 */
  --success-foreground: 0 0% 98%;
  
  /* Warning states */
  --warning: 38 92% 50%;         /* #ED8936 */
  --warning-foreground: 0 0% 98%;
}

/* Ensure minimum 4.5:1 contrast ratio */
.text-contrast-check {
  color: hsl(var(--foreground));
  background: hsl(var(--background));
}
```

### Non-Color Indicators
```tsx
// Status indicators that don't rely on color alone
export const AccessibleStatus = ({ status, children }) => {
  const statusConfig = {
    success: { icon: CheckCircle, label: "نجح" },
    error: { icon: XCircle, label: "خطأ" },
    warning: { icon: AlertCircle, label: "تحذير" },
    info: { icon: Info, label: "معلومات" }
  };
  
  const { icon: Icon, label } = statusConfig[status];
  
  return (
    <div className={`status-${status} flex items-center gap-2`}>
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">{label}: </span>
      {children}
    </div>
  );
};
```

## Form Accessibility

### Accessible Form Validation
```tsx
export const AccessibleForm = () => {
  const [errors, setErrors] = useState({});
  const { announce } = useAnnouncer();
  
  const validateForm = (data) => {
    const newErrors = {};
    
    if (!data.email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    }
    
    if (!data.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    }
    
    setErrors(newErrors);
    
    // Announce validation results
    const errorCount = Object.keys(newErrors).length;
    if (errorCount > 0) {
      announce(`يوجد ${errorCount} أخطاء في النموذج`, 'assertive');
    } else {
      announce("تم إرسال النموذج بنجاح", 'polite');
    }
    
    return Object.keys(newErrors).length === 0;
  };
  
  return (
    <form 
      onSubmit={handleSubmit}
      noValidate
      aria-describedby="form-instructions"
    >
      <div id="form-instructions" className="mb-4 text-sm text-muted-foreground">
        جميع الحقول المميزة بالنجمة (*) مطلوبة
      </div>
      
      <AccessibleInput
        label="البريد الإلكتروني"
        type="email"
        required
        error={errors.email}
        autoComplete="email"
      />
      
      <AccessibleInput
        label="كلمة المرور"
        type="password"
        required
        error={errors.password}
        autoComplete="current-password"
      />
      
      <Button type="submit" className="w-full">
        تسجيل الدخول
      </Button>
    </form>
  );
};
```

## Media Accessibility

### Video and Audio Content
```tsx
export const AccessibleVideo = ({ src, title, transcript }) => (
  <div className="space-y-4">
    <video 
      controls
      aria-labelledby="video-title"
      aria-describedby="video-description"
      className="w-full"
    >
      <source src={src} type="video/mp4" />
      <track 
        kind="captions" 
        src={`${src}.vtt`} 
        srcLang="ar" 
        label="العربية" 
        default 
      />
      متصفحك لا يدعم تشغيل الفيديو
    </video>
    
    <h3 id="video-title">{title}</h3>
    <p id="video-description">وصف محتوى الفيديو</p>
    
    {transcript && (
      <details className="mt-4">
        <summary>عرض النص المكتوب</summary>
        <div className="mt-2 p-4 bg-muted rounded">
          {transcript}
        </div>
      </details>
    )}
  </div>
);
```

## Testing and Validation

### Automated Testing
```typescript
// Accessibility testing with jest-axe
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';

expect.extend(toHaveNoViolations);

describe('Component Accessibility', () => {
  test('should not have accessibility violations', async () => {
    const { container } = render(<YourComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  test('keyboard navigation works', () => {
    const { getByRole } = render(<NavigationMenu />);
    const menuButton = getByRole('button');
    
    // Test tab navigation
    menuButton.focus();
    expect(document.activeElement).toBe(menuButton);
    
    // Test arrow key navigation
    fireEvent.keyDown(menuButton, { key: 'ArrowDown' });
    // Assert expected focus change
  });
});
```

### Manual Testing Checklist
```typescript
// Accessibility testing utilities
export const a11yTestUtils = {
  // Test with keyboard only
  testKeyboardNavigation: () => {
    console.log('🎯 Test all functionality with Tab, Enter, Space, Arrow keys');
  },
  
  // Test with screen reader
  testScreenReader: () => {
    console.log('📢 Test with NVDA, JAWS, or VoiceOver');
  },
  
  // Test color contrast
  testContrast: () => {
    console.log('🎨 Verify 4.5:1 ratio for normal text, 3:1 for large text');
  },
  
  // Test zoom
  testZoom: () => {
    console.log('🔍 Test up to 200% zoom without horizontal scrolling');
  }
};
```

## RTL Accessibility

### Arabic Language Support
```tsx
export const RTLAccessibleComponent = ({ children }) => (
  <div 
    dir="rtl" 
    lang="ar"
    className="text-start" // Uses logical properties
  >
    {children}
  </div>
);

// Accessible Arabic form
export const ArabicForm = () => (
  <form dir="rtl">
    <AccessibleInput
      label="الاسم الأول"
      placeholder="أدخل اسمك الأول"
      lang="ar"
      autoComplete="given-name"
    />
    
    <AccessibleInput
      label="اسم العائلة"
      placeholder="أدخل اسم العائلة"
      lang="ar"
      autoComplete="family-name"
    />
  </form>
);
```

## Performance and Accessibility

### Accessible Loading States
```tsx
export const AccessibleLoader = ({ isLoading, children, loadingText = "جاري التحميل..." }) => {
  if (isLoading) {
    return (
      <div 
        role="status" 
        aria-live="polite"
        aria-label={loadingText}
        className="flex items-center justify-center p-8"
      >
        <Spinner className="h-6 w-6 animate-spin" aria-hidden="true" />
        <span className="sr-only">{loadingText}</span>
      </div>
    );
  }
  
  return children;
};
```

## Best Practices Summary

### 1. **Start with Semantic HTML**
- Use proper heading hierarchy (h1 → h6)
- Implement landmark roles
- Use native form controls when possible

### 2. **Provide Alternative Text**
- Descriptive alt text for images
- Empty alt="" for decorative images
- Captions and transcripts for media

### 3. **Ensure Keyboard Accessibility**
- All interactive elements focusable
- Logical tab order
- Custom keyboard handlers where needed

### 4. **Test Thoroughly**
- Automated testing with axe
- Manual keyboard testing
- Screen reader testing
- Real user testing with disabilities

---

**Last Updated**: January 17, 2025  
**Guide Version**: 1.0  
**WCAG Compliance**: AA Level