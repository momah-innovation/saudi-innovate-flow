import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDirection } from '@/components/ui/direction-provider';

export function LanguageToggle() {
  const { language, setLanguage } = useDirection();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="h-9 w-9 p-0"
      onClick={toggleLanguage}
      title={language === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
    >
      <Languages className="h-4 w-4" />
      <span className="sr-only">
        {language === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
      </span>
    </Button>
  );
}