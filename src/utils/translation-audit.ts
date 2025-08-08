/**
 * Translation System Audit Utility
 * Checks compliance and identifies issues with translation keys
 */

export interface TranslationAuditResult {
  database: {
    totalKeys: number;
    missingEnglish: number;
    missingArabic: number;
    categories: number;
  };
  codeUsage: {
    filesUsingTranslations: number;
    translationCalls: number;
    potentialHardcodedStrings: string[];
  };
  compliance: {
    keyNamingIssues: string[];
    missingTranslationKeys: string[];
    unusedTranslationKeys: string[];
  };
  recommendations: string[];
}

/**
 * Validates translation key naming convention
 * Keys should follow: category.subcategory.key_name
 */
export function validateKeyNaming(key: string): boolean {
  // Check for proper dot notation
  if (!key.includes('.')) return false;
  
  // Check for valid characters (letters, numbers, underscores, dots)
  if (!/^[a-z0-9_.]+$/.test(key)) return false;
  
  // Should have at least 2 parts (category.key)
  const parts = key.split('.');
  if (parts.length < 2) return false;
  
  // Each part should not be empty
  return parts.every(part => part.length > 0);
}

/**
 * Checks if a string should be translated
 */
export function shouldBeTranslated(text: string): boolean {
  // Skip single words that are likely component names or technical terms
  if (!/\s/.test(text) && text.length < 3) return false;
  
  // Skip common technical terms
  const technicalTerms = ['API', 'URL', 'ID', 'UUID', 'JSON', 'HTML', 'CSS', 'JS', 'TS'];
  if (technicalTerms.includes(text.toUpperCase())) return false;
  
  // Skip file extensions and paths
  if (/\.(jpg|png|svg|pdf|doc|xls)$/i.test(text)) return false;
  if (text.startsWith('/') || text.includes('\\')) return false;
  
  // Should translate if it's user-facing text
  return /^[A-Z][a-z\s]+/.test(text) || text.split(' ').length > 1;
}

/**
 * Extracts translation keys from code
 */
export function extractTranslationKeys(codeContent: string): string[] {
  const keys: string[] = [];
  
  // Match t('key') or t("key") patterns
  const tFunctionMatches = codeContent.matchAll(/\bt\(['"`]([^'"`]+)['"`]\)/g);
  for (const match of tFunctionMatches) {
    keys.push(match[1]);
  }
  
  return keys;
}

/**
 * Finds potential hardcoded strings that should be translated
 */
export function findHardcodedStrings(codeContent: string): string[] {
  const hardcoded: string[] = [];
  
  // Match string literals that look like user-facing text
  const stringMatches = codeContent.matchAll(/['"`]([A-Z][a-zA-Z\s]{2,}?)['"`]/g);
  for (const match of stringMatches) {
    const text = match[1];
    if (shouldBeTranslated(text)) {
      hardcoded.push(text);
    }
  }
  
  return hardcoded;
}

/**
 * Suggests translation key for a given text
 */
export function suggestTranslationKey(text: string, category: string = 'general'): string {
  const normalized = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 50); // Limit length
  
  return `${category}.${normalized}`;
}

export const TRANSLATION_CATEGORIES = [
  'general', 'ui', 'navigation', 'form', 'validation', 'error', 'success',
  'challenge', 'idea', 'event', 'campaign', 'opportunity', 'evaluation',
  'admin', 'dashboard', 'settings', 'auth', 'profile', 'search',
  'table', 'analytics', 'notification', 'communication', 'files'
] as const;

export type TranslationCategory = typeof TRANSLATION_CATEGORIES[number];