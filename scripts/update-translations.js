#!/usr/bin/env node

/**
 * Translation Update Script
 * 
 * This script fetches the latest translations from the Supabase database
 * and updates the static JSON files used by the i18n system.
 * 
 * Usage:
 * - npm run update-translations (for production)
 * - npm run update-translations:dev (for development)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const SUPABASE_URL = 'https://jxpbiljkoibvqxzdkgod.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cGJpbGprb2lidnF4emRrZ29kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NzEzMDksImV4cCI6MjA2OTA0NzMwOX0.ls7b6Dh5Go0nQYP6Sjv1c_IxPXEv8MC5RQEpH91Z_V8';

// Directories
const LOCALES_DIR = path.join(__dirname, '..', 'src', 'i18n', 'locales');
const BACKUP_DIR = path.join(LOCALES_DIR, 'backup');

async function fetchTranslations() {
  return new Promise((resolve, reject) => {
    const url = `${SUPABASE_URL}/functions/v1/generate-translation-files`;
    
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            reject(new Error(`Failed to parse JSON: ${error.message}`));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });

    req.end();
  });
}

function createBackup() {
  console.log('Creating backup of existing translation files...');
  
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupSubDir = path.join(BACKUP_DIR, timestamp);
  fs.mkdirSync(backupSubDir, { recursive: true });

  // Backup existing files
  const languages = ['en', 'ar'];
  languages.forEach(lang => {
    const sourceFile = path.join(LOCALES_DIR, `${lang}.json`);
    const backupFile = path.join(backupSubDir, `${lang}.json`);
    
    if (fs.existsSync(sourceFile)) {
      fs.copyFileSync(sourceFile, backupFile);
      console.log(`✓ Backed up ${lang}.json`);
    }
  });

  // Keep only last 10 backups
  const backups = fs.readdirSync(BACKUP_DIR)
    .filter(name => name !== '.gitkeep')
    .sort()
    .reverse();
    
  if (backups.length > 10) {
    backups.slice(10).forEach(oldBackup => {
      const oldBackupPath = path.join(BACKUP_DIR, oldBackup);
      fs.rmSync(oldBackupPath, { recursive: true, force: true });
      console.log(`✓ Removed old backup: ${oldBackup}`);
    });
  }
}

function updateTranslationFiles(translations) {
  console.log('Updating translation files...');
  
  // Ensure locales directory exists
  if (!fs.existsSync(LOCALES_DIR)) {
    fs.mkdirSync(LOCALES_DIR, { recursive: true });
  }

  const languages = Object.keys(translations.translations || {});
  
  languages.forEach(lang => {
    const translationData = translations.translations[lang];
    const filePath = path.join(LOCALES_DIR, `${lang}.json`);
    
    // Write formatted JSON with proper indentation
    const jsonContent = JSON.stringify(translationData, null, 2);
    fs.writeFileSync(filePath, jsonContent, 'utf8');
    
    console.log(`✓ Updated ${lang}.json (${Object.keys(translationData).length} keys)`);
  });
}

function generateReport(translations) {
  console.log('\n📊 Translation Report:');
  console.log(`Generated at: ${translations.generated_at}`);
  console.log(`Languages: ${translations.languages?.join(', ') || 'N/A'}`);
  console.log(`Total translations in database: ${translations.translation_count || 0}`);
  
  if (translations.translations) {
    Object.entries(translations.translations).forEach(([lang, data]) => {
      const keyCount = countKeys(data);
      console.log(`  ${lang}: ${keyCount} keys`);
    });
  }
}

function countKeys(obj, prefix = '') {
  let count = 0;
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      count += countKeys(value, prefix ? `${prefix}.${key}` : key);
    } else {
      count++;
    }
  }
  return count;
}

async function main() {
  try {
    console.log('🌐 Fetching latest translations from database...');
    
    const translations = await fetchTranslations();
    
    if (!translations.translations || Object.keys(translations.translations).length === 0) {
      console.warn('⚠️  No translations found in database, keeping existing files');
      return;
    }

    // Create backup
    createBackup();
    
    // Update files
    updateTranslationFiles(translations);
    
    // Generate report
    generateReport(translations);
    
    console.log('\n✅ Translation update completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Translation update failed:');
    console.error(error.message);
    
    if (error.message.includes('ECONNREFUSED') || error.message.includes('network')) {
      console.log('\n💡 This might be due to network issues or the Edge Function not being deployed.');
      console.log('   Falling back to existing translation files...');
    }
    
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
