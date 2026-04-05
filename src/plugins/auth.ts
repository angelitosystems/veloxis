import type { VeloxisPlugin, VeloxisHeaders } from '../types';

/**
 * Plugin to automatically inject auth headers.
 */
export function authPlugin(headers: VeloxisHeaders | (() => VeloxisHeaders | Promise<VeloxisHeaders>)): VeloxisPlugin {
  return {
    name: 'auth',
    onBeforeRequest: async (config) => {
      const authHeaders = typeof headers === 'function' ? await headers() : headers;
      config.headers = { ...config.headers, ...authHeaders };
      return config;
    }
  };
}
