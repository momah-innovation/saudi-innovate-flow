#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jxpbiljkoibvqxzdkgod.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cGJpbGprb2lidnF4emRrZ29kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ3MTMwOSwiZXhwIjoyMDY5MDQ3MzA5fQ.5p4zKa4vP-K1OhF2GlXWkh_bq1D1qGbHu8iJQpYE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkStatus() {
  console.log('📊 Translation System Status Check\n');
  
  // Get database counts
  const { data: translations, error } = await supabase
    .from('system_translations')
    .select('translation_key, category', { count: 'exact' });
  
  if (error) {
    console.error('❌ Database error:', error.message);
    return;
  }
  
  console.log(`💾 Database translations: ${translations.length}`);
  
  // Group by category
  const categories = {};
  translations.forEach(t => {
    const category = t.category || 'uncategorized';
    categories[category] = (categories[category] || 0) + 1;
  });
  
  console.log('\n📂 Categories breakdown:');
  Object.entries(categories)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} keys`);
    });
  
  // Check for some common keys that should exist
  const testKeys = [
    'navigation.home',
    'navigation.challenges', 
    'navigation.ideas',
    'navigation.events',
    'common.save',
    'common.cancel',
    'common.submit'
  ];
  
  console.log('\n🔍 Sample key check:');
  for (const key of testKeys) {
    const exists = translations.find(t => t.translation_key === key);
    console.log(`   ${key}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
  }
}

checkStatus().catch(console.error);