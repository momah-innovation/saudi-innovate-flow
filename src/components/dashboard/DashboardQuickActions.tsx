import React from 'react';
import { CompactQuickActions, UnifiedQuickAction } from '@/components/ui/unified-quick-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { LucideIcon } from 'lucide-react';

interface QuickAction {
  label: string;
  icon: LucideIcon;
  href: string;
  visible: boolean;
  color: string;
}

interface DashboardQuickActionsProps {
  actions: QuickAction[];
  onActionClick: (href: string) => void;
}

export const DashboardQuickActions: React.FC<DashboardQuickActionsProps> = ({
  actions,
  onActionClick
}) => {
  const { t } = useUnifiedTranslation();

  // Convert legacy actions to unified format
  const unifiedActions: UnifiedQuickAction[] = actions.map((action, index) => ({
    id: action.href,
    title: action.label,
    description: `${action.label} - Click to navigate`,
    icon: action.icon,
    onClick: () => onActionClick(action.href),
    colorScheme: index % 2 === 0 ? 'primary' : 'info'
  }));

  return (
    <Card className="gradient-border">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-primary rounded-full animate-pulse"></div>
          {t('dashboard.cards.quick_actions.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CompactQuickActions actions={unifiedActions} />
      </CardContent>
    </Card>
  );
};
