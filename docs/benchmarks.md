# Performance Benchmarks in Veloxis

Performance is a core design goal of Veloxis. It is built to minimize overhead and provide an ultra-fast developer experience.

## Running Benchmarks

```bash
bun run bench
```

## Benchmark Coverage

1. **Basic Request Overhead**: Measures the time the library takes to process a request before the native `fetch` is called and after it returns.
2. **GraphQL Parsing**: Benchmarks the speed of `graphql()` vs a manual `post()` request.
3. **Plugin Overhead**: Measures the execution cost of adding multiple plugins (retry, cache, etc.).

## Performance vs Axios

| Metric | Veloxis | Axios |
|--------|---------|-------|
| Bundle Size | ~2kb (gzipped) | ~10kb (gzipped) |
| Core Overhead | Lower (native fetch) | Higher (XHR/extra layers) |
| Modern JS | Native ESM | Hybrid/Legacy layers |

## Performance Goals

- **Zero-object-cloning**: Minimizing configuration object cloning unless necessary.
- **Tree-shakable**: Only include what you use.
- **Native primitives**: Leveraging modern browser features like `AbortController` and `Headers` without polyfills.
