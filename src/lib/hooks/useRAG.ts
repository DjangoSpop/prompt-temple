/**
 * Typed hooks for Agentic RAG functionality
 * Handles REST optimization endpoint and WebSocket streaming events
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { BaseApiClient } from '@/lib/api/base';

// RAG Types
export interface RAGOptimizationRequest {
  original_prompt: string;
  mode: 'standard' | 'rag_fast' | 'rag_deep';
  context?: {
    domain?: string;
    use_case?: string;
    target_audience?: string;
  };
  budget_limit?: number;
}

export interface RAGCitation {
  title: string;
  source: string;
  url?: string;
  score: number;
  snippet: string;
  metadata?: {
    document_type?: string;
    last_updated?: string;
    relevance_score?: number;
  };
}

export interface RAGOptimizationResult {
  id: string;
  original_prompt: string;
  optimized_prompt: string;
  mode: 'standard' | 'rag_fast' | 'rag_deep';
  citations: RAGCitation[];
  diff_summary: {
    improvements: string[];
    changes: string[];
    reasoning: string;
  };
  usage: {
    credits_consumed: number;
    processing_time_ms: number;
    tokens_analyzed: number;
    citations_found: number;
  };
  quality_metrics: {
    clarity_score: number;
    specificity_score: number;
    actionability_score: number;
    overall_score: number;
  };
  status: 'completed' | 'processing' | 'error';
  created_at: string;
}

export interface RAGIndexStatus {
  status: 'available' | 'building' | 'error' | 'unavailable';
  document_count: number;
  last_updated: string;
  build_progress?: number;
  error_message?: string;
}

// WebSocket Events
export interface AgentStreamingEvent {
  event: 'agent.start' | 'agent.step' | 'agent.token' | 'agent.citations' | 'agent.done' | 'agent.error';
  data: any;
  trace_id?: string;
  timestamp: string;
}

// RAG API Service
class RAGService extends BaseApiClient {
  async optimize(request: RAGOptimizationRequest): Promise<RAGOptimizationResult> {
    return this.request<RAGOptimizationResult>('/v1/ai-services/agent/optimize/', {
      method: 'POST',
      data: request,
    });
  }

  async getOptimizationResult(id: string): Promise<RAGOptimizationResult> {
    return this.request<RAGOptimizationResult>(`/v1/ai-services/agent/optimize/${id}/`);
  }

  async getIndexStatus(): Promise<RAGIndexStatus> {
    return this.request<RAGIndexStatus>('/v1/ai-services/agent/index/status/');
  }

  async getUserCredits(): Promise<{ remaining: number; limit: number; consumed_today: number }> {
    return this.request('/api/v2/billing/credits/');
  }
}

const ragService = new RAGService();

// Hooks
export const useRAGOptimize = () => {
  const optimizeMutation = useMutation({
    mutationFn: (request: RAGOptimizationRequest) => ragService.optimize(request),
    onSuccess: () => {
      // Invalidate credits query to update remaining balance
      // queryClient.invalidateQueries({ queryKey: ['credits'] });
    },
  });

  return {
    optimize: optimizeMutation.mutate,
    optimizeAsync: optimizeMutation.mutateAsync,
    isOptimizing: optimizeMutation.isPending,
    error: optimizeMutation.error,
    result: optimizeMutation.data,
    reset: optimizeMutation.reset,
  };
};

export const useRAGResult = (id?: string) => {
  return useQuery({
    queryKey: ['rag-result', id],
    queryFn: () => ragService.getOptimizationResult(id!),
    enabled: !!id,
    refetchInterval: (data) => {
      // Keep polling if still processing
      return data?.status === 'processing' ? 2000 : false;
    },
  });
};

export const useRAGIndexStatus = () => {
  return useQuery({
    queryKey: ['rag-index-status'],
    queryFn: () => ragService.getIndexStatus(),
    staleTime: 30000, // Cache for 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useCredits = () => {
  return useQuery({
    queryKey: ['credits'],
    queryFn: () => ragService.getUserCredits(),
    staleTime: 10000, // Cache for 10 seconds
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// WebSocket streaming hook for agent events
export const useAgentStreaming = (traceId?: string) => {
  const [events, setEvents] = useState<AgentStreamingEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const connect = useCallback(() => {
    if (!traceId) return;

    try {
      const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'wss://api.prompt-temple.com'}/ws/agent/${traceId}/`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as AgentStreamingEvent;
          setEvents(prev => [...prev, data]);
        } catch (err) {
          console.warn('Failed to parse WebSocket message:', err);
        }
      };

      ws.onerror = () => {
        setError(new Error('WebSocket connection error'));
        setIsConnected(false);
      };

      ws.onclose = () => {
        setIsConnected(false);
      };

      return ws;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create WebSocket connection'));
      return null;
    }
  }, [traceId]);

  useEffect(() => {
    const ws = connect();
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [connect]);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  return {
    events,
    isConnected,
    error,
    clearEvents,
  };
};

// Utility hooks
export const useRAGMode = () => {
  const [mode, setMode] = useState<'standard' | 'rag_fast' | 'rag_deep'>('standard');
  const { data: indexStatus } = useRAGIndexStatus();
  const { data: credits } = useCredits();

  const canUseRAG = indexStatus?.status === 'available';
  const hasCredits = credits && credits.remaining > 0;

  const setModeWithValidation = useCallback((newMode: typeof mode) => {
    if (newMode !== 'standard' && !canUseRAG) {
      throw new Error('RAG mode is not available. Please check index status.');
    }
    
    if (newMode === 'rag_deep' && credits && credits.remaining < 10) {
      throw new Error('Insufficient credits for deep RAG mode. Deep mode requires at least 10 credits.');
    }

    setMode(newMode);
  }, [canUseRAG, credits]);

  return {
    mode,
    setMode: setModeWithValidation,
    canUseRAG,
    hasCredits,
    indexStatus,
    credits,
    modeInfo: {
      standard: {
        name: 'Standard',
        description: 'Fast optimization without external knowledge',
        credits: 1,
        speed: 'Fast'
      },
      rag_fast: {
        name: 'RAG Fast',
        description: 'Quick optimization with relevant citations',
        credits: 3,
        speed: 'Medium'
      },
      rag_deep: {
        name: 'RAG Deep',
        description: 'Comprehensive analysis with extensive research',
        credits: 10,
        speed: 'Slow'
      }
    }
  };
};