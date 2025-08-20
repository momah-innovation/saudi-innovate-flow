import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { ActivityFeedFilter, ActivityActionType, ActivityEntityType } from '@/types/activity';
import { CalendarIcon, X, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ActivityFiltersProps {
  filter: ActivityFeedFilter;
  onFilterChange: (filter: ActivityFeedFilter) => void;
  onClearFilters: () => void;
  className?: string;
}

const COMMON_ACTION_TYPES: ActivityActionType[] = [
  'challenge_created',
  'challenge_published',
  'challenge_archived',
  'idea_created',
  'idea_submitted',
  'event_created',
  'team_joined'
];

const COMMON_ENTITY_TYPES: ActivityEntityType[] = [
  'challenge',
  'idea',
  'event',
  'user',
  'team',
  'file',
  'comment'
];

const PRIVACY_LEVELS = ['public', 'team', 'organization', 'private'];

export function ActivityFilters({ 
  filter, 
  onFilterChange, 
  onClearFilters, 
  className 
}: ActivityFiltersProps) {
  const { t, language } = useUnifiedTranslation();
  const isRTL = language === 'ar';
  const locale = isRTL ? ar : enUS;

  const handleActionTypeChange = (actionType: string, checked: boolean) => {
    const current = filter.action_types || [];
    const updated = checked 
      ? [...current, actionType]
      : current.filter(type => type !== actionType);
    
    onFilterChange({ ...filter, action_types: updated });
  };

  const handleEntityTypeChange = (entityType: string, checked: boolean) => {
    const current = filter.entity_types || [];
    const updated = checked 
      ? [...current, entityType]
      : current.filter(type => type !== entityType);
    
    onFilterChange({ ...filter, entity_types: updated });
  };

  const handlePrivacyLevelChange = (privacyLevel: string, checked: boolean) => {
    const current = filter.privacy_levels || [];
    const updated = checked 
      ? [...current, privacyLevel]
      : current.filter(level => level !== privacyLevel);
    
    onFilterChange({ ...filter, privacy_levels: updated });
  };

  const handleDateRangeChange = (type: 'start' | 'end', date: Date | undefined) => {
    const currentRange = filter.date_range || { start: new Date(), end: new Date() };
    const updated = { ...currentRange, [type]: date };
    onFilterChange({ ...filter, date_range: updated });
  };

  const hasActiveFilters = 
    (filter.action_types?.length || 0) > 0 ||
    (filter.entity_types?.length || 0) > 0 ||
    (filter.privacy_levels?.length || 0) > 0 ||
    filter.date_range;

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            {t('activity.filters.title')}
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-auto p-1 text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              {t('activity.filters.clear')}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Action Types */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            {t('activity.filters.actionTypes')}
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {COMMON_ACTION_TYPES.map((actionType) => (
              <div key={actionType} className="flex items-center space-x-2">
                <Checkbox
                  id={`action-${actionType}`}
                  checked={(filter.action_types || []).includes(actionType)}
                  onCheckedChange={(checked) => 
                    handleActionTypeChange(actionType, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`action-${actionType}`}
                  className="text-xs cursor-pointer"
                >
                  {t(`activity.actions.${actionType}`, actionType)}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Entity Types */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            {t('activity.filters.entityTypes')}
          </Label>
          <div className="flex flex-wrap gap-2">
            {COMMON_ENTITY_TYPES.map((entityType) => (
              <div key={entityType} className="flex items-center space-x-2">
                <Checkbox
                  id={`entity-${entityType}`}
                  checked={(filter.entity_types || []).includes(entityType)}
                  onCheckedChange={(checked) => 
                    handleEntityTypeChange(entityType, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`entity-${entityType}`}
                  className="text-xs cursor-pointer"
                >
                  {t(`activity.entities.${entityType}`, entityType)}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Levels */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            {t('activity.filters.privacyLevels')}
          </Label>
          <div className="flex flex-wrap gap-2">
            {PRIVACY_LEVELS.map((privacyLevel) => (
              <div key={privacyLevel} className="flex items-center space-x-2">
                <Checkbox
                  id={`privacy-${privacyLevel}`}
                  checked={(filter.privacy_levels || []).includes(privacyLevel)}
                  onCheckedChange={(checked) => 
                    handlePrivacyLevelChange(privacyLevel, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`privacy-${privacyLevel}`}
                  className="text-xs cursor-pointer"
                >
                  {t(`activity.privacy.${privacyLevel}`, privacyLevel)}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            {t('activity.filters.dateRange')}
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                From
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filter.date_range?.start && "text-muted-foreground"
                    )}
                    size="sm"
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {filter.date_range?.start ? (
                      format(filter.date_range.start, "PPP", { locale })
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filter.date_range?.start}
                    onSelect={(date) => handleDateRangeChange('start', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                To
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filter.date_range?.end && "text-muted-foreground"
                    )}
                    size="sm"
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {filter.date_range?.end ? (
                      format(filter.date_range.end, "PPP", { locale })
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filter.date_range?.end}
                    onSelect={(date) => handleDateRangeChange('end', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-3 border-t">
            <Label className="text-xs text-muted-foreground mb-2 block">
              Active Filters
            </Label>
            <div className="flex flex-wrap gap-1">
              {filter.action_types?.map((type) => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {t(`activity.actions.${type}`, type)}
                  <X 
                    className="ml-1 h-2 w-2 cursor-pointer" 
                    onClick={() => handleActionTypeChange(type, false)}
                  />
                </Badge>
              ))}
              {filter.entity_types?.map((type) => (
                <Badge key={type} variant="outline" className="text-xs">
                  {t(`activity.entities.${type}`, type)}
                  <X 
                    className="ml-1 h-2 w-2 cursor-pointer" 
                    onClick={() => handleEntityTypeChange(type, false)}
                  />
                </Badge>
              ))}
              {filter.privacy_levels?.map((level) => (
                <Badge key={level} variant="outline" className="text-xs">
                  {t(`activity.privacy.${level}`, level)}
                  <X 
                    className="ml-1 h-2 w-2 cursor-pointer" 
                    onClick={() => handlePrivacyLevelChange(level, false)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Apply Filters Button */}
        <div className="pt-4 border-t">
          <Button 
            className="w-full" 
            size="sm"
            onClick={() => {
              // Trigger a refresh with current filters
              onFilterChange({ ...filter });
            }}
          >
            {t('activity.filters.apply')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}