import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, GripVertical, Save, Undo } from "lucide-react";
import { useDirection } from "@/components/ui/direction-provider";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";

interface ArrayEditorProps {
  value: string[] | Record<string, unknown>[];
  onChange: (newValue: Array<string | Record<string, unknown>>) => void;
  onSave?: () => void;
  title: string;
  description?: string;
  itemType?: 'string' | 'object';
  isRTL?: boolean;
}

export const ArrayEditor: React.FC<ArrayEditorProps> = ({ 
  value = [], 
  onChange, 
  onSave,
  title, 
  description,
  itemType = 'string',
  isRTL = false 
}) => {
  const { t: getTranslation } = useUnifiedTranslation();
  const [items, setItems] = useState<Array<string | Record<string, unknown>>>(Array.isArray(value) ? value : []);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalItems, setOriginalItems] = useState<Array<string | Record<string, unknown>>>(Array.isArray(value) ? value : []);

  useEffect(() => {
    const newItems = Array.isArray(value) ? value : [];
    setItems(newItems);
    setOriginalItems(newItems);
    setHasChanges(false);
  }, [value]);

  const handleItemChange = (index: number, newValue: string | Record<string, unknown>) => {
    const updatedItems = [...items];
    updatedItems[index] = newValue;
    setItems(updatedItems);
    setHasChanges(true);
    onChange(updatedItems);
  };

  const addItem = () => {
    const newItem = itemType === 'object' ? {} : '';
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    setHasChanges(true);
    onChange(updatedItems);
  };

  const removeItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    setHasChanges(true);
    onChange(updatedItems);
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    // Use immutable array operations instead of splice
    const updatedItems = [...items];
    const itemToMove = updatedItems[fromIndex];
    const filteredItems = updatedItems.filter((_, index) => index !== fromIndex);
    const finalItems = [
      ...filteredItems.slice(0, toIndex),
      itemToMove,
      ...filteredItems.slice(toIndex)
    ];
    setItems(finalItems);
    setHasChanges(true);
    onChange(finalItems);
  };

  const handleSave = () => {
    setOriginalItems([...items]);
    setHasChanges(false);
    onSave?.();
  };

  const handleRevert = () => {
    setItems([...originalItems]);
    setHasChanges(false);
    onChange(originalItems);
  };

  const renderStringItem = (item: string, index: number) => (
    <div key={index} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <div className="cursor-move text-muted-foreground">
        <GripVertical className="w-4 h-4" />
      </div>
      <Input
        value={item || ''}
        onChange={(e) => handleItemChange(index, e.target.value)}
        className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}
        placeholder={getTranslation('admin-settings:ui.array.item_placeholder', 'Enter item value...')}
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => removeItem(index)}
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );

  const renderObjectItem = (item: Record<string, unknown>, index: number) => (
    <Card key={index} className="mb-2">
      <CardContent className="p-3">
        <div className={`flex items-start justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Badge variant="outline">Item {index + 1}</Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeItem(index)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        <textarea
          value={JSON.stringify(item, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              handleItemChange(index, parsed);
            } catch (err) {
              // Invalid JSON, don't update
            }
          }}
          className={`w-full h-24 p-2 border rounded font-mono text-sm ${isRTL ? 'text-right' : 'text-left'}`}
          placeholder={getTranslation('admin-settings:ui.object.item_placeholder', 'Enter JSON object...')}
        />
      </CardContent>
    </Card>
  );

  return (
    <Card>
      <CardHeader>
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {hasChanges && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRevert}
                  className="gap-1"
                >
                  <Undo className="w-4 h-4" />
                  {getTranslation('admin-settings:ui.revert', 'Revert')}
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="gap-1"
                >
                  <Save className="w-4 h-4" />
                  {getTranslation('admin-settings:ui.save', 'Save')}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-sm text-muted-foreground">
            {getTranslation('admin-settings:ui.total_items', 'Total items')}: {items.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={addItem}
            className="gap-1"
          >
            <Plus className="w-4 h-4" />
            {getTranslation('admin-settings:ui.add_item', 'Add Item')}
          </Button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>{getTranslation('admin-settings:ui.no_items', 'No items added yet')}</p>
              <p className="text-xs mt-1">
                {getTranslation('admin-settings:ui.click_add', 'Click "Add Item" to get started')}
              </p>
            </div>
          ) : (
            items.map((item, index) => {
              if (itemType === 'string') {
                return renderStringItem(item as string, index);
              } else {
                return renderObjectItem(item as Record<string, unknown>, index);
              }
            })
          )}
        </div>

        {hasChanges && (
          <div className="border-t pt-3 mt-3">
            <div className="flex items-center gap-2 text-amber-600 text-sm">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              {getTranslation('admin-settings:ui.unsaved_changes', 'You have unsaved changes')}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};