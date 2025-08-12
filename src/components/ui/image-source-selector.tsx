import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { EnhancedFileUploader } from '@/components/ui/enhanced-file-uploader'
import { UnsplashImageBrowser } from '@/components/ui/unsplash-image-browser'
import { Upload, Image, Plus } from 'lucide-react'
import { FileUploadConfig, UploadedFile } from '@/hooks/useFileUploader'
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation'

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

interface ImageSourceSelectorProps {
  config: FileUploadConfig
  onFileUpload?: (files: UploadedFile[]) => void
  onUnsplashSelect?: (image: UnsplashImage) => void
  triggerButtonText?: string
  dialogTitle?: string
  allowMultiple?: boolean
  className?: string
}

export function ImageSourceSelector({
  config,
  onFileUpload,
  onUnsplashSelect,
  triggerButtonText,
  dialogTitle,
  allowMultiple = false,
  className
}: ImageSourceSelectorProps) {
  const { t } = useUnifiedTranslation();
  const [open, setOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'upload' | 'unsplash'>('unsplash')

  const handleFileUpload = (files: UploadedFile[]) => {
    onFileUpload?.(files)
    setOpen(false)
  }

  const handleUnsplashSelect = (image: UnsplashImage) => {
    onUnsplashSelect?.(image)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          <Plus className="h-4 w-4 mr-2" />
          {triggerButtonText}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        
        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as 'upload' | 'unsplash')} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
            <TabsTrigger value="unsplash" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              {t('ui.image_source.browse_stock_images')}
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              {t('ui.image_source.upload_files')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="unsplash" className="flex-1 mt-4 min-h-0">
            <UnsplashImageBrowser
              onImageSelect={handleUnsplashSelect}
              maxSelection={allowMultiple ? 10 : 1}
              className="h-full"
            />
          </TabsContent>
          
          <TabsContent value="upload" className="flex-1 mt-4">
            <Card className="h-full">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">{t('ui.image_source.upload_your_own_images')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('ui.image_source.upload_description', { formats: config.allowedTypes?.join(', ') })}
                    </p>
                  </div>
                  
                  <EnhancedFileUploader
                    config={config}
                    onUploadComplete={handleFileUpload}
                    showPreview={true}
                    onValueChange={handleFileUpload}
                    className="min-h-64"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}