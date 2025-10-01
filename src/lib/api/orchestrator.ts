import { BaseApiClient } from './base';
import type { components } from '../../types/api';
import type { Template } from '@/lib/types';
import { MiPROEngine, type MiPROSession } from '../prompt-engineering/mipro';
import { MethodologySelector, type OptimizationRequest, type OptimizationResult } from '../prompt-engineering/methodologies';
import { AudioGenerator, type AudioGenerationRequest, type GeneratedAudio } from '../wow-effects/audio-generator';
import { WowMeter, type WowMetrics } from '../wow-effects/wow-meter';
import { GraphRAGEngine, type GraphRAGQuery } from '../prompt-engineering/graph-rag';

type TemplateList = components['schemas']['TemplateList'];

interface IntentDetectionRequest {
  user_input: string;
  context?: any;
}

// Utility functions for template variable processing
export function extractTemplateVariables(content: string): string[] {
  if (!content || typeof content !== 'string') return [];

  const variablePattern = /\{\{([^}]+)\}\}/g;
  const variables = new Set<string>();
  let match;

  while ((match = variablePattern.exec(content)) !== null) {
    const variableName = match[1].trim();
    if (variableName) variables.add(variableName);
  }

  return Array.from(variables);
}

export function prepareRenderVariables(template: Template, variables: Record<string, string>): Record<string, string> {
  if (!template || !variables) return {};

  // Validate and sanitize variables
  const sanitizedVars: Record<string, string> = {};
  Object.entries(variables).forEach(([key, value]) => {
    if (key && typeof value === 'string') {
      sanitizedVars[key] = value.trim();
    }
  });

  return sanitizedVars;
}

interface IntentDetectionResponse {
  intent: string;
  confidence: number;
  entities: any[];
  suggested_actions: string[];
}

interface PromptAssessmentRequest {
  original_prompt: string;
  llm_response: string;
  context?: any;
}

interface PromptAssessmentResponse {
  quality_score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  optimization_tips: string[];
}

interface TemplateRenderRequest {
  template_id: string;
  variables: Record<string, string>;
}

interface TemplateRenderResponse {
  rendered_content: string;
  variables_used: string[];
  warnings?: string[];
}

interface TemplateSearchRequest {
  query: string;
  filters?: {
    category?: string;
    difficulty?: string;
    rating?: number;
  };
}

interface AdvancedOptimizationRequest {
  prompt: string;
  task_type: string;
  complexity: 'basic' | 'pro' | 'genius';
  methodology?: string;
  generate_audio?: boolean;
  generate_video?: boolean;
  context?: string;
  target_model?: 'gpt-4' | 'claude-3' | 'gemini-pro';
  use_graph_rag?: boolean;
  graph_query?: Partial<GraphRAGQuery>;
  knowledge_domains?: string[];
}

interface AdvancedOptimizationResponse {
  optimization: OptimizationResult;
  audio?: GeneratedAudio;
  video?: any;
  wow_metrics: WowMetrics;
  session_id: string;
}

interface QuickWowRequest {
  prompt: string;
}

interface QuickWowResponse {
  wow_score: number;
  assessment: {
    level: string;
    emoji: string;
    message: string;
    color: string;
  };
  suggestions: string[];
}

export class OrchestratorService extends BaseApiClient {
  async detectIntent(request: IntentDetectionRequest): Promise<IntentDetectionResponse> {
    return this.request<IntentDetectionResponse>('/api/v2/orchestrator/intent/', {
      method: 'POST',
      data: request,
    });
  }

  async assessPrompt(request: PromptAssessmentRequest): Promise<PromptAssessmentResponse> {
    return this.request<PromptAssessmentResponse>('/api/v2/orchestrator/assess/', {
      method: 'POST',
      data: request,
    });
  }

  async renderTemplate(request: TemplateRenderRequest): Promise<TemplateRenderResponse> {
    return this.request<TemplateRenderResponse>('/api/v2/orchestrator/render/', {
      method: 'POST',
      data: request,
    });
  }

  async searchTemplates(request: TemplateSearchRequest): Promise<TemplateList[]> {
    const searchParams = new URLSearchParams();
    searchParams.append('q', request.query);
    
    if (request.filters) {
      Object.entries(request.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }

    return this.request<TemplateList[]>(`/api/v2/orchestrator/search/?${searchParams.toString()}`);
  }

  async getOrchestratorTemplate(templateId: number): Promise<any> {
    return this.request<any>(`/api/v2/orchestrator/template/${templateId}/`);
  }

  async getOrchestratorTemplateByName(templateName: string): Promise<any> {
    return this.request<any>(`/api/v2/orchestrator/template/?name=${encodeURIComponent(templateName)}`);
  }

  // Enhanced methods with advanced prompt engineering
  async optimizePromptAdvanced(request: AdvancedOptimizationRequest): Promise<AdvancedOptimizationResponse> {
    if (!request.prompt?.trim()) {
      throw new Error('Prompt is required for optimization');
    }

    const startTime = Date.now();
    const sessionId = `opt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Build optimization request
    const optimizationReq: OptimizationRequest = {
      originalPrompt: request.prompt.trim(),
      taskType: request.task_type || 'general',
      complexity: request.complexity,
      context: request.context,
      targetModel: request.target_model || 'gpt-4'
    };

    // Select methodology if not specified
    const methodology = request.methodology
      ? request.methodology
      : MethodologySelector.selectBestMethodology(optimizationReq).id;

    // Run optimization based on methodology
    let optimizationResult: OptimizationResult;

    if (methodology === 'graph_rag' || request.use_graph_rag) {
      // Use GraphRAG methodology
      const graphRAGEngine = new GraphRAGEngine();

      // Build sample knowledge graph (in production, this would be pre-built)
      await graphRAGEngine.buildGraphFromDocuments([
        `Knowledge about ${request.task_type}`,
        `Context: ${request.context || 'General knowledge'}`,
        ...(request.knowledge_domains || [])
      ]);

      optimizationResult = await graphRAGEngine.synthesizePrompt(optimizationReq, request.graph_query);
    } else if (methodology === 'mipro') {
      const miproSession = await MiPROEngine.optimize(optimizationReq);
      optimizationResult = miproSession.finalResult;
    } else {
      // Use other methodologies
      optimizationResult = await this.runStandardOptimization(optimizationReq, methodology);
    }

    // Validate optimization result
    if (!optimizationResult || !optimizationResult.optimizedPrompt) {
      throw new Error('Optimization failed to produce valid results');
    }

    // Continue with rest of optimization
    try {
      // Generate wow effects
      let audioResult: GeneratedAudio | undefined;
      if (request.generate_audio) {
        const audioRequest: AudioGenerationRequest = {
          optimizedPrompt: optimizationResult.optimizedPrompt,
          originalPrompt: request.prompt,
          optimizationResult,
          voiceStyle: 'professional',
          duration: 'medium',
          includeComparison: true
        };
        audioResult = await AudioGenerator.generateAudio(audioRequest);
      }

      // Calculate wow metrics
      const wowMetrics = WowMeter.calculateWowScore({
        prompt: {
          original: request.prompt,
          optimized: optimizationResult.optimizedPrompt,
          result: optimizationResult
        },
        audio: audioResult
      });

      return {
        optimization: optimizationResult,
        audio: audioResult,
        wow_metrics: wowMetrics,
        session_id: sessionId
      };
    } catch (error) {
      console.error('Optimization post-processing failed:', error);
      // Return basic result without wow effects
      return {
        optimization: optimizationResult,
        wow_metrics: {
          overall: 5,
          breakdown: { improvement: 5, innovation: 5, practicality: 5, presentation: 5, surprise: 5 },
          factors: [],
          recommendations: []
        },
        session_id: sessionId
      };
    }
  }

  async getQuickWowAssessment(request: QuickWowRequest): Promise<QuickWowResponse> {
    // Quick analysis without full optimization
    const recommendations = await MiPROEngine.getQuickRecommendations(request.prompt);
    const estimatedScore = Math.min(10, 5 + (recommendations.estimatedImprovement / 20));
    const assessment = WowMeter.getQuickWowAssessment(estimatedScore);

    return {
      wow_score: estimatedScore,
      assessment,
      suggestions: recommendations.suggestions
    };
  }

  async getMiPROSession(sessionId: string): Promise<MiPROSession | null> {
    // In production, this would fetch from database
    // For now, return null as sessions aren't persisted
    return null;
  }

  private async runStandardOptimization(
    request: OptimizationRequest,
    methodology: string
  ): Promise<OptimizationResult> {
    // Simulate standard optimization
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Apply methodology-specific transformations
    let optimizedPrompt = request.originalPrompt;
    const improvements: string[] = [];

    switch (methodology) {
      case 'zero_shot_cot':
        optimizedPrompt += '\n\nLet\'s approach this step by step:';
        improvements.push('Added chain-of-thought reasoning');
        break;
      case 'few_shot':
        optimizedPrompt = `Here are some examples:\n[Example context]\n\n${optimizedPrompt}`;
        improvements.push('Added few-shot examples');
        break;
      case 'socratic_method':
        optimizedPrompt = `Guide me through this using questions: ${optimizedPrompt}`;
        improvements.push('Applied Socratic questioning method');
        break;
      default:
        improvements.push('Applied standard optimization techniques');
    }

    return {
      optimizedPrompt,
      methodology: methodology as any,
      improvements,
      qualityScore: Math.min(10, 6 + Math.random() * 3),
      estimatedPerformanceGain: Math.round(20 + Math.random() * 40),
      metadata: {
        timeToOptimize: 2,
        tokensAdded: Math.ceil((optimizedPrompt.length - request.originalPrompt.length) / 4),
        complexityIncrease: improvements.length
      }
    };
  }

  // Batch optimization for multiple prompts
  async optimizeBatch(requests: AdvancedOptimizationRequest[]): Promise<AdvancedOptimizationResponse[]> {
    const results = await Promise.all(
      requests.map(request => this.optimizePromptAdvanced(request))
    );
    return results;
  }
}

export const orchestratorService = new OrchestratorService();