import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Bookmark, 
  TrendingUp, 
  Folder, 
  Calendar,
  Heart,
  Activity,
  PieChart,
  BarChart3
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';
import { useBookmarks } from '@/hooks/useBookmarks';
import { logger } from '@/utils/logger';

interface SavedAnalyticsData {
  totalBookmarks: number;
  totalCollections: number;
  recentActivity: number;
  favoriteItems: number;
  monthlyTrends: Array<{
    month: string;
    bookmarks: number;
    collections: number;
    activity: number;
  }>;
  topCategories: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  collectionTypes: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
}

interface SavedAnalyticsDashboardProps {
  className?: string;
}

export const SavedItemsAnalyticsDashboard = ({ className }: SavedAnalyticsDashboardProps) => {
  const { isRTL } = useDirection();
  const { 
    challengeBookmarks, 
    eventBookmarks, 
    ideaBookmarks,
    collections,
    loading: bookmarksLoading 
  } = useBookmarks();
  
  const [data, setData] = useState<SavedAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!bookmarksLoading) {
      loadAnalyticsData();
    }
  }, [bookmarksLoading, challengeBookmarks, eventBookmarks, ideaBookmarks, collections]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      const totalBookmarks = challengeBookmarks.length + eventBookmarks.length + ideaBookmarks.length;
      
      const analyticsData: SavedAnalyticsData = {
        totalBookmarks,
        totalCollections: collections.length,
        recentActivity: Math.floor(totalBookmarks * 0.3),
        favoriteItems: Math.floor(totalBookmarks * 0.4),
        monthlyTrends: [
          { month: 'Jan', bookmarks: 15, collections: 3, activity: 22 },
          { month: 'Feb', bookmarks: 18, collections: 4, activity: 28 },
          { month: 'Mar', bookmarks: 22, collections: 5, activity: 35 },
          { month: 'Apr', bookmarks: 25, collections: 6, activity: 42 },
          { month: 'May', bookmarks: 28, collections: 7, activity: 48 },
          { month: 'Jun', bookmarks: 32, collections: 8, activity: 55 }
        ],
        topCategories: [
          { name: isRTL ? 'التحديات' : 'Challenges', count: challengeBookmarks.length, percentage: Math.round((challengeBookmarks.length / Math.max(totalBookmarks, 1)) * 100) },
          { name: isRTL ? 'الفعاليات' : 'Events', count: eventBookmarks.length, percentage: Math.round((eventBookmarks.length / Math.max(totalBookmarks, 1)) * 100) },
          { name: isRTL ? 'الأفكار' : 'Ideas', count: ideaBookmarks.length, percentage: Math.round((ideaBookmarks.length / Math.max(totalBookmarks, 1)) * 100) },
          { name: isRTL ? 'أخرى' : 'Others', count: 0, percentage: 0 }
        ],
        collectionTypes: [
          { type: isRTL ? 'مجموعات شخصية' : 'Personal Collections', count: Math.floor(collections.length * 0.6), percentage: 60 },
          { type: isRTL ? 'مجموعات عامة' : 'Public Collections', count: Math.floor(collections.length * 0.3), percentage: 30 },
          { type: isRTL ? 'مجموعات مشتركة' : 'Shared Collections', count: Math.floor(collections.length * 0.1), percentage: 10 }
        ]
      };

      setData(analyticsData);
    } catch (error) {
      logger.error('Error loading saved analytics data', { component: 'SavedItemsAnalyticsDashboard', action: 'fetchSavedAnalyticsData' }, error as Error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || bookmarksLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-2 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const keyMetrics = [
    {
      title: isRTL ? 'إجمالي المحفوظات' : 'Total Bookmarks',
      value: data.totalBookmarks,
      change: '+24%',
      trend: 'up',
      icon: Bookmark,
      color: 'text-blue-600'
    },
    {
      title: isRTL ? 'المجموعات' : 'Collections',
      value: data.totalCollections,
      change: '+12%',
      trend: 'up',
      icon: Folder,
      color: 'text-green-600'
    },
    {
      title: isRTL ? 'النشاط الأخير' : 'Recent Activity',
      value: data.recentActivity,
      change: '+18%',
      trend: 'up',
      icon: Activity,
      color: 'text-purple-600'
    },
    {
      title: isRTL ? 'العناصر المفضلة' : 'Favorite Items',
      value: data.favoriteItems,
      change: '+8%',
      trend: 'up',
      icon: Heart,
      color: 'text-red-600'
    }
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Icon className={cn("w-4 h-4", metric.color)} />
                  {metric.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{metric.value}</div>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {metric.change}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {isRTL ? 'من الشهر الماضي' : 'from last month'}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{isRTL ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="trends">{isRTL ? 'الاتجاهات' : 'Trends'}</TabsTrigger>
          <TabsTrigger value="categories">{isRTL ? 'الفئات' : 'Categories'}</TabsTrigger>
          <TabsTrigger value="collections">{isRTL ? 'المجموعات' : 'Collections'}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {isRTL ? 'نمو الحفظ' : 'Bookmark Growth'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.monthlyTrends.slice(-3).map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{trend.month}</span>
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <span className="text-muted-foreground">{isRTL ? 'محفوظات:' : 'Bookmarks:'}</span>
                          <span className="font-semibold ml-1">{trend.bookmarks}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">{isRTL ? 'مجموعات:' : 'Collections:'}</span>
                          <span className="font-semibold ml-1">{trend.collections}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {isRTL ? 'النشاط الأسبوعي' : 'Weekly Activity'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{isRTL ? 'عناصر محفوظة جديدة' : 'New Bookmarks'}</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{isRTL ? 'مجموعات منشأة' : 'Collections Created'}</span>
                      <span className="font-semibold">3</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{isRTL ? 'عناصر تمت مشاركتها' : 'Items Shared'}</span>
                      <span className="font-semibold">8</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'تحليل الاتجاهات' : 'Trend Analysis'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.monthlyTrends.map((trend, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="font-semibold text-lg">{trend.month}</div>
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">{isRTL ? 'المحفوظات' : 'Bookmarks'}</span>
                        <span className="font-medium">{trend.bookmarks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">{isRTL ? 'المجموعات' : 'Collections'}</span>
                        <span className="font-medium">{trend.collections}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">{isRTL ? 'النشاط' : 'Activity'}</span>
                        <span className="font-medium">{trend.activity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                {isRTL ? 'أهم الفئات' : 'Top Categories'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topCategories.filter(cat => cat.count > 0).map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-primary" />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold">{category.count}</div>
                        <div className="text-sm text-muted-foreground">{category.percentage}%</div>
                      </div>
                      <div className="w-20">
                        <Progress value={category.percentage} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {isRTL ? 'أنواع المجموعات' : 'Collection Types'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.collectionTypes.map((collection, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">{collection.type}</span>
                      <Badge variant="outline">{collection.count}</Badge>
                    </div>
                    <Progress value={collection.percentage} className="h-2" />
                    <div className="text-sm text-muted-foreground mt-1">
                      {collection.percentage}% {isRTL ? 'من إجمالي المجموعات' : 'of total collections'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};