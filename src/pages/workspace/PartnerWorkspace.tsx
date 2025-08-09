import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { useParams } from 'react-router-dom';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Handshake, ShoppingCart, Target, DollarSign, Package, TrendingUp } from 'lucide-react';

export default function PartnerWorkspace() {
  const { partnerId } = useParams();
  const { t } = useUnifiedTranslation();
  const [activeView, setActiveView] = useState('marketplace');

  return (
    <AppShell>
      <PageLayout 
        title={t('partnerWorkspace') || 'Partner Workspace'}
        description={t('managePartnershipActivities') || 'Manage your partnership activities and marketplace presence'}
        primaryAction={{
          label: t('newOpportunity') || 'New Opportunity',
          onClick: () => console.log('New opportunity'),
          icon: <Package className="w-4 h-4" />
        }}
        maxWidth="full"
      >
        <div className="space-y-6">
          {/* Partner Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 border rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <ShoppingCart className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">{t('marketplaceListings') || 'Marketplace Listings'}</h3>
              </div>
              <div className="text-2xl font-bold text-primary">18</div>
              <p className="text-sm text-muted-foreground">
                {t('activeOpportunities') || 'Active opportunities in marketplace'}
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Handshake className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">{t('activePartnerships') || 'Active Partnerships'}</h3>
              </div>
              <div className="text-2xl font-bold text-blue-600">7</div>
              <p className="text-sm text-muted-foreground">
                {t('ongoingCollaborations') || 'Ongoing collaboration projects'}
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <DollarSign className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">{t('revenue') || 'Revenue'}</h3>
              </div>
              <div className="text-2xl font-bold text-green-600">2.4M</div>
              <p className="text-sm text-muted-foreground">
                {t('quarterlyRevenue') || 'SAR revenue this quarter'}
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">{t('applications') || 'Applications'}</h3>
              </div>
              <div className="text-2xl font-bold text-purple-600">34</div>
              <p className="text-sm text-muted-foreground">
                {t('pendingApplications') || 'Pending opportunity applications'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">{t('recentOpportunities') || 'Recent Opportunities'}</h3>
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium">{t('digitalTransformationConsulting') || 'Digital Transformation Consulting'}</h4>
                  <p className="text-sm text-muted-foreground">{t('activeApplications') || '12 active applications'}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium">{t('cloudInfrastructureServices') || 'Cloud Infrastructure Services'}</h4>
                  <p className="text-sm text-muted-foreground">{t('activeApplications') || '8 active applications'}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">{t('partnershipMetrics') || 'Partnership Metrics'}</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('successfulProjects') || 'Successful Projects'}</span>
                  <span className="font-medium">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('customerSatisfaction') || 'Customer Satisfaction'}</span>
                  <span className="font-medium">4.8/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('responseTime') || 'Avg Response Time'}</span>
                  <span className="font-medium">2.3h</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">{t('marketplaceInsights') || 'Marketplace Insights'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">156</div>
                <p className="text-sm text-muted-foreground">{t('totalViews') || 'Total views this month'}</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">23%</div>
                <p className="text-sm text-muted-foreground">{t('conversionRate') || 'Application conversion rate'}</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">4.7</div>
                <p className="text-sm text-muted-foreground">{t('averageRating') || 'Average partner rating'}</p>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </AppShell>
  );
}