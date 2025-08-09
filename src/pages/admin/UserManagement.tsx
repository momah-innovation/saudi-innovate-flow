import { AppShell } from '@/components/layout/AppShell';
import RoleRequestManagement from '@/components/admin/RoleRequestManagement';

export default function UserManagementPage() {
  return (
    <AppShell>
      <RoleRequestManagement />
    </AppShell>
  );
}