import React from 'react';
import { useParams } from 'react-router-dom';
import { CollaborationProvider } from '@/contexts/CollaborationContext';
import { UserWorkspace } from '@/components/workspace/UserWorkspace';
import { ExpertWorkspace } from '@/components/workspace/ExpertWorkspace';
import { OrganizationWorkspace } from '@/components/workspace/OrganizationWorkspace';
import { PartnerWorkspace } from '@/components/workspace/PartnerWorkspace';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { WorkspaceCollaboration } from '@/components/collaboration/WorkspaceCollaboration';

export default function WorkspacePage() {
  const { type, id } = useParams<{ type: string; id: string }>();

  const renderWorkspace = () => {
    switch (type) {
      case 'user':
        return <UserWorkspace userId={id} />;
      case 'expert':
        return <ExpertWorkspace expertId={id} />;
      case 'organization':
        return <OrganizationWorkspace organizationId={id} />;
      case 'partner':
        return <PartnerWorkspace partnerId={id} />;
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {renderWorkspace()}
        
      </div>
    </CollaborationProvider>
  );
}