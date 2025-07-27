import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface DetailSection {
  title: string;
  items: Array<{
    label: string;
    value: ReactNode;
    fullWidth?: boolean;
  }>;
}

interface DetailViewProps {
  title: string;
  subtitle?: string;
  badges?: Array<{
    label: string;
    color?: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  }>;
  sections: DetailSection[];
  actions?: ReactNode;
  className?: string;
}

export function DetailView({ 
  title, 
  subtitle, 
  badges, 
  sections, 
  actions, 
  className 
}: DetailViewProps) {
  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
        
        {badges && badges.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {badges.map((badge, index) => (
              <Badge 
                key={index}
                variant={badge.variant || 'default'}
                className={badge.color}
              >
                {badge.label}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="grid gap-6">
        {sections.map((section, sectionIndex) => (
          <Card key={sectionIndex}>
            <CardHeader>
              <CardTitle className="text-lg">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    {item.fullWidth ? (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground">
                          {item.label}
                        </h4>
                        <div>{item.value}</div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="font-medium text-sm text-muted-foreground">
                          {item.label}
                        </div>
                        <div className="col-span-2">{item.value}</div>
                      </div>
                    )}
                    {itemIndex < section.items.length - 1 && !item.fullWidth && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}