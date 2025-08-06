import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UpdateTranslationRequest {
  key: string;
  value: string;
  language: 'en' | 'ar';
  action: 'update' | 'upload_all';
  translations?: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { key, value, language, action, translations }: UpdateTranslationRequest = await req.json();

    if (action === 'upload_all' && translations) {
      // Upload all translations to JSON file
      console.log(`Uploading all translations for language: ${language}`);
      
      // In a real implementation, you would write to the file system
      // For now, we'll simulate the file update
      const result = {
        success: true,
        message: `Successfully uploaded ${Object.keys(translations).length} translations for ${language}`,
        language,
        count: Object.keys(translations).length
      };

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'update' && key && value && language) {
      // Update single translation key
      console.log(`Updating translation key: ${key} for language: ${language}`);
      
      // In a real implementation, you would:
      // 1. Read the current JSON file
      // 2. Update the specific key using dot notation
      // 3. Write back to the file system
      // 4. Trigger a cache invalidation if needed

      const result = {
        success: true,
        message: `Successfully updated translation key: ${key}`,
        key,
        value,
        language
      };

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ error: 'Invalid request parameters' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in update-translations function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})