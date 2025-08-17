import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useScheduleData, ScheduleEvent, Calendar, Resource } from '@/hooks/useScheduleData';
import { DataTable, Column } from '@/components/ui/data-table';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Plus,
  Search,
  Filter,
  Download
} from 'lucide-react';

function ScheduleManagement() {
  const {
    events,
    calendars,
    resources,
    selectedCalendar,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    createCalendar,
    setSelectedCalendar,
    searchEvents,
    filterEventsByDateRange,
    getScheduleStats
  } = useScheduleData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'meeting' | 'appointment' | 'task' | 'reminder'>('all');
  const [activeTab, setActiveTab] = useState('events');

  const stats = getScheduleStats();

  // Filter events based on search and filters
  const filteredEvents = events.filter(event => {
    const matchesSearch = searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const eventColumns: Column<ScheduleEvent>[] = [
    { key: 'title', title: 'Title' },
    { key: 'type', title: 'Type' },
    { key: 'start_time', title: 'Start Time' },
    { key: 'status', title: 'Status' },
    { key: 'location', title: 'Location' }
  ];

  const calendarColumns: Column<Calendar>[] = [
    { key: 'name', title: 'Name' },
    { key: 'visibility', title: 'Visibility' },
    { key: 'owner_id', title: 'Owner' },
    { key: 'created_at', title: 'Created' }
  ];

  const resourceColumns: Column<Resource>[] = [
    { key: 'name', title: 'Name' },
    { key: 'type', title: 'Type' },
    { key: 'availability', title: 'Availability' },
    { key: 'location', title: 'Location' }
  ];

  const handleCreateEvent = async () => {
    try {
      await createEvent({
        title: 'New Event',
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
        attendees: [],
        type: 'meeting',
        status: 'scheduled'
      });
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleCreateCalendar = async () => {
    try {
      await createCalendar({
        name: 'New Calendar',
        color: '#3B82F6',
        is_default: false,
        visibility: 'private',
        owner_id: 'current_user'
      });
    } catch (error) {
      console.error('Failed to create calendar:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule Management</h1>
          <p className="text-muted-foreground">
            Manage events, calendars, and resource bookings
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {}}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleCreateEvent}>
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_events}</div>
            <p className="text-xs text-muted-foreground">
              All scheduled events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcoming_events}</div>
            <p className="text-xs text-muted-foreground">
              Events this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.completion_rate)}%</div>
            <p className="text-xs text-muted-foreground">
              Tasks completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.utilization_rate)}%</div>
            <p className="text-xs text-muted-foreground">
              Resource usage
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="calendars">Calendars</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Event Management
              </CardTitle>
              <CardDescription>
                Create, manage, and track scheduled events and appointments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters and Search */}
              <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as typeof typeFilter)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="appointment">Appointment</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DataTable
                columns={eventColumns}
                data={filteredEvents}
                loading={loading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendars" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Calendar Management
              </CardTitle>
              <CardDescription>
                Manage multiple calendars and organize events by category
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Available Calendars</h3>
                  <p className="text-sm text-muted-foreground">
                    {calendars.length} calendars configured
                  </p>
                </div>
                <Button onClick={handleCreateCalendar}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Calendar
                </Button>
              </div>

              <DataTable
                columns={calendarColumns}
                data={calendars}
                loading={loading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Resource Management
              </CardTitle>
              <CardDescription>
                Manage bookable resources like rooms, equipment, and vehicles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Available Resources</h3>
                  <p className="text-sm text-muted-foreground">
                    {resources.length} resources available for booking
                  </p>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Resource
                </Button>
              </div>

              <DataTable
                columns={resourceColumns}
                data={resources}
                loading={loading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Schedule Analytics
              </CardTitle>
              <CardDescription>
                View scheduling patterns and resource utilization metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Event Distribution</h3>
                  <div className="space-y-2">
                    {['meeting', 'appointment', 'task', 'reminder'].map(type => {
                      const count = events.filter(e => e.type === type).length;
                      const percentage = events.length > 0 ? (count / events.length) * 100 : 0;
                      
                      return (
                        <div key={type} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{type}</Badge>
                            <span className="text-sm">{count} events</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {Math.round(percentage)}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Resource Utilization</h3>
                  <div className="space-y-2">
                    {resources.map(resource => (
                      <div key={resource.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{resource.name}</span>
                          <Badge 
                            variant={resource.availability === 'available' ? 'default' : 'secondary'}
                          >
                            {resource.availability}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {resource.type}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ScheduleManagement;