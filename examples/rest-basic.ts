import veloxis from '../src';

/**
 * Basic REST Example
 * Run: bun run examples/rest-basic.ts
 */
async function run() {
  console.log('--- REST Basic ---');
  
  try {
    const { data } = await veloxis.get('https://jsonplaceholder.typicode.com/todos/1');
    console.log('Todo:', data);
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
