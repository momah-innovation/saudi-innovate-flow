import React, { useState } from 'react';
import { CalendarIcon, Clock, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  showTime?: boolean;
  disabled?: boolean;
  className?: string;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder,
  showTime = false,
  disabled = false,
  className
}: DateTimePickerProps) {
  const { t } = useUnifiedTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState({
    hours: value?.getHours() || 9,
    minutes: value?.getMinutes() || 0
  });

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date);
      if (showTime) {
        newDate.setHours(selectedTime.hours, selectedTime.minutes);
      }
      onChange(newDate);
    } else {
      onChange(undefined);
    }
    
    if (!showTime) {
      setIsOpen(false);
    }
  };

  const handleTimeChange = (hours: number, minutes: number) => {
    setSelectedTime({ hours, minutes });
    if (value) {
      const newDate = new Date(value);
      newDate.setHours(hours, minutes);
      onChange(newDate);
    }
  };

  const formatDateTime = (date: Date) => {
    if (showTime) {
      return format(date, "PPP 'at' p");
    }
    return format(date, "PPP");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? formatDateTime(value) : (placeholder || t('ui.date_picker.pick_date'))}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="space-y-3">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            initialFocus
            className="p-3 pointer-events-auto"
          />
          
          {showTime && (
            <div className="border-t p-3 space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{t('ui.date_picker.time')}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Select
                  value={selectedTime.hours.toString()}
                  onValueChange={(value) => handleTimeChange(parseInt(value), selectedTime.minutes)}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i.toString().padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <span className="text-muted-foreground">:</span>
                
                <Select
                  value={selectedTime.minutes.toString()}
                  onValueChange={(value) => handleTimeChange(selectedTime.hours, parseInt(value))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i.toString().padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end">
                <Button size="sm" onClick={() => setIsOpen(false)}>
                  {t('ui.date_picker.done')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  placeholder,
  className
}: DateRangePickerProps) {
  const { t } = useUnifiedTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const formatRange = () => {
    if (startDate && endDate) {
      return `${format(startDate, "LLL dd")} - ${format(endDate, "LLL dd, y")}`;
    }
    if (startDate) {
      return `${format(startDate, "LLL dd, y")} - End date`;
    }
    return placeholder || t('ui.date_picker.pick_date_range');
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !startDate && !endDate && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="grid grid-cols-2 gap-3 p-3">
          <div className="space-y-2">
            <p className="text-sm font-medium">{t('ui.date_picker.start_date')}</p>
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={onStartDateChange}
              className="pointer-events-auto"
            />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">{t('ui.date_picker.end_date')}</p>
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={onEndDateChange}
              disabled={(date) => startDate ? date < startDate : false}
              className="pointer-events-auto"
            />
          </div>
        </div>
        
        <div className="border-t p-3 flex justify-end">
          <Button size="sm" onClick={() => setIsOpen(false)}>
            {t('ui.date_picker.apply_range')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}