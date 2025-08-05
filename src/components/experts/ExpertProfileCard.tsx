import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  GraduationCap, 
  Award, 
  Clock, 
  DollarSign, 
  CheckCircle,
  XCircle,
  Briefcase,
  Star,
  Calendar
 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getInitials, useSystemSettings } from '@/hooks/useSystemSettings';

interface ExpertProfile {
  id: string;
  user_id: string;
  expertise_areas: string[];
  certifications: string[];
  experience_years: number;
  education_background: string;
  consultation_rate: number;
  availability_status: string;
  expert_level: string;
  created_at: string;
}

interface UserProfile {
  id: string;
  name: string;
  name_ar?: string;
  email: string;
  phone?: string;
  department?: string;
  position?: string;
  bio?: string;
  profile_image_url?: string;
}

interface ExpertCardProps {
  expertProfile: ExpertProfile;
  userProfile: UserProfile;
  className?: string;
}

export function ExpertCard({ expertProfile, userProfile, className = "" }: ExpertCardProps) {
  const { uiInitialsMaxLength } = useSystemSettings();
  
  const getInitialsWithSettings = (name: string) => {
    return getInitials(name, uiInitialsMaxLength);
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return 'default';
      case 'busy': return 'secondary';
      case 'unavailable': return 'destructive';
      default: return 'outline';
    }
  };

  const getExpertLevelColor = (level: string) => {
    switch (level) {
      case 'senior': return 'default';
      case 'mid': return 'secondary';
      case 'junior': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Card className={`h-full ${className}`}>
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={userProfile.profile_image_url} alt={userProfile.name} />
            <AvatarFallback className="text-lg">
              {getInitialsWithSettings(userProfile.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg">{userProfile.name}</CardTitle>
            {userProfile.name_ar && (
              <p className="text-sm text-muted-foreground">{userProfile.name_ar}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={getAvailabilityColor(expertProfile.availability_status)}>
                {expertProfile.availability_status === 'available' && <CheckCircle className="w-3 h-3 mr-1" />}
                {expertProfile.availability_status === 'unavailable' && <XCircle className="w-3 h-3 mr-1" />}
                {expertProfile.availability_status}
              </Badge>
              {expertProfile.expert_level && (
                <Badge variant={getExpertLevelColor(expertProfile.expert_level)}>
                  <Star className="w-3 h-3 mr-1" />
                  {expertProfile.expert_level} level
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contact Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium">Email:</span>
            <span className="text-muted-foreground">{userProfile.email}</span>
          </div>
          {userProfile.phone && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Phone:</span>
              <span className="text-muted-foreground">{userProfile.phone}</span>
            </div>
          )}
          {userProfile.position && (
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{userProfile.position}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Expertise Areas */}
        <div>
          <h4 className="font-medium text-sm mb-2">Areas of Expertise</h4>
          <div className="flex flex-wrap gap-1">
            {expertProfile.expertise_areas && expertProfile.expertise_areas.length > 0 ? (
              expertProfile.expertise_areas.map((area, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {area}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">No expertise areas specified</span>
            )}
          </div>
        </div>

        {/* Experience & Education */}
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Experience:</span>
            <span className="text-muted-foreground">
              {expertProfile.experience_years ? `${expertProfile.experience_years} years` : 'Not specified'}
            </span>
          </div>
          
          {expertProfile.education_background && (
            <div className="flex items-start gap-2">
              <GraduationCap className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <span className="font-medium">Education:</span>
                <p className="text-muted-foreground text-xs mt-1">{expertProfile.education_background}</p>
              </div>
            </div>
          )}
        </div>

        {/* Certifications */}
        {expertProfile.certifications && expertProfile.certifications.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Certifications
            </h4>
            <div className="space-y-1">
              {expertProfile.certifications.map((cert, index) => (
                <div key={index} className="text-xs text-muted-foreground">
                  • {cert}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bio */}
        {userProfile.bio && (
          <div>
            <h4 className="font-medium text-sm mb-2">About</h4>
            <p className="text-xs text-muted-foreground">{userProfile.bio}</p>
          </div>
        )}

        <Separator />

        {/* Footer Info */}
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Expert since {new Date(expertProfile.created_at).toLocaleDateString()}</span>
          </div>
          {expertProfile.consultation_rate && (
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              <span>${expertProfile.consultation_rate}/hr</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface ExpertProfileViewProps {
  userId: string;
  className?: string;
}

export function ExpertProfileView({ userId, className = "" }: ExpertProfileViewProps) {
  const [expertProfile, setExpertProfile] = useState<ExpertProfile | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpertData();
  }, [userId]);

  const fetchExpertData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile and expert profile in parallel
      const [profileResponse, expertResponse] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle(),
        supabase
          .from('experts')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle()
      ]);

      if (profileResponse.error) throw profileResponse.error;
      if (expertResponse.error) throw expertResponse.error;

      setUserProfile(profileResponse.data);
      setExpertProfile(expertResponse.data);
    } catch (error) {
      console.error('Error fetching expert data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading expert profile...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userProfile) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-48">
          <p className="text-muted-foreground">User profile not found</p>
        </CardContent>
      </Card>
    );
  }

  if (!expertProfile) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center">
            <p className="text-muted-foreground">This user is not registered as an expert</p>
            <p className="text-sm text-muted-foreground mt-1">
              They need to apply for the Domain Expert role first
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <ExpertCard expertProfile={expertProfile} userProfile={userProfile} className={className} />;
}