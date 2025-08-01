import React from 'react'
import { Activity } from 'lucide-react'

interface ChartPlaceholderProps {
  title: string
  height?: number
  icon?: React.ReactNode
}

export function ChartPlaceholder({ title, height = 300, icon }: ChartPlaceholderProps) {
  return (
    <div 
      className="flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/20"
      style={{ height }}
    >
      <div className="text-center">
        {icon || <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-2" />}
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Chart visualization</p>
      </div>
    </div>
  )
}