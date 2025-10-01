/**
 * Productivity Integrations API
 * Hooks for Zapier, Canva, Otter.ai, and other productivity tools
 */

export interface ZapierWebhook {
  id: string;
  name: string;
  webhook_url: string;
  trigger_events: ('optimization_complete' | 'audio_generated' | 'template_created')[];
  active: boolean;
  created_at: string;
}

export interface CanvaDesign {
  id: string;
  title: string;
  type: 'presentation' | 'document' | 'social_media' | 'infographic';
  url: string;
  thumbnail_url: string;
}

export interface OtterTranscription {
  id: string;
  title: string;
  transcript: string;
  duration: number; // seconds
  language: string;
  confidence_score: number;
  created_at: string;
}

export interface ProductivityEvent {
  type: 'optimization_complete' | 'audio_generated' | 'template_created' | 'wow_score_high';
  timestamp: string;
  data: any;
  session_id?: string;
  user_id?: string;
}

export class ProductivityIntegrations {
  private static readonly API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  /**
   * Zapier Integration Methods
   */
  static async registerZapierWebhook(webhook: Omit<ZapierWebhook, 'id' | 'created_at'>): Promise<ZapierWebhook> {
    const response = await fetch(`${this.API_BASE}/api/v2/integrations/zapier/webhooks/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: JSON.stringify(webhook)
    });

    if (!response.ok) {
      throw new Error(`Failed to register Zapier webhook: ${response.statusText}`);
    }

    return response.json();
  }

  static async triggerZapierWebhook(event: ProductivityEvent): Promise<void> {
    // Get active webhooks for this event type
    const webhooks = await this.getActiveWebhooks(event.type);

    // Trigger all matching webhooks in parallel
    await Promise.all(
      webhooks.map(webhook => this.sendWebhookPayload(webhook, event))
    );
  }

  private static async getActiveWebhooks(eventType: string): Promise<ZapierWebhook[]> {
    const response = await fetch(
      `${this.API_BASE}/api/v2/integrations/zapier/webhooks/?event_type=${eventType}&active=true`,
      {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch webhooks: ${response.statusText}`);
    }

    return response.json();
  }

  private static async sendWebhookPayload(webhook: ZapierWebhook, event: ProductivityEvent): Promise<void> {
    try {
      const payload = {
        event_type: event.type,
        timestamp: event.timestamp,
        data: event.data,
        session_id: event.session_id,
        user_id: event.user_id,
        webhook_id: webhook.id
      };

      await fetch(webhook.webhook_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'PromptForge/1.0'
        },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error(`Failed to trigger webhook ${webhook.id}:`, error);
      // In production, this would be logged to monitoring system
    }
  }

  /**
   * Canva Integration Methods
   */
  static async createCanvaDesign(
    type: CanvaDesign['type'],
    content: {
      title: string;
      description: string;
      optimized_prompt?: string;
      improvements?: string[];
    }
  ): Promise<CanvaDesign> {
    // This would integrate with Canva's API
    // For now, return a mock response
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockDesign: CanvaDesign = {
      id: `canva_${Date.now()}`,
      title: content.title,
      type,
      url: `https://www.canva.com/design/mock-design-${Date.now()}`,
      thumbnail_url: `https://via.placeholder.com/400x300.png?text=${encodeURIComponent(content.title)}`
    };

    // Trigger productivity event
    await this.triggerZapierWebhook({
      type: 'template_created',
      timestamp: new Date().toISOString(),
      data: {
        canva_design: mockDesign,
        content
      }
    });

    return mockDesign;
  }

  static async generateCanvaTemplateFromOptimization(
    optimizationResult: any,
    templateType: CanvaDesign['type'] = 'presentation'
  ): Promise<CanvaDesign> {
    const content = {
      title: `Optimized Prompt: ${optimizationResult.methodology}`,
      description: `Prompt optimization using ${optimizationResult.methodology} methodology. ${optimizationResult.estimatedPerformanceGain}% improvement achieved.`,
      optimized_prompt: optimizationResult.optimizedPrompt,
      improvements: optimizationResult.improvements
    };

    return this.createCanvaDesign(templateType, content);
  }

  /**
   * Otter.ai Integration Methods
   */
  static async transcribeAudio(audioUrl: string, title: string = 'PromptForge Audio'): Promise<OtterTranscription> {
    // This would integrate with Otter.ai's API
    // For now, return a mock transcription
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockTranscription: OtterTranscription = {
      id: `otter_${Date.now()}`,
      title,
      transcript: 'This is a mock transcription of the audio content. In production, this would be the actual transcription from Otter.ai.',
      duration: 180, // 3 minutes
      language: 'en',
      confidence_score: 0.94,
      created_at: new Date().toISOString()
    };

    return mockTranscription;
  }

  static async createOtterSummaryFromAudio(audioScript: any): Promise<{
    transcription: OtterTranscription;
    summary: string;
    keyPoints: string[];
  }> {
    const transcription = await this.transcribeAudio('', audioScript.title);

    // Generate summary from script
    const summary = this.generateAudioSummary(audioScript);
    const keyPoints = this.extractKeyPoints(audioScript);

    return {
      transcription,
      summary,
      keyPoints
    };
  }

  private static generateAudioSummary(audioScript: any): string {
    return `Audio summary: ${audioScript.title}. This ${Math.floor(audioScript.totalDuration / 60)}-minute overview covers prompt optimization techniques, improvements achieved, and practical implementation guidance.`;
  }

  private static extractKeyPoints(audioScript: any): string[] {
    return [
      `Methodology used: ${audioScript.segments[1]?.text?.slice(0, 50) || 'Advanced technique'}...`,
      `Key improvements: ${audioScript.segments.length} major enhancements`,
      `Estimated performance gain: Based on optimization metrics`,
      `Practical implementation: Ready-to-use optimized prompts`
    ];
  }

  /**
   * Generic Automation Methods
   */
  static async triggerAutomation(
    automationType: 'slack_notification' | 'email_summary' | 'calendar_block' | 'notion_note',
    data: any
  ): Promise<void> {
    const event: ProductivityEvent = {
      type: 'optimization_complete',
      timestamp: new Date().toISOString(),
      data: {
        automation_type: automationType,
        ...data
      }
    };

    await this.triggerZapierWebhook(event);
  }

  static async createSlackNotification(optimizationResult: any, channel: string = '#general'): Promise<void> {
    await this.triggerAutomation('slack_notification', {
      channel,
      message: `🚀 New prompt optimization complete! ${optimizationResult.estimatedPerformanceGain}% improvement using ${optimizationResult.methodology}`,
      optimization_result: optimizationResult
    });
  }

  static async scheduleCalendarBlock(
    title: string,
    duration: number = 30, // minutes
    description?: string
  ): Promise<void> {
    await this.triggerAutomation('calendar_block', {
      title,
      duration,
      description: description || 'Time blocked for reviewing prompt optimization results',
      start_time: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes from now
    });
  }

  static async createNotionPage(
    optimizationResult: any,
    databaseId?: string
  ): Promise<void> {
    await this.triggerAutomation('notion_note', {
      database_id: databaseId,
      title: `Prompt Optimization: ${optimizationResult.methodology}`,
      content: {
        original_prompt: optimizationResult.originalPrompt || '',
        optimized_prompt: optimizationResult.optimizedPrompt,
        improvements: optimizationResult.improvements,
        performance_gain: optimizationResult.estimatedPerformanceGain,
        quality_score: optimizationResult.qualityScore,
        methodology: optimizationResult.methodology,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Browser Extension Integration
   */
  static async sendToExtension(
    action: 'inject_prompt' | 'show_improvements' | 'copy_to_clipboard',
    data: any
  ): Promise<void> {
    // This would communicate with the browser extension
    if (typeof window !== 'undefined' && window.postMessage) {
      window.postMessage({
        source: 'promptforge',
        action,
        data
      }, '*');
    }
  }

  static async injectOptimizedPrompt(
    optimizedPrompt: string,
    target: 'chatgpt' | 'claude' | 'gemini' | 'generic'
  ): Promise<void> {
    await this.sendToExtension('inject_prompt', {
      prompt: optimizedPrompt,
      target_platform: target
    });
  }

  /**
   * Analytics and Tracking
   */
  static async trackProductivityEvent(event: ProductivityEvent): Promise<void> {
    try {
      await fetch(`${this.API_BASE}/api/v2/analytics/productivity/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(event)
      });
    } catch (error) {
      console.error('Failed to track productivity event:', error);
    }
  }

  private static getAuthToken(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token') || localStorage.getItem('auth_token') || '';
    }
    return '';
  }

  /**
   * Batch Operations
   */
  static async triggerMultipleIntegrations(
    optimizationResult: any,
    integrations: {
      zapier?: boolean;
      canva?: { type: CanvaDesign['type'] };
      slack?: { channel: string };
      notion?: { database_id?: string };
      calendar?: { duration: number };
    }
  ): Promise<{
    zapier?: boolean;
    canva?: CanvaDesign;
    slack?: boolean;
    notion?: boolean;
    calendar?: boolean;
  }> {
    const results: any = {};

    const promises = [];

    if (integrations.zapier) {
      promises.push(
        this.triggerZapierWebhook({
          type: 'optimization_complete',
          timestamp: new Date().toISOString(),
          data: optimizationResult
        }).then(() => { results.zapier = true; }).catch(() => { results.zapier = false; })
      );
    }

    if (integrations.canva) {
      promises.push(
        this.generateCanvaTemplateFromOptimization(optimizationResult, integrations.canva.type)
          .then(design => { results.canva = design; })
          .catch(() => { results.canva = null; })
      );
    }

    if (integrations.slack) {
      promises.push(
        this.createSlackNotification(optimizationResult, integrations.slack.channel)
          .then(() => { results.slack = true; })
          .catch(() => { results.slack = false; })
      );
    }

    if (integrations.notion) {
      promises.push(
        this.createNotionPage(optimizationResult, integrations.notion.database_id)
          .then(() => { results.notion = true; })
          .catch(() => { results.notion = false; })
      );
    }

    if (integrations.calendar) {
      promises.push(
        this.scheduleCalendarBlock(
          `Review: ${optimizationResult.methodology} Optimization`,
          integrations.calendar.duration
        ).then(() => { results.calendar = true; }).catch(() => { results.calendar = false; })
      );
    }

    await Promise.all(promises);
    return results;
  }
}