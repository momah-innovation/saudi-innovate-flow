import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Users, MapPin, TrendingUp, Plus, Filter } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useRTLAware } from '@/hooks/useRTLAware';

interface EventsHeroProps {
  totalEvents: number;
  upcomingEvents: number;
  todayEvents: number;
  onCreateEvent: () => void;
  onShowFilters: () => void;
  canCreateEvent?: boolean;
}

export const EventsHero = ({
  totalEvents,
  upcomingEvents,
  todayEvents,
  onCreateEvent,
  onShowFilters,
  canCreateEvent = true
}: EventsHeroProps) => {
  const { isRTL } = useDirection();
  const { me, start, end } = useRTLAware();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/5 to-background rounded-xl p-8 mb-8 border">
      {/* Dynamic Background with Animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/10 animate-pulse" />
        <div className={`absolute top-0 ${start('0')} w-full h-full opacity-30 bg-repeat`} 
             style={{
               backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23000\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M30 30m-10 0a10 10 0 1 1 20 0a10 10 0 1 1 -20 0\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
             }} 
        />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Enhanced Left Content */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="p-4 bg-primary/10 rounded-full ring-4 ring-primary/5">
                  <CalendarIcon className="w-10 h-10 text-primary" />
                </div>
                <div className={`absolute -top-1 ${end('-1')} w-4 h-4 bg-orange-500 rounded-full animate-pulse`} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {isRTL ? 'استكشاف الفعاليات' : 'Discover Events'}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {isRTL 
                    ? 'اكتشف وسجل في أحدث الفعاليات والأنشطة الابتكارية' 
                    : 'Discover and register for the latest innovation events and activities'
                  }
                </p>
              </div>
            </div>

            {/* Enhanced Stats Grid with Animation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="group bg-background/90 backdrop-blur-sm rounded-xl p-4 border hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-primary rounded-lg shadow-lg group-hover:shadow-primary/25 transition-shadow">
                    <CalendarIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {totalEvents}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {isRTL ? 'إجمالي الفعاليات' : 'Total Events'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="group bg-background/90 backdrop-blur-sm rounded-xl p-4 border hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-primary rounded-lg shadow-lg group-hover:shadow-primary/25 transition-shadow">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground group-hover:text-success transition-colors">
                      {upcomingEvents}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {isRTL ? 'قادمة' : 'Upcoming'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="group bg-background/90 backdrop-blur-sm rounded-xl p-4 border hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-primary rounded-lg shadow-lg group-hover:shadow-primary/25 transition-shadow">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground group-hover:text-warning transition-colors">
                      {todayEvents}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {isRTL ? 'اليوم' : 'Today'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="group bg-background/90 backdrop-blur-sm rounded-xl p-4 border hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-primary rounded-lg shadow-lg group-hover:shadow-primary/25 transition-shadow">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
                      12
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {isRTL ? 'مواقع' : 'Venues'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Right Actions */}
          <div className="flex flex-col gap-3">
            {canCreateEvent && (
              <Button 
                onClick={onCreateEvent} 
                className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-primary/25 transition-all duration-300"
                size="lg"
              >
                <Plus className="w-5 h-5" />
                {isRTL ? 'فعالية جديدة' : 'New Event'}
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={onShowFilters} 
              className="gap-2 hover:bg-muted/80 transition-all duration-300"
              size="lg"
            >
              <Filter className="w-5 h-5" />
              {isRTL ? 'الفلاتر' : 'Filters'}
            </Button>
          </div>
        </div>

        {/* Enhanced Quick Tags with Hover Effects */}
        <div className="flex flex-wrap gap-3 mt-8">
          {[
            { label: isRTL ? 'ورش عمل' : 'Workshops', icon: '🛠️' },
            { label: isRTL ? 'مؤتمرات' : 'Conferences', icon: '🎤' },
            { label: isRTL ? 'ندوات' : 'Webinars', icon: '💻' },
            { label: isRTL ? 'لقاءات' : 'Meetups', icon: '👥' },
            { label: isRTL ? 'معارض' : 'Expos', icon: '🏛️' },
            { label: isRTL ? 'هاكاثون' : 'Hackathons', icon: '💡' }
          ].map((tag, index) => (
            <Badge 
              key={index}
              variant="secondary" 
              className="hover:bg-primary hover:text-primary-foreground cursor-pointer transition-all duration-300 hover:scale-105 px-4 py-2 text-sm shadow-sm"
            >
              <span className={me('2')}>{tag.icon}</span>
              {tag.label}
            </Badge>
          ))}
        </div>
      </div>

    </div>
  );
};