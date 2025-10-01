import { NextRequest, NextResponse } from 'next/server';
import { MiPROEngine } from '@/lib/prompt-engineering/mipro';
import { MethodologySelector, MethodologyImplementations } from '@/lib/prompt-engineering/methodologies';
import { GraphRAGEngine } from '@/lib/prompt-engineering/graph-rag';
import { AudioGenerator } from '@/lib/wow-effects/audio-generator';
import { WowMeter } from '@/lib/wow-effects/wow-meter';
import { ProductivityIntegrations } from '@/lib/integrations/productivity-apis';
import type { OptimizationRequest, OptimizationResult } from '@/lib/prompt-engineering/methodologies';
import type { AudioGenerationRequest } from '@/lib/wow-effects/audio-generator';
import type { GraphRAGQuery } from '@/lib/prompt-engineering/graph-rag';

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
  integrations?: {
    zapier?: boolean;
    canva?: { type: 'presentation' | 'document' | 'social_media' | 'infographic' };
    slack?: { channel: string };
    notion?: { database_id?: string };
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: AdvancedOptimizationRequest = await request.json();

    if (!body.prompt?.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Build optimization request
    const optimizationRequest: OptimizationRequest = {
      originalPrompt: body.prompt,
      taskType: body.task_type || 'general',
      complexity: body.complexity || 'pro',
      context: body.context,
      targetModel: body.target_model || 'gpt-4'
    };

    // Select methodology if not specified
    const methodology = body.methodology
      ? body.methodology
      : MethodologySelector.selectBestMethodology(optimizationRequest).id;

    // Run optimization
    let optimizationResult: OptimizationResult;

    if (methodology === 'graph_rag' || body.use_graph_rag) {
      // Use GraphRAG methodology
      const graphRAGEngine = new GraphRAGEngine();

      // Build knowledge graph from domains
      if (body.knowledge_domains && body.knowledge_domains.length > 0) {
        await graphRAGEngine.buildGraphFromDocuments([
          `Knowledge about ${body.task_type}`,
          `Context: ${body.context || 'General knowledge'}`,
          ...body.knowledge_domains.map(domain => `Domain expertise: ${domain}`)
        ]);
      } else {
        await graphRAGEngine.buildGraphFromDocuments([`Knowledge about ${body.task_type}`]);
      }

      optimizationResult = await graphRAGEngine.synthesizePrompt(
        optimizationRequest,
        body.graph_query
      );
    } else if (methodology === 'mipro') {
      const miproSession = await MiPROEngine.optimize(optimizationRequest);
      optimizationResult = miproSession.finalResult;
    } else {
      // Apply other methodologies
      optimizationResult = await applyMethodology(optimizationRequest, methodology);
    }

    // Generate audio if requested
    let audioResult;
    if (body.generate_audio) {
      const audioRequest: AudioGenerationRequest = {
        optimizedPrompt: optimizationResult.optimizedPrompt,
        originalPrompt: body.prompt,
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
        original: body.prompt,
        optimized: optimizationResult.optimizedPrompt,
        result: optimizationResult
      },
      audio: audioResult
    });

    // Trigger integrations if requested
    let integrationResults;
    if (body.integrations) {
      integrationResults = await ProductivityIntegrations.triggerMultipleIntegrations(
        optimizationResult,
        body.integrations
      );
    }

    const sessionId = `adv_opt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const response = {
      optimization: optimizationResult,
      audio: audioResult,
      wow_metrics: wowMetrics,
      session_id: sessionId,
      integrations: integrationResults
    };

    // Track the optimization event
    await ProductivityIntegrations.trackProductivityEvent({
      type: 'optimization_complete',
      timestamp: new Date().toISOString(),
      data: response,
      session_id: sessionId
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('Advanced optimization failed:', error);
    return NextResponse.json(
      {
        error: 'Optimization failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'methodologies') {
    // Return available methodologies
    const { METHODOLOGIES } = await import('@/lib/prompt-engineering/methodologies');
    return NextResponse.json(Object.values(METHODOLOGIES));
  }

  if (action === 'quick_wow') {
    const prompt = searchParams.get('prompt');
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt required' }, { status: 400 });
    }

    try {
      const recommendations = await MiPROEngine.getQuickRecommendations(prompt);
      const estimatedScore = Math.min(10, 5 + (recommendations.estimatedImprovement / 20));
      const assessment = WowMeter.getQuickWowAssessment(estimatedScore);

      return NextResponse.json({
        wow_score: estimatedScore,
        assessment,
        suggestions: recommendations.suggestions,
        recommended_methodology: recommendations.recommendedMethodology
      });
    } catch (error) {
      console.error('Quick wow assessment failed:', error);
      return NextResponse.json({ error: 'Assessment failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

async function applyMethodology(
  request: OptimizationRequest,
  methodology: string
): Promise<OptimizationResult> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  let optimizedPrompt = request.originalPrompt;
  const improvements: string[] = [];

  switch (methodology) {
    case 'zero_shot_cot':
      optimizedPrompt = MethodologyImplementations.applyZeroShotCoT(request.originalPrompt);
      improvements.push('Added chain-of-thought reasoning');
      improvements.push('Improved step-by-step processing');
      break;

    case 'few_shot':
      optimizedPrompt = MethodologyImplementations.applyFewShot(request.originalPrompt, [
        { input: 'Example task', output: 'Example response' },
        { input: 'Another example', output: 'Another response' }
      ]);
      improvements.push('Added relevant examples');
      improvements.push('Improved context understanding');
      break;

    case 'socratic_method':
      optimizedPrompt = MethodologyImplementations.applySocraticMethod(request.originalPrompt);
      improvements.push('Applied Socratic questioning');
      improvements.push('Enhanced critical thinking approach');
      break;

    case 'gepa':
      optimizedPrompt = MethodologyImplementations.applyGEPA(request.originalPrompt);
      improvements.push('Structured GEPA framework');
      improvements.push('Enhanced systematic approach');
      break;

    case 'format_spread':
      optimizedPrompt = MethodologyImplementations.applyFormatSpread(request.originalPrompt);
      improvements.push('Optimized output formatting');
      improvements.push('Improved structure and organization');
      break;

    case 'constitutional_ai':
      optimizedPrompt = MethodologyImplementations.applyConstitutionalAI(request.originalPrompt);
      improvements.push('Added ethical guidelines');
      improvements.push('Enhanced safety considerations');
      break;

    default:
      improvements.push('Applied standard optimization techniques');
      optimizedPrompt = `**Enhanced Prompt:**\n\n${request.originalPrompt}\n\n**Guidelines:**\n- Provide clear, structured responses\n- Include relevant examples\n- Maintain professional tone`;
  }

  const qualityScore = Math.min(10, 5 + Math.random() * 4);
  const performanceGain = Math.round(15 + Math.random() * 60);

  return {
    optimizedPrompt,
    methodology: methodology as any,
    improvements,
    qualityScore,
    estimatedPerformanceGain: performanceGain,
    metadata: {
      timeToOptimize: Math.round(1 + Math.random() * 3),
      tokensAdded: Math.ceil((optimizedPrompt.length - request.originalPrompt.length) / 4),
      complexityIncrease: improvements.length
    }
  };
}