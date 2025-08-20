
import React, { useState, useEffect } from 'react';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { ActivityFeedCard } from './ActivityFeedCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Filter, Search } from 'lucide-react';
import { ActivityFeedFilter } from '@/types/activity';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

interface ActivityFeedProps {
  workspaceId?: string;
  workspaceType?: string;
  entityId?: string;
  entityType?: string;
  compact?: boolean;
  autoRefresh?: boolean;
  showFilters?: boolean;
  maxItems?: number;
}

export function ActivityFeed({
  workspaceId,
  workspaceType,
  entityId,
  entityType,
  compact = false,
  autoRefresh = false,
  showFilters = true,
  maxItems
}: ActivityFeedProps) {
  const { t } = useUnifiedTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActionType, setSelectedActionType] = useState<string>('all');
  const [selectedEntityType, setSelectedEntityType] = useState<string>('all');
  const [selectedPrivacyLevel, setSelectedPrivacyLevel] = useState<string>('all');

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
    workspace_id: workspaceId,
    workspace_type: workspaceType,
    entity_id: entityId,
    entity_type: entityType,
    auto_refresh: autoRefresh,
    refresh_interval: 30000
  });

  // Apply filters when they change
  useEffect(() => {
    const filter: ActivityFeedFilter = {};
    
    if (selectedActionType !== 'all') {
      filter.action_types = [selectedActionType];
    }
    
    if (selectedEntityType !== 'all') {
      filter.entity_types = [selectedEntityType];
    }
    
    if (selectedPrivacyLevel !== 'all') {
      filter.privacy_levels = [selectedPrivacyLevel];
    }

    if (Object.keys(filter).length > 0) {
      applyFilter(filter);
    } else {
      clearFilter();
    }
  }, [selectedActionType, selectedEntityType, selectedPrivacyLevel, applyFilter, clearFilter]);

  // Filter activities by search term
  const filteredActivities = activities.filter(activity => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      activity.action_type.toLowerCase().includes(searchLower) ||
      activity.entity_type.toLowerCase().includes(searchLower) ||
      activity.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      JSON.stringify(activity.metadata).toLowerCase().includes(searchLower)
    );
  });

  const displayedActivities = maxItems 
    ? filteredActivities.slice(0, maxItems)
    : filteredActivities;

  const actionTypes = [
    'challenge_created', 'challenge_updated', 'challenge_published',
    'idea_created', 'idea_submitted', 'idea_reviewed',
    'user_login', 'user_logout', 'team_joined', 'role_assigned'
  ];

  const entityTypes = [
    'challenge', 'idea', 'submission', 'event', 'opportunity',
    'user', 'team', 'workspace', 'file'
  ];

  const privacyLevels = ['public', 'team', 'organization', 'private'];

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            <p>Error loading activity feed: {error}</p>
            <Button 
              variant="outline" 
              onClick={refreshActivities}
              className="mt-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      {!compact && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Activity Feed</h3>
            <p className="text-sm text-muted-foreground">
              {displayedActivities.length} activities
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshActivities}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      )}

      {/* Filters */}
      {showFilters && !compact && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Action Type</label>
                <Select value={selectedActionType} onValueChange={setSelectedActionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    {actionTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.replace('_', ' ').toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Entity Type</label>
                <Select value={selectedEntityType} onValueChange={setSelectedEntityType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Entities</SelectItem>
                    {entityTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Privacy Level</label>
                <Select value={selectedPrivacyLevel} onValueChange={setSelectedPrivacyLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select privacy..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {privacyLevels.map(level => (
                      <SelectItem key={level} value={level}>
                        {level.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedActionType !== 'all' || selectedEntityType !== 'all' || selectedPrivacyLevel !== 'all' || searchTerm) && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {selectedActionType !== 'all' && (
                  <Badge variant="secondary">
                    Action: {selectedActionType}
                  </Badge>
                )}
                {selectedEntityType !== 'all' && (
                  <Badge variant="secondary">
                    Entity: {selectedEntityType}
                  </Badge>
                )}
                {selectedPrivacyLevel !== 'all' && (
                  <Badge variant="secondary">
                    Privacy: {selectedPrivacyLevel}
                  </Badge>
                )}
                {searchTerm && (
                  <Badge variant="secondary">
                    Search: {searchTerm}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedActionType('all');
                    setSelectedEntityType('all');
                    setSelectedPrivacyLevel('all');
                    setSearchTerm('');
                    clearFilter();
                  }}
                >
                  Clear All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Activity List */}
      <div className={compact ? "space-y-2" : "space-y-4"}>
        {isLoading && displayedActivities.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-muted-foreground">Loading activities...</p>
              </div>
            </CardContent>
          </Card>
        ) : displayedActivities.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                <p>No activities found</p>
                {searchTerm && <p className="text-sm mt-1">Try adjusting your search criteria</p>}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {displayedActivities.map((activity) => (
              <ActivityFeedCard
                key={activity.id}
                activity={activity}
                compact={compact}
                showDetails={!compact}
              />
            ))}
            
            {/* Load More */}
            {hasMore && !maxItems && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
