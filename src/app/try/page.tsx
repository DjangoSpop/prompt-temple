'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Loader2, 
  MessageSquare,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { chatMessageVariants, typingIndicatorVariants, useMotionVariants } from '@/lib/motion/variants';
import { aiServices } from '@/lib/api/services';
import type { ChatMessage } from '@/lib/api/types';

export default function TryPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to Prompt Temple! I\'m your AI assistant. I can help you with prompt optimization, answer questions, and guide you through our features. What would you like to explore today?',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Apply motion preferences
  const motionMessageVariants = useMotionVariants(chatMessageVariants);
  const motionTypingVariants = useMotionVariants(typingIndicatorVariants);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="rounded-xl">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-accent to-yellow-600 flex items-center justify-center shadow-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Try Our AI Assistant</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the power of our AI assistant. Ask questions, get help with prompts, 
              or explore our features in this interactive chat interface.
            </p>
          </div>
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="h-[600px] flex flex-col rounded-2xl shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-white/20">
            
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-border/50 bg-foreground/2 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-accent to-yellow-600 flex items-center justify-center shadow-sm">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold">AI Assistant</h2>
                  <p className="text-sm text-muted-foreground">
                    Always ready to help
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-4">
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

                {/* Typing Indicator */}
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

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="px-6 py-4 border-t border-border/50 bg-foreground/2 rounded-b-2xl">
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
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="h-11 w-11 p-0 rounded-xl bg-gradient-to-r from-gold-accent to-yellow-600 hover:from-yellow-600 hover:to-gold-accent"
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInputValue('How do I get started with Prompt Temple?')}
                  className="h-7 text-xs rounded-lg bg-foreground/5 hover:bg-foreground/10"
                >
                  <Bot className="h-3 w-3 mr-1" />
                  Getting Started
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Features Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          <Card className="p-6 text-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-white/20">
            <Sparkles className="h-8 w-8 mx-auto mb-4 text-gold-accent" />
            <h3 className="font-semibold mb-2">Prompt Optimization</h3>
            <p className="text-sm text-muted-foreground">
              Get AI-powered suggestions to improve your prompts
            </p>
          </Card>
          
          <Card className="p-6 text-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-white/20">
            <MessageSquare className="h-8 w-8 mx-auto mb-4 text-blue-600" />
            <h3 className="font-semibold mb-2">Interactive Chat</h3>
            <p className="text-sm text-muted-foreground">
              Ask questions and get instant intelligent responses
            </p>
          </Card>
          
          <Card className="p-6 text-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-white/20">
            <Bot className="h-8 w-8 mx-auto mb-4 text-purple-600" />
            <h3 className="font-semibold mb-2">AI Assistance</h3>
            <p className="text-sm text-muted-foreground">
              Powered by advanced AI to help with all your needs
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}