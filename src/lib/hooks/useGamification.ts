import { useQuery } from '@tanstack/react-query';
import { gamificationService } from '../api/gamification';

export const useAchievements = () => {
  return useQuery({
    queryKey: ['gamification', 'achievements'],
    queryFn: () => gamificationService.getAchievements(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBadges = () => {
  return useQuery({
    queryKey: ['gamification', 'badges'],
    queryFn: () => gamificationService.getBadges(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLeaderboard = (limit?: number) => {
  return useQuery({
    queryKey: ['gamification', 'leaderboard', limit],
    queryFn: () => gamificationService.getLeaderboard(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useDailyChallenges = () => {
  return useQuery({
    queryKey: ['gamification', 'daily-challenges'],
    queryFn: () => gamificationService.getDailyChallenges(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 60 * 60 * 1000, // Refetch every hour
  });
};

export const useUserLevel = () => {
  return useQuery({
    queryKey: ['gamification', 'user-level'],
    queryFn: () => gamificationService.getUserLevel(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useStreak = () => {
  return useQuery({
    queryKey: ['gamification', 'streak'],
    queryFn: () => gamificationService.getStreak(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Backwards-compatible aggregator used by Gaming page
export const useGamification = () => {
  const achievements = useAchievements();
  const badges = useBadges();
  const leaderboard = useLeaderboard();
  const userLevel = useUserLevel();
  const streak = useStreak();

  const isLoading =
    achievements.isLoading ||
    badges.isLoading ||
    leaderboard.isLoading ||
    userLevel.isLoading ||
    streak.isLoading;

  return {
    data: {
      achievements: achievements.data,
      badges: badges.data,
      leaderboard: leaderboard.data,
      userLevel: userLevel.data,
      streak: streak.data,
    },
    isLoading,
  } as const;
};
