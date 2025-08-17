-- Fix remaining RLS policies for tables without complete coverage

-- RLS Policies for workspace_invitations table
CREATE POLICY "Users can view invitations sent to them"
ON public.workspace_invitations FOR SELECT
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
  OR
  invited_by = auth.uid()
  OR
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Workspace admins can manage invitations"
ON public.workspace_invitations FOR ALL
USING (
  invited_by = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM public.workspaces w 
    WHERE w.id = workspace_id 
    AND (
      w.owner_id = auth.uid() 
      OR 
      has_role(auth.uid(), 'admin'::app_role)
      OR
      EXISTS (
        SELECT 1 FROM public.workspace_members wm 
        WHERE wm.workspace_id = w.id 
        AND wm.user_id = auth.uid() 
        AND wm.role IN ('admin', 'manager')
        AND wm.status = 'active'
      )
    )
  )
);

-- RLS Policies for project_tasks table  
CREATE POLICY "Users can view tasks in accessible projects"
ON public.project_tasks FOR SELECT
USING (
  assigned_to = auth.uid()
  OR
  assigned_by = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM public.workspace_projects wp
    JOIN public.workspace_members wm ON wm.workspace_id = wp.workspace_id
    WHERE wp.id = project_tasks.project_id 
    AND wm.user_id = auth.uid() 
    AND wm.status = 'active'
  )
  OR
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Project members can create tasks"
ON public.project_tasks FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.workspace_projects wp
    JOIN public.workspace_members wm ON wm.workspace_id = wp.workspace_id
    WHERE wp.id = project_tasks.project_id 
    AND wm.user_id = auth.uid() 
    AND wm.status = 'active'
  )
);

CREATE POLICY "Task assignees and project members can update tasks"
ON public.project_tasks FOR UPDATE
USING (
  assigned_to = auth.uid()
  OR
  assigned_by = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM public.workspace_projects wp
    JOIN public.workspace_members wm ON wm.workspace_id = wp.workspace_id
    WHERE wp.id = project_tasks.project_id 
    AND wm.user_id = auth.uid() 
    AND wm.role IN ('admin', 'manager')
    AND wm.status = 'active'
  )
);

-- RLS Policies for task_assignments table
CREATE POLICY "Users can view their task assignments"
ON public.task_assignments FOR SELECT
USING (
  assignee_id = auth.uid()
  OR
  assigned_by = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM public.project_tasks pt
    JOIN public.workspace_projects wp ON wp.id = pt.project_id
    JOIN public.workspace_members wm ON wm.workspace_id = wp.workspace_id
    WHERE pt.id = task_assignments.task_id 
    AND wm.user_id = auth.uid() 
    AND wm.status = 'active'
  )
  OR
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Project members can manage task assignments"
ON public.task_assignments FOR ALL
USING (
  assigned_by = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM public.project_tasks pt
    JOIN public.workspace_projects wp ON wp.id = pt.project_id
    JOIN public.workspace_members wm ON wm.workspace_id = wp.workspace_id
    WHERE pt.id = task_assignments.task_id 
    AND wm.user_id = auth.uid() 
    AND wm.role IN ('admin', 'manager')
    AND wm.status = 'active'
  )
);

-- RLS Policies for workspace_meetings table
CREATE POLICY "Users can view meetings in accessible workspaces"
ON public.workspace_meetings FOR SELECT
USING (
  organizer_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM public.workspace_members wm 
    WHERE wm.workspace_id = workspace_meetings.workspace_id 
    AND wm.user_id = auth.uid() 
    AND wm.status = 'active'
  )
  OR
  EXISTS (
    SELECT 1 FROM public.meeting_participants mp 
    WHERE mp.meeting_id = workspace_meetings.id 
    AND mp.user_id = auth.uid()
  )
  OR
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Workspace members can create meetings"
ON public.workspace_meetings FOR INSERT
WITH CHECK (
  organizer_id = auth.uid()
  AND
  EXISTS (
    SELECT 1 FROM public.workspace_members wm 
    WHERE wm.workspace_id = workspace_meetings.workspace_id 
    AND wm.user_id = auth.uid() 
    AND wm.status = 'active'
  )
);

CREATE POLICY "Meeting organizers can update meetings"
ON public.workspace_meetings FOR UPDATE
USING (
  organizer_id = auth.uid()
  OR
  has_role(auth.uid(), 'admin'::app_role)
);

-- RLS Policies for meeting_participants table
CREATE POLICY "Users can view meeting participants for accessible meetings"
ON public.meeting_participants FOR SELECT
USING (
  user_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM public.workspace_meetings wm 
    WHERE wm.id = meeting_participants.meeting_id 
    AND (
      wm.organizer_id = auth.uid()
      OR
      EXISTS (
        SELECT 1 FROM public.workspace_members wmem 
        WHERE wmem.workspace_id = wm.workspace_id 
        AND wmem.user_id = auth.uid() 
        AND wmem.status = 'active'
      )
    )
  )
  OR
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Meeting organizers can manage participants"
ON public.meeting_participants FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.workspace_meetings wm 
    WHERE wm.id = meeting_participants.meeting_id 
    AND wm.organizer_id = auth.uid()
  )
  OR
  has_role(auth.uid(), 'admin'::app_role)
);

-- RLS Policies for workspace_activity_feed table
CREATE POLICY "Users can view activity in accessible workspaces"
ON public.workspace_activity_feed FOR SELECT
USING (
  actor_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM public.workspace_members wm 
    WHERE wm.workspace_id = workspace_activity_feed.workspace_id 
    AND wm.user_id = auth.uid() 
    AND wm.status = 'active'
  )
  OR
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users can create activity in accessible workspaces"
ON public.workspace_activity_feed FOR INSERT
WITH CHECK (
  actor_id = auth.uid()
  AND
  EXISTS (
    SELECT 1 FROM public.workspace_members wm 
    WHERE wm.workspace_id = workspace_activity_feed.workspace_id 
    AND wm.user_id = auth.uid() 
    AND wm.status = 'active'
  )
);

-- RLS Policies for workspace_settings table
CREATE POLICY "Workspace admins can manage settings"
ON public.workspace_settings FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.workspaces w 
    WHERE w.id = workspace_id 
    AND (
      w.owner_id = auth.uid() 
      OR 
      has_role(auth.uid(), 'admin'::app_role)
      OR
      EXISTS (
        SELECT 1 FROM public.workspace_members wm 
        WHERE wm.workspace_id = w.id 
        AND wm.user_id = auth.uid() 
        AND wm.role IN ('admin', 'manager')
        AND wm.status = 'active'
      )
    )
  )
);

-- RLS Policies for workspace_analytics table
CREATE POLICY "Workspace members can view analytics"
ON public.workspace_analytics FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members wm 
    WHERE wm.workspace_id = workspace_analytics.workspace_id 
    AND wm.user_id = auth.uid() 
    AND wm.status = 'active'
  )
  OR
  has_role(auth.uid(), 'admin'::app_role)
);

-- RLS Policies for workspace_files table
CREATE POLICY "Users can view files in accessible workspaces"
ON public.workspace_files FOR SELECT
USING (
  uploaded_by = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM public.workspace_members wm 
    WHERE wm.workspace_id = workspace_files.workspace_id 
    AND wm.user_id = auth.uid() 
    AND wm.status = 'active'
  )
  OR
  access_level = 'public'
  OR
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Workspace members can upload files"
ON public.workspace_files FOR INSERT
WITH CHECK (
  uploaded_by = auth.uid()
  AND
  EXISTS (
    SELECT 1 FROM public.workspace_members wm 
    WHERE wm.workspace_id = workspace_files.workspace_id 
    AND wm.user_id = auth.uid() 
    AND wm.status = 'active'
  )
);

CREATE POLICY "File uploaders can update their files"
ON public.workspace_files FOR UPDATE
USING (
  uploaded_by = auth.uid()
  OR
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "File uploaders can delete their files"
ON public.workspace_files FOR DELETE
USING (
  uploaded_by = auth.uid()
  OR
  has_role(auth.uid(), 'admin'::app_role)
);