import type { Metadata } from "next";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { ConfigProvider } from "@/providers/ConfigProvider";
import { AnalyticsProvider } from "@/providers/AnalyticsProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HealthBanner } from "@/components/HealthBanner";
import { TempleNavbar } from "@/components/TempleNavbar";
import { AppShell } from "@/components/layout/AppShell";
import { ClientOnly } from "@/components/ClientOnly";
import { HydrationGuard } from "@/components/HydrationGuard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { UserOnboarding } from "@/components/onboarding";
import "./globals.css";
import '../styles/chat.css';

export const metadata: Metadata = {
  title: "Prompt Teme — Made in Egypt",
  description: "Craft exceptional AI prompts in the Pharaonic Sahara. Experience the power of prompt engineering with DeepSeek intelligence, credits-based access, and Egyptian-inspired design.",
  keywords: ["prompt temple", "AI prompts", "prompt engineering", "templates", "prompt sanctuary", "AI tools", "prompt library", "analytics", "collaboration", "gamification"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Sahara font system: Cinzel (headings) + Cairo (UI) + Inter (fallback) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cairo:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased min-h-screen overflow-x-hidden bg-background text-foreground" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <HydrationGuard>
            <ErrorBoundary>
              <QueryProvider>
                <ConfigProvider>
                  <AuthProvider>
                    <AnalyticsProvider>
                      <TooltipProvider>
                        <div className="flex flex-col min-h-screen">
                        <ClientOnly fallback={
                          <nav className="h-16 bg-secondary/95 backdrop-blur-lg border-b border-primary/20 flex items-center justify-between px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gold-accent rounded-full flex items-center justify-center">
                                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                  <polygon points="12,2 22,22 2,22" />
                                </svg>
                              </div>
                              <h1 className="text-xl font-bold">Prompt Temple</h1>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-20 h-8 bg-muted rounded animate-pulse"></div>
                              <div className="w-24 h-8 bg-muted rounded animate-pulse"></div>
                            </div>
                          </nav>
                        }>
                          <HealthBanner />
                          <TempleNavbar />
                        </ClientOnly>
                        <main className="flex-1 overflow-y-auto">
                          <ErrorBoundary>
                            {children}
                          </ErrorBoundary>
                        </main>
                        {/* Onboarding system for new users */}
                        <ClientOnly>
                          <UserOnboarding autoStart={true} />
                        </ClientOnly>
                      </div>
                      </TooltipProvider>
                    </AnalyticsProvider>
                  </AuthProvider>
                </ConfigProvider>
              </QueryProvider>
            </ErrorBoundary>
          </HydrationGuard>
        </ThemeProvider>
      </body>
    </html>
  );
}
