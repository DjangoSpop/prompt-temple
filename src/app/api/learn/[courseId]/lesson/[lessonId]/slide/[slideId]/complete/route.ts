import { NextRequest, NextResponse } from "next/server";
import { courses } from "@/lib/data/courses";
import { upsertLessonProgress } from "../../../../../../_progress-store";

interface RouteContext {
  params: {
    courseId: string;
    lessonId: string;
    slideId: string;
  };
}

interface CompleteSlidePayload {
  completedAt?: string;
}

export async function POST(req: NextRequest, context: RouteContext) {
  const { courseId, lessonId, slideId } = context.params;
  const course = courses.find((item) => item.id === courseId);
  if (!course) {
    return NextResponse.json({ message: "Course not found" }, { status: 404 });
  }

  const lesson = course.lessons.find((item) => item.id === lessonId);
  if (!lesson) {
    return NextResponse.json({ message: "Lesson not found" }, { status: 404 });
  }

  const slide = lesson.slides.find((item) => item.id === slideId);
  if (!slide) {
    return NextResponse.json({ message: "Slide not found" }, { status: 404 });
  }

  const body = (await req.json().catch(() => null)) as CompleteSlidePayload | null;
  const progress = upsertLessonProgress(courseId, lessonId, {
    completedSlideIds: [slide.id],
    completedAt: body?.completedAt,
  });

  return NextResponse.json({ progress, lessonId, slideId });
}
