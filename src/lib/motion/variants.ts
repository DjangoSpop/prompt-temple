import { Variants } from 'framer-motion';

/**
 * Reusable Framer Motion variants for consistent animations
 * All animations respect prefers-reduced-motion
 */

// Legacy variants (preserved for compatibility)
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.22, 0.1, 0.12, 1] } },
  exit: { opacity: 0, y: 4, transition: { duration: 0.16 } },
};

export const subtleScale: Variants = {
  hidden: { opacity: 0, scale: 0.995 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.18 } },
};

// Check for reduced motion preference
export const getReducedMotionVariants = (variants: Variants): Variants => {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Return simplified variants with no motion
    const reducedVariants: Variants = {};
    Object.keys(variants).forEach(key => {
      reducedVariants[key] = {
        opacity: variants[key]?.opacity ?? 1,
        scale: 1,
        x: 0,
        y: 0,
        rotate: 0,
      };
    });
    return reducedVariants;
  }
  return variants;
};

// Navbar animations
export const navbarVariants: Variants = {
  hidden: {
    y: -100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
      duration: 0.4,
    },
  },
  scrolled: {
    y: 0,
    opacity: 1,
    scale: 0.98,
    backdropFilter: 'blur(16px)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      duration: 0.2,
    },
  },
};

// AI Services Menu animations
export const menuVariants: Variants = {
  closed: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    pointerEvents: 'none',
  },
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
    pointerEvents: 'auto',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      duration: 0.2,
    },
  },
};

export const menuItemVariants: Variants = {
  closed: {
    opacity: 0,
    x: -10,
  },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.2,
    },
  }),
  hover: {
    x: 4,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
};

// Button animations
export const buttonVariants: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
};

export const ctaButtonVariants: Variants = {
  initial: {
    scale: 1,
    boxShadow: '0 4px 20px rgba(203, 161, 53, 0.15)',
  },
  hover: {
    scale: 1.05,
    boxShadow: '0 8px 40px rgba(203, 161, 53, 0.25)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
};

// Modal animations
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 50,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: {
      duration: 0.2,
    },
  },
};

export const overlayVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// Chat interface animations
export const chatMessageVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      duration: 0.3,
    },
  },
};

export const typingIndicatorVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
    },
  },
};

// Liquid morphism effect
export const liquidVariants: Variants = {
  initial: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
  },
  hover: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(16px)',
    borderRadius: '32px',
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  },
};

// Loading animations
export const loadingVariants: Variants = {
  initial: {
    rotate: 0,
  },
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const pulseVariants: Variants = {
  initial: {
    scale: 1,
    opacity: 1,
  },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Utility function to apply reduced motion
export const useMotionVariants = (variants: Variants): Variants => {
  return getReducedMotionVariants(variants);
};
