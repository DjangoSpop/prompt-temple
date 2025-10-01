export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'TRACE';

export interface CallOptions<Query = unknown, Body = unknown> {
  query?: Query;
  body?: Body;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

export interface CallResult<T> {
  data: T;
}

// Enhanced API types for the new navbar features
export type OptimizePromptRequest = { 
  input: string; 
  tone?: string;
  temperature?: number;
  maxTokens?: number;
};

export type OptimizePromptResponse = { 
  output: string; 
  tips?: string[];
  metrics?: {
    clarity: number;
    specificity: number;
    engagement: number;
  };
};

export type RagQueryRequest = { 
  query: string; 
  topK?: number;
  threshold?: number;
  includeMetadata?: boolean;
};

export type RagQueryResponse = { 
  answers: Array<{ 
    text: string; 
    source?: string;
    confidence?: number;
    metadata?: Record<string, any>;
  }>; 
  totalResults?: number;
};

export type AssistantChatRequest = { 
  messages: Array<{ 
    role: 'user' | 'assistant' | 'system'; 
    content: string;
    timestamp?: string;
  }>; 
  model?: string;
  temperature?: number;
  maxTokens?: number;
};

export type AssistantChatResponse = { 
  reply: string; 
  meta?: { 
    tokens?: number;
    model?: string;
    processingTime?: number;
  };
};

export type Template = { 
  id: string; 
  title: string; 
  description?: string;
  content: string;
  tags: string[];
  category?: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  usageCount?: number;
  rating?: number;
};

export type TemplateSearchResponse = { 
  items: Template[]; 
  total: number;
  page?: number;
  pageSize?: number;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isLoading?: boolean;
  error?: string;
};

export type ChatSession = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  model?: string;
};

export class ApiError extends Error {
  public status?: number;
  public code?: string;
  public details?: Record<string, any>;

  constructor({
    message,
    status,
    code,
    details,
  }: {
    message: string;
    status?: number;
    code?: string;
    details?: Record<string, any>;
  }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
