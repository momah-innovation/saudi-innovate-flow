import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ComponentShowcase } from '../components/ComponentShowcase';
import { 
  Zap, Heart, Star, ThumbsUp, Download, Upload, 
  Play, Pause, Volume2, VolumeX, Maximize2, Minimize2,
  MoreVertical, Eye, EyeOff, Copy, Check, Loader2
} from 'lucide-react';

export const InteractionsSection = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Interactions & Animations</h2>
        
        <div className="space-y-6">
          <ComponentShowcase title="Hover Effects">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Scale Effects</h4>
                <div className="flex flex-wrap gap-3">
                  <Button className="hover:scale-105 transition-transform">Scale Up</Button>
                  <Button variant="outline" className="hover:scale-95 transition-transform">Scale Down</Button>
                  <Badge className="hover:scale-110 transition-transform cursor-pointer">Hover Badge</Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Color Transitions</h4>
                <div className="space-y-2">
                  <div className="p-4 border rounded-lg hover:bg-primary/10 hover:border-primary/50 transition-all cursor-pointer">
                    Primary Hover Effect
                  </div>
                  <div className="p-4 border rounded-lg hover:bg-success/10 hover:border-success/50 transition-all cursor-pointer">
                    Success Hover Effect
                  </div>
                </div>
              </div>
            </div>
          </ComponentShowcase>

          <ComponentShowcase title="Loading States">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Spinners & Progress</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm">Loading content...</span>
                  </div>
                  <Progress value={65} className="w-full" />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Upload Progress</span>
                      <span>65%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Skeleton Loading</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse"></div>
                      <div className="h-3 bg-muted rounded w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-4/6 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </ComponentShowcase>

          <ComponentShowcase title="Interactive Controls">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Toggle States</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">Notifications</span>
                    <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">Dark Mode</span>
                    <div className="w-11 h-6 bg-muted rounded-full relative cursor-pointer">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Action Buttons</h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="hover:bg-destructive/10 hover:text-destructive">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-warning/10 hover:text-warning">
                      <Star className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-success/10 hover:text-success">
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="hover:bg-secondary hover:text-secondary-foreground">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ComponentShowcase>

          <ComponentShowcase title="Micro-interactions">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Copy to Clipboard</h4>
                <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/20">
                  <code className="flex-1 text-sm">npm install @ruwad/design-system</code>
                  <Button variant="ghost" size="sm" className="hover:bg-success/10 hover:text-success">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Media Controls</h4>
                <Card className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Innovation Podcast</p>
                      <p className="text-sm text-muted-foreground">Episode 12: Future of AI</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Volume2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Maximize2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>2:30</span>
                      <span>15:45</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1">
                      <div className="bg-primary h-1 rounded-full transition-all duration-150" style={{ width: '16%' }}></div>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Expandable Content</h4>
                <Card className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Challenge Details</h4>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This challenge focuses on developing innovative AI solutions for climate change...
                    </p>
                    <div className="flex gap-2">
                      <Badge>AI</Badge>
                      <Badge>Climate</Badge>
                      <Badge>Innovation</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </ComponentShowcase>
        </div>
      </div>
    </div>
  );
};