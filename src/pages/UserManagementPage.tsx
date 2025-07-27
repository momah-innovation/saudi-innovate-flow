import UserManagement from "@/pages/UserManagement";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageContainer } from "@/components/ui";

export default function UserManagementPage() {
  const breadcrumbs = [
    { label: "Admin", href: "/admin" },
    { label: "Users", href: "/admin/users" }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <PageContainer maxWidth="full" padding="lg">
        <UserManagement />
      </PageContainer>
    </AppLayout>
  );
}