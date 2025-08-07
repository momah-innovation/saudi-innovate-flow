import { supabase } from "@/integrations/supabase/client";
import { logger } from './logger';

export const downloadOpportunityImages = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('download-opportunity-images');
    
    if (error) {
      logger.error('Error calling download-opportunity-images function', { 
        component: 'DownloadOpportunityImages',
        action: 'invokeFunction'
      }, error);
      return { success: false, error: error.message };
    }
    
    logger.info('Download opportunity images completed', { 
      component: 'DownloadOpportunityImages',
      action: 'downloadComplete',
      data 
    });
    return data;
  } catch (error) {
    logger.error('Error downloading opportunity images', { 
      component: 'DownloadOpportunityImages',
      action: 'downloadError' 
    }, error);
    return { success: false, error: error.message };
  }
};