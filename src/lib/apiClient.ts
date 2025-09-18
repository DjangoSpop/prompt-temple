import type { AxiosRequestConfig } from 'axios';
import { BaseApiClient } from './api/base';
import { apiConfig } from './config/env';
import { operationMap, type OperationId } from './api/operationMap';
import type { operations } from './types/api';

/**
 * Utility Types derived from OpenAPI operation definitions
 */

type OperationSpec<Op extends keyof operations> = operations[Op];

type ExtractContent<T> = T extends { content: infer Content }
  ? Content extends { 'application/json': infer Json }
    ? Json
    : Content extends Record<string, infer AnyContent>
      ? AnyContent
      : void
  : void;

type SuccessStatus = '200' | '201' | '202' | '203' | '204';

type ResponseFromSpec<Op extends keyof operations> =
  OperationSpec<Op>['responses'] extends infer Responses
    ? Responses extends Record<string, unknown>
      ? {
          [Status in Extract<keyof Responses, SuccessStatus>]: ExtractContent<Responses[Status]>;
        }[Extract<keyof Responses, SuccessStatus>] extends infer Primary
        ? [Primary] extends [never]
          ? {
              [Status in Exclude<keyof Responses, SuccessStatus>]: ExtractContent<Responses[Status]>;
            }[Exclude<keyof Responses, SuccessStatus>]
          : Primary
        : never
      : void
    : void;

type Normalize<T> =
  [T] extends [never]
    ? undefined
    : T extends undefined
      ? undefined
      : T extends Record<string, never>
        ? undefined
        : T;

type RawQuery<Op extends keyof operations> =
  OperationSpec<Op>['parameters'] extends { query: infer Query }
    ? Query
    : undefined;

type RawPathParams<Op extends keyof operations> =
  OperationSpec<Op>['parameters'] extends { path: infer PathParams }
    ? PathParams
    : undefined;

type RawHeaders<Op extends keyof operations> =
  OperationSpec<Op>['parameters'] extends { header: infer Header }
    ? Header
    : undefined;

type RawBody<Op extends keyof operations> = ExtractContent<OperationSpec<Op>['requestBody']>;

type Field<Name extends string, Value> = Normalize<Value> extends undefined
  ? { [K in Name]?: undefined }
  : { [K in Name]: Normalize<Value> };

export type OperationResponse<Op extends OperationId> = Normalize<ResponseFromSpec<Op>>;
export type OperationQuery<Op extends OperationId> = Normalize<RawQuery<Op>>;
export type OperationPathParams<Op extends OperationId> = Normalize<RawPathParams<Op>>;
export type OperationHeaders<Op extends OperationId> = Normalize<RawHeaders<Op>>;
export type OperationBody<Op extends OperationId> = Normalize<RawBody<Op>>;

type OperationCallArgsBase<Op extends OperationId> =
  Field<'query', RawQuery<Op>> &
  Field<'pathParams', RawPathParams<Op>> &
  Field<'body', RawBody<Op>> &
  Field<'headers', RawHeaders<Op>>;

export type OperationCallArgs<Op extends OperationId> = OperationCallArgsBase<Op> & {
  signal?: AbortSignal;
};

function interpolatePath(path: string, pathParams?: Record<string, unknown>) {
  if (!pathParams) return path;
  return Object.keys(pathParams).reduce((acc, key) => {
    const value = pathParams[key];
    return acc.replace(`{${key}}`, encodeURIComponent(String(value)));
  }, path);
}

export class ApiClient extends BaseApiClient {
  constructor(baseUrl = process.env.NEXT_PUBLIC_API_URL || apiConfig.baseUrl) {
    super(baseUrl);
  }

  async call<Op extends OperationId>(operationId: Op, args: OperationCallArgs<Op> = {} as OperationCallArgs<Op>): Promise<OperationResponse<Op>> {
    const meta = operationMap[operationId];
    if (!meta) {
      throw new Error(`Unknown operation: ${operationId}`);
    }

    const { pathParams, query, body, headers, signal } = args;
    const endpoint = interpolatePath(meta.path, pathParams as Record<string, unknown> | undefined);

    const config: AxiosRequestConfig = {
      method: meta.method,
      params: query,
      data: body,
      headers,
      signal,
    };

    return this.request<OperationResponse<Op>>(endpoint, config);
  }
}

export const apiClient = new ApiClient();

export function createCallArgs<Op extends OperationId>(args: Partial<OperationCallArgs<Op>> = {}) {
  return args as OperationCallArgs<Op>;
}
