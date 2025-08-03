import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ColorTokenProps {
  name: string;
  className: string;
  description: string;
}

export const ColorToken: React.FC<ColorTokenProps> = ({ name, className, description }) => {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
      duration: 2000,
    });
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="group relative">
      <div 
        className={cn("h-16 w-full rounded-lg border cursor-pointer transition-all hover:scale-105", className)}
        onClick={() => copyToClipboard(className, name)}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {copiedToken === className ? (
            <Check className="h-5 w-5 text-primary-foreground" />
          ) : (
            <Copy className="h-5 w-5 text-primary-foreground" />
          )}
        </div>
      </div>
      <div className="mt-2 space-y-1">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
        <code className="text-xs bg-muted px-2 py-1 rounded">{className}</code>
      </div>
    </div>
  );
};