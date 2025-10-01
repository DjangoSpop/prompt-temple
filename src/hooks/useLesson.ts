import { useEffect } from "react";
import { useBoundStore } from "@/stores";

export function useLesson(courseId: string, lessonId?: string) {
  const {
    courses,
    currentCourse,
    currentLesson,
    progress,
    loadCourses,
    startLesson,
    enroll,
    completeSlide,
    completeLesson,
    completedLessons,
    xp,
    streak,
    isLoading,
    error,
  } = useBoundStore((state) => ({
    courses: state.courses,
    currentCourse: state.currentCourse,
    currentLesson: state.currentLesson,
    progress: state.progress,
    loadCourses: state.loadCourses,
    startLesson: state.startLesson,
    enroll: state.enroll,
    completeSlide: state.completeSlide,
    completeLesson: state.completeLesson,
    completedLessons: state.completedLessons,
    xp: state.xp,
    streak: state.streak,
    isLoading: state.isLoading,
    error: state.error,
  }));

  useEffect(() => {
    if (!courses.length) {
      void loadCourses();
    }
  }, [courses.length, loadCourses]);

  useEffect(() => {
    if (!courseId) {
      return;
    }

    const courseMatches = currentCourse?.id === courseId;
    const lessonMatches = lessonId ? currentLesson?.id === lessonId : Boolean(currentLesson);

    if (!courseMatches || (lessonId && !lessonMatches)) {
      void startLesson(courseId, lessonId ?? "");
    }
  }, [courseId, lessonId, currentCourse?.id, currentLesson?.id, startLesson]);

  const courseProgress = progress[courseId];
  const totalLessons = currentCourse?.lessons.length ?? 0;
  const completedCount = courseProgress?.lessonProgress.filter((lp) => lp.completedAt).length ?? 0;
  const completionRatio = totalLessons > 0 ? completedCount / totalLessons : 0;

  return {
    courses,
    course: currentCourse,
    lesson: currentLesson,
    progress: courseProgress,
    completedLessons,
    completionRatio,
    xp,
    streak,
    isLoading,
    error,
    enroll,
    startLesson,
    completeSlide,
    completeLesson,
  };
}
