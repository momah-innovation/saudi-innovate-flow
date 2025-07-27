import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Edit, 
  Trash2, 
  Download, 
  Copy, 
  CheckSquare, 
  Square,
  Archive,
  Calendar,
  MapPin,
  Users,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  status?: string;
  event_date: string;
  format?: string;
  location?: string;
  max_participants?: number;
}

interface EventBulkActionsProps {
  selectedEvents: string[];
  onSelectionChange: (eventIds: string[]) => void;
  events: Event[];
  onRefresh: () => void;
}

export function EventBulkActions({ 
  selectedEvents, 
  onSelectionChange, 
  events,
  onRefresh 
}: EventBulkActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [bulkAction, setBulkAction] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { toast } = useToast();

  const selectedEventData = events.filter(event => selectedEvents.includes(event.id));
  const allSelected = events.length > 0 && selectedEvents.length === events.length;
  const someSelected = selectedEvents.length > 0 && selectedEvents.length < events.length;

  const statusOptions = [
    { value: "scheduled", label: "Scheduled" },
    { value: "ongoing", label: "Ongoing" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "postponed", label: "Postponed" }
  ];

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(events.map(event => event.id));
    }
  };

  const handleBulkStatusUpdate = async () => {
    if (!newStatus || selectedEvents.length === 0) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('events')
        .update({ status: newStatus })
        .in('id', selectedEvents);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Updated status for ${selectedEvents.length} events`,
      });

      onSelectionChange([]);
      setBulkAction("");
      setNewStatus("");
      onRefresh();
    } catch (error) {
      console.error('Error updating events:', error);
      toast({
        title: "Error",
        description: "Failed to update events",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEvents.length === 0) return;

    setIsLoading(true);
    try {
      // Delete event relationships first
      await Promise.all([
        supabase.from('event_partner_links').delete().in('event_id', selectedEvents),
        supabase.from('event_stakeholder_links').delete().in('event_id', selectedEvents),
        supabase.from('event_focus_question_links').delete().in('event_id', selectedEvents),
        supabase.from('event_challenge_links').delete().in('event_id', selectedEvents),
        supabase.from('event_participants').delete().in('event_id', selectedEvents)
      ]);

      // Then delete events
      const { error } = await supabase
        .from('events')
        .delete()
        .in('id', selectedEvents);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Deleted ${selectedEvents.length} events`,
      });

      onSelectionChange([]);
      setBulkAction("");
      onRefresh();
    } catch (error) {
      console.error('Error deleting events:', error);
      toast({
        title: "Error",
        description: "Failed to delete events",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportEvents = () => {
    if (selectedEvents.length === 0) return;

    const csvContent = [
      ['Title', 'Status', 'Date', 'Format', 'Location', 'Max Participants'].join(','),
      ...selectedEventData.map(event => [
        `"${event.title}"`,
        event.status || '',
        event.event_date,
        event.format || '',
        `"${event.location || ''}"`,
        event.max_participants || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `events-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Success",
      description: `Exported ${selectedEvents.length} events to CSV`,
    });
  };

  const handleDuplicateEvents = async () => {
    if (selectedEvents.length === 0) return;

    setIsLoading(true);
    try {
      for (const eventId of selectedEvents) {
        const { data: originalEvent, error: fetchError } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (fetchError) throw fetchError;

        // Create duplicate event
        const duplicateData = {
          ...originalEvent,
          id: undefined,
          title_ar: `${originalEvent.title_ar} (نسخة)`,
          status: 'scheduled',
          registered_participants: 0,
          actual_participants: 0,
          created_at: new Date().toISOString()
        };

        const { data: newEvent, error: insertError } = await supabase
          .from('events')
          .insert(duplicateData)
          .select()
          .single();

        if (insertError) throw insertError;

        // Copy relationships
        const [partners, stakeholders, focusQuestions, challenges] = await Promise.all([
          supabase.from('event_partner_links').select('partner_id').eq('event_id', eventId),
          supabase.from('event_stakeholder_links').select('stakeholder_id').eq('event_id', eventId),
          supabase.from('event_focus_question_links').select('focus_question_id').eq('event_id', eventId),
          supabase.from('event_challenge_links').select('challenge_id').eq('event_id', eventId)
        ]);

        // Insert relationships for duplicated event
        if (partners.data?.length) {
          await supabase.from('event_partner_links').insert(
            partners.data.map(p => ({ event_id: newEvent.id, partner_id: p.partner_id }))
          );
        }
        if (stakeholders.data?.length) {
          await supabase.from('event_stakeholder_links').insert(
            stakeholders.data.map(s => ({ event_id: newEvent.id, stakeholder_id: s.stakeholder_id }))
          );
        }
        if (focusQuestions.data?.length) {
          await supabase.from('event_focus_question_links').insert(
            focusQuestions.data.map(f => ({ event_id: newEvent.id, focus_question_id: f.focus_question_id }))
          );
        }
        if (challenges.data?.length) {
          await supabase.from('event_challenge_links').insert(
            challenges.data.map(c => ({ event_id: newEvent.id, challenge_id: c.challenge_id }))
          );
        }
      }

      toast({
        title: "Success",
        description: `Duplicated ${selectedEvents.length} events`,
      });

      onSelectionChange([]);
      setBulkAction("");
      onRefresh();
    } catch (error) {
      console.error('Error duplicating events:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate events",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedEvents.length === 0) {
    return (
      <Collapsible open={!isCollapsed} onOpenChange={(open) => setIsCollapsed(!open)}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5" />
                  Bulk Actions
                </div>
                {isCollapsed ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Select events to perform bulk actions
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="mt-2"
              >
                <Square className="mr-2 h-4 w-4" />
                Select All ({events.length})
              </Button>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    );
  }

  return (
    <Collapsible open={!isCollapsed} onOpenChange={(open) => setIsCollapsed(!open)}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                Bulk Actions
                <Badge variant="secondary" className="ml-2">
                  {selectedEvents.length} selected
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectionChange([]);
                  }}
                >
                  Clear Selection
                </Button>
                {isCollapsed ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4">
        {/* Selection Status */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
          >
            {allSelected ? (
              <CheckSquare className="mr-2 h-4 w-4" />
            ) : someSelected ? (
              <Square className="mr-2 h-4 w-4 opacity-50" />
            ) : (
              <Square className="mr-2 h-4 w-4" />
            )}
            {allSelected ? "Deselect All" : "Select All"}
          </Button>
          <Badge variant="secondary">
            {selectedEvents.length} of {events.length} selected
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 p-3 bg-muted rounded-lg">
          <div className="text-center">
            <div className="text-lg font-semibold">{selectedEventData.length}</div>
            <div className="text-xs text-muted-foreground">Events</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">
              {selectedEventData.reduce((sum, event) => sum + (event.max_participants || 0), 0)}
            </div>
            <div className="text-xs text-muted-foreground">Total Capacity</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">
              {new Set(selectedEventData.map(event => event.format)).size}
            </div>
            <div className="text-xs text-muted-foreground">Formats</div>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Bulk Action</label>
            <Select value={bulkAction} onValueChange={setBulkAction}>
              <SelectTrigger>
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="update_status">Update Status</SelectItem>
                <SelectItem value="export">Export to CSV</SelectItem>
                <SelectItem value="duplicate">Duplicate Events</SelectItem>
                <SelectItem value="delete">Delete Events</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {bulkAction === "update_status" && (
            <div>
              <label className="text-sm font-medium">New Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
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
              <Button
                onClick={handleBulkStatusUpdate}
                disabled={!newStatus || isLoading}
                className="w-full mt-2"
              >
                <Edit className="mr-2 h-4 w-4" />
                {isLoading ? "Updating..." : `Update ${selectedEvents.length} Events`}
              </Button>
            </div>
          )}

          {bulkAction === "export" && (
            <Button
              onClick={handleExportEvents}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Export {selectedEvents.length} Events
            </Button>
          )}

          {bulkAction === "duplicate" && (
            <Button
              onClick={handleDuplicateEvents}
              disabled={isLoading}
              className="w-full"
            >
              <Copy className="mr-2 h-4 w-4" />
              {isLoading ? "Duplicating..." : `Duplicate ${selectedEvents.length} Events`}
            </Button>
          )}

          {bulkAction === "delete" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete {selectedEvents.length} Events
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Bulk Deletion</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete {selectedEvents.length} selected events and all their associated data including participants, relationships, and notifications. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleBulkDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isLoading ? "Deleting..." : "Delete Events"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* Selected Events Preview */}
        <div className="border-t pt-3">
          <label className="text-sm font-medium">Selected Events</label>
          <div className="max-h-32 overflow-y-auto mt-2 space-y-1">
            {selectedEventData.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span className="font-medium">{event.title}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {event.status}
                </Badge>
              </div>
            ))}
            {selectedEventData.length > 5 && (
              <div className="text-xs text-muted-foreground text-center p-2">
                ... and {selectedEventData.length - 5} more events
              </div>
            )}
          </div>
        </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}