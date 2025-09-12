/**
 * Health Check Hook
 * Monitors chat service and system health with real-time updates
 */

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { BaseApiClient } from '@/lib/api/base';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'down' | 'unknown';
  message: string;
  timestamp: string;
  response_time_ms?: number;
  services?: {
    chat?: {
      status: 'healthy' | 'degraded' | 'down';
      message: string;
      model_info?: any;
    };
    rag?: {
      status: 'healthy' | 'degraded' | 'down';
      message: string;
      index_status?: string;
      document_count?: number;
    };
    auth?: {
      status: 'healthy' | 'degraded' | 'down';
      message: string;
    };
    database?: {
      status: 'healthy' | 'degraded' | 'down';
      message: string;
      latency_ms?: number;
    };
  };
  config?: {
    version?: string;
    environment?: string;
    maintenance_mode?: boolean;
    rate_limits?: any;
  };
}

class HealthCheckService extends BaseApiClient {
  async checkChatHealth(): Promise<HealthStatus> {
    const startTime = Date.now();
    
    try {
      const health = await this.request<HealthStatus>('/api/v2/chat/health/', {
        timeout: 5000, // 5 second timeout
      });
      
      return {
        ...health,
        response_time_ms: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'down',
        message: error instanceof Error ? error.message : 'Health check failed',
        timestamp: new Date().toISOString(),
        response_time_ms: Date.now() - startTime,
      };
    }
  }

  async checkRAGHealth(): Promise<{ status: string; index_status?: string; document_count?: number }> {
    try {
      return await this.request('/v1/ai-services/agent/health/');
    } catch (error) {
      return {
        status: 'down',
      };
    }
  }

  async checkSystemHealth(): Promise<HealthStatus> {
    try {
      return await this.request<HealthStatus>('/api/v2/health/', {
        timeout: 5000,
      });
    } catch (error) {
      return {
        status: 'down',
        message: error instanceof Error ? error.message : 'System health check failed',
        timestamp: new Date().toISOString(),
      };
    }
  }
}

const healthCheckService = new HealthCheckService();

// Main health check hook
export const useHealthCheck = (options?: {
  enablePolling?: boolean;
  pollingInterval?: number;
  enableNotifications?: boolean;
}) => {
  const {
    enablePolling = true,
    pollingInterval = 30000, // 30 seconds
    enableNotifications = false,
  } = options || {};

  const [lastKnownStatus, setLastKnownStatus] = useState<HealthStatus | null>(null);
  const [statusHistory, setStatusHistory] = useState<HealthStatus[]>([]);
  const [alertCount, setAlertCount] = useState(0);

  const healthQuery = useQuery({
    queryKey: ['health', 'chat'],
    queryFn: () => healthCheckService.checkChatHealth(),
    refetchInterval: enablePolling ? pollingInterval : false,
    refetchOnWindowFocus: true,
    staleTime: 10000, // 10 seconds
    retry: (failureCount, error) => {
      // Only retry on network errors, not on 4xx/5xx responses
      return failureCount < 2;
    },
  });

  const systemHealthQuery = useQuery({
    queryKey: ['health', 'system'],
    queryFn: () => healthCheckService.checkSystemHealth(),
    refetchInterval: enablePolling ? pollingInterval * 2 : false, // Less frequent
    staleTime: 30000, // 30 seconds
    retry: 1,
  });

  const ragHealthQuery = useQuery({
    queryKey: ['health', 'rag'],
    queryFn: () => healthCheckService.checkRAGHealth(),
    refetchInterval: enablePolling ? pollingInterval * 3 : false, // Even less frequent
    staleTime: 60000, // 1 minute
    retry: 1,
  });

  // Track status changes and maintain history
  useEffect(() => {
    if (healthQuery.data) {
      const newStatus = healthQuery.data;
      
      // Update history (keep last 20 entries)
      setStatusHistory(prev => {
        const updated = [newStatus, ...prev].slice(0, 20);
        return updated;
      });

      // Check for status changes
      if (lastKnownStatus && lastKnownStatus.status !== newStatus.status) {
        if (enableNotifications) {
          // Trigger notification for status change
          const isImprovement = 
            (lastKnownStatus.status === 'down' && newStatus.status !== 'down') ||
            (lastKnownStatus.status === 'degraded' && newStatus.status === 'healthy');

          if (!isImprovement) {
            setAlertCount(prev => prev + 1);
          }

          // You could integrate with a toast/notification system here
          console.log(`Service status changed: ${lastKnownStatus.status} → ${newStatus.status}`);
        }
      }

      setLastKnownStatus(newStatus);
    }
  }, [healthQuery.data, lastKnownStatus, enableNotifications]);

  // Combined health status
  const overallStatus = (() => {
    const chatStatus = healthQuery.data?.status || 'unknown';
    const systemStatus = systemHealthQuery.data?.status || 'unknown';
    const ragStatus = ragHealthQuery.data?.status || 'unknown';

    if ([chatStatus, systemStatus].includes('down')) return 'down';
    if ([chatStatus, systemStatus].includes('degraded')) return 'degraded';
    if (chatStatus === 'healthy' && systemStatus === 'healthy') return 'healthy';
    return 'unknown';
  })();

  // Service availability checks
  const isServiceAvailable = (service: keyof NonNullable<HealthStatus['services']>) => {
    const serviceStatus = healthQuery.data?.services?.[service]?.status;
    return serviceStatus === 'healthy' || serviceStatus === 'degraded';
  };

  const forceRefresh = useCallback(async () => {
    await Promise.all([
      healthQuery.refetch(),
      systemHealthQuery.refetch(),
      ragHealthQuery.refetch(),
    ]);
  }, [healthQuery.refetch, systemHealthQuery.refetch, ragHealthQuery.refetch]);

  return {
    // Primary health data
    health: healthQuery.data,
    systemHealth: systemHealthQuery.data,
    ragHealth: ragHealthQuery.data,

    // Overall status
    overallStatus,
    isHealthy: overallStatus === 'healthy',
    isAvailable: ['healthy', 'degraded'].includes(overallStatus),

    // Service-specific checks
    isChatAvailable: isServiceAvailable('chat'),
    isRAGAvailable: ragHealthQuery.data?.status === 'healthy',
    isAuthAvailable: isServiceAvailable('auth'),

    // Loading states
    isLoading: healthQuery.isLoading,
    isRefreshing: healthQuery.isFetching,

    // Error states
    error: healthQuery.error,
    systemError: systemHealthQuery.error,

    // Status history and alerts
    statusHistory,
    alertCount,
    lastKnownStatus,

    // Response times
    responseTime: healthQuery.data?.response_time_ms,

    // Actions
    refresh: forceRefresh,
    clearAlerts: () => setAlertCount(0),

    // Configuration
    pollingEnabled: enablePolling,
    pollingInterval,
  };
};

// Lightweight health check for header badge
export const useHealthBadge = () => {
  const health = useHealthCheck({
    enablePolling: true,
    pollingInterval: 30000,
    enableNotifications: false,
  });

  return {
    status: health.overallStatus,
    isAvailable: health.isAvailable,
    responseTime: health.responseTime,
    lastCheck: health.health?.timestamp,
    isLoading: health.isLoading,
  };
};