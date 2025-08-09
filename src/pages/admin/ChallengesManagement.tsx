import { AppShell } from '@/components/layout/AppShell';
import { AdminChallengeManagement } from '@/components/admin/AdminChallengeManagement';

export default function ChallengesManagementPage() {
  return (
    <AppShell>
      <AdminChallengeManagement />
    </AppShell>
  );
}