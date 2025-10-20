'use client';

import { motion } from 'framer-motion';
import { Zap, Loader2, AlertCircle } from 'lucide-react';
import { useTrial } from '@/hooks/useTrial';
import { cn } from '@/lib/utils';

interface TrialCreditsChipProps {
  className?: string;
  onUpgradeClick?: () => void;
}

/**
 * TrialCreditsChip - Display trial or credits balance
 *
 * Anonymous users: "Try Prompt Teme free: N left"
 * Authenticated users: "Credits: Y"
 * Low credits: Warning state
 */
export const TrialCreditsChip: React.FC<TrialCreditsChipProps> = ({
  className = '',
  onUpgradeClick
}) => {
  const { creditsRemaining, loading, error, isAnonymous } = useTrial();

  const isLow = creditsRemaining < 5;
  const isExhausted = creditsRemaining === 0;

  if (loading) {
    return (
      <div className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-cartouche",
        "bg-sand-50 border border-sand-100",
        className
      )}>
        <Loader2 className="h-3 w-3 animate-spin text-stone" />
        <span className="text-xs font-ui text-stone">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-cartouche",
        "bg-red-50 border border-red-200",
        className
      )}>
        <AlertCircle className="h-3 w-3 text-red-500" />
        <span className="text-xs font-ui text-red-600">Error loading credits</span>
      </div>
    );
  }

  return (
    <motion.button
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-cartouche transition-all",
        "font-ui text-xs",
        isExhausted
          ? "bg-red-50 border border-red-300 text-red-700 hover:bg-red-100"
          : isLow
            ? "bg-amber-50 border border-sun/30 text-umber hover:bg-amber-100"
            : "bg-sand-50 border border-sand-100 text-nile hover:bg-sand-100",
        onUpgradeClick && "cursor-pointer",
        className
      )}
      onClick={onUpgradeClick}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
      whileHover={onUpgradeClick ? { scale: 1.02 } : undefined}
      whileTap={onUpgradeClick ? { scale: 0.98 } : undefined}
    >
      <Zap className={cn(
        "h-3.5 w-3.5",
        isExhausted ? "text-red-500" : isLow ? "text-sun" : "text-sun"
      )} />

      <span className="font-medium">
        {isAnonymous ? (
          <>
            Try Prompt Teme free: <span className="font-semibold">{creditsRemaining}</span> left
          </>
        ) : (
          <>
            Credits: <span className="font-semibold">{creditsRemaining}</span>
          </>
        )}
      </span>

      {isExhausted && (
        <span className="ml-1 text-xs opacity-75">
          — Upgrade to continue
        </span>
      )}
    </motion.button>
  );
};
