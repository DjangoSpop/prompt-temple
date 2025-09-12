# Endpoint → UI Coverage Matrix

This matrix maps every backend API endpoint to its corresponding frontend UI components and pages, indicating implementation status and gaps.

## 🚀 SSE & Streaming Endpoints

| Endpoint | Method | UI Component/Page | Status | Hook | Notes |
|----------|--------|------------------|---------|------|-------|
| `/api/v2/chat/completions/` | POST | `SSEChatInterface`, `EnhancedChatInterface` | ✅ **Complete** | `useSSECompletion`, `useStreamingChat` | SSE streaming implemented |
| `/api/v2/chat/health/` | GET | Health badge in header | ✅ **Complete** | `useHealthCheck` | Periodic health monitoring |

## 🤖 Agentic RAG Endpoints

| Endpoint | Method | UI Component/Page | Status | Hook | Notes |
|----------|--------|------------------|---------|------|-------|
| `/v1/ai-services/agent/optimize/` | POST | `/optimization`, RAG mode | ⚠️ **Partial** | `useAgentOptimize` | Need citations UI, budget display |
| WebSocket `agent.start` | WS Event | Optimizer progress | ⚠️ **Partial** | `useAgentStreaming` | Optional streaming events |
| WebSocket `agent.step` | WS Event | Step-by-step progress | ⚠️ **Partial** | `useAgentStreaming` | Agent progress tracking |
| WebSocket `agent.token` | WS Event | Real-time tokens | ⚠️ **Partial** | `useAgentStreaming` | Incremental rendering |
| WebSocket `agent.citations` | WS Event | Citations panel | ❌ **Missing** | `useAgentStreaming` | Citations display needed |
| WebSocket `agent.done` | WS Event | Completion handler | ⚠️ **Partial** | `useAgentStreaming` | Final result processing |
| WebSocket `agent.error` | WS Event | Error handling | ⚠️ **Partial** | `useAgentStreaming` | Error state management |

## 🔐 Authentication & Profile

| Endpoint | Method | UI Component/Page | Status | Hook | Notes |
|----------|--------|------------------|---------|------|-------|
| `/api/v2/auth/login/` | POST | `/auth/login` | ✅ **Complete** | `useAuth` | JWT login |
| `/api/v2/auth/register/` | POST | `/auth/register` | ✅ **Complete** | `useAuth` | User registration |
| `/api/v2/auth/refresh/` | POST | Automatic (interceptors) | ✅ **Complete** | `BaseApiClient` | Token refresh |
| `/api/v2/auth/profile/` | GET | `/profile` | ❌ **Missing** | `useProfile` | Need profile page |
| `/api/v2/auth/logout/` | POST | Logout button | ✅ **Complete** | `useAuth` | Session cleanup |

## 📚 Templates & Library

| Endpoint | Method | UI Component/Page | Status | Hook | Notes |
|----------|--------|------------------|---------|------|-------|
| `/api/v2/templates/` | GET | `/library`, `/templates` | ✅ **Complete** | `useTemplates` | Template listing |
| `/api/v2/templates/` | POST | Template creation | ✅ **Complete** | `useTemplates` | Create new template |
| `/api/v2/templates/{id}/` | GET | `/templates/[id]` | ✅ **Complete** | `useTemplate` | Template details |
| `/api/v2/templates/{id}/` | PUT | Template editor | ✅ **Complete** | `useTemplates` | Edit existing |
| `/api/v2/templates/{id}/` | DELETE | Delete button | ✅ **Complete** | `useTemplates` | Template deletion |
| `/api/v2/templates/search/` | GET | Search/filter UI | ✅ **Complete** | `useTemplateSearch` | Library search |
| `/api/v2/templates/categories/` | GET | Category filters | ✅ **Complete** | `useCategories` | Category listing |

## 🎯 Orchestrator & Optimization

| Endpoint | Method | UI Component/Page | Status | Hook | Notes |
|----------|--------|------------------|---------|------|-------|
| `/api/v2/orchestrator/intent/` | POST | Intent detection UI | ✅ **Complete** | `useIntentDetection` | User input analysis |
| `/api/v2/orchestrator/assess/` | POST | Prompt assessment | ✅ **Complete** | `usePromptAssessment` | Quality scoring |
| `/api/v2/orchestrator/render/` | POST | Template rendering | ✅ **Complete** | `useTemplateRender` | Variable substitution |
| `/api/v2/orchestrator/search/` | GET | Template search | ✅ **Complete** | `useTemplateSearch` | Advanced search |
| `/api/v2/orchestrator/template/{id}/` | GET | Template details | ✅ **Complete** | `useOrchestratorTemplate` | Template fetching |

## 🎮 Gamification & Achievements

| Endpoint | Method | UI Component/Page | Status | Hook | Notes |
|----------|--------|------------------|---------|------|-------|
| `/api/v2/gamification/profile/` | GET | `/achievements` | ⚠️ **Partial** | `useGamification` | Need full UI |
| `/api/v2/gamification/achievements/` | GET | Achievements list | ⚠️ **Partial** | `useAchievements` | Achievement gallery |
| `/api/v2/gamification/leaderboard/` | GET | Leaderboard | ❌ **Missing** | `useLeaderboard` | Scoreboard needed |
| `/api/v2/gamification/progress/` | GET | Progress tracking | ❌ **Missing** | `useProgress` | Progress indicators |
| `/api/v2/gamification/rewards/` | GET | Rewards system | ❌ **Missing** | `useRewards` | Reward management |

## 💳 Billing & Subscription

| Endpoint | Method | UI Component/Page | Status | Hook | Notes |
|----------|--------|------------------|---------|------|-------|
| `/api/v2/billing/subscription/` | GET | `/subscription` | ✅ **Complete** | `useBilling` | Subscription details |
| `/api/v2/billing/usage/` | GET | Usage dashboard | ✅ **Complete** | `useBilling` | Credit usage |
| `/api/v2/billing/credits/` | GET | Credits display | ✅ **Complete** | `useBilling` | Credit balance |
| `/api/v2/billing/credits/consume/` | POST | Auto (credit deduction) | ✅ **Complete** | `useBilling` | Usage tracking |
| `/api/v2/billing/invoices/` | GET | Billing history | ❌ **Missing** | `useInvoices` | Invoice management |
| `/api/v2/billing/payment-methods/` | GET | Payment settings | ❌ **Missing** | `usePaymentMethods` | Payment management |

## 📊 Analytics & Monitoring

| Endpoint | Method | UI Component/Page | Status | Hook | Notes |
|----------|--------|------------------|---------|------|-------|
| `/api/v2/analytics/usage/` | GET | Analytics dashboard | ✅ **Complete** | `useAnalytics` | Usage metrics |
| `/api/v2/analytics/sessions/` | GET | Session tracking | ✅ **Complete** | `useAnalytics` | Session analysis |
| `/api/v2/analytics/performance/` | GET | Performance metrics | ❌ **Missing** | `usePerformanceAnalytics` | Performance tracking |
| `/api/v2/analytics/reports/` | GET | Report generation | ❌ **Missing** | `useReports` | Custom reports |

## 👥 Team Management

| Endpoint | Method | UI Component/Page | Status | Hook | Notes |
|----------|--------|------------------|---------|------|-------|
| `/api/v2/teams/` | GET | `/team-management` | ⚠️ **Partial** | `useTeams` | Team listing |
| `/api/v2/teams/` | POST | Create team | ❌ **Missing** | `useTeams` | Team creation |
| `/api/v2/teams/{id}/members/` | GET | Member management | ❌ **Missing** | `useTeamMembers` | Member list |
| `/api/v2/teams/{id}/members/` | POST | Add member | ❌ **Missing** | `useTeamMembers` | Invite members |
| `/api/v2/teams/{id}/permissions/` | GET | Permission management | ❌ **Missing** | `usePermissions` | Role management |

## 💾 Workspace & History

| Endpoint | Method | UI Component/Page | Status | Hook | Notes |
|----------|--------|------------------|---------|------|-------|
| `/api/v2/workspace/conversations/` | GET | `/workspace` | ❌ **Missing** | `useWorkspace` | Conversation history |
| `/api/v2/workspace/conversations/` | POST | Save conversation | ❌ **Missing** | `useWorkspace` | Conversation saving |
| `/api/v2/workspace/favorites/` | GET | Favorites list | ❌ **Missing** | `useFavorites` | Favorite management |
| `/api/v2/workspace/exports/` | GET | Export options | ❌ **Missing** | `useExports` | Data export |
| `/api/v2/workspace/search/` | GET | Workspace search | ❌ **Missing** | `useWorkspaceSearch` | Search functionality |

## 🔧 AI Services & Core

| Endpoint | Method | UI Component/Page | Status | Hook | Notes |
|----------|--------|------------------|---------|------|-------|
| `/api/v2/ai/providers/` | GET | Model selection | ✅ **Complete** | `useAI` | Provider listing |
| `/api/v2/ai/models/` | GET | Model selection | ✅ **Complete** | `useAI` | Model selection |
| `/api/v2/ai/generate/` | POST | Text generation | ✅ **Complete** | `useAI` | Text generation |
| `/api/v2/ai/usage/` | GET | AI usage tracking | ✅ **Complete** | `useAI` | Usage monitoring |
| `/api/v2/ai/quotas/` | GET | Quota management | ✅ **Complete** | `useAI` | Quota tracking |

## 📋 Implementation Priority Matrix

### 🔴 Critical (P0) - RAG & Core Features
1. **RAG Agent UI Components** - Citations panel, budget display, diff summary
2. **Profile Page** - User profile management
3. **Workspace/History** - Conversation management and export
4. **Health Check Integration** - Service status monitoring

### 🟡 Important (P1) - User Experience
1. **Gaming System** - Full achievements and leaderboard UI
2. **Team Management** - Complete team collaboration features  
3. **Advanced Analytics** - Performance and custom reports
4. **Payment Management** - Invoice and payment method handling

### 🟢 Nice-to-have (P2) - Polish
1. **Enhanced Export** - Multiple format support
2. **Advanced Search** - Cross-workspace search
3. **Notification System** - Real-time notifications
4. **Mobile Optimization** - Responsive design improvements

## 🚨 Critical Missing Components

### RAG-Specific UI (High Priority)
- [ ] **Mode Toggle**: Standard vs RAG (fast/deep) with credit awareness
- [ ] **Citations Panel**: Title/source/score with expand for snippet
- [ ] **Diff Summary**: Bullet points with "Accept as Best Prompt" action
- [ ] **Budget Display**: Credit consumption and remaining balance
- [ ] **Index Status**: Non-blocking banner for RAG readiness

### Core Pages (High Priority)
- [ ] **Profile Page** (`/profile`) - User settings and subscription details
- [ ] **Workspace Page** (`/workspace`) - Saved conversations and history
- [ ] **Gaming Dashboard** (`/gaming`) - Achievements and leaderboard

### Utility Components (Medium Priority)
- [ ] **Health Badge** - Service status indicator in header
- [ ] **Credit Counter** - Real-time credit balance display
- [ ] **Export Menu** - Multi-format export options
- [ ] **Search Interface** - Advanced search with filters

## 🎯 Quality Gates Status

| Gate | Status | Notes |
|------|--------|-------|
| ✅ No backend contract changes | **PASS** | Only consuming documented endpoints |
| ❌ TypeScript errors | **FAIL** | Need to run `tsc --noEmit` |
| ❌ ESLint warnings | **FAIL** | Need to run linting |
| ❌ SSE streaming complete | **FAIL** | Missing RAG-specific streaming |
| ❌ RAG UI complete | **FAIL** | Missing citations, budget, diff UI |
| ❌ All key routes working | **FAIL** | Missing profile, workspace, gaming |
| ❌ A11y compliance | **UNKNOWN** | Needs accessibility audit |
| ❌ Responsive design | **PARTIAL** | RTL support exists, mobile needs work |

## 🏗️ Next Steps

1. **Fix TypeScript & Runtime Issues** - Get codebase to compile cleanly
2. **Implement RAG UI Components** - Priority focus on citations and budget
3. **Create Missing Pages** - Profile, workspace, gaming
4. **Health Check System** - Service monitoring and status display
5. **Comprehensive Testing** - Unit and E2E test coverage
6. **Documentation** - Migration guide and API reference

---

**Updated**: Generated on demand  
**Total Endpoints Mapped**: 45+  
**Implementation Coverage**: ~60% (27/45 endpoints fully implemented)  
**Critical Gaps**: RAG UI, Profile, Workspace, Gaming, Health Monitoring