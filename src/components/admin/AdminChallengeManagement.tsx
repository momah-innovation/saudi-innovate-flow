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
import { StandardPageLayout } from "@/components/layout/StandardPageLayout";
import { ViewLayouts } from "@/components/ui/view-layouts";
import { ManagementCard } from "@/components/ui/management-card";

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

  const handleLayoutChange = (layout: 'cards' | 'list' | 'grid') => {
    setViewMode(layout);
  };

  const filterConfigs = [
    {
      id: 'status',
      label: 'الحالة',
      type: 'select' as const,
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { label: 'جميع الحالات', value: 'all' },
        { label: 'مسودة', value: 'draft' },
        { label: 'منشور', value: 'published' },
        { label: 'نشط', value: 'active' },
        { label: 'مغلق', value: 'closed' },
        { label: 'مؤرشف', value: 'archived' }
      ]
    }
  ];

  return (
    <>
      <StandardPageLayout 
        title="إدارة التحديات"
        description="إنشاء وإدارة التحديات والأسئلة المحورية"
        itemCount={filteredChallenges.length}
        addButton={{
          label: "إنشاء تحدي جديد",
          onClick: () => { setSelectedChallenge(null); setIsWizardOpen(true); },
          icon: <Plus className="w-4 h-4" />
        }}
        headerActions={secondaryActions}
        supportedLayouts={['cards', 'list', 'grid']}
        defaultLayout={viewMode}
        onLayoutChange={handleLayoutChange}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filterConfigs}
      >
        <ViewLayouts viewMode={viewMode}>
          {filteredChallenges.map((challenge) => (
             <ManagementCard
               key={challenge.id}
               id={challenge.id}
               title={challenge.title_ar}
               description={challenge.description_ar}
              badges={[
                { 
                  label: challenge.status === 'draft' ? 'مسودة' :
                         challenge.status === 'published' ? 'منشور' :
                         challenge.status === 'active' ? 'نشط' :
                         challenge.status === 'closed' ? 'مغلق' : 
                         challenge.status === 'archived' ? 'مؤرشف' : challenge.status,
                  variant: challenge.status === 'published' ? 'default' : 'secondary'
                },
                { 
                  label: challenge.priority_level === 'low' ? 'منخفض' :
                         challenge.priority_level === 'medium' ? 'متوسط' :
                         challenge.priority_level === 'high' ? 'عالي' :
                         challenge.priority_level === 'urgent' ? 'عاجل' : challenge.priority_level,
                  variant: 'outline' as const
                },
                { 
                  label: challenge.sensitivity_level === 'normal' ? 'عادي' :
                         challenge.sensitivity_level === 'sensitive' ? 'حساس' :
                         challenge.sensitivity_level === 'confidential' ? 'سري' : challenge.sensitivity_level,
                  variant: 'outline' as const
                }
              ]}
              metadata={[
                ...(challenge.start_date ? [{ 
                  icon: <Calendar className="h-4 w-4" />, 
                  label: "تاريخ البداية", 
                  value: challenge.start_date 
                }] : []),
                ...(challenge.end_date ? [{ 
                  icon: <Calendar className="h-4 w-4" />, 
                  label: "تاريخ النهاية", 
                  value: challenge.end_date 
                }] : []),
                ...(challenge.estimated_budget > 0 ? [{ 
                  icon: <Target className="h-4 w-4" />, 
                  label: "الميزانية المقدرة", 
                  value: `${challenge.estimated_budget.toLocaleString()} ريال` 
                }] : [])
              ]}
              actions={[
                {
                  type: 'edit',
                  label: 'تعديل',
                  onClick: () => handleEditChallenge(challenge)
                },
                {
                  type: 'settings',
                  label: 'الإعدادات',
                  onClick: () => handleOpenSettings(challenge)
                },
                {
                  type: 'delete',
                  label: 'حذف',
                  onClick: () => handleDeleteChallenge(challenge.id)
                }
               ]}
               viewMode={viewMode}
               onClick={() => handleViewChallenge(challenge)}
            />
          ))}
        </ViewLayouts>

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
      </StandardPageLayout>

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