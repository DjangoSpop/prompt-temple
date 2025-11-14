import { BaseApiClient } from './base';
import type { components } from '../types/api';

// Type-safe API client for Prompt Temple endpoints
export class PromptTempleApiClient extends BaseApiClient {
  constructor() {
    super('https://api.prompt-temple.com');
  }

  // Health endpoint
  async getHealth(): Promise<components['schemas']['Health']> {
    return this.request('/health/');
  }

  // Templates endpoints
  async getTemplates(params?: {
    search?: string;
    category?: number;
    author?: string;
    is_public?: boolean;
    is_featured?: boolean;
    ordering?: string;
    page?: number;
    page_size?: number;
  }): Promise<components['schemas']['PaginatedTemplateListList']> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = `/api/v2/templates/${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async createTemplate(template: components['schemas']['TemplateWriteRequest']): Promise<components['schemas']['TemplateList']> {
    return this.request('/api/v2/templates/', {
      method: 'POST',
      data: template,
    });
  }

  async getTemplate(id: string): Promise<components['schemas']['Template']> {
    return this.request(`/api/v2/templates/${id}/`);
  }

  async updateTemplate(id: string, template: Partial<components['schemas']['TemplateWriteRequest']>): Promise<components['schemas']['TemplateList']> {
    return this.request(`/api/v2/templates/${id}/`, {
      method: 'PUT',
      data: template,
    });
  }

  async deleteTemplate(id: string): Promise<void> {
    return this.request(`/api/v2/templates/${id}/`, {
      method: 'DELETE',
    });
  }

  async getTemplateVersions(id: string): Promise<components['schemas']['PaginatedTemplateVersionListList']> {
    return this.request(`/api/v2/templates/${id}/versions/`);
  }

  async createTemplateVersion(id: string, version: components['schemas']['TemplateVersionRequest']): Promise<components['schemas']['TemplateVersionList']> {
    return this.request(`/api/v2/templates/${id}/versions/`, {
      method: 'POST',
      data: version,
    });
  }

  async getTemplateUsage(id: string): Promise<components['schemas']['PaginatedTemplateUsageListList']> {
    return this.request(`/api/v2/templates/${id}/usage/`);
  }

  async recordTemplateUsage(id: string): Promise<components['schemas']['TemplateUsage']> {
    return this.request(`/api/v2/templates/${id}/use/`, {
      method: 'POST',
    });
  }

  async getTemplateRatings(id: string): Promise<components['schemas']['PaginatedTemplateRatingListList']> {
    return this.request(`/api/v2/templates/${id}/ratings/`);
  }

  async rateTemplate(id: string, rating: components['schemas']['TemplateRatingRequest']): Promise<components['schemas']['TemplateRating']> {
    return this.request(`/api/v2/templates/${id}/rate/`, {
      method: 'POST',
      data: rating,
    });
  }

  async getTemplateComments(id: string): Promise<components['schemas']['PaginatedTemplateCommentListList']> {
    return this.request(`/api/v2/templates/${id}/comments/`);
  }

  async addTemplateComment(id: string, comment: components['schemas']['TemplateCommentRequest']): Promise<components['schemas']['TemplateComment']> {
    return this.request(`/api/v2/templates/${id}/comment/`, {
      method: 'POST',
      data: comment,
    });
  }

  async renderTemplate(id: string, variables: Record<string, any>): Promise<components['schemas']['TemplateRenderResponse']> {
    return this.request(`/api/v2/templates/${id}/render/`, {
      method: 'POST',
      data: { variables },
    });
  }

  // Categories endpoints
  async getCategories(): Promise<components['schemas']['PaginatedCategoryListList']> {
    return this.request('/api/v2/categories/');
  }

  async createCategory(category: components['schemas']['CategoryRequest']): Promise<components['schemas']['Category']> {
    return this.request('/api/v2/categories/', {
      method: 'POST',
      data: category,
    });
  }

  async getCategory(id: string): Promise<components['schemas']['Category']> {
    return this.request(`/api/v2/categories/${id}/`);
  }

  async updateCategory(id: string, category: Partial<components['schemas']['CategoryRequest']>): Promise<components['schemas']['Category']> {
    return this.request(`/api/v2/categories/${id}/`, {
      method: 'PUT',
      data: category,
    });
  }

  async deleteCategory(id: string): Promise<void> {
    return this.request(`/api/v2/categories/${id}/`, {
      method: 'DELETE',
    });
  }

  // Orchestrator endpoints
  async assessPrompt(request: components['schemas']['PromptAssessmentRequest']): Promise<components['schemas']['PromptAssessmentResponse']> {
    return this.request('/api/v2/orchestrator/assess/', {
      method: 'POST',
      data: request,
    });
  }

  async optimizePrompt(request: components['schemas']['PromptOptimizationRequest']): Promise<components['schemas']['PromptOptimizationResponse']> {
    return this.request('/api/v2/orchestrator/optimize/', {
      method: 'POST',
      data: request,
    });
  }

  async generatePrompt(request: components['schemas']['PromptGenerationRequest']): Promise<components['schemas']['PromptGenerationResponse']> {
    return this.request('/api/v2/orchestrator/generate/', {
      method: 'POST',
      data: request,
    });
  }

  async generateTemplate(request: components['schemas']['TemplateGenerationRequest']): Promise<components['schemas']['TemplateGenerationResponse']> {
    return this.request('/api/v2/orchestrator/generate-template/', {
      method: 'POST',
      data: request,
    });
  }

  async analyzeUsage(): Promise<components['schemas']['UsageAnalysisResponse']> {
    return this.request('/api/v2/orchestrator/analyze-usage/');
  }

  async getTrendingPrompts(): Promise<components['schemas']['TrendingPromptsResponse']> {
    return this.request('/api/v2/orchestrator/trending/');
  }

  async executeCompletion(request: components['schemas']['CompletionRequest']): Promise<components['schemas']['CompletionResponse']> {
    return this.request('/api/v2/orchestrator/complete/', {
      method: 'POST',
      data: request,
    });
  }

  // User profile endpoints
  async getProfile(): Promise<components['schemas']['UserProfile']> {
    return this.request('/api/v2/auth/profile/');
  }

  async updateProfile(profile: Partial<components['schemas']['UserProfileRequest']>): Promise<components['schemas']['UserProfile']> {
    return this.request('/api/v2/auth/profile/', {
      method: 'PUT',
      data: profile,
    });
  }

  async changePassword(request: components['schemas']['ChangePasswordRequest']): Promise<components['schemas']['ChangePasswordResponse']> {
    return this.request('/api/v2/auth/change-password/', {
      method: 'POST',
      data: request,
    });
  }

  // Authentication endpoints
  async login(credentials: components['schemas']['LoginRequest']): Promise<components['schemas']['LoginResponse']> {
    const response = await this.request('/api/v2/auth/login/', {
      method: 'POST',
      data: credentials,
    });

    // Save tokens after successful login
    if (response.access && response.refresh) {
      this.saveTokensToStorage({
        access: response.access,
        refresh: response.refresh,
      });
      this.emitEvent('login', response);
    }

    return response;
  }

  async register(userData: components['schemas']['RegisterRequest']): Promise<components['schemas']['RegisterResponse']> {
    const response = await this.request('/api/v2/auth/register/', {
      method: 'POST',
      data: userData,
    });

    // Save tokens after successful registration
    if (response.access && response.refresh) {
      this.saveTokensToStorage({
        access: response.access,
        refresh: response.refresh,
      });
      this.emitEvent('login', response);
    }

    return response;
  }

  async refreshToken(refreshToken: string): Promise<components['schemas']['RefreshResponse']> {
    return this.request('/api/v2/auth/refresh/', {
      method: 'POST',
      data: { refresh: refreshToken },
    });
  }

  async logout(): Promise<void> {
    try {
      await this.request('/api/v2/auth/logout/', {
        method: 'POST',
      });
    } finally {
      this.clearTokens();
    }
  }

  // Billing endpoints (if available)
  async getSubscription(): Promise<components['schemas']['SubscriptionInfo']> {
    return this.request('/api/v2/billing/subscription/');
  }

  async getUsage(): Promise<components['schemas']['UsageInfo']> {
    return this.request('/api/v2/billing/usage/');
  }

  async getInvoices(): Promise<components['schemas']['PaginatedInvoiceListList']> {
    return this.request('/api/v2/billing/invoices/');
  }

  // Analytics endpoints
  async getAnalytics(params?: {
    start_date?: string;
    end_date?: string;
    granularity?: 'day' | 'week' | 'month';
  }): Promise<components['schemas']['AnalyticsResponse']> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = `/api/v2/analytics/${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async trackEvent(event: components['schemas']['AnalyticsEventRequest']): Promise<void> {
    return this.request('/api/v2/analytics/track/', {
      method: 'POST',
      data: event,
    });
  }

  // Gamification endpoints
  async getAchievements(): Promise<components['schemas']['PaginatedAchievementListList']> {
    return this.request('/api/v2/gamification/achievements/');
  }

  async getUserAchievements(): Promise<components['schemas']['PaginatedUserAchievementListList']> {
    return this.request('/api/v2/gamification/user-achievements/');
  }

  async getLeaderboard(category?: string): Promise<components['schemas']['LeaderboardResponse']> {
    const endpoint = category 
      ? `/api/v2/gamification/leaderboard/?category=${encodeURIComponent(category)}`
      : '/api/v2/gamification/leaderboard/';
    
    return this.request(endpoint);
  }

  async updateXP(xp: number): Promise<components['schemas']['XPUpdateResponse']> {
    return this.request('/api/v2/gamification/xp/', {
      method: 'POST',
      data: { xp },
    });
  }

  // Search endpoints
  async searchGlobal(query: string, filters?: {
    type?: 'template' | 'category' | 'user';
    category?: string;
    author?: string;
  }): Promise<components['schemas']['GlobalSearchResponse']> {
    const params = new URLSearchParams({ q: query });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    return this.request(`/api/v2/search/?${params.toString()}`);
  }

  // Team/Organization endpoints (if available)
  async getTeams(): Promise<components['schemas']['PaginatedTeamListList']> {
    return this.request('/api/v2/teams/');
  }

  async createTeam(team: components['schemas']['TeamRequest']): Promise<components['schemas']['Team']> {
    return this.request('/api/v2/teams/', {
      method: 'POST',
      data: team,
    });
  }

  async getTeam(id: string): Promise<components['schemas']['Team']> {
    return this.request(`/api/v2/teams/${id}/`);
  }

  async inviteTeamMember(teamId: string, invitation: components['schemas']['TeamInvitationRequest']): Promise<components['schemas']['TeamInvitation']> {
    return this.request(`/api/v2/teams/${teamId}/invite/`, {
      method: 'POST',
      data: invitation,
    });
  }

  // Webhooks endpoints (if available)
  async getWebhooks(): Promise<components['schemas']['PaginatedWebhookListList']> {
    return this.request('/api/v2/webhooks/');
  }

  async createWebhook(webhook: components['schemas']['WebhookRequest']): Promise<components['schemas']['Webhook']> {
    return this.request('/api/v2/webhooks/', {
      method: 'POST',
      data: webhook,
    });
  }

  // Admin endpoints (if available)
  async getSystemStats(): Promise<components['schemas']['SystemStatsResponse']> {
    return this.request('/api/v2/admin/stats/');
  }

  async moderateContent(contentId: string, action: 'approve' | 'reject' | 'flag'): Promise<void> {
    return this.request(`/api/v2/admin/moderate/${contentId}/`, {
      method: 'POST',
      data: { action },
    });
  }
}

// Export singleton instance
export const promptTempleApi = new PromptTempleApiClient();