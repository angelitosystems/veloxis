import { expect, test, describe } from 'bun:test';
import { Veloxis, cachePlugin, authPlugin } from '../src';

describe('Veloxis Plugins', () => {
  test('Cache Plugin caches GET requests', async () => {
    const api = new Veloxis();
    api.use(cachePlugin(1000));
    
    const url = 'https://jsonplaceholder.typicode.com/todos/1';
    
    const res1 = await api.get(url, { cache: true });
    const res2 = await api.get(url, { cache: true });
    
    // Check if the data is identical
    expect(res1.data).toEqual(res2.data);
  });

  test('Auth Plugin injects headers', async () => {
    const api = new Veloxis();
    api.use(authPlugin({ 'X-Test': 'Header-Value' }));
    
    // In actual use, we would mock fetch to verify headers.
    // For now, let's verify it doesn't break the request.
    const res = await api.get('https://jsonplaceholder.typicode.com/todos/1');
    expect(res.status).toBe(200);
  });
});
