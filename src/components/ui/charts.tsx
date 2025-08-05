import React, { useState } from 'react';
import { BarChart3, TrendingUp, PieChart, Activity, Target, Users, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface LineChartProps {
  data: ChartDataPoint[];
  height?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  color?: string;
  className?: string;
}

export function SimpleLineChart({ 
  data, 
  height = 200, 
  showGrid = true, 
  showLabels = true,
  color = 'hsl(var(--primary))',
  className 
}: LineChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((point, index) => ({
    x: (index / (data.length - 1)) * 100,
    y: ((maxValue - point.value) / range) * 100
  }));

  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="relative" style={{ height }}>
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid */}
            {showGrid && (
              <g className="opacity-20">
                {[0, 25, 50, 75, 100].map(y => (
                  <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="currentColor" strokeWidth="0.2" />
                ))}
                {[0, 25, 50, 75, 100].map(x => (
                  <line key={x} x1={x} y1="0" x2={x} y2="100" stroke="currentColor" strokeWidth="0.2" />
                ))}
              </g>
            )}
            
            {/* Line */}
            <path
              d={pathData}
              fill="none"
              stroke={color}
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
            
            {/* Area fill */}
            <path
              d={`${pathData} L 100 100 L 0 100 Z`}
              fill={color}
              fillOpacity="0.1"
            />
            
            {/* Data points */}
            {points.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="1.5"
                fill={color}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
          
          {/* Labels */}
          {showLabels && (
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-muted-foreground">
              {data.map((point, index) => (
                <span key={index} className="truncate">
                  {point.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface BarChartProps {
  data: ChartDataPoint[];
  height?: number;
  showValues?: boolean;
  className?: string;
}

export function SimpleBarChart({ data, height = 200, showValues = true, className }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-3" style={{ height }}>
          {data.map((item, index) => {
            const percentage = (item.value / maxValue) * 100;
            
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="w-20 text-sm font-medium truncate">
                  {item.label}
                </div>
                <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: item.color || 'hsl(var(--primary))'
                    }}
                  >
                    {showValues && percentage > 20 && (
                      <span className="text-xs text-white font-medium">
                        {item.value}
                      </span>
                    )}
                  </div>
                  {showValues && percentage <= 20 && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium">
                      {item.value}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

interface DonutChartProps {
  data: ChartDataPoint[];
  size?: number;
  centerText?: string;
  centerValue?: string;
  className?: string;
}

export function SimpleDonutChart({ 
  data, 
  size = 200, 
  centerText = "Total",
  centerValue,
  className 
}: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const displayValue = centerValue || total.toString();
  
  let cumulativePercentage = 0;
  const radius = 45;
  const strokeWidth = 10;

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center gap-6">
          <div className="relative" style={{ width: size, height: size }}>
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const strokeDasharray = `${percentage} ${100 - percentage}`;
                const strokeDashoffset = -cumulativePercentage;
                
                cumulativePercentage += percentage;
                
                return (
                  <circle
                    key={index}
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke={item.color || `hsl(${(index * 360) / data.length}, 70%, 50%)`}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>
            
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold">{displayValue}</div>
              <div className="text-xs text-muted-foreground">{centerText}</div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ 
                    backgroundColor: item.color || `hsl(${(index * 360) / data.length}, 70%, 50%)`
                  }}
                />
                <span className="text-sm">{item.label}</span>
                <Badge variant="outline" className="text-xs">
                  {item.value} ({Math.round((item.value / total) * 100)}%)
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Pre-built analytics cards
export function AnalyticsOverview() {
  const chartData = [
    { label: 'Jan', value: 65 },
    { label: 'Feb', value: 78 },
    { label: 'Mar', value: 52 },
    { label: 'Apr', value: 89 },
    { label: 'May', value: 95 },
    { label: 'Jun', value: 87 }
  ];

  const barData = [
    { label: 'Ideas', value: 234, color: 'hsl(var(--primary))' },
    { label: 'Challenges', value: 45, color: 'hsl(var(--success))' },
    { label: 'Events', value: 12, color: 'hsl(var(--warning))' },
    { label: 'Teams', value: 78, color: 'hsl(var(--info))' }
  ];

  const donutData = [
    { label: 'Completed', value: 45, color: 'hsl(var(--success))' },
    { label: 'In Progress', value: 30, color: 'hsl(var(--warning))' },
    { label: 'Planning', value: 25, color: 'hsl(var(--info))' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <SimpleLineChart 
        data={chartData} 
        className="lg:col-span-2"
      />
      <SimpleBarChart data={barData} />
      <SimpleDonutChart 
        data={donutData} 
        centerText="Projects"
        className="lg:col-span-1"
      />
    </div>
  );
}

// Metric cards with visual indicators
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
    trend: 'up' | 'down' | 'neutral';
  };
  icon?: React.ComponentType<{ className?: string }>;
  data?: number[];
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon = Activity,
  data = [],
  className 
}: MetricCardProps) {
  return (
    <Card className={cn("hover-lift", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        
        {change && (
          <p className={cn(
            "text-xs flex items-center mt-1",
            change.trend === 'up' ? "text-success" : 
            change.trend === 'down' ? "text-destructive" : "text-muted-foreground"
          )}>
            <TrendingUp className={cn(
              "w-3 h-3 mr-1",
              change.trend === 'down' && "rotate-180"
            )} />
            {change.value}% from {change.period}
          </p>
        )}
        
        {data.length > 0 && (
          <div className="mt-3 h-8">
            <div className="flex items-end justify-between h-full gap-0.5">
              {data.map((point, index) => {
                const max = Math.max(...data);
                const height = (point / max) * 100;
                
                return (
                  <div
                    key={index}
                    className="bg-primary/20 rounded-sm flex-1 transition-all duration-300 hover:bg-primary/40"
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}