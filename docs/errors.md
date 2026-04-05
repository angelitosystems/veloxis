# Error Handling in Veloxis

Veloxis uses a custom `VeloxisError` class to provide rich information about failed requests.

## VeloxisError Structure

When a request fails, you catch a `VeloxisError` with the following properties:

```typescript
import { VeloxisError } from 'veloxis';

try {
  await veloxis.get('/api/users/1');
} catch (error) {
  if (error instanceof VeloxisError) {
    console.log(error.message); // e.g. "Request failed with status 404"
    console.log(error.status);  // e.g. 404
    console.log(error.code);    // e.g. "BAD_STATUS", "TIMEOUT", "NETWORK_ERROR", "GRAPHQL_ERROR"
    console.log(error.config);  // The original request config
    console.log(error.response); // The full response object (if status code error)
  }
}
```

## Error Codes

- `BAD_STATUS`: HTTP status code is >= 400.
- `TIMEOUT`: Request timed out (via `AbortController`).
- `NETWORK_ERROR`: Network connectivity issues or fetch failure.
- `GRAPHQL_ERROR`: The server returned an `errors` array in GraphQL data.

## JSON representation

You can serialize errors for logging or API reporting:

```typescript
console.log(JSON.stringify(error));
```
