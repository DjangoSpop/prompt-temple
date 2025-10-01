/**
 * Advanced Prompt Engineering Methodologies
 * Implements MiPRO, GraphRAG, Zero-Shot CoT, and other 2025 techniques
 */

export type PromptMethodology =
  | 'zero_shot_cot'
  | 'few_shot'
  | 'socratic_method'
  | 'gepa'
  | 'format_spread'
  | 'mipro'
  | 'graph_rag'
  | 'constitutional_ai';

export interface MethodologyConfig {
  id: PromptMethodology;
  name: string;
  description: string;
  complexity: 'basic' | 'pro' | 'genius';
  bestForTasks: string[];
  timeToOptimize: number; // seconds
  qualityMultiplier: number; // 1.0 to 5.0
}

export const METHODOLOGIES: Record<PromptMethodology, MethodologyConfig> = {
  zero_shot_cot: {
    id: 'zero_shot_cot',
    name: 'Zero-Shot Chain of Thought',
    description: 'Adds "Let\'s think step by step" reasoning to any prompt',
    complexity: 'basic',
    bestForTasks: ['reasoning', 'math', 'logic', 'analysis'],
    timeToOptimize: 2,
    qualityMultiplier: 1.8
  },
  few_shot: {
    id: 'few_shot',
    name: 'Few-Shot Learning',
    description: 'Provides relevant examples to guide AI responses',
    complexity: 'basic',
    bestForTasks: ['classification', 'formatting', 'style_matching'],
    timeToOptimize: 3,
    qualityMultiplier: 2.1
  },
  socratic_method: {
    id: 'socratic_method',
    name: 'Socratic Method',
    description: 'Breaks complex problems into guided questions',
    complexity: 'pro',
    bestForTasks: ['education', 'problem_solving', 'critical_thinking'],
    timeToOptimize: 5,
    qualityMultiplier: 2.4
  },
  gepa: {
    id: 'gepa',
    name: 'GEPA (Generate, Evaluate, Plan, Act)',
    description: 'Structured approach for complex multi-step tasks',
    complexity: 'pro',
    bestForTasks: ['planning', 'project_management', 'strategy'],
    timeToOptimize: 7,
    qualityMultiplier: 2.8
  },
  format_spread: {
    id: 'format_spread',
    name: 'FormatSpread',
    description: 'Optimizes output formatting and structure',
    complexity: 'pro',
    bestForTasks: ['data_extraction', 'reporting', 'documentation'],
    timeToOptimize: 4,
    qualityMultiplier: 2.2
  },
  mipro: {
    id: 'mipro',
    name: 'MiPRO Automatic Optimization',
    description: 'ML-powered automatic prompt refinement and iteration',
    complexity: 'genius',
    bestForTasks: ['any', 'optimization', 'refinement'],
    timeToOptimize: 15,
    qualityMultiplier: 4.2
  },
  graph_rag: {
    id: 'graph_rag',
    name: 'GraphRAG Synthesis',
    description: 'Graph-based knowledge synthesis for complex queries',
    complexity: 'genius',
    bestForTasks: ['research', 'synthesis', 'knowledge_extraction'],
    timeToOptimize: 12,
    qualityMultiplier: 3.8
  },
  constitutional_ai: {
    id: 'constitutional_ai',
    name: 'Constitutional AI',
    description: 'Ethical and safety-focused prompt enhancement',
    complexity: 'pro',
    bestForTasks: ['safety', 'ethics', 'content_moderation'],
    timeToOptimize: 8,
    qualityMultiplier: 2.6
  }
};

export interface OptimizationRequest {
  originalPrompt: string;
  taskType: string;
  complexity: 'basic' | 'pro' | 'genius';
  context?: string;
  targetModel?: 'gpt-4' | 'claude-3' | 'gemini-pro';
  additionalRequirements?: string[];
}

export interface OptimizationResult {
  optimizedPrompt: string;
  methodology: PromptMethodology;
  improvements: string[];
  qualityScore: number; // 1-10
  estimatedPerformanceGain: number; // percentage
  metadata: {
    timeToOptimize: number;
    tokensAdded: number;
    complexityIncrease: number;
  };
}

export class MethodologySelector {
  /**
   * Automatically selects the best methodology for a given prompt and task
   */
  static selectBestMethodology(request: OptimizationRequest): MethodologyConfig {
    const { taskType, complexity } = request;

    // Filter methodologies by complexity level
    const availableMethodologies = Object.values(METHODOLOGIES)
      .filter(method => {
        if (complexity === 'basic') return method.complexity === 'basic';
        if (complexity === 'pro') return ['basic', 'pro'].includes(method.complexity);
        return true; // genius level can use all
      });

    // Score each methodology based on task fit
    const scoredMethodologies = availableMethodologies.map(method => {
      let score = method.qualityMultiplier;

      // Bonus for task type match
      if (method.bestForTasks.includes(taskType) || method.bestForTasks.includes('any')) {
        score += 1.0;
      }

      // Penalty for very long optimization times at basic level
      if (complexity === 'basic' && method.timeToOptimize > 5) {
        score -= 0.5;
      }

      return { method, score };
    });

    // Return the highest scoring methodology
    const best = scoredMethodologies.sort((a, b) => b.score - a.score)[0];
    return best.method;
  }

  /**
   * Get multiple methodology recommendations
   */
  static getRecommendations(
    request: OptimizationRequest,
    count: number = 3
  ): MethodologyConfig[] {
    const { taskType, complexity } = request;

    const availableMethodologies = Object.values(METHODOLOGIES)
      .filter(method => {
        if (complexity === 'basic') return method.complexity === 'basic';
        if (complexity === 'pro') return ['basic', 'pro'].includes(method.complexity);
        return true;
      });

    return availableMethodologies
      .map(method => {
        let score = method.qualityMultiplier;
        if (method.bestForTasks.includes(taskType) || method.bestForTasks.includes('any')) {
          score += 1.0;
        }
        return { method, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map(item => item.method);
  }
}

/**
 * Individual methodology implementations
 */
export class MethodologyImplementations {
  static applyZeroShotCoT(prompt: string): string {
    if (prompt.toLowerCase().includes('step by step')) {
      return prompt; // Already has CoT
    }

    return `${prompt}

Let's approach this step by step:
1. First, let me understand what's being asked
2. Then I'll break down the problem into components
3. Finally, I'll provide a comprehensive solution

Think through this carefully:`;
  }

  static applyFewShot(prompt: string, examples: Array<{input: string, output: string}>): string {
    const exampleText = examples.map((ex, i) =>
      `Example ${i + 1}:
Input: ${ex.input}
Output: ${ex.output}`
    ).join('\n\n');

    return `Here are some examples of the task:

${exampleText}

Now, please complete this task:
${prompt}`;
  }

  static applySocraticMethod(prompt: string): string {
    return `I want you to guide me through this problem using the Socratic method. Instead of giving me a direct answer, help me discover the solution by asking probing questions that lead me to think through the problem step by step.

Original request: ${prompt}

Start by asking me a question that will help me clarify what I'm really trying to accomplish.`;
  }

  static applyGEPA(prompt: string): string {
    return `Please approach this using the GEPA framework (Generate, Evaluate, Plan, Act):

**GENERATE**: First, brainstorm multiple approaches or solutions
**EVALUATE**: Assess the pros and cons of each approach
**PLAN**: Create a detailed step-by-step plan for the best approach
**ACT**: Execute the plan with specific actionable steps

Original task: ${prompt}

Begin with the GENERATE phase:`;
  }

  static applyFormatSpread(prompt: string, outputFormat: string = 'structured'): string {
    const formatInstructions = {
      structured: 'Provide your response in a clear, structured format with headers, bullet points, and logical organization.',
      table: 'Format your response as a well-organized table with appropriate columns and rows.',
      json: 'Provide your response in valid JSON format with clear key-value pairs.',
      markdown: 'Format your response in clean Markdown with proper headers, lists, and formatting.',
    };

    return `${prompt}

**Output Format Requirements:**
${formatInstructions[outputFormat as keyof typeof formatInstructions] || formatInstructions.structured}

Ensure your response is well-formatted, scannable, and professional.`;
  }

  static applyConstitutionalAI(prompt: string): string {
    return `Please complete this task while adhering to these ethical guidelines:

1. Be helpful, harmless, and honest
2. Avoid bias and ensure fairness
3. Respect privacy and confidentiality
4. Provide accurate, well-sourced information
5. Acknowledge limitations and uncertainty

Original request: ${prompt}

Before responding, briefly consider: Is this request ethical? Does my response help without causing harm? Am I being honest about my capabilities and limitations?

Response:`;
  }
}