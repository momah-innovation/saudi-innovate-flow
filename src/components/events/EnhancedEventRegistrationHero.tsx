import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  Award, 
  Zap, 
  Plus, 
  Filter,
  Star,
  ArrowRight,
  Play,
  Sparkles,
  Target,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

interface EnhancedEventRegistrationHeroProps {
  totalRegistrations: number;
  upcomingEvents: number;
  totalParticipants: number;
  completedEvents?: number;
  onRegisterEvent?: () => void;
  onShowFilters: () => void;
  canRegister?: boolean;
  featuredEvent?: {
    id: string;
    title: string;
    date: string;
    participants: number;
    capacity: number;
    location: string;
    image?: string;
  };
}

export const EnhancedEventRegistrationHero = ({ 
  totalRegistrations, 
  upcomingEvents, 
  totalParticipants,
  completedEvents = 0,
  onRegisterEvent,
  onShowFilters,
  canRegister = true,
  featuredEvent
}: EnhancedEventRegistrationHeroProps) => {
  const { isRTL } = useDirection();
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { icon: Calendar, value: totalRegistrations, label: isRTL ? 'تسجيل' : 'registrations', color: 'text-blue-400' },
    { icon: Clock, value: upcomingEvents, label: isRTL ? 'قادم' : 'upcoming', color: 'text-green-400' },
    { icon: Users, value: `${Math.floor(totalParticipants / 1000)}K+`, label: isRTL ? 'مشارك' : 'participants', color: 'text-purple-400' },
    { icon: CheckCircle, value: completedEvents, label: isRTL ? 'مكتمل' : 'completed', color: 'text-orange-400' }
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
      <div className="absolute inset-0" style={{ background: 'linear-gradient(99deg, rgba(59, 20, 93, 1) 51%, rgba(23, 8, 38, 1) 99%)' }}>
        <div className="absolute inset-0 bg-[url('/event-images/innovation-conference.jpg')] opacity-10 bg-cover bg-center" />
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
                  <Sparkles className="w-6 h-6 text-blue-300" />
                </div>
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                  <Star className="w-3 h-3 mr-1" />
                  {isRTL ? 'منصة تسجيل الفعاليات' : 'Event Registration Platform'}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {isRTL ? (
                    <>
                      سجل في <span className="text-transparent bg-clip-text bg-gradient-text">الفعاليات</span> المميزة
                    </>
                  ) : (
                    <>
                      Register for <span className="text-transparent bg-clip-text bg-gradient-text">Premium</span> Events
                    </>
                  )}
                </h1>
                
                <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
                  {isRTL 
                    ? 'انضم إلى فعاليات الابتكار والتطوير وكن جزءاً من رحلة التحول الرقمي ورؤية المملكة 2030'
                    : 'Join innovation and development events and be part of the digital transformation journey and Saudi Vision 2030'
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
              {canRegister && onRegisterEvent && (
                <Button
                  onClick={onRegisterEvent}
                  size="lg"
                  className="bg-gradient-primary text-white hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {isRTL ? 'سجل في فعالية' : 'Register for Event'}
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
                        alt={featuredEvent.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-overlay flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-white/60" />
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-blue-500/90 text-white border-0 animate-pulse">
                        <Clock className="w-3 h-3 mr-1" />
                        {featuredEvent.date}
                      </Badge>
                    </div>

                    <div className="absolute top-4 right-4">
                      <Badge className="bg-purple-500/90 text-white border-0">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {isRTL ? 'مميزة' : 'Featured'}
                      </Badge>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white">
                      {featuredEvent.title}
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-300">
                          {featuredEvent.participants}
                        </div>
                        <div className="text-sm text-white/70">{isRTL ? 'مشارك' : 'participants'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-300">
                          {featuredEvent.capacity}
                        </div>
                        <div className="text-sm text-white/70">{isRTL ? 'سعة' : 'capacity'}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-white/80">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{featuredEvent.location}</span>
                    </div>

                    <Progress 
                      value={(featuredEvent.participants / featuredEvent.capacity) * 100} 
                      className="h-2 bg-white/20"
                    />

                    <Button 
                      className="w-full bg-gradient-primary hover:opacity-90 text-white"
                    >
                      {isRTL ? 'سجل الآن' : 'Register Now'}
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
                    {isRTL ? 'لا توجد فعالية مميزة حالياً' : 'No Featured Event'}
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
                  <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-white">
                    {isRTL ? 'فعاليات اليوم' : "Today's Events"}
                  </div>
                  <div className="text-xs text-white/70">
                    {isRTL ? '3 فعاليات' : '3 events'}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-white">
                    {isRTL ? 'شهاداتي' : 'My Certificates'}
                  </div>
                  <div className="text-xs text-white/70">
                    {isRTL ? '5 شهادات' : '5 certificates'}
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