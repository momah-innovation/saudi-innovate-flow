import React from 'react';
import { Card } from '@/components/ui/card';

export const TypographySection: React.FC = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-6">Typography Scale</h2>
      
      <Card className="p-6 space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Heading 1 - 4xl Bold</h1>
          <code className="text-sm bg-muted px-2 py-1 rounded">text-4xl font-bold</code>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-2">Heading 2 - 3xl Bold</h2>
          <code className="text-sm bg-muted px-2 py-1 rounded">text-3xl font-bold</code>
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-2">Heading 3 - 2xl Semibold</h3>
          <code className="text-sm bg-muted px-2 py-1 rounded">text-2xl font-semibold</code>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-2">Heading 4 - xl Semibold</h4>
          <code className="text-sm bg-muted px-2 py-1 rounded">text-xl font-semibold</code>
        </div>
        <div>
          <h5 className="text-lg font-medium mb-2">Heading 5 - lg Medium</h5>
          <code className="text-sm bg-muted px-2 py-1 rounded">text-lg font-medium</code>
        </div>
        <div>
          <p className="text-base mb-2">Body Text - base Regular</p>
          <code className="text-sm bg-muted px-2 py-1 rounded">text-base</code>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Small Text - sm Muted</p>
          <code className="text-sm bg-muted px-2 py-1 rounded">text-sm text-muted-foreground</code>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-2">Caption - xs Muted</p>
          <code className="text-sm bg-muted px-2 py-1 rounded">text-xs text-muted-foreground</code>
        </div>
      </Card>

      {/* RTL/LTR Typography */}
      <Card className="p-6 space-y-6">
        <h3 className="text-xl font-semibold mb-4">Multi-language Typography</h3>
        <div>
          <div className="mb-4" dir="ltr">
            <p className="text-lg font-medium mb-2">English (Inter Font)</p>
            <p className="font-english">The quick brown fox jumps over the lazy dog</p>
            <code className="text-sm bg-muted px-2 py-1 rounded">font-english</code>
          </div>
          <div dir="rtl">
            <p className="text-lg font-medium mb-2">العربية (Cairo Font)</p>
            <p className="font-arabic">نظام إدارة الابتكار المتقدم - رؤية المملكة 2030</p>
            <code className="text-sm bg-muted px-2 py-1 rounded">font-arabic</code>
          </div>
        </div>
      </Card>
    </div>
  );
};