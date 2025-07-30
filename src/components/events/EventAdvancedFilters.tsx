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
import { format } from 'date-fns';

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

  const eventTypes = [
    { value: 'workshop', label: isRTL ? 'ورشة عمل' : 'Workshop' },
    { value: 'conference', label: isRTL ? 'مؤتمر' : 'Conference' },
    { value: 'webinar', label: isRTL ? 'ندوة إلكترونية' : 'Webinar' },
    { value: 'meetup', label: isRTL ? 'لقاء' : 'Meetup' },
    { value: 'hackathon', label: isRTL ? 'هاكاثون' : 'Hackathon' },
    { value: 'seminar', label: isRTL ? 'ندوة' : 'Seminar' },
    { value: 'brainstorm', label: isRTL ? 'عصف ذهني' : 'Brainstorm' }
  ];

  const formats = [
    { value: 'in_person', label: isRTL ? 'حضوري' : 'In Person' },
    { value: 'virtual', label: isRTL ? 'افتراضي' : 'Virtual' },
    { value: 'hybrid', label: isRTL ? 'مختلط' : 'Hybrid' }
  ];

  const statusOptions = [
    { value: 'scheduled', label: isRTL ? 'مجدول' : 'Scheduled' },
    { value: 'ongoing', label: isRTL ? 'جاري' : 'Ongoing' },
    { value: 'completed', label: isRTL ? 'مكتمل' : 'Completed' },
    { value: 'cancelled', label: isRTL ? 'ملغي' : 'Cancelled' }
  ];

  const priceRanges = [
    { value: 'free', label: isRTL ? 'مجاني' : 'Free' },
    { value: '1-500', label: isRTL ? '1 - 500 ر.س' : '1 - 500 SAR' },
    { value: '501-1000', label: isRTL ? '501 - 1000 ر.س' : '501 - 1000 SAR' },
    { value: '1001+', label: isRTL ? 'أكثر من 1000 ر.س' : '1000+ SAR' }
  ];

  const capacityOptions = [
    { value: '1-25', label: isRTL ? '1 - 25 شخص' : '1 - 25 people' },
    { value: '26-50', label: isRTL ? '26 - 50 شخص' : '26 - 50 people' },
    { value: '51-100', label: isRTL ? '51 - 100 شخص' : '51 - 100 people' },
    { value: '101+', label: isRTL ? 'أكثر من 100 شخص' : '100+ people' }
  ];

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
            {isRTL ? 'الفلاتر المتقدمة' : 'Advanced Filters'}
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">{getActiveFiltersCount()}</Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            {isRTL ? 'اختر الفلاتر للعثور على الفعاليات المناسبة' : 'Choose filters to find the right events for you'}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Event Types */}
          <div>
            <Label className="font-semibold">{isRTL ? 'نوع الفعالية' : 'Event Type'}</Label>
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
            <Label className="font-semibold">{isRTL ? 'نمط الفعالية' : 'Event Format'}</Label>
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
            <Label className="font-semibold">{isRTL ? 'حالة الفعالية' : 'Event Status'}</Label>
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
            <Label className="font-semibold">{isRTL ? 'التاريخ' : 'Date Range'}</Label>
            <div className="mt-3 space-y-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.from ? (
                      filters.dateRange.to ? (
                        <>
                          {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                          {format(filters.dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(filters.dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>{isRTL ? 'اختر التاريخ' : 'Pick a date'}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
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
              {isRTL ? 'نطاق السعر' : 'Price Range'}
            </Label>
            <Select value={filters.priceRange} onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value })}>
              <SelectTrigger className="mt-3">
                <SelectValue placeholder={isRTL ? 'اختر نطاق السعر' : 'Select price range'} />
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
              {isRTL ? 'حجم الفعالية' : 'Event Capacity'}
            </Label>
            <Select value={filters.capacity} onValueChange={(value) => onFiltersChange({ ...filters, capacity: value })}>
              <SelectTrigger className="mt-3">
                <SelectValue placeholder={isRTL ? 'اختر حجم الفعالية' : 'Select event capacity'} />
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
              {isRTL ? 'مسح الكل' : 'Clear All'}
            </Button>
            <Button onClick={() => onOpenChange(false)} className="flex-1">
              {isRTL ? 'تطبيق' : 'Apply'}
            </Button>
          </div>

          {/* Active Filters Summary */}
          {getActiveFiltersCount() > 0 && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="font-medium mb-2">{isRTL ? 'الفلاتر النشطة:' : 'Active Filters:'}</div>
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