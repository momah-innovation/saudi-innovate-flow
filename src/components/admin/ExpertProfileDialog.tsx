import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, Building, MapPin, Calendar, Award, Star, Clock, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useRTLAware } from '@/hooks/useRTLAware';
import { RTLFlex } from '@/components/ui/rtl-layout';

interface Expert {
  id: string;
  user_id: string;
  expertise_areas: string[];
  experience_years: number;
  expert_level: string;
  availability_status: string;
  certifications?: string[];
  education_background?: string;
  consultation_rate?: number;
  profiles?: {
    name: string;
    email: string;
    phone?: string;
    department?: string;
    position?: string;
    bio?: string;
  };
}

interface ExpertProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expertId: string | null;
}

export function ExpertProfileDialog({ open, onOpenChange, expertId }: ExpertProfileDialogProps) {
  const navigate = useNavigate();
  const { textEnd } = useRTLAware();
  const [expert, setExpert] = useState<Expert | null>(null);
  const [activeAssignments, setActiveAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && expertId) {
      fetchExpertDetails();
    }
  }, [open, expertId]);

  const fetchExpertDetails = async () => {
    if (!expertId) return;
    
    try {
      setLoading(true);

      // Fetch expert details
      const { data: expertData, error: expertError } = await supabase
        .from('experts')
        .select('*')
        .eq('id', expertId)
        .single();

      if (expertError) throw expertError;

      // Fetch profile details
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', expertData.user_id)
        .single();

      if (profileError) throw profileError;

      // Fetch active assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('challenge_experts')
        .select(`
          *,
          challenges:challenge_id (
            title,
            status,
            priority_level,
            start_date,
            end_date
          )
        `)
        .eq('expert_id', expertId)
        .eq('status', 'active');

      if (assignmentsError) throw assignmentsError;

      setExpert({
        ...expertData,
        profiles: profileData
      });
      setActiveAssignments(assignmentsData || []);
    } catch (error) {
      console.error('Error fetching expert details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'default';
      case 'busy': return 'secondary';
      case 'unavailable': return 'destructive';
      default: return 'outline';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'senior': return 'default';
      case 'mid': return 'secondary';
      case 'junior': return 'outline';
      default: return 'outline';
    }
  };

  const handleNavigateToChallenge = (challengeId: string) => {
    navigate(`/challenges/${challengeId}`);
    onOpenChange(false); // Close the dialog when navigating
  };

  if (!expert) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Expert Profile</DialogTitle>
          </DialogHeader>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Expert not found
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <User className="h-6 w-6" />
            {expert.profiles?.name || 'Expert Profile'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Basic Information</span>
                <div className="flex gap-2">
                  <Badge variant={getStatusColor(expert.availability_status)}>
                    {expert.availability_status}
                  </Badge>
                  <Badge variant={getLevelColor(expert.expert_level)}>
                    {expert.expert_level} level
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{expert.profiles?.email}</span>
                  </div>
                  {expert.profiles?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{expert.profiles.phone}</span>
                    </div>
                  )}
                  {expert.profiles?.department && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{expert.profiles.department}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {expert.profiles?.position && (
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{expert.profiles.position}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{expert.experience_years} years experience</span>
                  </div>
                  {expert.consultation_rate && (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Rate: ${expert.consultation_rate}/hour</span>
                    </div>
                  )}
                </div>
              </div>
              
              {expert.profiles?.bio && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <h4 className="font-medium mb-2">Bio</h4>
                    <p className="text-sm text-muted-foreground">{expert.profiles.bio}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Expertise Areas */}
          <Card>
            <CardHeader>
              <CardTitle>Expertise Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {expert.expertise_areas.map((area, index) => (
                  <Badge key={index} variant="outline">
                    {area}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Education & Certifications */}
          {(expert.education_background || expert.certifications) && (
            <Card>
              <CardHeader>
                <CardTitle>Education & Certifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {expert.education_background && (
                  <div>
                    <h4 className="font-medium mb-2">Education Background</h4>
                    <p className="text-sm text-muted-foreground">{expert.education_background}</p>
                  </div>
                )}
                
                {expert.certifications && expert.certifications.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {expert.certifications.map((cert, index) => (
                        <Badge key={index} variant="secondary">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Active Assignments */}
          <Card>
            <CardHeader>
              <CardTitle>Active Assignments ({activeAssignments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {activeAssignments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active assignments</p>
              ) : (
                <div className="space-y-3">
                  {activeAssignments.map((assignment) => (
                    <div 
                      key={assignment.id} 
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
                      onClick={() => handleNavigateToChallenge(assignment.challenge_id)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium group-hover:text-primary transition-colors">
                            {assignment.challenges?.title}
                          </h4>
                          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Role: {assignment.role_type.replace('_', ' ')}
                        </p>
                        {assignment.challenges?.start_date && (
                          <p className="text-xs text-muted-foreground">
                            Started: {new Date(assignment.challenges.start_date).toLocaleDateString()}
                          </p>
                        )}
                       </div>
                       <div className={textEnd}>
                         <Badge variant="outline">
                           {assignment.challenges?.priority_level}
                         </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {assignment.challenges?.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}