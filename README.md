# PromptTemple Frontend

A production-ready Next.js application for the PromptTemple AI prompt management platform, integrating with the Django PromptCraft API.

## 🚀 Features

### 🏗️ Core Functionality
- **Template Library**: Browse, search, and use thousands of AI prompt templates
- **Prompt History**: Track and iterate on your prompt usage with "Save as Template" functionality
- **Chat Analysis**: Upload chat exports (ChatGPT, Claude, etc.) and discover your most effective prompts
- **AI Enhancement**: Get AI-powered suggestions to improve your prompts and templates

### 🔧 Technical Features
- **Health Monitoring**: Real-time API health status with visual indicators
- **Strong Typing**: Full TypeScript integration with Zod schema validation
- **Authentication**: JWT-based auth with automatic token refresh
- **Analytics**: Comprehensive event tracking and user insights
- **Gamification**: Levels, achievements, badges, and streak tracking
- **Testing**: ≥80% test coverage with Vitest and React Testing Library

### 🎮 Gamification System
- User levels and experience points
- Achievement system with progress tracking
- Badge collection with rarity tiers
- Daily streak mechanics
- Leaderboards and challenges  

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Radix UI components
- **State Management**: React Query + Context API
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + Prettier
- **API Client**: Custom TypeScript client with strong typing

## Quick Start

### Prerequisites

- Node.js 18.18.0 or higher
- npm, yarn, or pnpm
- Access to your Django Gateway API

### Installation

1. **Clone and setup**:
```bash
git clone <repository-url>
cd promptcord
npm install
```

2. **Environment Configuration**:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_BASE=https://api.myapp.com
# Optional: Add authentication tokens or API keys
```

3. **Start Development Server**:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_BASE` | Django Gateway base URL | Yes | `http://localhost:8000` |

## API Integration

PromptCord integrates with your Django Gateway that provides:

### PromptCraft API Endpoints

- `GET /api/template-categories/` - List template categories
- `GET /api/templates/featured/` - Get featured templates
- `GET /api/templates/` - Search templates with filters
- `GET /api/templates/{id}/` - Get specific template
- `POST /api/templates/{id}/start_usage/` - Start usage session
- `POST /api/templates/{id}/complete_usage/` - Complete usage session
- `GET /api/ai/usage/` - Get usage statistics
- `GET /api/ai/quotas/` - Get quota information
- `GET /api/analytics/dashboard/` - Get analytics dashboard

### Orchestrator API Endpoints

- `POST /api/orchestrator/intent/` - Process user intent
- `POST /api/orchestrator/render/` - Render template with variables
- `POST /api/orchestrator/assess/` - Assess AI response quality
- `POST /api/orchestrator/library-search/` - Search template library

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (shell)/           # Shell layout group
│   │   ├── library/       # Template library page
│   │   ├── orchestrate/   # AI orchestration page
│   │   ├── analytics/     # Analytics dashboard
│   │   └── settings/      # Settings and quotas
│   ├── globals.css        # Global styles with Discord theme
│   └── layout.tsx         # Root layout with providers
├── components/            # Reusable UI components
│   ├── TemplateCard.tsx   # Template display component
│   ├── SearchBar.tsx      # Intelligent search component
│   ├── VariableForm.tsx   # Dynamic form for template variables
│   └── PromptViewer.tsx   # Rendered prompt display
├── lib/
│   ├── api/              # API client functions
│   │   ├── pc.ts         # PromptCraft API client
│   │   ├── orc.ts        # Orchestrator API client
│   │   └── events.ts     # Analytics tracking
│   ├── hooks/            # Custom React hooks
│   │   ├── usePromptCraft.ts    # PromptCraft React Query hooks
│   │   ├── useOrchestrator.ts   # Orchestrator React Query hooks
│   │   └── useAccessibility.ts  # Accessibility features
│   ├── providers/        # React context providers
│   └── types.ts          # TypeScript type definitions
```

## Available Scripts

```bash
# Development
npm run dev          # Start dev server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Key Features

### 🎯 Intent Processing

The Orchestrate page provides intelligent intent detection:

1. **Natural Language Input**: Users describe what they want to create
2. **Intent Analysis**: AI determines the user's goal and confidence level
3. **Template Recommendations**: Suggests relevant templates with usage metadata
4. **Variable Extraction**: Auto-detects and provides forms for template variables
5. **Multi-Variant Generation**: Creates primary result plus alternative versions

### 📚 Template Library

Smart template discovery and management:

- **Category Browsing**: Organized template collections
- **Intelligent Search**: Real-time suggestions with fuzzy matching
- **Advanced Filters**: Rating, type, category, and usage-based filtering
- **Preview Mode**: Quick template content preview
- **Usage Tracking**: Real-time usage analytics and quotas

### 📊 Analytics Dashboard

Comprehensive usage insights:

- **Usage Metrics**: Templates used, renders completed, session analytics
- **User Insights**: Favorite categories, peak usage times, session patterns
- **Template Performance**: Success rates, completion times, rating trends
- **Export Capabilities**: JSON data export for external analysis

### ⚙️ Settings & Quotas

Granular control and monitoring:

- **Usage Quotas**: Daily and monthly limits with visual progress indicators
- **Notifications**: Email and push notification preferences
- **Privacy Controls**: Analytics sharing and data management options
- **Accessibility**: High contrast, reduced motion, and keyboard navigation settings

## Accessibility Features

PromptCord is built with accessibility as a core feature:

### ♿ Keyboard Navigation

- **Global Shortcuts**: 
  - `/` - Focus search
  - `Ctrl/Cmd + K` - Quick search
  - `Ctrl/Cmd + N` - New template
  - `Ctrl/Cmd + ,` - Settings
  - `Escape` - Close modals/dropdowns
- **Tab Navigation**: Logical tab order throughout the application
- **Focus Management**: Trapped focus in modals and dropdowns

### 🔍 Screen Reader Support

- **ARIA Labels**: Comprehensive labeling for all interactive elements
- **Live Regions**: Dynamic content announcements
- **Semantic HTML**: Proper heading hierarchy and landmark roles
- **Skip Links**: Quick navigation to main content

### 🎨 Visual Accessibility

- **High Contrast**: Automatic detection and enhanced contrast mode
- **Reduced Motion**: Respects user's motion preferences
- **Focus Indicators**: Visible focus rings for keyboard navigation
- **Color Independence**: Information not conveyed through color alone

## Deployment

### Production Build

```bash
npm run build
npm run start
```

### Environment Setup

Ensure production environment variables are configured:

```env
NEXT_PUBLIC_API_BASE=https://your-production-api.com
NODE_ENV=production
```

## Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## License

This project is licensed under the MIT License.
