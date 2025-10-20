'use client';

import { motion } from 'framer-motion';
import { SunDisk } from './SunDisk';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  animated?: boolean;
}

const sizeMap = {
  sm: { disk: 20, text: 'text-base' },
  md: { disk: 32, text: 'text-xl' },
  lg: { disk: 48, text: 'text-3xl' }
};

/**
 * Logo - Prompt Teme brand logo
 * Combines the sun disk with the brand name
 * Pharaonic Sahara styling with Cinzel font
 */
export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  animated = false
}) => {
  const { disk, text } = sizeMap[size];

  return (
    <motion.div
      className={cn("flex items-center gap-3", className)}
      initial={animated ? { opacity: 0, x: -20 } : undefined}
      animate={animated ? { opacity: 1, x: 0 } : undefined}
      transition={animated ? {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      } : undefined}
    >
      <SunDisk size={disk} animate={animated} />

      {showText && (
        <div className="flex flex-col">
          <motion.h1
            className={cn(
              "font-heading font-semibold leading-none tracking-tight",
              "bg-gradient-to-r from-nile to-sun bg-clip-text text-transparent",
              text
            )}
            initial={animated ? { opacity: 0 } : undefined}
            animate={animated ? { opacity: 1 } : undefined}
            transition={animated ? { delay: 0.1, duration: 0.2 } : undefined}
          >
            Prompt Teme
          </motion.h1>
          <motion.p
            className="text-xs font-ui text-stone tracking-wide"
            initial={animated ? { opacity: 0 } : undefined}
            animate={animated ? { opacity: 1 } : undefined}
            transition={animated ? { delay: 0.15, duration: 0.2 } : undefined}
          >
            Made in Egypt
          </motion.p>
        </div>
      )}
    </motion.div>
  );
};
