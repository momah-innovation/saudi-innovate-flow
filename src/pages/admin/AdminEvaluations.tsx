import { AdminBreadcrumb } from "@/components/layout/AdminBreadcrumb";
import { PageLayout } from '@/components/layout/PageLayout';
import { EvaluationsManagement } from '@/components/admin/EvaluationsManagement';
import { useAuth } from "@/contexts/AuthContext";
import { useDirection } from "@/components/ui/direction-provider";

export default function AdminEvaluations() {
  const { hasRole } = useAuth();
  const { isRTL } = useDirection();

  // Check if user has admin access
  if (!hasRole('admin') && !hasRole('super_admin')) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">
            {isRTL ? 'غير مصرح لك بالوصول' : 'Access Denied'}
          </h2>
          <p className="text-muted-foreground">
            {isRTL ? 'هذه الصفحة مخصصة للمديرين فقط' : 'This page is only accessible to administrators'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminBreadcrumb />
      <PageLayout>
        <EvaluationsManagement viewMode="cards" />
      </PageLayout>
    </div>
  );
}