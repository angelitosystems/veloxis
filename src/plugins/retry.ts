import type { VeloxisPlugin, VeloxisRequestConfig } from '../types';
import { debugLog } from '../utils/helpers';

/**
 * Plugin to retry failed requests with exponential backoff.
 */
export function retryPlugin(defaultAttempts = 3, defaultDelay = 1000): VeloxisPlugin {
  return {
    name: 'retry',
    onError: async (error: any) => {
      const config = error.config as VeloxisRequestConfig;
      if (!config || !config.retry) throw error;

      // Skip retry for abort or manual cancel
      if (error.code === 'TIMEOUT' && !config.timeout) throw error;

      const retryConfig = typeof config.retry === 'boolean' 
        ? { attempts: defaultAttempts, delay: defaultDelay } 
        : { attempts: config.retry.attempts ?? defaultAttempts, delay: config.retry.delay ?? defaultDelay };

      const currentAttempt = config._retryAttempt || 0;

      if (currentAttempt < retryConfig.attempts) {
        const nextAttempt = currentAttempt + 1;
        const delay = retryConfig.delay * Math.pow(2, currentAttempt);

        debugLog(config, `Retry Attempt ${nextAttempt}/${retryConfig.attempts} in ${delay}ms`);

        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Return updated config for retry
        return { ...config, _retryAttempt: nextAttempt };
      }

      throw error;
    }
  };
}
