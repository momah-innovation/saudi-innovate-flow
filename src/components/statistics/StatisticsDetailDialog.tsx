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
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface StatisticsDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'ideas' | 'challenges' | 'events' | 'users' | null;
  data: any;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export function StatisticsDetailDialog({ isOpen, onClose, type, data }: StatisticsDetailDialogProps) {
  if (!type || !data) return null;

  const getTitle = () => {
    switch (type) {
      case 'ideas': return 'Ideas Analytics';
      case 'challenges': return 'Challenges Analytics'; 
      case 'events': return 'Events Analytics';
      case 'users': return 'Users Analytics';
      default: return 'Analytics';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'ideas': return 'Detailed breakdown of innovation ideas submission and evaluation';
      case 'challenges': return 'Analysis of innovation challenges and their progress';
      case 'events': return 'Event participation and engagement metrics';
      case 'users': return 'User activity and platform engagement statistics';
      default: return 'Detailed analytics data';
    }
  };

  const renderChart = () => {
    if (!data.chartData) return null;

    switch (data.chartType) {
      case 'bar':
        return (
          <ChartContainer config={{}} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        );

      case 'pie':
        return (
          <ChartContainer config={{}} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.chartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        );

      case 'line':
        return (
          <ChartContainer config={{}} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        );

      default:
        return null;
    }
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
                <CardTitle>{data.chartTitle || 'Data Visualization'}</CardTitle>
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
                <CardTitle>Performance Indicators</CardTitle>
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
                <CardTitle>Detailed Breakdown</CardTitle>
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