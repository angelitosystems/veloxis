# GraphQL Usage in Veloxis

Veloxis has first-class GraphQL support. It includes a `graphql()` method designed specifically for queries and mutations.

## Basic Query

```typescript
import veloxis from 'veloxis';

const query = `
  query getCountry($code: ID!) {
    country(code: $code) {
      name
      emoji
    }
  }
`;

const data = await veloxis.graphql('https://countries.trevorblades.com/', {
  query,
  variables: { code: 'BR' }
});

console.log(data.country.name); // Type: any (default)
```

## Typed GraphQL Responses

Pass types for the data and variables:

```typescript
interface Country {
  name: string;
  emoji: string;
}

interface Variables {
  code: string;
}

const data = await veloxis.graphql<Country, Variables>(URL, {
  query,
  variables: { code: 'US' }
});

// data is now typed
console.log(data.country.name);
```

## Handling GraphQL Errors

The `graphql()` method automatically parses response data. If the server returns an `errors` array, Veloxis throws a `VeloxisError` with code `GRAPHQL_ERROR`.
