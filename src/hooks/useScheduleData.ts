import { useState, useCallback } from 'react';

export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  attendees: string[];
  type: 'meeting' | 'appointment' | 'task' | 'reminder';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  recurring?: {
    pattern: 'daily' | 'weekly' | 'monthly' | 'yearly';
    end_date?: string;
    interval: number;
  };
  created_at: string;
  updated_at: string;
}

export interface Calendar {
  id: string;
  name: string;
  description?: string;
  color: string;
  is_default: boolean;
  visibility: 'public' | 'private' | 'shared';
  owner_id: string;
  created_at: string;
}

export interface Resource {
  id: string;
  name: string;
  type: 'room' | 'equipment' | 'vehicle' | 'person';
  capacity?: number;
  location?: string;
  availability: 'available' | 'busy' | 'maintenance';
  booking_rules: {
    advance_notice_hours: number;
    max_duration_hours: number;
    requires_approval: boolean;
  };
}

export interface ScheduleStats {
  total_events: number;
  upcoming_events: number;
  overdue_events: number;
  completion_rate: number;
  utilization_rate: number;
}

// Mock data
const mockEvents: ScheduleEvent[] = [
  {
    id: '1',
    title: 'Team Standup',
    description: 'Daily team synchronization meeting',
    start_time: '2025-01-18T09:00:00Z',
    end_time: '2025-01-18T09:30:00Z',
    location: 'Conference Room A',
    attendees: ['user1', 'user2', 'user3'],
    type: 'meeting',
    status: 'scheduled',
    recurring: {
      pattern: 'daily',
      interval: 1,
      end_date: '2025-12-31T23:59:59Z'
    },
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-17T12:00:00Z'
  },
  {
    id: '2',
    title: 'Client Presentation',
    description: 'Quarterly business review with key client',
    start_time: '2025-01-20T14:00:00Z',
    end_time: '2025-01-20T15:30:00Z',
    location: 'Boardroom',
    attendees: ['user1', 'client1', 'client2'],
    type: 'meeting',
    status: 'scheduled',
    created_at: '2025-01-10T00:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  },
  {
    id: '3',
    title: 'System Maintenance',
    description: 'Scheduled server maintenance window',
    start_time: '2025-01-22T02:00:00Z',
    end_time: '2025-01-22T04:00:00Z',
    location: 'Data Center',
    attendees: ['admin1', 'tech1'],
    type: 'task',
    status: 'scheduled',
    created_at: '2025-01-05T00:00:00Z',
    updated_at: '2025-01-17T08:00:00Z'
  }
];

const mockCalendars: Calendar[] = [
  {
    id: '1',
    name: 'Company Calendar',
    description: 'Main company calendar for all employees',
    color: '#3B82F6',
    is_default: true,
    visibility: 'shared',
    owner_id: 'admin',
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Project Alpha',
    description: 'Calendar for Project Alpha team',
    color: '#10B981',
    is_default: false,
    visibility: 'private',
    owner_id: 'pm1',
    created_at: '2025-01-05T00:00:00Z'
  }
];

const mockResources: Resource[] = [
  {
    id: '1',
    name: 'Conference Room A',
    type: 'room',
    capacity: 12,
    location: 'Floor 2',
    availability: 'available',
    booking_rules: {
      advance_notice_hours: 2,
      max_duration_hours: 8,
      requires_approval: false
    }
  },
  {
    id: '2',
    name: 'Projector Cart',
    type: 'equipment',
    location: 'Equipment Room',
    availability: 'available',
    booking_rules: {
      advance_notice_hours: 1,
      max_duration_hours: 24,
      requires_approval: true
    }
  }
];

export function useScheduleData() {
  const [events, setEvents] = useState<ScheduleEvent[]>(mockEvents);
  const [calendars, setCalendars] = useState<Calendar[]>(mockCalendars);
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [selectedCalendar, setSelectedCalendar] = useState<string>('1');
  const [loading, setLoading] = useState(false);

  // Event operations
  const createEvent = useCallback(async (eventData: Omit<ScheduleEvent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      
      const newEvent: ScheduleEvent = {
        ...eventData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEvent = useCallback(async (id: string, updates: Partial<ScheduleEvent>) => {
    try {
      setLoading(true);
      
      setEvents(prev => prev.map(event => 
        event.id === id 
          ? { ...event, ...updates, updated_at: new Date().toISOString() }
          : event
      ));
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEvent = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setEvents(prev => prev.filter(event => event.id !== id));
    } catch (error) {
      errorHandler.handleError(error, 'useScheduleData', 'deleteEvent');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Calendar operations
  const createCalendar = useCallback(async (calendarData: Omit<Calendar, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      
      const newCalendar: Calendar = {
        ...calendarData,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      };

      setCalendars(prev => [...prev, newCalendar]);
      return newCalendar;
    } catch (error) {
      errorHandler.handleError(error, 'useScheduleData', 'createCalendar');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Resource operations
  const bookResource = useCallback(async (resourceId: string, eventId: string, startTime: string, endTime: string) => {
    try {
      setLoading(true);
      
      // Check availability and booking rules
      const resource = resources.find(r => r.id === resourceId);
      if (!resource) {
        throw new Error('Resource not found');
      }

      if (resource.availability !== 'available') {
        throw new Error('Resource is not available');
      }

      // Mark resource as busy (simplified)
      setResources(prev => prev.map(r => 
        r.id === resourceId 
          ? { ...r, availability: 'busy' as const }
          : r
      ));

      return { success: true, bookingId: Date.now().toString() };
    } catch (error) {
      errorHandler.handleError(error, 'useScheduleData', 'bookResource');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [resources]);

  // Search and filter functions
  const searchEvents = useCallback((query: string) => {
    if (!query.trim()) return events;
    
    const lowercaseQuery = query.toLowerCase();
    return events.filter(event => 
      event.title.toLowerCase().includes(lowercaseQuery) ||
      event.description?.toLowerCase().includes(lowercaseQuery) ||
      event.location?.toLowerCase().includes(lowercaseQuery)
    );
  }, [events]);

  const filterEventsByDateRange = useCallback((startDate: string, endDate: string) => {
    return events.filter(event => {
      const eventStart = new Date(event.start_time);
      const rangeStart = new Date(startDate);
      const rangeEnd = new Date(endDate);
      
      return eventStart >= rangeStart && eventStart <= rangeEnd;
    });
  }, [events]);

  const getAvailableResources = useCallback((startTime: string, endTime: string) => {
    // Simplified availability check
    return resources.filter(resource => resource.availability === 'available');
  }, [resources]);

  // Analytics and stats
  const getScheduleStats = useCallback((): ScheduleStats => {
    const now = new Date();
    const totalEvents = events.length;
    const upcomingEvents = events.filter(e => new Date(e.start_time) > now).length;
    const overdueEvents = events.filter(e => 
      new Date(e.end_time) < now && e.status !== 'completed'
    ).length;
    const completedEvents = events.filter(e => e.status === 'completed').length;
    
    return {
      total_events: totalEvents,
      upcoming_events: upcomingEvents,
      overdue_events: overdueEvents,
      completion_rate: totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0,
      utilization_rate: Math.min((totalEvents / 100) * 100, 100) // Simplified calculation
    };
  }, [events]);

  return {
    // Data
    events,
    calendars,
    resources,
    selectedCalendar,
    loading,

    // Event operations
    createEvent,
    updateEvent,
    deleteEvent,
    
    // Calendar operations
    createCalendar,
    setSelectedCalendar,
    
    // Resource operations
    bookResource,
    getAvailableResources,
    
    // Search and filter
    searchEvents,
    filterEventsByDateRange,
    
    // Analytics
    getScheduleStats
  };
}