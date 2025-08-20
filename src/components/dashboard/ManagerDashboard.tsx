
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Target, TrendingUp, Calendar, BarChart3, CheckCircle } from "lucide-react";
import { DashboardUserProfile } from "@/hooks/useDashboardData";

export interface ManagerDashboardProps {
  userProfile: DashboardUserProfile;
  canViewAnalytics: boolean;
  canManageProjects: boolean;
}

export function ManagerDashboard({ 
  userProfile, 
  canViewAnalytics, 
  canManageProjects 
}: ManagerDashboardProps) {
  const managerMetrics = {
    teamSize: 8,
    activeProjects: 3,
    completedThisMonth: 12,
    teamPerformance: 94
  };

  return (
    <div className="space-y-6">
      {/* Manager Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{managerMetrics.teamSize}</div>
            <p className="text-xs text-muted-foreground">Active team members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{managerMetrics.activeProjects}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{managerMetrics.completedThisMonth}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{managerMetrics.teamPerformance}%</div>
            <p className="text-xs text-muted-foreground">Team average</p>
          </CardContent>
        </Card>
      </div>

      {/* Team Management Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Team Overview</CardTitle>
            <CardDescription>Current team status and assignments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Available Members</span>
              <Badge variant="outline">5</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">On Assignment</span>
              <Badge variant="secondary">3</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">In Training</span>
              <Badge variant="outline">2</Badge>
            </div>
            {canManageProjects && (
              <Button className="w-full mt-4">
                <Users className="mr-2 h-4 w-4" />
                Manage Team
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Pipeline</CardTitle>
            <CardDescription>Upcoming and active projects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Innovation Challenge Q1</span>
                <Badge>Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Digital Transformation</span>
                <Badge variant="outline">Planning</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">AI Integration Project</span>
                <Badge variant="secondary">Review</Badge>
              </div>
            </div>
            {canManageProjects && (
              <Button className="w-full mt-4">
                <Target className="mr-2 h-4 w-4" />
                View All Projects
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      {canViewAnalytics && (
        <Card>
          <CardHeader>
            <CardTitle>Team Analytics</CardTitle>
            <CardDescription>Performance metrics and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">94%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">8.5</div>
                <div className="text-sm text-muted-foreground">Avg Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">15</div>
                <div className="text-sm text-muted-foreground">Projects Completed</div>
              </div>
            </div>
            <Button className="w-full mt-4">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Detailed Analytics
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
