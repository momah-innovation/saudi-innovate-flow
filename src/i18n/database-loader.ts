import { supabase } from '@/integrations/supabase/client';

interface DatabaseTranslations {
  [language: string]: {
    [key: string]: any;
  };
}

interface SystemTranslation {
  translation_key: string;
  language_code: string;
  translation_text: string;
  category: string;
}

export class DatabaseTranslationLoader {
  private cache: DatabaseTranslations = {};
  private lastFetch: number = 0;
  private cacheDuration = 5 * 60 * 1000; // 5 minutes
  private isLoading = false;

  async loadTranslations(language?: string): Promise<DatabaseTranslations> {
    // Return cached if still valid
    if (this.isCacheValid() && Object.keys(this.cache).length > 0) {
      return language ? { [language]: this.cache[language] || {} } : this.cache;
    }

    // Prevent concurrent loading
    if (this.isLoading) {
      await this.waitForLoading();
      return language ? { [language]: this.cache[language] || {} } : this.cache;
    }

    this.isLoading = true;

    try {
      console.log('Loading translations from database...');
      
      const query = supabase.from('system_translations').select('*');
      
      if (language) {
        query.eq('language_code', language);
      }

      const { data: translations, error } = await query;

      if (error) {
        console.error('Error loading translations:', error);
        throw error;
      }

      // Process translations into nested object structure
      const processedTranslations: DatabaseTranslations = {};

      translations?.forEach((translation: SystemTranslation) => {
        const { language_code, translation_key, translation_text } = translation;
        
        if (!processedTranslations[language_code]) {
          processedTranslations[language_code] = {};
        }

        // Handle nested keys (e.g., "settings.ui.theme")
        const keyParts = translation_key.split('.');
        let current = processedTranslations[language_code];

        for (let i = 0; i < keyParts.length - 1; i++) {
          const part = keyParts[i];
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part];
        }

        current[keyParts[keyParts.length - 1]] = translation_text;
      });

      // Merge with base static translations
      await this.mergeWithStaticTranslations(processedTranslations);

      this.cache = processedTranslations;
      this.lastFetch = Date.now();
      
      console.log(`Loaded ${translations?.length || 0} translations from database`);
      
      return language ? { [language]: this.cache[language] || {} } : this.cache;

    } finally {
      this.isLoading = false;
    }
  }

  private async mergeWithStaticTranslations(dbTranslations: DatabaseTranslations) {
    // Import base static translations dynamically
    try {
      const [enStatic, arStatic] = await Promise.all([
        import('../i18n/locales/en.json'),
        import('../i18n/locales/ar.json')
      ]);

      // Merge database translations over static ones
      if (dbTranslations.en) {
        dbTranslations.en = { ...enStatic.default, ...dbTranslations.en };
      } else {
        dbTranslations.en = enStatic.default;
      }

      if (dbTranslations.ar) {
        dbTranslations.ar = { ...arStatic.default, ...dbTranslations.ar };
      } else {
        dbTranslations.ar = arStatic.default;
      }

    } catch (error) {
      console.warn('Could not load static translations, using database only:', error);
    }
  }

  private isCacheValid(): boolean {
    return Date.now() - this.lastFetch < this.cacheDuration;
  }

  private async waitForLoading(): Promise<void> {
    return new Promise((resolve) => {
      const checkLoading = () => {
        if (!this.isLoading) {
          resolve();
        } else {
          setTimeout(checkLoading, 100);
        }
      };
      checkLoading();
    });
  }

  clearCache(): void {
    this.cache = {};
    this.lastFetch = 0;
  }

  async preloadTranslations(languages: string[] = ['en', 'ar']): Promise<void> {
    try {
      await this.loadTranslations();
    } catch (error) {
      console.error('Failed to preload translations:', error);
    }
  }
}

export const dbTranslationLoader = new DatabaseTranslationLoader();