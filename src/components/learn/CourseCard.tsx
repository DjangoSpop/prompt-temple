"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card-unified";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Course } from "@/types/learning";

interface CourseCardProps {
  course: Course;
  completionRatio: number;
  onStart: () => void;
}

export function CourseCard({ course, completionRatio, onStart }: CourseCardProps) {
  return (
    <Card variant="temple" className="flex flex-col justify-between">
      <CardHeader className="gap-2">
        <CardTitle>{course.title}</CardTitle>
        <CardDescription>{course.summary}</CardDescription>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="uppercase tracking-wide">
            {course.difficulty}
          </Badge>
          <Badge variant="outline">{course.estimatedHours} hrs</Badge>
          {course.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Course completion</p>
          <div className="mt-2 flex items-center gap-3">
            <Progress value={completionRatio * 100} className="h-2 flex-1" />
            <span className="text-sm font-semibold text-primary">
              {Math.round(completionRatio * 100)}%
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <span>{course.lessons.length} lessons</span>
          <span>Certification at {Math.round(course.certificationCriteria.minLessonsCompletedRatio * 100)}%</span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button variant="secondary" asChild>
          <Link href={`/learn/${course.id}`}>View details</Link>
        </Button>
        <Button onClick={onStart}>Resume</Button>
      </CardFooter>
    </Card>
  );
}
