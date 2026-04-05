import type { VeloxisRequestConfig } from '../types';

/**
 * Combine baseURL and relative URL.
 */
export function mergeURLs(baseURL?: string, relativeURL?: string): string {
  if (!baseURL) return relativeURL || '';
  if (!relativeURL) return baseURL;
  return baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '');
}

/**
 * Append query parameters to a URL.
 */
export function buildURL(url: string, params?: Record<string, any>): string {
  if (!params || Object.keys(params).length === 0) return url;
  
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `${url}${url.includes('?') ? '&' : '?'}${queryString}` : url;
}

/**
 * Deduplication manager to prevent concurrent identical requests.
 */
export const dedupeManager = {
  pending: new Map<string, Promise<any>>(),
  
  generateKey(config: VeloxisRequestConfig): string {
    return `${config.method}:${config.url}:${JSON.stringify(config.params)}:${JSON.stringify(config.data)}`;
  }
};

/**
 * Utility for debug logging.
 */
export function debugLog(config: VeloxisRequestConfig, ...args: any[]) {
  if (config.debug) {
    console.log(`[Veloxis][DEBUG]`, ...args);
  }
}
