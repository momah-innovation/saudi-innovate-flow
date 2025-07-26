-- Fix search_path security issue in functions
CREATE OR REPLACE FUNCTION public.generate_invitation_token()
RETURNS VARCHAR
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64url');
END;
$$;