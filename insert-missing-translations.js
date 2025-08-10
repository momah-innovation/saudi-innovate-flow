#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jxpbiljkoibvqxzdkgod.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cGJpbGprb2lidnF4emRrZ29kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ3MTMwOSwiZXhwIjoyMDY5MDQ3MzA5fQ.5p4zKa4vP-K1OhF2GlXWkh_bq1D1qGbHu8iJQpYJqYE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function insertMissingTranslations() {
  console.log('🚀 Starting comprehensive translation extraction and insertion...\n');
  
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
  console.log('📂 Scanning source files...');
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
  console.log(`🔍 Missing keys to insert: ${missingKeys.length}\n`);
  
  if (missingKeys.length === 0) {
    console.log('✅ All translation keys are already in the database!');
    return;
  }
  
  console.log('📝 Sample missing keys:');
  missingKeys.slice(0, 10).forEach(key => console.log(`   - ${key}`));
  if (missingKeys.length > 10) {
    console.log(`   ... and ${missingKeys.length - 10} more`);
  }
  console.log();
  
  // Prepare new translations
  const newTranslations = missingKeys.map(key => {
    const parts = key.split('.');
    const category = parts[0] || 'general';
    const lastPart = parts[parts.length - 1];
    
    // Generate default English text
    const englishText = lastPart
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .toLowerCase()
      .replace(/^\w/, c => c.toUpperCase());
    
    // Generate default Arabic text (placeholder)
    const arabicText = `[AR] ${englishText}`;
    
    return {
      translation_key: key,
      text_en: englishText,
      text_ar: arabicText,
      category: category
    };
  });
  
  // Insert in batches to avoid hitting limits
  const batchSize = 100;
  const batches = [];
  for (let i = 0; i < newTranslations.length; i += batchSize) {
    batches.push(newTranslations.slice(i, i + batchSize));
  }
  
  console.log(`📦 Inserting ${newTranslations.length} translations in ${batches.length} batches...\n`);
  
  let totalInserted = 0;
  let successfulBatches = 0;
  
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`   Batch ${i + 1}/${batches.length}: Inserting ${batch.length} translations...`);
    
    const { data, error } = await supabase
      .from('system_translations')
      .insert(batch)
      .select('id');
    
    if (error) {
      console.error(`   ❌ Batch ${i + 1} failed:`, error.message);
      // Continue with next batch
    } else {
      console.log(`   ✅ Batch ${i + 1} inserted ${data.length} translations`);
      totalInserted += data.length;
      successfulBatches++;
    }
    
    // Small delay to avoid overwhelming the database
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n🎉 Insertion complete!`);
  console.log(`   📊 Total inserted: ${totalInserted}`);
  console.log(`   ✅ Successful batches: ${successfulBatches}/${batches.length}`);
  console.log(`   ❌ Failed batches: ${batches.length - successfulBatches}`);
  
  // Final count verification
  const { data: finalCount, error: countError } = await supabase
    .from('system_translations')
    .select('translation_key', { count: 'exact' });
  
  if (!countError) {
    console.log(`   💾 Final database count: ${finalCount.length}`);
  }
  
  console.log('\n🏁 Process completed!');
}

insertMissingTranslations().catch(console.error);