#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jxpbiljkoibvqxzdkgod.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cGJpbGprb2lidnF4emRrZ29kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ3MTMwOSwiZXhwIjoyMDY5MDQ3MzA5fQ.5p4zKa4vP-K1OhF2GlXWkh_bq1D1qGbHu8iJQpYJqYE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Quick extraction and upload
async function quickExtraction() {
  console.log('🔍 Quick extraction of translation keys...\n');
  
  // Simple but effective patterns
  const patterns = [
    /\bt\(\s*['"]([\w._]+)['"]/g,
    /getTranslation\(\s*['"]([\w._]+)['"]/g,
    /translationKey:\s*['"]([\w._]+)['"]/g
  ];
  
  const allKeys = new Set();
  
  // Scan src directory
  function scanDir(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !['node_modules', '.git', 'dist', 'build'].includes(file)) {
        scanDir(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          
          patterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
              const key = match[1];
              if (key && key.includes('.') && key.length > 3 && /^[\w._]+$/.test(key)) {
                allKeys.add(key);
              }
            }
          });
        } catch (err) {
          // Skip files that can't be read
        }
      }
    }
  }
  
  scanDir('src');
  
  console.log(`Found ${allKeys.size} translation keys`);
  
  // Get existing keys
  const { data: existing } = await supabase
    .from('system_translations')
    .select('translation_key');
  
  const existingKeys = new Set(existing.map(row => row.translation_key));
  const newKeys = Array.from(allKeys).filter(key => !existingKeys.has(key));
  
  console.log(`${newKeys.length} new keys to add`);
  
  if (newKeys.length > 0) {
    // Generate simple translations
    const translations = newKeys.map(key => {
      const lastPart = key.split('.').pop();
      const englishText = lastPart
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      return {
        translation_key: key,
        text_en: englishText,
        text_ar: englishText, // Temporary fallback
        category: 'general'
      };
    });
    
    // Upload in batches
    const batchSize = 100;
    let uploaded = 0;
    
    for (let i = 0; i < translations.length; i += batchSize) {
      const batch = translations.slice(i, i + batchSize);
      const { error } = await supabase
        .from('system_translations')
        .insert(batch);
      
      if (!error) {
        uploaded += batch.length;
        console.log(`Uploaded batch ${Math.floor(i/batchSize) + 1}, total: ${uploaded}`);
      } else {
        console.error('Batch error:', error.message);
      }
    }
    
    console.log(`\n✅ Successfully uploaded ${uploaded} new translation keys`);
  } else {
    console.log('✅ No new keys to add');
  }
  
  // Final count
  const { data: final } = await supabase
    .from('system_translations')
    .select('translation_key');
  
  console.log(`\n📊 Total keys in database: ${final.length}`);
}

quickExtraction().catch(console.error);