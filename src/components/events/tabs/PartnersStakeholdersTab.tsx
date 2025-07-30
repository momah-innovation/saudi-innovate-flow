import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useDirection } from '@/components/ui/direction-provider';
import { Building2, Users, Mail, Phone, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventPartner {
  id: string;
  name: string;
  name_ar: string;
  partner_type: string;
  logo_url?: string;
  contact_person?: string;
  email?: string;
}

interface EventStakeholder {
  id: string;
  name?: string;
  organization: string;
  position?: string;
  stakeholder_type: string;
  engagement_status: string;
  invitation_status: string;
  attendance_status: string;
}

interface PartnersStakeholdersTabProps {
  partners: EventPartner[];
  stakeholders: EventStakeholder[];
}

export const PartnersStakeholdersTab = ({ 
  partners, 
  stakeholders 
}: PartnersStakeholdersTabProps) => {
  const { isRTL } = useDirection();

  const getPartnerTypeColor = (type: string) => {
    switch (type) {
      case 'corporate': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
      case 'academic': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400';
      case 'government': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400';
      case 'non_profit': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStakeholderTypeColor = (type: string) => {
    switch (type) {
      case 'خاص': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
      case 'أكاديمي': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400';
      case 'حكومي': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400';
      case 'غير ربحي': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'نشط': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400';
      case 'pending': 
      case 'متوقع': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'declined':
      case 'غير نشط': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Partners Section */}
      <div>
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          {isRTL ? 'الشركاء' : 'Partners'}
          {partners.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {partners.length}
            </Badge>
          )}
        </h4>
        
        {partners.length > 0 ? (
          <div className="grid gap-4">
            {partners.map((partner) => (
              <div key={partner.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={partner.logo_url} alt={partner.name} />
                    <AvatarFallback>
                      <Building2 className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="font-medium text-foreground">
                          {isRTL ? partner.name_ar : partner.name}
                        </h5>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getPartnerTypeColor(partner.partner_type)}>
                            {partner.partner_type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {partner.contact_person && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {partner.contact_person}
                        </div>
                      </div>
                    )}
                    
                    {partner.email && (
                      <div className="mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {partner.email}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {isRTL ? 'لا يوجد شركاء لهذه الفعالية' : 'No partners for this event'}
          </div>
        )}
      </div>

      {/* Stakeholders Section */}
      <div>
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Users className="w-4 h-4" />
          {isRTL ? 'أصحاب المصلحة' : 'Stakeholders'}
          {stakeholders.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {stakeholders.length}
            </Badge>
          )}
        </h4>
        
        {stakeholders.length > 0 ? (
          <div className="grid gap-4">
            {stakeholders.map((stakeholder) => (
              <div key={stakeholder.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="font-medium text-foreground">
                          {stakeholder.name || stakeholder.organization}
                        </h5>
                        {stakeholder.name && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {stakeholder.organization}
                          </p>
                        )}
                        {stakeholder.position && (
                          <p className="text-xs text-muted-foreground">
                            {stakeholder.position}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <Badge className={getStakeholderTypeColor(stakeholder.stakeholder_type)}>
                        {stakeholder.stakeholder_type}
                      </Badge>
                      <Badge className={getStatusColor(stakeholder.invitation_status)} variant="outline">
                        {isRTL ? 'الدعوة: ' : 'Invite: '}{stakeholder.invitation_status}
                      </Badge>
                      <Badge className={getStatusColor(stakeholder.attendance_status)} variant="outline">
                        {isRTL ? 'الحضور: ' : 'Attendance: '}{stakeholder.attendance_status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {isRTL ? 'لا يوجد أصحاب مصلحة لهذه الفعالية' : 'No stakeholders for this event'}
          </div>
        )}
      </div>
    </div>
  );
};