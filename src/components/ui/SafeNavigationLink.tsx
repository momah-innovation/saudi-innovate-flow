import React from 'react';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from './error-boundary';

interface SafeNavigationLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
}

/**
 * Safe navigation component that:
 * - Uses React Router Link for internal navigation
 * - Falls back to <a> tag for external links
 * - Maintains existing behavior with error boundary fallback
 */
export const SafeNavigationLink: React.FC<SafeNavigationLinkProps> = ({ 
  href, 
  children, 
  ...props 
}) => {
  // External links (http, https, mailto, tel, etc.)
  if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  // Internal navigation with fallback
  return (
    <ErrorBoundary
      fallback={
        <a href={href} {...props}>
          {children}
        </a>
      }
    >
      <Link to={href} {...props}>
        {children}
      </Link>
    </ErrorBoundary>
  );
};

export default SafeNavigationLink;