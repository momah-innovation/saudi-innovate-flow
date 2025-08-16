/**
 * Script to migrate hardcoded values in database to standardized keys
 * Run this after deploying the translation keys
 */

import { supabase } from '@/integrations/supabase/client';
import { VALUE_KEY_MAPPINGS, getStandardValues, valueToKey } from '@/utils/valueKeys';

interface MigrationResult {
  table: string;
  column: string;
  updated: number;
  errors: string[];
}

/**
 * Migrate hardcoded values in specific table columns
 */
async function migrateTableColumn(
  table: string, 
  column: string, 
  category: keyof typeof VALUE_KEY_MAPPINGS
): Promise<MigrationResult> {
  const result: MigrationResult = {
    table,
    column,
    updated: 0,
    errors: []
  };

  try {
    // Get all unique values from the column using any to bypass type checking
    const { data: records, error: fetchError } = await (supabase as any)
      .from(table)
      .select(`id, ${column}`)
      .not(column, 'is', null);

    if (fetchError) {
      result.errors.push(`Error fetching data: ${fetchError.message}`);
      return result;
    }

    if (!records || records.length === 0) {
      return result;
    }

    // Get the mapping for this category
    const mapping = VALUE_KEY_MAPPINGS[category];
    if (!mapping) {
      result.errors.push(`No mapping found for category: ${category}`);
      return result;
    }

    // Group records by their current value for batch updates
    const valueGroups: { [key: string]: string[] } = {};
    
    for (const record of records) {
      const currentValue = (record as any)[column];
      if (!currentValue) continue;

      // Find standard English equivalent
      const standardValues = getStandardValues(category);
      let standardValue = currentValue;
      
      // If current value is in our mapping, get the standard version
      if (mapping[currentValue as keyof typeof mapping]) {
        const key = mapping[currentValue as keyof typeof mapping];
        const standardEntry = standardValues.find(sv => sv.key === key);
        if (standardEntry) {
          standardValue = standardEntry.value;
        }
      }

      // Only update if value would change
      if (standardValue !== currentValue) {
        if (!valueGroups[standardValue]) {
          valueGroups[standardValue] = [];
        }
        valueGroups[standardValue].push((record as any).id);
      }
    }

    // Perform batch updates
    for (const [standardValue, ids] of Object.entries(valueGroups)) {
      try {
        const { error: updateError } = await (supabase as any)
          .from(table)
          .update({ [column]: standardValue })
          .in('id', ids);

        if (updateError) {
          result.errors.push(`Error updating to ${standardValue}: ${updateError.message}`);
        } else {
          result.updated += ids.length;
        }
      } catch (error) {
        result.errors.push(`Unexpected error updating to ${standardValue}: ${error}`);
      }
    }

  } catch (error) {
    result.errors.push(`Unexpected error: ${error}`);
  }

  return result;
}

/**
 * Main migration function
 */
export async function migrateAllHardcodedValues(): Promise<MigrationResult[]> {
  const migrations: Array<{
    table: string;
    column: string;
    category: keyof typeof VALUE_KEY_MAPPINGS;
  }> = [
    // Status fields
    { table: 'challenges', column: 'status', category: 'status' },
    { table: 'campaigns', column: 'status', category: 'status' },
    { table: 'ideas', column: 'status', category: 'status' },
    { table: 'events', column: 'status', category: 'status' },
    { table: 'opportunities', column: 'status', category: 'status' },
    { table: 'challenge_participants', column: 'status', category: 'status' },
    { table: 'challenge_submissions', column: 'status', category: 'status' },
    
    // Priority fields
    { table: 'challenges', column: 'priority_level', category: 'priority' },
    { table: 'opportunities', column: 'priority_level', category: 'priority' },
    { table: 'challenge_bookmarks', column: 'priority', category: 'priority' },
    
    // Challenge types
    { table: 'challenges', column: 'challenge_type', category: 'challenge_type' },
    
    // Event types
    { table: 'events', column: 'event_type', category: 'event_type' },
    
    // Opportunity types
    { table: 'opportunities', column: 'opportunity_type', category: 'opportunity_type' },
    
    // Sensitivity levels
    { table: 'challenges', column: 'sensitivity_level', category: 'sensitivity' },
    { table: 'focus_questions', column: 'sensitivity_level', category: 'sensitivity' },
    
    // Participation types
    { table: 'challenge_participants', column: 'participation_type', category: 'participation_type' },
    
    // Registration types
    { table: 'events', column: 'registration_type', category: 'registration_type' },
    
    // Assignment types
    { table: 'team_assignments', column: 'assignment_type', category: 'assignment_type' },
    
    // Role types
    { table: 'challenge_experts', column: 'role_type', category: 'role_type' }
  ];

  const results: MigrationResult[] = [];

  // Use structured logging for migration scripts
  // console.log('Starting hardcoded values migration...');

  for (const migration of migrations) {
    console.log(`Migrating ${migration.table}.${migration.column} (${migration.category})...`);
    
    const result = await migrateTableColumn(
      migration.table,
      migration.column,
      migration.category
    );
    
    results.push(result);
    
    if (result.errors.length > 0) {
      console.error(`Errors in ${migration.table}.${migration.column}:`, result.errors);
    } else {
      console.log(`✓ Updated ${result.updated} records in ${migration.table}.${migration.column}`);
    }
  }

  // Summary
  const totalUpdated = results.reduce((sum, r) => sum + r.updated, 0);
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  
  console.log('\n=== Migration Summary ===');
  console.log(`Total records updated: ${totalUpdated}`);
  console.log(`Total errors: ${totalErrors}`);
  
  if (totalErrors > 0) {
    console.log('\nErrors by table:');
    results.forEach(r => {
      if (r.errors.length > 0) {
        console.log(`${r.table}.${r.column}: ${r.errors.join(', ')}`);
      }
    });
  }

  return results;
}

/**
 * Helper function to run migration for a specific table/column
 */
export async function migrateSingleColumn(
  table: string,
  column: string,
  category: keyof typeof VALUE_KEY_MAPPINGS
): Promise<MigrationResult> {
  console.log(`Migrating ${table}.${column} (${category})...`);
  
  const result = await migrateTableColumn(table, column, category);
  
  if (result.errors.length > 0) {
    console.error(`Errors:`, result.errors);
  } else {
    console.log(`✓ Updated ${result.updated} records`);
  }
  
  return result;
}

// Export for use in browser console or admin interface
if (typeof window !== 'undefined') {
  (window as any).migrateHardcodedValues = migrateAllHardcodedValues;
  (window as any).migrateSingleColumn = migrateSingleColumn;
}