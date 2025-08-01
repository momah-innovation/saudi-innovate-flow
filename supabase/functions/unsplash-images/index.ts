import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UnsplashImage {
  id: string
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  alt_description: string | null
  description: string | null
  user: {
    name: string
    username: string
    profile_image: {
      small: string
    }
  }
  width: number
  height: number
  color: string
  likes: number
  download_url?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const UNSPLASH_ACCESS_KEY = Deno.env.get('UNSPLASH_ACCESS_KEY')
    if (!UNSPLASH_ACCESS_KEY) {
      throw new Error('UNSPLASH_ACCESS_KEY is not configured')
    }

    const url = new URL(req.url)
    const action = url.searchParams.get('action') || 'search'
    
    let unsplashUrl = ''
    let params = new URLSearchParams()
    
    switch (action) {
      case 'search':
        const query = url.searchParams.get('query') || 'technology'
        const page = url.searchParams.get('page') || '1'
        const perPage = url.searchParams.get('per_page') || '20'
        const orientation = url.searchParams.get('orientation')
        const category = url.searchParams.get('category')
        
        params.append('query', query)
        params.append('page', page)
        params.append('per_page', perPage)
        if (orientation) params.append('orientation', orientation)
        if (category) params.append('category', category)
        
        unsplashUrl = `https://api.unsplash.com/search/photos?${params.toString()}`
        break
        
      case 'collections':
        const collectionPage = url.searchParams.get('page') || '1'
        params.append('page', collectionPage)
        params.append('per_page', '12')
        
        unsplashUrl = `https://api.unsplash.com/collections?${params.toString()}`
        break
        
      case 'collection':
        const collectionId = url.searchParams.get('id')
        if (!collectionId) {
          throw new Error('Collection ID is required')
        }
        const collectionPhotosPage = url.searchParams.get('page') || '1'
        params.append('page', collectionPhotosPage)
        params.append('per_page', '20')
        
        unsplashUrl = `https://api.unsplash.com/collections/${collectionId}/photos?${params.toString()}`
        break
        
      case 'download':
        const photoId = url.searchParams.get('id')
        if (!photoId) {
          throw new Error('Photo ID is required')
        }
        
        // First get the download link
        const downloadResponse = await fetch(`https://api.unsplash.com/photos/${photoId}/download`, {
          headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
          }
        })
        
        if (!downloadResponse.ok) {
          throw new Error('Failed to get download URL')
        }
        
        const downloadData = await downloadResponse.json()
        
        return new Response(JSON.stringify({
          success: true,
          download_url: downloadData.url
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
        
      default:
        throw new Error('Invalid action')
    }

    console.log('Fetching from Unsplash:', unsplashUrl)
    
    const response = await fetch(unsplashUrl, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        'Accept-Version': 'v1'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Unsplash API error:', response.status, errorText)
      throw new Error(`Unsplash API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Transform the data to include attribution info
    let transformedData
    
    if (action === 'search') {
      transformedData = {
        ...data,
        results: data.results?.map((photo: UnsplashImage) => ({
          ...photo,
          attribution: {
            photographer: photo.user.name,
            photographer_username: photo.user.username,
            source: 'Unsplash',
            source_url: `https://unsplash.com/photos/${photo.id}`,
            photographer_url: `https://unsplash.com/@${photo.user.username}`
          }
        }))
      }
    } else if (action === 'collection') {
      transformedData = data.map((photo: UnsplashImage) => ({
        ...photo,
        attribution: {
          photographer: photo.user.name,
          photographer_username: photo.user.username,
          source: 'Unsplash',
          source_url: `https://unsplash.com/photos/${photo.id}`,
          photographer_url: `https://unsplash.com/@${photo.user.username}`
        }
      }))
    } else {
      transformedData = data
    }

    return new Response(JSON.stringify({
      success: true,
      data: transformedData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in unsplash-images function:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Internal server error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})