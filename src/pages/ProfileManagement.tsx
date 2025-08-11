import { AppShell } from "@/components/layout/AppShell";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProfileManager } from "@/components/profile/ProfileManager";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";

export default function ProfileManagementPage() {
  const { t } = useUnifiedTranslation();
  
  return (
    <AppShell>
      <PageLayout
        title={t('profile_management')}
        description={t('profile_management_description')}
        className="space-y-4 sm:space-y-6"
      >
        <ProfileManager />
      </PageLayout>
    </AppShell>
  );
}