import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, AlertCircle, AlertTriangle, Info, 
  Star, Award, Users, Target, Clock 
} from 'lucide-react';

export const TokensSection: React.FC = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-6">Design Tokens & Semantic Utilities</h2>
      
      {/* Icon Utilities */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Icon Utilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Status Icons</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 icon-success" />
                <code>icon-success</code>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 icon-warning" />
                <code>icon-warning</code>
              </div>
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 icon-error" />
                <code>icon-error</code>
              </div>
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 icon-info" />
                <code>icon-info</code>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Special Icons</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 icon-sparkle" />
                <code>icon-sparkle</code>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 icon-star" />
                <code>icon-star</code>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 icon-confidential" />
                <code>icon-confidential</code>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 icon-sensitive" />
                <code>icon-sensitive</code>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Badge Utilities */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Badge Utilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Status Badges</h4>
            <div className="flex flex-wrap gap-2">
              <Badge className="badge-success">Success</Badge>
              <Badge className="badge-warning">Warning</Badge>
              <Badge className="badge-error">Error</Badge>
              <Badge className="badge-info">Info</Badge>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Role-based Badges</h4>
            <div className="flex flex-wrap gap-2">
              <Badge className="badge-innovation">Innovation</Badge>
              <Badge className="badge-expert">Expert</Badge>
              <Badge className="badge-partner">Partner</Badge>
              <Badge className="badge-innovator">Innovator</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Hero Stats */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Hero Dashboard Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <Target className="w-8 h-8 mx-auto mb-2 hero-stats-ideas" />
            <div className="text-2xl font-bold hero-stats-ideas">1,234</div>
            <div className="text-sm text-muted-foreground">Ideas</div>
            <code className="text-xs">hero-stats-ideas</code>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 hero-stats-challenges" />
            <div className="text-2xl font-bold hero-stats-challenges">56</div>
            <div className="text-sm text-muted-foreground">Challenges</div>
            <code className="text-xs">hero-stats-challenges</code>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <Users className="w-8 h-8 mx-auto mb-2 hero-stats-users" />
            <div className="text-2xl font-bold hero-stats-users">892</div>
            <div className="text-sm text-muted-foreground">Users</div>
            <code className="text-xs">hero-stats-users</code>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <Award className="w-8 h-8 mx-auto mb-2 hero-stats-score" />
            <div className="text-2xl font-bold hero-stats-score">8.9</div>
            <div className="text-sm text-muted-foreground">Score</div>
            <code className="text-xs">hero-stats-score</code>
          </div>
        </div>
      </Card>

      {/* Workload Indicators */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Workload Indicators</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span>Normal Workload</span>
            <span className="workload-text-normal font-medium">45%</span>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span>High Workload</span>
            <span className="workload-text-high font-medium">78%</span>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span>Critical Workload</span>
            <span className="workload-text-critical font-medium">95%</span>
          </div>
        </div>
      </Card>

      {/* Team Member Status */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Team Member Status</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full indicator-online"></div>
            <span>Online</span>
            <code className="text-xs">indicator-online</code>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full indicator-busy"></div>
            <span>Busy</span>
            <code className="text-xs">indicator-busy</code>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full indicator-away"></div>
            <span>Away</span>
            <code className="text-xs">indicator-away</code>
          </div>
        </div>
      </Card>

      {/* Section Utilities */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Content Section Utilities</h3>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h5 className="font-medium section-strengths mb-2">Strengths</h5>
            <p className="text-sm text-muted-foreground">Uses section-strengths class</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h5 className="font-medium section-weaknesses mb-2">Areas for Improvement</h5>
            <p className="text-sm text-muted-foreground">Uses section-weaknesses class</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h5 className="font-medium section-recommendations mb-2">Recommendations</h5>
            <p className="text-sm text-muted-foreground">Uses section-recommendations class</p>
          </div>
        </div>
      </Card>
    </div>
  );
};