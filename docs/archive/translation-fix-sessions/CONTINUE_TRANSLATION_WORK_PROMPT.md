# Prompt for Continuing Translation Fix Work - Saudi Innovate Flow

## Context

You are continuing systematic translation fixes for the Saudi Innovate Flow codebase. The project uses a bilingual (English/Arabic) translation system with React i18n. The main goal is to eliminate all hardcoded strings with RTL conditionals and replace them with proper translation keys.

## Current Status (as of January 19, 2025, 23:12)

### Progress Summary

- **Components Fixed:** 17/50+ (34% complete)
- **Hardcoded Strings Fixed:** 321+
- **Translation Keys Added:** 277+
- **Sessions Completed:** 3
- **Estimated Remaining Work:** 1-2 days

### Key Files for Reference

1. **TRANSLATION_FIX_MASTER_PLAN.md** - Overall progress tracking
2. **TRANSLATION_FIX_TODO_LIST.md** - Detailed component checklist
3. **CODEBASE_TRANSLATION_AUDIT.md** - Audit report and fixes applied
4. **TRANSLATION_FIX_SUMMARY_SESSION.md** - Latest session summary

## What Has Been Completed

### Translation Files Enhanced (Session 3)

- ✅ team.json (EN/AR) - 50+ keys added for analytics and hero sections
- ✅ opportunities.json (EN/AR) - 80+ keys added for analytics/metrics
- ✅ partners.json (EN/AR) - 20+ keys added for dashboard/details
- ✅ challenges.json - Fixed duplicate keys and structure issues
- ✅ statistics.json - Added filter-related keys
- ✅ ui.json - Added select component keys

### Components Recently Fixed

- ✅ TeamWorkspaceAnalyticsDashboard.tsx - 35 strings fixed
- ✅ EnhancedTeamWorkspaceHero.tsx - 20 strings fixed
- ✅ All Events components (4/4 complete)
- ✅ All Team Workspace components (6/6 complete)
- ✅ Search components verified clean

## What Needs to Be Done

### High Priority Components Still Containing Hardcoded Strings

1. **Storage Components** (~15-20 files)

   - No storage.json exists - needs to be created
   - Multiple components in src/components/storage/ have hardcoded strings
   - Pattern: Many `isRTL ? 'ar' : 'en'` conditionals

2. **Opportunities Components** (partially fixed)

   - AdvancedPerformanceMetrics.tsx
   - CollaborativeOpportunityCard.tsx
   - ComprehensiveAnalyticsDashboard.tsx
   - AnalyticsExportDialog.tsx
   - AnalyticsImplementationStatus.tsx

3. **Partners Components** (partially fixed)

   - PartnershipDetailDialog.tsx
   - PartnershipApplicationsTable.tsx
   - EnhancedPartnerDashboardHero.tsx

4. **UI Components**
   - Various utility components still have hardcoded strings
   - Components in src/components/ui/ directory

## Technical Details

### Pattern to Fix

```javascript
// WRONG - This needs to be fixed:
isRTL ? "نص عربي" : "English text";

// CORRECT - Replace with:
t("namespace:key");
```

### Import to Use

```javascript
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";

// Then in component:
const { t } = useUnifiedTranslation();
```

### Translation File Structure

```
src/i18n/locales/
├── en/
│   └── [namespace].json
└── ar/
    └── [namespace].json
```

## Critical Rules

1. **NEVER remove existing translations** - only add missing keys
2. **ALWAYS add to both EN and AR files** simultaneously
3. **PRESERVE existing functionality** - don't break code
4. **USE consistent key naming:** `namespace:category.specific_key`
5. **TEST that imports work** - useUnifiedTranslation is at '@/hooks/useUnifiedTranslation'

## Instructions for Next Session

1. **Start by checking the tracking documents:**

   - Read TRANSLATION_FIX_MASTER_PLAN.md for overall status
   - Check TRANSLATION_FIX_TODO_LIST.md for component list
   - Review CODEBASE_TRANSLATION_AUDIT.md for what's been fixed

2. **Search for remaining hardcoded strings:**

   ```
   Search pattern: isRTL\s*\?\s*['"][^'"]+['"]\s*:\s*['"][^'"]+['"]
   ```

3. **For each component with hardcoded strings:**

   - Import useUnifiedTranslation hook
   - Replace all hardcoded strings with t() calls
   - Add missing keys to both EN and AR translation files
   - Test that the component still compiles

4. **Priority Order:**

   - Create storage.json files first if working on storage components
   - Fix components with the most hardcoded strings first
   - Complete partially fixed namespaces (opportunities, partners)

5. **Update tracking documents after each fix:**
   - Update TRANSLATION_FIX_MASTER_PLAN.md with progress
   - Mark completed items in TRANSLATION_FIX_TODO_LIST.md
   - Update CODEBASE_TRANSLATION_AUDIT.md if needed

## Example Fix Process

### Step 1: Find a component with hardcoded strings

```javascript
// Example: src/components/storage/StorageManager.tsx
title: isRTL ? "إدارة التخزين" : "Storage Management";
```

### Step 2: Add translation keys

```json
// src/i18n/locales/en/storage.json (create if doesn't exist)
{
  "management": {
    "title": "Storage Management"
  }
}

// src/i18n/locales/ar/storage.json (create if doesn't exist)
{
  "management": {
    "title": "إدارة التخزين"
  }
}
```

### Step 3: Update component

```javascript
// Add import
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";

// In component
const { t } = useUnifiedTranslation();

// Replace hardcoded string
title: t("storage:management.title");
```

## Expected Outcomes

- All `isRTL ? 'text' : 'text'` patterns eliminated
- Complete translation coverage for all user-facing text
- Consistent bilingual support across the platform
- Clean, maintainable codebase with centralized translations

## Note

The codebase is large with 300+ hardcoded strings originally found. Good progress has been made (321+ fixed), but systematic continuation is needed. Focus on completing one namespace at a time for better organization.

---

**Use this prompt to start a new Cline session and continue the translation fix work systematically.**
