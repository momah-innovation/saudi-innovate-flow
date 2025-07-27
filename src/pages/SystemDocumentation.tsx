import { AppShell } from "@/components/layout/AppShell";
import { PageLayout } from "@/components/layout/PageLayout";
import { useDirection } from "@/components/ui/direction-provider";
import { useState } from "react";
import { FileText, Users, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Target, 
  Lightbulb, 
  UserCheck, 
  Calendar,
  Building2,
  Network,
  ArrowRight,
  GitBranch,
  Workflow,
  Database
} from "lucide-react";

export default function SystemDocumentationPage() {
  const { isRTL, language } = useDirection();
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [searchValue, setSearchValue] = useState('');
  
  const title = isRTL && language === 'ar' ? 'توثيق النظام' : 'System Documentation';
  const description = isRTL && language === 'ar' 
    ? 'دليل شامل لعلاقات الكيانات وهندسة النظام' 
    : 'Comprehensive guide to entity relationships and system architecture';

  const searchPlaceholder = isRTL && language === 'ar' ? 'بحث في التوثيق...' : 'Search documentation...';

  const secondaryActions = (
    <>
      <Select>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Export" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pdf">PDF</SelectItem>
          <SelectItem value="html">HTML</SelectItem>
        </SelectContent>
      </Select>
    </>
  );

  const filters = (
    <>
      <div className="min-w-[120px]">
        <Select>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder={isRTL && language === 'ar' ? 'تصفية حسب القسم' : 'Filter by Section'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isRTL && language === 'ar' ? 'جميع الأقسام' : 'All Sections'}</SelectItem>
            <SelectItem value="overview">{isRTL && language === 'ar' ? 'نظرة عامة' : 'Overview'}</SelectItem>
            <SelectItem value="entities">{isRTL && language === 'ar' ? 'الكيانات' : 'Entities'}</SelectItem>
            <SelectItem value="relationships">{isRTL && language === 'ar' ? 'العلاقات' : 'Relationships'}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <AppShell>
      <PageLayout 
        title={title}
        description={description}
        secondaryActions={secondaryActions}
        showLayoutSelector={true}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showSearch={true}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder={searchPlaceholder}
        filters={filters}
        spacing="md"
        maxWidth="full"
      >
        <div className="space-y-8">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Overview
              </CardTitle>
              <CardDescription>
                The Innovation Management System is built around interconnected entities that work together to facilitate the complete innovation lifecycle.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Building2 className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">Organizational Foundation</h3>
                  <p className="text-sm text-muted-foreground">Sectors, Structure, and Ownership</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Workflow className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">Innovation Process</h3>
                  <p className="text-sm text-muted-foreground">Challenges, Ideas, and Evaluations</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Network className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">Engagement Network</h3>
                  <p className="text-sm text-muted-foreground">Campaigns, Events, and Collaboration</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Core Workflow */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Core Innovation Workflow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-2 text-sm bg-muted/30 p-4 rounded-lg">
                <Badge variant="outline">Sectors</Badge>
                <ArrowRight className="h-4 w-4" />
                <Badge variant="outline">Organization</Badge>
                <ArrowRight className="h-4 w-4" />
                <Badge variant="outline">Challenges</Badge>
                <ArrowRight className="h-4 w-4" />
                <Badge variant="outline">Focus Questions</Badge>
                <ArrowRight className="h-4 w-4" />
                <Badge variant="outline">Ideas</Badge>
                <ArrowRight className="h-4 w-4" />
                <Badge variant="outline">Evaluations</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    </AppShell>
  );
}