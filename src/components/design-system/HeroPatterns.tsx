import React from 'react';
import { 
  Sparkles, Target, Award, Calendar, ExternalLink, Play, ArrowRight, 
  Zap, Users, CheckCircle, Gift, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ComponentShowcaseProps {
  title: string;
  children: React.ReactNode;
}

const ComponentShowcase: React.FC<ComponentShowcaseProps> = ({ title, children }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">{title}</h3>
    <div className="border rounded-lg p-6 bg-muted/50">
      {children}
    </div>
  </div>
);

export const HeroPatterns = () => {
  return (
    <ComponentShowcase title="Hero Section Size Variants">
      <div className="space-y-8">
        
        {/* Theme Selector */}
        <div className="flex items-center gap-4 p-4 border rounded-lg bg-background">
          <span className="text-sm font-medium">Hero Theme:</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="text-xs">Primary</Button>
            <Button size="sm" variant="outline" className="text-xs">Innovation</Button>
            <Button size="sm" variant="outline" className="text-xs">Expert</Button>
          </div>
        </div>

        {/* Compact Hero */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Compact Hero</h4>
          <div className="border rounded-lg overflow-hidden">
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6">
              <div className="max-w-4xl mx-auto text-center text-white">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="p-2 bg-white/10 backdrop-blur-sm rounded-full">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">Featured</Badge>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-3">
                  Innovation Made <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Simple</span>
                </h1>
                <p className="text-sm text-blue-100 mb-4 max-w-xl mx-auto">Quick access to challenges and opportunities</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
                  <Button size="sm" className="bg-white text-primary hover:bg-white/90">
                    Get Started <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    <Play className="w-4 h-4 mr-1" /> Demo
                  </Button>
                </div>
                <div className="flex justify-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-blue-300">5K+</div>
                    <div className="text-xs text-blue-200">Users</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-green-300">200+</div>
                    <div className="text-xs text-green-200">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-purple-300">98%</div>
                    <div className="text-xs text-purple-200">Success</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Default Hero */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Default Hero</h4>
          <div className="border rounded-lg overflow-hidden">
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8">
              <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">Latest</Badge>
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                    Shape the <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Future</span>
                  </h1>
                  <p className="text-lg text-blue-100 mb-6">Join innovators solving real-world challenges.</p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-300" />
                        <div>
                          <div className="font-bold text-blue-300">10K+</div>
                          <div className="text-xs text-blue-200">Challenges</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-green-300" />
                        <div>
                          <div className="font-bold text-green-300">$2M+</div>
                          <div className="text-xs text-green-200">Rewards</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="bg-white text-primary hover:bg-white/90">
                      Start Journey <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                      <Play className="w-4 h-4 mr-2" /> Watch Demo
                    </Button>
                  </div>
                </div>
                <div>
                  <Card className="overflow-hidden border border-white/20 bg-white/10 backdrop-blur-sm">
                    <div className="aspect-video bg-gradient-to-br from-orange-500/80 to-red-600/80 relative">
                      <div className="absolute bottom-3 left-3 text-white">
                        <div className="flex items-center gap-1 text-xs mb-1">
                          <Calendar className="h-3 w-3" />
                          <span>Ends March 30</span>
                        </div>
                        <h3 className="font-semibold text-sm">AI for Climate</h3>
                        <p className="text-xs opacity-90">$50K prize</p>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-red-500/20 text-white text-xs">🔥 Hot</Badge>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs text-white/70">1.2k participants</div>
                        <Button size="sm" variant="outline" className="border-white/30 text-white text-xs px-2 py-1 h-auto">Join</Button>
                      </div>
                      <Progress value={68} className="h-1.5 bg-white/20" />
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Large Hero */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Large/Full Hero</h4>
          <div className="border rounded-lg overflow-hidden">
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-12">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" />
              </div>
              <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="text-white">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full ring-4 ring-white/20">
                        <Sparkles className="w-12 h-12 animate-pulse" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping" />
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">🎯 Latest</Badge>
                  </div>
                  <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                    Shape the <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Future</span>
                  </h1>
                  <p className="text-xl text-blue-100 mb-8">Join thousands of innovators solving real challenges.</p>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:scale-105 transition-transform cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/30 rounded-lg">
                          <Target className="w-5 h-5 text-blue-300" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-300">10K+</div>
                          <div className="text-xs text-blue-200">Challenges</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:scale-105 transition-transform cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/30 rounded-lg">
                          <Award className="w-5 h-5 text-green-300" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-300">$2M+</div>
                          <div className="text-xs text-green-200">Rewards</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="px-8 bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all">
                      Start Journey <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button size="lg" variant="outline" className="px-8 border-white/30 text-white hover:bg-white/10">
                      <Play className="w-4 h-4 mr-2" /> Watch Demo
                    </Button>
                  </div>
                </div>
                <div className="space-y-6">
                  <Card className="overflow-hidden border border-white/20 bg-white/10 backdrop-blur-sm hover:scale-105 transition-transform">
                    <div className="aspect-video bg-gradient-to-br from-orange-500/80 to-red-600/80 relative">
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="flex items-center gap-2 text-sm mb-2">
                          <Calendar className="h-4 w-4" />
                          <span>Ends March 30, 2024</span>
                        </div>
                        <h3 className="font-semibold text-lg mb-1">AI for Climate Action</h3>
                        <p className="text-sm opacity-90">$50K prize • Global impact</p>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-red-500/20 text-white border-red-300/30">🔥 Trending</Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm text-white/70">1.2k participants • Global</div>
                        <Button size="sm" variant="outline" className="border-white/30 text-white">
                          <ExternalLink className="h-4 w-4 mr-1" /> Join
                        </Button>
                      </div>
                      <Progress value={68} className="h-2 bg-white/20" />
                    </div>
                  </Card>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 hover:scale-105 transition-transform cursor-pointer border-white/20 bg-white/10 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/30 flex items-center justify-center">
                          <Zap className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-white">Trending</p>
                          <p className="text-xs text-white/70">Hot challenges</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 hover:scale-105 transition-transform cursor-pointer border-white/20 bg-white/10 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-500/30 flex items-center justify-center">
                          <Award className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-white">Leaderboard</p>
                          <p className="text-xs text-white/70">Top innovators</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-colored Theme Examples */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Multi-colored Text & Icon Examples</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Innovation Theme */}
            <div className="border rounded-lg p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                </div>
                <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">Innovation</Badge>
              </div>
              <h3 className="text-lg font-bold mb-2">
                Innovation <span className="hero-text-innovation">Hub</span>
              </h3>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4 text-orange-500" />
                  <span className="font-medium text-orange-600">5K+ Projects</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-red-500" />
                  <span className="font-medium text-red-600">$2M Funded</span>
                </div>
              </div>
            </div>

            {/* Expert Theme */}
            <div className="border rounded-lg p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Users className="w-5 h-5 text-green-500" />
                </div>
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Expert</Badge>
              </div>
              <h3 className="text-lg font-bold mb-2">
                Expert <span className="hero-text-expert">Network</span>
              </h3>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-green-500" />
                  <span className="font-medium text-green-600">2K+ Experts</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium text-emerald-600">98% Rating</span>
                </div>
              </div>
            </div>

            {/* Partner Theme */}
            <div className="border rounded-lg p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Award className="w-5 h-5 text-blue-500" />
                </div>
                <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Partner</Badge>
              </div>
              <h3 className="text-lg font-bold mb-2">
                Partner <span className="hero-text-partner">Portal</span>
              </h3>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-blue-600">500+ Partners</span>
                </div>
                <div className="flex items-center gap-1">
                  <Gift className="w-4 h-4 text-purple-500" />
                  <span className="font-medium text-purple-600">100+ Deals</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ComponentShowcase>
  );
};