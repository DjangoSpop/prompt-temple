import { useMutation, useQuery, type QueryKey, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient, createCallArgs, type OperationCallArgs, type OperationResponse } from '@/lib/apiClient';
import type { OperationId } from '@/lib/api/operationMap';
import type { ApiError } from '@/lib/api/base';

type QueryOptions<Op extends OperationId, TData> = Omit<UseQueryOptions<OperationResponse<Op>, ApiError, TData, QueryKey>, 'queryKey' | 'queryFn'>;

type MutationOptions<Op extends OperationId, TVariables> = Omit<UseMutationOptions<OperationResponse<Op>, ApiError, TVariables>, 'mutationFn' | 'mutationKey'>;

export type V1BillingCheckoutCreateArgs = Omit<OperationCallArgs<'v1_billing_checkout_create'>, 'signal'>;

export const useV1BillingCheckoutCreateMutation = (
  options?: MutationOptions<'v1_billing_checkout_create', V1BillingCheckoutCreateArgs>
) => {
  return useMutation<OperationResponse<'v1_billing_checkout_create'>, ApiError, V1BillingCheckoutCreateArgs>({
    mutationKey: ['v1_billing_checkout_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v1_billing_checkout_create>>;
      return apiClient.call('v1_billing_checkout_create', createCallArgs<'v1_billing_checkout_create'>(payload));
    },
    ...options,
  });
};

export type V1BillingMeEntitlementsRetrieveArgs = Omit<OperationCallArgs<'v1_billing_me_entitlements_retrieve'>, 'signal'>;

export const useV1BillingMeEntitlementsRetrieveQuery = (
  args?: V1BillingMeEntitlementsRetrieveArgs,
  options?: QueryOptions<'v1_billing_me_entitlements_retrieve', OperationResponse<'v1_billing_me_entitlements_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_billing_me_entitlements_retrieve'>, ApiError, OperationResponse<'v1_billing_me_entitlements_retrieve'>, QueryKey>({
    queryKey: ['v1_billing_me_entitlements_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_billing_me_entitlements_retrieve>>;
      return apiClient.call('v1_billing_me_entitlements_retrieve', createCallArgs<'v1_billing_me_entitlements_retrieve>(payload));
    },
    ...options,
  });
};

export type V1BillingMeSubscriptionRetrieveArgs = Omit<OperationCallArgs<'v1_billing_me_subscription_retrieve'>, 'signal'>;

export const useV1BillingMeSubscriptionRetrieveQuery = (
  args?: V1BillingMeSubscriptionRetrieveArgs,
  options?: QueryOptions<'v1_billing_me_subscription_retrieve', OperationResponse<'v1_billing_me_subscription_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_billing_me_subscription_retrieve'>, ApiError, OperationResponse<'v1_billing_me_subscription_retrieve'>, QueryKey>({
    queryKey: ['v1_billing_me_subscription_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_billing_me_subscription_retrieve>>;
      return apiClient.call('v1_billing_me_subscription_retrieve', createCallArgs<'v1_billing_me_subscription_retrieve>(payload));
    },
    ...options,
  });
};

export type V1BillingMeUsageRetrieveArgs = Omit<OperationCallArgs<'v1_billing_me_usage_retrieve'>, 'signal'>;

export const useV1BillingMeUsageRetrieveQuery = (
  args?: V1BillingMeUsageRetrieveArgs,
  options?: QueryOptions<'v1_billing_me_usage_retrieve', OperationResponse<'v1_billing_me_usage_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_billing_me_usage_retrieve'>, ApiError, OperationResponse<'v1_billing_me_usage_retrieve'>, QueryKey>({
    queryKey: ['v1_billing_me_usage_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_billing_me_usage_retrieve>>;
      return apiClient.call('v1_billing_me_usage_retrieve', createCallArgs<'v1_billing_me_usage_retrieve>(payload));
    },
    ...options,
  });
};

export type V1BillingPlansRetrieveArgs = Omit<OperationCallArgs<'v1_billing_plans_retrieve'>, 'signal'>;

export const useV1BillingPlansRetrieveQuery = (
  args?: V1BillingPlansRetrieveArgs,
  options?: QueryOptions<'v1_billing_plans_retrieve', OperationResponse<'v1_billing_plans_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_billing_plans_retrieve'>, ApiError, OperationResponse<'v1_billing_plans_retrieve'>, QueryKey>({
    queryKey: ['v1_billing_plans_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_billing_plans_retrieve>>;
      return apiClient.call('v1_billing_plans_retrieve', createCallArgs<'v1_billing_plans_retrieve>(payload));
    },
    ...options,
  });
};

export type V1BillingPlansRetrieve2Args = Omit<OperationCallArgs<'v1_billing_plans_retrieve_2'>, 'signal'>;

export const useV1BillingPlansRetrieve2Query = (
  args: V1BillingPlansRetrieve2Args,
  options?: QueryOptions<'v1_billing_plans_retrieve_2', OperationResponse<'v1_billing_plans_retrieve_2'>>
) => {
  return useQuery<OperationResponse<'v1_billing_plans_retrieve_2'>, ApiError, OperationResponse<'v1_billing_plans_retrieve_2'>, QueryKey>({
    queryKey: ['v1_billing_plans_retrieve_2', args],
    queryFn: ({ signal }) => {
      const payload = { ...args, signal } as Partial<OperationCallArgs<'v1_billing_plans_retrieve_2>>;
      return apiClient.call('v1_billing_plans_retrieve_2', createCallArgs<'v1_billing_plans_retrieve_2>(payload));
    },
    ...options,
  });
};

export type V1BillingPortalCreateArgs = Omit<OperationCallArgs<'v1_billing_portal_create'>, 'signal'>;

export const useV1BillingPortalCreateMutation = (
  options?: MutationOptions<'v1_billing_portal_create', V1BillingPortalCreateArgs>
) => {
  return useMutation<OperationResponse<'v1_billing_portal_create'>, ApiError, V1BillingPortalCreateArgs>({
    mutationKey: ['v1_billing_portal_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v1_billing_portal_create>>;
      return apiClient.call('v1_billing_portal_create', createCallArgs<'v1_billing_portal_create'>(payload));
    },
    ...options,
  });
};

export type V1BillingWebhooksStripeCreateArgs = Omit<OperationCallArgs<'v1_billing_webhooks_stripe_create'>, 'signal'>;

export const useV1BillingWebhooksStripeCreateMutation = (
  options?: MutationOptions<'v1_billing_webhooks_stripe_create', V1BillingWebhooksStripeCreateArgs>
) => {
  return useMutation<OperationResponse<'v1_billing_webhooks_stripe_create'>, ApiError, V1BillingWebhooksStripeCreateArgs>({
    mutationKey: ['v1_billing_webhooks_stripe_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v1_billing_webhooks_stripe_create>>;
      return apiClient.call('v1_billing_webhooks_stripe_create', createCallArgs<'v1_billing_webhooks_stripe_create'>(payload));
    },
    ...options,
  });
};

export type V2BillingCheckoutCreateArgs = Omit<OperationCallArgs<'v2_billing_checkout_create'>, 'signal'>;

export const useV2BillingCheckoutCreateMutation = (
  options?: MutationOptions<'v2_billing_checkout_create', V2BillingCheckoutCreateArgs>
) => {
  return useMutation<OperationResponse<'v2_billing_checkout_create'>, ApiError, V2BillingCheckoutCreateArgs>({
    mutationKey: ['v2_billing_checkout_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v2_billing_checkout_create>>;
      return apiClient.call('v2_billing_checkout_create', createCallArgs<'v2_billing_checkout_create'>(payload));
    },
    ...options,
  });
};

export type V2BillingMeEntitlementsRetrieveArgs = Omit<OperationCallArgs<'v2_billing_me_entitlements_retrieve'>, 'signal'>;

export const useV2BillingMeEntitlementsRetrieveQuery = (
  args?: V2BillingMeEntitlementsRetrieveArgs,
  options?: QueryOptions<'v2_billing_me_entitlements_retrieve', OperationResponse<'v2_billing_me_entitlements_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_billing_me_entitlements_retrieve'>, ApiError, OperationResponse<'v2_billing_me_entitlements_retrieve'>, QueryKey>({
    queryKey: ['v2_billing_me_entitlements_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_billing_me_entitlements_retrieve>>;
      return apiClient.call('v2_billing_me_entitlements_retrieve', createCallArgs<'v2_billing_me_entitlements_retrieve>(payload));
    },
    ...options,
  });
};

export type V2BillingMeSubscriptionRetrieveArgs = Omit<OperationCallArgs<'v2_billing_me_subscription_retrieve'>, 'signal'>;

export const useV2BillingMeSubscriptionRetrieveQuery = (
  args?: V2BillingMeSubscriptionRetrieveArgs,
  options?: QueryOptions<'v2_billing_me_subscription_retrieve', OperationResponse<'v2_billing_me_subscription_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_billing_me_subscription_retrieve'>, ApiError, OperationResponse<'v2_billing_me_subscription_retrieve'>, QueryKey>({
    queryKey: ['v2_billing_me_subscription_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_billing_me_subscription_retrieve>>;
      return apiClient.call('v2_billing_me_subscription_retrieve', createCallArgs<'v2_billing_me_subscription_retrieve>(payload));
    },
    ...options,
  });
};

export type V2BillingMeUsageRetrieveArgs = Omit<OperationCallArgs<'v2_billing_me_usage_retrieve'>, 'signal'>;

export const useV2BillingMeUsageRetrieveQuery = (
  args?: V2BillingMeUsageRetrieveArgs,
  options?: QueryOptions<'v2_billing_me_usage_retrieve', OperationResponse<'v2_billing_me_usage_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_billing_me_usage_retrieve'>, ApiError, OperationResponse<'v2_billing_me_usage_retrieve'>, QueryKey>({
    queryKey: ['v2_billing_me_usage_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_billing_me_usage_retrieve>>;
      return apiClient.call('v2_billing_me_usage_retrieve', createCallArgs<'v2_billing_me_usage_retrieve>(payload));
    },
    ...options,
  });
};

export type V2BillingPlansRetrieveArgs = Omit<OperationCallArgs<'v2_billing_plans_retrieve'>, 'signal'>;

export const useV2BillingPlansRetrieveQuery = (
  args?: V2BillingPlansRetrieveArgs,
  options?: QueryOptions<'v2_billing_plans_retrieve', OperationResponse<'v2_billing_plans_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_billing_plans_retrieve'>, ApiError, OperationResponse<'v2_billing_plans_retrieve'>, QueryKey>({
    queryKey: ['v2_billing_plans_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_billing_plans_retrieve>>;
      return apiClient.call('v2_billing_plans_retrieve', createCallArgs<'v2_billing_plans_retrieve>(payload));
    },
    ...options,
  });
};

export type V2BillingPlansRetrieve2Args = Omit<OperationCallArgs<'v2_billing_plans_retrieve_2'>, 'signal'>;

export const useV2BillingPlansRetrieve2Query = (
  args: V2BillingPlansRetrieve2Args,
  options?: QueryOptions<'v2_billing_plans_retrieve_2', OperationResponse<'v2_billing_plans_retrieve_2'>>
) => {
  return useQuery<OperationResponse<'v2_billing_plans_retrieve_2'>, ApiError, OperationResponse<'v2_billing_plans_retrieve_2'>, QueryKey>({
    queryKey: ['v2_billing_plans_retrieve_2', args],
    queryFn: ({ signal }) => {
      const payload = { ...args, signal } as Partial<OperationCallArgs<'v2_billing_plans_retrieve_2>>;
      return apiClient.call('v2_billing_plans_retrieve_2', createCallArgs<'v2_billing_plans_retrieve_2>(payload));
    },
    ...options,
  });
};

export type V2BillingPortalCreateArgs = Omit<OperationCallArgs<'v2_billing_portal_create'>, 'signal'>;

export const useV2BillingPortalCreateMutation = (
  options?: MutationOptions<'v2_billing_portal_create', V2BillingPortalCreateArgs>
) => {
  return useMutation<OperationResponse<'v2_billing_portal_create'>, ApiError, V2BillingPortalCreateArgs>({
    mutationKey: ['v2_billing_portal_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v2_billing_portal_create>>;
      return apiClient.call('v2_billing_portal_create', createCallArgs<'v2_billing_portal_create'>(payload));
    },
    ...options,
  });
};

export type V2BillingWebhooksStripeCreateArgs = Omit<OperationCallArgs<'v2_billing_webhooks_stripe_create'>, 'signal'>;

export const useV2BillingWebhooksStripeCreateMutation = (
  options?: MutationOptions<'v2_billing_webhooks_stripe_create', V2BillingWebhooksStripeCreateArgs>
) => {
  return useMutation<OperationResponse<'v2_billing_webhooks_stripe_create'>, ApiError, V2BillingWebhooksStripeCreateArgs>({
    mutationKey: ['v2_billing_webhooks_stripe_create'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'v2_billing_webhooks_stripe_create>>;
      return apiClient.call('v2_billing_webhooks_stripe_create', createCallArgs<'v2_billing_webhooks_stripe_create'>(payload));
    },
    ...options,
  });
};
