import React, { useState } from 'react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FolderPlus,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  MoreHorizontal,
  Filter
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  start_date: string;
  end_date: string;
  team_members: string[];
  tasks_count: number;
  completed_tasks: number;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee_id?: string;
  assignee_name?: string;
  due_date: string;
  created_at: string;
  estimated_hours?: number;
  actual_hours?: number;
}

interface ProjectTaskManagementProps {
  teamId: string;
  canManage: boolean;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Innovation Platform Enhancement',
    description: 'Improving the user experience and adding new features',
    status: 'active',
    priority: 'high',
    progress: 65,
    start_date: '2025-01-01',
    end_date: '2025-03-31',
    team_members: ['user1', 'user2', 'user3'],
    tasks_count: 24,
    completed_tasks: 16
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Native mobile application for iOS and Android',
    status: 'planning',
    priority: 'medium',
    progress: 10,
    start_date: '2025-02-01',
    end_date: '2025-06-30',
    team_members: ['user4', 'user5'],
    tasks_count: 45,
    completed_tasks: 2
  }
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design user interface mockups',
    description: 'Create high-fidelity mockups for the new dashboard',
    status: 'completed',
    priority: 'high',
    assignee_id: 'user1',
    assignee_name: 'Ahmed Salem',
    due_date: '2025-01-20',
    created_at: '2025-01-10',
    estimated_hours: 16,
    actual_hours: 18
  },
  {
    id: '2',
    title: 'Implement real-time notifications',
    description: 'Add WebSocket-based real-time notification system',
    status: 'in-progress',
    priority: 'medium',
    assignee_id: 'user2',
    assignee_name: 'Sara Mohamed',
    due_date: '2025-01-25',
    created_at: '2025-01-15',
    estimated_hours: 24
  }
];

export function ProjectTaskManagement({ teamId, canManage }: ProjectTaskManagementProps) {
  const { t } = useUnifiedTranslation();
  const [activeTab, setActiveTab] = useState('projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const getStatusBadge = (status: string, type: 'project' | 'task' = 'project') => {
    const colors = {
      project: {
        planning: 'bg-blue-100 text-blue-800',
        active: 'bg-green-100 text-green-800',
        'on-hold': 'bg-yellow-100 text-yellow-800',
        completed: 'bg-gray-100 text-gray-800'
      },
      task: {
        todo: 'bg-gray-100 text-gray-800',
        'in-progress': 'bg-blue-100 text-blue-800',
        review: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-green-100 text-green-800'
      }
    };

    return (
      <Badge className={colors[type][status] || 'bg-gray-100 text-gray-800'}>
        {t(`workspace.team.${type}.status.${status}`)}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: 'border-green-200 text-green-700',
      medium: 'border-blue-200 text-blue-700',
      high: 'border-yellow-200 text-yellow-700',
      critical: 'border-red-200 text-red-700'
    };

    return (
      <Badge variant="outline" className={colors[priority]}>
        {t(`workspace.team.priority.${priority}`)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t('workspace.team.projects.title')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('workspace.team.projects.description')}
          </p>
        </div>

        {canManage && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {t('common.filter')}
            </Button>
            <Button size="sm" className="gap-2">
              <FolderPlus className="h-4 w-4" />
              {t('workspace.team.projects.create')}
            </Button>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="projects">{t('workspace.team.tabs.projects')}</TabsTrigger>
          <TabsTrigger value="tasks">{t('workspace.team.tabs.tasks')}</TabsTrigger>
          <TabsTrigger value="timeline">{t('workspace.team.tabs.timeline')}</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mockProjects.map((project) => (
              <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>{t('team:actions.view_details')}</DropdownMenuItem>
                        <DropdownMenuItem>{t('team:actions.edit_project')}</DropdownMenuItem>
                        <DropdownMenuItem>{t('team:actions.add_task')}</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          {t('team:actions.archive_project')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(project.status, 'project')}
                    {getPriorityBadge(project.priority)}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t('workspace.team.projects.progress')}</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(project.end_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {project.completed_tasks}/{project.tasks_count} {t('common.tasks')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {project.team_members.slice(0, 3).map((member, index) => (
                        <Avatar key={index} className="h-6 w-6 border-2 border-background">
                          <AvatarFallback className="text-xs">
                            {String.fromCharCode(65 + index)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {project.team_members.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                          +{project.team_members.length - 3}
                        </div>
                      )}
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      {t('common.view_details')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">{t('team:actions.all_tasks')}</Button>
                <Button variant="ghost" size="sm">{t('team:actions.my_tasks')}</Button>
                <Button variant="ghost" size="sm">{t('team:actions.overdue')}</Button>
              </div>
              
              {canManage && (
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t('workspace.team.tasks.create')}
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {mockTasks.map((task) => (
                <Card key={task.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{task.title}</h4>
                          {getStatusBadge(task.status, 'task')}
                          {getPriorityBadge(task.priority)}
                        </div>
                        
                        {task.description && (
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(task.due_date).toLocaleDateString()}</span>
                          </div>
                          
                          {task.assignee_name && (
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{task.assignee_name}</span>
                            </div>
                          )}
                          
                          {task.estimated_hours && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{task.estimated_hours}h</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>{t('team:actions.edit_task')}</DropdownMenuItem>
                          <DropdownMenuItem>{t('team:actions.change_status')}</DropdownMenuItem>
                          <DropdownMenuItem>{t('team:actions.assign_member')}</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            {t('team:actions.delete_task')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {t('workspace.team.timeline.title')}
            </h3>
            <p className="text-muted-foreground">
              {t('workspace.team.timeline.description')}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
