import { bench, run } from 'mitata';
import { Veloxis } from '../src';

const api = new Veloxis();
const url = 'https://countries.trevorblades.com/';
const query = `query { country(code: "BR") { name } }`;

bench('Veloxis: graphql() method', async () => {
  await api.graphql(url, { query });
});

bench('Veloxis: Manual post()', async () => {
  await api.post(url, { query });
});

await run();
