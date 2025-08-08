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
import { useSystemLists } from "@/hooks/useSystemLists";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { logger } from "@/utils/logger";

interface UserInvitationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvitationSent?: () => void;
}

export function UserInvitationWizard({ open, onOpenChange, onInvitationSent }: UserInvitationWizardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { availableUserRoles } = useSystemLists();
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
        title: t('user_invitation_wizard.validation_error'),
        description: t('user_invitation_wizard.email_name_required'),
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: t('user_invitation_wizard.authentication_error'),
        description: t('user_invitation_wizard.must_be_logged_in'),
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

      // Send email invitation via edge function
      try {
        const { error: emailError } = await supabase.functions.invoke('send-invitation-email', {
          body: {
            to: formData.email,
            invitationToken: tokenData,
            organizerName: 'نظام رواد الابتكار',
            role: formData.initial_roles[0] || 'innovator'
          }
        });
        
        if (emailError) {
          logger.warn('Email sending failed, showing invitation link instead', { error: emailError });
        }
      } catch (emailError) {
        logger.warn('Email service unavailable, showing invitation link instead', { error: emailError });
      }

      const inviteLink = `${window.location.origin}/auth?invite=${tokenData}`;
      
      toast({
        title: t('user_invitation_wizard.invitation_sent'),
        description: formData.send_email 
          ? `${t('user_invitation_wizard.email_sent')} ${formData.email}` 
          : `${t('user_invitation_wizard.invitation_created')} ${inviteLink}`,
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "Error",
        description: errorMessage.includes('duplicate') 
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
            {t('user_invitation_wizard.title')}
          </DialogTitle>
          <DialogDescription>
            {t('user_invitation_wizard.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-medium">{t('user_invitation_wizard.basic_information')}</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('user_invitation_wizard.email_address')} *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="user@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('user_invitation_wizard.full_name')} *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('user_invitation_wizard.name_arabic')}</Label>
                <Input
                  value={formData.name_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, name_ar: e.target.value }))}
                  placeholder="الاسم باللغة العربية"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('user_invitation_wizard.department')}</Label>
                <Input
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="Engineering"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('user_invitation_wizard.position_title')}</Label>
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
              {availableUserRoles.map((role) => (
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
                  {availableUserRoles.find(r => r.value === role)?.label || role}
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