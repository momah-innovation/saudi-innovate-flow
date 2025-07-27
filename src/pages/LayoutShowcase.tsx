import { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { 
  PageContainer, 
  Section, 
  ContentArea, 
  ResponsiveContainer, 
  ResponsiveGrid,
  PageHeader,
  DataCard,
  MetricCard,
  LayoutSelector
} from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, Target, TrendingUp } from 'lucide-react';

/**
 * Layout Showcase - Demonstrates the layout architecture
 * Shows how to properly structure pages using the containerization system
 */
export default function LayoutShowcase() {
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  
  const breadcrumbs = [
    { label: 'System', href: '/admin' },
    { label: 'Documentation', href: '/admin/docs' },
    { label: 'Layout Showcase' }
  ];

  const metrics = [
    { title: 'Total Users', value: '1,234', subtitle: '+12% from last month', icon: <Users className="h-5 w-5" />, trend: { value: 12, direction: 'up' as const, label: 'vs last month' } },
    { title: 'Active Projects', value: '56', subtitle: '8 new this week', icon: <Target className="h-5 w-5" />, trend: { value: 8, direction: 'up' as const, label: 'new this week' } },
    { title: 'Completion Rate', value: '89%', subtitle: '+5% improvement', icon: <TrendingUp className="h-5 w-5" />, trend: { value: 5, direction: 'up' as const, label: 'improvement' } },
    { title: 'Revenue', value: '$45.2K', subtitle: 'On track for goals', icon: <BarChart3 className="h-5 w-5" />, trend: { value: 0, direction: 'neutral' as const, label: 'no change' } }
  ];

  const sampleCards = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    title: `Sample Item ${i + 1}`,
    description: `This is a sample description for item ${i + 1} to demonstrate the layout system.`,
    status: ['active', 'pending', 'completed'][i % 3]
  }));

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      {/* Page Header Section */}
      <Section spacing="lg">
        <PageHeader
          title="Layout Architecture Showcase"
          description="Demonstration of the containerization and structure system"
          itemCount={sampleCards.length}
        />
      </Section>

      {/* Metrics Section */}
      <Section spacing="md" background="muted" rounded>
        <ResponsiveContainer size="xl">
          <ContentArea layout="stack" gap="md">
            <h2 className="text-2xl font-semibold">Key Metrics</h2>
            <ResponsiveGrid 
              columns={{ mobile: 1, tablet: 2, desktop: 4 }}
              gap="md"
            >
              {metrics.map((metric, index) => (
                <MetricCard key={index} {...metric} />
              ))}
            </ResponsiveGrid>
          </ContentArea>
        </ResponsiveContainer>
      </Section>

      {/* Content Management Section */}
      <Section spacing="lg">
        <ContentArea layout="stack" gap="lg">
          {/* Layout Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Content Grid</h2>
              <p className="text-muted-foreground">Responsive grid layout with different view modes</p>
            </div>
            <LayoutSelector viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>

          {/* Responsive Content Grid */}
          {viewMode === 'cards' && (
            <ResponsiveGrid 
              columns={{ mobile: 1, tablet: 2, desktop: 3 }}
              gap="md"
            >
              {sampleCards.map((item) => (
                <DataCard
                  key={item.id}
                  item={item}
                  title={item.title}
                  description={item.description}
                  badges={[{ label: item.status, variant: item.status === 'active' ? 'default' : 'secondary' }]}
                />
              ))}
            </ResponsiveGrid>
          )}

          {viewMode === 'grid' && (
            <ResponsiveGrid 
              columns={{ mobile: 2, tablet: 3, desktop: 4, wide: 6 }}
              gap="sm"
            >
              {sampleCards.map((item) => (
                <Card key={item.id} className="p-4">
                  <CardTitle className="text-sm mb-2">{item.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">{item.status}</p>
                </Card>
              ))}
            </ResponsiveGrid>
          )}

          {viewMode === 'list' && (
            <ContentArea layout="stack" gap="sm">
              {sampleCards.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="text-sm font-medium capitalize">{item.status}</div>
                  </div>
                </Card>
              ))}
            </ContentArea>
          )}
        </ContentArea>
      </Section>

      {/* Layout Examples Section */}
      <Section spacing="lg" background="card" border rounded>
        <ResponsiveContainer size="lg">
          <ContentArea layout="stack" gap="lg">
            <h2 className="text-2xl font-semibold">Layout Patterns</h2>
            
            {/* Sidebar Layout Example */}
            <Card>
              <CardHeader>
                <CardTitle>Sidebar Layout</CardTitle>
              </CardHeader>
              <CardContent>
                <ContentArea layout="sidebar-left" gap="lg">
                  <div className="bg-muted p-4 rounded">
                    <h4 className="font-medium mb-2">Sidebar Content</h4>
                    <p className="text-sm text-muted-foreground">Fixed width sidebar for navigation or filters</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded">
                    <h4 className="font-medium mb-2">Main Content</h4>
                    <p className="text-sm text-muted-foreground">Flexible main content area that adapts to available space</p>
                  </div>
                </ContentArea>
              </CardContent>
            </Card>

            {/* Center Layout Example */}
            <Card>
              <CardHeader>
                <CardTitle>Center Layout</CardTitle>
              </CardHeader>
              <CardContent>
                <ContentArea layout="center" gap="md">
                  <div className="bg-muted p-8 rounded max-w-md text-center">
                    <h4 className="font-medium mb-2">Centered Content</h4>
                    <p className="text-sm text-muted-foreground">Perfect for forms, modals, or featured content</p>
                    <Button className="mt-4">Call to Action</Button>
                  </div>
                </ContentArea>
              </CardContent>
            </Card>
          </ContentArea>
        </ResponsiveContainer>
      </Section>
    </AdminLayout>
  );
}