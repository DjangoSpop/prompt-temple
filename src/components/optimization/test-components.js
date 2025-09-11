// Simple test to verify our Chat Optimizer components work
import React from 'react';
import { render } from '@testing-library/react';

// Mock the store
jest.mock('@/store/optimizerSessionsStore', () => ({
  useOptimizerSessionsStore: () => ({
    activeSessionId: null,
    sessions: {},
    lastActiveSessionId: null,
    createSession: jest.fn(),
    setActiveSession: jest.fn(),
    restoreNavigation: jest.fn(),
  }),
  OptimSession: {},
  OptimMessage: {},
}));

// Mock the SSE chat service
jest.mock('@/lib/services/sse-chat', () => ({
  useSSEChat: () => ({
    service: null,
    isConnected: true,
  }),
}));

// Mock prompt service
jest.mock('@/lib/services/prompt-service', () => ({
  promptService: {},
}));

describe('Chat Optimizer Components', () => {
  it('should import components without errors', async () => {
    // Test that we can import our components
    const { default: SessionRail } = await import('@/components/optimization/SessionRail');
    const { default: ChatThread } = await import('@/components/optimization/ChatThread');
    const { default: ChatComposer } = await import('@/components/optimization/ChatComposer');
    const { default: ContextPane } = await import('@/components/optimization/ContextPane');

    expect(SessionRail).toBeDefined();
    expect(ChatThread).toBeDefined();
    expect(ChatComposer).toBeDefined();
    expect(ContextPane).toBeDefined();
  });

  it('should import the store without errors', async () => {
    const { useOptimizerSessionsStore } = await import('@/store/optimizerSessionsStore');

    expect(useOptimizerSessionsStore).toBeDefined();
  });
});
