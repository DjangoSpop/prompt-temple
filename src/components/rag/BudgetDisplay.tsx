/**
 * Budget Display Component
 * Shows credit consumption, remaining balance, and spending controls
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Coins, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  CreditCard,
  Settings,
  RefreshCw
} from 'lucide-react';
import { useCredits } from '@/lib/hooks/useRAG';
import { cn } from '@/lib/utils';

interface BudgetDisplayProps {
  className?: string;
  onManageBilling?: () => void;
  onRefresh?: () => void;
  compact?: boolean;
}

export const BudgetDisplay: React.FC<BudgetDisplayProps> = ({
  className,
  onManageBilling,
  onRefresh,
  compact = false
}) => {
  const { data: credits, isLoading, error, refetch } = useCredits();

  const handleRefresh = () => {
    refetch();
    onRefresh?.();
  };

  const usagePercentage = credits 
    ? (((credits.limit || 0) - (credits.remaining || 0)) / (credits.limit || 1)) * 100 
    : 0;

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 bg-red-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getRemainingTimeEstimate = () => {
    if (!credits) return null;
    
    // Rough estimate based on current usage pattern
    const dailyUsage = credits?.consumed_today || 0;
    if (dailyUsage === 0) return 'Unlimited (at current rate)';
    
    const remainingDays = Math.floor((credits?.remaining || 0) / dailyUsage);
    if (remainingDays === 0) return 'Less than 1 day';
    if (remainingDays === 1) return '1 day';
    if (remainingDays < 7) return `${remainingDays} days`;
    if (remainingDays < 30) return `${Math.floor(remainingDays / 7)} weeks`;
    return `${Math.floor(remainingDays / 30)} months`;
  };

  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("w-full border-red-200 bg-red-50", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">Failed to load credits</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!credits) {
    return null;
  }

  if (compact) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">
                {(credits?.remaining || 0).toLocaleString()} credits
              </span>
              <Badge variant="outline" className={getUsageColor(usagePercentage)}>
                {Math.round(usagePercentage)}% used
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={onManageBilling}>
              <CreditCard className="h-3 w-3 mr-1" />
              Manage
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Credit Budget
          </div>
          <Button variant="ghost" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Credit Balance */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Available Credits</span>
            <span className="text-lg font-bold text-blue-600">
              {(credits?.remaining || 0).toLocaleString()}
            </span>
          </div>
          
          <Progress 
            value={100 - usagePercentage} 
            className="h-2"
            // Apply custom color based on usage
          />
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{(credits?.limit || 0) - (credits?.remaining || 0)} used</span>
            <span>{credits?.limit || 0} total</span>
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">Today's Usage</span>
            </div>
            <div className="text-lg font-semibold">
              {(credits?.consumed_today || 0).toLocaleString()}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">Estimated Duration</span>
            </div>
            <div className="text-sm font-medium text-gray-700">
              {getRemainingTimeEstimate()}
            </div>
          </div>
        </div>

        {/* Warnings */}
        {usagePercentage >= 90 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-800">
                  Low Credit Warning
                </p>
                <p className="text-xs text-red-700">
                  You're running low on credits. Consider purchasing more to avoid service interruption.
                </p>
              </div>
            </div>
          </div>
        )}

        {usagePercentage >= 70 && usagePercentage < 90 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-yellow-800">
                  Credit Usage Notice
                </p>
                <p className="text-xs text-yellow-700">
                  You've used {Math.round(usagePercentage)}% of your credits this period.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onManageBilling}
              className="text-xs"
            >
              <CreditCard className="h-3 w-3 mr-1" />
              Purchase Credits
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              <Settings className="h-3 w-3 mr-1" />
              Settings
            </Button>
          </div>
          
          <Badge variant="secondary" className="text-xs">
            Auto-refill: Off
          </Badge>
        </div>

        {/* Mode Cost Reference */}
        <div className="pt-2 border-t border-gray-100">
          <h5 className="text-xs font-medium text-gray-500 mb-2">Mode Costs</h5>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-blue-50 rounded">
              <div className="font-medium">Standard</div>
              <div className="text-gray-500">1 credit</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="font-medium">RAG Fast</div>
              <div className="text-gray-500">3 credits</div>
            </div>
            <div className="text-center p-2 bg-purple-50 rounded">
              <div className="font-medium">RAG Deep</div>
              <div className="text-gray-500">10 credits</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetDisplay;