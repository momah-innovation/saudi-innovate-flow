import React from 'react';
import { useParams } from 'react-router-dom';
import { CollaborationProvider } from '@/contexts/CollaborationContext';
import { UserWorkspace } from '@/components/workspace/UserWorkspace';
import { ExpertWorkspace } from '@/components/workspace/ExpertWorkspace';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function WorkspacePage() {
  const { type, id } = useParams<{ type: string; id: string }>();

  const renderWorkspace = () => {
    switch (type) {
      case 'user':
        return <UserWorkspace userId={id} />;
      case 'expert':
        return <ExpertWorkspace expertId={id} />;
      case 'organization':
        return (
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="py-8">
                <h3 className="text-lg font-semibold mb-2">مساحة عمل المنظمة</h3>
                <p className="text-muted-foreground">قادمة قريباً</p>
              </div>
            </CardContent>
          </Card>
        );
      case 'partner':
        return (
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="py-8">
                <h3 className="text-lg font-semibold mb-2">مساحة عمل الشريك</h3>
                <p className="text-muted-foreground">قادمة قريباً</p>
              </div>
            </CardContent>
          </Card>
        );
      case 'admin':
        return (
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="py-8">
                <h3 className="text-lg font-semibold mb-2">مساحة عمل الإدارة</h3>
                <p className="text-muted-foreground">قادمة قريباً</p>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return (
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">نوع مساحة العمل غير صحيح</h3>
              <p className="text-muted-foreground">نوع مساحة العمل المطلوبة غير متاح</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <CollaborationProvider>
      <div className="container mx-auto px-4 py-6">
        {renderWorkspace()}
      </div>
    </CollaborationProvider>
  );
}