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
        translation_text: String(value),
        category: determineCategory(newKey)
      });
    }
  }
  
  return result;
}

async function loadStaticTranslations() {
  const localesDir = path.join(__dirname, '..', 'src', 'i18n', 'locales');
  const languages = ['en', 'ar'];
  const allTranslations = [];

  for (const lang of languages) {
    const filePath = path.join(localesDir, `${lang}.json`);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  Translation file not found: ${filePath}`);
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const translations = JSON.parse(content);
      
      console.log(`📖 Loading ${lang}.json...`);
      
      const flatTranslations = flattenTranslations(translations);
      
      flatTranslations.forEach(translation => {
        allTranslations.push({
          ...translation,
          language_code: lang
        });
      });
      
      console.log(`   ✓ Processed ${flatTranslations.length} translations for ${lang}`);
      
    } catch (error) {
      console.error(`❌ Error loading ${lang}.json:`, error.message);
    }
  }

  return allTranslations;
}

async function clearExistingTranslations() {
  console.log('🗑️  Clearing existing database translations...');
  
  const { error } = await supabase
    .from('system_translations')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (error) {
    throw new Error(`Failed to clear existing translations: ${error.message}`);
  }
  
  console.log('   ✓ Existing translations cleared');
}

async function uploadTranslations(translations) {
  console.log(`📤 Uploading ${translations.length} translations to database...`);
  
  const batchSize = 100;
  let uploaded = 0;
  let errors = 0;

  for (let i = 0; i < translations.length; i += batchSize) {
    const batch = translations.slice(i, i + batchSize);
    
    const { error } = await supabase
      .from('system_translations')
      .insert(batch);

    if (error) {
      console.error(`❌ Batch upload error (${i}-${i + batch.length}):`, error.message);
      errors += batch.length;
    } else {
      uploaded += batch.length;
      process.stdout.write(`   Progress: ${uploaded}/${translations.length} uploaded\r`);
    }
  }

  console.log(`\n   ✓ Upload complete: ${uploaded} uploaded, ${errors} errors`);
  return { uploaded, errors };
}

async function main() {
  try {
    console.log('🚀 Starting static translation upload...\n');

    const translations = await loadStaticTranslations();
    
    if (translations.length === 0) {
      console.warn('⚠️  No translations found to upload');
      return;
    }

    console.log(`\n📊 Found ${translations.length} total translations`);
    
    await clearExistingTranslations();
    const result = await uploadTranslations(translations);

    console.log('\n✅ Upload completed successfully!');
    console.log(`   📊 ${result.uploaded} translations uploaded`);
    
    if (result.errors > 0) {
      console.log(`   ⚠️  ${result.errors} errors encountered`);
    }

  } catch (error) {
    console.error('\n❌ Upload failed:');
    console.error(error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}