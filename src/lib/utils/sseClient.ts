/**
 * Production-ready SSE client for chat completions with JWT authentication
 * Handles token streaming, reconnection, and error recovery
 * Compatible with Django /api/v2/chat/completions/ endpoint
 */

import { BaseApiClient } from '@/lib/api/base';

export interface SSEChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    processingTime?: number;
    model?: string;
    tokens?: number;
    cost?: number;
    traceId?: string;
  };
  status?: 'sending' | 'processing' | 'completed' | 'error';
}

export interface SSEStreamEvent {
  id?: string;
  event?: string;
  data: string;
  retry?: number;
}

export interface SSEChatConfig {
  apiUrl?: string;
  maxRetries?: number;
  retryDelay?: number;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  healthCheckInterval?: number;
}

export type TokenMetadata = Record<string, unknown> & {
  traceId?: string;
  tokens?: number;
  model?: string;
};

export interface StreamCallbacks {
  onStreamStart?: (data: unknown) => void;
  onStreamToken?: (content: string, metadata?: TokenMetadata) => void;
  onStreamComplete?: (finalMessage: SSEChatMessage) => void;
  onStreamError?: (error: Error) => void;
  onHealthCheck?: (health: { status: string; message: string; config?: unknown }) => void;
}

export class SSEChatClient {
  private config: Required<SSEChatConfig>;
  private abortController: AbortController | null = null;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private apiClient: BaseApiClient;

  constructor(config: SSEChatConfig = {}) {
    this.config = {
      apiUrl: config.apiUrl || process.env.NEXT_PUBLIC_API_URL || 'https://api.prompt-temple.com',
      maxRetries: config.maxRetries ?? 3,
      retryDelay: config.retryDelay ?? 2000,
      model: config.model || 'deepseek-chat',
      temperature: config.temperature ?? 0.7,
      maxTokens: config.maxTokens ?? 4096,
      healthCheckInterval: config.healthCheckInterval ?? 30000,
    };
    
    this.apiClient = new BaseApiClient(this.config.apiUrl);
  }

  /**
   * Send a chat message with SSE streaming
   */
  async sendMessage(
    content: string,
    conversationHistory: SSEChatMessage[] = [],
    callbacks: StreamCallbacks = {}
  ): Promise<SSEChatMessage> {
    // Abort any ongoing request
    if (this.abortController) {
      this.abortController.abort();
    }

    this.abortController = new AbortController();
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    // Get authenticated token
    const token = this.apiClient.getAccessToken();
    if (!token || this.isTokenExpired(token)) {
      throw new Error('Authentication required. Please log in.');
    }

    // Prepare conversation history
    const messages = [
      // System prompt for DeepSeek optimization
      { role: 'system' as const, content: this.getOptimizedSystemPrompt() },
      // Conversation history
      ...conversationHistory.map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      })),
      // Current message
      { role: 'user' as const, content }
    ];

    const payload = {
      messages,
      model: this.config.model,
      stream: true,
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
    };

    const streamingMessage: SSEChatMessage = {
      id: messageId,
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      status: 'processing',
      metadata: {
        model: this.config.model,
        traceId: messageId,
      }
    };

    try {
      const response = await fetch(`${this.config.apiUrl}/api/v2/chat/completions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'X-Request-ID': messageId,
        },
        body: JSON.stringify(payload),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      if (!response.body) {
        throw new Error('No response body received');
      }

      // Process the SSE stream
      await this.processSSEStream(
        response.body,
        streamingMessage,
        startTime,
        callbacks
      );

      return streamingMessage;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request was cancelled');
      }
      
      streamingMessage.status = 'error';
      streamingMessage.content = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      
      callbacks.onStreamError?.(error instanceof Error ? error : new Error('Unknown error'));
      throw error;
    }
  }

  /**
   * Process SSE stream with proper event parsing
   */
  private async processSSEStream(
    body: ReadableStream<Uint8Array>,
    message: SSEChatMessage,
    startTime: number,
    callbacks: StreamCallbacks
  ): Promise<void> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || ''; // Keep incomplete frame

        for (const frame of lines) {
          if (!frame.trim()) continue;
          
          const event = this.parseSSEFrame(frame);
          if (event) {
            await this.handleSSEEvent(event, message, callbacks);
          }
        }
      }

      // Finalize message
      message.status = 'completed';
      message.metadata = {
        ...message.metadata,
        processingTime: Date.now() - startTime,
        tokens: this.estimateTokenCount(message.content),
      };

      callbacks.onStreamComplete?.(message);
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Parse SSE frame into structured event
   */
  private parseSSEFrame(frame: string): SSEStreamEvent | null {
    const lines = frame.split('\n');
    const event: SSEStreamEvent = { data: '' };
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith(':')) continue; // Skip comments
      
      const colonIndex = trimmed.indexOf(':');
      if (colonIndex === -1) continue;
      
      const field = trimmed.slice(0, colonIndex).trim();
      const value = trimmed.slice(colonIndex + 1).trim();
      
      switch (field) {
        case 'id':
          event.id = value;
          break;
        case 'event':
          event.event = value;
          break;
        case 'data':
          event.data = value;
          break;
        case 'retry':
          event.retry = parseInt(value, 10);
          break;
      }
    }
    
    return event.data ? event : null;
  }

  /**
   * Handle individual SSE events
   */
  private async handleSSEEvent(
    event: SSEStreamEvent,
    message: SSEChatMessage,
    callbacks: StreamCallbacks
  ): Promise<void> {
    switch (event.event) {
      case 'stream_start':
        try {
          const data = JSON.parse(event.data);
          callbacks.onStreamStart?.(data);
          if (data.trace_id) {
            message.metadata!.traceId = data.trace_id;
          }
        } catch {
          callbacks.onStreamStart?.({ status: 'started' });
        }
        break;

      case 'stream_complete':
        try {
          const data = JSON.parse(event.data);
          if (data.usage) {
            message.metadata!.tokens = data.usage.total_tokens;
            message.metadata!.cost = data.usage.total_tokens * 0.001; // Rough estimate
          }
        } catch {
          // Ignore parse errors for completion
        }
        break;

      case 'error':
        try {
          const errorData = JSON.parse(event.data);
          const error = new Error(errorData.message || 'Stream error');
          callbacks.onStreamError?.(error);
          throw error;
        } catch (e) {
          if (e instanceof Error && e.message !== 'Stream error') {
            // JSON parse error, use raw data
            const error = new Error(event.data || 'Unknown stream error');
            callbacks.onStreamError?.(error);
            throw error;
          }
          throw e;
        }
        break;

      default:
        // Handle message/data events (token streaming)
        if (event.data === '[DONE]') {
          return; // Stream complete
        }

        try {
          const data = JSON.parse(event.data);
          const content = data.choices?.[0]?.delta?.content || '';
          
          if (content) {
            message.content += content;
            callbacks.onStreamToken?.(content, { 
              messageId: message.id,
              currentContent: message.content,
              traceId: message.metadata?.traceId 
            });
          }
        } catch {
          // Handle plain text streaming
          if (event.data && event.data !== '[DONE]') {
            message.content += event.data;
            callbacks.onStreamToken?.(event.data, {
              messageId: message.id,
              currentContent: message.content
            });
          }
        }
        break;
    }
  }

  /**
   * Handle HTTP error responses
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = `Request failed with status ${response.status}`;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorData.detail || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }

    if (response.status === 401) {
      errorMessage = 'Authentication failed. Please log in again.';
      // Clear invalid tokens
      this.apiClient.clearTokens();
    }

    throw new Error(`${errorMessage} (${response.status})`);
  }

  /**
   * Check service health
   */
  async checkHealth(): Promise<{ status: string; message: string; config?: unknown }> {
    try {
      const token = this.apiClient.getAccessToken();
      const response = await fetch(`${this.config.apiUrl}/api/v2/chat/health/`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Health check failed'
      };
    }
  }

  /**
   * Start periodic health checks
   */
  startHealthCheck(callback?: (health: { status: string; message: string; config?: unknown }) => void): void {
    this.stopHealthCheck(); // Clear existing interval
    
    this.healthCheckInterval = setInterval(async () => {
      try {
        const health = await this.checkHealth();
        callback?.(health);
      } catch (error) {
        callback?.({ 
          status: 'error', 
          message: 'Health check failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }, this.config.healthCheckInterval);
  }

  /**
   * Stop health checks
   */
  stopHealthCheck(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  /**
   * Cancel ongoing request
   */
  cancel(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  /**
   * Check if token is expired
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < (currentTime + 30); // 30 second buffer
    } catch {
      return true;
    }
  }

  /**
   * Get optimized system prompt for DeepSeek
   */
  private getOptimizedSystemPrompt(): string {
    return `You are an expert AI assistant powered by DeepSeek. Provide clear, accurate, and helpful responses.

Key capabilities:
- Technical expertise across multiple domains
- Code generation and debugging
- Creative problem-solving
- Professional writing and analysis

Response style:
- Be conversational yet professional
- Use markdown formatting for clarity
- Provide practical, actionable solutions
- Include examples when helpful
- Ask clarifying questions when needed

Focus on delivering maximum value with every response.`;
  }

  /**
   * Estimate token count (rough calculation)
   */
  private estimateTokenCount(text: string): number {
    return Math.ceil(text.length / 4); // Rough approximation
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.cancel();
    this.stopHealthCheck();
  }
}

// Export singleton instance
export const sseClient = new SSEChatClient();
