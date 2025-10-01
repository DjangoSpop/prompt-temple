'use client';

import { ReactNode, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MainNavbar } from '@/components/nav/MainNavbar';
import { getScrollifyManager } from '@/lib/scroll/scrollify';
import { cn } from '@/lib/utils';

export interface MarketingLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function MarketingLayout({ children, className }: MarketingLayoutProps) {
  // Initialize Scrollify for smooth section scrolling
  useEffect(() => {
    const scrollifyManager = getScrollifyManager({
      section: '.scrollify-section',
      offset: 80, // Account for navbar height + padding
      scrollSpeed: 1200,
      easing: 'easeInOutCubic',
      updateHash: false,
      touchScroll: true,
    });

    // Initialize with a delay to ensure DOM is ready
    const initScrollify = async () => {
      try {
        await scrollifyManager.init();
      } catch (error) {
        console.warn('Scrollify initialization failed:', error);
      }
    };

    const timer = setTimeout(initScrollify, 100);

    return () => {
      clearTimeout(timer);
      scrollifyManager.destroy();
    };
  }, []);

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* Enhanced Navbar with liquid morphism */}
      <MainNavbar />
      
      {/* Main Content with motion-safe wrapper */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="motion-safe:animate-fadeIn"
      >
        {children}
      </motion.main>
    </div>
  );
}