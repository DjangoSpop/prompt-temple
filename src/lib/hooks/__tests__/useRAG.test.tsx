/**
 * Test suite for RAG hooks
 * Tests RAG optimization, credits management, and streaming functionality
 */

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRAGOptimize, useCredits, useRAGMode } from '../useRAG';
import { BaseApiClient } from '@/lib/api/base';

// Mock the BaseApiClient
jest.mock('@/lib/api/base');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useRAGOptimize', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should optimize prompt successfully', async () => {
    const mockRequest = jest.fn().mockResolvedValue({
      id: 'test-id',
      original_prompt: 'Test prompt',
      optimized_prompt: 'Optimized test prompt',
      citations: [],
      mode: 'rag_fast',
      status: 'completed',
    });

    (BaseApiClient as jest.Mock).mockImplementation(() => ({
      request: mockRequest,
    }));

    const wrapper = createWrapper();
    const { result } = renderHook(() => useRAGOptimize(), { wrapper });

    const request = {
      original_prompt: 'Test prompt',
      mode: 'rag_fast' as const,
    };

    result.current.optimize(request);

    await waitFor(() => {
      expect(result.current.isOptimizing).toBe(false);
    });

    expect(mockRequest).toHaveBeenCalledWith('/v1/ai-services/agent/optimize/', {
      method: 'POST',
      data: request,
    });
  });

  it('should handle optimization errors', async () => {
    const mockRequest = jest.fn().mockRejectedValue(new Error('API Error'));

    (BaseApiClient as jest.Mock).mockImplementation(() => ({
      request: mockRequest,
    }));

    const wrapper = createWrapper();
    const { result } = renderHook(() => useRAGOptimize(), { wrapper });

    result.current.optimize({
      original_prompt: 'Test prompt',
      mode: 'rag_fast',
    });

    await waitFor(() => {
      expect(result.current.error).toBeInstanceOf(Error);
    });
  });
});

describe('useCredits', () => {
  it('should fetch user credits successfully', async () => {
    const mockCredits = {
      remaining: 100,
      limit: 500,
      consumed_today: 25,
    };

    const mockRequest = jest.fn().mockResolvedValue(mockCredits);

    (BaseApiClient as jest.Mock).mockImplementation(() => ({
      request: mockRequest,
    }));

    const wrapper = createWrapper();
    const { result } = renderHook(() => useCredits(), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockCredits);
    });

    expect(mockRequest).toHaveBeenCalledWith('/api/v2/billing/credits/');
  });
});

describe('useRAGMode', () => {
  it('should validate mode changes based on credits and index status', async () => {
    const mockCredits = {
      remaining: 5,
      limit: 500,
      consumed_today: 25,
    };

    const mockIndexStatus = {
      status: 'available' as const,
      document_count: 1000,
      last_updated: '2024-01-15T10:00:00Z',
    };

    const wrapper = createWrapper();
    const { result } = renderHook(() => useRAGMode(), { wrapper });

    // Mock the hook dependencies
    result.current.credits = mockCredits;
    result.current.indexStatus = mockIndexStatus;

    expect(result.current.canUseRAG).toBe(true);
    expect(result.current.hasCredits).toBe(true);

    // Should allow rag_fast (3 credits) but not rag_deep (10 credits)
    expect(() => result.current.setMode('rag_fast')).not.toThrow();
    
    // This should throw because insufficient credits (need 10, have 5)
    expect(() => result.current.setMode('rag_deep')).toThrow(/insufficient credits/i);
  });

  it('should prevent RAG usage when index is unavailable', async () => {
    const mockIndexStatus = {
      status: 'unavailable' as const,
      document_count: 0,
      last_updated: '2024-01-15T10:00:00Z',
    };

    const wrapper = createWrapper();
    const { result } = renderHook(() => useRAGMode(), { wrapper });

    result.current.indexStatus = mockIndexStatus;

    expect(result.current.canUseRAG).toBe(false);
    expect(() => result.current.setMode('rag_fast')).toThrow(/not available/i);
  });
});