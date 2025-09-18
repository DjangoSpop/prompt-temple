import { useMutation, useQuery, type QueryKey, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient, createCallArgs, type OperationCallArgs, type OperationResponse } from '@/lib/apiClient';
import type { OperationId } from '@/lib/api/operationMap';
import type { ApiError } from '@/lib/api/base';

type QueryOptions<Op extends OperationId, TData> = Omit<UseQueryOptions<OperationResponse<Op>, ApiError, TData, QueryKey>, 'queryKey' | 'queryFn'>;

type MutationOptions<Op extends OperationId, TVariables> = Omit<UseMutationOptions<OperationResponse<Op>, ApiError, TVariables>, 'mutationFn' | 'mutationKey'>;

export type V1AnalyticsAbTestsRetrieveArgs = Omit<OperationCallArgs<'v1_analytics_ab_tests_retrieve'>, 'signal'>;

export const useV1AnalyticsAbTestsRetrieveQuery = (
  args?: V1AnalyticsAbTestsRetrieveArgs,
  options?: QueryOptions<'v1_analytics_ab_tests_retrieve', OperationResponse<'v1_analytics_ab_tests_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_analytics_ab_tests_retrieve'>, ApiError, OperationResponse<'v1_analytics_ab_tests_retrieve'>, QueryKey>({
    queryKey: ['v1_analytics_ab_tests_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_analytics_ab_tests_retrieve>>;
      return apiClient.call('v1_analytics_ab_tests_retrieve', createCallArgs<'v1_analytics_ab_tests_retrieve>(payload));
    },
    ...options,
  });
};

export type V1AnalyticsDashboardRetrieveArgs = Omit<OperationCallArgs<'v1_analytics_dashboard_retrieve'>, 'signal'>;

export const useV1AnalyticsDashboardRetrieveQuery = (
  args?: V1AnalyticsDashboardRetrieveArgs,
  options?: QueryOptions<'v1_analytics_dashboard_retrieve', OperationResponse<'v1_analytics_dashboard_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_analytics_dashboard_retrieve'>, ApiError, OperationResponse<'v1_analytics_dashboard_retrieve'>, QueryKey>({
    queryKey: ['v1_analytics_dashboard_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_analytics_dashboard_retrieve>>;
      return apiClient.call('v1_analytics_dashboard_retrieve', createCallArgs<'v1_analytics_dashboard_retrieve>(payload));
    },
    ...options,
  });
};

export type V1AnalyticsRecommendationsRetrieveArgs = Omit<OperationCallArgs<'v1_analytics_recommendations_retrieve'>, 'signal'>;

export const useV1AnalyticsRecommendationsRetrieveQuery = (
  args?: V1AnalyticsRecommendationsRetrieveArgs,
  options?: QueryOptions<'v1_analytics_recommendations_retrieve', OperationResponse<'v1_analytics_recommendations_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_analytics_recommendations_retrieve'>, ApiError, OperationResponse<'v1_analytics_recommendations_retrieve'>, QueryKey>({
    queryKey: ['v1_analytics_recommendations_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_analytics_recommendations_retrieve>>;
      return apiClient.call('v1_analytics_recommendations_retrieve', createCallArgs<'v1_analytics_recommendations_retrieve>(payload));
    },
    ...options,
  });
};

export type V1AnalyticsTemplateAnalyticsRetrieveArgs = Omit<OperationCallArgs<'v1_analytics_template_analytics_retrieve'>, 'signal'>;

export const useV1AnalyticsTemplateAnalyticsRetrieveQuery = (
  args?: V1AnalyticsTemplateAnalyticsRetrieveArgs,
  options?: QueryOptions<'v1_analytics_template_analytics_retrieve', OperationResponse<'v1_analytics_template_analytics_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_analytics_template_analytics_retrieve'>, ApiError, OperationResponse<'v1_analytics_template_analytics_retrieve'>, QueryKey>({
    queryKey: ['v1_analytics_template_analytics_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_analytics_template_analytics_retrieve>>;
      return apiClient.call('v1_analytics_template_analytics_retrieve', createCallArgs<'v1_analytics_template_analytics_retrieve>(payload));
    },
    ...options,
  });
};

export type V1AnalyticsTrackCreateArgs = Omit<OperationCallArgs<'v1_analytics_track_create'>, 'signal'>;

export const useV1AnalyticsTrackCreateMutation = (
  options?: MutationOptions<'v1_analytics_track_create', V1AnalyticsTrackCreateArgs>
) => {
  return useMutation<OperationResponse<'v1_analytics_track_create'>, ApiError, V1AnalyticsTrackCreateArgs>({
    mutationKey: ['v1_analytics_track_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v1_analytics_track_create>>;
      return apiClient.call('v1_analytics_track_create', createCallArgs<'v1_analytics_track_create'>(payload));
    },
    ...options,
  });
};

export type V1AnalyticsUserInsightsRetrieveArgs = Omit<OperationCallArgs<'v1_analytics_user_insights_retrieve'>, 'signal'>;

export const useV1AnalyticsUserInsightsRetrieveQuery = (
  args?: V1AnalyticsUserInsightsRetrieveArgs,
  options?: QueryOptions<'v1_analytics_user_insights_retrieve', OperationResponse<'v1_analytics_user_insights_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_analytics_user_insights_retrieve'>, ApiError, OperationResponse<'v1_analytics_user_insights_retrieve'>, QueryKey>({
    queryKey: ['v1_analytics_user_insights_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_analytics_user_insights_retrieve>>;
      return apiClient.call('v1_analytics_user_insights_retrieve', createCallArgs<'v1_analytics_user_insights_retrieve>(payload));
    },
    ...options,
  });
};

export type V2AnalyticsAbTestsRetrieveArgs = Omit<OperationCallArgs<'v2_analytics_ab_tests_retrieve'>, 'signal'>;

export const useV2AnalyticsAbTestsRetrieveQuery = (
  args?: V2AnalyticsAbTestsRetrieveArgs,
  options?: QueryOptions<'v2_analytics_ab_tests_retrieve', OperationResponse<'v2_analytics_ab_tests_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_analytics_ab_tests_retrieve'>, ApiError, OperationResponse<'v2_analytics_ab_tests_retrieve'>, QueryKey>({
    queryKey: ['v2_analytics_ab_tests_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_analytics_ab_tests_retrieve>>;
      return apiClient.call('v2_analytics_ab_tests_retrieve', createCallArgs<'v2_analytics_ab_tests_retrieve>(payload));
    },
    ...options,
  });
};

export type V2AnalyticsDashboardRetrieveArgs = Omit<OperationCallArgs<'v2_analytics_dashboard_retrieve'>, 'signal'>;

export const useV2AnalyticsDashboardRetrieveQuery = (
  args?: V2AnalyticsDashboardRetrieveArgs,
  options?: QueryOptions<'v2_analytics_dashboard_retrieve', OperationResponse<'v2_analytics_dashboard_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_analytics_dashboard_retrieve'>, ApiError, OperationResponse<'v2_analytics_dashboard_retrieve'>, QueryKey>({
    queryKey: ['v2_analytics_dashboard_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_analytics_dashboard_retrieve>>;
      return apiClient.call('v2_analytics_dashboard_retrieve', createCallArgs<'v2_analytics_dashboard_retrieve>(payload));
    },
    ...options,
  });
};

export type V2AnalyticsRecommendationsRetrieveArgs = Omit<OperationCallArgs<'v2_analytics_recommendations_retrieve'>, 'signal'>;

export const useV2AnalyticsRecommendationsRetrieveQuery = (
  args?: V2AnalyticsRecommendationsRetrieveArgs,
  options?: QueryOptions<'v2_analytics_recommendations_retrieve', OperationResponse<'v2_analytics_recommendations_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_analytics_recommendations_retrieve'>, ApiError, OperationResponse<'v2_analytics_recommendations_retrieve'>, QueryKey>({
    queryKey: ['v2_analytics_recommendations_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_analytics_recommendations_retrieve>>;
      return apiClient.call('v2_analytics_recommendations_retrieve', createCallArgs<'v2_analytics_recommendations_retrieve>(payload));
    },
    ...options,
  });
};

export type V2AnalyticsTemplateAnalyticsRetrieveArgs = Omit<OperationCallArgs<'v2_analytics_template_analytics_retrieve'>, 'signal'>;

export const useV2AnalyticsTemplateAnalyticsRetrieveQuery = (
  args?: V2AnalyticsTemplateAnalyticsRetrieveArgs,
  options?: QueryOptions<'v2_analytics_template_analytics_retrieve', OperationResponse<'v2_analytics_template_analytics_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_analytics_template_analytics_retrieve'>, ApiError, OperationResponse<'v2_analytics_template_analytics_retrieve'>, QueryKey>({
    queryKey: ['v2_analytics_template_analytics_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_analytics_template_analytics_retrieve>>;
      return apiClient.call('v2_analytics_template_analytics_retrieve', createCallArgs<'v2_analytics_template_analytics_retrieve>(payload));
    },
    ...options,
  });
};

export type V2AnalyticsTrackCreateArgs = Omit<OperationCallArgs<'v2_analytics_track_create'>, 'signal'>;

export const useV2AnalyticsTrackCreateMutation = (
  options?: MutationOptions<'v2_analytics_track_create', V2AnalyticsTrackCreateArgs>
) => {
  return useMutation<OperationResponse<'v2_analytics_track_create'>, ApiError, V2AnalyticsTrackCreateArgs>({
    mutationKey: ['v2_analytics_track_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v2_analytics_track_create>>;
      return apiClient.call('v2_analytics_track_create', createCallArgs<'v2_analytics_track_create'>(payload));
    },
    ...options,
  });
};

export type V2AnalyticsUserInsightsRetrieveArgs = Omit<OperationCallArgs<'v2_analytics_user_insights_retrieve'>, 'signal'>;

export const useV2AnalyticsUserInsightsRetrieveQuery = (
  args?: V2AnalyticsUserInsightsRetrieveArgs,
  options?: QueryOptions<'v2_analytics_user_insights_retrieve', OperationResponse<'v2_analytics_user_insights_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_analytics_user_insights_retrieve'>, ApiError, OperationResponse<'v2_analytics_user_insights_retrieve'>, QueryKey>({
    queryKey: ['v2_analytics_user_insights_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_analytics_user_insights_retrieve>>;
      return apiClient.call('v2_analytics_user_insights_retrieve', createCallArgs<'v2_analytics_user_insights_retrieve>(payload));
    },
    ...options,
  });
};
