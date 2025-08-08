// Centralized Router Component
// Single source of truth for all routing with RBAC integration

import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RoleBasedRouting } from './RoleBasedRouting';
import { Loader2 } from 'lucide-react';

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

export const CentralizedRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <RoleBasedRouting />
      </Suspense>
    </BrowserRouter>
  );
};