import { StateCreator } from "zustand";
import {
  completeLesson as apiCompleteLesson,
  completeSlide as apiCompleteSlide,
  enrollInCourse,
  fetchCourse,
  fetchCourses,
  fetchProgress,
} from "@/lib/api/learn";
import type { Course, CourseProgress } from "@/types/learning";
import type { BoundState, LearnerSlice } from "./types";

function extractCompletedLessons(course: Course, progress: CourseProgress | null): string[] {
  if (!progress) {
    return [];
  }
  const completed = progress.lessonProgress.filter((lesson) => Boolean(lesson.completedAt));
  return completed.map((lesson) => lesson.lessonId);
}

function aggregateXp(progressMap: Record<string, CourseProgress>): number {
  return Object.values(progressMap).reduce((total, entry) => total + entry.xpEarned, 0);
}

function aggregateStreak(progressMap: Record<string, CourseProgress>): number {
  return Object.values(progressMap).reduce((total, entry) => total + entry.streak, 0);
}

export const createLearnerSlice: StateCreator<BoundState, [], [], LearnerSlice> = (set, get) => ({
  courses: [],
  currentCourse: null,
  currentLesson: null,
  progress: {},
  completedLessons: [],
  streak: 0,
  xp: 0,
  isLoading: false,
  error: undefined,

  async loadCourses() {
    set({ isLoading: true, error: undefined });
    try {
      const courses = await fetchCourses();
      set({ courses, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load courses", isLoading: false });
    }
  },

  async enroll(courseId) {
    set({ isLoading: true, error: undefined });
    try {
      const progress = await enrollInCourse(courseId);
      set((state) => {
        const mergedProgress = { ...state.progress, [courseId]: progress };
        const targetCourse = state.courses.find((item) => item.id === courseId) ?? state.currentCourse;
        return {
          progress: mergedProgress,
          xp: aggregateXp(mergedProgress),
          streak: aggregateStreak(mergedProgress),
          completedLessons: targetCourse ? extractCompletedLessons(targetCourse, progress) : state.completedLessons,
          isLoading: false,
        };
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to enroll in course", isLoading: false });
    }
  },

  async startLesson(courseId, lessonId) {
    set({ isLoading: true, error: undefined });
    try {
      const courseInStore = get().courses.find((item) => item.id === courseId);
      const { course, progress } = courseInStore
        ? { course: courseInStore, progress: get().progress[courseId] ?? null }
        : await fetchCourse(courseId);

      const pickedLesson = course.lessons.find((lesson) => lesson.id === lessonId) ?? course.lessons[0] ?? null;
      if (!pickedLesson) {
        throw new Error("Lesson not found");
      }

      let courseProgress = progress ?? get().progress[courseId];
      if (!courseProgress) {
        courseProgress = await fetchProgress(courseId);
      }

      set((state) => {
        const mergedProgress = courseProgress
          ? { ...state.progress, [courseId]: courseProgress }
          : state.progress;
        return {
          currentCourse: course,
          currentLesson: pickedLesson,
          progress: mergedProgress,
          xp: aggregateXp(mergedProgress),
          streak: aggregateStreak(mergedProgress),
          completedLessons: extractCompletedLessons(course, courseProgress ?? null),
          isLoading: false,
        };
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to start lesson", isLoading: false });
    }
  },

  async completeSlide(courseId, lessonId, slideId) {
    try {
      const progress = await apiCompleteSlide(courseId, lessonId, slideId, new Date().toISOString());
      const course = get().currentCourse ?? get().courses.find((item) => item.id === courseId) ?? null;
      set((state) => {
        const mergedProgress = { ...state.progress, [courseId]: progress };
        return {
          progress: mergedProgress,
          xp: aggregateXp(mergedProgress),
          streak: aggregateStreak(mergedProgress),
          completedLessons: course ? extractCompletedLessons(course, progress) : state.completedLessons,
        };
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to complete slide" });
    }
  },

  async completeLesson(courseId, lessonId, quizScore) {
    try {
      const progress = await apiCompleteLesson(courseId, lessonId, quizScore);
      const course = get().currentCourse ?? get().courses.find((item) => item.id === courseId) ?? null;
      const lesson = course?.lessons.find((item) => item.id === lessonId) ?? null;
      set((state) => {
        const mergedProgress = { ...state.progress, [courseId]: progress };
        return {
          progress: mergedProgress,
          xp: aggregateXp(mergedProgress),
          streak: aggregateStreak(mergedProgress),
          completedLessons: course ? extractCompletedLessons(course, progress) : state.completedLessons,
          currentLesson: lesson,
        };
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to complete lesson" });
    }
  },
});
