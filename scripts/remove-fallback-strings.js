#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Progress tracking
let progress = {
  filesProcessed: 0,
  totalFiles: 0,
  replacements: 0,
  errors: 0
};

// Scan directory for TypeScript/JavaScript files
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

// Remove fallback strings from translation calls
function removeFallbackStrings(content) {
  let modifiedContent = content;
  let replacementCount = 0;
  
  // Pattern to match t('key', 'fallback') or t("key", "fallback")
  const patterns = [
    // t('key', 'fallback') -> t('key')
    {
      pattern: /\bt\(\s*(['"](.*?)['"])\s*,\s*['"](.*?)['"](\s*,\s*\{[^}]*\})?\s*\)/g,
      replacement: (match, keyPart, key, fallback, options) => {
        return `t(${keyPart}${options || ''})`;
      }
    },
    // t(`key`, `fallback`) -> t(`key`)
    {
      pattern: /\bt\(\s*(`.*?`)\s*,\s*`.*?`(\s*,\s*\{[^}]*\})?\s*\)/g,
      replacement: (match, keyPart, options) => {
        return `t(${keyPart}${options || ''})`;
      }
    },
    // getTranslation('key', 'fallback') -> getTranslation('key')
    {
      pattern: /\bgetTranslation\(\s*(['"](.*?)['"])\s*,\s*['"](.*?)['"](\s*,\s*['"](.*?)['"])?\s*\)/g,
      replacement: (match, keyPart, key, fallback, langPart, lang) => {
        return `getTranslation(${keyPart}${langPart || ''})`;
      }
    }
  ];
  
  patterns.forEach(({ pattern, replacement }) => {
    const matches = modifiedContent.match(pattern);
    if (matches) {
      replacementCount += matches.length;
      modifiedContent = modifiedContent.replace(pattern, replacement);
    }
  });
  
  return { content: modifiedContent, replacements: replacementCount };
}

// Process a single file
function processFile(filePath) {
  try {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    const { content: modifiedContent, replacements } = removeFallbackStrings(originalContent);
    
    if (replacements > 0) {
      fs.writeFileSync(filePath, modifiedContent);
      console.log(`   ✓ ${path.relative(process.cwd(), filePath)}: ${replacements} replacements`);
      progress.replacements += replacements;
    }
    
    progress.filesProcessed++;
  } catch (error) {
    console.error(`   ❌ Error processing ${filePath}: ${error.message}`);
    progress.errors++;
  }
}

// Main execution
async function main() {
  try {
    console.log('🚀 Starting fallback string removal process...\n');
    
    // Step 1: Scan all source files
    console.log('📁 Scanning source files...');
    const sourceDir = path.join(process.cwd(), 'src');
    const files = scanDirectory(sourceDir);
    progress.totalFiles = files.length;
    console.log(`   ✓ Found ${files.length} source files to process\n`);
    
    // Step 2: Process each file
    console.log('🔄 Removing fallback strings from translation calls...');
    
    for (const filePath of files) {
      processFile(filePath);
    }
    
    // Step 3: Generate summary
    console.log('\n📊 FALLBACK REMOVAL COMPLETE - SUMMARY REPORT:');
    console.log('═'.repeat(50));
    console.log(`   📁 Files processed: ${progress.filesProcessed}/${progress.totalFiles}`);
    console.log(`   🔄 Total replacements: ${progress.replacements}`);
    if (progress.errors > 0) {
      console.log(`   ❌ Processing errors: ${progress.errors}`);
    }
    console.log('═'.repeat(50));
    
    if (progress.replacements > 0) {
      console.log('\n🎉 Fallback strings removed successfully!');
      console.log('   Next steps:');
      console.log('   1. Test the application to ensure all translations work');
      console.log('   2. Review any missing translations in the console');
      console.log('   3. Add any new translation keys to the database if needed');
    } else {
      console.log('\n✅ No fallback strings found to remove!');
    }
    
  } catch (error) {
    console.error('\n❌ Process failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}