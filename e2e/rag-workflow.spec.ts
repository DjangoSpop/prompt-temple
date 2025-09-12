/**
 * End-to-End Test: Complete RAG Workflow
 * Tests the full user journey: Login → Template → Optimization → Citations → Accept
 */

import { test, expect } from '@playwright/test';

test.describe('RAG Optimization Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Setup test environment
    await page.goto('/');
    
    // Mock API responses for consistent testing
    await page.route('**/api/v2/chat/health/', async (route) => {
      await route.fulfill({
        json: {
          status: 'healthy',
          message: 'All systems operational',
          config: { version: '1.0.0' }
        }
      });
    });

    await page.route('**/api/v2/billing/credits/', async (route) => {
      await route.fulfill({
        json: {
          remaining: 100,
          limit: 500,
          consumed_today: 25
        }
      });
    });

    await page.route('**/v1/ai-services/agent/index/status/', async (route) => {
      await route.fulfill({
        json: {
          status: 'available',
          document_count: 1000,
          last_updated: '2024-01-15T10:00:00Z'
        }
      });
    });
  });

  test('complete RAG optimization workflow', async ({ page }) => {
    // Step 1: Login (assuming test user is already authenticated)
    await page.goto('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');

    // Step 2: Navigate to Template Library
    await page.click('[data-testid="library-link"]');
    await expect(page.locator('h1')).toContainText('Library');

    // Step 3: Select a template
    const templateCard = page.locator('[data-testid="template-card"]').first();
    await templateCard.click();

    // Step 4: Navigate to Optimizer
    await page.click('[data-testid="optimize-button"]');
    await expect(page.locator('h1')).toContainText('Optimizer');

    // Step 5: Verify RAG Mode Toggle is present and functional
    await expect(page.locator('[data-testid="rag-mode-toggle"]')).toBeVisible();
    
    // Check that all modes are available
    await expect(page.locator('text=Standard')).toBeVisible();
    await expect(page.locator('text=RAG Fast')).toBeVisible();
    await expect(page.locator('text=RAG Deep')).toBeVisible();

    // Verify credit display
    await expect(page.locator('text=100/500')).toBeVisible();

    // Step 6: Select RAG Deep mode
    await page.click('[data-testid="mode-rag-deep"]');
    await expect(page.locator('[data-testid="mode-rag-deep"]')).toHaveClass(/ring-2/);

    // Step 7: Enter a prompt for optimization
    const promptInput = page.locator('[data-testid="prompt-input"]');
    await promptInput.fill('Help me create a marketing strategy for a new SaaS product');

    // Step 8: Start optimization
    await page.route('**/v1/ai-services/agent/optimize/', async (route) => {
      // Simulate optimization response with citations
      await route.fulfill({
        json: {
          id: 'opt-123',
          original_prompt: 'Help me create a marketing strategy for a new SaaS product',
          optimized_prompt: 'Create a comprehensive go-to-market strategy for a new SaaS product, including target audience analysis, competitive positioning, pricing strategy, and channel selection.',
          mode: 'rag_deep',
          citations: [
            {
              title: 'SaaS Marketing Best Practices',
              source: 'Marketing Research Journal',
              url: 'https://example.com/saas-marketing',
              score: 0.92,
              snippet: 'Successful SaaS marketing requires a deep understanding of customer acquisition costs...'
            },
            {
              title: 'Go-to-Market Strategies for Tech Startups',
              source: 'Startup Handbook',
              score: 0.87,
              snippet: 'The most effective go-to-market strategies combine product-led growth with targeted outreach...'
            }
          ],
          diff_summary: {
            improvements: [
              'Added specific deliverables (target audience analysis, competitive positioning)',
              'Included pricing strategy consideration',
              'Emphasized comprehensive approach'
            ],
            changes: [
              'Changed "marketing strategy" to "go-to-market strategy" for better precision',
              'Added specific components to make prompt more actionable'
            ],
            reasoning: 'The optimized prompt is more specific and actionable, providing clear deliverables for better AI responses.'
          },
          usage: {
            credits_consumed: 10,
            processing_time_ms: 15000,
            tokens_analyzed: 1250,
            citations_found: 2
          },
          quality_metrics: {
            clarity_score: 85,
            specificity_score: 92,
            actionability_score: 88,
            overall_score: 88
          },
          status: 'completed'
        }
      });
    });

    await page.click('[data-testid="optimize-button"]');

    // Step 9: Wait for optimization to complete and verify results
    await expect(page.locator('[data-testid="diff-summary"]')).toBeVisible({ timeout: 20000 });
    
    // Verify quality score is displayed
    await expect(page.locator('text=88/100')).toBeVisible();
    
    // Verify the optimized prompt is shown
    await expect(page.locator('text=Create a comprehensive go-to-market strategy')).toBeVisible();

    // Step 10: Verify Citations Panel
    await expect(page.locator('[data-testid="citations-panel"]')).toBeVisible();
    await expect(page.locator('text=2 sources')).toBeVisible();
    
    // Check individual citations
    await expect(page.locator('text=SaaS Marketing Best Practices')).toBeVisible();
    await expect(page.locator('text=92%')).toBeVisible(); // Citation score
    
    // Expand a citation to see details
    await page.click('[data-testid="citation-0"]');
    await expect(page.locator('text=Successful SaaS marketing requires')).toBeVisible();

    // Step 11: Verify Budget Display shows credit consumption
    await expect(page.locator('[data-testid="budget-display"]')).toBeVisible();
    // Credits should be reduced by 10 (100 - 10 = 90)
    await expect(page.locator('text=90/500')).toBeVisible();

    // Step 12: Accept the optimized prompt
    const acceptButton = page.locator('[data-testid="accept-optimization"]');
    await expect(acceptButton).toBeVisible();
    await acceptButton.click();

    // Verify acceptance feedback
    await expect(page.locator('text=Accepted!')).toBeVisible({ timeout: 5000 });

    // Step 13: Navigate to Workspace to verify saved conversation
    await page.click('[data-testid="workspace-link"]');
    await expect(page.locator('h1')).toContainText('Workspace');

    // Verify the optimized conversation appears in history
    await expect(page.locator('[data-testid="conversation-card"]').first()).toBeVisible();
    await expect(page.locator('text=RAG DEEP')).toBeVisible(); // Mode badge
  });

  test('should handle insufficient credits gracefully', async ({ page }) => {
    // Mock low credits
    await page.route('**/api/v2/billing/credits/', async (route) => {
      await route.fulfill({
        json: {
          remaining: 2,
          limit: 500,
          consumed_today: 498
        }
      });
    });

    await page.goto('/optimizer');

    // Verify RAG Deep mode is disabled
    const ragDeepCard = page.locator('[data-testid="mode-rag-deep"]');
    await expect(ragDeepCard).toHaveClass(/opacity-50/);
    await expect(ragDeepCard).toHaveClass(/cursor-not-allowed/);

    // Verify warning message
    await expect(page.locator('text=Insufficient Credits')).toBeVisible();

    // RAG Fast should still be available (requires 3 credits, have 2)
    await expect(page.locator('[data-testid="mode-rag-fast"]')).toHaveClass(/opacity-50/);

    // Standard mode should be available
    const standardCard = page.locator('[data-testid="mode-standard"]');
    await expect(standardCard).not.toHaveClass(/opacity-50/);
    await standardCard.click();
    
    // Should be able to proceed with standard optimization
    await expect(page.locator('[data-testid="optimize-button"]')).toBeEnabled();
  });

  test('should handle RAG index unavailability', async ({ page }) => {
    // Mock unavailable RAG index
    await page.route('**/v1/ai-services/agent/index/status/', async (route) => {
      await route.fulfill({
        json: {
          status: 'unavailable',
          document_count: 0,
          last_updated: '2024-01-15T10:00:00Z',
          error_message: 'Index is being rebuilt'
        }
      });
    });

    await page.goto('/optimizer');

    // Verify warning banner
    await expect(page.locator('text=RAG Index Unavailable')).toBeVisible();
    await expect(page.locator('text=Index is being rebuilt')).toBeVisible();

    // Both RAG modes should be disabled
    await expect(page.locator('[data-testid="mode-rag-fast"]')).toHaveClass(/opacity-50/);
    await expect(page.locator('[data-testid="mode-rag-deep"]')).toHaveClass(/opacity-50/);

    // Standard mode should still work
    await expect(page.locator('[data-testid="mode-standard"]')).not.toHaveClass(/opacity-50/);
  });

  test('should display health status in header', async ({ page }) => {
    await page.goto('/dashboard');

    // Verify health badge is present
    await expect(page.locator('[data-testid="health-badge"]')).toBeVisible();
    await expect(page.locator('text=Operational')).toBeVisible();

    // Click health badge to see details
    await page.click('[data-testid="health-badge"]');
    await expect(page.locator('text=System Status')).toBeVisible();
    await expect(page.locator('text=Chat Service')).toBeVisible();
  });

  test('should handle streaming chat with SSE', async ({ page }) => {
    // Mock SSE streaming response
    await page.route('**/api/v2/chat/completions/', async (route) => {
      const response = new Response(
        'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n' +
        'data: {"choices":[{"delta":{"content":" there!"}}]}\n\n' +
        'data: [DONE]\n\n',
        {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
          }
        }
      );
      await route.fulfill({ response });
    });

    await page.goto('/chat');

    // Send a message
    const chatInput = page.locator('[data-testid="chat-input"]');
    await chatInput.fill('Hello, how are you?');
    await page.click('[data-testid="send-button"]');

    // Verify streaming response appears
    await expect(page.locator('text=Hello there!')).toBeVisible({ timeout: 10000 });

    // Verify message is marked as completed
    const messageElement = page.locator('[data-testid="chat-message"]').last();
    await expect(messageElement).not.toHaveClass(/processing/);
  });
});

test.describe('Performance Tests', () => {
  test('SSE connection should be fast', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/chat');
    
    // Wait for health check to complete
    await expect(page.locator('[data-testid="health-badge"]')).toBeVisible();
    
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    // Should load within 2 seconds
    expect(loadTime).toBeLessThan(2000);
  });

  test('RAG optimization should complete within reasonable time', async ({ page }) => {
    await page.goto('/optimizer');
    
    const startTime = Date.now();
    
    // Mock a realistic response time
    await page.route('**/v1/ai-services/agent/optimize/', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second delay
      await route.fulfill({
        json: {
          id: 'test',
          original_prompt: 'test',
          optimized_prompt: 'optimized test',
          citations: [],
          status: 'completed'
        }
      });
    });

    await page.fill('[data-testid="prompt-input"]', 'Test prompt');
    await page.click('[data-testid="optimize-button"]');
    
    await expect(page.locator('[data-testid="diff-summary"]')).toBeVisible({ timeout: 10000 });
    
    const endTime = Date.now();
    const optimizationTime = endTime - startTime;
    
    // Should complete within 10 seconds for fast mode
    expect(optimizationTime).toBeLessThan(10000);
  });
});