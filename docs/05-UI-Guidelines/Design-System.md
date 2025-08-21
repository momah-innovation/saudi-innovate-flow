# 🎨 Design System

## 🎯 **OVERVIEW**
Comprehensive design system ensuring visual consistency and accessibility across the Ruwād Innovation Platform.

## 🎨 **COLOR SYSTEM**

### **Primary Palette**
```css
--primary: 222 47% 11%          /* Saudi Green */
--primary-foreground: 210 40% 98%
--secondary: 210 40% 96%
--secondary-foreground: 222 84% 4.9%
```

### **Semantic Colors**
```css
--success: 142 76% 36%          /* Success states */
--warning: 38 92% 50%           /* Warning states */
--destructive: 0 84% 60%        /* Error states */
--info: 217 91% 60%             /* Information */
```

### **Neutral Scale**
```css
--background: 0 0% 100%         /* Main background */
--foreground: 222 84% 4.9%      /* Primary text */
--muted: 210 40% 96%            /* Subtle backgrounds */
--muted-foreground: 215 16% 47% /* Secondary text */
```

## 📏 **SPACING SYSTEM**
- **Base Unit**: 4px (0.25rem)
- **Scale**: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px
- **Container Max-Width**: 1280px
- **Content Padding**: 16px mobile, 24px desktop

## 🔤 **TYPOGRAPHY**

### **Font Families**
```css
--font-sans: "Inter", system-ui, sans-serif
--font-arabic: "IBM Plex Sans Arabic", "Inter", system-ui
```

### **Type Scale**
- **xs**: 12px / 16px (0.75rem)
- **sm**: 14px / 20px (0.875rem)
- **base**: 16px / 24px (1rem)
- **lg**: 18px / 28px (1.125rem)
- **xl**: 20px / 28px (1.25rem)
- **2xl**: 24px / 32px (1.5rem)
- **3xl**: 30px / 36px (1.875rem)
- **4xl**: 36px / 40px (2.25rem)

## 🎯 **COMPONENT TOKENS**

### **Buttons**
```css
--button-height: 40px           /* Standard button height */
--button-padding-x: 16px        /* Horizontal padding */
--button-radius: 6px            /* Border radius */
```

### **Inputs**
```css
--input-height: 40px            /* Standard input height */
--input-padding-x: 12px         /* Horizontal padding */
--input-border-width: 1px       /* Border thickness */
```

### **Shadows**
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
```

## 🌐 **RTL SUPPORT**
- **Text Direction**: Automatic based on language
- **Layout Mirroring**: Icons, navigation, and spacing
- **Font Selection**: Arabic fonts for Arabic content

## ♿ **ACCESSIBILITY**

### **Color Contrast**
- **Normal Text**: 4.5:1 minimum ratio
- **Large Text**: 3:1 minimum ratio
- **UI Components**: 3:1 minimum ratio

### **Touch Targets**
- **Minimum Size**: 44px × 44px
- **Interactive Spacing**: 8px minimum between targets

### **Focus Indicators**
```css
--focus-ring: 2px solid hsl(var(--primary))
--focus-ring-offset: 2px
```

## 📱 **RESPONSIVE BREAKPOINTS**
```css
--breakpoint-sm: 640px          /* Small devices */
--breakpoint-md: 768px          /* Medium devices */
--breakpoint-lg: 1024px         /* Large devices */
--breakpoint-xl: 1280px         /* Extra large */
--breakpoint-2xl: 1536px        /* 2X large */
```

## 🧩 **COMPONENT VARIANTS**

### **Button Variants**
- `default`: Primary action button
- `destructive`: Delete/remove actions
- `outline`: Secondary actions
- `secondary`: Subtle actions
- `ghost`: Minimal visual weight
- `link`: Text-like appearance

### **Card Variants**
- `default`: Standard content card
- `elevated`: Prominent content
- `outlined`: Subtle boundaries
- `interactive`: Hoverable/clickable

## 🎬 **ANIMATION TOKENS**
```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1)
```

## 📚 **USAGE GUIDELINES**

### **Do's**
- ✅ Use semantic color tokens
- ✅ Follow spacing scale consistently
- ✅ Maintain 4.5:1 contrast ratios
- ✅ Test with RTL layouts
- ✅ Use component variants

### **Don'ts**
- ❌ Hardcode color values
- ❌ Create custom spacing values
- ❌ Ignore accessibility requirements
- ❌ Override design tokens directly

---

*Design system ensures consistency, accessibility, and scalability across the platform.*