import React from 'react';

interface AdminPageWrapperProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const AdminPageWrapper: React.FC<AdminPageWrapperProps> = ({
  title,
  description,
  children
}) => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
};