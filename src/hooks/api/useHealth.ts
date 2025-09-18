import { useMutation, useQuery, type QueryKey, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient, createCallArgs, type OperationCallArgs, type OperationResponse } from '@/lib/apiClient';
import type { OperationId } from '@/lib/api/operationMap';
import type { ApiError } from '@/lib/api/base';

type QueryOptions<Op extends OperationId, TData> = Omit<UseQueryOptions<OperationResponse<Op>, ApiError, TData, QueryKey>, 'queryKey' | 'queryFn'>;

type MutationOptions<Op extends OperationId, TVariables> = Omit<UseMutationOptions<OperationResponse<Op>, ApiError, TVariables>, 'mutationFn' | 'mutationKey'>;

export type HealthRetrieveArgs = Omit<OperationCallArgs<'health_retrieve'>, 'signal'>;

export const useHealthRetrieveQuery = (
  args?: HealthRetrieveArgs,
  options?: QueryOptions<'health_retrieve', OperationResponse<'health_retrieve'>>
) => {
  return useQuery<OperationResponse<'health_retrieve'>, ApiError, OperationResponse<'health_retrieve'>, QueryKey>({
    queryKey: ['health_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'health_retrieve>>;
      return apiClient.call('health_retrieve', createCallArgs<'health_retrieve>(payload));
    },
    ...options,
  });
};
