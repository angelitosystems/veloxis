import type { 
  VeloxisRequestConfig, 
  VeloxisResponse, 
  VeloxisInterceptor, 
  VeloxisPlugin, 
  GraphQLOptions,
  HTTPMethod
} from '../types';
import { executeFetch } from './request';
import { parseResponse } from './response';
import { mergeURLs, buildURL, dedupeManager, debugLog } from '../utils/helpers';
import { VeloxisError } from '../utils/errors';

/**
 * The main Veloxis HTTP Client.
 */
export class Veloxis {
  private defaults: VeloxisRequestConfig;
  private interceptors = {
    request: [] as VeloxisInterceptor<VeloxisRequestConfig>[],
    response: [] as VeloxisInterceptor<VeloxisResponse>[]
  };
  private plugins: VeloxisPlugin[] = [];

  constructor(options: VeloxisRequestConfig = {}) {
    this.defaults = {
      timeout: 0,
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      ...options
    };
  }

  /**
   * Registers a plugin.
   */
  use(plugin: VeloxisPlugin) {
    this.plugins.push(plugin);
    return this;
  }

  /**
   * Adds an interceptor.
   */
  intercept(type: 'request' | 'response', interceptor: VeloxisInterceptor<any>) {
    this.interceptors[type].push(interceptor);
    return this;
  }

  async get<T = any>(url: string, config?: VeloxisRequestConfig): Promise<VeloxisResponse<T>> {
    return this.request<T>({ ...config, url, method: 'GET' });
  }

  async post<T = any>(url: string, data?: any, config?: VeloxisRequestConfig): Promise<VeloxisResponse<T>> {
    return this.request<T>({ ...config, url, method: 'POST', data });
  }

  async put<T = any>(url: string, data?: any, config?: VeloxisRequestConfig): Promise<VeloxisResponse<T>> {
    return this.request<T>({ ...config, url, method: 'PUT', data });
  }

  async delete<T = any>(url: string, config?: VeloxisRequestConfig): Promise<VeloxisResponse<T>> {
    return this.request<T>({ ...config, url, method: 'DELETE' });
  }

  /**
   * GraphQL request method.
   */
  async graphql<T = any, V = any>(url: string, options: GraphQLOptions<V>, config?: VeloxisRequestConfig): Promise<T> {
    const res = await this.post<any>(url, {
      query: options.query,
      variables: options.variables,
      operationName: options.operationName
    }, config);
    
    if (res.data.errors) {
      throw new VeloxisError('GraphQL Error', res.config, 'GRAPHQL_ERROR', res);
    }
    
    return res.data.data;
  }

  /**
   * Orchestrates the entire request/response lifecycle.
   */
  async request<T = any>(config: VeloxisRequestConfig): Promise<VeloxisResponse<T>> {
    let mergedConfig: VeloxisRequestConfig = {
      ...this.defaults,
      ...config,
      headers: { ...this.defaults.headers, ...config.headers }
    };

    try {
      // 1. Plugins: onBeforeRequest
      for (const plugin of this.plugins) {
        if (plugin.onBeforeRequest) {
          const result = await plugin.onBeforeRequest(mergedConfig);
          if (result) mergedConfig = result;
          
          // Plugin may return a cached response
          if ((mergedConfig as any)._cachedResponse) {
            return (mergedConfig as any)._cachedResponse;
          }
        }
      }

      // 2. Interceptors: request
      for (const interceptor of this.interceptors.request) {
        if (interceptor.fulfilled) {
          mergedConfig = await interceptor.fulfilled(mergedConfig);
        }
      }

      const fullURL = buildURL(mergeURLs(mergedConfig.baseURL, mergedConfig.url), mergedConfig.params);
      
      // 3. Deduplication
      const dedupeKey = dedupeManager.generateKey(mergedConfig);
      if (mergedConfig.dedupe && dedupeManager.pending.has(dedupeKey)) {
        debugLog(mergedConfig, `Deduplicating request: ${fullURL}`);
        return dedupeManager.pending.get(dedupeKey);
      }

      const requestPromise = this.performRequest<T>(fullURL, mergedConfig);

      if (mergedConfig.dedupe) {
        dedupeManager.pending.set(dedupeKey, requestPromise);
        requestPromise.finally(() => dedupeManager.pending.delete(dedupeKey));
      }

      return await requestPromise;

    } catch (error: any) {
      return this.handleError(error);
    }
  }

  /**
   * Executes the actual fetch and processes the response.
   */
  private async performRequest<T>(url: string, config: VeloxisRequestConfig): Promise<VeloxisResponse<T>> {
    const rawResponse = await executeFetch(url, config);
    let response = await parseResponse<T>(rawResponse, config);

    // 4. Plugins: onAfterResponse
    for (const plugin of this.plugins) {
      if (plugin.onAfterResponse) {
        const result = await plugin.onAfterResponse(response);
        if (result) response = result;
      }
    }

    // 5. Interceptors: response
    for (const interceptor of this.interceptors.response) {
      if (interceptor.fulfilled) {
        response = await interceptor.fulfilled(response);
      }
    }

    return response;
  }

  /**
   * Handles errors through plugins and interceptors.
   */
  private async handleError(error: any): Promise<any> {
    let finalError = error;

    // 6. Plugins: onError
    for (const plugin of this.plugins) {
      if (plugin.onError) {
        try {
          const result = await plugin.onError(finalError);
          // If plugin returns a config, retry the request
          if (result && !(result instanceof Error) && typeof result === 'object') {
            return this.request(result);
          }
          if (result instanceof Error) finalError = result;
        } catch (pluginError) {
          finalError = pluginError;
        }
      }
    }

    // 7. Interceptors: response rejected
    for (const interceptor of this.interceptors.response) {
      if (interceptor.rejected) {
        try {
          finalError = await interceptor.rejected(finalError);
        } catch (interceptorError) {
          finalError = interceptorError;
        }
      }
    }

    throw finalError;
  }
}
