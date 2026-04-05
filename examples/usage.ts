import veloxis, { Veloxis, retryPlugin, cachePlugin, authPlugin } from '../src';

/**
 * 1. REST Usage Example
 */
async function restExample() {
  console.log('--- REST Example ---');
  
  // Custom instance
  const api = new Veloxis({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 5000,
    debug: true
  });

  // Add plugins
  api.use(retryPlugin(2, 500));
  api.use(cachePlugin(5000));
  api.use(authPlugin(() => ({ 'Authorization': 'Bearer TOKEN_123' })));

  // Interceptors
  api.intercept('request', {
    fulfilled: (config) => {
      console.log(`[Request Interceptor] ${config.method} ${config.url}`);
      return config;
    }
  });

  api.intercept('response', {
    fulfilled: (response) => {
      console.log(`[Response Interceptor] Status ${response.status}`);
      return response;
    }
  });

  try {
    const post = await api.get('/posts/1', { cache: true });
    console.log('Post Title:', (post.data as any).title);

    // This should trigger a cache hit
    console.log('\nFetching again (cache hit expected):');
    await api.get('/posts/1', { cache: true });

    // Deduplication test
    console.log('\nConcurrent requests (deduplication test):');
    const [r1, r2] = await Promise.all([
      api.get('/posts/2', { dedupe: true }),
      api.get('/posts/2', { dedupe: true })
    ]);
    console.log('Concurrent requests finished.');

  } catch (error: any) {
    console.error('API Error:', error.message);
  }
}

/**
 * 2. GraphQL Usage Example
 */
async function graphqlExample() {
  console.log('\n--- GraphQL Example ---');
  
  const client = new Veloxis({
    baseURL: 'https://countries.trevorblades.com/',
    debug: true
  });

  const query = `
    query getCountry($code: ID!) {
      country(code: $code) {
        name
        native
        capital
        emoji
        currency
        languages {
          code
          name
        }
      }
    }
  `;

  try {
    const data = await client.graphql<any>( '', {
      query,
      variables: { code: 'BR' }
    });
    console.log('Country:', data.country.name);
    console.log('Native:', data.country.native);
  } catch (error: any) {
    console.error('GraphQL Error:', error.message);
  }
}

async function run() {
  await restExample();
  await graphqlExample();
}

run();
