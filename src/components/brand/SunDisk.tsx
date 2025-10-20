'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SunDiskProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

/**
 * SunDisk - Pharaonic sun disk motif
 * A circular sun symbol representing Ra, the Egyptian sun god
 * Used in loaders, logos, and accent elements
 */
export const SunDisk: React.FC<SunDiskProps> = ({
  size = 24,
  className = '',
  animate = false
}) => {
  const rays = 8;

  return (
    <motion.div
      className={cn(
        "inline-flex items-center justify-center relative",
        className
      )}
      style={{ width: size, height: size }}
      initial={animate ? { rotate: 0, scale: 0.9 } : undefined}
      animate={animate ? {
        rotate: 360,
        scale: [0.9, 1, 0.9],
      } : undefined}
      transition={animate ? {
        rotate: {
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        },
        scale: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      } : undefined}
    >
      {/* Sun disk core */}
      <div
        className="absolute rounded-full bg-gradient-to-br from-sun to-sun-hover shadow-lg"
        style={{
          width: size * 0.6,
          height: size * 0.6,
          boxShadow: '0 0 12px rgba(255, 140, 66, 0.4)'
        }}
      />

      {/* Sun rays */}
      {Array.from({ length: rays }).map((_, i) => (
        <div
          key={i}
          className="absolute bg-sun"
          style={{
            width: size * 0.08,
            height: size * 0.3,
            left: '50%',
            top: '50%',
            transformOrigin: 'center',
            transform: `translate(-50%, -50%) rotate(${(360 / rays) * i}deg) translateY(-${size * 0.35}px)`,
            borderRadius: '2px',
            opacity: 0.7
          }}
        />
      ))}
    </motion.div>
  );
};
