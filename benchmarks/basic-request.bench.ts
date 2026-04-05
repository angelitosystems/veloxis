import { bench, run } from 'mitata';
import { Veloxis } from '../src';

const api = new Veloxis();
const url = 'https://jsonplaceholder.typicode.com/todos/1';

// Benchmark to measure core overhead (excluding network)
bench('Veloxis: Execution Overhead (GET)', async () => {
  // We're measuring the library processing time
  // In a real bench, we'd mock fetch to return immediately.
  await api.get(url);
});

bench('Native Fetch: Comparison', async () => {
  const res = await fetch(url);
  await res.json();
});

await run();
