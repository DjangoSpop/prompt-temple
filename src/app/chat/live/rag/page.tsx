'use client';

import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { 
  Wifi, 
  WifiOff, 
  BarChart3, 
  MessageSquare,
  Download,
  Trash2,
  Star,
  Search,
  Filter
} from 'lucide-react';
import { useNativeStreamingChat } from '@/hooks/useNativeStreamingChat';
import { useConversation } from '@/hooks/useConversation';
import { useChatAnalytics } from '@/hooks/useChatAnalytics';
import { EnhancedStreamingMessage } from '@/components/chat/StreamingMessage';
import { EnhancedChatInput } from '@/components/chat/EnhancedChatInput';
import { WebSocketTester } from '@/components/debug/WebSocketTester';
import EgyptianLoading from '@/components/EgyptianLoading';

// Pharaonic UI Components
const SunDisk = ({ className = "", size = 20 }: { className?: string; size?: number }) => (
  <div 
    className={`inline-flex items-center justify-center rounded-full bg-sun text-white ${className}`}
    style={{ width: size, height: size }}
  >
    <div className="text-xs">☀</div>
  </div>
);

// Connection Status Component
const ConnectionStatus = ({ 
  isConnected, 
  latency 
}: { 
  isConnected: boolean; 
  latency?: number | null; 
}) => (
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-cartouche bg-sand-50 border border-stone-200">
    {isConnected ? (
      <Wifi className="h-4 w-4 text-nile" />
    ) : (
      <WifiOff className="h-4 w-4 text-red-500" />
    )}
    <span className="text-sm font-ui text-stone-700">
      {isConnected ? 'Connected to Prompt Temple' : 'Disconnected'}
    </span>
    {latency && (
      <span className="px-2 py-1 bg-sun/10 text-sun font-mono text-xs rounded-full">
        {latency}ms
      </span>
    )}
  </div>
);

// Conversation List Sidebar
const ConversationSidebar = ({ 
  conversations, 
  currentConversationId, 
  onSelectConversation, 
  onNewConversation,
  onDeleteConversation,
  onToggleStar,
  searchQuery,
  onSearchChange
}: {
  conversations: {
    id: string;
    title: string;
    preview: string;
    messageCount: number;
    lastMessage: Date;
    tags: string[];
    isStarred: boolean;
  }[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onToggleStar: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}) => (
  <div className="w-80 bg-sand-50/50 border-r-2 border-sand-200 p-4 flex flex-col h-full">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-display font-bold text-stone-800 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-sun" />
        Conversations
      </h2>
      <button
        onClick={onNewConversation}
        className="px-3 py-1.5 bg-sun text-white rounded-cartouche text-sm font-semibold hover:bg-sun/90 transition-colors"
      >
        New
      </button>
    </div>

    {/* Search */}
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search conversations..."
        className="w-full pl-10 pr-4 py-2 border border-sand-300 rounded-cartouche bg-white text-sm focus:border-sun focus:ring-2 focus:ring-sun/20 outline-none"
      />
    </div>

    {/* Conversation List */}
    <div className="flex-1 overflow-y-auto space-y-2">
      {conversations.map((conv) => (
        <div
          key={conv.id}
          onClick={() => onSelectConversation(conv.id)}
          className={`p-3 rounded-cartouche border cursor-pointer transition-all hover:shadow-md ${
            currentConversationId === conv.id
              ? 'bg-sun/10 border-sun/30'
              : 'bg-white border-sand-200 hover:bg-sand-50'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-sm text-stone-800 truncate flex-1">
              {conv.title}
            </h3>
            <div className="flex items-center gap-1">
              {conv.isStarred && (
                <Star className="h-3 w-3 text-sun fill-current" />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStar(conv.id);
                }}
                className="p-1 hover:bg-stone-200 rounded"
              >
                <Star className={`h-3 w-3 ${conv.isStarred ? 'text-sun fill-current' : 'text-stone-400'}`} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(conv.id);
                }}
                className="p-1 hover:bg-red-100 text-red-500 rounded"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
          <p className="text-xs text-stone-600 line-clamp-2">{conv.preview}</p>
          <div className="flex items-center justify-between mt-2 text-xs text-stone-500">
            <span>{conv.messageCount} messages</span>
            <span>{new Date(conv.lastMessage).toISOString().slice(0, 10)}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Analytics Panel
const AnalyticsPanel = ({ 
  analytics, 
  onExportReport, 
  onClearData 
}: {
  analytics: {
    totalMessages: number;
    totalTokens: number;
    averageResponseTime: number;
    satisfactionScore: number;
    modelUsage: Record<string, number>;
    slashCommandUsage: Record<string, number>;
    dailyUsage: {
      date: string;
      messages: number;
      tokens: number;
      sessions: number;
      avgResponseTime: number;
    }[];
  };
  onExportReport: () => void;
  onClearData: () => void;
}) => (
  <div className="w-80 bg-sand-50/50 border-l-2 border-sand-200 p-4 flex flex-col h-full">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-display font-bold text-stone-800 flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-sun" />
        Analytics
      </h2>
      <div className="flex gap-1">
        <button
          onClick={onExportReport}
          className="p-1.5 text-stone-600 hover:bg-stone-200 rounded"
          title="Export Report"
        >
          <Download className="h-4 w-4" />
        </button>
        <button
          onClick={onClearData}
          className="p-1.5 text-red-500 hover:bg-red-100 rounded"
          title="Clear Data"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>

    <div className="space-y-4">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-3 rounded-cartouche border border-sand-200">
          <div className="text-xs text-stone-600">Messages</div>
          <div className="text-lg font-bold text-stone-800">{analytics.totalMessages}</div>
        </div>
        <div className="bg-white p-3 rounded-cartouche border border-sand-200">
          <div className="text-xs text-stone-600">Tokens</div>
          <div className="text-lg font-bold text-stone-800">{(analytics.totalTokens || 0).toLocaleString()}</div>
        </div>
        <div className="bg-white p-3 rounded-cartouche border border-sand-200">
          <div className="text-xs text-stone-600">Avg Response</div>
          <div className="text-lg font-bold text-stone-800">{Math.round(analytics.averageResponseTime)}ms</div>
        </div>
        <div className="bg-white p-3 rounded-cartouche border border-sand-200">
          <div className="text-xs text-stone-600">Satisfaction</div>
          <div className="text-lg font-bold text-stone-800">{analytics.satisfactionScore.toFixed(1)}/5</div>
        </div>
      </div>

      {/* Model Usage */}
      {Object.keys(analytics.modelUsage).length > 0 && (
        <div className="bg-white p-3 rounded-cartouche border border-sand-200">
          <h3 className="text-sm font-semibold text-stone-800 mb-2">Model Usage</h3>
          <div className="space-y-1">
            {Object.entries(analytics.modelUsage).map(([model, tokens]) => (
              <div key={model} className="flex justify-between text-xs">
                <span className="text-stone-600">{model}</span>
                <span className="font-mono text-stone-800">{((tokens as number) || 0).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slash Commands */}
      {Object.keys(analytics.slashCommandUsage).length > 0 && (
        <div className="bg-white p-3 rounded-cartouche border border-sand-200">
          <h3 className="text-sm font-semibold text-stone-800 mb-2">Command Usage</h3>
          <div className="space-y-1">
            {Object.entries(analytics.slashCommandUsage).map(([cmd, count]) => (
              <div key={cmd} className="flex justify-between text-xs">
                <span className="text-stone-600">/{cmd}</span>
                <span className="font-mono text-stone-800">{count as number}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Usage Chart (simplified) */}
      {analytics.dailyUsage.length > 0 && (
        <div className="bg-white p-3 rounded-cartouche border border-sand-200">
          <h3 className="text-sm font-semibold text-stone-800 mb-2">Daily Usage (7 days)</h3>
          <div className="space-y-1">
            {analytics.dailyUsage.slice(0, 7).map((day) => (
              <div key={day.date} className="flex justify-between text-xs">
                <span className="text-stone-600">{new Date(day.date).toISOString().slice(0, 10)}</span>
                <span className="font-mono text-stone-800">{day.messages}msg</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

function NextGenChatInterface() {
  // User ID and session management
  const getOrCreateUserId = useCallback(() => {
    if (typeof window === 'undefined') return 'server_user';
    
    const key = 'promptcraft_user_id';
    let uid = localStorage.getItem(key);
    if (!uid) {
      uid = `user_${crypto.randomUUID()}`;
      localStorage.setItem(key, uid);
    }
    return uid;
  }, []);

  // Get or create auth token
  const getOrCreateAuthToken = useCallback(() => {
    if (typeof window === 'undefined') return 'default_token';
    
    // Try to get existing token
    let token = localStorage.getItem('auth_token') || localStorage.getItem('access_token');
    
    if (!token) {
      // Generate a simple auth token for development
      token = `dev_token_${crypto.randomUUID()}`;
      localStorage.setItem('auth_token', token);
      console.log('🔑 Generated development auth token:', token);
    }
    
    return token;
  }, []);

  const userId = useMemo(() => getOrCreateUserId(), [getOrCreateUserId]);
  const authToken = useMemo(() => getOrCreateAuthToken(), [getOrCreateAuthToken]);
  const [sessionId, setSessionId] = useState<string>(() => 'server_session');

  // Generate sessionId on client only to prevent SSR/client hydration mismatch
  useEffect(() => {
    setSessionId(`session_${userId}_${Date.now()}`);
  }, [userId]);

  // UI State
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted to avoid SSR/client hydration mismatches for time-based UI
    setIsMounted(true);
  }, []);

  // Initialize hooks
  const streamingChat = useNativeStreamingChat({
    userId,
    sessionId,
    autoSave: true,
    wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://127.0.0.1:8000',
  });

  const conversation = useConversation({
    autoSave: true,
    maxConversations: 100,
  });

  const analytics = useChatAnalytics({
    enableRealTimeTracking: true,
    maxDataPoints: 10000,
  });

  // Keep a stable ref to analytics to avoid effect dependency churn
  const analyticsRef = useRef(analytics);
  useEffect(() => {
    analyticsRef.current = analytics;
  }, [analytics]);

  // Keep a stable ref to conversation for use in effects
  const conversationRef = useRef(conversation);
  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  // Track which message IDs have been recorded to avoid loops during streaming updates
  const trackedMessageIdsRef = useRef<Set<string>>(new Set());

  // Start analytics session
  useEffect(() => {
    // Use ref to avoid capturing stale or changing analytics function identities
  analyticsRef.current.startSession(sessionId, 'deepseek');
    return () => {
      analyticsRef.current.endSession();
    };
  }, [sessionId]);

  // Track messages for analytics
  useEffect(() => {
    if (streamingChat.messages.length === 0) return;

    const latestMessage = streamingChat.messages.at(-1);
    if (!latestMessage) return;

    // Don't track partial streaming chunks; wait until the message finishes
    if (latestMessage.isStreaming) return;

    // Deduplicate by message ID to prevent infinite loops on re-renders
    if (trackedMessageIdsRef.current.has(latestMessage.id)) return;
    trackedMessageIdsRef.current.add(latestMessage.id);

    // Use refs to avoid re-running due to changing object identities
    analyticsRef.current.trackMessage(latestMessage, sessionId);

    const conv = conversationRef.current;
    if (conv.currentConversationId) {
      conv.addMessage(conv.currentConversationId, latestMessage);
      // Auto-generate title for first message in a conversation
      if (streamingChat.messages.length === 1) {
        conv.autoGenerateTitle(conv.currentConversationId);
      }
    }
  }, [streamingChat.messages, sessionId]);

  // Enhanced message sending with analytics
  const handleSendMessage = useCallback((
    content: string, 
    options?: { type?: 'chat' | 'slash_command'; command?: string }
  ) => {
    // Create new conversation if none exists
    if (!conversation.currentConversationId) {
      conversation.createConversation();
    }

    // Track slash commands
    if (options?.type === 'slash_command' && options.command) {
      analytics.trackSlashCommand(options.command);
    }

    // Send message - convert old options to new format
    const sendOptions = {
      optimize: options?.type !== 'slash_command',
      model: 'deepseek-chat',
      temperature: 0.7,
      maxTokens: 2000,
      context: [],
    };
    return streamingChat.sendMessage(content, sendOptions);
  }, [conversation, analytics, streamingChat]);

  // Conversation management
  const handleNewConversation = useCallback(() => {
    const newId = conversation.createConversation();
    streamingChat.clearMessages();
    return newId;
  }, [conversation, streamingChat]);

  const handleSelectConversation = useCallback((id: string) => {
    const conv = conversation.getConversation(id);
    if (conv) {
      conversation.setCurrentConversationId(id);
      // Load messages into streaming chat
      // Note: This would need to be implemented in useStreamingChat
      // streamingChat.loadConversation(conv.messages);
    }
  }, [conversation]);

  const handleExportReport = useCallback(() => {
    const report = analytics.generateReport();
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-analytics-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Analytics report exported');
  }, [analytics]);

  return (
    <div className="flex h-screen bg-pharaoh-gradient">
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'bg-white border-2 border-amber-200 text-amber-900 shadow-lg',
          duration: 4000,
        }}
      />

      {/* Conversation Sidebar */}
      {showSidebar && (
        <ConversationSidebar
          conversations={conversation.conversations}
          currentConversationId={conversation.currentConversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onDeleteConversation={conversation.deleteConversation}
          onToggleStar={conversation.toggleStar}
          searchQuery={conversation.searchQuery}
          onSearchChange={conversation.setSearchQuery}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b-2 border-sand-200 bg-sand-50/80 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 hover:bg-sand-200 rounded-cartouche transition-colors"
              >
                <Filter className="h-4 w-4 text-stone-600" />
              </button>
              <ConnectionStatus isConnected={streamingChat.isConnected} latency={streamingChat.latency ?? null} />
              
              {/* Debug WebSocket Link */}
              {process.env.NODE_ENV === 'development' && (
                <a
                  href="/test/websocket"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Debug WebSocket
                </a>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-xs text-stone-700 text-center">
                <div className="flex items-center gap-2 font-ui">
                  <SunDisk size={12} />
                  <span>Session:</span>
                  <span className="font-mono bg-sand-200 px-2 py-1 rounded text-stone-800">
                    {isMounted ? sessionId.slice(-8) : '────────'}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className={`p-2 rounded-cartouche transition-colors ${
                  showAnalytics ? 'bg-sun/20 text-sun' : 'hover:bg-sand-200 text-stone-600'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Error Display */}
          {streamingChat.error && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-cartouche">
              <div className="flex items-center gap-2 text-red-700">
                <span className="text-sm font-semibold">Connection Error:</span>
                <span className="text-sm">{streamingChat.error}</span>
                <button
                  onClick={() => streamingChat.reconnect?.()}
                  className="ml-auto px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-xs"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-transparent to-sand-50/30">
          {/* WebSocket Tester - Only show in development */}
          {process.env.NODE_ENV === 'development' && (
            <WebSocketTester
              onSendMessage={handleSendMessage}
              isConnected={streamingChat.isConnected}
              isLoading={streamingChat.isTyping}
            />
          )}
          
          {streamingChat.messages.length === 0 && (
            <div className="text-center py-8 text-stone-700">
              <div className="text-6xl mb-4 animate-hieroglyph">𓊪𓂋𓅱𓏠𓊪𓏏</div>
              <div className="text-xl font-display font-bold mb-2 text-stone-800">Prompt Temple</div>
              <div className="text-sm text-stone-600 font-ui">Made in Egypt • Crafted with the precision of Karnak</div>
              <div className="mt-4 text-xs text-stone-500">Start your conversation with our AI oracle powered by DeepSeek...</div>
              
              {/* Connection Status Debug */}
              {!streamingChat.isConnected && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-cartouche max-w-md mx-auto">
                  <div className="text-sm font-semibold text-amber-800 mb-2">Connection Status</div>
                  <div className="text-xs text-amber-700 space-y-1">
                    <div>WebSocket: {streamingChat.isConnected ? '✅ Connected' : '❌ Disconnected'}</div>
                    <div>Backend: {process.env.NEXT_PUBLIC_WS_URL || 'ws://127.0.0.1:8000'}</div>
                    <div>Session: {sessionId}</div>
                    {process.env.NODE_ENV === 'development' && (
                      <div className="mt-2">
                        <a href="/test/websocket" target="_blank" className="text-blue-600 hover:underline">
                          Open WebSocket Test →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {streamingChat.messages.map((message) => (
            <EnhancedStreamingMessage
              key={message.id}
              message={message}
              isStreaming={message.isStreaming}
              showMetadata={true}
              enableMarkdown={true}
            />
          ))}

          {/* Egyptian Loading for thinking */}
          {streamingChat.isTyping && (
            <div className="max-w-[90%] mx-auto mb-4">
              <EgyptianLoading 
                isLoading={streamingChat.isTyping} 
                message="The oracle consults the ancient scrolls of knowledge"
                size="small"
                overlay={false}
              />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t-2 border-sand-200 p-4 bg-sand-50/30">
          <EnhancedChatInput
            onSend={handleSendMessage}
            isLoading={streamingChat.isTyping}
            isConnected={streamingChat.isConnected}
            maxLength={4000}
            disabled={false}
            showSlashCommands={true}
            enableVoiceInput={false}
            enableFileUpload={false}
          />
        </div>
      </div>

      {/* Analytics Sidebar */}
      {showAnalytics && (
        <AnalyticsPanel
          analytics={analytics.analytics}
          onExportReport={handleExportReport}
          onClearData={analytics.clearAnalytics}
        />
      )}
    </div>
  );
}

export default function NextGenChatPage() {
  return (
    <div className="min-h-screen temple-background">
      <NextGenChatInterface />
    </div>
  );
}
