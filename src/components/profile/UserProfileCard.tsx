import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Building, MapPin, Edit } from 'lucide-react';
import { useTranslation } from '@/hooks/useAppTranslation';

interface UserProfileCardProps {
  onEdit?: () => void;
}

export function UserProfileCard({ onEdit }: UserProfileCardProps) {
  const { userProfile, user } = useAuth();
  const { t, getDynamicText } = useTranslation();

  if (!user || !userProfile) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">{t('loading')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const profileName = getDynamicText(userProfile.name_ar, userProfile.name) || userProfile.name || user.email?.split('@')[0];
  const initials = profileName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={userProfile.profile_image_url} />
            <AvatarFallback className="text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">{profileName}</h3>
            {userProfile.position && (
              <p className="text-muted-foreground">{userProfile.position}</p>
            )}
          </div>
        </div>
        {onEdit && (
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            {t('edit')}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contact Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{user.email}</span>
          </div>
          {userProfile.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{userProfile.phone}</span>
            </div>
          )}
        </div>

        {/* Organization Information */}
        {(userProfile.department || userProfile.sector) && (
          <div className="space-y-2">
            {userProfile.department && (
              <div className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{userProfile.department}</span>
              </div>
            )}
            {userProfile.sector && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{userProfile.sector}</span>
              </div>
            )}
          </div>
        )}

        {/* User Roles */}
        {userProfile.user_roles && userProfile.user_roles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">{t('roles')}</p>
            <div className="flex flex-wrap gap-2">
              {userProfile.user_roles.map((userRole: any, index: number) => (
                <Badge key={index} variant="secondary">
                  {userRole.role}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Bio */}
        {userProfile.bio && (
          <div className="space-y-2">
            <p className="text-sm font-medium">{t('bio')}</p>
            <p className="text-sm text-muted-foreground">{userProfile.bio}</p>
          </div>
        )}

        {/* Profile Completion */}
        {userProfile.profile_completion_percentage !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">{t('profile_completion')}</p>
              <span className="text-sm text-muted-foreground">
                {userProfile.profile_completion_percentage}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${userProfile.profile_completion_percentage}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}