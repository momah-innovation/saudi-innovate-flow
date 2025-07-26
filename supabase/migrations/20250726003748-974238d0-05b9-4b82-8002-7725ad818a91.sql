-- Fix the function to have proper search_path
CREATE OR REPLACE FUNCTION public.assign_default_innovator_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert innovator role for new user
  INSERT INTO public.user_roles (user_id, role, is_active)
  VALUES (NEW.id, 'innovator'::app_role, true);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';