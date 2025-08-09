import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, 
  GraduationCap, 
  Building2, 
  Handshake, 
  Shield, 
  UserCheck,
  Target,
  Lightbulb,
  FileText,
  BarChart3,
  Settings,
  MessageSquare
} from 'lucide-react';

export default function WorkspaceDocumentation() {
  const { t } = useUnifiedTranslation();

  const workspaceTypes = [
    {
      id: 'user',
      title: 'User Workspace',
      description: 'Innovation submission and personal idea management',
      icon: Users,
      color: 'bg-blue-500',
      scope: {
        purpose: 'Innovation submission and personal idea management',
        primaryFunctions: [
          'Idea Management: Create, edit, save drafts, submit ideas',
          'Challenge Participation: Browse open challenges, track applications, view submission status',
          'Collaboration Hub: Team formation, co-author invitations, discussion threads',
          'Portfolio Management: Personal idea library, submission history, impact tracking',
          'Learning Center: Resources, tutorials, best practices, skill development',
          'Progress Tracking: Innovation journey, achievement milestones, skill assessments'
        ],
        keyFeatures: [
          'Idea editor with templates, media uploads, collaboration tools',
          'Challenge discovery with filtering, favorites, deadline tracking',
          'Team workspace for group submissions',
          'Personal analytics and feedback history',
          'Resource library and learning paths'
        ]
      }
    },
    {
      id: 'expert',
      title: 'Expert Workspace',
      description: 'Evaluation management and expertise delivery',
      icon: GraduationCap,
      color: 'bg-purple-500',
      scope: {
        purpose: 'Evaluation management and expertise delivery',
        primaryFunctions: [
          'Evaluation Queue: Pending reviews, prioritized by deadline/importance',
          'Assessment Tools: Structured evaluation forms, scoring rubrics, comparison tools',
          'Quality Assurance: Review standards, calibration exercises, peer reviews',
          'Knowledge Sharing: Best practices, evaluation guidelines, mentoring resources',
          'Performance Analytics: Evaluation metrics, consistency tracking, feedback quality',
          'Schedule Management: Availability, workload balancing, deadline management'
        ],
        keyFeatures: [
          'Evaluation dashboard with filtering and sorting',
          'Rich assessment interface with scoring, comments, recommendations',
          'Peer collaboration tools for complex evaluations',
          'Template library for common evaluation scenarios',
          'Analytics on evaluation quality and consistency'
        ]
      }
    },
    {
      id: 'organization',
      title: 'Organization Workspace',
      description: 'Innovation program orchestration and team management',
      icon: Building2,
      color: 'bg-green-500',
      scope: {
        purpose: 'Innovation program orchestration and team management',
        primaryFunctions: [
          'Challenge Lifecycle Management: Create, configure, publish, monitor challenges',
          'Team Coordination: Member management, role assignments, workload distribution',
          'Resource Planning: Budget allocation, timeline management, resource tracking',
          'Applicant Management: Review submissions, manage evaluation process, select winners',
          'Program Analytics: Challenge performance, participation metrics, ROI tracking',
          'Strategy Planning: Innovation roadmaps, objective setting, KPI management'
        ],
        keyFeatures: [
          'Challenge builder with templates, criteria setup, timeline management',
          'Team dashboard with roles, permissions, workload views',
          'Applicant review interface with evaluation workflows',
          'Budget and resource allocation tools',
          'Comprehensive analytics and reporting'
        ]
      }
    },
    {
      id: 'partner',
      title: 'Partner Workspace',
      description: 'Collaboration opportunity management and relationship building',
      icon: Handshake,
      color: 'bg-orange-500',
      scope: {
        purpose: 'Collaboration opportunity management and relationship building',
        primaryFunctions: [
          'Opportunity Discovery: Browse collaboration opportunities, partnership calls',
          'Proposal Management: Create partnership proposals, track applications, manage contracts',
          'Relationship Management: Partner directory, communication history, collaboration tracking',
          'Resource Sharing: Offer expertise, funding, facilities, or other resources',
          'Market Intelligence: Industry insights, competitive analysis, trend monitoring',
          'Portfolio Management: Active partnerships, ROI tracking, success metrics'
        ],
        keyFeatures: [
          'Opportunity marketplace with advanced filtering',
          'Proposal builder with templates and collaboration tools',
          'Partner relationship CRM with communication logs',
          'Resource catalog and offering management',
          'Partnership analytics and performance tracking'
        ]
      }
    },
    {
      id: 'admin',
      title: 'Admin Workspace',
      description: 'Platform governance and system optimization',
      icon: Shield,
      color: 'bg-red-500',
      scope: {
        purpose: 'Platform governance and system optimization',
        primaryFunctions: [
          'User Management: Account administration, role assignments, access control',
          'System Configuration: Platform settings, feature toggles, security policies',
          'Content Moderation: Review processes, policy enforcement, dispute resolution',
          'Analytics & Insights: Platform performance, user behavior, system health',
          'Compliance Management: Audit trails, data governance, regulatory compliance',
          'Support Operations: Help desk, issue resolution, user assistance'
        ],
        keyFeatures: [
          'User administration dashboard with bulk operations',
          'System configuration panels with role-based access',
          'Content review queues with approval workflows',
          'Comprehensive analytics with custom reporting',
          'Audit logs and compliance tracking tools'
        ]
      }
    },
    {
      id: 'team',
      title: 'Team Workspace',
      description: 'Cross-functional collaboration and project execution',
      icon: UserCheck,
      color: 'bg-indigo-500',
      scope: {
        purpose: 'Cross-functional collaboration and project execution',
        primaryFunctions: [
          'Project Management: Task tracking, milestone management, resource allocation',
          'Communication Hub: Team chat, video conferencing, discussion forums',
          'Document Collaboration: Shared files, co-editing, version control',
          'Knowledge Sharing: Best practices, lessons learned, expertise directory',
          'Resource Coordination: Equipment sharing, meeting rooms, tool access',
          'Performance Tracking: Team metrics, project progress, individual contributions'
        ],
        keyFeatures: [
          'Kanban/Gantt project management interface',
          'Integrated communication tools with threading',
          'Document management with real-time collaboration',
          'Team directory with skills and availability',
          'Resource booking and management system',
          'Team analytics and performance dashboards'
        ]
      }
    }
  ];

  const commonElements = [
    { icon: Target, title: 'Navigation', description: 'Role-specific menus, quick actions, search functionality' },
    { icon: BarChart3, title: 'Notifications', description: 'Real-time updates, deadline reminders, collaboration alerts' },
    { icon: Settings, title: 'Personalization', description: 'Customizable layouts, preferences, shortcuts' },
    { icon: Lightbulb, title: 'Integration', description: 'Seamless flow between related functions and other workspaces' },
    { icon: MessageSquare, title: 'Mobile Optimization', description: 'Responsive design for on-the-go productivity' }
  ];

  return (
    <PageLayout
      title={t('workspace.documentation.title', 'Workspace Documentation')}
      description={t('workspace.documentation.description', 'Comprehensive guide to workspace scopes and functionality')}
    >
      <div className="space-y-8">
        {/* Introduction */}
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">{t('workspace.documentation.overview.title', 'Overview')}</h2>
            <p className="text-muted-foreground">
              {t('workspace.documentation.overview.description', 
                'Workspaces are dedicated environments designed for specific user roles to efficiently accomplish their primary objectives. Each workspace provides role-specific tools, content, and workflows optimized for productivity and collaboration.'
              )}
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Dashboard vs Workspace</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><strong>Dashboard:</strong> High-level overview and monitoring ("What's happening?")</p>
                  <p><strong>Workspace:</strong> Active work environment for task execution ("Get work done")</p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Key Characteristics</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>• Role-specific tools and workflows</p>
                  <p>• Extended work sessions</p>
                  <p>• Collaboration and productivity focus</p>
                  <p>• Task-oriented interfaces</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Workspace Types */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">{t('workspace.documentation.types.title', 'Workspace Types')}</h2>
          
          <div className="grid gap-6">
            {workspaceTypes.map((workspace) => {
              const IconComponent = workspace.icon;
              return (
                <Card key={workspace.id} className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${workspace.color} text-white`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{workspace.title}</h3>
                        <p className="text-muted-foreground">{workspace.description}</p>
                      </div>
                    </div>

                    <Separator />

                    {/* Core Purpose */}
                    <div>
                      <h4 className="font-medium mb-2">Core Purpose</h4>
                      <p className="text-sm text-muted-foreground">{workspace.scope.purpose}</p>
                    </div>

                    {/* Primary Functions */}
                    <div>
                      <h4 className="font-medium mb-3">Primary Functions</h4>
                      <div className="grid md:grid-cols-2 gap-2">
                        {workspace.scope.primaryFunctions.map((func, index) => (
                          <div key={index} className="text-sm">
                            <Badge variant="outline" className="mr-2 text-xs">
                              {func.split(':')[0]}
                            </Badge>
                            <span className="text-muted-foreground">
                              {func.split(':').slice(1).join(':').trim()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Features */}
                    <div>
                      <h4 className="font-medium mb-3">Key Features</h4>
                      <div className="space-y-1">
                        {workspace.scope.keyFeatures.map((feature, index) => (
                          <p key={index} className="text-sm text-muted-foreground flex items-start">
                            <span className="text-primary mr-2">•</span>
                            {feature}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Common Elements */}
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">{t('workspace.documentation.common.title', 'Common Workspace Elements')}</h2>
            <p className="text-muted-foreground">
              {t('workspace.documentation.common.description', 
                'All workspaces share these fundamental components to ensure consistency and usability across the platform.'
              )}
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {commonElements.map((element, index) => {
                const IconComponent = element.icon;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-primary" />
                      <h3 className="font-medium">{element.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{element.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Best Practices */}
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">{t('workspace.documentation.practices.title', 'Best Practices')}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-medium text-lg text-green-600">Do</h3>
                <div className="space-y-2 text-sm">
                  <p>• Design for extended work sessions</p>
                  <p>• Prioritize frequently used functions</p>
                  <p>• Minimize context switching</p>
                  <p>• Provide clear navigation paths</p>
                  <p>• Enable collaboration features</p>
                  <p>• Optimize for mobile usage</p>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-medium text-lg text-red-600">Don't</h3>
                <div className="space-y-2 text-sm">
                  <p>• Overwhelm with too many options</p>
                  <p>• Mix different role functionalities</p>
                  <p>• Create deep navigation hierarchies</p>
                  <p>• Ignore mobile responsiveness</p>
                  <p>• Forget accessibility requirements</p>
                  <p>• Neglect performance optimization</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}