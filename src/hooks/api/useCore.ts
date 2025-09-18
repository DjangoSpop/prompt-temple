import { useMutation, useQuery, type QueryKey, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient, createCallArgs, type OperationCallArgs, type OperationResponse } from '@/lib/apiClient';
import type { OperationId } from '@/lib/api/operationMap';
import type { ApiError } from '@/lib/api/base';

type QueryOptions<Op extends OperationId, TData> = Omit<UseQueryOptions<OperationResponse<Op>, ApiError, TData, QueryKey>, 'queryKey' | 'queryFn'>;

type MutationOptions<Op extends OperationId, TVariables> = Omit<UseMutationOptions<OperationResponse<Op>, ApiError, TVariables>, 'mutationFn' | 'mutationKey'>;

export type V1CoreConfigRetrieveArgs = Omit<OperationCallArgs<'v1_core_config_retrieve'>, 'signal'>;

export const useV1CoreConfigRetrieveQuery = (
  args?: V1CoreConfigRetrieveArgs,
  options?: QueryOptions<'v1_core_config_retrieve', OperationResponse<'v1_core_config_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_core_config_retrieve'>, ApiError, OperationResponse<'v1_core_config_retrieve'>, QueryKey>({
    queryKey: ['v1_core_config_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_core_config_retrieve>>;
      return apiClient.call('v1_core_config_retrieve', createCallArgs<'v1_core_config_retrieve>(payload));
    },
    ...options,
  });
};

export type V1CoreHealthRetrieveArgs = Omit<OperationCallArgs<'v1_core_health_retrieve'>, 'signal'>;

export const useV1CoreHealthRetrieveQuery = (
  args?: V1CoreHealthRetrieveArgs,
  options?: QueryOptions<'v1_core_health_retrieve', OperationResponse<'v1_core_health_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_core_health_retrieve'>, ApiError, OperationResponse<'v1_core_health_retrieve'>, QueryKey>({
    queryKey: ['v1_core_health_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_core_health_retrieve>>;
      return apiClient.call('v1_core_health_retrieve', createCallArgs<'v1_core_health_retrieve>(payload));
    },
    ...options,
  });
};

export type V1CoreNotificationsRetrieveArgs = Omit<OperationCallArgs<'v1_core_notifications_retrieve'>, 'signal'>;

export const useV1CoreNotificationsRetrieveQuery = (
  args?: V1CoreNotificationsRetrieveArgs,
  options?: QueryOptions<'v1_core_notifications_retrieve', OperationResponse<'v1_core_notifications_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_core_notifications_retrieve'>, ApiError, OperationResponse<'v1_core_notifications_retrieve'>, QueryKey>({
    queryKey: ['v1_core_notifications_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_core_notifications_retrieve>>;
      return apiClient.call('v1_core_notifications_retrieve', createCallArgs<'v1_core_notifications_retrieve>(payload));
    },
    ...options,
  });
};

export type V1CoreNotificationsCreateArgs = Omit<OperationCallArgs<'v1_core_notifications_create'>, 'signal'>;

export const useV1CoreNotificationsCreateMutation = (
  options?: MutationOptions<'v1_core_notifications_create', V1CoreNotificationsCreateArgs>
) => {
  return useMutation<OperationResponse<'v1_core_notifications_create'>, ApiError, V1CoreNotificationsCreateArgs>({
    mutationKey: ['v1_core_notifications_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v1_core_notifications_create>>;
      return apiClient.call('v1_core_notifications_create', createCallArgs<'v1_core_notifications_create'>(payload));
    },
    ...options,
  });
};

export type V2CoreConfigRetrieveArgs = Omit<OperationCallArgs<'v2_core_config_retrieve'>, 'signal'>;

export const useV2CoreConfigRetrieveQuery = (
  args?: V2CoreConfigRetrieveArgs,
  options?: QueryOptions<'v2_core_config_retrieve', OperationResponse<'v2_core_config_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_core_config_retrieve'>, ApiError, OperationResponse<'v2_core_config_retrieve'>, QueryKey>({
    queryKey: ['v2_core_config_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_core_config_retrieve>>;
      return apiClient.call('v2_core_config_retrieve', createCallArgs<'v2_core_config_retrieve>(payload));
    },
    ...options,
  });
};

export type V2CoreHealthRetrieveArgs = Omit<OperationCallArgs<'v2_core_health_retrieve'>, 'signal'>;

export const useV2CoreHealthRetrieveQuery = (
  args?: V2CoreHealthRetrieveArgs,
  options?: QueryOptions<'v2_core_health_retrieve', OperationResponse<'v2_core_health_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_core_health_retrieve'>, ApiError, OperationResponse<'v2_core_health_retrieve'>, QueryKey>({
    queryKey: ['v2_core_health_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_core_health_retrieve>>;
      return apiClient.call('v2_core_health_retrieve', createCallArgs<'v2_core_health_retrieve>(payload));
    },
    ...options,
  });
};

export type V2CoreNotificationsRetrieveArgs = Omit<OperationCallArgs<'v2_core_notifications_retrieve'>, 'signal'>;

export const useV2CoreNotificationsRetrieveQuery = (
  args?: V2CoreNotificationsRetrieveArgs,
  options?: QueryOptions<'v2_core_notifications_retrieve', OperationResponse<'v2_core_notifications_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_core_notifications_retrieve'>, ApiError, OperationResponse<'v2_core_notifications_retrieve'>, QueryKey>({
    queryKey: ['v2_core_notifications_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_core_notifications_retrieve>>;
      return apiClient.call('v2_core_notifications_retrieve', createCallArgs<'v2_core_notifications_retrieve>(payload));
    },
    ...options,
  });
};

export type V2CoreNotificationsCreateArgs = Omit<OperationCallArgs<'v2_core_notifications_create'>, 'signal'>;

export const useV2CoreNotificationsCreateMutation = (
  options?: MutationOptions<'v2_core_notifications_create', V2CoreNotificationsCreateArgs>
) => {
  return useMutation<OperationResponse<'v2_core_notifications_create'>, ApiError, V2CoreNotificationsCreateArgs>({
    mutationKey: ['v2_core_notifications_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v2_core_notifications_create>>;
      return apiClient.call('v2_core_notifications_create', createCallArgs<'v2_core_notifications_create'>(payload));
    },
    ...options,
  });
};
