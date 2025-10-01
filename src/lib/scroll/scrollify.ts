// lib/scroll/scrollify.ts

/**
 * Scrollify configuration with navbar offset handling
 * Ensures sections don't get clipped by the sticky navbar
 */

export interface ScrollifyOptions {
  section: string;
  interstitialSection?: string;
  easing: string;
  scrollSpeed: number;
  offset: number;
  scrollbars: boolean;
  target: string;
  updateHash: boolean;
  touchScroll: boolean;
}

export const defaultScrollifyOptions: ScrollifyOptions = {
  section: '.scrollify-section',
  interstitialSection: '.scrollify-interstitial',
  easing: 'easeInOutCubic',
  scrollSpeed: 1000,
  offset: 64, // Account for 64px navbar height
  scrollbars: false,
  target: 'html,body',
  updateHash: false,
  touchScroll: true,
};

export class ScrollifyManager {
  private isInitialized = false;
  private options: ScrollifyOptions;
  private navbarHeight = 64; // Default navbar height
  
  constructor(options: Partial<ScrollifyOptions> = {}) {
    this.options = { ...defaultScrollifyOptions, ...options };
  }

  /**
   * Initialize Scrollify with dynamic navbar offset
   */
  async init(): Promise<void> {
    if (typeof window === 'undefined') {
      return; // Skip on server-side
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      console.log('Scrollify disabled due to prefers-reduced-motion');
      return;
    }

    try {
      // Dynamic import to avoid SSR issues
      const { default: scrollify } = await import('jquery-scrollify');
      
      // Update navbar height dynamically
      this.updateNavbarHeight();
      
      // Initialize with dynamic offset
      scrollify.default({
        ...this.options,
        offset: -this.navbarHeight, // Negative offset to account for fixed navbar
        before: (index: number, sections: any[]) => {
          // Update navbar state or active indicator here if needed
          this.onSectionChange(index, sections);
        },
        after: (index: number, sections: any[]) => {
          // Section change complete
          this.onSectionChangeComplete(index, sections);
        },
      });

      this.isInitialized = true;
      console.log('Scrollify initialized with navbar offset:', this.navbarHeight);
      
      // Listen for window resize to update navbar height
      window.addEventListener('resize', this.handleResize.bind(this));
      
    } catch (error) {
      console.warn('Failed to initialize Scrollify:', error);
    }
  }

  /**
   * Update navbar height by measuring the actual navbar element
   */
  private updateNavbarHeight(): void {
    const navbar = document.querySelector('nav[class*="navbar"], header[class*="navbar"], .main-navbar') as HTMLElement;
    if (navbar) {
      this.navbarHeight = navbar.offsetHeight;
      this.options.offset = -this.navbarHeight;
    }
  }

  /**
   * Handle window resize events
   */
  private handleResize(): void {
    if (this.isInitialized) {
      this.updateNavbarHeight();
      // Update scrollify offset
      this.updateOffset();
    }
  }

  /**
   * Update scrollify offset without reinitializing
   */
  private async updateOffset(): Promise<void> {
    try {
      const { default: scrollify } = await import('jquery-scrollify');
      scrollify.default.setOptions({ offset: -this.navbarHeight });
    } catch (error) {
      console.warn('Failed to update Scrollify offset:', error);
    }
  }

  /**
   * Called when section starts changing
   */
  private onSectionChange(index: number, sections: any[]): void {
    // Add any navbar updates here (e.g., active section indicator)
    document.dispatchEvent(new CustomEvent('scrollify:section-changing', {
      detail: { index, sections }
    }));
  }

  /**
   * Called when section change is complete
   */
  private onSectionChangeComplete(index: number, sections: any[]): void {
    document.dispatchEvent(new CustomEvent('scrollify:section-changed', {
      detail: { index, sections }
    }));
  }

  /**
   * Destroy scrollify and clean up
   */
  async destroy(): Promise<void> {
    if (this.isInitialized && typeof window !== 'undefined') {
      try {
        const { default: scrollify } = await import('jquery-scrollify');
        scrollify.default.destroy();
        window.removeEventListener('resize', this.handleResize.bind(this));
        this.isInitialized = false;
      } catch (error) {
        console.warn('Failed to destroy Scrollify:', error);
      }
    }
  }

  /**
   * Navigate to a specific section
   */
  async moveToSection(index: number): Promise<void> {
    if (this.isInitialized) {
      try {
        const { default: scrollify } = await import('jquery-scrollify');
        scrollify.default.move(index);
      } catch (error) {
        console.warn('Failed to move to section:', error);
      }
    }
  }

  /**
   * Check if scrollify is currently initialized
   */
  get initialized(): boolean {
    return this.isInitialized;
  }
}

// Singleton instance
let scrollifyManager: ScrollifyManager | null = null;

/**
 * Get or create the global scrollify manager instance
 */
export const getScrollifyManager = (options?: Partial<ScrollifyOptions>): ScrollifyManager => {
  if (!scrollifyManager) {
    scrollifyManager = new ScrollifyManager(options);
  }
  return scrollifyManager;
};

/**
 * Hook for React components to use scrollify
 */
export const useScrollify = (options?: Partial<ScrollifyOptions>) => {
  const manager = getScrollifyManager(options);
  
  return {
    init: () => manager.init(),
    destroy: () => manager.destroy(),
    moveToSection: (index: number) => manager.moveToSection(index),
    initialized: manager.initialized,
  };
};

// Export default manager
export default getScrollifyManager;