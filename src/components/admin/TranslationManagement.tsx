import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, Download, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { createErrorHandler } from '@/utils/unified-error-handler';
import type { TranslationPair, TranslationMergeResult } from '@/types/translation';

interface SystemTranslation {
  id: string;
  translation_key: string;
  text_en: string;
  text_ar: string;
  category: string;
}

const TranslationManagement = () => {
  const queryClient = useQueryClient();
  const { t } = useUnifiedTranslation();
  const { toast } = useToast();
  
  const loadingManager = useUnifiedLoading({
    component: 'TranslationManagement',
    showToast: true,
    logErrors: true
  });

  const errorHandler = createErrorHandler({
    component: 'TranslationManagement',
    showToast: true,
    logError: true
  });

  // Generate and download JSON file from database translations merged with existing static translations
  const downloadTranslationsJSON = async (language: 'en' | 'ar') => {
    try {
      // 1. Fetch database translations
      const { data: dbTranslations, error } = await supabase
        .from('system_translations')
        .select(`translation_key, text_${language}, category`);

      if (error) throw error;

      // 2. Load existing static translations
      let existingTranslations = {};
      try {
        const staticResponse = await fetch(`/src/i18n/locales/${language}.json`);
        if (staticResponse.ok) {
          const staticData = await staticResponse.json();
          existingTranslations = staticData || {};
        }
      } catch (err) {
        logger.warn(`Could not load existing ${language}.json, will create from database only`, { component: 'TranslationManagement', action: 'downloadTranslations' });
      }

      // 3. Convert database translations to nested structure
      interface NestedTranslation {
        [key: string]: NestedTranslation | string;
      }
      
      const dbTranslationsNested: NestedTranslation = {};
      dbTranslations?.forEach((record) => {
        const translationText = record[`text_${language}`];
        const keys = record.translation_key.split('.');
        let current = dbTranslationsNested;
        
        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          if (!(key in current) || typeof current[key] !== 'object' || Array.isArray(current[key])) {
            current[key] = {};
          }
          current = current[key];
        }
        
        current[keys[keys.length - 1]] = String(translationText);
      });

      // 4. Deep merge existing translations with database translations (database takes precedence)
      const mergeTranslations = (existing: TranslationMergeResult, db: TranslationMergeResult): TranslationMergeResult => {
        const result = { ...existing };
        
        for (const key in db) {
          if (typeof db[key] === 'object' && db[key] !== null && !Array.isArray(db[key])) {
            result[key] = mergeTranslations((existing[key] as TranslationMergeResult) || {}, db[key] as TranslationMergeResult);
          } else {
            result[key] = db[key];
          }
        }
        
        return result;
      };

      const finalTranslations = mergeTranslations(existingTranslations, dbTranslationsNested);

      // 5. Create and download file
      const blob = new Blob([JSON.stringify(finalTranslations, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${language}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const dbCount = dbTranslations?.length || 0;
      const staticKeys = Object.keys(existingTranslations).length;
      
      toast({
        title: t('common.status.success'),
        description: `${language.toUpperCase()} translations downloaded successfully (${staticKeys} static + ${dbCount} database keys)`,
      });
    } catch (error) {
      logger.error('Download error occurred', { component: 'TranslationManagement', action: 'downloadTranslations', language }, error as Error);
      toast({
        title: t('common.status.error'),
        description: `Failed to download ${language.toUpperCase()} translations`,
        variant: "destructive",
      });
    }
  };

  const [translations, setTranslations] = useState<SystemTranslation[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const [newTranslation, setNewTranslation] = useState({
    key: '',
    category: '',
    ar: '',
    en: ''
  });

  React.useEffect(() => {
    fetchTranslations();
  }, []);

  const fetchTranslations = async () => {
    await loadingManager.withLoading(
      'fetch-translations',
      async () => {
        const { data, error } = await supabase
          .from('system_translations')
          .select('*')
          .order('category, translation_key');

        if (error) throw error;

        setTranslations(data || []);
        
        // Extract unique categories
        const uniqueCategories = [...new Set((data || []).map(t => t.category))];
        setCategories(uniqueCategories);
      },
      {
        successMessage: t('translations.loaded_successfully'),
        errorMessage: t('translations.load_failed'),
        logContext: { operation: 'fetchTranslations' }
      }
    );
  };

  const handleAddTranslation = async () => {
    if (!newTranslation.key || !newTranslation.category || !newTranslation.ar || !newTranslation.en) {
      toast({
        title: t('common.status.error'),
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // Insert both Arabic and English translations in single record
      const { error } = await supabase
        .from('system_translations')
        .insert({
          translation_key: newTranslation.key,
          text_en: newTranslation.en,
          text_ar: newTranslation.ar,
          category: newTranslation.category
        });

      if (error) throw error;

      toast({
        title: t('translations.success_title'),
        description: t('translations.added_successfully')
      });

      setNewTranslation({ key: '', category: '', ar: '', en: '' });
      fetchTranslations();
    } catch (error) {
      logger.error('Error adding translation', { component: 'TranslationManagement', action: 'addTranslation', key: newTranslation.key }, error as Error);
      toast({
        title: t('common.status.error'),
        description: "Failed to add translation",
        variant: "destructive"
      });
    }
  };

  // Transform translations for display (already in bilingual format)
  const translationPairs = React.useMemo(() => {
    return translations.map(translation => ({
      key: translation.translation_key,
      category: translation.category,
      ar: translation.text_ar,
      en: translation.text_en,
      id: translation.id
    }));
  }, [translations]);

  const filteredPairs = translationPairs.filter((pair: TranslationPair) => {
    const matchesSearch = searchTerm === '' || 
      pair.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pair.ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pair.en.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || pair.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loadingManager.hasAnyLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading translations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* JSON Download Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📁 JSON Download</CardTitle>
            <CardDescription>
              Download translation JSON files to manually update static translations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 dark:text-amber-200">Complete Translation Files</p>
                  <p className="text-amber-700 dark:text-amber-300">
                    Downloads merge existing static translations with database translations. Database values take precedence for updated keys.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <Button 
                onClick={() => downloadTranslationsJSON('en')}
                className="w-full"
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                Download English JSON
              </Button>
              <Button 
                onClick={() => downloadTranslationsJSON('ar')}
                className="w-full"
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Arabic JSON
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add New Translation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">➕ Add Translation</CardTitle>
            <CardDescription>
              Add new translation keys with both Arabic and English text
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="new-key">Translation Key</Label>
                <Input
                  id="new-key"
                  placeholder="e.g., settings.ui.theme"
                  value={newTranslation.key}
                  onChange={(e) => setNewTranslation(prev => ({ ...prev, key: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="new-category">Category</Label>
                <Select value={newTranslation.category} onValueChange={(value) => setNewTranslation(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('admin.select_category', 'Select category')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 ? categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    )) : (
                      <>
                        <SelectItem value="settings">Settings</SelectItem>
                        <SelectItem value="navigation">Navigation</SelectItem>
                        <SelectItem value="ui">UI</SelectItem>
                        <SelectItem value="forms">Forms</SelectItem>
                        <SelectItem value="errors">Errors</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="new-english">English Text</Label>
                <Textarea
                  id="new-english"
                  placeholder={t('admin.english_translation', 'English translation')}
                  value={newTranslation.en}
                  onChange={(e) => setNewTranslation(prev => ({ ...prev, en: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="new-arabic">Arabic Text</Label>
                <Textarea
                  id="new-arabic"
                  placeholder={t('translation_management.arabic_text_placeholder', 'النص العربي')}
                  value={newTranslation.ar}
                  onChange={(e) => setNewTranslation(prev => ({ ...prev, ar: e.target.value }))}
                />
              </div>

              <Button 
                onClick={handleAddTranslation}
                className="w-full"
                disabled={!newTranslation.key || !newTranslation.category || !newTranslation.en || !newTranslation.ar}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Translation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database Translation Management */}
      <Card>
        <CardHeader>
          <CardTitle>Database Translations</CardTitle>
          <CardDescription>
            Manage dynamic translations stored in the database (recommended)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <Input
                  placeholder={t('common.placeholders.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={t('translations.filter_by_category')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('translations.all_categories')}</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{translationPairs.length}</div>
                <p className="text-sm text-muted-foreground">Total Keys</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{categories.length}</div>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">
                  {filteredPairs.filter((p: TranslationPair) => p.ar && p.en).length}
                </div>
                <p className="text-sm text-muted-foreground">Complete</p>
              </div>
            </div>

            {/* Translation List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredPairs.map((pair: TranslationPair, index) => (
                <div key={`${pair.category}:${pair.key}`} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{pair.category}</Badge>
                      <code className="text-sm bg-muted px-2 py-1 rounded">{pair.key}</code>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">EN:</span> {pair.en || '—'}
                    </div>
                    <div>
                      <span className="font-medium">AR:</span> {pair.ar || '—'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredPairs.length === 0 && !loadingManager.hasAnyLoading && (
              <div className="text-center py-8 text-muted-foreground">
                No translations found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TranslationManagement;