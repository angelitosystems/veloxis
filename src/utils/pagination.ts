import type { 
  PaginationConfig, 
  PaginationResponse, 
  PaginationState 
} from '../types/pagination';

/**
 * Reusable Pagination Utility for Veloxis.
 */
export class Paginator<T, P extends Record<string, any> = any> {
  private config: Required<PaginationConfig<T, P>>;
  private state: PaginationState<T>;
  private fetchPromise: Promise<PaginationResponse<T>> | null = null;

  constructor(config: PaginationConfig<T, P>) {
    this.config = {
      pageSize: 10,
      initialParams: {} as P,
      transform: (data) => data,
      dedupeKey: (item: any) => item.id ?? JSON.stringify(item),
      ...config
    };

    this.state = this.getInitialState();
  }

  private getInitialState(): PaginationState<T> {
    return {
      items: [],
      accumulatedItems: [],
      isLoading: false,
      error: null,
      currentPage: 0,
      currentCursor: null,
      hasMore: true
    };
  }

  /**
   * Resets the paginator state.
   */
  reset() {
    this.state = this.getInitialState();
    this.fetchPromise = null;
  }

  /**
   * Fetches the next page of results.
   */
  async next(): Promise<T[]> {
    if (!this.state.hasMore || this.state.isLoading) return this.state.items;

    if (this.fetchPromise) return (await this.fetchPromise).items;

    this.state.isLoading = true;
    this.state.error = null;

    const params = this.buildParams();

    try {
      this.fetchPromise = this.config.fetch(params);
      const response = await this.fetchPromise;

      const newItems = this.config.transform(response.items);
      
      // Update items with deduplication
      this.state.items = newItems;
      this.updateAccumulated(newItems);

      this.state.hasMore = response.hasMore;
      this.state.currentCursor = response.nextCursor ?? null;
      this.state.currentPage++;
      
      return newItems;
    } catch (error) {
      this.state.error = error;
      throw error;
    } finally {
      this.state.isLoading = false;
      this.fetchPromise = null;
    }
  }

  /**
   * Fetches all pages automatically.
   */
  async all(maxPages = 50): Promise<T[]> {
    let pages = 0;
    while (this.state.hasMore && pages < maxPages) {
      await this.next();
      pages++;
    }
    return this.state.accumulatedItems;
  }

  private buildParams(): P {
    const base = { ...this.config.initialParams };
    
    if (this.config.type === 'offset') {
      return {
        ...base,
        limit: this.config.pageSize,
        offset: this.state.currentPage * this.config.pageSize
      } as unknown as P;
    } else {
      return {
        ...base,
        first: this.config.pageSize,
        after: this.state.currentCursor
      } as unknown as P;
    }
  }

  private updateAccumulated(newItems: T[]) {
    const existingKeys = new Set(this.state.accumulatedItems.map(this.config.dedupeKey));
    const uniqueNew = newItems.filter(item => !existingKeys.has(this.config.dedupeKey(item)));
    this.state.accumulatedItems = [...this.state.accumulatedItems, ...uniqueNew];
  }

  // Getters
  getState() { return { ...this.state }; }
  getItems() { return this.state.items; }
  getAccumulated() { return this.state.accumulatedItems; }
  hasNext() { return this.state.hasMore; }
  isLoading() { return this.state.isLoading; }
}

export function createPaginator<T, P extends Record<string, any> = any>(config: PaginationConfig<T, P>) {
  return new Paginator<T, P>(config);
}
