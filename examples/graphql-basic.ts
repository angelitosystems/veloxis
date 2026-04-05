import veloxis from '../src';

/**
 * Basic GraphQL Query
 * Run: bun run examples/graphql-basic.ts
 */
async function run() {
  console.log('--- GraphQL Basic ---');

  const query = `
    query getCountry($code: ID!) {
      country(code: $code) {
        name
        capital
        emoji
        currency
      }
    }
  `;

  try {
    const data = await veloxis.graphql<any>('https://countries.trevorblades.com/', {
      query,
      variables: { code: 'BR' }
    });
    
    console.log('Country:', data.country);
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
