/**
 * Diff Summary Component
 * Shows the differences between original and optimized prompts
 * Includes "Accept as Best Prompt" action button
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle2, 
  ArrowRight, 
  Lightbulb, 
  TrendingUp, 
  Copy,
  Download,
  Share2
} from 'lucide-react';
import { RAGOptimizationResult } from '@/lib/hooks/useRAG';
import { cn } from '@/lib/utils';

interface DiffSummaryProps {
  result: RAGOptimizationResult;
  onAcceptOptimization?: (optimizedPrompt: string) => void;
  onCopyPrompt?: (prompt: string) => void;
  onExportResult?: (result: RAGOptimizationResult) => void;
  className?: string;
}

export const DiffSummary: React.FC<DiffSummaryProps> = ({
  result,
  onAcceptOptimization,
  onCopyPrompt,
  onExportResult,
  className
}) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState<'original' | 'optimized' | null>(null);

  // Guard clause for undefined result
  if (!result) {
    return (
      <Card className={`w-full ${className || ''}`}>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            No optimization result available
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleAcceptOptimization = () => {
    onAcceptOptimization?.(result.optimized_prompt);
    setIsAccepted(true);
    setTimeout(() => setIsAccepted(false), 3000);
  };

  const handleCopyPrompt = async (prompt: string, type: 'original' | 'optimized') => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedPrompt(type);
      onCopyPrompt?.(prompt);
      setTimeout(() => setCopiedPrompt(null), 2000);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
    }
  };

  const getQualityScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };


  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Optimization Results
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getQualityScoreColor(result?.quality_metrics?.overall_score || 0)}>
              {Math.round(result?.quality_metrics?.overall_score || 0)}/100
            </Badge>
            <Badge variant="secondary">
              {result.mode.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quality Metrics */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Quality Assessment
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries({
              'Clarity': result?.quality_metrics?.clarity_score || 0,
              'Specificity': result?.quality_metrics?.specificity_score || 0,
              'Actionability': result?.quality_metrics?.actionability_score || 0,
              'Overall': result?.quality_metrics?.overall_score || 0
            }).map(([metric, score]) => (
              <div key={metric} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-700">
                  {Math.round(score)}
                </div>
                <div className="text-xs text-gray-500">{metric}</div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Improvements Summary */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Key Improvements
          </h4>
          
          {result.diff_summary.improvements.length > 0 ? (
            <ul className="space-y-2">
              {result.diff_summary.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{improvement}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No specific improvements identified</p>
          )}
        </div>

        <Separator />

        {/* Changes Made */}
        {result.diff_summary.changes.length > 0 && (
          <>
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Changes Made
              </h4>
              
              <ul className="space-y-2">
                {result.diff_summary.changes.map((change, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{change}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />
          </>
        )}

        {/* Reasoning */}
        {result.diff_summary.reasoning && (
          <>
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Reasoning</h4>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg">
                {result.diff_summary.reasoning}
              </p>
            </div>

            <Separator />
          </>
        )}

        {/* Prompt Comparison */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Prompt Comparison</h4>
          
          <div className="grid gap-4">
            {/* Original Prompt */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Original Prompt
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyPrompt(result.original_prompt, 'original')}
                  className="h-7 text-xs"
                >
                  {copiedPrompt === 'original' ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {result.original_prompt}
                </p>
              </div>
            </div>

            {/* Optimized Prompt */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Optimized Prompt
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyPrompt(result.optimized_prompt, 'optimized')}
                  className="h-7 text-xs"
                >
                  {copiedPrompt === 'optimized' ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {result.optimized_prompt}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Usage Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-lg font-semibold text-gray-700">
              {result.usage.credits_consumed}
            </div>
            <div className="text-xs text-gray-500">Credits Used</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-semibold text-gray-700">
              {Math.round(result.usage.processing_time_ms / 1000)}s
            </div>
            <div className="text-xs text-gray-500">Processing Time</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-semibold text-gray-700">
              {result.usage.tokens_analyzed.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Tokens Analyzed</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-semibold text-gray-700">
              {result.usage.citations_found}
            </div>
            <div className="text-xs text-gray-500">Citations Found</div>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={handleAcceptOptimization}
              disabled={isAccepted}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isAccepted ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Accepted!
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Accept as Best Prompt
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => onExportResult?.(result)}
              size="sm"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Prompt Optimization Results',
                    text: `Original: ${result.original_prompt}\n\nOptimized: ${result.optimized_prompt}`,
                  });
                }
              }}
              size="sm"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiffSummary;