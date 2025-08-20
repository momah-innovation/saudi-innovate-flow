# 🎨 Dashboard Styling System Documentation

## 📋 **Complete Styling Reference**

This document provides comprehensive styling guidelines for implementing the dashboard design system across all pages and components in the Innovation Management Platform.

---

## 🎯 **Design System Foundation**

### **CSS Custom Properties**
```css
:root {
  /* Role-based gradient colors */
  --gradient-super-admin: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  --gradient-admin: linear-gradient(135deg, #ef4444 0%, #ec4899 100%);
  --gradient-team-member: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
  --gradient-expert: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
  --gradient-partner: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  --gradient-default: linear-gradient(135deg, #64748b 0%, #6b7280 100%);

  /* Role-based shadow colors */
  --shadow-super-admin: 0 10px 15px -3px rgba(124, 58, 237, 0.1);
  --shadow-admin: 0 10px 15px -3px rgba(239, 68, 68, 0.1);
  --shadow-team-member: 0 10px 15px -3px rgba(59, 130, 246, 0.1);
  --shadow-expert: 0 10px 15px -3px rgba(16, 185, 129, 0.1);
  --shadow-partner: 0 10px 15px -3px rgba(245, 158, 11, 0.1);

  /* Component spacing */
  --dashboard-container-padding: 1.5rem;
  --dashboard-card-padding: 1rem;
  --dashboard-hero-padding: 1.5rem;
  --dashboard-border-radius: 8px;
  --dashboard-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Typography scale */
  --dashboard-font-size-xs: 0.75rem;   /* 12px */
  --dashboard-font-size-sm: 0.875rem;  /* 14px */
  --dashboard-font-size-base: 1rem;    /* 16px */
  --dashboard-font-size-lg: 1.125rem;  /* 18px */
  --dashboard-font-size-xl: 1.25rem;   /* 20px */
  --dashboard-font-size-2xl: 1.5rem;   /* 24px */
  --dashboard-font-size-3xl: 1.875rem; /* 30px */

  /* Grid system */
  --dashboard-grid-gap: 1.5rem;
  --dashboard-grid-gap-sm: 1rem;
  --dashboard-max-width: 1280px;
}
```

---

## 🏗️ **Layout System**

### **Container & Grid Classes**
```css
/* Main dashboard container */
.dashboard-container {
  max-width: var(--dashboard-max-width);
  margin: 0 auto;
  padding: var(--dashboard-container-padding);
  space-y: var(--dashboard-grid-gap);
}

/* Responsive grid system */
.dashboard-grid {
  display: grid;
  gap: var(--dashboard-grid-gap);
  grid-template-columns: 1fr;
}

.dashboard-grid-sm {
  gap: var(--dashboard-grid-gap-sm);
}

/* Responsive breakpoints */
@media (min-width: 640px) {
  .dashboard-grid-sm-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .dashboard-grid-md-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  .dashboard-grid-md-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .dashboard-grid-lg-3 {
    grid-template-columns: repeat(3, 1fr);
  }
  .dashboard-grid-lg-4 {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1280px) {
  .dashboard-grid-xl-4 {
    grid-template-columns: repeat(4, 1fr);
  }
  .dashboard-grid-xl-5 {
    grid-template-columns: repeat(5, 1fr);
  }
}
```

---

## 🎨 **Component Styling System**

### **Hero Section Components**
```css
/* Base hero styling */
.dashboard-hero {
  border-radius: var(--dashboard-border-radius);
  padding: var(--dashboard-hero-padding);
  color: white;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition: var(--dashboard-transition);
}

/* Hero overlay effect */
.dashboard-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%);
  pointer-events: none;
}

/* Role-specific hero gradients */
.hero-super-admin {
  background: var(--gradient-super-admin);
  box-shadow: var(--shadow-super-admin);
}

.hero-admin {
  background: var(--gradient-admin);
  box-shadow: var(--shadow-admin);
}

.hero-team-member {
  background: var(--gradient-team-member);
  box-shadow: var(--shadow-team-member);
}

.hero-expert {
  background: var(--gradient-expert);
  box-shadow: var(--shadow-expert);
}

.hero-partner {
  background: var(--gradient-partner);
  box-shadow: var(--shadow-partner);
}

.hero-default {
  background: var(--gradient-default);
  box-shadow: 0 10px 15px -3px rgba(100, 116, 139, 0.1);
}

/* Hero content styling */
.dashboard-hero-title {
  font-size: var(--dashboard-font-size-3xl);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 0.5rem;
}

.dashboard-hero-subtitle {
  font-size: var(--dashboard-font-size-lg);
  opacity: 0.9;
  margin-bottom: 1rem;
}

.dashboard-hero-stats {
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
}

.dashboard-hero-stat {
  text-align: center;
}

.dashboard-hero-stat-value {
  font-size: var(--dashboard-font-size-2xl);
  font-weight: 700;
  line-height: 1;
}

.dashboard-hero-stat-label {
  font-size: var(--dashboard-font-size-sm);
  opacity: 0.8;
  margin-top: 0.25rem;
}
```

### **Card Components**
```css
/* Base card styling */
.dashboard-card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--dashboard-border-radius);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: var(--dashboard-transition);
  overflow: hidden;
}

.dashboard-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* Card variants */
.dashboard-card-elevated {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.dashboard-card-elevated:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.dashboard-card-interactive {
  cursor: pointer;
  transition: all 0.2s ease;
}

.dashboard-card-interactive:hover {
  border-color: hsl(var(--primary));
}

.dashboard-card-interactive:active {
  transform: translateY(1px);
}

/* Card header and content */
.dashboard-card-header {
  padding: var(--dashboard-card-padding);
  border-bottom: 1px solid hsl(var(--border));
}

.dashboard-card-content {
  padding: var(--dashboard-card-padding);
}

.dashboard-card-title {
  font-size: var(--dashboard-font-size-lg);
  font-weight: 600;
  line-height: 1.25;
  color: hsl(var(--foreground));
}

.dashboard-card-description {
  font-size: var(--dashboard-font-size-sm);
  color: hsl(var(--muted-foreground));
  margin-top: 0.25rem;
}
```

### **Metrics Components**
```css
/* Metrics grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--dashboard-grid-gap);
}

/* Metric card */
.metric-card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--dashboard-border-radius);
  padding: var(--dashboard-card-padding);
  transition: var(--dashboard-transition);
  position: relative;
  overflow: hidden;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border-color: hsl(var(--primary) / 0.3);
}

/* Metric card accent bar */
.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary-variant, var(--primary))));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.metric-card:hover::before {
  opacity: 1;
}

/* Metric value styling */
.metric-value {
  font-size: var(--dashboard-font-size-3xl);
  font-weight: 700;
  line-height: 1.2;
  color: hsl(var(--foreground));
}

.metric-label {
  font-size: var(--dashboard-font-size-sm);
  color: hsl(var(--muted-foreground));
  font-weight: 500;
  margin-top: 0.5rem;
}

/* Metric change indicators */
.metric-change {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: var(--dashboard-font-size-xs);
  font-weight: 500;
  margin-top: 0.5rem;
}

.metric-change-positive {
  background: hsl(var(--success) / 0.1);
  color: hsl(var(--success));
}

.metric-change-negative {
  background: hsl(var(--destructive) / 0.1);
  color: hsl(var(--destructive));
}

.metric-change-neutral {
  background: hsl(var(--muted) / 0.1);
  color: hsl(var(--muted-foreground));
}
```

### **Activity Feed Components**
```css
/* Activity feed container */
.activity-feed-container {
  background: hsl(var(--card));
  border-radius: var(--dashboard-border-radius);
  border: 1px solid hsl(var(--border));
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

/* Activity feed header */
.activity-feed-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--dashboard-card-padding);
  border-bottom: 1px solid hsl(var(--border));
}

.activity-feed-title {
  font-size: var(--dashboard-font-size-lg);
  font-weight: 600;
  color: hsl(var(--foreground));
}

/* Activity card */
.activity-card {
  padding: var(--dashboard-card-padding);
  border-bottom: 1px solid hsl(var(--border) / 0.5);
  transition: all 0.2s ease;
  position: relative;
}

.activity-card:hover {
  background: hsl(var(--muted) / 0.3);
  border-left: 3px solid hsl(var(--primary));
  padding-left: calc(var(--dashboard-card-padding) - 3px);
}

.activity-card:last-child {
  border-bottom: none;
}

/* Activity icon container */
.activity-icon-container {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--dashboard-border-radius);
  background: hsl(var(--primary) / 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: hsl(var(--primary));
}

/* Activity content */
.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-title {
  font-size: var(--dashboard-font-size-sm);
  font-weight: 500;
  color: hsl(var(--foreground));
  line-height: 1.4;
}

.activity-description {
  font-size: var(--dashboard-font-size-xs);
  color: hsl(var(--muted-foreground));
  margin-top: 0.25rem;
  line-height: 1.3;
}

.activity-timestamp {
  font-size: var(--dashboard-font-size-xs);
  color: hsl(var(--muted-foreground));
  margin-top: 0.5rem;
}

/* Activity severity indicators */
.activity-severity-critical {
  border-left: 4px solid hsl(var(--destructive));
}

.activity-severity-warning {
  border-left: 4px solid hsl(var(--warning, 245 158 11));
}

.activity-severity-info {
  border-left: 4px solid hsl(var(--primary));
}

.activity-severity-low {
  border-left: 4px solid hsl(var(--muted-foreground));
}
```

### **Tab System Components**
```css
/* Dashboard tabs */
.dashboard-tabs {
  background: hsl(var(--muted) / 0.3);
  border-radius: var(--dashboard-border-radius);
  padding: 0.25rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.dashboard-tab-trigger {
  padding: 0.5rem 1rem;
  border-radius: calc(var(--dashboard-border-radius) - 2px);
  font-weight: 500;
  font-size: var(--dashboard-font-size-sm);
  transition: all 0.2s ease;
  color: hsl(var(--muted-foreground));
  background: transparent;
  border: none;
  cursor: pointer;
}

.dashboard-tab-trigger:hover {
  background: hsl(var(--muted) / 0.5);
  color: hsl(var(--foreground));
}

.dashboard-tab-trigger[data-state="active"] {
  background: hsl(var(--card));
  color: hsl(var(--foreground));
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.dashboard-tab-content {
  margin-top: 1.5rem;
}
```

### **Quick Actions Components**
```css
/* Quick actions grid */
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--dashboard-grid-gap-sm);
}

/* Quick action button */
.quick-action-button {
  width: 100%;
  justify-content: flex-start;
  padding: 0.75rem;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--dashboard-border-radius);
  transition: var(--dashboard-transition);
  text-align: left;
  cursor: pointer;
}

.quick-action-button:hover {
  background: hsl(var(--accent) / 0.5);
  border-color: hsl(var(--primary) / 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.quick-action-button:active {
  transform: translateY(0);
}

/* Quick action icon */
.quick-action-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  flex-shrink: 0;
  background: hsl(var(--primary) / 0.1);
  color: hsl(var(--primary));
}

/* Quick action content */
.quick-action-content {
  flex: 1;
  min-width: 0;
}

.quick-action-title {
  font-size: var(--dashboard-font-size-sm);
  font-weight: 500;
  color: hsl(var(--foreground));
  line-height: 1.4;
}

.quick-action-description {
  font-size: var(--dashboard-font-size-xs);
  color: hsl(var(--muted-foreground));
  margin-top: 0.25rem;
  line-height: 1.3;
}
```

---

## 📱 **Responsive Design System**

### **Mobile-First Breakpoints**
```css
/* Base styles (mobile) */
.dashboard-container {
  padding: 1rem;
}

.dashboard-hero-title {
  font-size: var(--dashboard-font-size-2xl);
}

.dashboard-hero-stats {
  flex-direction: column;
  gap: 1rem;
}

.metrics-grid {
  grid-template-columns: 1fr;
  gap: var(--dashboard-grid-gap-sm);
}

/* Small screens (sm: 640px) */
@media (min-width: 640px) {
  .dashboard-hero-stats {
    flex-direction: row;
    gap: 2rem;
  }
  
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Medium screens (md: 768px) */
@media (min-width: 768px) {
  .dashboard-container {
    padding: var(--dashboard-container-padding);
  }
  
  .dashboard-hero-title {
    font-size: var(--dashboard-font-size-3xl);
  }
  
  .metrics-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .quick-actions-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Large screens (lg: 1024px) */
@media (min-width: 1024px) {
  .metrics-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .quick-actions-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .dashboard-grid-sidebar {
    grid-template-columns: 2fr 1fr;
  }
}

/* Extra large screens (xl: 1280px) */
@media (min-width: 1280px) {
  .dashboard-container {
    max-width: var(--dashboard-max-width);
    margin: 0 auto;
  }
  
  .metrics-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
```

---

## 🌙 **Dark Mode Support**

### **Dark Mode Variables**
```css
@media (prefers-color-scheme: dark) {
  :root {
    --dashboard-card-bg-dark: #1f2937;
    --dashboard-border-dark: #374151;
    --dashboard-text-dark: #f9fafb;
    --dashboard-muted-dark: #6b7280;
  }
  
  .dashboard-card {
    background: var(--dashboard-card-bg-dark);
    border-color: var(--dashboard-border-dark);
    color: var(--dashboard-text-dark);
  }
  
  .activity-card:hover {
    background: #374151;
  }
  
  .activity-feed-container {
    background: var(--dashboard-card-bg-dark);
    border-color: var(--dashboard-border-dark);
  }
  
  .metric-card {
    background: var(--dashboard-card-bg-dark);
    border-color: var(--dashboard-border-dark);
    color: var(--dashboard-text-dark);
  }
}
```

---

## 🖨️ **Print Styles**

### **Print Optimization**
```css
@media print {
  .dashboard-hero {
    background: white !important;
    color: black !important;
    box-shadow: none !important;
  }
  
  .quick-actions,
  .activity-filters,
  .dashboard-tabs {
    display: none;
  }
  
  .metric-card {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid #ccc;
  }
  
  .activity-card {
    break-inside: avoid;
  }
  
  .dashboard-container {
    max-width: none;
    padding: 0;
  }
}
```

---

## 🎯 **Usage Guidelines**

### **Implementation Steps**
1. **Add CSS variables to your global stylesheet**
2. **Use the component classes for consistent styling**
3. **Apply responsive classes based on screen size requirements**
4. **Customize role-based gradients for different user types**
5. **Test dark mode and print styles**

### **Best Practices**
- Always use CSS custom properties for colors and dimensions
- Implement mobile-first responsive design
- Ensure proper contrast ratios for accessibility
- Use semantic HTML with appropriate ARIA labels
- Test across different devices and browsers

### **Performance Considerations**
- Minimize CSS bundle size by using only required components
- Use efficient CSS selectors and avoid deep nesting
- Leverage CSS Grid and Flexbox for layout
- Optimize animations and transitions for 60fps performance

---

**📅 Last Updated: 2025-01-20 20:50 UTC**
**🎯 Status: Complete styling system ready for implementation**
**📊 Coverage: All dashboard components and responsive breakpoints documented**