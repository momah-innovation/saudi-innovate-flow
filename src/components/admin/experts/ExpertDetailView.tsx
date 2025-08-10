import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";
import { 
  User, 
  Star,
  Briefcase,
  Clock,
  Award,
  Activity,
  Edit,
  Calendar,
  Target,
  TrendingUp,
  Users,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";
import type { ExpertDetailView, ExpertDetailViewProps } from "@/types/api";
import type { BadgeVariant } from "@/types";

export function ExpertDetailView({ 
  isOpen, 
  onClose, 
  expert, 
  onEdit, 
  onRefresh 
}: ExpertDetailViewProps) {
  const { toast } = useToast();
  const { t, isRTL } = useUnifiedTranslation();
  
  const [relatedData, setRelatedData] = useState({
    assignments: [],
    evaluations: [],
    team_activities: [],
    workload_info: {
      current_workload: 0,
      max_concurrent_projects: 0,
      utilization_percentage: 0
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expert && isOpen) {
      fetchRelatedData();
    }
  }, [expert, isOpen]);

  const fetchRelatedData = async () => {
    if (!expert) return;
    
    setLoading(true);
    try {
      // Mock data for now - replace with actual API calls
      setRelatedData({
        assignments: [],
        evaluations: [],
        team_activities: [],
        workload_info: {
          current_workload: expert.workload_info?.current_workload || 0,
          max_concurrent_projects: expert.workload_info?.max_concurrent_projects || 5,
          utilization_percentage: expert.workload_info?.utilization_percentage || 0
        }
      });
    } catch (error) {
      logger.error('Failed to fetch expert related data', { 
        component: 'ExpertDetailView', 
        action: 'fetchRelatedData',
        expertId: expert.id 
      }, error as Error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return 'default';
      case 'busy': return 'warning';
      case 'unavailable': return 'destructive';
      default: return 'secondary';
    }
  };

  const getExpertLevelLabel = (level: string) => {
    const labels = {
      junior: 'مبتدئ',
      senior: 'أول',
      lead: 'رئيس',
      principal: 'مدير خبير'
    };
    return labels[level as keyof typeof labels] || level;
  };

  if (!expert) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold">
                {expert.profiles?.name || 'خبير'}
              </DialogTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={getAvailabilityColor(expert.availability_status) as BadgeVariant}>
                  {expert.availability_status === 'available' ? 'متاح' : 
                   expert.availability_status === 'busy' ? 'مشغول' : 'غير متاح'}
                </Badge>
                <Badge variant="outline">{getExpertLevelLabel(expert.expert_level)}</Badge>
                <Badge variant="secondary">
                  {expert.years_of_experience} سنة خبرة
                </Badge>
              </div>
            </div>
            <Button onClick={() => onEdit(expert)} size="sm">
              <Edit className="w-4 h-4 mr-2" />
              تعديل
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="space-y-6 pb-6">
            
            {/* Expert Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  معلومات الخبير
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <h4 className="font-semibold mb-1 text-sm">الإيميل</h4>
                    <p className="text-sm text-muted-foreground">
                      {expert.profiles?.email || t('common.not_specified', 'غير محدد')}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm">مستوى الخبرة</h4>
                    <p className="text-sm text-muted-foreground">
                      {getExpertLevelLabel(expert.expert_level)}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm">سنوات الخبرة</h4>
                    <p className="text-sm text-muted-foreground">
                      {expert.years_of_experience || 0} سنة
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm">الحد الأقصى للمشاريع</h4>
                    <p className="text-sm text-muted-foreground">
                      {expert.max_concurrent_projects || t('common.not_specified', 'غير محدد')}
                    </p>
                  </div>
                </div>

                {expert.bio && (
                  <div>
                    <h4 className="font-semibold mb-2">السيرة الذاتية</h4>
                    <p className="text-sm text-muted-foreground" dir="rtl">{expert.bio}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2">مجالات الخبرة</h4>
                  <div className="flex flex-wrap gap-2">
                    {expert.expertise_areas.map((area, index) => (
                      <Badge key={index} variant="outline">{area}</Badge>
                    ))}
                  </div>
                </div>

                {expert.specialization_tags && expert.specialization_tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">التخصصات</h4>
                    <div className="flex flex-wrap gap-2">
                      {expert.specialization_tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Workload Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  معلومات العبء
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {relatedData.workload_info.current_workload}
                    </div>
                    <div className="text-sm text-muted-foreground">العبء الحالي</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {relatedData.workload_info.max_concurrent_projects}
                    </div>
                    <div className="text-sm text-muted-foreground">الحد الأقصى</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {relatedData.workload_info.utilization_percentage}%
                    </div>
                    <div className="text-sm text-muted-foreground">نسبة الاستخدام</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  التفاصيل المهنية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {expert.hourly_rate && (
                    <div>
                      <h4 className="font-semibold mb-1 text-sm">الأجر بالساعة</h4>
                      <p className="text-sm text-muted-foreground">
                        {expert.hourly_rate} ريال/ساعة
                      </p>
                    </div>
                  )}
                  {expert.certification_level && (
                    <div>
                      <h4 className="font-semibold mb-1 text-sm">مستوى الشهادة</h4>
                      <p className="text-sm text-muted-foreground">
                        {expert.certification_level}
                      </p>
                    </div>
                  )}
                </div>

                {expert.preferred_project_types && expert.preferred_project_types.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">أنواع المشاريع المفضلة</h4>
                    <div className="flex flex-wrap gap-2">
                      {expert.preferred_project_types.map((type, index) => (
                        <Badge key={index} variant="outline">{type}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {expert.language_preferences && expert.language_preferences.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">اللغات المفضلة</h4>
                    <div className="flex flex-wrap gap-2">
                      {expert.language_preferences.map((lang, index) => (
                        <Badge key={index} variant="secondary">{lang}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {t('expert.recent_activities', 'الأنشطة الأخيرة')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {relatedData.team_activities.length > 0 ? (
                  <div className="space-y-3">
                    {relatedData.team_activities.map((activity: { id: string; title: string; date: string }, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                        <CheckCircle className="w-4 h-4 mt-1 icon-success" />
                        <div className="flex-1">
                          <p className="font-medium">{t('expert.new_activity', 'نشاط جديد')}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(), 'dd/MM/yyyy')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {t('expert.no_recent_activities', 'لا توجد أنشطة حديثة')}
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