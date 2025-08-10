# Hardcoded Values Migration Guide

## Overview

This guide outlines the migration from hardcoded text values to a key-based translation system for consistency and proper internationalization support.

## Problem Statement

The application initially used hardcoded text values in both database and UI components, such as:
- Status values: "draft", "active", "مسودة", "نشط"
- Priority levels: "high", "medium", "عالي", "متوسط"
- Types and categories stored as raw text

This created inconsistencies and made proper translation difficult.

## Solution: Key-Based Translation System

### 1. Translation Keys Added

We've added standardized translation keys to the `system_translations` table:

#### Status Keys
- `status.draft` → "Draft" / "مسودة"
- `status.active` → "Active" / "نشط"
- `status.published` → "Published" / "منشور"
- `status.completed` → "Completed" / "مكتمل"
- `status.cancelled` → "Cancelled" / "ملغي"
- `status.archived` → "Archived" / "مؤرشف"
- `status.closed` → "Closed" / "مغلق"
- And more...

#### Priority Keys
- `priority.low` → "Low" / "منخفض"
- `priority.medium` → "Medium" / "متوسط"
- `priority.high` → "High" / "عالي"
- `priority.critical` → "Critical" / "حرج"
- `priority.urgent` → "Urgent" / "عاجل"

#### Type Keys
- `challenge_type.innovation` → "Innovation" / "ابتكار"
- `challenge_type.improvement` → "Improvement" / "تحسين"
- `challenge_type.research` → "Research" / "بحث"
- `event_type.workshop` → "Workshop" / "ورشة عمل"
- `opportunity_type.job` → "Job" / "وظيفة"
- And more...

### 2. Utility Functions Created

#### `/src/utils/valueKeys.ts`
Contains mapping functions to convert between hardcoded values and translation keys:

```typescript
// Convert hardcoded value to translation key
const key = valueToKey('draft', 'status'); // Returns 'status.draft'

// Convert key back to database value
const value = keyToValue('status.draft', 'status'); // Returns 'draft'

// Hook for translated display
const translatedText = useTranslatedValue('draft', 'status'); // Returns "مسودة" or "Draft"
```

### 3. New UI Components

#### `TranslatableSelect`
Replaces hardcoded dropdowns with key-based selections:

```tsx
// OLD WAY - Hardcoded
<Select value={status} onValueChange={setStatus}>
  <SelectContent>
    <SelectItem value="draft">مسودة</SelectItem>
    <SelectItem value="active">نشط</SelectItem>
    <SelectItem value="completed">مكتمل</SelectItem>
  </SelectContent>
</Select>

// NEW WAY - Key-based
<TranslatableSelect
  value={status}
  onValueChange={setStatus}
  category="status"
  placeholder={t('status', 'Status')}
  includeAll
  allLabel={t('common.all_statuses', 'All Statuses')}
/>
```

#### `TranslatableBadge`
Automatically translates and styles status/priority badges:

```tsx
// OLD WAY - Hardcoded
<Badge variant={status === 'active' ? 'default' : 'outline'}>
  {status === 'draft' ? 'مسودة' : status === 'active' ? 'نشط' : status}
</Badge>

// NEW WAY - Key-based
<TranslatableBadge 
  value={status} 
  category="status" 
/>
```

### 4. Database Migration Script

#### `/src/scripts/migrateHardcodedValues.ts`
Automated script to migrate existing database values:

```typescript
// Run migration for all tables
const results = await migrateAllHardcodedValues();

// Or migrate specific table/column
const result = await migrateSingleColumn('challenges', 'status', 'status');
```

## Migration Steps

### Step 1: Deploy Translation Keys ✅
Run the SQL migration to add all translation keys to `system_translations` table.

### Step 2: Update Components
Replace hardcoded dropdowns and badges with new components:

1. Import new components:
```tsx
import { TranslatableBadge, TranslatableSelect } from "@/components/ui/translatable-select";
```

2. Replace hardcoded selects:
```tsx
// Replace status dropdowns
<TranslatableSelect category="status" ... />

// Replace priority dropdowns
<TranslatableSelect category="priority" ... />
```

3. Replace hardcoded badges:
```tsx
<TranslatableBadge value={status} category="status" />
```

### Step 3: Migrate Database Values
Run the migration script to standardize database values:

```typescript
// In browser console or admin interface
await migrateAllHardcodedValues();
```

### Step 4: Update Form Handling
Update form submissions to use standardized values:

```tsx
// The TranslatableSelect automatically handles this
// It displays translated text but stores standard English values
```

## Tables and Columns to Migrate

### Status Fields
- `challenges.status`
- `campaigns.status`
- `ideas.status`
- `events.status`
- `opportunities.status`
- `challenge_participants.status`
- `challenge_submissions.status`

### Priority Fields
- `challenges.priority_level`
- `opportunities.priority_level`
- `challenge_bookmarks.priority`

### Type Fields
- `challenges.challenge_type`
- `events.event_type`
- `opportunities.opportunity_type`
- `team_assignments.assignment_type`

### Sensitivity Fields
- `challenges.sensitivity_level`
- `focus_questions.sensitivity_level`

### Participation & Registration
- `challenge_participants.participation_type`
- `events.registration_type`
- `challenge_experts.role_type`

## Benefits

1. **Consistency**: All status/priority/type values are standardized
2. **Translation**: Automatic translation based on user language
3. **Maintainability**: Single source of truth for value definitions
4. **UI Consistency**: Automatic styling based on value types
5. **Type Safety**: TypeScript support for valid categories and values

## Example: Updated Challenge Component

See `/src/components/admin/challenges/ChallengeManagementListUpdated.tsx` for a complete example of how to apply the new system.

## Testing Migration

1. **Before Migration**: Note existing values in database
2. **Run Migration**: Execute migration script
3. **Verify Values**: Confirm standardization occurred
4. **Test UI**: Ensure dropdowns and badges display correctly
5. **Test Forms**: Verify form submissions work with new system

## Rollback Plan

If issues occur:
1. Revert component changes
2. Database values remain compatible with old code
3. Translation keys can be removed if needed

## Next Steps

1. ✅ Create translation keys
2. ✅ Create utility functions and components
3. ✅ Create migration script
4. 🔄 Update specific components one by one
5. 🔄 Run database migration
6. 🔄 Test thoroughly
7. 🔄 Update remaining components

## Monitoring

Watch for:
- Translation key mismatches
- Database constraint violations
- UI display issues
- Form submission problems

Report issues to the development team for quick resolution.