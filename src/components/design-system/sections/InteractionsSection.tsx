import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, AlertTriangle, Star, Heart, 
  Sparkles, Zap, RotateCcw, Play
} from 'lucide-react';

export const InteractionsSection: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [likedItems, setLikedItems] = useState<number[]>([]);

  const toggleAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
  };

  const toggleLike = (id: number) => {
    setLikedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-6">Interactions, States & Animations</h2>
      
      {/* Hover States */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Hover Effects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium">Scale Effects</h4>
            <Button className="hover:scale-105 transition-transform">
              Hover to Scale
            </Button>
            <div className="p-4 border rounded-lg hover:scale-102 transition-transform cursor-pointer">
              Card with subtle scale
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium">Color Transitions</h4>
            <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
              Background Color Change
            </div>
            <div className="p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer">
              Border Color Change
            </div>
          </div>
        </div>
      </Card>

      {/* Focus States */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Focus States</h3>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" tabIndex={0}>
            Focusable Element with Ring
          </div>
          <div className="p-4 border rounded-lg focus:bg-accent/30 focus:outline-none transition-all" tabIndex={0}>
            Focusable Element with Background
          </div>
          <Button variant="outline" className="focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            Button with Focus Ring
          </Button>
        </div>
      </Card>

      {/* Loading States */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Loading States</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium">Progress Indicators</h4>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Loading...</span>
                <span>67%</span>
              </div>
              <Progress value={67} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Processing</span>
                <span>100%</span>
              </div>
              <Progress value={100} className="progress-normal" />
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium">Button States</h4>
            <Button disabled>
              <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
              Loading...
            </Button>
            <Button variant="outline" disabled>
              Processing...
            </Button>
          </div>
        </div>
      </Card>

      {/* Animations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Animations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium">Built-in Animations</h4>
            <div className="flex gap-2">
              <Button onClick={toggleAnimation}>
                <Play className="w-4 h-4 mr-2" />
                Trigger Animation
              </Button>
            </div>
            <div className={`p-4 border rounded-lg transition-all duration-500 ${
              isAnimating ? 'animate-fade-in scale-105' : ''
            }`}>
              <div className="flex items-center gap-2">
                <Sparkles className={`w-5 h-5 icon-sparkle ${isAnimating ? 'animate-pulse' : ''}`} />
                <span>Animated Content</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium">Pulse Effects</h4>
            <Badge className="badge-success animate-pulse">
              <CheckCircle className="w-3 h-3 mr-1" />
              Live Status
            </Badge>
            <div className="p-4 border rounded-lg animate-pulse-glow">
              <Zap className="w-5 h-5 mx-auto" />
            </div>
          </div>
        </div>
      </Card>

      {/* Interactive Components */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Interactive Components</h3>
        <div className="space-y-6">
          {/* Like/Unlike */}
          <div>
            <h4 className="font-medium mb-3">Like Interactions</h4>
            <div className="flex gap-4">
              {[1, 2, 3].map(id => (
                <Button
                  key={id}
                  variant="outline"
                  size="sm"
                  onClick={() => toggleLike(id)}
                  className={`transition-colors ${
                    likedItems.includes(id) ? 'text-destructive border-destructive' : ''
                  }`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${
                    likedItems.includes(id) ? 'fill-current' : ''
                  }`} />
                  {likedItems.includes(id) ? 'Liked' : 'Like'}
                </Button>
              ))}
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <h4 className="font-medium mb-3">Star Rating</h4>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`w-5 h-5 cursor-pointer transition-colors ${
                    star <= 3 ? 'star-filled' : 'star-empty'
                  } star-interactive`}
                />
              ))}
            </div>
          </div>

          {/* Status Changes */}
          <div>
            <h4 className="font-medium mb-3">Dynamic Status</h4>
            <div className="flex gap-2">
              <Badge className="event-scheduled transition-all">Scheduled</Badge>
              <Badge className="event-ongoing transition-all">Ongoing</Badge>
              <Badge className="event-completed transition-all">Completed</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Micro-interactions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Micro-interactions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium">Button Feedback</h4>
            <Button className="active:scale-95 transition-transform">
              Press Me
            </Button>
            <Button variant="outline" className="hover:shadow-lg transition-shadow">
              Hover Shadow
            </Button>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium">Visual Feedback</h4>
            <div className="p-4 border rounded-lg hover:border-primary transition-all cursor-pointer group">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 icon-success group-hover:scale-110 transition-transform" />
                <span>Hover for icon animation</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Performance States */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Performance & Status States</h3>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span>System Performance</span>
              <Badge className="badge-success">Excellent</Badge>
            </div>
            <Progress value={92} className="progress-normal" />
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span>High Load Warning</span>
              <Badge className="badge-warning">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Warning
              </Badge>
            </div>
            <Progress value={85} className="progress-high" />
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span>Critical State</span>
              <Badge className="badge-error">Critical</Badge>
            </div>
            <Progress value={95} className="progress-critical" />
          </div>
        </div>
      </Card>
    </div>
  );
};