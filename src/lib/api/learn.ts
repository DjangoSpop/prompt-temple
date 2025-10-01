import { Course, CourseProgress } from "@/types/learning";

const basePath = "/api/learn";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function fetchCourses(): Promise<Course[]> {
  const response = await fetch(basePath, { cache: "no-store" });
  const data = await handleResponse<{ courses: Course[] }>(response);
  return data.courses;
}

export async function fetchCourse(courseId: string): Promise<{ course: Course; progress: CourseProgress | null }> {
  const response = await fetch(`${basePath}/${courseId}`, { cache: "no-store" });
  return handleResponse<{ course: Course; progress: CourseProgress | null }>(response);
}

export async function enrollInCourse(courseId: string): Promise<CourseProgress> {
  const response = await fetch(`${basePath}/${courseId}/enroll`, { method: "POST" });
  const data = await handleResponse<{ progress: CourseProgress }>(response);
  return data.progress;
}

export async function fetchProgress(courseId: string): Promise<CourseProgress> {
  const response = await fetch(`${basePath}/${courseId}/progress`, { cache: "no-store" });
  const data = await handleResponse<{ progress: CourseProgress }>(response);
  return data.progress;
}

export async function completeSlide(
  courseId: string,
  lessonId: string,
  slideId: string,
  completedAt?: string
): Promise<CourseProgress> {
  const response = await fetch(
    `${basePath}/${courseId}/lesson/${lessonId}/slide/${slideId}/complete`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completedAt }),
    }
  );
  const data = await handleResponse<{ progress: CourseProgress }>(response);
  return data.progress;
}

export async function completeLesson(
  courseId: string,
  lessonId: string,
  quizScore?: number
): Promise<CourseProgress> {
  const response = await fetch(`${basePath}/${courseId}/lesson/${lessonId}/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quizScore }),
  });
  const data = await handleResponse<{ progress: CourseProgress }>(response);
  return data.progress;
}
