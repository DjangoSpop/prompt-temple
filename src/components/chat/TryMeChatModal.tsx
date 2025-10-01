'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Loader2, 
  MessageSquare,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  modalVariants, 
  overlayVariants, 
  chatMessageVariants,
  typingIndicatorVariants,
  useMotionVariants 
} from '@/lib/motion/variants';
import { aiServices } from '@/lib/api/services';
import type { ChatMessage } from '@/lib/api/types';

export interface TryMeChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TryMeChatModal({ isOpen, onClose }: TryMeChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. I can help you with prompt optimization, answer questions, and guide you through our features. What would you like to explore today?',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Apply motion preferences
  const motionModalVariants = useMotionVariants(modalVariants);
  const motionOverlayVariants = useMotionVariants(overlayVariants);
  const motionMessageVariants = useMotionVariants(chatMessageVariants);
  const motionTypingVariants = useMotionVariants(typingIndicatorVariants);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call AI service
      const response = await aiServices.chatWithAssistant({
        messages: [...messages, userMessage].map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
        })),
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date().toISOString(),
        error: 'Connection failed',
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          // Base modal styles
          'p-0 gap-0 overflow-hidden border-0',
          // Responsive sizing
          isExpanded 
            ? 'w-[95vw] h-[90vh] max-w-none' 
            : 'w-full max-w-2xl h-[600px]',
          // Liquid morphism
          'rounded-2xl shadow-2xl',
          'bg-white/95 backdrop-blur-md',
          'dark:bg-gray-900/95',
          // Smooth transitions
          'transition-all duration-300'
        )}
        aria-labelledby="chat-modal-title"
        aria-describedby="chat-modal-description"
      >
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-border/50 bg-foreground/2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-accent to-yellow-600 flex items-center justify-center shadow-lg">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle id="chat-modal-title" className="text-lg font-semibold">
                  AI Assistant
                </DialogTitle>
                <DialogDescription id="chat-modal-description" className="text-sm text-muted-foreground">
                  Chat with our intelligent AI assistant
                </DialogDescription>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8 p-0 rounded-lg"
                aria-label={isExpanded ? 'Minimize chat' : 'Expand chat'}
              >
                {isExpanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  variants={motionMessageVariants}
                  initial="hidden"
                  animate="visible"
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-accent to-yellow-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  
                  <div className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3 shadow-sm',
                    message.role === 'user'
                      ? 'bg-gold-accent text-white ml-auto'
                      : 'bg-foreground/5 text-foreground',
                    message.error && 'border border-red-200 bg-red-50 dark:bg-red-900/20'
                  )}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <div className={cn(
                      'text-xs mt-2 opacity-70',
                      message.role === 'user' ? 'text-white/70' : 'text-muted-foreground'
                    )}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  variants={motionTypingVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="flex gap-3 justify-start"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-accent to-yellow-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-foreground/5 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">AI is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-border/50 bg-foreground/2">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="min-h-[44px] max-h-32 resize-none rounded-xl border-border/50 focus:border-gold-accent/50 focus:ring-gold-accent/50"
                disabled={isLoading}
                aria-label="Chat input"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="h-11 w-11 p-0 rounded-xl bg-gradient-to-r from-gold-accent to-yellow-600 hover:from-yellow-600 hover:to-gold-accent"
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-2 mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setInputValue('Help me optimize this prompt: ')}
              className="h-7 text-xs rounded-lg bg-foreground/5 hover:bg-foreground/10"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Optimize Prompt
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setInputValue('Show me template examples for ')}
              className="h-7 text-xs rounded-lg bg-foreground/5 hover:bg-foreground/10"
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Find Templates
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}