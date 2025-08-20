
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { ActivityFeedCard } from './ActivityFeedCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ActivityFeedFilter } from '@/types/activity';
import { 
  RefreshCw, 
  Search, 
  Filter, 
  AlertCircle,
  Loader2
} from 'lucide-react';

interface ActivityFeedProps {
  workspace_id?: string;
  workspace_type?: string;
  entity_id?: string;
  entity_type?: string;
  variant?: 'default' | 'compact';
  autoRefresh?: boolean;
  maxHeight?: string;
  showFilters?: boolean;
}

export function ActivityFeed({
  workspace_id,
  workspace_type,
  entity_id,
  entity_type,
  variant = 'default',
  autoRefresh = false,
  maxHeight = '600px',
  showFilters = true
}: ActivityFeedProps) {
  const { t } = useTranslation('activity');
  
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
    workspace_type,
    entity_id,
    entity_type,
    auto_refresh: autoRefresh
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedActionTypes, setSelectedActionTypes] = useState<string[]>([]);
  const [selectedEntityTypes, setSelectedEntityTypes] = useState<string[]>([]);

  const handleApplyFilter = () => {
    const filter: ActivityFeedFilter = {};
    
    if (selectedActionTypes.length > 0) {
      filter.action_types = selectedActionTypes;
    }
    
    if (selectedEntityTypes.length > 0) {
      filter.entity_types = selectedEntityTypes;
    }
    
    applyFilter(filter);
    setShowFilterPanel(false);
  };

  const handleClearFilter = () => {
    setSelectedActionTypes([]);
    setSelectedEntityTypes([]);
    clearFilter();
    setShowFilterPanel(false);
  };

  const filteredActivities = searchTerm
    ? activities.filter(activity =>
        activity.action_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.entity_type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : activities;

  if (error) {
    return (
      <Card className="p-6 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {t('feed.error')}
        </h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={refreshActivities} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          {t('feed.refresh')}
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          {t('feed.title')}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshActivities}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {t('feed.refresh')}
          </Button>
          {showFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {t('filters.title')}
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search activities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <Card className="p-4">
          <div className="space-y-4">
            <h3 className="font-medium">{t('filters.title')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {t('filters.actionTypes')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {['challenge_created', 'idea_submitted', 'event_registered', 'user_login'].map((actionType) => (
                    <Badge
                      key={actionType}
                      variant={selectedActionTypes.includes(actionType) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedActionTypes(prev =>
                          prev.includes(actionType)
                            ? prev.filter(t => t !== actionType)
                            : [...prev, actionType]
                        );
                      }}
                    >
                      {t(`actions.${actionType}`, actionType)}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {t('filters.entityTypes')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {['challenge', 'idea', 'event', 'user'].map((entityType) => (
                    <Badge
                      key={entityType}
                      variant={selectedEntityTypes.includes(entityType) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedEntityTypes(prev =>
                          prev.includes(entityType)
                            ? prev.filter(t => t !== entityType)
                            : [...prev, entityType]
                        );
                      }}
                    >
                      {t(`entities.${entityType}`, entityType)}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleApplyFilter} size="sm">
                {t('filters.apply')}
              </Button>
              <Button onClick={handleClearFilter} variant="outline" size="sm">
                {t('filters.clear')}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Activity List */}
      <ScrollArea style={{ maxHeight }} className="pr-4">
        <div className="space-y-3">
          {isLoading && activities.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mr-2" />
              <span className="text-muted-foreground">{t('feed.loading')}</span>
            </div>
          ) : filteredActivities.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">{t('feed.empty')}</p>
            </Card>
          ) : (
            filteredActivities.map((activity) => (
              <ActivityFeedCard
                key={activity.id}
                activity={activity}
                variant={variant}
              />
            ))
          )}
          
          {hasMore && !isLoading && (
            <>
              <Separator />
              <div className="text-center py-4">
                <Button onClick={loadMore} variant="outline">
                  {t('feed.loadMore')}
                </Button>
              </div>
            </>
          )}
          
          {isLoading && activities.length > 0 && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground mr-2" />
              <span className="text-sm text-muted-foreground">{t('feed.loading')}</span>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
