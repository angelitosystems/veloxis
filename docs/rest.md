# REST Usage in Veloxis

Veloxis provides a high-level API for RESTful requests, supporting all standard HTTP methods.

## Basic Requests

```typescript
import veloxis from 'veloxis';

// GET
const posts = await veloxis.get('/posts');

// POST
const newPost = await veloxis.post('/posts', { title: 'Hello', body: 'World' });

// PUT
const updated = await veloxis.put('/posts/1', { title: 'New Title' });

// DELETE
await veloxis.delete('/posts/1');
```

## Custom Instance

Create an instance for shared configuration:

```typescript
import { Veloxis } from 'veloxis';

const api = new Veloxis({
  baseURL: 'https://api.example.com',
  headers: {
    'X-API-Key': '123'
  },
  timeout: 5000,
  debug: true
});
```

## Typed Responses

All request methods support generics for the response data:

```typescript
interface User {
  id: number;
  name: string;
}

const response = await api.get<User[]>('/users');
const users = response.data; // Type: User[]
```

## Interceptors

Add async interceptors for requests and responses:

```typescript
api.intercept('request', {
  fulfilled: async (config) => {
    config.headers['X-Timestamp'] = Date.now().toString();
    return config;
  }
});
```
