# Prompt Temple Learning Module

This document explains the Prompt Temple learning experience that ships with the `/learn` flow, the supporting API surface, and the key analytics events that ladder up to the WAL, PQS, CCR, and VC north-star metrics.

## Feature Overview

- Curated prompt-engineering awareness course with structured lessons, exercises, and quizzes.
- Self-contained Zustand store (`useBoundStore`) with learner slice for progress, XP, and streaks.
- API routes under `/api/learn` exposing course metadata, enrollment, slide completion, and lesson completion.
- Client hooks (`useLesson`) and UI surfaces (`/learn`, `/learn/[courseId]`, `/learn/[courseId]/lesson/[lessonId]`) that connect store state to the experience.
- Analytics instrumentation that emits:
  - `page_view` events for `learn.home` and `learn.course.*`.
  - `lesson.viewed`, `lesson.slide.viewed`, `lesson.slide.completed`, and `lesson.completed` for WAL/PQS tracking.

## Data Model

Types live in `src/types/learning.ts`:

- `Course` → metadata, certification criteria, and lessons.
- `Lesson` → ordered slides and quiz payload.
- `Slide` → narrative and quiz variants.
- `CourseProgress` / `LessonProgress` → XP, streak, completed slide IDs, and quiz scores.

Static course content ships in `src/lib/data/courses.ts` and can be extended or replaced with CMS-backed content later.

## API Endpoints

Implemented with App Router route handlers, backed by an in-memory progress store keyed by a cookie-scoped user identifier.

- `GET /api/learn` → list of available courses.
- `GET /api/learn/:courseId` → course detail + current progress snapshot.
- `POST /api/learn/:courseId/enroll` → enroll user and bootstrap progress.
- `GET /api/learn/:courseId/progress` → fetch persisted course progress.
- `POST /api/learn/:courseId/lesson/:lessonId/slide/:slideId/complete` → mark a slide complete.
- `POST /api/learn/:courseId/lesson/:lessonId/complete` → finalize lesson with optional quiz score; auto marks every slide complete.

Progress is persisted in memory for now; swap `src/app/api/learn/_progress-store.ts` with Postgres or Redis-backed storage for production.

## State Management

`src/stores/index.ts` combines three slices (learner, optimizer, user). The learner slice handles course loading, lesson state, slide completion, XP tally, and streak aggregation. Hooks and components pull from `useBoundStore` to avoid prop drilling.

Key exports:

- `useLesson(courseId, lessonId?)` → orchestrates loading, enrollment, slide completion helpers, and convenience stats (`completionRatio`, `xp`, `streak`).
- `createLearnerSlice` → async actions for `loadCourses`, `enroll`, `startLesson`, `completeSlide`, `completeLesson`.

## UI Flows

- `/learn` → course catalog cards with progress bars and resume button.
- `/learn/[courseId]` → course overview, prerequisites, progress breakdown, and lesson outline.
- `/learn/[courseId]/lesson/[lessonId]` → lesson workspace with sidebar navigation and `SlideViewer` supporting concept/exercise and quiz flows.

Supporting components live under `src/components/learn/`:

- `CourseCard` → responsive card for catalog tiles.
- `LessonSidebar` → lesson list with completion state.
- `SlideViewer` → renders slides, handles quiz interactions, and exposes callbacks for progression.

## Analytics & Metrics

Analytics events feed the metric formulas:

- **WAL**: track `lesson.slide.completed` and `lesson.completed` with timestamps to compute weekly actives.
- **PQS**: quiz submissions capture `quiz_score`; pair with optimizer outputs for delta computation.
- **CCR**: certification logic can consume `CourseProgress` to determine eligibility (≥80% lessons + 70% quiz average).
- **VC**: referral instrumentation hooks can reference the same store when extending the flow.

Ensure the `AnalyticsProvider` wraps the `App` tree so calls to `useAnalytics()` resolve at runtime.

## Next Steps

1. Replace in-memory progress persistence with database or Redis store.
2. Add certificate issuance under `/learn/[courseId]/certificate/[certificateId]` using `CourseProgress` criteria.
3. Layer RAG-backed lesson generation into `POST /api/learn/generate` (future scope).
4. Expand unit and integration coverage for `useLesson` and API routes.

