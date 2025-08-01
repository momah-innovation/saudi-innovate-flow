import { useState, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface UnsplashImage {
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
  attribution: {
    photographer: string
    photographer_username: string
    source: string
    source_url: string
    photographer_url: string
  }
}

export interface UnsplashSearchResult {
  total: number
  total_pages: number
  results: UnsplashImage[]
}

export function useUnsplashImages() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const searchImages = useCallback(async (
    query: string,
    page: number = 1,
    perPage: number = 20,
    orientation?: 'landscape' | 'portrait' | 'squarish'
  ): Promise<UnsplashSearchResult | null> => {
    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('unsplash-images', {
        body: {
          action: 'search',
          query,
          page: page.toString(),
          per_page: perPage.toString(),
          orientation
        }
      })

      if (error) throw error

      if (data.success) {
        return data.data
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error searching images:', error)
      toast({
        title: 'Search Failed',
        description: 'Failed to search images. Please try again.',
        variant: 'destructive'
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [toast])

  const downloadImage = useCallback(async (imageId: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('unsplash-images', {
        body: {
          action: 'download',
          id: imageId
        }
      })

      if (error) throw error

      if (data.success) {
        return data.download_url
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error downloading image:', error)
      toast({
        title: 'Download Failed',
        description: 'Failed to get download URL. Please try again.',
        variant: 'destructive'
      })
      return null
    }
  }, [toast])

  const getImageAttribution = useCallback((image: UnsplashImage): string => {
    return `Photo by ${image.attribution.photographer} on Unsplash`
  }, [])

  const getAttributionHtml = useCallback((image: UnsplashImage): string => {
    return `Photo by <a href="${image.attribution.photographer_url}" target="_blank" rel="noopener noreferrer">${image.attribution.photographer}</a> on <a href="${image.attribution.source_url}" target="_blank" rel="noopener noreferrer">Unsplash</a>`
  }, [])

  const saveImageToSupabase = useCallback(async (
    image: UnsplashImage,
    bucket: string,
    path: string
  ): Promise<string | null> => {
    try {
      // Get the download URL first
      const downloadUrl = await downloadImage(image.id)
      if (!downloadUrl) return null

      // Download the image
      const response = await fetch(downloadUrl)
      if (!response.ok) throw new Error('Failed to download image')

      const blob = await response.blob()
      const fileName = `${image.id}.jpg`
      const filePath = path ? `${path}/${fileName}` : fileName

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: true
        })

      if (error) throw error

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      return urlData.publicUrl
    } catch (error) {
      console.error('Error saving image to Supabase:', error)
      toast({
        title: 'Save Failed',
        description: 'Failed to save image to storage. Please try again.',
        variant: 'destructive'
      })
      return null
    }
  }, [downloadImage, toast])

  return {
    searchImages,
    downloadImage,
    getImageAttribution,
    getAttributionHtml,
    saveImageToSupabase,
    loading
  }
}