import React from 'react';
import { Users, MapPin, Globe, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TeamProfileCardProps {
  team: {
    id: string;
    name: string;
    name_ar?: string;
    description?: string;
    logo_url?: string;
    focus_area?: string;
    department?: string;
    status?: string;
    max_members?: number;
  };
  onViewDetails?: (teamId: string) => void;
  showActions?: boolean;
}

export function TeamProfileCard({ team, onViewDetails, showActions = true }: TeamProfileCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'forming': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={team.logo_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials(team.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg line-clamp-1">{team.name}</CardTitle>
                {team.name_ar && (
                  <CardDescription className="text-sm text-muted-foreground mt-1" dir="rtl">
                    {team.name_ar}
                  </CardDescription>
                )}
              </div>
              {team.status && (
                <Badge className={`text-xs ${getStatusColor(team.status)}`}>
                  {team.status}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {team.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {team.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {team.focus_area && (
            <Badge variant="secondary" className="text-xs">
              <Globe className="h-3 w-3 mr-1" />
              {team.focus_area}
            </Badge>
          )}
          {team.department && (
            <Badge variant="outline" className="text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              {team.department}
            </Badge>
          )}
          {team.max_members && (
            <Badge variant="outline" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              Max {team.max_members} members
            </Badge>
          )}
        </div>

        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails?.(team.id)}
              className="flex-1"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}