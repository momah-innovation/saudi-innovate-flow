import React, { useState } from 'react';
import { X, Download, Share2, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import { Dialog, DialogContent } from './dialog';
import { cn } from '@/lib/utils';

export interface MediaItem {
  id: string;
  src: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  type: 'image' | 'video' | 'document';
  size?: string;
  uploadDate?: Date;
  tags?: string[];
}

interface MediaGalleryProps {
  items: MediaItem[];
  columns?: 2 | 3 | 4 | 5;
  showMetadata?: boolean;
  onDownload?: (item: MediaItem) => void;
  onShare?: (item: MediaItem) => void;
  className?: string;
}

function MediaCard({ 
  item, 
  onView, 
  onDownload, 
  onShare,
  showMetadata 
}: {
  item: MediaItem;
  onView: (item: MediaItem) => void;
  onDownload?: (item: MediaItem) => void;
  onShare?: (item: MediaItem) => void;
  showMetadata?: boolean;
}) {
  return (
    <div className="group relative bg-card border rounded-lg overflow-hidden hover:shadow-medium transition-all duration-300 hover-lift">
      {/* Media Preview */}
      <div 
        className="aspect-square bg-muted cursor-pointer overflow-hidden"
        onClick={() => onView(item)}
      >
        {item.type === 'image' ? (
          <img
            src={item.thumbnail || item.src}
            alt={item.title || 'Media item'}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : item.type === 'video' ? (
          <div className="w-full h-full bg-black/80 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-l-[8px] border-l-white border-y-[6px] border-y-transparent ml-1" />
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <div className="w-6 h-6 bg-primary/20 rounded" />
              </div>
              <p className="text-xs text-muted-foreground">Document</p>
            </div>
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button variant="secondary" size="sm">
            <Maximize2 className="w-4 h-4 mr-2" />
            View
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {onDownload && (
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(item);
            }}
            className="h-8 w-8 p-0"
          >
            <Download className="w-4 h-4" />
          </Button>
        )}
        
        {onShare && (
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onShare(item);
            }}
            className="h-8 w-8 p-0"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Metadata */}
      {showMetadata && (
        <div className="p-3">
          {item.title && (
            <h4 className="font-medium text-sm truncate mb-1">{item.title}</h4>
          )}
          
          {item.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {item.description}
            </p>
          )}
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {item.size && <span>{item.size}</span>}
            {item.uploadDate && (
              <span>{item.uploadDate.toLocaleDateString()}</span>
            )}
          </div>
          
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0.5">
                  {tag}
                </Badge>
              ))}
              {item.tags.length > 2 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  +{item.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MediaViewer({ 
  item, 
  items, 
  isOpen, 
  onClose,
  onDownload,
  onShare 
}: {
  item: MediaItem | null;
  items: MediaItem[];
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (item: MediaItem) => void;
  onShare?: (item: MediaItem) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  React.useEffect(() => {
    if (item) {
      const index = items.findIndex(i => i.id === item.id);
      setCurrentIndex(index);
    }
  }, [item, items]);

  const currentItem = items[currentIndex];

  const navigatePrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const navigateNext = () => {
    setCurrentIndex(Math.min(items.length - 1, currentIndex + 1));
  };

  if (!currentItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
        <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
          {/* Navigation */}
          {items.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={navigatePrevious}
                disabled={currentIndex === 0}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={navigateNext}
                disabled={currentIndex === items.length - 1}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </>
          )}

          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent z-10">
            <div className="flex items-center justify-between">
              <div className="text-white">
                {currentItem.title && (
                  <h3 className="font-medium">{currentItem.title}</h3>
                )}
                <p className="text-sm text-white/70">
                  {currentIndex + 1} of {items.length}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {onDownload && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDownload(currentItem)}
                    className="text-white hover:bg-white/20"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                )}
                
                {onShare && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onShare(currentItem)}
                    className="text-white hover:bg-white/20"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Media Content */}
          <div className="w-full h-full flex items-center justify-center">
            {currentItem.type === 'image' ? (
              <img
                src={currentItem.src}
                alt={currentItem.title || 'Media item'}
                className="max-w-full max-h-full object-contain"
              />
            ) : currentItem.type === 'video' ? (
              <video
                src={currentItem.src}
                controls
                className="max-w-full max-h-full"
              />
            ) : (
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-white/40 rounded" />
                </div>
                <p className="mb-2">{currentItem.title}</p>
                <p className="text-sm text-white/70">Document preview not available</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function MediaGallery({
  items,
  columns = 3,
  showMetadata = true,
  onDownload,
  onShare,
  className
}: MediaGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const handleViewItem = (item: MediaItem) => {
    setSelectedItem(item);
    setIsViewerOpen(true);
  };

  const columnClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
  };

  return (
    <>
      <div className={cn(
        "grid gap-4",
        columnClasses[columns],
        className
      )}>
        {items.map((item) => (
          <MediaCard
            key={item.id}
            item={item}
            onView={handleViewItem}
            onDownload={onDownload}
            onShare={onShare}
            showMetadata={showMetadata}
          />
        ))}
      </div>

      <MediaViewer
        item={selectedItem}
        items={items}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        onDownload={onDownload}
        onShare={onShare}
      />
    </>
  );
}