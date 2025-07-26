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

// Function to get role rejection wait days from system settings
const getRoleRejectionWaitDays = async (): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('setting_value')
      .eq('setting_key', 'role_rejection_wait_days')
      .maybeSingle();

    if (error) throw error;
    
    return data ? 
      (typeof data.setting_value === 'string' ? parseInt(data.setting_value) : 
       typeof data.setting_value === 'number' ? data.setting_value : 30) : 30;
  } catch (error) {
    console.error('Error fetching role rejection wait days:', error);
    return 30; // fallback value
  }
};

// Function to get max role requests per week from system settings
const getMaxRoleRequestsPerWeek = async (): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('setting_value')
      .eq('setting_key', 'role_max_requests_per_week')
      .maybeSingle();

    if (error) throw error;
    
    return data ? 
      (typeof data.setting_value === 'string' ? parseInt(data.setting_value) : 
       typeof data.setting_value === 'number' ? data.setting_value : 3) : 3;
  } catch (error) {
    console.error('Error fetching max role requests per week:', error);
    return 3; // fallback value
  }
};

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

      // Check if user already has this role
      const { data: existingRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', selectedRole as any)
        .eq('is_active', true);

      if (rolesError) throw rolesError;

      if (existingRoles && existingRoles.length > 0) {
        toast.error('You already have this role assigned');
        return;
      }

      // Check for existing pending requests for the same role
      const { data: pendingRequests, error: pendingError } = await supabase
        .from('role_requests')
        .select('id')
        .eq('requester_id', user.id)
        .eq('requested_role', selectedRole as any)
        .eq('status', 'pending');

      if (pendingError) throw pendingError;

      if (pendingRequests && pendingRequests.length > 0) {
        toast.error('You already have a pending request for this role. Please wait for review.');
        return;
      }

      // Check if they were recently rejected for this role (within 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: recentRejections, error: rejectionError } = await supabase
        .from('role_requests')
        .select('reviewed_at')
        .eq('requester_id', user.id)
        .eq('requested_role', selectedRole as any)
        .eq('status', 'rejected')
        .gte('reviewed_at', thirtyDaysAgo.toISOString());

      if (rejectionError) throw rejectionError;

      if (recentRejections && recentRejections.length > 0) {
        const lastRejection = new Date(recentRejections[0].reviewed_at);
        const daysSince = Math.ceil((Date.now() - lastRejection.getTime()) / (1000 * 60 * 60 * 24));
        const waitDays = await getRoleRejectionWaitDays() - daysSince;
        const waitDaysRemaining = Math.max(0, waitDays);
        if (waitDaysRemaining > 0) {
          toast.error(`You must wait ${waitDaysRemaining} more days before re-requesting this role after rejection.`);
          return;
        }
      }

      // Check rate limit - configurable max requests per week
      const maxRequestsPerWeek = await getMaxRoleRequestsPerWeek();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data: recentRequests, error: rateError } = await supabase
        .from('role_requests')
        .select('id')
        .eq('requester_id', user.id)
        .gte('requested_at', oneWeekAgo.toISOString());

      if (rateError) throw rateError;

      if (recentRequests && recentRequests.length >= maxRequestsPerWeek) {
        toast.error(`You can only make ${maxRequestsPerWeek} role requests per week. Please wait before making another request.`);
        return;
      }

      // All checks passed, submit the request
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

          {/* Request Policies */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <h4 className="font-medium text-sm">Request Policies</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Maximum 3 role requests per week</li>
              <li>• Cannot request roles you already have</li>
              <li>• Cannot submit duplicate pending requests</li>
              <li>• Must wait 30 days to re-request after rejection</li>
              <li>• Administrative roles can only be assigned by system admins</li>
            </ul>
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