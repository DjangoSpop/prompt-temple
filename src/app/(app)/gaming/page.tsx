/**
 * Gaming & Achievements Page
 * Gamification features, leaderboards, and achievement tracking
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Trophy,
  Star,
  Target,
  Users,
  Award,
  Flame,
  Crown,
  Medal,
  Zap,
  BookOpen,
  MessageSquare,
  Clock,
  Bell
} from 'lucide-react';
import { useGamification } from '@/lib/hooks/useGamification';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'usage' | 'optimization' | 'social' | 'streak' | 'milestone';
  points: number;
  is_earned: boolean;
  earned_at?: string;
  progress?: number;
  max_progress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  points: number;
  level: number;
  streak: number;
  achievements_count: number;
}

interface UserStats {
  level: number;
  total_points: number;
  points_to_next_level: number;
  current_level_points: number;
  next_level_points: number;
  current_streak: number;
  longest_streak: number;
  achievements_earned: number;
  total_achievements: number;
  rank_position: number;
  percentile: number;
}

// Mock data - replace with actual API calls
const mockUserStats: UserStats = {
  level: 12,
  total_points: 3450,
  points_to_next_level: 150,
  current_level_points: 3450,
  next_level_points: 3600,
  current_streak: 7,
  longest_streak: 15,
  achievements_earned: 18,
  total_achievements: 35,
  rank_position: 47,
  percentile: 78
};

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Complete your first prompt optimization',
    icon: '🎯',
    category: 'milestone',
    points: 50,
    is_earned: true,
    earned_at: '2024-01-10T10:00:00Z',
    rarity: 'common'
  },
  {
    id: '2',
    title: 'RAG Master',
    description: 'Use RAG Deep mode 10 times',
    icon: '🧠',
    category: 'usage',
    points: 200,
    is_earned: true,
    earned_at: '2024-01-15T14:30:00Z',
    rarity: 'rare',
    progress: 10,
    max_progress: 10
  },
  {
    id: '3',
    title: 'Streak Champion',
    description: 'Maintain a 30-day activity streak',
    icon: '🔥',
    category: 'streak',
    points: 500,
    is_earned: false,
    rarity: 'epic',
    progress: 7,
    max_progress: 30
  },
  {
    id: '4',
    title: 'Knowledge Seeker',
    description: 'Generate 1000 citations through RAG',
    icon: '📚',
    category: 'usage',
    points: 300,
    is_earned: false,
    rarity: 'rare',
    progress: 234,
    max_progress: 1000
  }
];

const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    user: { id: '1', name: 'Sarah Chen' },
    points: 8750,
    level: 25,
    streak: 45,
    achievements_count: 28
  },
  {
    rank: 2,
    user: { id: '2', name: 'Alex Rodriguez' },
    points: 7320,
    level: 22,
    streak: 12,
    achievements_count: 25
  },
  {
    rank: 47, // Current user
    user: { id: 'current', name: 'You' },
    points: 3450,
    level: 12,
    streak: 7,
    achievements_count: 18
  }
];

export default function GamingPage() {
  const { data: _, isLoading } = useGamification();

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'rare':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'epic':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'legendary':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'usage':
        return <Zap className="h-4 w-4" />;
      case 'optimization':
        return <Target className="h-4 w-4" />;
      case 'social':
        return <Users className="h-4 w-4" />;
      case 'streak':
        return <Flame className="h-4 w-4" />;
      case 'milestone':
        return <Award className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank <= 3) return <Medal className="h-5 w-5 text-gray-400" />;
    return <Trophy className="h-4 w-4 text-gray-400" />;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-6">
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gaming Hub</h1>
          <p className="text-gray-600 mt-1">
            Track your progress, earn achievements, and compete with others
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Crown className="h-3 w-3 mr-1" />
            Level {mockUserStats.level}
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Star className="h-3 w-3 mr-1" />
            {mockUserStats.total_points.toLocaleString()} points
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {mockUserStats.level}
                </div>
                <div className="text-sm text-gray-600">Current Level</div>
                <Progress 
                  value={(mockUserStats.current_level_points / mockUserStats.next_level_points) * 100} 
                  className="mt-2 h-2" 
                />
                <div className="text-xs text-gray-500 mt-1">
                  {mockUserStats.points_to_next_level} to next level
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  #{mockUserStats.rank_position}
                </div>
                <div className="text-sm text-gray-600">Global Rank</div>
                <div className="text-xs text-gray-500 mt-1">
                  Top {mockUserStats.percentile}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {mockUserStats.current_streak}
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                  <Flame className="h-3 w-3" />
                  Day Streak
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Best: {mockUserStats.longest_streak} days
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {mockUserStats.achievements_earned}/{mockUserStats.total_achievements}
                </div>
                <div className="text-sm text-gray-600">Achievements</div>
                <Progress 
                  value={(mockUserStats.achievements_earned / mockUserStats.total_achievements) * 100} 
                  className="mt-2 h-2" 
                />
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="achievements" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
            </TabsList>

            <TabsContent value="achievements" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockAchievements.map(achievement => (
                  <Card 
                    key={achievement.id}
                    className={`transition-all duration-200 ${
                      achievement.is_earned 
                        ? 'border-green-200 bg-green-50/50' 
                        : 'hover:shadow-md'
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div>
                            <h3 className="font-medium text-sm flex items-center gap-2">
                              {achievement.title}
                              {achievement.is_earned && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                  Earned
                                </Badge>
                              )}
                            </h3>
                            <p className="text-xs text-gray-600 mt-1">
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <Badge 
                            variant="outline" 
                            className={getRarityColor(achievement.rarity)}
                          >
                            {achievement.rarity}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {achievement.progress !== undefined && achievement.max_progress && (
                          <div>
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{achievement.progress}/{achievement.max_progress}</span>
                            </div>
                            <Progress 
                              value={(achievement.progress / achievement.max_progress) * 100}
                              className="h-2"
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            {getCategoryIcon(achievement.category)}
                            <span className="capitalize">{achievement.category}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              {achievement.points} pts
                            </Badge>
                            {achievement.earned_at && (
                              <span className="text-xs text-gray-500">
                                {formatDate(achievement.earned_at)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Global Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockLeaderboard.map(entry => (
                      <div 
                        key={entry.user.id}
                        className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                          entry.user.id === 'current' 
                            ? 'bg-blue-50 border border-blue-200' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {getRankIcon(entry.rank)}
                            <span className="font-bold text-lg">
                              #{entry.rank}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {getUserInitials(entry.user.name)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-sm">{entry.user.name}</div>
                              <div className="text-xs text-gray-500">
                                Level {entry.level} • {entry.achievements_count} achievements
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-lg">
                            {entry.points.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Flame className="h-3 w-3" />
                            {entry.streak} streak
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="challenges" className="space-y-6">
              <div className="text-center py-12">
                <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Weekly Challenges</h3>
                <p className="text-gray-600 mb-4">
                  New challenges will be available soon! Check back later.
                </p>
                <Button variant="outline">
                  <Bell className="h-4 w-4 mr-2" />
                  Notify Me
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-lg">🎯</div>
                    <span>First Steps</span>
                  </div>
                  <span className="text-xs text-gray-500">2h ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-lg">🧠</div>
                    <span>RAG Master</span>
                  </div>
                  <span className="text-xs text-gray-500">1d ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Gained 50 points</span>
                  </div>
                  <span className="text-xs text-gray-500">2d ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">This Week</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Conversations</span>
                </div>
                <span className="font-bold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Optimizations</span>
                </div>
                <span className="font-bold">8</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Citations</span>
                </div>
                <span className="font-bold">24</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Points Earned</span>
                </div>
                <span className="font-bold">285</span>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pro Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-2">
              <p>💡 Use RAG modes daily to maintain your streak</p>
              <p>🎯 Complete achievements for bonus points</p>
              <p>🏆 Check the leaderboard weekly to track progress</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
