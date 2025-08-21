import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, ChevronDown, RotateCcw } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { dateHandler } from '@/utils/unified-date-handler';
import { subDays, subMonths, startOfDay, endOfDay } from 'date-fns';
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
  const { t } = useUnifiedTranslation();
  const [selectedRange, setSelectedRange] = useState<string>('30d');
  const [customStart, setCustomStart] = useState<Date | undefined>();
  const [customEnd, setCustomEnd] = useState<Date | undefined>();
  const [showCustomCalendar, setShowCustomCalendar] = useState(false);

  const presetRanges: PresetRange[] = [
    {
      label: t('opportunities:time_range.last_7_days'),
      labelAr: t('opportunities:time_range.last_7_days'),
      days: 7,
      getValue: () => ({ start: startOfDay(subDays(new Date(), 7)), end: endOfDay(new Date()) })
    },
    {
      label: t('opportunities:time_range.last_30_days'),
      labelAr: t('opportunities:time_range.last_30_days'),
      days: 30,
      getValue: () => ({ start: startOfDay(subDays(new Date(), 30)), end: endOfDay(new Date()) })
    },
    {
      label: t('opportunities:time_range.last_3_months'),
      labelAr: t('opportunities:time_range.last_3_months'),
      days: 90,
      getValue: () => ({ start: startOfDay(subMonths(new Date(), 3)), end: endOfDay(new Date()) })
    },
    {
      label: t('opportunities:time_range.last_6_months'),
      labelAr: t('opportunities:time_range.last_6_months'),
      days: 180,
      getValue: () => ({ start: startOfDay(subMonths(new Date(), 6)), end: endOfDay(new Date()) })
    },
    {
      label: t('opportunities:time_range.last_year'),
      labelAr: t('opportunities:time_range.last_year'),
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
      return `${dateHandler.formatDate(customStart, 'MMM dd')} - ${dateHandler.formatDate(customEnd, 'MMM dd')}`;
    }
    
    const preset = presetRanges.find(r => `${r.days}d` === selectedRange);
    return preset ? preset.label : t('opportunities:time_range.last_30_days');
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Period Label with Icon */}
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>{t('opportunities:time_range.analysis_period')}</span>
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
                {range.label}
              </SelectItem>
            ))}
            <SelectItem value="custom">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                {t('opportunities:time_range.custom_range')}
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Custom Date Range Popover - Only render when needed */}
        {showCustomCalendar && (
          <Popover open={showCustomCalendar} onOpenChange={setShowCustomCalendar}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="sr-only">
                {t('common:aria.hidden_trigger', 'Hidden Trigger')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <div className="p-4 space-y-4">
                <div className="text-sm font-medium border-b pb-2">
                  {t('opportunities:time_range.select_custom_range')}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-2">
                      {t('opportunities:time_range.start_date')}
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
                      {t('opportunities:time_range.end_date')}
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
                    {t('opportunities:time_range.apply')}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setShowCustomCalendar(false)}
                    className="flex-1"
                  >
                    {t('opportunities:time_range.cancel')}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Reset Button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleReset}
          className="h-9 px-2"
          title={t('opportunities:time_range.reset')}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Selected Period Info */}
      <Badge variant="secondary" className="text-xs">
        {selectedRange === 'custom' && customStart && customEnd 
          ? `${Math.ceil((customEnd.getTime() - customStart.getTime()) / (1000 * 60 * 60 * 24))} ${t('opportunities:time_range.days')}`
          : presetRanges.find(r => `${r.days}d` === selectedRange)?.days + ` ${t('opportunities:time_range.days')}`
        }
      </Badge>
    </div>
  );
};
