import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminBreadcrumb } from '@/components/layout/AdminBreadcrumb';
import { ChallengeDetailView } from '@/components/admin/challenges/ChallengeDetailView';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Edit, MoreHorizontal } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/ui/loading';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChallengeWizardV2 } from '@/components/admin/challenges/ChallengeWizardV2';
import { ChallengeRow, ChallengeWithRelations } from '@/types/api';

export default function ChallengeDetailPage() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const { isRTL, language } = useDirection();
  const { t } = useUnifiedTranslation();
  const { toast } = useToast();
  
  const [challenge, setChallenge] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditWizard, setShowEditWizard] = useState(false);

  // Debug logging
  console.log('🔍 ChallengeDetail Debug:', {
    challengeId,
    pathname: location.pathname,
    params: { challengeId }
  });

  useEffect(() => {
    console.log('🔍 ChallengeDetail useEffect triggered:', { challengeId });
    if (challengeId) {
      fetchChallenge();
    } else {
      console.error('❌ No challengeId provided');
    }
  }, [challengeId]);

  const fetchChallenge = async () => {
    if (!challengeId) {
      console.error('🔴 ChallengeDetail: No challengeId provided');
      return;
    }
    
    console.log('🔍 ChallengeDetail: Starting fetchChallenge for ID:', challengeId);
    
    try {
      setLoading(true);
      console.log('🔍 ChallengeDetail: Building complex query...');
      
      // Fetch challenge with all related data
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          *,
          sectors:sector_id(id, name_ar, name_en),
          deputies:deputy_id(id, name_ar, name_en, deputy_minister, contact_email),
          departments:department_id(id, name_ar, name_en, department_head),
          domains:domain_id(id, name_ar, name_en, domain_lead, specialization),
          sub_domains:sub_domain_id(id, name_ar, technical_focus),
          services:service_id(id, name_ar, service_type, citizen_facing),
          challenge_experts(
            id,
            role_type,
            status,
            assignment_date,
            notes,
            expert_id
          ),
          challenge_partners(
            id,
            partnership_type,
            status,
            funding_amount,
            contribution_details,
            partners(id, name_ar, name_en, partner_type, email)
          ),
          challenge_requirements(
            id,
            title,
            description,
            requirement_type,
            is_mandatory,
            weight_percentage,
            order_sequence
          ),
          challenge_tags(
            id,
            tags(id, name_ar, name_en, category, color)
          ),
          challenge_participants(
            id,
            user_id,
            participation_type,
            team_name,
            status,
            registration_date
          ),
          focus_questions(
            id,
            question_text_ar,
            question_text_en,
            question_type,
            order_sequence,
            is_sensitive
          ),
          challenge_submissions(
            id,
            title_ar,
            title_en,
            description_ar,
            description_en,
            status,
            score,
            submission_date,
            submitted_by
          )
        `)
        .eq('id', challengeId)
        .maybeSingle();

      console.log('🔍 ChallengeDetail: Query executed. Result:', { 
        hasData: !!data, 
        hasError: !!error,
        errorDetails: error,
        dataKeys: data ? Object.keys(data) : []
      });

      if (error) {
        console.error('🔴 ChallengeDetail: Database error:', {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          challengeId
        });
        
        toast({
          title: language === 'ar' ? 'خطأ' : 'Error',
          description: language === 'ar' ? 'فشل في تحميل التحدي' : 'Failed to load challenge',
          variant: 'destructive',
        });
        return;
      }

      if (!data) {
        console.warn('🟡 ChallengeDetail: No data returned for challengeId:', challengeId);
        toast({
          title: language === 'ar' ? 'غير موجود' : 'Not Found',
          description: language === 'ar' ? 'التحدي غير موجود' : 'Challenge not found',
          variant: 'destructive',
        });
        return;
      }

      console.log('✅ ChallengeDetail: Successfully fetched challenge:', {
        id: data.id,
        title: data.title_ar,
        hasRelations: {
          sectors: !!data.sectors,
          deputies: !!data.deputies,
          departments: !!data.departments,
          domains: !!data.domains,
          experts: Array.isArray(data.challenge_experts) ? data.challenge_experts.length : 0,
          partners: Array.isArray(data.challenge_partners) ? data.challenge_partners.length : 0
        }
      });
      
      setChallenge(data);
    } catch (error) {
      console.error('🔴 ChallengeDetail: Unexpected error:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        challengeId
      });
      
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      console.log('🔍 ChallengeDetail: fetchChallenge completed');
    }
  };

  const handleBack = () => {
    navigate('/admin/challenges');
  };

  const handleEdit = () => {
    setShowEditWizard(true);
  };

  const handleDelete = async () => {
    if (!challengeId || !challenge) return;
    
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا التحدي؟' : 'Are you sure you want to delete this challenge?')) {
      try {
        const { error } = await supabase
          .from('challenges')
          .delete()
          .eq('id', challengeId);

        if (error) {
          console.error('Error deleting challenge:', error);
          toast({
            title: language === 'ar' ? 'خطأ' : 'Error',
            description: language === 'ar' ? 'فشل في حذف التحدي' : 'Failed to delete challenge',
            variant: 'destructive',
          });
          return;
        }

        toast({
          title: language === 'ar' ? 'تم الحذف' : 'Deleted',
          description: language === 'ar' ? 'تم حذف التحدي بنجاح' : 'Challenge deleted successfully',
        });
        
        navigate('/admin/challenges');
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: language === 'ar' ? 'خطأ' : 'Error',
          description: language === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred',
          variant: 'destructive',
        });
      }
    }
  };

  const handleWizardClose = () => {
    setShowEditWizard(false);
    // Refresh challenge data after edit
    fetchChallenge();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
          <AdminBreadcrumb />
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        </div>
    );
  }

  if (!challenge) {
    return (
      <div className="container mx-auto px-4 py-8">
          <AdminBreadcrumb />
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'ar' ? 'التحدي غير موجود' : 'Challenge Not Found'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {language === 'ar' ? 'التحدي المطلوب غير موجود أو تم حذفه' : 'The requested challenge does not exist or has been deleted'}
            </p>
            <Button onClick={handleBack} variant="outline">
              {isRTL ? <ArrowRight className="w-4 h-4 ml-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
              {language === 'ar' ? 'العودة إلى التحديات' : 'Back to Challenges'}
            </Button>
          </div>
        </div>
    );
  }

  const challengeTitle = language === 'ar' ? challenge.title_ar : (challenge.title_en || challenge.title_ar);

  return (
    <div className="container mx-auto px-4 py-8">
        <AdminBreadcrumb />
        
        {/* Header with Actions */}
        <div className={cn(
          "flex items-center justify-between mb-6 gap-4",
          isRTL && "flex-row-reverse"
        )}>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className={cn(
                "flex items-center gap-2",
                isRTL && "flex-row-reverse"
              )}
            >
              {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              {language === 'ar' ? 'العودة' : 'Back'}
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                {challengeTitle}
              </h1>
              {challenge.title_en && language === 'ar' && (
                <p className="text-sm text-muted-foreground mt-1" dir="ltr">
                  {challenge.title_en}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleEdit} className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              {language === 'ar' ? 'تعديل' : 'Edit'}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? "start" : "end"}>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  {language === 'ar' ? 'حذف التحدي' : 'Delete Challenge'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Challenge Detail Content */}
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {language === 'ar' ? 'الوصف' : 'Description'}
                </h3>
                <p className="text-muted-foreground" dir="rtl">
                  {challenge.description_ar}
                </p>
                {challenge.description_en && (
                  <>
                    <h4 className="font-medium mt-4 mb-2">Description (English)</h4>
                    <p className="text-muted-foreground" dir="ltr">
                      {challenge.description_en}
                    </p>
                  </>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {language === 'ar' ? 'معلومات أساسية' : 'Basic Information'}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {language === 'ar' ? 'الحالة:' : 'Status:'}
                    </span>
                    <span className="font-medium">{challenge.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {language === 'ar' ? 'مستوى الأولوية:' : 'Priority Level:'}
                    </span>
                    <span className="font-medium">{challenge.priority_level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {language === 'ar' ? 'مستوى الحساسية:' : 'Sensitivity Level:'}
                    </span>
                    <span className="font-medium">{challenge.sensitivity_level}</span>
                  </div>
                  {challenge.challenge_type && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {language === 'ar' ? 'نوع التحدي:' : 'Challenge Type:'}
                      </span>
                      <span className="font-medium">{challenge.challenge_type}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {language === 'ar' ? 'الجدول الزمني والميزانية' : 'Timeline & Budget'}
                </h3>
                <div className="space-y-2">
                  {challenge.start_date && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {language === 'ar' ? 'تاريخ البداية:' : 'Start Date:'}
                      </span>
                      <span className="font-medium">
                        {new Date(challenge.start_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {challenge.end_date && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {language === 'ar' ? 'تاريخ النهاية:' : 'End Date:'}
                      </span>
                      <span className="font-medium">
                        {new Date(challenge.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {challenge.estimated_budget && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {language === 'ar' ? 'الميزانية المقدرة:' : 'Estimated Budget:'}
                      </span>
                      <span className="font-medium">
                        {challenge.estimated_budget.toLocaleString()} {language === 'ar' ? 'ريال' : 'SAR'}
                      </span>
                    </div>
                  )}
                  {challenge.actual_budget && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {language === 'ar' ? 'الميزانية الفعلية:' : 'Actual Budget:'}
                      </span>
                      <span className="font-medium">
                        {challenge.actual_budget.toLocaleString()} {language === 'ar' ? 'ريال' : 'SAR'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {language === 'ar' ? 'تفاصيل إضافية' : 'Additional Details'}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {language === 'ar' ? 'تاريخ الإنشاء:' : 'Created:'}
                    </span>
                    <span className="font-medium">
                      {new Date(challenge.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {language === 'ar' ? 'آخر تحديث:' : 'Updated:'}
                    </span>
                    <span className="font-medium">
                      {new Date(challenge.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Organizational Structure */}
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              {language === 'ar' ? 'الهيكل التنظيمي' : 'Organizational Structure'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {challenge.sectors && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    {language === 'ar' ? 'القطاع' : 'Sector'}
                  </label>
                  <p className="font-medium" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                    {language === 'ar' ? challenge.sectors.name_ar : (challenge.sectors.name_en || challenge.sectors.name_ar)}
                  </p>
                </div>
              )}
              {challenge.deputies && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    {language === 'ar' ? 'النائب' : 'Deputy'}
                  </label>
                  <p className="font-medium" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                    {language === 'ar' ? challenge.deputies.name_ar : (challenge.deputies.name_en || challenge.deputies.name_ar)}
                  </p>
                  {challenge.deputies.deputy_minister && (
                    <p className="text-sm text-muted-foreground">
                      {challenge.deputies.deputy_minister}
                    </p>
                  )}
                </div>
              )}
              {challenge.departments && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    {language === 'ar' ? 'الإدارة' : 'Department'}
                  </label>
                  <p className="font-medium" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                    {language === 'ar' ? challenge.departments.name_ar : (challenge.departments.name_en || challenge.departments.name_ar)}
                  </p>
                  {challenge.departments.department_head && (
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'رئيس الإدارة:' : 'Department Head:'} {challenge.departments.department_head}
                    </p>
                  )}
                </div>
              )}
              {challenge.domains && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    {language === 'ar' ? 'المجال' : 'Domain'}
                  </label>
                  <p className="font-medium" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                    {language === 'ar' ? challenge.domains.name_ar : (challenge.domains.name_en || challenge.domains.name_ar)}
                  </p>
                  {challenge.domains.domain_lead && (
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'قائد المجال:' : 'Domain Lead:'} {challenge.domains.domain_lead}
                    </p>
                  )}
                </div>
              )}
              {challenge.sub_domains && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    {language === 'ar' ? 'المجال الفرعي' : 'Sub Domain'}
                  </label>
                  <p className="font-medium" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                    {challenge.sub_domains.name_ar}
                  </p>
                  {challenge.sub_domains.technical_focus && (
                    <p className="text-sm text-muted-foreground">
                      {challenge.sub_domains.technical_focus}
                    </p>
                  )}
                </div>
              )}
              {challenge.services && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    {language === 'ar' ? 'الخدمة' : 'Service'}
                  </label>
                   <p className="font-medium" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                     {challenge.services.name_ar}
                   </p>
                  <p className="text-sm text-muted-foreground">
                    {challenge.services.service_type} {challenge.services.citizen_facing ? '(Citizen Facing)' : '(Internal)'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Challenge Tags */}
          {challenge.challenge_tags && challenge.challenge_tags.length > 0 && (
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                {language === 'ar' ? 'العلامات' : 'Tags'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {challenge.challenge_tags.map((tagLink: any) => (
                  <span
                    key={tagLink.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: `${tagLink.tags.color}20`,
                      color: tagLink.tags.color 
                    }}
                  >
                    {language === 'ar' ? tagLink.tags.name_ar : (tagLink.tags.name_en || tagLink.tags.name_ar)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Challenge Requirements */}
          {challenge.challenge_requirements && challenge.challenge_requirements.length > 0 && (
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                {language === 'ar' ? 'المتطلبات' : 'Requirements'}
              </h3>
              <div className="space-y-4">
                {challenge.challenge_requirements
                  .sort((a: any, b: any) => a.order_sequence - b.order_sequence)
                  .map((requirement: any) => (
                    <div key={requirement.id} className="border-l-4 border-primary pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{requirement.title}</h4>
                        {requirement.is_mandatory && (
                          <span className="bg-destructive/10 text-destructive px-2 py-1 rounded text-xs">
                            {language === 'ar' ? 'إجباري' : 'Mandatory'}
                          </span>
                        )}
                        {requirement.weight_percentage && (
                          <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                            {requirement.weight_percentage}%
                          </span>
                        )}
                      </div>
                      {requirement.description && (
                        <p className="text-muted-foreground text-sm">{requirement.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {language === 'ar' ? 'النوع:' : 'Type:'} {requirement.requirement_type}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Focus Questions */}
          {challenge.focus_questions && challenge.focus_questions.length > 0 && (
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                {language === 'ar' ? 'الأسئلة المحورية' : 'Focus Questions'}
              </h3>
              <div className="space-y-4">
                {challenge.focus_questions
                  .sort((a: any, b: any) => a.order_sequence - b.order_sequence)
                  .map((question: any) => (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                          {question.question_type}
                        </span>
                        {question.is_sensitive && (
                          <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">
                            {language === 'ar' ? 'حساس' : 'Sensitive'}
                          </span>
                        )}
                      </div>
                      <p className="font-medium" dir="rtl">
                        {question.question_text_ar}
                      </p>
                      {question.question_text_en && (
                        <p className="text-muted-foreground mt-2" dir="ltr">
                          {question.question_text_en}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Challenge Experts */}
          {challenge.challenge_experts && challenge.challenge_experts.length > 0 && (
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                {language === 'ar' ? 'الخبراء المعينون' : 'Assigned Experts'}
              </h3>
              <div className="space-y-4">
                {challenge.challenge_experts.map((expertLink: any) => (
                  <div key={expertLink.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      {(language === 'ar' ? expertLink.experts?.profiles?.name_ar : expertLink.experts?.profiles?.name_en) || expertLink.experts?.profiles?.name?.charAt(0) || 'E'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {(language === 'ar' ? expertLink.experts?.profiles?.name_ar : expertLink.experts?.profiles?.name_en) || expertLink.experts?.profiles?.name || (language === 'ar' ? 'خبير' : 'Expert')}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' ? 'الدور:' : 'Role:'} {expertLink.role_type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'ar' ? 'تاريخ التعيين:' : 'Assigned:'} {new Date(expertLink.assignment_date).toLocaleDateString()}
                      </p>
                      {expertLink.experts?.expertise_areas && (
                        <p className="text-xs text-muted-foreground">
                          {language === 'ar' ? 'المجالات:' : 'Areas:'} {expertLink.experts.expertise_areas.join(', ')}
                        </p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      expertLink.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {expertLink.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Challenge Partners */}
          {challenge.challenge_partners && challenge.challenge_partners.length > 0 && (
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                {language === 'ar' ? 'الشركاء' : 'Partners'}
              </h3>
              <div className="space-y-4">
                {challenge.challenge_partners.map((partnerLink: any) => (
                  <div key={partnerLink.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                        {language === 'ar' ? partnerLink.partners?.name_ar : (partnerLink.partners?.name_en || partnerLink.partners?.name_ar)}
                      </h4>
                      <span className={`px-2 py-1 rounded text-xs ${
                        partnerLink.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {partnerLink.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'نوع الشراكة:' : 'Partnership Type:'} {partnerLink.partnership_type}
                    </p>
                    {partnerLink.funding_amount && (
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' ? 'التمويل:' : 'Funding:'} {partnerLink.funding_amount.toLocaleString()} {language === 'ar' ? 'ريال' : 'SAR'}
                      </p>
                    )}
                    {partnerLink.contribution_details && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {partnerLink.contribution_details}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Challenge Participants */}
          {challenge.challenge_participants && challenge.challenge_participants.length > 0 && (
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                {language === 'ar' ? 'المشاركون' : 'Participants'} 
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({challenge.challenge_participants.length})
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {challenge.challenge_participants.slice(0, 9).map((participant: any) => (
                  <div key={participant.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      {(language === 'ar' ? participant.profiles?.name_ar : participant.profiles?.name_en) || participant.profiles?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {(language === 'ar' ? participant.profiles?.name_ar : participant.profiles?.name_en) || participant.profiles?.name || (language === 'ar' ? 'مشارك' : 'Participant')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {participant.participation_type}
                      </p>
                    </div>
                  </div>
                ))}
                {challenge.challenge_participants.length > 9 && (
                  <div className="flex items-center justify-center p-3 border rounded-lg text-muted-foreground">
                    +{challenge.challenge_participants.length - 9} {language === 'ar' ? 'أكثر' : 'more'}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Challenge Submissions */}
          {challenge.challenge_submissions && challenge.challenge_submissions.length > 0 && (
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                {language === 'ar' ? 'الحلول المقدمة' : 'Submissions'}
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({challenge.challenge_submissions.length})
                </span>
              </h3>
              <div className="space-y-4">
                {challenge.challenge_submissions.slice(0, 5).map((submission: any) => (
                  <div key={submission.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                        {language === 'ar' ? submission.title_ar : (submission.title_en || submission.title_ar)}
                      </h4>
                      <div className="flex items-center gap-2">
                        {submission.score && (
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                            {submission.score}/100
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded text-xs ${
                          submission.status === 'submitted' 
                            ? 'bg-blue-100 text-blue-700' 
                            : submission.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {submission.status}
                        </span>
                      </div>
                    </div>
                    {submission.description_ar && (
                      <p className="text-sm text-muted-foreground mb-2" dir="rtl">
                        {submission.description_ar.substring(0, 150)}...
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        {language === 'ar' ? 'بواسطة:' : 'By:'} {(language === 'ar' ? submission.profiles?.name_ar : submission.profiles?.name_en) || submission.profiles?.name || (language === 'ar' ? 'مشارك' : 'Participant')}
                      </span>
                      {submission.submission_date && (
                        <span>
                          • {new Date(submission.submission_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {challenge.challenge_submissions.length > 5 && (
                  <div className="text-center p-3 border rounded-lg text-muted-foreground">
                    +{challenge.challenge_submissions.length - 5} {language === 'ar' ? 'حل إضافي' : 'more submissions'}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Edit Wizard */}
        {showEditWizard && (
          <ChallengeWizardV2
            isOpen={showEditWizard}
            onClose={handleWizardClose}
            onSuccess={handleWizardClose}
            challenge={challenge as any}
          />
        )}
      </div>
  );
}