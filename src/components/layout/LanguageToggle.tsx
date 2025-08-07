import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useAppTranslation';

export function LanguageToggle() {
  const { language, setLanguage } = useDirection();
  const { t } = useUnifiedTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="h-9 w-9 p-0"
      onClick={toggleLanguage}
      title={t('switch_language')}
    >
      <Languages className="h-4 w-4" />
      <span className="sr-only">
        {t('switch_language')}
      </span>
    </Button>
  );
}