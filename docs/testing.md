# Testing the Veloxis Library

Veloxis uses **Bun test** for its internal testing. Tests cover the core client, plugins, pagination, and GraphQL.

## Running Tests

```bash
bun test
```

## Test Structure

- `tests/client.test.ts`: Covers REST methods and interceptors.
- `tests/graphql.test.ts`: Covers GraphQL queries, mutations, and errors.
- `tests/plugins.test.ts`: Covers retry, cache, and auth plugin behavior.
- `tests/pagination.test.ts`: Covers cursor and offset pagination.

## Mocking Requests

Tests use standard mocking techniques to simulate network responses and verify the client's behavior.

```typescript
import { expect, test, mock } from 'bun:test';
import { Veloxis } from 'veloxis';

test('it performs a GET request', async () => {
  // Mock fetch if needed
  const api = new Veloxis();
  const res = await api.get('https://example.com');
  expect(res.status).toBe(200);
});
```
