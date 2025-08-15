import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Move } from 'lucide-react';
import { useSettingsManager } from '@/hooks/useSettingsManager';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { toast } from '@/hooks/use-toast';

interface ArraySettingsEditorProps {
  settingKey: string;
  title: string;
  description: string;
  translationPrefix: string;
  category: string;
}

export const ArraySettingsEditor: React.FC<ArraySettingsEditorProps> = ({
  settingKey,
  title,
  description,
  translationPrefix,
  category
}) => {
  const { getSettingValue, updateSetting } = useSettingsManager();
  const { getTranslation, t } = useUnifiedTranslation();
  const [newItem, setNewItem] = useState('');
  
  const items = getSettingValue(settingKey, []);

  const addItem = () => {
    if (!newItem.trim()) return;
    
    const updatedItems = [...items, newItem.trim()];
    updateSetting({
      key: settingKey,
      value: updatedItems,
      category,
      dataType: 'array'
    });
    setNewItem('');
  };

  const removeItem = (index: number) => {
    const updatedItems = items.filter((_: string, i: number) => i !== index);
    updateSetting({
      key: settingKey,
      value: updatedItems,
      category,
      dataType: 'array'
    });
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    updateSetting({
      key: settingKey,
      value: updatedItems,
      category,
      dataType: 'array'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new item */}
        <div className="flex gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={t('common.placeholders.add_item')}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
          />
          <Button onClick={addItem} disabled={!newItem.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Current items */}
        <div className="space-y-2">
          {items.map((item: string, index: number) => (
            <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
              <Badge variant="outline" className="flex-1">
                {getTranslation(`${translationPrefix}.${item}`) || item}
              </Badge>
              <code className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                {item}
              </code>
              <div className="flex gap-1">
                {index > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => moveItem(index, index - 1)}
                    className="h-6 w-6 p-0"
                  >
                    <Move className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeItem(index)}
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No items configured. Add some items above.
          </div>
        )}
      </CardContent>
    </Card>
  );
};