import { useState } from 'react';
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

// Mock data for ideas
const mockIdeas = [
  {
    id: '1',
    title: 'Smart City Traffic Management',
    description: 'AI-powered traffic optimization system for reducing congestion',
    status: 'submitted',
    category: 'Smart Cities',
    submittedAt: '2024-01-15',
    evaluations: 3,
    score: 8.5
  },
  {
    id: '2', 
    title: 'Renewable Energy Storage',
    description: 'Innovative battery technology for solar energy storage',
    status: 'under_review',
    category: 'Energy',
    submittedAt: '2024-01-20',
    evaluations: 1,
    score: 7.2
  },
  {
    id: '3',
    title: 'Digital Health Platform',
    description: 'Telemedicine platform for remote patient monitoring',
    status: 'approved',
    category: 'Healthcare',
    submittedAt: '2024-01-25',
    evaluations: 5,
    score: 9.1
  }
];

const statusColors = {
  submitted: 'bg-blue-100 text-blue-800',
  under_review: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
};

const statusLabels = {
  submitted: { en: 'Submitted', ar: 'مقدم' },
  under_review: { en: 'Under Review', ar: 'قيد المراجعة' },
  approved: { en: 'Approved', ar: 'موافق عليه' },
  rejected: { en: 'Rejected', ar: 'مرفوض' }
};

export default function IdeasPage() {
  const { t } = useTranslation();
  const { isRTL, language } = useDirection();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const filteredIdeas = mockIdeas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || idea.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusLabel = (status: keyof typeof statusLabels) => {
    return statusLabels[status][language as 'en' | 'ar'] || statusLabels[status].en;
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredIdeas.map((idea) => (
            <Card key={idea.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className={cn("flex items-start justify-between", isRTL && "flex-row-reverse")}>
                  <div className={cn("flex-1", isRTL && "text-right")}>
                    <CardTitle className="text-lg">{idea.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {idea.category}
                    </CardDescription>
                  </div>
                  <Badge 
                    className={cn(
                      statusColors[idea.status as keyof typeof statusColors],
                      isRTL && "mr-2"
                    )}
                  >
                    {getStatusLabel(idea.status as keyof typeof statusLabels)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className={cn("text-sm text-muted-foreground mb-4", isRTL && "text-right")}>
                  {idea.description}
                </p>
                
                <div className={cn("flex items-center justify-between text-sm text-muted-foreground mb-4",
                  isRTL && "flex-row-reverse")}>
                  <span>{isRTL ? "تاريخ التقديم:" : "Submitted:"} {idea.submittedAt}</span>
                  <span>{isRTL ? "النتيجة:" : "Score:"} {idea.score}/10</span>
                </div>
                
                <div className={cn("flex items-center justify-between text-sm mb-4",
                  isRTL && "flex-row-reverse")}>
                  <div className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
                    <MessageSquare className="h-4 w-4" />
                    <span>{idea.evaluations} {isRTL ? "تقييم" : "evaluations"}</span>
                  </div>
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