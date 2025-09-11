'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Search,
  Settings,
  BarChart3,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Brain,
  Activity,
  Upload,
  Database,
  Zap,
  Pause,
  Play,
} from 'lucide-react';

// ===== Keep your existing deps (unchanged APIs) =====
import SessionRail from '@/components/optimization/SessionRail';
import ChatThread from '@/components/optimization/ChatThread';
import ContextPane from '@/components/optimization/ContextPane';
import { useOptimizerSessionsStore } from '@/store/optimizerSessionsStore';
import { useSSEChat } from '@/lib/services/sse-chat';
import { promptService } from '@/lib/services/prompt-service';

// ===== Lightweight fallbacks so the page still compiles if these aren't present =====
type SuggestionItem = { text: string };
const AnimatedSuggestionBox: React.FC<{
  onPromptSelect?: (p: SuggestionItem) => void;
  onIntentDetected?: (data: any) => void;
}> = ({ onPromptSelect }) => {
  const suggestions = [
    { text: 'Write a concise executive summary about quarterly metrics.' },
    { text: 'Generate product launch ideas for a youth segment.' },
    { text: 'Refactor this prompt for better constraints and tone.' },
  ];
  return (
    <div className="rounded-xl border border-amber-200 bg-yellow-50/70 p-4">
      <p className="mb-2 text-amber-900 font-medium">Quick Suggestions</p>
      <div className="grid gap-2 md:grid-cols-3">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onPromptSelect?.(s)}
            className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-left text-amber-800 hover:bg-amber-50"
          >
            {s.text}
          </button>
        ))}
      </div>
    </div>
  );
};

const SSEChatInterface: React.FC<{
  enableOptimization?: boolean;
  enableAnalytics?: boolean;
  onPromptOptimized?: (p: any) => void;
}> = ({ enableOptimization, enableAnalytics }) => {
  return (
    <div className="flex h-full items-center justify-center rounded-xl border border-amber-200 bg-white/70 p-8 text-amber-800">
      <div className="text-center">
        <p className="font-serif text-xl">𓂀 Real-time Chat Interface</p>
        <p className="mt-2 text-sm opacity-80">
          (Placeholder) Optimization: {enableOptimization ? 'On' : 'Off'} — Analytics:{' '}
          {enableAnalytics ? 'On' : 'Off'}
        </p>
      </div>
    </div>
  );
};

// ===== Types =====
type ActiveTab = 'search' | 'chat' | 'bulk' | 'analytics';

type LastOptimization = {
  optimizedPrompt: string;
  confidence: number;
  processingTime: number;
  alternatives: string[];
} | null;

// ===== Main Page =====
const ChatOptimizerPagePharaonic: React.FC = () => {
  const { service, isConnected } = useSSEChat();

  const {
    activeSessionId,
    sessions,
    lastActiveSessionId,
    createSession,
    setActiveSession,
    restoreNavigation,
  } = useOptimizerSessionsStore();

  const [isBooting, setIsBooting] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('search');

  // Pharaonic “stats”
  const [stats, setStats] = useState({
    totalPrompts: 128_430,
    optimizedToday: 2_314,
    avgResponseTime: 42.0,
    successRate: 96.3,
    activeConnections: 37,
  });

  // Bulk ingest status
  const [bulkStatus, setBulkStatus] = useState({
    isRunning: false,
    progress: 0,
    processed: 0,
    total: 0,
    errors: 0,
    estimatedTimeRemaining: 0,
  });

  const [lastOptimization, setLastOptimization] = useState<LastOptimization>(null);
  const [recentIntents, setRecentIntents] = useState<
    { detectedIntent: string; category: string; confidence: number }[]
  >([]);

  // ===== Init / restore =====
  useEffect(() => {
    (async () => {
      try {
        restoreNavigation();

        if (!activeSessionId) {
          if (lastActiveSessionId && sessions[lastActiveSessionId]) {
            setActiveSession(lastActiveSessionId);
          } else {
            createSession();
          }
        }
      } catch (err) {
        console.error('Failed to initialize optimizer:', err);
      } finally {
        setIsBooting(false);
      }
    })();
  }, [activeSessionId, lastActiveSessionId, sessions, createSession, setActiveSession, restoreNavigation]);

  // ===== Live-ish stats (simulated) =====
  useEffect(() => {
    const id = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        totalPrompts: prev.totalPrompts + Math.floor(Math.random() * 5),
        optimizedToday: prev.optimizedToday + Math.floor(Math.random() * 3),
        avgResponseTime: Math.max(28, Math.min(60, 35 + Math.random() * 20)),
        successRate: Math.max(90, Math.min(99.5, 92 + Math.random() * 8)),
        activeConnections: Math.max(10, Math.floor(Math.random() * 50) + 10),
      }));
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // ===== Actions =====
  const handleCreateSession = useCallback(() => {
    createSession();
  }, [createSession]);

  const handleBulkIngest = async () => {
    if (bulkStatus.isRunning) {
      setBulkStatus((prev) => ({ ...prev, isRunning: false }));
      return;
    }

    setBulkStatus({
      isRunning: true,
      progress: 0,
      processed: 0,
      total: 100_000,
      errors: 0,
      estimatedTimeRemaining: 0,
    });

    try {
      const prompts = promptService.generateSamplePrompts(100_000);
      const batchSize = 1_000;
      let processed = 0;
      let errors = 0;

      for (let i = 0; i < prompts.length; i += batchSize) {
        // allow cancellation
        if (!bulkStatus.isRunning) break;

        const batch = prompts.slice(i, i + batchSize);
        const start = Date.now();

        try {
          const result = await promptService.bulkIngestPrompts(batch, batchSize);
          processed += result.processed;
          errors += result.failed;
        } catch (err) {
          console.error('Batch failed:', err);
          errors += batch.length;
        }

        const progress = Math.min(100, ((i + batchSize) / prompts.length) * 100);
        const avgTimePerBatch = Date.now() - start;
        const remainingBatches = Math.ceil((prompts.length - i - batchSize) / batchSize);
        const eta = (remainingBatches * avgTimePerBatch) / 1000;

        setBulkStatus((prev) => ({
          ...prev,
          progress,
          processed,
          errors,
          estimatedTimeRemaining: eta,
        }));

        await new Promise((r) => setTimeout(r, 80));
      }

      setBulkStatus((prev) => ({
        ...prev,
        isRunning: false,
        progress: 100,
        estimatedTimeRemaining: 0,
      }));
    } catch (err) {
      console.error('Bulk ingest failed:', err);
      setBulkStatus((prev) => ({ ...prev, isRunning: false }));
    }
  };

  const handlePromptOptimized = (optimized: any) => {
    setStats((prev) => ({
      ...prev,
      optimizedToday: prev.optimizedToday + 1,
    }));

    setLastOptimization({
      optimizedPrompt: optimized?.text ?? 'Refined prompt (sample)',
      confidence: optimized?.confidence ?? 0.92,
      processingTime: optimized?.processingTime ?? 48,
      alternatives: optimized?.alternatives ?? ['Alt A', 'Alt B', 'Alt C'],
    });
  };

  const handleIntentDetected = (intent: any) => {
    const item = {
      detectedIntent: intent?.name ?? 'General',
      category: intent?.category ?? 'Uncategorized',
      confidence: intent?.confidence ?? 0.78,
    };
    setRecentIntents((prev) => [item, ...prev].slice(0, 8));
  };

  // ===== UI helpers =====
  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    trend?: number;
  }> = ({ title, value, icon: Icon, color, trend }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="rounded-xl border border-amber-200 bg-white/80 p-6 shadow-lg backdrop-blur"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-amber-700">{title}</p>
          <p className="mt-1 text-2xl font-bold text-amber-950">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {trend !== undefined && (
            <p className={`mt-1 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '+' : ''}
              {trend.toFixed(1)}% from last hour
            </p>
          )}
        </div>
        <div className={`rounded-lg p-3 ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  // ===== Boot screen (Egyptian light theme) =====
  if (isBooting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="mx-auto mb-4 h-16 w-16">
            <Sparkles className="h-full w-full animate-pulse text-amber-500" />
          </div>
          <h2 className="mb-1 font-serif text-xl font-semibold text-amber-900">𓂀 Awakening the Scribes</h2>
          <p className="text-amber-700">Restoring your sessions from the papyrus archives…</p>
        </motion.div>
      </div>
    );
  }

  const activeSession = activeSessionId ? sessions[activeSessionId] : null;

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      {/* Left rail */}
      <div className="w-80 border-r border-amber-200 bg-white/80 backdrop-blur">
        <SessionRail
          activeSessionId={activeSessionId}
          onCreateSession={handleCreateSession}
          onSelectSession={setActiveSession}
        />
      </div>

      {/* Center */}
      <div className="flex flex-1 flex-col">
        {/* Header (Pharaonic bar) */}
        <div className="border-b border-amber-200 bg-white/70 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-amber-600" />
              <h1 className="font-serif text-xl font-bold text-amber-950">Pharaonic Prompt Optimizer</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-amber-700">{isConnected ? 'SSE Connected' : 'Reconnecting…'}</span>
                {isConnected && <Activity className="h-4 w-4 text-green-500" />}
              </div>
              <Settings className="h-5 w-5 cursor-pointer text-amber-500 hover:text-amber-700" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto w-full max-w-7xl flex-1 overflow-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Stats */}
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
            <StatCard title="Total Prompts" value={stats.totalPrompts} icon={Database} color="bg-amber-500" trend={5.2} />
            <StatCard title="Optimized Today" value={stats.optimizedToday} icon={Zap} color="bg-emerald-500" trend={12.3} />
            <StatCard
              title="Avg Response Time"
              value={`${stats.avgResponseTime.toFixed(0)}ms`}
              icon={Activity}
              color="bg-purple-500"
              trend={-2.1}
            />
            <StatCard
              title="Success Rate"
              value={`${stats.successRate.toFixed(1)}%`}
              icon={CheckCircle}
              color="bg-teal-500"
              trend={0.8}
            />
            <StatCard
              title="Active Users"
              value={stats.activeConnections}
              icon={MessageSquare}
              color="bg-orange-500"
              trend={8.4}
            />
          </div>

          {/* Tab Bar */}
          <div className="mb-4 overflow-hidden rounded-lg border border-amber-200 bg-white/70 backdrop-blur">
            <div className="border-b border-amber-200">
              <nav className="flex space-x-8 px-4" aria-label="Tabs">
                {[
                  { id: 'search', name: 'Smart Search', icon: Search },
                  { id: 'chat', name: 'Chat Optimizer', icon: MessageSquare },
                  { id: 'bulk', name: 'Bulk Ingest', icon: Upload },
                  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ActiveTab)}
                    className={`flex items-center space-x-2 border-b-2 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'border-amber-500 text-amber-700'
                        : 'border-transparent text-amber-600 hover:border-amber-300 hover:text-amber-800'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'search' && (
                  <motion.div
                    key="search"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="mb-1 font-serif text-lg font-semibold text-amber-950">
                        𓋹 Intelligent Prompt Search & Optimization
                      </h2>
                      <p className="text-amber-700">
                        Type your intent and get real-time optimized prompts with sacred guidance.
                      </p>
                    </div>

                    <AnimatedSuggestionBox
                      onPromptSelect={(p) => {
                        console.log('Selected prompt:', p);
                      }}
                      onIntentDetected={handleIntentDetected}
                    />

                    {recentIntents.length > 0 && (
                      <div className="mt-6">
                        <h3 className="mb-3 text-md font-medium text-amber-950">Recent Intent Analysis</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {recentIntents.map((intent, idx) => (
                            <motion.div
                              key={`${intent.detectedIntent}-${idx}`}
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="rounded-lg border border-amber-200 bg-yellow-50/70 p-4"
                            >
                              <div className="mb-1 flex items-center justify-between">
                                <span className="font-medium text-amber-900">{intent.detectedIntent}</span>
                                <span className="rounded bg-amber-100 px-2 py-0.5 text-sm text-amber-800">
                                  {Math.round(intent.confidence * 100)}%
                                </span>
                              </div>
                              <div className="text-sm text-amber-800">Category: {intent.category}</div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'chat' && (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="h-96"
                  >
                    <SSEChatInterface
                      enableOptimization
                      enableAnalytics
                      onPromptOptimized={handlePromptOptimized}
                    />
                  </motion.div>
                )}

                {activeTab === 'bulk' && (
                  <motion.div
                    key="bulk"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="space-y-6">
                      <div>
                        <h2 className="mb-1 font-serif text-lg font-semibold text-amber-950">
                          𓂀 Bulk Prompt Ingestion
                        </h2>
                        <p className="text-amber-700">
                          Ingest 100,000 prompts with vector embeddings (no API changes).
                        </p>
                      </div>

                      <div className="rounded-lg bg-amber-50/50 p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-amber-950">Bulk Ingest Status</h3>
                            <p className="text-sm text-amber-700">
                              {bulkStatus.isRunning ? 'Processing…' : 'Ready to process 100,000 prompts'}
                            </p>
                          </div>

                          <button
                            onClick={handleBulkIngest}
                            disabled={bulkStatus.isRunning && bulkStatus.progress === 100}
                            className={`flex items-center space-x-2 rounded-lg px-6 py-3 font-medium text-white transition-colors ${
                              bulkStatus.isRunning
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-amber-600 hover:bg-amber-700'
                            }`}
                          >
                            {bulkStatus.isRunning ? (
                              <>
                                <Pause className="h-4 w-4" />
                                <span>Stop Ingest</span>
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4" />
                                <span>Start Bulk Ingest</span>
                              </>
                            )}
                          </button>
                        </div>

                        {(bulkStatus.isRunning || bulkStatus.progress > 0) && (
                          <div className="space-y-3">
                            <div className="h-2 w-full rounded-full bg-amber-200/70">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${bulkStatus.progress}%` }}
                                transition={{ duration: 0.5 }}
                                className="h-2 rounded-full bg-amber-500"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                              <div>
                                <span className="text-amber-700">Progress:</span>
                                <span className="ml-2 font-medium text-amber-900">
                                  {bulkStatus.progress.toFixed(1)}%
                                </span>
                              </div>
                              <div>
                                <span className="text-amber-700">Processed:</span>
                                <span className="ml-2 font-medium text-amber-900">
                                  {bulkStatus.processed.toLocaleString()}
                                </span>
                              </div>
                              <div>
                                <span className="text-amber-700">Errors:</span>
                                <span className="ml-2 font-medium text-red-600">{bulkStatus.errors}</span>
                              </div>
                              <div>
                                <span className="text-amber-700">ETA:</span>
                                <span className="ml-2 font-medium text-amber-900">
                                  {bulkStatus.estimatedTimeRemaining > 0
                                    ? `${Math.ceil(bulkStatus.estimatedTimeRemaining)}s`
                                    : 'Complete'}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'analytics' && (
                  <motion.div
                    key="analytics"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="space-y-6">
                      <div>
                        <h2 className="mb-1 font-serif text-lg font-semibold text-amber-950">
                          𓃭 Performance Analytics
                        </h2>
                        <p className="text-amber-700">Real-time metrics and optimization insights.</p>
                      </div>

                      {lastOptimization && (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
                          <h3 className="mb-3 flex items-center font-medium text-emerald-900">
                            <CheckCircle className="mr-2 h-5 w-5" />
                            Latest Optimization
                          </h3>
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="text-emerald-800">Optimized Prompt:</span>
                              <p className="mt-1 font-medium text-emerald-950">{lastOptimization.optimizedPrompt}</p>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-emerald-800">
                              <span>Confidence: {Math.round(lastOptimization.confidence * 100)}%</span>
                              <span>Processing Time: {lastOptimization.processingTime}ms</span>
                              <span>Alternatives: {lastOptimization.alternatives.length}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="rounded-lg border border-amber-200 bg-white/80 p-6">
                          <h3 className="mb-4 font-medium text-amber-950">Response Time Distribution</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-amber-700">&lt; 25ms</span>
                              <span className="text-sm font-medium text-green-600">65%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-amber-700">25–50ms</span>
                              <span className="text-sm font-medium text-amber-700">28%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-amber-700">&gt; 50ms</span>
                              <span className="text-sm font-medium text-orange-600">7%</span>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-lg border border-amber-200 bg-white/80 p-6">
                          <h3 className="mb-4 font-medium text-amber-950">Intent Categories</h3>
                          <div className="space-y-3">
                            {[
                              ['Creative Writing', '32%'],
                              ['Business', '25%'],
                              ['Technical', '18%'],
                              ['Educational', '15%'],
                              ['Other', '10%'],
                            ].map(([label, val]) => (
                              <div key={label} className="flex items-center justify-between">
                                <span className="text-sm text-amber-700">{label}</span>
                                <span className="text-sm font-medium text-amber-900">{val}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Center chat thread (kept, no API changes) */}
          <div className="mt-4 rounded-xl border border-amber-200 bg-white/70 p-0 backdrop-blur">
            <ChatThread session={activeSession} isConnected={isConnected} />
          </div>
        </div>
      </div>

      {/* Right rail */}
      <div className="w-96 border-l border-amber-200 bg-white/80 backdrop-blur">
        <ContextPane session={activeSession} />
      </div>
    </div>
  );
};

export default ChatOptimizerPagePharaonic;
