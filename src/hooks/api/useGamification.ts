import { useMutation, useQuery, type QueryKey, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient, createCallArgs, type OperationCallArgs, type OperationResponse } from '@/lib/apiClient';
import type { OperationId } from '@/lib/api/operationMap';
import type { ApiError } from '@/lib/api/base';

type QueryOptions<Op extends OperationId, TData> = Omit<UseQueryOptions<OperationResponse<Op>, ApiError, TData, QueryKey>, 'queryKey' | 'queryFn'>;

type MutationOptions<Op extends OperationId, TVariables> = Omit<UseMutationOptions<OperationResponse<Op>, ApiError, TVariables>, 'mutationFn' | 'mutationKey'>;

export type V1GamificationAchievementsRetrieveArgs = Omit<OperationCallArgs<'v1_gamification_achievements_retrieve'>, 'signal'>;

export const useV1GamificationAchievementsRetrieveQuery = (
  args?: V1GamificationAchievementsRetrieveArgs,
  options?: QueryOptions<'v1_gamification_achievements_retrieve', OperationResponse<'v1_gamification_achievements_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_gamification_achievements_retrieve'>, ApiError, OperationResponse<'v1_gamification_achievements_retrieve'>, QueryKey>({
    queryKey: ['v1_gamification_achievements_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_gamification_achievements_retrieve'>>;
      return apiClient.call('v1_gamification_achievements_retrieve', createCallArgs<'v1_gamification_achievements_retrieve'>(payload));
    },
    ...options,
  });
};

export type V1GamificationBadgesRetrieveArgs = Omit<OperationCallArgs<'v1_gamification_badges_retrieve'>, 'signal'>;

export const useV1GamificationBadgesRetrieveQuery = (
  args?: V1GamificationBadgesRetrieveArgs,
  options?: QueryOptions<'v1_gamification_badges_retrieve', OperationResponse<'v1_gamification_badges_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_gamification_badges_retrieve'>, ApiError, OperationResponse<'v1_gamification_badges_retrieve'>, QueryKey>({
    queryKey: ['v1_gamification_badges_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_gamification_badges_retrieve'>>;
      return apiClient.call('v1_gamification_badges_retrieve', createCallArgs<'v1_gamification_badges_retrieve'>(payload));
    },
    ...options,
  });
};

export type V1GamificationDailyChallengesRetrieveArgs = Omit<OperationCallArgs<'v1_gamification_daily_challenges_retrieve'>, 'signal'>;

export const useV1GamificationDailyChallengesRetrieveQuery = (
  args?: V1GamificationDailyChallengesRetrieveArgs,
  options?: QueryOptions<'v1_gamification_daily_challenges_retrieve', OperationResponse<'v1_gamification_daily_challenges_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_gamification_daily_challenges_retrieve'>, ApiError, OperationResponse<'v1_gamification_daily_challenges_retrieve'>, QueryKey>({
    queryKey: ['v1_gamification_daily_challenges_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_gamification_daily_challenges_retrieve'>>;
      return apiClient.call('v1_gamification_daily_challenges_retrieve', createCallArgs<'v1_gamification_daily_challenges_retrieve'>(payload));
    },
    ...options,
  });
};

export type V1GamificationLeaderboardRetrieveArgs = Omit<OperationCallArgs<'v1_gamification_leaderboard_retrieve'>, 'signal'>;

export const useV1GamificationLeaderboardRetrieveQuery = (
  args?: V1GamificationLeaderboardRetrieveArgs,
  options?: QueryOptions<'v1_gamification_leaderboard_retrieve', OperationResponse<'v1_gamification_leaderboard_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_gamification_leaderboard_retrieve'>, ApiError, OperationResponse<'v1_gamification_leaderboard_retrieve'>, QueryKey>({
    queryKey: ['v1_gamification_leaderboard_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_gamification_leaderboard_retrieve'>>;
      return apiClient.call('v1_gamification_leaderboard_retrieve', createCallArgs<'v1_gamification_leaderboard_retrieve'>(payload));
    },
    ...options,
  });
};

export type V1GamificationStreakRetrieveArgs = Omit<OperationCallArgs<'v1_gamification_streak_retrieve'>, 'signal'>;

export const useV1GamificationStreakRetrieveQuery = (
  args?: V1GamificationStreakRetrieveArgs,
  options?: QueryOptions<'v1_gamification_streak_retrieve', OperationResponse<'v1_gamification_streak_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_gamification_streak_retrieve'>, ApiError, OperationResponse<'v1_gamification_streak_retrieve'>, QueryKey>({
    queryKey: ['v1_gamification_streak_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_gamification_streak_retrieve'>>;
      return apiClient.call('v1_gamification_streak_retrieve', createCallArgs<'v1_gamification_streak_retrieve'>(payload));
    },
    ...options,
  });
};

export type V1GamificationUserLevelRetrieveArgs = Omit<OperationCallArgs<'v1_gamification_user_level_retrieve'>, 'signal'>;

export const useV1GamificationUserLevelRetrieveQuery = (
  args?: V1GamificationUserLevelRetrieveArgs,
  options?: QueryOptions<'v1_gamification_user_level_retrieve', OperationResponse<'v1_gamification_user_level_retrieve'>>
) => {
  return useQuery<OperationResponse<'v1_gamification_user_level_retrieve'>, ApiError, OperationResponse<'v1_gamification_user_level_retrieve'>, QueryKey>({
    queryKey: ['v1_gamification_user_level_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v1_gamification_user_level_retrieve'>>;
      return apiClient.call('v1_gamification_user_level_retrieve', createCallArgs<'v1_gamification_user_level_retrieve'>(payload));
    },
    ...options,
  });
};

export type V2GamificationAchievementsRetrieveArgs = Omit<OperationCallArgs<'v2_gamification_achievements_retrieve'>, 'signal'>;

export const useV2GamificationAchievementsRetrieveQuery = (
  args?: V2GamificationAchievementsRetrieveArgs,
  options?: QueryOptions<'v2_gamification_achievements_retrieve', OperationResponse<'v2_gamification_achievements_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_gamification_achievements_retrieve'>, ApiError, OperationResponse<'v2_gamification_achievements_retrieve'>, QueryKey>({
    queryKey: ['v2_gamification_achievements_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_gamification_achievements_retrieve'>>;
      return apiClient.call('v2_gamification_achievements_retrieve', createCallArgs<'v2_gamification_achievements_retrieve'>(payload));
    },
    ...options,
  });
};

export type V2GamificationBadgesRetrieveArgs = Omit<OperationCallArgs<'v2_gamification_badges_retrieve'>, 'signal'>;

export const useV2GamificationBadgesRetrieveQuery = (
  args?: V2GamificationBadgesRetrieveArgs,
  options?: QueryOptions<'v2_gamification_badges_retrieve', OperationResponse<'v2_gamification_badges_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_gamification_badges_retrieve'>, ApiError, OperationResponse<'v2_gamification_badges_retrieve'>, QueryKey>({
    queryKey: ['v2_gamification_badges_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_gamification_badges_retrieve'>>;
      return apiClient.call('v2_gamification_badges_retrieve', createCallArgs<'v2_gamification_badges_retrieve'>(payload));
    },
    ...options,
  });
};

export type V2GamificationDailyChallengesRetrieveArgs = Omit<OperationCallArgs<'v2_gamification_daily_challenges_retrieve'>, 'signal'>;

export const useV2GamificationDailyChallengesRetrieveQuery = (
  args?: V2GamificationDailyChallengesRetrieveArgs,
  options?: QueryOptions<'v2_gamification_daily_challenges_retrieve', OperationResponse<'v2_gamification_daily_challenges_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_gamification_daily_challenges_retrieve'>, ApiError, OperationResponse<'v2_gamification_daily_challenges_retrieve'>, QueryKey>({
    queryKey: ['v2_gamification_daily_challenges_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_gamification_daily_challenges_retrieve'>>;
      return apiClient.call('v2_gamification_daily_challenges_retrieve', createCallArgs<'v2_gamification_daily_challenges_retrieve'>(payload));
    },
    ...options,
  });
};

export type V2GamificationLeaderboardRetrieveArgs = Omit<OperationCallArgs<'v2_gamification_leaderboard_retrieve'>, 'signal'>;

export const useV2GamificationLeaderboardRetrieveQuery = (
  args?: V2GamificationLeaderboardRetrieveArgs,
  options?: QueryOptions<'v2_gamification_leaderboard_retrieve', OperationResponse<'v2_gamification_leaderboard_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_gamification_leaderboard_retrieve'>, ApiError, OperationResponse<'v2_gamification_leaderboard_retrieve'>, QueryKey>({
    queryKey: ['v2_gamification_leaderboard_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_gamification_leaderboard_retrieve'>>;
      return apiClient.call('v2_gamification_leaderboard_retrieve', createCallArgs<'v2_gamification_leaderboard_retrieve'>(payload));
    },
    ...options,
  });
};

export type V2GamificationStreakRetrieveArgs = Omit<OperationCallArgs<'v2_gamification_streak_retrieve'>, 'signal'>;

export const useV2GamificationStreakRetrieveQuery = (
  args?: V2GamificationStreakRetrieveArgs,
  options?: QueryOptions<'v2_gamification_streak_retrieve', OperationResponse<'v2_gamification_streak_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_gamification_streak_retrieve'>, ApiError, OperationResponse<'v2_gamification_streak_retrieve'>, QueryKey>({
    queryKey: ['v2_gamification_streak_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_gamification_streak_retrieve'>>;
      return apiClient.call('v2_gamification_streak_retrieve', createCallArgs<'v2_gamification_streak_retrieve'>(payload));
    },
    ...options,
  });
};

export type V2GamificationUserLevelRetrieveArgs = Omit<OperationCallArgs<'v2_gamification_user_level_retrieve'>, 'signal'>;

export const useV2GamificationUserLevelRetrieveQuery = (
  args?: V2GamificationUserLevelRetrieveArgs,
  options?: QueryOptions<'v2_gamification_user_level_retrieve', OperationResponse<'v2_gamification_user_level_retrieve'>>
) => {
  return useQuery<OperationResponse<'v2_gamification_user_level_retrieve'>, ApiError, OperationResponse<'v2_gamification_user_level_retrieve'>, QueryKey>({
    queryKey: ['v2_gamification_user_level_retrieve', (args ?? null)],
    queryFn: ({ signal }) => {
      const payload = { ...(args ?? {}), signal } as Partial<OperationCallArgs<'v2_gamification_user_level_retrieve'>>;
      return apiClient.call('v2_gamification_user_level_retrieve', createCallArgs<'v2_gamification_user_level_retrieve'>(payload));
    },
    ...options,
  });
};
