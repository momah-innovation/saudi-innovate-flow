import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save, Undo, Code, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";

interface ObjectEditorProps {
  value: Record<string, unknown>;
  onChange: (newValue: Record<string, unknown>) => void;
  onSave?: () => void;
  title: string;
  description?: string;
  isRTL?: boolean;
}

export const ObjectEditor: React.FC<ObjectEditorProps> = ({ 
  value = {}, 
  onChange, 
  onSave,
  title, 
  description,
  isRTL = false 
}) => {
  const { t: getTranslation } = useUnifiedTranslation();
  const [objectData, setObjectData] = useState<Record<string, unknown>>(
    typeof value === 'object' && value !== null ? value : {}
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<Record<string, unknown>>(
    typeof value === 'object' && value !== null ? value : {}
  );
  const [newKeyName, setNewKeyName] = useState('');
  const [jsonString, setJsonString] = useState('');
  const [editMode, setEditMode] = useState<'form' | 'json'>('form');

  useEffect(() => {
    const newData = typeof value === 'object' && value !== null ? value : {};
    setObjectData(newData);
    setOriginalData(newData);
    setJsonString(JSON.stringify(newData, null, 2));
    setHasChanges(false);
  }, [value]);

  const handlePropertyChange = (key: string, newValue: unknown) => {
    const updatedData = { ...objectData, [key]: newValue };
    setObjectData(updatedData);
    setJsonString(JSON.stringify(updatedData, null, 2));
    setHasChanges(true);
    onChange(updatedData);
  };

  const handleAddProperty = () => {
    if (newKeyName.trim()) {
      const updatedData = { ...objectData, [newKeyName.trim()]: '' };
      setObjectData(updatedData);
      setJsonString(JSON.stringify(updatedData, null, 2));
      setHasChanges(true);
      setNewKeyName('');
      onChange(updatedData);
    }
  };

  const handleRemoveProperty = (key: string) => {
    const updatedData = { ...objectData };
    delete updatedData[key];
    setObjectData(updatedData);
    setJsonString(JSON.stringify(updatedData, null, 2));
    setHasChanges(true);
    onChange(updatedData);
  };

  const handleJsonChange = (jsonValue: string) => {
    setJsonString(jsonValue);
    try {
      const parsed = JSON.parse(jsonValue);
      if (typeof parsed === 'object' && parsed !== null) {
        setObjectData(parsed);
        setHasChanges(true);
        onChange(parsed);
      }
    } catch (err) {
      // Invalid JSON, don't update object data
    }
  };

  const handleSave = () => {
    setOriginalData({ ...objectData });
    setHasChanges(false);
    onSave?.();
  };

  const handleRevert = () => {
    setObjectData({ ...originalData });
    setJsonString(JSON.stringify(originalData, null, 2));
    setHasChanges(false);
    onChange(originalData);
  };

  const renderPropertyEditor = (key: string, value: unknown) => {
    const isNestedObject = typeof value === 'object' && value !== null && !Array.isArray(value);
    
    return (
      <div key={key} className={`space-y-2 p-3 border rounded ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Label className="font-medium">{key}</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRemoveProperty(key)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        
        {isNestedObject ? (
          <Textarea
            value={JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handlePropertyChange(key, parsed);
              } catch (err) {
                // Invalid JSON, don't update
              }
            }}
            rows={4}
            className={`font-mono text-sm ${isRTL ? 'text-right' : 'text-left'}`}
            placeholder={getTranslation('admin-settings:ui.object.nested_placeholder', 'Enter nested object...')}
          />
        ) : Array.isArray(value) ? (
          <Textarea
            value={JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handlePropertyChange(key, parsed);
              } catch (err) {
                // Invalid JSON, don't update
              }
            }}
            rows={3}
            className={`font-mono text-sm ${isRTL ? 'text-right' : 'text-left'}`}
            placeholder={getTranslation('admin-settings:ui.object.array_placeholder', 'Enter array...')}
          />
        ) : (
          <Input
            value={String(value)}
            onChange={(e) => handlePropertyChange(key, e.target.value)}
            className={isRTL ? 'text-right' : 'text-left'}
          />
        )}
      </div>
    );
  };

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
      <CardContent>
        <Tabs value={editMode} onValueChange={(value) => setEditMode(value as 'form' | 'json')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form" className="gap-1">
              <Eye className="w-4 h-4" />
              {getTranslation('admin-settings:ui.visual_mode', 'Visual Mode')}
            </TabsTrigger>
            <TabsTrigger value="json" className="gap-1">
              <Code className="w-4 h-4" />
              {getTranslation('admin-settings:ui.code_mode', 'Code Mode')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="form" className="space-y-4">
            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Input
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder={getTranslation('admin-settings:ui.property_name', 'Property name...')}
                className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}
                onKeyPress={(e) => e.key === 'Enter' && handleAddProperty()}
              />
              <Button onClick={handleAddProperty} className="gap-1">
                <Plus className="w-4 h-4" />
                {getTranslation('admin-settings:ui.add_property', 'Add')}
              </Button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {Object.keys(objectData).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>{getTranslation('admin-settings:ui.no_properties', 'No properties added yet')}</p>
                  <p className="text-xs mt-1">
                    {getTranslation('admin-settings:ui.add_property_hint', 'Add a property name and click "Add"')}
                  </p>
                </div>
              ) : (
                Object.entries(objectData).map(([key, value]) => renderPropertyEditor(key, value))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="json">
            <Textarea
              value={jsonString}
              onChange={(e) => handleJsonChange(e.target.value)}
              rows={12}
              className={`font-mono text-sm ${isRTL ? 'text-right' : 'text-left'}`}
              placeholder={getTranslation('admin-settings:ui.json_placeholder', 'Enter JSON object...')}
            />
          </TabsContent>
        </Tabs>

        {hasChanges && (
          <div className="border-t pt-3 mt-3">
            <div className="flex items-center gap-2 text-amber-600 text-sm">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              {getTranslation('settings.unsaved_changes', 'You have unsaved changes')}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};