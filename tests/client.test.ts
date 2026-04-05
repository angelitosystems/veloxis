import { expect, test, describe, spyOn } from 'bun:test';
import { Veloxis } from '../src';

describe('Veloxis Core Client', () => {
  const api = new Veloxis({
    baseURL: 'https://jsonplaceholder.typicode.com'
  });

  test('GET request works', async () => {
    const res = await api.get('/todos/1');
    expect(res.status).toBe(200);
    expect(res.data.id).toBe(1);
  });

  test('POST request sends data', async () => {
    const payload = { title: 'Test', body: 'Veloxis' };
    const res = await api.post('/posts', payload);
    expect(res.status).toBe(201);
    expect(res.data.title).toBe('Test');
  });

  test('Request Interceptor is called', async () => {
    const localApi = new Veloxis();
    const interceptorSpy = {
      fulfilled: (config: any) => {
        config.headers['X-Custom'] = 'test';
        return config;
      }
    };
    const spy = spyOn(interceptorSpy, 'fulfilled');
    
    localApi.intercept('request', interceptorSpy);
    await localApi.get('https://jsonplaceholder.typicode.com/todos/1');
    
    expect(spy).toHaveBeenCalled();
  });

  test('Timeout triggers error', async () => {
    const slowApi = new Veloxis({ timeout: 1 });
    try {
      await slowApi.get('https://jsonplaceholder.typicode.com/posts');
      expect(true).toBe(false); // Should not reach here
    } catch (err: any) {
      expect(err.code).toBe('TIMEOUT');
    }
  });
});
