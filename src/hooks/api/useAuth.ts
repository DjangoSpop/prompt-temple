import { useMutation, useQuery, type QueryKey, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient, createCallArgs, type OperationCallArgs, type OperationResponse } from '@/lib/apiClient';
import type { OperationId } from '@/lib/api/operationMap';
import type { ApiError } from '@/lib/api/base';

type QueryOptions<Op extends OperationId, TData> = Omit<UseQueryOptions<OperationResponse<Op>, ApiError, TData, QueryKey>, 'queryKey' | 'queryFn'>;

type MutationOptions<Op extends OperationId, TVariables> = Omit<UseMutationOptions<OperationResponse<Op>, ApiError, TVariables>, 'mutationFn' | 'mutationKey'>;

export type V1AuthAuthCheckEmailRetrieveArgs = Omit<OperationCallArgs<'v1_auth_auth_check_email_retrieve'>, 'signal'>;

export const useV1AuthAuthCheckEmailRetrieveQuery = (
  args?: V1AuthAuthCheckEmailRetrieveArgs,
  options?: QueryOptions<'v1_auth_auth_check_email_retrieve', OperationResponse<'v1_auth_auth_check_email_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_auth_auth_check_email_retrieve'>, ApiError, OperationResponse<'v1_auth_auth_check_email_retrieve'>, QueryKey>({
    queryKey: ['v1_auth_auth_check_email_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_auth_auth_check_email_retrieve>>;
      return apiClient.call('v1_auth_auth_check_email_retrieve', createCallArgs<'v1_auth_auth_check_email_retrieve>(payload));
    },
    ...options,
  });
};

export type V1AuthChangePasswordCreateArgs = Omit<OperationCallArgs<'v1_auth_change_password_create'>, 'signal'>;

export const useV1AuthChangePasswordCreateMutation = (
  options?: MutationOptions<'v1_auth_change_password_create', V1AuthChangePasswordCreateArgs>
) => {
  return useMutation<OperationResponse<'v1_auth_change_password_create'>, ApiError, V1AuthChangePasswordCreateArgs>({
    mutationKey: ['v1_auth_change_password_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v1_auth_change_password_create>>;
      return apiClient.call('v1_auth_change_password_create', createCallArgs<'v1_auth_change_password_create'>(payload));
    },
    ...options,
  });
};

export type V1AuthCheckUsernameRetrieveArgs = Omit<OperationCallArgs<'v1_auth_check_username_retrieve'>, 'signal'>;

export const useV1AuthCheckUsernameRetrieveQuery = (
  args?: V1AuthCheckUsernameRetrieveArgs,
  options?: QueryOptions<'v1_auth_check_username_retrieve', OperationResponse<'v1_auth_check_username_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_auth_check_username_retrieve'>, ApiError, OperationResponse<'v1_auth_check_username_retrieve'>, QueryKey>({
    queryKey: ['v1_auth_check_username_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_auth_check_username_retrieve>>;
      return apiClient.call('v1_auth_check_username_retrieve', createCallArgs<'v1_auth_check_username_retrieve>(payload));
    },
    ...options,
  });
};

export type V1AuthLoginCreateArgs = Omit<OperationCallArgs<'v1_auth_login_create'>, 'signal'>;

export const useV1AuthLoginCreateMutation = (
  options?: MutationOptions<'v1_auth_login_create', V1AuthLoginCreateArgs>
) => {
  return useMutation<OperationResponse<'v1_auth_login_create'>, ApiError, V1AuthLoginCreateArgs>({
    mutationKey: ['v1_auth_login_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v1_auth_login_create>>;
      return apiClient.call('v1_auth_login_create', createCallArgs<'v1_auth_login_create'>(payload));
    },
    ...options,
  });
};

export type V1AuthLogoutCreateArgs = Omit<OperationCallArgs<'v1_auth_logout_create'>, 'signal'>;

export const useV1AuthLogoutCreateMutation = (
  options?: MutationOptions<'v1_auth_logout_create', V1AuthLogoutCreateArgs>
) => {
  return useMutation<OperationResponse<'v1_auth_logout_create'>, ApiError, V1AuthLogoutCreateArgs>({
    mutationKey: ['v1_auth_logout_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v1_auth_logout_create>>;
      return apiClient.call('v1_auth_logout_create', createCallArgs<'v1_auth_logout_create'>(payload));
    },
    ...options,
  });
};

export type V1AuthProfileRetrieveArgs = Omit<OperationCallArgs<'v1_auth_profile_retrieve'>, 'signal'>;

export const useV1AuthProfileRetrieveQuery = (
  args?: V1AuthProfileRetrieveArgs,
  options?: QueryOptions<'v1_auth_profile_retrieve', OperationResponse<'v1_auth_profile_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_auth_profile_retrieve'>, ApiError, OperationResponse<'v1_auth_profile_retrieve'>, QueryKey>({
    queryKey: ['v1_auth_profile_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_auth_profile_retrieve>>;
      return apiClient.call('v1_auth_profile_retrieve', createCallArgs<'v1_auth_profile_retrieve>(payload));
    },
    ...options,
  });
};

export type V1AuthProfilePartialUpdateArgs = Omit<OperationCallArgs<'v1_auth_profile_partial_update'>, 'signal'>;

export const useV1AuthProfilePartialUpdateMutation = (
  options?: MutationOptions<'v1_auth_profile_partial_update', V1AuthProfilePartialUpdateArgs>
) => {
  return useMutation<OperationResponse<'v1_auth_profile_partial_update'>, ApiError, V1AuthProfilePartialUpdateArgs>({
    mutationKey: ['v1_auth_profile_partial_update'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v1_auth_profile_partial_update>>;
      return apiClient.call('v1_auth_profile_partial_update', createCallArgs<'v1_auth_profile_partial_update'>(payload));
    },
    ...options,
  });
};

export type V1AuthProfileUpdateArgs = Omit<OperationCallArgs<'v1_auth_profile_update'>, 'signal'>;

export const useV1AuthProfileUpdateMutation = (
  options?: MutationOptions<'v1_auth_profile_update', V1AuthProfileUpdateArgs>
) => {
  return useMutation<OperationResponse<'v1_auth_profile_update'>, ApiError, V1AuthProfileUpdateArgs>({
    mutationKey: ['v1_auth_profile_update'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v1_auth_profile_update>>;
      return apiClient.call('v1_auth_profile_update', createCallArgs<'v1_auth_profile_update'>(payload));
    },
    ...options,
  });
};

export type V1AuthProfileUpdateRetrieveArgs = Omit<OperationCallArgs<'v1_auth_profile_update_retrieve'>, 'signal'>;

export const useV1AuthProfileUpdateRetrieveQuery = (
  args?: V1AuthProfileUpdateRetrieveArgs,
  options?: QueryOptions<'v1_auth_profile_update_retrieve', OperationResponse<'v1_auth_profile_update_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_auth_profile_update_retrieve'>, ApiError, OperationResponse<'v1_auth_profile_update_retrieve'>, QueryKey>({
    queryKey: ['v1_auth_profile_update_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_auth_profile_update_retrieve>>;
      return apiClient.call('v1_auth_profile_update_retrieve', createCallArgs<'v1_auth_profile_update_retrieve>(payload));
    },
    ...options,
  });
};

export type V1AuthProfileUpdatePartialUpdateArgs = Omit<OperationCallArgs<'v1_auth_profile_update_partial_update'>, 'signal'>;

export const useV1AuthProfileUpdatePartialUpdateMutation = (
  options?: MutationOptions<'v1_auth_profile_update_partial_update', V1AuthProfileUpdatePartialUpdateArgs>
) => {
  return useMutation<OperationResponse<'v1_auth_profile_update_partial_update'>, ApiError, V1AuthProfileUpdatePartialUpdateArgs>({
    mutationKey: ['v1_auth_profile_update_partial_update'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v1_auth_profile_update_partial_update>>;
      return apiClient.call('v1_auth_profile_update_partial_update', createCallArgs<'v1_auth_profile_update_partial_update'>(payload));
    },
    ...options,
  });
};

export type V1AuthProfileUpdateUpdateArgs = Omit<OperationCallArgs<'v1_auth_profile_update_update'>, 'signal'>;

export const useV1AuthProfileUpdateUpdateMutation = (
  options?: MutationOptions<'v1_auth_profile_update_update', V1AuthProfileUpdateUpdateArgs>
) => {
  return useMutation<OperationResponse<'v1_auth_profile_update_update'>, ApiError, V1AuthProfileUpdateUpdateArgs>({
    mutationKey: ['v1_auth_profile_update_update'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v1_auth_profile_update_update>>;
      return apiClient.call('v1_auth_profile_update_update', createCallArgs<'v1_auth_profile_update_update'>(payload));
    },
    ...options,
  });
};

export type V1AuthRefreshCreateArgs = Omit<OperationCallArgs<'v1_auth_refresh_create'>, 'signal'>;

export const useV1AuthRefreshCreateMutation = (
  options?: MutationOptions<'v1_auth_refresh_create', V1AuthRefreshCreateArgs>
) => {
  return useMutation<OperationResponse<'v1_auth_refresh_create'>, ApiError, V1AuthRefreshCreateArgs>({
    mutationKey: ['v1_auth_refresh_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v1_auth_refresh_create>>;
      return apiClient.call('v1_auth_refresh_create', createCallArgs<'v1_auth_refresh_create'>(payload));
    },
    ...options,
  });
};

export type V1AuthRegisterCreateArgs = Omit<OperationCallArgs<'v1_auth_register_create'>, 'signal'>;

export const useV1AuthRegisterCreateMutation = (
  options?: MutationOptions<'v1_auth_register_create', V1AuthRegisterCreateArgs>
) => {
  return useMutation<OperationResponse<'v1_auth_register_create'>, ApiError, V1AuthRegisterCreateArgs>({
    mutationKey: ['v1_auth_register_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v1_auth_register_create>>;
      return apiClient.call('v1_auth_register_create', createCallArgs<'v1_auth_register_create'>(payload));
    },
    ...options,
  });
};

export type V1AuthStatsRetrieveArgs = Omit<OperationCallArgs<'v1_auth_stats_retrieve'>, 'signal'>;

export const useV1AuthStatsRetrieveQuery = (
  args?: V1AuthStatsRetrieveArgs,
  options?: QueryOptions<'v1_auth_stats_retrieve', OperationResponse<'v1_auth_stats_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_auth_stats_retrieve'>, ApiError, OperationResponse<'v1_auth_stats_retrieve'>, QueryKey>({
    queryKey: ['v1_auth_stats_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_auth_stats_retrieve>>;
      return apiClient.call('v1_auth_stats_retrieve', createCallArgs<'v1_auth_stats_retrieve>(payload));
    },
    ...options,
  });
};

export type V2AuthAuthCheckEmailRetrieveArgs = Omit<OperationCallArgs<'v2_auth_auth_check_email_retrieve'>, 'signal'>;

export const useV2AuthAuthCheckEmailRetrieveQuery = (
  args?: V2AuthAuthCheckEmailRetrieveArgs,
  options?: QueryOptions<'v2_auth_auth_check_email_retrieve', OperationResponse<'v2_auth_auth_check_email_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_auth_auth_check_email_retrieve'>, ApiError, OperationResponse<'v2_auth_auth_check_email_retrieve'>, QueryKey>({
    queryKey: ['v2_auth_auth_check_email_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_auth_auth_check_email_retrieve>>;
      return apiClient.call('v2_auth_auth_check_email_retrieve', createCallArgs<'v2_auth_auth_check_email_retrieve>(payload));
    },
    ...options,
  });
};

export type V2AuthChangePasswordCreateArgs = Omit<OperationCallArgs<'v2_auth_change_password_create'>, 'signal'>;

export const useV2AuthChangePasswordCreateMutation = (
  options?: MutationOptions<'v2_auth_change_password_create', V2AuthChangePasswordCreateArgs>
) => {
  return useMutation<OperationResponse<'v2_auth_change_password_create'>, ApiError, V2AuthChangePasswordCreateArgs>({
    mutationKey: ['v2_auth_change_password_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v2_auth_change_password_create>>;
      return apiClient.call('v2_auth_change_password_create', createCallArgs<'v2_auth_change_password_create'>(payload));
    },
    ...options,
  });
};

export type V2AuthCheckUsernameRetrieveArgs = Omit<OperationCallArgs<'v2_auth_check_username_retrieve'>, 'signal'>;

export const useV2AuthCheckUsernameRetrieveQuery = (
  args?: V2AuthCheckUsernameRetrieveArgs,
  options?: QueryOptions<'v2_auth_check_username_retrieve', OperationResponse<'v2_auth_check_username_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_auth_check_username_retrieve'>, ApiError, OperationResponse<'v2_auth_check_username_retrieve'>, QueryKey>({
    queryKey: ['v2_auth_check_username_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_auth_check_username_retrieve>>;
      return apiClient.call('v2_auth_check_username_retrieve', createCallArgs<'v2_auth_check_username_retrieve>(payload));
    },
    ...options,
  });
};

export type V2AuthLoginCreateArgs = Omit<OperationCallArgs<'v2_auth_login_create'>, 'signal'>;

export const useV2AuthLoginCreateMutation = (
  options?: MutationOptions<'v2_auth_login_create', V2AuthLoginCreateArgs>
) => {
  return useMutation<OperationResponse<'v2_auth_login_create'>, ApiError, V2AuthLoginCreateArgs>({
    mutationKey: ['v2_auth_login_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v2_auth_login_create>>;
      return apiClient.call('v2_auth_login_create', createCallArgs<'v2_auth_login_create'>(payload));
    },
    ...options,
  });
};

export type V2AuthLogoutCreateArgs = Omit<OperationCallArgs<'v2_auth_logout_create'>, 'signal'>;

export const useV2AuthLogoutCreateMutation = (
  options?: MutationOptions<'v2_auth_logout_create', V2AuthLogoutCreateArgs>
) => {
  return useMutation<OperationResponse<'v2_auth_logout_create'>, ApiError, V2AuthLogoutCreateArgs>({
    mutationKey: ['v2_auth_logout_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v2_auth_logout_create>>;
      return apiClient.call('v2_auth_logout_create', createCallArgs<'v2_auth_logout_create'>(payload));
    },
    ...options,
  });
};

export type V2AuthProfileRetrieveArgs = Omit<OperationCallArgs<'v2_auth_profile_retrieve'>, 'signal'>;

export const useV2AuthProfileRetrieveQuery = (
  args?: V2AuthProfileRetrieveArgs,
  options?: QueryOptions<'v2_auth_profile_retrieve', OperationResponse<'v2_auth_profile_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_auth_profile_retrieve'>, ApiError, OperationResponse<'v2_auth_profile_retrieve'>, QueryKey>({
    queryKey: ['v2_auth_profile_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_auth_profile_retrieve>>;
      return apiClient.call('v2_auth_profile_retrieve', createCallArgs<'v2_auth_profile_retrieve>(payload));
    },
    ...options,
  });
};

export type V2AuthProfilePartialUpdateArgs = Omit<OperationCallArgs<'v2_auth_profile_partial_update'>, 'signal'>;

export const useV2AuthProfilePartialUpdateMutation = (
  options?: MutationOptions<'v2_auth_profile_partial_update', V2AuthProfilePartialUpdateArgs>
) => {
  return useMutation<OperationResponse<'v2_auth_profile_partial_update'>, ApiError, V2AuthProfilePartialUpdateArgs>({
    mutationKey: ['v2_auth_profile_partial_update'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v2_auth_profile_partial_update>>;
      return apiClient.call('v2_auth_profile_partial_update', createCallArgs<'v2_auth_profile_partial_update'>(payload));
    },
    ...options,
  });
};

export type V2AuthProfileUpdateArgs = Omit<OperationCallArgs<'v2_auth_profile_update'>, 'signal'>;

export const useV2AuthProfileUpdateMutation = (
  options?: MutationOptions<'v2_auth_profile_update', V2AuthProfileUpdateArgs>
) => {
  return useMutation<OperationResponse<'v2_auth_profile_update'>, ApiError, V2AuthProfileUpdateArgs>({
    mutationKey: ['v2_auth_profile_update'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v2_auth_profile_update>>;
      return apiClient.call('v2_auth_profile_update', createCallArgs<'v2_auth_profile_update'>(payload));
    },
    ...options,
  });
};

export type V2AuthProfileUpdateRetrieveArgs = Omit<OperationCallArgs<'v2_auth_profile_update_retrieve'>, 'signal'>;

export const useV2AuthProfileUpdateRetrieveQuery = (
  args?: V2AuthProfileUpdateRetrieveArgs,
  options?: QueryOptions<'v2_auth_profile_update_retrieve', OperationResponse<'v2_auth_profile_update_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_auth_profile_update_retrieve'>, ApiError, OperationResponse<'v2_auth_profile_update_retrieve'>, QueryKey>({
    queryKey: ['v2_auth_profile_update_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_auth_profile_update_retrieve>>;
      return apiClient.call('v2_auth_profile_update_retrieve', createCallArgs<'v2_auth_profile_update_retrieve>(payload));
    },
    ...options,
  });
};

export type V2AuthProfileUpdatePartialUpdateArgs = Omit<OperationCallArgs<'v2_auth_profile_update_partial_update'>, 'signal'>;

export const useV2AuthProfileUpdatePartialUpdateMutation = (
  options?: MutationOptions<'v2_auth_profile_update_partial_update', V2AuthProfileUpdatePartialUpdateArgs>
) => {
  return useMutation<OperationResponse<'v2_auth_profile_update_partial_update'>, ApiError, V2AuthProfileUpdatePartialUpdateArgs>({
    mutationKey: ['v2_auth_profile_update_partial_update'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v2_auth_profile_update_partial_update>>;
      return apiClient.call('v2_auth_profile_update_partial_update', createCallArgs<'v2_auth_profile_update_partial_update'>(payload));
    },
    ...options,
  });
};

export type V2AuthProfileUpdateUpdateArgs = Omit<OperationCallArgs<'v2_auth_profile_update_update'>, 'signal'>;

export const useV2AuthProfileUpdateUpdateMutation = (
  options?: MutationOptions<'v2_auth_profile_update_update', V2AuthProfileUpdateUpdateArgs>
) => {
  return useMutation<OperationResponse<'v2_auth_profile_update_update'>, ApiError, V2AuthProfileUpdateUpdateArgs>({
    mutationKey: ['v2_auth_profile_update_update'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v2_auth_profile_update_update>>;
      return apiClient.call('v2_auth_profile_update_update', createCallArgs<'v2_auth_profile_update_update'>(payload));
    },
    ...options,
  });
};

export type V2AuthRefreshCreateArgs = Omit<OperationCallArgs<'v2_auth_refresh_create'>, 'signal'>;

export const useV2AuthRefreshCreateMutation = (
  options?: MutationOptions<'v2_auth_refresh_create', V2AuthRefreshCreateArgs>
) => {
  return useMutation<OperationResponse<'v2_auth_refresh_create'>, ApiError, V2AuthRefreshCreateArgs>({
    mutationKey: ['v2_auth_refresh_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v2_auth_refresh_create>>;
      return apiClient.call('v2_auth_refresh_create', createCallArgs<'v2_auth_refresh_create'>(payload));
    },
    ...options,
  });
};

export type V2AuthRegisterCreateArgs = Omit<OperationCallArgs<'v2_auth_register_create'>, 'signal'>;

export const useV2AuthRegisterCreateMutation = (
  options?: MutationOptions<'v2_auth_register_create', V2AuthRegisterCreateArgs>
) => {
  return useMutation<OperationResponse<'v2_auth_register_create'>, ApiError, V2AuthRegisterCreateArgs>({
    mutationKey: ['v2_auth_register_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v2_auth_register_create>>;
      return apiClient.call('v2_auth_register_create', createCallArgs<'v2_auth_register_create'>(payload));
    },
    ...options,
  });
};

export type V2AuthStatsRetrieveArgs = Omit<OperationCallArgs<'v2_auth_stats_retrieve'>, 'signal'>;

export const useV2AuthStatsRetrieveQuery = (
  args?: V2AuthStatsRetrieveArgs,
  options?: QueryOptions<'v2_auth_stats_retrieve', OperationResponse<'v2_auth_stats_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_auth_stats_retrieve'>, ApiError, OperationResponse<'v2_auth_stats_retrieve'>, QueryKey>({
    queryKey: ['v2_auth_stats_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_auth_stats_retrieve>>;
      return apiClient.call('v2_auth_stats_retrieve', createCallArgs<'v2_auth_stats_retrieve>(payload));
    },
    ...options,
  });
};
