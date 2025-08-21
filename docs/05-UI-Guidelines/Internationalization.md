# 🌐 Internationalization (i18n)

## 🎯 **OVERVIEW**
Comprehensive internationalization implementation supporting Arabic and English with full RTL/LTR capabilities.

## 🔧 **TECHNICAL IMPLEMENTATION**

### **Translation System Architecture**
```jsx
// useUnifiedTranslation Hook
const useUnifiedTranslation = () => {
  const { t, i18n } = useTranslation();
  
  return {
    t: (key, options) => t(key, { ...options, fallback: key }),
    language: i18n.language,
    dir: i18n.dir(),
    changeLanguage: i18n.changeLanguage,
    isRTL: i18n.dir() === 'rtl'
  };
};
```

### **Language Configuration**
```javascript
// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: { translation: enTranslations },
      ar: { translation: arTranslations }
    },
    interpolation: {
      escapeValue: false
    }
  });
```

## 📚 **TRANSLATION STRUCTURE**

### **Key Naming Convention**
```json
{
  "common": {
    "buttons": {
      "save": "Save",
      "cancel": "Cancel",
      "delete": "Delete"
    },
    "status": {
      "loading": "Loading...",
      "error": "An error occurred",
      "success": "Operation completed successfully"
    }
  },
  "navigation": {
    "dashboard": "Dashboard",
    "challenges": "Innovation Challenges",
    "events": "Events",
    "workspaces": "Workspaces"
  },
  "forms": {
    "validation": {
      "required": "This field is required",
      "email": "Please enter a valid email",
      "minLength": "Minimum {{count}} characters required"
    }
  }
}
```

### **Arabic Translations**
```json
{
  "common": {
    "buttons": {
      "save": "حفظ",
      "cancel": "إلغاء",
      "delete": "حذف"
    },
    "status": {
      "loading": "جاري التحميل...",
      "error": "حدث خطأ",
      "success": "تم إنجاز العملية بنجاح"
    }
  },
  "navigation": {
    "dashboard": "لوحة القيادة",
    "challenges": "تحديات الابتكار",
    "events": "الفعاليات",
    "workspaces": "مساحات العمل"
  }
}
```

## 🎨 **RTL/LTR DESIGN SYSTEM**

### **CSS Direction Support**
```css
/* Base layout direction */
[dir="rtl"] {
  direction: rtl;
  text-align: right;
}

[dir="ltr"] {
  direction: ltr;
  text-align: left;
}

/* Logical properties for spacing */
.component {
  margin-inline-start: 1rem;  /* Adapts to text direction */
  margin-inline-end: 0.5rem;
  padding-inline: 1rem;
  border-inline-start: 1px solid;
}
```

### **Component RTL Implementation**
```jsx
const Button = ({ children, ...props }) => {
  const { isRTL } = useUnifiedTranslation();
  
  return (
    <button
      className={cn(
        "btn",
        isRTL && "btn-rtl"
      )}
      {...props}
    >
      {children}
    </button>
  );
};
```

### **Icon Direction Handling**
```jsx
const DirectionalIcon = ({ name, ...props }) => {
  const { isRTL } = useUnifiedTranslation();
  
  // Icons that should flip in RTL
  const flipIcons = ['chevron-right', 'arrow-right', 'next'];
  const shouldFlip = flipIcons.includes(name) && isRTL;
  
  return (
    <Icon
      name={name}
      className={cn(shouldFlip && "scale-x-[-1]")}
      {...props}
    />
  );
};
```

## 📝 **CONTENT FORMATTING**

### **Numbers & Dates**
```jsx
const formatNumber = (number, locale) => {
  return new Intl.NumberFormat(locale).format(number);
};

const formatDate = (date, locale) => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// Usage in components
const MetricDisplay = ({ value, date }) => {
  const { language } = useUnifiedTranslation();
  
  return (
    <div>
      <span>{formatNumber(value, language)}</span>
      <time>{formatDate(date, language)}</time>
    </div>
  );
};
```

### **Text Interpolation**
```jsx
// Translation with variables
const WelcomeMessage = ({ userName }) => {
  const { t } = useUnifiedTranslation();
  
  return (
    <h1>{t('welcome.greeting', { name: userName })}</h1>
  );
};

// Translation files
{
  "en": {
    "welcome": {
      "greeting": "Welcome, {{name}}!"
    }
  },
  "ar": {
    "welcome": {
      "greeting": "مرحباً، {{name}}!"
    }
  }
}
```

## 🔤 **TYPOGRAPHY & FONTS**

### **Font Loading Strategy**
```css
/* Font faces with proper fallbacks */
@font-face {
  font-family: 'IBM Plex Sans Arabic';
  src: url('/fonts/IBMPlexSansArabic-Regular.woff2') format('woff2');
  font-display: swap;
  unicode-range: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF;
}

/* CSS variables for font families */
:root {
  --font-arabic: 'IBM Plex Sans Arabic', 'Inter', system-ui, sans-serif;
  --font-latin: 'Inter', system-ui, sans-serif;
}

/* Dynamic font assignment */
[lang="ar"] {
  font-family: var(--font-arabic);
}

[lang="en"] {
  font-family: var(--font-latin);
}
```

### **Text Sizing for Arabic**
```css
/* Larger line height for Arabic text */
[lang="ar"] {
  line-height: 1.8;
}

[lang="en"] {
  line-height: 1.6;
}

/* Font size adjustments */
[lang="ar"] .text-sm {
  font-size: 0.9375rem; /* 15px - slightly larger for Arabic */
}

[lang="en"] .text-sm {
  font-size: 0.875rem;   /* 14px - standard for English */
}
```

## 🧩 **COMPONENT PATTERNS**

### **Layout Components**
```jsx
const PageLayout = ({ children, title }) => {
  const { t, isRTL } = useUnifiedTranslation();
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <header>
        <h1>{typeof title === 'string' ? t(title) : title}</h1>
      </header>
      <main className={cn(
        "main-content",
        isRTL && "rtl-layout"
      )}>
        {children}
      </main>
    </div>
  );
};
```

### **Form Components**
```jsx
const FormField = ({ label, error, children, ...props }) => {
  const { t } = useUnifiedTranslation();
  
  return (
    <div className="form-field">
      <label>{t(label)}</label>
      {children}
      {error && (
        <span className="error" role="alert">
          {t(error)}
        </span>
      )}
    </div>
  );
};
```

## 📱 **RESPONSIVE CONSIDERATIONS**

### **Mobile RTL Layout**
```css
/* Mobile-first RTL adjustments */
@media (max-width: 768px) {
  [dir="rtl"] .mobile-nav {
    transform: translateX(100%);
  }
  
  [dir="ltr"] .mobile-nav {
    transform: translateX(-100%);
  }
  
  [dir="rtl"] .slide-in {
    animation: slideInRight 0.3s ease-out;
  }
  
  [dir="ltr"] .slide-in {
    animation: slideInLeft 0.3s ease-out;
  }
}
```

## 🧪 **TESTING STRATEGIES**

### **Translation Coverage Testing**
```javascript
// Test for missing translations
describe('Translation Coverage', () => {
  test('all keys have both English and Arabic translations', () => {
    const enKeys = extractKeys(enTranslations);
    const arKeys = extractKeys(arTranslations);
    
    expect(enKeys).toEqual(arKeys);
  });
  
  test('no hardcoded text in components', () => {
    const components = getComponentFiles();
    components.forEach(file => {
      const content = readFile(file);
      expect(content).not.toMatch(/>\s*[a-zA-Z]/); // No raw English text
    });
  });
});
```

### **RTL Layout Testing**
```javascript
// Visual regression testing for RTL
describe('RTL Layout', () => {
  test('components render correctly in RTL', async () => {
    const component = render(<Component />, {
      wrapper: ({ children }) => (
        <div dir="rtl" lang="ar">
          {children}
        </div>
      )
    });
    
    expect(component).toMatchSnapshot();
  });
});
```

## 🎯 **BEST PRACTICES**

### **Do's**
- ✅ Use logical CSS properties (margin-inline-start, etc.)
- ✅ Test all components in both directions
- ✅ Provide fallback translations
- ✅ Use proper lang attributes
- ✅ Consider text expansion (Arabic can be 30% longer)
- ✅ Use semantic HTML elements

### **Don'ts**
- ❌ Hardcode text in components
- ❌ Use physical CSS properties (margin-left, etc.)
- ❌ Assume text length consistency
- ❌ Forget to test RTL layouts
- ❌ Mix languages without proper markup
- ❌ Use images with embedded text

## 📊 **PERFORMANCE OPTIMIZATION**

### **Lazy Loading Translations**
```javascript
// Dynamic translation loading
const loadTranslations = async (language) => {
  const translations = await import(`./locales/${language}.json`);
  return translations.default;
};

// Code splitting by language
const getTranslations = (lng) => {
  switch (lng) {
    case 'ar':
      return import('./locales/ar.json');
    case 'en':
    default:
      return import('./locales/en.json');
  }
};
```

### **Bundle Optimization**
- Split translations by language
- Load only required translations
- Use tree-shaking for unused keys
- Compress translation files

## 📈 **METRICS & MONITORING**

### **Translation Quality Metrics**
- **Coverage**: 100% key coverage across languages
- **Accuracy**: Native speaker review for all translations
- **Consistency**: Terminology consistency across platform
- **Performance**: Translation load time < 100ms

### **User Experience Metrics**
- **Language Switch Time**: < 200ms
- **Layout Shift**: Minimal CLS when changing direction
- **Font Loading**: Proper fallbacks prevent FOIT
- **Mobile Responsiveness**: RTL touch targets ≥ 44px

---

*Internationalization enables inclusive global experiences for all users.*