#!/usr/bin/env node
/**
 * Execute translation extraction across the entire codebase
 * Run with: node src/scripts/run-translation-extraction.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Import the extraction tool
const { extractTranslations } = require('./extract-translations.js');

async function runFullExtractionPipeline() {
  // Use structured logging instead of console statements
  process.stdout.write('🚀 Starting comprehensive translation extraction...\n');
  
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const outputDir = `extracted-translations-${timestamp}`;
  
  try {
    // Create output directory
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Extract from high-priority admin components first
    const adminComponents = [
      'src/components/admin',
      'src/pages/admin', 
      'src/components/layout',
      'src/components/forms',
      'src/components/ui'
    ];
    
    let totalExtracted = 0;
    let allTranslations = [];
    
    for (const componentPath of adminComponents) {
      if (fs.existsSync(componentPath)) {
        process.stdout.write(`\n📁 Extracting from ${componentPath}...\n`);
        
        const results = await extractTranslations({
          inputDir: componentPath,
          outputDir: outputDir,
          extractionPatterns: {
            hardcodedArabic: /"[^"]*[اأإآب-ي][^"]*"|'[^']*[اأإآب-ي][^']*'/g,
            hardcodedEnglish: /"([A-Z][a-z\s]{5,})"|'([A-Z][a-z\s]{5,})'/g,
            toastMessages: /toast\s*\(\s*{[^}]*title:\s*["']([^"']+)["']/g,
            placeholders: /placeholder\s*=\s*["']([^"']+)["']/g,
            ariaLabels: /aria-label\s*=\s*["']([^"']+)["']/g
          },
          skipPatterns: [
            /console\.(log|error|warn)/,
            /className=/,
            /\.test\./,
            /\.spec\./,
            /node_modules/
          ]
        });
        
        totalExtracted += results.totalFound;
        allTranslations = allTranslations.concat(results.translations);
        
        process.stdout.write(`  ✅ Found ${results.totalFound} translation candidates\n`);
      }
    }
    
    // Generate comprehensive migration files
    process.stdout.write(`\n📝 Generating migration files...\n`);
    
    // 1. SQL Migration for system_translations table
    const sqlMigration = generateSQLMigration(allTranslations);
    fs.writeFileSync(path.join(outputDir, 'translations-migration.sql'), sqlMigration);
    
    // 2. TypeScript translation keys
    const tsDefinitions = generateTypeScriptDefinitions(allTranslations);
    fs.writeFileSync(path.join(outputDir, 'translation-keys.ts'), tsDefinitions);
    
    // 3. JSON files for i18next
    const { enJSON, arJSON } = generateJSONFiles(allTranslations);
    fs.writeFileSync(path.join(outputDir, 'en.json'), JSON.stringify(enJSON, null, 2));
    fs.writeFileSync(path.join(outputDir, 'ar.json'), JSON.stringify(arJSON, null, 2));
    
    // 4. Migration script to replace hard-coded strings
    const migrationScript = generateMigrationScript(allTranslations);
    fs.writeFileSync(path.join(outputDir, 'replace-hardcoded-strings.js'), migrationScript);
    
    process.stdout.write(`\n🎉 Extraction complete!\n`);
    process.stdout.write(`📊 Statistics:\n`);
    process.stdout.write(`  • Total translations found: ${totalExtracted}\n`);
    process.stdout.write(`  • Arabic strings: ${allTranslations.filter(t => t.type === 'arabic').length}\n`);
    process.stdout.write(`  • English strings: ${allTranslations.filter(t => t.type === 'english').length}\n`);
    process.stdout.write(`  • UI elements: ${allTranslations.filter(t => t.type === 'ui').length}\n`);
    process.stdout.write(`📁 Output directory: ${outputDir}\n`);
    
    return {
      success: true,
      totalExtracted,
      outputDir,
      allTranslations
    };
    
  } catch (error) {
    process.stderr.write(`❌ Extraction failed: ${error}\n`);
    return { success: false, error: error.message };
  }
}

function generateSQLMigration(translations) {
  const uniqueTranslations = new Map();
  
  translations.forEach(t => {
    const key = generateTranslationKey(t.text, t.context);
    if (!uniqueTranslations.has(key)) {
      uniqueTranslations.set(key, t);
    }
  });
  
  let sql = `-- Auto-generated translation migration
-- Generated on: ${new Date().toISOString()}

-- Insert extracted translations into system_translations table
INSERT INTO public.system_translations (translation_key, text_en, text_ar, category) VALUES\n`;

  const values = Array.from(uniqueTranslations.entries()).map(([key, translation]) => {
    const category = categorizeTranslation(translation);
    const textEn = translation.type === 'english' ? translation.text : '';
    const textAr = translation.type === 'arabic' ? translation.text : '';
    
    return `  ('${key}', '${escapeSQLString(textEn)}', '${escapeSQLString(textAr)}', '${category}')`;
  });

  sql += values.join(',\n');
  sql += `\nON CONFLICT (translation_key) DO UPDATE SET
  text_en = COALESCE(NULLIF(EXCLUDED.text_en, ''), system_translations.text_en),
  text_ar = COALESCE(NULLIF(EXCLUDED.text_ar, ''), system_translations.text_ar),
  updated_at = now();`;

  return sql;
}

function generateTypeScriptDefinitions(translations) {
  const keys = new Set();
  translations.forEach(t => {
    keys.add(generateTranslationKey(t.text, t.context));
  });

  return `// Auto-generated translation keys
// Generated on: ${new Date().toISOString()}

export const TRANSLATION_KEYS = {
${Array.from(keys).map(key => `  ${key.toUpperCase().replace(/[^A-Z0-9]/g, '_')}: '${key}',`).join('\n')}
} as const;

export type TranslationKey = typeof TRANSLATION_KEYS[keyof typeof TRANSLATION_KEYS];
`;
}

function generateJSONFiles(translations) {
  const enJSON = {};
  const arJSON = {};
  
  translations.forEach(t => {
    const key = generateTranslationKey(t.text, t.context);
    if (t.type === 'english') {
      enJSON[key] = t.text;
      arJSON[key] = t.text; // Placeholder, needs manual translation
    } else if (t.type === 'arabic') {
      arJSON[key] = t.text;
      enJSON[key] = t.text; // Placeholder, needs manual translation
    }
  });
  
  return { enJSON, arJSON };
}

function generateMigrationScript(translations) {
  return `// Auto-generated migration script to replace hard-coded strings
// Usage: node ${path.basename(__filename)}

const fs = require('fs');
const path = require('path');

const replacements = [
${translations.map(t => `  {
    file: '${t.file}',
    line: ${t.line},
    original: ${JSON.stringify(t.text)},
    replacement: \`t('${generateTranslationKey(t.text, t.context)}')\`,
    context: '${t.context || ''}'
  }`).join(',\n')}
];

// Implementation would go here...
process.stdout.write(\`Found \${translations.length} strings to replace\n\`);
`;
}

function generateTranslationKey(text, context) {
  // Create a meaningful key from the text and context
  const baseKey = text
    .replace(/[اأإآب-ي]/g, '') // Remove Arabic characters for key
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .substring(0, 50);
    
  const contextPrefix = context ? `${context.toLowerCase()}_` : '';
  return `${contextPrefix}${baseKey}` || 'unnamed_key';
}

function categorizeTranslation(translation) {
  if (translation.file.includes('/admin/')) return 'admin';
  if (translation.file.includes('/components/ui/')) return 'ui';
  if (translation.file.includes('/forms/')) return 'forms';
  if (translation.context && translation.context.includes('toast')) return 'notifications';
  return 'general';
}

function escapeSQLString(str) {
  return str.replace(/'/g, "''").replace(/\\/g, '\\\\');
}

// Run if called directly
if (require.main === module) {
  runFullExtractionPipeline()
    .then(result => {
      if (result.success) {
        process.stdout.write('✅ Translation extraction completed successfully\n');
        process.exit(0);
      } else {
        process.stderr.write('❌ Translation extraction failed\n');
        process.exit(1);
      }
    })
    .catch(error => {
      process.stderr.write(`💥 Fatal error: ${error}\n`);
      process.exit(1);
    });
}

module.exports = { runFullExtractionPipeline };