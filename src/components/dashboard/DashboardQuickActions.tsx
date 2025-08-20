
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.cards.quick_actions.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button 
              key={index} 
              variant="ghost" 
              className="w-full justify-start hover:bg-muted/50 transition-colors"
              onClick={() => onActionClick(action.href)}
            >
              <div className={`p-2 rounded-md mr-3 ${action.color} text-white`}>
                <Icon className="h-4 w-4" />
              </div>
              {action.label}
            </Button>
          );
        })}
        
        {actions.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            No quick actions available for your role.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
