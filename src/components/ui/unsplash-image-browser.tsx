import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Search, Grid, List, Loader2, Download, Heart, User, Calendar, 
  Palette, SlidersHorizontal, ArrowUp, ArrowLeft, ArrowRight, 
  Eye, ChevronDown, ChevronUp, RotateCcw, TrendingUp, Clock,
  Layers, Maximize2, Check, X, Filter, Settings, Grid3X3
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { logger } from '@/utils/logger'
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation'
import { useTimerManager } from '@/utils/timerManager';
import { errorHandler } from '@/utils/error-handler';

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
  downloads?: number
  views?: number
  created_at?: string
  tags?: Array<{ title: string }>
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

type ViewMode = 'grid' | 'list' | 'masonry'
type GridSize = 'compact' | 'standard' | 'large'
type SortOption = 'relevant' | 'latest' | 'popular' | 'downloads'
type SizeFilter = 'all' | 'small' | 'medium' | 'large' | 'extra_large'

const GRID_SIZES = {
  compact: 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8',
  standard: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  large: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
}

const COLOR_FILTERS = [
  { name: 'All', value: 'all', color: 'transparent' },
  { name: 'Red', value: 'red', color: '#ef4444' },
  { name: 'Orange', value: 'orange', color: '#f97316' },
  { name: 'Yellow', value: 'yellow', color: '#eab308' },
  { name: 'Green', value: 'green', color: '#22c55e' },
  { name: 'Blue', value: 'blue', color: '#3b82f6' },
  { name: 'Purple', value: 'purple', color: '#a855f7' },
  { name: 'Pink', value: 'pink', color: '#ec4899' },
  { name: 'Black', value: 'black', color: '#000000' },
  { name: 'White', value: 'white', color: '#ffffff' }
]

const TRENDING_SEARCHES = [
  'business', 'technology', 'team', 'office', 'innovation', 'data', 
  'meeting', 'workspace', 'startup', 'finance', 'growth', 'strategy'
]

const CATEGORY_TAGS = [
  'Business', 'Technology', 'People', 'Nature', 'Architecture', 
  'Food', 'Travel', 'Fashion', 'Health', 'Education', 'Sports', 'Art'
]

export function UnsplashImageBrowser({
  onImageSelect,
  selectedImages = [],
  maxSelection = 1,
  className
}: UnsplashImageBrowserProps) {
  const { t } = useUnifiedTranslation();
  // Core state
  const [images, setImages] = useState<UnsplashImage[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [previewImage, setPreviewImage] = useState<UnsplashImage | null>(null)

  // Advanced filtering
  const [orientation, setOrientation] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('relevant')
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>('all')
  const [colorFilter, setColorFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Layout and view options
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [gridSize, setGridSize] = useState<GridSize>('standard')
  const [showDetails, setShowDetails] = useState(true)
  const [infiniteScroll, setInfiniteScroll] = useState(false)

  // Selection and preview
  const [bulkSelectMode, setBulkSelectMode] = useState(false)
  const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(new Set())
  const [hoveredImage, setHoveredImage] = useState<string | null>(null)
  const [showJumpToTop, setShowJumpToTop] = useState(false)

  // Search and discovery
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<UnsplashImage[]>([])

  // UI state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [thumbnailSize, setThumbnailSize] = useState([150])

  // Refs
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Load preferences from localStorage
  useEffect(() => {
    const preferences = localStorage.getItem('unsplash-browser-preferences')
    if (preferences) {
      try {
        const parsed = JSON.parse(preferences)
        setViewMode(parsed.viewMode || 'grid')
        setGridSize(parsed.gridSize || 'standard')
        setInfiniteScroll(parsed.infiniteScroll || false)
        setShowDetails(parsed.showDetails !== false)
        setThumbnailSize([parsed.thumbnailSize || 150])
      } catch (error) {
        logger.error('Error loading preferences', { component: 'UnsplashImageBrowser', action: 'loadPreferences' }, error as Error)
      }
    }

    const recentSearches = localStorage.getItem('unsplash-recent-searches')
    if (recentSearches) {
      try {
        setRecentSearches(JSON.parse(recentSearches))
      } catch (error) {
        logger.error('Error loading recent searches', { component: 'UnsplashImageBrowser', action: 'loadRecentSearches' }, error as Error)
      }
    }

    const recentlyViewed = localStorage.getItem('unsplash-recently-viewed')
    if (recentlyViewed) {
      try {
        setRecentlyViewed(JSON.parse(recentlyViewed))
      } catch (error) {
        logger.error('Error loading recently viewed', { component: 'UnsplashImageBrowser', action: 'loadRecentlyViewed' }, error as Error)
      }
    }
  }, [])

  // Save preferences to localStorage
  const savePreferences = useCallback(() => {
    const preferences = {
      viewMode,
      gridSize,
      infiniteScroll,
      showDetails,
      thumbnailSize: thumbnailSize[0]
    }
    localStorage.setItem('unsplash-browser-preferences', JSON.stringify(preferences))
  }, [viewMode, gridSize, infiniteScroll, showDetails, thumbnailSize])

  useEffect(() => {
    savePreferences()
  }, [savePreferences])

  // Search images function
  const searchImages = useCallback(async (query: string, pageNum: number, reset: boolean = false) => {
    if (pageNum === 1) setLoading(true)
    
    try {
      const params = {
        query: query || 'business',
        page: pageNum,
        per_page: infiniteScroll ? 30 : 12,
        orientation: orientation === 'all' ? undefined : orientation,
        order_by: sortBy,
        color: colorFilter === 'all' ? undefined : colorFilter,
        category: categoryFilter === 'all' ? undefined : categoryFilter
      }

      const { data, error } = await supabase.functions.invoke('unsplash-images', {
        body: params
      })

      if (error) throw error

      // The response structure is { success: true, data: { results: [...] } }
      const responseData = data?.data || data
      const newImages = responseData?.results || []
      
      if (reset) {
        setImages(newImages)
      } else {
        setImages(prev => [...prev, ...newImages])
      }
      
      setHasMore(newImages.length === params.per_page)
      
      // Add to recent searches
      if (query && !recentSearches.includes(query)) {
        const updatedRecent = [query, ...recentSearches.slice(0, 9)]
        setRecentSearches(updatedRecent)
        localStorage.setItem('unsplash-recent-searches', JSON.stringify(updatedRecent))
      }
    } catch (error) {
      logger.error('Error searching images', { component: 'UnsplashImageBrowser', action: 'searchImages', query }, error as Error)
      errorHandler.handleError(error as Error, 'UnsplashImageBrowser-search');
    } finally {
      setLoading(false)
    }
  }, [orientation, sortBy, colorFilter, categoryFilter, infiniteScroll, recentSearches])

  // Search suggestions
  const generateSearchSuggestions = useCallback((input: string) => {
    if (!input) {
      setSearchSuggestions([])
      return
    }

    const suggestions = TRENDING_SEARCHES
      .filter(term => term.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 5)
    
    setSearchSuggestions(suggestions)
  }, [])

  // Handle search
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    setShowSuggestions(false)
    searchImages(searchQuery, 1, true)
  }, [searchQuery, searchImages])

  // Handle image click
  const handleImageClick = useCallback((image: UnsplashImage) => {
    if (bulkSelectMode) {
      const newSelected = new Set(selectedImageIds)
      if (newSelected.has(image.id)) {
        newSelected.delete(image.id)
      } else if (newSelected.size < maxSelection) {
        newSelected.add(image.id)
      }
      setSelectedImageIds(newSelected)
    } else {
      if (maxSelection === 1) {
        onImageSelect(image)
        // Add to recently viewed
        const updated = [image, ...recentlyViewed.filter(img => img.id !== image.id)].slice(0, 20)
        setRecentlyViewed(updated)
        localStorage.setItem('unsplash-recently-viewed', JSON.stringify(updated))
      } else {
        setPreviewImage(image)
        setShowPreview(true)
      }
    }
  }, [bulkSelectMode, selectedImageIds, maxSelection, onImageSelect, recentlyViewed])

  // Load more images
  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      const nextPage = page + 1
      setPage(nextPage)
      searchImages(searchQuery, nextPage, false)
    }
  }, [hasMore, loading, page, searchQuery, searchImages])

  // Infinite scroll handler
  useEffect(() => {
    if (!infiniteScroll) return

    const handleScroll = () => {
      const container = scrollContainerRef.current
      if (!container) return

      const { scrollTop, scrollHeight, clientHeight } = container
      setShowJumpToTop(scrollTop > 500)

      if (scrollTop + clientHeight >= scrollHeight - 1000 && hasMore && !loading) {
        loadMore()
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [infiniteScroll, hasMore, loading, loadMore])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target !== document.body) return

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          // Navigate to previous image
          break
        case 'ArrowRight':
          e.preventDefault()
          // Navigate to next image
          break
        case 'Enter':
          e.preventDefault()
          // Select current image
          break
        case 'Escape':
          setShowPreview(false)
          setShowSuggestions(false)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Get grid class based on current settings
  const getGridClass = useMemo(() => {
    if (viewMode === 'list') return 'flex flex-col space-y-4'
    if (viewMode === 'masonry') return 'columns-2 md:columns-3 lg:columns-4 gap-4'
    return `grid gap-4 ${GRID_SIZES[gridSize]}`
  }, [viewMode, gridSize])

  // Jump to top
  const jumpToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Clear all filters
  const clearAllFilters = () => {
    setOrientation('all')
    setSortBy('relevant')
    setSizeFilter('all')
    setColorFilter('all')
    setCategoryFilter('all')
    setSearchQuery('')
    setPage(1)
    searchImages('', 1, true)
  }

  // Bulk selection actions
  const selectAllImages = () => {
    const newSelected = new Set(images.slice(0, maxSelection).map(img => img.id))
    setSelectedImageIds(newSelected)
  }

  const clearSelection = () => {
    setSelectedImageIds(new Set())
  }

  const confirmBulkSelection = () => {
    const selectedImagesArray = images.filter(img => selectedImageIds.has(img.id))
    selectedImagesArray.forEach(img => onImageSelect(img))
    setBulkSelectMode(false)
    clearSelection()
  }

  // Initial search
  useEffect(() => {
    searchImages('', 1, true)
  }, [orientation, sortBy, colorFilter, categoryFilter])

  return (
    <TooltipProvider>
      <div className={`h-full flex flex-col space-y-4 ${className}`}>
        {/* Main Controls Row */}
        <div className="flex-shrink-0">
          <div className="flex items-center gap-4 mb-4">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex gap-2 flex-1 relative">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder={t('unsplash_browser.search_placeholder', 'Search for images...')}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    generateSearchSuggestions(e.target.value)
                    setShowSuggestions(true)
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => {
                    // Use regular setTimeout for React event handlers to prevent hook violations
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                  className="pl-10"
                />
                
                {/* Search Suggestions */}
                {showSuggestions && (searchSuggestions.length > 0 || recentSearches.length > 0) && (
                  <div className="absolute top-full left-0 right-0 bg-background border rounded-md shadow-lg z-[102] mt-1">
                    <ScrollArea className="max-h-64">
                      {searchSuggestions.length > 0 && (
                        <div className="p-2">
                          <div className="text-xs font-medium text-muted-foreground mb-2">{t('unsplash_browser.suggestions', 'Suggestions')}</div>
                          {searchSuggestions.map(suggestion => (
                            <button
                              key={suggestion}
                              className="w-full text-left px-2 py-1 hover:bg-muted rounded text-sm"
                              onClick={() => {
                                setSearchQuery(suggestion)
                                setShowSuggestions(false)
                                searchImages(suggestion, 1, true)
                              }}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                      {recentSearches.length > 0 && (
                        <div className="p-2 border-t">
                          <div className="text-xs font-medium text-muted-foreground mb-2">{t('unsplash_browser.recent', 'Recent')}</div>
                          {recentSearches.slice(0, 5).map(search => (
                            <button
                              key={search}
                              className="w-full text-left px-2 py-1 hover:bg-muted rounded text-sm flex items-center gap-2"
                              onClick={() => {
                                setSearchQuery(search)
                                setShowSuggestions(false)
                                searchImages(search, 1, true)
                              }}
                            >
                              <Clock className="h-3 w-3" />
                              {search}
                            </button>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                )}
              </div>
              <Button type="submit" disabled={loading} className="bg-success hover:bg-success-hover text-success-foreground">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('unsplash_browser.search', 'Search')}
              </Button>
            </form>

            {/* Quick Filters */}
            <Select value={orientation} onValueChange={setOrientation}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                 <SelectItem value="all">{t('unsplash_browser.all', 'All')}</SelectItem>
                 <SelectItem value="landscape">{t('unsplash_browser.landscape', 'Landscape')}</SelectItem>
                 <SelectItem value="portrait">{t('unsplash_browser.portrait', 'Portrait')}</SelectItem>
                <SelectItem value="squarish">Square</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevant">Relevant</SelectItem>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex border rounded-md">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`rounded-r-none ${viewMode === 'grid' ? 'bg-success hover:bg-success-hover text-success-foreground' : ''}`}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t('ui.unsplash_browser.grid_view')}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === 'masonry' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('masonry')}
                    className={`rounded-none ${viewMode === 'masonry' ? 'bg-success hover:bg-success-hover text-success-foreground' : ''}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t('ui.unsplash_browser.masonry_view')}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`rounded-l-none ${viewMode === 'list' ? 'bg-success hover:bg-success-hover text-success-foreground' : ''}`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t('ui.unsplash_browser.list_view')}</TooltipContent>
              </Tooltip>
            </div>

            {/* Advanced Filters Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('ui.unsplash_browser.advanced_filters')}</TooltipContent>
            </Tooltip>
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{t('ui.unsplash_browser.advanced_filters')}</h3>
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Color Filters */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Color</Label>
                      <div className="flex flex-wrap gap-2">
                        {COLOR_FILTERS.map(color => (
                          <Tooltip key={color.value}>
                            <TooltipTrigger asChild>
                              <button
                                className={`w-6 h-6 rounded border-2 ${
                                  colorFilter === color.value ? 'border-primary' : 'border-muted'
                                }`}
                                style={{ backgroundColor: color.color }}
                                onClick={() => setColorFilter(color.value)}
                              />
                            </TooltipTrigger>
                            <TooltipContent>{color.name}</TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">{t('category')}</Label>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('allCategories')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('allCategories')}</SelectItem>
                          {CATEGORY_TAGS.map(category => (
                            <SelectItem key={category} value={category.toLowerCase()}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Grid Size Control */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Grid Size</Label>
                      <Select value={gridSize} onValueChange={(value: GridSize) => setGridSize(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="compact">Compact</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Thumbnail Size Slider */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Thumbnail Size: {thumbnailSize[0]}px
                      </Label>
                      <Slider
                        value={thumbnailSize}
                        onValueChange={setThumbnailSize}
                        max={300}
                        min={100}
                        step={25}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* View Options */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-details"
                        checked={showDetails}
                        onCheckedChange={setShowDetails}
                      />
                      <Label htmlFor="show-details">{t('ui.unsplash_browser.show_details')}</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="infinite-scroll"
                        checked={infiniteScroll}
                        onCheckedChange={setInfiniteScroll}
                      />
                      <Label htmlFor="infinite-scroll">{t('ui.unsplash_browser.infinite_scroll')}</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="bulk-select"
                        checked={bulkSelectMode}
                        onCheckedChange={setBulkSelectMode}
                      />
                      <Label htmlFor="bulk-select">{t('ui.unsplash_browser.bulk_select')}</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trending Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Trending:
            </div>
            {TRENDING_SEARCHES.slice(0, 6).map(tag => (
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

          {/* Bulk Selection Controls */}
          {bulkSelectMode && (
            <div className="flex items-center justify-between bg-muted p-3 rounded-lg mb-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {selectedImageIds.size} of {maxSelection} selected
                </span>
                <Button variant="outline" size="sm" onClick={selectAllImages}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  Clear
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setBulkSelectMode(false)}>
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={confirmBulkSelection}
                  disabled={selectedImageIds.size === 0}
                  className="bg-success hover:bg-success-hover text-success-foreground"
                >
                  Confirm Selection
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto min-h-0 relative"
          style={{ height: 'calc(100% - 200px)' }}
        >
          {/* Recently Viewed */}
          {!searchQuery && recentlyViewed.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recently Viewed
              </h3>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {recentlyViewed.slice(0, 8).map(image => (
                  <Card 
                    key={`recent-${image.id}`}
                    className="cursor-pointer hover:shadow-md transition-shadow aspect-square overflow-hidden"
                    onClick={() => handleImageClick(image)}
                  >
                    <img
                      src={image.urls.thumb}
                      alt={image.alt_description || 'Recently viewed image'}
                      className="w-full h-full object-cover"
                    />
                  </Card>
                ))}
              </div>
              <Separator className="mt-4" />
            </div>
          )}

          {/* Images Grid/List */}
          <div className={getGridClass}>
            {images.map((image) => (
              <Card
                key={image.id}
                className={`cursor-pointer hover:shadow-lg transition-all duration-200 relative group ${
                  selectedImageIds.has(image.id) ? 'ring-2 ring-primary' : ''
                } ${viewMode === 'list' ? 'flex' : ''}`}
                onClick={() => handleImageClick(image)}
                onMouseEnter={() => setHoveredImage(image.id)}
                onMouseLeave={() => setHoveredImage(null)}
                style={viewMode !== 'list' ? { 
                  height: viewMode === 'masonry' ? 'auto' : thumbnailSize[0],
                  breakInside: viewMode === 'masonry' ? 'avoid' : 'auto'
                } : undefined}
              >
                {/* Bulk Select Checkbox */}
                {bulkSelectMode && (
                  <div className="absolute top-2 left-2 z-10">
                    <Checkbox
                      checked={selectedImageIds.has(image.id)}
                      onCheckedChange={(checked) => {
                        const newSelected = new Set(selectedImageIds)
                        if (checked) {
                          if (newSelected.size < maxSelection) {
                            newSelected.add(image.id)
                          }
                        } else {
                          newSelected.delete(image.id)
                        }
                        setSelectedImageIds(newSelected)
                      }}
                      className="bg-background"
                    />
                  </div>
                )}

                <CardContent className={`p-0 h-full ${viewMode === 'list' ? 'flex' : ''}`}>
                  {/* Image */}
                  <div className={`relative ${
                    viewMode === 'list' ? 'w-32 h-24 flex-shrink-0' : 'w-full h-full'
                  } overflow-hidden ${viewMode !== 'masonry' ? 'rounded-t-lg' : 'rounded-lg'}`}>
                    <img
                      src={image.urls.small}
                      alt={image.alt_description || image.description || 'Unsplash image'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    
                    {/* Hover Overlay */}
                    {hoveredImage === image.id && (
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation()
                              setPreviewImage(image)
                              setShowPreview(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation()
                              onImageSelect(image)
                            }}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Image Details */}
                  {showDetails && (
                    <div className={`p-3 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      {viewMode === 'list' && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm truncate">
                            {image.description || image.alt_description || 'Untitled'}
                          </h4>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {image.user.name}
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {image.likes}
                            </div>
                            <div className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              {image.downloads || 0}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {image.width} × {image.height}
                          </div>
                        </div>
                      )}
                      
                      {viewMode !== 'list' && gridSize !== 'compact' && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <User className="h-3 w-3" />
                              <span className="truncate">{image.user.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {image.likes}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Loading More */}
          {loading && images.length > 0 && (
            <div className="text-center py-4">
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            </div>
          )}

          {/* Load More Button */}
          {!infiniteScroll && hasMore && !loading && images.length > 0 && (
            <div className="text-center pt-6">
              <Button onClick={loadMore} variant="outline">
                Load More Images
              </Button>
            </div>
          )}

          {/* Loading Initial */}
          {loading && images.length === 0 && (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Searching for images...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && images.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-2">{t('ui.unsplash_browser.no_images_found', { query: searchQuery })}</p>
              <p className="text-sm text-muted-foreground mb-4">{t('ui.unsplash_browser.try_different_search')}</p>
              <Button variant="outline" onClick={clearAllFilters}>
                {t('ui.unsplash_browser.clear_filters')}
              </Button>
            </div>
          )}

          {/* Jump to Top Button */}
          {showJumpToTop && (
            <Button
              className="fixed bottom-4 right-4 z-[102]"
              size="sm"
              onClick={jumpToTop}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Image Preview Dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="flex items-center justify-between">
                <span>{t('ui.unsplash_browser.image_preview')}</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      if (previewImage) {
                        onImageSelect(previewImage)
                        setShowPreview(false)
                      }
                    }}
                    className="bg-success hover:bg-success-hover text-success-foreground"
                  >
                    Select This Image
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            {previewImage && (
              <div className="p-6 pt-4">
                <div className="mb-4">
                  <img
                    src={previewImage.urls.regular}
                    alt={previewImage.alt_description || previewImage.description || 'Preview'}
                    className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">{t('ui.unsplash_browser.image_details')}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('ui.unsplash_browser.dimensions')}</span>
                        <span>{previewImage.width} × {previewImage.height}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('ui.unsplash_browser.likes')}</span>
                        <span>{previewImage.likes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('ui.unsplash_browser.downloads')}</span>
                        <span>{previewImage.downloads || 'N/A'}</span>
                      </div>
                      {previewImage.description && (
                        <div>
                          <span className="text-muted-foreground block">{t('ui.unsplash_browser.description')}</span>
                          <span>{previewImage.description}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">{t('ui.unsplash_browser.photographer')}</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={previewImage.user.profile_image.small}
                        alt={previewImage.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="font-medium">{previewImage.user.name}</div>
                        <div className="text-sm text-muted-foreground">@{previewImage.user.username}</div>
                      </div>
                    </div>
                    
                    {previewImage.tags && previewImage.tags.length > 0 && (
                      <div>
                        <span className="text-muted-foreground block text-sm mb-2">Tags:</span>
                        <div className="flex flex-wrap gap-1">
                          {previewImage.tags.slice(0, 6).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag.title}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}