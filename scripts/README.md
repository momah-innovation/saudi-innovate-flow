# Database Safety Scripts

These scripts help fix critical database safety issues in the codebase by replacing dangerous `.single()` calls with safer `.maybeSingle()` calls.

## 🚨 Why This Matters

`.single()` calls throw runtime errors when no data is returned, which can crash your application. `.maybeSingle()` returns `null` instead, allowing for proper error handling.

## Scripts Overview

### 1. `fix-single-calls.js`
Automatically replaces `.single()` with `.maybeSingle()` across the codebase.

**Usage:**
```bash
# Dry run (see what would be changed)
node scripts/fix-single-calls.js --dry-run

# Apply fixes
node scripts/fix-single-calls.js
```

**Features:**
- Creates backup files (`.backup`)
- Handles complex patterns like `await` statements
- Adds TODO comments for null checking
- Comprehensive reporting

### 2. `verify-single-fixes.js`
Verifies the quality of fixes and identifies remaining issues.

**Usage:**
```bash
node scripts/verify-single-fixes.js
```

**Checks for:**
- Remaining `.single()` calls
- `.maybeSingle()` calls without null checking
- Properly handled patterns

## 🔧 Step-by-Step Process

### Step 1: Run Dry Run
```bash
node scripts/fix-single-calls.js --dry-run
```
This shows you what would be changed without modifying files.

### Step 2: Apply Fixes
```bash
node scripts/fix-single-calls.js
```
This applies the fixes and creates backups.

### Step 3: Verify Results
```bash
node scripts/verify-single-fixes.js
```
This checks the quality of fixes and identifies remaining work.

### Step 4: Add Null Checks
Manually add proper null checking where needed. Example:

**Before:**
```typescript
const result = await supabase.from('challenges').select().eq('id', id).maybeSingle();
// TODO: Add null check: if (!result) { handle empty result }
return result.data;
```

**After:**
```typescript
const { data, error } = await supabase.from('challenges').select().eq('id', id).maybeSingle();
if (error) throw error;
if (!data) {
  throw new Error('Challenge not found');
}
return data;
```

### Step 5: Test & Clean Up
1. Test the affected functionality
2. Remove backup files after verification: `rm src/**/*.backup`

## 🎯 Common Null Check Patterns

### Pattern 1: Throw Error
```typescript
const { data, error } = await supabase.from('table').select().maybeSingle();
if (error) throw error;
if (!data) throw new Error('Record not found');
return data;
```

### Pattern 2: Return Default
```typescript
const { data, error } = await supabase.from('table').select().maybeSingle();
if (error) throw error;
return data || { /* default object */ };
```

### Pattern 3: Optional Return
```typescript
const { data, error } = await supabase.from('table').select().maybeSingle();
if (error) throw error;
return data; // Can be null - caller handles it
```

## 📊 Expected Results

Based on the codebase analysis:
- **71 `.single()` calls** across 44 files will be fixed
- **Most critical files:**
  - `src/hooks/useEventManagement.ts` (4 instances)
  - `src/pages/IdeaSubmissionWizard.tsx` (5 instances)
  - `src/components/challenges/ChallengePage.tsx` (2 instances)

## ⚠️ Important Notes

1. **Always test after running**: Database queries behave differently with null returns
2. **Keep backups**: The script creates `.backup` files - don't delete until verified
3. **Review TODO comments**: Each fix includes a TODO for manual null checking
4. **Handle edge cases**: Some queries legitimately expect data to exist - add appropriate error handling

## 🔍 Verification Commands

```bash
# Count remaining .single() calls
grep -r "\.single()" src/ --include="*.ts" --include="*.tsx" | wc -l

# Find files with .maybeSingle() but no null checks
grep -r "\.maybeSingle()" src/ --include="*.ts" --include="*.tsx" -A 3 | grep -v "if.*!"
```

## 🆘 Troubleshooting

### Issue: Script fails with permission error
**Solution:** `chmod +x scripts/*.js`

### Issue: Too many changes to review
**Solution:** Run script on specific directories first:
```bash
# Modify script to process specific directory
const SRC_DIRECTORY = 'src/hooks'; // Focus on hooks first
```

### Issue: Build errors after fixes
**Solution:** The TODO comments will guide you to add proper null checks where TypeScript expects non-null values.