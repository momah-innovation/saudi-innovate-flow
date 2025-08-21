# ♿ Accessibility Guidelines

## 🎯 **OVERVIEW**
Comprehensive accessibility implementation ensuring WCAG 2.1 AA compliance for all users.

## 🎨 **COLOR & CONTRAST**

### **Minimum Requirements**
- **Normal Text**: 4.5:1 contrast ratio
- **Large Text**: 3:1 contrast ratio (18pt+ or 14pt+ bold)
- **UI Components**: 3:1 contrast ratio
- **Graphical Objects**: 3:1 contrast ratio

### **Color Independence**
- Never rely solely on color to convey information
- Use icons, text labels, or patterns as additional indicators
- Provide multiple ways to distinguish elements

## ⌨️ **KEYBOARD NAVIGATION**

### **Focus Management**
```jsx
// Proper focus trap implementation
const Dialog = () => {
  const firstElementRef = useRef(null);
  
  useEffect(() => {
    firstElementRef.current?.focus();
  }, []);
  
  return (
    <div role="dialog" aria-labelledby="dialog-title">
      <button ref={firstElementRef}>First focusable element</button>
    </div>
  );
};
```

### **Tab Order**
- Logical tab sequence following visual layout
- Skip links for main content navigation
- Visible focus indicators on all interactive elements

### **Keyboard Shortcuts**
| Action | Shortcut | Context |
|--------|----------|---------|
| Close Modal | Escape | All dialogs/modals |
| Submit Form | Enter | Form fields |
| Navigate Menu | Arrow Keys | Navigation menus |
| Select Option | Space | Checkboxes, buttons |

## 🏷️ **SEMANTIC HTML & ARIA**

### **Landmark Roles**
```jsx
const PageLayout = () => (
  <div>
    <header role="banner">
      <nav role="navigation" aria-label="Main navigation">
        {/* Navigation content */}
      </nav>
    </header>
    
    <main role="main">
      <section aria-labelledby="content-heading">
        <h1 id="content-heading">Page Content</h1>
      </section>
    </main>
    
    <aside role="complementary">
      {/* Sidebar content */}
    </aside>
    
    <footer role="contentinfo">
      {/* Footer content */}
    </footer>
  </div>
);
```

### **Form Accessibility**
```jsx
const AccessibleForm = () => (
  <form>
    <div>
      <label htmlFor="email">Email Address *</label>
      <input
        id="email"
        type="email"
        required
        aria-describedby="email-error"
        aria-invalid={hasError ? 'true' : 'false'}
      />
      {hasError && (
        <div id="email-error" role="alert">
          Please enter a valid email address
        </div>
      )}
    </div>
  </form>
);
```

## 📱 **TOUCH & MOBILE**

### **Touch Target Sizes**
- **Minimum**: 44px × 44px (iOS) / 48px × 48px (Android)
- **Recommended**: 48px × 48px minimum
- **Spacing**: 8px minimum between touch targets

### **Gesture Support**
- Provide alternatives to complex gestures
- Support both touch and keyboard/mouse interactions
- Avoid gestures that conflict with assistive technologies

## 🔊 **SCREEN READER SUPPORT**

### **Image Alt Text**
```jsx
// Informative images
<img src="chart.png" alt="Revenue increased 25% from Q3 to Q4 2024" />

// Decorative images
<img src="decorative.png" alt="" role="presentation" />

// Complex images
<img 
  src="complex-chart.png" 
  alt="Sales data by region" 
  aria-describedby="chart-description"
/>
<div id="chart-description">
  Detailed description of the chart data...
</div>
```

### **Dynamic Content Updates**
```jsx
const LiveRegion = ({ message }) => (
  <div
    role="status"
    aria-live="polite"
    aria-atomic="true"
    className="sr-only"
  >
    {message}
  </div>
);

// For urgent updates
<div role="alert" aria-live="assertive">
  {urgentMessage}
</div>
```

## 🌐 **INTERNATIONALIZATION & RTL**

### **Text Direction Support**
```css
/* Automatic text direction */
[dir="rtl"] .component {
  text-align: right;
  margin-right: 0;
  margin-left: auto;
}

[dir="ltr"] .component {
  text-align: left;
  margin-left: 0;
  margin-right: auto;
}
```

### **Language Declaration**
```jsx
const Page = ({ language, content }) => (
  <div lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'}>
    {content}
  </div>
);
```

## 🎬 **ANIMATION & MOTION**

### **Reduced Motion Support**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### **Animation Guidelines**
- Keep animations under 5 seconds
- Provide controls to pause/stop animations
- Avoid flashing content (max 3 flashes per second)
- Use `prefers-reduced-motion` media query

## 📋 **TESTING CHECKLIST**

### **Automated Testing**
```bash
# Install accessibility testing tools
npm install --save-dev @axe-core/react jest-axe

# Run accessibility tests
npm run test:a11y
```

### **Manual Testing**
- [ ] Navigate entire app using only keyboard
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Verify color contrast ratios
- [ ] Test with browser zoom at 200%
- [ ] Validate HTML semantics
- [ ] Test RTL layout functionality

### **Screen Reader Testing**
| Screen Reader | Platform | Test Priority |
|---------------|----------|---------------|
| NVDA | Windows | Primary |
| JAWS | Windows | Secondary |
| VoiceOver | macOS/iOS | Primary |
| TalkBack | Android | Secondary |

## 🚨 **COMMON ISSUES & SOLUTIONS**

### **Missing Labels**
```jsx
// ❌ Incorrect
<button><Icon name="close" /></button>

// ✅ Correct
<button aria-label="Close dialog">
  <Icon name="close" />
</button>
```

### **Poor Focus Management**
```jsx
// ✅ Proper focus management
const Modal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  
  useEffect(() => {
    if (isOpen) {
      const previouslyFocused = document.activeElement;
      modalRef.current?.focus();
      
      return () => {
        previouslyFocused?.focus();
      };
    }
  }, [isOpen]);
  
  return isOpen ? (
    <div ref={modalRef} role="dialog" tabIndex={-1}>
      {/* Modal content */}
    </div>
  ) : null;
};
```

## 📊 **ACCESSIBILITY METRICS**

### **Success Criteria**
- **WCAG 2.1 AA Compliance**: 100%
- **Keyboard Navigation**: All functionality accessible
- **Screen Reader Compatibility**: Full support
- **Color Contrast**: Minimum 4.5:1 for normal text
- **Touch Target Size**: Minimum 44px × 44px

### **Performance Targets**
- **Lighthouse Accessibility Score**: 95+
- **axe-core Violations**: 0 critical issues
- **Manual Testing Pass Rate**: 100%

---

*Accessibility is not optional—it's essential for creating inclusive digital experiences.*