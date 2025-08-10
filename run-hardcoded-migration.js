#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 Running hardcoded values migration...\n');

try {
  // Run the hardcoded values migration
  execSync('node -e "' +
    'const { createClient } = require(\'@supabase/supabase-js\');' +
    'const supabase = createClient(\'https://jxpbiljkoibvqxzdkgod.supabase.co\', \'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cGJpbGprb2lidnF4emRrZ29kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NzEzMDksImV4cCI6MjA2OTA0NzMwOX0.ls7b6Dh5Go0nQYP6Sjv1c_IxPXEv8MC5RQEpH91Z_V8\');' +
    
    'const VALUE_KEY_MAPPINGS = {' +
      'status: { \'مفتوح\': \'open\', \'مغلق\': \'closed\', \'قيد المراجعة\': \'under_review\', \'مؤجل\': \'postponed\', \'ملغي\': \'cancelled\', \'نشط\': \'active\', \'غير نشط\': \'inactive\', \'مكتمل\': \'completed\', \'جاري\': \'in_progress\', \'معلق\': \'pending\', \'مرفوض\': \'rejected\', \'موافق عليه\': \'approved\', \'مسودة\': \'draft\', \'منشور\': \'published\' },' +
      'priority: { \'عالي\': \'high\', \'متوسط\': \'medium\', \'منخفض\': \'low\', \'طوارئ\': \'urgent\', \'حرج\': \'critical\' },' +
      'challenge_type: { \'تطوير المنتج\': \'product_development\', \'تحسين العملية\': \'process_improvement\', \'ابتكار تقني\': \'technical_innovation\', \'حل مشكلة\': \'problem_solving\', \'ابتكار اجتماعي\': \'social_innovation\', \'استدامة\': \'sustainability\', \'تحول رقمي\': \'digital_transformation\' },' +
      'sensitivity_level: { \'عام\': \'public\', \'داخلي\': \'internal\', \'سري\': \'confidential\', \'سري للغاية\': \'top_secret\' }' +
    '};' +
    
    'const MIGRATIONS = [' +
      '{ table: \'challenges\', column: \'status\', category: \'status\' },' +
      '{ table: \'challenges\', column: \'priority\', category: \'priority\' },' +
      '{ table: \'challenges\', column: \'challenge_type\', category: \'challenge_type\' },' +
      '{ table: \'challenges\', column: \'sensitivity_level\', category: \'sensitivity_level\' },' +
      '{ table: \'challenge_submissions\', column: \'status\', category: \'status\' },' +
      '{ table: \'challenge_participants\', column: \'status\', category: \'status\' },' +
      '{ table: \'ideas\', column: \'status\', category: \'status\' },' +
      '{ table: \'ideas\', column: \'priority\', category: \'priority\' },' +
      '{ table: \'campaigns\', column: \'status\', category: \'status\' },' +
      '{ table: \'innovation_team_members\', column: \'status\', category: \'status\' },' +
      '{ table: \'user_profiles\', column: \'status\', category: \'status\' },' +
      '{ table: \'ai_preferences\', column: \'creativity_level\', category: \'priority\' },' +
      '{ table: \'notifications\', column: \'priority\', category: \'priority\' }' +
    '];' +
    
    'async function migrateTableColumn(table, column, category) {' +
      'const mappings = VALUE_KEY_MAPPINGS[category];' +
      'if (!mappings) return { table, column, updated: 0, errors: [] };' +
      
      'console.log(`Migrating ${table}.${column}...`);' +
      'let totalUpdated = 0;' +
      'const errors = [];' +
      
      'for (const [arabicValue, englishKey] of Object.entries(mappings)) {' +
        'try {' +
          'const { count, error } = await supabase' +
            '.from(table)' +
            '.update({ [column]: englishKey })' +
            '.eq(column, arabicValue);' +
          
          'if (error) throw error;' +
          'if (count > 0) {' +
            'console.log(`  Updated ${count} records: ${arabicValue} → ${englishKey}`);' +
            'totalUpdated += count;' +
          '}' +
        '} catch (err) {' +
          'errors.push(`${arabicValue}: ${err.message}`);' +
        '}' +
      '}' +
      
      'return { table, column, updated: totalUpdated, errors };' +
    '}' +
    
    'async function runMigration() {' +
      'console.log(\"🌟 Starting hardcoded values migration...\");' +
      'const results = [];' +
      'let totalUpdated = 0;' +
      
      'for (const migration of MIGRATIONS) {' +
        'const result = await migrateTableColumn(migration.table, migration.column, migration.category);' +
        'results.push(result);' +
        'totalUpdated += result.updated;' +
      '}' +
      
      'console.log(\"\\n✅ Migration completed!\");' +
      'console.log(`Total records updated: ${totalUpdated}`);' +
      
      'results.forEach(result => {' +
        'if (result.updated > 0 || result.errors.length > 0) {' +
          'console.log(`\\n${result.table}.${result.column}: ${result.updated} updated`);' +
          'if (result.errors.length > 0) {' +
            'console.log(`  Errors: ${result.errors.join(\", \")}`);' +
          '}' +
        '}' +
      '});' +
    '}' +
    
    'runMigration().catch(console.error);' +
  '"', 
  { stdio: 'inherit' });
  
  console.log('\n🎉 Hardcoded values migration completed successfully!');
} catch (error) {
  console.error('\n❌ Migration failed:', error.message);
  process.exit(1);
}