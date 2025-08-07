import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, BarChart3, Settings } from "lucide-react";
import { ChallengeManagementList } from "./challenges/ChallengeManagementList";
import { ChallengeAnalytics } from "./challenges/ChallengeAnalytics";
import { PageLayout } from "@/components/layout/PageLayout";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";

export function ChallengeManagement() {
  const { t } = useUnifiedTranslation();
  const [activeTab, setActiveTab] = useState("challenges");

  return (
    <PageLayout
      title="إدارة التحديات الابتكارية"
      description="نظام شامل لإدارة وتحليل التحديات الابتكارية"
      className="space-y-6"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            التحديات
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            التحليلات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges">
          <ChallengeManagementList />
        </TabsContent>

        <TabsContent value="analytics">
          <ChallengeAnalytics />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}