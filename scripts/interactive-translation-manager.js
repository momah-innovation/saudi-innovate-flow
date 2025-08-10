#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

const SUPABASE_URL = 'https://jxpbiljkoibvqxzdkgod.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cGJpbGprb2lidnF4emRrZ29kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ3MTMwOSwiZXhwIjoyMDY5MDQ3MzA5fQ.5p4zKa4vP-K1OhF2GlXWkh_bq1D1qGbHu8iJQpYJqYE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Create readline interface for interactive input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

// Available categories
const CATEGORIES = [
  'ui', 'admin', 'challenge', 'campaign', 'partner', 'expert', 
  'auth', 'notification', 'analytics', 'profile', 'translation', 
  'general', 'error', 'success', 'status', 'action', 'settings'
];

async function addInteractiveTranslation() {
  console.log('🌟 Interactive Translation Key Addition');
  console.log('═'.repeat(50));
  
  try {
    // Get translation key
    const key = await question('Enter translation key (e.g., "ui.button.save"): ');
    if (!key.trim()) {
      console.log('❌ Translation key is required');
      return;
    }
    
    // Check if key already exists
    const { data: existing } = await supabase
      .from('system_translations')
      .select('*')
      .eq('translation_key', key.trim())
      .maybeSingle();
    
    if (existing) {
      console.log(`⚠️  Translation key "${key}" already exists:`);
      console.log(`   Arabic: ${existing.text_ar}`);
      console.log(`   English: ${existing.text_en}`);
      
      const overwrite = await question('Do you want to update it? (y/N): ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log('Operation cancelled');
        return;
      }
    }
    
    // Get Arabic text
    const arabicText = await question('Enter Arabic text: ');
    if (!arabicText.trim()) {
      console.log('❌ Arabic text is required');
      return;
    }
    
    // Get English text
    const englishText = await question('Enter English text: ');
    if (!englishText.trim()) {
      console.log('❌ English text is required');
      return;
    }
    
    // Show available categories
    console.log('\nAvailable categories:');
    CATEGORIES.forEach((cat, index) => {
      console.log(`  ${index + 1}. ${cat}`);
    });
    
    const categoryInput = await question(`Select category (1-${CATEGORIES.length}) or enter custom: `);
    let category;
    
    if (/^\d+$/.test(categoryInput)) {
      const index = parseInt(categoryInput) - 1;
      if (index >= 0 && index < CATEGORIES.length) {
        category = CATEGORIES[index];
      } else {
        console.log('❌ Invalid category number');
        return;
      }
    } else {
      category = categoryInput.trim() || 'ui';
    }
    
    // Confirm before adding
    console.log('\n📋 Summary:');
    console.log(`   Key: ${key.trim()}`);
    console.log(`   Arabic: ${arabicText.trim()}`);
    console.log(`   English: ${englishText.trim()}`);
    console.log(`   Category: ${category}`);
    
    const confirm = await question('\nAdd this translation? (Y/n): ');
    if (confirm.toLowerCase() === 'n') {
      console.log('Operation cancelled');
      return;
    }
    
    // Add or update translation
    const operation = existing ? 'update' : 'insert';
    const query = existing 
      ? supabase.from('system_translations').update({
          text_ar: arabicText.trim(),
          text_en: englishText.trim(),
          category: category
        }).eq('translation_key', key.trim())
      : supabase.from('system_translations').insert({
          translation_key: key.trim(),
          text_ar: arabicText.trim(),
          text_en: englishText.trim(),
          category: category
        });
    
    const { error } = await query;
    
    if (error) {
      console.error('❌ Failed to add translation:', error.message);
      return;
    }
    
    console.log(`✅ Translation ${existing ? 'updated' : 'added'} successfully!`);
    
    // Ask if user wants to add another
    const addAnother = await question('\nAdd another translation? (y/N): ');
    if (addAnother.toLowerCase() === 'y') {
      console.log('\n' + '═'.repeat(50));
      await addInteractiveTranslation();
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function addFromCSV() {
  const csvPath = await question('Enter CSV file path (key,arabic,english,category): ');
  
  try {
    const fs = require('fs');
    const csvContent = fs.readFileSync(csvPath.trim(), 'utf8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    const translations = [];
    let errors = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('#')) continue; // Skip empty lines and comments
      
      const [key, arabic, english, category = 'ui'] = line.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
      
      if (!key || !arabic || !english) {
        console.log(`⚠️  Skipping line ${i + 1}: Missing required fields`);
        errors++;
        continue;
      }
      
      translations.push({
        translation_key: key,
        text_ar: arabic,
        text_en: english,
        category: category
      });
    }
    
    if (translations.length === 0) {
      console.log('❌ No valid translations found in CSV');
      return;
    }
    
    console.log(`📊 Found ${translations.length} translations (${errors} errors)`);
    const confirm = await question('Proceed with upload? (Y/n): ');
    
    if (confirm.toLowerCase() === 'n') {
      console.log('Operation cancelled');
      return;
    }
    
    // Upload in batches
    const batchSize = 50;
    let uploaded = 0;
    
    for (let i = 0; i < translations.length; i += batchSize) {
      const batch = translations.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('system_translations')
        .upsert(batch, { onConflict: 'translation_key' });
      
      if (error) {
        console.error(`❌ Batch ${Math.floor(i/batchSize) + 1} failed:`, error.message);
      } else {
        uploaded += batch.length;
        console.log(`✅ Uploaded batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(translations.length/batchSize)}`);
      }
    }
    
    console.log(`🎉 Upload complete: ${uploaded}/${translations.length} translations added`);
    
  } catch (error) {
    console.error('❌ Error reading CSV:', error.message);
  }
}

async function main() {
  console.log('🌟 Translation Key Management Tool');
  console.log('═'.repeat(50));
  console.log('1. Add translation interactively');
  console.log('2. Import from CSV file');
  console.log('3. Exit');
  console.log('═'.repeat(50));
  
  const choice = await question('Select option (1-3): ');
  
  switch (choice) {
    case '1':
      await addInteractiveTranslation();
      break;
    case '2':
      await addFromCSV();
      break;
    case '3':
      console.log('Goodbye! 👋');
      break;
    default:
      console.log('❌ Invalid choice');
  }
  
  rl.close();
}

// Handle interruption gracefully
process.on('SIGINT', () => {
  console.log('\n\n👋 Goodbye!');
  rl.close();
  process.exit(0);
});

main();