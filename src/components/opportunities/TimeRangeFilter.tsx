import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Filter, RotateCcw } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { format, subDays, subWeeks, subMonths, startOfDay, endOfDay } from 'date-fns';

interface TimeRangeFilterProps {
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
  className?: string;
}

type PresetRange = {
  label: string;
  labelAr: string;
  days: number;
  getValue: () => { start: Date; end: Date };
};

export const TimeRangeFilter = ({ onDateRangeChange, className }: TimeRangeFilterProps) => {
  const { isRTL } = useDirection();
  const [selectedRange, setSelectedRange] = useState<string>('30d');
  const [customStart, setCustomStart] = useState<Date | undefined>();
  const [customEnd, setCustomEnd] = useState<Date | undefined>();
  const [showCustomCalendar, setShowCustomCalendar] = useState(false);

  const presetRanges: PresetRange[] = [
    {
      label: 'Last 7 days',
      labelAr: 'آخر 7 أيام',
      days: 7,
      getValue: () => ({ start: startOfDay(subDays(new Date(), 7)), end: endOfDay(new Date()) })
    },
    {
      label: 'Last 30 days',
      labelAr: 'آخر 30 يوم',
      days: 30,
      getValue: () => ({ start: startOfDay(subDays(new Date(), 30)), end: endOfDay(new Date()) })
    },
    {
      label: 'Last 3 months',
      labelAr: 'آخر 3 أشهر',
      days: 90,
      getValue: () => ({ start: startOfDay(subMonths(new Date(), 3)), end: endOfDay(new Date()) })
    },
    {
      label: 'Last 6 months',
      labelAr: 'آخر 6 أشهر',
      days: 180,
      getValue: () => ({ start: startOfDay(subMonths(new Date(), 6)), end: endOfDay(new Date()) })
    },
    {
      label: 'Last year',
      labelAr: 'آخر سنة',
      days: 365,
      getValue: () => ({ start: startOfDay(subMonths(new Date(), 12)), end: endOfDay(new Date()) })
    }
  ];

  const handlePresetSelect = (rangeKey: string) => {
    setSelectedRange(rangeKey);
    setShowCustomCalendar(false);
    
    const preset = presetRanges.find(r => `${r.days}d` === rangeKey);
    if (preset) {
      const { start, end } = preset.getValue();
      onDateRangeChange(start, end);
    }
  };

  const handleCustomDateSelect = () => {
    if (customStart && customEnd) {
      setSelectedRange('custom');
      setShowCustomCalendar(false);
      onDateRangeChange(startOfDay(customStart), endOfDay(customEnd));
    }
  };

  const handleReset = () => {
    setSelectedRange('30d');
    setCustomStart(undefined);
    setCustomEnd(undefined);
    const defaultRange = presetRanges.find(r => r.days === 30);
    if (defaultRange) {
      const { start, end } = defaultRange.getValue();
      onDateRangeChange(start, end);
    }
  };

  const getSelectedRangeLabel = () => {
    if (selectedRange === 'custom' && customStart && customEnd) {
      return `${format(customStart, 'MMM dd')} - ${format(customEnd, 'MMM dd')}`;
    }
    
    const preset = presetRanges.find(r => `${r.days}d` === selectedRange);
    return preset ? (isRTL ? preset.labelAr : preset.label) : (isRTL ? 'آخر 30 يوم' : 'Last 30 days');
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Filter className="w-4 h-4" />
          {isRTL ? 'فترة التحليل' : 'Analysis Period'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Selection Display */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="flex items-center gap-1">
            <CalendarIcon className="w-3 h-3" />
            {getSelectedRangeLabel()}
          </Badge>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="w-3 h-3" />
          </Button>
        </div>

        {/* Preset Range Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {presetRanges.map((range) => (
            <Button
              key={range.days}
              variant={selectedRange === `${range.days}d` ? 'default' : 'outline'}
              size="sm"
              className="text-xs h-8"
              onClick={() => handlePresetSelect(`${range.days}d`)}
            >
              {isRTL ? range.labelAr : range.label}
            </Button>
          ))}
        </div>

        {/* Custom Date Range */}
        <div className="border-t pt-3">
          <Popover open={showCustomCalendar} onOpenChange={setShowCustomCalendar}>
            <PopoverTrigger asChild>
              <Button 
                variant={selectedRange === 'custom' ? 'default' : 'outline'} 
                size="sm" 
                className="w-full"
              >
                <CalendarIcon className="w-3 h-3 mr-2" />
                {isRTL ? 'تاريخ مخصص' : 'Custom Range'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3 space-y-3">
                <div className="text-sm font-medium">
                  {isRTL ? 'اختر الفترة' : 'Select Date Range'}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">
                      {isRTL ? 'من تاريخ' : 'Start Date'}
                    </label>
                    <Calendar
                      mode="single"
                      selected={customStart}
                      onSelect={setCustomStart}
                      className="rounded-md border"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-muted-foreground">
                      {isRTL ? 'إلى تاريخ' : 'End Date'}
                    </label>
                    <Calendar
                      mode="single"
                      selected={customEnd}
                      onSelect={setCustomEnd}
                      className="rounded-md border"
                      disabled={(date) => customStart ? date < customStart : false}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={handleCustomDateSelect}
                    disabled={!customStart || !customEnd}
                    className="flex-1"
                  >
                    {isRTL ? 'تطبيق' : 'Apply'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setShowCustomCalendar(false)}
                    className="flex-1"
                  >
                    {isRTL ? 'إلغاء' : 'Cancel'}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Quick Stats */}
        <div className="border-t pt-3 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>{isRTL ? 'الفترة المحددة:' : 'Selected period:'}</span>
            <span>
              {selectedRange === 'custom' && customStart && customEnd 
                ? `${Math.ceil((customEnd.getTime() - customStart.getTime()) / (1000 * 60 * 60 * 24))} ${isRTL ? 'يوم' : 'days'}`
                : presetRanges.find(r => `${r.days}d` === selectedRange)?.days + (isRTL ? ' يوم' : ' days')
              }
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};