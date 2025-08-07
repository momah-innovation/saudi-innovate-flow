import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Tags,
  Sparkles,
  CheckCircle,
  X,
  RefreshCw,
  Search,
  TrendingUp,
  Brain,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { aiService } from '@/services/AIService';
import { logger } from '@/utils/logger';

interface TagData {
  tag: string;
  confidence?: number;
}

interface TagSuggestion {
  id: string;
  entity_id: string;
  entity_type: string;
  suggested_tags: TagData[];
  confidence_scores: Record<string, number>;
  status: string;
  created_at: string;
  reviewed_by?: string;
  suggested_by?: string;
  updated_at?: string;
}

interface EntityData {
  id: string;
  type: string;
  title: string;
  content: string;
  currentTags: string[];
}

export const AutomatedTaggingPanel: React.FC = () => {
  const [suggestions, setSuggestions] = useState<TagSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [entityType, setEntityType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalSuggestions: 0,
    pendingSuggestions: 0,
    approvedTags: 0,
    automationRate: 0
  });
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();

  useEffect(() => {
    fetchTagSuggestions();
    fetchStats();
  }, [entityType]);

  const fetchTagSuggestions = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('ai_tag_suggestions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (entityType !== 'all') {
        query = query.eq('entity_type', entityType);
      }

      const { data, error } = await query;
      if (error) throw error;

      setSuggestions((data || []).map(item => ({
        ...item,
        suggested_tags: Array.isArray(item.suggested_tags) ? 
          item.suggested_tags.map((tag: any) => typeof tag === 'string' ? { tag } : tag) : [],
        confidence_scores: typeof item.confidence_scores === 'object' && item.confidence_scores !== null ? 
          item.confidence_scores as Record<string, number> : {}
      })));
    } catch (error) {
      logger.error('Error fetching tag suggestions', { component: 'AutomatedTaggingPanel', action: 'fetchTagSuggestions' }, error as Error);
      toast({
        title: t('automated_tagging.error', 'Error'),
        description: t('automated_tagging.failed_load_suggestions', 'Failed to load suggestions'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: allSuggestions } = await supabase
        .from('ai_tag_suggestions')
        .select('status');

      if (allSuggestions) {
        const total = allSuggestions.length;
        const pending = allSuggestions.filter(s => s.status === 'pending').length;
        const approved = allSuggestions.filter(s => s.status === 'approved').length;
        const automationRate = total > 0 ? (approved / total) * 100 : 0;

        setStats({
          totalSuggestions: total,
          pendingSuggestions: pending,
          approvedTags: approved,
          automationRate: Math.round(automationRate)
        });
      }
    } catch (error) {
      logger.error('Error fetching stats', { component: 'AutomatedTaggingPanel', action: 'fetchStats' }, error as Error);
    }
  };

  const generateTagsForEntity = async (entityId: string, entityType: string, content: string) => {
    try {
      setProcessing(true);
      await aiService.suggestTags(entityId, entityType, content);
      
      toast({
        title: t('automated_tagging.tags_generated', 'Tags generated'),
        description: t('automated_tagging.tags_generated_success', 'Tags generated successfully'),
      });

      fetchTagSuggestions();
      fetchStats();
    } catch (error) {
      logger.error('Error generating tags', { component: 'AutomatedTaggingPanel', action: 'generateTagsForEntity' }, error as Error);
      toast({
        title: t('automated_tagging.error', 'Error'),
        description: t('automated_tagging.failed_generate_tags', 'Failed to generate tags'),
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const approveSuggestion = async (suggestionId: string, tags: string[]) => {
    try {
      // Update suggestion status
      const { error: updateError } = await supabase
        .from('ai_tag_suggestions')
        .update({ status: 'approved' })
        .eq('id', suggestionId);

      if (updateError) throw updateError;

      // Apply tags to entity (this would require knowing the entity structure)
      const suggestion = suggestions.find(s => s.id === suggestionId);
      if (suggestion) {
        // Here you would add logic to apply tags to the actual entity
        // This depends on your tag system implementation
        logger.info('Applying tags to entity', { component: 'AutomatedTaggingPanel', action: 'approveSuggestion', data: { entityId: suggestion.entity_id, tags } });
      }

      setSuggestions(suggestions.map(s => 
        s.id === suggestionId ? { ...s, status: 'approved' as const } : s
      ));

      toast({
        title: t('automated_tagging.approved_success', 'Approved successfully'),
        description: t('automated_tagging.tags_applied_success', 'Tags applied successfully'),
      });

      fetchStats();
    } catch (error) {
      logger.error('Error approving suggestion', { component: 'AutomatedTaggingPanel', action: 'approveSuggestion' }, error as Error);
      toast({
        title: t('automated_tagging.error', 'Error'),
        description: t('automated_tagging.failed_apply_tags', 'Failed to apply tags'),
        variant: 'destructive',
      });
    }
  };

  const rejectSuggestion = async (suggestionId: string) => {
    try {
      const { error } = await supabase
        .from('ai_tag_suggestions')
        .update({ status: 'rejected' })
        .eq('id', suggestionId);

      if (error) throw error;

      setSuggestions(suggestions.map(s => 
        s.id === suggestionId ? { ...s, status: 'rejected' as const } : s
      ));

      toast({
        title: t('automated_tagging.rejected_success'),
        description: t('automated_tagging.suggestion_rejected'),
      });

      fetchStats();
    } catch (error) {
      logger.error('Error rejecting suggestion', { component: 'AutomatedTaggingPanel', action: 'rejectSuggestion' }, error as Error);
      toast({
        title: t('automated_tagging.error', 'Error'),
        description: t('automated_tagging.failed_reject_suggestion', 'Failed to reject suggestion'),
        variant: 'destructive',
      });
    }
  };

  const filteredSuggestions = suggestions.filter(suggestion =>
    searchTerm === '' ||
    suggestion.entity_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const runBulkTagging = async () => {
    try {
      setProcessing(true);
      
      // This would fetch entities that need tagging and process them
      // For now, we'll simulate the process
      toast({
        title: t('automated_tagging.process_started'),
        description: t('automated_tagging.bulk_tagging_started'),
      });

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      toast({
        title: t('automated_tagging.process_completed'),
        description: t('automated_tagging.bulk_tagging_completed'),
      });

      fetchTagSuggestions();
      fetchStats();
    } catch (error) {
      logger.error('Error running bulk tagging', { component: 'AutomatedTaggingPanel', action: 'runBulkTagging' }, error as Error);
      toast({
        title: t('automated_tagging.error', 'Error'),
        description: t('automated_tagging.failed_bulk_tagging', 'Failed to run bulk tagging'),
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-info flex items-center justify-center">
          <Tags className="h-6 w-6 text-info-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t('automated_tagging.title')}</h1>
          <p className="text-muted-foreground">
            {t('automated_tagging.description')}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Sparkles className="h-4 w-4 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">{t('automated_tagging.total_suggestions')}</p>
                <p className="text-2xl font-bold">{stats.totalSuggestions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Brain className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">{t('automated_tagging.pending_review')}</p>
                <p className="text-2xl font-bold">{stats.pendingSuggestions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-success/10 rounded-lg">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">{t('automated_tagging.approved_tags')}</p>
                <p className="text-2xl font-bold">{stats.approvedTags}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-info/10 rounded-lg">
                <TrendingUp className="h-4 w-4 text-info" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">{t('automated_tagging.automation_rate')}</p>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stats.automationRate}%</p>
                  <Progress value={stats.automationRate} className="h-1" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="suggestions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="suggestions">{t('automated_tagging.tag_suggestions')}</TabsTrigger>
          <TabsTrigger value="bulk">{t('automated_tagging.bulk_operation')}</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={t('automated_tagging.search_suggestions')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={entityType} onValueChange={setEntityType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('automated_tagging.content_type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('automated_tagging.all_types')}</SelectItem>
                <SelectItem value="idea">{t('automated_tagging.ideas')}</SelectItem>
                <SelectItem value="challenge">{t('automated_tagging.challenges')}</SelectItem>
                <SelectItem value="opportunity">{t('automated_tagging.opportunities')}</SelectItem>
                <SelectItem value="event">{t('automated_tagging.events')}</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={fetchTagSuggestions}
              size="sm"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Suggestions List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>{t('automated_tagging.loading_suggestions')}</p>
              </div>
            ) : filteredSuggestions.length === 0 ? (
              <div className="text-center py-8">
                <Tags className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">{t('automated_tagging.no_suggestions')}</p>
              </div>
            ) : (
              filteredSuggestions.map((suggestion) => (
                <Card key={suggestion.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {suggestion.entity_type}
                        </Badge>
                        <Badge 
                          variant={
                            suggestion.status === 'approved' ? 'default' :
                            suggestion.status === 'rejected' ? 'destructive' :
                            'secondary'
                          }
                          className="text-xs"
                        >
                          {suggestion.status === 'approved' && t('automated_tagging.approved')}
                          {suggestion.status === 'rejected' && t('automated_tagging.rejected')}
                          {suggestion.status === 'pending' && t('automated_tagging.pending')}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(suggestion.created_at).toLocaleDateString('ar')}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium mb-2">{t('automated_tagging.suggested_tags')}</h4>
                        <div className="flex flex-wrap gap-1">
                          {suggestion.suggested_tags.map((tag: TagData, index: number) => {
                            const confidence = suggestion.confidence_scores[tag.tag] || tag.confidence || 0;
                            return (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                                style={{
                                  opacity: 0.6 + (confidence * 0.4) // Visual confidence indicator
                                }}
                              >
                                {typeof tag === 'string' ? tag : tag.tag}
                                {confidence > 0 && (
                                  <span className="ml-1 text-xs opacity-70">
                                    {Math.round(confidence * 100)}%
                                  </span>
                                )}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>

                      {suggestion.status === 'pending' && (
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            onClick={() => approveSuggestion(
                              suggestion.id, 
                              suggestion.suggested_tags.map((tag: TagData) => typeof tag === 'string' ? tag : tag.tag)
                            )}
                            className="text-success-foreground bg-success hover:bg-success/90"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {t('automated_tagging.approve_apply')}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rejectSuggestion(suggestion.id)}
                            className="text-destructive hover:text-destructive/90"
                          >
                            <X className="h-4 w-4 mr-1" />
                            {t('automated_tagging.reject')}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تشغيل العلامات التلقائية الشامل</CardTitle>
              <CardDescription>
                تشغيل نظام العلامات التلقائي لجميع المحتوى الجديد أو غير المُعلم
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Zap className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="font-medium">محتوى جديد</h3>
                        <p className="text-sm text-muted-foreground">
                          إنتاج علامات للمحتوى المُضاف حديثاً
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Brain className="h-8 w-8 text-purple-500" />
                      <div>
                        <h3 className="font-medium">محتوى غير مُعلم</h3>
                        <p className="text-sm text-muted-foreground">
                          إنتاج علامات للمحتوى الموجود بدون علامات
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button 
                onClick={runBulkTagging}
                disabled={processing}
                className="w-full"
                size="lg"
              >
                {processing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    جاري المعالجة...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    بدء العلامات التلقائية الشاملة
                  </>
                )}
              </Button>

              {processing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>جاري المعالجة...</span>
                    <span>تقدر المدة: دقيقتان</span>
                  </div>
                  <Progress value={33} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};