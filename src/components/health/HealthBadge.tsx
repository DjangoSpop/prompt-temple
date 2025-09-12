/**
 * Health Badge Component
 * Displays service status in the header with real-time updates
 */

'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  RefreshCw,
  Activity,
  Zap,
  Database
} from 'lucide-react';
import { useHealthBadge } from '@/lib/hooks/useHealthCheck';
import { cn } from '@/lib/utils';

interface HealthBadgeProps {
  className?: string;
  showResponseTime?: boolean;
  variant?: 'badge' | 'button';
}

export const HealthBadge: React.FC<HealthBadgeProps> = ({
  className,
  showResponseTime = true,
  variant = 'badge'
}) => {
  const { 
    status, 
    isAvailable, 
    responseTime, 
    lastCheck, 
    isLoading,
  } = useHealthBadge();

  const getStatusIcon = () => {
    if (isLoading) {
      return <RefreshCw className="h-3 w-3 animate-spin" />;
    }
    
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="h-3 w-3" />;
      case 'degraded':
        return <AlertTriangle className="h-3 w-3" />;
      case 'down':
        return <XCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'down':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = () => {
    if (isLoading) return 'Checking...';
    
    switch (status) {
      case 'healthy':
        return 'All Systems Operational';
      case 'degraded':
        return 'Performance Issues';
      case 'down':
        return 'Service Unavailable';
      default:
        return 'Status Unknown';
    }
  };

  const getResponseTimeColor = () => {
    if (!responseTime) return 'text-gray-500';
    if (responseTime < 500) return 'text-green-600';
    if (responseTime < 1000) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatLastCheck = () => {
    if (!lastCheck) return 'Never';
    
    const now = new Date();
    const check = new Date(lastCheck);
    const diffMs = now.getTime() - check.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    return check.toLocaleTimeString();
  };

  if (variant === 'button') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 px-2 text-xs font-medium",
              getStatusColor(),
              className
            )}
          >
            {getStatusIcon()}
            <span className="ml-2 hidden sm:inline">
              {status === 'healthy' ? 'Operational' : getStatusText()}
            </span>
            {showResponseTime && responseTime && (
              <span className={cn("ml-2 text-xs", getResponseTimeColor())}>
                {responseTime}ms
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            System Status
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Chat Service</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-xs">{getStatusText()}</span>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span>Response Time</span>
            </div>
            <span className={cn("text-xs font-mono", getResponseTimeColor())}>
              {responseTime ? `${responseTime}ms` : 'N/A'}
            </span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="flex items-center justify-between text-xs text-gray-500">
            <span>Last Check</span>
            <span>{formatLastCheck()}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium cursor-default",
        getStatusColor(),
        className
      )}
    >
      {getStatusIcon()}
      <span className="ml-2">
        {status === 'healthy' ? 'Operational' : getStatusText()}
      </span>
      {showResponseTime && responseTime && (
        <span className={cn("ml-2", getResponseTimeColor())}>
          {responseTime}ms
        </span>
      )}
    </Badge>
  );
};

export default HealthBadge;