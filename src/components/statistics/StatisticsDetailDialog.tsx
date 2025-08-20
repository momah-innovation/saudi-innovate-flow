import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

interface StatisticsDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'ideas' | 'challenges' | 'events' | 'users' | null;
  data: any;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export function StatisticsDetailDialog({ isOpen, onClose, type, data }: StatisticsDetailDialogProps) {
  const { t } = useUnifiedTranslation();
  
  if (!type || !data) return null;

  const getTitle = () => {
    switch (type) {
      case 'ideas': return t('statistics.dialog.ideas_analytics');
      case 'challenges': return t('statistics.dialog.challenges_analytics'); 
      case 'events': return t('statistics.dialog.events_analytics');
      case 'users': return t('statistics.dialog.users_analytics');
      default: return t('statistics.dialog.analytics');
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'ideas': return t('statistics.dialog.ideas_description');
      case 'challenges': return t('statistics.dialog.challenges_description');
      case 'events': return t('statistics.dialog.events_description');
      case 'users': return t('statistics.dialog.users_description');
      default: return t('statistics.dialog.default_description');
    }
  };

  const renderChart = () => {
    if (!data.chartData) return null;

    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="space-y-4 w-full max-w-sm">
          {data.chartData.slice(0, 5).map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.name}</span>
                  <span>{item.value}</span>
                </div>
                <Progress value={Math.min((item.value / Math.max(...data.chartData.map((d: any) => d.value))) * 100, 100)} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Metrics */}
          {data.metrics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.metrics.map((metric: any, index: number) => (
                <Card key={index} className="animate-fade-in">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {metric.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    {metric.change && (
                      <Badge variant={metric.change > 0 ? 'default' : 'secondary'} className="mt-1">
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Chart Visualization */}
          {data.chartData && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>{data.chartTitle || t('statistics.dialog.data_visualization')}</CardTitle>
              </CardHeader>
              <CardContent>
                {renderChart()}
              </CardContent>
            </Card>
          )}

          {/* Progress Indicators */}
          {data.progressData && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>{t('statistics.dialog.performance_indicators')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.progressData.map((item: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.label}</span>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                    <Progress value={item.value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Detailed Data Table */}
          {data.tableData && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>{t('statistics.dialog.detailed_breakdown')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        {data.tableHeaders?.map((header: string, index: number) => (
                          <th key={index} className="text-left p-2 font-medium">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.tableData.map((row: any, index: number) => (
                        <tr key={index} className="border-b">
                          {Object.values(row).map((cell: any, cellIndex: number) => (
                            <td key={cellIndex} className="p-2">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
