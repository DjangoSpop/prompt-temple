/**
 * Wow Meter Scoring System
 * Calculates "wow factor" for prompt optimizations and generated content
 */

import type { OptimizationResult } from '../prompt-engineering/methodologies';
import type { GeneratedAudio } from './audio-generator';

export interface WowMetrics {
  overall: number; // 1-10 overall wow score
  breakdown: {
    improvement: number; // How much better the prompt got
    innovation: number; // How advanced/creative the technique is
    practicality: number; // How useful in real-world scenarios
    presentation: number; // How well it's explained/demonstrated
    surprise: number; // Unexpected insights or features
  };
  factors: WowFactor[];
  recommendations: string[];
}

export interface WowFactor {
  category: 'technical' | 'creative' | 'practical' | 'educational';
  description: string;
  impact: 'low' | 'medium' | 'high' | 'exceptional';
  score: number; // 1-10
}

export interface WowAnalysis {
  prompt?: {
    original: string;
    optimized: string;
    result: OptimizationResult;
  };
  audio?: GeneratedAudio;
  video?: any; // Will be defined when video system is implemented
  userFeedback?: {
    rating: number;
    comments: string[];
  };
}

export class WowMeter {
  private static readonly SCORING_WEIGHTS = {
    improvement: 0.25,    // 25% - How much the prompt improved
    innovation: 0.20,     // 20% - How advanced the technique is
    practicality: 0.25,   // 25% - Real-world usefulness
    presentation: 0.20,   // 20% - Quality of explanation/demo
    surprise: 0.10        // 10% - Unexpected wow moments
  };

  private static readonly METHODOLOGY_INNOVATION_SCORES = {
    zero_shot_cot: 6,
    few_shot: 5,
    socratic_method: 7,
    gepa: 7,
    format_spread: 6,
    mipro: 9,
    graph_rag: 9,
    constitutional_ai: 8
  };

  /**
   * Calculate wow score for a complete optimization experience
   */
  static calculateWowScore(analysis: WowAnalysis): WowMetrics {
    if (!analysis || (!analysis.prompt && !analysis.audio)) {
      return this.getDefaultMetrics();
    }

    try {
      const breakdown = {
        improvement: this.scoreImprovement(analysis),
        innovation: this.scoreInnovation(analysis),
        practicality: this.scorePracticality(analysis),
        presentation: this.scorePresentation(analysis),
        surprise: this.scoreSurprise(analysis)
      };

      const overall = this.calculateOverallScore(breakdown);
      const factors = this.identifyWowFactors(analysis, breakdown);
      const recommendations = this.generateRecommendations(breakdown, factors);

      return {
        overall,
        breakdown,
        factors,
        recommendations
      };
    } catch (error) {
      console.error('Wow score calculation failed:', error);
      return this.getDefaultMetrics();
    }
  }

  private static scoreImprovement(analysis: WowAnalysis): number {
    if (!analysis.prompt) return 5;

    const { result } = analysis.prompt;
    let score = 5; // Base score

    // Performance gain impact
    if (result.estimatedPerformanceGain >= 80) score = 10;
    else if (result.estimatedPerformanceGain >= 60) score = 9;
    else if (result.estimatedPerformanceGain >= 40) score = 8;
    else if (result.estimatedPerformanceGain >= 25) score = 7;
    else if (result.estimatedPerformanceGain >= 15) score = 6;

    // Quality score bonus
    if (result.qualityScore >= 9) score += 1;
    else if (result.qualityScore >= 8) score += 0.5;

    // Number of improvements bonus
    if (result.improvements.length >= 5) score += 0.5;

    return Math.min(10, Math.max(1, score));
  }

  private static scoreInnovation(analysis: WowAnalysis): number {
    if (!analysis.prompt) return 5;

    const methodology = analysis.prompt.result.methodology;
    const baseScore = this.METHODOLOGY_INNOVATION_SCORES[methodology] || 5;

    let score = baseScore;

    // Bonus for advanced features
    if (analysis.audio) score += 1;
    if (analysis.video) score += 1;

    // Complex optimization bonus
    if (analysis.prompt.result.metadata.complexityIncrease >= 3) score += 0.5;

    return Math.min(10, Math.max(1, score));
  }

  private static scorePracticality(analysis: WowAnalysis): number {
    if (!analysis.prompt) return 5;

    let score = 6; // Base practical score

    const { result, original, optimized } = analysis.prompt;

    // Length appropriateness (not too verbose)
    const lengthRatio = optimized.length / original.length;
    if (lengthRatio <= 3) score += 1; // Reasonable increase
    else if (lengthRatio > 5) score -= 1; // Too verbose

    // Clear structure bonus
    if (optimized.includes('Requirements:') || optimized.includes('Context:')) score += 1;

    // Methodology practicality
    const practicalMethodologies = ['zero_shot_cot', 'few_shot', 'format_spread'];
    if (practicalMethodologies.includes(result.methodology)) score += 1;

    // Time to optimize penalty for complex methods
    if (result.metadata.timeToOptimize > 30) score -= 0.5;

    return Math.min(10, Math.max(1, score));
  }

  private static scorePresentation(analysis: WowAnalysis): number {
    let score = 5; // Base presentation score

    // Audio content bonus
    if (analysis.audio) {
      score += 2;
      if (analysis.audio.script.segments.length >= 5) score += 0.5;
      if (analysis.audio.script.metadata.complexity === 'advanced') score += 0.5;
    }

    // Video content bonus (when implemented)
    if (analysis.video) score += 2;

    // Detailed explanations bonus
    if (analysis.prompt?.result.improvements.length >= 4) score += 1;

    return Math.min(10, Math.max(1, score));
  }

  private static scoreSurprise(analysis: WowAnalysis): number {
    let score = 5; // Base surprise score

    if (!analysis.prompt) return score;

    const { result } = analysis.prompt;

    // Unexpected high performance gain
    if (result.estimatedPerformanceGain >= 100) score = 10;
    else if (result.estimatedPerformanceGain >= 75) score = 8;

    // Surprising methodology effectiveness
    if (result.methodology === 'zero_shot_cot' && result.qualityScore >= 8) score += 1;

    // Audio/video surprise factor
    if (analysis.audio && analysis.audio.wowScore >= 8) score += 1;

    // User feedback surprise
    if (analysis.userFeedback?.rating >= 9) score += 1;

    // Complex improvement with simple methodology
    if (['zero_shot_cot', 'few_shot'].includes(result.methodology) && result.estimatedPerformanceGain >= 50) {
      score += 1;
    }

    return Math.min(10, Math.max(1, score));
  }

  private static calculateOverallScore(breakdown: WowMetrics['breakdown']): number {
    const weightedScore = Object.entries(this.SCORING_WEIGHTS).reduce((total, [key, weight]) => {
      return total + (breakdown[key as keyof typeof breakdown] * weight);
    }, 0);

    return Math.round(weightedScore * 10) / 10; // Round to 1 decimal
  }

  private static identifyWowFactors(analysis: WowAnalysis, breakdown: WowMetrics['breakdown']): WowFactor[] {
    const factors: WowFactor[] = [];

    // Technical factors
    if (breakdown.innovation >= 8) {
      factors.push({
        category: 'technical',
        description: `Advanced ${analysis.prompt?.result.methodology} technique delivered exceptional results`,
        impact: 'exceptional',
        score: breakdown.innovation
      });
    }

    // Creative factors
    if (analysis.audio && analysis.audio.wowScore >= 8) {
      factors.push({
        category: 'creative',
        description: 'AI-generated audio summary with engaging storytelling',
        impact: 'high',
        score: analysis.audio.wowScore
      });
    }

    // Practical factors
    if (breakdown.practicality >= 8 && analysis.prompt?.result.estimatedPerformanceGain >= 40) {
      factors.push({
        category: 'practical',
        description: `${analysis.prompt.result.estimatedPerformanceGain}% performance improvement with practical implementation`,
        impact: breakdown.practicality >= 9 ? 'exceptional' : 'high',
        score: breakdown.practicality
      });
    }

    // Educational factors
    if (breakdown.presentation >= 8) {
      factors.push({
        category: 'educational',
        description: 'Comprehensive explanation with clear before/after comparison',
        impact: 'high',
        score: breakdown.presentation
      });
    }

    return factors;
  }

  private static generateRecommendations(
    breakdown: WowMetrics['breakdown'],
    factors: WowFactor[]
  ): string[] {
    const recommendations: string[] = [];

    // Improvement recommendations
    if (breakdown.improvement < 7) {
      recommendations.push('Try more advanced methodologies like MiPRO for higher impact');
    }

    // Innovation recommendations
    if (breakdown.innovation < 7) {
      recommendations.push('Explore cutting-edge techniques like GraphRAG for innovative solutions');
    }

    // Practicality recommendations
    if (breakdown.practicality < 7) {
      recommendations.push('Focus on real-world applicability and concise optimizations');
    }

    // Presentation recommendations
    if (breakdown.presentation < 7) {
      recommendations.push('Add audio or video overviews to enhance the wow factor');
    }

    // Surprise recommendations
    if (breakdown.surprise < 6) {
      recommendations.push('Combine multiple techniques or try unexpected methodology combinations');
    }

    // Factor-based recommendations
    if (factors.length === 0) {
      recommendations.push('Aim for at least one exceptional factor to create memorable experiences');
    }

    return recommendations;
  }

  /**
   * Get wow score for prompt optimization only (without multimedia)
   */
  static getPromptWowScore(
    originalPrompt: string,
    optimizationResult: OptimizationResult
  ): number {
    const analysis: WowAnalysis = {
      prompt: {
        original: originalPrompt,
        optimized: optimizationResult.optimizedPrompt,
        result: optimizationResult
      }
    };

    const metrics = this.calculateWowScore(analysis);
    return metrics.overall;
  }

  /**
   * Get quick wow assessment for UI display
   */
  static getQuickWowAssessment(wowScore: number): {
    level: 'meh' | 'good' | 'great' | 'amazing' | 'mind-blowing';
    emoji: string;
    message: string;
    color: string;
  } {
    if (wowScore >= 9) {
      return {
        level: 'mind-blowing',
        emoji: '🤯',
        message: 'This is absolutely incredible!',
        color: 'text-purple-600'
      };
    } else if (wowScore >= 8) {
      return {
        level: 'amazing',
        emoji: '🚀',
        message: 'Outstanding results!',
        color: 'text-blue-600'
      };
    } else if (wowScore >= 7) {
      return {
        level: 'great',
        emoji: '✨',
        message: 'Really impressive work!',
        color: 'text-green-600'
      };
    } else if (wowScore >= 6) {
      return {
        level: 'good',
        emoji: '👍',
        message: 'Solid improvement!',
        color: 'text-yellow-600'
      };
    } else {
      return {
        level: 'meh',
        emoji: '🤔',
        message: 'There\'s room for more wow factor',
        color: 'text-gray-600'
      };
    }
  }

  /**
   * Get default metrics when calculation fails
   */
  private static getDefaultMetrics(): WowMetrics {
    return {
      overall: 5.0,
      breakdown: {
        improvement: 5.0,
        innovation: 5.0,
        practicality: 5.0,
        presentation: 5.0,
        surprise: 5.0
      },
      factors: [],
      recommendations: ['Try a more detailed prompt for better results']
    };
  }

  /**
   * Track user feedback to improve wow scoring
   */
  static recordUserFeedback(
    optimizationId: string,
    feedback: { rating: number; helpful: boolean; comments?: string }
  ): void {
    if (!optimizationId || !feedback) return;

    // In production, this would store feedback for ML model training
    console.log('User feedback recorded:', { optimizationId, feedback });
  }
}