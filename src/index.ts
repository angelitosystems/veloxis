export * from './types';
export * from './types/pagination';
export * from './core/client';
export * from './utils/errors';
export * from './utils/pagination';
export { retryPlugin } from './plugins/retry';
export { cachePlugin } from './plugins/cache';
export { authPlugin } from './plugins/auth';

import { Veloxis } from './core/client';

/**
 * Default instance of Veloxis client.
 */
export const veloxis = new Veloxis();

export default veloxis;
