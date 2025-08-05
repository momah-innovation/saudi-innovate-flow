import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  Palette, 
  Type, 
  Image as ImageIcon, 
  FileText, 
  Sparkles,
  Copy,
  Check,
  Eye
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface BrandAssetProps {
  title: string;
  description: string;
  format: string;
  size: string;
  category: 'logo' | 'color' | 'typography' | 'pattern' | 'template';
  downloadUrl?: string;
  previewUrl?: string;
  className?: string;
}

export function BrandAsset({ 
  title, 
  description, 
  format, 
  size, 
  category, 
  downloadUrl, 
  previewUrl, 
  className 
}: BrandAssetProps) {
  const [copied, setCopied] = useState(false);

  const getCategoryIcon = () => {
    switch (category) {
      case 'logo': return <Sparkles className="w-4 h-4" />;
      case 'color': return <Palette className="w-4 h-4" />;
      case 'typography': return <Type className="w-4 h-4" />;
      case 'pattern': return <ImageIcon className="w-4 h-4" />;
      case 'template': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'logo': return 'bg-primary/10 text-primary';
      case 'color': return 'bg-accent/10 text-accent';
      case 'typography': return 'bg-secondary/10 text-secondary';
      case 'pattern': return 'bg-innovation/10 text-innovation';
      case 'template': return 'bg-success/10 text-success';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  const handleCopy = () => {
    if (downloadUrl) {
      navigator.clipboard.writeText(downloadUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className={cn("group hover:shadow-lg transition-all duration-200", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", getCategoryColor())}>
            {getCategoryIcon()}
          </div>
          <div className="flex gap-2">
            {previewUrl && (
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-4 h-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleCopy} className="opacity-0 group-hover:opacity-100 transition-opacity">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">{format}</Badge>
            <Badge variant="secondary" className="text-xs">{size}</Badge>
          </div>

          {downloadUrl && (
            <Button variant="outline" size="sm" className="w-full mt-4">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface ColorPaletteProps {
  name: string;
  colors: Array<{
    name: string;
    value: string;
    description?: string;
  }>;
  className?: string;
}

export function ColorPalette({ name, colors, className }: ColorPaletteProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleColorCopy = (colorValue: string) => {
    navigator.clipboard.writeText(colorValue);
    setCopiedColor(colorValue);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {colors.map((color, index) => (
          <div key={index} className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-lg cursor-pointer transition-transform hover:scale-105 shadow-sm border"
              style={{ backgroundColor: color.value }}
              onClick={() => handleColorCopy(color.value)}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">{color.name}</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleColorCopy(color.value)}
                  className="h-8 px-2"
                >
                  {copiedColor === color.value ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground font-mono">{color.value}</p>
              {color.description && (
                <p className="text-xs text-muted-foreground mt-1">{color.description}</p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

interface TypographyScaleProps {
  title: string;
  samples: Array<{
    name: string;
    className: string;
    text: string;
    specs: string;
  }>;
  className?: string;
}

export function TypographyScale({ title, samples, className }: TypographyScaleProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {samples.map((sample, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-muted-foreground">{sample.name}</h4>
              <Badge variant="outline" className="text-xs">{sample.specs}</Badge>
            </div>
            <div className={sample.className}>{sample.text}</div>
            <Separator className="mt-4" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

interface BrandMetricProps {
  label: string;
  value: number;
  max: number;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'destructive';
  className?: string;
}

export function BrandMetric({ label, value, max, color = 'primary', className }: BrandMetricProps) {
  const percentage = (value / max) * 100;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">{value}/{max}</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}

export { type BrandAssetProps, type ColorPaletteProps, type TypographyScaleProps, type BrandMetricProps };