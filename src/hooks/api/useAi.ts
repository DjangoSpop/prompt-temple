import { useMutation, useQuery, type QueryKey, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient, createCallArgs, type OperationCallArgs, type OperationResponse } from '@/lib/apiClient';
import type { OperationId } from '@/lib/api/operationMap';
import type { ApiError } from '@/lib/api/base';

type QueryOptions<Op extends OperationId, TData> = Omit<UseQueryOptions<OperationResponse<Op>, ApiError, TData, QueryKey>, 'queryKey' | 'queryFn'>;

type MutationOptions<Op extends OperationId, TVariables> = Omit<UseMutationOptions<OperationResponse<Op>, ApiError, TVariables>, 'mutationFn' | 'mutationKey'>;

export type V1AiGenerateCreateArgs = Omit<OperationCallArgs<'v1_ai_generate_create'>, 'signal'>;

export const useV1AiGenerateCreateMutation = (
  options?: MutationOptions<'v1_ai_generate_create', V1AiGenerateCreateArgs>
) => {
  return useMutation<OperationResponse<'v1_ai_generate_create'>, ApiError, V1AiGenerateCreateArgs>({
    mutationKey: ['v1_ai_generate_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v1_ai_generate_create>>;
      return apiClient.call('v1_ai_generate_create', createCallArgs<'v1_ai_generate_create'>(payload));
    },
    ...options,
  });
};

export type V1AiModelsRetrieveArgs = Omit<OperationCallArgs<'v1_ai_models_retrieve'>, 'signal'>;

export const useV1AiModelsRetrieveQuery = (
  args?: V1AiModelsRetrieveArgs,
  options?: QueryOptions<'v1_ai_models_retrieve', OperationResponse<'v1_ai_models_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_ai_models_retrieve'>, ApiError, OperationResponse<'v1_ai_models_retrieve'>, QueryKey>({
    queryKey: ['v1_ai_models_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_ai_models_retrieve>>;
      return apiClient.call('v1_ai_models_retrieve', createCallArgs<'v1_ai_models_retrieve>(payload));
    },
    ...options,
  });
};

export type V1AiProvidersRetrieveArgs = Omit<OperationCallArgs<'v1_ai_providers_retrieve'>, 'signal'>;

export const useV1AiProvidersRetrieveQuery = (
  args?: V1AiProvidersRetrieveArgs,
  options?: QueryOptions<'v1_ai_providers_retrieve', OperationResponse<'v1_ai_providers_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_ai_providers_retrieve'>, ApiError, OperationResponse<'v1_ai_providers_retrieve'>, QueryKey>({
    queryKey: ['v1_ai_providers_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_ai_providers_retrieve>>;
      return apiClient.call('v1_ai_providers_retrieve', createCallArgs<'v1_ai_providers_retrieve>(payload));
    },
    ...options,
  });
};

export type V1AiQuotasRetrieveArgs = Omit<OperationCallArgs<'v1_ai_quotas_retrieve'>, 'signal'>;

export const useV1AiQuotasRetrieveQuery = (
  args?: V1AiQuotasRetrieveArgs,
  options?: QueryOptions<'v1_ai_quotas_retrieve', OperationResponse<'v1_ai_quotas_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_ai_quotas_retrieve'>, ApiError, OperationResponse<'v1_ai_quotas_retrieve'>, QueryKey>({
    queryKey: ['v1_ai_quotas_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_ai_quotas_retrieve>>;
      return apiClient.call('v1_ai_quotas_retrieve', createCallArgs<'v1_ai_quotas_retrieve>(payload));
    },
    ...options,
  });
};

export type V1AiUsageRetrieveArgs = Omit<OperationCallArgs<'v1_ai_usage_retrieve'>, 'signal'>;

export const useV1AiUsageRetrieveQuery = (
  args?: V1AiUsageRetrieveArgs,
  options?: QueryOptions<'v1_ai_usage_retrieve', OperationResponse<'v1_ai_usage_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_ai_usage_retrieve'>, ApiError, OperationResponse<'v1_ai_usage_retrieve'>, QueryKey>({
    queryKey: ['v1_ai_usage_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_ai_usage_retrieve>>;
      return apiClient.call('v1_ai_usage_retrieve', createCallArgs<'v1_ai_usage_retrieve>(payload));
    },
    ...options,
  });
};

export type V2AiGenerateCreateArgs = Omit<OperationCallArgs<'v2_ai_generate_create'>, 'signal'>;

export const useV2AiGenerateCreateMutation = (
  options?: MutationOptions<'v2_ai_generate_create', V2AiGenerateCreateArgs>
) => {
  return useMutation<OperationResponse<'v2_ai_generate_create'>, ApiError, V2AiGenerateCreateArgs>({
    mutationKey: ['v2_ai_generate_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v2_ai_generate_create>>;
      return apiClient.call('v2_ai_generate_create', createCallArgs<'v2_ai_generate_create'>(payload));
    },
    ...options,
  });
};

export type V2AiModelsRetrieveArgs = Omit<OperationCallArgs<'v2_ai_models_retrieve'>, 'signal'>;

export const useV2AiModelsRetrieveQuery = (
  args?: V2AiModelsRetrieveArgs,
  options?: QueryOptions<'v2_ai_models_retrieve', OperationResponse<'v2_ai_models_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_ai_models_retrieve'>, ApiError, OperationResponse<'v2_ai_models_retrieve'>, QueryKey>({
    queryKey: ['v2_ai_models_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_ai_models_retrieve>>;
      return apiClient.call('v2_ai_models_retrieve', createCallArgs<'v2_ai_models_retrieve>(payload));
    },
    ...options,
  });
};

export type V2AiProvidersRetrieveArgs = Omit<OperationCallArgs<'v2_ai_providers_retrieve'>, 'signal'>;

export const useV2AiProvidersRetrieveQuery = (
  args?: V2AiProvidersRetrieveArgs,
  options?: QueryOptions<'v2_ai_providers_retrieve', OperationResponse<'v2_ai_providers_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_ai_providers_retrieve'>, ApiError, OperationResponse<'v2_ai_providers_retrieve'>, QueryKey>({
    queryKey: ['v2_ai_providers_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_ai_providers_retrieve>>;
      return apiClient.call('v2_ai_providers_retrieve', createCallArgs<'v2_ai_providers_retrieve>(payload));
    },
    ...options,
  });
};

export type V2AiQuotasRetrieveArgs = Omit<OperationCallArgs<'v2_ai_quotas_retrieve'>, 'signal'>;

export const useV2AiQuotasRetrieveQuery = (
  args?: V2AiQuotasRetrieveArgs,
  options?: QueryOptions<'v2_ai_quotas_retrieve', OperationResponse<'v2_ai_quotas_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_ai_quotas_retrieve'>, ApiError, OperationResponse<'v2_ai_quotas_retrieve'>, QueryKey>({
    queryKey: ['v2_ai_quotas_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_ai_quotas_retrieve>>;
      return apiClient.call('v2_ai_quotas_retrieve', createCallArgs<'v2_ai_quotas_retrieve>(payload));
    },
    ...options,
  });
};

export type V2AiUsageRetrieveArgs = Omit<OperationCallArgs<'v2_ai_usage_retrieve'>, 'signal'>;

export const useV2AiUsageRetrieveQuery = (
  args?: V2AiUsageRetrieveArgs,
  options?: QueryOptions<'v2_ai_usage_retrieve', OperationResponse<'v2_ai_usage_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_ai_usage_retrieve'>, ApiError, OperationResponse<'v2_ai_usage_retrieve'>, QueryKey>({
    queryKey: ['v2_ai_usage_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_ai_usage_retrieve>>;
      return apiClient.call('v2_ai_usage_retrieve', createCallArgs<'v2_ai_usage_retrieve>(payload));
    },
    ...options,
  });
};
