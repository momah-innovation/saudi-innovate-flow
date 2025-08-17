# Search Services

Advanced search functionality and indexing services for the Enterprise Management System.

## 🔍 Search Engine Integration

### Elasticsearch Integration
**Location**: `src/services/search/elasticsearch-service.ts`

```typescript
import { Client } from '@elastic/elasticsearch';

interface SearchConfig {
  node: string;
  auth: {
    username: string;
    password: string;
  };
  maxRetries: number;
  requestTimeout: number;
}

class ElasticsearchService {
  private client: Client;

  constructor(config: SearchConfig) {
    this.client = new Client({
      node: config.node,
      auth: config.auth,
      maxRetries: config.maxRetries,
      requestTimeout: config.requestTimeout
    });
  }

  async indexDocument(index: string, id: string, document: any): Promise<void> {
    try {
      await this.client.index({
        index,
        id,
        body: document,
        refresh: 'wait_for'
      });
    } catch (error) {
      console.error('Failed to index document:', error);
      throw error;
    }
  }

  async searchDocuments(index: string, query: any, options: any = {}): Promise<any> {
    try {
      const result = await this.client.search({
        index,
        body: {
          query,
          ...options
        }
      });
      
      return {
        hits: result.body.hits.hits.map((hit: any) => ({
          id: hit._id,
          score: hit._score,
          source: hit._source,
          highlight: hit.highlight
        })),
        total: result.body.hits.total.value,
        aggregations: result.body.aggregations
      };
    } catch (error) {
      console.error('Search failed:', error);
      throw error;
    }
  }

  async deleteDocument(index: string, id: string): Promise<void> {
    try {
      await this.client.delete({
        index,
        id,
        refresh: 'wait_for'
      });
    } catch (error) {
      console.error('Failed to delete document:', error);
      throw error;
    }
  }

  async updateDocument(index: string, id: string, updates: any): Promise<void> {
    try {
      await this.client.update({
        index,
        id,
        body: {
          doc: updates
        },
        refresh: 'wait_for'
      });
    } catch (error) {
      console.error('Failed to update document:', error);
      throw error;
    }
  }
}

export const elasticsearchService = new ElasticsearchService({
  node: process.env.ELASTICSEARCH_NODE!,
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME!,
    password: process.env.ELASTICSEARCH_PASSWORD!
  },
  maxRetries: 3,
  requestTimeout: 60000
});
```

### Search Indices Configuration
```typescript
// Search index mappings
export const SearchIndices = {
  CHALLENGES: 'challenges',
  SUBMISSIONS: 'submissions',
  USERS: 'users',
  CONTENT: 'content',
  EVENTS: 'events'
};

export const IndexMappings = {
  [SearchIndices.CHALLENGES]: {
    mappings: {
      properties: {
        title: {
          type: 'text',
          analyzer: 'standard',
          fields: {
            keyword: { type: 'keyword' },
            suggest: { type: 'completion' }
          }
        },
        description: {
          type: 'text',
          analyzer: 'standard'
        },
        category: { type: 'keyword' },
        tags: { type: 'keyword' },
        status: { type: 'keyword' },
        created_at: { type: 'date' },
        end_date: { type: 'date' },
        difficulty_level: { type: 'keyword' },
        reward_amount: { type: 'float' },
        participant_count: { type: 'integer' },
        submission_count: { type: 'integer' }
      }
    },
    settings: {
      analysis: {
        analyzer: {
          custom_text_analyzer: {
            tokenizer: 'standard',
            filter: ['lowercase', 'stop', 'snowball']
          }
        }
      }
    }
  },

  [SearchIndices.SUBMISSIONS]: {
    mappings: {
      properties: {
        title: {
          type: 'text',
          analyzer: 'standard',
          fields: { keyword: { type: 'keyword' } }
        },
        description: { type: 'text' },
        content: { type: 'text' },
        challenge_id: { type: 'keyword' },
        challenge_title: { type: 'text' },
        submitted_by: { type: 'keyword' },
        submitter_name: { type: 'text' },
        status: { type: 'keyword' },
        evaluation_score: { type: 'float' },
        tags: { type: 'keyword' },
        technologies: { type: 'keyword' },
        submitted_at: { type: 'date' },
        implementation_feasibility: { type: 'keyword' }
      }
    }
  },

  [SearchIndices.USERS]: {
    mappings: {
      properties: {
        full_name: {
          type: 'text',
          fields: { keyword: { type: 'keyword' } }
        },
        email: { type: 'keyword' },
        department: { type: 'keyword' },
        position: { type: 'text' },
        expertise_areas: { type: 'keyword' },
        bio: { type: 'text' },
        roles: { type: 'keyword' },
        location: { type: 'geo_point' },
        created_at: { type: 'date' },
        last_active: { type: 'date' },
        innovation_score: { type: 'float' }
      }
    }
  }
};
```

## 🔍 Advanced Search Features

### Full-Text Search Service
**Location**: `src/services/search/search-service.ts`

```typescript
interface SearchQuery {
  query: string;
  filters?: Record<string, any>;
  sort?: Array<{ field: string; direction: 'asc' | 'desc' }>;
  page?: number;
  limit?: number;
  highlight?: boolean;
  facets?: string[];
}

interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  facets?: Record<string, any>;
  suggestions?: string[];
  query_time: number;
}

class AdvancedSearchService {
  async searchChallenges(query: SearchQuery): Promise<SearchResult<Challenge>> {
    const startTime = Date.now();
    
    const elasticQuery = this.buildElasticQuery(query);
    
    const result = await elasticsearchService.searchDocuments(
      SearchIndices.CHALLENGES,
      elasticQuery,
      {
        from: ((query.page || 1) - 1) * (query.limit || 20),
        size: query.limit || 20,
        sort: this.buildSortClause(query.sort),
        highlight: query.highlight ? {
          fields: {
            title: {},
            description: {}
          }
        } : undefined,
        aggs: query.facets ? this.buildFacetAggregations(query.facets) : undefined
      }
    );

    return {
      items: result.hits.map(hit => ({
        ...hit.source,
        _score: hit.score,
        _highlight: hit.highlight
      })),
      total: result.total,
      page: query.page || 1,
      limit: query.limit || 20,
      facets: result.aggregations,
      suggestions: await this.getSuggestions(query.query),
      query_time: Date.now() - startTime
    };
  }

  async searchSubmissions(query: SearchQuery): Promise<SearchResult<Submission>> {
    // Similar implementation for submissions
    const startTime = Date.now();
    
    const elasticQuery = this.buildElasticQuery(query);
    
    const result = await elasticsearchService.searchDocuments(
      SearchIndices.SUBMISSIONS,
      elasticQuery,
      {
        from: ((query.page || 1) - 1) * (query.limit || 20),
        size: query.limit || 20,
        sort: this.buildSortClause(query.sort),
        highlight: query.highlight ? {
          fields: {
            title: {},
            description: {},
            content: {}
          }
        } : undefined
      }
    );

    return {
      items: result.hits.map(hit => hit.source),
      total: result.total,
      page: query.page || 1,
      limit: query.limit || 20,
      query_time: Date.now() - startTime
    };
  }

  async searchUsers(query: SearchQuery): Promise<SearchResult<User>> {
    const startTime = Date.now();
    
    const elasticQuery = this.buildElasticQuery(query);
    
    const result = await elasticsearchService.searchDocuments(
      SearchIndices.USERS,
      elasticQuery,
      {
        from: ((query.page || 1) - 1) * (query.limit || 20),
        size: query.limit || 20,
        sort: this.buildSortClause(query.sort)
      }
    );

    return {
      items: result.hits.map(hit => hit.source),
      total: result.total,
      page: query.page || 1,
      limit: query.limit || 20,
      query_time: Date.now() - startTime
    };
  }

  private buildElasticQuery(query: SearchQuery): any {
    const must = [];
    const filter = [];

    // Text search
    if (query.query) {
      must.push({
        multi_match: {
          query: query.query,
          fields: ['title^3', 'description^2', 'content', 'tags'],
          type: 'best_fields',
          fuzziness: 'AUTO'
        }
      });
    }

    // Filters
    if (query.filters) {
      Object.entries(query.filters).forEach(([field, value]) => {
        if (Array.isArray(value)) {
          filter.push({ terms: { [field]: value } });
        } else if (typeof value === 'object' && value.from && value.to) {
          filter.push({ range: { [field]: value } });
        } else {
          filter.push({ term: { [field]: value } });
        }
      });
    }

    return {
      bool: {
        must: must.length > 0 ? must : [{ match_all: {} }],
        filter
      }
    };
  }

  private buildSortClause(sort?: Array<{ field: string; direction: 'asc' | 'desc' }>): any {
    if (!sort || sort.length === 0) {
      return [{ _score: { order: 'desc' } }];
    }

    return sort.map(({ field, direction }) => ({
      [field]: { order: direction }
    }));
  }

  private buildFacetAggregations(facets: string[]): any {
    const aggs: any = {};
    
    facets.forEach(facet => {
      aggs[facet] = {
        terms: {
          field: facet,
          size: 20
        }
      };
    });

    return aggs;
  }

  private async getSuggestions(query: string): Promise<string[]> {
    if (query.length < 2) return [];

    try {
      const result = await elasticsearchService.searchDocuments(
        SearchIndices.CHALLENGES,
        {
          suggest: {
            title_suggest: {
              prefix: query,
              completion: {
                field: 'title.suggest',
                size: 5
              }
            }
          }
        }
      );

      return result.suggest?.title_suggest?.[0]?.options?.map((option: any) => option.text) || [];
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      return [];
    }
  }
}

export const searchService = new AdvancedSearchService();
```

## 📊 Search Analytics

### Search Tracking Service
```typescript
interface SearchAnalytics {
  query: string;
  results_count: number;
  clicked_results: string[];
  user_id?: string;
  session_id: string;
  search_time: number;
  filters_used?: Record<string, any>;
  result_interaction: {
    clicked_position?: number;
    time_to_click?: number;
    clicked_item_id?: string;
  };
}

class SearchAnalyticsService {
  async trackSearch(analytics: SearchAnalytics): Promise<void> {
    try {
      // Store in Supabase for analysis
      await supabase
        .from('search_analytics')
        .insert([{
          query: analytics.query,
          results_count: analytics.results_count,
          clicked_results: analytics.clicked_results,
          user_id: analytics.user_id,
          session_id: analytics.session_id,
          search_time: analytics.search_time,
          filters_used: analytics.filters_used,
          result_interaction: analytics.result_interaction,
          created_at: new Date().toISOString()
        }]);

      // Also index in Elasticsearch for fast analytics
      await elasticsearchService.indexDocument(
        'search_analytics',
        `${analytics.session_id}_${Date.now()}`,
        analytics
      );
    } catch (error) {
      console.error('Failed to track search analytics:', error);
    }
  }

  async getSearchMetrics(timeRange: 'day' | 'week' | 'month'): Promise<any> {
    const startDate = this.getStartDate(timeRange);
    
    const { data, error } = await supabase
      .from('search_analytics')
      .select('*')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    return this.processSearchMetrics(data);
  }

  private processSearchMetrics(data: any[]): any {
    const totalSearches = data.length;
    const uniqueQueries = new Set(data.map(d => d.query)).size;
    const avgResultsPerSearch = data.reduce((sum, d) => sum + d.results_count, 0) / totalSearches;
    const clickThroughRate = data.filter(d => d.clicked_results.length > 0).length / totalSearches;

    const topQueries = this.getTopQueries(data);
    const searchTrends = this.getSearchTrends(data);

    return {
      total_searches: totalSearches,
      unique_queries: uniqueQueries,
      avg_results_per_search: avgResultsPerSearch,
      click_through_rate: clickThroughRate,
      top_queries: topQueries,
      search_trends: searchTrends
    };
  }

  private getTopQueries(data: any[]): Array<{ query: string; count: number }> {
    const queryCount = data.reduce((acc, d) => {
      acc[d.query] = (acc[d.query] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(queryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }));
  }

  private getSearchTrends(data: any[]): any {
    // Group by day and calculate trends
    const dailySearches = data.reduce((acc, d) => {
      const date = new Date(d.created_at).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(dailySearches)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));
  }
}

export const searchAnalyticsService = new SearchAnalyticsService();
```

## 🎯 Smart Search Features

### Auto-Complete Service
```typescript
class AutoCompleteService {
  private cache = new Map<string, any>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  async getSuggestions(query: string, type: 'all' | 'challenges' | 'users' | 'content' = 'all'): Promise<any[]> {
    const cacheKey = `${type}_${query}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.suggestions;
      }
    }

    let suggestions: any[] = [];

    switch (type) {
      case 'challenges':
        suggestions = await this.getChallengeSuggestions(query);
        break;
      case 'users':
        suggestions = await this.getUserSuggestions(query);
        break;
      case 'content':
        suggestions = await this.getContentSuggestions(query);
        break;
      default:
        suggestions = await this.getAllSuggestions(query);
    }

    // Cache results
    this.cache.set(cacheKey, {
      suggestions,
      timestamp: Date.now()
    });

    return suggestions;
  }

  private async getChallengeSuggestions(query: string): Promise<any[]> {
    const result = await elasticsearchService.searchDocuments(
      SearchIndices.CHALLENGES,
      {
        multi_match: {
          query,
          fields: ['title^3', 'description'],
          type: 'phrase_prefix'
        }
      },
      {
        size: 5,
        _source: ['title', 'category', 'status']
      }
    );

    return result.hits.map(hit => ({
      type: 'challenge',
      title: hit.source.title,
      category: hit.source.category,
      status: hit.source.status
    }));
  }

  private async getUserSuggestions(query: string): Promise<any[]> {
    const result = await elasticsearchService.searchDocuments(
      SearchIndices.USERS,
      {
        multi_match: {
          query,
          fields: ['full_name^3', 'position', 'department'],
          type: 'phrase_prefix'
        }
      },
      {
        size: 5,
        _source: ['full_name', 'position', 'department']
      }
    );

    return result.hits.map(hit => ({
      type: 'user',
      name: hit.source.full_name,
      position: hit.source.position,
      department: hit.source.department
    }));
  }

  private async getAllSuggestions(query: string): Promise<any[]> {
    const [challenges, users, content] = await Promise.all([
      this.getChallengeSuggestions(query),
      this.getUserSuggestions(query),
      this.getContentSuggestions(query)
    ]);

    return [...challenges, ...users, ...content];
  }
}

export const autoCompleteService = new AutoCompleteService();
```

### Search Filters & Facets
```typescript
interface SearchFilters {
  categories?: string[];
  dateRange?: { from: Date; to: Date };
  status?: string[];
  difficulty?: string[];
  tags?: string[];
  priceRange?: { min: number; max: number };
  location?: { lat: number; lng: number; radius: number };
}

class SearchFilterService {
  async getAvailableFilters(searchType: string): Promise<any> {
    const aggs = await elasticsearchService.searchDocuments(
      searchType,
      { match_all: {} },
      {
        size: 0,
        aggs: {
          categories: { terms: { field: 'category', size: 20 } },
          statuses: { terms: { field: 'status', size: 10 } },
          tags: { terms: { field: 'tags', size: 50 } },
          difficulty_levels: { terms: { field: 'difficulty_level', size: 5 } },
          date_histogram: {
            date_histogram: {
              field: 'created_at',
              calendar_interval: 'month'
            }
          }
        }
      }
    );

    return {
      categories: aggs.aggregations.categories.buckets,
      statuses: aggs.aggregations.statuses.buckets,
      tags: aggs.aggregations.tags.buckets,
      difficulty_levels: aggs.aggregations.difficulty_levels.buckets,
      date_distribution: aggs.aggregations.date_histogram.buckets
    };
  }

  applyFilters(query: any, filters: SearchFilters): any {
    const filterClauses = [];

    if (filters.categories && filters.categories.length > 0) {
      filterClauses.push({ terms: { category: filters.categories } });
    }

    if (filters.status && filters.status.length > 0) {
      filterClauses.push({ terms: { status: filters.status } });
    }

    if (filters.tags && filters.tags.length > 0) {
      filterClauses.push({ terms: { tags: filters.tags } });
    }

    if (filters.dateRange) {
      filterClauses.push({
        range: {
          created_at: {
            gte: filters.dateRange.from.toISOString(),
            lte: filters.dateRange.to.toISOString()
          }
        }
      });
    }

    if (filters.priceRange) {
      filterClauses.push({
        range: {
          reward_amount: {
            gte: filters.priceRange.min,
            lte: filters.priceRange.max
          }
        }
      });
    }

    if (filters.location) {
      filterClauses.push({
        geo_distance: {
          distance: `${filters.location.radius}km`,
          location: {
            lat: filters.location.lat,
            lon: filters.location.lng
          }
        }
      });
    }

    return {
      ...query,
      bool: {
        ...query.bool,
        filter: filterClauses
      }
    };
  }
}

export const searchFilterService = new SearchFilterService();
```

## 🔧 Search Administration

### Index Management
```typescript
class SearchIndexManager {
  async createIndex(indexName: string, mapping: any): Promise<void> {
    try {
      await elasticsearchService.client.indices.create({
        index: indexName,
        body: mapping
      });
    } catch (error) {
      console.error(`Failed to create index ${indexName}:`, error);
      throw error;
    }
  }

  async reindexData(sourceIndex: string, targetIndex: string): Promise<void> {
    try {
      await elasticsearchService.client.reindex({
        body: {
          source: { index: sourceIndex },
          dest: { index: targetIndex }
        }
      });
    } catch (error) {
      console.error('Failed to reindex data:', error);
      throw error;
    }
  }

  async optimizeIndex(indexName: string): Promise<void> {
    try {
      await elasticsearchService.client.indices.forcemerge({
        index: indexName,
        max_num_segments: 1
      });
    } catch (error) {
      console.error(`Failed to optimize index ${indexName}:`, error);
      throw error;
    }
  }

  async getIndexStats(indexName: string): Promise<any> {
    try {
      const stats = await elasticsearchService.client.indices.stats({
        index: indexName
      });
      
      return stats.body.indices[indexName];
    } catch (error) {
      console.error(`Failed to get stats for index ${indexName}:`, error);
      throw error;
    }
  }
}

export const searchIndexManager = new SearchIndexManager();
```

---

*Search Services: 10+ documented | Elasticsearch: ✅ Integrated | Analytics: ✅ Tracked*