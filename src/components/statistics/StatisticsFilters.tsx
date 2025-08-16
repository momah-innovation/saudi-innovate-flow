import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Filter, X, Download } from 'lucide-react';
import { dateHandler } from '@/utils/unified-date-handler';
import { cn } from '@/lib/utils';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

interface StatisticsFiltersProps {
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  dateRange: { from?: Date; to?: Date };
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void;
  selectedDepartments: string[];
  onDepartmentChange: (departments: string[]) => void;
  selectedSectors: string[];
  onSectorChange: (sectors: string[]) => void;
  departments: any[];
  sectors: any[];
  onExport: () => void;
  onReset: () => void;
}

export function StatisticsFilters({
  timeRange,
  onTimeRangeChange,
  dateRange,
  onDateRangeChange,
  selectedDepartments,
  onDepartmentChange,
  selectedSectors,
  onSectorChange,
  departments,
  sectors,
  onExport,
  onReset
}: StatisticsFiltersProps) {
  const { t } = useUnifiedTranslation();
  const hasActiveFilters = timeRange !== 'all' || selectedDepartments.length > 0 || selectedSectors.length > 0 || dateRange.from || dateRange.to;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Analytics Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Time Range Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Time Range</label>
            <Select value={timeRange} onValueChange={onTimeRangeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 3 Months</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Date Range */}
          {timeRange === 'custom' && (
            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {dateHandler.formatDate(dateRange.from, "LLL dd, y")} -{" "}
                          {dateHandler.formatDate(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        dateHandler.formatDate(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange as any}
                    onSelect={(range: any) => onDateRangeChange(range || {})}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Department Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Departments</label>
            <Select
              value={selectedDepartments[0] || ""}
              onValueChange={(value) => {
                if (value && !selectedDepartments.includes(value)) {
                  onDepartmentChange([...selectedDepartments, value]);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('statistics.filters.select_departments', 'Select departments')} />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name_ar || dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sector Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Sectors</label>
            <Select
              value={selectedSectors[0] || ""}
              onValueChange={(value) => {
                if (value && !selectedSectors.includes(value)) {
                  onSectorChange([...selectedSectors, value]);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('statistics.filters.select_sectors', 'Select sectors')} />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((sector) => (
                  <SelectItem key={sector.id} value={sector.id}>
                    {sector.name_ar || sector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">Active Filters:</span>
            
            {timeRange !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {timeRange}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => onTimeRangeChange('all')}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            )}

            {selectedDepartments.map((deptId) => {
              const dept = departments.find(d => d.id === deptId);
              return dept ? (
                <Badge key={deptId} variant="secondary" className="gap-1">
                  {dept.name_ar || dept.name}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => onDepartmentChange(selectedDepartments.filter(id => id !== deptId))}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ) : null;
            })}

            {selectedSectors.map((sectorId) => {
              const sector = sectors.find(s => s.id === sectorId);
              return sector ? (
                <Badge key={sectorId} variant="secondary" className="gap-1">
                  {sector.name_ar || sector.name}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => onSectorChange(selectedSectors.filter(id => id !== sectorId))}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ) : null;
            })}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-4 border-t">
          <Button onClick={onExport} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
          
          {hasActiveFilters && (
            <Button onClick={onReset} variant="ghost" className="gap-2">
              <X className="w-4 h-4" />
              Reset Filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}