'use client';

import { motion } from 'framer-motion';
import { Check, Copy, ArrowRight, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizationResult {
  original_prompt: string;
  optimized_prompt: string;
  improvements: string[];
  confidence: number;
  processing_time_ms?: number;
}

interface OptimizationResultPanelProps {
  result: OptimizationResult;
  onAccept?: (optimizedPrompt: string) => void;
  onClose?: () => void;
  className?: string;
}

/**
 * OptimizationResultPanel - Side-by-side prompt comparison
 *
 * Bound to optimization_result WebSocket event
 * Shows:
 * - Original vs Optimized (side-by-side)
 * - Quality metrics (improvements list)
 * - Accept button to use optimized version
 * - Copy/export functionality
 */
export const OptimizationResultPanel: React.FC<OptimizationResultPanelProps> = ({
  result,
  onAccept,
  onClose,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleAccept = () => {
    onAccept?.(result.optimized_prompt);
  };

  const confidenceColor = result.confidence >= 80
    ? 'text-green-600 bg-green-50 border-green-200'
    : result.confidence >= 60
      ? 'text-amber-600 bg-amber-50 border-amber-200'
      : 'text-orange-600 bg-orange-50 border-orange-200';

  return (
    <motion.div
      className={cn(
        "bg-white border-2 border-sun/30 rounded-temple shadow-xl",
        "overflow-hidden",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-sand-50 to-sand-100 border-b border-sand-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-sun" />
          <h3 className="font-heading font-semibold text-nile">Prompt Optimization Result</h3>
        </div>

        <div className="flex items-center gap-3">
          {/* Confidence Badge */}
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-ui font-medium border",
            confidenceColor
          )}>
            {result.confidence}% confidence
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="text-stone hover:text-nile transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid md:grid-cols-2 gap-4 p-4">
        {/* Original Prompt */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-ui font-semibold text-stone">Original Prompt</h4>
            <button
              onClick={() => handleCopy(result.original_prompt)}
              className="text-xs font-ui text-stone hover:text-nile transition-colors flex items-center gap-1"
            >
              <Copy className="h-3 w-3" />
              Copy
            </button>
          </div>
          <div className="bg-sand-50 border border-sand-100 rounded-temple p-4 min-h-[120px] font-ui text-sm text-nile/80 whitespace-pre-wrap">
            {result.original_prompt}
          </div>
        </div>

        {/* Optimized Prompt */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-ui font-semibold text-nile flex items-center gap-1">
              Optimized Prompt
              <ArrowRight className="h-3 w-3 text-sun" />
            </h4>
            <button
              onClick={() => handleCopy(result.optimized_prompt)}
              className={cn(
                "text-xs font-ui transition-colors flex items-center gap-1",
                copied ? "text-green-600" : "text-nile hover:text-sun"
              )}
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="bg-gradient-to-br from-sun/5 to-sand-50 border-2 border-sun/30 rounded-temple p-4 min-h-[120px] font-ui text-sm text-nile whitespace-pre-wrap">
            {result.optimized_prompt}
          </div>
        </div>
      </div>

      {/* Improvements */}
      <div className="px-4 pb-4">
        <h4 className="text-sm font-ui font-semibold text-stone mb-2">Key Improvements</h4>
        <ul className="space-y-1.5">
          {result.improvements.map((improvement, index) => (
            <motion.li
              key={index}
              className="flex items-start gap-2 text-xs font-ui text-umber"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.15 }}
            >
              <Check className="h-4 w-4 text-sun flex-shrink-0 mt-0.5" />
              <span>{improvement}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      {onAccept && (
        <div className="border-t border-sand-200 p-4 bg-sand-50/50 flex items-center justify-between">
          {result.processing_time_ms && (
            <span className="text-xs font-ui text-stone">
              Optimized in {result.processing_time_ms}ms
            </span>
          )}

          <button
            onClick={handleAccept}
            className={cn(
              "ml-auto flex items-center gap-2 px-4 py-2 rounded-cartouche",
              "bg-sun text-white font-ui font-medium text-sm",
              "hover:bg-sun-hover transition-all shadow-md hover:shadow-lg"
            )}
          >
            <Check className="h-4 w-4" />
            Use Optimized Prompt
          </button>
        </div>
      )}
    </motion.div>
  );
};
