import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting to download and store opportunity images...')

    // Get opportunities without image URLs
    const { data: opportunities, error: fetchError } = await supabase
      .from('opportunities')
      .select('id, title_ar')
      .or('image_url.is.null,image_url.eq.')

    if (fetchError) {
      console.error('Error fetching opportunities:', fetchError)
      throw fetchError
    }

    console.log(`Found ${opportunities?.length || 0} opportunities without images`)

    const imageUrls = [
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=800&h=400&fit=crop'
    ]

    const results = []

    for (let i = 0; i < (opportunities?.length || 0); i++) {
      const opportunity = opportunities![i]
      const imageUrl = imageUrls[i % imageUrls.length]
      
      try {
        console.log(`Downloading image for opportunity: ${opportunity.title_ar}`)
        
        // Download the image
        const imageResponse = await fetch(imageUrl)
        if (!imageResponse.ok) {
          throw new Error(`Failed to download image: ${imageResponse.statusText}`)
        }
        
        const imageBlob = await imageResponse.blob()
        const fileName = `opportunity-${opportunity.id}.jpg`
        
        // Upload to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('opportunity-images')
          .upload(fileName, imageBlob, {
            contentType: 'image/jpeg',
            upsert: true
          })

        if (uploadError) {
          console.error(`Error uploading image for ${opportunity.id}:`, uploadError)
          throw uploadError
        }

        console.log(`Uploaded image for opportunity ${opportunity.id}:`, uploadData.path)

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('opportunity-images')
          .getPublicUrl(fileName)

        // Update the opportunity record
        const { error: updateError } = await supabase
          .from('opportunities')
          .update({ image_url: publicUrl })
          .eq('id', opportunity.id)

        if (updateError) {
          console.error(`Error updating opportunity ${opportunity.id}:`, updateError)
          throw updateError
        }

        console.log(`Updated opportunity ${opportunity.id} with image URL: ${publicUrl}`)
        
        results.push({
          id: opportunity.id,
          title: opportunity.title_ar,
          imageUrl: publicUrl,
          success: true
        })

      } catch (error) {
        console.error(`Failed to process opportunity ${opportunity.id}:`, error)
        results.push({
          id: opportunity.id,
          title: opportunity.title_ar,
          error: error.message,
          success: false
        })
      }
    }

    console.log('Finished processing all opportunities')

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${opportunities?.length || 0} opportunities`,
        results
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in download-opportunity-images function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})