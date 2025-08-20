import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useTimerManager } from '@/utils/timerManager';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Bookmark, 
  Heart, 
  Star, 
  Folder, 
  FolderPlus, 
  Plus, 
  Filter,
  Play,
  ArrowRight,
  Sparkles,
  Archive,
  Tag
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { cn } from '@/lib/utils';

interface EnhancedSavedHeroProps {
  totalBookmarks: number;
  totalCollections: number;
  totalTags: number;
  recentActivity: number;
  onCreateCollection: () => void;
  onShowFilters: () => void;
}

export const EnhancedSavedHero = ({ 
  totalBookmarks, 
  totalCollections, 
  totalTags,
  recentActivity,
  onCreateCollection,
  onShowFilters
}: EnhancedSavedHeroProps) => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { icon: Bookmark, value: totalBookmarks, label: t('saved:hero.stats.bookmarks'), color: 'text-blue-400' },
    { icon: Folder, value: totalCollections, label: t('saved:hero.stats.collections'), color: 'text-green-400' },
    { icon: Tag, value: totalTags, label: t('saved:hero.stats.tags'), color: 'text-purple-400' },
    { icon: Star, value: recentActivity, label: t('saved:hero.stats.recent_activity'), color: 'text-yellow-400' }
  ];

  const { setInterval: scheduleInterval } = useTimerManager();

  useEffect(() => {
    const clearTimer = scheduleInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return clearTimer;
  }, [stats.length, scheduleInterval]);

  return (
    <div className="relative overflow-hidden">
      {/* Background with animated gradients */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(99deg, rgba(59, 20, 93, 1) 51%, rgba(23, 8, 38, 1) 99%)' }}>
        <div className="absolute inset-0 bg-[url('/ideas-images-public/saved/bookmarks-hero.jpg')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-20 left-1/3 w-64 h-64 bg-purple-400/5 rounded-full blur-2xl animate-bounce" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Enhanced Content Section */}
          <div className="space-y-8">
            {/* Header with animation */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </div>
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                  <Star className="w-3 h-3 mr-1" />
                  {t('saved:hero.badge')}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {isRTL ? (
                    <>
                      {t('saved:hero.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">{t('saved:hero.title_highlight')}</span> {t('saved:hero.title_suffix')}
                    </>
                  ) : (
                    <>
                      {t('saved:hero.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">{t('saved:hero.title_highlight')}</span> {t('saved:hero.title_suffix')}
                    </>
                  )}
                </h1>
                
                <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
                  {t('saved:hero.subtitle')}
                </p>
              </div>
            </div>

            {/* Animated Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                const isActive = currentStat === index;
                
                return (
                  <Card 
                    key={index}
                    className={cn(
                      "bg-white/5 backdrop-blur-sm border-white/10 transition-all duration-500",
                      isActive && "bg-white/10 border-white/20 scale-105"
                    )}
                  >
                    <CardContent className="p-4 text-center">
                      <Icon className={cn("w-6 h-6 mx-auto mb-2 transition-colors", stat.color)} />
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-white/70">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={onCreateCollection}
                size="lg"
                className="bg-gradient-primary text-white hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <FolderPlus className="w-5 h-5 mr-2" />
                {t('saved:hero.buttons.create_collection')}
              </Button>
              
              <Button
                onClick={onShowFilters}
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                <Filter className="w-5 h-5 mr-2" />
                {t('saved:hero.buttons.advanced_filters')}
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10"
              >
                <Play className="w-5 h-5 mr-2" />
                {t('saved:hero.buttons.take_tour')}
              </Button>
            </div>
          </div>

          {/* Enhanced Collections Preview */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardContent className="p-0">
                {/* Collections Grid */}
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img 
                    src="/ideas-images-public/saved/collections-grid.jpg" 
                    alt="Collections Grid"
                    className="w-full h-full object-cover"
                  />
                  
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-blue-500/90 text-white border-0 animate-pulse">
                      <Archive className="w-3 h-3 mr-1" />
                      {t('saved:hero.badges.organized')}
                    </Badge>
                  </div>

                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500/90 text-white border-0">
                      <Heart className="w-3 h-3 mr-1" />
                      {t('saved:hero.badges.favorites')}
                    </Badge>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-white">
                    {t('saved:hero.collections_card.title')}
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-300">
                        {totalCollections}
                      </div>
                      <div className="text-sm text-white/70">{t('saved:hero.collections_card.collections_label')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-300">
                        {Math.round((totalBookmarks / Math.max(totalCollections, 1)))}
                      </div>
                      <div className="text-sm text-white/70">{t('saved:hero.collections_card.items_per_collection')}</div>
                    </div>
                  </div>

                  <Progress 
                    value={(totalBookmarks / 100) * 100} 
                    className="h-2 bg-white/20"
                  />

                  <Button 
                    className="w-full bg-gradient-primary hover:opacity-90 text-white"
                  >
                    {t('saved:hero.collections_card.browse_collections')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Bookmark className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-white">
                    {t('saved:hero.quick_actions.recent_saves')}
                  </div>
                  <div className="text-xs text-white/70">
                    {recentActivity} {t('saved:hero.quick_actions.items')}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Tag className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-white">
                    {t('saved:hero.quick_actions.active_tags')}
                  </div>
                  <div className="text-xs text-white/70">
                    {totalTags} {t('saved:hero.quick_actions.tags')}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
