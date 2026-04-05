# Pagination in Veloxis

Veloxis includes a standalone, high-performance `Paginator` utility for REST and GraphQL.

## Cursor-based Pagination (Recommended for GraphQL)

```typescript
import { createPaginator } from 'veloxis';

const paginator = createPaginator({
  type: 'cursor',
  pageSize: 10,
  fetch: async (params) => {
    // Return typed results and the next cursor
    return {
      items: response.data.posts.edges.map(e => e.node),
      nextCursor: response.data.posts.pageInfo.endCursor,
      hasMore: response.data.posts.pageInfo.hasNextPage
    };
  }
});

// Fetch next page
await paginator.next();
console.log(paginator.getItems());
```

## Offset-based Pagination (Standard REST)

```typescript
const paginator = createPaginator({
  type: 'offset',
  pageSize: 5,
  fetch: async (params) => {
    // params include { limit, offset }
    const res = await veloxis.get('/users', { params });
    return {
      items: res.data,
      hasMore: res.data.length === 5
    };
  }
});
```

## Auto-fetch all pages

```typescript
// Fetches all pages until hasMore is false (limit to 50 pages)
const allItems = await paginator.all(50);
```

## State Management

Track the state of pagination:

```typescript
const { isLoading, error, currentPage } = paginator.getState();
```
