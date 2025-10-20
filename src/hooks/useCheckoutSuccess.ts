'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTrial } from './useTrial';

/**
 * useCheckoutSuccess - Handle Stripe checkout success
 *
 * On ?checkout=success:
 * - Refetch balance from /v1/billing/balance
 * - Show "Credits added" toast
 * - Clean up URL params
 */
export const useCheckoutSuccess = (onSuccess?: (credits: number) => void) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refetchBalance, creditsRemaining } = useTrial();

  useEffect(() => {
    const checkoutSuccess = searchParams?.get('checkout');

    if (checkoutSuccess === 'success') {
      // Refetch balance
      refetchBalance();

      // Call success callback
      onSuccess?.(creditsRemaining);

      // Clean up URL (remove ?checkout=success)
      const url = new URL(window.location.href);
      url.searchParams.delete('checkout');
      router.replace(url.pathname + url.search);
    }
  }, [searchParams, refetchBalance, creditsRemaining, onSuccess, router]);
};
