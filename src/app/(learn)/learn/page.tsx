"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CourseCard } from "@/components/learn/CourseCard";
import { useEventTracker } from "@/lib/analytics";
import { useBoundStore } from "@/stores";

export default function LearnPage() {
  const router = useRouter();
  const { trackPageView } = useEventTracker();

  const {
    courses,
    progress,
    isLoading,
    loadCourses,
    startLesson,
  } = useBoundStore((state) => ({
    courses: state.courses,
    progress: state.progress,
    isLoading: state.isLoading,
    loadCourses: state.loadCourses,
    startLesson: state.startLesson,
  }));

  useEffect(() => {
    trackPageView("learn.home");
  }, [trackPageView]);

  useEffect(() => {
    if (!courses.length && !isLoading) {
      void loadCourses();
    }
  }, [courses.length, isLoading, loadCourses]);

  const handleResume = async (courseId: string) => {
    const course = courses.find((item) => item.id === courseId);
    const courseProgress = progress[courseId];
    const nextLessonId = courseProgress?.lessonProgress.find((item) => !item.completedAt)?.lessonId;
    const fallbackLessonId = course?.lessons[0]?.id ?? "";
    const targetLessonId = nextLessonId ?? courseProgress?.lessonProgress[0]?.lessonId ?? fallbackLessonId;

    await startLesson(courseId, targetLessonId);

    if (targetLessonId) {
      router.push(`/learn/${courseId}/lesson/${targetLessonId}`);
    }
  };

  return (
    <main className="container mx-auto flex flex-col gap-8 py-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-primary">Prompt Temple Academy</p>
        <h1 className="text-4xl font-semibold text-foreground">Learn to Brief AI Like a Pro</h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          Build a human-to-model dialogue muscle, earn XP, and mint your Prompt Temple certificate. Courses combine
          real-world prompt labs with governance rituals tied directly to WAL, PQS, CCR, and VC metrics.
        </p>
      </header>
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => {
          const courseProgress = progress[course.id];
          const completedLessons = courseProgress?.lessonProgress.filter((item) => item.completedAt).length ?? 0;
          const completionRatio = course.lessons.length > 0 ? completedLessons / course.lessons.length : 0;
          return (
            <CourseCard
              key={course.id}
              course={course}
              completionRatio={completionRatio}
              onStart={() => void handleResume(course.id)}
            />
          );
        })}
      </section>
      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading courses...</p>
      )}
    </main>
  );
}
