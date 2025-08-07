#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = 'https://jxpbiljkoibvqxzdkgod.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cGJpbGprb2lidnF4emRrZ29kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ3MTMwOSwiZXhwIjoyMDY5MDQ3MzA5fQ.5p4zKa4vP-K1OhF2GlXWkh_bq1D1qGbHu8iJQpYJqYE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Category mapping
const CATEGORY_PATTERNS = {
  'settings': /^(settings|systemSettings)/i,
  'admin': /^(admin|userManagement|translationManagement|systemConfiguration)/i,
  'ui': /^(ui|loading|save|edit|delete|create|cancel|confirm)/i,
  'navigation': /^(navigation|home|dashboard|profile|logout)/i,
  'errors': /^(errors|generic|network|notFound|unauthorized)/i,
  'success': /^(success|saved|created|updated|deleted)/i
};

function determineCategory(translationKey) {
  for (const [category, pattern] of Object.entries(CATEGORY_PATTERNS)) {
    if (pattern.test(translationKey)) {
      return category;
    }
  }
  
  if (translationKey.includes('.')) {
    const firstPart = translationKey.split('.')[0];
    for (const [category, pattern] of Object.entries(CATEGORY_PATTERNS)) {
      if (pattern.test(firstPart)) {
        return category;
      }
    }
  }
  
  return 'general';
}

function flattenTranslations(obj, prefix = '', result = []) {
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      flattenTranslations(value, newKey, result);
    } else {
      result.push({
        translation_key: newKey,
        text_en: '',
        text_ar: String(value),
        category: determineCategory(newKey)
      });
    }
  }
  
  return result;
}

async function loadJsonTranslations() {
  const localesDir = path.join(__dirname, '..', 'src', 'i18n', 'locales');
  const arFile = path.join(localesDir, 'ar.json');
  const enFile = path.join(localesDir, 'en.json');
  
  console.log('📖 Loading translation files...');
  
  const arTranslations = fs.existsSync(arFile) ? JSON.parse(fs.readFileSync(arFile, 'utf8')) : {};
  const enTranslations = fs.existsSync(enFile) ? JSON.parse(fs.readFileSync(enFile, 'utf8')) : {};
  
  // Flatten both translation files
  const arFlat = flattenTranslations(arTranslations);
  const enFlat = flattenTranslations(enTranslations);
  
  // Create a map for English translations
  const enMap = new Map();
  enFlat.forEach(t => enMap.set(t.translation_key, t.text_ar)); // Note: using text_ar field for English value
  
  // Merge translations
  const mergedTranslations = [];
  arFlat.forEach(arTranslation => {
    mergedTranslations.push({
      translation_key: arTranslation.translation_key,
      text_ar: arTranslation.text_ar,
      text_en: enMap.get(arTranslation.translation_key) || arTranslation.text_ar, // Fallback to Arabic if no English
      category: arTranslation.category
    });
  });
  
  // Add English-only keys
  enFlat.forEach(enTranslation => {
    if (!arTranslations[enTranslation.translation_key]) {
      mergedTranslations.push({
        translation_key: enTranslation.translation_key,
        text_ar: enTranslation.text_ar, // English text goes here
        text_en: enTranslation.text_ar,
        category: enTranslation.category
      });
    }
  });
  
  console.log(`   ✓ Loaded ${mergedTranslations.length} total translation keys`);
  return mergedTranslations;
}

async function getExistingKeys() {
  console.log('🔍 Fetching existing translation keys from database...');
  
  const { data, error } = await supabase
    .from('system_translations')
    .select('translation_key');
    
  if (error) {
    throw new Error(`Failed to fetch existing keys: ${error.message}`);
  }
  
  const existingKeys = new Set(data.map(row => row.translation_key));
  console.log(`   ✓ Found ${existingKeys.size} existing keys in database`);
  
  return existingKeys;
}

async function uploadMissingTranslations(translations, existingKeys) {
  const missingTranslations = translations.filter(t => !existingKeys.has(t.translation_key));
  
  if (missingTranslations.length === 0) {
    console.log('✅ No missing translations found - database is up to date!');
    return { uploaded: 0, errors: 0 };
  }
  
  console.log(`📤 Found ${missingTranslations.length} missing translation keys`);
  console.log('🔄 Uploading missing translations...');
  
  const batchSize = 100;
  let uploaded = 0;
  let errors = 0;
  
  for (let i = 0; i < missingTranslations.length; i += batchSize) {
    const batch = missingTranslations.slice(i, i + batchSize);
    
    try {
      const { error } = await supabase
        .from('system_translations')
        .insert(batch);
        
      if (error) {
        console.error(`❌ Batch upload error (${i}-${i + batch.length}):`, error.message);
        errors += batch.length;
      } else {
        uploaded += batch.length;
        process.stdout.write(`   Progress: ${uploaded}/${missingTranslations.length} uploaded\r`);
      }
    } catch (err) {
      console.error(`❌ Batch error:`, err.message);
      errors += batch.length;
    }
  }
  
  console.log(`\n   ✓ Upload complete: ${uploaded} uploaded, ${errors} errors`);
  return { uploaded, errors };
}

async function main() {
  try {
    console.log('🚀 Starting missing translation key upload...\n');
    
    // Load all translations from JSON files
    const jsonTranslations = await loadJsonTranslations();
    
    if (jsonTranslations.length === 0) {
      console.warn('⚠️  No translations found in JSON files');
      return;
    }
    
    // Get existing keys from database
    const existingKeys = await getExistingKeys();
    
    // Upload only missing translations
    const result = await uploadMissingTranslations(jsonTranslations, existingKeys);
    
    console.log('\n📊 Summary:');
    console.log(`   📂 Total JSON translations: ${jsonTranslations.length}`);
    console.log(`   💾 Existing database keys: ${existingKeys.size}`);
    console.log(`   ➕ Missing keys uploaded: ${result.uploaded}`);
    
    if (result.errors > 0) {
      console.log(`   ⚠️  Errors encountered: ${result.errors}`);
    }
    
    console.log('\n✅ Missing translation upload completed!');
    
  } catch (error) {
    console.error('\n❌ Upload failed:');
    console.error(error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}