import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Languages, Edit, Trash2, Plus, Search, Filter, Download, Upload, Zap, FileText, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/hooks/useAppTranslation';
import { useToast } from '@/hooks/use-toast';
import { useRuntimeTranslations } from '@/hooks/useRuntimeTranslations';

interface Translation {
  id: string;
  translation_key: string;
  language_code: string;
  translation_text: string;
  category: string;
}

interface TranslationPair {
  key: string;
  category: string;
  ar: string;
  en: string;
  id_ar?: string;
  id_en?: string;
}

export default function TranslationManagement() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [translationPairs, setTranslationPairs] = useState<TranslationPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddingTranslation, setIsAddingTranslation] = useState(false);
  const [editingTranslation, setEditingTranslation] = useState<TranslationPair | null>(null);
  
  const [newTranslation, setNewTranslation] = useState({
    key: '',
    category: '',
    ar: '',
    en: ''
  });

  const { t, language, isRTL } = useTranslation();
  const { toast } = useToast();
  const { updateTranslation: updateRuntimeTranslation, uploadAllTranslations, isUpdating } = useRuntimeTranslations();

  useEffect(() => {
    fetchTranslations();
  }, []);

  const fetchTranslations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('system_translations')
        .select('*')
        .order('category, translation_key, language_code');

      if (error) throw error;

      setTranslations(data || []);
      
      // Extract unique categories
      const uniqueCategories = [...new Set((data || []).map(t => t.category))];
      setCategories(uniqueCategories);

      // Create translation pairs
      const pairs = createTranslationPairs(data || []);
      setTranslationPairs(pairs);
    } catch (error) {
      console.error('Error fetching translations:', error);
      toast({
        title: t('error'),
        description: language === 'ar' ? "فشل في تحميل الترجمات من قاعدة البيانات" : "Failed to load translations from database",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createTranslationPairs = (translations: Translation[]): TranslationPair[] => {
    const grouped = translations.reduce((acc, translation) => {
      const key = `${translation.category}:${translation.translation_key}`;
      if (!acc[key]) {
        acc[key] = {
          key: translation.translation_key,
          category: translation.category,
          ar: '',
          en: '',
          id_ar: undefined,
          id_en: undefined
        };
      }
      
      if (translation.language_code === 'ar') {
        acc[key].ar = translation.translation_text;
        acc[key].id_ar = translation.id;
      } else if (translation.language_code === 'en') {
        acc[key].en = translation.translation_text;
        acc[key].id_en = translation.id;
      }
      
      return acc;
    }, {} as Record<string, TranslationPair>);

    return Object.values(grouped);
  };

  const filteredPairs = translationPairs.filter(pair => {
    const matchesSearch = searchTerm === '' || 
      pair.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pair.ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pair.en.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || pair.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddTranslation = async () => {
    if (!newTranslation.key || !newTranslation.category || !newTranslation.ar || !newTranslation.en) {
      toast({
        title: "بيانات غير مكتملة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      // Insert both Arabic and English translations
      const { error } = await supabase
        .from('system_translations')
        .insert([
          {
            translation_key: newTranslation.key,
            language_code: 'ar',
            translation_text: newTranslation.ar,
            category: newTranslation.category
          },
          {
            translation_key: newTranslation.key,
            language_code: 'en',
            translation_text: newTranslation.en,
            category: newTranslation.category
          }
        ]);

      if (error) throw error;

      toast({
        title: "تم إضافة الترجمة بنجاح",
        description: "تم إضافة الترجمة الجديدة بنجاح"
      });

      setNewTranslation({ key: '', category: '', ar: '', en: '' });
      setIsAddingTranslation(false);
      fetchTranslations();
    } catch (error) {
      console.error('Error adding translation:', error);
      toast({
        title: "خطأ في إضافة الترجمة",
        description: "فشل في إضافة الترجمة الجديدة",
        variant: "destructive"
      });
    }
  };

  const handleUpdateTranslation = async () => {
    if (!editingTranslation) return;

    try {
      const updates = [];
      
      if (editingTranslation.id_ar) {
        updates.push(
          supabase
            .from('system_translations')
            .update({ translation_text: editingTranslation.ar })
            .eq('id', editingTranslation.id_ar)
        );
      }
      
      if (editingTranslation.id_en) {
        updates.push(
          supabase
            .from('system_translations')
            .update({ translation_text: editingTranslation.en })
            .eq('id', editingTranslation.id_en)
        );
      }

      const results = await Promise.all(updates);
      
      if (results.some(result => result.error)) {
        throw new Error('Failed to update translations');
      }

      toast({
        title: "تم تحديث الترجمة بنجاح",
        description: "تم تحديث الترجمة بنجاح"
      });

      setEditingTranslation(null);
      fetchTranslations();
    } catch (error) {
      console.error('Error updating translation:', error);
      toast({
        title: "خطأ في تحديث الترجمة",
        description: "فشل في تحديث الترجمة",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTranslation = async (pair: TranslationPair) => {
    try {
      const deleteIds = [pair.id_ar, pair.id_en].filter(Boolean);
      
      if (deleteIds.length === 0) return;

      const { error } = await supabase
        .from('system_translations')
        .delete()
        .in('id', deleteIds);

      if (error) throw error;

      toast({
        title: "تم حذف الترجمة بنجاح",
        description: "تم حذف الترجمة بنجاح"
      });

      fetchTranslations();
    } catch (error) {
      console.error('Error deleting translation:', error);
      toast({
        title: "خطأ في حذف الترجمة",
        description: "فشل في حذف الترجمة",
        variant: "destructive"
      });
    }
  };

  const exportTranslations = () => {
    const exportData = translationPairs.map(pair => ({
      key: pair.key,
      category: pair.category,
      arabic: pair.ar,
      english: pair.en
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translations.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Runtime translation functions
  const uploadTranslationsToRuntime = async (language: 'en' | 'ar') => {
    try {
      // Get current translations for the language
      const languageTranslations = translations.filter(t => t.language_code === language);
      
      // Convert to nested object structure
      const translationObject: Record<string, any> = {};
      languageTranslations.forEach(translation => {
        const keyParts = translation.translation_key.split('.');
        let current = translationObject;
        
        for (let i = 0; i < keyParts.length - 1; i++) {
          const part = keyParts[i];
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part];
        }
        
        current[keyParts[keyParts.length - 1]] = translation.translation_text;
      });

      const success = await uploadAllTranslations(language, translationObject);
      if (success) {
        toast({
          title: "Runtime Upload Success",
          description: `Uploaded ${languageTranslations.length} translations to runtime for ${language}`,
        });
      }
    } catch (error) {
      console.error('Error uploading to runtime:', error);
      toast({
        title: "Runtime Upload Error",
        description: "Failed to upload translations to runtime",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">جارٍ تحميل الترجمات...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Languages className="w-6 h-6" />
          <h1 className="text-2xl font-bold">{t('translationManagement')}</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportTranslations} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            تصدير الترجمات
          </Button>
          <Button onClick={() => setIsAddingTranslation(true)}>
            <Plus className="w-4 h-4 mr-2" />
            إضافة ترجمة
          </Button>
        </div>
      </div>

      {/* Runtime Translation Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            Runtime Translation Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button 
              onClick={() => uploadTranslationsToRuntime('en')} 
              disabled={isUpdating}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isUpdating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              Update English Runtime
            </Button>
            <Button 
              onClick={() => uploadTranslationsToRuntime('ar')} 
              disabled={isUpdating}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isUpdating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              Update Arabic Runtime
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Click to update JSON translation files in real-time using Edge Functions
          </p>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{translationPairs.length}</div>
            <p className="text-xs text-muted-foreground">إجمالي مفاتيح الترجمة</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">فئات الترجمة</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {translationPairs.filter(p => p.ar && p.en).length}
            </div>
            <p className="text-xs text-muted-foreground">ترجمات مكتملة</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {translationPairs.filter(p => !p.ar || !p.en).length}
            </div>
            <p className="text-xs text-muted-foreground">ترجمات ناقصة</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في الترجمات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="فلترة حسب الفئة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الفئات</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Translations Table */}
      <Card>
        <CardHeader>
          <CardTitle>الترجمات ({filteredPairs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPairs.map((pair, index) => (
              <div key={`${pair.category}:${pair.key}`} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{pair.category}</Badge>
                    <code className="text-sm bg-muted px-2 py-1 rounded">{pair.key}</code>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingTranslation(pair)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                          <AlertDialogDescription>
                            هل أنت متأكد من حذف هذه الترجمة؟ لا يمكن التراجع عن هذا الإجراء.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteTranslation(pair)}>
                            حذف
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">العربية</Label>
                    <div className="mt-1 p-2 bg-muted rounded text-sm">
                      {pair.ar || <span className="text-red-500">غير متوفر</span>}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">English</Label>
                    <div className="mt-1 p-2 bg-muted rounded text-sm">
                      {pair.en || <span className="text-red-500">Missing</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Translation Dialog */}
      {isAddingTranslation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>إضافة ترجمة جديدة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="key">مفتاح الترجمة</Label>
                  <Input
                    id="key"
                    value={newTranslation.key}
                    onChange={(e) => setNewTranslation(prev => ({ ...prev, key: e.target.value }))}
                    placeholder="settings.new_setting"
                  />
                </div>
                <div>
                  <Label htmlFor="category">الفئة</Label>
                  <Select
                    value={newTranslation.category}
                    onValueChange={(value) => setNewTranslation(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="ar">النص العربي</Label>
                <Textarea
                  id="ar"
                  value={newTranslation.ar}
                  onChange={(e) => setNewTranslation(prev => ({ ...prev, ar: e.target.value }))}
                  placeholder="النص باللغة العربية"
                />
              </div>
              <div>
                <Label htmlFor="en">النص الإنجليزي</Label>
                <Textarea
                  id="en"
                  value={newTranslation.en}
                  onChange={(e) => setNewTranslation(prev => ({ ...prev, en: e.target.value }))}
                  placeholder="Text in English"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsAddingTranslation(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleAddTranslation}>
                  إضافة الترجمة
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Translation Dialog */}
      {editingTranslation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>تحرير الترجمة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>مفتاح الترجمة</Label>
                <code className="block text-sm bg-muted p-2 rounded">{editingTranslation.key}</code>
              </div>
              <div>
                <Label>الفئة</Label>
                <Badge variant="secondary">{editingTranslation.category}</Badge>
              </div>
              <div>
                <Label htmlFor="edit-ar">النص العربي</Label>
                <Textarea
                  id="edit-ar"
                  value={editingTranslation.ar}
                  onChange={(e) => setEditingTranslation(prev => prev ? { ...prev, ar: e.target.value } : null)}
                />
              </div>
              <div>
                <Label htmlFor="edit-en">النص الإنجليزي</Label>
                <Textarea
                  id="edit-en"
                  value={editingTranslation.en}
                  onChange={(e) => setEditingTranslation(prev => prev ? { ...prev, en: e.target.value } : null)}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingTranslation(null)}>
                  إلغاء
                </Button>
                <Button onClick={handleUpdateTranslation}>
                  حفظ التغييرات
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}