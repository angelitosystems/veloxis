import type { Veloxis } from '../core/client';
import type { GraphQLOptions, VeloxisRequestConfig } from '../types';
import { VeloxisError } from '../utils/errors';

/**
 * Helper to handle GraphQL requests using a Veloxis client instance.
 */
export async function performGraphQLRequest<T = any, V = any>(
  client: Veloxis,
  url: string,
  options: GraphQLOptions<V>,
  config?: VeloxisRequestConfig
): Promise<T> {
  const res = await client.post<any>(url, {
    query: options.query,
    variables: options.variables,
    operationName: options.operationName
  }, config);
  
  if (res.data.errors) {
    throw new VeloxisError('GraphQL Error', res.config, 'GRAPHQL_ERROR', res);
  }
  
  return res.data.data;
}
