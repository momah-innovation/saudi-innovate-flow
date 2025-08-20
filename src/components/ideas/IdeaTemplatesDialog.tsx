import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useDirection } from '@/components/ui/direction-provider';
import { supabase } from '@/integrations/supabase/client';
import { IdeaTemplateStructure } from '@/types/common';
import { logger } from '@/utils/logger';
import { 
  Palette, FileText, Zap, Users, Lightbulb, TreePine, 
  Cpu, Building, Recycle, Heart, ArrowRight, CheckCircle 
} from 'lucide-react';

interface IdeaTemplate {
  id: string;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  category: string;
  template_data: IdeaTemplateStructure;
}

interface IdeaTemplatesDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: IdeaTemplate) => void;
}

export function IdeaTemplatesDialog({ 
  isOpen, 
  onOpenChange, 
  onSelectTemplate 
}: IdeaTemplatesDialogProps) {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<IdeaTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('idea_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setTemplates((data || []).map(item => ({
        ...item,
        template_data: item.template_data as any || { sections: [], fields: [], guidelines: [], estimated_time: 0, difficulty_level: 'beginner' as const }
      })));
    } catch (error) {
      logger.error('Failed to load idea templates', {
        component: 'IdeaTemplatesDialog', 
        action: 'loadTemplates' 
      }, error as Error);
      toast({
        title: t('ideas:templates.error_loading'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technology': return <Cpu className="w-5 h-5" />;
      case 'process': return <Zap className="w-5 h-5" />;
      case 'digital': return <FileText className="w-5 h-5" />;
      case 'sustainability': return <TreePine className="w-5 h-5" />;
      case 'customer': return <Heart className="w-5 h-5" />;
      case 'business': return <Building className="w-5 h-5" />;
      default: return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technology': return 'badge-info';
      case 'process': return 'badge-success';
      case 'digital': return 'badge-innovation';
      case 'sustainability': return 'badge-success';
      case 'customer': return 'badge-partner';
      case 'business': return 'badge-warning';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const getCategoryName = (category: string) => {
    const categoryMap = {
      technology: t('ideas:templates.categories.technology'),
      process: t('ideas:templates.categories.process'),
      digital: t('ideas:templates.categories.digital'),
      sustainability: t('ideas:templates.categories.sustainability'),
      customer: t('ideas:templates.categories.customer'),
      business: t('ideas:templates.categories.business'),
      general: t('ideas:templates.categories.general')
    };
    return categoryMap[category as keyof typeof categoryMap] || category;
  };

  const categories = [...new Set(templates.map(t => t.category))];
  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleSelectTemplate = (template: IdeaTemplate) => {
    onSelectTemplate(template);
    onOpenChange(false);
    toast({
      title: t('ideas:templates.template_selected'),
      description: t('ideas:templates.template_selected_description', { 
        name: isRTL ? template.name_ar : template.name 
      })
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Palette className="w-6 h-6" />
            {t('ideas:templates.title')}
          </DialogTitle>
          <p className="text-muted-foreground">
            {t('ideas:templates.description')}
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 p-2 bg-muted/30 rounded-lg">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
              className="gap-2"
            >
              <Lightbulb className="w-4 h-4" />
              {t('ideas:templates.all_templates')}
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="gap-2"
              >
                {getCategoryIcon(category)}
                {getCategoryName(category)}
              </Button>
            ))}
          </div>

          {/* Templates Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-2 hover:border-primary/20"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                          {isRTL ? template.name_ar : template.name}
                        </CardTitle>
                        <Badge className={getCategoryColor(template.category)} variant="secondary">
                          {getCategoryIcon(template.category)}
                          <span className="ml-1">{getCategoryName(template.category)}</span>
                        </Badge>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-sm leading-relaxed">
                      {isRTL ? template.description_ar : template.description}
                    </CardDescription>
                    
                    {/* Template Sections Preview */}
                    {template.template_data?.sections && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          {t('ideas:templates.included_sections')}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {template.template_data.sections.slice(0, 3).map((section: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {section.replace('_', ' ')}
                            </Badge>
                          ))}
                          {template.template_data.sections.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.template_data.sections.length - 3} {t('ideas:templates.more')}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t">
                      <Button 
                        size="sm" 
                        className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        variant="outline"
                      >
                        <Palette className="w-4 h-4" />
                        {t('ideas:templates.use_template')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Palette className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                {t('ideas:templates.no_templates')}
              </h3>
              <p className="text-sm">
                {t('ideas:templates.no_templates_description')}
              </p>
            </div>
          )}
        </div>

        <div className="pt-4 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('ideas:templates.cancel')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
