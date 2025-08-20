
import React, { useState } from 'react';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { ActivityFeedCard } from './ActivityFeedCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Activity, 
  Filter, 
  Search, 
  RefreshCw,
  Calendar,
  User,
  Tag
} from 'lucide-react';
import { ActivityFeedFilter } from '@/types/activity';

export interface ActivityFeedProps {
  className?: string;
  showFilters?: boolean;
  variant?: 'default' | 'compact';
  workspace_id?: string;
  entity_id?: string;
  entity_type?: string;
}

export function ActivityFeed({ 
  className = '',
  showFilters = true,
  variant = 'default',
  workspace_id,
  entity_id,
  entity_type
}: ActivityFeedProps) {
  const { t } = useUnifiedTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<ActivityFeedFilter>({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const {
    activities,
    isLoading,
    error,
    hasMore,
    refreshActivities,
    loadMore,
    applyFilter,
    clearFilter
  } = useActivityFeed({
    workspace_id,
    entity_id,
    entity_type,
    auto_refresh: true
  });

  const handleFilterChange = (filterType: keyof ActivityFeedFilter, value: any) => {
    const newFilter = { ...selectedFilter, [filterType]: value };
    setSelectedFilter(newFilter);
    applyFilter(newFilter);
  };

  const handleClearFilters = () => {
    setSelectedFilter({});
    setSearchTerm('');
    clearFilter();
  };

  const filteredActivities = activities.filter(activity => {
    if (!searchTerm) return true;
    return activity.action_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
           activity.entity_type.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (error) {
    return (
      <div className={`p-4 text-center ${className}`}>
        <div className="text-red-600 mb-4">
          {t('activity.feed.error')}: {error}
        </div>
        <Button onClick={refreshActivities} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          <h3 className="text-lg font-semibold">{t('activity.feed.title')}</h3>
          {activities.length > 0 && (
            <Badge variant="secondary">{activities.length}</Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshActivities}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {t('activity.feed.refresh')}
          </Button>
          
          {showFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      {showFilters && (
        <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {Object.keys(selectedFilter).length > 0 && (
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            )}
          </div>

          {showFilterPanel && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select onValueChange={(value) => handleFilterChange('action_types', [value])}>
                <SelectTrigger>
                  <SelectValue placeholder="Action Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="challenge_created">Challenge Created</SelectItem>
                  <SelectItem value="idea_submitted">Idea Submitted</SelectItem>
                  <SelectItem value="user_login">User Login</SelectItem>
                  <SelectItem value="team_joined">Team Joined</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => handleFilterChange('entity_types', [value])}>
                <SelectTrigger>
                  <SelectValue placeholder="Entity Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="challenge">Challenge</SelectItem>
                  <SelectItem value="idea">Idea</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => handleFilterChange('privacy_levels', [value])}>
                <SelectTrigger>
                  <SelectValue placeholder="Privacy Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="organization">Organization</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      {/* Activity List */}
      <div className="space-y-3">
        {isLoading && activities.length === 0 ? (
          // Loading skeleton
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-4 p-4 rounded-lg border">
                  <div className="h-10 w-10 bg-muted rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredActivities.length > 0 ? (
          <>
            {filteredActivities.map((activity) => (
              <ActivityFeedCard
                key={activity.id}
                activity={activity}
                variant={variant}
              />
            ))}
            
            {hasMore && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    t('activity.feed.loadMore')
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t('activity.feed.empty')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
