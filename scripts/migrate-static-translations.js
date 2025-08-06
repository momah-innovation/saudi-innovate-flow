#!/usr/bin/env node

/**
 * Static Translation Migration Script
 * 
 * This script migrates all existing static translation files to the database.
 * It preserves the existing translation structure and assigns appropriate categories.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = 'https://jxpbiljkoibvqxzdkgod.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cGJpbGprb2lidnF4emRrZ29kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ3MTMwOSwiZXhwIjoyMDY5MDQ3MzA5fQ.5p4zKa4vP-K1OhF2GlXWkh_bq1D1qGbHu8iJQpYJqYE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Category mapping based on translation key patterns
const CATEGORY_PATTERNS = {
  'settings': /^(settings|systemSettings|sharedSettings|resetSettings|saveSettings)/i,
  'forms': /^(challenge_form|advanced_search|form_|validation_|input_)/i,
  'admin': /^(admin|userManagement|translationManagement|system_)/i,
  'campaign': /^(campaign|campaigns)/i,
  'challenges': /^(challenge|challenges)/i,
  'events': /^(event|events)/i,
  'partners': /^(partner|partners)/i,
  'tags': /^(tag|tags)/i,
  'sectors': /^(sector|sectors)/i,
  'navigation': /^(nav|menu|toggle_|open_|switch_)/i,
  'notifications': /^(notification|alert|toast)/i,
  'errors': /^(error|failed|invalid)/i,
  'success': /^(success|completed|saved)/i,
  'ui': /^(loading|item|items|all|save|cancel|delete|edit|create)/i,
  'general': /^(just_now|minutes_ago|hours_ago|days_ago|all)/i
};

function determineCategory(translationKey) {
  for (const [category, pattern] of Object.entries(CATEGORY_PATTERNS)) {
    if (pattern.test(translationKey)) {
      return category;
    }
  }
  
  // Check for nested categories
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
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

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

function generateReport(translations) {
  const categoryCounts = {};
  const languageCounts = {};

  translations.forEach(t => {
    categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
    languageCounts[t.language_code] = (languageCounts[t.language_code] || 0) + 1;
  });

  console.log('\n📊 Migration Report:');
  console.log(`Total translations: ${translations.length}`);
  
  console.log('\nBy language:');
  Object.entries(languageCounts).forEach(([lang, count]) => {
    console.log(`  ${lang}: ${count} translations`);
  });
  
  console.log('\nBy category:');
  Object.entries(categoryCounts)
    .sort(([,a], [,b]) => b - a)
    .forEach(([category, count]) => {
      console.log(`  ${category}: ${count} translations`);
    });
}

async function verifyMigration() {
  console.log('\n🔍 Verifying migration...');
  
  const { data, error } = await supabase
    .from('system_translations')
    .select('language_code, category')
    .limit(1000);

  if (error) {
    throw new Error(`Verification failed: ${error.message}`);
  }

  const dbLanguages = [...new Set(data.map(t => t.language_code))];
  const dbCategories = [...new Set(data.map(t => t.category))];

  console.log(`   ✓ Found ${data.length} translations in database`);
  console.log(`   ✓ Languages: ${dbLanguages.join(', ')}`);
  console.log(`   ✓ Categories: ${dbCategories.length} different categories`);
}

async function main() {
  try {
    console.log('🚀 Starting static translation migration...\n');

    // Step 1: Load static translations
    const translations = await loadStaticTranslations();
    
    if (translations.length === 0) {
      console.warn('⚠️  No translations found to migrate');
      return;
    }

    // Step 2: Generate report
    generateReport(translations);

    // Step 3: Confirm migration
    console.log('\n❓ This will replace ALL existing database translations.');
    console.log('   Continue? (This script assumes you want to proceed)');

    // Step 4: Clear existing and upload new
    await clearExistingTranslations();
    const result = await uploadTranslations(translations);

    // Step 5: Verify
    await verifyMigration();

    console.log('\n✅ Migration completed successfully!');
    console.log(`   📊 ${result.uploaded} translations migrated`);
    
    if (result.errors > 0) {
      console.log(`   ⚠️  ${result.errors} errors encountered`);
    }

  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error(error.message);
    
    if (error.message.includes('JWT')) {
      console.log('\n💡 This might be due to authentication issues.');
      console.log('   Make sure the service role key is correct.');
    }
    
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}