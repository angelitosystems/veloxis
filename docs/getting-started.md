# Getting Started with Veloxis

Veloxis is a modern, ultra-fast HTTP and GraphQL client designed for Node.js and browser environments. It focuses on performance, modularity, and a clean API.

## Installation

```bash
bun add veloxis
# or
npm install veloxis
# or
yarn add veloxis
```

## Basic Concepts

1. **Native fetch**: No external dependencies like `axios` or `node-fetch`.
2. **Modularity**: Use only what you need (e.g., plugins, pagination).
3. **TypeScript First**: Strong types and generics for all requests.
4. **Performance**: Minimal abstraction layers and overhead.

## Quick Example

```typescript
import veloxis from 'veloxis';

async function main() {
  const { data } = await veloxis.get('https://jsonplaceholder.typicode.com/posts/1');
  console.log(data.title);
}

main();
```

## Folder Structure

- `/src`: Library source code.
- `/docs`: Detailed documentation.
- `/examples`: Runnable usage examples.
- `/tests`: Unit and integration tests.
- `/benchmarks`: Performance measurements.
