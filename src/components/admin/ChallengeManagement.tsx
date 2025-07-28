import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, BarChart3, Settings } from "lucide-react";
import { ChallengeManagementList } from "./challenges/ChallengeManagementList";
import { ChallengeAnalytics } from "./challenges/ChallengeAnalytics";
import { ChallengeSystemSettings } from "./challenges/ChallengeSystemSettings";
import { PageLayout } from "@/components/layout/PageLayout";
import { useTranslation } from "@/hooks/useTranslation";

export function ChallengeManagement() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("challenges");

  return (
    <PageLayout
      title="إدارة التحديات الابتكارية"
      description="نظام شامل لإدارة وتحليل التحديات الابتكارية"
      className="space-y-6"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            التحديات
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            التحليلات
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            الإعدادات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges">
          <ChallengeManagementList />
        </TabsContent>

        <TabsContent value="analytics">
          <ChallengeAnalytics />
        </TabsContent>

        <TabsContent value="settings">
          <ChallengeSystemSettings />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}