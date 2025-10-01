import { NextRequest, NextResponse } from "next/server";
import { courses } from "@/lib/data/courses";
import { bootstrapProgress } from "../../_progress-store";

interface RouteContext {
  params: {
    courseId: string;
  };
}

export async function POST(_req: NextRequest, context: RouteContext) {
  const course = courses.find((item) => item.id === context.params.courseId);
  if (!course) {
    return NextResponse.json({ message: "Course not found" }, { status: 404 });
  }

  const progress = bootstrapProgress(course.id);
  return NextResponse.json({ courseId: course.id, progress });
}
