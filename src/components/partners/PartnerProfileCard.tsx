import React from 'react';
import { Building, MapPin, Users, ExternalLink, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

interface PartnerProfileCardProps {
  partner: {
    id: string;
    name: string;
    name_ar?: string;
    partner_type?: string;
    contact_person?: string;
    email?: string;
    phone?: string;
    address?: string;
    logo_url?: string;
    capabilities?: string[];
    funding_capacity?: number;
    status?: string;
  };
  onViewDetails?: (partnerId: string) => void;
  showActions?: boolean;
}

export function PartnerProfileCard({ partner, onViewDetails, showActions = true }: PartnerProfileCardProps) {
  const { t } = useUnifiedTranslation();
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getPartnerTypeColor = (type?: string) => {
    switch (type) {
      case 'corporate': return 'bg-blue-100 text-blue-800';
      case 'academic': return 'bg-purple-100 text-purple-800';
      case 'government': return 'bg-green-100 text-green-800';
      case 'technology': return 'bg-orange-100 text-orange-800';
      case 'media': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      notation: 'compact'
    }).format(amount);
  };

  return (
    <Card className="h-full transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={partner.logo_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials(partner.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg line-clamp-1">{partner.name}</CardTitle>
                {partner.name_ar && (
                  <CardDescription className="text-sm text-muted-foreground mt-1" dir="rtl">
                    {partner.name_ar}
                  </CardDescription>
                )}
              </div>
              {partner.status && (
                <Badge className={`text-xs ${getStatusColor(partner.status)}`}>
                  {t(`partner_status.${partner.status}`, partner.status)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {partner.partner_type && (
            <Badge className={`text-xs ${getPartnerTypeColor(partner.partner_type)}`}>
              <Building className="h-3 w-3 mr-1" />
              {t(`partner_type.${partner.partner_type}`, partner.partner_type)}
            </Badge>
          )}
          {partner.funding_capacity && (
            <Badge variant="outline" className="text-xs">
              <Star className="h-3 w-3 mr-1" />
              {formatCurrency(partner.funding_capacity)}
            </Badge>
          )}
        </div>

        {partner.contact_person && (
          <div className="text-sm">
            <span className="font-medium">{t('partner_profile.contact_label')}: </span>
            <span className="text-muted-foreground">{partner.contact_person}</span>
          </div>
        )}

        {partner.address && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
            <span className="line-clamp-2">{partner.address}</span>
          </div>
        )}

        {partner.capabilities && partner.capabilities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {partner.capabilities.slice(0, 3).map((capability, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {capability}
              </Badge>
            ))}
            {partner.capabilities.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                {t('partner_profile.more_capabilities', `+${partner.capabilities.length - 3} more`)}
              </Badge>
            )}
          </div>
        )}

        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails?.(partner.id)}
              className="flex-1"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {t('partner_profile.view_details')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}