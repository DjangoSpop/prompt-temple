'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { ComponentType } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useSuppressHydrationWarning } from '@/hooks/useSuppressHydrationWarning';
import { ThemeToggle } from '@/components/ThemeToggle';
import { OnboardingTrigger } from '@/components/onboarding';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import {
  Crown,
  BookOpen,
  Sparkles,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  MessageSquare,
  Bot,
  TrendingUp,
  HelpCircle,
  Activity,
  GraduationCap,
  Zap,
  Brain,
  FileText,
  Users,
  Star,
  Search,
  ChevronDown,
  Award,
  History,
  Palette,
  Database,
  Globe,
  Shield,
  Code2,
  Workflow,
  Target,
  Lightbulb,
  Command,
  Plus,
  Bell,
  ChevronRight,
  LayoutDashboard,
  PlusCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type NavSection = 'core' | 'create' | 'analyze' | 'enterprise' | 'learn' | 'community';

type NavLink = {
  href: string;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  section: NavSection;
  badge?: 'New' | 'Beta' | 'Pro' | 'Hot';
  subLinks?: Omit<NavLink, 'subLinks'>[];
  keywords?: string[];
  popularity?: number; // 1-10 for sorting
};

type AuthUser = ReturnType<typeof useAuth>['user'];

const SECTION_METADATA: Record<NavSection, {
  title: string;
  description: string;
  color: string;
  icon: ComponentType<{ className?: string }>;
}> = {
  core: {
    title: 'Core Platform',
    description: 'Essential tools and dashboard',
    color: 'from-blue-500 to-indigo-600',
    icon: LayoutDashboard,
  },
  create: {
    title: 'Create & Optimize',
    description: 'Build and enhance prompts',
    color: 'from-purple-500 to-pink-600',
    icon: Sparkles,
  },
  analyze: {
    title: 'Analyze & Monitor',
    description: 'Performance and insights',
    color: 'from-green-500 to-emerald-600',
    icon: BarChart3,
  },
  enterprise: {
    title: 'Enterprise',
    description: 'Team collaboration tools',
    color: 'from-orange-500 to-red-600',
    icon: Users,
  },
  learn: {
    title: 'Learn & Grow',
    description: 'Education and certification',
    color: 'from-cyan-500 to-blue-600',
    icon: GraduationCap,
  },
  community: {
    title: 'Community',
    description: 'Connect and share',
    color: 'from-pink-500 to-rose-600',
    icon: Globe,
  },
};

const ENHANCED_NAV_LINKS: NavLink[] = [
  // Core Platform
  {
    href: '/',
    label: 'Dashboard',
    description: 'Overview, metrics, and quick actions',
    icon: LayoutDashboard,
    section: 'core',
    keywords: ['home', 'overview', 'metrics'],
    popularity: 10,
  },
  {
    href: '/workspace',
    label: 'Workspace',
    description: 'Personal prompt workspace',
    icon: FileText,
    section: 'core',
    keywords: ['workspace', 'personal', 'drafts'],
    popularity: 8,
    subLinks: [
      { href: '/workspace/drafts', label: 'Drafts', description: 'Work in progress', icon: FileText, section: 'core' },
      { href: '/workspace/favorites', label: 'Favorites', description: 'Starred prompts', icon: Star, section: 'core' },
    ],
  },

  // Create & Optimize
  {
    href: '/templates',
    label: 'Templates',
    description: 'Prompt library and template manager',
    icon: BookOpen,
    section: 'create',
    keywords: ['templates', 'library', 'prompts'],
    popularity: 9,
    subLinks: [
      { href: '/templates/create', label: 'Create Template', description: 'Build new template', icon: PlusCircle, section: 'create' },
      { href: '/templates/categories', label: 'Categories', description: 'Browse by category', icon: Palette, section: 'create' },
    ],
  },
  {
    href: '/optimizer',
    label: 'Advanced Optimizer',
    description: 'MiPRO, GraphRAG, and AI enhancement',
    icon: Zap,
    section: 'create',
    badge: 'Hot',
    keywords: ['optimize', 'mipro', 'graphrag', 'enhance'],
    popularity: 9,
    subLinks: [
      { href: '/optimizer?mode=mipro', label: 'MiPRO Engine', description: 'ML-powered optimization', icon: Brain, section: 'create' },
      { href: '/optimizer?mode=graphrag', label: 'GraphRAG', description: 'Knowledge synthesis', icon: Database, section: 'create' },
    ],
  },
  {
    href: '/chat/live',
    label: 'AI Oracle',
    description: 'Live conversations with AI models',
    icon: MessageSquare,
    section: 'create',
    keywords: ['chat', 'oracle', 'conversation', 'ai'],
    popularity: 8,
    subLinks: [
      { href: '/chat/live/rag', label: 'RAG Agent', description: 'Knowledge-enhanced chat', icon: Bot, section: 'create' },
      { href: '/chat/enhanced', label: 'Enhanced Chat', description: 'Advanced features', icon: Sparkles, section: 'create' },
    ],
  },
  {
    href: '/builder',
    label: 'Workflow Builder',
    description: 'Visual no-code prompt workflows',
    icon: Workflow,
    section: 'create',
    badge: 'New',
    keywords: ['workflow', 'builder', 'nocode', 'visual'],
    popularity: 7,
  },

  // Analyze & Monitor
  {
    href: '/analytics',
    label: 'Analytics',
    description: 'Performance insights and metrics',
    icon: TrendingUp,
    section: 'analyze',
    keywords: ['analytics', 'metrics', 'performance'],
    popularity: 7,
    subLinks: [
      { href: '/analytics/prompts', label: 'Prompt Analytics', description: 'Template performance', icon: Target, section: 'analyze' },
      { href: '/analytics/usage', label: 'Usage Stats', description: 'Platform usage', icon: Activity, section: 'analyze' },
    ],
  },
  {
    href: '/status',
    label: 'System Health',
    description: 'Platform status and uptime',
    icon: Activity,
    section: 'analyze',
    keywords: ['status', 'health', 'uptime'],
    popularity: 6,
  },
  {
    href: '/history',
    label: 'History',
    description: 'Prompt and optimization history',
    icon: History,
    section: 'analyze',
    keywords: ['history', 'logs', 'past'],
    popularity: 6,
  },

  // Enterprise
  {
    href: '/teams',
    label: 'Teams',
    description: 'Team collaboration and management',
    icon: Users,
    section: 'enterprise',
    badge: 'Pro',
    keywords: ['teams', 'collaboration', 'enterprise'],
    popularity: 5,
    subLinks: [
      { href: '/teams/members', label: 'Members', description: 'Team member management', icon: Users, section: 'enterprise' },
      { href: '/teams/permissions', label: 'Permissions', description: 'Access control', icon: Shield, section: 'enterprise' },
    ],
  },
  {
    href: '/billing',
    label: 'Billing',
    description: 'Subscription and usage billing',
    icon: Crown,
    section: 'enterprise',
    keywords: ['billing', 'subscription', 'payment'],
    popularity: 4,
  },
  {
    href: '/api',
    label: 'API Access',
    description: 'Developer API and integrations',
    icon: Code2,
    section: 'enterprise',
    keywords: ['api', 'developer', 'integration'],
    popularity: 5,
  },

  // Learn & Grow
  {
    href: '/learn',
    label: 'Learn Hub',
    description: 'Courses, tutorials, and certifications',
    icon: GraduationCap,
    section: 'learn',
    badge: 'New',
    keywords: ['learn', 'courses', 'education'],
    popularity: 8,
    subLinks: [
      { href: '/learn/courses', label: 'Courses', description: 'Structured learning paths', icon: BookOpen, section: 'learn' },
      { href: '/learn/certifications', label: 'Certifications', description: 'Professional certificates', icon: Award, section: 'learn' },
    ],
  },
  {
    href: '/achievements',
    label: 'Achievements',
    description: 'Badges, levels, and progress',
    icon: Award,
    section: 'learn',
    keywords: ['achievements', 'badges', 'gamification'],
    popularity: 5,
  },

  // Community
  {
    href: '/community',
    label: 'Community',
    description: 'Connect with other prompt engineers',
    icon: Globe,
    section: 'community',
    keywords: ['community', 'forums', 'social'],
    popularity: 6,
  },
  {
    href: '/marketplace',
    label: 'Marketplace',
    description: 'Buy and sell prompt templates',
    icon: Star,
    section: 'community',
    badge: 'Beta',
    keywords: ['marketplace', 'buy', 'sell', 'templates'],
    popularity: 7,
  },

  // Additional pages
  {
    href: '/help',
    label: 'Help Center',
    description: 'Documentation and support',
    icon: HelpCircle,
    section: 'core',
    keywords: ['help', 'support', 'docs'],
    popularity: 6,
  },
  {
    href: '/profile',
    label: 'Profile',
    description: 'Account settings and preferences',
    icon: Crown,
    section: 'core',
    keywords: ['profile', 'account', 'settings'],
    popularity: 5,
  },
];

export function EnhancedNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [notifications, setNotifications] = useState(3);

  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  useSuppressHydrationWarning();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname, isClient]);

  // Search functionality
  const filteredLinks = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return ENHANCED_NAV_LINKS
      .filter(link =>
        link.label.toLowerCase().includes(query) ||
        link.description.toLowerCase().includes(query) ||
        link.keywords?.some(keyword => keyword.includes(query))
      )
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 8);
  }, [searchQuery]);

  const groupedLinks = useMemo(() => {
    const grouped: Record<NavSection, NavLink[]> = {
      core: [],
      create: [],
      analyze: [],
      enterprise: [],
      learn: [],
      community: [],
    };

    ENHANCED_NAV_LINKS.forEach(link => {
      grouped[link.section].push(link);
    });

    // Sort by popularity within each group
    Object.keys(grouped).forEach(section => {
      grouped[section as NavSection].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    });

    return grouped;
  }, []);

  const isActivePath = useCallback((href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  }, [pathname]);

  const handleSearch = useCallback((query: string) => {
    if (query.trim()) {
      const firstResult = filteredLinks[0];
      if (firstResult) {
        router.push(firstResult.href);
        setSearchQuery('');
        setIsSearchOpen(false);
      }
    }
  }, [filteredLinks, router]);

  const toggleDropdown = useCallback((section: string) => {
    setActiveDropdown(activeDropdown === section ? null : section);
  }, [activeDropdown]);

  const navClassName = cn(
    'sticky top-0 z-50 transition-all duration-300 border-b',
    isScrolled
      ? 'bg-background/95 backdrop-blur-xl border-border shadow-lg shadow-black/5'
      : 'bg-background/98 border-transparent'
  );

  if (!isClient) {
    return (
      <nav className={navClassName} aria-label="Primary navigation">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <EnhancedLogo />
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 animate-pulse rounded-full bg-muted/40" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className={navClassName} aria-label="Primary navigation">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <EnhancedLogo />

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {Object.entries(SECTION_METADATA).slice(0, 4).map(([section, metadata]) => {
                const sectionLinks = groupedLinks[section as NavSection].slice(0, 3);
                const hasActiveLink = sectionLinks.some(link => isActivePath(link.href));

                return (
                  <div key={section} className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-10 px-3 rounded-lg transition-all duration-200",
                        hasActiveLink
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted/60"
                      )}
                      onClick={() => toggleDropdown(section)}
                    >
                      <metadata.icon className="h-4 w-4 mr-2" />
                      {metadata.title}
                      <ChevronDown className={cn(
                        "h-3 w-3 ml-1 transition-transform duration-200",
                        activeDropdown === section ? "rotate-180" : ""
                      )} />
                    </Button>

                    <AnimatePresence>
                      {activeDropdown === section && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-12 left-0 w-80 bg-background/98 backdrop-blur-xl border border-border rounded-xl shadow-2xl overflow-hidden z-50"
                        >
                          <div className={cn(
                            "px-4 py-3 bg-gradient-to-r text-white",
                            metadata.color
                          )}>
                            <div className="flex items-center gap-2">
                              <metadata.icon className="h-5 w-5" />
                              <div>
                                <h3 className="font-semibold text-sm">{metadata.title}</h3>
                                <p className="text-xs opacity-90">{metadata.description}</p>
                              </div>
                            </div>
                          </div>

                          <div className="p-2 max-h-80 overflow-y-auto">
                            {sectionLinks.map(link => {
                              const Icon = link.icon;
                              const isActive = isActivePath(link.href);

                              return (
                                <Link
                                  key={link.href}
                                  href={link.href}
                                  className={cn(
                                    "flex items-center gap-3 p-3 rounded-lg transition-all duration-150 hover:bg-muted/60",
                                    isActive && "bg-primary/10 text-primary"
                                  )}
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  <div className={cn(
                                    "p-2 rounded-md",
                                    isActive ? "bg-primary/20" : "bg-muted/40"
                                  )}>
                                    <Icon className="h-4 w-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-sm truncate">
                                        {link.label}
                                      </span>
                                      {link.badge && (
                                        <Badge variant="secondary" className="text-xs">
                                          {link.badge}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                      {link.description}
                                    </p>
                                  </div>
                                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                </Link>
                              );
                            })}

                            {groupedLinks[section as NavSection].length > 3 && (
                              <Link
                                href={`#${section}`}
                                className="flex items-center justify-center gap-2 p-3 mt-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                onClick={() => setActiveDropdown(null)}
                              >
                                View All {metadata.title}
                                <ChevronRight className="h-3 w-3" />
                              </Link>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg hover:bg-muted/60"
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  if (!isSearchOpen) {
                    setTimeout(() => searchRef.current?.focus(), 100);
                  }
                }}
              >
                <Search className="h-4 w-4" />
              </Button>

              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95, x: 20 }}
                    className="absolute top-12 right-0 w-80 bg-background/98 backdrop-blur-xl border border-border rounded-xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-border">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          ref={searchRef}
                          type="text"
                          placeholder="Search pages and features..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSearch(searchQuery);
                            }
                            if (e.key === 'Escape') {
                              setIsSearchOpen(false);
                            }
                          }}
                          className="pl-10 pr-4 h-10 bg-muted/40 border-0 focus:bg-background"
                        />
                        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-muted border border-border rounded">
                          ⌘K
                        </kbd>
                      </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {filteredLinks.length > 0 ? (
                        <div className="p-2">
                          {filteredLinks.map(link => {
                            const Icon = link.icon;
                            return (
                              <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/60 transition-colors"
                                onClick={() => {
                                  setIsSearchOpen(false);
                                  setSearchQuery('');
                                }}
                              >
                                <div className="p-2 rounded-md bg-muted/40">
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">
                                      {link.label}
                                    </span>
                                    {link.badge && (
                                      <Badge variant="secondary" className="text-xs">
                                        {link.badge}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-1">
                                    {link.description}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      ) : searchQuery ? (
                        <div className="p-8 text-center">
                          <Search className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                          <p className="text-sm text-muted-foreground">
                            No results for "{searchQuery}"
                          </p>
                        </div>
                      ) : (
                        <div className="p-4">
                          <p className="text-sm text-muted-foreground mb-3">Quick access:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {ENHANCED_NAV_LINKS.slice(0, 4).map(link => {
                              const Icon = link.icon;
                              return (
                                <Link
                                  key={link.href}
                                  href={link.href}
                                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/60 transition-colors"
                                  onClick={() => setIsSearchOpen(false)}
                                >
                                  <Icon className="h-3 w-3" />
                                  <span className="text-xs truncate">{link.label}</span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg hover:bg-muted/60 relative"
              >
                <Bell className="h-4 w-4" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </Button>
            )}

            {/* Quick Actions */}
            <div className="hidden sm:flex items-center gap-1">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>

            {/* User Menu / Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/profile">
                    <Button variant="ghost" size="sm" className="rounded-lg">
                      <Crown className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="rounded-lg hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="rounded-lg">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <EnhancedMobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        groupedLinks={groupedLinks}
        isAuthenticated={isAuthenticated}
        user={user}
        isActivePath={isActivePath}
        onLogout={logout}
      />

      {/* Click outside to close dropdowns */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </>
  );
}

function EnhancedLogo() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-3 rounded-xl px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
    >
      <div className="relative">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 p-2 shadow-lg transition-transform duration-200 group-hover:scale-105">
          <Zap className="h-6 w-6 text-white" />
        </div>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 opacity-0 blur-lg transition-opacity duration-200 group-hover:opacity-50" />
      </div>
      <div>
        <span className="block text-lg font-bold text-foreground">
          PromptForge
        </span>
        <span className="block text-xs font-medium text-muted-foreground">
          AI Enhancement Platform
        </span>
      </div>
    </Link>
  );
}

function EnhancedMobileMenu({
  isOpen,
  onClose,
  groupedLinks,
  isAuthenticated,
  user,
  isActivePath,
  onLogout,
}: {
  isOpen: boolean;
  onClose: () => void;
  groupedLinks: Record<NavSection, NavLink[]>;
  isAuthenticated: boolean;
  user: AuthUser;
  isActivePath: (href: string) => boolean;
  onLogout: () => void;
}) {
  const [activeSection, setActiveSection] = useState<NavSection | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-background border-l border-border shadow-2xl">
        <div className="flex h-16 items-center justify-between px-6 border-b border-border">
          <h2 className="text-lg font-semibold">Navigation</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* User Section */}
          {isAuthenticated ? (
            <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                  {user?.first_name?.[0] || 'U'}
                </div>
                <div>
                  <p className="font-semibold">{user?.first_name || 'User'}</p>
                  <p className="text-sm text-muted-foreground">Pro Member</p>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-4">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Sign in to access your workspace and settings
                </p>
                <div className="flex gap-2">
                  <Link href="/auth/login" className="flex-1" onClick={onClose}>
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link href="/auth/register" className="flex-1" onClick={onClose}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              </div>
            </Card>
          )}

          {/* Navigation Sections */}
          {Object.entries(SECTION_METADATA).map(([sectionKey, metadata]) => {
            const section = sectionKey as NavSection;
            const links = groupedLinks[section];
            if (links.length === 0) return null;

            return (
              <div key={section}>
                <button
                  onClick={() => setActiveSection(activeSection === section ? null : section)}
                  className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-muted/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg bg-gradient-to-br text-white",
                      metadata.color
                    )}>
                      <metadata.icon className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{metadata.title}</p>
                      <p className="text-sm text-muted-foreground">{metadata.description}</p>
                    </div>
                  </div>
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    activeSection === section ? "rotate-180" : ""
                  )} />
                </button>

                <AnimatePresence>
                  {activeSection === section && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-14 mr-4 mt-2 space-y-1">
                        {links.map(link => {
                          const Icon = link.icon;
                          const isActive = isActivePath(link.href);

                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={onClose}
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-lg transition-colors",
                                isActive
                                  ? "bg-primary/10 text-primary"
                                  : "hover:bg-muted/40"
                              )}
                            >
                              <Icon className="h-4 w-4" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">{link.label}</span>
                                  {link.badge && (
                                    <Badge variant="secondary" className="text-xs">
                                      {link.badge}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {link.description}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Action Buttons */}
          <div className="space-y-3 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Theme</span>
              <ThemeToggle />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Language</span>
              <LanguageSwitcher />
            </div>

            {isAuthenticated && (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}