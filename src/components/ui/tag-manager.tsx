import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Tag as TagIcon, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useTags } from '@/hooks/useTags';
import { errorHandler } from '@/utils/error-handler';
import { toast } from 'sonner';

interface TagFormData {
  name_en: string;
  name_ar: string;
  slug: string;
  description_en: string;
  description_ar: string;
  color: string;
  icon: string;
  category: string;
}

const TAG_CATEGORIES = [
  'general',
  'sector',
  'technology', 
  'theme',
  'type',
  'priority',
  'approach',
  'skill',
  'certification'
];

const TAG_COLORS = [
  '#3B82F6', '#10B981', '#8B5CF6', '#059669', '#DC2626',
  '#F59E0B', '#7C3AED', '#EA580C', '#0EA5E9', '#6366F1',
  '#84CC16', '#F97316', '#EC4899', '#EF4444', '#06B6D4'
];

export const TagManager: React.FC = () => {
  const { t, language, getDynamicText } = useUnifiedTranslation();
  const { 
    tags, 
    loading, 
    error, 
    createTag, 
    updateTag, 
    deleteTag, 
    getTagsByCategory,
    searchTags
  } = useTags();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [formData, setFormData] = useState<TagFormData>({
    name_en: '',
    name_ar: '',
    slug: '',
    description_en: '',
    description_ar: '',
    color: TAG_COLORS[0],
    icon: 'tag',
    category: 'general'
  });

  const filteredTags = React.useMemo(() => {
    let result = tags;
    
    if (searchQuery) {
      result = searchTags(searchQuery);
    }
    
    if (selectedCategory !== 'all') {
      result = result.filter(tag => tag.category === selectedCategory);
    }
    
    return result;
  }, [tags, searchQuery, selectedCategory, searchTags]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTag) {
        await updateTag(editingTag, formData);
        toast.success(t('tags.tag_updated'));
      } else {
        await createTag(formData);
        toast.success(t('tags.tag_created'));
      }
      
      setIsCreateModalOpen(false);
      setEditingTag(null);
      resetForm();
    } catch (error) {
      errorHandler.handleError(error, 'TagManager.handleSubmit');
      toast.error(t('error'));
    }
  };

  const handleDelete = async (tagId: string) => {
    if (confirm(t('tags.confirm_delete'))) {
      const success = await deleteTag(tagId);
      if (success) {
        toast.success(t('tags.tag_deleted'));
      }
    }
  };

  const handleEdit = (tag: any) => {
    setFormData({
      name_en: tag.name_en,
      name_ar: tag.name_ar,
      slug: tag.slug,
      description_en: tag.description_en || '',
      description_ar: tag.description_ar || '',
      color: tag.color,
      icon: tag.icon,
      category: tag.category
    });
    setEditingTag(tag.id);
    setIsCreateModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name_en: '',
      name_ar: '',
      slug: '',
      description_en: '',
      description_ar: '',
      color: TAG_COLORS[0],
      icon: 'tag',
      category: 'general'
    });
  };

  const generateSlug = (nameEn: string) => {
    return nameEn
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">{t('loading')}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TagIcon className="h-5 w-5" />
          {t('tags.tag_management')}
        </CardTitle>
        <CardDescription>
          {t('tags.manage_system_tags')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('tags.search_tags')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t('tags.filter_by_category')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('tags.all_categories')}</SelectItem>
              {TAG_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {t(`tags.categories.${category}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingTag(null); }}>
                <Plus className="h-4 w-4 mr-2" />
                {t('tags.create_tag')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingTag ? t('tags.edit_tag') : t('tags.create_tag')}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name_en">{t('tags.name_english')}</Label>
                    <Input
                      id="name_en"
                      value={formData.name_en}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          name_en: value,
                          slug: generateSlug(value)
                        }));
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="name_ar">{t('tags.name_arabic')}</Label>
                    <Input
                      id="name_ar"
                      value={formData.name_ar}
                      onChange={(e) => setFormData(prev => ({ ...prev, name_ar: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="slug">{t('tags.slug')}</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">{t('tags.category')}</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TAG_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {t(`tags.categories.${category}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="color">{t('tags.color')}</Label>
                    <div className="flex gap-2 flex-wrap">
                      {TAG_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-8 h-8 rounded-full border-2 ${
                            formData.color === color ? 'border-foreground' : 'border-muted'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setFormData(prev => ({ ...prev, color }))}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description_en">{t('tags.description_english')}</Label>
                  <Textarea
                    id="description_en"
                    value={formData.description_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="description_ar">{t('tags.description_arabic')}</Label>
                  <Textarea
                    id="description_ar"
                    value={formData.description_ar}
                    onChange={(e) => setFormData(prev => ({ ...prev, description_ar: e.target.value }))}
                    rows={2}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingTag ? t('update') : t('create')}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    {t('cancel')}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tags Grid */}
        {error && (
          <div className="text-destructive text-sm">{error}</div>
        )}

        <div className="grid gap-3">
          {filteredTags.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? t('tags.no_tags_found') : t('tags.no_tags_available')}
            </div>
          ) : (
            filteredTags.map((tag) => (
              <div key={tag.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="secondary" 
                    style={{ backgroundColor: tag.color + '20', color: tag.color }}
                  >
                    {getDynamicText(tag.name_ar, tag.name_en)}
                  </Badge>
                  <div className="text-sm">
                    <div className="font-medium">{tag.slug}</div>
                    <div className="text-muted-foreground">
                      {t(`tags.categories.${tag.category}`)} • {t('tags.used_times', { count: tag.usage_count || 0 })}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(tag)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {!tag.is_system && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(tag.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};