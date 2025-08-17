import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatDate } from '@/utils/unified-date-handler';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, Building, MapPin, Calendar, Award, Star, Clock, ExternalLink } from "lucide-react";
import { useExpertProfiles } from "@/hooks/useExpertProfiles";
import { logger } from "@/utils/error-handler";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";

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
  const { t } = useUnifiedTranslation();
  const { experts, loading: expertsLoading } = useExpertProfiles();
  const [expert, setExpert] = useState<Expert | null>(null);
  interface AssignmentData {
    id: string;
    challenge_id?: string;
    status?: string;
    title?: string;
    created_at?: string;
    role_type?: string;
    challenges?: {
      title_ar?: string;
      status?: string;
      priority_level?: string;
      start_date?: string;
      end_date?: string;
    };
  }
  
  const [activeAssignments, setActiveAssignments] = useState<AssignmentData[]>([]);
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
      
      // Find expert in the loaded experts data
      const foundExpert = experts.find(e => e.id === expertId);
      if (foundExpert) {
        setExpert({
          id: foundExpert.id,
          user_id: foundExpert.user_id,
          expertise_areas: foundExpert.expertise_areas || [],
          experience_years: foundExpert.experience_years || 0,
          expert_level: foundExpert.expert_level || 'junior',
          availability_status: foundExpert.availability_status || 'available',
          certifications: foundExpert.certifications || [],
          education_background: '',
          consultation_rate: 0,
          profiles: {
            name: 'Expert Profile',
            email: 'expert@example.com',
            phone: undefined,
            department: undefined,
            position: undefined,
            bio: undefined
          }
        });
      }
      
      // Mock active assignments for now - in a full migration, 
      // this would use a dedicated useExpertAssignments hook
      setActiveAssignments([]);
    } catch (error) {
      logger.error('Error fetching expert details', error);
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
            <DialogTitle>{t('expert_profile.title')}</DialogTitle>
          </DialogHeader>
          {(loading || expertsLoading) ? (
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
            {expert.profiles?.name || t('admin.experts.expert_profile', 'Expert Profile')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('expert_profile.basic_information')}</span>
                <div className="flex gap-2">
                  <Badge variant={getStatusColor(expert.availability_status)}>
                    {expert.availability_status}
                  </Badge>
                  <Badge variant={getLevelColor(expert.expert_level)}>
                    {expert.expert_level} {t('expert_profile.level')}
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
              <CardTitle>{t('expert_profile.expertise_areas')}</CardTitle>
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
                <CardTitle>{t('expert_profile.education_certifications')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {expert.education_background && (
                  <div>
                    <h4 className="font-medium mb-2">{t('expert_profile.education_background')}</h4>
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
              <CardTitle>{t('expert_profile.active_assignments')} ({activeAssignments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {activeAssignments.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('expert_profile.no_active_assignments')}</p>
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
                            {assignment.challenges?.title_ar}
                          </h4>
                          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Role: {assignment.role_type.replace('_', ' ')}
                        </p>
                        {assignment.challenges?.start_date && (
                          <p className="text-xs text-muted-foreground">
                            Started: {formatDate(assignment.challenges.start_date)}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
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