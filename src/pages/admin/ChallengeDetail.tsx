import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
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
  
  const [challenge, setChallenge] = useState<ChallengeRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditWizard, setShowEditWizard] = useState(false);

  useEffect(() => {
    if (challengeId) {
      fetchChallenge();
    }
  }, [challengeId]);

  const fetchChallenge = async () => {
    if (!challengeId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', challengeId)
        .single();

      if (error) {
        console.error('Error fetching challenge:', error);
        toast({
          title: language === 'ar' ? 'خطأ' : 'Error',
          description: language === 'ar' ? 'فشل في تحميل التحدي' : 'Failed to load challenge',
          variant: 'destructive',
        });
        return;
      }

      setChallenge(data);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
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
      <AppShell>
        <div className="container mx-auto px-4 py-8">
          <AdminBreadcrumb />
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        </div>
      </AppShell>
    );
  }

  if (!challenge) {
    return (
      <AppShell>
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
      </AppShell>
    );
  }

  const challengeTitle = language === 'ar' ? challenge.title_ar : (challenge.title_en || challenge.title_ar);

  return (
    <AppShell>
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
        <div className="space-y-6">
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
    </AppShell>
  );
}