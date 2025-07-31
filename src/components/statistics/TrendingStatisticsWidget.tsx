import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Users, 
  Calendar,
  Target,
  Activity,
  Eye,
  ArrowRight
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

interface TrendingStat {
  id: string;
  title: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  category: 'ideas' | 'challenges' | 'events' | 'users';
  description: string;
  progress?: number;
}

interface TrendingStatisticsWidgetProps {
  className?: string;
  onViewAll?: () => void;
}

export const TrendingStatisticsWidget = ({ className, onViewAll }: TrendingStatisticsWidgetProps) => {
  const { isRTL } = useDirection();
  const [trendingStats, setTrendingStats] = useState<TrendingStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrendingStats();
  }, []);

  const loadTrendingStats = async () => {
    try {
      setLoading(true);
      
      // Simulate API call - in real app this would fetch from backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTrendingStats: TrendingStat[] = [
        {
          id: '1',
          title: isRTL ? 'مشاركة المستخدمين' : 'User Engagement',
          value: 87.5,
          change: 12.3,
          trend: 'up',
          category: 'users',
          description: isRTL ? 'زيادة في نشاط المستخدمين هذا الشهر' : 'Increased user activity this month',
          progress: 87.5
        },
        {
          id: '2',
          title: isRTL ? 'الأفكار المقترحة' : 'Submitted Ideas',
          value: 156,
          change: 23.8,
          trend: 'up',
          category: 'ideas',
          description: isRTL ? 'أفكار جديدة مبدعة هذا الأسبوع' : 'New innovative ideas this week'
        },
        {
          id: '3',
          title: isRTL ? 'التحديات النشطة' : 'Active Challenges',
          value: 24,
          change: -5.2,
          trend: 'down',
          category: 'challenges',
          description: isRTL ? 'انخفاض طفيف في عدد التحديات' : 'Slight decrease in challenge count'
        },
        {
          id: '4',
          title: isRTL ? 'حضور الفعاليات' : 'Event Attendance',
          value: 92.1,
          change: 18.7,
          trend: 'up',
          category: 'events',
          description: isRTL ? 'معدل حضور ممتاز للفعاليات' : 'Excellent event attendance rate',
          progress: 92.1
        },
        {
          id: '5',
          title: isRTL ? 'معدل التقييم' : 'Evaluation Rate',
          value: 78.3,
          change: 8.9,
          trend: 'up',
          category: 'challenges',
          description: isRTL ? 'تحسن في سرعة التقييمات' : 'Improved evaluation speed',
          progress: 78.3
        }
      ];

      setTrendingStats(mockTrendingStats);
    } catch (error) {
      console.error('Error loading trending statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: TrendingStat['category']) => {
    switch (category) {
      case 'ideas':
        return <Target className="w-4 h-4" />;
      case 'challenges':
        return <BarChart3 className="w-4 h-4" />;
      case 'events':
        return <Calendar className="w-4 h-4" />;
      case 'users':
        return <Users className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: TrendingStat['category']) => {
    switch (category) {
      case 'ideas':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'challenges':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'events':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'users':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getTrendIcon = (trend: TrendingStat['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      default:
        return <Activity className="w-3 h-3 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: TrendingStat['trend']) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'down':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {isRTL ? 'الإحصائيات الرائجة' : 'Trending Statistics'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="w-16 h-6" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {isRTL ? 'الإحصائيات الرائجة' : 'Trending Statistics'}
          </CardTitle>
          {onViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll}>
              <Eye className="w-4 h-4 mr-1" />
              {isRTL ? 'عرض الكل' : 'View All'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {trendingStats.slice(0, 4).map((stat) => (
            <div
              key={stat.id}
              className="flex items-center gap-3 p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                getCategoryColor(stat.category)
              )}>
                {getCategoryIcon(stat.category)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm truncate">{stat.title}</h4>
                  <Badge variant="outline" className={cn("text-xs", getTrendColor(stat.trend))}>
                    {getTrendIcon(stat.trend)}
                    <span className="ml-1">
                      {stat.change > 0 ? '+' : ''}{stat.change.toFixed(1)}%
                    </span>
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground truncate">
                  {stat.description}
                </p>
                
                {stat.progress && (
                  <div className="mt-2">
                    <Progress value={stat.progress} className="h-1" />
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <div className="font-bold text-lg">
                  {typeof stat.value === 'number' && stat.value % 1 !== 0 
                    ? stat.value.toFixed(1) 
                    : stat.value}
                  {stat.progress && '%'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {isRTL ? 'هذا الشهر' : 'This month'}
                </div>
              </div>
            </div>
          ))}
          
          {trendingStats.length > 4 && onViewAll && (
            <Button 
              variant="outline" 
              className="w-full mt-4" 
              onClick={onViewAll}
            >
              {isRTL ? `عرض ${trendingStats.length - 4} إحصائية أخرى` : `View ${trendingStats.length - 4} more statistics`}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          
          {trendingStats.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{isRTL ? 'لا توجد إحصائيات رائجة حالياً' : 'No trending statistics available'}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};