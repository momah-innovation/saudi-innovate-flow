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
                <SelectItem value="domain_expertise">I have specialized knowledge in specific domains/sectors</SelectItem>
                <SelectItem value="evaluation_experience">I have experience evaluating innovations, ideas, or projects</SelectItem>
                <SelectItem value="academic_background">I have relevant academic background or research experience</SelectItem>
                <SelectItem value="industry_experience">I have relevant industry or professional experience</SelectItem>
                <SelectItem value="certification">I hold relevant certifications or qualifications</SelectItem>
                <SelectItem value="volunteer_contribution">I want to volunteer my expertise to help evaluate and guide innovations</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Justification */}
          <div className="space-y-2">
            <Label>Justification *</Label>
            <Textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Please provide detailed information about your qualifications for this role. For Domain Expert: List your areas of expertise, education, certifications, and relevant experience. For Evaluator: Describe your experience evaluating projects, innovations, or similar work. Include specific examples and how you plan to contribute to the platform..."
              className="min-h-[140px]"
            />
            <p className="text-xs text-muted-foreground">
              Be specific about your expertise areas, qualifications, experience level, and any certifications you hold.
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