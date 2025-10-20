'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/providers/AuthProvider';

interface TrialStatus {
  initialized: boolean;
  creditsRemaining: number;
  loading: boolean;
  error?: string;
}

/**
 * useTrial - Manage anonymous trial and credits
 *
 * For anonymous users:
 * - POST /v1/trial/init on first visit
 * - Display "Try Prompt Teme free: N left"
 *
 * For authenticated users:
 * - GET /v1/billing/balance
 * - Display "Credits: Y"
 */
export const useTrial = () => {
  const { user, isAuthenticated } = useAuth();
  const [status, setStatus] = useState<TrialStatus>({
    initialized: false,
    creditsRemaining: 0,
    loading: true,
  });

  const initTrial = useCallback(async () => {
    if (isAuthenticated || typeof window === 'undefined') return;

    // Check if trial already initialized
    const trialId = localStorage.getItem('trial_id');
    if (trialId) {
      const credits = parseInt(localStorage.getItem('trial_credits') || '0', 10);
      setStatus({
        initialized: true,
        creditsRemaining: credits,
        loading: false,
      });
      return;
    }

    try {
      setStatus(prev => ({ ...prev, loading: true }));

      const response = await fetch('/v1/trial/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Trial init failed: ${response.status}`);
      }

      const data = await response.json();

      // Store trial ID and credits
      localStorage.setItem('trial_id', data.trial_id || crypto.randomUUID());
      localStorage.setItem('trial_credits', String(data.credits_remaining || 10));

      setStatus({
        initialized: true,
        creditsRemaining: data.credits_remaining || 10,
        loading: false,
      });
    } catch (error) {
      console.error('Trial init error:', error);
      setStatus({
        initialized: false,
        creditsRemaining: 0,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to initialize trial',
      });
    }
  }, [isAuthenticated]);

  const fetchBalance = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      setStatus(prev => ({ ...prev, loading: true }));

      const token = localStorage.getItem('auth_token') || localStorage.getItem('access_token');
      const response = await fetch('/v1/billing/balance', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Balance fetch failed: ${response.status}`);
      }

      const data = await response.json();

      setStatus({
        initialized: true,
        creditsRemaining: data.credits || data.balance || 0,
        loading: false,
      });
    } catch (error) {
      console.error('Balance fetch error:', error);
      setStatus(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch balance',
      }));
    }
  }, [isAuthenticated, user]);

  const refetchBalance = useCallback(() => {
    if (isAuthenticated) {
      fetchBalance();
    }
  }, [isAuthenticated, fetchBalance]);

  // Initialize on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchBalance();
    } else {
      initTrial();
    }
  }, [isAuthenticated, initTrial, fetchBalance]);

  return {
    ...status,
    refetchBalance,
    isAnonymous: !isAuthenticated,
  };
};
