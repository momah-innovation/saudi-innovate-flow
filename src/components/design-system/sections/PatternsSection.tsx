import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, Users, Clock, CheckCircle, AlertTriangle,
  Star, Award, Target, TrendingUp, BarChart3
} from 'lucide-react';

export const PatternsSection: React.FC = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-6">Design Patterns & Layouts</h2>
      
      {/* Card Patterns */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Card Patterns</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stats Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Ideas</p>
                <p className="text-3xl font-bold hero-stats-ideas">1,234</p>
                <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
              </div>
              <Target className="h-8 w-8 hero-stats-ideas" />
            </div>
          </Card>

          {/* Status Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Project Status</h4>
              <Badge className="badge-success">Active</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>75%</span>
              </div>
              <Progress value={75} className="progress-normal" />
            </div>
          </Card>

          {/* Activity Card */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-5 h-5 icon-success" />
              <div>
                <h5 className="font-medium">Task Completed</h5>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <Badge className="activity-completion">Completion</Badge>
          </Card>
        </div>
      </div>

      {/* List Patterns */}
      <div>
        <h3 className="text-xl font-semibold mb-4">List Patterns</h3>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full indicator-online"></div>
                <span>Ahmed Al-Rashid</span>
                <Badge className="badge-expert">Expert</Badge>
              </div>
              <div className="text-sm text-muted-foreground">Online</div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full indicator-busy"></div>
                <span>Sarah Johnson</span>
                <Badge className="badge-partner">Partner</Badge>
              </div>
              <div className="text-sm text-muted-foreground">Busy</div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full indicator-away"></div>
                <span>Mohammed Bin Khalid</span>
                <Badge className="badge-innovator">Innovator</Badge>
              </div>
              <div className="text-sm text-muted-foreground">Away</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Header Patterns */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Header & Navigation Patterns</h3>
        <div className="space-y-4">
          {/* Page Header */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">Innovation Dashboard</h2>
                <p className="text-muted-foreground">Manage and track innovation initiatives</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Export</Button>
                <Button>New Initiative</Button>
              </div>
            </div>
            <div className="flex gap-4">
              <Badge className="badge-info">12 Active</Badge>
              <Badge className="badge-success">8 Completed</Badge>
              <Badge className="badge-warning">3 Pending</Badge>
            </div>
          </Card>

          {/* Sub Navigation */}
          <Card className="p-4">
            <div className="flex items-center gap-6">
              <button className="text-sm font-medium text-primary border-b-2 border-primary pb-2">
                Overview
              </button>
              <button className="text-sm text-muted-foreground hover:text-foreground pb-2">
                Analytics
              </button>
              <button className="text-sm text-muted-foreground hover:text-foreground pb-2">
                Projects
              </button>
              <button className="text-sm text-muted-foreground hover:text-foreground pb-2">
                Reports
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Dashboard Widgets */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Dashboard Widget Patterns</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart Widget */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Performance Overview</h4>
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Ideas Submitted</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-muted rounded-full">
                    <div className="w-12 h-2 bg-primary rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">75%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Challenges Active</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-muted rounded-full">
                    <div className="w-10 h-2 bg-success rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">60%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">User Engagement</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-muted rounded-full">
                    <div className="w-14 h-2 bg-warning rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">90%</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions Widget */}
          <Card className="p-6">
            <h4 className="font-semibold mb-4">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto p-4 flex-col">
                <Calendar className="w-6 h-6 mb-2" />
                <span className="text-sm">Schedule Event</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col">
                <Users className="w-6 h-6 mb-2" />
                <span className="text-sm">Invite Experts</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col">
                <Star className="w-6 h-6 mb-2" />
                <span className="text-sm">Create Challenge</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col">
                <TrendingUp className="w-6 h-6 mb-2" />
                <span className="text-sm">View Analytics</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Form Patterns */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Form Patterns</h3>
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Multi-step Form Example</h4>
          <div className="flex items-center mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full step-completed flex items-center justify-center text-sm font-medium">1</div>
              <div className="w-12 h-0.5 bg-success"></div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">2</div>
              <div className="w-12 h-0.5 bg-muted"></div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full step-pending flex items-center justify-center text-sm font-medium">3</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Step indicators using step-completed, step-pending utilities
          </div>
        </Card>
      </div>
    </div>
  );
};