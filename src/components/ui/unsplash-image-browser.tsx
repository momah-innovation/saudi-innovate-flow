import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { 
  Search, 
  Download, 
  Heart, 
  User, 
  ExternalLink, 
  Grid, 
  List,
  Filter,
  Loader2,
  Check
} from 'lucide-react'

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
  attribution: {
    photographer: string
    photographer_username: string
    source: string
    source_url: string
    photographer_url: string
  }
}

interface UnsplashImageBrowserProps {
  onImageSelect: (image: UnsplashImage) => void
  selectedImages?: UnsplashImage[]
  maxSelection?: number
  className?: string
}

export function UnsplashImageBrowser({ 
  onImageSelect, 
  selectedImages = [], 
  maxSelection = 1,
  className 
}: UnsplashImageBrowserProps) {
  const { toast } = useToast()
  const [images, setImages] = useState<UnsplashImage[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('business technology')
  const [orientation, setOrientation] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedImage, setSelectedImage] = useState<UnsplashImage | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const searchImages = useCallback(async (query: string, pageNum: number = 1, reset: boolean = true) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('unsplash-images', {
        body: {
          action: 'search',
          query,
          page: pageNum.toString(),
          per_page: '20',
          orientation: orientation !== 'all' ? orientation : undefined
        }
      })

      if (error) throw error

      if (data.success) {
        const newImages = data.data.results || []
        if (reset) {
          setImages(newImages)
        } else {
          setImages(prev => [...prev, ...newImages])
        }
        setHasMore(newImages.length === 20)
        setPage(pageNum)
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
    } finally {
      setLoading(false)
    }
  }, [orientation, toast])

  const loadMore = () => {
    if (!loading && hasMore) {
      searchImages(searchQuery, page + 1, false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      searchImages(searchQuery.trim(), 1, true)
    }
  }

  const handleImageClick = (image: UnsplashImage) => {
    if (maxSelection === 1) {
      onImageSelect(image)
    } else {
      setSelectedImage(image)
      setShowPreview(true)
    }
  }

  const handleImageSelect = (image: UnsplashImage) => {
    onImageSelect(image)
    if (maxSelection === 1) {
      setShowPreview(false)
    }
  }

  const isImageSelected = (image: UnsplashImage) => {
    return selectedImages.some(selected => selected.id === image.id)
  }

  const getImageGridClass = () => {
    if (viewMode === 'list') {
      return 'grid grid-cols-1 gap-4'
    }
    return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
  }

  // Initial search
  useEffect(() => {
    searchImages(searchQuery)
  }, [searchImages])

  // Reset search when orientation changes
  useEffect(() => {
    if (searchQuery) {
      searchImages(searchQuery, 1, true)
    }
  }, [orientation])

  return (
    <div className={`h-full flex flex-col space-y-4 ${className}`}>
      {/* Search and Filters - Fixed Header */}
      <div className="flex-shrink-0 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
          </Button>
        </form>

        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={orientation} onValueChange={setOrientation}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="landscape">Landscape</SelectItem>
                <SelectItem value="portrait">Portrait</SelectItem>
                <SelectItem value="squarish">Square</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Results Section */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Quick Search Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {['business', 'technology', 'team', 'office', 'innovation', 'data', 'meeting', 'workspace'].map(tag => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => {
                setSearchQuery(tag)
                searchImages(tag, 1, true)
              }}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Images Grid */}
        <div className={getImageGridClass()}>
        {images.map((image) => (
          <Card
            key={image.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              isImageSelected(image) ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleImageClick(image)}
          >
            <CardContent className="p-0">
              <div className="relative group">
                <img
                  src={image.urls.small}
                  alt={image.alt_description || image.description || 'Unsplash image'}
                  className="w-full h-48 object-cover rounded-t-lg"
                  loading="lazy"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-t-lg" />
                
                {/* Selection indicator */}
                {isImageSelected(image) && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
                
                {/* Image info overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2 text-white text-xs">
                    <Heart className="h-3 w-3" />
                    <span>{image.likes}</span>
                    <div className="flex items-center gap-1 ml-auto">
                      <img
                        src={image.user.profile_image.small}
                        alt={image.user.name}
                        className="w-4 h-4 rounded-full"
                      />
                      <span className="truncate max-w-20">{image.user.name}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {viewMode === 'list' && (
                <div className="p-3">
                  <p className="text-sm font-medium line-clamp-2">
                    {image.alt_description || image.description || 'Untitled'}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{image.user.name}</span>
                    <span>•</span>
                    <span>{image.width} × {image.height}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        </div>

        {/* Load More */}
        {hasMore && !loading && images.length > 0 && (
          <div className="text-center pt-4">
            <Button onClick={loadMore} variant="outline">
              Load More Images
            </Button>
          </div>
        )}

        {loading && images.length === 0 && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Searching for images...</p>
          </div>
        )}

        {!loading && images.length === 0 && searchQuery && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No images found for "{searchQuery}"</p>
            <p className="text-sm text-muted-foreground mt-1">Try a different search term</p>
          </div>
        )}
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          
          {selectedImage && (
            <div className="space-y-4">
              <img
                src={selectedImage.urls.regular}
                alt={selectedImage.alt_description || selectedImage.description || 'Unsplash image'}
                className="w-full max-h-96 object-contain rounded-lg"
              />
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium">
                    {selectedImage.alt_description || selectedImage.description || 'Untitled'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedImage.width} × {selectedImage.height} pixels
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <img
                    src={selectedImage.user.profile_image.small}
                    alt={selectedImage.user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-sm">{selectedImage.user.name}</p>
                    <p className="text-xs text-muted-foreground">@{selectedImage.user.username}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                    onClick={() => window.open(selectedImage.attribution.photographer_url, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Profile
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleImageSelect(selectedImage)}
                    className="flex-1"
                    disabled={isImageSelected(selectedImage) || (maxSelection > 1 && selectedImages.length >= maxSelection)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isImageSelected(selectedImage) ? 'Selected' : 'Select Image'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(selectedImage.attribution.source_url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                  Photo by{' '}
                  <a
                    href={selectedImage.attribution.photographer_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {selectedImage.attribution.photographer}
                  </a>{' '}
                  on{' '}
                  <a
                    href={selectedImage.attribution.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Unsplash
                  </a>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}