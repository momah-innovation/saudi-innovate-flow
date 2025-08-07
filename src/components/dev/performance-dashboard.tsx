/**
 * Development Performance Dashboard
 * Real-time monitoring of application performance metrics
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { phase8Tracker, PerformanceReport } from '@/utils/performance-tracker';
import { trackMemoryUsage } from '@/utils/bundle-analyzer';
import { Activity, Zap, Package, Code, TrendingUp } from 'lucide-react';
import { logger } from '@/utils/logger';

interface PerformanceDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  isOpen,
  onClose
}) => {
  const [report, setReport] = useState<PerformanceReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateReport = async () => {
    setIsLoading(true);
    try {
      const newReport = await phase8Tracker.generatePerformanceReport();
      setReport(newReport);
      trackMemoryUsage();
    } catch (error) {
      logger.error('Failed to generate performance report', { 
        component: 'PerformanceDashboard', 
        action: 'generateReport' 
      }, error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      generateReport();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const progress = phase8Tracker.getProgress();

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Activity className="w-6 h-6" />
              Performance Dashboard
            </h2>
            <p className="text-muted-foreground">Real-time performance monitoring</p>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Phase 8 Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Phase 8 Progress
              </CardTitle>
              <CardDescription>
                Performance optimization implementation status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Overall Progress</span>
                  <Badge variant={progress.percentage === 100 ? "default" : "secondary"}>
                    {progress.completed}/{progress.total} tasks
                  </Badge>
                </div>
                <Progress value={progress.percentage} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  {progress.percentage}% complete
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Performance Report */}
          {report && (
            <>
              {/* Overall Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Performance Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">
                      {report.score}/100
                    </div>
                    <Badge 
                      variant={
                        report.score >= 90 ? "default" : 
                        report.score >= 70 ? "secondary" : "destructive"
                      }
                    >
                      {report.score >= 90 ? "Excellent" : 
                       report.score >= 70 ? "Good" : "Needs Improvement"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Bundle Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Bundle Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Size</p>
                      <p className="text-lg font-semibold">
                        {(report.bundleAnalysis.totalSize / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant={
                        report.bundleAnalysis.status === 'excellent' ? 'default' :
                        report.bundleAnalysis.status === 'good' ? 'secondary' : 'destructive'
                      }>
                        {report.bundleAnalysis.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Code Health */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Code Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Files Refactored</p>
                      <p className="text-lg font-semibold">
                        {report.codeHealth.filesRefactored}/{report.codeHealth.totalFiles}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Modularity</p>
                      <Badge variant={
                        report.codeHealth.modularity === 'high' ? 'default' :
                        report.codeHealth.modularity === 'medium' ? 'secondary' : 'destructive'
                      }>
                        {report.codeHealth.modularity}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Core Web Vitals */}
              <Card>
                <CardHeader>
                  <CardTitle>Core Web Vitals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">LCP</p>
                      <p className="text-lg font-semibold">
                        {Math.round(report.runtime.coreWebVitals.lcp)}ms
                      </p>
                      <Badge variant={report.runtime.coreWebVitals.lcp < 1500 ? 'default' : 'secondary'}>
                        {report.runtime.coreWebVitals.lcp < 1500 ? 'Good' : 'Fair'}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">FID</p>
                      <p className="text-lg font-semibold">
                        {Math.round(report.runtime.coreWebVitals.fid)}ms
                      </p>
                      <Badge variant={report.runtime.coreWebVitals.fid < 100 ? 'default' : 'secondary'}>
                        {report.runtime.coreWebVitals.fid < 100 ? 'Good' : 'Fair'}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">CLS</p>
                      <p className="text-lg font-semibold">
                        {report.runtime.coreWebVitals.cls.toFixed(3)}
                      </p>
                      <Badge variant={report.runtime.coreWebVitals.cls < 0.1 ? 'default' : 'secondary'}>
                        {report.runtime.coreWebVitals.cls < 0.1 ? 'Good' : 'Fair'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Optimizations Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Optimization Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(report.optimizations).map(([key, enabled]) => (
                      <div key={key} className="flex items-center justify-between p-2 rounded border">
                        <span className="text-sm capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <Badge variant={enabled ? 'default' : 'secondary'}>
                          {enabled ? 'Enabled' : 'Pending'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <div className="flex gap-2">
            <Button onClick={generateReport} disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Refresh Report'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => phase8Tracker.logProgressSummary()}
            >
              Log Progress
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};