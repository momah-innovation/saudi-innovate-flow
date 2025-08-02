-- Assign admin role to the authenticated user (from console logs: 8066cfaf-4a91-4985-922b-74f6a286c441)
INSERT INTO public.user_roles (user_id, role, is_active, granted_at)
VALUES ('8066cfaf-4a91-4985-922b-74f6a286c441'::uuid, 'admin'::app_role, true, now())
ON CONFLICT (user_id, role) DO UPDATE SET
  is_active = true,
  granted_at = now();