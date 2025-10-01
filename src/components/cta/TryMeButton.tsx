'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageSquare, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ctaButtonVariants, useMotionVariants } from '@/lib/motion/variants';
import { TryMeChatModal } from '@/components/chat/TryMeChatModal';

export interface TryMeButtonProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  children?: React.ReactNode;
}

export function TryMeButton({ 
  size = 'md', 
  variant = 'primary',
  className,
  children 
}: TryMeButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Apply motion preferences
  const motionVariants = useMotionVariants(ctaButtonVariants);

  const sizeClasses = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 text-base',
    lg: 'h-14 px-8 text-lg',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-gold-accent to-yellow-600 hover:from-yellow-600 hover:to-gold-accent text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-foreground/10 hover:bg-foreground/15 text-foreground border border-foreground/20',
    outline: 'border-2 border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-white',
  };

  return (
    <>
      <motion.div
        variants={motionVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        className="relative"
      >
        <Button
          onClick={() => setIsModalOpen(true)}
          className={cn(
            // Base styles
            'font-semibold rounded-xl transition-all duration-300',
            'focus:ring-2 focus:ring-gold-accent/50 focus:outline-none',
            // Size styles
            sizeClasses[size],
            // Variant styles
            variantClasses[variant],
            // Custom class
            className
          )}
        >
          {children || (
            <>
              <MessageSquare className="h-4 w-4 mr-2" />
              Try Me
              <Sparkles className="h-3 w-3 ml-2 opacity-80" />
            </>
          )}
          
          {/* Animated sparkle effect */}
          <motion.div
            className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 1,
            }}
          />
        </Button>
      </motion.div>

      {/* Chat Modal */}
      <TryMeChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}