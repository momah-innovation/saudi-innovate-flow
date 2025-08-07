import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSystemLists } from "@/hooks/useSystemLists";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { logger } from "@/utils/logger";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, UserCheck, UserX, Clock, CheckCircle, Search, Download, Send } from "lucide-react";

interface EventParticipant {
  id: string;
  event_id: string;
  user_id: string;
  registration_date: string;
  attendance_status: string;
  check_in_time?: string;
  check_out_time?: string;
  notes?: string;
  registration_type: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    name: string;
    email: string;
    position?: string;
    department?: string;
  };
}

interface ParticipantManagementProps {
  eventId: string;
  eventTitle: string;
  maxParticipants?: number;
}

export function ParticipantManagement({ eventId, eventTitle, maxParticipants }: ParticipantManagementProps) {
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<EventParticipant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  
  const { toast } = useToast();
  const { generalStatusOptions } = useSystemLists();

  const { attendanceStatusOptions } = useSystemLists();
  
  const attendanceStatuses = attendanceStatusOptions.map(status => ({
    value: status,
    label: status === 'registered' ? 'مسجل' :
           status === 'attended' ? 'حضر' :
           status === 'absent' ? 'غائب' :
           status === 'cancelled' ? 'ملغي' :
           status === 'confirmed' ? 'مؤكد' : status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
    color: status === 'attended' ? 'green' :
           status === 'registered' ? 'blue' :
           status === 'confirmed' ? 'emerald' :
           status === 'absent' ? 'gray' :
           status === 'cancelled' ? 'red' : 'blue'
  }));

  useEffect(() => {
    fetchParticipants();
  }, [eventId]);

  useEffect(() => {
    filterParticipants();
  }, [participants, searchTerm, statusFilter]);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('event_participants')
        .select(`
          *,
          profiles!inner(name, email, position, department)
        `)
        .eq('event_id', eventId)
        .order('registration_date', { ascending: false });

      if (error) throw error;
      setParticipants((data as any) || []);
    } catch (error) {
      logger.error('Error fetching participants', { 
        component: 'ParticipantManagement', 
        action: 'fetchParticipants',
        data: { eventId }
      }, error as Error);
      toast({
        title: "Error",
        description: "Failed to load participants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterParticipants = () => {
    let filtered = participants;

    if (searchTerm) {
      filtered = filtered.filter(participant =>
        participant.profiles?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participant.profiles?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participant.profiles?.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(participant => participant.attendance_status === statusFilter);
    }

    setFilteredParticipants(filtered);
  };

  const updateParticipantStatus = async (participantId: string, newStatus: string) => {
    try {
      const updateData: any = {
        attendance_status: newStatus,
        updated_at: new Date().toISOString()
      };

      // Add check-in/check-out times for attended status
      if (newStatus === 'attended') {
        updateData.check_in_time = new Date().toISOString();
      }

      const { error } = await supabase
        .from('event_participants')
        .update(updateData)
        .eq('id', participantId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Participant status updated",
      });
      
      fetchParticipants();
    } catch (error) {
      logger.error('Error updating participant status', { 
        component: 'ParticipantManagement', 
        action: 'updateParticipantStatus',
        data: { participantId, newStatus }
      }, error as Error);
      toast({
        title: "Error",
        description: "Failed to update participant status",
        variant: "destructive",
      });
    }
  };

  const bulkUpdateStatus = async (newStatus: string) => {
    try {
      const updateData: any = {
        attendance_status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (newStatus === 'attended') {
        updateData.check_in_time = new Date().toISOString();
      }

      const { error } = await supabase
        .from('event_participants')
        .update(updateData)
        .in('id', selectedParticipants);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Updated ${selectedParticipants.length} participants`,
      });
      
      setSelectedParticipants([]);
      fetchParticipants();
    } catch (error) {
      logger.error('Error bulk updating participants', { 
        component: 'ParticipantManagement', 
        action: 'bulkUpdateStatus',
        data: { selectedParticipants, newStatus }
      }, error as Error);
      toast({
        title: "Error",
        description: "Failed to update participants",
        variant: "destructive",
      });
    }
  };

  const exportParticipants = () => {
    const csv = [
      ['Name', 'Email', 'Position', 'Department', 'Status', 'Registration Date', 'Check-in Time'].join(','),
      ...filteredParticipants.map(p => [
        p.profiles?.name || '',
        p.profiles?.email || '',
        p.profiles?.position || '',
        p.profiles?.department || '',
        p.attendance_status,
        new Date(p.registration_date).toLocaleDateString(),
        p.check_in_time ? new Date(p.check_in_time).toLocaleString() : ''
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${eventTitle}-participants.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = attendanceStatuses.find(s => s.value === status);
    return (
      <Badge variant={statusConfig?.color === 'green' ? 'default' : 'secondary'}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  const registeredCount = participants.filter(p => p.attendance_status === 'registered').length;
  const confirmedCount = participants.filter(p => p.attendance_status === 'confirmed').length;
  const attendedCount = participants.filter(p => p.attendance_status === 'attended').length;
  const noShowCount = participants.filter(p => p.attendance_status === 'no_show').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading participants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Event Participants</h2>
          <p className="text-muted-foreground">{eventTitle}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportParticipants}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          {selectedParticipants.length > 0 && (
            <Dialog open={showBulkActions} onOpenChange={setShowBulkActions}>
              <DialogTrigger asChild>
                <Button>
                  Bulk Actions ({selectedParticipants.length})
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bulk Update Status</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p>Update {selectedParticipants.length} selected participants to:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {attendanceStatuses.map(status => (
                      <Button
                        key={status.value}
                        variant="outline"
                        onClick={() => {
                          bulkUpdateStatus(status.value);
                          setShowBulkActions(false);
                        }}
                      >
                        {status.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Registered</p>
              <p className="text-2xl font-bold">{participants.length}</p>
              {maxParticipants && (
                <p className="text-xs text-muted-foreground">of {maxParticipants} max</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <UserCheck className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Confirmed</p>
              <p className="text-2xl font-bold">{confirmedCount}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Attended</p>
              <p className="text-2xl font-bold">{attendedCount}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <UserX className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">No Show</p>
              <p className="text-2xl font-bold">{noShowCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search participants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {attendanceStatuses.map(status => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Participants List */}
      <Card>
        <CardHeader>
          <CardTitle>Participants ({filteredParticipants.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredParticipants.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No participants found</p>
              </div>
            ) : (
              filteredParticipants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedParticipants.includes(participant.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedParticipants([...selectedParticipants, participant.id]);
                        } else {
                          setSelectedParticipants(selectedParticipants.filter(id => id !== participant.id));
                        }
                      }}
                    />
                    <div>
                      <p className="font-medium">{participant.profiles?.name}</p>
                      <p className="text-sm text-muted-foreground">{participant.profiles?.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {participant.profiles?.position} • {participant.profiles?.department}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Registered: {new Date(participant.registration_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(participant.attendance_status)}
                    <Select
                      value={participant.attendance_status}
                      onValueChange={(value) => updateParticipantStatus(participant.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {attendanceStatuses.map(status => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}