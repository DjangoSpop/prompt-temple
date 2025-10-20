import { motion } from 'framer-motion';
import { Wifi, WifiOff, RotateCcw } from 'lucide-react';
import type { LatencyMetrics, WebSocketStatus } from '../../types/chat';

interface LatencyBadgeProps {
  latency: LatencyMetrics;
  wsStatus: WebSocketStatus;
  className?: string;
}

export const LatencyBadge: React.FC<LatencyBadgeProps> = ({ 
  latency, 
  wsStatus, 
  className = '' 
}) => {
  const getStatusIcon = () => {
    if (wsStatus.offline) {
      return <WifiOff className="w-3 h-3" />;
    }
    if (wsStatus.reconnecting) {
      return <RotateCcw className="w-3 h-3 animate-spin" />;
    }
    return <Wifi className="w-3 h-3" />;
  };

  const getStatusColor = () => {
    if (wsStatus.offline) return 'text-red-600 bg-red-50 border-red-200';
    if (wsStatus.reconnecting) return 'text-sun bg-sun/10 border-sun/30';
    if (wsStatus.connected) return 'text-nile bg-sand-50 border-sand-100';
    return 'text-stone bg-sand-50 border-sand-100';
  };

  const getStatusText = () => {
    if (wsStatus.offline) return 'Offline';
    if (wsStatus.reconnecting) return `Reconnecting... (${wsStatus.reconnectAttempts}/5)`;
    if (wsStatus.connected) return 'Connected';
    return 'Disconnected';
  };

  const formatLatency = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <motion.div
      className={`flex items-center space-x-2 px-3 py-1.5 rounded-cartouche text-xs font-ui font-medium border ${getStatusColor()} ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
    >
      {getStatusIcon()}
      <span>{getStatusText()}</span>
      
      {wsStatus.connected && latency.lastMeasured > 0 && (
        <>
          <span className="text-stone/30">•</span>
          <span className="text-stone">
            p50: {formatLatency(latency.p50)} | p95: {formatLatency(latency.p95)}
          </span>
          {latency.current && (
            <>
              <span className="text-stone/30">•</span>
              <span className="font-semibold text-nile">
                {formatLatency(latency.current)}
              </span>
            </>
          )}
        </>
      )}
    </motion.div>
  );
};
