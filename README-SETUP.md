# PromptCraft Full-Stack Application Setup Guide

## 🚀 Project Overview

This is a production-ready full-stack application with:
- **Backend**: Django REST Framework with comprehensive API
- **Frontend**: Next.js 15 with TypeScript, React Query, and Tailwind CSS
- **API Integration**: Type-safe client with automatic token management
- **Authentication**: JWT-based with refresh tokens
- **State Management**: React Query for server state, Context API for client state

## 📁 Project Structure

```
promptcord/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # Reusable UI components
│   │   ├── ui/                # Base UI components (shadcn/ui)
│   │   └── templates/         # Template-specific components
│   ├── lib/
│   │   ├── api/               # API client and types
│   │   │   ├── types.ts       # TypeScript types from OpenAPI
│   │   │   ├── client-v2.ts   # Main API client
│   │   │   └── hooks.ts       # React Query hooks
│   │   └── providers/         # React Context providers
│   └── types/                 # Additional TypeScript definitions
├── public/                    # Static assets
├── docs/                      # Documentation
└── package.json
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type safety and better DX
- **Tailwind CSS**: Utility-first CSS framework
- **React Query**: Server state management
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icons
- **Axios**: HTTP client with interceptors

### Backend Integration
- **Django REST Framework**: Python web framework
- **JWT Authentication**: Secure token-based auth
- **OpenAPI Specification**: API documentation and type generation

## 🚀 Quick Start

### 1. Environment Setup

Create `.env.local`:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_APP_NAME=PromptCraft
NEXT_PUBLIC_APP_VERSION=1.0.0

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Optional: Third-party services
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-client-id
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🔧 API Client Architecture

### Type-Safe API Client

The API client (`src/lib/api/client-v2.ts`) provides:

- **Automatic Authentication**: JWT tokens with refresh logic
- **Type Safety**: Full TypeScript support from OpenAPI spec
- **Error Handling**: Structured error responses
- **Event System**: Auth state change notifications
- **Request/Response Interceptors**: Automatic token injection

```typescript
import { apiClient } from '@/lib/api/client-v2';

// All methods are fully typed
const templates = await apiClient.getTemplates({
  search: 'AI prompts',
  category: 1,
  is_featured: true
});
```

### React Query Hooks

Pre-built hooks for all API endpoints (`src/lib/api/hooks.ts`):

```typescript
import { useTemplates, useCreateTemplate } from '@/lib/api/hooks';

function TemplateList() {
  const { data, isLoading, error } = useTemplates({
    search: 'AI prompts'
  });
  
  const createTemplate = useCreateTemplate();
  
  const handleCreate = async (templateData) => {
    await createTemplate.mutateAsync(templateData);
  };
}
```

## 🔐 Authentication System

### AuthProvider

The enhanced AuthProvider (`src/lib/providers/AuthProvider.tsx`) handles:

- **Login/Register**: User authentication
- **Token Management**: Automatic refresh and storage
- **Route Protection**: HOC for protected routes
- **User State**: Global user context

```typescript
import { useAuth, withAuth } from '@/lib/providers/AuthProvider';

// Use in components
function Dashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  return <DashboardContent user={user} />;
}

// Protect entire pages
export default withAuth(Dashboard);
```

## 🎨 UI Components

### Modern Template Manager

The TemplateManager component demonstrates:

- **Full API Integration**: All CRUD operations
- **Real-time Updates**: React Query cache management
- **Responsive Design**: Mobile-first approach
- **Loading States**: Smooth user experience
- **Error Handling**: User-friendly error messages

### Component Features

- **Search & Filtering**: Real-time template search
- **Pagination**: Efficient data loading
- **Categories**: Organized content structure
- **Actions**: Create, edit, delete, duplicate templates
- **Ratings**: User feedback system
- **Usage Tracking**: Analytics integration

## 📚 API Endpoints Coverage

### ✅ Implemented Endpoints

- **Authentication**: Login, register, logout, refresh
- **Templates**: CRUD, search, featured, trending
- **Categories**: List, details, templates by category
- **User Management**: Profile, stats, preferences
- **Gamification**: Achievements, badges, levels
- **Analytics**: Dashboard, insights, tracking
- **Orchestrator**: Intent detection, prompt assessment

### 🔄 Usage Flow

```typescript
// 1. User logs in
await login(email, password);

// 2. Browse templates
const templates = useTemplates({ category: 1 });

// 3. Use a template
const usage = await startTemplateUsage(templateId, data);

// 4. Complete usage
await completeTemplateUsage(templateId, {
  usage_id: usage.usage_id,
  success: true
});

// 5. Rate template
await rateTemplate(templateId, { rating: 5 });
```

## 🚀 Deployment Guide

### Frontend (Vercel)

1. **Connect Repository**: Link your GitHub repo to Vercel
2. **Environment Variables**: Add production environment variables
3. **Build Settings**: Vercel auto-detects Next.js settings
4. **Deploy**: Automatic deployments on git push

### Backend (Django)

Recommended hosting options:
- **Railway**: Easy Django deployment
- **Heroku**: Traditional PaaS
- **Digital Ocean**: VPS with more control
- **AWS/GCP**: Enterprise-grade hosting

### Environment Variables for Production

```bash
# Frontend (.env.production)
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXTAUTH_URL=https://your-app-domain.com
NEXTAUTH_SECRET=secure-production-secret

# Backend (Django settings)
DEBUG=False
ALLOWED_HOSTS=your-app-domain.com
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
DATABASE_URL=your-production-database-url
```

## 🧪 Testing Strategy

### API Testing

```bash
# Run API tests
npm run test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Component Testing

```typescript
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TemplateManager } from '@/components/templates/TemplateManager';

test('renders template manager', () => {
  const queryClient = new QueryClient();
  
  render(
    <QueryClientProvider client={queryClient}>
      <TemplateManager />
    </QueryClientProvider>
  );
  
  expect(screen.getByText('Template Library')).toBeInTheDocument();
});
```

## 🔧 Development Best Practices

### Code Organization

- **Separation of Concerns**: API, UI, and business logic separated
- **Type Safety**: Comprehensive TypeScript coverage
- **Error Boundaries**: Graceful error handling
- **Performance**: Optimized queries and caching

### API Integration

- **Consistent Patterns**: All endpoints follow same structure
- **Error Handling**: Structured error responses
- **Loading States**: User feedback during operations
- **Optimistic Updates**: Immediate UI feedback

### Security

- **JWT Tokens**: Secure authentication
- **HTTPS Only**: Production security
- **Input Validation**: Client and server-side validation
- **CORS**: Properly configured cross-origin requests

## 🚧 Next Steps

### Immediate Improvements

1. **Add Error Boundaries**: Catch and handle React errors
2. **Implement Offline Support**: Service worker for PWA
3. **Add Analytics**: User behavior tracking
4. **Performance Monitoring**: Error tracking and performance metrics

### Advanced Features

1. **Real-time Updates**: WebSocket integration
2. **Advanced Search**: Elasticsearch integration
3. **Collaborative Editing**: Real-time template collaboration
4. **AI Integration**: Template generation and optimization

### Scaling Considerations

1. **CDN**: Asset delivery optimization
2. **Caching**: Redis for API responses
3. **Load Balancing**: Multiple backend instances
4. **Database Optimization**: Query optimization and indexing

## 📞 Support

For technical support or questions:

1. **Documentation**: Check the `/docs` folder
2. **API Reference**: OpenAPI specification
3. **GitHub Issues**: Bug reports and feature requests
4. **Development Guide**: This README

---

**Happy Coding! 🎉**

This setup provides a production-ready foundation for your PromptCraft application with modern best practices and comprehensive API integration.

