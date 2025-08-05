import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventPartner, EventStakeholder } from "@/hooks/useEventDetails";

interface PartnersStakeholdersTabProps {
  partners: EventPartner[];
  stakeholders: EventStakeholder[];
}

export const PartnersStakeholdersTab = ({ partners, stakeholders }: PartnersStakeholdersTabProps) => {
  const getPartnerTypeColor = (type: string) => {
    switch (type) {
      case 'strategic': return 'bg-blue-100 text-blue-800';
      case 'financial': return 'bg-green-100 text-green-800';
      case 'technology': return 'bg-purple-100 text-purple-800';
      case 'academic': return 'bg-yellow-100 text-yellow-800';
      case 'government': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStakeholderTypeColor = (type: string) => {
    switch (type) {
      case 'government': return 'bg-red-100 text-red-800';
      case 'private': return 'bg-blue-100 text-blue-800';
      case 'academic': return 'bg-yellow-100 text-yellow-800';
      case 'civil_society': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Partners Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">الشركاء</h3>
        {partners.length > 0 ? (
          <div className="grid gap-4">
            {partners.map((partner) => (
              <Card key={partner.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={partner.logo_url} alt={partner.name} />
                      <AvatarFallback>
                        {partner.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-base font-medium">{partner.name}</div>
                      {partner.name_ar && (
                        <div className="text-sm text-muted-foreground">{partner.name_ar}</div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getPartnerTypeColor(partner.partner_type)}>
                        {partner.partner_type}
                      </Badge>
                      <Badge className={getStatusColor(partner.partnership_status)}>
                        {partner.partnership_status}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {partner.contact_email && (
                      <div>
                        <span className="font-medium">الإيميل:</span>
                        <div className="text-muted-foreground">{partner.contact_email}</div>
                      </div>
                    )}
                    {partner.contact_phone && (
                      <div>
                        <span className="font-medium">الهاتف:</span>
                        <div className="text-muted-foreground">{partner.contact_phone}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            لا توجد شراكات مسجلة لهذه الفعالية
          </div>
        )}
      </div>

      {/* Stakeholders Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">أصحاب المصلحة</h3>
        {stakeholders.length > 0 ? (
          <div className="grid gap-4">
            {stakeholders.map((stakeholder) => (
              <Card key={stakeholder.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {stakeholder.organization.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-base font-medium">{stakeholder.organization}</div>
                      <div className="text-sm text-muted-foreground">{stakeholder.contact_person}</div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStakeholderTypeColor(stakeholder.stakeholder_type)}>
                        {stakeholder.stakeholder_type}
                      </Badge>
                      <Badge className={getStatusColor(stakeholder.status)}>
                        {stakeholder.status}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">المنصب:</span>
                      <div className="text-muted-foreground">{stakeholder.position}</div>
                    </div>
                    {stakeholder.contact_email && (
                      <div>
                        <span className="font-medium">الإيميل:</span>
                        <div className="text-muted-foreground">{stakeholder.contact_email}</div>
                      </div>
                    )}
                    <div>
                      <span className="font-medium">مستوى المشاركة:</span>
                      <div className="text-muted-foreground">{stakeholder.involvement_level}</div>
                    </div>
                    <div>
                      <span className="font-medium">حالة المشاركة:</span>
                      <div className="text-muted-foreground">{stakeholder.engagement_status}</div>
                    </div>
                    <div>
                      <span className="font-medium">حالة الدعوة:</span>
                      <div className="text-muted-foreground">{stakeholder.invitation_status}</div>
                    </div>
                    <div>
                      <span className="font-medium">حالة الحضور:</span>
                      <div className="text-muted-foreground">{stakeholder.attendance_status}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            لا توجد أصحاب مصلحة مسجلين لهذه الفعالية
          </div>
        )}
      </div>
    </div>
  );
};