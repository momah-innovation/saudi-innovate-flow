import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { DetailView } from '@/components/ui/detail-view';
import { DetailModal } from '@/components/ui/detail-modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useChallengesData } from '@/hooks/useChallengesData';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { ActionMenu, getExtendedActions } from '@/components/ui/action-menu';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  Target, 
  Clock,
  Award,
  Share2,
  Heart,
  MessageSquare,
  Edit,
  Trash2,
  Settings,
  UserPlus,
  Flag
} from 'lucide-react';

export default function ChallengeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, isRTL } = useUnifiedTranslation();
  const { toast } = useToast();
  const { user, hasRole } = useAuth();
  const { challenges, loading } = useChallengesData();
  
  const [challenge, setChallenge] = useState<any>(null);
  const [isParticipating, setIsParticipating] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const isAdmin = hasRole('admin') || hasRole('super_admin');
  const isManager = hasRole('evaluator') || isAdmin;

  useEffect(() => {
    if (id && challenges.length > 0) {
      const foundChallenge = challenges.find(c => c.id === id);
      if (foundChallenge) {
        setChallenge(foundChallenge);
        checkParticipationStatus();
        checkLikeStatus();
      }
    }
  }, [id, challenges]);

  const checkParticipationStatus = async () => {
    if (!user || !id) return;
    
    try {
      const { data } = await supabase
        .from('challenge_participants')
        .select('id')
        .eq('challenge_id', id)
        .eq('user_id', user.id)
        .single();
      
      setIsParticipating(!!data);
    } catch (error) {
      // User not participating
    }
  };

  const checkLikeStatus = async () => {
    if (!user || !id) return;
    
    try {
      const { data } = await supabase
        .from('challenge_likes')
        .select('id')
        .eq('challenge_id', id)
        .eq('user_id', user.id)
        .single();
      
      setIsLiked(!!data);
    } catch (error) {
      // User hasn't liked
    }
  };

  const handleParticipate = async () => {
    if (!user) {
      toast({
        title: t('pleaseSignIn', 'يرجى تسجيل الدخول'),
        description: t('signInToParticipate', 'يجب تسجيل الدخول للمشاركة'),
        variant: 'destructive',
      });
      return;
    }

    try {
      if (isParticipating) {
        await supabase
          .from('challenge_participants')
          .delete()
          .eq('challenge_id', id)
          .eq('user_id', user.id);
        
        setIsParticipating(false);
        toast({
          title: t('participationCancelled', 'تم إلغاء المشاركة'),
          description: t('participationCancelledDesc', 'تم إلغاء مشاركتك في التحدي'),
        });
      } else {
        await supabase
          .from('challenge_participants')
          .insert({
            challenge_id: id,
            user_id: user.id,
            participation_type: 'individual'
          });
        
        setIsParticipating(true);
        toast({
          title: t('participationSuccess', 'تم التسجيل بنجاح'),
          description: t('participationSuccessDesc', 'تم تسجيلك في التحدي بنجاح'),
        });
      }
    } catch (error) {
      toast({
        title: t('error', 'خطأ'),
        description: t('participationError', 'حدث خطأ أثناء التسجيل'),
        variant: 'destructive',
      });
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast({
        title: t('pleaseSignIn', 'يرجى تسجيل الدخول'),
        description: t('signInToLike', 'يجب تسجيل الدخول للإعجاب'),
        variant: 'destructive',
      });
      return;
    }

    try {
      if (isLiked) {
        await supabase
          .from('challenge_likes')
          .delete()
          .eq('challenge_id', id)
          .eq('user_id', user.id);
        
        setIsLiked(false);
      } else {
        await supabase
          .from('challenge_likes')
          .insert({
            challenge_id: id,
            user_id: user.id
          });
        
        setIsLiked(true);
      }
    } catch (error) {
      toast({
        title: t('error', 'خطأ'),
        description: t('likeError', 'حدث خطأ أثناء الإعجاب'),
        variant: 'destructive',
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: challenge?.title_ar || '',
      text: challenge?.description_ar || '',
      // Use proper URL building for challenge sharing
      url: typeof window !== 'undefined' ? window.location.href : ''
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareData.url);
      toast({
        title: t('linkCopied', 'تم نسخ الرابط'),
        description: t('linkCopiedDesc', 'تم نسخ رابط التحدي إلى الحافظة'),
      });
    }
  };

  const handleEdit = () => {
    navigate(`/admin/challenges/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm(t('confirmDelete', 'هل أنت متأكد من حذف هذا التحدي؟'))) return;
    
    try {
      await supabase
        .from('challenges')
        .delete()
        .eq('id', id);
      
      toast({
        title: t('deleteSuccess', 'تم الحذف بنجاح'),
        description: t('challengeDeleted', 'تم حذف التحدي بنجاح'),
      });
      navigate('/challenges');
    } catch (error) {
      toast({
        title: t('error', 'خطأ'),
        description: t('deleteError', 'حدث خطأ أثناء الحذف'),
        variant: 'destructive',
      });
    }
  };

  const handleManageParticipants = () => {
    navigate(`/admin/challenges/${id}/participants`);
  };

  const handleViewAnalytics = () => {
    navigate(`/admin/challenges/${id}/analytics`);
  };

  const getActionMenuItems = () => {
    const actions = [];

    // User actions
    if (user) {
      actions.push({
        id: 'participate',
        label: isParticipating ? t('cancelParticipation', 'إلغاء المشاركة') : t('participate', 'شارك'),
        icon: isParticipating ? UserPlus : Target,
        onClick: handleParticipate,
        variant: isParticipating ? 'destructive' : 'default'
      });

      actions.push({
        id: 'like',
        label: isLiked ? t('unlike', 'إلغاء الإعجاب') : t('like', 'أعجبني'),
        icon: Heart,
        onClick: handleLike
      });
    }

    actions.push({
      id: 'share',
      label: t('share', 'مشاركة'),
      icon: Share2,
      onClick: handleShare
    });

    // Manager actions
    if (isManager) {
      actions.push({ id: 'separator-1', separator: true });
      
      actions.push({
        id: 'manage-participants',
        label: t('manageParticipants', 'إدارة المشاركين'),
        icon: Users,
        onClick: handleManageParticipants
      });

      actions.push({
        id: 'view-analytics',
        label: t('viewAnalytics', 'عرض التحليلات'),
        icon: Settings,
        onClick: handleViewAnalytics
      });
    }

    // Admin actions
    if (isAdmin) {
      actions.push({ id: 'separator-2', separator: true });
      
      actions.push({
        id: 'edit',
        label: t('edit', 'تعديل'),
        icon: Edit,
        onClick: handleEdit
      });

      actions.push({
        id: 'delete',
        label: t('delete', 'حذف'),
        icon: Trash2,
        onClick: handleDelete,
        variant: 'destructive'
      });
    }

    return actions;
  };

  if (loading || !challenge) {
    return (
      <AppShell>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-2/3" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </AppShell>
    );
  }

  const detailSections = [
    {
      title: t('basicInfo', 'المعلومات الأساسية'),
      items: [
        {
          label: t('status', 'الحالة'),
          value: <Badge variant={challenge.status === 'active' ? 'default' : 'secondary'}>
            {challenge.status}
          </Badge>
        },
        {
          label: t('category', 'الفئة'),
          value: challenge.category
        },
        {
          label: t('difficulty', 'المستوى'),
          value: challenge.difficulty
        },
        {
          label: t('prize', 'الجائزة'),
          value: challenge.prize
        }
      ]
    },
    {
      title: t('timeline', 'الجدول الزمني'),
      items: [
        {
          label: t('startDate', 'تاريخ البداية'),
          value: challenge.start_date ? new Date(challenge.start_date).toLocaleDateString('ar-SA') : t('notSet', 'غير محدد')
        },
        {
          label: t('endDate', 'تاريخ النهاية'),
          value: challenge.end_date ? new Date(challenge.end_date).toLocaleDateString('ar-SA') : t('notSet', 'غير محدد')
        },
        {
          label: t('deadline', 'الموعد النهائي'),
          value: challenge.deadline
        }
      ]
    },
    {
      title: t('participation', 'المشاركة'),
      items: [
        {
          label: t('participants', 'المشاركون'),
          value: `${challenge.participants} ${t('participant', 'مشارك')}`
        },
        {
          label: t('submissions', 'المقترحات'),
          value: `${challenge.submissions} ${t('submission', 'مقترح')}`
        }
      ]
    }
  ];

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/challenges')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToChallenges', 'العودة للتحديات')}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-bold">
                      {challenge.title_ar}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={challenge.status === 'active' ? 'default' : 'secondary'}>
                        {challenge.status}
                      </Badge>
                      <Badge variant="outline">
                        {challenge.category}
                      </Badge>
                      {challenge.trending && (
                        <Badge variant="secondary">
                          <Flag className="w-3 h-3 mr-1" />
                          {t('trending', 'رائج')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <ActionMenu actions={getActionMenuItems()} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {challenge.description_ar}
                </p>
              </CardContent>
            </Card>

            {/* Detail View */}
            <DetailView
              title={t('challengeDetails', 'تفاصيل التحدي')}
              subtitle={t('challengeDetailsDesc', 'معلومات شاملة عن التحدي')}
              sections={detailSections}
              badges={[
                { label: challenge.difficulty, variant: 'outline' },
                { label: challenge.priority_level, variant: 'secondary' }
              ]}
              actions={
                <div className="flex gap-2">
                  <Button
                    onClick={handleParticipate}
                    variant={isParticipating ? 'outline' : 'default'}
                    disabled={!user}
                  >
                    <Target className="w-4 h-4 mr-2" />
                    {isParticipating ? t('cancelParticipation', 'إلغاء المشاركة') : t('participate', 'شارك')}
                  </Button>
                  <Button
                    onClick={() => setShowDetailsModal(true)}
                    variant="outline"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {t('viewDetails', 'عرض التفاصيل')}
                  </Button>
                </div>
              }
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {t('quickStats', 'إحصائيات سريعة')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('participants', 'المشاركون')}</p>
                    <p className="font-semibold">{challenge.participants}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('submissions', 'المقترحات')}</p>
                    <p className="font-semibold">{challenge.submissions}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('prize', 'الجائزة')}</p>
                    <p className="font-semibold">{challenge.prize}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('timeLeft', 'الوقت المتبقي')}</p>
                    <p className="font-semibold">{challenge.deadline}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {t('quickActions', 'إجراءات سريعة')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleLike}
                  variant={isLiked ? 'default' : 'outline'} 
                  className="w-full justify-start"
                  disabled={!user}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? t('liked', 'معجب به') : t('like', 'أعجبني')}
                </Button>
                <Button 
                  onClick={handleShare}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  {t('share', 'مشاركة')}
                </Button>
                {isManager && (
                  <>
                    <Button 
                      onClick={handleManageParticipants}
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      {t('manageParticipants', 'إدارة المشاركين')}
                    </Button>
                    <Button 
                      onClick={handleViewAnalytics}
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      {t('viewAnalytics', 'عرض التحليلات')}
                    </Button>
                  </>
                )}
                {isAdmin && (
                  <Button 
                    onClick={handleEdit}
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {t('edit', 'تعديل')}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Details Modal */}
        <DetailModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title={t('fullChallengeDetails', 'تفاصيل التحدي الكاملة')}
          subtitle={challenge.title_ar}
          maxWidth="4xl"
        >
          <DetailView
            title=""
            sections={detailSections}
            className="border-0 shadow-none p-0"
          />
        </DetailModal>
      </div>
    </AppShell>
  );
}