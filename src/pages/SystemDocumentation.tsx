import { AppLayout } from "@/components/layout/AppLayout";
import { PageContainer, PageHeader, Section, ContentArea } from "@/components/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Target, 
  Users, 
  Lightbulb, 
  FileText, 
  UserCheck, 
  Calendar,
  Building2,
  Network,
  ArrowRight,
  GitBranch,
  Workflow,
  Database
} from "lucide-react";

export default function SystemDocumentationPage() {
  const breadcrumbs = [
    { label: "Admin", href: "/admin" },
    { label: "Documentation", href: "/admin/system-documentation" }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <PageContainer maxWidth="full" padding="lg">
        <PageHeader 
          title="System Documentation" 
          description="Comprehensive guide to entity relationships and system architecture" 
        />
        <Section>
          <ContentArea>
            <div className="space-y-8">{/* Content from original file below */}

              {/* Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    System Overview
                  </CardTitle>
                  <CardDescription>
                    The Innovation Management System is built around interconnected entities that work together to facilitate the complete innovation lifecycle.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <Building2 className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold">Organizational Foundation</h3>
                      <p className="text-sm text-muted-foreground">Sectors, Structure, and Ownership</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <Workflow className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold">Innovation Process</h3>
                      <p className="text-sm text-muted-foreground">Challenges, Ideas, and Evaluations</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <Network className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold">Engagement Network</h3>
                      <p className="text-sm text-muted-foreground">Campaigns, Events, and Collaboration</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Core Workflow */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="h-5 w-5" />
                    Core Innovation Workflow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center space-x-2 text-sm bg-muted/30 p-4 rounded-lg">
                    <Badge variant="outline">Sectors</Badge>
                    <ArrowRight className="h-4 w-4" />
                    <Badge variant="outline">Organization</Badge>
                    <ArrowRight className="h-4 w-4" />
                    <Badge variant="outline">Challenges</Badge>
                    <ArrowRight className="h-4 w-4" />
                    <Badge variant="outline">Focus Questions</Badge>
                    <ArrowRight className="h-4 w-4" />
                    <Badge variant="outline">Ideas</Badge>
                    <ArrowRight className="h-4 w-4" />
                    <Badge variant="outline">Evaluations</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Entity Relationships */}
              <div className="grid lg:grid-cols-2 gap-6">
                
                {/* Organizational Foundation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Organizational Foundation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div>
                          <strong>Sectors</strong> define high-level government areas
                          <p className="text-sm text-muted-foreground">Health, Education, Transportation, etc.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 ml-4">
                        <ArrowRight className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          <strong>Deputies</strong> manage sector operations
                        </div>
                      </div>
                      <div className="flex items-start gap-3 ml-8">
                        <ArrowRight className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          <strong>Departments</strong> handle specific functions
                        </div>
                      </div>
                      <div className="flex items-start gap-3 ml-12">
                        <ArrowRight className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          <strong>Domains & Sub-domains</strong> specialized areas
                        </div>
                      </div>
                      <div className="flex items-start gap-3 ml-16">
                        <ArrowRight className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          <strong>Services</strong> citizen-facing functions
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Challenge-Driven Innovation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Challenge-Driven Innovation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div>
                          <strong>Challenges</strong> define broad innovation problems
                          <p className="text-sm text-muted-foreground">Linked to organizational structure for ownership</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 ml-4">
                        <ArrowRight className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          <strong>Focus Questions</strong> break challenges into specific questions
                          <p className="text-sm text-muted-foreground">One challenge → Many focus questions</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 ml-8">
                        <ArrowRight className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          <strong>Ideas</strong> submitted in response to questions
                          <p className="text-sm text-muted-foreground">Many ideas per focus question</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Assessment & Evaluation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5" />
                      Assessment & Evaluation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div>
                          <strong>Ideas</strong> submitted by innovators
                          <p className="text-sm text-muted-foreground">Linked to user profiles</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 ml-4">
                        <ArrowRight className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          <strong>Evaluations</strong> assess ideas with scores
                          <p className="text-sm text-muted-foreground">One idea → Multiple evaluations</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 ml-8">
                        <ArrowRight className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          <strong>Experts</strong> conduct evaluations
                          <p className="text-sm text-muted-foreground">Assigned based on expertise areas</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Outreach & Engagement */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Outreach & Engagement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-3">
                       <div className="flex items-start gap-3">
                         <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                         <div>
                           <strong>Campaigns</strong> promote innovation initiatives
                           <p className="text-sm text-muted-foreground">Connected to challenges, organizational structure, and partners</p>
                         </div>
                       </div>
                       <div className="flex items-start gap-3 ml-4">
                         <ArrowRight className="h-4 w-4 mt-1 text-muted-foreground" />
                         <div>
                           <strong>Events</strong> activities within campaigns
                           <p className="text-sm text-muted-foreground">Linked to challenges, focus questions, and stakeholders</p>
                         </div>
                       </div>
                       <div className="flex items-start gap-3 ml-8">
                         <ArrowRight className="h-4 w-4 mt-1 text-muted-foreground" />
                         <div>
                           <strong>Stakeholders</strong> participate in events
                           <p className="text-sm text-muted-foreground">Many-to-many through event stakeholder targeting</p>
                         </div>
                       </div>
                       <div className="flex items-start gap-3 ml-8">
                         <ArrowRight className="h-4 w-4 mt-1 text-muted-foreground" />
                         <div>
                           <strong>Partners</strong> collaborate in campaigns
                           <p className="text-sm text-muted-foreground">Support campaigns and co-host events</p>
                         </div>
                       </div>
                     </div>
                  </CardContent>
                </Card>
              </div>

              {/* Expert Assignment System */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Expert Assignment System
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Experts</h4>
                      <p className="text-sm text-muted-foreground">
                        Professionals with specific expertise areas who evaluate ideas and provide guidance.
                      </p>
                      <Badge variant="secondary">Many-to-Many</Badge>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Challenges</h4>
                      <p className="text-sm text-muted-foreground">
                        Experts are assigned to challenges based on matching expertise requirements.
                      </p>
                      <Badge variant="secondary">Assignment Tracking</Badge>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Innovation Teams</h4>
                      <p className="text-sm text-muted-foreground">
                        Internal teams that manage the overall innovation process and expert assignments.
                      </p>
                      <Badge variant="secondary">Process Management</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Partnership Network */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    Partnership & Collaboration Network
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Partners ↔ Challenges</h4>
                        <p className="text-sm text-muted-foreground">
                          External organizations collaborate on specific challenges, providing resources, expertise, or funding.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Partners ↔ Campaigns</h4>
                        <p className="text-sm text-muted-foreground">
                          Partners can sponsor campaigns or co-host events to increase reach and impact.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Relationship Management System */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    Relationship Management System
                  </CardTitle>
                  <CardDescription>
                    Comprehensive system for managing many-to-many relationships between entities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Junction Tables</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• campaign_partner_links</li>
                          <li>• campaign_stakeholder_links</li>
                          <li>• event_partner_links</li>
                          <li>• event_stakeholder_links</li>
                          <li>• event_focus_question_links</li>
                          <li>• challenge_experts</li>
                          <li>• challenge_partners</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Management Features</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Visual relationship overview dashboard</li>
                          <li>• Real-time connection counters</li>
                          <li>• Enhanced management forms</li>
                          <li>• Relationship analytics</li>
                          <li>• Transaction-safe helper functions</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h5 className="font-semibold mb-2">Relationship Overview Dashboard</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        The <code>/admin/relationships</code> page provides:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Entity browser with connection previews</li>
                        <li>• Real-time statistics and analytics</li>
                        <li>• Search and filtering capabilities</li>
                        <li>• Detailed relationship viewer</li>
                        <li>• Network visualization (planned)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Workflows */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Workflow className="h-5 w-5" />
                    Key System Workflows
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    
                    <div>
                      <h4 className="font-semibold mb-3">Innovation Submission Flow</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">1</span>
                          <span>Organization identifies a problem area</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">2</span>
                          <span>Challenge is created and assigned to experts</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">3</span>
                          <span>Focus Questions are defined to guide solutions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">4</span>
                          <span>Campaign promotes the challenge publicly</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">5</span>
                          <span>Events are held to engage participants</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">6</span>
                          <span>Ideas are submitted by innovators</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">7</span>
                          <span>Experts evaluate ideas</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">8</span>
                          <span>Stakeholders review results</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-3">Expert Assignment Flow</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xs">1</span>
                          <span>Innovation Team identifies challenge requirements</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xs">2</span>
                          <span>Experts are matched based on expertise areas</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xs">3</span>
                          <span>Challenge-Expert assignments are created</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xs">4</span>
                          <span>Evaluations are conducted by assigned experts</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xs">5</span>
                          <span>Partners may provide additional expertise</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                     <div>
                       <h4 className="font-semibold mb-3">Campaign-Event Flow</h4>
                       <div className="space-y-2 text-sm">
                         <div className="flex items-center gap-2">
                           <span className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs">1</span>
                           <span>Campaign is created with organizational context (sector, department)</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs">2</span>
                           <span>Campaign is linked to specific challenges and partners</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs">3</span>
                           <span>Events are planned within the campaign framework</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs">4</span>
                           <span>Events target specific stakeholder groups and focus questions</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs">5</span>
                           <span>Partners may sponsor campaigns or co-host events</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs">6</span>
                           <span>Event attendance and outcomes are tracked</span>
                         </div>
                       </div>
                     </div>
                  </div>
                </CardContent>
              </Card>

              {/* Entity Summary Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Entity Roles Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-semibold">Entity</th>
                          <th className="text-left p-2 font-semibold">Primary Role</th>
                          <th className="text-left p-2 font-semibold">Key Relationships</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr>
                          <td className="p-2 font-medium">Sectors</td>
                          <td className="p-2">Organizational hierarchy</td>
                          <td className="p-2">→ Deputies, Challenges</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-medium">Organization</td>
                          <td className="p-2">Structure & ownership</td>
                          <td className="p-2">→ Challenges, Users</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-medium">Challenges</td>
                          <td className="p-2">Problem definition</td>
                          <td className="p-2">→ Focus Questions, Experts, Partners</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-medium">Focus Questions</td>
                          <td className="p-2">Specific guidance</td>
                          <td className="p-2">→ Ideas</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-medium">Ideas</td>
                          <td className="p-2">Solution proposals</td>
                          <td className="p-2">→ Evaluations</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-medium">Evaluations</td>
                          <td className="p-2">Assessment & scoring</td>
                          <td className="p-2">→ Experts, Ideas</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-medium">Experts</td>
                          <td className="p-2">Knowledge providers</td>
                          <td className="p-2">→ Evaluations, Challenges</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-medium">Innovation Teams</td>
                          <td className="p-2">Process management</td>
                          <td className="p-2">→ All entities</td>
                        </tr>
                         <tr>
                           <td className="p-2 font-medium">Campaigns</td>
                           <td className="p-2">Marketing & outreach</td>
                           <td className="p-2">→ Events, Challenges, Sectors, Partners</td>
                         </tr>
                         <tr>
                           <td className="p-2 font-medium">Events</td>
                           <td className="p-2">Engagement activities</td>
                           <td className="p-2">→ Campaigns, Challenges, Stakeholders, Focus Questions</td>
                         </tr>
                         <tr>
                           <td className="p-2 font-medium">Campaign Partners</td>
                           <td className="p-2">Campaign collaboration</td>
                           <td className="p-2">→ Campaigns, Partners</td>
                         </tr>
                         <tr>
                           <td className="p-2 font-medium">Event Stakeholders</td>
                           <td className="p-2">Event targeting</td>
                           <td className="p-2">→ Events, Stakeholders</td>
                         </tr>
                         <tr>
                           <td className="p-2 font-medium">Stakeholders</td>
                           <td className="p-2">External participants</td>
                           <td className="p-2">→ Events (through targeting)</td>
                         </tr>
                         <tr>
                           <td className="p-2 font-medium">Partners</td>
                           <td className="p-2">Collaboration entities</td>
                           <td className="p-2">→ Challenges, Campaigns (through partnerships)</td>
                         </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Footer */}
              <div className="text-center text-sm text-muted-foreground pt-8">
                <p>This documentation provides a comprehensive overview of the Innovation Management System architecture.</p>
                <p className="mt-2">For technical support or questions, contact the system administrators.</p>
              </div>

            </div>
          </ContentArea>
        </Section>
      </PageContainer>
    </AppLayout>
  );
}