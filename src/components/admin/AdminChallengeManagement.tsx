import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Edit, Trash2, Eye, Users, Target, Calendar, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ChallengeWizard } from './ChallengeWizard';
import { ChallengeSettings } from './ChallengeSettings';
import { PageLayout } from '@/components/layout/PageLayout';

interface Challenge {
  id: string;
  title_ar: string;
  description_ar: string;
  status: string;
  priority_level: string;
  sensitivity_level: string;
  challenge_type: string;
  start_date: string;
  end_date: string;
  estimated_budget: number;
  actual_budget: number;
  vision_2030_goal: string;
  kpi_alignment: string;
  collaboration_details: string;
  internal_team_notes: string;
  challenge_owner_id: string;
  assigned_expert_id: string;
  created_by: string;
  partner_organization_id: string;
  department_id: string;
  deputy_id: string;
  sector_id: string;
  domain_id: string;
  sub_domain_id: string;
  service_id: string;
}

interface FocusQuestion {
  id?: string;
  question_text_ar: string;
  question_type: string;
  is_sensitive: boolean;
  order_sequence: number;
}

export function AdminChallengeManagement() {
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [focusQuestions, setFocusQuestions] = useState<FocusQuestion[]>([]);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChallenges();
    fetchFocusQuestions();
  }, []);

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChallenges(data || []);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل التحديات",
        variant: "destructive",
      });
    }
  };

  const fetchFocusQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('focus_questions')
        .select('*')
        .order('order_sequence');

      if (error) throw error;
      setFocusQuestions(data || []);
    } catch (error) {
      console.error('Error fetching focus questions:', error);
    }
  };

  const handleDeleteChallenge = async (challengeId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التحدي؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      return;
    }

    setLoading(true);
    try {
      // حذف العلاقات المرتبطة أولاً
      await Promise.all([
        supabase.from('challenge_experts').delete().eq('challenge_id', challengeId),
        supabase.from('challenge_partners').delete().eq('challenge_id', challengeId),
        supabase.from('challenge_requirements').delete().eq('challenge_id', challengeId),
        supabase.from('focus_questions').delete().eq('challenge_id', challengeId)
      ]);

      // حذف التحدي
      const { error } = await supabase
        .from('challenges')
        .delete()
        .eq('id', challengeId);

      if (error) throw error;

      toast({
        title: "تم الحذف",
        description: "تم حذف التحدي بنجاح",
      });

      fetchChallenges();
    } catch (error) {
      console.error('خطأ في حذف التحدي:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف التحدي",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description_ar?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || challenge.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEditChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setIsWizardOpen(true);
  };

  const handleOpenSettings = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setIsSettingsOpen(true);
  };

  const handleViewChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setIsViewDialogOpen(true);
  };

  const secondaryActions = (
    <>
      <Select>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="تصدير" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pdf">PDF</SelectItem>
          <SelectItem value="excel">Excel</SelectItem>
          <SelectItem value="csv">CSV</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" className="gap-2">
        <Users className="w-4 h-4" />
        الإجراءات المجمعة
      </Button>
    </>
  );

  const filters = (
    <>
      <div className="min-w-[120px]">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="تصفية حسب الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="draft">مسودة</SelectItem>
            <SelectItem value="published">منشور</SelectItem>
            <SelectItem value="active">نشط</SelectItem>
            <SelectItem value="closed">مغلق</SelectItem>
            <SelectItem value="archived">مؤرشف</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[120px]">
        <Select>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="تصفية حسب النوع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
            <SelectItem value="technical">تقني</SelectItem>
            <SelectItem value="administrative">إداري</SelectItem>
            <SelectItem value="creative">إبداعي</SelectItem>
            <SelectItem value="strategic">استراتيجي</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <>
      <PageLayout 
        title="إدارة التحديات"
        description="إنشاء وإدارة التحديات والأسئلة المحورية"
        itemCount={filteredChallenges.length}
        primaryAction={{
          label: "إنشاء تحدي جديد",
          onClick: () => setIsWizardOpen(true),
          icon: <Plus className="w-4 h-4" />
        }}
        secondaryActions={secondaryActions}
        showLayoutSelector={true}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showSearch={true}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="البحث في التحديات..."
        filters={filters}
        spacing="md"
        maxWidth="full"
      >
        <div className="grid gap-4">
          {viewMode === 'cards' && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredChallenges.map((challenge) => (
                <Card key={challenge.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <CardTitle className="text-lg">{challenge.title_ar}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {challenge.description_ar}
                        </CardDescription>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={challenge.status === 'published' ? 'default' : 'secondary'}>
                            {challenge.status === 'draft' ? 'مسودة' :
                             challenge.status === 'published' ? 'منشور' :
                             challenge.status === 'active' ? 'نشط' :
                             challenge.status === 'closed' ? 'مغلق' : 
                             challenge.status === 'archived' ? 'مؤرشف' : challenge.status}
                          </Badge>
                          <Badge variant="outline">
                            {challenge.priority_level === 'low' ? 'منخفض' :
                             challenge.priority_level === 'medium' ? 'متوسط' :
                             challenge.priority_level === 'high' ? 'عالي' :
                             challenge.priority_level === 'urgent' ? 'عاجل' : challenge.priority_level}
                          </Badge>
                          <Badge variant="outline">
                            {challenge.sensitivity_level === 'normal' ? 'عادي' :
                             challenge.sensitivity_level === 'sensitive' ? 'حساس' :
                             challenge.sensitivity_level === 'confidential' ? 'سري' : challenge.sensitivity_level}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewChallenge(challenge)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        عرض
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditChallenge(challenge)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        تعديل
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenSettings(challenge)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteChallenge(challenge.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {viewMode === 'list' && (
            <div className="space-y-4">
              {filteredChallenges.map((challenge) => (
                <Card key={challenge.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <CardTitle>{challenge.title_ar}</CardTitle>
                        <CardDescription>
                          {challenge.description_ar}
                        </CardDescription>
                        <div className="flex items-center gap-2">
                          <Badge variant={challenge.status === 'published' ? 'default' : 'secondary'}>
                            {challenge.status === 'draft' ? 'مسودة' :
                             challenge.status === 'published' ? 'منشور' :
                             challenge.status === 'active' ? 'نشط' :
                             challenge.status === 'closed' ? 'مغلق' : 
                             challenge.status === 'archived' ? 'مؤرشف' : challenge.status}
                          </Badge>
                          <Badge variant="outline">
                            {challenge.priority_level === 'low' ? 'منخفض' :
                             challenge.priority_level === 'medium' ? 'متوسط' :
                             challenge.priority_level === 'high' ? 'عالي' :
                             challenge.priority_level === 'urgent' ? 'عاجل' : challenge.priority_level}
                          </Badge>
                          <Badge variant="outline">
                            {challenge.sensitivity_level === 'normal' ? 'عادي' :
                             challenge.sensitivity_level === 'sensitive' ? 'حساس' :
                             challenge.sensitivity_level === 'confidential' ? 'سري' : challenge.sensitivity_level}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewChallenge(challenge)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditChallenge(challenge)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenSettings(challenge)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteChallenge(challenge.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}

          {viewMode === 'grid' && (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredChallenges.map((challenge) => (
                <Card key={challenge.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <CardTitle className="text-lg">{challenge.title_ar}</CardTitle>
                        <CardDescription className="line-clamp-3">
                          {challenge.description_ar}
                        </CardDescription>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={challenge.status === 'published' ? 'default' : 'secondary'}>
                            {challenge.status === 'draft' ? 'مسودة' :
                             challenge.status === 'published' ? 'منشور' :
                             challenge.status === 'active' ? 'نشط' :
                             challenge.status === 'closed' ? 'مغلق' : 
                             challenge.status === 'archived' ? 'مؤرشف' : challenge.status}
                          </Badge>
                          <Badge variant="outline">
                            {challenge.priority_level === 'low' ? 'منخفض' :
                             challenge.priority_level === 'medium' ? 'متوسط' :
                             challenge.priority_level === 'high' ? 'عالي' :
                             challenge.priority_level === 'urgent' ? 'عاجل' : challenge.priority_level}
                          </Badge>
                          <Badge variant="outline">
                            {challenge.sensitivity_level === 'normal' ? 'عادي' :
                             challenge.sensitivity_level === 'sensitive' ? 'حساس' :
                             challenge.sensitivity_level === 'confidential' ? 'سري' : challenge.sensitivity_level}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(challenge.start_date || challenge.end_date || challenge.estimated_budget > 0) && (
                        <div className="space-y-2 text-sm text-muted-foreground">
                          {challenge.start_date && (
                            <div>تاريخ البداية: {challenge.start_date}</div>
                          )}
                          {challenge.end_date && (
                            <div>تاريخ النهاية: {challenge.end_date}</div>
                          )}
                          {challenge.estimated_budget > 0 && (
                            <div>الميزانية المقدرة: {challenge.estimated_budget.toLocaleString()} ريال</div>
                          )}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewChallenge(challenge)}
                          className="flex-1"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          عرض
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditChallenge(challenge)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          تعديل
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenSettings(challenge)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteChallenge(challenge.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredChallenges.length === 0 && (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' ? 'لا توجد تحديات تطابق البحث' : 'لا توجد تحديات'}
              </div>
              <Button onClick={() => setIsWizardOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                إنشاء تحدي جديد
              </Button>
            </div>
          )}
        </div>
      </PageLayout>

      <ChallengeWizard
        isOpen={isWizardOpen}
        onClose={() => {
          setIsWizardOpen(false);
          setSelectedChallenge(null);
        }}
        onSuccess={fetchChallenges}
        challenge={selectedChallenge}
      />

      {selectedChallenge && (
        <ChallengeSettings
          challenge={selectedChallenge}
          isOpen={isSettingsOpen}
          onClose={() => {
            setIsSettingsOpen(false);
            setSelectedChallenge(null);
          }}
          onUpdate={fetchChallenges}
        />
      )}

      {/* View Challenge Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل التحدي</DialogTitle>
          </DialogHeader>
          
          {selectedChallenge && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">{selectedChallenge.title_ar}</h3>
                <p className="text-muted-foreground">{selectedChallenge.description_ar}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">الحالة</Label>
                  <Badge variant="outline" className="mt-1">
                    {selectedChallenge.status === 'draft' ? 'مسودة' :
                     selectedChallenge.status === 'published' ? 'منشور' :
                     selectedChallenge.status === 'active' ? 'نشط' :
                     selectedChallenge.status === 'closed' ? 'مغلق' : 
                     selectedChallenge.status === 'archived' ? 'مؤرشف' : selectedChallenge.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">مستوى الأولوية</Label>
                  <Badge variant="outline" className="mt-1">
                    {selectedChallenge.priority_level === 'low' ? 'منخفض' :
                     selectedChallenge.priority_level === 'medium' ? 'متوسط' :
                     selectedChallenge.priority_level === 'high' ? 'عالي' :
                     selectedChallenge.priority_level === 'urgent' ? 'عاجل' : selectedChallenge.priority_level}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">مستوى السرية</Label>
                  <Badge variant="outline" className="mt-1">
                    {selectedChallenge.sensitivity_level === 'normal' ? 'عادي' :
                     selectedChallenge.sensitivity_level === 'sensitive' ? 'حساس' :
                     selectedChallenge.sensitivity_level === 'confidential' ? 'سري' : selectedChallenge.sensitivity_level}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">نوع التحدي</Label>
                  <p className="text-sm">{selectedChallenge.challenge_type || 'غير محدد'}</p>
                </div>
              </div>

              {(selectedChallenge.start_date || selectedChallenge.end_date) && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedChallenge.start_date && (
                    <div>
                      <Label className="text-sm font-medium">تاريخ البداية</Label>
                      <p className="text-sm">{selectedChallenge.start_date}</p>
                    </div>
                  )}
                  {selectedChallenge.end_date && (
                    <div>
                      <Label className="text-sm font-medium">تاريخ النهاية</Label>
                      <p className="text-sm">{selectedChallenge.end_date}</p>
                    </div>
                  )}
                </div>
              )}

              {(selectedChallenge.estimated_budget > 0 || selectedChallenge.actual_budget > 0) && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedChallenge.estimated_budget > 0 && (
                    <div>
                      <Label className="text-sm font-medium">الميزانية المقدرة</Label>
                      <p className="text-sm">{selectedChallenge.estimated_budget.toLocaleString()} ريال</p>
                    </div>
                  )}
                  {selectedChallenge.actual_budget > 0 && (
                    <div>
                      <Label className="text-sm font-medium">الميزانية الفعلية</Label>
                      <p className="text-sm">{selectedChallenge.actual_budget.toLocaleString()} ريال</p>
                    </div>
                  )}
                </div>
              )}

              {selectedChallenge.vision_2030_goal && (
                <div>
                  <Label className="text-sm font-medium">هدف رؤية 2030</Label>
                  <p className="text-sm mt-1">{selectedChallenge.vision_2030_goal}</p>
                </div>
              )}

              {selectedChallenge.kpi_alignment && (
                <div>
                  <Label className="text-sm font-medium">مؤشرات الأداء المرتبطة</Label>
                  <p className="text-sm mt-1">{selectedChallenge.kpi_alignment}</p>
                </div>
              )}

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  إغلاق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}