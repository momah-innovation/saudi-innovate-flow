import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatDateArabic } from '@/utils/unified-date-handler';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Calendar, 
  MessageCircle, 
  Star,
  Clock,
  CheckCircle,
  Mail
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useDirection } from '@/components/ui/direction-provider';

interface ChallengeExpertPanelProps {
  challengeId: string;
}

interface Expert {
  id: string;
  expert_id: string;
  role_type: string;
  status: string;
  notes?: string;
  assignment_date: string;
  expert?: {
    user_id: string;
    expertise_areas: string[];
    expert_level: string;
    availability_status: string;
    profiles?: {
      name: string;
      name_ar: string;
      email: string;
      profile_image_url?: string;
    };
  };
}

export const ChallengeExpertPanel: React.FC<ChallengeExpertPanelProps> = ({
  challengeId
}) => {
  const { isRTL } = useDirection();
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExperts();
  }, [challengeId]);

  const loadExperts = async () => {
    try {
      const { data, error } = await supabase
        .from('challenge_experts')
        .select(`
          *,
          expert:experts(
            user_id,
            expertise_areas,
            expert_level,
            availability_status,
            profiles(name, name_ar, email, profile_image_url)
          )
        `)
        .eq('challenge_id', challengeId)
        .eq('status', 'active');

      if (error) throw error;
      setExperts((data as any[])?.filter(item => item.expert?.profiles) || []);
    } catch (error) {
      logger.error('Error loading experts', { challengeId }, error as Error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleTypeLabel = (roleType: string) => {
    const roleMap = {
      'evaluator': 'مقيم',
      'mentor': 'موجه',
      'reviewer': 'مراجع',
      'advisor': 'مستشار'
    };
    return roleMap[roleType as keyof typeof roleMap] || roleType;
  };

  const getExpertLevelColor = (level: string) => {
    switch (level) {
      case 'senior': return 'bg-purple-100 text-purple-800';
      case 'mid': return 'bg-blue-100 text-blue-800';
      case 'junior': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExpertLevelLabel = (level: string) => {
    const levelMap = {
      'senior': 'خبير أول',
      'mid': 'خبير متوسط',
      'junior': 'خبير مبتدئ'
    };
    return levelMap[level as keyof typeof levelMap] || level;
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-500';
      case 'busy': return 'text-yellow-500';
      case 'unavailable': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getAvailabilityLabel = (status: string) => {
    const statusMap = {
      'available': 'متاح',
      'busy': 'مشغول',
      'unavailable': 'غير متاح'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">جاري تحميل الخبراء...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Experts Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            خبراء التحدي ({experts.length})
          </CardTitle>
          <CardDescription>
            الخبراء المختصون المعينون لمراجعة وتوجيه المشاركين في هذا التحدي
          </CardDescription>
        </CardHeader>
      </Card>

      {experts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا يوجد خبراء معينون</h3>
              <p className="text-muted-foreground">
                لم يتم تعيين خبراء لهذا التحدي بعد
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {experts.map((expertAssignment) => {
            const expert = expertAssignment.expert;
            const profile = expert?.profiles;
            
            return (
              <Card key={expertAssignment.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={profile?.profile_image_url} />
                      <AvatarFallback>
                        {profile?.name_ar?.charAt(0) || 'خ'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {profile?.name_ar || profile?.name || 'خبير'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {profile?.email}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <div className={`w-2 h-2 rounded-full ${getAvailabilityColor(expert?.availability_status || 'unavailable')}`} />
                          <span className={`text-sm ${getAvailabilityColor(expert?.availability_status || 'unavailable')}`}>
                            {getAvailabilityLabel(expert?.availability_status || 'unavailable')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">
                          {getRoleTypeLabel(expertAssignment.role_type)}
                        </Badge>
                        <Badge className={getExpertLevelColor(expert?.expert_level || 'junior')}>
                          {getExpertLevelLabel(expert?.expert_level || 'junior')}
                        </Badge>
                      </div>
                      
                      {expert?.expertise_areas && expert.expertise_areas.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-1">مجالات الخبرة:</p>
                          <div className="flex flex-wrap gap-1">
                            {expert.expertise_areas.map((area, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                          <Calendar className="h-4 w-4" />
                          <span>معين منذ {isRTL ? formatDateArabic(expertAssignment.assignment_date, 'PPP') : formatDate(expertAssignment.assignment_date, 'PPP')}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 rtl:space-x-reverse pt-2">
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          مراسلة
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4 mr-2" />
                          حجز استشارة
                        </Button>
                        <Button size="sm" variant="outline">
                          <Star className="h-4 w-4 mr-2" />
                          تقييم
                        </Button>
                      </div>
                      
                      {expertAssignment.notes && (
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-sm">{expertAssignment.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Expert Office Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            ساعات المكتب
          </CardTitle>
          <CardDescription>
            احجز جلسة استشارة مع الخبراء المتاحين
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">ساعات المكتب متاحة قريباً</h3>
            <p className="text-muted-foreground mb-4">
              سيتمكن المشاركون من حجز جلسات استشارة مع الخبراء
            </p>
            <Button variant="outline" disabled>
              <Mail className="h-4 w-4 mr-2" />
              إشعاري عند التوفر
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};