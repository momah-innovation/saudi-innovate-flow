import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { createErrorHandler } from '@/utils/unified-error-handler';
import { supabase } from '@/integrations/supabase/client';
import { Shield, UserPlus, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  is_active: boolean;
  granted_at: string;
  expires_at?: string;
}

interface RoleManagerProps {
  targetUserId?: string;
  onRoleChange?: () => void;
}

export const RoleManager: React.FC<RoleManagerProps> = ({ targetUserId, onRoleChange }) => {
  const { userProfile, hasRole } = useAuth();
  const { toast } = useToast();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [newRole, setNewRole] = useState('');
  const [justification, setJustification] = useState('');
  const [expirationDays, setExpirationDays] = useState('30');
  
  // Initialize unified loading and error handling
  const loadingManager = useUnifiedLoading({ 
    component: 'RoleManager',
    showToast: true,
    logErrors: true 
  });
  const errorHandler = createErrorHandler({ component: 'RoleManager' });

  const availableRoles: AppRole[] = [
    'innovator', 'expert', 'partner', 'stakeholder', 'mentor', 'admin', 'super_admin', 
    'department_head', 'sector_lead', 'domain_expert', 'evaluator', 'viewer', 'user_manager',
    'role_manager', 'challenge_manager', 'expert_coordinator', 'content_manager',
    'system_auditor', 'data_analyst', 'campaign_manager', 'event_manager',
    'stakeholder_manager', 'partnership_manager', 'team_lead', 'project_manager',
    'research_lead', 'innovation_manager', 'external_expert', 'judge', 'facilitator', 
    'team_member', 'organization_admin', 'organization_member', 'entity_manager', 
    'deputy_manager', 'domain_manager', 'sub_domain_manager', 'service_manager'
  ];

  const roleDescriptions: Record<AppRole, string> = {
    innovator: 'مبتكر - يمكنه إرسال الأفكار والمشاركة في التحديات',
    expert: 'خبير - متخصص يقدم الاستشارات والتوجيه',
    partner: 'شريك - جهة شريكة في المشاريع والفعاليات',
    stakeholder: 'صاحب مصلحة - له مصلحة في نتائج المشاريع',
    mentor: 'موجه - يرشد المبتكرين والخبراء',
    admin: 'مدير - صلاحيات إدارية شاملة',
    super_admin: 'مدير عام - أعلى مستوى إداري',
    department_head: 'رئيس قسم - يدير قسم محدد',
    sector_lead: 'قائد قطاع - يدير قطاع كامل',
    domain_expert: 'خبير مجال - متخصص في مجال معين',
    evaluator: 'مقيم - يقيم الأفكار والمشاريع',
    viewer: 'مشاهد - صلاحيات عرض فقط',
    user_manager: 'مدير مستخدمين - إدارة المستخدمين',
    role_manager: 'مدير أدوار - إدارة الأدوار والصلاحيات',
    challenge_manager: 'مدير تحديات - إدارة التحديات',
    expert_coordinator: 'منسق خبراء - تنسيق عمل الخبراء',
    content_manager: 'مدير محتوى - إدارة المحتوى',
    system_auditor: 'مراجع نظم - مراجعة أمان النظم',
    data_analyst: 'محلل بيانات - تحليل البيانات والإحصائيات',
    campaign_manager: 'مدير حملات - إدارة الحملات',
    event_manager: 'مدير فعاليات - إدارة الفعاليات',
    stakeholder_manager: 'مدير أصحاب مصلحة - إدارة الشركاء',
    partnership_manager: 'مدير شراكات - إدارة الشراكات',
    team_lead: 'قائد فريق - قيادة فريق العمل',
    project_manager: 'مدير مشروع - إدارة المشاريع',
    research_lead: 'قائد بحث - قيادة الأبحاث',
    innovation_manager: 'مدير ابتكار - إدارة عمليات الابتكار',
    external_expert: 'خبير خارجي - خبير من خارج المؤسسة',
    judge: 'محكم - تحكيم المسابقات والتحديات',
    facilitator: 'ميسر - تسهيل العمليات والأنشطة',
    team_member: 'عضو فريق - عضو في فريق العمل',
    organization_admin: 'مدير منظمة - إدارة منظمة معينة',
    organization_member: 'عضو منظمة - عضو في منظمة',
    entity_manager: 'مدير كيان - إدارة كيان تنظيمي',
    deputy_manager: 'مدير وكالة - إدارة وكالة',
    domain_manager: 'مدير مجال - إدارة مجال عمل',
    sub_domain_manager: 'مدير مجال فرعي - إدارة مجال فرعي',
    service_manager: 'مدير خدمة - إدارة خدمة محددة'
  };

  const userId = targetUserId || userProfile?.id;

  useEffect(() => {
    if (userId) {
      fetchUserRoles();
    }
  }, [userId]);

  const fetchUserRoles = async () => {
    if (!userId) return;

    const operation = async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .order('granted_at', { ascending: false });

      if (error) throw error;
      setUserRoles(data || []);
      return data;
    };

    await loadingManager.withLoading(
      'fetch_roles',
      operation,
      {
        errorMessage: 'خطأ في تحميل الأدوار',
        logContext: { userId }
      }
    );
  };

  const assignRole = async () => {
    if (!newRole || !justification.trim()) {
      toast({
        title: "خطأ في التحقق",
        description: "يرجى اختيار الدور وكتابة المبرر",
        variant: "destructive",
      });
      return;
    }

    const operation = async () => {
      const expiresAt = expirationDays !== 'never' ? 
        new Date(Date.now() + parseInt(expirationDays) * 24 * 60 * 60 * 1000).toISOString() : 
        null;

      const { error } = await supabase.rpc('assign_role_with_justification', {
        target_user_id: userId,
        target_role: newRole as AppRole,
        justification: justification,
        expires_at: expiresAt
      });

      if (error) throw error;

      setNewRole('');
      setJustification('');
      setExpirationDays('30');
      await fetchUserRoles();
      onRoleChange?.();
      return { success: true };
    };

    await loadingManager.withLoading(
      'assign_role',
      operation,
      {
        successMessage: `تم تعيين دور ${roleDescriptions[newRole]} للمستخدم`,
        errorMessage: 'خطأ في تعيين الدور',
        logContext: { userId, newRole, expirationDays }
      }
    );
  };

  const revokeRole = async (roleId: string) => {
    const operation = async () => {
      const { error } = await supabase
        .from('user_roles')
        .update({ is_active: false })
        .eq('id', roleId);

      if (error) throw error;

      await fetchUserRoles();
      onRoleChange?.();
      return { success: true };
    };

    await loadingManager.withLoading(
      'revoke_role',
      operation,
      {
        successMessage: 'تم إلغاء الدور بنجاح',
        errorMessage: 'خطأ في إلغاء الدور',
        logContext: { roleId, userId }
      }
    );
  };

  const getRoleBadgeVariant = (role: AppRole, isActive: boolean) => {
    if (!isActive) return 'outline';
    
    if (role.includes('admin')) return 'destructive';
    if (role === 'evaluator') return 'default';
    if (role === 'innovator') return 'secondary';
    return 'outline';
  };

  const isExpired = (expiresAt?: string) => {
    return expiresAt && new Date(expiresAt) < new Date();
  };

  // Check if current user can manage roles
  const canManageRoles = hasRole('admin') || hasRole('super_admin') || hasRole('user_admin');

  if (!canManageRoles && !targetUserId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <Shield className="h-8 w-8 mx-auto mb-2" />
            <p>ليس لديك صلاحية لإدارة الأدوار</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Roles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            الأدوار الحالية
          </CardTitle>
          <CardDescription>
            الأدوار المعينة للمستخدم حالياً
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userRoles.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              لا توجد أدوار معينة حالياً
            </p>
          ) : (
            <div className="space-y-3">
              {userRoles.map((userRole) => (
                <div key={userRole.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={getRoleBadgeVariant(userRole.role, userRole.is_active)}
                      className="flex items-center gap-1"
                    >
                      {userRole.is_active ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      {roleDescriptions[userRole.role] || userRole.role}
                    </Badge>
                    
                    {userRole.expires_at && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {isExpired(userRole.expires_at) ? (
                          <span className="text-destructive">منتهي الصلاحية</span>
                        ) : (
                          <span>ينتهي في {new Date(userRole.expires_at).toLocaleDateString('ar-SA')}</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {canManageRoles && userRole.is_active && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => revokeRole(userRole.id)}
                      disabled={loadingManager.isLoading('revoke_role')}
                      className="hover:bg-destructive hover:text-destructive-foreground"
                    >
                      إلغاء
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign New Role */}
      {canManageRoles && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              تعيين دور جديد
            </CardTitle>
            <CardDescription>
              تعيين دور جديد للمستخدم مع تحديد فترة الصلاحية
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>الدور</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الدور المراد تعيينه" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {roleDescriptions[role] || role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>فترة الصلاحية</Label>
              <Select value={expirationDays} onValueChange={setExpirationDays}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">أسبوع واحد</SelectItem>
                  <SelectItem value="30">شهر واحد</SelectItem>
                  <SelectItem value="90">3 أشهر</SelectItem>
                  <SelectItem value="180">6 أشهر</SelectItem>
                  <SelectItem value="365">سنة واحدة</SelectItem>
                  <SelectItem value="never">بدون انتهاء</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>مبرر التعيين *</Label>
              <Textarea
                placeholder="اكتب مبرر تعيين هذا الدور للمستخدم..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                className="min-h-20"
              />
            </div>

            <Button
              onClick={assignRole}
              disabled={loadingManager.isLoading('assign_role') || !newRole || !justification.trim()}
              className="w-full"
            >
              {loadingManager.isLoading('assign_role') ? "جارٍ التعيين..." : "تعيين الدور"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};