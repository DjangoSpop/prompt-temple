import { CourseProgress, LessonProgress } from "@/types/learning";
import crypto from "node:crypto";
import { cookies } from "next/headers";

const learnerProgress = new Map<string, CourseProgress>();

function getUserId(): string {
  const cookieStore = cookies();
  const existing = cookieStore.get("pt_user_id");
  if (existing?.value) {
    return existing.value;
  }
  const generated = crypto.randomUUID();
  cookieStore.set("pt_user_id", generated, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 180,
  });
  return generated;
}

export function bootstrapProgress(courseId: string): CourseProgress {
  const userId = getUserId();
  const key = `${userId}:${courseId}`;
  if (!learnerProgress.has(key)) {
    learnerProgress.set(key, {
      courseId,
      lessonProgress: [],
      xpEarned: 0,
      streak: 0,
      updatedAt: new Date().toISOString(),
    });
  }
  return learnerProgress.get(key)!;
}

export function loadProgress(courseId: string): CourseProgress | null {
  const userId = getUserId();
  const key = `${userId}:${courseId}`;
  return learnerProgress.get(key) ?? null;
}

export function saveProgress(progress: CourseProgress): CourseProgress {
  const userId = getUserId();
  const key = `${userId}:${progress.courseId}`;
  const next: CourseProgress = {
    ...progress,
    updatedAt: new Date().toISOString(),
  };
  learnerProgress.set(key, next);
  return next;
}

export function upsertLessonProgress(
  courseId: string,
  lessonId: string,
  update: Partial<LessonProgress>
): CourseProgress {
  const current = bootstrapProgress(courseId);
  const existingLesson = current.lessonProgress.find((lp) => lp.lessonId === lessonId);
  const distinctSlides = Array.from(
    new Set([...(existingLesson?.completedSlideIds ?? []), ...(update.completedSlideIds ?? [])])
  );
  const nextLesson: LessonProgress = {
    lessonId,
    completedSlideIds: distinctSlides,
    quizScore: update.quizScore ?? existingLesson?.quizScore,
    completedAt: update.completedAt ?? existingLesson?.completedAt,
  };

  const nextProgress: CourseProgress = {
    ...current,
    lessonProgress: existingLesson
      ? current.lessonProgress.map((lp) => (lp.lessonId === lessonId ? nextLesson : lp))
      : [...current.lessonProgress, nextLesson],
    xpEarned: 0,
    streak: 0,
    updatedAt: new Date().toISOString(),
  };

  nextProgress.xpEarned = nextProgress.lessonProgress.reduce((acc, lp) => {
    const slideXp = lp.completedSlideIds.length * 5;
    const quizXp = lp.quizScore ? Math.round(lp.quizScore * 10) : 0;
    return acc + slideXp + quizXp;
  }, 0);

  nextProgress.streak = nextProgress.lessonProgress.filter((lp) => lp.completedAt).length;

  return saveProgress(nextProgress);
}
