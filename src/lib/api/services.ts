// lib/api/services.ts
import { apiClient } from './client';
import type {
  OptimizePromptRequest,
  OptimizePromptResponse,
  RagQueryRequest,
  RagQueryResponse,
  AssistantChatRequest,
  AssistantChatResponse,
  Template,
  TemplateSearchResponse,
} from './types';

/**
 * AI Services - Pre-wired API coverage for the navbar's AI features
 * These are stub implementations that will call real endpoints when available
 */

export const aiServices = {
  // Prompt Optimizer Service
  async optimizePrompt(request: OptimizePromptRequest): Promise<OptimizePromptResponse> {
    try {
      return await apiClient.post<OptimizePromptResponse>('/v1/optimize-prompt', request);
    } catch (error) {
      // TODO: Remove this stub when real API is available
      console.warn('Prompt optimizer API not available, using mock response');
      return {
        output: `Enhanced version: ${request.input}\n\nOptimized for clarity and specificity.`,
        tips: [
          'Be more specific about your desired outcome',
          'Include context about your target audience',
          'Use action-oriented language',
        ],
        metrics: {
          clarity: 85,
          specificity: 78,
          engagement: 92,
        },
      };
    }
  },

  // RAG Studio Service
  async queryRAG(request: RagQueryRequest): Promise<RagQueryResponse> {
    try {
      return await apiClient.post<RagQueryResponse>('/v1/rag/query', request);
    } catch (error) {
      // TODO: Remove this stub when real API is available
      console.warn('RAG query API not available, using mock response');
      return {
        answers: [
          {
            text: `Based on your query "${request.query}", here are some relevant insights from our knowledge base.`,
            source: 'Knowledge Base',
            confidence: 0.87,
            metadata: { category: 'general', updated: new Date().toISOString() },
          },
          {
            text: 'Additional context and related information that might be helpful.',
            source: 'Documentation',
            confidence: 0.73,
            metadata: { category: 'docs', updated: new Date().toISOString() },
          },
        ],
        totalResults: 2,
      };
    }
  },

  // AI Assistant Service
  async chatWithAssistant(request: AssistantChatRequest): Promise<AssistantChatResponse> {
    try {
      return await apiClient.post<AssistantChatResponse>('/v1/assistant/chat', request);
    } catch (error) {
      // TODO: Remove this stub when real API is available
      console.warn('Assistant chat API not available, using mock response');
      const lastMessage = request.messages[request.messages.length - 1]?.content || '';
      return {
        reply: `I understand you're asking about: "${lastMessage}". I'd be happy to help you with that! This is a simulated response while we connect to the full AI backend.`,
        meta: {
          tokens: 45,
          model: 'gpt-4-turbo-preview',
          processingTime: 1200,
        },
      };
    }
  },
};

export const templateServices = {
  // Template Library Service
  async searchTemplates(params: {
    search?: string;
    category?: string;
    tags?: string[];
    page?: number;
    pageSize?: number;
  } = {}): Promise<TemplateSearchResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      if (params.category) queryParams.append('category', params.category);
      if (params.tags?.length) queryParams.append('tags', params.tags.join(','));
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());

      const endpoint = `/v1/templates${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      return await apiClient.get<TemplateSearchResponse>(endpoint);
    } catch (error) {
      // TODO: Remove this stub when real API is available
      console.warn('Template search API not available, using mock response');
      return {
        items: [
          {
            id: '1',
            title: 'Blog Post Writer',
            description: 'Create engaging blog posts with structured content',
            content: 'Write a comprehensive blog post about {topic}...',
            tags: ['writing', 'blog', 'content'],
            category: 'Content Creation',
            author: 'Template Team',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            usageCount: 1247,
            rating: 4.8,
          },
          {
            id: '2',
            title: 'Code Reviewer',
            description: 'Review code for best practices and improvements',
            content: 'Review the following code and provide feedback...',
            tags: ['code', 'review', 'development'],
            category: 'Development',
            author: 'Dev Team',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            usageCount: 856,
            rating: 4.6,
          },
        ],
        total: 2,
        page: params.page || 1,
        pageSize: params.pageSize || 10,
      };
    }
  },

  async getTemplate(id: string): Promise<Template> {
    try {
      return await apiClient.get<Template>(`/v1/templates/${id}`);
    } catch (error) {
      // TODO: Remove this stub when real API is available
      console.warn('Template get API not available, using mock response');
      return {
        id,
        title: 'Sample Template',
        description: 'A sample template for demonstration',
        content: 'This is a template content placeholder...',
        tags: ['sample', 'demo'],
        category: 'General',
        author: 'System',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
        rating: 5.0,
      };
    }
  },
};

// Health check service
export const systemServices = {
  async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'down'; services: Record<string, boolean> }> {
    try {
      return await apiClient.get<{ status: 'healthy' | 'degraded' | 'down'; services: Record<string, boolean> }>('/health');
    } catch (error) {
      return {
        status: 'down',
        services: {
          api: false,
          database: false,
          ai: false,
        },
      };
    }
  },
};

export default {
  ai: aiServices,
  templates: templateServices,
  system: systemServices,
};