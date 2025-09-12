/**
 * RAG Mode Toggle Component
 * Allows switching between Standard, RAG Fast, and RAG Deep modes
 * Shows credit costs and validates availability
 */

'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Zap, Brain, Rocket, Coins, Clock, AlertCircle } from 'lucide-react';
import { useRAGMode } from '@/lib/hooks/useRAG';
import { cn } from '@/lib/utils';

interface RAGModeToggleProps {
  onModeChange?: (mode: 'standard' | 'rag_fast' | 'rag_deep') => void;
  className?: string;
  disabled?: boolean;
}

export const RAGModeToggle: React.FC<RAGModeToggleProps> = ({
  onModeChange,
  className,
  disabled = false
}) => {
  const { mode, setMode, canUseRAG, hasCredits, credits, indexStatus, modeInfo } = useRAGMode();

  const handleModeChange = (newMode: typeof mode) => {
    try {
      setMode(newMode);
      onModeChange?.(newMode);
    } catch (error) {
      console.error('Failed to change RAG mode:', error);
      // Could show a toast notification here
    }
  };

  const getModeIcon = (modeType: typeof mode) => {
    switch (modeType) {
      case 'standard':
        return <Zap className="h-4 w-4" />;
      case 'rag_fast':
        return <Rocket className="h-4 w-4" />;
      case 'rag_deep':
        return <Brain className="h-4 w-4" />;
    }
  };

  const getModeColor = (modeType: typeof mode) => {
    switch (modeType) {
      case 'standard':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'rag_fast':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'rag_deep':
        return 'bg-purple-50 border-purple-200 text-purple-700';
    }
  };

  const canUseMode = (modeType: typeof mode) => {
    if (modeType === 'standard') return true;
    if (!canUseRAG) return false;
    if (!hasCredits) return false;
    if (modeType === 'rag_deep' && credits && credits.remaining < 10) return false;
    return true;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header with credits info */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Optimization Mode</h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Coins className="h-3 w-3" />
            {credits ? `${credits.remaining}/${credits.limit}` : 'Loading...'}
          </Badge>
        </div>
      </div>

      {/* Index Status Warning */}
      {!canUseRAG && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-800">
                  RAG Index {indexStatus?.status === 'building' ? 'Building' : 'Unavailable'}
                </p>
                <p className="text-xs text-amber-700">
                  {indexStatus?.status === 'building' 
                    ? `Building in progress... ${indexStatus.build_progress || 0}% complete`
                    : 'RAG modes require an available knowledge index. Please contact support.'
                  }
                </p>
                {indexStatus?.document_count && (
                  <p className="text-xs text-amber-600">
                    Documents indexed: {indexStatus.document_count.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {(Object.entries(modeInfo) as [keyof typeof modeInfo, typeof modeInfo[keyof typeof modeInfo]][]).map(([modeType, info]) => {
          const isSelected = mode === modeType;
          const isAvailable = canUseMode(modeType);
          
          return (
            <Card
              key={modeType}
              className={cn(
                "cursor-pointer transition-all duration-200",
                isSelected && "ring-2 ring-blue-500 ring-offset-2",
                !isAvailable && "opacity-50 cursor-not-allowed",
                !disabled && isAvailable && "hover:shadow-md",
                getModeColor(modeType)
              )}
              onClick={() => !disabled && isAvailable && handleModeChange(modeType)}
            >
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {/* Mode Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getModeIcon(modeType)}
                      <span className="font-medium">{info.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-white/50"
                      >
                        <Coins className="h-3 w-3 mr-1" />
                        {info.credits}
                      </Badge>
                    </div>
                  </div>

                  {/* Mode Description */}
                  <p className="text-xs text-gray-600">
                    {info.description}
                  </p>

                  {/* Mode Stats */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="h-3 w-3" />
                      {info.speed}
                    </div>
                    {!isAvailable && modeType !== 'standard' && (
                      <div className="flex items-center gap-1 text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        Unavailable
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Credit Warning */}
      {!hasCredits && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-800">
                  Insufficient Credits
                </p>
                <p className="text-xs text-red-700">
                  You need credits to use RAG modes. Visit your billing page to add more credits.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mode Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>
          <strong>Standard:</strong> Fast optimization using built-in knowledge
        </p>
        <p>
          <strong>RAG Fast:</strong> Quick retrieval with relevant citations (3x cost)
        </p>
        <p>
          <strong>RAG Deep:</strong> Comprehensive research with extensive analysis (10x cost)
        </p>
      </div>
    </div>
  );
};

export default RAGModeToggle;