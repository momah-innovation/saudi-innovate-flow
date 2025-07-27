import { AppLayout } from "@/components/layout/AppLayout";
import FocusQuestionsManagementComponent from "@/components/admin/FocusQuestionsManagement";

const FocusQuestionsManagement = () => {
  const breadcrumbs = [
    { label: "الإدارة", href: "/admin" },
    { label: "الأسئلة المحورية", href: "/admin/focus-questions" }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <FocusQuestionsManagementComponent />
    </AppLayout>
  );
};

export default FocusQuestionsManagement;