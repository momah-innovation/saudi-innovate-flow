import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { UserPlus, Send } from "lucide-react";

interface RoleRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRoles: string[];
  onRequestSubmitted?: () => void;
}

const AVAILABLE_ROLES = [
  { value: 'evaluator', label: 'Evaluator', description: 'Evaluate challenge submissions and ideas' },
  { value: 'domain_expert', label: 'Domain Expert', description: 'Subject matter expert in specific domains' },
];

// Internal/Administrative roles that can only be assigned by system admins
const INTERNAL_ROLES = [
  'sector_lead',           // Leadership role - should be admin assigned
  'challenge_manager',     // Management role - should be admin assigned  
  'expert_coordinator',    // Coordination role - should be admin assigned
  'content_manager',       // Management role - should be admin assigned
  'data_analyst',         // Administrative role - should be admin assigned
  'user_manager',         // System admin role
  'role_manager',         // System admin role
  'admin',               // System admin role
  'super_admin'          // System admin role
];

export function RoleRequestDialog({ open, onOpenChange, currentRoles, onRequestSubmitted }: RoleRequestDialogProps) {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState("");
  const [reason, setReason] = useState("");
  const [justification, setJustification] = useState("");
  const [loading, setLoading] = useState(false);

  // Filter out roles user already has
  const availableRoles = AVAILABLE_ROLES.filter(role => !currentRoles.includes(role.value));

  const handleSubmitRequest = async () => {
    if (!selectedRole || !reason || !justification) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to request a role');
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from('role_requests')
        .insert({
          requester_id: user.id,
          requested_role: selectedRole as any,
          current_roles: currentRoles as any,
          reason: reason,
          justification: justification,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Role request submitted successfully! An administrator will review your request.');
      
      // Reset form
      setSelectedRole("");
      setReason("");
      setJustification("");
      onOpenChange(false);
      onRequestSubmitted?.();
    } catch (error) {
      console.error('Error submitting role request:', error);
      toast.error('Failed to submit role request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Request Additional Role
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Roles */}
          <div>
            <Label className="text-sm font-medium">Current Roles</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {currentRoles.length > 0 ? (
                currentRoles.map((role) => (
                  <Badge key={role} variant="secondary">
                    {role.replace('_', ' ')}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No additional roles assigned</span>
              )}
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label>Requested Role *</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select the role you want to request..." />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{role.label}</span>
                      <span className="text-xs text-muted-foreground">{role.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableRoles.length === 0 && (
              <p className="text-sm text-muted-foreground">
                You already have all available roles that can be requested. Internal system roles (like User Manager, Role Manager, Admin) can only be assigned by system administrators.
              </p>
            )}
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label>Reason for Request *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select why you need this role..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expertise">I have relevant expertise in this area</SelectItem>
                <SelectItem value="experience">I have professional experience in this field</SelectItem>
                <SelectItem value="contribution">I want to contribute more to the platform</SelectItem>
                <SelectItem value="responsibility">I'm ready to take on additional responsibilities</SelectItem>
                <SelectItem value="team_needs">My team/organization needs this role</SelectItem>
                <SelectItem value="other">Other (please explain in justification)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Justification */}
          <div className="space-y-2">
            <Label>Justification *</Label>
            <Textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Please provide detailed justification for why you should be granted this role. Include your relevant experience, qualifications, and how you plan to use this role to contribute to the platform..."
              className="min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground">
              Provide specific examples of your experience and how you'll use this role responsibly.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitRequest}
              disabled={loading || !selectedRole || !reason || !justification || availableRoles.length === 0}
            >
              {loading && <Send className="h-4 w-4 animate-spin mr-2" />}
              Submit Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}