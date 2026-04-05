import { bench, run } from 'mitata';
import { Veloxis, retryPlugin, cachePlugin, authPlugin } from '../src';

const apiNoPlugins = new Veloxis();

const apiWithPlugins = new Veloxis();
apiWithPlugins.use(retryPlugin());
apiWithPlugins.use(cachePlugin());
apiWithPlugins.use(authPlugin({}));

const url = 'https://jsonplaceholder.typicode.com/todos/1';

bench('Veloxis: Zero Plugins', async () => {
  await apiNoPlugins.get(url);
});

bench('Veloxis: Three Plugins (Retry, Cache, Auth)', async () => {
  await apiWithPlugins.get(url);
});

await run();
