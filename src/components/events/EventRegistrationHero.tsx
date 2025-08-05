import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Users, 
  Clock, 
  MapPin, 
  Award, 
  Zap, 
  CheckCircle,
  Star,
  ArrowRight,
  Sparkles,
  Timer
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useRTLAware } from '@/hooks/useRTLAware';
import { cn } from '@/lib/utils';

interface EventRegistrationHeroProps {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  registeredCount: number;
  maxCapacity: number;
  registrationDeadline: string;
  onRegister: () => void;
  isRegistered?: boolean;
  eventType?: string;
}

export const EventRegistrationHero = ({ 
  eventTitle,
  eventDate,
  eventLocation,
  registeredCount,
  maxCapacity,
  registrationDeadline,
  onRegister,
  isRegistered = false,
  eventType = 'conference'
}: EventRegistrationHeroProps) => {
  const { isRTL } = useDirection();
  const { me, start, end } = useRTLAware();
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { icon: Users, value: registeredCount, label: isRTL ? 'مسجل' : 'registered', color: 'text-blue-400' },
    { icon: MapPin, value: eventLocation, label: isRTL ? 'الموقع' : 'location', color: 'text-green-400' },
    { icon: Timer, value: new Date(registrationDeadline).toLocaleDateString('ar-SA'), label: isRTL ? 'آخر موعد' : 'deadline', color: 'text-orange-400' },
    { icon: Award, value: eventType, label: isRTL ? 'النوع' : 'type', color: 'text-purple-400' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stats.length]);

  const registrationPercentage = (registeredCount / maxCapacity) * 100;

  return (
    <div className="relative overflow-hidden">
      {/* Background with animated gradients */}
      <div className="absolute inset-0 bg-gradient-primary">
        <div className="absolute inset-0 bg-[url('/event-images/conference.jpg')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 ${end('-40')} w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse`} />
        <div className={`absolute -bottom-40 ${start('-40')} w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl animate-pulse delay-1000`} />
        <div className={`absolute top-20 ${start('1/3')} w-64 h-64 bg-teal-400/5 rounded-full blur-2xl animate-bounce`} />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </div>
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                  <Calendar className={`w-3 h-3 ${me('1')}`} />
                  {isRTL ? 'تسجيل الفعالية' : 'Event Registration'}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {eventTitle}
                </h1>
                
                <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
                  {isRTL 
                    ? 'سجل الآن للانضمام إلى هذه الفعالية المميزة وكن جزءاً من رحلة الابتكار'
                    : 'Register now to join this exceptional event and be part of the innovation journey'
                  }
                </p>
              </div>
            </div>

            {/* Event Details */}
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
                      <div className="text-lg font-bold text-white truncate">{stat.value}</div>
                      <div className="text-sm text-white/70">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Registration Action */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-white/80 text-sm">
                <span>{isRTL ? 'التسجيلات' : 'Registrations'}</span>
                <span>{registeredCount} / {maxCapacity}</span>
              </div>
              
              <Progress 
                value={registrationPercentage} 
                className="h-3 bg-white/20"
              />

              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={onRegister}
                  size="lg"
                  disabled={isRegistered || registeredCount >= maxCapacity}
                  className={cn(
                    "bg-gradient-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105",
                    isRegistered 
                      ? "opacity-50 cursor-not-allowed" 
                      : registeredCount >= maxCapacity
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:opacity-90"
                  )}
                >
                  {isRegistered ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      {isRTL ? 'مسجل بالفعل' : 'Already Registered'}
                    </>
                  ) : registeredCount >= maxCapacity ? (
                    <>
                      <Clock className="w-5 h-5 mr-2" />
                      {isRTL ? 'الفعالية مكتملة' : 'Event Full'}
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      {isRTL ? 'سجل الآن' : 'Register Now'}
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  <Star className="w-5 h-5 mr-2" />
                  {isRTL ? 'المزيد من التفاصيل' : 'More Details'}
                </Button>
              </div>
            </div>
          </div>

          {/* Event Preview Card */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardContent className="p-0">
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <div className="w-full h-full bg-gradient-overlay flex items-center justify-center">
                    <Calendar className="w-16 h-16 text-white/60" />
                  </div>
                  
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-emerald-500/90 text-white border-0">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(eventDate).toLocaleDateString('ar-SA')}
                    </Badge>
                  </div>

                  {isRegistered && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-500/90 text-white border-0">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {isRTL ? 'مسجل' : 'Registered'}
                      </Badge>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-300">
                        {Math.round(registrationPercentage)}%
                      </div>
                      <div className="text-sm text-white/70">{isRTL ? 'مُسجل' : 'filled'}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-300">
                        {Math.max(0, Math.ceil((new Date(registrationDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}
                      </div>
                      <div className="text-sm text-white/70">{isRTL ? 'يوم متبقي' : 'days left'}</div>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-primary hover:opacity-90 text-white"
                  >
                    {isRTL ? 'عرض جدول الفعالية' : 'View Event Schedule'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};