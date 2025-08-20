#!/usr/bin/env node

/**
 * Verification Script - Check .single() Fix Quality
 * 
 * This script verifies that .single() replacements are properly handled
 * and identifies files that need manual null checking.
 */

const fs = require('fs');
const path = require('path');

const SRC_DIRECTORY = 'src';
const FILE_PATTERNS = ['.ts', '.tsx'];

// Color codes
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
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

function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    const issues = {
      remainingSingle: [],
      maybeSingleWithoutNullCheck: [],
      goodPatterns: []
    };
    
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmedLine = line.trim();
      
      // Check for remaining .single() calls
      if (trimmedLine.includes('.single()')) {
        issues.remainingSingle.push({
          line: lineNum,
          content: trimmedLine
        });
      }
      
      // Check for .maybeSingle() without proper null checking
      if (trimmedLine.includes('.maybeSingle()') && !trimmedLine.includes('//')) {
        const nextLines = lines.slice(index + 1, index + 5);
        const hasNullCheck = nextLines.some(nextLine => 
          nextLine.includes('if') && (
            nextLine.includes('!') || 
            nextLine.includes('null') || 
            nextLine.includes('undefined') ||
            nextLine.includes('.data')
          )
        );
        
        if (!hasNullCheck) {
          issues.maybeSingleWithoutNullCheck.push({
            line: lineNum,
            content: trimmedLine
          });
        } else {
          issues.goodPatterns.push({
            line: lineNum,
            content: trimmedLine
          });
        }
      }
    });
    
    return issues;
    
  } catch (error) {
    log(`Error analyzing ${filePath}: ${error.message}`, 'red');
    return null;
  }
}

function main() {
  log('🔍 Verification: Database Safety Check', 'cyan');
  log('=====================================\n', 'cyan');
  
  const files = getAllFiles(SRC_DIRECTORY, FILE_PATTERNS);
  
  let totalRemainingSingle = 0;
  let totalNeedsNullCheck = 0;
  let totalGoodPatterns = 0;
  let problemFiles = [];
  
  files.forEach(filePath => {
    const issues = analyzeFile(filePath);
    if (!issues) return;
    
    const hasIssues = issues.remainingSingle.length > 0 || issues.maybeSingleWithoutNullCheck.length > 0;
    
    if (hasIssues) {
      problemFiles.push(filePath);
      log(`📁 ${filePath}`, 'yellow');
      
      if (issues.remainingSingle.length > 0) {
        log(`  ❌ ${issues.remainingSingle.length} remaining .single() calls:`, 'red');
        issues.remainingSingle.forEach(issue => {
          log(`     Line ${issue.line}: ${issue.content}`, 'red');
        });
        totalRemainingSingle += issues.remainingSingle.length;
      }
      
      if (issues.maybeSingleWithoutNullCheck.length > 0) {
        log(`  ⚠️  ${issues.maybeSingleWithoutNullCheck.length} .maybeSingle() calls need null checking:`, 'yellow');
        issues.maybeSingleWithoutNullCheck.forEach(issue => {
          log(`     Line ${issue.line}: ${issue.content}`, 'yellow');
        });
        totalNeedsNullCheck += issues.maybeSingleWithoutNullCheck.length;
      }
      
      log('');
    }
    
    totalGoodPatterns += issues.goodPatterns.length;
  });
  
  // Summary Report
  log('📊 VERIFICATION SUMMARY', 'cyan');
  log('======================', 'cyan');
  log(`Files with issues: ${problemFiles.length}`);
  log(`Remaining .single() calls: ${totalRemainingSingle}`, totalRemainingSingle > 0 ? 'red' : 'green');
  log(`.maybeSingle() calls needing null checks: ${totalNeedsNullCheck}`, totalNeedsNullCheck > 0 ? 'yellow' : 'green');
  log(`Properly handled patterns: ${totalGoodPatterns}`, 'green');
  
  if (totalRemainingSingle === 0 && totalNeedsNullCheck === 0) {
    log('\n🎉 All database calls are properly handled!', 'green');
  } else {
    log('\n🔧 Next Steps:', 'yellow');
    if (totalRemainingSingle > 0) {
      log(`1. Run the fix script again to catch remaining .single() calls`);
    }
    if (totalNeedsNullCheck > 0) {
      log(`${totalRemainingSingle > 0 ? '2' : '1'}. Add null checks for .maybeSingle() calls`);
    }
    
    log('\n📝 Null Check Template:', 'cyan');
    log('const { data, error } = await supabase.from("table").select().maybeSingle();');
    log('if (error) throw error;');
    log('if (!data) {');
    log('  // Handle empty result appropriately');
    log('  throw new Error("Record not found");');
    log('  // or return null, default value, etc.');
    log('}');
  }
}

main();