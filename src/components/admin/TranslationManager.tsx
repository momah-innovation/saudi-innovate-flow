import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload, RefreshCw, Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface SystemTranslation {
  id: string;
  translation_key: string;
  language_code: string;
  translation_text: string;
  category: string;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = [
  'ui', 'settings', 'forms', 'errors', 'navigation', 'admin', 'campaign', 
  'challenges', 'events', 'partners', 'tags', 'notifications', 'general'
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' }
];

export const TranslationManager: React.FC = () => {
  const [translations, setTranslations] = useState<SystemTranslation[]>([]);
  const [filteredTranslations, setFilteredTranslations] = useState<SystemTranslation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingTranslation, setEditingTranslation] = useState<SystemTranslation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    loadTranslations();
  }, []);

  useEffect(() => {
    filterTranslations();
  }, [translations, selectedCategory, selectedLanguage, searchTerm]);

  const loadTranslations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_translations')
        .select('*')
        .order('translation_key');

      if (error) throw error;
      setTranslations(data || []);
    } catch (error) {
      console.error('Error loading translations:', error);
      toast({
        title: "Error",
        description: "Failed to load translations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterTranslations = () => {
    let filtered = translations;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(t => t.language_code === selectedLanguage);
    }

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.translation_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.translation_text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTranslations(filtered);
  };

  const generateStaticFiles = async () => {
    setIsGenerating(true);
    try {
      // Call the edge function to generate files
      const response = await fetch(
        `https://jxpbiljkoibvqxzdkgod.supabase.co/functions/v1/generate-translation-files`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cGJpbGprb2lidnF4emRrZ29kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NzEzMDksImV4cCI6MjA2OTA0NzMwOX0.ls7b6Dh5Go0nQYP6Sjv1c_IxPXEv8MC5RQEpH91Z_V8`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate translation files');
      }

      const result = await response.json();
      
      // Download generated files
      for (const language of ['en', 'ar']) {
        const langResponse = await fetch(
          `https://jxpbiljkoibvqxzdkgod.supabase.co/functions/v1/generate-translation-files?language=${language}`,
          {
            headers: {
              'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cGJpbGprb2lidnF4emRrZ29kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NzEzMDksImV4cCI6MjA2OTA0NzMwOX0.ls7b6Dh5Go0nQYP6Sjv1c_IxPXEv8MC5RQEpH91Z_V8`,
            },
          }
        );
        
        if (langResponse.ok) {
          const blob = await langResponse.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `${language}.json`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }
      }

      toast({
        title: "Success",
        description: `Generated translation files for ${result.languages?.length || 0} languages`,
      });
    } catch (error) {
      console.error('Error generating files:', error);
      toast({
        title: "Error",
        description: "Failed to generate translation files",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveTranslation = async (translationData: Partial<SystemTranslation>) => {
    try {
      if (editingTranslation) {
        const { error } = await supabase
          .from('system_translations')
          .update(translationData)
          .eq('id', editingTranslation.id);
        
        if (error) throw error;
        toast({ title: "Success", description: "Translation updated successfully" });
      } else {
        // Ensure required fields are present for insert
        const insertData = {
          translation_key: translationData.translation_key!,
          language_code: translationData.language_code!,
          translation_text: translationData.translation_text!,
          category: translationData.category || 'general'
        };
        
        const { error } = await supabase
          .from('system_translations')
          .insert([insertData]);
        
        if (error) throw error;
        toast({ title: "Success", description: "Translation created successfully" });
      }
      
      await loadTranslations();
      setIsDialogOpen(false);
      setEditingTranslation(null);
    } catch (error) {
      console.error('Error saving translation:', error);
      toast({
        title: "Error",
        description: "Failed to save translation",
        variant: "destructive",
      });
    }
  };

  const deleteTranslation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this translation?')) return;
    
    try {
      const { error } = await supabase
        .from('system_translations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await loadTranslations();
      toast({ title: "Success", description: "Translation deleted successfully" });
    } catch (error) {
      console.error('Error deleting translation:', error);
      toast({
        title: "Error",
        description: "Failed to delete translation",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Translation Management
            <div className="flex gap-2">
              <Button 
                onClick={generateStaticFiles} 
                disabled={isGenerating}
                variant="outline"
              >
                {isGenerating ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Generate Files
              </Button>
              <Button onClick={loadTranslations} disabled={isLoading} variant="outline">
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Manage system translations and generate static files for production
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search translations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {LANGUAGES.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingTranslation(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Translation
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
              <div key={translation.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {translation.translation_key}
                    </code>
                    <Badge variant="outline">{translation.language_code}</Badge>
                    <Badge variant="secondary">{translation.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {translation.translation_text}
                  </p>
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
            ))}
          </div>

          {filteredTranslations.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              No translations found
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
  const [formData, setFormData] = useState({
    translation_key: '',
    language_code: 'en',
    translation_text: '',
    category: 'general'
  });

  useEffect(() => {
    if (translation) {
      setFormData({
        translation_key: translation.translation_key,
        language_code: translation.language_code,
        translation_text: translation.translation_text,
        category: translation.category
      });
    } else {
      setFormData({
        translation_key: '',
        language_code: 'en',
        translation_text: '',
        category: 'general'
      });
    }
  }, [translation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {translation ? 'Edit Translation' : 'Add Translation'}
        </DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="translation_key">Translation Key</Label>
          <Input
            id="translation_key"
            value={formData.translation_key}
            onChange={(e) => setFormData(prev => ({ ...prev, translation_key: e.target.value }))}
            placeholder="e.g., settings.ui.theme"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="language_code">Language</Label>
            <Select 
              value={formData.language_code} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, language_code: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
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
        </div>

        <div>
          <Label htmlFor="translation_text">Translation Text</Label>
          <Textarea
            id="translation_text"
            value={formData.translation_text}
            onChange={(e) => setFormData(prev => ({ ...prev, translation_text: e.target.value }))}
            placeholder="Enter the translation..."
            rows={3}
            required
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {translation ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};