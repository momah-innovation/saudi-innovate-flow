import React from 'react';
import { useParams } from 'react-router-dom';
import { CollaborationProvider } from '@/contexts/CollaborationContext';
import UserWorkspace from '@/pages/workspace/UserWorkspace';
import ExpertWorkspace from '@/pages/workspace/ExpertWorkspace';
import OrganizationWorkspace from '@/pages/workspace/OrganizationWorkspace';
import PartnerWorkspace from '@/pages/workspace/PartnerWorkspace';
import AdminWorkspace from '@/pages/workspace/AdminWorkspace';
import TeamWorkspace from '@/pages/workspace/TeamWorkspace';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function WorkspacePage() {
  const { type } = useParams<{ type: string }>();

  // Add debugging
  console.log('🏢 WorkspacePage - Current route type:', type);

  const renderWorkspace = () => {
    // Default to user workspace if no type specified
    const workspaceType = type || 'user';
    
    switch (workspaceType) {
      case 'user':
        return <UserWorkspace />;
      case 'expert':
        return <ExpertWorkspace />;
      case 'organization':
        return <OrganizationWorkspace />;
      case 'partner':
        return <PartnerWorkspace />;
      case 'admin':
        return <AdminWorkspace />;
      case 'team':
        return <TeamWorkspace />;
      default:
        return (
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">نوع مساحة العمل غير صحيح</h3>
              <p className="text-muted-foreground">نوع مساحة العمل المطلوبة غير متاح: {workspaceType}</p>
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