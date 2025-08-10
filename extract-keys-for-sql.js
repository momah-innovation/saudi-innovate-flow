#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jxpbiljkoibvqxzdkgod.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cGJpbGprb2lidnF4emRrZ29kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ3MTMwOSwiZXhwIjoyMDY5MDQ3MzA5fQ.5p4zKa4vP-K1OhF2GlXWkh_bq1D1qGbHu8iJQpYJqYE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function extractKeysForSQL() {
  console.log('🔍 Extracting translation keys for SQL generation...\n');
  
  // Enhanced extraction patterns
  const patterns = [
    /\bt\(\s*['"]([\w._]+)['"](?:\s*,|\s*\))/g,
    /getTranslation\(\s*['"]([\w._]+)['"]/g,
    /translationKey:\s*['"]([\w._]+)['"]/g,
    /useTranslation\(\s*['"]([\w._]+)['"]/g,
    /translation\(['"](\w+\.[\w._]+)['"]\)/g,
    /i18n\.t\(\s*['"]([\w._]+)['"]/g
  ];
  
  const codeKeys = new Set();
  let filesScanned = 0;
  
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
          filesScanned++;
          
          patterns.forEach(pattern => {
            let match;
            const patternCopy = new RegExp(pattern.source, pattern.flags);
            while ((match = patternCopy.exec(content)) !== null) {
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
  
  console.log(`📊 Scanned ${filesScanned} files`);
  console.log(`🔍 Found ${codeKeys.size} unique translation keys in source code\n`);
  
  // Get existing keys from database
  console.log('💾 Fetching existing keys from database...');
  const { data: existingKeys, error } = await supabase
    .from('system_translations')
    .select('translation_key');
  
  if (error) {
    console.error('❌ Database error:', error.message);
    return;
  }
  
  const existingKeySet = new Set(existingKeys.map(row => row.translation_key));
  console.log(`💾 Found ${existingKeySet.size} existing keys in database\n`);
  
  // Find missing keys
  const missingKeys = Array.from(codeKeys).filter(key => !existingKeySet.has(key));
  console.log(`🔍 Missing keys to process: ${missingKeys.length}\n`);
  
  if (missingKeys.length === 0) {
    console.log('✅ All translation keys are already in the database!');
    return;
  }
  
  // Group by category for better organization
  const keysByCategory = {};
  missingKeys.forEach(key => {
    const parts = key.split('.');
    const category = parts[0] || 'general';
    if (!keysByCategory[category]) {
      keysByCategory[category] = [];
    }
    keysByCategory[category].push(key);
  });
  
  console.log('📂 Keys by category:');
  Object.entries(keysByCategory).forEach(([category, keys]) => {
    console.log(`   ${category}: ${keys.length} keys`);
  });
  
  // Save organized keys to file for SQL generation
  const output = {
    totalMissingKeys: missingKeys.length,
    keysByCategory: keysByCategory,
    allMissingKeys: missingKeys.sort()
  };
  
  fs.writeFileSync('missing-translation-keys.json', JSON.stringify(output, null, 2));
  console.log('\n📄 Missing keys saved to missing-translation-keys.json');
  
  return output;
}

extractKeysForSQL().catch(console.error);