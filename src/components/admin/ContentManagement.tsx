import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Plus, Edit, Trash2, Eye, Calendar, Tag } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { AdminBreadcrumb } from '@/components/layout/AdminBreadcrumb';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useContentData } from '@/hooks/useContentData';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

interface ContentItem {
  id: string;
  title: string;
  type: 'article' | 'page' | 'post' | 'resource';
  status: 'draft' | 'published' | 'archived';
  author_id: string;
  author_name: string;
  created_at: string;
  updated_at: string;
  views: number;
  content_length: number;
  tags: string[];
}

export function ContentManagement() {
  const { t } = useUnifiedTranslation();
  const [activeTab, setActiveTab] = useState('content');
  
  // ✅ MIGRATED: Using centralized hooks
  const {
    content,
    categories,
    loading,
    refreshContent,
    createContent,
    updateContent,
    deleteContent,
    publishContent
  } = useContentData();
  
  const loadingManager = useUnifiedLoading({
    component: 'ContentManagement',
    showToast: true,
    logErrors: true
  });

  useEffect(() => {
    refreshContent();
  }, [refreshContent]);

  const contentColumns: Column<ContentItem>[] = [
    {
      key: 'title',
      title: t('content.title'),
    },
    {
      key: 'type',
      title: t('content.type'),
      render: (value: string) => (
        <Badge variant="outline">
          {value}
        </Badge>
      ),
    },
    {
      key: 'status',
      title: t('content.status'),
      render: (value: string) => (
        <Badge variant={
          value === 'published' ? 'default' : 
          value === 'draft' ? 'secondary' : 'destructive'
        }>
          {value}
        </Badge>
      ),
    },
    {
      key: 'author_name',
      title: t('content.author'),
    },
    {
      key: 'views',
      title: t('content.views'),
      render: (value: number) => value.toLocaleString(),
    },
    {
      key: 'updated_at',
      title: t('content.updated_at'),
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'id' as keyof ContentItem,
      title: t('common.actions'),
      render: (_, item: ContentItem) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Edit className="w-4 h-4" />
          </Button>
          {item.status === 'draft' && (
            <Button 
              size="sm" 
              variant="default"
              onClick={() => publishContent(item.id)}
            >
              {t('content.publish')}
            </Button>
          )}
          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => deleteContent(item.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const ContentList = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('content.all_content')}</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          {t('content.create_content')}
        </Button>
      </div>
      
      <DataTable
        columns={contentColumns}
        data={content || []}
        loading={loading}
        searchable={true}
      />
    </div>
  );

  const CategoriesTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('content.categories')}</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          {t('content.create_category')}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {category.name}
                <Badge>{category.item_count}</Badge>
              </CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const AnalyticsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {t('content.content_analytics')}
          </CardTitle>
          <CardDescription>{t('content.analytics_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{content.length}</div>
              <div className="text-sm text-muted-foreground">{t('content.total_items')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {content.filter(item => item.status === 'published').length}
              </div>
              <div className="text-sm text-muted-foreground">{t('content.published')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {content.filter(item => item.status === 'draft').length}
              </div>
              <div className="text-sm text-muted-foreground">{t('content.drafts')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {content.reduce((sum, item) => sum + item.views, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">{t('content.total_views')}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {t('content.recent_activity')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {content.slice(0, 5).map((item) => (
                <div key={item.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('content.by')} {item.author_name}
                    </p>
                  </div>
                  <Badge variant={
                    item.status === 'published' ? 'default' : 
                    item.status === 'draft' ? 'secondary' : 'destructive'
                  }>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              {t('content.popular_tags')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {['innovation', 'best-practices', 'guide', 'onboarding', 'updates', 'changelog'].map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminBreadcrumb />
      <PageLayout
        title={t('content_management.title')}
        description={t('content_management.description')}
        className="space-y-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {t('content_management.content_tab')}
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              {t('content_management.categories_tab')}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {t('content_management.analytics_tab')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <ContentList />
          </TabsContent>

          <TabsContent value="categories">
            <CategoriesTab />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>
        </Tabs>
      </PageLayout>
    </div>
  );
}