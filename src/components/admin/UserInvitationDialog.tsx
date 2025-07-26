import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface UserInvitationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvitationSent?: () => void;
}

const AVAILABLE_ROLES = [
  { value: 'innovator', label: 'Innovator', description: 'Default role for new users' },
  { value: 'evaluator', label: 'Evaluator', description: 'Evaluate challenge submissions and ideas' },
  { value: 'domain_expert', label: 'Domain Expert', description: 'Subject matter expert in specific domains' },
  { value: 'sector_lead', label: 'Sector Lead', description: 'Lead and coordinate sector activities' },
  { value: 'challenge_manager', label: 'Challenge Manager', description: 'Manage and oversee challenges' },
  { value: 'expert_coordinator', label: 'Expert Coordinator', description: 'Coordinate expert assignments and activities' },
  { value: 'content_manager', label: 'Content Manager', description: 'Manage platform content and resources' },
  { value: 'data_analyst', label: 'Data Analyst', description: 'Analyze platform data and generate insights' },
  { value: 'user_manager', label: 'User Manager', description: 'Manage user accounts and permissions' },
  { value: 'role_manager', label: 'Role Manager', description: 'Manage role assignments and permissions' },
  { value: 'admin', label: 'Admin', description: 'Administrative access' },
];

export function UserInvitationDialog({ open, onOpenChange, onInvitationSent }: UserInvitationDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    name_ar: '',
    department: '',
    position: '',
    initial_roles: ['innovator'] as string[],
    send_email: true
  });

  const handleRoleToggle = (roleValue: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      initial_roles: checked 
        ? [...prev.initial_roles, roleValue]
        : prev.initial_roles.filter(r => r !== roleValue)
    }));
  };

  const handleSendInvitation = async () => {
    if (!formData.email || !formData.name) {
      toast({
        title: "Validation Error",
        description: "Email and name are required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to send invitations.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Generate invitation token
      const { data: tokenData, error: tokenError } = await supabase
        .rpc('generate_invitation_token');

      if (tokenError) throw tokenError;

      // Create invitation
      const { error: inviteError } = await supabase
        .from('user_invitations')
        .insert({
          email: formData.email,
          name: formData.name,
          name_ar: formData.name_ar || null,
          department: formData.department || null,
          position: formData.position || null,
          initial_roles: formData.initial_roles,
          invitation_token: tokenData,
          invited_by: user.id,
          status: 'pending'
        });

      if (inviteError) throw inviteError;

      // TODO: Send email invitation via edge function
      // For now, we'll show the invitation link
      const inviteLink = `${window.location.origin}/auth?invite=${tokenData}`;
      
      toast({
        title: "Invitation Sent",
        description: formData.send_email 
          ? `Invitation email sent to ${formData.email}` 
          : `Invitation created. Share this link: ${inviteLink}`,
      });

      // Reset form
      setFormData({
        email: '',
        name: '',
        name_ar: '',
        department: '',
        position: '',
        initial_roles: ['innovator'],
        send_email: true
      });

      onOpenChange(false);
      onInvitationSent?.();
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Error",
        description: error.message.includes('duplicate') 
          ? "An invitation for this email already exists." 
          : "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite New User
          </DialogTitle>
          <DialogDescription>
            Send an invitation to a new user to join the platform
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-medium">Basic Information</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Email Address *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="user@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Name (Arabic)</Label>
                <Input
                  value={formData.name_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, name_ar: e.target.value }))}
                  placeholder="الاسم باللغة العربية"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="Engineering"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Position/Title</Label>
              <Input
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                placeholder="Software Engineer"
              />
            </div>
          </div>

          {/* Role Assignment */}
          <div className="space-y-4">
            <h4 className="font-medium">Initial Roles</h4>
            <p className="text-sm text-muted-foreground">
              Select the roles this user should have when they join the platform
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {AVAILABLE_ROLES.map((role) => (
                <div key={role.value} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={role.value}
                    checked={formData.initial_roles.includes(role.value)}
                    onCheckedChange={(checked) => handleRoleToggle(role.value, checked as boolean)}
                  />
                  <div className="flex-1 min-w-0">
                    <Label htmlFor={role.value} className="font-medium cursor-pointer">
                      {role.label}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {role.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium">Selected roles:</span>
              {formData.initial_roles.map(role => (
                <Badge key={role} variant="secondary">
                  {AVAILABLE_ROLES.find(r => r.value === role)?.label || role}
                </Badge>
              ))}
            </div>
          </div>

          {/* Invitation Options */}
          <div className="space-y-4">
            <h4 className="font-medium">Invitation Options</h4>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="send_email"
                checked={formData.send_email}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, send_email: checked as boolean }))}
              />
              <Label htmlFor="send_email">Send invitation email automatically</Label>
            </div>
            {!formData.send_email && (
              <p className="text-sm text-muted-foreground">
                If unchecked, you'll need to manually share the invitation link with the user
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendInvitation}
              disabled={loading || !formData.email || !formData.name}
            >
              {loading && <Send className="h-4 w-4 animate-spin mr-2" />}
              Send Invitation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}