import { cn } from "@/lib/utils";
import { logger } from '@/utils/logger';

export interface FontConfig {
  family: string;
  weights: number[];
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  preload?: boolean;
}

export const FONT_CONFIGS: Record<string, FontConfig> = {
  inter: {
    family: 'Inter',
    weights: [300, 400, 500, 600, 700],
    display: 'swap',
    preload: true,
  },
  roboto: {
    family: 'Roboto',
    weights: [300, 400, 500, 700],
    display: 'swap',
  },
  'open-sans': {
    family: 'Open Sans',
    weights: [300, 400, 500, 600, 700],
    display: 'swap',
  },
  montserrat: {
    family: 'Montserrat',
    weights: [300, 400, 500, 600, 700],
    display: 'swap',
  },
  'source-sans-pro': {
    family: 'Source Sans Pro',
    weights: [300, 400, 600, 700],
    display: 'swap',
  },
  poppins: {
    family: 'Poppins',
    weights: [300, 400, 500, 600, 700],
    display: 'swap',
  },
  lato: {
    family: 'Lato',
    weights: [300, 400, 700],
    display: 'swap',
  },
  nunito: {
    family: 'Nunito',
    weights: [300, 400, 600, 700],
    display: 'swap',
  },
};

export class FontManager {
  private static instance: FontManager;
  private loadedFonts = new Set<string>();

  static getInstance(): FontManager {
    if (!FontManager.instance) {
      FontManager.instance = new FontManager();
    }
    return FontManager.instance;
  }

  async loadFont(fontKey: string): Promise<void> {
    if (this.loadedFonts.has(fontKey)) {
      return Promise.resolve();
    }

    const config = FONT_CONFIGS[fontKey];
    if (!config) {
      logger.warn(`Font configuration not found for: ${fontKey}`, { component: 'FontManager', action: 'loadFont', fontKey });
      return Promise.reject(new Error(`Font not found: ${fontKey}`));
    }

    try {
      await this.loadGoogleFont(config);
      this.loadedFonts.add(fontKey);
    } catch (error) {
      logger.error(`Failed to load font: ${fontKey}`, { component: 'FontManager', action: 'loadFont', fontKey }, error as Error);
      throw error;
    }
  }

  private async loadGoogleFont(config: FontConfig): Promise<void> {
    const weights = config.weights.join(',');
    const fontUrl = `https://fonts.googleapis.com/css2?family=${config.family.replace(' ', '+')}:wght@${weights}&display=${config.display || 'swap'}`;

    // Create link element
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontUrl;

    // Add preload if specified
    if (config.preload) {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'style';
      preloadLink.href = fontUrl;
      document.head.appendChild(preloadLink);
    }

    // Return promise that resolves when font is loaded
    return new Promise((resolve, reject) => {
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to load font: ${config.family}`));
      document.head.appendChild(link);
    });
  }

  setFontFamily(fontFamily: string, element?: HTMLElement): void {
    const target = element || document.documentElement;
    target.style.setProperty('--font-family', fontFamily);
  }

  getFontClass(fontKey: string): string {
    const config = FONT_CONFIGS[fontKey];
    if (!config) return '';
    
    return `font-${fontKey}`;
  }

  generateFontClasses(): string {
    return Object.entries(FONT_CONFIGS)
      .map(([key, config]) => {
        return `.font-${key} { font-family: "${config.family}", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif; }`;
      })
      .join('\n');
  }

  async preloadFonts(fontKeys: string[]): Promise<void[]> {
    return Promise.all(fontKeys.map(key => this.loadFont(key)));
  }
}

// Export singleton instance
export const fontManager = FontManager.getInstance();

// Font loading hook
import { useEffect, useState } from 'react';

export function useFontLoader(fontKeys: string[]) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await fontManager.preloadFonts(fontKeys);
        setLoaded(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load fonts');
      }
    };

    loadFonts();
  }, [fontKeys]);

  return { loaded, error };
}

// Font preference component
interface FontSelectorProps {
  currentFont: string;
  onFontChange: (fontKey: string) => void;
  availableFonts?: string[];
  className?: string;
}

export function FontSelector({ 
  currentFont, 
  onFontChange, 
  availableFonts = Object.keys(FONT_CONFIGS),
  className 
}: FontSelectorProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium">Font Family</label>
      <select
        value={currentFont}
        onChange={(e) => onFontChange(e.target.value)}
        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
      >
        {availableFonts.map((fontKey) => {
          const config = FONT_CONFIGS[fontKey];
          return (
            <option key={fontKey} value={fontKey}>
              {config.family}
            </option>
          );
        })}
      </select>
      
      <div className="mt-2 p-3 border rounded-md bg-muted/20">
        <p 
          className={fontManager.getFontClass(currentFont)}
          style={{ fontFamily: FONT_CONFIGS[currentFont]?.family }}
        >
          The quick brown fox jumps over the lazy dog. 1234567890
        </p>
      </div>
    </div>
  );
}

// CSS injection for font classes
export function injectFontStyles(): void {
  const styleId = 'font-manager-styles';
  
  // Remove existing styles
  const existingStyle = document.getElementById(styleId);
  if (existingStyle) {
    existingStyle.remove();
  }

  // Inject new styles
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = fontManager.generateFontClasses();
  document.head.appendChild(style);
}