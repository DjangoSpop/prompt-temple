import { useMutation, useQuery, type QueryKey, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient, createCallArgs, type OperationCallArgs, type OperationResponse } from '@/lib/apiClient';
import type { OperationId } from '@/lib/api/operationMap';
import type { ApiError } from '@/lib/api/base';

type QueryOptions<Op extends OperationId, TData> = Omit<UseQueryOptions<OperationResponse<Op>, ApiError, TData, QueryKey>, 'queryKey' | 'queryFn'>;

type MutationOptions<Op extends OperationId, TVariables> = Omit<UseMutationOptions<OperationResponse<Op>, ApiError, TVariables>, 'mutationFn' | 'mutationKey'>;

export type V1OrchestratorAssessCreateArgs = Omit<OperationCallArgs<'v1_orchestrator_assess_create'>, 'signal'>;

export const useV1OrchestratorAssessCreateMutation = (
  options?: MutationOptions<'v1_orchestrator_assess_create', V1OrchestratorAssessCreateArgs>
) => {
  return useMutation<OperationResponse<'v1_orchestrator_assess_create'>, ApiError, V1OrchestratorAssessCreateArgs>({
    mutationKey: ['v1_orchestrator_assess_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v1_orchestrator_assess_create>>;
      return apiClient.call('v1_orchestrator_assess_create', createCallArgs<'v1_orchestrator_assess_create'>(payload));
    },
    ...options,
  });
};

export type V1OrchestratorIntentCreateArgs = Omit<OperationCallArgs<'v1_orchestrator_intent_create'>, 'signal'>;

export const useV1OrchestratorIntentCreateMutation = (
  options?: MutationOptions<'v1_orchestrator_intent_create', V1OrchestratorIntentCreateArgs>
) => {
  return useMutation<OperationResponse<'v1_orchestrator_intent_create'>, ApiError, V1OrchestratorIntentCreateArgs>({
    mutationKey: ['v1_orchestrator_intent_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v1_orchestrator_intent_create>>;
      return apiClient.call('v1_orchestrator_intent_create', createCallArgs<'v1_orchestrator_intent_create'>(payload));
    },
    ...options,
  });
};

export type V1OrchestratorRenderCreateArgs = Omit<OperationCallArgs<'v1_orchestrator_render_create'>, 'signal'>;

export const useV1OrchestratorRenderCreateMutation = (
  options?: MutationOptions<'v1_orchestrator_render_create', V1OrchestratorRenderCreateArgs>
) => {
  return useMutation<OperationResponse<'v1_orchestrator_render_create'>, ApiError, V1OrchestratorRenderCreateArgs>({
    mutationKey: ['v1_orchestrator_render_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v1_orchestrator_render_create>>;
      return apiClient.call('v1_orchestrator_render_create', createCallArgs<'v1_orchestrator_render_create'>(payload));
    },
    ...options,
  });
};

export type V1OrchestratorSearchRetrieveArgs = Omit<OperationCallArgs<'v1_orchestrator_search_retrieve'>, 'signal'>;

export const useV1OrchestratorSearchRetrieveQuery = (
  args?: V1OrchestratorSearchRetrieveArgs,
  options?: QueryOptions<'v1_orchestrator_search_retrieve', OperationResponse<'v1_orchestrator_search_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_orchestrator_search_retrieve'>, ApiError, OperationResponse<'v1_orchestrator_search_retrieve'>, QueryKey>({
    queryKey: ['v1_orchestrator_search_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_orchestrator_search_retrieve>>;
      return apiClient.call('v1_orchestrator_search_retrieve', createCallArgs<'v1_orchestrator_search_retrieve>(payload));
    },
    ...options,
  });
};

export type V1OrchestratorTemplateRetrieveArgs = Omit<OperationCallArgs<'v1_orchestrator_template_retrieve'>, 'signal'>;

export const useV1OrchestratorTemplateRetrieveQuery = (
  args?: V1OrchestratorTemplateRetrieveArgs,
  options?: QueryOptions<'v1_orchestrator_template_retrieve', OperationResponse<'v1_orchestrator_template_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_orchestrator_template_retrieve'>, ApiError, OperationResponse<'v1_orchestrator_template_retrieve'>, QueryKey>({
    queryKey: ['v1_orchestrator_template_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_orchestrator_template_retrieve>>;
      return apiClient.call('v1_orchestrator_template_retrieve', createCallArgs<'v1_orchestrator_template_retrieve>(payload));
    },
    ...options,
  });
};

export type V1OrchestratorTemplateRetrieve2Args = Omit<OperationCallArgs<'v1_orchestrator_template_retrieve_2'>, 'signal'>;

export const useV1OrchestratorTemplateRetrieve2Query = (
  args: V1OrchestratorTemplateRetrieve2Args,
  options?: QueryOptions<'v1_orchestrator_template_retrieve_2', OperationResponse<'v1_orchestrator_template_retrieve_2'>>
) => {
  return useQuery<OperationResponse<'v1_orchestrator_template_retrieve_2'>, ApiError, OperationResponse<'v1_orchestrator_template_retrieve_2'>, QueryKey>({
    queryKey: ['v1_orchestrator_template_retrieve_2', args],
    queryFn: ({ signal }) => {
      const payload = { ...args, signal } as Partial<OperationCallArgs<'v1_orchestrator_template_retrieve_2>>;
      return apiClient.call('v1_orchestrator_template_retrieve_2', createCallArgs<'v1_orchestrator_template_retrieve_2>(payload));
    },
    ...options,
  });
};

export type V2OrchestratorAssessCreateArgs = Omit<OperationCallArgs<'v2_orchestrator_assess_create'>, 'signal'>;

export const useV2OrchestratorAssessCreateMutation = (
  options?: MutationOptions<'v2_orchestrator_assess_create', V2OrchestratorAssessCreateArgs>
) => {
  return useMutation<OperationResponse<'v2_orchestrator_assess_create'>, ApiError, V2OrchestratorAssessCreateArgs>({
    mutationKey: ['v2_orchestrator_assess_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v2_orchestrator_assess_create>>;
      return apiClient.call('v2_orchestrator_assess_create', createCallArgs<'v2_orchestrator_assess_create'>(payload));
    },
    ...options,
  });
};

export type V2OrchestratorIntentCreateArgs = Omit<OperationCallArgs<'v2_orchestrator_intent_create'>, 'signal'>;

export const useV2OrchestratorIntentCreateMutation = (
  options?: MutationOptions<'v2_orchestrator_intent_create', V2OrchestratorIntentCreateArgs>
) => {
  return useMutation<OperationResponse<'v2_orchestrator_intent_create'>, ApiError, V2OrchestratorIntentCreateArgs>({
    mutationKey: ['v2_orchestrator_intent_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v2_orchestrator_intent_create>>;
      return apiClient.call('v2_orchestrator_intent_create', createCallArgs<'v2_orchestrator_intent_create'>(payload));
    },
    ...options,
  });
};

export type V2OrchestratorRenderCreateArgs = Omit<OperationCallArgs<'v2_orchestrator_render_create'>, 'signal'>;

export const useV2OrchestratorRenderCreateMutation = (
  options?: MutationOptions<'v2_orchestrator_render_create', V2OrchestratorRenderCreateArgs>
) => {
  return useMutation<OperationResponse<'v2_orchestrator_render_create'>, ApiError, V2OrchestratorRenderCreateArgs>({
    mutationKey: ['v2_orchestrator_render_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v2_orchestrator_render_create>>;
      return apiClient.call('v2_orchestrator_render_create', createCallArgs<'v2_orchestrator_render_create'>(payload));
    },
    ...options,
  });
};

export type V2OrchestratorSearchRetrieveArgs = Omit<OperationCallArgs<'v2_orchestrator_search_retrieve'>, 'signal'>;

export const useV2OrchestratorSearchRetrieveQuery = (
  args?: V2OrchestratorSearchRetrieveArgs,
  options?: QueryOptions<'v2_orchestrator_search_retrieve', OperationResponse<'v2_orchestrator_search_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_orchestrator_search_retrieve'>, ApiError, OperationResponse<'v2_orchestrator_search_retrieve'>, QueryKey>({
    queryKey: ['v2_orchestrator_search_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_orchestrator_search_retrieve>>;
      return apiClient.call('v2_orchestrator_search_retrieve', createCallArgs<'v2_orchestrator_search_retrieve>(payload));
    },
    ...options,
  });
};

export type V2OrchestratorTemplateRetrieveArgs = Omit<OperationCallArgs<'v2_orchestrator_template_retrieve'>, 'signal'>;

export const useV2OrchestratorTemplateRetrieveQuery = (
  args?: V2OrchestratorTemplateRetrieveArgs,
  options?: QueryOptions<'v2_orchestrator_template_retrieve', OperationResponse<'v2_orchestrator_template_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_orchestrator_template_retrieve'>, ApiError, OperationResponse<'v2_orchestrator_template_retrieve'>, QueryKey>({
    queryKey: ['v2_orchestrator_template_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_orchestrator_template_retrieve>>;
      return apiClient.call('v2_orchestrator_template_retrieve', createCallArgs<'v2_orchestrator_template_retrieve>(payload));
    },
    ...options,
  });
};

export type V2OrchestratorTemplateRetrieve2Args = Omit<OperationCallArgs<'v2_orchestrator_template_retrieve_2'>, 'signal'>;

export const useV2OrchestratorTemplateRetrieve2Query = (
  args: V2OrchestratorTemplateRetrieve2Args,
  options?: QueryOptions<'v2_orchestrator_template_retrieve_2', OperationResponse<'v2_orchestrator_template_retrieve_2'>>
) => {
  return useQuery<OperationResponse<'v2_orchestrator_template_retrieve_2'>, ApiError, OperationResponse<'v2_orchestrator_template_retrieve_2'>, QueryKey>({
    queryKey: ['v2_orchestrator_template_retrieve_2', args],
    queryFn: ({ signal }) => {
      const payload = { ...args, signal } as Partial<OperationCallArgs<'v2_orchestrator_template_retrieve_2>>;
      return apiClient.call('v2_orchestrator_template_retrieve_2', createCallArgs<'v2_orchestrator_template_retrieve_2>(payload));
    },
    ...options,
  });
};
