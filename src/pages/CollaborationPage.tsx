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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">التعاون المباشر</h1>
        </div>
        
        <div className="grid gap-4 sm:gap-6">
          <div className="bg-card text-card-foreground rounded-lg border p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">مساحة التعاون</h2>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
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