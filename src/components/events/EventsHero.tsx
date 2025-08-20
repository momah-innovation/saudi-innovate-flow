import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Users, MapPin, TrendingUp, Plus, Filter } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

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
  const { t } = useUnifiedTranslation();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-xl p-8 mb-8">
      {/* Enhanced Background with Purple Theme */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-600/20 animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-repeat" 
             style={{
               backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23fff\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M30 30m-10 0a10 10 0 1 1 20 0a10 10 0 1 1 -20 0\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
             }} 
        />
        {/* Additional gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent" />
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
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  {t('events:hero.title')}
                </h1>
                <p className="text-lg text-white/80">
                  {t('events:hero.subtitle')}
                </p>
              </div>
            </div>

            {/* Enhanced Stats Grid with Animation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="group bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-opacity duration-200">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/20 rounded-lg shadow-lg group-hover:shadow-blue-500/25 transition-shadow">
                    <CalendarIcon className="w-6 h-6 text-blue-300" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                      {totalEvents}
                    </div>
                    <div className="text-sm text-white/70">
                      {t('events:hero.total_events')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="group bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-opacity duration-200">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-500/20 rounded-lg shadow-lg group-hover:shadow-green-500/25 transition-shadow">
                    <TrendingUp className="w-6 h-6 text-green-300" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white group-hover:text-green-300 transition-colors">
                      {upcomingEvents}
                    </div>
                    <div className="text-sm text-white/70">
                      {t('events:hero.upcoming')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="group bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-opacity duration-200">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-500/20 rounded-lg shadow-lg group-hover:shadow-orange-500/25 transition-shadow">
                    <Users className="w-6 h-6 text-orange-300" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white group-hover:text-orange-300 transition-colors">
                      {todayEvents}
                    </div>
                    <div className="text-sm text-white/70">
                      {t('events:hero.today')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="group bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-opacity duration-200">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-500/20 rounded-lg shadow-lg group-hover:shadow-purple-500/25 transition-shadow">
                    <MapPin className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                      12
                    </div>
                    <div className="text-sm text-white/70">
                      {t('events:hero.venues')}
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
                {t('events:hero.new_event')}
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={onShowFilters} 
              className="gap-2 border-white/30 text-white hover:bg-white/10 transition-all duration-300"
              size="lg"
            >
              <Filter className="w-5 h-5" />
              {t('events:hero.filters')}
            </Button>
          </div>
        </div>

        {/* Enhanced Quick Tags with Hover Effects */}
        <div className="flex flex-wrap gap-3 mt-8">
          {[
            { label: t('events:tags.workshops'), icon: '🛠️' },
            { label: t('events:tags.conferences'), icon: '🎤' },
            { label: t('events:tags.webinars'), icon: '💻' },
            { label: t('events:tags.meetups'), icon: '👥' },
            { label: t('events:tags.expos'), icon: '🏛️' },
            { label: t('events:tags.hackathons'), icon: '💡' }
          ].map((tag, index) => (
            <Badge 
              key={index}
              variant="secondary" 
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 cursor-pointer transition-opacity duration-200 px-4 py-2 text-sm shadow-sm"
            >
              <span className="mr-2">{tag.icon}</span>
              {tag.label}
            </Badge>
          ))}
        </div>
      </div>

    </div>
  );
};
