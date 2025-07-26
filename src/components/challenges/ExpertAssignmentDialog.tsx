import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, UserPlus } from "lucide-react";

interface Expert {
  id: string;
  user_id: string;
  expertise_areas: string[];
  expert_level: string;
  profiles?: {
    name: string;
    email: string;
  } | null;
}

interface ExpertAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challengeId: string;
  onAssignmentComplete: () => void;
}

export function ExpertAssignmentDialog({ 
  open, 
  onOpenChange, 
  challengeId,
  onAssignmentComplete 
}: ExpertAssignmentDialogProps) {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [selectedExpertId, setSelectedExpertId] = useState<string>("");
  const [roleType, setRoleType] = useState<string>("evaluator");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingExperts, setFetchingExperts] = useState(true);

  useEffect(() => {
    if (open) {
      fetchAvailableExperts();
    }
  }, [open, challengeId]);

  const fetchAvailableExperts = async () => {
    try {
      setFetchingExperts(true);
      
      // Get all experts
      const { data: allExperts, error: expertsError } = await supabase
        .from('experts')
        .select('id, user_id, expertise_areas, expert_level');

      if (expertsError) throw expertsError;

      // Get already assigned experts for this challenge
      const { data: assignedExperts, error: assignedError } = await supabase
        .from('challenge_experts')
        .select('expert_id')
        .eq('challenge_id', challengeId)
        .eq('status', 'active');

      if (assignedError) throw assignedError;

      const assignedExpertIds = assignedExperts?.map(ae => ae.expert_id) || [];
      
      // Filter out already assigned experts
      const availableExpertIds = (allExperts || [])
        .filter(expert => !assignedExpertIds.includes(expert.id))
        .map(expert => expert.user_id);

      if (availableExpertIds.length === 0) {
        setExperts([]);
        return;
      }

      // Get profiles for available experts
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email')
        .in('id', availableExpertIds);

      if (profilesError) throw profilesError;

      // Combine experts with their profiles
      const expertsWithProfiles = (allExperts || [])
        .filter(expert => !assignedExpertIds.includes(expert.id))
        .map(expert => {
          const profile = (profiles || []).find(p => p.id === expert.user_id);
          return {
            id: expert.id,
            user_id: expert.user_id,
            expertise_areas: expert.expertise_areas || [],
            expert_level: expert.expert_level || '',
            profiles: profile ? {
              name: profile.name,
              email: profile.email
            } : null
          };
        });

      setExperts(expertsWithProfiles);
    } catch (error) {
      console.error('Error fetching experts:', error);
      toast.error('Failed to load available experts');
    } finally {
      setFetchingExperts(false);
    }
  };

  const handleAssignExpert = async () => {
    if (!selectedExpertId) {
      toast.error('Please select an expert');
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from('challenge_experts')
        .insert({
          challenge_id: challengeId,
          expert_id: selectedExpertId,
          role_type: roleType,
          notes: notes.trim() || null,
          status: 'active'
        });

      if (error) throw error;

      toast.success('Expert assigned successfully');
      onAssignmentComplete();
      onOpenChange(false);
      
      // Reset form
      setSelectedExpertId("");
      setRoleType("evaluator");
      setNotes("");
    } catch (error) {
      console.error('Error assigning expert:', error);
      toast.error('Failed to assign expert');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Assign Expert to Challenge
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {fetchingExperts ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading available experts...</span>
            </div>
          ) : experts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No available experts found. All experts may already be assigned to this challenge.
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Expert</label>
                <Select value={selectedExpertId} onValueChange={setSelectedExpertId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an expert..." />
                  </SelectTrigger>
                  <SelectContent>
                    {experts.map((expert) => (
                      <SelectItem key={expert.id} value={expert.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {expert.profiles?.name || 'Unknown'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {expert.expert_level} • {expert.expertise_areas.join(', ')}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Role Type</label>
                <Select value={roleType} onValueChange={setRoleType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="evaluator">Evaluator</SelectItem>
                    <SelectItem value="mentor">Mentor</SelectItem>
                    <SelectItem value="advisor">Advisor</SelectItem>
                    <SelectItem value="reviewer">Reviewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (Optional)</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any specific instructions or notes for this assignment..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAssignExpert}
                  disabled={loading || !selectedExpertId}
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Assign Expert
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}