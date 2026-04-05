# Veloxis 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strongly%20Typed-blue.svg)](https://www.typescriptlang.org/)
[![Performance](https://img.shields.io/badge/Performance-Ultra%20Fast-green.svg)](#benchmarks)

**Veloxis** is a modern, ultra-fast HTTP and GraphQL client designed for Node.js and browser environments. Built with a focus on performance, modularity, and TypeScript first-class support.

## Key Features

- ⚡ **Ultra Fast**: Minimal abstraction layers over native `fetch`.
- 🧩 **Modular Architecture**: Use only what you need.
- 📡 **REST + GraphQL**: First-class support for both, with a unified API.
- 🔌 **Plugin System**: Powerful middleware hooks for requests, responses, and errors.
- 📦 **Built-in Plugins**: Includes Retry (exponential backoff), Cache (TTL), and Auth.
- 📄 **Advanced Pagination**: Reusable utility for cursor and offset-based pagination.
- 🛡️ **Strongly Typed**: Full generic support for all requests and responses.
- 🚦 **Interceptors**: Async request/response interceptors similar to Axios.
- ⏱️ **Timeout Control**: Built-in support via `AbortController`.
- 👯 **Request Deduplication**: Avoid redundant simultaneous calls.

## Comparison with Other Clients

| Feature | Veloxis | Axios | Native Fetch |
|---------|---------|-------|--------------|
| **Engine** | Native Fetch | XHR / Node HTTP | Native |
| **GraphQL Support** | ✅ Built-in | ❌ (Manual POST) | ❌ (Manual POST) |
| **Plugin System** | ✅ Advanced Hooks | ❌ (Interceptors only) | ❌ |
| **Bundle Size** | 🚀 ~2kb (gzipped) | 📦 ~10kb (gzipped) | 0kb |
| **TypeScript** | 🔥 First-class | ✅ Good | ⚠️ Manual Types |
| **Auto-Retries** | ✅ Plugin (Backoff) | ❌ (Plugin required) | ❌ |
| **Pagination** | ✅ Built-in Utility | ❌ | ❌ |
| **Deduplication** | ✅ Built-in | ❌ | ❌ |

### Why choose Veloxis over Axios?
- **Modernity**: Axios uses legacy XHR under the hood in browsers. Veloxis leverages native `fetch` and modern ESM architecture.
- **Speed**: Minimal abstraction layers mean Veloxis has significantly lower execution overhead.
- **All-in-One**: First-class GraphQL support and advanced pagination utilities are included, not afterthoughts.
- **Modularity**: Veloxis's plugin system is more flexible than interceptors alone, allowing plugins to handle their own error recovery and retry logic seamlessly.

## Installation

```bash
bun add veloxis
# or
npm install veloxis
```

## Quick Start

### REST Request
```typescript
import veloxis from 'veloxis';

const { data } = await veloxis.get('https://api.example.com/posts/1');
console.log(data.title);
```

### GraphQL Query
```typescript
const data = await veloxis.graphql<Country>('https://countries.trevorblades.com/', {
  query: 'query { country(code: "BR") { name } }'
});
console.log(data.country.name);
```

### Using Plugins
```typescript
import { Veloxis, retryPlugin, cachePlugin } from 'veloxis';

const api = new Veloxis();
api.use(retryPlugin());
api.use(cachePlugin(60000));

// Request with cache enabled
await api.get('/api/data', { cache: true });
```

## Documentation & Examples

Detailed documentation is available in the [`/docs`](/docs) folder:
- [Getting Started](/docs/getting-started.md)
- [REST API](/docs/rest.md)
- [GraphQL](/docs/graphql.md)
- [Plugins](/docs/plugins.md)
- [Pagination](/docs/pagination.md)
- [Error Handling](/docs/errors.md)

Explore practical code in the [`/examples`](/examples) folder.

## Tests

Veloxis is fully covered by unit and integration tests using **Bun test**. To run them:

```bash
bun test
```
See [Testing Documentation](/docs/testing.md) for more details.

## Benchmarks

Performance is at the heart of Veloxis. We've implemented explicit benchmarks to measure execution overhead and comparison against standard fetch usage.

### Running Benchmarks
```bash
bun run bench
```

**What we measure:**
- **Execution Overhead**: The library's internal processing time vs raw fetch.
- **Plugin Impact**: The cost of stacking multiple middlewares.
- **GraphQL Parsing**: Speed of structured GraphQL vs manual POST.

Our goal is to remain as close to native `fetch` speed as possible while providing a rich feature set. See [Benchmarks Documentation](/docs/benchmarks.md).

## Project Structure

```text
src/         # Source code (modular)
docs/        # Detailed documentation
examples/    # Practical usage examples
tests/       # Unit and integration tests
benchmarks/  # Performance measurement files
```

## License

MIT © AngelitoSystems
