import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// For now, we'll make the app open to all users - no protected routes
// Routes that would require authentication (currently disabled for open access)
const protectedRoutes: string[] = []; // Empty array means no protected routes

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle CORS for API routes and external requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, x-request-id, x-client-version, x-operation-id, x-timestamp',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Add CORS headers to all responses
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-request-id, x-client-version, x-operation-id, x-timestamp');
  
  // Check for access token cookie (set by backend) as a simple authentication indicator
  const accessCookie = request.cookies.get('access_token')?.value;
  const isAuthenticated = !!accessCookie;

  // Since we want the app open to all users, we'll bypass protection for now
  // Check if the current route is protected (currently none)
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // No longer enforcing authentication - allow access to all routes
  // If trying to access a protected route without authentication (currently no protected routes)
  if (isProtectedRoute && !isAuthenticated) {
    // This block is now essentially disabled since protectedRoutes is empty
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const redirectResponse = NextResponse.redirect(loginUrl);
    // Add CORS headers to redirect response
    redirectResponse.headers.set('Access-Control-Allow-Origin', '*');
    return redirectResponse;
  }

  // Redirect root path to dashboard (now open to all users)
  if (pathname === '/') {
    // Always redirect to dashboard since the app is now open to all users
    const dashboardResponse = NextResponse.redirect(new URL('/dashboard', request.url));
    dashboardResponse.headers.set('Access-Control-Allow-Origin', '*');
    return dashboardResponse;
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};