"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LessonSidebar } from "@/components/learn/LessonSidebar";
import { SlideViewer } from "@/components/learn/SlideViewer";
import { Button } from "@/components/ui/button";
import { useLesson } from "@/hooks/useLesson";
import { useAnalytics } from "@/lib/analytics";

export default function LessonPage() {
  const params = useParams<{ courseId: string; lessonId: string }>();
  const router = useRouter();
  const { trackEvent } = useAnalytics();
  const courseId = params?.courseId ?? "";
  const lessonId = params?.lessonId ?? "";

  const {
    course,
    lesson,
    progress,
    completeSlide,
    completeLesson,
    completedLessons,
    startLesson,
  } = useLesson(courseId, lessonId);

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const lessonProgress = useMemo(() => {
    return progress?.lessonProgress.find((entry) => entry.lessonId === lesson?.id) ?? null;
  }, [lesson?.id, progress]);

  useEffect(() => {
    if (courseId && lessonId) {
      void startLesson(courseId, lessonId);
    }
  }, [courseId, lessonId, startLesson]);

  useEffect(() => {
    if (!course || !lesson) {
      return;
    }
    const completed = new Set(lessonProgress?.completedSlideIds ?? []);
    const firstIncomplete = lesson.slides.findIndex((slide) => !completed.has(slide.id));
    setActiveSlideIndex(firstIncomplete >= 0 ? firstIncomplete : 0);
  }, [course, lesson, lessonProgress?.completedSlideIds]);

  useEffect(() => {
    if (course && lesson) {
      trackEvent({
        event_type: "lesson.viewed",
        properties: {
          course_id: course.id,
          lesson_id: lesson.id,
        },
      });
    }
  }, [course, lesson, trackEvent]);

  if (!course || !lesson) {
    return (
      <main className="container mx-auto flex flex-col gap-4 py-10">
        <p className="text-sm text-muted-foreground">Loading lesson...</p>
      </main>
    );
  }

  const slides = lesson.slides;
  const activeSlide = slides[activeSlideIndex];
  const completedSlides = new Set(lessonProgress?.completedSlideIds ?? []);
  const isSlideCompleted = activeSlide ? completedSlides.has(activeSlide.id) : false;
  const isFinalSlide = activeSlideIndex >= slides.length - 1;

  useEffect(() => {
    if (course && lesson && activeSlide) {
      trackEvent({
        event_type: "lesson.slide.viewed",
        properties: {
          course_id: course.id,
          lesson_id: lesson.id,
          slide_id: activeSlide.id,
          slide_type: activeSlide.type,
        },
      });
    }
  }, [course, lesson, activeSlide, trackEvent]);

  const handleSlideComplete = async () => {
    if (!course || !lesson || !activeSlide) {
      return;
    }
    if (completedSlides.has(activeSlide.id)) {
      if (!isFinalSlide) {
        setActiveSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
      }
      return;
    }

    await completeSlide(course.id, lesson.id, activeSlide.id);
    trackEvent({
      event_type: "lesson.slide.completed",
      properties: {
        course_id: course.id,
        lesson_id: lesson.id,
        slide_id: activeSlide.id,
        slide_type: activeSlide.type,
      },
    });

    if (!isFinalSlide) {
      setActiveSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
    }
  };

  const handleQuizSubmit = async (score: number) => {
    if (!course || !lesson) {
      return;
    }
    await completeLesson(course.id, lesson.id, score);
    trackEvent({
      event_type: "lesson.completed",
      properties: {
        course_id: course.id,
        lesson_id: lesson.id,
        quiz_score: score,
      },
    });
    setActiveSlideIndex(slides.length - 1);
  };

  const navigateToLesson = (targetLessonId: string) => {
    router.push(`/learn/${course.id}/lesson/${targetLessonId}`);
  };

  const nextLessonId = useMemo(() => {
    const currentIndex = course.lessons.findIndex((item) => item.id === lesson.id);
    return currentIndex >= 0 && currentIndex < course.lessons.length - 1
      ? course.lessons[currentIndex + 1].id
      : null;
  }, [course.lessons, lesson.id]);

  const handleContinue = () => {
    if (nextLessonId) {
      navigateToLesson(nextLessonId);
    } else {
      router.push(`/learn/${course.id}`);
    }
  };

  return (
    <main className="container mx-auto flex flex-col gap-10 py-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Lesson {lesson.order}</p>
        <h1 className="text-3xl font-semibold text-foreground">{lesson.title}</h1>
        <p className="text-base text-muted-foreground">{lesson.outcomes[0]}</p>
      </header>
      <section className="flex flex-col gap-6 lg:flex-row">
        <LessonSidebar
          course={course}
          progress={progress}
          currentLessonId={lesson.id}
          onSelectLesson={(targetLessonId) => navigateToLesson(targetLessonId)}
        />
        {activeSlide && (
          <SlideViewer
            slide={activeSlide}
            index={activeSlideIndex}
            total={slides.length}
            isCompleted={isSlideCompleted}
            onCompleteSlide={handleSlideComplete}
            onQuizSubmit={handleQuizSubmit}
            onNext={isFinalSlide ? undefined : () => setActiveSlideIndex((prev) => Math.min(prev + 1, slides.length - 1))}
            onPrev={activeSlideIndex > 0 ? () => setActiveSlideIndex((prev) => Math.max(prev - 1, 0)) : undefined}
          />
        )}
      </section>
      <footer className="flex items-center justify-between border-t border-border/60 pt-6">
        <div className="text-sm text-muted-foreground">
          {completedLessons.includes(lesson.id)
            ? "Lesson completed. Keep the momentum going!"
            : "Complete the quiz to record your progress and earn XP."}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => router.push(`/learn/${course.id}`)}>
            Back to overview
          </Button>
          <Button onClick={handleContinue} variant="secondary">
            {nextLessonId ? "Continue to next lesson" : "Return to course"}
          </Button>
        </div>
      </footer>
    </main>
  );
}
