import { ReactNode, useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Target, CheckCircle, AlertTriangle, Mail, Building, 
  User, Calendar, Clock, TrendingUp, Star, Award, 
  MapPin, Phone, Globe, Crown, Users, Briefcase,
  FileText, MessageSquare, Settings, Activity,
  ChevronRight, ExternalLink, Edit
} from 'lucide-react';
import { CoreTeamMemberData } from './core-team-card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

interface CoreTeamDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: CoreTeamMemberData | null;
  onEdit?: () => void;
  children?: ReactNode;
}

interface AssignmentData {
  assignment_id: string;
  title?: string;
  assignment_type?: string;
  description?: string;
  status: string;
  created_at: string;
  due_date?: string;
  assigned_by?: string;
  actual_hours?: number;
  estimated_hours?: number;
}

interface ActivityData {
  activity_description: string;
  description?: string;
  created_at: string;
  activity_type?: string;
  activity_date?: string;
  end_time?: string;
}

interface ItemData {
  title: string;
}

interface RelatedData {
  campaigns: ItemData[];
  challenges: ItemData[];
  events: ItemData[];
  assignments: AssignmentData[];
  activities: ActivityData[];
  stakeholders: unknown[];
  partners: unknown[];
}

export function CoreTeamDetailDialog({
  open,
  onOpenChange,
  data,
  onEdit,
  children
}: CoreTeamDetailDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [relatedData, setRelatedData] = useState<RelatedData>({
    campaigns: [],
    challenges: [],
    events: [],
    assignments: [],
    activities: [],
    stakeholders: [],
    partners: []
  });

  useEffect(() => {
    if (open && data?.id) {
      fetchRelatedData();
    }
  }, [open, data?.id]);

  const fetchRelatedData = async () => {
    if (!data?.id) return;
    
    try {
      setLoading(true);

      // Fetch team assignments
      const { data: assignments, error: assignmentsError } = await supabase
        .from('team_assignments')
        .select('*')
        .eq('team_member_id', data.id)
        .order('created_at', { ascending: false });

      // Fetch team activities
      const { data: activities, error: activitiesError } = await supabase
        .from('team_activities')
        .select('*')
        .eq('team_member_id', data.id)
        .order('created_at', { ascending: false })
        .limit(10);

      // For now, we'll use mock data for campaigns, challenges, events, etc.
      // In a real implementation, these would be fetched based on relationships
      
      setRelatedData({
        campaigns: [], // Will be populated based on actual relationships
        challenges: [], // Will be populated based on actual relationships
        events: [], // Will be populated based on actual relationships
        assignments: assignments || [],
        activities: activities || [],
        stakeholders: [], // Will be populated based on actual relationships
        partners: [] // Will be populated based on actual relationships
      });

    } catch (error) {
      logger.error('Error fetching related data', { component: 'CoreTeamDetailDialog', action: 'fetchRelatedData', itemId: data.id }, error as Error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل البيانات المرتبطة.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!data) return null;

  const displayName = data.name || data.name_ar || 'مستخدم غير معروف';
  const displayEmail = data.email || 'غير محدد';
  const avatarFallback = displayName.charAt(0) || 'U';

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'busy': return 'destructive';
      case 'leave': return 'secondary';
      case 'inactive': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'busy': return <Clock className="h-3 w-3 mr-1" />;
      case 'leave': return <Calendar className="h-3 w-3 mr-1" />;
      case 'inactive': return <AlertTriangle className="h-3 w-3 mr-1" />;
      default: return <AlertTriangle className="h-3 w-3 mr-1" />;
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'busy': return 'مشغول';
      case 'leave': return 'في إجازة';
      case 'inactive': return 'غير نشط';
      default: return 'غير محدد';
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" />
            المعلومات الأساسية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">الدور في الفريق</label>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="outline">{data.cic_role || data.role || 'غير محدد'}</Badge>
                {data.cic_role === 'leader' && <Crown className="h-4 w-4 text-warning" />}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">الحالة</label>
              <div className="mt-1">
                <Badge variant={getStatusColor(data.status)}>
                  {getStatusIcon(data.status)}
                  {getStatusText(data.status)}
                </Badge>
              </div>
            </div>
          </div>

          {data.department && (
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Building className="h-3 w-3" />
                القسم
              </label>
              <p className="mt-1 text-sm">{data.department}</p>
            </div>
          )}

          {data.position && (
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                المنصب
              </label>
              <p className="mt-1 text-sm">{data.position}</p>
            </div>
          )}

          {data.bio && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">النبذة الشخصية</label>
              <p className="mt-1 text-sm text-muted-foreground">{data.bio}</p>
            </div>
          )}

          {/* Contact Information */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">معلومات الاتصال</label>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <span>{displayEmail}</span>
              </div>
              {data.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span>{data.phone}</span>
                </div>
              )}
              {data.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span>{data.location}</span>
                </div>
              )}
              {data.website && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-3 w-3 text-muted-foreground" />
                  <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {data.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Specialization & Skills */}
          {(data.specialization || data.skills) && (
            <div className="space-y-3">
              {data.specialization && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">التخصص</label>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {Array.isArray(data.specialization) ? (
                      data.specialization.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        {data.specialization}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {data.skills && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">المهارات</label>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {data.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {data.certifications && data.certifications.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">الشهادات</label>
                  <div className="mt-1 space-y-1">
                    {data.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Award className="h-3 w-3 text-muted-foreground" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            مقاييس الأداء
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {data.current_workload !== undefined && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  عبء العمل الحالي
                </label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>النسبة المئوية</span>
                    <span className="font-medium">{data.current_workload}%</span>
                  </div>
                  <Progress value={data.current_workload} className="h-3" />
                </div>
              </div>
            )}

            {data.performance_score !== undefined && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  نقاط الأداء
                </label>
                <div className="mt-2">
                  <div className="text-2xl font-bold">{data.performance_score}%</div>
                  <Progress value={data.performance_score} className="h-2 mt-1" />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {data.activeAssignments !== undefined && (
              <div className="text-center">
                <div className="text-lg font-bold">{data.activeAssignments}</div>
                <div className="text-xs text-muted-foreground">المهام النشطة</div>
              </div>
            )}

            {data.completedAssignments !== undefined && (
              <div className="text-center">
                <div className="text-lg font-bold">{data.completedAssignments}</div>
                <div className="text-xs text-muted-foreground">المهام المكتملة</div>
              </div>
            )}

            {data.efficiency_rating !== undefined && (
              <div className="text-center">
                <div className="text-lg font-bold">{data.efficiency_rating}%</div>
                <div className="text-xs text-muted-foreground">معدل الكفاءة</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Innovation Metrics */}
      {(data.ideas_submitted || data.innovation_score || data.collaboration_score) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4" />
              مقاييس الابتكار
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {data.ideas_submitted !== undefined && (
                <div className="text-center">
                  <div className="text-lg font-bold">{data.ideas_submitted}</div>
                  <div className="text-xs text-muted-foreground">الأفكار المقدمة</div>
                </div>
              )}

              {data.ideas_approved !== undefined && (
                <div className="text-center">
                  <div className="text-lg font-bold">{data.ideas_approved}</div>
                  <div className="text-xs text-muted-foreground">الأفكار المعتمدة</div>
                </div>
              )}

              {data.innovation_score !== undefined && (
                <div className="text-center">
                  <div className="text-lg font-bold">{data.innovation_score}</div>
                  <div className="text-xs text-muted-foreground">نقاط الابتكار</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderAssignmentsTab = () => (
    <div className="space-y-4">
      {relatedData.assignments.length > 0 ? (
        relatedData.assignments.map((assignment, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{assignment.title || assignment.assignment_type || 'مهمة غير معنونة'}</h4>
                  <p className="text-sm text-muted-foreground">{assignment.description}</p>
                </div>
                <Badge variant={assignment.status === 'active' ? 'default' : 'secondary'}>
                  {assignment.status === 'active' ? 'نشطة' : assignment.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Target className="h-8 w-8 mx-auto mb-2" />
          <p>لا توجد مهام محددة حالياً</p>
        </div>
      )}
    </div>
  );

  const renderActivitiesTab = () => (
    <div className="space-y-4">
      {relatedData.activities.length > 0 ? (
        relatedData.activities.map((activity, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Activity className="h-4 w-4 mt-1 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm">{activity.description || activity.activity_description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(activity.created_at).toLocaleString('ar-SA')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Activity className="h-8 w-8 mx-auto mb-2" />
          <p>لا توجد أنشطة مسجلة</p>
        </div>
      )}
    </div>
  );

  const renderRelationshipsTab = () => (
    <div className="space-y-6">
      {/* Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">الحملات المشاركة</CardTitle>
        </CardHeader>
        <CardContent>
          {relatedData.campaigns.length > 0 ? (
            <div className="space-y-2">
              {relatedData.campaigns.map((campaign, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded border">
                  <span className="text-sm">{campaign.title}</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">لا توجد حملات مشاركة</p>
          )}
        </CardContent>
      </Card>

      {/* Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">التحديات المرتبطة</CardTitle>
        </CardHeader>
        <CardContent>
          {relatedData.challenges.length > 0 ? (
            <div className="space-y-2">
              {relatedData.challenges.map((challenge, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded border">
                  <span className="text-sm">{challenge.title}</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">لا توجد تحديات مرتبطة</p>
          )}
        </CardContent>
      </Card>

      {/* Events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">الفعاليات المشاركة</CardTitle>
        </CardHeader>
        <CardContent>
          {relatedData.events.length > 0 ? (
            <div className="space-y-2">
              {relatedData.events.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded border">
                  <span className="text-sm">{event.title}</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">لا توجد فعاليات مشاركة</p>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={data.profile_image_url} />
                  <AvatarFallback className="text-lg">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
                {data.cic_role === 'leader' && (
                  <Crown className="absolute -top-1 -right-1 h-5 w-5 text-warning" />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl flex items-center gap-2">
                  {displayName}
                  {data.performance_score && data.performance_score >= 90 && (
                    <Star className="h-5 w-5 text-warning" />
                  )}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {displayEmail}
                </DialogDescription>
                {data.position && (
                  <DialogDescription className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4" />
                    {data.position}
                  </DialogDescription>
                )}
              </div>
            </div>
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                تعديل
              </Button>
            )}
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="assignments">المهام</TabsTrigger>
            <TabsTrigger value="activities">الأنشطة</TabsTrigger>
            <TabsTrigger value="relationships">العلاقات</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[600px] w-full">
            <TabsContent value="overview" className="mt-6">
              {renderOverviewTab()}
            </TabsContent>

            <TabsContent value="assignments" className="mt-6">
              {renderAssignmentsTab()}
            </TabsContent>

            <TabsContent value="activities" className="mt-6">
              {renderActivitiesTab()}
            </TabsContent>

            <TabsContent value="relationships" className="mt-6">
              {renderRelationshipsTab()}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {children}
      </DialogContent>
    </Dialog>
  );
}