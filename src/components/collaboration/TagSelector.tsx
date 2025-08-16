import React, { useState, useEffect } from 'react';
import { useTimerManager } from '@/utils/timerManager';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Tag, 
  Plus, 
  X, 
  Search,
  Sparkles
} from 'lucide-react';
import { useTagIntegration } from '@/hooks/useTagIntegration';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

interface Tag {
  id: string;
  name?: string;
  name_ar?: string;
  name_en?: string;
  category?: string;
  color?: string;
}

interface TagSelectorProps {
  entityType: string;
  entityId: string;
  onTagsChange?: (tags: Tag[]) => void;
  showSuggestions?: boolean;
  maxTags?: number;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  entityType,
  entityId,
  onTagsChange,
  showSuggestions = true,
  maxTags = 10
}) => {
  const { t } = useUnifiedTranslation();
  const {
    tags,
    loading,
    searchTags,
    getSuggestedTags,
    addTagToEntity,
    removeTagFromEntity,
    getEntityTags
  } = useTagIntegration();

  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Tag[]>([]);
  const [suggestedTags, setSuggestedTags] = useState<Tag[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { setTimeout: scheduleTimeout } = useTimerManager();

  // Load existing tags for the entity
  useEffect(() => {
    const loadEntityTags = async () => {
      if (entityId) {
        const entityTags = await getEntityTags(entityType, entityId);
        setSelectedTags(entityTags);
        onTagsChange?.(entityTags);
      }
    };
    loadEntityTags();
  }, [entityType, entityId]);

  // Load suggested tags
  useEffect(() => {
    const loadSuggestions = async () => {
      if (showSuggestions && entityId) {
        const suggestions = await getSuggestedTags(entityType, entityId);
        setSuggestedTags(suggestions);
      }
    };
    loadSuggestions();
  }, [entityType, entityId, showSuggestions]);

  // Handle search
  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        const results = await searchTags(searchQuery);
        setSearchResults(results.filter(tag => 
          !selectedTags.some(selected => selected.id === tag.id)
        ));
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    };

    const cleanup = scheduleTimeout(handleSearch, 300);
    return cleanup;
  }, [searchQuery, selectedTags]);

  const handleAddTag = async (tag: Tag) => {
    if (selectedTags.length >= maxTags) return;
    
    const success = await addTagToEntity(entityType, entityId, tag.id);
    if (success) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      onTagsChange?.(newTags);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleRemoveTag = async (tag: Tag) => {
    const success = await removeTagFromEntity(entityType, entityId, tag.id);
    if (success) {
      const newTags = selectedTags.filter(t => t.id !== tag.id);
      setSelectedTags(newTags);
      onTagsChange?.(newTags);
    }
  };

  const getTagDisplayName = (tag: Tag): string => {
    return tag.name_ar || tag.name_en || tag.name || 'علامة';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Tag className="w-4 h-4" />
          {t('collaboration.add_tags')}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="flex items-center gap-1"
                  style={{ backgroundColor: tag.color ? `${tag.color}20` : undefined }}
                >
                  {getTagDisplayName(tag)}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto w-auto p-0 ml-1"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <Separator className="mt-3" />
          </div>
        )}

        {/* Search Input */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('collaboration.search_tags')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <ScrollArea className="h-24 border rounded-lg p-2">
              <div className="space-y-1">
                {searchResults.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                    onClick={() => handleAddTag(tag)}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tag.color || '#6B7280' }}
                      />
                      <span className="text-sm">{getTagDisplayName(tag)}</span>
                      {tag.category && (
                        <Badge variant="outline" className="text-xs">
                          {tag.category}
                        </Badge>
                      )}
                    </div>
                    <Plus className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Suggested Tags */}
        {showSuggestions && suggestedTags.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{t('collaboration.suggested_tags')}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedTags
                .filter(tag => !selectedTags.some(selected => selected.id === tag.id))
                .slice(0, 5)
                .map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleAddTag(tag)}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {getTagDisplayName(tag)}
                  </Badge>
                ))}
            </div>
          </div>
        )}

        {/* Tag Limit Info */}
        {selectedTags.length > 0 && (
          <div className="text-xs text-muted-foreground">
            {selectedTags.length} / {maxTags} علامات
          </div>
        )}
      </CardContent>
    </Card>
  );
};