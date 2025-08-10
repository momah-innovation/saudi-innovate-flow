#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jxpbiljkoibvqxzdkgod.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cGJpbGprb2lidnF4emRrZ29kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ3MTMwOSwiZXhwIjoyMDY5MDQ3MzA5fQ.5p4zKa4vP-K1OhF2GlXWkh_bq1D1qGbHu8iJQpYJqYE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Progress tracking
let progress = {
  filesScanned: 0,
  totalFiles: 0,
  keysFound: 0,
  newKeysToAdd: 0,
  existingKeys: 0,
  uploaded: 0,
  errors: 0
};

// Category mapping patterns
const CATEGORY_PATTERNS = {
  'ui': /^(ui|button|form|input|label|menu|navigation|filter|search|dialog|modal|tooltip|header|footer|sidebar|breadcrumb|pagination|table|card|badge|alert|toast|loading|error|success|warning|info)[\._]/,
  'admin': /^(admin|management|dashboard|system|settings|config|control|panel)[\._]/,
  'challenge': /^(challenge|competition|contest|submission|evaluation|scorecard|requirement|participant)[\._]/,
  'campaign': /^(campaign|event|activity|promotion|marketing)[\._]/,
  'partner': /^(partner|stakeholder|organization|collaboration|sponsor)[\._]/,
  'expert': /^(expert|evaluator|reviewer|mentor|advisor)[\._]/,
  'auth': /^(auth|login|signup|password|security|permission|role|access)[\._]/,
  'notification': /^(notification|alert|message|email|sms|reminder)[\._]/,
  'analytics': /^(analytics|report|metric|chart|graph|statistics|data)[\._]/,
  'profile': /^(profile|user|account|personal|bio|avatar)[\._]/,
  'translation': /^(translation|language|locale|direction|rtl|ltr)[\._]/,
  'general': /^(general|common|shared|global|default)[\._]/
};

function determineCategory(translationKey) {
  for (const [category, pattern] of Object.entries(CATEGORY_PATTERNS)) {
    if (pattern.test(translationKey)) {
      return category;
    }
  }
  
  // Default categorization based on context
  if (translationKey.includes('error') || translationKey.includes('validation')) return 'error';
  if (translationKey.includes('success') || translationKey.includes('completed')) return 'success';
  if (translationKey.includes('status') || translationKey.includes('state')) return 'status';
  if (translationKey.includes('date') || translationKey.includes('time')) return 'date';
  if (translationKey.includes('action') || translationKey.includes('button')) return 'action';
  
  return 'general';
}

// Extract translation keys from file content
function extractTranslationKeys(content, filePath) {
  const keys = new Set();
  
  // Comprehensive patterns to match all translation function calls
  const patterns = [
    // Basic t() calls
    /\bt\(\s*['"](.*?)['"]\s*[,\)]/g,
    /\bt\(\s*`(.*?)`\s*[,\)]/g,
    
    // t() with fallback strings
    /\bt\(\s*['"](.*?)['"],\s*['"](.*?)['"]/g,
    /\bt\(\s*`(.*?)`,\s*`(.*?)`/g,
    
    // getTranslation calls
    /getTranslation\(\s*['"](.*?)['"]/g,
    /getTranslation\(\s*`(.*?)`/g,
    
    // Template literal patterns in translation keys
    /\bt\(\s*['"]([\w._]+)['"]/g,
    /getTranslation\(\s*['"]([\w._]+)['"]/g,
    
    // Dynamic key patterns (common constructions)
    /\bt\(\s*['"]([\w._]+)\${?[\w.]*}?['"]/g,
    /\bt\(\s*`([\w._]+)\${?[^}]*}?`/g,
    
    // Translation key references in objects/maps
    /['"]([\w._]{3,})['"]\s*:\s*['"]/g,
    
    // Keys in translation mapping objects
    /[\w.]+\.\$\{([\w._]+)\}/g
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const key = match[1];
      if (key && key.length > 2 && !key.includes('${') && !key.includes('(') && /^[\w._]+$/.test(key)) {
        // Filter out obvious non-translation keys
        if (!isLikelyTranslationKey(key)) continue;
        keys.add(key);
      }
    }
  });
  
  return Array.from(keys);
}

// Helper function to determine if a string is likely a translation key
function isLikelyTranslationKey(key) {
  // Must have at least one dot or underscore
  if (!key.includes('.') && !key.includes('_')) return false;
  
  // Must not be too long (likely not a sentence)
  if (key.length > 50) return false;
  
  // Must not contain spaces
  if (key.includes(' ')) return false;
  
  // Must not be a file path
  if (key.includes('/') || key.includes('\\')) return false;
  
  // Must not be a URL
  if (key.includes('http') || key.includes('www')) return false;
  
  // Must not be an email
  if (key.includes('@')) return false;
  
  // Common translation key patterns
  const translationPatterns = [
    /^(ui|admin|challenge|campaign|partner|expert|auth|notification|analytics|profile|translation|general|error|success|status|date|action)\./,
    /\.(title|description|name|label|button|message|error|success|warning|info|placeholder|tooltip)$/,
    /\.(create|edit|delete|save|cancel|submit|close|open|view|search|filter|loading)$/,
    /^(advanced_search|challenge_form|campaign_form|partner_form|expert_form|admin_panel)\./
  ];
  
  return translationPatterns.some(pattern => pattern.test(key));
}

// Recursively scan directory for TypeScript/JavaScript files
function scanDirectory(dir, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
  const files = [];
  
  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const itemPath = path.join(currentDir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and build directories
        if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(item)) {
          scan(itemPath);
        }
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(itemPath);
      }
    }
  }
  
  scan(dir);
  return files;
}

// Generate fallback translations
function generateFallbackTranslation(key) {
  // Convert key to readable text
  let text = key
    .split(/[._]/)
    .pop() // Get last part
    .replace(/([A-Z])/g, ' $1') // Add space before capitals
    .replace(/[_-]/g, ' ') // Replace underscores and dashes with spaces
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Simple Arabic fallback (basic translation patterns)
  const arabicMappings = {
    'title': 'العنوان',
    'description': 'الوصف',
    'name': 'الاسم',
    'email': 'البريد الإلكتروني',
    'save': 'حفظ',
    'cancel': 'إلغاء',
    'delete': 'حذف',
    'edit': 'تعديل',
    'create': 'إنشاء',
    'update': 'تحديث',
    'submit': 'إرسال',
    'close': 'إغلاق',
    'open': 'فتح',
    'view': 'عرض',
    'search': 'بحث',
    'filter': 'فلتر',
    'loading': 'جاري التحميل',
    'error': 'خطأ',
    'success': 'نجح',
    'warning': 'تحذير',
    'info': 'معلومات'
  };
  
  let arabicText = text;
  Object.entries(arabicMappings).forEach(([en, ar]) => {
    const regex = new RegExp(en, 'gi');
    arabicText = arabicText.replace(regex, ar);
  });
  
  // If no translation found, use generic Arabic
  if (arabicText === text) {
    arabicText = text; // Keep English as fallback
  }
  
  return { en: text, ar: arabicText };
}

// Get existing keys from database
async function getExistingKeys() {
  console.log('🔍 Fetching existing translation keys from database...');
  
  const { data, error } = await supabase
    .from('system_translations')
    .select('translation_key');
    
  if (error) {
    throw new Error(`Failed to fetch existing keys: ${error.message}`);
  }
  
  const existingKeys = new Set(data.map(row => row.translation_key));
  progress.existingKeys = existingKeys.size;
  console.log(`   ✓ Found ${existingKeys.size} existing keys in database`);
  
  return existingKeys;
}

// Upload missing translations to database
async function uploadMissingTranslations(missingTranslations) {
  if (missingTranslations.length === 0) {
    console.log('✅ No new translations to upload');
    return { uploaded: 0, errors: 0 };
  }
  
  console.log(`📤 Uploading ${missingTranslations.length} new translation keys...`);
  
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
        console.error(`❌ Batch ${Math.floor(i/batchSize) + 1} failed:`, error.message);
        errors += batch.length;
      } else {
        uploaded += batch.length;
        console.log(`   ✓ Batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(missingTranslations.length/batchSize)} uploaded (${batch.length} keys)`);
      }
    } catch (err) {
      console.error(`❌ Batch ${Math.floor(i/batchSize) + 1} error:`, err.message);
      errors += batch.length;
    }
  }
  
  progress.uploaded = uploaded;
  progress.errors = errors;
  
  console.log(`\n   ✓ Upload complete: ${uploaded} uploaded, ${errors} errors`);
  return { uploaded, errors };
}

// Main execution
async function main() {
  try {
    console.log('🚀 Starting comprehensive translation key extraction...\n');
    
    // Step 1: Scan all source files and edge functions
    console.log('📁 Scanning source files...');
    const sourceDir = path.join(process.cwd(), 'src');
    const edgeFunctionsDir = path.join(process.cwd(), 'supabase', 'functions');
    
    let files = scanDirectory(sourceDir);
    
    // Also scan edge functions if they exist
    if (fs.existsSync(edgeFunctionsDir)) {
      const edgeFiles = scanDirectory(edgeFunctionsDir);
      files = files.concat(edgeFiles);
      console.log(`   ✓ Found ${edgeFiles.length} edge function files`);
    }
    
    progress.totalFiles = files.length;
    console.log(`   ✓ Found ${files.length} total files to scan\n`);
    
    // Step 2: Extract all translation keys
    console.log('🔍 Extracting translation keys from source files...');
    const allKeys = new Set();
    
    for (const filePath of files) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const keys = extractTranslationKeys(content, filePath);
        
        keys.forEach(key => allKeys.add(key));
        progress.filesScanned++;
        
        if (keys.length > 0) {
          console.log(`   📄 ${path.relative(process.cwd(), filePath)}: ${keys.length} keys`);
        }
      } catch (err) {
        console.warn(`   ⚠️  Could not read ${filePath}: ${err.message}`);
      }
    }
    
    progress.keysFound = allKeys.size;
    console.log(`\n   ✓ Extracted ${allKeys.size} unique translation keys\n`);
    
    // Step 3: Get existing keys from database
    const existingKeys = await getExistingKeys();
    
    // Step 4: Identify missing keys
    console.log('\n🔍 Identifying missing translation keys...');
    const missingKeys = Array.from(allKeys).filter(key => !existingKeys.has(key));
    progress.newKeysToAdd = missingKeys.length;
    
    if (missingKeys.length === 0) {
      console.log('✅ All translation keys already exist in database!');
      return;
    }
    
    console.log(`   ✓ Found ${missingKeys.length} missing keys\n`);
    
    // Step 5: Generate translations for missing keys
    console.log('📝 Generating translations for missing keys...');
    const translationsToAdd = missingKeys.map(key => {
      const { en, ar } = generateFallbackTranslation(key);
      const category = determineCategory(key);
      
      return {
        translation_key: key,
        text_en: en,
        text_ar: ar,
        category: category
      };
    });
    
    console.log(`   ✓ Generated ${translationsToAdd.length} translation records\n`);
    
    // Step 6: Upload to database
    await uploadMissingTranslations(translationsToAdd);
    
    // Step 7: Generate summary report
    console.log('\n📊 EXTRACTION COMPLETE - SUMMARY REPORT:');
    console.log('═'.repeat(50));
    console.log(`   📁 Files scanned: ${progress.filesScanned}/${progress.totalFiles}`);
    console.log(`   🔑 Translation keys found: ${progress.keysFound}`);
    console.log(`   💾 Existing keys in database: ${progress.existingKeys}`);
    console.log(`   ➕ New keys identified: ${progress.newKeysToAdd}`);
    console.log(`   ✅ Successfully uploaded: ${progress.uploaded}`);
    if (progress.errors > 0) {
      console.log(`   ❌ Upload errors: ${progress.errors}`);
    }
    console.log('═'.repeat(50));
    
    // Step 8: Save extraction report
    const report = {
      timestamp: new Date().toISOString(),
      summary: progress,
      missingKeys: missingKeys,
      extractedTranslations: translationsToAdd
    };
    
    fs.writeFileSync('translation-extraction-report.json', JSON.stringify(report, null, 2));
    console.log('\n📋 Detailed report saved to: translation-extraction-report.json');
    
    if (progress.uploaded > 0) {
      console.log('\n🎉 Translation database updated successfully!');
      console.log('   Next steps:');
      console.log('   1. Review generated translations for accuracy');
      console.log('   2. Update components to remove fallback strings');
      console.log('   3. Test the application in both languages');
    }
    
  } catch (error) {
    console.error('\n❌ Extraction failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Show progress during execution
function showProgress() {
  if (progress.totalFiles > 0) {
    const percentage = Math.round((progress.filesScanned / progress.totalFiles) * 100);
    process.stdout.write(`\r   Progress: ${progress.filesScanned}/${progress.totalFiles} files (${percentage}%) - ${progress.keysFound} keys found`);
  }
}

// Run progress indicator
const progressInterval = setInterval(showProgress, 1000);

// Cleanup on exit
process.on('exit', () => {
  clearInterval(progressInterval);
});

// Execute if run directly
if (require.main === module) {
  main();
}