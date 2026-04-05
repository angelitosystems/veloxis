import type { VeloxisPlugin, VeloxisResponse } from '../types';
import { debugLog } from '../utils/helpers';

interface CacheItem {
  response: VeloxisResponse;
  expiresAt: number;
}

/**
 * Plugin to cache GET requests in memory with TTL.
 */
export function cachePlugin(defaultTTL = 60000): VeloxisPlugin {
  const cache = new Map<string, CacheItem>();

  return {
    name: 'cache',
    onBeforeRequest: async (config) => {
      if (!config.cache || config.method !== 'GET') return;

      const cacheKey = `${config.method}:${config.url}:${JSON.stringify(config.params)}`;
      const cached = cache.get(cacheKey);

      if (cached && cached.expiresAt > Date.now()) {
        debugLog(config, `Cache HIT: ${config.url}`);
        return { ...config, _cachedResponse: cached.response } as any;
      }
      
      debugLog(config, `Cache MISS: ${config.url}`);
    },
    onAfterResponse: (response) => {
      const { config } = response;
      if (!config.cache || config.method !== 'GET') return;

      const ttl = typeof config.cache === 'object' ? config.cache.ttl ?? defaultTTL : defaultTTL;
      const cacheKey = `${config.method}:${config.url}:${JSON.stringify(config.params)}`;

      cache.set(cacheKey, {
        response,
        expiresAt: Date.now() + ttl
      });
    }
  };
}
