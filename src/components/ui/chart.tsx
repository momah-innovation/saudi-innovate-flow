import React from 'react'

// Temporary placeholder for chart components to fix build errors
export const ChartContainer: React.FC<{ children: React.ReactNode; config?: any; className?: string }> = ({ children, className }) => (
  <div className={`${className} flex items-center justify-center bg-muted/10 rounded-lg`}>
    <p className="text-muted-foreground">Chart visualization temporarily unavailable</p>
  </div>
)

export const ChartTooltip: React.FC<{ content?: any }> = () => null
export const ChartTooltipContent: React.FC = () => null