#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jxpbiljkoibvqxzdkgod.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cGJpbGprb2lidnF4emRrZ29kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ3MTMwOSwiZXhwIjoyMDY5MDQ3MzA5fQ.5p4zKa4vP-K1OhF2GlXWkh_bq1D1qGbHu8iJQpYJqYE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Add single translation key with both Arabic and English values
 */
async function addSingleTranslation(key, arabicText, englishText, category = 'ui') {
  try {
    const { data, error } = await supabase
      .from('system_translations')
      .insert({
        translation_key: key,
        text_ar: arabicText,
        text_en: englishText,
        category: category
      })
      .select();

    if (error) throw error;
    
    console.log(`✅ Added translation: ${key}`);
    return data[0];
  } catch (error) {
    console.error(`❌ Failed to add ${key}:`, error.message);
    throw error;
  }
}

/**
 * Add multiple translation keys in batch
 */
async function addMultipleTranslations(translations) {
  try {
    const { data, error } = await supabase
      .from('system_translations')
      .insert(translations)
      .select();

    if (error) throw error;
    
    console.log(`✅ Added ${translations.length} translations successfully`);
    return data;
  } catch (error) {
    console.error(`❌ Failed to add translations:`, error.message);
    throw error;
  }
}

/**
 * Update existing translation with new values
 */
async function updateTranslation(key, arabicText, englishText, category) {
  try {
    const { data, error } = await supabase
      .from('system_translations')
      .update({
        text_ar: arabicText,
        text_en: englishText,
        ...(category && { category })
      })
      .eq('translation_key', key)
      .select();

    if (error) throw error;
    
    if (data.length === 0) {
      console.log(`⚠️  Translation key '${key}' not found, creating new one...`);
      return await addSingleTranslation(key, arabicText, englishText, category || 'ui');
    }
    
    console.log(`✅ Updated translation: ${key}`);
    return data[0];
  } catch (error) {
    console.error(`❌ Failed to update ${key}:`, error.message);
    throw error;
  }
}

/**
 * Check if translation key exists
 */
async function checkTranslationExists(key) {
  try {
    const { data, error } = await supabase
      .from('system_translations')
      .select('translation_key, text_ar, text_en, category')
      .eq('translation_key', key)
      .maybeSingle();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`❌ Failed to check ${key}:`, error.message);
    return null;
  }
}

// Example usage functions
async function exampleUsage() {
  console.log('🚀 Translation Key Management Examples\n');
  
  try {
    // Example 1: Add single translation
    console.log('📝 Example 1: Adding single translation');
    await addSingleTranslation(
      'example.new_feature',
      'ميزة جديدة',
      'New Feature',
      'ui'
    );
    
    // Example 2: Add multiple translations
    console.log('\n📝 Example 2: Adding multiple translations');
    const newTranslations = [
      {
        translation_key: 'dashboard.welcome',
        text_ar: 'مرحباً بك في لوحة التحكم',
        text_en: 'Welcome to Dashboard',
        category: 'ui'
      },
      {
        translation_key: 'dashboard.overview',
        text_ar: 'نظرة عامة',
        text_en: 'Overview',
        category: 'ui'
      },
      {
        translation_key: 'settings.profile',
        text_ar: 'الملف الشخصي',
        text_en: 'Profile',
        category: 'settings'
      }
    ];
    
    await addMultipleTranslations(newTranslations);
    
    // Example 3: Check if translation exists
    console.log('\n📝 Example 3: Checking existing translation');
    const existing = await checkTranslationExists('dashboard.welcome');
    if (existing) {
      console.log('✅ Translation exists:', existing);
    } else {
      console.log('❌ Translation not found');
    }
    
    // Example 4: Update existing translation
    console.log('\n📝 Example 4: Updating translation');
    await updateTranslation(
      'dashboard.welcome',
      'أهلاً وسهلاً بك في لوحة التحكم',
      'Welcome to the Control Panel',
      'ui'
    );
    
    console.log('\n🎉 All examples completed successfully!');
    
  } catch (error) {
    console.error('\n💥 Error in examples:', error.message);
  }
}

// Export functions for use in other scripts
module.exports = {
  addSingleTranslation,
  addMultipleTranslations,
  updateTranslation,
  checkTranslationExists
};

// Run examples if called directly
if (require.main === module) {
  exampleUsage();
}