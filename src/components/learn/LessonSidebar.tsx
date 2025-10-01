"use client";

import { cn } from "@/lib/utils";
import type { Course, CourseProgress } from "@/types/learning";

interface LessonSidebarProps {
  course: Course;
  progress?: CourseProgress | null;
  currentLessonId?: string;
  onSelectLesson: (lessonId: string) => void;
}

export function LessonSidebar({ course, progress, currentLessonId, onSelectLesson }: LessonSidebarProps) {
  return (
    <aside className="w-full max-w-sm space-y-4 border-r border-border/40 bg-card/40 p-4">
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Lesson plan</p>
        <h2 className="text-lg font-semibold text-foreground">{course.title}</h2>
        <p className="text-sm text-muted-foreground">{course.summary}</p>
      </div>
      <ul className="space-y-2">
        {course.lessons.map((lesson, index) => {
          const lessonProgress = progress?.lessonProgress.find((item) => item.lessonId === lesson.id);
          const isActive = lesson.id === currentLessonId;
          const isComplete = Boolean(lessonProgress?.completedAt);
          const slideCount = lesson.slides.length;
          const slidesDone = lessonProgress?.completedSlideIds.length ?? 0;
          const primaryOutcome = lesson.outcomes[0] ?? "Clarify your prompting intent.";

          return (
            <li key={lesson.id}>
              <button
                type="button"
                onClick={() => onSelectLesson(lesson.id)}
                className={cn(
                  "w-full rounded-lg border px-4 py-3 text-left transition",
                  isActive ? "border-primary bg-primary/10" : "border-border bg-background",
                  isComplete && !isActive ? "border-emerald-500/60" : ""
                )}
              >
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs">
                      {index + 1}
                    </span>
                    {lesson.title}
                  </span>
                  {isComplete ? (
                    <span className="text-xs font-medium text-emerald-500">Done</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">{slidesDone}/{slideCount}</span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {lesson.estimatedMinutes} min • {primaryOutcome}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
