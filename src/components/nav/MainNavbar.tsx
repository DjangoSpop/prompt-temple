'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { 
  Bot, 
  Menu, 
  X,
  User,
  ChevronDown,
  Sparkles,
  Zap,
  Database,
  BookOpen,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { navbarVariants, buttonVariants, useMotionVariants } from '@/lib/motion/variants';
import { AIServicesMenu } from './AIServicesMenu';
import { TryMeButton } from '@/components/cta/TryMeButton';

export interface MainNavbarProps {
  activePath?: string;
  className?: string;
}

export function MainNavbar({ activePath, className }: MainNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  // Apply motion preferences
  const motionNavbarVariants = useMotionVariants(navbarVariants);
  const motionButtonVariants = useMotionVariants(buttonVariants);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAiMenuOpen(false);
  }, [pathname]);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsAiMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    if (activePath) return activePath === path;
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: Sparkles },
    { href: '/templates', label: 'Templates', icon: BookOpen },
    { href: '/optimization', label: 'Optimizer', icon: Zap },
    { href: '/help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <motion.nav
      ref={navRef}
      initial="hidden"
      animate="visible"
      variants={motionNavbarVariants}
      className={cn(
        // Base styles - sticky positioning with high z-index
        'sticky top-0 z-50 w-full',
        // Liquid morphism container
        'px-4 py-2',
        className
      )}
    >
      {/* Liquid morphism background with backdrop blur */}
      <motion.div
        animate={isScrolled ? 'scrolled' : 'visible'}
        variants={motionNavbarVariants}
        className={cn(
          // Liquid container with rounded corners and blur
          'mx-auto max-w-7xl rounded-2xl border border-white/20 shadow-lg',
          // Glass morphism background
          'bg-white/70 backdrop-blur-md',
          'dark:bg-gray-900/70 dark:border-gray-700/30',
          // Smooth transitions
          'transition-all duration-300',
          // Hover effects
          'hover:bg-white/80 hover:shadow-xl',
          'dark:hover:bg-gray-900/80'
        )}
      >
        <div className="flex h-14 items-center justify-between px-6">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-gold-accent to-yellow-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                <svg className="h-4 w-4 text-basalt-black" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12,2 22,18 2,18" className="opacity-90" />
                </svg>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground group-hover:text-gold-accent transition-colors">
                Prompt Temple
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              
              return (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    variants={motionButtonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        'h-9 px-3 rounded-xl font-medium transition-all duration-200',
                        active
                          ? 'bg-gold-accent/20 text-gold-accent border border-gold-accent/30'
                          : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
                      )}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {link.label}
                    </Button>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            
            {/* AI Button with Services Menu */}
            <div className="relative">
              <motion.div
                variants={motionButtonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAiMenuOpen(!isAiMenuOpen)}
                  className={cn(
                    'h-9 px-3 rounded-xl font-medium transition-all duration-200',
                    'text-foreground/70 hover:text-foreground hover:bg-foreground/5',
                    'focus:ring-2 focus:ring-gold-accent/50 focus:outline-none',
                    isAiMenuOpen && 'bg-gold-accent/20 text-gold-accent'
                  )}
                  aria-expanded={isAiMenuOpen}
                  aria-haspopup="menu"
                  aria-label="AI Services Menu"
                >
                  <Bot className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">AI</span>
                  <ChevronDown className={cn(
                    'h-3 w-3 ml-1 transition-transform duration-200',
                    isAiMenuOpen && 'rotate-180'
                  )} />
                </Button>
              </motion.div>

              {/* AI Services Dropdown */}
              <AIServicesMenu
                isOpen={isAiMenuOpen}
                onClose={() => setIsAiMenuOpen(false)}
              />
            </div>

            {/* Try Me CTA */}
            <TryMeButton size="sm" />

            {/* User Menu or Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 rounded-full p-0 hover:bg-foreground/5"
                  asChild
                >
                  <Link href="/profile">
                    <User className="h-4 w-4" />
                    <span className="sr-only">Profile</span>
                  </Link>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="hidden sm:flex h-9 px-3 rounded-xl text-foreground/70 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  <span className="text-xs">Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-1">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/register">Join Temple</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden h-9 w-9 p-0"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-white/20 px-6 py-4 space-y-2"
            >
              {/* Mobile Navigation Links */}
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                
                return (
                  <Link key={link.href} href={link.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-start h-10 px-3 rounded-xl',
                        active
                          ? 'bg-gold-accent/20 text-gold-accent'
                          : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
                      )}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}

              {/* Mobile Auth Section */}
              {isAuthenticated ? (
                <div className="pt-2 border-t border-white/20 space-y-2">
                  <Link href="/profile">
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-10 px-3 rounded-xl text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                    >
                      <User className="h-4 w-4 mr-3" />
                      Profile
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="w-full justify-start h-10 px-3 rounded-xl text-foreground/70 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="pt-2 border-t border-white/20 space-y-2">
                  <Link href="/auth/login">
                    <Button variant="ghost" className="w-full justify-start h-10 px-3 rounded-xl">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="w-full h-10 rounded-xl">
                      Join Temple
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.nav>
  );
}