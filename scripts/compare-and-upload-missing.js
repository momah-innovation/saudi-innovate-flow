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

async function loadJsonTranslations() {
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

async function getDatabaseTranslations() {
  console.log('📊 Fetching existing database translations...');
  
  const { data, error } = await supabase
    .from('system_translations')
    .select('translation_key, language_code');

  if (error) {
    throw new Error(`Failed to fetch database translations: ${error.message}`);
  }

  const dbTranslations = new Set();
  data.forEach(row => {
    dbTranslations.add(`${row.translation_key}:${row.language_code}`);
  });

  console.log(`   ✓ Found ${data.length} translation records in database`);
  return dbTranslations;
}

function findMissingTranslations(jsonTranslations, dbTranslations) {
  const missing = [];
  
  jsonTranslations.forEach(translation => {
    const key = `${translation.translation_key}:${translation.language_code}`;
    if (!dbTranslations.has(key)) {
      missing.push(translation);
    }
  });

  return missing;
}

async function uploadMissingTranslations(missingTranslations) {
  if (missingTranslations.length === 0) {
    console.log('✅ No missing translations found - database is up to date!');
    return { uploaded: 0, errors: 0 };
  }

  console.log(`📤 Uploading ${missingTranslations.length} missing translations...`);
  
  const batchSize = 100;
  let uploaded = 0;
  let errors = 0;

  for (let i = 0; i < missingTranslations.length; i += batchSize) {
    const batch = missingTranslations.slice(i, i + batchSize);
    
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
  }

  console.log(`\n   ✓ Upload complete: ${uploaded} uploaded, ${errors} errors`);
  return { uploaded, errors };
}

async function main() {
  try {
    console.log('🔍 Comparing JSON files with database and uploading missing keys...\n');

    // Load translations from JSON files
    const jsonTranslations = await loadJsonTranslations();
    
    if (jsonTranslations.length === 0) {
      console.warn('⚠️  No JSON translations found');
      return;
    }

    console.log(`\n📋 Found ${jsonTranslations.length} total translations in JSON files`);
    
    // Get existing database translations
    const dbTranslations = await getDatabaseTranslations();
    
    // Find missing translations
    const missingTranslations = findMissingTranslations(jsonTranslations, dbTranslations);
    
    console.log(`\n🔍 Analysis Results:`);
    console.log(`   📂 JSON translations: ${jsonTranslations.length}`);
    console.log(`   💾 Database translations: ${dbTranslations.size}`);
    console.log(`   ➕ Missing in database: ${missingTranslations.length}`);
    
    if (missingTranslations.length > 0) {
      console.log(`\n📝 Missing translation keys by language:`);
      const missingByLang = {};
      missingTranslations.forEach(t => {
        if (!missingByLang[t.language_code]) missingByLang[t.language_code] = 0;
        missingByLang[t.language_code]++;
      });
      Object.entries(missingByLang).forEach(([lang, count]) => {
        console.log(`   ${lang}: ${count} keys`);
      });
    }
    
    // Upload missing translations
    const result = await uploadMissingTranslations(missingTranslations);

    console.log('\n✅ Comparison and upload completed!');
    console.log(`   📊 ${result.uploaded} missing translations uploaded`);
    
    if (result.errors > 0) {
      console.log(`   ⚠️  ${result.errors} errors encountered`);
    }

  } catch (error) {
    console.error('\n❌ Comparison and upload failed:');
    console.error(error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}