import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SystemTranslation {
  translation_key: string;
  language_code: string;
  translation_text: string;
  category: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch all translations from database
    const { data: translations, error } = await supabase
      .from('system_translations')
      .select('*')

    if (error) {
      throw error
    }

    // Group translations by language and category
    const translationsByLanguage: Record<string, Record<string, Record<string, any>>> = {}

    translations?.forEach((translation: SystemTranslation) => {
      const { language_code, translation_key, translation_text, category } = translation
      
      if (!translationsByLanguage[language_code]) {
        translationsByLanguage[language_code] = {}
      }
      
      if (!translationsByLanguage[language_code][category]) {
        translationsByLanguage[language_code][category] = {}
      }

      // Handle nested keys (e.g., "settings.ui.theme")
      const keyParts = translation_key.split('.')
      let current = translationsByLanguage[language_code][category]

      for (let i = 0; i < keyParts.length - 1; i++) {
        const part = keyParts[i]
        if (!current[part]) {
          current[part] = {}
        }
        current = current[part]
      }

      current[keyParts[keyParts.length - 1]] = translation_text
    })

    // Add static base translations that should always exist
    const baseTranslations = {
      en: {
        toggle_theme: "Toggle theme",
        open_navigation: "Open navigation menu", 
        toggle_direction: "Toggle text direction",
        switch_language: "Switch language",
        item: "item",
        items: "items",
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        create: "Create",
        loading: "Loading...",
        error: "Error",
        success: "Success"
      },
      ar: {
        toggle_theme: "تبديل المظهر",
        open_navigation: "فتح قائمة التنقل",
        toggle_direction: "تبديل اتجاه النص", 
        switch_language: "تبديل اللغة",
        item: "عنصر",
        items: "عناصر",
        save: "حفظ",
        cancel: "إلغاء",
        delete: "حذف",
        edit: "تعديل",
        create: "إنشاء",
        loading: "جارٍ التحميل...",
        error: "خطأ",
        success: "نجح"
      }
    }

    // Merge base translations with database translations
    Object.keys(baseTranslations).forEach(lang => {
      if (!translationsByLanguage[lang]) {
        translationsByLanguage[lang] = {}
      }
      translationsByLanguage[lang] = {
        ...baseTranslations[lang as keyof typeof baseTranslations],
        ...translationsByLanguage[lang]
      }
    })

    // Get request parameters
    const url = new URL(req.url)
    const language = url.searchParams.get('language')
    const category = url.searchParams.get('category')
    const format = url.searchParams.get('format') || 'multiple'

    if (language && category) {
      // Return specific language + category file
      const categoryTranslations = translationsByLanguage[language]?.[category]
      if (!categoryTranslations) {
        return new Response(
          JSON.stringify({ error: `Category '${category}' not found for language '${language}'` }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify(categoryTranslations, null, 2),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="${language}-${category}.json"`
          }
        }
      )
    }

    if (format === 'single') {
      // Legacy: Return single files per language
      const flatTranslations: Record<string, Record<string, any>> = {}
      Object.entries(translationsByLanguage).forEach(([lang, categories]) => {
        flatTranslations[lang] = {}
        Object.values(categories).forEach(categoryData => {
          Object.assign(flatTranslations[lang], categoryData)
        })
      })

      return new Response(
        JSON.stringify({
          generated_at: new Date().toISOString(),
          format: 'single',
          languages: Object.keys(flatTranslations),
          translations: flatTranslations
        }, null, 2),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Default: Return multiple files structure
    return new Response(
      JSON.stringify({
        generated_at: new Date().toISOString(),
        format: 'multiple',
        languages: Object.keys(translationsByLanguage),
        translation_count: translations?.length || 0,
        structure: translationsByLanguage
      }, null, 2),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error generating translation files:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})