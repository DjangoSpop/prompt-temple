/**
 * Test suite for SSE Chat Client
 * Tests streaming, authentication, and error handling
 */

import { SSEChatClient, sseClient } from '../sseClient';
import { BaseApiClient } from '@/lib/api/base';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';

// Mock the BaseApiClient and fetch
vi.mock('@/lib/api/base');
global.fetch = vi.fn();

describe('SSEChatClient', () => {
  let client: SSEChatClient;
  let mockBaseApiClient: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockBaseApiClient = {
      getAccessToken: vi.fn().mockReturnValue('valid-token'),
      clearTokens: vi.fn(),
    };

    vi.mocked(BaseApiClient).mockImplementation(() => mockBaseApiClient);

    client = new SSEChatClient({
      apiUrl: 'https://test-api.com',
      model: 'test-model',
    });
  });

  afterEach(() => {
    client.destroy();
  });

  describe('sendMessage', () => {
    it('should send message with proper authentication headers', async () => {
      const mockResponse = {
        ok: true,
        headers: new Map([['content-type', 'text/event-stream']]),
        body: {
          getReader: () => ({
            read: vi.fn()
              .mockResolvedValueOnce({
                done: false,
                value: new TextEncoder().encode('data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n'),
              })
              .mockResolvedValueOnce({
                done: false,
                value: new TextEncoder().encode('data: [DONE]\n\n'),
              })
              .mockResolvedValueOnce({
                done: true,
                value: undefined,
              }),
            releaseLock: vi.fn(),
          }),
        },
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      const callbacks = {
        onStreamToken: vi.fn(),
        onStreamComplete: vi.fn(),
      };

      await client.sendMessage('Test message', [], callbacks);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://test-api.com/api/v2/chat/completions/',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer valid-token',
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
          }),
          body: expect.stringContaining('"stream":true'),
        })
      );

      expect(callbacks.onStreamToken).toHaveBeenCalledWith(
        'Hello',
        expect.any(Object)
      );
    });

    it('should handle authentication errors properly', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: vi.fn().mockResolvedValue({ error: 'Invalid token' }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await expect(client.sendMessage('Test message')).rejects.toThrow(
        /Invalid token \(401\)/
      );

      expect(mockBaseApiClient.clearTokens).toHaveBeenCalled();
    });

    it('should handle missing token', async () => {
      mockBaseApiClient.getAccessToken.mockReturnValue(null);

      await expect(client.sendMessage('Test message')).rejects.toThrow(
        /Authentication required/
      );
    });

    it('should handle expired token', async () => {
      // Mock expired token (exp claim in past)
      const expiredToken = 'header.' + btoa(JSON.stringify({
        exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      })) + '.signature';

      mockBaseApiClient.getAccessToken.mockReturnValue(expiredToken);

      await expect(client.sendMessage('Test message')).rejects.toThrow(
        /Authentication required/
      );
    });

    it('should parse SSE events correctly', async () => {
      const sseData = [
        'event: stream_start\ndata: {"trace_id":"test-123"}\n\n',
        'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n',
        'data: {"choices":[{"delta":{"content":" World"}}]}\n\n',
        'event: stream_complete\ndata: {"usage":{"total_tokens":10}}\n\n',
      ];

      const mockResponse = {
        ok: true,
        headers: new Map([['content-type', 'text/event-stream']]),
        body: {
          getReader: () => {
            let index = 0;
            return {
              read: vi.fn().mockImplementation(() => {
                if (index < sseData.length) {
                  return Promise.resolve({
                    done: false,
                    value: new TextEncoder().encode(sseData[index++]),
                  });
                }
                return Promise.resolve({ done: true, value: undefined });
              }),
              releaseLock: vi.fn(),
            };
          },
        },
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const callbacks = {
        onStreamStart: jest.fn(),
        onStreamToken: jest.fn(),
        onStreamComplete: jest.fn(),
      };

      const result = await client.sendMessage('Test message', [], callbacks);

      expect(callbacks.onStreamStart).toHaveBeenCalledWith({
        trace_id: 'test-123',
      });

      expect(callbacks.onStreamToken).toHaveBeenCalledWith(
        'Hello',
        expect.any(Object)
      );

      expect(callbacks.onStreamToken).toHaveBeenCalledWith(
        ' World',
        expect.any(Object)
      );

      expect(result.content).toBe('Hello World');
      expect(result.status).toBe('completed');
    });
  });

  describe('checkHealth', () => {
    it('should check service health successfully', async () => {
      const mockHealthResponse = {
        status: 'healthy',
        message: 'All systems operational',
        config: { version: '1.0.0' },
      };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockHealthResponse),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const health = await client.checkHealth();

      expect(health).toEqual(mockHealthResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://test-api.com/api/v2/chat/health/',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer valid-token',
          }),
        })
      );
    });

    it('should handle health check failures gracefully', async () => {
      const mockResponse = {
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const health = await client.checkHealth();

      expect(health).toEqual({
        status: 'error',
        message: 'Health check failed: 503 Service Unavailable',
      });
    });
  });

  describe('health monitoring', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should start periodic health checks', async () => {
      const mockCallback = jest.fn();
      const mockHealthResponse = {
        status: 'healthy',
        message: 'OK',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockHealthResponse),
      });

      client.startHealthCheck(mockCallback);

      // Fast-forward time to trigger health check
      jest.advanceTimersByTime(30000);
      await Promise.resolve(); // Allow async operations to complete

      expect(mockCallback).toHaveBeenCalledWith(mockHealthResponse);

      client.stopHealthCheck();
    });

    it('should handle health check errors in periodic monitoring', async () => {
      const mockCallback = jest.fn();

      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      client.startHealthCheck(mockCallback);

      jest.advanceTimersByTime(30000);
      await Promise.resolve();

      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'Health check failed',
          error: 'Network error',
        })
      );

      client.stopHealthCheck();
    });
  });

  describe('singleton instance', () => {
    it('should export a singleton instance', () => {
      expect(sseClient).toBeInstanceOf(SSEChatClient);
    });

    it('should allow configuration of singleton', () => {
      expect(sseClient).toBeDefined();
      // Test that methods are available
      expect(typeof sseClient.sendMessage).toBe('function');
      expect(typeof sseClient.checkHealth).toBe('function');
      expect(typeof sseClient.startHealthCheck).toBe('function');
    });
  });
});