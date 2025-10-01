"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { LessonSidebar } from "@/components/learn/LessonSidebar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLesson } from "@/hooks/useLesson";
import { useEventTracker } from "@/lib/analytics";

export default function CourseOverviewPage() {
  const params = useParams<{ courseId: string }>();
  const router = useRouter();
  const { trackPageView } = useEventTracker();
  const courseId = params?.courseId ?? "";

  const {
    course,
    progress,
    completionRatio,
    completedLessons,
    enroll,
    startLesson,
    isLoading,
  } = useLesson(courseId);

  useEffect(() => {
    if (courseId) {
      trackPageView(`learn.course.${courseId}`);
    }
  }, [courseId, trackPageView]);

  const nextLessonId = useMemo(() => {
    if (!course) {
      return "";
    }
    const completed = progress?.lessonProgress ?? [];
    const pending = course.lessons.find((lesson) => !completed.some((entry) => entry.lessonId === lesson.id && entry.completedAt));
    return pending?.id ?? course.lessons[0]?.id ?? "";
  }, [course, progress]);

  const handleBegin = async () => {
    if (!course || !nextLessonId) {
      return;
    }
    await enroll(course.id);
    await startLesson(course.id, nextLessonId);
    router.push(`/learn/${course.id}/lesson/${nextLessonId}`);
  };

  if (!course) {
    return (
      <main className="container mx-auto flex flex-col gap-4 py-10">
        <p className="text-sm text-muted-foreground">Loading course...</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto flex flex-col gap-10 py-10">
      <header className="grid gap-4 md:grid-cols-5">
        <div className="space-y-4 md:col-span-3">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Course overview</p>
          <h1 className="text-4xl font-semibold text-foreground">{course.title}</h1>
          <p className="text-base text-muted-foreground">{course.summary}</p>
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-muted-foreground">
            <span className="rounded-md border border-border px-3 py-1">{course.difficulty}</span>
            <span className="rounded-md border border-border px-3 py-1">{course.estimatedHours} hours</span>
            {course.tags.map((tag) => (
              <span key={tag} className="rounded-md border border-border px-3 py-1">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-4 rounded-xl border border-border/60 bg-card/80 p-6 md:col-span-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Progress toward certificate</p>
            <div className="mt-3 flex items-center gap-3">
              <Progress value={completionRatio * 100} className="h-2 flex-1" />
              <span className="text-lg font-semibold text-primary">{Math.round(completionRatio * 100)}%</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground">Lessons complete</p>
              <p>
                {completedLessons.length}/{course.lessons.length}
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Certification threshold</p>
              <p>{Math.round(course.certificationCriteria.minLessonsCompletedRatio * 100)}% + quiz avg {Math.round(course.certificationCriteria.minQuizAverage * 100)}%</p>
            </div>
          </div>
          <Button size="lg" onClick={handleBegin} disabled={isLoading || !nextLessonId}>
            {completedLessons.length ? "Resume learning" : "Start learning"}
          </Button>
        </div>
      </header>
      <section className="flex flex-col gap-6 lg:flex-row">
        <LessonSidebar
          course={course}
          progress={progress}
          currentLessonId={nextLessonId}
          onSelectLesson={(lessonId) => router.push(`/learn/${course.id}/lesson/${lessonId}`)}
        />
        <article className="flex-1 space-y-6 rounded-xl border border-border/60 bg-card/60 p-6">
          <h2 className="text-lg font-semibold text-foreground">What you will master</h2>
          <ul className="grid gap-3 text-sm text-muted-foreground">
            {course.lessons.flatMap((lesson) => lesson.outcomes).map((outcome, index) => (
              <li key={`${outcome}-${index}`} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
          {course.prerequisites && (
            <div>
              <h3 className="text-sm font-semibold text-foreground">Prerequisites</h3>
              <ul className="mt-2 list-disc pl-4 text-sm text-muted-foreground">
                {course.prerequisites.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
