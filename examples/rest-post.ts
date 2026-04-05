import veloxis from '../src';

/**
 * REST POST Example
 * Run: bun run examples/rest-post.ts
 */
async function run() {
  console.log('--- REST POST ---');
  
  const payload = {
    title: 'New Post',
    body: 'Hello Veloxis!',
    userId: 1
  };

  try {
    const { data, status } = await veloxis.post('https://jsonplaceholder.typicode.com/posts', payload);
    console.log(`Status: ${status}`);
    console.log('Response:', data);
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
