import { NextRequest, NextResponse } from "next/server";
import { courses } from "@/lib/data/courses";
import { bootstrapProgress, loadProgress } from "../../_progress-store";

interface RouteContext {
  params: {
    courseId: string;
  };
}

export async function GET(_req: NextRequest, context: RouteContext) {
  const course = courses.find((item) => item.id === context.params.courseId);
  if (!course) {
    return NextResponse.json({ message: "Course not found" }, { status: 404 });
  }

  const progress = loadProgress(course.id) ?? bootstrapProgress(course.id);
  return NextResponse.json({ progress });
}
