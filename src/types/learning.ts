export type SlideKind = 'concept' | 'demo' | 'exercise';

export interface NarrativeSlide {
  id: string;
  type: SlideKind;
  title: string;
  content: string;
  promptExample?: string;
  expectedOutcome?: string;
}

export interface QuizOption {
  id: string;
  label: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizSlide {
  id: string;
  type: 'quiz';
  title: string;
  question: string;
  content: string;
  options: QuizOption[];
  rationale: string;
}

export type Slide = NarrativeSlide | QuizSlide;

export interface Lesson {
  id: string;
  courseId: string;
  order: number;
  title: string;
  estimatedMinutes: number;
  outcomes: string[];
  slides: Slide[];
  quiz?: QuizSlide;
}

export interface Course {
  id: string;
  title: string;
  summary: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  heroImage?: string;
  estimatedHours: number;
  tags: string[];
  lessons: Lesson[];
  prerequisites?: string[];
  certificationCriteria: {
    minLessonsCompletedRatio: number;
    minQuizAverage: number;
  };
}

export interface LessonProgress {
  lessonId: string;
  completedSlideIds: string[];
  quizScore?: number;
  completedAt?: string;
}

export interface CourseProgress {
  courseId: string;
  lessonProgress: LessonProgress[];
  xpEarned: number;
  streak: number;
  updatedAt: string;
}

export interface CertificatePayload {
  id: string;
  userId: string;
  courseId: string;
  issuedAt: string;
  score: number;
  lessonsCompleted: number;
  totalLessons: number;
  metadataHash: string;
}

export interface EnrollmentRequest {
  courseId: string;
}

export interface CompleteSlideRequest {
  courseId: string;
  lessonId: string;
  slideId: string;
}

export interface CompleteLessonRequest {
  courseId: string;
  lessonId: string;
  quizScore?: number;
}

export interface WeeklyKpiSnapshot {
  wal: number;
  pqsMedianDelta: number;
  certificateCompletionRate: number;
  viralCoefficient: number;
  recordedAt: string;
}
