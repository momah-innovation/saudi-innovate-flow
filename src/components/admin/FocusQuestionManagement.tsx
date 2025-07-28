import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, BarChart3 } from "lucide-react";
import { FocusQuestionManagementList } from "./focus-questions/FocusQuestionManagementList";
import { FocusQuestionAnalytics } from "./focus-questions/FocusQuestionAnalytics";
import { PageLayout } from "@/components/layout/PageLayout";
import { useTranslation } from "@/hooks/useTranslation";

export function FocusQuestionManagement() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("questions");

  return (
    <PageLayout
      title="إدارة الأسئلة المحورية"
      description="نظام شامل لإدارة وتحليل الأسئلة المحورية"
      className="space-y-6"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            الأسئلة المحورية
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            التحليلات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questions">
          <FocusQuestionManagementList />
        </TabsContent>

        <TabsContent value="analytics">
          <FocusQuestionAnalytics />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}