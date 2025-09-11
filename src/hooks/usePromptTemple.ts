'use client';

import { useState, useEffect, useCallback } from 'react';
import { promptTempleApi } from '@/lib/api/prompt-temple';
import { promptCraftIntegration } from '@/lib/services/promptcraft-integration';
import type { components } from '@/lib/types/api';

type TemplateList = components['schemas']['TemplateList'];
type Template = components['schemas']['Template'];
type UserProfile = components['schemas']['UserProfile'];
type PaginatedTemplateListList = components['schemas']['PaginatedTemplateListList'];

export interface UsePromptTempleOptions {
  autoConnect?: boolean;
  enableRealTimeOptimization?: boolean;
  enableTemplateRecommendations?: boolean;
  enableAnalytics?: boolean;
}

export function usePromptTemple(options: UsePromptTempleOptions = {}) {
  const {
    autoConnect = true,
    enableRealTimeOptimization = true,
    enableTemplateRecommendations = true,
    enableAnalytics = true,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Initialize connection
  useEffect(() => {
    if (autoConnect) {
      connect();
    }
  }, [autoConnect]);

  const connect = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Initialize the integration service
      await promptCraftIntegration.initialize();
      
      // Check API health
      await promptTempleApi.getHealth();
      
      // Try to get user profile if authenticated
      if (promptTempleApi.isAuthenticated()) {
        const userProfile = await promptTempleApi.getProfile();
        setProfile(userProfile);
      }

      setIsConnected(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to Prompt Temple API';
      setError(errorMessage);
      console.error('Prompt Temple connection failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    promptCraftIntegration.destroy();
    setIsConnected(false);
    setProfile(null);
  }, []);

  // Authentication methods
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await promptTempleApi.login({ email, password });
      const userProfile = await promptTempleApi.getProfile();
      setProfile(userProfile);
      setIsConnected(true);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: components['schemas']['RegisterRequest']) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await promptTempleApi.register(userData);
      const userProfile = await promptTempleApi.getProfile();
      setProfile(userProfile);
      setIsConnected(true);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await promptTempleApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setProfile(null);
      setIsConnected(false);
    }
  }, []);

  // Template methods
  const getTemplates = useCallback(async (params?: {
    search?: string;
    category?: number;
    author?: string;
    is_public?: boolean;
    is_featured?: boolean;
    ordering?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedTemplateListList> => {
    try {
      return await promptTempleApi.getTemplates(params);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch templates';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const getTemplate = useCallback(async (id: string): Promise<Template> => {
    try {
      return await promptTempleApi.getTemplate(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch template';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const createTemplate = useCallback(async (template: components['schemas']['TemplateWriteRequest']): Promise<TemplateList> => {
    try {
      const newTemplate = await promptTempleApi.createTemplate(template);
      
      // Track creation for analytics
      if (enableAnalytics) {
        await promptCraftIntegration.trackInteraction('template_created', {
          templateId: newTemplate.id,
          category: template.category,
        });
      }

      return newTemplate;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create template';
      setError(errorMessage);
      throw err;
    }
  }, [enableAnalytics]);

  const renderTemplate = useCallback(async (id: string, variables: Record<string, any>): Promise<string> => {
    try {
      const response = await promptTempleApi.renderTemplate(id, variables);
      
      // Track usage for analytics
      if (enableAnalytics) {
        await Promise.all([
          promptTempleApi.recordTemplateUsage(id),
          promptCraftIntegration.trackInteraction('template_rendered', {
            templateId: id,
            variableCount: Object.keys(variables).length,
          }),
        ]);
      }

      return response.rendered_content || '';
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to render template';
      setError(errorMessage);
      throw err;
    }
  }, [enableAnalytics]);

  // AI-powered methods
  const optimizePrompt = useCallback(async (prompt: string, options?: {
    intent?: string;
    targetAudience?: string;
    desiredTone?: string;
    maxTokens?: number;
    context?: string[];
  }) => {
    if (!enableRealTimeOptimization) {
      throw new Error('Real-time optimization is disabled');
    }

    try {
      return await promptCraftIntegration.optimizePrompt({
        prompt,
        ...options,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to optimize prompt';
      setError(errorMessage);
      throw err;
    }
  }, [enableRealTimeOptimization]);

  const getTemplateRecommendations = useCallback(async (prompt: string, intent?: string, limit = 5) => {
    if (!enableTemplateRecommendations) {
      return [];
    }

    try {
      return await promptCraftIntegration.getTemplateRecommendations(prompt, intent, limit);
    } catch (err) {
      console.error('Failed to get template recommendations:', err);
      return [];
    }
  }, [enableTemplateRecommendations]);

  const assessPrompt = useCallback(async (request: components['schemas']['PromptAssessmentRequest']) => {
    try {
      return await promptTempleApi.assessPrompt(request);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to assess prompt';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const generatePrompt = useCallback(async (request: components['schemas']['PromptGenerationRequest']) => {
    try {
      return await promptTempleApi.generatePrompt(request);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate prompt';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Analytics methods
  const getUserAnalytics = useCallback(async () => {
    if (!enableAnalytics) {
      return null;
    }

    try {
      return await promptCraftIntegration.getUserAnalytics();
    } catch (err) {
      console.error('Failed to get user analytics:', err);
      return null;
    }
  }, [enableAnalytics]);

  const trackEvent = useCallback(async (event: string, properties: Record<string, any>) => {
    if (!enableAnalytics) {
      return;
    }

    try {
      await promptTempleApi.trackEvent({
        event,
        properties,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Failed to track event:', err);
    }
  }, [enableAnalytics]);

  // Categories
  const getCategories = useCallback(async () => {
    try {
      return await promptTempleApi.getCategories();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Search
  const searchGlobal = useCallback(async (query: string, filters?: {
    type?: 'template' | 'category' | 'user';
    category?: string;
    author?: string;
  }) => {
    try {
      return await promptTempleApi.searchGlobal(query, filters);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Connection state
    isConnected,
    isLoading,
    error,
    profile,
    
    // Connection methods
    connect,
    disconnect,
    clearError,
    
    // Authentication
    login,
    register,
    logout,
    isAuthenticated: promptTempleApi.isAuthenticated(),
    
    // Templates
    getTemplates,
    getTemplate,
    createTemplate,
    renderTemplate,
    
    // AI features
    optimizePrompt,
    getTemplateRecommendations,
    assessPrompt,
    generatePrompt,
    
    // Analytics
    getUserAnalytics,
    trackEvent,
    
    // Utilities
    getCategories,
    searchGlobal,
    
    // Direct API access for advanced use cases
    api: promptTempleApi,
    integration: promptCraftIntegration,
  };
}

// Hook for template management
export function useTemplateManager() {
  const {
    getTemplates,
    getTemplate,
    createTemplate,
    renderTemplate,
    getCategories,
    trackEvent,
    error,
    clearError,
  } = usePromptTemple();

  const [templates, setTemplates] = useState<TemplateList[]>([]);
  const [categories, setCategories] = useState<components['schemas']['Category'][]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [templatesResponse, categoriesResponse] = await Promise.all([
          getTemplates({ page_size: 20, ordering: '-created_at' }),
          getCategories(),
        ]);

        setTemplates(templatesResponse.results || []);
        setCategories(categoriesResponse.results || []);
      } catch (err) {
        console.error('Failed to load template manager data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [getTemplates, getCategories]);

  const refreshTemplates = useCallback(async (params?: Parameters<typeof getTemplates>[0]) => {
    try {
      const response = await getTemplates(params);
      setTemplates(response.results || []);
      return response;
    } catch (err) {
      throw err;
    }
  }, [getTemplates]);

  const createAndTrack = useCallback(async (template: components['schemas']['TemplateWriteRequest']) => {
    try {
      const newTemplate = await createTemplate(template);
      setTemplates(prev => [newTemplate, ...prev]);
      
      await trackEvent('template_created_via_manager', {
        templateId: newTemplate.id,
        category: template.category,
      });
      
      return newTemplate;
    } catch (err) {
      throw err;
    }
  }, [createTemplate, trackEvent]);

  return {
    templates,
    categories,
    isLoading,
    error,
    clearError,
    refreshTemplates,
    createTemplate: createAndTrack,
    getTemplate,
    renderTemplate,
  };
}