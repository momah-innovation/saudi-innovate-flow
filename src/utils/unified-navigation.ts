import { NavigateFunction } from 'react-router-dom';

export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
  target?: '_blank' | '_self';
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

class UnifiedNavigationHandler {
  private navigate?: NavigateFunction;

  setNavigate(navigate: NavigateFunction) {
    this.navigate = navigate;
  }

  navigateTo(href: string, external = false, target?: string): void {
    if (external || target === '_blank') {
      window.open(href, target || '_blank', 'noopener noreferrer');
      return;
    }

    if (this.navigate) {
      this.navigate(href);
    } else {
      window.location.href = href;
    }
  }

  navigateWithState(href: string, state: any): void {
    if (this.navigate) {
      this.navigate(href, { state });
    } else {
      window.location.href = href;
    }
  }

  replace(href: string): void {
    if (this.navigate) {
      this.navigate(href, { replace: true });
    } else {
      window.location.replace(href);
    }
  }

  goBack(): void {
    window.history.back();
  }

  isExternalUrl(url: string): boolean {
    try {
      const urlObj = new URL(url, window.location.origin);
      return urlObj.origin !== window.location.origin;
    } catch {
      return false;
    }
  }

  buildQueryString(params: Record<string, string | number | boolean>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
    return searchParams.toString();
  }

  navigateWithParams(href: string, params: Record<string, string | number | boolean>): void {
    const queryString = this.buildQueryString(params);
    const url = queryString ? `${href}?${queryString}` : href;
    this.navigateTo(url);
  }
}

export const navigationHandler = new UnifiedNavigationHandler();

export const getLinkProps = (item: NavigationItem) => {
  if (item.external || navigationHandler.isExternalUrl(item.href)) {
    return {
      href: item.href,
      target: item.target || '_blank',
      rel: 'noopener noreferrer'
    };
  }

  return {
    to: item.href
  };
};