import { expect, test, describe } from 'bun:test';
import { Veloxis } from '../src';

describe('Veloxis GraphQL', () => {
  const api = new Veloxis({
    baseURL: 'https://countries.trevorblades.com/'
  });

  test('Query with variables works', async () => {
    const query = `
      query getCountry($code: ID!) {
        country(code: $code) { name }
      }
    `;
    const data = await api.graphql<any>( '', {
      query,
      variables: { code: 'BR' }
    });
    
    expect(data.country.name).toBe('Brazil');
  });

  test('GraphQL error is handled', async () => {
    const invalidQuery = `query { nonExistentField }`;
    try {
      await api.graphql('', { query: invalidQuery });
      expect(true).toBe(false);
    } catch (err: any) {
      expect(err.code).toBe('GRAPHQL_ERROR');
    }
  });
});
