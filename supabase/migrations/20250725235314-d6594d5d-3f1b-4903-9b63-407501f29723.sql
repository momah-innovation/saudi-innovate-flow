-- Create challenge_requirements table
CREATE TABLE public.challenge_requirements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    challenge_id UUID NOT NULL,
    requirement_type VARCHAR NOT NULL CHECK (requirement_type IN ('document', 'criteria', 'general')),
    title VARCHAR NOT NULL,
    description TEXT,
    is_mandatory BOOLEAN DEFAULT true,
    order_sequence INTEGER DEFAULT 0,
    weight_percentage NUMERIC DEFAULT NULL, -- For evaluation criteria weighting
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.challenge_requirements ENABLE ROW LEVEL SECURITY;

-- Create policies for challenge requirements
CREATE POLICY "Users can view challenge requirements" 
ON public.challenge_requirements 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage challenge requirements" 
ON public.challenge_requirements 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_challenge_requirements_updated_at
BEFORE UPDATE ON public.challenge_requirements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_challenge_requirements_challenge_id ON public.challenge_requirements(challenge_id);
CREATE INDEX idx_challenge_requirements_type ON public.challenge_requirements(requirement_type);