import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ParticipantManagement } from "@/components/events/ParticipantManagement";
import { Header } from "@/components/layout/Header";
import { AppSidebar } from "@/components/layout/Sidebar";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  max_participants?: number;
}

export default function ParticipantManagementPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('id, title, max_participants')
        .eq('id', eventId)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event:', error);
      toast({
        title: "Error",
        description: "Failed to load event details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar activeTab="events" onTabChange={() => {}} />
          <div className="flex-1 flex flex-col">
            <Header />
            <div className="flex items-center gap-4 px-6 py-3 border-b bg-background/95">
              <SidebarTrigger />
              <BreadcrumbNav activeTab="events" />
            </div>
            <main className="flex-1 overflow-auto">
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading event...</p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (!event) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar activeTab="events" onTabChange={() => {}} />
          <div className="flex-1 flex flex-col">
            <Header />
            <div className="flex items-center gap-4 px-6 py-3 border-b bg-background/95">
              <SidebarTrigger />
              <BreadcrumbNav activeTab="events" />
            </div>
            <main className="flex-1 overflow-auto">
              <div className="text-center p-8">
                <p className="text-muted-foreground">Event not found</p>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar activeTab="events" onTabChange={() => {}} />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex items-center gap-4 px-6 py-3 border-b bg-background/95">
            <SidebarTrigger />
            <BreadcrumbNav activeTab="events" />
          </div>
          <main className="flex-1 overflow-auto p-6">
            <ParticipantManagement 
              eventId={event.id}
              eventTitle={event.title}
              maxParticipants={event.max_participants}
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}