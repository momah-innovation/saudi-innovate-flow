import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDirection } from '@/components/ui/direction-provider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { challengesPageConfig } from '@/config/challengesPageConfig';
import { cn } from '@/lib/utils';
import { useRTLAware } from '@/hooks/useRTLAware';
import {
  Users,
  Search,
  Star,
  CheckCircle,
  Send
} from 'lucide-react';

interface Expert {
  id: string;
  user_id: string;
  specialization: string;
  profiles: {
    display_name: string;
    profile_image_url?: string;
  };
}

interface ChallengeExpertAssignmentWizardProps {
  challenge: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssignmentComplete?: () => void;
}

export const ChallengeExpertAssignmentWizard = ({
  challenge,
  open,
  onOpenChange,
  onAssignmentComplete
}: ChallengeExpertAssignmentWizardProps) => {
  const { isRTL } = useDirection();
  const { toast } = useToast();
  const { me, ps, start } = useRTLAware();
  
  const [experts, setExperts] = useState<Expert[]>([]);
  const [selectedExperts, setSelectedExperts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadExperts();
    }
  }, [open]);

  const loadExperts = async () => {
    try {
      const { data, error } = await supabase
        .from('innovation_team_members')
        .select('id, user_id, specialization')
        .eq('status', 'active');

      if (error) throw error;

      // Create experts with mock profiles for now
      const expertsWithProfiles = (data || []).map(expert => ({
        ...expert,
        specialization: Array.isArray(expert.specialization) ? expert.specialization[0] : expert.specialization,
        profiles: {
          display_name: `Expert ${expert.id.slice(0, 8)}`,
          profile_image_url: ''
        }
      }));

      setExperts(expertsWithProfiles);
    } catch (error) {
      console.error('Error loading experts:', error);
      setExperts([]);
    }
  };

  const handleExpertSelection = (expertId: string) => {
    setSelectedExperts(prev => {
      const isSelected = prev.includes(expertId);
      return isSelected ? prev.filter(id => id !== expertId) : [...prev, expertId];
    });
  };

  const handleAssignExperts = async () => {
    if (selectedExperts.length === 0) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'يرجى اختيار خبير واحد على الأقل' : 'Please select at least one expert',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const assignments = selectedExperts.map(expertId => {
        const expert = experts.find(e => e.id === expertId);
        return {
          challenge_id: challenge.id,
          expert_id: expert?.user_id,
          role_type: 'evaluator',
          status: 'active'
        };
      });

      const { error } = await supabase
        .from('challenge_experts')
        .insert(assignments);

      if (error) throw error;

      toast({
        title: isRTL ? 'تم التعيين بنجاح' : 'Assignment Successful',
        description: isRTL ? 
          `تم تعيين ${selectedExperts.length} خبير للتحدي` : 
          `Successfully assigned ${selectedExperts.length} expert(s) to the challenge`,
      });

      onAssignmentComplete?.();
      onOpenChange(false);
      setSelectedExperts([]);
    } catch (error) {
      console.error('Error assigning experts:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في تعيين الخبراء' : 'Failed to assign experts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredExperts = experts.filter(expert =>
    expert.profiles.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expert.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!challenge) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("max-w-4xl max-h-[90vh] overflow-hidden", challengesPageConfig.ui.glassMorphism.heavy)}>
        <DialogHeader>
          <DialogTitle className={cn("flex items-center gap-2", challengesPageConfig.ui.colors.text.primary)}>
            <Users className={cn("w-5 h-5", challengesPageConfig.ui.colors.stats.purple)} />
            {isRTL ? 'تعيين خبراء للتحدي' : 'Assign Experts to Challenge'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          <div>
            <h3 className={cn("text-lg font-semibold mb-4", challengesPageConfig.ui.colors.text.primary)}>
              {isRTL ? 'اختيار الخبراء' : 'Select Experts'}
            </h3>

            {/* Search */}
            <div className="relative mb-4">
              <Search className={cn(`w-4 h-4 absolute ${start('3')} top-3`, challengesPageConfig.ui.colors.text.muted)} />
              <Input
                placeholder={isRTL ? 'البحث في الخبراء...' : 'Search experts...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(ps('10'), challengesPageConfig.ui.effects.focus)}
              />
            </div>

            {/* Selected Experts Summary */}
            {selectedExperts.length > 0 && (
              <div className={cn("mb-4 p-3 rounded-lg", challengesPageConfig.ui.glassMorphism.medium)}>
                <p className={cn("text-sm font-medium", challengesPageConfig.ui.colors.text.primary)}>
                  {isRTL ? `تم اختيار ${selectedExperts.length} خبير` : `${selectedExperts.length} expert(s) selected`}
                </p>
              </div>
            )}

            {/* Experts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {filteredExperts.map(expert => {
                const isSelected = selectedExperts.includes(expert.id);
                return (
                  <Card 
                    key={expert.id} 
                    className={cn(
                      "cursor-pointer transition-all duration-200",
                      challengesPageConfig.ui.glassMorphism.card,
                      challengesPageConfig.ui.effects.hoverScale,
                      isSelected && challengesPageConfig.ui.glassMorphism.cardActive
                    )}
                    onClick={() => handleExpertSelection(expert.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={expert.profiles.profile_image_url} />
                          <AvatarFallback className={challengesPageConfig.ui.glassMorphism.light}>
                            {expert.profiles.display_name?.charAt(0) || 'E'}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={cn("font-medium truncate", challengesPageConfig.ui.colors.text.primary)}>
                              {expert.profiles.display_name || (isRTL ? 'خبير' : 'Expert')}
                            </h4>
                            {isSelected && <CheckCircle className={cn("w-4 h-4", challengesPageConfig.ui.colors.stats.green)} />}
                          </div>

                          <p className={cn("text-sm mb-2", challengesPageConfig.ui.colors.text.muted)}>
                            {expert.specialization || (isRTL ? 'تخصص عام' : 'General Expertise')}
                          </p>

                          <Badge variant="outline" className={challengesPageConfig.ui.glassMorphism.badge}>
                            {isRTL ? 'عضو فريق' : 'Team Member'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className={challengesPageConfig.ui.glassMorphism.light}
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleAssignExperts}
              disabled={loading || selectedExperts.length === 0}
              className={cn(
                challengesPageConfig.ui.gradients.button,
                challengesPageConfig.ui.gradients.buttonHover,
                challengesPageConfig.ui.effects.hoverScale
              )}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  {isRTL ? 'جاري التعيين...' : 'Assigning...'}
                </div>
              ) : (
                <>
                  <Send className={`w-4 h-4 ${me('2')}`} />
                  {isRTL ? 'تعيين الخبراء' : 'Assign Experts'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};