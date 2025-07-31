import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Users, 
  Clock, 
  TrendingUp, 
  Award, 
  Zap, 
  Plus, 
  Filter,
  Play,
  Star,
  ArrowRight,
  Sparkles,
  MapPin
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

interface EnhancedEventsHeroProps {
  totalEvents: number;
  upcomingEvents: number;
  todayEvents: number;
  onCreateEvent: () => void;
  onShowFilters: () => void;
  canCreateEvent?: boolean;
  featuredEvent?: {
    id: string;
    title_ar: string;
    participants: number;
    date: string;
    image?: string;
  };
}

export const EnhancedEventsHero = ({ 
  totalEvents, 
  upcomingEvents, 
  todayEvents,
  onCreateEvent,
  onShowFilters,
  canCreateEvent = false,
  featuredEvent
}: EnhancedEventsHeroProps) => {
  const { isRTL } = useDirection();
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { icon: Calendar, value: totalEvents, label: isRTL ? 'فعالية' : 'events', color: 'text-blue-400' },
    { icon: Clock, value: upcomingEvents, label: isRTL ? 'قادمة' : 'upcoming', color: 'text-green-400' },
    { icon: TrendingUp, value: todayEvents, label: isRTL ? 'اليوم' : 'today', color: 'text-purple-400' },
    { icon: Users, value: `${Math.floor(totalEvents * 45)}+`, label: isRTL ? 'مشارك' : 'participants', color: 'text-yellow-400' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stats.length]);

  return (
    <div className="relative overflow-hidden">
      {/* Background with animated gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 bg-[url('/event-images/innovation.jpg')] opacity-10 bg-cover bg-center" />
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
                  {isRTL ? 'منصة الفعاليات المبتكرة' : 'Innovation Events Platform'}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {isRTL ? (
                    <>
                      استكشف <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">الفعاليات</span> الملهمة
                    </>
                  ) : (
                    <>
                      Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Inspiring</span> Events
                    </>
                  )}
                </h1>
                
                <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
                  {isRTL 
                    ? 'انضم إلى مجتمع المبدعين وشارك في الفعاليات التي تشكل مستقبل المملكة ورؤية 2030'
                    : 'Join the innovators community and participate in events that shape the future of Saudi Arabia and Vision 2030'
                  }
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
              {canCreateEvent && (
                <Button
                  onClick={onCreateEvent}
                  size="lg"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {isRTL ? 'إنشاء فعالية جديدة' : 'Create New Event'}
                </Button>
              )}
              
              <Button
                onClick={onShowFilters}
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                <Filter className="w-5 h-5 mr-2" />
                {isRTL ? 'تصفية متقدمة' : 'Advanced Filters'}
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10"
              >
                <Play className="w-5 h-5 mr-2" />
                {isRTL ? 'شاهد الفيديو' : 'Watch Demo'}
              </Button>
            </div>
          </div>

          {/* Enhanced Featured Event */}
          <div className="space-y-6">
            {featuredEvent ? (
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                <CardContent className="p-0">
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    {featuredEvent.image ? (
                      <img 
                        src={featuredEvent.image} 
                        alt={featuredEvent.title_ar}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-white/60" />
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-500/90 text-white border-0 animate-pulse">
                        <Clock className="w-3 h-3 mr-1" />
                        {isRTL ? 'قريباً' : 'Coming Soon'}
                      </Badge>
                    </div>

                    <div className="absolute top-4 right-4">
                      <Badge className="bg-orange-500/90 text-white border-0">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {isRTL ? 'مميز' : 'Featured'}
                      </Badge>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white">
                      {featuredEvent.title_ar}
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-300">
                          {featuredEvent.participants}
                        </div>
                        <div className="text-sm text-white/70">{isRTL ? 'مشارك' : 'participants'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-300">
                          {new Date(featuredEvent.date).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' })}
                        </div>
                        <div className="text-sm text-white/70">{isRTL ? 'التاريخ' : 'date'}</div>
                      </div>
                    </div>

                    <Progress 
                      value={(featuredEvent.participants / 500) * 100} 
                      className="h-2 bg-white/20"
                    />

                    <Button 
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                    >
                      {isRTL ? 'عرض التفاصيل' : 'View Details'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 border-dashed">
                <CardContent className="p-8 text-center">
                  <Calendar className="w-16 h-16 mx-auto text-white/40 mb-4" />
                  <h3 className="text-lg font-semibold text-white/80 mb-2">
                    {isRTL ? 'لا يوجد فعالية مميزة حالياً' : 'No Featured Event'}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {isRTL ? 'سيتم عرض الفعاليات المميزة هنا' : 'Featured events will appear here'}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Quick Action Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-white">
                    {isRTL ? 'الفعاليات القادمة' : 'Upcoming'}
                  </div>
                  <div className="text-xs text-white/70">
                    {upcomingEvents} {isRTL ? 'فعالية' : 'events'}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <CardContent className="p-4 text-center">
                  <MapPin className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-white">
                    {isRTL ? 'الأماكن' : 'Venues'}
                  </div>
                  <div className="text-xs text-white/70">
                    {isRTL ? '15 موقع' : '15 locations'}
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