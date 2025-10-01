'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { ComponentType } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type NavGroup = 'discover' | 'create' | 'operate';

type NavLink = {
  href: string;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  group: NavGroup;
  badge?: 'New' | 'Beta';
};

type AuthUser = ReturnType<typeof useAuth>['user'];

type GroupedLinks = {
  group: NavGroup;
  links: NavLink[];
};

const NAV_GROUP_COPY: Record<NavGroup, { title: string; tagline: string }> = {
  discover: {
    title: 'Discover',
    tagline: 'Orient fast and learn the craft',
  },
  create: {
    title: 'Create',
    tagline: 'Craft, iterate, and deploy prompts',
  },
  operate: {
    title: 'Operate',
    tagline: 'Monitor performance and stay aligned',
  },
};

const NAV_GROUP_ORDER: NavGroup[] = ['discover', 'create', 'operate'];

const mainNavLinks: NavLink[] = [
  {
    href: '/',
    label: 'Dashboard',
    description: 'Overview and analytics',
    icon: BarChart3,
    group: 'discover',
  },
  {
    href: '/learn',
    label: 'Learn',
    description: 'Courses, certifications, and pathways',
    icon: GraduationCap,
    group: 'discover',
    badge: 'New',
  },
  {
    href: '/templates',
    label: 'Templates',
    description: 'Prompt library & manager',
    icon: BookOpen,
    group: 'create',
  },
  {
    href: '/optimize',
    label: 'Optimize',
    description: 'MiPRO refinement & telemetry lab',
    icon: Sparkles,
    group: 'create',
    badge: 'Beta',
  },
  {
    href: '/chat/live',
    label: 'Oracle Chat',
    description: 'Live AI conversations',
    icon: MessageSquare,
    group: 'create',
  },
  {
    href: '/chat/live/rag',
    label: 'RAG Agent',
    description: 'Knowledge retrieval & synthesis',
    icon: Bot,
    group: 'create',
  },
  {
    href: '/analysis',
    label: 'Analytics',
    description: 'Performance insights',
    icon: TrendingUp,
    group: 'operate',
  },
  {
    href: '/status',
    label: 'Status',
    description: 'System health & uptime',
    icon: Activity,
    group: 'operate',
  },
  {
    href: '/profile',
    label: 'Profile',
    description: 'User account & settings',
    icon: Crown,
    group: 'operate',
  },
  {
    href: '/help',
    label: 'Help',
    description: 'Documentation & support',
    icon: HelpCircle,
    group: 'operate',
  },
];

export function TempleNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

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
  }, [pathname, isClient]);

  useEffect(() => {
    if (!isClient) return;

    if (!isMobileMenuOpen) {
      document.body.style.overflow = '';
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, isClient]);

  const groupedLinks = useMemo<GroupedLinks[]>(
    () => NAV_GROUP_ORDER.map(group => ({
      group,
      links: mainNavLinks.filter(link => link.group === group),
    })),
    []
  );

  const isActivePath = useCallback(
    (href: string) => {
      if (href === '/') {
        return pathname === '/';
      }
      return pathname.startsWith(href);
    },
    [pathname]
  );

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    closeMobileMenu();
  }, [logout, closeMobileMenu]);

  const navClassName = cn(
    'sticky top-0 z-50 transition-colors duration-300',
    isScrolled
      ? 'bg-secondary/85 backdrop-blur-xl border-b border-primary/20 shadow-lg shadow-primary/5'
      : 'bg-secondary/95 border-b border-transparent pyramid-elevation'
  );

  if (!isClient) {
    return (
      <nav className={navClassName} aria-label="Primary navigation">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <TempleLogo />
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 animate-pulse rounded-full bg-muted/40" />
            <div className="hidden h-9 w-24 animate-pulse rounded-full bg-muted/40 sm:block" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={navClassName} aria-label="Primary navigation">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <TempleLogo />
          <DesktopNavigation isActivePath={isActivePath} />
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 xl:flex">
            <OnboardingTrigger variant="help" />
            <LanguageSwitcher />
          </div>
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>

          {isAuthenticated ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/settings" className="hidden lg:block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl hover:bg-gold-accent/10 hover:text-gold-accent"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="rounded-xl border-primary/20 hover:border-red-400 hover:bg-red-500/10 hover:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl hover:bg-gold-accent/10 hover:text-gold-accent"
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  size="sm"
                  className="rounded-xl bg-gradient-to-r from-gold-accent to-yellow-600 text-basalt-black shadow-lg hover:from-yellow-500 hover:to-gold-accent"
                >
                  Enter Temple
                </Button>
              </Link>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl lg:hidden hover:bg-gold-accent/10 hover:text-gold-accent"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-primary-navigation"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <MobileNavigation
        id="mobile-primary-navigation"
        isOpen={isMobileMenuOpen}
        groupedLinks={groupedLinks}
        isAuthenticated={isAuthenticated}
        user={user}
        isActivePath={isActivePath}
        onClose={closeMobileMenu}
        onLogout={handleLogout}
      />
    </nav>
  );
}

function DesktopNavigation({
  isActivePath,
}: {
  isActivePath: (href: string) => boolean;
}) {
  return (
    <ul className="hidden items-center gap-1 lg:flex" role="menubar">
      {mainNavLinks.map(link => {
        const Icon = link.icon;
        const isActive = isActivePath(link.href);

        return (
          <li key={link.href} role="none">
            <Link
              href={link.href}
              role="menuitem"
              aria-current={isActive ? 'page' : undefined}
              title={link.description}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-accent/70',
                isActive
                  ? 'bg-gold-accent/15 text-gold-accent shadow-sm'
                  : 'text-foreground/90 hover:bg-gold-accent/10 hover:text-gold-accent'
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  isActive ? 'text-gold-accent' : 'text-muted-foreground group-hover:text-gold-accent'
                )}
              />
              <div className="flex flex-col">
                <span className="leading-none">{link.label}</span>
                <span className="hidden text-[11px] text-muted-foreground/80 xl:block">
                  {link.description}
                </span>
              </div>
              {link.badge && (
                <span className="ml-1 rounded-full bg-gold-accent/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold-accent">
                  {link.badge}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function MobileNavigation({
  id,
  isOpen,
  groupedLinks,
  isAuthenticated,
  user,
  isActivePath,
  onClose,
  onLogout,
}: {
  id: string;
  isOpen: boolean;
  groupedLinks: GroupedLinks[];
  isAuthenticated: boolean;
  user: AuthUser;
  isActivePath: (href: string) => boolean;
  onClose: () => void;
  onLogout: () => Promise<void> | void;
}) {
  if (!isOpen) {
    return null;
  }

  const userInitial = (user?.first_name?.[0] || user?.username?.[0] || 'U').toUpperCase();

  return (
    <div id={id} className="lg:hidden">
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-x-0 top-16 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-gold-accent/30 bg-gradient-to-b from-papyrus/95 to-desert-sand/95 pb-10">
        <div className="space-y-6 px-4 pt-4">
          {isAuthenticated ? (
            <Card className="p-4 bg-gradient-to-r from-gold-accent/15 via-yellow-500/10 to-gold-accent/15 border-2 border-gold-accent/30 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gold-accent/40 bg-gradient-to-br from-gold-accent to-yellow-600 font-bold text-basalt-black shadow-lg">
                  {userInitial}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {user?.first_name || user?.username}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Crown className="h-3 w-3 text-gold-accent" />
                    <span>Pharaoh Level {user?.level ?? 1}</span>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-4 border border-gold-accent/30 bg-gold-accent/10">
              <p className="text-sm text-muted-foreground">
                Sign in to sync your prompt history, wow metrics, and certifications.
              </p>
              <div className="mt-3 flex gap-2">
                <Link href="/auth/login" className="flex-1" onClick={onClose}>
                  <Button variant="outline" className="w-full rounded-xl border-gold-accent/40">
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth/register" className="flex-1" onClick={onClose}>
                  <Button className="w-full rounded-xl bg-gradient-to-r from-gold-accent to-yellow-600 text-basalt-black">
                    Create account
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {groupedLinks.map(({ group, links }) => (
            <section key={group} className="space-y-3">
              <header className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-accent">
                    {NAV_GROUP_COPY[group].title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {NAV_GROUP_COPY[group].tagline}
                  </p>
                </div>
              </header>
              <div className="space-y-2">
                {links.map(link => {
                  const Icon = link.icon;
                  const isActive = isActivePath(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={onClose}
                    >
                      <Card
                        className={cn(
                          'relative overflow-hidden border transition-all duration-200',
                          isActive
                            ? 'border-gold-accent/60 bg-gold-accent/15 shadow-lg'
                            : 'border-primary/10 hover:border-gold-accent/40 hover:bg-gold-accent/10'
                        )}
                      >
                        <div className="flex items-center gap-3 p-4">
                          <div
                            className={cn(
                              'rounded-lg border border-white/10 p-2 text-primary/80',
                              isActive ? 'bg-gold-accent/10 text-gold-accent' : 'bg-white/5'
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p
                                className={cn(
                                  'font-semibold',
                                  isActive ? 'text-gold-accent' : 'text-foreground'
                                )}
                              >
                                {link.label}
                              </p>
                              {link.badge && (
                                <span className="rounded-full bg-gold-accent/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold-accent">
                                  {link.badge}
                                </span>
                              )}
                            </div>
                            <p
                              className={cn(
                                'text-sm',
                                isActive ? 'text-gold-accent/80' : 'text-muted-foreground'
                              )}
                            >
                              {link.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}

          <div className="space-y-4 border-t border-gold-accent/30 pt-4">
            <OnboardingTrigger variant="help" className="w-full justify-center" />
            <div className="flex items-center justify-between rounded-xl border border-gold-accent/30 bg-white/10 px-4 py-2">
              <span className="text-sm font-semibold text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-gold-accent/30 bg-white/10 px-4 py-2">
              <span className="text-sm font-semibold text-muted-foreground">Language</span>
              <LanguageSwitcher />
            </div>
            {isAuthenticated ? (
              <div className="flex gap-3">
                <Link href="/settings" className="flex-1" onClick={onClose}>
                  <Button variant="outline" className="w-full rounded-xl border-gold-accent/40">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl border-red-300 text-red-600 hover:bg-red-500/10"
                  onClick={onLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function TempleLogo() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-3 rounded-xl px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-accent/60"
      aria-label="Prompt Temple home"
    >
      <div className="relative">
        <svg
          className="h-10 w-10 text-gold-accent transition-transform duration-300 group-hover:scale-105"
          viewBox="0 0 64 64"
          role="presentation"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="temple-pyramid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#facc15" />
              <stop offset="55%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <pattern id="temple-matrix-pattern" width="6" height="6" patternUnits="userSpaceOnUse">
              <rect width="6" height="6" fill="#ffffff" fillOpacity="0.05" />
              <rect x="0" y="5" width="6" height="1" fill="#facc15" fillOpacity="0.35" />
              <rect x="4" y="0" width="1" height="6" fill="#facc15" fillOpacity="0.25" />
            </pattern>
            <clipPath id="pyramid-left">
              <polygon points="10,48 24,20 38,48" />
            </clipPath>
            <clipPath id="pyramid-center">
              <polygon points="20,48 34,12 48,48" />
            </clipPath>
            <clipPath id="pyramid-right">
              <polygon points="30,48 44,24 58,48" />
            </clipPath>
          </defs>

          <rect x="0" y="0" width="64" height="64" fill="none" />
          <g>
            <polygon points="20,48 34,12 48,48" fill="url(#temple-pyramid-gradient)" />
            <polygon points="10,48 24,20 38,48" fill="url(#temple-pyramid-gradient)" opacity="0.75" />
            <polygon points="30,48 44,24 58,48" fill="url(#temple-pyramid-gradient)" opacity="0.6" />

            <g clipPath="url(#pyramid-left)">
              <rect x="8" y="18" width="32" height="30" fill="url(#temple-matrix-pattern)" />
            </g>
            <g clipPath="url(#pyramid-center)">
              <rect x="18" y="10" width="32" height="38" fill="url(#temple-matrix-pattern)" />
            </g>
            <g clipPath="url(#pyramid-right)">
              <rect x="28" y="18" width="32" height="30" fill="url(#temple-matrix-pattern)" />
            </g>

            <circle cx="36" cy="10" r="5" fill="#facc15" fillOpacity="0.65" />
          </g>
        </svg>
        <div className="pointer-events-none absolute inset-0 rounded-full blur-xl" />
      </div>
      <div className="leading-tight">
        <span className="block text-base font-semibold text-foreground">
          Prompt Temple
        </span>
        <span className="block text-xs font-medium uppercase tracking-[0.3em] text-gold-accent/80">
          Pharaonic Prompting
        </span>
      </div>
    </Link>
  );
}
