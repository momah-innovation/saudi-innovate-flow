import React from 'react';
import { Target, TrendingUp, Globe, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

interface SectorProfileCardProps {
  sector: {
    id: string;
    name: string;
    name_ar?: string;
    description?: string;
    vision_2030_alignment?: string;
    image_url?: string;
  };
  onViewDetails?: (sectorId: string) => void;
  showActions?: boolean;
}

export function SectorProfileCard({ sector, onViewDetails, showActions = true }: SectorProfileCardProps) {
  const { t } = useUnifiedTranslation();
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="h-full transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={sector.image_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials(sector.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-1">{sector.name}</CardTitle>
            {sector.name_ar && (
              <CardDescription className="text-sm text-muted-foreground mt-1" dir="rtl">
                {sector.name_ar}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {sector.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {sector.description}
          </p>
        )}

        {sector.vision_2030_alignment && (
          <div className="flex items-start gap-2">
            <Target className="h-4 w-4 mt-0.5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium">{t('sector_profile.vision_2030_alignment')}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {sector.vision_2030_alignment}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            <Globe className="h-3 w-3 mr-1" />
            {t('sector_profile.government_sector')}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            {t('sector_profile.strategic_priority')}
          </Badge>
        </div>

        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails?.(sector.id)}
              className="flex-1"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {t('sector_profile.view_details')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}