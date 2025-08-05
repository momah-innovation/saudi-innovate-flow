import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Star, Users, Award, MessageSquare, Calendar, 
  ExternalLink, Mail, Linkedin, Twitter 
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useRTLAware } from '@/hooks/useRTLAware';

interface Expert {
  id: string;
  name: string;
  name_ar?: string;
  title: string;
  title_ar?: string;
  avatar: string;
  specializations: string[];
  experience_years: number;
  rating: number;
  active_challenges: number;
  mentored_projects: number;
  availability: 'available' | 'busy' | 'unavailable';
  social_links?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

interface ExpertCardProps {
  expert: Expert;
  onViewProfile: (expert: Expert) => void;
  onContact: (expert: Expert) => void;
  compact?: boolean;
}

export const ExpertCard = ({ expert, onViewProfile, onContact, compact = false }: ExpertCardProps) => {
  const { isRTL } = useDirection();
  const { me } = useRTLAware();

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-success/10 text-success border-success/20';
      case 'busy': return 'bg-warning/10 text-warning border-warning/20';
      case 'unavailable': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return isRTL ? 'متاح' : 'Available';
      case 'busy': return isRTL ? 'مشغول' : 'Busy';
      case 'unavailable': return isRTL ? 'غير متاح' : 'Unavailable';
      default: return availability;
    }
  };

  if (compact) {
    return (
      <Card className="hover-scale animate-fade-in">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={expert.avatar} alt={expert.name} />
              <AvatarFallback>{expert.name[0]}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate">
                {isRTL ? expert.name_ar || expert.name : expert.name}
              </h4>
              <p className="text-sm text-muted-foreground truncate">
                {isRTL ? expert.title_ar || expert.title : expert.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`text-xs ${getAvailabilityColor(expert.availability)}`}>
                  {getAvailabilityText(expert.availability)}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="w-3 h-3 fill-current text-accent" />
                  <span>{expert.rating}</span>
                </div>
              </div>
            </div>
            
            <Button variant="outline" size="sm" onClick={() => onViewProfile(expert)}>
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover-scale animate-fade-in group">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={expert.avatar} alt={expert.name} />
            <AvatarFallback className="text-lg">{expert.name[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-lg">
                {isRTL ? expert.name_ar || expert.name : expert.name}
              </CardTitle>
              <Badge className={getAvailabilityColor(expert.availability)}>
                {getAvailabilityText(expert.availability)}
              </Badge>
            </div>
            
            <p className="text-muted-foreground mb-3">
              {isRTL ? expert.title_ar || expert.title : expert.title}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-current text-accent" />
                <span>{expert.rating}/5</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{expert.experience_years} {isRTL ? 'سنوات خبرة' : 'years exp'}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Specializations */}
        <div>
          <h4 className="font-medium mb-2">{isRTL ? 'التخصصات' : 'Specializations'}</h4>
          <div className="flex flex-wrap gap-1">
            {expert.specializations.slice(0, 3).map((spec, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {spec}
              </Badge>
            ))}
            {expert.specializations.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{expert.specializations.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="font-semibold text-lg">{expert.active_challenges}</div>
            <div className="text-xs text-muted-foreground">
              {isRTL ? 'تحديات نشطة' : 'Active Challenges'}
            </div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="font-semibold text-lg">{expert.mentored_projects}</div>
            <div className="text-xs text-muted-foreground">
              {isRTL ? 'مشاريع منتورة' : 'Mentored Projects'}
            </div>
          </div>
        </div>

        {/* Social Links */}
        {expert.social_links && (
          <div className="flex justify-center gap-2 pt-2 border-t">
            {expert.social_links.linkedin && (
              <Button variant="ghost" size="sm" asChild>
                <a href={expert.social_links.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4" />
                </a>
              </Button>
            )}
            {expert.social_links.twitter && (
              <Button variant="ghost" size="sm" asChild>
                <a href={expert.social_links.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-4 h-4" />
                </a>
              </Button>
            )}
            {expert.social_links.email && (
              <Button variant="ghost" size="sm" asChild>
                <a href={`mailto:${expert.social_links.email}`}>
                  <Mail className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={() => onViewProfile(expert)} className="flex-1">
            <Users className={`w-4 h-4 ${me('2')}`} />
            {isRTL ? 'الملف الشخصي' : 'View Profile'}
          </Button>
          <Button onClick={() => onContact(expert)} className="flex-1">
            <MessageSquare className={`w-4 h-4 ${me('2')}`} />
            {isRTL ? 'تواصل' : 'Contact'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};