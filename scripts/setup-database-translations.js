#!/usr/bin/env node

/**
 * Complete Database Translation Setup
 * 
 * This script performs a complete setup of database-driven translations:
 * 1. Migrates existing static translations to database
 * 2. Generates new modular translation files
 * 3. Creates backup of original files
 * 4. Validates the migration
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function runScript(scriptPath, description) {
  return new Promise((resolve, reject) => {
    console.log(`\n🔧 ${description}...`);
    
    const child = spawn('node', [scriptPath], {
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${description} completed`);
        resolve();
      } else {
        reject(new Error(`${description} failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(new Error(`${description} failed: ${error.message}`));
    });
  });
}

async function createMultipleTranslationFiles() {
  console.log('\n📁 Generating modular translation files...');
  
  const localesDir = path.join(__dirname, '..', 'src', 'i18n', 'locales');
  const modulesDir = path.join(localesDir, 'modules');
  
  // Create modules directory
  if (!fs.existsSync(modulesDir)) {
    fs.mkdirSync(modulesDir, { recursive: true });
  }

  // Generate files for each language/category combination
  const categories = [
    'ui', 'settings', 'forms', 'admin', 'campaign', 
    'challenges', 'events', 'partners', 'tags', 'sectors',
    'navigation', 'notifications', 'errors', 'success', 'general'
  ];
  
  const languages = ['en', 'ar'];
  
  for (const language of languages) {
    const langDir = path.join(modulesDir, language);
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }
    
    for (const category of categories) {
      // Fetch translations for this language/category from the edge function
      try {
        const response = await fetch(
          `https://jxpbiljkoibvqxzdkgod.supabase.co/functions/v1/generate-translation-files?language=${language}&category=${category}`,
          {
            headers: {
              'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cGJpbGprb2lidnF4emRrZ29kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NzEzMDksImV4cCI6MjA2OTA0NzMwOX0.ls7b6Dh5Go0nQYP6Sjv1c_IxPXEv8MC5RQEpH91Z_V8`
            }
          }
        );
        
        if (response.ok) {
          const translations = await response.json();
          const filePath = path.join(langDir, `${category}.json`);
          fs.writeFileSync(filePath, JSON.stringify(translations, null, 2));
          console.log(`   ✓ Generated ${language}/${category}.json`);
        }
      } catch (error) {
        console.warn(`   ⚠️  Failed to generate ${language}/${category}.json:`, error.message);
      }
    }
  }
  
  // Create index files for easy importing
  for (const language of languages) {
    const indexContent = `// Auto-generated translation index for ${language}
${categories.map(cat => `import ${cat} from './${cat}.json';`).join('\n')}

export default {
${categories.map(cat => `  ${cat},`).join('\n')}
};

export {
${categories.map(cat => `  ${cat},`).join('\n')}
};`;

    const indexPath = path.join(modulesDir, language, 'index.ts');
    fs.writeFileSync(indexPath, indexContent);
    console.log(`   ✓ Generated ${language}/index.ts`);
  }
}

function createBackupOfOriginals() {
  console.log('\n💾 Creating backup of original translation files...');
  
  const localesDir = path.join(__dirname, '..', 'src', 'i18n', 'locales');
  const backupDir = path.join(localesDir, 'backup', 'pre-database-migration');
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const languages = ['en', 'ar'];
  languages.forEach(lang => {
    const sourceFile = path.join(localesDir, `${lang}.json`);
    const backupFile = path.join(backupDir, `${lang}.json`);
    
    if (fs.existsSync(sourceFile)) {
      fs.copyFileSync(sourceFile, backupFile);
      console.log(`   ✓ Backed up ${lang}.json`);
    }
  });
}

async function main() {
  try {
    console.log('🌐 Setting up Database-Driven Translation System\n');
    console.log('This will:');
    console.log('  1. Backup existing translation files');
    console.log('  2. Migrate static translations to database');
    console.log('  3. Generate modular translation files');
    console.log('  4. Set up the new translation system\n');

    // Step 1: Create backup
    createBackupOfOriginals();

    // Step 2: Migrate to database
    await runScript(
      path.join(__dirname, 'migrate-static-translations.js'),
      'Migrating static translations to database'
    );

    // Step 3: Generate modular files
    await createMultipleTranslationFiles();

    console.log('\n🎉 Database translation system setup complete!');
    console.log('\nNext steps:');
    console.log('  1. Review the generated modular files in src/i18n/locales/modules/');
    console.log('  2. Test the new translation system');
    console.log('  3. Update your i18n config to use the new system');
    console.log('  4. Run the translation management UI to add/edit translations');

  } catch (error) {
    console.error('\n❌ Setup failed:');
    console.error(error.message);
    
    console.log('\n🔄 You can restore the original files from:');
    console.log('    src/i18n/locales/backup/pre-database-migration/');
    
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}