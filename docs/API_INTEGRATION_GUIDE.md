# API Integration Guide

## Overview

This guide covers the complete API integration architecture for PromptTemple, including all proxy routes, error handling, and production deployment strategies.

## Architecture

```
Frontend (Next.js) ←→ API Proxy Routes (/api/v2/*) ←→ Django Backend
```

### Benefits of API Proxy Routes

1. **Security**: Hides backend URL and authentication details from client
2. **CORS**: Eliminates cross-origin issues
3. **Caching**: Can implement response caching at proxy level
4. **Monitoring**: Centralized request/response logging
5. **Error Handling**: Consistent error format across all endpoints

## API Routes Structure

```
src/app/api/
├── v1/                  # Legacy API routes
│   ├── health/          # Health check endpoints
│   └── templates/       # Template management
├── v2/                  # Current API version
│   ├── profile/         # User profile management
│   ├── workspace/       # Conversation history
│   ├── gamification/    # Achievements & rewards
│   ├── teams/           # Team collaboration
│   ├── billing/         # Subscription & payments
│   └── analytics/       # Usage analytics
├── proxy/               # Generic proxy for all endpoints
│   └── [...path]/       # Catch-all proxy route
└── auth/                # NextAuth.js authentication
    └── [...nextauth]/   # Auth endpoints
```

## Critical Endpoints

### 1. Profile Management (`/api/v2/profile`)

```typescript
// GET - Fetch user profile
const response = await fetch('/api/v2/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// PUT - Update user profile
const response = await fetch('/api/v2/profile', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'newusername',
    email: 'new@email.com',
    preferences: { theme: 'dark' }
  })
});
```

### 2. Workspace Management (`/api/v2/workspace`)

```typescript
// GET - Fetch conversations with pagination
const response = await fetch('/api/v2/workspace?page=1&limit=20&search=query', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// POST - Save a new conversation
const response = await fetch('/api/v2/workspace', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'My Conversation',
    messages: [...],
    metadata: {}
  })
});
```

### 3. Gamification (`/api/v2/gamification`)

```typescript
// GET - Fetch gamification profile
const response = await fetch('/api/v2/gamification?endpoint=profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Supported endpoints: profile, achievements, leaderboard, progress, rewards
```

### 4. Teams (`/api/v2/teams`)

```typescript
// GET - Fetch user teams
const response = await fetch('/api/v2/teams', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// POST - Create a new team
const response = await fetch('/api/v2/teams', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'My Team',
    description: 'Team description'
  })
});
```

### 5. Billing (`/api/v2/billing`)

```typescript
// GET - Fetch billing info
const response = await fetch('/api/v2/billing?endpoint=subscription', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Supported endpoints: subscription, usage, credits, invoices, payment-methods

// POST - Consume credits
const response = await fetch('/api/v2/billing?endpoint=credits/consume', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 10,
    reason: 'AI generation'
  })
});
```

### 6. Analytics (`/api/v2/analytics`)

```typescript
// GET - Fetch analytics data
const response = await fetch('/api/v2/analytics?endpoint=usage&from=2024-01-01&to=2024-12-31', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Supported endpoints: usage, sessions, performance, reports
```

## Error Handling

All API routes return consistent error responses:

```typescript
{
  "error": "Error Type",
  "detail": "Human-readable error message",
  "status": 400 // HTTP status code
}
```

### Common Error Codes

- `401`: Unauthorized - Missing or invalid authentication token
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource doesn't exist
- `422`: Validation Error - Invalid request data
- `429`: Rate Limit - Too many requests
- `500`: Internal Server Error - Backend failure
- `503`: Service Unavailable - Backend is down

## Authentication

All API routes (except public endpoints) require JWT authentication:

```typescript
// Get token from cookie or localStorage
const token = localStorage.getItem('access_token');

// Include in Authorization header
const response = await fetch('/api/v2/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Rate Limiting

API routes implement rate limiting to prevent abuse:

- **Standard endpoints**: 100 requests/minute
- **AI generation**: 20 requests/minute
- **Authentication**: 10 requests/minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Caching Strategy

### Client-Side Caching

Use React Query for automatic caching:

```typescript
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['profile'],
  queryFn: async () => {
    const response = await fetch('/api/v2/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### Server-Side Caching

Proxy routes can implement caching:

```typescript
// Cache GET requests for 1 minute
const cacheControl = 'public, max-age=60';
return NextResponse.json(data, {
  headers: { 'Cache-Control': cacheControl }
});
```

## Monitoring & Logging

### Request Logging

All API routes log requests for monitoring:

```typescript
console.log('[API]', {
  method: request.method,
  path: request.url,
  timestamp: new Date().toISOString(),
  userAgent: request.headers.get('user-agent'),
});
```

### Error Tracking

Production deployments should integrate with error tracking:

```typescript
// Sentry, LogRocket, or similar
if (error) {
  Sentry.captureException(error, {
    tags: { endpoint: '/api/v2/profile' },
    extra: { userId, requestId }
  });
}
```

## Production Deployment

### Environment Variables

```bash
# Required
BACKEND_URL=https://api.prompt-temple.com
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-app.com

# Optional
REDIS_URL=redis://localhost:6379
SENTRY_DSN=https://...
```

### Health Checks

Monitor API health using the health endpoint:

```typescript
// GET /api/health
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "checks": {
    "frontend": "healthy",
    "backend": "healthy"
  }
}
```

### Load Balancing

For high-traffic deployments:

```
Load Balancer (nginx/Cloudflare)
  ↓
Next.js Instance 1 ──→ Django Backend Pool
Next.js Instance 2 ──→ (Round-robin)
Next.js Instance 3 ──→
```

## Testing

### Unit Tests

```typescript
import { GET } from '@/app/api/v2/profile/route';
import { NextRequest } from 'next/server';

describe('Profile API', () => {
  it('returns 401 without auth token', async () => {
    const request = new NextRequest('http://localhost/api/v2/profile');
    const response = await GET(request);
    expect(response.status).toBe(401);
  });
});
```

### Integration Tests

```typescript
describe('Profile API Integration', () => {
  it('fetches and updates profile', async () => {
    // Login to get token
    const auth = await fetch('/api/auth/login', { ... });
    const { token } = await auth.json();

    // Fetch profile
    const profile = await fetch('/api/v2/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    expect(profile.status).toBe(200);
  });
});
```

## Migration from Direct Backend Calls

If you have existing code that calls the Django backend directly:

### Before (Direct Backend Call)

```typescript
const response = await fetch('https://backend.com/api/v2/profile/', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### After (Proxy Route)

```typescript
const response = await fetch('/api/v2/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

Benefits:
- No CORS issues
- Consistent error handling
- Better security (backend URL hidden)
- Easier to mock in tests

## Best Practices

1. **Always handle errors**: Every API call should have error handling
2. **Use TypeScript**: Define types for request/response bodies
3. **Implement retries**: Network requests can fail, implement retry logic
4. **Cache aggressively**: Use React Query or SWR for caching
5. **Monitor performance**: Track API response times
6. **Rate limit**: Implement client-side rate limiting
7. **Timeout handling**: Set reasonable timeouts for all requests

## Troubleshooting

### Common Issues

**Issue**: 401 Unauthorized
- **Cause**: Missing or expired JWT token
- **Solution**: Refresh token or redirect to login

**Issue**: 504 Gateway Timeout
- **Cause**: Backend is slow or down
- **Solution**: Implement retry logic with exponential backoff

**Issue**: CORS errors
- **Cause**: Calling backend directly instead of proxy
- **Solution**: Use `/api/v2/*` proxy routes

**Issue**: Rate limiting
- **Cause**: Too many requests in short time
- **Solution**: Implement client-side request queuing

## Support

For API issues or questions:
- Check logs: `/var/log/nextjs/`
- Health endpoint: `GET /api/health`
- Backend status: Check Django backend health
- Documentation: https://docs.prompt-temple.com

---

**Last Updated**: 2024-11-15
**API Version**: v2
**Backend Compatibility**: Django PromptCraft API v2+
