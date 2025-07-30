import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Users, MapPin, TrendingUp, Plus, Filter } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';

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

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/5 to-background rounded-xl p-8 mb-8 border">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/20" />
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-repeat" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <CalendarIcon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {isRTL ? 'استكشاف الفعاليات' : 'Discover Events'}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {isRTL 
                    ? 'اكتشف وسجل في أحدث الفعاليات والأنشطة الابتكارية' 
                    : 'Discover and register for the latest innovation events and activities'
                  }
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{totalEvents}</div>
                    <div className="text-sm text-muted-foreground">
                      {isRTL ? 'إجمالي الفعاليات' : 'Total Events'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{upcomingEvents}</div>
                    <div className="text-sm text-muted-foreground">
                      {isRTL ? 'قادمة' : 'Upcoming'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{todayEvents}</div>
                    <div className="text-sm text-muted-foreground">
                      {isRTL ? 'اليوم' : 'Today'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">4</div>
                    <div className="text-sm text-muted-foreground">
                      {isRTL ? 'مواقع' : 'Venues'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex flex-col sm:flex-row gap-3 lg:flex-col">
            {canCreateEvent && (
              <Button onClick={onCreateEvent} className="gap-2">
                <Plus className="w-4 h-4" />
                {isRTL ? 'فعالية جديدة' : 'New Event'}
              </Button>
            )}
            <Button variant="outline" onClick={onShowFilters} className="gap-2">
              <Filter className="w-4 h-4" />
              {isRTL ? 'الفلاتر' : 'Filters'}
            </Button>
          </div>
        </div>

        {/* Quick Tags */}
        <div className="flex flex-wrap gap-2 mt-6">
          <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
            {isRTL ? 'ورش عمل' : 'Workshops'}
          </Badge>
          <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
            {isRTL ? 'مؤتمرات' : 'Conferences'}
          </Badge>
          <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
            {isRTL ? 'ندوات' : 'Webinars'}
          </Badge>
          <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
            {isRTL ? 'لقاءات' : 'Meetups'}
          </Badge>
        </div>
      </div>
    </div>
  );
};