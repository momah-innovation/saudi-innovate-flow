import { LayoutGrid, List, Grid3x3, Table } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type LayoutType = 'cards' | 'list' | 'grid' | 'table'

interface LayoutToggleProps {
  currentLayout: LayoutType
  onLayoutChange: (layout: LayoutType) => void
  className?: string
}

export function LayoutToggle({ currentLayout, onLayoutChange, className = '' }: LayoutToggleProps) {
  const layouts = [
    { value: 'cards' as const, icon: LayoutGrid, label: 'عرض البطاقات' },
    { value: 'list' as const, icon: List, label: 'عرض القائمة' },
    { value: 'grid' as const, icon: Grid3x3, label: 'عرض الشبكة' },
    { value: 'table' as const, icon: Table, label: 'عرض الجدول' }
  ]

  return (
    <div className={`flex items-center border rounded-lg p-1 ${className}`}>
      {layouts.map(({ value, icon: Icon, label }) => (
        <Button
          key={value}
          variant="ghost"
          size="sm"
          onClick={() => onLayoutChange(value)}
          className={`p-2 rounded ${
            currentLayout === value 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted'
          }`}
          title={label}
        >
          <Icon className="w-4 h-4" />
        </Button>
      ))}
    </div>
  )
}