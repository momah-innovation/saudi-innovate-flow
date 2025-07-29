import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Filter, Eye, Edit, MessageSquare } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';
import { PageContainer, Section, ContentArea, PageHeader } from '@/components/ui';
import { supabase } from '@/integrations/supabase/client';
import { useSystemLists } from '@/hooks/useSystemLists';
import { useToast } from '@/hooks/use-toast';

interface Idea {
  id: string;
  title_ar: string;
  description_ar: string;
  status: string;
  maturity_level?: string;
  overall_score?: number;
  innovator_id: string;
  challenge_id?: string;
  focus_question_id?: string;
  created_at: string;
  updated_at: string;
}

export default function IdeasPage() {
  const { t } = useTranslation();
  const { isRTL, language } = useDirection();
  const { toast } = useToast();
  const { generalStatusOptions } = useSystemLists();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setIdeas(data || []);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل الأفكار",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.description_ar.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || idea.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusLabel = (status: string) => {
    const labels = {
      draft: 'مسودة',
      submitted: 'مقدم',
      under_review: 'قيد المراجعة',
      approved: 'موافق عليه',
      rejected: 'مرفوض'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'submitted': return 'default';
      case 'under_review': return 'outline';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <AppShell>
      <PageContainer>
        <PageHeader 
          title={isRTL ? "الأفكار" : "Ideas"}
          description={isRTL ? "إدارة ومتابعة أفكارك المقدمة" : "Manage and track your submitted ideas"}
        />
        <ContentArea>
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className={cn("flex flex-col sm:flex-row gap-4", isRTL && "flex-row-reverse")}>
          <div className="relative flex-1">
            <Search className={cn("absolute top-3 h-4 w-4 text-muted-foreground", 
              isRTL ? "right-3" : "left-3")} />
            <Input
              placeholder={isRTL ? "البحث في الأفكار..." : "Search ideas..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(isRTL ? "pr-10" : "pl-10")}
            />
          </div>
          
          <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
            <Button variant="outline" size="sm" className={cn(isRTL && "flex-row-reverse")}>
              <Filter className="h-4 w-4" />
              {isRTL ? "تصفية" : "Filter"}
            </Button>
            
            <Button className={cn(isRTL && "flex-row-reverse")}>
              <Plus className="h-4 w-4" />
              {isRTL ? "فكرة جديدة" : "New Idea"}
            </Button>
          </div>
        </div>

        {/* Ideas Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-card rounded-lg h-64" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredIdeas.map((idea) => (
              <Card key={idea.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className={cn("flex items-start justify-between", isRTL && "flex-row-reverse")}>
                    <div className={cn("flex-1", isRTL && "text-right")}>
                      <CardTitle className="text-lg">{idea.title_ar}</CardTitle>
                      <CardDescription className="mt-1">
                        {idea.maturity_level || 'مفهوم'}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={getStatusVariant(idea.status)}
                      className={isRTL ? "mr-2" : "ml-2"}
                    >
                      {getStatusLabel(idea.status)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className={cn("text-sm text-muted-foreground mb-4", isRTL && "text-right")}>
                    {idea.description_ar}
                  </p>
                  
                  <div className={cn("flex items-center justify-between text-sm text-muted-foreground mb-4",
                    isRTL && "flex-row-reverse")}>
                    <span>{isRTL ? "تاريخ التقديم:" : "Submitted:"} {new Date(idea.created_at).toLocaleDateString('ar-SA')}</span>
                    <span>{isRTL ? "النتيجة:" : "Score:"} {idea.overall_score || 0}/10</span>
                  </div>
                  
                  <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
                    <Button variant="outline" size="sm" className={cn("flex-1", isRTL && "flex-row-reverse")}>
                      <Eye className="h-4 w-4" />
                      {isRTL ? "عرض" : "View"}
                    </Button>
                    <Button variant="outline" size="sm" className={cn("flex-1", isRTL && "flex-row-reverse")}>
                      <Edit className="h-4 w-4" />
                      {isRTL ? "تعديل" : "Edit"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredIdeas.length === 0 && (
          <div className={cn("text-center py-12", isRTL && "text-right")}>
            <div className="text-muted-foreground">
              {searchTerm ? 
                (isRTL ? "لم يتم العثور على أفكار مطابقة" : "No ideas found matching your search") :
                (isRTL ? "لم تقم بتقديم أي أفكار بعد" : "You haven't submitted any ideas yet")
              }
            </div>
            <Button className="mt-4">
              {isRTL ? "تقديم فكرة جديدة" : "Submit Your First Idea"}
            </Button>
          </div>
        )}
      </div>
      </ContentArea>
      </PageContainer>
    </AppShell>
  );
}