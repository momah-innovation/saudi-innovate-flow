import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useTags } from '@/hooks/useTags';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tagIds: string[]) => void;
  category?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onTagsChange,
  category,
  placeholder,
  className,
  disabled = false
}) => {
  const { t, getDynamicText } = useUnifiedTranslation();
  const { tags, searchTags, createTag } = useTags();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tags by category if specified
  const availableTags = category 
    ? tags.filter(tag => tag.category === category)
    : tags;

  // Get currently selected tag objects
  const selectedTagObjects = availableTags.filter(tag => selectedTags.includes(tag.id));

  // Get available tags for selection (not already selected)
  const unselectedTags = availableTags.filter(tag => !selectedTags.includes(tag.id));

  // Search through unselected tags
  const searchResults = searchQuery 
    ? unselectedTags.filter(tag => 
        getDynamicText(tag.name_ar, tag.name_en).toLowerCase().includes(searchQuery.toLowerCase()) ||
        tag.slug.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : unselectedTags;

  const handleTagSelect = (tagId: string) => {
    onTagsChange([...selectedTags, tagId]);
    setSearchQuery('');
  };

  const handleTagRemove = (tagId: string) => {
    onTagsChange(selectedTags.filter(id => id !== tagId));
  };

  const handleCreateTag = async () => {
    if (searchQuery.trim()) {
      const newTag = await createTag({
        name_en: searchQuery,
        name_ar: searchQuery, // You might want to ask for Arabic translation
        slug: searchQuery.toLowerCase().replace(/\s+/g, '-'),
        category: category || 'general',
        color: '#6366F1',
        icon: 'tag'
      });
      
      if (newTag) {
        handleTagSelect(newTag.id);
      }
    }
  };

  return (
    <div className={className}>
      {/* Selected Tags Display */}
      <div className="flex flex-wrap gap-2 mb-3">
        {selectedTagObjects.map((tag) => (
          <Badge
            key={tag.id}
            variant="secondary"
            style={{ backgroundColor: tag.color + '20', color: tag.color }}
            className="flex items-center gap-1"
          >
            {getDynamicText(tag.name_ar, tag.name_en)}
            {!disabled && (
              <button
                type="button"
                onClick={() => handleTagRemove(tag.id)}
                className="ml-1 hover:bg-foreground/10 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}
      </div>

      {/* Tag Selection Popover */}
      {!disabled && (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              {placeholder || t('tags.add_tags')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <Command>
              <CommandInput
                placeholder={t('tags.search_or_create')}
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandList>
                <CommandEmpty className="p-4 text-center">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      {t('tags.no_tags_found')}
                    </div>
                    {searchQuery && (
                      <Button
                        size="sm"
                        onClick={handleCreateTag}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {t('tags.create_tag_with_name', { name: searchQuery })}
                      </Button>
                    )}
                  </div>
                </CommandEmpty>
                
                <CommandGroup>
                  {searchResults.map((tag) => (
                    <CommandItem
                      key={tag.id}
                      onSelect={() => handleTagSelect(tag.id)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span>{getDynamicText(tag.name_ar, tag.name_en)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {tag.usage_count} {t('tags.uses')}
                      </div>
                    </CommandItem>
                  ))}
                  
                  {/* Quick create option */}
                  {searchQuery && !searchResults.some(tag => 
                    getDynamicText(tag.name_ar, tag.name_en).toLowerCase() === searchQuery.toLowerCase()
                  ) && (
                    <CommandItem onSelect={handleCreateTag}>
                      <Plus className="h-4 w-4 mr-2" />
                      {t('tags.create_tag_with_name', { name: searchQuery })}
                    </CommandItem>
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};