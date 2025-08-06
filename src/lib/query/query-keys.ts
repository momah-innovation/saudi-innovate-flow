/**
 * React Query Key Factories
 * Extracted from query-optimization.ts for better organization
 */

/**
 * Query key factories for consistent caching
 */
export const queryKeys = {
  // User-related queries
  user: {
    all: ['users'] as const,
    profile: (userId: string) => [...queryKeys.user.all, 'profile', userId] as const,
    preferences: (userId: string) => [...queryKeys.user.all, 'preferences', userId] as const
  },
  
  // Challenge-related queries
  challenges: {
    all: ['challenges'] as const,
    lists: () => [...queryKeys.challenges.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.challenges.lists(), filters] as const,
    details: () => [...queryKeys.challenges.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.challenges.details(), id] as const,
    analytics: (id: string) => [...queryKeys.challenges.detail(id), 'analytics'] as const,
    participants: (id: string) => [...queryKeys.challenges.detail(id), 'participants'] as const
  },
  
  // Idea-related queries
  ideas: {
    all: ['ideas'] as const,
    lists: () => [...queryKeys.ideas.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.ideas.lists(), filters] as const,
    details: () => [...queryKeys.ideas.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.ideas.details(), id] as const,
    analytics: (id: string) => [...queryKeys.ideas.detail(id), 'analytics'] as const
  },
  
  // Event-related queries
  events: {
    all: ['events'] as const,
    lists: () => [...queryKeys.events.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.events.lists(), filters] as const,
    details: () => [...queryKeys.events.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.events.details(), id] as const,
    registrations: (eventId: string) => [...queryKeys.events.detail(eventId), 'registrations'] as const
  },
  
  // System data queries
  system: {
    all: ['system'] as const,
    departments: () => [...queryKeys.system.all, 'departments'] as const,
    sectors: () => [...queryKeys.system.all, 'sectors'] as const,
    domains: () => [...queryKeys.system.all, 'domains'] as const,
    partners: () => [...queryKeys.system.all, 'partners'] as const,
    experts: () => [...queryKeys.system.all, 'experts'] as const,
    translations: () => [...queryKeys.system.all, 'translations'] as const,
    translation: (language: string) => [...queryKeys.system.translations(), language] as const
  }
};