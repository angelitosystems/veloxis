import { Veloxis, retryPlugin } from '../src';

/**
 * Retry Plugin Example
 * Run: bun run examples/plugin-retry.ts
 */
async function run() {
  console.log('--- Plugin: Retry ---');

  const api = new Veloxis({ debug: true });
  api.use(retryPlugin(3, 500)); // 3 attempts, 500ms initial delay

  try {
    // Attempting a non-existent URL to trigger retries
    console.log('Triggering a failure (should retry 3 times)...');
    await api.get('https://invalid-url-veloxis.com', { retry: true });
  } catch (err: any) {
    console.log(`Final Error: ${err.message}`);
    console.log(`Code: ${err.code}`);
  }
}

run();
