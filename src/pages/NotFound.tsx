import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useUnifiedTranslation } from "@/hooks/useAppTranslation";

const NotFound = () => {
  const location = useLocation();
  const { t } = useUnifiedTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <AppShell>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-700 mb-4">{t('not_found.title')}</h1>
          <p className="text-gray-600 mb-4">{t('not_found.message')}</p>
          <p className="text-gray-500">{t('not_found.path_label')}: {location.pathname}</p>
        </div>
      </div>
    </AppShell>
  );
};

export default NotFound;
