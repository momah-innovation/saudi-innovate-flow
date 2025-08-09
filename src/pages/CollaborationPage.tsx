import React from 'react';
import { CollaborationProvider } from '@/components/collaboration';
import { WorkspaceCollaboration } from '@/components/collaboration/WorkspaceCollaboration';

interface CollaborationPageProps {
  workspaceType?: 'user' | 'expert' | 'organization' | 'partner' | 'admin' | 'team';
  entityId?: string;
}

export const CollaborationPage: React.FC<CollaborationPageProps> = ({
  workspaceType = 'user',
  entityId
}) => {
  return (
    <CollaborationProvider>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">التعاون المباشر</h1>
        </div>
        
        <div className="grid gap-6">
          <div className="bg-card text-card-foreground rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">مساحة التعاون</h2>
            <p className="text-muted-foreground mb-4">
              تفاعل مع المستخدمين الآخرين في الوقت الفعلي، وشارك في المحادثات، 
              وتابع الأنشطة الجارية في النظام.
            </p>
            
            <WorkspaceCollaboration
              workspaceType={workspaceType}
              entityId={entityId}
              showWidget={true}
              showPresence={true}
              showActivity={true}
            />
          </div>
        </div>
      </div>
    </CollaborationProvider>
  );
};

export default CollaborationPage;