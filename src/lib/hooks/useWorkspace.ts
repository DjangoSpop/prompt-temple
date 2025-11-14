/**
 * Workspace Hooks
 * Manages conversations, saved prompts, and workspace operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BaseApiClient } from '@/lib/api/base';

// Types
export interface Conversation {
  id: string;
  title: string;
  preview: string;
  message_count: number;
  created_at: string;
  updated_at: string;
  tags: string[];
  is_favorite: boolean;
  is_archived: boolean;
  model_used: string;
  mode: 'standard' | 'rag_fast' | 'rag_deep';
  messages?: ConversationMessage[];
}

export interface ConversationMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface SavedPrompt {
  id: string;
  title: string;
  content: string;
  description?: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  is_favorite: boolean;
  usage_count: number;
  category: string;
  variables?: string[];
}

export interface WorkspaceFolder {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  item_count: number;
  items: Array<{
    type: 'conversation' | 'prompt';
    id: string;
  }>;
}

export interface ExportOptions {
  format: 'json' | 'csv' | 'markdown';
  include_conversations: boolean;
  include_prompts: boolean;
  date_range?: {
    start: string;
    end: string;
  };
}

// API Service
class WorkspaceService extends BaseApiClient {
  // Conversations
  async getConversations(params?: {
    limit?: number;
    offset?: number;
    search?: string;
    tags?: string[];
    is_favorite?: boolean;
    is_archived?: boolean;
  }): Promise<{ results: Conversation[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.tags?.length) searchParams.set('tags', params.tags.join(','));
    if (params?.is_favorite !== undefined) searchParams.set('is_favorite', params.is_favorite.toString());
    if (params?.is_archived !== undefined) searchParams.set('is_archived', params.is_archived.toString());

    return this.request(`/api/v2/workspace/conversations/?${searchParams.toString()}`);
  }

  async getConversation(id: string): Promise<Conversation> {
    return this.request(`/api/v2/workspace/conversations/${id}/`);
  }

  async updateConversation(id: string, data: Partial<Conversation>): Promise<Conversation> {
    return this.request(`/api/v2/workspace/conversations/${id}/`, {
      method: 'PATCH',
      data,
    });
  }

  async deleteConversation(id: string): Promise<void> {
    return this.request(`/api/v2/workspace/conversations/${id}/`, {
      method: 'DELETE',
    });
  }

  async archiveConversation(id: string): Promise<Conversation> {
    return this.request(`/api/v2/workspace/conversations/${id}/archive/`, {
      method: 'POST',
    });
  }

  // Saved Prompts
  async getSavedPrompts(params?: {
    limit?: number;
    offset?: number;
    search?: string;
    category?: string;
    tags?: string[];
    is_favorite?: boolean;
  }): Promise<{ results: SavedPrompt[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.tags?.length) searchParams.set('tags', params.tags.join(','));
    if (params?.is_favorite !== undefined) searchParams.set('is_favorite', params.is_favorite.toString());

    return this.request(`/api/v2/workspace/prompts/?${searchParams.toString()}`);
  }

  async createSavedPrompt(data: Omit<SavedPrompt, 'id' | 'created_at' | 'updated_at' | 'usage_count'>): Promise<SavedPrompt> {
    return this.request('/api/v2/workspace/prompts/', {
      method: 'POST',
      data,
    });
  }

  async updateSavedPrompt(id: string, data: Partial<SavedPrompt>): Promise<SavedPrompt> {
    return this.request(`/api/v2/workspace/prompts/${id}/`, {
      method: 'PATCH',
      data,
    });
  }

  async deleteSavedPrompt(id: string): Promise<void> {
    return this.request(`/api/v2/workspace/prompts/${id}/`, {
      method: 'DELETE',
    });
  }

  // Folders
  async getFolders(): Promise<WorkspaceFolder[]> {
    return this.request('/api/v2/workspace/folders/');
  }

  async createFolder(data: { name: string; description?: string }): Promise<WorkspaceFolder> {
    return this.request('/api/v2/workspace/folders/', {
      method: 'POST',
      data,
    });
  }

  // Export
  async exportWorkspace(options: ExportOptions): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/api/v2/workspace/export/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAccessToken()}`,
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  }

  // Favorites
  async toggleFavorite(type: 'conversation' | 'prompt', id: string): Promise<{ is_favorite: boolean }> {
    return this.request(`/api/v2/workspace/${type}s/${id}/favorite/`, {
      method: 'POST',
    });
  }

  // Search
  async searchWorkspace(query: string, filters?: {
    types?: ('conversation' | 'prompt')[];
    tags?: string[];
    date_range?: { start: string; end: string };
  }): Promise<{
    conversations: Conversation[];
    prompts: SavedPrompt[];
  }> {
    return this.request('/api/v2/workspace/search/', {
      method: 'POST',
      data: { query, ...filters },
    });
  }
}

const workspaceService = new WorkspaceService();

// Hooks
export const useConversations = (params?: Parameters<WorkspaceService['getConversations']>[0]) => {
  return useQuery({
    queryKey: ['conversations', params],
    queryFn: () => workspaceService.getConversations(params),
    staleTime: 30000, // 30 seconds
  });
};

export const useConversation = (id?: string) => {
  return useQuery({
    queryKey: ['conversation', id],
    queryFn: () => workspaceService.getConversation(id!),
    enabled: !!id,
    staleTime: 60000, // 1 minute
  });
};

export const useSavedPrompts = (params?: Parameters<WorkspaceService['getSavedPrompts']>[0]) => {
  return useQuery({
    queryKey: ['saved-prompts', params],
    queryFn: () => workspaceService.getSavedPrompts(params),
    staleTime: 30000,
  });
};

export const useWorkspaceFolders = () => {
  return useQuery({
    queryKey: ['workspace-folders'],
    queryFn: () => workspaceService.getFolders(),
    staleTime: 60000,
  });
};

export const useWorkspaceSearch = () => {
  return useMutation({
    mutationFn: (params: Parameters<WorkspaceService['searchWorkspace']>) => 
      workspaceService.searchWorkspace(...params),
  });
};

// Mutation hooks
export const useUpdateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Conversation> }) =>
      workspaceService.updateConversation(id, data),
    onSuccess: (data, variables) => {
      // Update conversation list cache
      queryClient.setQueryData(['conversations'], (old: unknown) => {
        if (!old) return old;
        return {
          ...old,
          results: old.results.map((conv: Conversation) =>
            conv.id === variables.id ? { ...conv, ...data } : conv
          ),
        };
      });
      
      // Update individual conversation cache
      queryClient.setQueryData(['conversation', variables.id], data);
    },
  });
};

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workspaceService.deleteConversation(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.removeQueries({ queryKey: ['conversation', id] });
    },
  });
};

export const useCreateSavedPrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<WorkspaceService['createSavedPrompt']>[0]) =>
      workspaceService.createSavedPrompt(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-prompts'] });
    },
  });
};

export const useUpdateSavedPrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SavedPrompt> }) =>
      workspaceService.updateSavedPrompt(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-prompts'] });
    },
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, id }: { type: 'conversation' | 'prompt'; id: string }) =>
      workspaceService.toggleFavorite(type, id),
    onSuccess: (data, variables) => {
      // Update relevant cache
      if (variables.type === 'conversation') {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
        queryClient.setQueryData(['conversation', variables.id], (old: unknown) => ({
          ...old,
          is_favorite: data.is_favorite,
        }));
      } else {
        queryClient.invalidateQueries({ queryKey: ['saved-prompts'] });
      }
    },
  });
};

export const useExportWorkspace = () => {
  return useMutation({
    mutationFn: (options: ExportOptions) => workspaceService.exportWorkspace(options),
    onSuccess: (blob, variables) => {
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `workspace-export.${variables.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
  });
};

export const useCreateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      workspaceService.createFolder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-folders'] });
    },
  });
};