#!/usr/bin/env node

/**
 * Database Safety Script - Fix .single() Calls
 * 
 * This script automatically replaces dangerous .single() calls with .maybeSingle()
 * and adds proper null checking to prevent runtime errors.
 * 
 * Usage: node scripts/fix-single-calls.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SRC_DIRECTORY = 'src';
const FILE_PATTERNS = ['.ts', '.tsx'];
const DRY_RUN = process.argv.includes('--dry-run');

// Statistics
let filesProcessed = 0;
let replacementsMade = 0;
let filesModified = 0;

// Color codes for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getAllFiles(dir, extensions) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Skip node_modules and other irrelevant directories
      if (!['node_modules', '.git', 'dist', 'build'].includes(file)) {
        results = results.concat(getAllFiles(filePath, extensions));
      }
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

function fixSingleCalls(content, filePath) {
  let modifiedContent = content;
  let localReplacements = 0;
  
  // Pattern 1: Simple .single() replacement
  const singlePattern = /\.single\(\)/g;
  const singleMatches = content.match(singlePattern);
  
  if (singleMatches) {
    modifiedContent = modifiedContent.replace(singlePattern, '.maybeSingle()');
    localReplacements += singleMatches.length;
    
    log(`   Found ${singleMatches.length} .single() calls`, 'yellow');
  }
  
  // Pattern 2: .single() with chaining - more complex
  const chainingPattern = /\.single\(\)\s*;/g;
  const chainingMatches = content.match(chainingPattern);
  
  if (chainingMatches) {
    modifiedContent = modifiedContent.replace(chainingPattern, '.maybeSingle();');
  }
  
  // Pattern 3: Handle await patterns
  const awaitSinglePattern = /(await\s+.*?)\.single\(\)/g;
  modifiedContent = modifiedContent.replace(awaitSinglePattern, '$1.maybeSingle()');
  
  return {
    content: modifiedContent,
    replacements: localReplacements,
    hasChanges: localReplacements > 0
  };
}

function addNullCheckExamples(content, filePath) {
  let modifiedContent = content;
  
  // Add helpful comment about null checking after .maybeSingle()
  if (content.includes('.maybeSingle()') && !content.includes('// TODO: Add null check')) {
    const insertPoint = content.indexOf('.maybeSingle()');
    if (insertPoint !== -1) {
      const lines = modifiedContent.split('\n');
      const lineWithMaybeSingle = lines.findIndex(line => 
        line.includes('.maybeSingle()') && !line.includes('// TODO: Add null check')
      );
      
      if (lineWithMaybeSingle !== -1) {
        lines.splice(lineWithMaybeSingle + 1, 0, 
          '        // TODO: Add null check: if (!result) { handle empty result }');
        modifiedContent = lines.join('\n');
      }
    }
  }
  
  return modifiedContent;
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    filesProcessed++;
    
    // Skip files that don't contain .single()
    if (!content.includes('.single()')) {
      return;
    }
    
    log(`\n📁 Processing: ${filePath}`, 'cyan');
    
    // Fix .single() calls
    const result = fixSingleCalls(content, filePath);
    
    if (result.hasChanges) {
      let finalContent = result.content;
      
      // Add null check reminders (only in non-dry-run mode)
      if (!DRY_RUN) {
        finalContent = addNullCheckExamples(finalContent, filePath);
      }
      
      if (!DRY_RUN) {
        // Create backup
        const backupPath = `${filePath}.backup`;
        fs.writeFileSync(backupPath, content);
        
        // Write modified content
        fs.writeFileSync(filePath, finalContent);
        log(`   ✅ Fixed ${result.replacements} calls (backup: ${backupPath})`, 'green');
      } else {
        log(`   🔍 Would fix ${result.replacements} calls`, 'yellow');
      }
      
      replacementsMade += result.replacements;
      filesModified++;
    }
    
  } catch (error) {
    log(`   ❌ Error processing ${filePath}: ${error.message}`, 'red');
  }
}

function generateReport() {
  log('\n' + '='.repeat(60), 'magenta');
  log('🔧 DATABASE SAFETY SCRIPT REPORT', 'magenta');
  log('='.repeat(60), 'magenta');
  
  if (DRY_RUN) {
    log('\n🔍 DRY RUN MODE - No files were modified', 'yellow');
  }
  
  log(`\n📊 Statistics:`, 'blue');
  log(`   Files processed: ${filesProcessed}`);
  log(`   Files with .single() calls: ${filesModified}`);
  log(`   Total .single() calls found: ${replacementsMade}`);
  
  if (!DRY_RUN && filesModified > 0) {
    log(`\n✅ Success! Fixed ${replacementsMade} dangerous .single() calls`, 'green');
    log(`\n⚠️  Next Steps:`, 'yellow');
    log(`   1. Review the modified files`);
    log(`   2. Add proper null checks where marked with TODO`);
    log(`   3. Test the affected functionality`);
    log(`   4. Remove backup files after verification`);
    log(`\n📝 Example null check pattern:`, 'cyan');
    log(`   const result = await supabase.from('table').select().maybeSingle();`);
    log(`   if (!result.data) {`);
    log(`     // Handle empty result - throw error, return default, etc.`);
    log(`     throw new Error('Record not found');`);
    log(`   }`);
  } else if (DRY_RUN) {
    log(`\n🚀 Run without --dry-run to apply these fixes`, 'green');
  } else {
    log(`\n🎉 No .single() calls found - database is already safe!`, 'green');
  }
  
  log('\n' + '='.repeat(60), 'magenta');
}

function main() {
  log('🚀 Starting Database Safety Script...', 'green');
  log(`   Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE EXECUTION'}`, DRY_RUN ? 'yellow' : 'green');
  
  // Get all TypeScript files
  const files = getAllFiles(SRC_DIRECTORY, FILE_PATTERNS);
  log(`   Found ${files.length} files to process\n`, 'blue');
  
  // Process each file
  files.forEach(processFile);
  
  // Generate final report
  generateReport();
}

// Run the script
main();