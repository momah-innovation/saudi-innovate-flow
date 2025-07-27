import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface FormSection {
  id: string;
  title: string;
  description?: string;
  content: ReactNode;
  disabled?: boolean;
}

interface FormLayoutProps {
  title: string;
  description?: string;
  sections?: FormSection[];
  actions?: ReactNode;
  children?: ReactNode;
  layout?: 'single' | 'tabs' | 'sections';
  className?: string;
}

export function FormLayout({
  title,
  description,
  sections = [],
  actions,
  children,
  layout = 'single',
  className
}: FormLayoutProps) {
  if (layout === 'single') {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {children}
          {actions && (
            <>
              <Separator />
              <div className="flex justify-end gap-2">
                {actions}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  if (layout === 'tabs') {
    return (
      <div className={`space-y-6 ${className || ''}`}>
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>

        <Tabs defaultValue={sections[0]?.id} className="space-y-6">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${sections.length}, 1fr)` }}>
            {sections.map((section) => (
              <TabsTrigger 
                key={section.id} 
                value={section.id}
                disabled={section.disabled}
              >
                {section.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {sections.map((section) => (
            <TabsContent key={section.id} value={section.id}>
              <Card>
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                  {section.description && (
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {section.content}
                </CardContent>
              </Card>
            </TabsContent>
          ))}

          {actions && (
            <div className="flex justify-end gap-2">
              {actions}
            </div>
          )}
        </Tabs>
      </div>
    );
  }

  if (layout === 'sections') {
    return (
      <div className={`space-y-6 ${className || ''}`}>
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                {section.description && (
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                )}
              </CardHeader>
              <CardContent>
                {section.content}
              </CardContent>
            </Card>
          ))}
        </div>

        {actions && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-end gap-2">
                {actions}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return null;
}

// Form field components
export function FormField({ 
  label, 
  children, 
  error, 
  required = false, 
  description 
}: {
  label: string;
  children: ReactNode;
  error?: string;
  required?: boolean;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {children}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}

export function FormFieldGroup({ 
  title, 
  description, 
  children 
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}