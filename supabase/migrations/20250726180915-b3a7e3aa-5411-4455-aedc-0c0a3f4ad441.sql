-- Clean up orphaned references before adding foreign key constraints

-- Clean up challenges table orphaned references
UPDATE public.challenges 
SET sub_domain_id = NULL 
WHERE sub_domain_id IS NOT NULL 
AND sub_domain_id NOT IN (SELECT id FROM public.domains);

UPDATE public.challenges 
SET domain_id = NULL 
WHERE domain_id IS NOT NULL 
AND domain_id NOT IN (SELECT id FROM public.domains);

UPDATE public.challenges 
SET service_id = NULL 
WHERE service_id IS NOT NULL 
AND service_id NOT IN (SELECT id FROM public.services);

UPDATE public.challenges 
SET sector_id = NULL 
WHERE sector_id IS NOT NULL 
AND sector_id NOT IN (SELECT id FROM public.sectors);

UPDATE public.challenges 
SET department_id = NULL 
WHERE department_id IS NOT NULL 
AND department_id NOT IN (SELECT id FROM public.departments);

UPDATE public.challenges 
SET deputy_id = NULL 
WHERE deputy_id IS NOT NULL 
AND deputy_id NOT IN (SELECT id FROM public.deputies);

-- Clean up campaigns table orphaned references
UPDATE public.campaigns 
SET challenge_id = NULL 
WHERE challenge_id IS NOT NULL 
AND challenge_id NOT IN (SELECT id FROM public.challenges);

UPDATE public.campaigns 
SET sector_id = NULL 
WHERE sector_id IS NOT NULL 
AND sector_id NOT IN (SELECT id FROM public.sectors);

UPDATE public.campaigns 
SET department_id = NULL 
WHERE department_id IS NOT NULL 
AND department_id NOT IN (SELECT id FROM public.departments);

UPDATE public.campaigns 
SET deputy_id = NULL 
WHERE deputy_id IS NOT NULL 
AND deputy_id NOT IN (SELECT id FROM public.deputies);

-- Clean up events table orphaned references
UPDATE public.events 
SET campaign_id = NULL 
WHERE campaign_id IS NOT NULL 
AND campaign_id NOT IN (SELECT id FROM public.campaigns);

UPDATE public.events 
SET challenge_id = NULL 
WHERE challenge_id IS NOT NULL 
AND challenge_id NOT IN (SELECT id FROM public.challenges);

UPDATE public.events 
SET sector_id = NULL 
WHERE sector_id IS NOT NULL 
AND sector_id NOT IN (SELECT id FROM public.sectors);

-- Clean up array fields with invalid UUIDs
UPDATE public.campaigns 
SET partner_organizations = ARRAY(
  SELECT unnest(partner_organizations)::uuid 
  FROM (VALUES (partner_organizations)) AS t(partner_organizations)
  WHERE unnest(partner_organizations)::uuid IN (SELECT id FROM public.partners)
)
WHERE partner_organizations IS NOT NULL;

UPDATE public.campaigns 
SET target_stakeholder_groups = ARRAY(
  SELECT unnest(target_stakeholder_groups)::uuid 
  FROM (VALUES (target_stakeholder_groups)) AS t(target_stakeholder_groups)
  WHERE unnest(target_stakeholder_groups)::uuid IN (SELECT id FROM public.stakeholders)
)
WHERE target_stakeholder_groups IS NOT NULL;

UPDATE public.events 
SET partner_organizations = ARRAY(
  SELECT unnest(partner_organizations)::uuid 
  FROM (VALUES (partner_organizations)) AS t(partner_organizations)
  WHERE unnest(partner_organizations)::uuid IN (SELECT id FROM public.partners)
)
WHERE partner_organizations IS NOT NULL;

UPDATE public.events 
SET target_stakeholder_groups = ARRAY(
  SELECT unnest(target_stakeholder_groups)::uuid 
  FROM (VALUES (target_stakeholder_groups)) AS t(target_stakeholder_groups)
  WHERE unnest(target_stakeholder_groups)::uuid IN (SELECT id FROM public.stakeholders)
)
WHERE target_stakeholder_groups IS NOT NULL;

UPDATE public.events 
SET related_focus_questions = ARRAY(
  SELECT unnest(related_focus_questions)::uuid 
  FROM (VALUES (related_focus_questions)) AS t(related_focus_questions)
  WHERE unnest(related_focus_questions)::uuid IN (SELECT id FROM public.focus_questions)
)
WHERE related_focus_questions IS NOT NULL;