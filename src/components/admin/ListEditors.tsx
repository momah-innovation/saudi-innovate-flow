import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Edit, RotateCcw } from 'lucide-react';

// Simple List Editor Component
interface SimpleListEditorProps {
  title: string;
  description: string;
  items: string[];
  onChange: (items: string[]) => void;
  onReset: () => void;
  placeholder?: string;
}

export function SimpleListEditor({ title, description, items, onChange, onReset, placeholder }: SimpleListEditorProps) {
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim() && !items.includes(newItem.trim())) {
      onChange([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeItem(index)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        <div className="flex items-center gap-2">
          <Input
            placeholder={placeholder || "Add new item..."}
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            className="flex-1"
          />
          <Button onClick={addItem} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Role Editor Component for complex objects
interface Role {
  value: string;
  label: string;
  description: string;
}

interface RoleEditorProps {
  title: string;
  description: string;
  roles: Role[];
  onChange: (roles: Role[]) => void;
  onReset: () => void;
}

export function RoleEditor({ title, description, roles, onChange, onReset }: RoleEditorProps) {
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ value: '', label: '', description: '' });

  const openEditDialog = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setFormData(role);
    } else {
      setEditingRole(null);
      setFormData({ value: '', label: '', description: '' });
    }
    setIsDialogOpen(true);
  };

  const saveRole = () => {
    if (!formData.value || !formData.label) return;

    const newRoles = [...roles];
    if (editingRole) {
      const index = roles.findIndex(r => r.value === editingRole.value);
      newRoles[index] = formData;
    } else {
      newRoles.push(formData);
    }
    
    onChange(newRoles);
    setIsDialogOpen(false);
    setFormData({ value: '', label: '', description: '' });
  };

  const removeRole = (roleValue: string) => {
    onChange(roles.filter(r => r.value !== roleValue));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => openEditDialog()}>
            <Plus className="h-4 w-4 mr-1" />
            Add Role
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {roles.map((role) => (
          <Card key={role.value} className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{role.label}</span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">{role.value}</code>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(role)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeRole(role.value)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRole ? 'Edit Role' : 'Add New Role'}</DialogTitle>
            <DialogDescription>
              Configure the role details. The value should be lowercase with underscores.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="value">Role Value (ID)</Label>
              <Input
                id="value"
                placeholder="e.g., domain_expert"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                disabled={!!editingRole}
              />
            </div>
            
            <div>
              <Label htmlFor="label">Display Label</Label>
              <Input
                id="label"
                placeholder="e.g., Domain Expert"
                value={formData.label}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this role can do..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveRole} disabled={!formData.value || !formData.label}>
              {editingRole ? 'Update' : 'Add'} Role
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}