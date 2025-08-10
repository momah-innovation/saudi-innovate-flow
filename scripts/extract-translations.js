#!/usr/bin/env node

/**
 * TRANSLATION EXTRACTION TOOL
 * Automatically extracts hard-coded strings and converts them to translation keys
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ExtractedString {
  file: string;
  line: number;
  originalString: string;
  suggestedKey: string;
  context: string;
  category: string;
}

interface TranslationKey {
  key: string;
  en: string;
  ar: string;
  category: string;
}

class TranslationExtractor {
  private extractedStrings: ExtractedString[] = [];
  private existingKeys: Set<string> = new Set();
  
  // Patterns to detect hard-coded strings
  private patterns = [
    // JSX text content
    />\s*([A-Z][A-Za-z\s]{2,50})\s*</g,
    
    // String literals in quotes
    /"([A-Z][A-Za-z\s]{3,50})"/g,
    /'([A-Z][A-Za-z\s]{3,50})'/g,
    
    // Template literals
    /`([A-Z][A-Za-z\s]{3,50})`/g,
    
    // Button/Label text
    /(?:text|label|title|placeholder)[\s=]*["']([A-Z][A-Za-z\s]{2,50})["']/g,
    
    // Toast/Alert messages
    /(?:toast|alert|message)[\s\S]*?["']([A-Z][A-Za-z\s]{3,100})["']/g,
  ];
  
  // Categories based on file paths and content
  private categories = {
    'components/admin': 'admin',
    'components/challenges': 'challenges',
    'components/ideas': 'ideas',
    'components/events': 'events',
    'components/opportunities': 'opportunities',
    'components/ui': 'ui',
    'components/forms': 'forms',
    'pages/admin': 'admin',
    'pages/auth': 'auth',
    'pages/': 'pages',
    'hooks/': 'hooks',
    'utils/': 'utils'
  };
  
  async extractFromProject() {
    console.log('🔍 Starting translation extraction...');
    
    const srcDir = path.join(process.cwd(), 'src');
    await this.processDirectory(srcDir);
    
    console.log(`📊 Extracted ${this.extractedStrings.length} hard-coded strings`);
    
    // Generate translation keys
    const translationKeys = this.generateTranslationKeys();
    
    // Save results
    await this.saveResults(translationKeys);
    
    return {
      extractedStrings: this.extractedStrings,
      translationKeys
    };
  }
  
  private async processDirectory(dirPath: string) {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules, .git, etc.
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          await this.processDirectory(fullPath);
        }
      } else if (entry.isFile() && this.shouldProcessFile(entry.name)) {
        await this.processFile(fullPath);
      }
    }
  }
  
  private shouldProcessFile(filename: string): boolean {
    const extensions = ['.tsx', '.ts', '.jsx', '.js'];
    return extensions.some(ext => filename.endsWith(ext));
  }
  
  private async processFile(filePath: string) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const relativePath = path.relative(process.cwd(), filePath);
      
      // Skip files that are already using translation hooks
      if (content.includes('useUnifiedTranslation') || content.includes('useTranslation')) {
        // Still extract, but mark as partially translated
      }
      
      const lines = content.split('\n');
      
      for (let lineNum = 0; lineNum < lines.length; lineNum++) {
        const line = lines[lineNum];
        
        for (const pattern of this.patterns) {
          let match;
          pattern.lastIndex = 0; // Reset regex
          
          while ((match = pattern.exec(line)) !== null) {
            const extractedText = match[1];
            
            if (this.isValidString(extractedText)) {
              this.extractedStrings.push({
                file: relativePath,
                line: lineNum + 1,
                originalString: extractedText,
                suggestedKey: this.generateKey(extractedText, relativePath),
                context: line.trim(),
                category: this.getCategory(relativePath)
              });
            }
          }
        }
      }
    } catch (error) {
      console.warn(`⚠️ Failed to process ${filePath}:`, error);
    }
  }
  
  private isValidString(text: string): boolean {
    // Filter out false positives
    const invalidPatterns = [
      /^(src|className|href|id|key|type|role|aria-|data-)/, // HTML attributes
      /^(import|export|from|const|let|var|function|return)/, // JS keywords
      /^(React|Component|Props|State|Hook)/, // React terms
      /^(div|span|button|input|form|table|tr|td|th|ul|li|p|h[1-6])$/i, // HTML tags
      /^\d+$/, // Numbers only
      /^[a-z]/, // Starts with lowercase (likely variable)
      /[{}()[\]<>]/, // Contains code symbols
    ];
    
    return !invalidPatterns.some(pattern => pattern.test(text)) &&
           text.length >= 3 &&
           text.length <= 100 &&
           text.trim() === text; // No leading/trailing whitespace
  }
  
  private generateKey(text: string, filePath: string): string {
    const category = this.getCategory(filePath);
    const component = this.getComponentName(filePath);
    
    // Convert text to kebab-case
    const keyPart = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 30);
    
    const baseKey = `${category}.${component}.${keyPart}`;
    
    // Ensure uniqueness
    let counter = 1;
    let finalKey = baseKey;
    while (this.existingKeys.has(finalKey)) {
      finalKey = `${baseKey}_${counter}`;
      counter++;
    }
    
    this.existingKeys.add(finalKey);
    return finalKey;
  }
  
  private getCategory(filePath: string): string {
    for (const [pathPattern, category] of Object.entries(this.categories)) {
      if (filePath.includes(pathPattern)) {
        return category;
      }
    }
    return 'common';
  }
  
  private getComponentName(filePath: string): string {
    const filename = path.basename(filePath, path.extname(filePath));
    return filename.toLowerCase().replace(/[^a-z0-9]/g, '_');
  }
  
  private generateTranslationKeys(): TranslationKey[] {
    return this.extractedStrings.map(item => ({
      key: item.suggestedKey,
      en: item.originalString,
      ar: this.generateArabicTranslation(item.originalString),
      category: item.category
    }));
  }
  
  private generateArabicTranslation(englishText: string): string {
    // This is a placeholder - in a real implementation, you'd use:
    // 1. Translation API (Google Translate, etc.)
    // 2. Professional translation service
    // 3. Existing translation database
    
    const commonTranslations: Record<string, string> = {
      'Create': 'إنشاء',
      'Edit': 'تعديل',
      'Delete': 'حذف',
      'Save': 'حفظ',
      'Cancel': 'إلغاء',
      'Search': 'بحث',
      'Filter': 'تصفية',
      'Sort': 'ترتيب',
      'Status': 'الحالة',
      'Active': 'نشط',
      'Inactive': 'غير نشط',
      'Settings': 'الإعدادات',
      'Profile': 'الملف الشخصي',
      'Dashboard': 'لوحة التحكم',
      'Challenge': 'التحدي',
      'Challenges': 'التحديات',
      'Ideas': 'الأفكار',
      'Events': 'الفعاليات',
      'Opportunities': 'الفرص',
      'Users': 'المستخدمون',
      'Admin': 'المشرف',
      'Management': 'الإدارة',
      'Loading': 'جارٍ التحميل',
      'Error': 'خطأ',
      'Success': 'نجح',
      'Warning': 'تحذير',
      'Information': 'معلومات'
    };
    
    // Try exact match first
    if (commonTranslations[englishText]) {
      return commonTranslations[englishText];
    }
    
    // Try partial matches
    for (const [en, ar] of Object.entries(commonTranslations)) {
      if (englishText.includes(en)) {
        return englishText.replace(en, ar);
      }
    }
    
    // Fallback: mark for manual translation
    return `[TRANSLATE: ${englishText}]`;
  }
  
  private async saveResults(translationKeys: TranslationKey[]) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputDir = path.join(process.cwd(), 'translation-extraction');
    
    await fs.mkdir(outputDir, { recursive: true });
    
    // Save extracted strings report
    const reportPath = path.join(outputDir, `extraction-report-${timestamp}.json`);
    await fs.writeFile(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      totalStrings: this.extractedStrings.length,
      categoryCounts: this.getCategoryCounts(),
      extractedStrings: this.extractedStrings
    }, null, 2));
    
    // Save translation keys for database import
    const keysPath = path.join(outputDir, `translation-keys-${timestamp}.json`);
    await fs.writeFile(keysPath, JSON.stringify(translationKeys, null, 2));
    
    // Generate SQL for Supabase import
    const sqlPath = path.join(outputDir, `translation-keys-${timestamp}.sql`);
    const sqlContent = this.generateSQL(translationKeys);
    await fs.writeFile(sqlPath, sqlContent);
    
    // Generate TypeScript file with all keys
    const tsPath = path.join(outputDir, `translation-keys-${timestamp}.ts`);
    const tsContent = this.generateTypeScript(translationKeys);
    await fs.writeFile(tsPath, tsContent);
    
    console.log(`📁 Results saved to ${outputDir}/`);
    console.log(`📊 Report: extraction-report-${timestamp}.json`);
    console.log(`🔑 Keys: translation-keys-${timestamp}.json`);
    console.log(`🗄️ SQL: translation-keys-${timestamp}.sql`);
    console.log(`📝 TypeScript: translation-keys-${timestamp}.ts`);
  }
  
  private getCategoryCounts(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const item of this.extractedStrings) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }
  
  private generateSQL(keys: TranslationKey[]): string {
    const values = keys.map(key => 
      `('${key.key}', '${key.en.replace(/'/g, "''")}', '${key.ar.replace(/'/g, "''")}', '${key.category}')`
    ).join(',\n  ');
    
    return `-- Generated translation keys for Supabase
-- Run this SQL in your Supabase SQL editor

INSERT INTO system_translations (translation_key, text_en, text_ar, category)
VALUES
  ${values}
ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category;
`;
  }
  
  private generateTypeScript(keys: TranslationKey[]): string {
    const keysList = keys.map(k => `  '${k.key}'`).join(',\n');
    
    return `// Generated translation keys
// Use this for TypeScript autocomplete

export const TRANSLATION_KEYS = {
${keys.map(k => `  '${k.key}': '${k.key}'`).join(',\n')}
} as const;

export type TranslationKey = keyof typeof TRANSLATION_KEYS;

// All available keys for reference
export const ALL_TRANSLATION_KEYS = [
${keysList}
] as const;
`;
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const extractor = new TranslationExtractor();
  extractor.extractFromProject()
    .then(() => {
      console.log('✅ Translation extraction completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Translation extraction failed:', error);
      process.exit(1);
    });
}

export { TranslationExtractor };