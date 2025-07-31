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
  expertise_level: string;
  profiles: {
    display_name: string;
    profile_image_url?: string;
  };
}

interface ExpertAssignmentWizardProps {
  challenge: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssignmentComplete?: () => void;
}

export const ExpertAssignmentWizard = ({
  challenge,
  open,
  onOpenChange,
  onAssignmentComplete
}: ExpertAssignmentWizardProps) => {
  const { isRTL } = useDirection();
  const { toast } = useToast();
  
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
        .select(`
          id,
          user_id,
          specialization,
          expertise_level,
          profiles:user_id (
            display_name,
            profile_image_url
          )
        `)
        .eq('status', 'active')
        .eq('role', 'expert');

      if (error) throw error;
      setExperts(data || []);
    } catch (error) {
      console.error('Error loading experts:', error);
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {isRTL ? 'تعيين خبراء للتحدي' : 'Assign Experts to Challenge'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {isRTL ? 'اختيار الخبراء' : 'Select Experts'}
            </h3>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder={isRTL ? 'البحث في الخبراء...' : 'Search experts...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Selected Experts Summary */}
            {selectedExperts.length > 0 && (
              <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-sm font-medium">
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
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                    }`}
                    onClick={() => handleExpertSelection(expert.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={expert.profiles.profile_image_url} />
                          <AvatarFallback>
                            {expert.profiles.display_name?.charAt(0) || 'E'}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium truncate">
                              {expert.profiles.display_name || (isRTL ? 'خبير' : 'Expert')}
                            </h4>
                            {isSelected && <CheckCircle className="w-4 h-4 text-primary" />}
                          </div>

                          <p className="text-sm text-muted-foreground mb-2">
                            {expert.specialization || (isRTL ? 'تخصص عام' : 'General Expertise')}
                          </p>

                          <Badge variant="outline">
                            {expert.expertise_level}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleAssignExperts}
              disabled={loading || selectedExperts.length === 0}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  {isRTL ? 'جاري التعيين...' : 'Assigning...'}
                </div>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
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