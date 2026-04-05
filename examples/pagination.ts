import veloxis, { createPaginator } from '../src';

/**
 * REST Pagination Example (Offset-based)
 */
async function restPaginationExample() {
  console.log('--- REST Offset Pagination ---');
  
  const paginator = createPaginator({
    type: 'offset',
    pageSize: 5,
    fetch: async (params) => {
      // Mocking the request. In a real scenario:
      // const res = await veloxis.get('/users', { params });
      console.log('Fetching REST with params:', params);
      
      const start = params.offset;
      const end = start + params.limit;
      const mockItems = Array.from({ length: 5 }, (_, i) => ({ id: start + i + 1, name: `User ${start + i + 1}` }));
      
      return {
        items: mockItems,
        total: 100,
        hasMore: start + 5 < 15 // Mock limit to 15 items total
      };
    }
  });

  console.log('Page 1:');
  await paginator.next();
  console.log('Items:', paginator.getItems());

  console.log('Page 2:');
  await paginator.next();
  console.log('Items:', paginator.getItems());
  
  console.log('Accumulated so far:', paginator.getAccumulated().length);
}

/**
 * GraphQL Pagination Example (Cursor-based)
 */
async function graphqlPaginationExample() {
  console.log('\n--- GraphQL Cursor Pagination ---');

  const paginator = createPaginator({
    type: 'cursor',
    pageSize: 2,
    fetch: async (params) => {
      console.log('Fetching GraphQL with params:', params);
      
      const query = `
        query GetPosts($first: Int, $after: String) {
          posts(first: $first, after: $after) {
            edges {
              node { id, title }
              cursor
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `;

      // Mock response structure
      const mockCursors = ['cursor-1', 'cursor-2', 'cursor-3'];
      const nextCursor = params.after === null ? 'cursor-1' : (params.after === 'cursor-1' ? 'cursor-2' : null);
      const items = [{ id: Math.random(), title: 'Post' }, { id: Math.random(), title: 'Post' }];

      return {
        items,
        nextCursor,
        hasMore: !!nextCursor
      };
    }
  });

  await paginator.next();
  console.log('Current items:', paginator.getItems());
  
  if (paginator.hasNext()) {
    console.log('Fetching next page...');
    await paginator.next();
    console.log('Current items:', paginator.getItems());
  }

  console.log('Total accumulated:', paginator.getAccumulated().length);
}

async function run() {
  await restPaginationExample();
  await graphqlPaginationExample();
}

run();
