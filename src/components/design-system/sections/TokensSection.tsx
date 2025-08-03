import React from 'react';
import { Card } from '@/components/ui/card';
import { ComponentShowcase } from '../components/ComponentShowcase';

export const TokensSection = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Design Tokens & System</h2>
        
        <div className="space-y-6">
          <ComponentShowcase title="Spacing Scale">
            <div className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Extra Small</p>
                  <div className="h-2 bg-primary rounded" style={{ width: '8px' }}></div>
                  <code className="text-xs bg-muted px-2 py-1 rounded">2px (0.5)</code>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Small</p>
                  <div className="h-2 bg-primary rounded" style={{ width: '16px' }}></div>
                  <code className="text-xs bg-muted px-2 py-1 rounded">4px (1)</code>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Medium</p>
                  <div className="h-2 bg-primary rounded" style={{ width: '32px' }}></div>
                  <code className="text-xs bg-muted px-2 py-1 rounded">8px (2)</code>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Large</p>
                  <div className="h-2 bg-primary rounded" style={{ width: '64px' }}></div>
                  <code className="text-xs bg-muted px-2 py-1 rounded">16px (4)</code>
                </div>
              </div>
            </div>
          </ComponentShowcase>

          <ComponentShowcase title="Border Radius">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary mx-auto rounded-none"></div>
                <p className="text-sm font-medium">None</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">0px</code>
              </div>
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary mx-auto rounded-sm"></div>
                <p className="text-sm font-medium">Small</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">2px</code>
              </div>
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary mx-auto rounded-md"></div>
                <p className="text-sm font-medium">Medium</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">6px</code>
              </div>
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary mx-auto rounded-full"></div>
                <p className="text-sm font-medium">Full</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">50%</code>
              </div>
            </div>
          </ComponentShowcase>

          <ComponentShowcase title="Shadow System">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 bg-background mx-auto rounded-lg shadow-sm border"></div>
                <p className="text-sm font-medium">Small Shadow</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">shadow-sm</code>
              </div>
              <div className="text-center space-y-3">
                <div className="w-20 h-20 bg-background mx-auto rounded-lg shadow-md"></div>
                <p className="text-sm font-medium">Medium Shadow</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">shadow-md</code>
              </div>
              <div className="text-center space-y-3">
                <div className="w-20 h-20 bg-background mx-auto rounded-lg shadow-lg"></div>
                <p className="text-sm font-medium">Large Shadow</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">shadow-lg</code>
              </div>
            </div>
          </ComponentShowcase>

          <ComponentShowcase title="Animation Timing">
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Fast</p>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-pulse" style={{ animationDuration: '0.15s' }}></div>
                  </div>
                  <code className="text-xs bg-muted px-2 py-1 rounded">150ms</code>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Normal</p>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-pulse" style={{ animationDuration: '0.3s' }}></div>
                  </div>
                  <code className="text-xs bg-muted px-2 py-1 rounded">300ms</code>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Slow</p>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-pulse" style={{ animationDuration: '0.5s' }}></div>
                  </div>
                  <code className="text-xs bg-muted px-2 py-1 rounded">500ms</code>
                </div>
              </div>
            </div>
          </ComponentShowcase>

          <ComponentShowcase title="Semantic Tokens">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">CSS Custom Properties</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <p className="font-medium">Colors</p>
                      <div className="space-y-1 text-xs">
                        <div><code className="bg-muted px-1 rounded">--primary</code> - Main brand color</div>
                        <div><code className="bg-muted px-1 rounded">--secondary</code> - Supporting color</div>
                        <div><code className="bg-muted px-1 rounded">--accent</code> - Highlight color</div>
                        <div><code className="bg-muted px-1 rounded">--muted</code> - Subtle backgrounds</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium">Status</p>
                      <div className="space-y-1 text-xs">
                        <div><code className="bg-muted px-1 rounded">--success</code> - Positive actions</div>
                        <div><code className="bg-muted px-1 rounded">--warning</code> - Caution states</div>
                        <div><code className="bg-muted px-1 rounded">--destructive</code> - Error states</div>
                        <div><code className="bg-muted px-1 rounded">--innovation</code> - Creative highlights</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Usage Guidelines</h4>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>• Always use semantic tokens instead of hardcoded colors</p>
                    <p>• Tokens automatically adapt to light/dark themes</p>
                    <p>• Role-based colors maintain consistent user experience</p>
                    <p>• Status colors provide clear feedback across all components</p>
                  </div>
                </div>
              </div>
            </Card>
          </ComponentShowcase>
        </div>
      </div>
    </div>
  );
};