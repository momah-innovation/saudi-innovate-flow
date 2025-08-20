import React from 'react';
import { debugLog } from '@/utils/debugLogger';
import { useParams, Link } from 'react-router-dom';
import { CollaborationProvider } from '@/contexts/CollaborationContext';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
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
  const { t, isRTL } = useUnifiedTranslation();

  // Add debugging
  debugLog.debug('WorkspacePage - Current route type', { type });

  const renderWorkspace = () => {
    // If no type specified, show workspace selection
    if (!type) {
      return (
        <div className="max-w-7xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              {t('workspace_selection.title')}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {t('workspace_selection.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link to="/workspace/user" className="block group">
              <Card className="cursor-pointer hover:shadow-elegant transition-all duration-300 h-full gradient-border hover-scale group-hover:bg-gradient-subtle">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl mb-6 mx-auto group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110">
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors text-center">
                    {t('workspace_types.personal.title')}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 text-center leading-relaxed">
                    {t('workspace_types.personal.description')}
                  </p>
                  <div className="text-center">
                    <span className="text-primary hover:underline font-medium">
                      {t('workspace_selection.enter')} {t('workspace_selection.enter_arrow')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/workspace/expert" className="block group">
              <Card className="cursor-pointer hover:shadow-elegant transition-all duration-300 h-full gradient-border hover-scale group-hover:bg-gradient-subtle">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl mb-6 mx-auto group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110">
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors text-center">
                    {t('workspace_types.expert.title')}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 text-center leading-relaxed">
                    {t('workspace_types.expert.description')}
                  </p>
                  <div className="text-center">
                    <span className="text-primary hover:underline font-medium">
                      {t('workspace_selection.enter')} {t('workspace_selection.enter_arrow')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/workspace/organization" className="block group">
              <Card className="cursor-pointer hover:shadow-elegant transition-all duration-300 h-full gradient-border hover-scale group-hover:bg-gradient-subtle">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl mb-6 mx-auto group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110">
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors text-center">
                    {t('workspace_types.organization.title')}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 text-center leading-relaxed">
                    {t('workspace_types.organization.description')}
                  </p>
                  <div className="text-center">
                    <span className="text-primary hover:underline font-medium">
                      {t('workspace_selection.enter')} {t('workspace_selection.enter_arrow')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/workspace/partner" className="block group">
              <Card className="cursor-pointer hover:shadow-elegant transition-all duration-300 h-full gradient-border hover-scale group-hover:bg-gradient-subtle">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl mb-6 mx-auto group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110">
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors text-center">
                    {t('workspace_types.partner.title')}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 text-center leading-relaxed">
                    {t('workspace_types.partner.description')}
                  </p>
                  <div className="text-center">
                    <span className="text-primary hover:underline font-medium">
                      {t('workspace_selection.enter')} {t('workspace_selection.enter_arrow')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/workspace/admin" className="block group">
              <Card className="cursor-pointer hover:shadow-elegant transition-all duration-300 h-full gradient-border hover-scale group-hover:bg-gradient-subtle">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl mb-6 mx-auto group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110">
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors text-center">
                    {t('workspace_types.admin.title')}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 text-center leading-relaxed">
                    {t('workspace_types.admin.description')}
                  </p>
                  <div className="text-center">
                    <span className="text-primary hover:underline font-medium">
                      {t('workspace_selection.enter')} {t('workspace_selection.enter_arrow')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/workspace/team" className="block group">
              <Card className="cursor-pointer hover:shadow-elegant transition-all duration-300 h-full gradient-border hover-scale group-hover:bg-gradient-subtle">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl mb-6 mx-auto group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110">
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors text-center">
                    {t('workspace_types.team.title')}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 text-center leading-relaxed">
                    {t('workspace_types.team.description')}
                  </p>
                  <div className="text-center">
                    <span className="text-primary hover:underline font-medium">
                      {t('workspace_selection.enter')} {t('workspace_selection.enter_arrow')}
                    </span>
                  </div>
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
              <h3 className="text-lg font-semibold mb-2">{t('workspace_selection.invalid_type')}</h3>
              <p className="text-muted-foreground">{t('workspace_selection.invalid_description', { type: workspaceType })}</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <CollaborationProvider>
      <div className="min-h-screen bg-gradient-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {renderWorkspace()}
        </div>
      </div>
    </CollaborationProvider>
  );
}
