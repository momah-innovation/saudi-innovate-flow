import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";
import { 
  Building, 
  Globe,
  Mail,
  Phone,
  Star,
  Target,
  TrendingUp,
  Users,
  Edit,
  Award,
  Calendar,
  CheckCircle,
  BarChart3
} from "lucide-react";
import { format } from "date-fns";
import type { PartnerDetailView, PartnerDetailViewProps } from "@/types/api";

export function PartnerDetailView({ 
  isOpen, 
  onClose, 
  partner, 
  onEdit, 
  onRefresh 
}: PartnerDetailViewProps) {
  const { toast } = useToast();
  const { t, isRTL } = useUnifiedTranslation();
  
  const [relatedData, setRelatedData] = useState({
    active_collaborations: [],
    partnership_history: [],
    partnership_metrics: {
      total_collaborations: 0,
      success_rate: 0,
      average_rating: 0
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (partner && isOpen) {
      fetchRelatedData();
    }
  }, [partner, isOpen]);

  const fetchRelatedData = async () => {
    if (!partner) return;
    
    setLoading(true);
    try {
      // Mock data for now - replace with actual API calls
      setRelatedData({
        active_collaborations: partner.active_collaborations || [],
        partnership_history: partner.partnership_history || [],
        partnership_metrics: partner.partnership_metrics || {
          total_collaborations: 0,
          success_rate: 0,
          average_rating: 0
        }
      });
    } catch (error) {
      logger.error('Failed to fetch partner related data', { 
        component: 'PartnerDetailView', 
        action: 'fetchRelatedData',
        partnerId: partner.id 
      }, error as Error);
    } finally {
      setLoading(false);
    }
  };

  const getPartnershipStatusColor = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'inactive': return 'outline';
      case 'terminated': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPartnershipTypeLabel = (type: string) => {
    const labels = {
      strategic: 'استراتيجي',
      operational: 'تشغيلي',
      technical: 'تقني',
      financial: 'مالي',
      academic: 'أكاديمي'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getPartnershipStatusLabel = (status: string) => {
    const labels = {
      active: 'نشط',
      pending: 'في الانتظار',
      inactive: 'غير نشط',
      terminated: 'منتهي'
    };
    return labels[status as keyof typeof labels] || status;
  };

  if (!partner) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold">
                {partner.name_ar || partner.name}
              </DialogTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={getPartnershipStatusColor(partner.partnership_status)}>
                  {getPartnershipStatusLabel(partner.partnership_status)}
                </Badge>
                <Badge variant="outline">
                  {getPartnershipTypeLabel(partner.partnership_type)}
                </Badge>
                <Badge variant="secondary">
                  {relatedData.partnership_metrics.total_collaborations} تعاون
                </Badge>
              </div>
            </div>
            <Button onClick={() => onEdit(partner)} size="sm">
              <Edit className="w-4 h-4 mr-2" />
              تعديل
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="space-y-6 pb-6">
            
            {/* Partner Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  معلومات الشريك
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <h4 className="font-semibold mb-1 text-sm">البريد الإلكتروني</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {partner.contact_email || 'غير محدد'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm">الهاتف</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {partner.contact_phone || 'غير محدد'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm">الموقع الإلكتروني</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      {partner.website ? (
                        <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          زيارة الموقع
                        </a>
                      ) : (
                        'غير محدد'
                      )}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm">تاريخ الانضمام</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(partner.created_at), 'dd/MM/yyyy')}
                    </p>
                  </div>
                </div>

                {partner.description && (
                  <div>
                    <h4 className="font-semibold mb-2">الوصف</h4>
                    <p className="text-sm text-muted-foreground" dir="rtl">{partner.description}</p>
                  </div>
                )}

                {partner.services_offered && partner.services_offered.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">الخدمات المقدمة</h4>
                    <div className="flex flex-wrap gap-2">
                      {partner.services_offered.map((service, index) => (
                        <Badge key={index} variant="outline">{service}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {partner.expertise_areas && partner.expertise_areas.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">مجالات الخبرة</h4>
                    <div className="flex flex-wrap gap-2">
                      {partner.expertise_areas.map((area, index) => (
                        <Badge key={index} variant="secondary">{area}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Partnership Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  مؤشرات الشراكة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {relatedData.partnership_metrics.total_collaborations}
                    </div>
                    <div className="text-sm text-muted-foreground">إجمالي التعاونات</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {relatedData.partnership_metrics.success_rate}%
                    </div>
                    <div className="text-sm text-muted-foreground">معدل النجاح</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {relatedData.partnership_metrics.average_rating}/5
                    </div>
                    <div className="text-sm text-muted-foreground">متوسط التقييم</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Collaborations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  التعاونات النشطة ({relatedData.active_collaborations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {relatedData.active_collaborations.length > 0 ? (
                  <div className="space-y-3">
                    {relatedData.active_collaborations.map((collaboration: { id: string; title_ar: string; status: string; priority_level: string }, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Target className="w-4 h-4 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium">{collaboration.title_ar}</p>
                          <p className="text-sm text-muted-foreground">
                            {collaboration.status}
                          </p>
                        </div>
                        <Badge variant="outline">{collaboration.priority_level}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    لا توجد تعاونات نشطة حالياً
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Partnership History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  تاريخ الشراكة
                </CardTitle>
              </CardHeader>
              <CardContent>
                {relatedData.partnership_history.length > 0 ? (
                  <div className="space-y-3">
                    {relatedData.partnership_history.map((history: { id: string; title: string; date: string; status: string }, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                        <CheckCircle className="w-4 h-4 mt-1 icon-success" />
                        <div className="flex-1">
                          <p className="font-medium">تعاون مكتمل</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(), 'dd/MM/yyyy')}
                          </p>
                        </div>
                        <Badge variant="secondary">مكتمل</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    لا يوجد تاريخ شراكة سابق
                  </p>
                )}
              </CardContent>
            </Card>

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}