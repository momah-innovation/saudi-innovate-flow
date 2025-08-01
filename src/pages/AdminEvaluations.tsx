import { PageLayout } from '@/components/layout/PageLayout';
import { EvaluationsManagement } from '@/components/admin/EvaluationsManagement';

export default function AdminEvaluations() {
  return (
    <PageLayout>
      <EvaluationsManagement viewMode="cards" />
    </PageLayout>
  );
}