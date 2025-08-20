import { AdminBreadcrumb } from "@/components/layout/AdminBreadcrumb";
import { IdeasManagement } from '@/components/admin/IdeasManagement';
import { useAuth } from "@/contexts/AuthContext";
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

export default function IdeasManagementPage() {
  const { hasRole } = useAuth();
  const { t } = useUnifiedTranslation();

  // Check if user has admin access
  if (!hasRole('admin') && !hasRole('super_admin')) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">
            {t('admin:access.denied')}
          </h2>
          <p className="text-muted-foreground">
            {t('admin:access.admin_only')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminBreadcrumb />
      <IdeasManagement />
    </div>
  );
}
