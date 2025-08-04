import { AppShell } from "@/components/layout/AppShell";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProfileManager } from "@/components/profile/ProfileManager";
import { useTranslation } from "@/hooks/useAppTranslation";

export default function ProfileManagementPage() {
  const { t } = useTranslation();
  
  return (
    <AppShell>
      <PageLayout
        title="إدارة الملف الشخصي"
        description="إدارة معلوماتك الشخصية وتفضيلاتك وإعدادات الأمان"
        className="space-y-6"
      >
        <ProfileManager />
      </PageLayout>
    </AppShell>
  );
}