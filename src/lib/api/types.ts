export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'TRACE';

export interface CallOptions<Query = unknown, Body = unknown> {
  query?: Query;
  body?: Body;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

export interface CallResult<T> {
  data: T;
}
