# Translation System Documentation

## Overview

The translation system in this application is a hybrid architecture that combines static translation files for hardcoded UI text with a dynamic database system for user-generated and dynamic content.

## Architecture

### 1. Static Translation System (i18next)
**Purpose**: Handles hardcoded UI text, labels, buttons, and static content  
**Technology**: react-i18next with JSON files  
**Languages**: Arabic (ar) and English (en)

#### Files:
- `src/i18n/config.ts` - i18next configuration
- `src/i18n/locales/en.json` - English static translations
- `src/i18n/locales/ar.json` - Arabic static translations
- `src/hooks/useAppTranslation.ts` - Custom translation hook

#### Configuration:
```typescript
// Language detection order: localStorage → navigator → htmlTag
// Fallback language: English
// Supported languages: ['en', 'ar']
// Storage key: 'i18nextLng'
```

### 2. Dynamic Translation System (Database)
**Purpose**: Handles dynamic content like settings, user-generated content, and system configurations  
**Technology**: Supabase with `system_translations` table  
**Hook**: `useSystemTranslations`

#### Database Schema:
```sql
system_translations (
  id: uuid,
  translation_key: text,
  language_code: text,
  translation_text: text,
  category: text
)
```

## Translation Flow

### 1. Static Text Translation Flow
```
User Action → useTranslation() → react-i18next → JSON files → Display Text
```

**Example**:
```typescript
const { t } = useTranslation();
const text = t('save_settings'); // Returns "Save Settings" or "حفظ الإعدادات"
```

### 2. Dynamic Text Translation Flow
```
Component Load → useSystemTranslations() → Supabase Query → Database → Display Text
```

**Example**:
```typescript
const { getTranslation } = useSystemTranslations();
const text = getTranslation('ai_category_label', 'AI'); // Returns DB value or fallback
```

### 3. Language & Direction Management
```
DirectionProvider → Language Change → i18next.changeLanguage() → DOM Direction Update
```

**Components**:
- `DirectionProvider` - Context for language and direction state
- `useDirection()` - Hook for language/direction management
- `LanguageToggle` - UI component for language switching

## Key Components

### 1. DirectionProvider
**Location**: `src/components/ui/direction-provider.tsx`  
**Purpose**: Central state management for language and RTL/LTR direction  
**Features**:
- Automatic language detection
- LocalStorage persistence
- DOM direction attribute management
- i18next integration

### 2. useTranslation Hook
**Location**: `src/hooks/useAppTranslation.ts`  
**Purpose**: Enhanced translation hook with additional utilities  
**Features**:
- Language-specific text selection
- Number formatting
- Relative time formatting
- RTL detection

### 3. useSystemTranslations Hook
**Location**: `src/hooks/useSystemTranslations.ts`  
**Purpose**: Database-driven translations for dynamic content  
**Features**:
- Language-specific queries
- Fallback support
- Missing translation logging

### 4. Language Toggle Components
**Files**: 
- `src/components/ui/language-toggle.tsx` (Dropdown)
- `src/components/layout/LanguageToggle.tsx` (Simple toggle)
**Purpose**: UI controls for language switching

## RTL/LTR Support

### 1. CSS Classes
**File**: `src/lib/rtl-utils.ts`  
**Features**:
- Direction-aware spacing (margins, padding)
- Text alignment utilities
- Flex direction helpers
- Icon rotation support

### 2. Component Utilities
**File**: `src/components/ui/rtl-aware.tsx`  
**Features**:
- RTLAware wrapper component
- useRTLAwareClasses hook
- Conditional class application

## Missing Translation Handling

### Static Translations
When a translation key is missing from JSON files:
- i18next shows debug message: `missingKey [lang] translation [key] [key]`
- Falls back to the key itself
- Console warning in development mode

### Dynamic Translations
When a translation is missing from database:
- `getTranslation()` returns provided fallback or key
- Console log: `Missing translation for key: [key] language: [lang]`
- Graceful degradation with fallback text

## Current Issues (From Console Logs)

### Missing Static Translations:
1. `toggle_theme` - Theme toggle button aria-label
2. `open_navigation` - Navigation menu button aria-label  
3. `toggle_direction` - Direction toggle button aria-label

### React Key Warning:
- `UnifiedHeader` component has child elements without unique keys in dropdown menu items

## Usage Examples

### Static Translation
```typescript
// In component
const { t, language, isRTL } = useTranslation();

return (
  <button aria-label={t('toggle_theme')}>
    {t('theme_toggle_button')}
  </button>
);
```

### Dynamic Translation
```typescript
// In component  
const { getTranslation } = useSystemTranslations();

return (
  <h2>{getTranslation('ai_category_label', 'AI Settings')}</h2>
);
```

### Bilingual Dynamic Content
```typescript
// For content with both Arabic and English in database
const { getDynamicText, language } = useTranslation();

return (
  <p>{getDynamicText(item.description_ar, item.description_en)}</p>
);
```

## Best Practices

### 1. Use Static Translations For:
- UI labels and buttons
- Navigation items
- Form labels
- Error messages
- Static help text

### 2. Use Dynamic Translations For:
- User-generated content
- System configurations
- Settings categories and descriptions
- Dynamic status messages
- Content that changes based on admin settings

### 3. Fallback Strategy:
- Always provide meaningful fallbacks for dynamic translations
- Use English as fallback language for missing translations
- Ensure key names are descriptive enough to be readable fallbacks

### 4. RTL Considerations:
- Use semantic classes instead of directional ones (start/end vs left/right)
- Test all UI components in both RTL and LTR modes
- Consider text length differences between Arabic and English
- Use appropriate fonts for each language

## Migration Notes

When migrating from old header components:
1. Replace language dropdown with simple toggle
2. Update translation keys to use static files for UI text
3. Migrate dynamic content to database translations
4. Ensure proper key props for React lists
5. Test RTL layout thoroughly