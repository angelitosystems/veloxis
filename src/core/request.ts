import type { VeloxisRequestConfig } from '../types';
import { VeloxisError } from '../utils/errors';
import { debugLog } from '../utils/helpers';

/**
 * Executes the native fetch call with the provided configuration.
 */
export async function executeFetch(url: string, config: VeloxisRequestConfig): Promise<Response> {
  const controller = new AbortController();
  const { signal } = controller;
  
  // Link external signal if provided
  if (config.signal) {
    config.signal.addEventListener('abort', () => controller.abort());
  }

  let timeoutId: any;
  if (config.timeout) {
    timeoutId = setTimeout(() => controller.abort('timeout'), config.timeout);
  }

  const fetchOptions: RequestInit = {
    method: config.method || 'GET',
    headers: new Headers(config.headers as Record<string, string>),
    body: config.data ? (typeof config.data === 'object' ? JSON.stringify(config.data) : config.data) : undefined,
    signal
  };

  try {
    debugLog(config, `Request: ${config.method} ${url}`);
    const response = await fetch(url, fetchOptions);
    if (timeoutId) clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    if (timeoutId) clearTimeout(timeoutId);

    if (error.name === 'AbortError' || error === 'timeout') {
      throw new VeloxisError(
        config.timeout ? `Request timed out after ${config.timeout}ms` : 'Request aborted',
        config,
        'TIMEOUT'
      );
    }
    throw new VeloxisError(error.message, config, 'NETWORK_ERROR');
  }
}
