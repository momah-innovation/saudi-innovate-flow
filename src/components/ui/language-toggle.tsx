import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Languages, Globe } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

const languages = [
  { code: 'ar', name: 'العربية', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' }
] as const;

export function LanguageToggle() {
  const { language, setLanguage, isRTL } = useDirection();

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`h-8 w-8 px-0 ${isRTL ? 'font-arabic' : 'font-english'}`}
        >
          <Globe className="h-4 w-4" />
          <span className="sr-only">تبديل اللغة / Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`cursor-pointer ${lang.code === 'ar' ? 'font-arabic' : 'font-english'} ${
              language === lang.code ? 'bg-accent' : ''
            }`}
          >
            <div className={`flex items-center gap-2 w-full ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-lg">{lang.flag}</span>
              <span className="font-medium">{lang.nativeName}</span>
              {language === lang.code && (
                <Badge variant="secondary" className={cn("text-xs", isRTL ? "ml-auto" : "mr-auto")}>
                  {isRTL ? 'نشط' : 'Active'}
                </Badge>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}