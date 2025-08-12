-- =============================================
-- PART 3: ADD RLS POLICIES AND ROLE HIERARCHY (FINAL)
-- =============================================

-- 1. Add organization_member to role hierarchy (using correct enum type)
INSERT INTO public.role_hierarchy (role, hierarchy_level, can_assign_roles, requires_approval_for)
VALUES (
  'organization_member'::app_role, 
  '2'::role_hierarchy_level, 
  ARRAY[]::app_role[], 
  ARRAY[]::app_role[]
) ON CONFLICT (role) DO NOTHING;

-- 2. Create RLS policies for organizations
CREATE POLICY "Everyone can view active organizations" ON public.organizations
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage organizations" ON public.organizations
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- 3. Create RLS policies for organization_members
CREATE POLICY "Members can view their organization membership" ON public.organization_members
FOR SELECT USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Members can update their own membership" ON public.organization_members
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage organization members" ON public.organization_members
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- 4. Create RLS policies for focus_question_entity_links
CREATE POLICY "Team members can manage focus question entity links" ON public.focus_question_entity_links
FOR ALL USING (
  EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid() AND status = 'active') 
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Everyone can view focus question entity links" ON public.focus_question_entity_links
FOR SELECT USING (true);

-- 5. Create RLS policies for focus_question_challenge_links
CREATE POLICY "Team members can manage focus question challenge links" ON public.focus_question_challenge_links
FOR ALL USING (
  EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid() AND status = 'active') 
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Everyone can view focus question challenge links" ON public.focus_question_challenge_links
FOR SELECT USING (true);

-- 6. Create RLS policies for user_entity_assignments
CREATE POLICY "Users can view their entity assignments" ON public.user_entity_assignments
FOR SELECT USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage user entity assignments" ON public.user_entity_assignments
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- 7. Create RLS policies for team_entity_assignments
CREATE POLICY "Team members can view team entity assignments" ON public.team_entity_assignments
FOR SELECT USING (
  EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid() AND status = 'active') 
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Team leads can manage team entity assignments" ON public.team_entity_assignments
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'team_lead'::app_role));