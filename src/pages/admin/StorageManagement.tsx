import React from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HardDrive, Database, Cloud, Files } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function StorageManagement() {
  return (
    <AdminLayout
      title="Storage Management"
      breadcrumbs={[
        { label: 'Admin', href: '/admin/dashboard' },
        { label: 'Storage Management', href: '/admin/storage' }
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <HardDrive className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Storage Management</h1>
            <p className="text-muted-foreground">
              Monitor and manage platform storage resources
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Database className="h-4 w-4 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Database Storage</p>
                  <p className="text-2xl font-bold">2.4 GB</p>
                  <Progress value={45} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Cloud className="h-4 w-4 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">File Storage</p>
                  <p className="text-2xl font-bold">1.8 GB</p>
                  <Progress value={32} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Files className="h-4 w-4 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Files</p>
                  <p className="text-2xl font-bold">8,547</p>
                  <p className="text-xs text-muted-foreground mt-1">+156 this week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="cleanup">Cleanup</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Storage Overview</CardTitle>
                <CardDescription>
                  Overall storage usage and capacity planning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Total Used</span>
                      <span>4.2 GB of 10 GB</span>
                    </div>
                    <Progress value={42} className="mt-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center p-4 border rounded-lg">
                      <Database className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <p className="font-medium">Database</p>
                      <p className="text-sm text-muted-foreground">2.4 GB</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Files className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <p className="font-medium">Files</p>
                      <p className="text-sm text-muted-foreground">1.8 GB</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="database" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Database Storage</CardTitle>
                <CardDescription>
                  Database size and optimization recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Database storage management coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="files" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>File Storage</CardTitle>
                <CardDescription>
                  Uploaded files, images, and document management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  File storage management coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cleanup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Storage Cleanup</CardTitle>
                <CardDescription>
                  Clean up unused files and optimize storage usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <Database className="h-4 w-4 mr-2" />
                    Optimize Database
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Files className="h-4 w-4 mr-2" />
                    Clean Unused Files
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Cloud className="h-4 w-4 mr-2" />
                    Archive Old Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}