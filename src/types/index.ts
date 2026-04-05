export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export interface VeloxisHeaders extends Record<string, string> {}

export interface VeloxisRequestConfig<T = any> {
  url?: string;
  method?: HTTPMethod;
  baseURL?: string;
  headers?: VeloxisHeaders;
  params?: Record<string, string | number | boolean | undefined>;
  data?: T;
  timeout?: number;
  cache?: boolean | { ttl?: number };
  retry?: boolean | { attempts?: number; delay?: number };
  dedupe?: boolean;
  debug?: boolean;
  signal?: AbortSignal;
  [key: string]: any; // Allow for custom plugin-specific properties
}

export interface VeloxisResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  config: VeloxisRequestConfig;
}

export interface VeloxisInterceptor<T> {
  fulfilled?: (value: T) => T | Promise<T>;
  rejected?: (error: any) => any;
}

export interface VeloxisPlugin {
  name: string;
  onBeforeRequest?: (config: VeloxisRequestConfig) => void | VeloxisRequestConfig | Promise<void | VeloxisRequestConfig>;
  onAfterResponse?: (response: VeloxisResponse) => void | VeloxisResponse | Promise<void | VeloxisResponse>;
  onError?: (error: any) => void | any | Promise<void | any>;
}

export interface GraphQLOptions<V = Record<string, any>> {
  query: string;
  variables?: V;
  operationName?: string;
}

export interface GraphQLResponse<T = any> {
  data: T;
  errors?: any[];
}
