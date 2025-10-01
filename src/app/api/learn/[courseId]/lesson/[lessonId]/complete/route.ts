import { NextRequest, NextResponse } from "next/server";
import { courses } from "@/lib/data/courses";
import { upsertLessonProgress } from "../../../../_progress-store";

interface RouteContext {
  params: {
    courseId: string;
    lessonId: string;
  };
}

interface CompleteLessonPayload {
  quizScore?: number;
}

export async function POST(req: NextRequest, context: RouteContext) {
  const { courseId, lessonId } = context.params;
  const course = courses.find((item) => item.id === courseId);
  if (!course) {
    return NextResponse.json({ message: "Course not found" }, { status: 404 });
  }

  const lesson = course.lessons.find((item) => item.id === lessonId);
  if (!lesson) {
    return NextResponse.json({ message: "Lesson not found" }, { status: 404 });
  }

  const body = (await req.json().catch(() => null)) as CompleteLessonPayload | null;

  const progress = upsertLessonProgress(courseId, lessonId, {
    completedSlideIds: lesson.slides.map((slide) => slide.id),
    quizScore: body?.quizScore,
    completedAt: new Date().toISOString(),
  });

  return NextResponse.json({ progress, lessonId });
}
