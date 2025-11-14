'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Download,
  RefreshCw,
  PieChart,
  Activity,
  Clock
} from 'lucide-react';
import type { DashboardData } from '@/lib/types';

interface UserInsights {
  user_id: string;
  total_sessions: number;
  avg_session_duration: number;
  favorite_categories: string[];
  most_used_templates: Array<{
    template_id: string;
    template_name: string;
    usage_count: number;
  }>;
  activity_by_hour: Array<{
    hour: number;
    activity_count: number;
  }>;
}

interface TemplateAnalytics {
  template_id: string;
  template_name: string;
  category: string;
  total_usage: number;
  avg_rating: number;
  success_rate: number;
  avg_completion_time: number;
  trends: {
    daily_usage: Array<{
      date: string;
      usage_count: number;
    }>;
  };
}

export default function AnalyticsView() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [userInsights, setUserInsights] = useState<UserInsights | null>(null);
  const [templateAnalytics, setTemplateAnalytics] = useState<TemplateAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'templates'>('overview');
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    console.log('Analytics page viewed');
    loadAnalyticsData();
  }, []);

  useEffect(() => {
    if (dateRange) {
      refreshData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockDashboard = {
        total_templates_used: 42,
        total_renders: 156,
        favorite_categories: ['Business Communication', 'Marketing', 'Technical'],
        recent_activity: [
          {
            template_name: 'Professional Follow-up Email',
            used_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            category: 'Business Communication'
          },
          {
            template_name: 'Product Launch Marketing Copy',
            used_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            category: 'Marketing'
          },
          {
            template_name: 'API Documentation Template',
            used_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
            category: 'Technical'
          }
        ],
        gamification: {
          level: 5,
          experience_points: 2450,
          daily_streak: 7,
          achievements_unlocked: 12,
          badges_earned: 8,
          rank: 'Expert',
          next_level_xp: 500
        }
      };

      const mockUserInsights = {
        user_id: 'user123',
        total_sessions: 28,
        avg_session_duration: 840, // 14 minutes in seconds
        favorite_categories: ['Business Communication', 'Marketing', 'Technical'],
        most_used_templates: [
          {
            template_id: 'email-follow-up',
            template_name: 'Professional Follow-up Email',
            usage_count: 12
          },
          {
            template_id: 'marketing-copy',
            template_name: 'Product Launch Marketing Copy',
            usage_count: 8
          },
          {
            template_id: 'code-documentation',
            template_name: 'API Documentation Template',
            usage_count: 6
          }
        ],
        activity_by_hour: [
          { hour: 9, activity_count: 12 },
          { hour: 10, activity_count: 18 },
          { hour: 11, activity_count: 15 },
          { hour: 14, activity_count: 20 },
          { hour: 15, activity_count: 16 },
          { hour: 16, activity_count: 10 }
        ]
      };

      const mockTemplateAnalytics = [
        {
          template_id: 'email-follow-up',
          template_name: 'Professional Follow-up Email',
          category: 'Business Communication',
          total_usage: 45,
          avg_rating: 4.8,
          success_rate: 0.94,
          avg_completion_time: 1200,
          trends: {
            daily_usage: [
              { date: '2024-08-10', usage_count: 5 },
              { date: '2024-08-11', usage_count: 8 },
              { date: '2024-08-12', usage_count: 6 },
              { date: '2024-08-13', usage_count: 12 },
              { date: '2024-08-14', usage_count: 9 },
              { date: '2024-08-15', usage_count: 5 }
            ]
          }
        },
        {
          template_id: 'marketing-copy',
          template_name: 'Product Launch Marketing Copy',
          category: 'Marketing',
          total_usage: 32,
          avg_rating: 4.9,
          success_rate: 0.97,
          avg_completion_time: 1800,
          trends: {
            daily_usage: [
              { date: '2024-08-10', usage_count: 3 },
              { date: '2024-08-11', usage_count: 6 },
              { date: '2024-08-12', usage_count: 4 },
              { date: '2024-08-13', usage_count: 8 },
              { date: '2024-08-14', usage_count: 7 },
              { date: '2024-08-15', usage_count: 4 }
            ]
          }
        }
      ];

      setDashboardData(mockDashboard);
      setUserInsights(mockUserInsights);
      setTemplateAnalytics(mockTemplateAnalytics);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadAnalyticsData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const exportData = () => {
    const data = {
      dashboard: dashboardData,
      userInsights,
      templateAnalytics,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptcord-analytics-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-bg-secondary rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm">Total Templates Used</p>
              <p className="text-2xl font-bold text-text-primary">
                {dashboardData?.total_templates_used || 0}
              </p>
            </div>
            <div className="p-3 bg-brand/10 rounded-lg">
              <Target className="w-6 h-6 text-brand" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green mr-1" />
            <span className="text-green">+12% from last week</span>
          </div>
        </div>

        <div className="bg-bg-secondary rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm">Total Renders</p>
              <p className="text-2xl font-bold text-text-primary">
                {dashboardData?.total_renders || 0}
              </p>
            </div>
            <div className="p-3 bg-green/10 rounded-lg">
              <Activity className="w-6 h-6 text-green" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green mr-1" />
            <span className="text-green">+8% from last week</span>
          </div>
        </div>

        <div className="bg-bg-secondary rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm">Avg. Session Time</p>
              <p className="text-2xl font-bold text-text-primary">
                {userInsights?.avg_session_duration 
                  ? `${Math.round(userInsights.avg_session_duration / 60)}m`
                  : '0m'
                }
              </p>
            </div>
            <div className="p-3 bg-yellow/10 rounded-lg">
              <Clock className="w-6 h-6 text-yellow" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green mr-1" />
            <span className="text-green">+5% from last week</span>
          </div>
        </div>

        <div className="bg-bg-secondary rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-text-primary">94%</p>
            </div>
            <div className="p-3 bg-green/10 rounded-lg">
              <PieChart className="w-6 h-6 text-green" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green mr-1" />
            <span className="text-green">+2% from last week</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {dashboardData?.recent_activity && (
        <div className="bg-bg-secondary rounded-lg border border-border">
          <div className="p-6 border-b border-border">
            <h3 className="text-text-primary font-medium">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData.recent_activity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-brand rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-text-primary text-sm">
                      Used template: <span className="font-medium">{activity.template_name}</span>
                    </p>
                    <p className="text-text-muted text-xs">
                      {activity.category} • {new Date(activity.used_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderUserInsights = () => (
    <div className="space-y-6">
      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-bg-secondary rounded-lg p-6 border border-border">
          <h3 className="text-text-primary font-medium mb-4">Total Sessions</h3>
          <p className="text-3xl font-bold text-brand">
            {userInsights?.total_sessions || 0}
          </p>
        </div>

        <div className="bg-bg-secondary rounded-lg p-6 border border-border">
          <h3 className="text-text-primary font-medium mb-4">Avg. Duration</h3>
          <p className="text-3xl font-bold text-green">
            {userInsights?.avg_session_duration 
              ? `${Math.round(userInsights.avg_session_duration / 60)}m`
              : '0m'
            }
          </p>
        </div>

        <div className="bg-bg-secondary rounded-lg p-6 border border-border">
          <h3 className="text-text-primary font-medium mb-4">Peak Activity</h3>
          <p className="text-3xl font-bold text-yellow">
            {userInsights?.activity_by_hour 
              ? `${userInsights.activity_by_hour.reduce((max, curr) => 
                  curr.activity_count > max.activity_count ? curr : max
                ).hour}:00`
              : '12:00'
            }
          </p>
        </div>
      </div>

      {/* Favorite Categories */}
      {userInsights?.favorite_categories && (
        <div className="bg-bg-secondary rounded-lg border border-border">
          <div className="p-6 border-b border-border">
            <h3 className="text-text-primary font-medium">Favorite Categories</h3>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2">
              {userInsights.favorite_categories.map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-brand/10 text-brand rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Most Used Templates */}
      {userInsights?.most_used_templates && (
        <div className="bg-bg-secondary rounded-lg border border-border">
          <div className="p-6 border-b border-border">
            <h3 className="text-text-primary font-medium">Most Used Templates</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {userInsights.most_used_templates.map((template) => (
                <div key={template.template_id} className="flex items-center justify-between">
                  <div>
                    <p className="text-text-primary font-medium">{template.template_name}</p>
                    <p className="text-text-muted text-sm">Template ID: {template.template_id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-text-primary font-medium">{template.usage_count}</p>
                    <p className="text-text-muted text-sm">uses</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTemplateAnalytics = () => (
    <div className="space-y-6">
      {templateAnalytics.map((template) => (
        <div key={template.template_id} className="bg-bg-secondary rounded-lg border border-border">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-text-primary font-medium">{template.template_name}</h3>
                <p className="text-text-muted text-sm">{template.category}</p>
              </div>
              <div className="text-right">
                <p className="text-text-primary font-bold">{template.total_usage}</p>
                <p className="text-text-muted text-sm">total uses</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-text-muted text-sm">Average Rating</p>
                <p className="text-xl font-bold text-yellow">
                  {template.avg_rating.toFixed(1)}/5
                </p>
              </div>
              
              <div>
                <p className="text-text-muted text-sm">Success Rate</p>
                <p className="text-xl font-bold text-green">
                  {(template.success_rate * 100).toFixed(1)}%
                </p>
              </div>
              
              <div>
                <p className="text-text-muted text-sm">Avg. Completion</p>
                <p className="text-xl font-bold text-brand">
                  {Math.round(template.avg_completion_time / 1000)}s
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {templateAnalytics.length === 0 && (
        <div className="bg-bg-secondary rounded-lg border border-border p-12 text-center">
          <BarChart3 className="w-12 h-12 text-interactive-muted mx-auto mb-4" />
          <h3 className="text-text-primary font-medium mb-2">No Analytics Data</h3>
          <p className="text-text-muted">Template analytics will appear here once you start using templates.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex-1 bg-bg-primary">
      {/* Header */}
      <div className="h-12 bg-bg-primary border-b border-border px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-brand" />
          <h1 className="text-text-primary font-semibold">Analytics Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1.5 bg-bg-secondary border border-border rounded text-text-primary text-sm"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="p-2 text-interactive-normal hover:text-interactive-hover hover:bg-interactive-hover/10 rounded transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={exportData}
            className="p-2 text-interactive-normal hover:text-interactive-hover hover:bg-interactive-hover/10 rounded transition-colors"
            title="Export data"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-bg-secondary">
        <div className="px-4 flex space-x-6">
          {[
            { id: 'overview', label: 'Overview', icon: PieChart },
            { id: 'insights', label: 'User Insights', icon: Users },
            { id: 'templates', label: 'Template Analytics', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'insights' | 'templates')}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-brand text-brand'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-interactive-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'insights' && renderUserInsights()}
              {activeTab === 'templates' && renderTemplateAnalytics()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}