-- Add admin and super_admin roles to momah.innovation@gmail.com
-- First, let's find the user ID for the email
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Get the user ID for the admin email
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'momah.innovation@gmail.com';
    
    -- Check if user exists
    IF admin_user_id IS NOT NULL THEN
        -- Insert admin role
        INSERT INTO public.user_roles (user_id, role, is_active, granted_at, granted_by)
        VALUES (admin_user_id, 'admin', true, now(), admin_user_id)
        ON CONFLICT (user_id, role) DO UPDATE SET
            is_active = true,
            granted_at = now();
            
        -- Insert super_admin role
        INSERT INTO public.user_roles (user_id, role, is_active, granted_at, granted_by)
        VALUES (admin_user_id, 'super_admin', true, now(), admin_user_id)
        ON CONFLICT (user_id, role) DO UPDATE SET
            is_active = true,
            granted_at = now();
            
        RAISE NOTICE 'Successfully granted admin and super_admin roles to user: %', admin_user_id;
    ELSE
        RAISE EXCEPTION 'User with email momah.innovation@gmail.com not found';
    END IF;
END $$;