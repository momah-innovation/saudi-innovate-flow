import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { createErrorHandler } from '@/utils/unified-error-handler';
import { Download, Search, Plus, Edit2, Trash2, FileText, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

interface SystemTranslation {
  id: string;
  translation_key: string;
  text_en: string;
  text_ar: string;
  category: string;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = [
  'ui', 'settings', 'forms', 'errors', 'navigation', 'admin', 'campaign', 
  'challenges', 'events', 'partners', 'tags', 'notifications', 'general'
];

export const TranslationManager: React.FC = () => {
  const [translations, setTranslations] = useState<SystemTranslation[]>([]);
  const [filteredTranslations, setFilteredTranslations] = useState<SystemTranslation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTranslation, setEditingTranslation] = useState<SystemTranslation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  
  // Unified loading and error handling
  const unifiedLoading = useUnifiedLoading({
    component: 'TranslationManager',
    showToast: true,
    logErrors: true
  });
  const errorHandler = createErrorHandler({
    component: 'TranslationManager',
    showToast: true,
    logError: true
  });

  useEffect(() => {
    loadTranslations();
  }, []);

  useEffect(() => {
    filterTranslations();
  }, [translations, selectedCategory, searchTerm]);

  const loadTranslations = async () => {
    const result = await unifiedLoading.withLoading('loadTranslations', async () => {
      const { data, error } = await supabase
        .from('system_translations')
        .select('*')
        .order('translation_key');

      if (error) throw error;
      return data || [];
    }, {
      errorMessage: t('translations.loadError', 'Failed to load translations')
    });
    
    if (result) {
      setTranslations(result);
    }
  };

  const filterTranslations = () => {
    let filtered = translations;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.translation_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.text_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.text_ar.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTranslations(filtered);
  };

  const downloadTranslationsJSON = async (language: 'en' | 'ar') => {
    await unifiedLoading.withLoading(`download_${language}`, async () => {
      const { data: translations, error } = await supabase
        .from('system_translations')
        .select(`translation_key, text_${language}, category`);

      if (error) throw error;

      // Convert to nested JSON structure
      interface NestedJsonStructure {
        [key: string]: NestedJsonStructure | string;
      }
      
      const jsonStructure: NestedJsonStructure = {};
      
      translations?.forEach((record) => {
        const translationText = record[`text_${language}`];
        const keys = record.translation_key.split('.');
        let current = jsonStructure;
        
        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          if (!(key in current) || typeof current[key] !== 'object' || current[key] === null || Array.isArray(current[key])) {
            current[key] = {};
          }
          current = current[key] as NestedJsonStructure;
        }
        
        current[keys[keys.length - 1]] = translationText;
      });

      // Create and download file
      const blob = new Blob([JSON.stringify(jsonStructure, null, 2)], {
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
    }, {
      successMessage: t('translations.downloadSuccess', `${language.toUpperCase()} translations downloaded successfully`),
      errorMessage: t('translations.downloadError', `Failed to download ${language.toUpperCase()} translations`)
    });
  };

  const saveTranslation = async (translationData: Partial<SystemTranslation>) => {
    const result = await unifiedLoading.withLoading('saveTranslation', async () => {
      if (editingTranslation) {
        const { error } = await supabase
          .from('system_translations')
          .update(translationData)
          .eq('id', editingTranslation.id);
        
        if (error) throw error;
        return 'updated';
      } else {
        // Ensure required fields are present for insert
        const insertData = {
          translation_key: translationData.translation_key!,
          text_en: translationData.text_en!,
          text_ar: translationData.text_ar!,
          category: translationData.category || 'general'
        };
        
        const { error } = await supabase
          .from('system_translations')
          .insert([insertData]);
        
        if (error) throw error;
        return 'created';
      }
    }, {
      successMessage: editingTranslation ? t('translations.updateSuccess') : t('translations.createSuccess'),
      errorMessage: t('translations.saveError', 'Failed to save translation')
    });
    
    if (result) {
      await loadTranslations();
      setIsDialogOpen(false);
      setEditingTranslation(null);
    }
  };

  const deleteTranslation = async (id: string) => {
    if (!confirm(t('translations.delete_confirm', 'Are you sure you want to delete this translation?'))) return;
    
    const result = await unifiedLoading.withLoading(`delete_${id}`, async () => {
      const { error } = await supabase
        .from('system_translations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    }, {
      successMessage: t('translations.deleteSuccess'),
      errorMessage: t('translations.deleteError', 'Failed to delete translation')
    });
    
    if (result) {
      await loadTranslations();
    }
  };

  return (
    <div className="space-y-6">
      {/* JSON Download Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            {t('translations.json_download', 'JSON Download')}
          </CardTitle>
          <CardDescription>
            {t('translations.json_download_desc', 'Download translation JSON files for manual deployment')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 dark:text-amber-200">{t('translations.manual_process', 'Manual Process Required')}</p>
                  <p className="text-amber-700 dark:text-amber-300">
                    {t('translations.manual_process_desc', 'After downloading, manually replace the JSON files in src/i18n/locales/ to update static translations.')}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => downloadTranslationsJSON('en')}
                disabled={unifiedLoading.isLoading('download_en')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {t('translations.download_english', 'Download English JSON')}
              </Button>
              <Button 
                onClick={() => downloadTranslationsJSON('ar')}
                disabled={unifiedLoading.isLoading('download_ar')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {t('translations.download_arabic', 'Download Arabic JSON')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bilingual Translation Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {t('translations.bilingual_management', 'Bilingual Translation Management')}
            <div className="flex gap-2">
              <Button 
                onClick={() => unifiedLoading.withLoading('refresh', async () => loadTranslations(), {
                  successMessage: t('translations.refreshed'),
                  errorMessage: t('translations.refresh_failed')
                })}
                disabled={unifiedLoading.hasAnyLoading} 
                variant="outline"
              >
                {t('common.refresh', 'Refresh')}
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            {t('translations.bilingual_desc', 'Manage bilingual translations (English and Arabic in single records)')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder={t('translations.search_placeholder', 'Search translations...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t('common.category', 'Category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all_categories', 'All Categories')}</SelectItem>
                {CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingTranslation(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('translations.add', 'Add Translation')}
                </Button>
              </DialogTrigger>
              <TranslationDialog 
                translation={editingTranslation}
                onSave={saveTranslation}
                onClose={() => setIsDialogOpen(false)}
              />
            </Dialog>
          </div>

          <div className="space-y-2">
            {filteredTranslations.map((translation) => (
              <div key={translation.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {translation.translation_key}
                    </code>
                    <Badge variant="secondary">{translation.category}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingTranslation(translation);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteTranslation(translation.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">EN:</span> {translation.text_en}
                  </div>
                  <div dir="rtl">
                    <span className="font-medium">AR:</span> {translation.text_ar}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTranslations.length === 0 && !unifiedLoading.hasAnyLoading && (
            <div className="text-center py-8 text-muted-foreground">
              {t('translations.no_translations_found', 'No translations found')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface TranslationDialogProps {
  translation: SystemTranslation | null;
  onSave: (data: Partial<SystemTranslation>) => void;
  onClose: () => void;
}

const TranslationDialog: React.FC<TranslationDialogProps> = ({ 
  translation, 
  onSave, 
  onClose 
}) => {
  const { t } = useUnifiedTranslation();
  const [formData, setFormData] = useState({
    translation_key: '',
    text_en: '',
    text_ar: '',
    category: 'general'
  });

  useEffect(() => {
    if (translation) {
      setFormData({
        translation_key: translation.translation_key,
        text_en: translation.text_en,
        text_ar: translation.text_ar,
        category: translation.category
      });
    } else {
      setFormData({
        translation_key: '',
        text_en: '',
        text_ar: '',
        category: 'general'
      });
    }
  }, [translation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          {translation ? t('translations.edit', 'Edit Translation') : t('translations.add', 'Add Translation')}
        </DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="translation_key">{t('translations.key', 'Translation Key')}</Label>
          <Input
            id="translation_key"
            value={formData.translation_key}
            onChange={(e) => setFormData(prev => ({ ...prev, translation_key: e.target.value }))}
            placeholder={t('translations.key_placeholder', 'e.g., settings.ui.theme')}
            required
          />
        </div>

        <div>
          <Label htmlFor="category">{t('common.category', 'Category')}</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="text_en">{t('translations.english_text', 'English Text')}</Label>
            <Textarea
              id="text_en"
              value={formData.text_en}
              onChange={(e) => setFormData(prev => ({ ...prev, text_en: e.target.value }))}
              placeholder={t('translations.english_placeholder', 'Enter English text')}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="text_ar">{t('translations.arabic_text', 'Arabic Text')}</Label>
            <Textarea
              id="text_ar"
              value={formData.text_ar}
              onChange={(e) => setFormData(prev => ({ ...prev, text_ar: e.target.value }))}
              placeholder={t('translations.arabic_placeholder', 'أدخل النص العربي')}
              dir="rtl"
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button type="submit">
            {translation ? t('common.update', 'Update') : t('common.create', 'Create')}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};