import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, Filter, X, MapPin, Clock, Users, DollarSign } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useSettingsManager } from '@/hooks/useSettingsManager';
import { dateHandler } from '@/utils/unified-date-handler';

interface FilterState {
  eventTypes: string[];
  formats: string[];
  status: string[];
  dateRange: {
    from?: Date;
    to?: Date;
  };
  location: string;
  priceRange: string;
  capacity: string;
}

interface EventAdvancedFiltersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

export const EventAdvancedFilters = ({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  onClearFilters
}: EventAdvancedFiltersProps) => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  const { getSettingValue } = useSettingsManager();

  const eventTypes = [
    { value: 'workshop', label: t('events:event_type.workshop') },
    { value: 'conference', label: t('events:event_type.conference') },
    { value: 'webinar', label: t('events:event_type.webinar') },
    { value: 'meetup', label: t('events:event_type.meetup') },
    { value: 'hackathon', label: t('events:event_type.hackathon') },
    { value: 'seminar', label: t('events:event_type.seminar') },
    { value: 'brainstorm', label: t('events:event_type.brainstorm') }
  ];

  // Get settings from database
  const eventFormatOptionsData = getSettingValue('event_format_options', []) as string[];
  const eventStatusOptionsData = getSettingValue('event_status_options', []) as string[];
  const eventPriceRangesData = getSettingValue('event_price_ranges', []) as string[];
  const eventCapacityOptionsData = getSettingValue('event_capacity_options', []) as string[];

  const formats = eventFormatOptionsData.map(format => ({ 
    value: format.toLowerCase(), 
    label: format 
  }));

  const statusOptions = eventStatusOptionsData.map(status => ({ 
    value: status.toLowerCase(), 
    label: status 
  }));

  const priceRanges = eventPriceRangesData.map((range, index) => {
    const values = ['free', '1-500', '501-1000', '1001+'];
    return { value: values[index] || 'free', label: range };
  });

  const capacityOptions = eventCapacityOptionsData.map((capacity, index) => {
    const values = ['1-25', '26-50', '51-100', '101+'];
    return { value: values[index] || '1-25', label: capacity };
  });

  const handleTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked 
      ? [...filters.eventTypes, type]
      : filters.eventTypes.filter(t => t !== type);
    
    onFiltersChange({ ...filters, eventTypes: newTypes });
  };

  const handleFormatChange = (format: string, checked: boolean) => {
    const newFormats = checked 
      ? [...filters.formats, format]
      : filters.formats.filter(f => f !== format);
    
    onFiltersChange({ ...filters, formats: newFormats });
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatus = checked 
      ? [...filters.status, status]
      : filters.status.filter(s => s !== status);
    
    onFiltersChange({ ...filters, status: newStatus });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.eventTypes.length > 0) count++;
    if (filters.formats.length > 0) count++;
    if (filters.status.length > 0) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.location) count++;
    if (filters.priceRange) count++;
    if (filters.capacity) count++;
    return count;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            {t('events:filters.advanced_filters')}
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">{getActiveFiltersCount()}</Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            {t('events:filters.choose_filters')}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Event Types */}
          <div>
            <Label className="font-semibold">{t('events:filters.type')}</Label>
            <div className="mt-3 space-y-3">
              {eventTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id={`type-${type.value}`}
                    checked={filters.eventTypes.includes(type.value)}
                    onCheckedChange={(checked) => handleTypeChange(type.value, checked as boolean)}
                  />
                  <Label htmlFor={`type-${type.value}`} className="text-sm">
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Format */}
          <div>
            <Label className="font-semibold">{t('events:filters.event_format')}</Label>
            <div className="mt-3 space-y-3">
              {formats.map((format) => (
                <div key={format.value} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id={`format-${format.value}`}
                    checked={filters.formats.includes(format.value)}
                    onCheckedChange={(checked) => handleFormatChange(format.value, checked as boolean)}
                  />
                  <Label htmlFor={`format-${format.value}`} className="text-sm">
                    {format.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Status */}
          <div>
            <Label className="font-semibold">{t('events:filters.event_status')}</Label>
            <div className="mt-3 space-y-3">
              {statusOptions.map((status) => (
                <div key={status.value} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id={`status-${status.value}`}
                    checked={filters.status.includes(status.value)}
                    onCheckedChange={(checked) => handleStatusChange(status.value, checked as boolean)}
                  />
                  <Label htmlFor={`status-${status.value}`} className="text-sm">
                    {status.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Date Range */}
          <div>
            <Label className="font-semibold">{t('events:filters.date_range')}</Label>
            <div className="mt-3 space-y-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.from ? (
                      filters.dateRange.to ? (
                        <>
                          {dateHandler.formatDate(filters.dateRange.from, "LLL dd, y")} -{" "}
                          {dateHandler.formatDate(filters.dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        dateHandler.formatDate(filters.dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>{t('events:filters.pick_date')}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    className="p-3 pointer-events-auto"
                    initialFocus
                    mode="range"
                    defaultMonth={filters.dateRange.from}
                    selected={filters.dateRange.from && filters.dateRange.to ? { from: filters.dateRange.from, to: filters.dateRange.to } : undefined}
                    onSelect={(range) => onFiltersChange({ ...filters, dateRange: range || {} })}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Separator />

          {/* Price Range */}
          <div>
            <Label className="font-semibold flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              {t('events:filters.price_range')}
            </Label>
            <Select value={filters.priceRange} onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value })}>
              <SelectTrigger className="mt-3">
                <SelectValue placeholder={t('events:filters.select_price_range')} />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Capacity */}
          <div>
            <Label className="font-semibold flex items-center gap-2">
              <Users className="w-4 h-4" />
              {t('events:filters.event_capacity')}
            </Label>
            <Select value={filters.capacity} onValueChange={(value) => onFiltersChange({ ...filters, capacity: value })}>
              <SelectTrigger className="mt-3">
                <SelectValue placeholder={t('events:filters.select_event_capacity')} />
              </SelectTrigger>
              <SelectContent>
                {capacityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button onClick={onClearFilters} variant="outline" className="flex-1">
              <X className="w-4 h-4 mr-2" />
              {t('events:filters.clear_all')}
            </Button>
            <Button onClick={() => onOpenChange(false)} className="flex-1">
              {t('events:filters.apply')}
            </Button>
          </div>

          {/* Active Filters Summary */}
          {getActiveFiltersCount() > 0 && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="font-medium mb-2">{t('events:filters.active_filters_label')}</div>
              <div className="flex flex-wrap gap-2">
                {filters.eventTypes.map((type) => (
                  <Badge key={type} variant="secondary">
                    {eventTypes.find(t => t.value === type)?.label}
                  </Badge>
                ))}
                {filters.formats.map((format) => (
                  <Badge key={format} variant="secondary">
                    {formats.find(f => f.value === format)?.label}
                  </Badge>
                ))}
                {filters.status.map((status) => (
                  <Badge key={status} variant="secondary">
                    {statusOptions.find(s => s.value === status)?.label}
                  </Badge>
                ))}
                {filters.priceRange && (
                  <Badge variant="secondary">
                    {priceRanges.find(p => p.value === filters.priceRange)?.label}
                  </Badge>
                )}
                {filters.capacity && (
                  <Badge variant="secondary">
                    {capacityOptions.find(c => c.value === filters.capacity)?.label}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
