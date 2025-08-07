import React from 'react';
import { TagManager } from '@/components/ui/tag-manager';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

export const TagManagement: React.FC = () => {
  const { t } = useUnifiedTranslation();

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t('tags.tag_management')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('tags.manage_system_tags')}
        </p>
      </div>
      
      <TagManager />
    </div>
  );
};