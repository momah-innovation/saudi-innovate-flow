import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, ChevronDown, RotateCcw } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { format, subDays, subMonths, startOfDay, endOfDay } from 'date-fns';
import { cn } from '@/lib/utils';

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
    
    if (rangeKey === 'custom') {
      setShowCustomCalendar(true);
      return;
    }
    
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
    <div className={cn("flex items-center gap-3", className)}>
      {/* Period Label with Icon */}
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>{isRTL ? 'فترة التحليل' : 'Analysis Period'}</span>
      </div>

      {/* Main Period Selector */}
      <div className="flex items-center gap-2">
        <Select value={selectedRange} onValueChange={handlePresetSelect}>
          <SelectTrigger className="w-40 h-9">
            <SelectValue>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                <span className="text-sm">{getSelectedRangeLabel()}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {presetRanges.map((range) => (
              <SelectItem key={range.days} value={`${range.days}d`}>
                {isRTL ? range.labelAr : range.label}
              </SelectItem>
            ))}
            <SelectItem value="custom">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                {isRTL ? 'تاريخ مخصص' : 'Custom Range'}
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Custom Date Range Popover */}
        <Popover open={showCustomCalendar} onOpenChange={setShowCustomCalendar}>
          <PopoverTrigger asChild>
            <div /> {/* Hidden trigger since it's handled by Select */}
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="p-4 space-y-4">
              <div className="text-sm font-medium border-b pb-2">
                {isRTL ? 'اختر الفترة المخصصة' : 'Select Custom Date Range'}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground block mb-2">
                    {isRTL ? 'من تاريخ' : 'Start Date'}
                  </label>
                  <Calendar
                    mode="single"
                    selected={customStart}
                    onSelect={setCustomStart}
                    className="p-0 pointer-events-auto"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-muted-foreground block mb-2">
                    {isRTL ? 'إلى تاريخ' : 'End Date'}
                  </label>
                  <Calendar
                    mode="single"
                    selected={customEnd}
                    onSelect={setCustomEnd}
                    className="p-0 pointer-events-auto"
                    disabled={(date) => !customStart || date < customStart}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-2 border-t">
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

        {/* Reset Button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleReset}
          className="h-9 px-2"
          title={isRTL ? 'إعادة تعيين' : 'Reset'}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Selected Period Info */}
      <Badge variant="secondary" className="text-xs">
        {selectedRange === 'custom' && customStart && customEnd 
          ? `${Math.ceil((customEnd.getTime() - customStart.getTime()) / (1000 * 60 * 60 * 24))} ${isRTL ? 'يوم' : 'days'}`
          : presetRanges.find(r => `${r.days}d` === selectedRange)?.days + (isRTL ? ' يوم' : ' days')
        }
      </Badge>
    </div>
  );
};