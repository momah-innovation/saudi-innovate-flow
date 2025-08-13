/**
 * ANALYTICS MIGRATION TRACKER
 * Real-time progress tracking and execution management
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Play, 
  Pause,
  FileCode,
  Database,
  Shield,
  Zap
} from 'lucide-react';
import { 
  ANALYTICS_MIGRATION_PLAN, 
  calculateMigrationProgress, 
  getCriticalPath, 
  getNextActionableTasks,
  MigrationTask,
  MigrationPhase
} from '@/utils/analytics-migration-plan';

export function AnalyticsMigrationTracker() {
  const [progress, setProgress] = useState(calculateMigrationProgress());
  const [criticalPath, setCriticalPath] = useState(getCriticalPath());
  const [nextActions, setNextActions] = useState(getNextActionableTasks());
  
  useEffect(() => {
    // Recalculate progress when component mounts or updates
    setProgress(calculateMigrationProgress());
    setCriticalPath(getCriticalPath());
    setNextActions(getNextActionableTasks());
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress': return <Play className="w-4 h-4 text-blue-500" />;
      case 'blocked': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string): "destructive" | "default" | "secondary" | "outline" | "success" | "warning" | "info" => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getComponentIcon = (component: string) => {
    if (component.includes('Database') || component.includes('Functions')) {
      return <Database className="w-4 h-4" />;
    }
    if (component.includes('Security') || component.includes('RBAC')) {
      return <Shield className="w-4 h-4" />;
    }
    if (component.includes('Analytics') || component.includes('Metrics')) {
      return <Zap className="w-4 h-4" />;
    }
    return <FileCode className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics Migration Tracker</h1>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {Math.round(progress.overall)}% Complete
        </Badge>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Migration Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Progress value={progress.overall} className="flex-1" />
            <span className="text-sm font-medium">
              {progress.completedTasks}/{progress.totalTasks} tasks
            </span>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {progress.completedTasks}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {progress.totalTasks - progress.completedTasks}
              </div>
              <div className="text-sm text-muted-foreground">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {criticalPath.length}
              </div>
              <div className="text-sm text-muted-foreground">Critical Path</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {progress.estimatedRemainingHours}h
              </div>
              <div className="text-sm text-muted-foreground">Est. Remaining</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progress by Phase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ANALYTICS_MIGRATION_PLAN.map((phase) => (
              <div key={phase.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(phase.status)}
                    <span className="font-medium">{phase.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(progress.byPhase[phase.name] || 0)}%
                  </span>
                </div>
                <Progress value={progress.byPhase[phase.name] || 0} />
                <p className="text-sm text-muted-foreground">{phase.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Critical Path Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Critical Path Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {criticalPath.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                🎉 All critical path tasks completed!
              </p>
            ) : (
              criticalPath.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  {getComponentIcon(task.component)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{task.component}</span>
                      <Badge variant={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>📁 {task.filePath}</span>
                      <span>⏱️ {task.estimatedHours}h</span>
                      <span>🔒 {task.rbacRequirement}</span>
                    </div>
                  </div>
                  {getStatusIcon(task.status)}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Next Actionable Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5 text-green-500" />
            Next Actionable Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {nextActions.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg bg-green-50 dark:bg-green-950">
                {getComponentIcon(task.component)}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{task.component}</span>
                    <Badge variant={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span>📁 {task.filePath}</span>
                    <span>⏱️ {task.estimatedHours}h</span>
                    <span>🔒 {task.rbacRequirement}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Start Task
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Implementation Guide */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Current Implementation Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              ✅ Completed Infrastructure (Phases 1-2)
            </h4>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <li>• Centralized AnalyticsService with RBAC</li>
              <li>• useAnalytics hook with role-based data fetching</li>
              <li>• AnalyticsContext global provider</li>
              <li>• ProtectedAnalyticsWrapper components</li>
              <li>• Integrated into AppShell for app-wide access</li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              🔄 In Progress (Phase 3)
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
              Creating enhanced database functions for RBAC-aware analytics
            </p>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              <strong>Next Steps:</strong>
              <br />1. Create get_analytics_data(user_id, role, filters) function
              <br />2. Implement get_security_metrics(user_id) for admin access
              <br />3. Add role-based filtering to existing functions
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              ⏳ Upcoming (Phases 4-5)
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Component migration starting with critical dashboard components
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}