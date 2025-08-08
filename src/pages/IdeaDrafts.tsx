import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useDirection } from '@/components/ui/direction-provider';
import { logger } from '@/utils/logger';
import { 
  FileText, Plus, Clock, Trash2, 
  Edit, Calendar, AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useTranslation } from 'react-i18next';

interface DraftIdea {
  id: string;
  title_ar: string;
  description_ar: string;
  status: string;
  created_at: string;
  updated_at: string;
  challenge_id?: string;
  focus_question_id?: string;
}

interface Challenge {
  id: string;
  title_ar: string;
}

export default function IdeaDrafts() {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const { isRTL } = useDirection();
  const [drafts, setDrafts] = useState<DraftIdea[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrafts();
    fetchChallenges();
  }, [userProfile]);

  const fetchDrafts = async () => {
    if (!userProfile) return;

    try {
      // Ensure innovator exists first
      const { data: innovatorId, error: innovatorError } = await supabase.rpc('ensure_innovator_exists', {
        user_uuid: userProfile.id
      });
      
      if (innovatorError) throw innovatorError;

      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('innovator_id', innovatorId)
        .eq('status', 'draft')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setDrafts(data || []);
    } catch (error) {
      logger.error('Error fetching drafts', { userId: userProfile?.id }, error as Error);
      toast.error(t('toast.drafts_load_error'));
    } finally {
      setLoading(false);
    }
  };

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('id, title_ar')
        .eq('status', 'active');

      if (error) throw error;
      setChallenges(data || []);
    } catch (error) {
      logger.error('Error fetching challenges', {}, error as Error);
    }
  };

  const deleteDraft = async (draftId: string) => {
    try {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', draftId);

      if (error) throw error;

      setDrafts(drafts.filter(draft => draft.id !== draftId));
      toast.success(t('toast.draft_deleted'));
    } catch (error) {
      logger.error('Error deleting draft', { entityId: draftId }, error as Error);
      toast.error(t('toast.draft_delete_error'));
    }
  };

  const editDraft = (draftId: string) => {
    navigate(`/submit-idea?draft=${draftId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <AppShell>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {isRTL ? 'مسودات الأفكار' : 'Idea Drafts'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isRTL ? 'أكمل أفكارك المحفوظة كمسودات' : 'Continue working on your saved idea drafts'}
            </p>
          </div>
          <Button 
            onClick={() => navigate('/submit-idea')}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isRTL ? 'فكرة جديدة' : 'New Idea'}
          </Button>
        </div>

        {drafts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {isRTL ? 'لا توجد مسودات' : 'No Drafts Found'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {isRTL ? 
                  'لم تقم بحفظ أي مسودات بعد. ابدأ بإنشاء فكرة جديدة!' :
                  'You haven\'t saved any drafts yet. Start by creating a new idea!'
                }
              </p>
              <Button 
                onClick={() => navigate('/submit-idea')}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isRTL ? 'إنشاء فكرة جديدة' : 'Create New Idea'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {drafts.map((draft) => {
              const challenge = challenges.find(c => c.id === draft.challenge_id);
              
              return (
                <Card key={draft.id} className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                          {draft.title_ar || (isRTL ? 'فكرة بدون عنوان' : 'Untitled Idea')}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            <FileText className="w-3 h-3 mr-1" />
                            {isRTL ? 'مسودة' : 'Draft'}
                          </Badge>
                          {challenge && (
                            <Badge variant="outline" className="text-xs">
                              {challenge.title_ar}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {draft.description_ar || (isRTL ? 'لا يوجد وصف' : 'No description')}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{isRTL ? 'آخر تحديث:' : 'Last updated:'} {formatDate(draft.updated_at)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => editDraft(draft.id)}
                        className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        {isRTL ? 'متابعة التحرير' : 'Continue Editing'}
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {isRTL ? 'حذف المسودة' : 'Delete Draft'}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {isRTL ? 
                                'هل أنت متأكد من حذف هذه المسودة؟ لا يمكن التراجع عن هذا الإجراء.' :
                                'Are you sure you want to delete this draft? This action cannot be undone.'
                              }
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              {isRTL ? 'إلغاء' : 'Cancel'}
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteDraft(draft.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              {isRTL ? 'حذف' : 'Delete'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}