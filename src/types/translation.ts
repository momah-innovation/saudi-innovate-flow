/**
 * TypeScript definitions for the translation system
 */

export interface SystemTranslation {
  id: string;
  translation_key: string;
  text_en: string;
  text_ar: string;
  category: string;
  created_at?: string;
  updated_at?: string;
}

export interface TranslationPair {
  key: string;
  en: string;
  ar: string;
  category?: string;
}

export interface TranslationMergeResult {
  [key: string]: string | TranslationMergeResult;
}

export interface DatabaseTranslationRecord {
  translation_key: string;
  text_en: string;
  text_ar: string;
  category?: string;
}

export type SupportedLanguage = 'en' | 'ar';

export interface TranslationContext {
  component?: string;
  feature?: string;
  action?: string;
}