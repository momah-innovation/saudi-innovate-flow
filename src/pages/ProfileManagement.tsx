import { AppShell } from "@/components/layout/AppShell";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProfileManager } from "@/components/profile/ProfileManager";
import { useTranslation } from "@/hooks/useAppTranslation";

export default function ProfileManagementPage() {
  const { t } = useTranslation();
  
  return (
    <AppShell>
      <PageLayout
        title={t('profile_management')}
        description={t('profile_management_description')}
        className="space-y-6"
      >
        <ProfileManager />
      </PageLayout>
    </AppShell>
  );
}