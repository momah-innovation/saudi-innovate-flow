import { supabase } from "@/integrations/supabase/client";

export const downloadOpportunityImages = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('download-opportunity-images');
    
    if (error) {
      console.error('Error calling download-opportunity-images function:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Download opportunity images result:', data);
    return data;
  } catch (error) {
    console.error('Error downloading opportunity images:', error);
    return { success: false, error: error.message };
  }
};