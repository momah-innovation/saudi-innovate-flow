import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useTemplateData } from '@/hooks/useTemplateData';
import { DataTable, Column } from '@/components/ui/data-table';

import { Template, TemplateCategory, TemplateVersion } from '@/hooks/useTemplateData';
import { format } from 'date-fns';
import { 
  FileText, Edit2,
  Plus, 
  Edit, 
  Copy, 
  Trash2, 
  Eye, 
  History, 
  Search,
  AlertTriangle 
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const TemplateManagement: React.FC = () => {
  const {
    templates,
    categories,
    versions,
    loading,
    error,
    refreshTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    previewTemplate,
    getTemplateVersions,
    createTemplateVersion
  } = useTemplateData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [previewVariables, setPreviewVariables] = useState<Record<string, any>>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const templateColumns: Column<Template>[] = [
    { key: 'name', title: 'Name' },
    { key: 'category', title: 'Category' },
    { key: 'version', title: 'Version' },
    { key: 'status', title: 'Status' }
  ];

  const categoryColumns: Column<TemplateCategory>[] = [
    { key: 'name', title: 'Category' },
    { key: 'description', title: 'Description' }
  ];

  const versionColumns: Column<TemplateVersion>[] = [
    { key: 'version', title: 'Version' },
    { key: 'created_at', title: 'Created' }
  ];

  const renderPreview = () => {
    if (!selectedTemplate) return '';
    
    // Create preview variables with defaults
    const variables: Record<string, any> = {};
    selectedTemplate.variables.forEach(variable => {
      variables[variable.name] = previewVariables[variable.name] || 
                                variable.default_value || 
                                `[${variable.name}]`;
    });
    
    return previewTemplate(selectedTemplate.id, variables);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <span>Error loading template data: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Template Management</h1>
          <p className="text-muted-foreground">
            Create and manage document, email, and report templates
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
                <DialogDescription>
                  Create a new template for emails, documents, or reports
                </DialogDescription>
              </DialogHeader>
              {/* Template creation form would go here */}
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={refreshTemplates} disabled={loading}>
            <FileText className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
          {selectedTemplate && <TabsTrigger value="preview">Preview</TabsTrigger>}
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Templates
              </CardTitle>
              <CardDescription>
                Manage your document, email, and report templates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.name.toLowerCase()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DataTable
                columns={templateColumns}
                data={filteredTemplates}
                loading={loading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Template Categories</CardTitle>
              <CardDescription>
                Organize templates by category and type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={categoryColumns}
                data={categories}
                loading={loading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="versions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Template Versions</CardTitle>
              <CardDescription>
                View template version history and changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={versionColumns}
                data={versions}
                loading={loading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {selectedTemplate && (
          <TabsContent value="preview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Template Variables</CardTitle>
                  <CardDescription>
                    Set values for template variables to preview the output
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedTemplate.variables.map(variable => (
                    <div key={variable.name}>
                      <Label htmlFor={variable.name}>
                        {variable.name} {variable.required && '*'}
                      </Label>
                      <Input
                        id={variable.name}
                        placeholder={variable.description || `Enter ${variable.name}`}
                        value={previewVariables[variable.name] || ''}
                        onChange={(e) => setPreviewVariables(prev => ({
                          ...prev,
                          [variable.name]: e.target.value
                        }))}
                      />
                      {variable.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {variable.description}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>
                    Template output with current variable values
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-muted/50 min-h-[200px]">
                    <pre className="whitespace-pre-wrap text-sm">
                      {renderPreview()}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default TemplateManagement;