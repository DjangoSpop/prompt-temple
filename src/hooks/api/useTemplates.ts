import { useMutation, useQuery, type QueryKey, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient, createCallArgs, type OperationCallArgs, type OperationResponse } from '@/lib/apiClient';
import type { OperationId } from '@/lib/api/operationMap';
import type { ApiError } from '@/lib/api/base';

type QueryOptions<Op extends OperationId, TData> = Omit<UseQueryOptions<OperationResponse<Op>, ApiError, TData, QueryKey>, 'queryKey' | 'queryFn'>;

type MutationOptions<Op extends OperationId, TVariables> = Omit<UseMutationOptions<OperationResponse<Op>, ApiError, TVariables>, 'mutationFn' | 'mutationKey'>;

export type V1TemplateCategoriesListArgs = Omit<OperationCallArgs<'v1_template_categories_list'>, 'signal'>;

export const useV1TemplateCategoriesListQuery = (
  args?: V1TemplateCategoriesListArgs,
  options?: QueryOptions<'v1_template_categories_list', OperationResponse<'v1_template_categories_list'>>
) => {
  return useQuery<OperationResponse<'v1_template_categories_list'>, ApiError, OperationResponse<'v1_template_categories_list'>, QueryKey>({
    queryKey: ['v1_template_categories_list', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_template_categories_list'>>;
      return apiClient.call('v1_template_categories_list', createCallArgs<'v1_template_categories_list>(payload));
    },
    ...options,
  });
};

export type V1TemplateCategoriesRetrieveArgs = Omit<OperationCallArgs<'v1_template_categories_retrieve'>, 'signal'>;

export const useV1TemplateCategoriesRetrieveQuery = (
  args: V1TemplateCategoriesRetrieveArgs,
  options?: QueryOptions<'v1_template_categories_retrieve', OperationResponse<'v1_template_categories_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_template_categories_retrieve'>, ApiError, OperationResponse<'v1_template_categories_retrieve'>, QueryKey>({
    queryKey: ['v1_template_categories_retrieve', args],
    queryFn: ({ signal }) => {
      const payload = { ...args, signal } as Partial<OperationCallArgs<'v1_template_categories_retrieve'>>;
      return apiClient.call('v1_template_categories_retrieve', createCallArgs<'v1_template_categories_retrieve>(payload));
    },
    ...options,
  });
};

export type V1TemplateCategoriesTemplatesRetrieveArgs = Omit<OperationCallArgs<'v1_template_categories_templates_retrieve'>, 'signal'>;

export const useV1TemplateCategoriesTemplatesRetrieveQuery = (
  args: V1TemplateCategoriesTemplatesRetrieveArgs,
  options?: QueryOptions<'v1_template_categories_templates_retrieve', OperationResponse<'v1_template_categories_templates_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_template_categories_templates_retrieve'>, ApiError, OperationResponse<'v1_template_categories_templates_retrieve'>, QueryKey>({
    queryKey: ['v1_template_categories_templates_retrieve', args],
    queryFn: ({ signal }) => {
      const payload = { ...args, signal } as Partial<OperationCallArgs<'v1_template_categories_templates_retrieve'>>;
      return apiClient.call('v1_template_categories_templates_retrieve', createCallArgs<'v1_template_categories_templates_retrieve>(payload));
    },
    ...options,
  });
};

export type V1TemplatesListArgs = Omit<OperationCallArgs<'v1_templates_list'>, 'signal'>;

export const useV1TemplatesListQuery = (
  args?: V1TemplatesListArgs,
  options?: QueryOptions<'v1_templates_list', OperationResponse<'v1_templates_list'>>
) => {
  return useQuery<OperationResponse<'v1_templates_list'>, ApiError, OperationResponse<'v1_templates_list'>, QueryKey>({
    queryKey: ['v1_templates_list', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_templates_list'>>;
      return apiClient.call('v1_templates_list', createCallArgs<'v1_templates_list>(payload));
    },
    ...options,
  });
};

export type V1TemplatesCreateArgs = Omit<OperationCallArgs<'v1_templates_create'>, 'signal'>;

export const useV1TemplatesCreateMutation = (
  options?: MutationOptions<'v1_templates_create', V1TemplatesCreateArgs>
) => {
  return useMutation<OperationResponse<'v1_templates_create'>, ApiError, V1TemplatesCreateArgs>({
    mutationKey: ['v1_templates_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v1_templates_create'>>;
      return apiClient.call('v1_templates_create', createCallArgs<'v1_templates_create'>(payload));
    },
    ...options,
  });
};

export type V1TemplatesDestroyArgs = Omit<OperationCallArgs<'v1_templates_destroy'>, 'signal'>;

export const useV1TemplatesDestroyMutation = (
  options?: MutationOptions<'v1_templates_destroy', V1TemplatesDestroyArgs>
) => {
  return useMutation<OperationResponse<'v1_templates_destroy'>, ApiError, V1TemplatesDestroyArgs>({
    mutationKey: ['v1_templates_destroy'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v1_templates_destroy'>>;
      return apiClient.call('v1_templates_destroy', createCallArgs<'v1_templates_destroy'>(payload));
    },
    ...options,
  });
};

export type V1TemplatesRetrieveArgs = Omit<OperationCallArgs<'v1_templates_retrieve'>, 'signal'>;

export const useV1TemplatesRetrieveQuery = (
  args: V1TemplatesRetrieveArgs,
  options?: QueryOptions<'v1_templates_retrieve', OperationResponse<'v1_templates_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_templates_retrieve'>, ApiError, OperationResponse<'v1_templates_retrieve'>, QueryKey>({
    queryKey: ['v1_templates_retrieve', args],
    queryFn: ({ signal }) => {
      const payload = { ...args, signal } as Partial<OperationCallArgs<'v1_templates_retrieve'>>;
      return apiClient.call('v1_templates_retrieve', createCallArgs<'v1_templates_retrieve>(payload));
    },
    ...options,
  });
};

export type V1TemplatesPartialUpdateArgs = Omit<OperationCallArgs<'v1_templates_partial_update'>, 'signal'>;

export const useV1TemplatesPartialUpdateMutation = (
  options?: MutationOptions<'v1_templates_partial_update', V1TemplatesPartialUpdateArgs>
) => {
  return useMutation<OperationResponse<'v1_templates_partial_update'>, ApiError, V1TemplatesPartialUpdateArgs>({
    mutationKey: ['v1_templates_partial_update'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v1_templates_partial_update'>>;
      return apiClient.call('v1_templates_partial_update', createCallArgs<'v1_templates_partial_update'>(payload));
    },
    ...options,
  });
};

export type V1TemplatesUpdateArgs = Omit<OperationCallArgs<'v1_templates_update'>, 'signal'>;

export const useV1TemplatesUpdateMutation = (
  options?: MutationOptions<'v1_templates_update', V1TemplatesUpdateArgs>
) => {
  return useMutation<OperationResponse<'v1_templates_update'>, ApiError, V1TemplatesUpdateArgs>({
    mutationKey: ['v1_templates_update'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v1_templates_update'>>;
      return apiClient.call('v1_templates_update', createCallArgs<'v1_templates_update'>(payload));
    },
    ...options,
  });
};

export type V1TemplatesAnalyticsRetrieveArgs = Omit<OperationCallArgs<'v1_templates_analytics_retrieve'>, 'signal'>;

export const useV1TemplatesAnalyticsRetrieveQuery = (
  args: V1TemplatesAnalyticsRetrieveArgs,
  options?: QueryOptions<'v1_templates_analytics_retrieve', OperationResponse<'v1_templates_analytics_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_templates_analytics_retrieve'>, ApiError, OperationResponse<'v1_templates_analytics_retrieve'>, QueryKey>({
    queryKey: ['v1_templates_analytics_retrieve', args],
    queryFn: ({ signal }) => {
      const payload = { ...args, signal } as Partial<OperationCallArgs<'v1_templates_analytics_retrieve'>>;
      return apiClient.call('v1_templates_analytics_retrieve', createCallArgs<'v1_templates_analytics_retrieve>(payload));
    },
    ...options,
  });
};

export type V1TemplatesAnalyzeWithAiCreateArgs = Omit<OperationCallArgs<'v1_templates_analyze_with_ai_create'>, 'signal'>;

export const useV1TemplatesAnalyzeWithAiCreateMutation = (
  options?: MutationOptions<'v1_templates_analyze_with_ai_create', V1TemplatesAnalyzeWithAiCreateArgs>
) => {
  return useMutation<OperationResponse<'v1_templates_analyze_with_ai_create'>, ApiError, V1TemplatesAnalyzeWithAiCreateArgs>({
    mutationKey: ['v1_templates_analyze_with_ai_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v1_templates_analyze_with_ai_create'>>;
      return apiClient.call('v1_templates_analyze_with_ai_create', createCallArgs<'v1_templates_analyze_with_ai_create'>(payload));
    },
    ...options,
  });
};

export type V1TemplatesCompleteUsageCreateArgs = Omit<OperationCallArgs<'v1_templates_complete_usage_create'>, 'signal'>;

export const useV1TemplatesCompleteUsageCreateMutation = (
  options?: MutationOptions<'v1_templates_complete_usage_create', V1TemplatesCompleteUsageCreateArgs>
) => {
  return useMutation<OperationResponse<'v1_templates_complete_usage_create'>, ApiError, V1TemplatesCompleteUsageCreateArgs>({
    mutationKey: ['v1_templates_complete_usage_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v1_templates_complete_usage_create'>>;
      return apiClient.call('v1_templates_complete_usage_create', createCallArgs<'v1_templates_complete_usage_create'>(payload));
    },
    ...options,
  });
};

export type V1TemplatesDuplicateCreateArgs = Omit<OperationCallArgs<'v1_templates_duplicate_create'>, 'signal'>;

export const useV1TemplatesDuplicateCreateMutation = (
  options?: MutationOptions<'v1_templates_duplicate_create', V1TemplatesDuplicateCreateArgs>
) => {
  return useMutation<OperationResponse<'v1_templates_duplicate_create'>, ApiError, V1TemplatesDuplicateCreateArgs>({
    mutationKey: ['v1_templates_duplicate_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v1_templates_duplicate_create'>>;
      return apiClient.call('v1_templates_duplicate_create', createCallArgs<'v1_templates_duplicate_create'>(payload));
    },
    ...options,
  });
};

export type V1TemplatesRateTemplateCreateArgs = Omit<OperationCallArgs<'v1_templates_rate_template_create'>, 'signal'>;

export const useV1TemplatesRateTemplateCreateMutation = (
  options?: MutationOptions<'v1_templates_rate_template_create', V1TemplatesRateTemplateCreateArgs>
) => {
  return useMutation<OperationResponse<'v1_templates_rate_template_create'>, ApiError, V1TemplatesRateTemplateCreateArgs>({
    mutationKey: ['v1_templates_rate_template_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v1_templates_rate_template_create'>>;
      return apiClient.call('v1_templates_rate_template_create', createCallArgs<'v1_templates_rate_template_create'>(payload));
    },
    ...options,
  });
};

export type V1TemplatesStartUsageCreateArgs = Omit<OperationCallArgs<'v1_templates_start_usage_create'>, 'signal'>;

export const useV1TemplatesStartUsageCreateMutation = (
  options?: MutationOptions<'v1_templates_start_usage_create', V1TemplatesStartUsageCreateArgs>
) => {
  return useMutation<OperationResponse<'v1_templates_start_usage_create'>, ApiError, V1TemplatesStartUsageCreateArgs>({
    mutationKey: ['v1_templates_start_usage_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v1_templates_start_usage_create'>>;
      return apiClient.call('v1_templates_start_usage_create', createCallArgs<'v1_templates_start_usage_create'>(payload));
    },
    ...options,
  });
};

export type V1TemplatesFeaturedRetrieveArgs = Omit<OperationCallArgs<'v1_templates_featured_retrieve'>, 'signal'>;

export const useV1TemplatesFeaturedRetrieveQuery = (
  args?: V1TemplatesFeaturedRetrieveArgs,
  options?: QueryOptions<'v1_templates_featured_retrieve', OperationResponse<'v1_templates_featured_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_templates_featured_retrieve'>, ApiError, OperationResponse<'v1_templates_featured_retrieve'>, QueryKey>({
    queryKey: ['v1_templates_featured_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_templates_featured_retrieve'>>;
      return apiClient.call('v1_templates_featured_retrieve', createCallArgs<'v1_templates_featured_retrieve>(payload));
    },
    ...options,
  });
};

export type V1TemplatesMyTemplatesRetrieveArgs = Omit<OperationCallArgs<'v1_templates_my_templates_retrieve'>, 'signal'>;

export const useV1TemplatesMyTemplatesRetrieveQuery = (
  args?: V1TemplatesMyTemplatesRetrieveArgs,
  options?: QueryOptions<'v1_templates_my_templates_retrieve', OperationResponse<'v1_templates_my_templates_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_templates_my_templates_retrieve'>, ApiError, OperationResponse<'v1_templates_my_templates_retrieve'>, QueryKey>({
    queryKey: ['v1_templates_my_templates_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_templates_my_templates_retrieve'>>;
      return apiClient.call('v1_templates_my_templates_retrieve', createCallArgs<'v1_templates_my_templates_retrieve>(payload));
    },
    ...options,
  });
};

export type V1TemplatesSearchSuggestionsRetrieveArgs = Omit<OperationCallArgs<'v1_templates_search_suggestions_retrieve'>, 'signal'>;

export const useV1TemplatesSearchSuggestionsRetrieveQuery = (
  args?: V1TemplatesSearchSuggestionsRetrieveArgs,
  options?: QueryOptions<'v1_templates_search_suggestions_retrieve', OperationResponse<'v1_templates_search_suggestions_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_templates_search_suggestions_retrieve'>, ApiError, OperationResponse<'v1_templates_search_suggestions_retrieve'>, QueryKey>({
    queryKey: ['v1_templates_search_suggestions_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_templates_search_suggestions_retrieve'>>;
      return apiClient.call('v1_templates_search_suggestions_retrieve', createCallArgs<'v1_templates_search_suggestions_retrieve>(payload));
    },
    ...options,
  });
};

export type V1TemplatesTrendingRetrieveArgs = Omit<OperationCallArgs<'v1_templates_trending_retrieve'>, 'signal'>;

export const useV1TemplatesTrendingRetrieveQuery = (
  args?: V1TemplatesTrendingRetrieveArgs,
  options?: QueryOptions<'v1_templates_trending_retrieve', OperationResponse<'v1_templates_trending_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_templates_trending_retrieve'>, ApiError, OperationResponse<'v1_templates_trending_retrieve'>, QueryKey>({
    queryKey: ['v1_templates_trending_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_templates_trending_retrieve'>>;
      return apiClient.call('v1_templates_trending_retrieve', createCallArgs<'v1_templates_trending_retrieve>(payload));
    },
    ...options,
  });
};

export type V2TemplateCategoriesListArgs = Omit<OperationCallArgs<'v2_template_categories_list'>, 'signal'>;

export const useV2TemplateCategoriesListQuery = (
  args?: V2TemplateCategoriesListArgs,
  options?: QueryOptions<'v2_template_categories_list', OperationResponse<'v2_template_categories_list'>>
) => {
  return useQuery<OperationResponse<'v2_template_categories_list'>, ApiError, OperationResponse<'v2_template_categories_list'>, QueryKey>({
    queryKey: ['v2_template_categories_list', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_template_categories_list'>>;
      return apiClient.call('v2_template_categories_list', createCallArgs<'v2_template_categories_list>(payload));
    },
    ...options,
  });
};

export type V2TemplateCategoriesRetrieveArgs = Omit<OperationCallArgs<'v2_template_categories_retrieve'>, 'signal'>;

export const useV2TemplateCategoriesRetrieveQuery = (
  args: V2TemplateCategoriesRetrieveArgs,
  options?: QueryOptions<'v2_template_categories_retrieve', OperationResponse<'v2_template_categories_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_template_categories_retrieve'>, ApiError, OperationResponse<'v2_template_categories_retrieve'>, QueryKey>({
    queryKey: ['v2_template_categories_retrieve', args],
    queryFn: ({ signal }) => {
      const payload = { ...args, signal } as Partial<OperationCallArgs<'v2_template_categories_retrieve'>>;
      return apiClient.call('v2_template_categories_retrieve', createCallArgs<'v2_template_categories_retrieve>(payload));
    },
    ...options,
  });
};

export type V2TemplateCategoriesTemplatesRetrieveArgs = Omit<OperationCallArgs<'v2_template_categories_templates_retrieve'>, 'signal'>;

export const useV2TemplateCategoriesTemplatesRetrieveQuery = (
  args: V2TemplateCategoriesTemplatesRetrieveArgs,
  options?: QueryOptions<'v2_template_categories_templates_retrieve', OperationResponse<'v2_template_categories_templates_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_template_categories_templates_retrieve'>, ApiError, OperationResponse<'v2_template_categories_templates_retrieve'>, QueryKey>({
    queryKey: ['v2_template_categories_templates_retrieve', args],
    queryFn: ({ signal }) => {
      const payload = { ...args, signal } as Partial<OperationCallArgs<'v2_template_categories_templates_retrieve'>>;
      return apiClient.call('v2_template_categories_templates_retrieve', createCallArgs<'v2_template_categories_templates_retrieve>(payload));
    },
    ...options,
  });
};

export type V2TemplatesListArgs = Omit<OperationCallArgs<'v2_templates_list'>, 'signal'>;

export const useV2TemplatesListQuery = (
  args?: V2TemplatesListArgs,
  options?: QueryOptions<'v2_templates_list', OperationResponse<'v2_templates_list'>>
) => {
  return useQuery<OperationResponse<'v2_templates_list'>, ApiError, OperationResponse<'v2_templates_list'>, QueryKey>({
    queryKey: ['v2_templates_list', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_templates_list'>>;
      return apiClient.call('v2_templates_list', createCallArgs<'v2_templates_list>(payload));
    },
    ...options,
  });
};

export type V2TemplatesCreateArgs = Omit<OperationCallArgs<'v2_templates_create'>, 'signal'>;

export const useV2TemplatesCreateMutation = (
  options?: MutationOptions<'v2_templates_create', V2TemplatesCreateArgs>
) => {
  return useMutation<OperationResponse<'v2_templates_create'>, ApiError, V2TemplatesCreateArgs>({
    mutationKey: ['v2_templates_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v2_templates_create'>>;
      return apiClient.call('v2_templates_create', createCallArgs<'v2_templates_create'>(payload));
    },
    ...options,
  });
};

export type V2TemplatesDestroyArgs = Omit<OperationCallArgs<'v2_templates_destroy'>, 'signal'>;

export const useV2TemplatesDestroyMutation = (
  options?: MutationOptions<'v2_templates_destroy', V2TemplatesDestroyArgs>
) => {
  return useMutation<OperationResponse<'v2_templates_destroy'>, ApiError, V2TemplatesDestroyArgs>({
    mutationKey: ['v2_templates_destroy'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v2_templates_destroy'>>;
      return apiClient.call('v2_templates_destroy', createCallArgs<'v2_templates_destroy'>(payload));
    },
    ...options,
  });
};

export type V2TemplatesRetrieveArgs = Omit<OperationCallArgs<'v2_templates_retrieve'>, 'signal'>;

export const useV2TemplatesRetrieveQuery = (
  args: V2TemplatesRetrieveArgs,
  options?: QueryOptions<'v2_templates_retrieve', OperationResponse<'v2_templates_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_templates_retrieve'>, ApiError, OperationResponse<'v2_templates_retrieve'>, QueryKey>({
    queryKey: ['v2_templates_retrieve', args],
    queryFn: ({ signal }) => {
      const payload = { ...args, signal } as Partial<OperationCallArgs<'v2_templates_retrieve'>>;
      return apiClient.call('v2_templates_retrieve', createCallArgs<'v2_templates_retrieve>(payload));
    },
    ...options,
  });
};

export type V2TemplatesPartialUpdateArgs = Omit<OperationCallArgs<'v2_templates_partial_update'>, 'signal'>;

export const useV2TemplatesPartialUpdateMutation = (
  options?: MutationOptions<'v2_templates_partial_update', V2TemplatesPartialUpdateArgs>
) => {
  return useMutation<OperationResponse<'v2_templates_partial_update'>, ApiError, V2TemplatesPartialUpdateArgs>({
    mutationKey: ['v2_templates_partial_update'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v2_templates_partial_update'>>;
      return apiClient.call('v2_templates_partial_update', createCallArgs<'v2_templates_partial_update'>(payload));
    },
    ...options,
  });
};

export type V2TemplatesUpdateArgs = Omit<OperationCallArgs<'v2_templates_update'>, 'signal'>;

export const useV2TemplatesUpdateMutation = (
  options?: MutationOptions<'v2_templates_update', V2TemplatesUpdateArgs>
) => {
  return useMutation<OperationResponse<'v2_templates_update'>, ApiError, V2TemplatesUpdateArgs>({
    mutationKey: ['v2_templates_update'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v2_templates_update'>>;
      return apiClient.call('v2_templates_update', createCallArgs<'v2_templates_update'>(payload));
    },
    ...options,
  });
};

export type V2TemplatesAnalyticsRetrieveArgs = Omit<OperationCallArgs<'v2_templates_analytics_retrieve'>, 'signal'>;

export const useV2TemplatesAnalyticsRetrieveQuery = (
  args: V2TemplatesAnalyticsRetrieveArgs,
  options?: QueryOptions<'v2_templates_analytics_retrieve', OperationResponse<'v2_templates_analytics_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_templates_analytics_retrieve'>, ApiError, OperationResponse<'v2_templates_analytics_retrieve'>, QueryKey>({
    queryKey: ['v2_templates_analytics_retrieve', args],
    queryFn: ({ signal }) => {
      const payload = { ...args, signal } as Partial<OperationCallArgs<'v2_templates_analytics_retrieve'>>;
      return apiClient.call('v2_templates_analytics_retrieve', createCallArgs<'v2_templates_analytics_retrieve>(payload));
    },
    ...options,
  });
};

export type V2TemplatesAnalyzeWithAiCreateArgs = Omit<OperationCallArgs<'v2_templates_analyze_with_ai_create'>, 'signal'>;

export const useV2TemplatesAnalyzeWithAiCreateMutation = (
  options?: MutationOptions<'v2_templates_analyze_with_ai_create', V2TemplatesAnalyzeWithAiCreateArgs>
) => {
  return useMutation<OperationResponse<'v2_templates_analyze_with_ai_create'>, ApiError, V2TemplatesAnalyzeWithAiCreateArgs>({
    mutationKey: ['v2_templates_analyze_with_ai_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v2_templates_analyze_with_ai_create'>>;
      return apiClient.call('v2_templates_analyze_with_ai_create', createCallArgs<'v2_templates_analyze_with_ai_create'>(payload));
    },
    ...options,
  });
};

export type V2TemplatesCompleteUsageCreateArgs = Omit<OperationCallArgs<'v2_templates_complete_usage_create'>, 'signal'>;

export const useV2TemplatesCompleteUsageCreateMutation = (
  options?: MutationOptions<'v2_templates_complete_usage_create', V2TemplatesCompleteUsageCreateArgs>
) => {
  return useMutation<OperationResponse<'v2_templates_complete_usage_create'>, ApiError, V2TemplatesCompleteUsageCreateArgs>({
    mutationKey: ['v2_templates_complete_usage_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v2_templates_complete_usage_create'>>;
      return apiClient.call('v2_templates_complete_usage_create', createCallArgs<'v2_templates_complete_usage_create'>(payload));
    },
    ...options,
  });
};

export type V2TemplatesDuplicateCreateArgs = Omit<OperationCallArgs<'v2_templates_duplicate_create'>, 'signal'>;

export const useV2TemplatesDuplicateCreateMutation = (
  options?: MutationOptions<'v2_templates_duplicate_create', V2TemplatesDuplicateCreateArgs>
) => {
  return useMutation<OperationResponse<'v2_templates_duplicate_create'>, ApiError, V2TemplatesDuplicateCreateArgs>({
    mutationKey: ['v2_templates_duplicate_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v2_templates_duplicate_create'>>;
      return apiClient.call('v2_templates_duplicate_create', createCallArgs<'v2_templates_duplicate_create'>(payload));
    },
    ...options,
  });
};

export type V2TemplatesRateTemplateCreateArgs = Omit<OperationCallArgs<'v2_templates_rate_template_create'>, 'signal'>;

export const useV2TemplatesRateTemplateCreateMutation = (
  options?: MutationOptions<'v2_templates_rate_template_create', V2TemplatesRateTemplateCreateArgs>
) => {
  return useMutation<OperationResponse<'v2_templates_rate_template_create'>, ApiError, V2TemplatesRateTemplateCreateArgs>({
    mutationKey: ['v2_templates_rate_template_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v2_templates_rate_template_create'>>;
      return apiClient.call('v2_templates_rate_template_create', createCallArgs<'v2_templates_rate_template_create'>(payload));
    },
    ...options,
  });
};

export type V2TemplatesStartUsageCreateArgs = Omit<OperationCallArgs<'v2_templates_start_usage_create'>, 'signal'>;

export const useV2TemplatesStartUsageCreateMutation = (
  options?: MutationOptions<'v2_templates_start_usage_create', V2TemplatesStartUsageCreateArgs>
) => {
  return useMutation<OperationResponse<'v2_templates_start_usage_create'>, ApiError, V2TemplatesStartUsageCreateArgs>({
    mutationKey: ['v2_templates_start_usage_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v2_templates_start_usage_create'>>;
      return apiClient.call('v2_templates_start_usage_create', createCallArgs<'v2_templates_start_usage_create'>(payload));
    },
    ...options,
  });
};

export type V2TemplatesFeaturedRetrieveArgs = Omit<OperationCallArgs<'v2_templates_featured_retrieve'>, 'signal'>;

export const useV2TemplatesFeaturedRetrieveQuery = (
  args?: V2TemplatesFeaturedRetrieveArgs,
  options?: QueryOptions<'v2_templates_featured_retrieve', OperationResponse<'v2_templates_featured_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_templates_featured_retrieve'>, ApiError, OperationResponse<'v2_templates_featured_retrieve'>, QueryKey>({
    queryKey: ['v2_templates_featured_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_templates_featured_retrieve'>>;
      return apiClient.call('v2_templates_featured_retrieve', createCallArgs<'v2_templates_featured_retrieve>(payload));
    },
    ...options,
  });
};

export type V2TemplatesMyTemplatesRetrieveArgs = Omit<OperationCallArgs<'v2_templates_my_templates_retrieve'>, 'signal'>;

export const useV2TemplatesMyTemplatesRetrieveQuery = (
  args?: V2TemplatesMyTemplatesRetrieveArgs,
  options?: QueryOptions<'v2_templates_my_templates_retrieve', OperationResponse<'v2_templates_my_templates_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_templates_my_templates_retrieve'>, ApiError, OperationResponse<'v2_templates_my_templates_retrieve'>, QueryKey>({
    queryKey: ['v2_templates_my_templates_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_templates_my_templates_retrieve'>>;
      return apiClient.call('v2_templates_my_templates_retrieve', createCallArgs<'v2_templates_my_templates_retrieve>(payload));
    },
    ...options,
  });
};

export type V2TemplatesSearchSuggestionsRetrieveArgs = Omit<OperationCallArgs<'v2_templates_search_suggestions_retrieve'>, 'signal'>;

export const useV2TemplatesSearchSuggestionsRetrieveQuery = (
  args?: V2TemplatesSearchSuggestionsRetrieveArgs,
  options?: QueryOptions<'v2_templates_search_suggestions_retrieve', OperationResponse<'v2_templates_search_suggestions_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_templates_search_suggestions_retrieve'>, ApiError, OperationResponse<'v2_templates_search_suggestions_retrieve'>, QueryKey>({
    queryKey: ['v2_templates_search_suggestions_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_templates_search_suggestions_retrieve'>>;
      return apiClient.call('v2_templates_search_suggestions_retrieve', createCallArgs<'v2_templates_search_suggestions_retrieve>(payload));
    },
    ...options,
  });
};

export type V2TemplatesTrendingRetrieveArgs = Omit<OperationCallArgs<'v2_templates_trending_retrieve'>, 'signal'>;

export const useV2TemplatesTrendingRetrieveQuery = (
  args?: V2TemplatesTrendingRetrieveArgs,
  options?: QueryOptions<'v2_templates_trending_retrieve', OperationResponse<'v2_templates_trending_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_templates_trending_retrieve'>, ApiError, OperationResponse<'v2_templates_trending_retrieve'>, QueryKey>({
    queryKey: ['v2_templates_trending_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_templates_trending_retrieve'>>;
      return apiClient.call('v2_templates_trending_retrieve', createCallArgs<'v2_templates_trending_retrieve>(payload));
    },
    ...options,
  });
};
