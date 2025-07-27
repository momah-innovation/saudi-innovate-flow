import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";

interface EventFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  formatFilter: string;
  onFormatChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  visibilityFilter: string;
  onVisibilityChange: (value: string) => void;
  dateFrom?: Date;
  onDateFromChange: (date: Date | undefined) => void;
  dateTo?: Date;
  onDateToChange: (date: Date | undefined) => void;
  selectedCampaign: string;
  onCampaignChange: (value: string) => void;
  selectedSector: string;
  onSectorChange: (value: string) => void;
  campaigns: any[];
  sectors: any[];
  onClearFilters: () => void;
  activeFiltersCount: number;
}

export function EventFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  formatFilter,
  onFormatChange,
  typeFilter,
  onTypeChange,
  categoryFilter,
  onCategoryChange,
  visibilityFilter,
  onVisibilityChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  selectedCampaign,
  onCampaignChange,
  selectedSector,
  onSectorChange,
  campaigns,
  sectors,
  onClearFilters,
  activeFiltersCount
}: EventFiltersProps) {
  const eventTypes = [
    { value: "all", label: "All Types" },
    { value: "workshop", label: "Workshop" },
    { value: "seminar", label: "Seminar" },
    { value: "conference", label: "Conference" },
    { value: "networking", label: "Networking Event" },
    { value: "hackathon", label: "Hackathon" },
    { value: "pitch_session", label: "Pitch Session" },
    { value: "training", label: "Training Session" }
  ];

  const formatOptions = [
    { value: "all", label: "All Formats" },
    { value: "in_person", label: "In Person" },
    { value: "virtual", label: "Virtual" },
    { value: "hybrid", label: "Hybrid" }
  ];

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "scheduled", label: "Scheduled" },
    { value: "ongoing", label: "Ongoing" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "postponed", label: "Postponed" }
  ];

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "standalone", label: "Standalone Event" },
    { value: "campaign_event", label: "Campaign Event" },
    { value: "training", label: "Training" },
    { value: "workshop", label: "Workshop" }
  ];

  const visibilityOptions = [
    { value: "all", label: "All Visibility" },
    { value: "public", label: "Public" },
    { value: "private", label: "Private" },
    { value: "internal", label: "Internal" }
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Event Filters
          </CardTitle>
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{activeFiltersCount} active</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div>
          <Label htmlFor="search">Search Events</Label>
          <Input
            id="search"
            placeholder="Search by title, description, or location..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Quick Filters Row 1 */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Status</Label>
            <Select value={statusFilter} onValueChange={onStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Format</Label>
            <Select value={formatFilter} onValueChange={onFormatChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {formatOptions.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Type</Label>
            <Select value={typeFilter} onValueChange={onTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Filters Row 2 */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Category</Label>
            <Select value={categoryFilter} onValueChange={onCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Visibility</Label>
            <Select value={visibilityFilter} onValueChange={onVisibilityChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                {visibilityOptions.map((visibility) => (
                  <SelectItem key={visibility.value} value={visibility.value}>
                    {visibility.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Campaign</Label>
            <Select value={selectedCampaign} onValueChange={onCampaignChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select campaign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                {campaigns.map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date Range and Sector */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>From Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={onDateFromChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>To Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={onDateToChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Sector</Label>
            <Select value={selectedSector} onValueChange={onSectorChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {sectors.map((sector) => (
                  <SelectItem key={sector.id} value={sector.id}>
                    {sector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="border-t pt-4">
            <Label className="text-sm font-medium">Active Filters:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {searchTerm && (
                <Badge variant="outline" className="text-xs">
                  Search: "{searchTerm}"
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => onSearchChange("")}
                  />
                </Badge>
              )}
              {statusFilter !== "all" && (
                <Badge variant="outline" className="text-xs">
                  Status: {statusOptions.find(s => s.value === statusFilter)?.label}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => onStatusChange("all")}
                  />
                </Badge>
              )}
              {formatFilter !== "all" && (
                <Badge variant="outline" className="text-xs">
                  Format: {formatOptions.find(f => f.value === formatFilter)?.label}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => onFormatChange("all")}
                  />
                </Badge>
              )}
              {typeFilter !== "all" && (
                <Badge variant="outline" className="text-xs">
                  Type: {eventTypes.find(t => t.value === typeFilter)?.label}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => onTypeChange("all")}
                  />
                </Badge>
              )}
              {categoryFilter !== "all" && (
                <Badge variant="outline" className="text-xs">
                  Category: {categoryOptions.find(c => c.value === categoryFilter)?.label}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => onCategoryChange("all")}
                  />
                </Badge>
              )}
              {visibilityFilter !== "all" && (
                <Badge variant="outline" className="text-xs">
                  Visibility: {visibilityOptions.find(v => v.value === visibilityFilter)?.label}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => onVisibilityChange("all")}
                  />
                </Badge>
              )}
              {selectedCampaign !== "all" && (
                <Badge variant="outline" className="text-xs">
                  Campaign: {campaigns.find(c => c.id === selectedCampaign)?.title}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => onCampaignChange("all")}
                  />
                </Badge>
              )}
              {selectedSector !== "all" && (
                <Badge variant="outline" className="text-xs">
                  Sector: {sectors.find(s => s.id === selectedSector)?.name}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => onSectorChange("all")}
                  />
                </Badge>
              )}
              {dateFrom && (
                <Badge variant="outline" className="text-xs">
                  From: {format(dateFrom, "MMM dd, yyyy")}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => onDateFromChange(undefined)}
                  />
                </Badge>
              )}
              {dateTo && (
                <Badge variant="outline" className="text-xs">
                  To: {format(dateTo, "MMM dd, yyyy")}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => onDateToChange(undefined)}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}