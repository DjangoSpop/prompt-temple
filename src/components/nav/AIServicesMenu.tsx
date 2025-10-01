'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Database, 
  Bot, 
  BookOpen, 
  HelpCircle,
  ArrowRight,
  Sparkles,
  Brain,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { menuVariants, menuItemVariants, useMotionVariants } from '@/lib/motion/variants';

export interface AIServicesMenuProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const aiServices = [
  {
    id: 'optimizer',
    title: 'Prompt Optimizer',
    description: 'Enhance your prompts with AI-powered suggestions',
    icon: Zap,
    href: '/optimization',
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-700/50',
  },
  {
    id: 'rag',
    title: 'RAG Studio',
    description: 'Query your knowledge base with semantic search',
    icon: Database,
    href: '/rag',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-700/50',
  },
  {
    id: 'assistant',
    title: 'AI Assistant',
    description: 'Chat with our intelligent AI assistant',
    icon: Bot,
    href: '/chat',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-700/50',
  },
  {
    id: 'templates',
    title: 'Template Library',
    description: 'Browse and discover prompt templates',
    icon: BookOpen,
    href: '/templates',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-700/50',
  },
  {
    id: 'docs',
    title: 'Documentation',
    description: 'Learn how to master prompt engineering',
    icon: HelpCircle,
    href: '/help',
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-50 dark:bg-gray-900/20',
    borderColor: 'border-gray-200 dark:border-gray-700/50',
  },
];

export function AIServicesMenu({ isOpen, onClose, className }: AIServicesMenuProps) {
  const router = useRouter();

  // Apply motion preferences
  const motionMenuVariants = useMotionVariants(menuVariants);
  const motionItemVariants = useMotionVariants(menuItemVariants);

  const handleServiceClick = (href: string) => {
    onClose();
    router.push(href);
  };

  const handleKeyDown = (event: React.KeyboardEvent, href: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleServiceClick(href);
    }
    if (event.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="closed"
          animate="open"
          exit="closed"
          variants={motionMenuVariants}
          className={cn(
            // Positioning
            'absolute right-0 top-full mt-2 z-50',
            // Responsive width
            'w-80 sm:w-96',
            // Liquid morphism styling
            'rounded-2xl border border-white/20 shadow-xl',
            'bg-white/80 backdrop-blur-md',
            'dark:bg-gray-900/80 dark:border-gray-700/30',
            // Ensure proper stacking
            'overflow-hidden',
            className
          )}
          role="menu"
          aria-label="AI Services Menu"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/20 dark:border-gray-700/30">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-accent to-yellow-600 flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <h3 className="font-semibold text-foreground">AI Services</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Powerful AI tools at your fingertips
            </p>
          </div>

          {/* Services List */}
          <div className="p-2 space-y-1">
            {aiServices.map((service, index) => {
              const Icon = service.icon;
              
              return (
                <motion.div
                  key={service.id}
                  custom={index}
                  variants={motionItemVariants}
                  initial="closed"
                  animate="open"
                  whileHover="hover"
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      // Layout
                      'w-full h-auto p-3 rounded-xl',
                      // Flex layout for content
                      'flex items-start space-x-3',
                      // Text alignment
                      'text-left justify-start',
                      // Hover effects
                      'hover:bg-foreground/5 hover:shadow-sm',
                      // Focus styles
                      'focus:ring-2 focus:ring-gold-accent/50 focus:outline-none'
                    )}
                    onClick={() => handleServiceClick(service.href)}
                    onKeyDown={(e) => handleKeyDown(e, service.href)}
                    role="menuitem"
                    tabIndex={0}
                  >
                    {/* Icon */}
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      'border',
                      service.bgColor,
                      service.borderColor
                    )}>
                      <Icon className={cn('h-4 w-4', service.color)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-foreground text-sm">
                          {service.title}
                        </h4>
                        <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                  </Button>
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/20 dark:border-gray-700/30 bg-foreground/2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Brain className="h-3 w-3" />
                <span>Powered by AI</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs rounded-lg hover:bg-foreground/5"
                onClick={() => handleServiceClick('/help')}
              >
                <Search className="h-3 w-3 mr-1" />
                Explore All
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}