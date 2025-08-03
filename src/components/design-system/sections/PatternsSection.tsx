import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ComponentShowcase } from '../components/ComponentShowcase';
import { 
  Calendar, Users, Target, Star, Clock, TrendingUp,
  Award, CheckCircle, Upload, Download, Search,
  Filter, Plus, Menu, Home, ChevronRight, Edit, Share
} from 'lucide-react';

export const PatternsSection = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Design Patterns & Layouts</h2>
        
        <div className="space-y-6">
          <ComponentShowcase title="Dashboard Cards">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-semibold">Active Challenges</h3>
                  </div>
                  <Badge variant="secondary">+12%</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">24</div>
                <p className="text-sm text-muted-foreground">Across all categories</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-success" />
                    </div>
                    <h3 className="font-semibold">Total Participants</h3>
                  </div>
                  <Badge className="bg-success/90 text-success-foreground">Live</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">1,247</div>
                <p className="text-sm text-muted-foreground">Active this month</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                      <Award className="w-4 h-4 text-warning" />
                    </div>
                    <h3 className="font-semibold">Prize Pool</h3>
                  </div>
                  <Badge className="bg-warning/90 text-warning-foreground">Hot</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">$125K</div>
                <p className="text-sm text-muted-foreground">Total available</p>
              </Card>
            </div>
          </ComponentShowcase>

          <ComponentShowcase title="List & Grid Patterns">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-4">Challenge List</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">AI Climate Solutions</h4>
                      <p className="text-sm text-muted-foreground">Environmental technology challenge</p>
                    </div>
                    <Badge className="bg-success/90 text-success-foreground">Active</Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="w-10 h-10 bg-innovation/10 rounded-lg flex items-center justify-center">
                      <Star className="w-5 h-5 text-innovation" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Smart City Infrastructure</h4>
                      <p className="text-sm text-muted-foreground">Urban planning innovation</p>
                    </div>
                    <Badge className="bg-warning/90 text-warning-foreground">Closing Soon</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Team Members</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                      JD
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">John Doe</p>
                      <p className="text-xs text-muted-foreground">Lead Developer</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground text-sm font-medium">
                      SM
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">Sarah Miller</p>
                      <p className="text-xs text-muted-foreground">Designer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ComponentShowcase>

          <ComponentShowcase title="Content Layouts">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Article Preview</h4>
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📝</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">The Future of Innovation Challenges</h3>
                      <p className="text-muted-foreground mb-3">
                        Explore how technology challenges are shaping the next generation of breakthrough solutions...
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Dec 15, 2024</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>5 min read</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div>
                <h4 className="font-medium mb-4">Feature Grid</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">Performance Analytics</h4>
                    <p className="text-sm text-muted-foreground">Track your challenge performance and success metrics</p>
                  </Card>
                  
                  <Card className="p-4 text-center">
                    <div className="w-12 h-12 bg-innovation/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-innovation" />
                    </div>
                    <h4 className="font-semibold mb-2">Team Collaboration</h4>
                    <p className="text-sm text-muted-foreground">Work together with experts from around the world</p>
                  </Card>
                  
                  <Card className="p-4 text-center">
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Award className="w-6 h-6 text-success" />
                    </div>
                    <h4 className="font-semibold mb-2">Recognition System</h4>
                    <p className="text-sm text-muted-foreground">Earn badges and climb the innovation leaderboard</p>
                  </Card>
                </div>
              </div>
            </div>
          </ComponentShowcase>
        </div>
      </div>
    </div>
  );
};