import { Course, CourseProgress, Lesson } from "@/types/learning";

export interface CritiqueItem {
  id: string;
  category: "clarity" | "scope" | "risk" | "style" | "custom";
  message: string;
  recommendation: string;
}

export interface LearnerSlice {
  courses: Course[];
  currentCourse: Course | null;
  currentLesson: Lesson | null;
  progress: Record<string, CourseProgress>;
  completedLessons: string[];
  streak: number;
  xp: number;
  isLoading: boolean;
  error?: string;
  loadCourses: () => Promise<void>;
  enroll: (courseId: string) => Promise<void>;
  startLesson: (courseId: string, lessonId: string) => Promise<void>;
  completeSlide: (courseId: string, lessonId: string, slideId: string) => Promise<void>;
  completeLesson: (courseId: string, lessonId: string, quizScore?: number) => Promise<void>;
}

export interface OptimizerSlice {
  originalPrompt: string;
  revisedPrompt: string;
  critique: CritiqueItem[];
  scoreBefore?: number;
  scoreAfter?: number;
  isOptimizing: boolean;
  optimize: (input?: { mode: "fast" | "deep" }) => Promise<void>;
  setOriginalPrompt: (prompt: string) => void;
  resetOptimization: () => void;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  plan?: "free" | "pro" | "enterprise";
}

export interface UserSlice {
  user: UserProfile | null;
  isAuthenticating: boolean;
  setUser: (user: UserProfile | null) => void;
  logout: () => Promise<void>;
}

export type BoundState = LearnerSlice & OptimizerSlice & UserSlice;
