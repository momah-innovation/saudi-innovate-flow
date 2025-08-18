import React from 'react';
import { debugLog } from '@/utils/debugLogger';
import { useParams, Link } from 'react-router-dom';
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
  debugLog.debug('WorkspacePage - Current route type', { type });

  const renderWorkspace = () => {
    // If no type specified, show workspace selection
    if (!type) {
      return (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">مساحات العمل</h1>
            <p className="text-muted-foreground">اختر نوع مساحة العمل المناسبة لك</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/workspace/user" className="block group">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">مساحة العمل الشخصية</h3>
                  <p className="text-muted-foreground text-sm mb-4">إدارة أفكارك ومشاريعك الشخصية</p>
                  <span className="text-primary hover:underline">دخول →</span>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/workspace/expert" className="block group">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">مساحة الخبراء</h3>
                  <p className="text-muted-foreground text-sm mb-4">تقييم وإرشاد الأفكار المبتكرة</p>
                  <span className="text-primary hover:underline">دخول →</span>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/workspace/organization" className="block group">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">مساحة المؤسسة</h3>
                  <p className="text-muted-foreground text-sm mb-4">إدارة الابتكار على مستوى المؤسسة</p>
                  <span className="text-primary hover:underline">دخول →</span>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/workspace/partner" className="block group">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">مساحة الشركاء</h3>
                  <p className="text-muted-foreground text-sm mb-4">التعاون مع الشركاء الخارجيين</p>
                  <span className="text-primary hover:underline">دخول →</span>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/workspace/admin" className="block group">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">مساحة الإدارة</h3>
                  <p className="text-muted-foreground text-sm mb-4">إدارة النظام والمستخدمين</p>
                  <span className="text-primary hover:underline">دخول →</span>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/workspace/team" className="block group">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">مساحة الفريق</h3>
                  <p className="text-muted-foreground text-sm mb-4">العمل التعاوني مع الفريق</p>
                  <span className="text-primary hover:underline">دخول →</span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      );
    }
    
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