#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jxpbiljkoibvqxzdkgod.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cGJpbGprb2lidnF4emRrZ29kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ3MTMwOSwiZXhwIjoyMDY5MDQ3MzA5fQ.5p4zKa4vP-K1OhF2GlXWkh_bq1D1qGbHu8iJQpYJqYE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function compareKeys() {
  console.log('🔍 Comparing translation keys in code vs database...\n');
  
  // Extraction patterns
  const patterns = [
    /\bt\(\s*['"]([\w._]+)['"]/g,
    /getTranslation\(\s*['"]([\w._]+)['"]/g,
    /translationKey:\s*['"]([\w._]+)['"]/g,
    /useTranslation\(\s*['"]([\w._]+)['"]/g
  ];
  
  const codeKeys = new Set();
  
  // Scan src directory recursively
  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !['node_modules', '.git', 'dist', 'build'].includes(file)) {
        scanDirectory(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          
          patterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
              const key = match[1];
              if (key && key.includes('.') && key.length > 3 && /^[\w._]+$/.test(key)) {
                codeKeys.add(key);
              }
            }
          });
        } catch (err) {
          console.warn(`⚠️  Could not read file: ${filePath}`);
        }
      }
    }
  }
  
  // Scan the src directory
  scanDirectory('src');
  
  console.log(`📂 Found ${codeKeys.size} translation keys in source code`);
  
  // Get existing keys from database
  const { data: dbKeys, error } = await supabase
    .from('system_translations')
    .select('translation_key');
  
  if (error) {
    console.error('❌ Database error:', error.message);
    return;
  }
  
  const dbKeySet = new Set(dbKeys.map(row => row.translation_key));
  console.log(`💾 Found ${dbKeySet.size} translation keys in database`);
  
  // Find missing keys
  const missingInDb = Array.from(codeKeys).filter(key => !dbKeySet.has(key));
  const extraInDb = Array.from(dbKeySet).filter(key => !codeKeys.has(key));
  
  console.log(`\n📊 Comparison Results:`);
  console.log(`   ➕ Missing in database: ${missingInDb.length}`);
  console.log(`   ➖ Extra in database: ${extraInDb.length}`);
  console.log(`   ✅ Matching keys: ${Math.min(codeKeys.size, dbKeySet.size) - missingInDb.length}`);
  
  if (missingInDb.length > 0) {
    console.log(`\n📝 Keys missing in database (first 20):`);
    missingInDb.slice(0, 20).forEach(key => console.log(`   - ${key}`));
    if (missingInDb.length > 20) {
      console.log(`   ... and ${missingInDb.length - 20} more`);
    }
  }
  
  if (extraInDb.length > 0) {
    console.log(`\n🗑️  Keys in database but not in code (first 20):`);
    extraInDb.slice(0, 20).forEach(key => console.log(`   - ${key}`));
    if (extraInDb.length > 20) {
      console.log(`   ... and ${extraInDb.length - 20} more`);
    }
  }
  
  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    codeKeysCount: codeKeys.size,
    dbKeysCount: dbKeySet.size,
    missingInDatabase: missingInDb,
    extraInDatabase: extraInDb,
    matchingKeys: Math.min(codeKeys.size, dbKeySet.size) - missingInDb.length
  };
  
  fs.writeFileSync('translation-comparison-report.json', JSON.stringify(report, null, 2));
  console.log(`\n📋 Detailed report saved to translation-comparison-report.json`);
  
  return report;
}

compareKeys().catch(console.error);