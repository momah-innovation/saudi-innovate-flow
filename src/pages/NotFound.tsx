import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const breadcrumbs = [
    { label: "خطأ 404" }
  ];

  return (
    <AppShell>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-700 mb-4">404</h1>
          <p className="text-gray-600 mb-4">الصفحة غير موجودة</p>
          <p className="text-gray-500">المسار: {location.pathname}</p>
        </div>
      </div>
    </AppShell>
  );
};

export default NotFound;
