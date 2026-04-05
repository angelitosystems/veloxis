# Plugin System in Veloxis

Veloxis is highly extensible through its plugin system. Plugins can intercept requests, responses, and errors.

## Using Built-in Plugins

### 1. Retry Plugin

Retries failed requests with exponential backoff.

```typescript
import { Veloxis, retryPlugin } from 'veloxis';

const api = new Veloxis();
api.use(retryPlugin(3, 1000)); // (attempts, initial delay)

// Triggered by 'retry: true' in request config
await api.get('/api', { retry: true });
```

### 2. Cache Plugin

In-memory cache for GET requests.

```typescript
import { Veloxis, cachePlugin } from 'veloxis';

const api = new Veloxis();
api.use(cachePlugin(60000)); // (default TTL in ms)

// Use it per-request
await api.get('/api', { cache: true });
```

### 3. Auth Plugin

Inject authentication headers automatically.

```typescript
import { Veloxis, authPlugin } from 'veloxis';

const api = new Veloxis();
api.use(authPlugin({ 'Authorization': 'Bearer YOUR_TOKEN' }));
```

## Creating Custom Plugins

```typescript
import { VeloxisPlugin } from 'veloxis';

const myPlugin: VeloxisPlugin = {
  name: 'my-plugin',
  onBeforeRequest: (config) => {
    config.headers['X-Plugin'] = 'true';
    return config;
  },
  onAfterResponse: (response) => {
    console.log('Response received:', response.status);
    return response;
  },
  onError: (error) => {
    console.error('An error occurred:', error.message);
    throw error;
  }
};

api.use(myPlugin);
```
